import assert from "node:assert/strict";
import test from "node:test";

import {
  RequestValidationError,
  STORAGE_KEY,
  appendRequest,
  createRequest,
  filterRequests,
  loadRequests,
  saveRequests,
} from "../src/request-store.js";

const validInput = {
  requester: "  Jordan Lee  ",
  department: "Operations",
  equipment: "  Laptop  ",
  neededBy: "2026-09-15",
  reason: "  Replace a failed field computer.  ",
  priority: "High",
};

class MemoryStorage {
  values = new Map();

  getItem(key) {
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    this.values.set(key, value);
  }
}

test("createRequest trims input and adds system fields", () => {
  const request = createRequest(validInput, {
    id: "request-1",
    now: new Date("2026-08-17T12:00:00.000Z"),
  });

  assert.deepEqual(request, {
    id: "request-1",
    requester: "Jordan Lee",
    department: "Operations",
    equipment: "Laptop",
    neededBy: "2026-09-15",
    reason: "Replace a failed field computer.",
    priority: "High",
    createdAt: "2026-08-17T12:00:00.000Z",
  });
});

test("createRequest reports missing required fields including priority", () => {
  assert.throws(
    () => createRequest({ ...validInput, requester: "", equipment: " ", priority: "" }),
    (error) => {
      assert.ok(error instanceof RequestValidationError);
      assert.deepEqual(Object.keys(error.errors), ["requester", "equipment", "priority"]);
      return true;
    },
  );
});

test("createRequest rejects priorities outside the allowed choices", () => {
  assert.throws(
    () => createRequest({ ...validInput, priority: "Urgent" }),
    (error) => {
      assert.ok(error instanceof RequestValidationError);
      assert.deepEqual(error.errors, { priority: "Select a priority." });
      return true;
    },
  );
});

test("appendRequest returns a new list with the newest request first", () => {
  const original = [{ id: "old" }];
  const result = appendRequest(original, { id: "new" });

  assert.deepEqual(result.map((request) => request.id), ["new", "old"]);
  assert.deepEqual(original.map((request) => request.id), ["old"]);
});

test("saveRequests and loadRequests round-trip valid records", () => {
  const storage = new MemoryStorage();
  const request = createRequest(validInput, {
    id: "request-2",
    now: new Date("2026-08-17T12:00:00.000Z"),
  });

  saveRequests([request], storage);

  assert.deepEqual(loadRequests(storage), [request]);
});

test("loadRequests safely handles damaged stored data", () => {
  const storage = new MemoryStorage();
  storage.setItem(STORAGE_KEY, "not-json");

  assert.deepEqual(loadRequests(storage), []);
});

test("loadRequests preserves older requests without priority and they filter as Medium", () => {
  const storage = new MemoryStorage();
  const { priority, ...olderRequest } = createRequest(validInput, {
    id: "request-3",
    now: new Date("2026-08-17T12:00:00.000Z"),
  });
  storage.setItem(STORAGE_KEY, JSON.stringify([olderRequest]));

  const loadedRequests = loadRequests(storage);

  assert.deepEqual(loadedRequests, [olderRequest]);
  assert.equal(Object.hasOwn(loadedRequests[0], "priority"), false);
  assert.deepEqual(filterRequests(loadedRequests, "Medium"), [olderRequest]);
});

test("saving a new request does not add priority to an older stored request", () => {
  const storage = new MemoryStorage();
  const { priority, ...olderRequest } = createRequest(validInput, {
    id: "request-legacy",
    now: new Date("2026-08-16T12:00:00.000Z"),
  });
  storage.setItem(STORAGE_KEY, JSON.stringify([olderRequest]));

  const newRequest = createRequest(validInput, {
    id: "request-new",
    now: new Date("2026-08-17T12:00:00.000Z"),
  });
  const requests = appendRequest(loadRequests(storage), newRequest);
  saveRequests(requests, storage);

  const storedRequests = JSON.parse(storage.getItem(STORAGE_KEY));
  assert.deepEqual(storedRequests[1], olderRequest);
  assert.equal(Object.hasOwn(storedRequests[1], "priority"), false);
  assert.equal(storedRequests[0].priority, "High");
});

test("filterRequests supports All and each individual priority", () => {
  const requests = [
    { id: "high", priority: "High" },
    { id: "medium", priority: "Medium" },
    { id: "low", priority: "Low" },
  ];

  assert.deepEqual(filterRequests(requests, "All"), requests);
  assert.deepEqual(filterRequests(requests, "Low"), [requests[2]]);
  assert.deepEqual(filterRequests(requests, "Medium"), [requests[1]]);
  assert.deepEqual(filterRequests(requests, "High"), [requests[0]]);
});

test("filterRequests preserves newest-first order and does not change requests", () => {
  const requests = [
    { id: "new-high", priority: "High" },
    { id: "new-medium", priority: "Medium" },
    { id: "old-high", priority: "High" },
  ];
  const original = structuredClone(requests);

  const result = filterRequests(requests, "High");

  assert.deepEqual(result.map((request) => request.id), ["new-high", "old-high"]);
  assert.deepEqual(requests, original);
  assert.notEqual(result, requests);
});

test("filterRequests treats older requests without priority as Medium", () => {
  const olderRequest = { id: "legacy" };

  assert.deepEqual(filterRequests([olderRequest], "Medium"), [olderRequest]);
  assert.deepEqual(filterRequests([olderRequest], "Low"), []);
});

test("filterRequests returns no matches for a priority with no requests", () => {
  assert.deepEqual(filterRequests([{ id: "low", priority: "Low" }], "High"), []);
});

test("filter remains active after adding a request and includes it when it matches", () => {
  const existing = [
    { id: "existing-high", priority: "High" },
    { id: "existing-low", priority: "Low" },
  ];
  const added = { id: "added-high", priority: "High" };
  const updated = appendRequest(existing, added);

  assert.deepEqual(filterRequests(updated, "High").map((request) => request.id), [
    "added-high",
    "existing-high",
  ]);
  assert.deepEqual(existing.map((request) => request.id), ["existing-high", "existing-low"]);
});
