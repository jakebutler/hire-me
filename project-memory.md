# Project Memory — *Hire Me!* Job Search CRM

## Project Facts & Learnings

### Technical Stack Decisions
- **Frontend**: React with TypeScript, Tailwind CSS, and Radix UI components
- **Backend**: Convex for database, serverless functions, and real-time updates
- **Authentication**: Custom email/password auth using bcryptjs for hashing
- **File Storage**: Convex built-in storage for PDF resumes
- **PDF Parsing**: Using PDF.js (pdfjs-dist) for client-side PDF text extraction
- **Form Handling**: React Hook Form with Zod validation for type-safe forms

### Implemented Features (Milestone 1)
- **User Authentication System**:
  - Email/password registration and login
  - User persona selection (targeted vs volume)
  - Secure password hashing with bcryptjs
  - Authentication context with localStorage persistence
  - AuthWrapper component for protected routes

- **Resume Upload & Parsing**:
  - Drag-and-drop PDF upload interface using react-dropzone
  - PDF text extraction using PDF.js library
  - Basic resume parsing with structured data extraction (name, email, phone, experience, education, skills)
  - File storage in Convex with HTTP endpoints for upload
  - Master resume concept with isMaster flag

- **Resume Display & Management**:
  - Comprehensive resume display component with edit capabilities
  - Structured editing for experience, education, skills, and certifications
  - Add/remove functionality for dynamic entries
  - Real-time UI updates with editing states

### Database Schema Design
- **Users Table**: Email, password hash, persona selection, timestamps
- **Resumes Table**: File references, parsed text, structured data, master resume flag
- **Jobs Table**: Prepared schema for job tracking (not yet implemented)
- **Indexes**: Optimized queries for user lookups and resume filtering

### UI/UX Patterns Established
- **Mobile-First Design**: Responsive layouts with Tailwind CSS
- **Component Library**: Radix UI primitives with custom styling
- **Icon System**: Lucide React icons for consistent visual language
- **Form Patterns**: Consistent form layouts with validation feedback
- **Loading States**: Proper loading indicators and error handling
- **Navigation**: Tab-based navigation for different views

### PDF Parsing Implementation
- **Simple Text Extraction**: Basic parsing using PDF.js without external dependencies
- **Structured Data Extraction**: Heuristic-based parsing for resume sections
- **Limitation Acknowledged**: Current parser is basic; production would need more sophisticated parsing

### File Upload Strategy
- **Convex HTTP Routes**: Custom HTTP endpoints for file upload
- **CORS Handling**: Proper CORS configuration for cross-origin requests
- **Error Handling**: Comprehensive error handling for upload failures

## Development Patterns & Best Practices

### Code Organization
- **Separation of Concerns**: Clear distinction between UI components, business logic, and data access
- **Type Safety**: Comprehensive TypeScript usage with proper type definitions
- **Component Composition**: Reusable UI components following single responsibility principle

### State Management
- **Context API**: Authentication state managed through React Context
- **Convex Queries**: Real-time data synchronization with automatic updates
- **Local State**: Component-level state for UI interactions and forms

### Error Handling
- **Form Validation**: Client-side validation with Zod schemas
- **API Error Handling**: Proper error messaging and user feedback
- **File Upload Errors**: Specific error handling for upload and parsing failures

## Next Steps & Considerations

### Resume Parser Enhancement
- Current implementation is basic and may need replacement with more sophisticated parsing
- Consider external services or more advanced parsing libraries for production use
- May need to handle various PDF formats and layouts better

### Security Improvements
- Currently using simple localStorage for session persistence
- May need more secure session management for production
- File upload security considerations (virus scanning, file type validation)

### Performance Optimizations
- Large PDF files may cause performance issues with current client-side parsing
- Consider server-side parsing for better performance and security
- Implement proper loading states and progress indicators

### User Experience Enhancements
- Add more sophisticated resume editing capabilities
- Implement undo/redo functionality for resume editing
- Better visual feedback for parsing results and structured data display

## Technical Debt & Future Refactoring

### File Upload Implementation
- Current HTTP endpoint implementation is basic
- May need more sophisticated file handling and validation
- Consider implementing chunked uploads for large files

### Resume Data Structure
- Current structured data format may need refinement based on user feedback
- Consider more flexible schema for different resume formats and styles
- May need versioning strategy for resume data structure changes

### Component Library
- Some UI components are basic implementations
- Consider adopting a more comprehensive component library or building out custom library further
- Implement consistent design system with proper theming support