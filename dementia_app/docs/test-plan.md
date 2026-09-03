# MemorySaathi – Prototype Test Plan

## 1. Purpose

This document defines the practical test plan for the current MemorySaathi
working prototype.

The purpose is to verify that the core functionality works correctly before
adding advanced features.

The tests cover:

- Patient CRUD
- Medication CRUD
- Reminders
- Authentication
- Caregiver dashboard workflow
- Emergency assistance workflow
- Invalid input
- Missing patient references
- Database failure
- Frontend/backend communication

This is a simple manual/API test plan for the SIH prototype. No large
enterprise testing framework is required.

---

## 2. Test Environment

| Item | Value |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Java + Spring Boot |
| Database | MySQL |
| Database name | dementia_app |
| API | REST |
| Backend port | 8080 |
| Browser | Chrome or another modern browser |
| Authentication | HTTP session |
| Password storage | BCrypt hash |

Before testing:

1. Start MySQL.
2. Ensure the `dementia_app` database exists.
3. Apply the required database schema and migrations.
4. Configure `DB_USERNAME` and `DB_PASSWORD`.
5. Start the Spring Boot backend.
6. Open the frontend.
7. Ensure the demo caregiver and demo patient exist.

---

# 3. Test Result Convention

For every test:

- **PASS** – actual result matches the expected result.
- **FAIL** – actual result does not match the expected result.
- **BLOCKED** – test cannot be executed because of an environment/setup issue.

The **Actual Result** and **Pass/Fail** columns should be filled while
executing the tests.

---

# 4. Patient CRUD Tests

## TC-PAT-001 – Create Patient

**Test ID:** TC-PAT-001

**Input/Action:**
- Login as caregiver.
- Send `POST /api/patients`.
- Use valid patient data:
  - name: Test Patient
  - dateOfBirth: valid date
  - phone: valid phone
  - address: Test Address
  - caregiverId: valid caregiver ID

**Expected Result:**
- HTTP `201 Created`.
- Patient is returned with a generated ID.
- Patient is stored in MySQL.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-PAT-002 – Retrieve All Patients

**Test ID:** TC-PAT-002

**Input/Action:**
- Send `GET /api/patients`.

**Expected Result:**
- HTTP `200 OK`.
- Patient list is returned.
- Previously created patient is present.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-PAT-003 – Retrieve Patient by ID

**Test ID:** TC-PAT-003

**Input/Action:**
- Send `GET /api/patients/{validPatientId}`.

**Expected Result:**
- HTTP `200 OK`.
- Correct patient information is returned.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-PAT-004 – Update Patient

**Test ID:** TC-PAT-004

**Input/Action:**
- Send `PUT /api/patients/{validPatientId}`.
- Change the patient's name or address.

**Expected Result:**
- HTTP `200 OK`.
- Updated information is returned.
- Database contains the updated information.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-PAT-005 – Delete Patient

**Test ID:** TC-PAT-005

**Input/Action:**
- Send `DELETE /api/patients/{validPatientId}`.

**Expected Result:**
- HTTP `204 No Content`.
- Patient is removed from the database.
- Subsequent retrieval returns not found.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

# 5. Medication CRUD Tests

## TC-MED-001 – Create Medication

**Test ID:** TC-MED-001

**Input/Action:**
- Use an existing valid patient ID.
- Send `POST /api/medications`.
- Enter valid medication information.

**Expected Result:**
- HTTP `201 Created`.
- Medication is stored against the correct patient.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-MED-002 – Retrieve Medications

**Test ID:** TC-MED-002

**Input/Action:**
- Send `GET /api/medications`.

**Expected Result:**
- HTTP `200 OK`.
- Medication list is returned.
- Created medication is present.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-MED-003 – Retrieve Medication by ID

**Test ID:** TC-MED-003

**Input/Action:**
- Send `GET /api/medications/{validMedicationId}`.

**Expected Result:**
- HTTP `200 OK`.
- Correct medication is returned.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-MED-004 – Update Medication

**Test ID:** TC-MED-004

**Input/Action:**
- Send `PUT /api/medications/{validMedicationId}`.
- Change dosage/frequency/instructions.

**Expected Result:**
- HTTP `200 OK`.
- Updated medication is returned.
- Database contains the updated values.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-MED-005 – Delete Medication

**Test ID:** TC-MED-005

**Input/Action:**
- Send `DELETE /api/medications/{validMedicationId}`.

**Expected Result:**
- HTTP `204 No Content`.
- Medication no longer exists.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

# 6. Reminder Tests

## TC-REM-001 – Create Reminder

**Test ID:** TC-REM-001

**Input/Action:**
- Use a valid patient ID.
- Create a reminder with:
  - title
  - description
  - reminder time
  - supported category
  - status

**Expected Result:**
- HTTP `201 Created`.
- Reminder is stored in MySQL.
- Correct patient association is maintained.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-REM-002 – Retrieve Reminders

**Test ID:** TC-REM-002

**Input/Action:**
- Send `GET /api/reminders`.

**Expected Result:**
- HTTP `200 OK`.
- Existing reminders are displayed.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-REM-003 – Retrieve Reminder by ID

**Test ID:** TC-REM-003

**Input/Action:**
- Send `GET /api/reminders/{validReminderId}`.

**Expected Result:**
- HTTP `200 OK`.
- Correct reminder is returned.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-REM-004 – Update Reminder

**Test ID:** TC-REM-004

**Input/Action:**
- Send `PUT /api/reminders/{validReminderId}`.
- Change the reminder description/time/status.

**Expected Result:**
- HTTP `200 OK`.
- Updated reminder is returned.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-REM-005 – Delete Reminder

**Test ID:** TC-REM-005

**Input/Action:**
- Send `DELETE /api/reminders/{validReminderId}`.

**Expected Result:**
- HTTP `204 No Content`.
- Reminder is removed.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-REM-006 – Invalid Reminder Category

**Test ID:** TC-REM-006

**Input/Action:**
- Create a reminder using a category that is not supported.

Example:

`category = "Unknown Category"`

**Expected Result:**
- Request is rejected.
- No invalid reminder is inserted into the database.
- Appropriate client error is returned.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

# 7. Authentication Tests

## TC-AUTH-001 – Valid Login

**Test ID:** TC-AUTH-001

**Input/Action:**
- Open `login.html`.
- Enter the valid demo caregiver username/email and password.

**Expected Result:**
- Login succeeds.
- HTTP session is created.
- User is redirected to the caregiver dashboard.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-AUTH-002 – Invalid Password

**Test ID:** TC-AUTH-002

**Input/Action:**
- Enter a valid username/email.
- Enter an incorrect password.

**Expected Result:**
- Login is rejected.
- User is not logged into the dashboard.
- No authenticated session is created.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-AUTH-003 – Invalid Username

**Test ID:** TC-AUTH-003

**Input/Action:**
- Enter a username/email that does not exist.
- Enter any password.

**Expected Result:**
- Login is rejected.
- Appropriate authentication error is displayed.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-AUTH-004 – Protected Route Without Login

**Test ID:** TC-AUTH-004

**Input/Action:**
- Log out.
- Request:

`GET /api/caregiver/profile`

**Expected Result:**
- HTTP `401 Unauthorized`.
- Protected caregiver information is not returned.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-AUTH-005 – Logout

**Test ID:** TC-AUTH-005

**Input/Action:**
- Login successfully.
- Click Logout.

**Expected Result:**
- Session is invalidated.
- User is redirected to the login page.
- Protected caregiver route cannot be accessed afterward.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

# 8. Caregiver Dashboard Tests

## TC-CAR-001 – Dashboard Loads

**Test ID:** TC-CAR-001

**Input/Action:**
- Login successfully.
- Open the caregiver dashboard.

**Expected Result:**
- Dashboard loads without a JavaScript error.
- Patient information is displayed.
- Medication information is displayed.
- Reminder information is displayed.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-CAR-002 – Dashboard Uses Backend Data

**Test ID:** TC-CAR-002

**Input/Action:**
- Change an existing patient's information through the backend.
- Refresh the caregiver dashboard.

**Expected Result:**
- Dashboard displays the updated backend data.
- No stale hardcoded patient data replaces the database result.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-CAR-003 – Unauthenticated Dashboard Access

**Test ID:** TC-CAR-003

**Input/Action:**
- Log out.
- Open `index.html` directly.

**Expected Result:**
- Authentication check fails.
- User is redirected to `login.html`.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

# 9. Emergency Workflow Tests

## TC-EMG-001 – Trigger Emergency Event

**Test ID:** TC-EMG-001

**Input/Action:**
- Login as caregiver.
- Open Emergency Assistance.
- Select/confirm the emergency action.

**Expected Result:**
- Emergency event is created.
- HTTP `201 Created`.
- Event contains:
  - patient ID
  - timestamp
  - status
  - description.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-EMG-002 – Caregiver Sees Emergency Event

**Test ID:** TC-EMG-002

**Input/Action:**
- Trigger an emergency event.
- Refresh/reload the emergency section.

**Expected Result:**
- Newly created event appears in Recent Emergency Events.
- Correct event description and timestamp are displayed.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-EMG-003 – Emergency Contact Configuration

**Test ID:** TC-EMG-003

**Input/Action:**
- Open Emergency Assistance.
- Check the configured emergency contact.

**Expected Result:**
- Configured application data is displayed.
- If no contact is configured, the UI clearly states that the contact is
  not configured.
- No invented emergency number is displayed.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-EMG-004 – Emergency Without Authentication

**Test ID:** TC-EMG-004

**Input/Action:**
- Log out.
- Attempt to create an emergency event through the API.

**Expected Result:**
- HTTP `401 Unauthorized`.
- Event is not created.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

# 10. Invalid Input Tests

## TC-INV-001 – Empty Patient Name

**Test ID:** TC-INV-001

**Input/Action:**
- Attempt to create a patient without a required name.

**Expected Result:**
- Request is rejected.
- Invalid patient is not inserted.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-INV-002 – Invalid Patient ID

**Test ID:** TC-INV-002

**Input/Action:**
- Request a patient using an invalid/non-positive ID.

Example:

`GET /api/patients/-1`

**Expected Result:**
- Request is rejected with a client error.
- Application does not crash.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-INV-003 – Missing Required Medication Data

**Test ID:** TC-INV-003

**Input/Action:**
- Attempt to create a medication without a required field such as name.

**Expected Result:**
- Request is rejected.
- No incomplete medication is inserted.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-INV-004 – Missing Reminder Description

**Test ID:** TC-INV-004

**Input/Action:**
- Attempt to create an emergency event without a description.

**Expected Result:**
- Request is rejected because the description is required.
- No emergency event is created.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

# 11. Missing Patient Tests

## TC-PATREF-001 – Medication With Missing Patient

**Test ID:** TC-PATREF-001

**Input/Action:**
- Attempt to create a medication using a patient ID that does not exist.

Example:

`patientId = 999999`

**Expected Result:**
- Request is rejected.
- Clear patient-reference error is returned.
- Medication is not inserted.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-PATREF-002 – Reminder With Missing Patient

**Test ID:** TC-PATREF-002

**Input/Action:**
- Attempt to create a reminder using a non-existent patient ID.

**Expected Result:**
- Request is rejected.
- Reminder is not inserted.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-PATREF-003 – Emergency Event With Missing Patient

**Test ID:** TC-PATREF-003

**Input/Action:**
- Attempt to create an emergency event using a non-existent patient ID.

**Expected Result:**
- Request is rejected.
- No emergency event is inserted.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

# 12. Database Failure Tests

## TC-DB-001 – Backend With Database Unavailable

**Test ID:** TC-DB-001

**Input/Action:**
- Stop MySQL.
- Start/restart the Spring Boot application.

**Expected Result:**
- Application reports a datasource/database connection failure.
- The failure is visible in backend logs.
- Application does not silently report fake database data.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-DB-002 – Database Failure During Request

**Test ID:** TC-DB-002

**Input/Action:**
- Start the backend and verify it is working.
- Make MySQL unavailable.
- Attempt a patient/reminder request.

**Expected Result:**
- Request fails.
- Backend logs show a database-related error.
- Application does not return fabricated records.

**Actual Result:** ______________________________

**Pass/Fail:** __________

**Recovery Action:**
- Restart MySQL.
- Restart/recover the backend if necessary.
- Verify that normal requests work again.

---

# 13. Frontend/Backend Communication Tests

## TC-COM-001 – Frontend Loads Backend Patient Data

**Test ID:** TC-COM-001

**Input/Action:**
- Start Spring Boot.
- Start/open the frontend.
- Login.
- Open dashboard.

**Expected Result:**
- Browser successfully communicates with the backend.
- Patient data appears from the REST API.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-COM-002 – Frontend Loads Medication Data

**Test ID:** TC-COM-002

**Input/Action:**
- Open the caregiver dashboard.

**Expected Result:**
- Medication data returned by the backend is displayed.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-COM-003 – Frontend Loads Reminder Data

**Test ID:** TC-COM-003

**Input/Action:**
- Open the caregiver dashboard.

**Expected Result:**
- Reminder data returned by the backend is displayed.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-COM-004 – Frontend Handles Backend Error

**Test ID:** TC-COM-004

**Input/Action:**
- Stop the backend.
- Refresh the frontend/dashboard.

**Expected Result:**
- Frontend does not silently display successful fake data.
- An understandable error/loading state is displayed or logged.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

## TC-COM-005 – Authentication Session Communication

**Test ID:** TC-COM-005

**Input/Action:**
- Login successfully.
- Access the protected caregiver route from the frontend.

**Expected Result:**
- Browser sends the authenticated session.
- Backend recognizes the caregiver session.
- Caregiver information is returned.

**Actual Result:** ______________________________

**Pass/Fail:** __________

---

# 14. Critical Happy-Path Gate

The following tests are mandatory before moving to advanced features.

| Test ID | Critical Test | Pass/Fail |
|---|---|---|
| TC-PAT-001 | Create patient | ______ |
| TC-PAT-002 | Retrieve patient data | ______ |
| TC-PAT-004 | Update patient | ______ |
| TC-PAT-005 | Delete patient | ______ |
| TC-MED-001 | Create medication | ______ |
| TC-MED-002 | Retrieve medication | ______ |
| TC-MED-004 | Update medication | ______ |
| TC-MED-005 | Delete medication | ______ |
| TC-REM-001 | Create reminder | ______ |
| TC-REM-002 | Retrieve reminders | ______ |
| TC-REM-004 | Update reminder | ______ |
| TC-REM-005 | Delete reminder | ______ |
| TC-AUTH-001 | Valid login | ______ |
| TC-AUTH-005 | Logout | ______ |
| TC-CAR-001 | Caregiver dashboard | ______ |
| TC-EMG-001 | Trigger emergency event | ______ |
| TC-EMG-002 | Caregiver sees emergency event | ______ |
| TC-COM-001 | Frontend/backend communication | ______ |

### Gate Rule

All critical happy-path tests must be **PASS** before implementing advanced
features.

If any critical test fails:

1. Stop adding advanced functionality.
2. Identify the failing component.
3. Fix the existing implementation.
4. Repeat the failed test.
5. Re-run the affected critical tests.
6. Continue only after the critical path is working.

---

# 15. Final Prototype Test Summary

**Date Tested:** __________________

**Tester:** __________________

**Backend Version/Commit:** __________________

**Database Version:** __________________

**Critical Happy-Path Tests Passed:** ______ / 18

**Critical Happy-Path Tests Failed:** ______ / 18

**Overall Prototype Status:**

- [ ] Ready for advanced features
- [ ] Needs bug fixes
- [ ] Blocked by environment/setup issue

## Major Issues Found

1. ______________________________________________

2. ______________________________________________

3. ______________________________________________

## Final Notes

The prototype is considered ready for advanced features only after the
critical patient, medication, reminder, authentication, caregiver,
emergency, and frontend/backend communication workflows pass.