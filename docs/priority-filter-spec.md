# Exercise 6: Priority Filter

## Goal

Managers need a faster way to focus on equipment requests that need attention. The application will let managers filter the request list using the priority already stored with each request. The feature must continue to work locally, without a login or database, and preserve all existing requests.

## User behavior

- Provide a priority filter with four choices: **All**, **Low**, **Medium**, and **High**.
- Initially show all requests, with **All** selected.
- When a manager selects Low, Medium, or High, show only requests with that priority.
- When a manager selects All, show every request.
- If the selected priority has no matching requests, display: **“No requests match this priority.”**
- Keep the selected filter active when a new request is added, and update the displayed list to reflect the new request and current filter.
- Reset the filter to All after a page reload.

## Business and data rules

- Use each request's existing priority value; do not add a second priority field or alter a request's priority as part of filtering.
- Treat older requests without a saved priority as Medium when determining whether they match a filter.
- Filtering is a view of the existing local request list. It must not delete, rewrite, or otherwise change requests.
- Filtering must preserve the existing newest-first ordering of equipment requests. Filtering must not reorder requests.
- Continue storing and loading requests locally. The feature requires no login, database, or external service.

## Acceptance criteria

1. The filter exposes exactly All, Low, Medium, and High.
2. All is selected when the page first loads, and the list shows every saved request.
3. Selecting Low, Medium, or High updates the list to show only matching requests.
4. Selecting All restores the complete list.
5. A selected priority with no matching requests displays “No requests match this priority.”
6. Adding a request leaves the current filter selected and refreshes the list so the new request appears when it matches the filter.
7. Reloading the page resets the filter to All and shows all saved requests.
8. Requests without a saved priority are included in Medium results.
9. Requests remain in newest-first order when a priority filter is selected.
10. Changing the filter or adding a request does not change or remove existing request data.
11. Automated tests cover all four filter choices, empty results, filtering after adding a request, legacy requests without priority, and preservation of request data. Verify the behavior in a browser as well.

## Out of scope

- Filtering by multiple priorities at once.
- Saving the selected filter across page reloads.
- Adding authentication, a database, or external services.
- Editing, deleting, or reprioritizing requests as part of the filter feature.

## Verification Results

All 12 automated tests passed using `npm.cmd test`. The browser checks reported for this feature also passed.

| Acceptance criterion | Result | Verification method |
| --- | --- | --- |
| 1. The filter exposes exactly All, Low, Medium, and High. | Pass | Browser check confirmed all four choices. |
| 2. All is selected when the page first loads, and the list shows every saved request. | Pass | Browser check confirmed All is selected on initial load and all requests appear. |
| 3. Selecting Low, Medium, or High updates the list to show only matching requests. | Pass | Browser check confirmed High, Low, and Medium filters work. |
| 4. Selecting All restores the complete list. | Pass | Browser check confirmed the All filter works. |
| 5. A selected priority with no matching requests displays “No requests match this priority.” | Pass | Browser check confirmed the empty-results message appears correctly. |
| 6. Adding a request leaves the current filter selected and refreshes the list so the new request appears when it matches. | Pass | Browser check confirmed the selected filter remains active and the new matching request appears. |
| 7. Reloading the page resets the filter to All and shows all saved requests. | Pass | Browser check confirmed reload resets to All and preserves saved requests. |
| 8. Requests without a saved priority are included in Medium results. | Pass | Automated test `filterRequests treats older requests without priority as Medium` passed. |
| 9. Requests remain in newest-first order when a priority filter is selected. | Pass | Automated test `filterRequests preserves newest-first order and does not change requests` passed. |
| 10. Changing the filter or adding a request does not change or remove existing request data. | Pass | Automated tests confirmed filtering leaves the input requests unchanged and adding a request preserves existing requests; browser check confirmed saved requests remain after reload. |
| 11. Automated tests cover all four filter choices, empty results, filtering after adding a request, legacy requests without priority, and preservation of request data. Verify the behavior in a browser as well. | Pass | All 12 automated tests passed using `npm.cmd test`; browser checks confirmed the filter choices, empty state, adding a matching request, and reload behavior. |
