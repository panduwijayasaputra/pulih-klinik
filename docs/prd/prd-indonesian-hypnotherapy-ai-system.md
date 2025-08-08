# Product Requirements Document: Indonesian Hypnotherapy AI System

## Introduction/Overview

The Indonesian Hypnotherapy AI System is a comprehensive web platform designed to revolutionize the workflow of licensed Indonesian hypnotherapists through a role-based management system. The system transforms the traditional 2-hour manual session planning process into a streamlined 15-minute AI-assisted workflow, while maintaining cultural appropriateness and professional standards.

**Problem Statement:** Indonesian hypnotherapists currently spend 2+ hours manually planning sessions, creating scripts, and adapting techniques to cultural contexts. This time-intensive process reduces their capacity to serve clients and increases operational costs. Additionally, clinics lack efficient systems for managing therapists and client assignments.

**Solution:** An AI-powered platform with role-based access control that enables clinic administrators to manage therapists and clients, while providing therapists with automated assessment analysis, technique recommendation, and script generation incorporating Indonesian cultural considerations. The system uses a token-based payment model where each therapy session consumes one token.

## Goals

1. **Reduce Session Planning Time:** Decrease manual planning from 2 hours to 15 minutes per session
2. **Improve Client Outcomes:** Enhance therapeutic effectiveness through data-driven technique selection
3. **Increase Therapist Capacity:** Enable therapists to serve 30% more clients through workflow optimization
4. **Streamline Clinic Management:** Provide clinic admins with efficient tools for therapist and client management
5. **Maintain Cultural Sensitivity:** Ensure all recommendations and scripts are culturally appropriate for Indonesian clients
6. **Ensure Professional Standards:** Maintain therapist autonomy and decision-making authority
7. **Achieve High Adoption Rate:** Target 80% adoption rate among Indonesian clinics within 12 months
8. **Implement Token-Based Billing:** Provide flexible pay-per-session billing model using tokens

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

**US-007: Token Management**
As a clinic administrator, I want to purchase and manage tokens for my clinic so that therapists can conduct therapy sessions using the AI system.

### Secondary User: Licensed Indonesian Hypnotherapist

**US-008: Therapist Authentication**
As a licensed Indonesian hypnotherapist, I want to login with credentials provided by my clinic admin so that I can access the AI system securely and professionally.

**US-009: Assigned Client Management**
As a therapist, I want to view and manage my assigned client profiles so that I can maintain organized client records and track progress over time.

**US-010: Pre-Session Assessment**
As a therapist, I want to conduct pre-session assessments for my clients so that I can gather current mental health status and track changes from previous sessions.

**US-011: Mental Health Issue Detection**
As a therapist, I want to identify and update mental health issues based on direct assessment interviews so that I can provide accurate treatment planning.

**US-012: Technique Selection**
As a therapist, I want to view all 67 hypnotherapy techniques ordered by compatibility percentage so that I can select up to 3 techniques for script generation.

**US-013: Script Generation**
As a therapist, I want to generate complete session scripts based on assessment data and selected techniques so that I can have professional, ready-to-use materials for my sessions.

**US-014: Final Session Assessment**
As a therapist, I want to conduct final session assessments to track therapy progress compared to pre-session assessments so that I can measure treatment effectiveness.

**US-015: Homework Recommendations**
As a therapist, I want to receive AI-generated homework recommendations based on assessment data and session content so that I can provide clients with effective between-session activities.

**US-016: Cultural Adaptation**
As a therapist, I want the system to automatically consider age, gender, and background factors so that my sessions are culturally appropriate and effective for Indonesian clients.

### System Administrator

**US-017: Clinic Approval Management**
As a system administrator, I want to review and approve clinic registration requests so that I can ensure only legitimate clinics access the system.

**US-018: System Monitoring**
As a system administrator, I want to monitor system-wide analytics and user activity so that I can maintain system performance and security.

**US-019: Token Management**
As a system administrator, I want to manage token sales and distribution so that I can control system usage and ensure fair resource allocation.

**US-020: Pricing Management**
As a system administrator, I want to set and modify token pricing so that I can maintain sustainable business operations.

## Functional Requirements

### 1. Role-Based Authentication & User Management
1.1 The system must support three user roles: Administrator, Clinic Admin, and Therapist
1.2 The system must allow clinic administrators to register with clinic information
1.3 The system must require administrator approval for clinic registrations
1.4 The system must provide secure login/logout functionality with JWT tokens
1.5 The system must enforce role-based access control for all features
1.6 The system must allow clinic admins to create and manage therapist accounts
1.7 The system must enforce password security requirements

### 2. Token-Based Payment System
2.1 The system must implement a token-based payment model where each therapy session consumes one token
2.2 The system must allow clinic administrators to purchase tokens in bulk packages
2.3 The system must provide token balance tracking for each clinic
2.4 The system must prevent session initiation when token balance is insufficient
2.5 The system must display current token balance and usage history
2.6 The system must provide token purchase interface with multiple payment options
2.7 The system must support Indonesian Rupiah pricing for token packages
2.8 The system must generate invoices for token purchases
2.9 The system must allow system administrators to manage token pricing and packages
2.10 The system must provide token usage analytics and reporting

### 3. Clinic Management System
3.1 The system must allow clinic admins to setup clinic properties and branding
3.2 The system must store clinic information including: name, address, contact details, and branding preferences
3.3 The system must provide clinic-specific customization options
3.4 The system must allow clinic admins to manage clinic settings and preferences
3.5 The system must provide clinic-wide analytics and reporting
3.6 The system must display current token balance and usage statistics
3.7 The system must provide token purchase and management interface
3.8 The system must display current pricing and token package options
3.9 The system must provide usage analytics and cost tracking

### 4. Therapist Management System
4.1 The system must allow clinic admins to create therapist accounts with role assignment
4.2 The system must store therapist information including: name, email, specialization, and license number
4.3 The system must allow clinic admins to assign clients to specific therapists
4.4 The system must provide therapist performance tracking and analytics
4.5 The system must allow clinic admins to manage therapist status (active/inactive)
4.6 The system must track token usage per therapist for cost allocation
4.7 The system must provide therapist-specific analytics and reporting

### 5. Client Management System
5.1 The system must allow clinic admins to add new clients with required demographic information
5.2 The system must generate unique client codes (CLT001, CLT002, etc.)
5.3 The system must store client information including: full name, age, gender, occupation, education level, and contact details
5.4 The system must allow clinic admins to assign clients to specific therapists
5.5 The system must maintain client status (active, inactive, completed)
5.6 The system must provide a searchable client list with filtering options
5.7 The system must allow therapists to view only their assigned clients
5.8 The system must track session history and token consumption per client

### 6. Session Workflow System

#### 6.1 Pre-Session Assessment
6.1.1 The system must support pre-session assessments for each therapy session
6.1.2 The system must allow therapists to conduct direct assessments with clients
6.1.3 The system must track changes from previous sessions for returning clients
6.1.4 The system must validate homework effectiveness for follow-up sessions
6.1.5 The system must auto-save assessment progress to prevent data loss
6.1.6 The system must calculate completion time for each assessment
6.1.7 The system must store assessment data in structured JSON format

#### 6.2 Mental Health Issue Detection
6.2.1 The system must support mental health issue identification for first-time clients
6.2.2 The system must allow therapists to update mental health issues based on direct assessment interviews
6.2.3 The system must provide a comprehensive list of mental health conditions
6.2.4 The system must allow multiple issue selection with priority ranking
6.2.5 The system must track issue changes across sessions
6.2.6 The system must provide issue-specific recommendations and considerations

#### 6.3 Technique Selection System
6.3.1 The system must provide access to all 67 hypnotherapy techniques
6.3.2 The system must calculate compatibility percentages for each technique based on assessment data
6.3.3 The system must display techniques ordered by compatibility percentage (highest to lowest)
6.3.4 The system must allow therapists to select maximum 3 techniques per session
6.3.5 The system must provide detailed descriptions and cultural considerations for each technique
6.3.6 The system must show technique compatibility reasoning in Indonesian
6.3.7 The system must allow technique selection modification before script generation

#### 6.4 Script Generation System
6.4.1 The system must generate complete session scripts based on pre-session assessment and selected techniques
6.4.2 The system must create scripts in both PDF and digital formats
6.4.3 The system must include timing boxes for manual session tracking
6.4.4 The system must provide technique highlights and instructions within scripts
6.4.5 The system must include cultural notes and safety protocols
6.4.6 The system must allow therapists to preview and edit scripts before finalization
6.4.7 The system must generate scripts in formal Indonesian language
6.4.8 The system must consume one token per script generation
6.4.9 The system must track script generation usage and display remaining token balance

#### 6.5 Final Session Assessment
6.5.1 The system must support final session assessments to track therapy progress
6.5.2 The system must compare final assessment results with pre-session assessment data
6.5.3 The system must provide progress metrics and improvement indicators
6.5.4 The system must allow therapists to rate session effectiveness (1-10 scale)
6.5.5 The system must track client progress across multiple sessions
6.5.6 The system must generate progress reports and analytics

#### 6.6 Homework Recommendation System
6.6.1 The system must generate AI-powered homework recommendations based on assessment data and session content
6.6.2 The system must provide culturally appropriate homework activities
6.6.3 The system must consider client age, gender, and background for homework recommendations
6.6.4 The system must provide detailed instructions and expected outcomes
6.6.5 The system must track homework completion and effectiveness
6.6.6 The system must allow therapists to customize homework recommendations

### 7. Cultural Adaptation System
7.1 The system must consider client age for technique and language appropriateness
7.2 The system must adapt recommendations based on client gender
7.3 The system must incorporate client background (occupation, education) into recommendations
7.4 The system must use appropriate Indonesian language formality based on client characteristics
7.5 The system must provide cultural notes and considerations in all recommendations

### 8. Data Security & Privacy
8.1 The system must encrypt all client data at rest and in transit
8.2 The system must comply with Indonesian data protection laws
8.3 The system must implement GDPR-level privacy controls
8.4 The system must provide secure data backup and recovery
8.5 The system must maintain audit logs for all data access and modifications
8.6 The system must allow clients to request data deletion
8.7 The system must implement role-based access controls
8.8 The system must ensure clinic data isolation and privacy

## Non-Goals (Out of Scope)

- **Direct Client Access:** Clients will not have direct access to the system
- **Video/Audio Sessions:** The system will not provide real-time video or audio session capabilities
- **Third-party Integrations:** No integration with external EHR or scheduling systems
- **Mobile Applications:** No native mobile app development (desktop web only)
- **Multi-language Support:** Indonesian language only (no English or regional languages)
- **Automated Diagnosis:** The system will not provide medical diagnoses or replace professional judgment
- **Real-time AI Chat:** No conversational AI interface for direct therapist interaction
- **Multi-clinic Management:** System administrators will not manage multiple clinics from a single interface
- **Free Tier:** No free tier or trial period (token-based payment only)
- **Subscription Model:** No monthly subscription billing (pay-per-session token model only)

## Design Considerations

### User Interface Requirements
- Clean, professional interface suitable for mental health professionals
- Intuitive navigation with clear visual hierarchy
- Responsive design optimized for desktop use
- Accessibility compliance for users with disabilities
- Consistent color scheme and typography throughout the application
- Clinic-specific branding and customization options
- Clear token balance and usage indicators

### Cultural Design Elements
- Use of appropriate Indonesian cultural imagery and colors
- Formal language interface suitable for professional context
- Consideration of Indonesian work culture and communication styles
- Respectful representation of diverse Indonesian backgrounds

### Data Visualization
- Clear progress indicators for multi-step session workflow
- Visual representation of technique compatibility scores
- Progress tracking charts and analytics for client outcomes
- Intuitive dashboard with key metrics and recent activities
- Role-based dashboard views for different user types
- Token usage analytics and cost tracking visualizations

## Technical Considerations

### Performance Requirements
- Page load times under 3 seconds for all major functions
- Assessment form auto-save within 30 seconds of inactivity
- Technique compatibility calculation within 5 seconds
- Script generation within 30 seconds
- Support for concurrent users without performance degradation

### Scalability Requirements
- Architecture must support 100+ clinics with 1000+ concurrent therapists
- Database must handle 10,000+ client records per clinic
- AI processing must scale with increased usage
- File storage must accommodate growing script and assessment data
- Token management system must handle high-volume transactions

### Security Requirements
- End-to-end encryption for all sensitive data
- Regular security audits and penetration testing
- Compliance with Indonesian cybersecurity regulations
- Secure API endpoints with rate limiting
- Regular security updates and patch management
- Role-based access control enforcement
- Clinic data isolation and privacy protection
- Secure token transaction processing

## Success Metrics

### Primary Metrics
1. **Time Savings:** Achieve 85% reduction in session planning time (from 2 hours to 15 minutes)
2. **Clinic Adoption Rate:** Achieve 80% adoption rate among Indonesian clinics within 12 months
3. **Client Outcomes:** Measure 25% improvement in client satisfaction and therapeutic outcomes
4. **Therapist Capacity:** Enable therapists to serve 30% more clients through workflow optimization
5. **Token Usage Efficiency:** Achieve 90% token utilization rate across all clinics

### Secondary Metrics
1. **System Performance:** Maintain 99.9% uptime and sub-3-second response times
2. **Data Quality:** Achieve 95% accuracy in technique recommendations as validated by therapists
3. **Cultural Appropriateness:** Achieve 90% satisfaction rate for cultural adaptation features
4. **User Satisfaction:** Maintain 4.5+ star rating from clinic admins and therapists
5. **Clinic Management Efficiency:** Reduce clinic administrative overhead by 40%
6. **Token Purchase Conversion:** Achieve 25% repeat token purchase rate

### Measurement Methods
- Automated time tracking for session planning workflows
- User analytics and adoption tracking
- Client outcome surveys and progress assessments
- System performance monitoring and alerting
- Regular user feedback collection and analysis
- Clinic management efficiency metrics
- Token usage tracking and purchase analytics

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
10. **Token Pricing Strategy:** What should be the pricing structure for different token packages?
11. **Token Expiration:** Should tokens have expiration dates or remain valid indefinitely?
12. **Bulk Purchase Discounts:** Should there be volume discounts for large token purchases?
13. **Usage Monitoring:** How frequently should usage metrics be updated and displayed to clinic admins?

## Pricing Structure

### Token-Based Payment Model

The system uses a token-based payment model where each therapy session consumes one token, providing flexibility and cost control for clinics:

#### Token Packages

**Starter Package - Rp 500,000 for 50 tokens**
**Target:** Small practices and individual therapists
- **Tokens:** 50 sessions
- **Price per Session:** Rp 10,000
- **Features:** All core session features, email support
- **Best For:** Solo practitioners and small clinics starting with AI-assisted therapy

**Professional Package - Rp 900,000 for 100 tokens**
**Target:** Growing clinics and medium-sized practices
- **Tokens:** 100 sessions
- **Price per Session:** Rp 9,000
- **Features:** Advanced analytics, priority support, all core features
- **Best For:** Established clinics with regular client volume

**Enterprise Package - Rp 1,600,000 for 200 tokens**
**Target:** Expanding clinics with high client volume
- **Tokens:** 200 sessions
- **Price per Session:** Rp 8,000
- **Features:** API integration, phone support, all Professional features
- **Best For:** Busy clinics requiring integration capabilities

**Premium Package - Rp 3,000,000 for 400 tokens**
**Target:** Large clinics and therapy centers
- **Tokens:** 400 sessions
- **Price per Session:** Rp 7,500
- **Features:** Enterprise analytics, dedicated support, custom branding, all Enterprise features
- **Best For:** Large therapy centers and multi-location clinics

### Pricing Principles
- **Pay-Per-Session:** Each therapy session consumes exactly one token
- **No Hidden Fees:** Transparent pricing with no additional charges
- **Volume Discounts:** Larger packages provide better per-session pricing
- **No Expiration:** Tokens remain valid until used
- **Flexible Usage:** Tokens can be used across all therapists in the clinic
- **No Long-term Contracts:** Purchase tokens as needed

### Billing & Payment
- **Currency:** Indonesian Rupiah (IDR)
- **Payment Methods:** Bank transfer, digital wallets, credit cards
- **Invoicing:** Automated invoices for token purchases
- **Tax Compliance:** Includes applicable Indonesian taxes
- **Refund Policy:** Unused tokens can be refunded within 30 days

### Token Management & Usage

#### Session Workflow Token Consumption
- **Pre-Session Assessment:** Included in session token
- **Mental Health Issue Detection:** Included in session token
- **Technique Selection:** Included in session token
- **Script Generation:** Consumes 1 token per session
- **Final Session Assessment:** Included in session token
- **Homework Recommendations:** Included in session token

#### Token Management Features
- **Real-time Balance Tracking:** Live token balance display
- **Usage History:** Detailed session and token consumption logs
- **Low Balance Alerts:** Notifications at 10, 5, and 1 token remaining
- **Purchase Reminders:** Automated suggestions for token replenishment
- **Usage Analytics:** Detailed reports on token consumption patterns
- **Cost Allocation:** Track token usage per therapist and client

#### Usage Monitoring
- **Dashboard Display:** Real-time token balance and usage metrics
- **Reporting:** Daily, weekly, and monthly usage reports
- **Analytics:** Usage trends and cost analysis
- **Notifications:** Email alerts for low balance and purchase confirmations
- **Purchase Prompts:** Suggestions for package upgrades when consistently using higher volumes

## Implementation Phases

### Phase 1: Foundation & Authentication (Weeks 1-4)
- Role-based authentication and user management
- Clinic registration and approval system
- Basic clinic and therapist management
- Core database structure and API
- Token-based payment system implementation

### Phase 2: Clinic Management & Token System (Weeks 5-8)
- Clinic onboarding and property setup
- Therapist account creation and management
- Client management and assignment system
- Token purchase and management interface
- Usage tracking and analytics

### Phase 3: Session Workflow Foundation (Weeks 9-12)
- Pre-session assessment system
- Mental health issue detection and management
- Basic session workflow implementation
- Token consumption tracking

### Phase 4: Technique Selection System (Weeks 13-16)
- Implementation of all 67 hypnotherapy techniques
- Compatibility scoring algorithm
- Technique selection interface
- Cultural adaptation logic

### Phase 5: Script Generation & Assessment (Weeks 17-20)
- AI-powered script generation based on assessment and techniques
- Final session assessment system
- Progress tracking and comparison
- Homework recommendation system

### Phase 6: Analytics & Polish (Weeks 21-24)
- Comprehensive analytics and reporting
- Performance optimization
- Security hardening and compliance validation
- Token usage optimization and cost tracking

This PRD provides a comprehensive roadmap for developing the Indonesian Hypnotherapy AI System with token-based payment and a complete session workflow, ensuring it meets the specific needs of Indonesian clinics and therapists while maintaining professional standards and cultural sensitivity. 