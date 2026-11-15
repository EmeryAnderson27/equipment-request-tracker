---
name: requirements-reviewer
description: Compare a feature specification with its implementation and report acceptance coverage, gaps, unsupported behavior, risks, and needed tests. Use for requirements-to-code reviews; do not use for implementing the feature.
---

# Requirements Reviewer

Review a feature against its specification without changing files.

## Review process

1. Find and read the relevant feature specification and repository guidance. Identify the acceptance criteria and stated functional, data, security, and scope rules.
2. Inspect the implementation paths and relevant automated tests. Trace each criterion to the code or test that supports it; do not infer that behavior exists merely because it is described in comments or documentation.
3. Report findings in these categories:
   - **Satisfied acceptance criteria**: criteria supported by implementation evidence, with remaining test coverage noted.
   - **Gaps**: required behavior that is absent, incomplete, or contradicted by the implementation.
   - **Unsupported behavior**: behavior added by the implementation that the specification does not require or permit.
   - **Data or security concerns**: risks to existing data, validation, privacy, or safe handling of input, grounded in the relevant rules and code.
   - **Tests still needed**: acceptance criteria or important edge cases not covered by existing tests.
4. Cite evidence for each finding using repository-relative file paths and line numbers. Cite specification text and implementation or test code; keep quotes short and distinguish observed behavior from interpretation.
5. If a criterion cannot be evaluated from available files or the environment, identify the missing evidence rather than marking it satisfied.

## Boundaries

- This is a review-only skill. Do not edit, create, or delete files, and do not implement fixes unless the user separately asks for that work.
- Do not label unspecified behavior a defect. Explain when a concern is an inference or recommendation rather than a specification violation.
- Do not claim a test passed unless it was run and its result is available. Separate code inspection from test evidence.

## Report format

Start with a concise overall assessment. Then provide the five categories above. For acceptance coverage, identify criteria by number or short name and give a status (Satisfied, Partial, or Not satisfied) with evidence. For tests still needed, state which criterion or risk each test would verify.
