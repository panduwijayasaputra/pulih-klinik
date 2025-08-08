# Product Requirements Document (PRD)

**Product Name:** Mental Health Clinic Management System  
**Version:** v1  
**Date:** 2025-08-08  
**Prepared by:** [Your Name / Team]

---

## 1. Overview

A web-based platform that enables clinics to manage clients, therapists, and therapy sessions—augmented by AI-powered tools to streamline mental health assessment, session planning, and therapy documentation.

---

## 2. User Roles

- **System Administrator (Admin):** Oversees system operations, user controls, payments, and limits.
- **Clinic Administrator (Clinic):** Manages clinic, therapist, and client data. Handles payments and sees reports.
- **Therapist:** Manages assigned clients and performs therapy sessions.

---

## 3. Core Features

### 3.1 Clinic Management

- **Clinic Profile:**
  - Name
  - Full Address
  - Phone
  - Working Hours
  - Logo
  - Description
  - Email
  - Website
- **Documents Upload:** For certifications or licenses.

### 3.2 Client Management

- Create client profile with personal information.
- View/update client details.
- Assign clients to therapists (respecting therapist’s max active client limit).
- View therapy session history and assessments.

### 3.3 Therapist Management

- Create therapist profile with:
  - Name
  - Email
  - Phone
  - WhatsApp
  - License Type & Number
  - Years of Experience
  - Specializations
  - Education
  - Certifications
  - Therapy Preferences
  - Max Active Clients
- View/update therapist profile.
- Assign clients to therapist based on availability.

### 3.4 Session Management

- Calendar view of all sessions.
- Click on calendar date to:
  - View session details
  - Assign unassigned clients to therapists (if therapist is available)
  - Reschedule session
- Session phases tracked in DB:
  - Pre-session assessment
  - Technique scoring
  - Script
  - Therapy session
  - Post-session assessment
  - Homework

### 3.5 AI-Powered Therapy Tools

- **Issue Detection Engine:**  
  Predict multiple mental health issues with scores based on client data and assessments.
- **Session Generator:**  
  Suggest sessions based on predicted issues and client profile.
- **Technique Scoring System:**  
  AI ranks hypnotherapy techniques for detected issues.
- **Script Generator:**  
  Generates hypnotherapy scripts from selected techniques.
- **Homework Generator:**  
  Recommends post-session exercises based on assessment results and applied techniques.

### 3.6 Insights & Reports

- Token usage history
- Session count per client
- Therapist performance
- Client issue trends

---

## 4. Registration Flows

### 4.1 Clinic Admin Registration

1. Access registration from landing page.
2. Fill in clinic and admin info.
3. System sends verification email.
4. Admin enters verification code.
5. Show registration summary + payment (Midtrans).
6. On payment success, redirect to login.

### 4.2 Therapist Registration

1. Created by Clinic Admin.
2. Therapist receives email with registration link.
3. Set new password.
4. On success, redirect to login.

---

## 5. Therapy Workflow

1. New client created.
2. Assign to available therapist.
3. Consultation Phase:
   - Initial Assessment
   - Interview
   - Observations
4. AI Generates:
   - Predicted mental health issues
   - Recommended number of sessions *(editable)*
5. System generates sessions.
6. Per Session:
   - Pre-session assessment *(except first session)*
   - Technique scoring
   - Script generation
   - Therapy session
   - Post-session assessment
   - Homework recommendation

---

## 6. Business Rules & Limits

- **Clinic Registration Fee:** IDR 100,000 (includes 3 session tokens)
- **Token System:**
  - 1 session = 1 token
  - Future token purchase: IDR 20,000/token
- **Therapist Limit:** Max 3 therapists per clinic
- **Client Limit:** Max 5 new clients per clinic per day
- **Client Assignment:** Only assign if therapist is under max active client cap

---

## 7. Backend Tracking / DB Notes

- All assessments (initial, pre-session, post-session) must be stored and linked to the client as therapy progress.
- AI outputs (issue predictions, scripts, homework) are saved per session and client.

---

## 8. Future Enhancements (Backlog)

- Token top-up system via Midtrans
- Therapist availability calendar & working hours
- AI feedback refinement loop based on session results
