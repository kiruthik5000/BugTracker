# Backend Suggested Changes

The following changes are **recommended** for the backend to improve consistency and functionality. No backend modifications were made during this frontend refinement.

---

## 1. Register Endpoint — Return `userId`

The `POST /api/auth/register` endpoint currently returns the created user but does not include `userId` in the same format as the login response. This would allow the frontend to log users in immediately after registration.

**File:** `AuthController.java`  
**Suggestion:** Return `userId` and JWT token in the register response, matching the login format.

---

## 2. Bug Status Change — Allow ADMIN Role

`PUT /api/bugs/{id}/status` currently only allows `DEVELOPER` and `PROJECT_MANAGER` roles. Admins should also be able to change bug status.

**File:** `BugController.java`  
**Suggestion:** Update `@PreAuthorize` from `hasAnyRole('DEVELOPER', 'PROJECT_MANAGER')` to `hasAnyRole('DEVELOPER', 'PROJECT_MANAGER', 'ADMIN')`.

---

## 3. Project-Filtered Bugs Endpoint

Currently, there's no API to fetch bugs by project. Adding `GET /api/bugs/project/{projectId}` would support project-specific bug views in the future.

**File:** `BugController.java`  
**Suggestion:** Add a new endpoint that filters bugs by `projectId`.
