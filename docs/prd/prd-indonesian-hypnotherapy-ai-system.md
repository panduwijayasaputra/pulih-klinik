# Product Requirements Document: Indonesian Hypnotherapy AI System

## Introduction/Overview

The Indonesian Hypnotherapy AI System is a comprehensive web platform designed to revolutionize the workflow of licensed Indonesian hypnotherapists through a role-based management system. The system transforms the traditional 2-hour manual session planning process into a streamlined 15-minute AI-assisted workflow, while maintaining cultural appropriateness and professional standards.

**Problem Statement:** Indonesian hypnotherapists currently spend 2+ hours manually planning sessions, creating scripts, and adapting techniques to cultural contexts. This time-intensive process reduces their capacity to serve clients and increases operational costs. Additionally, clinics lack efficient systems for managing therapists and client assignments.

**Solution:** An AI-powered platform with role-based access control that enables clinic administrators to manage therapists and clients, while providing therapists with automated assessment analysis, technique recommendation, and script generation incorporating Indonesian cultural considerations.

## Goals

1. **Reduce Session Planning Time:** Decrease manual planning from 2 hours to 15 minutes per session
2. **Improve Client Outcomes:** Enhance therapeutic effectiveness through data-driven technique selection
3. **Increase Therapist Capacity:** Enable therapists to serve 30% more clients through workflow optimization
4. **Streamline Clinic Management:** Provide clinic admins with efficient tools for therapist and client management
5. **Maintain Cultural Sensitivity:** Ensure all recommendations and scripts are culturally appropriate for Indonesian clients
6. **Ensure Professional Standards:** Maintain therapist autonomy and decision-making authority
7. **Achieve High Adoption Rate:** Target 80% adoption rate among Indonesian clinics within 12 months

## Role-Based User Stories

### Primary User: Clinic Administrator

**US-001: Clinic Registration & Approval**
As a clinic administrator, I want to register my clinic for the system so that I can manage my clinic's therapists and clients through a centralized platform.

**US-002: Clinic Onboarding**
As a clinic administrator, I want to complete clinic setup including branding and properties so that my clinic has a professional presence in the system.

**US-003: Therapist Management**
As a clinic administrator, I want to create and manage therapist accounts so that I can assign qualified therapists to handle client sessions.

**US-004: Client Management**
As a clinic administrator, I want to add and manage client profiles with basic demographic information so that I can maintain organized client records and assign them to appropriate therapists.

**US-005: Client-Therapist Assignment**
As a clinic administrator, I want to assign clients to specific therapists so that workload is distributed appropriately and clients receive consistent care.

**US-006: Clinic Analytics**
As a clinic administrator, I want to view clinic-wide analytics and reports so that I can monitor performance and make informed management decisions.

### Secondary User: Licensed Indonesian Hypnotherapist

**US-007: Therapist Authentication**
As a licensed Indonesian hypnotherapist, I want to login with credentials provided by my clinic admin so that I can access the AI system securely and professionally.

**US-008: Assigned Client Management**
As a therapist, I want to view and manage my assigned client profiles so that I can maintain organized client records and track progress over time.

**US-009: Comprehensive Assessment**
As a therapist, I want to conduct detailed assessments (general, addiction, and minor) for my assigned clients so that I can gather comprehensive data for AI analysis and technique recommendations.

**US-010: AI-Powered Recommendations**
As a therapist, I want to receive AI-generated technique recommendations with cultural adaptations so that I can make informed decisions about session planning while maintaining professional autonomy.

**US-011: Script Generation**
As a therapist, I want to generate complete 7-phase session scripts in both PDF and digital formats so that I can have professional, ready-to-use materials for my sessions.

**US-012: Session Management**
As a therapist, I want to track session effectiveness and client progress so that I can measure outcomes and plan follow-up sessions effectively.

**US-013: Cultural Adaptation**
As a therapist, I want the system to automatically consider age, gender, and background factors so that my sessions are culturally appropriate and effective for Indonesian clients.

### System Administrator

**US-014: Clinic Approval Management**
As a system administrator, I want to review and approve clinic registration requests so that I can ensure only legitimate clinics access the system.

**US-015: System Monitoring**
As a system administrator, I want to monitor system-wide analytics and user activity so that I can maintain system performance and security.

**US-016: Subscription Management**
As a system administrator, I want to manage clinic subscription tiers and client limits so that I can control system usage and ensure fair resource allocation.

**US-017: Clinic Limits Management**
As a system administrator, I want to set and modify client limits for clinics based on their subscription tier so that I can enforce usage policies and encourage upgrades.

## Functional Requirements

### 1. Role-Based Authentication & User Management
1.1 The system must support three user roles: Administrator, Clinic Admin, and Therapist
1.2 The system must allow clinic administrators to register with clinic information
1.3 The system must require administrator approval for clinic registrations
1.4 The system must provide secure login/logout functionality with JWT tokens
1.5 The system must enforce role-based access control for all features
1.6 The system must allow clinic admins to create and manage therapist accounts
1.7 The system must enforce password security requirements

### 2. Subscription & Billing Management System
2.1 The system must support four subscription tiers: Beta, Alpha, Theta, and Delta
2.2 The system must enforce the following limits per subscription tier:
   - Beta: 1 therapist, 4 new clients/day, 10 script generations/day
   - Alpha: 3 therapists, 15 new clients/day, 50 script generations/day
   - Theta: 5 therapists, 30 new clients/day, 120 script generations/day
   - Delta: 10 therapists, 100 new clients/day, 500 script generations/day
2.3 The system must allow system administrators to define and modify client limits for each subscription tier
2.4 The system must enforce client limits based on clinic subscription status
2.5 The system must provide subscription upgrade/downgrade functionality
2.6 The system must track usage metrics against subscription limits
2.7 The system must notify clinic admins when approaching client limits
2.8 The system must allow system administrators to override limits for special cases
2.9 The system must support monthly billing cycles with Indonesian Rupiah pricing

### 3. Clinic Management System
3.1 The system must allow clinic admins to setup clinic properties and branding
3.2 The system must store clinic information including: name, address, contact details, and branding preferences
3.3 The system must provide clinic-specific customization options
3.4 The system must allow clinic admins to manage clinic settings and preferences
3.5 The system must provide clinic-wide analytics and reporting
3.6 The system must display current subscription tier and client usage limits
3.7 The system must prevent adding clients when limit is reached
3.8 The system must display current pricing and subscription details
3.9 The system must provide subscription upgrade/downgrade interface for clinic admins

### 4. Therapist Management System
4.1 The system must allow clinic admins to create therapist accounts with role assignment
4.2 The system must store therapist information including: name, email, specialization, and license number
4.3 The system must allow clinic admins to assign clients to specific therapists
4.4 The system must provide therapist performance tracking and analytics
4.5 The system must allow clinic admins to manage therapist status (active/inactive)
4.6 The system must enforce therapist count limits based on subscription tier
4.7 The system must prevent adding therapists when subscription limit is reached

### 5. Client Management System
5.1 The system must allow clinic admins to add new clients with required demographic information
5.2 The system must generate unique client codes (CLT001, CLT002, etc.)
5.3 The system must store client information including: full name, age, gender, occupation, education level, and contact details
5.4 The system must allow clinic admins to assign clients to specific therapists
5.5 The system must maintain client status (active, inactive, completed)
5.6 The system must provide a searchable client list with filtering options
5.7 The system must allow therapists to view only their assigned clients
5.8 The system must validate client count against subscription limits before adding new clients
5.9 The system must enforce daily client addition limits based on subscription tier

### 6. Assessment System (All Three Types)
6.1 The system must support three assessment types: General, Addiction, and Minor
6.2 The system must provide multi-step forms with progress tracking
6.3 The system must auto-save assessment progress to prevent data loss
6.4 The system must validate all required fields before submission
6.5 The system must calculate completion time for each assessment
6.6 The system must store assessment data in structured JSON format
6.7 The system must allow therapists to view assessment history for their assigned clients

### 7. AI Recommendation Engine
7.1 The system must analyze assessment data to identify primary mental health issues
7.2 The system must calculate technique compatibility scores (0-100) based on client data
7.3 The system must recommend three techniques: primary, supporting, and integration
7.4 The system must provide detailed reasoning for each recommendation in Indonesian
7.5 The system must require therapist approval for ALL recommendations regardless of confidence level
7.6 The system must adapt recommendations based on client age, gender, and background
7.7 The system must display confidence scores and cultural considerations for each technique

### 8. Script Generation System
8.1 The system must generate complete 7-phase session scripts (preparation, preinduction, induction, deepening, therapeutic, ego-strengthening, reorientation)
8.2 The system must create scripts in both PDF and digital formats
8.3 The system must include timing boxes for manual session tracking
8.4 The system must provide technique highlights and instructions within scripts
8.5 The system must include cultural notes and safety protocols
8.6 The system must allow therapists to preview and edit scripts before finalization
8.7 The system must generate scripts in formal Indonesian language
8.8 The system must enforce daily script generation limits based on subscription tier
8.9 The system must track script generation usage and display remaining daily quota

### 9. Session Management & Progress Tracking
9.1 The system must allow therapists to schedule and track sessions for their assigned clients
9.2 The system must provide effectiveness rating system (1-10 scale)
9.3 The system must track client progress across multiple sessions
9.4 The system must generate progress reports and analytics for both therapists and clinic admins
9.5 The system must allow therapists to plan follow-up sessions based on progress data

### 10. Cultural Adaptation System
10.1 The system must consider client age for technique and language appropriateness
10.2 The system must adapt recommendations based on client gender
10.3 The system must incorporate client background (occupation, education) into recommendations
10.4 The system must use appropriate Indonesian language formality based on client characteristics
10.5 The system must provide cultural notes and considerations in all recommendations

### 11. Data Security & Privacy
11.1 The system must encrypt all client data at rest and in transit
11.2 The system must comply with Indonesian data protection laws
11.3 The system must implement GDPR-level privacy controls
11.4 The system must provide secure data backup and recovery
11.5 The system must maintain audit logs for all data access and modifications
11.6 The system must allow clients to request data deletion
11.7 The system must implement role-based access controls
11.8 The system must ensure clinic data isolation and privacy

## Non-Goals (Out of Scope)

- **Direct Client Access:** Clients will not have direct access to the system
- **Video/Audio Sessions:** The system will not provide real-time video or audio session capabilities
- **Payment Processing:** The system will not handle billing or payment processing (subscription management only)
- **Third-party Integrations:** No integration with external EHR or scheduling systems
- **Mobile Applications:** No native mobile app development (desktop web only)
- **Multi-language Support:** Indonesian language only (no English or regional languages)
- **Automated Diagnosis:** The system will not provide medical diagnoses or replace professional judgment
- **Real-time AI Chat:** No conversational AI interface for direct therapist interaction
- **Multi-clinic Management:** System administrators will not manage multiple clinics from a single interface
- **Free Tier:** No free tier or trial period (all subscriptions are paid)
- **Pay-per-use:** No usage-based billing (monthly subscription only)

## Design Considerations

### User Interface Requirements
- Clean, professional interface suitable for mental health professionals
- Intuitive navigation with clear visual hierarchy
- Responsive design optimized for desktop use
- Accessibility compliance for users with disabilities
- Consistent color scheme and typography throughout the application
- Clinic-specific branding and customization options

### Cultural Design Elements
- Use of appropriate Indonesian cultural imagery and colors
- Formal language interface suitable for professional context
- Consideration of Indonesian work culture and communication styles
- Respectful representation of diverse Indonesian backgrounds

### Data Visualization
- Clear progress indicators for multi-step forms
- Visual representation of technique recommendations with confidence scores
- Progress tracking charts and analytics for client outcomes
- Intuitive dashboard with key metrics and recent activities
- Role-based dashboard views for different user types

## Technical Considerations

### Performance Requirements
- Page load times under 3 seconds for all major functions
- Assessment form auto-save within 30 seconds of inactivity
- AI recommendation generation within 10 seconds
- Script generation within 30 seconds
- Support for concurrent users without performance degradation

### Scalability Requirements
- Architecture must support 100+ clinics with 1000+ concurrent therapists
- Database must handle 10,000+ client records per clinic
- AI processing must scale with increased usage
- File storage must accommodate growing script and assessment data

### Security Requirements
- End-to-end encryption for all sensitive data
- Regular security audits and penetration testing
- Compliance with Indonesian cybersecurity regulations
- Secure API endpoints with rate limiting
- Regular security updates and patch management
- Role-based access control enforcement
- Clinic data isolation and privacy protection

## Success Metrics

### Primary Metrics
1. **Time Savings:** Achieve 85% reduction in session planning time (from 2 hours to 15 minutes)
2. **Clinic Adoption Rate:** Achieve 80% adoption rate among Indonesian clinics within 12 months
3. **Client Outcomes:** Measure 25% improvement in client satisfaction and therapeutic outcomes
4. **Therapist Capacity:** Enable therapists to serve 30% more clients through workflow optimization
5. **Subscription Management:** Achieve 90% compliance with subscription tier limits

### Secondary Metrics
1. **System Performance:** Maintain 99.9% uptime and sub-3-second response times
2. **Data Quality:** Achieve 95% accuracy in AI recommendations as validated by therapists
3. **Cultural Appropriateness:** Achieve 90% satisfaction rate for cultural adaptation features
4. **User Satisfaction:** Maintain 4.5+ star rating from clinic admins and therapists
5. **Clinic Management Efficiency:** Reduce clinic administrative overhead by 40%
6. **Subscription Conversion:** Achieve 25% upgrade rate from Basic to Professional/Enterprise tiers

### Measurement Methods
- Automated time tracking for session planning workflows
- User analytics and adoption tracking
- Client outcome surveys and progress assessments
- System performance monitoring and alerting
- Regular user feedback collection and analysis
- Clinic management efficiency metrics
- Subscription usage tracking and limit enforcement monitoring

## Open Questions

1. **Clinic Approval Process:** What specific criteria should be used for approving clinic registrations?
2. **Data Retention Policy:** How long should client data be retained after therapy completion?
3. **Backup Frequency:** What is the required frequency for data backups and disaster recovery testing?
4. **Support Hours:** What are the required support hours and response times for technical issues?
5. **Training Requirements:** What level of training and documentation is needed for clinic admin and therapist onboarding?
6. **Compliance Audits:** How frequently should compliance audits be conducted for data protection?
7. **Feature Prioritization:** Which features should be prioritized for the initial MVP release?
8. **Integration Future:** What external systems might need integration in future phases?
9. **Clinic Size Limits:** Should there be limits on the number of therapists or clients per clinic?
10. **Subscription Tier Pricing:** What should be the pricing structure for different subscription tiers?
11. **Limit Enforcement:** How strictly should client limits be enforced, and what exceptions should be allowed?
12. **Pricing Strategy:** Should there be annual discounts or promotional pricing for new clinics?
13. **Usage Monitoring:** How frequently should usage metrics be updated and displayed to clinic admins?

## Pricing Structure

### Subscription Tiers

The system offers four subscription tiers designed to accommodate clinics of different sizes and needs:

#### Beta Plan - Rp 50,000/month
**Target:** Small practices and individual therapists
- **Therapists:** 1
- **New Clients:** 4 per day
- **Script Generations:** 10 per day
- **Features:** Basic AI assessment, script generation, email support
- **Best For:** Solo practitioners and small clinics starting with AI-assisted therapy

#### Alpha Plan - Rp 100,000/month
**Target:** Growing clinics and medium-sized practices
- **Therapists:** 3
- **New Clients:** 15 per day
- **Script Generations:** 50 per day
- **Features:** Advanced analytics, priority support, all Alpha features
- **Best For:** Established clinics with multiple therapists

#### Theta Plan - Rp 150,000/month
**Target:** Expanding clinics with high client volume
- **Therapists:** 5
- **New Clients:** 30 per day
- **Script Generations:** 120 per day
- **Features:** API integration, phone support, all Alpha features
- **Best For:** Busy clinics requiring integration capabilities

#### Delta Plan - Rp 200,000/month
**Target:** Large clinics and therapy centers
- **Therapists:** 10
- **New Clients:** 100 per day
- **Script Generations:** 500 per day
- **Features:** Enterprise analytics, dedicated support, custom branding, all Theta features
- **Best For:** Large therapy centers and multi-location clinics

### Pricing Principles
- **Monthly Billing:** All subscriptions are billed monthly in Indonesian Rupiah
- **No Hidden Fees:** Transparent pricing with no additional charges
- **Scalable Limits:** Clear daily and monthly usage limits per tier
- **Upgrade Flexibility:** Easy upgrade/downgrade between tiers
- **No Long-term Contracts:** Month-to-month billing with cancellation flexibility

### Billing & Payment
- **Currency:** Indonesian Rupiah (IDR)
- **Billing Cycle:** Monthly
- **Payment Methods:** Bank transfer, digital wallets (to be determined)
- **Invoicing:** Automated monthly invoices
- **Tax Compliance:** Includes applicable Indonesian taxes

### Usage Limits & Enforcement

#### Daily Limits
- **Client Addition:** Limits reset daily at 00:00 WIB (Western Indonesian Time)
- **Script Generation:** Limits reset daily at 00:00 WIB
- **Therapist Accounts:** Static limit based on subscription tier

#### Limit Enforcement
- **Real-time Validation:** System prevents exceeding daily limits
- **Usage Tracking:** Real-time dashboard showing current usage
- **Warning Notifications:** Alerts at 80% and 95% usage thresholds
- **Grace Period:** 24-hour grace period for limit overages
- **Administrator Override:** System administrators can override limits for special cases

#### Usage Monitoring
- **Dashboard Display:** Real-time usage metrics in clinic admin dashboard
- **Reporting:** Daily, weekly, and monthly usage reports
- **Analytics:** Usage trends and pattern analysis
- **Notifications:** Email alerts for approaching limits
- **Upgrade Prompts:** Suggestions for plan upgrades when limits are consistently reached

## Implementation Phases
- Role-based authentication and user management
- Clinic registration and approval system
- Basic clinic and therapist management
- Core database structure and API
- Subscription tier management system with pricing tiers (Beta, Alpha, Theta, Delta)

### Phase 2: Clinic Management (Weeks 5-8)
- Clinic onboarding and property setup
- Therapist account creation and management
- Client management and assignment system
- Clinic analytics and reporting
- Subscription limit enforcement and usage tracking
- Pricing display and subscription management interface

### Phase 3: Assessment System (Weeks 9-12)
- All three assessment types (General, Addiction, Minor)
- Form validation and data storage
- Assessment history and management
- Role-based access to assessments

### Phase 4: AI Engine (Weeks 13-16)
- Recommendation algorithm implementation
- Cultural adaptation logic
- Confidence scoring system

### Phase 5: Script Generation (Weeks 17-20)
- 7-phase script generation
- PDF and digital format output
- Script preview and editing capabilities

### Phase 6: Analytics & Polish (Weeks 21-24)
- Progress tracking and analytics
- Performance optimization
- Security hardening and compliance validation
- Role-based dashboard optimization

This PRD provides a comprehensive roadmap for developing the Indonesian Hypnotherapy AI System with role-based access control, ensuring it meets the specific needs of Indonesian clinics and therapists while maintaining professional standards and cultural sensitivity. 