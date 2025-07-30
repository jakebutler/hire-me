# Project Plan — *Hire Me!* Job Search CRM

## 🎯 Project Overview
Building a mobile-first web app offering a smart job-search CRM with role-specific AI resume feedback, job application tracking & coaching, and high-quality weekly email plans.

**Tech Stack:**
- Frontend: React/Next.js on Bolt.new
- Backend: Convex (storage & serverless functions)
- Email: Resend (hireme.corvolabs.com)
- LLM: OpenAI API → PromptLayer migration
- Prompt Management: TinaCMS → PromptLayer migration

## 📋 Development Milestones & Tasks

### Milestone 1: User Authentication & Resume Upload
**Goal:** Enable user registration, login, and PDF resume upload with parsing

#### Core Authentication Tasks
- [ ] **AUTH-001**: Set up Convex schema for User model
  - Define User interface with email, passwordHash, persona fields
  - Create Convex mutations for user registration/login
  - Implement password hashing and validation
- [ ] **AUTH-002**: Create registration/login UI components
  - Build mobile-first registration form
  - Build login form with email/password
  - Add form validation and error handling
  - Style with Tailwind CSS and Radix UI components
- [ ] **AUTH-003**: Implement authentication state management
  - Set up Convex auth integration
  - Create authentication context/hooks
  - Handle session persistence and logout

#### Resume Upload & Parsing Tasks
- [ ] **RESUME-001**: Research and select free resume parser
  - Evaluate options from EdenAI article: ResumeParser.io, PyResparser, Resume-Parser
  - Test parsing accuracy for structured fields (name, contact, experience, education, skills)
  - Select parser that integrates well with Convex serverless functions
  - Document parser selection rationale
- [ ] **RESUME-002**: Set up Convex schema for Resume model
  - Define Resume interface with structured fields
  - Create ExperienceEntry and EducationEntry interfaces
  - Set up file storage strategy for PDF uploads
- [ ] **RESUME-003**: Implement PDF upload UI
  - Create drag-and-drop file upload component
  - Add file picker fallback option
  - Implement upload progress indicators
  - Add file validation (PDF only, size limits)
- [ ] **RESUME-004**: Build resume parsing Convex function
  - Integrate selected parser library
  - Create serverless function to process uploaded PDFs
  - Extract and structure resume data
  - Store parsed data in Convex database
- [ ] **RESUME-005**: Create master resume display/management
  - Build UI to display parsed resume data
  - Allow basic editing of structured fields
  - Implement resume re-upload functionality

### Milestone 2: Add Job via URL or Paste Job Description
**Goal:** Enable job addition through URL or text input with automated parsing

#### Job Description Parsing Research
- [ ] **JD-001**: Research and evaluate job description parsers
  - Evaluate Mercury-Parser for URL-based job description extraction
  - Evaluate Readability.js for text content extraction
  - Test parsing accuracy on major job boards (LinkedIn, Indeed, etc.)
  - Create comparison matrix and select preferred solution
- [ ] **JD-002**: Set up Convex schema for Job model
  - Define Job interface with title, company, description, status fields
  - Create relationships between User and Job models
  - Set up structured job description storage

#### Job Addition Implementation
- [ ] **JD-003**: Build job addition UI
  - Create input form with URL and text paste options
  - Add validation for URL format and required fields
  - Implement mobile-friendly interface design
- [ ] **JD-004**: Implement server-side job description parsing
  - Create Convex function for URL-based parsing using selected parser
  - Handle text-based job description processing
  - Extract structured data (title, company, requirements, responsibilities)
  - Implement error handling for failed parsing
- [ ] **JD-005**: Create job record management
  - Store parsed job data in Convex
  - Link jobs to user accounts
  - Implement job listing and basic CRUD operations

### Milestone 3: Role-Specific Resume Feedback & Versioning
**Goal:** Generate AI-powered resume feedback tailored to specific job requirements

#### Resume Versioning System
- [ ] **FEEDBACK-001**: Implement resume cloning system
  - Create Convex function to clone master resume for specific jobs
  - Set up job-specific resume versioning
  - Link job-specific resumes to job records
- [ ] **FEEDBACK-002**: Set up initial OpenAI API integration
  - Configure OpenAI API credentials and client
  - Create prompt templates for resume analysis
  - Implement basic LLM comparison functionality

#### AI Feedback Implementation
- [ ] **FEEDBACK-003**: Build resume-to-job comparison logic
  - Create prompts for analyzing resume vs job requirements
  - Identify missing skills and keyword mismatches
  - Generate actionable improvement suggestions
- [ ] **FEEDBACK-004**: Store and display feedback
  - Save AI feedback in Convex linked to job-specific resumes
  - Create UI components to display feedback inline
  - Implement feedback categorization (skills, experience, keywords)
- [ ] **FEEDBACK-005**: Enable resume editing based on feedback
  - Allow users to edit job-specific resume versions
  - Track changes made based on AI suggestions
  - Update resume versions in Convex

### Milestone 4: Job Status Tracking & Weekly Summary Emails
**Goal:** Track job application progress and send automated weekly summaries

#### Job Status System
- [ ] **STATUS-001**: Implement job status tracking
  - Add status field to Job model with defined statuses
  - Create UI for status updates and transitions
  - Add timestamps for status changes
- [ ] **STATUS-002**: Build job dashboard/CRM view
  - Create job listing with status badges
  - Implement filtering and sorting by status
  - Add bulk status update functionality

#### Email Integration
- [ ] **EMAIL-001**: Set up Resend email service
  - Configure Resend with hireme.corvolabs.com domain
  - Set up email templates for weekly summaries
  - Implement email tracking (opens, clicks)
- [ ] **EMAIL-002**: Create weekly summary generation
  - Build Convex CRON job for weekly email generation
  - Generate job status tables and suggested actions
  - Include Google Calendar links for follow-ups
- [ ] **EMAIL-003**: Implement company dossier integration
  - Create CompanyDossier schema and generation logic
  - Include dossier snippets in email summaries
  - Research and implement company information gathering

### Milestone 5: Personalized Job Coach Recommendations
**Goal:** Provide AI-powered coaching suggestions based on job and user context

#### Coaching Logic
- [ ] **COACH-001**: Build coaching recommendation engine
  - Create prompts for generating personalized suggestions
  - Consider user persona, job details, and current status
  - Generate actionable next steps (LinkedIn outreach, interview prep, etc.)
- [ ] **COACH-002**: Display coaching suggestions
  - Create UI components for inline coaching display
  - Implement suggestion categorization and prioritization
  - Add user feedback mechanisms (helpful/not helpful)
- [ ] **COACH-003**: Email coaching integration
  - Include coaching suggestions in weekly emails
  - Create email-specific coaching content formatting
  - Track engagement with emailed suggestions

### Milestone 6: Content Generation for Action Items
**Goal:** Generate and manage templates for common job search communications

#### Template System
- [ ] **CONTENT-001**: Create content template engine
  - Build templates for LinkedIn messages, thank-you emails, interview prep
  - Implement dynamic content generation based on job/user context
  - Create template versioning and management system
- [ ] **CONTENT-002**: Build content editing interface
  - Create UI for viewing and editing generated templates
  - Implement copy-to-clipboard functionality
  - Add template customization options
- [ ] **CONTENT-003**: Track content usage
  - Record when users copy/use generated content
  - Implement usage analytics and effectiveness tracking
  - Create feedback loop for template improvement

### Milestone 7: Stretch Capabilities & Third-Party Integrations
**Goal:** Advanced integrations and productivity features

#### PromptLayer Migration
- [ ] **PROMPT-001**: Set up PromptLayer integration
  - Configure PromptLayer API and authentication
  - Migrate existing prompts from direct OpenAI calls
  - Implement prompt versioning and management
- [ ] **PROMPT-002**: Migrate from TinaCMS to PromptLayer
  - Export existing prompts from TinaCMS
  - Set up PromptLayer API for prompt management
  - Remove TinaCMS dependencies and update workflow

#### Google Services Integration
- [ ] **GOOGLE-001**: Implement Google Calendar OAuth
  - Set up Google OAuth 2.0 flow
  - Create calendar event creation functionality
  - Build UI for calendar integration settings
- [ ] **GOOGLE-002**: Implement Gmail integration
  - Set up Gmail API OAuth flow
  - Create email forwarding and tracking functionality
  - Build email parsing for status updates

#### Additional Features
- [ ] **FEATURES-001**: Build job tagging system
  - Create tag model and UI components
  - Implement tag-based filtering and organization
  - Add predefined tags (dream job, easy apply, etc.)
- [ ] **FEATURES-002**: Research Convex storage optimization
  - Investigate chunking strategies for large files
  - Implement efficient file storage for resumes and attachments
  - Optimize database queries and data structure

### Milestone 8: LLM Tracing, Observability & Evaluation
**Goal:** Implement comprehensive LLM monitoring and quality assessment

#### Observability Setup
- [ ] **TRACE-001**: Implement PromptLayer logging
  - Track all LLM calls and responses
  - Log prompt versions and model parameters
  - Set up usage analytics and cost tracking
- [ ] **TRACE-002**: Build evaluation framework
  - Create quality metrics for resume suggestions
  - Implement user feedback collection system
  - Build A/B testing framework for prompt versions

#### Quality Assessment
- [ ] **EVAL-001**: Create feedback collection UI
  - Add thumbs up/down for AI suggestions
  - Implement detailed feedback forms
  - Track suggestion effectiveness over time
- [ ] **EVAL-002**: Build evaluation dashboard
  - Display prompt performance metrics
  - Show user satisfaction scores
  - Create alerts for quality degradation

## 🔄 Cross-Cutting Development Tasks

### TinaCMS Integration & Migration
- [ ] **CMS-001**: Set up TinaCMS for initial prompt management
  - Configure TinaCMS with prompt editing interface
  - Create prompt schema and content models
  - Implement prompt version control
- [ ] **CMS-002**: Build TinaCMS to PromptLayer migration pipeline
  - Create export functionality from TinaCMS
  - Build import scripts for PromptLayer
  - Validate prompt migration accuracy
- [ ] **CMS-003**: Remove TinaCMS after migration
  - Clean up TinaCMS dependencies
  - Update prompt management workflow
  - Document new PromptLayer-based process

### Frontend Development Foundation
- [ ] **UI-001**: Set up mobile-first React application
  - Initialize React app with TypeScript
  - Configure Tailwind CSS and Radix UI
  - Set up responsive design system
- [ ] **UI-002**: Create component library
  - Build reusable UI components
  - Implement design system and theme
  - Create mobile-optimized layouts
- [ ] **UI-003**: Implement routing and navigation
  - Set up React Router for SPA navigation
  - Create mobile-friendly navigation patterns
  - Implement authentication-based routing

### Convex Backend Foundation
- [ ] **BACKEND-001**: Initialize Convex project
  - Set up Convex development environment
  - Configure database schema and functions
  - Implement authentication and authorization
- [ ] **BACKEND-002**: Set up CRON jobs and background tasks
  - Create weekly email generation jobs
  - Implement data cleanup and maintenance tasks
  - Set up error handling and monitoring

### DevOps and Deployment
- [ ] **DEPLOY-001**: Configure Bolt.new deployment
  - Set up continuous deployment pipeline
  - Configure environment variables and secrets
  - Implement staging and production environments
- [ ] **DEPLOY-002**: Set up monitoring and logging
  - Implement application monitoring
  - Set up error tracking and alerting
  - Create performance monitoring dashboard

## 📊 Project Progress Tracking

### Milestone Completion Status
- [ ] Milestone 1: User Authentication & Resume Upload
- [ ] Milestone 2: Add Job via URL or Paste Job Description  
- [ ] Milestone 3: Role-Specific Resume Feedback & Versioning
- [ ] Milestone 4: Job Status Tracking & Weekly Summary Emails
- [ ] Milestone 5: Personalized Job Coach Recommendations
- [ ] Milestone 6: Content Generation for Action Items
- [ ] Milestone 7: Stretch Capabilities & Third-Party Integrations
- [ ] Milestone 8: LLM Tracing, Observability & Evaluation

### Current Sprint Focus
**Current Focus:** Setting up project foundation and Milestone 1 tasks

### Next Actions
1. Begin with BACKEND-001: Initialize Convex project
2. Complete UI-001: Set up mobile-first React application  
3. Start AUTH-001: Set up Convex schema for User model

### Notes
- Resume parser selection pending research completion (RESUME-001)
- Job description parser evaluation needed (JD-001)
- TinaCMS integration temporary - plan migration timeline
- Chrome Extension deferred to separate sub-project