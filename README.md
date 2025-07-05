# AI-Course-MITAOE 🎓

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)
![Redis](https://img.shields.io/badge/Redis-6+-red)

A comprehensive AI-powered learning and assessment platform designed for engineering institutions. This modern system enables teachers to create intelligent courses, generate questions aligned with Bloom's Taxonomy, and evaluate student performance through advanced analytics. With robust role-based access control and real-time features, it seamlessly integrates artificial intelligence with educational excellence.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  React 18 + Vite Frontend                                       │
│  ├── TypeScript (Type Safety)                                   │
│  ├── Tailwind CSS (Utility-First Styling)                       │
│  ├── shadcn/ui Components (Modern UI Library)                   │
│  ├── React Router (Client-Side Routing)                         │
│  └── Context API (State Management)                             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS/REST API
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  Node.js + Express Backend                                      │
│  ├── JWT Authentication Middleware                              │
│  ├── Role-Based Authorization                                   │
│  ├── Controllers (Route Handlers)                               │
│  ├── Services (Business Logic)                                  │
│  ├── Validators (Input Validation)                              │
│  ├── AI Integration (WorqHat APIs)                              │
│  └── Real-time Notifications (Redis Pub/Sub)                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Prisma ORM
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL Database                                             │
│  ├── Prisma Schema & Migrations                                 │
│  ├── Optimized Indexes                                          │
│  ├── Connection Pooling                                         │
│  └── Encrypted Enrollment Keys                                  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ External Integrations
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
├─────────────────────────────────────────────────────────────────┤
│  ├── WorqHat AI APIs (Question Generation & Analysis)           │
│  ├── Redis Cache (Real-time Notifications & Session Storage)    │
│  ├── Resend (Email Notification Service)                        │
│  └── Google OAuth (Optional Social Authentication)              │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18+** - Modern UI library with concurrent features
- **Vite** - Fast build tool and development server
- **TypeScript** - Static type checking for enhanced developer experience
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **shadcn/ui** - High-quality, accessible component library built on Radix UI
- **React Router** - Declarative routing for React applications
- **Context API** - Built-in state management solution

### Backend
- **Node.js** - JavaScript runtime built on Chrome's V8 engine
- **Express.js** - Fast, unopinionated web framework
- **Prisma** - Next-generation ORM with type safety
- **JWT** - JSON Web Tokens for secure authentication
- **Bcrypt** - Password hashing library
- **Multer** - Middleware for handling file uploads

### Database & Caching
- **PostgreSQL** - Advanced open-source relational database
- **Redis** - In-memory data structure store for caching and pub/sub
- **Prisma Migrate** - Database migration tool with version control

### AI/ML Integration
- **WorqHat APIs** - Advanced AI models for question generation and content analysis
- **Natural Language Processing** - Content categorization and analysis
- **Bloom's Taxonomy Engine** - Intelligent question classification

### Development Tools
- **ESLint** - Code linting for JavaScript/TypeScript
- **Prettier** - Code formatting
- **Husky** - Git hooks for code quality
- **Docker** - Containerization for consistent environments

## Project Structure

```
AI-Course-MITAOE/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js           # Prisma client configuration
│   │   │   ├── redis.js              # Redis connection setup
│   │   │   ├── passport.js           # Authentication strategies
│   │   │   └── env.js                # Environment variables
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Authentication logic
│   │   │   ├── user.controller.js    # User management
│   │   │   ├── course.controller.js  # Course operations
│   │   │   ├── test.controller.js    # Test management
│   │   │   ├── question.controller.js # Question generation
│   │   │   ├── enrollment.controller.js # Course enrollment
│   │   │   ├── school.controller.js  # School management
│   │   │   └── semester.controller.js # Semester operations
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT verification
│   │   │   ├── validation.middleware.js # Request validation
│   │   │   ├── session.middleware.js # Session management
│   │   │   └── error.middleware.js   # Error handling
│   │   ├── routes/
│   │   │   ├── auth/
│   │   │   │   └── auth.routes.js    # Authentication routes
│   │   │   ├── studentRoutes/
│   │   │   │   ├── course.routes.js  # Student course routes
│   │   │   │   ├── test.routes.js    # Student test routes
│   │   │   │   └── user.routes.js    # Student profile routes
│   │   │   ├── teacherRoutes/
│   │   │   │   ├── course.routes.js  # Teacher course routes
│   │   │   │   └── school.routes.js  # Teacher school routes
│   │   │   ├── questionRoutes.js     # Question management
│   │   │   ├── testRoutes.js         # Test operations
│   │   │   └── enrollmentRoutes.js   # Enrollment management
│   │   ├── services/
│   │   │   ├── auth.service.js       # Authentication business logic
│   │   │   ├── user.service.js       # User operations
│   │   │   ├── course.service.js     # Course management
│   │   │   ├── test.service.js       # Test operations
│   │   │   ├── ai.service.js         # AI integration
│   │   │   ├── enrollment.service.js # Enrollment logic
│   │   │   ├── email.service.js      # Email notifications
│   │   │   └── analytics.service.js  # Performance analytics
│   │   ├── validators/
│   │   │   ├── auth.validator.js     # Authentication validation
│   │   │   ├── course.validator.js   # Course data validation
│   │   │   ├── test.validator.js     # Test validation
│   │   │   └── user.validator.js     # User data validation
│   │   ├── utils/
│   │   │   ├── bcrypt.js             # Password hashing utilities
│   │   │   ├── crypto.js             # Encryption/decryption
│   │   │   ├── jwt.js                # JWT token utilities
│   │   │   ├── resend.js             # Email service integration
│   │   │   ├── logger.js             # Logging utilities
│   │   │   └── response.js           # Standardized API responses
│   │   └── errors/
│   │       ├── ApiError.js           # Custom error classes
│   │       ├── errorHandler.js       # Global error handler
│   │       └── index.js              # Error exports
│   ├── prisma/
│   │   ├── schema.prisma             # Database schema
│   │   ├── migrations/               # Database migrations
│   │   └── seed.js                   # Database seeding
│   ├── tests/
│   │   ├── unit/                     # Unit tests
│   │   ├── integration/              # Integration tests
│   │   └── e2e/                      # End-to-end tests
│   ├── package.json
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui base components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   └── ... (other UI components)
│   │   │   ├── layout/
│   │   │   │   ├── app-sidebar.tsx   # Application sidebar
│   │   │   │   ├── nav-main.tsx      # Main navigation
│   │   │   │   ├── nav-user.tsx      # User navigation
│   │   │   │   └── theme-provider.tsx # Theme management
│   │   │   ├── auth/
│   │   │   │   ├── login-form.tsx    # Login component
│   │   │   │   ├── signup-form.tsx   # Registration component
│   │   │   │   └── protectedRoute.tsx # Route protection
│   │   │   ├── forms/
│   │   │   │   ├── course-form.tsx   # Course creation form
│   │   │   │   ├── test-form.tsx     # Test creation form
│   │   │   │   └── question-form.tsx # Question form
│   │   │   └── shared/
│   │   │       ├── 404.tsx           # 404 error page
│   │   │       ├── loading.tsx       # Loading components
│   │   │       └── error-boundary.tsx # Error boundary
│   │   ├── pages/
│   │   │   ├── Authentication/
│   │   │   │   ├── AuthenticateLayout.tsx
│   │   │   │   └── ForgotPassword.tsx
│   │   │   ├── Admin/
│   │   │   │   ├── adminDashboard.tsx
│   │   │   │   ├── Schools.tsx
│   │   │   │   └── usersList.tsx
│   │   │   ├── teachers/
│   │   │   │   ├── TeacherDashboard.tsx
│   │   │   │   ├── CreateCourse.tsx
│   │   │   │   ├── CreateTest.tsx
│   │   │   │   ├── CreateQuestion.tsx
│   │   │   │   ├── question-bank.tsx
│   │   │   │   └── CourseSettings.tsx
│   │   │   ├── student/
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Courses.tsx
│   │   │   │   ├── Test/
│   │   │   │   │   ├── TestPage.tsx
│   │   │   │   │   ├── Question.tsx
│   │   │   │   │   └── Timer.tsx
│   │   │   │   ├── courses/
│   │   │   │   │   ├── Course.tsx
│   │   │   │   │   ├── Chapter.tsx
│   │   │   │   │   ├── Topic.tsx
│   │   │   │   │   └── TestAnalytics.tsx
│   │   │   │   └── SiteHome.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── UserProfile.tsx
│   │   ├── hooks/
│   │   │   ├── AuthContext.tsx       # Authentication context
│   │   │   ├── userContext.tsx       # User state management
│   │   │   ├── studentCoursesContext.tsx # Student courses
│   │   │   ├── use-mobile.tsx        # Mobile detection hook
│   │   │   └── useApi.tsx            # API interaction hook
│   │   ├── services/
│   │   │   ├── api.js                # Base API configuration
│   │   │   ├── auth.service.js       # Authentication API
│   │   │   ├── course.service.js     # Course API
│   │   │   ├── test.service.js       # Test API
│   │   │   └── user.service.js       # User API
│   │   ├── utils/
│   │   │   ├── constants.js          # Application constants
│   │   │   ├── helpers.js            # Utility functions
│   │   │   ├── validators.js         # Client-side validation
│   │   │   └── formatters.js         # Data formatting
│   │   ├── Functions/
│   │   │   └── RegisterApi.ts        # Registration API functions
│   │   ├── Interfaces/
│   │   │   ├── AppSidebar.tsx        # Sidebar interfaces
│   │   │   ├── Database.tsx          # Database type definitions
│   │   │   └── MissionandVision.tsx  # Mission/Vision interfaces
│   │   ├── assets/
│   │   │   ├── logo_MITAOE.jpg       # Institution logo
│   │   │   └── MITAOE Landing IMAGE.jpg # Landing page image
│   │   ├── lib/
│   │   │   └── utils.ts              # Utility functions
│   │   ├── index.css                 # Global styles
│   │   └── main.tsx                  # Application entry point
│   ├── public/
│   │   └── logo.png                  # Public logo
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── docs/
│   ├── api/                          # API documentation
│   ├── database/                     # Database schema docs
│   ├── deployment/                   # Deployment guides
│   └── user-guides/                  # User documentation
│
├── .env.example
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

## Database Schema

### Core Entities

**Users**
- Primary Key: id (UUID)
- Attributes: email (unique), password (hashed), role (enum), profile (JSON)
- Indexes: email, role, created_at
- Relationships: Creates courses, enrolls in courses, takes tests

**Schools**
- Primary Key: id (UUID)
- Attributes: name, description, code, isActive
- Relationships: Contains courses, has users

**Courses**
- Primary Key: id (UUID)
- Attributes: title, description, code, enrollmentKey (encrypted)
- Foreign Keys: schoolId → School.id, teacherId → User.id
- Relationships: Contains chapters, has enrollments, has tests

**Chapters**
- Primary Key: id (UUID)
- Attributes: title, description, order, isActive
- Foreign Key: courseId → Course.id
- Relationships: Contains topics

**Topics**
- Primary Key: id (UUID)
- Attributes: title, content, order, isActive
- Foreign Key: chapterId → Chapter.id
- Relationships: Has questions

**Tests**
- Primary Key: id (UUID)
- Attributes: title, description, timeLimit, totalMarks, isActive
- Foreign Key: courseId → Course.id
- Relationships: Contains questions, has submissions

**Questions**
- Primary Key: id (UUID)
- Attributes: questionText, questionType, options (JSON), correctAnswer, marks
- Additional: bloomLevel, difficulty, aiGenerated
- Foreign Key: testId → Test.id
- Relationships: Has answers in submissions

**TestSubmissions**
- Primary Key: id (UUID)
- Attributes: answers (JSON), score, timeTaken, submittedAt
- Foreign Keys: studentId → User.id, testId → Test.id
- Relationships: Contains individual answers

**Enrollments**
- Primary Key: id (UUID)
- Attributes: enrollmentKey, enrolledAt, isActive
- Foreign Keys: studentId → User.id, courseId → Course.id
- Unique Constraint: (studentId, courseId)

### Enums

- **UserRole**: ADMIN, TEACHER, STUDENT
- **CourseStatus**: ACTIVE, INACTIVE, ARCHIVED
- **TestStatus**: DRAFT, PUBLISHED, COMPLETED
- **QuestionType**: MCQ, SHORT_ANSWER, ESSAY, TRUE_FALSE
- **BloomLevel**: REMEMBER, UNDERSTAND, APPLY, ANALYZE, EVALUATE, CREATE
- **Difficulty**: EASY, MEDIUM, HARD

## Authentication & Authorization

### JWT-Based Authentication
1. User provides credentials (email/password)
2. Backend validates credentials against database
3. Server generates JWT token with user info and role
4. Token sent to client and stored securely
5. Client includes token in Authorization header for protected routes
6. Server middleware verifies token on each request

### Role-Based Access Control

**Admin Role**
- Full system access and configuration
- User management (create, update, delete, role assignment)
- School and system-wide settings management
- Global analytics and reporting access
- System maintenance and backup operations

**Teacher Role**
- Course creation and management within assigned schools
- Chapter and topic content management
- Test creation with AI-powered question generation
- Student enrollment management via encrypted keys
- Student progress monitoring and analytics
- Grade management and feedback provision

**Student Role**
- Course enrollment using enrollment keys
- Access to enrolled course content (chapters, topics)
- Test taking with time limits and auto-submission
- Performance analytics and progress tracking
- Notification receipt for assignments and results

### Permission Middleware
- `authenticateToken`: Validates JWT token
- `authorizeRole`: Checks user role permissions
- `checkCourseAccess`: Validates course membership
- `checkTestAccess`: Ensures test availability and student enrollment

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login with credentials
- `POST /api/auth/register` - New user registration
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users` - List users (Admin only)
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user information
- `DELETE /api/users/:id` - Delete user (Admin only)
- `POST /api/users/:id/role` - Update user role (Admin only)

### School Management
- `GET /api/schools` - List schools
- `POST /api/schools` - Create new school (Admin only)
- `GET /api/schools/:id` - Get school details
- `PUT /api/schools/:id` - Update school information
- `DELETE /api/schools/:id` - Delete school (Admin only)

### Course Management
- `GET /api/courses` - List courses (filtered by role)
- `POST /api/courses` - Create new course (Teacher only)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course (Teacher only)
- `DELETE /api/courses/:id` - Delete course (Teacher only)
- `POST /api/courses/:id/enroll` - Enroll student with key
- `GET /api/courses/:id/students` - List enrolled students
- `POST /api/courses/:id/chapters` - Create chapter
- `PUT /api/chapters/:id` - Update chapter
- `DELETE /api/chapters/:id` - Delete chapter

### Test Management
- `GET /api/courses/:courseId/tests` - List course tests
- `POST /api/courses/:courseId/tests` - Create new test
- `GET /api/tests/:id` - Get test details
- `PUT /api/tests/:id` - Update test (Teacher only)
- `DELETE /api/tests/:id` - Delete test (Teacher only)
- `POST /api/tests/:id/submit` - Submit test answers
- `GET /api/tests/:id/results` - Get test results
- `GET /api/tests/:id/analytics` - Test performance analytics

### Question Management
- `GET /api/tests/:testId/questions` - List test questions
- `POST /api/tests/:testId/questions` - Add question to test
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question
- `POST /api/questions/generate` - AI-powered question generation
- `GET /api/questions/bank` - Question bank management

### Analytics & Reporting
- `GET /api/analytics/dashboard` - Role-based dashboard data
- `GET /api/analytics/courses/:id` - Course performance analytics
- `GET /api/analytics/tests/:id` - Test performance analytics
- `GET /api/analytics/students/:id` - Student performance analytics
- `GET /api/analytics/export` - Export analytics data

## AI Integration Features

### Intelligent Question Generation
The platform leverages WorqHat AI APIs to automatically generate educational content:

**Content Analysis**
- Automatic topic extraction from course materials
- Learning objective identification
- Prerequisite knowledge mapping
- Content difficulty assessment

**Question Generation**
- Multiple choice questions with intelligent distractors
- Short answer questions based on key concepts
- Essay questions for critical thinking
- True/false questions for concept validation
- Bloom's taxonomy level assignment

**Quality Assurance**
- Automated question validation
- Difficulty level standardization
- Content relevance scoring
- Bias detection and mitigation

### Performance Analytics
AI-powered analytics provide comprehensive insights:

**Student Performance**
- Learning pattern analysis
- Knowledge gap identification
- Personalized learning recommendations
- Progress prediction modeling

**Course Optimization**
- Content effectiveness analysis
- Question performance metrics
- Engagement pattern identification
- Curriculum improvement suggestions

## Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- PostgreSQL (v14 or higher)
- Redis (v6 or higher)
- Git for version control

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/AI-Course-MITAOE.git
cd AI-Course-MITAOE/Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment configuration**
```bash
cp .env.example .env
# Configure the following environment variables
```

4. **Database setup**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed database with initial data
npx prisma db seed
```

5. **Start development server**
```bash
npm run dev
```

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../Frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Add your API URL and other configurations
```

4. **Start development server**
```bash
npm run dev
```

## Environment Variables

### Backend (.env)
```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/ai_course_db"

# Authentication
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=your-32-character-encryption-key-here

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password

# AI Service Integration
WORQHAT_API_KEY=your-worqhat-api-key
WORQHAT_BASE_URL=https://api.worqhat.com

# Email Service
RESEND_API_KEY=your-resend-api-key
RESEND_EMAIL=noreply@yourdomain.com

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# File Upload Configuration
MAX_FILE_SIZE=10MB
UPLOAD_DIR=uploads/
ALLOWED_FILE_TYPES=pdf,doc,docx,ppt,pptx,txt

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW=15 # minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=AI Course MITAOE

# Application Configuration
VITE_NODE_ENV=development
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_DARK_MODE=true

# Google OAuth (Optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Performance Configuration
VITE_API_TIMEOUT=30000
VITE_MAX_FILE_SIZE=10485760 # 10MB in bytes
```

## Development Guidelines

### Code Organization
- Follow separation of concerns principles
- Use consistent naming conventions (camelCase for variables, PascalCase for components)
- Implement proper error handling throughout the application
- Use TypeScript for type safety in frontend components
- Follow RESTful API design principles

### Database Best Practices
- Use Prisma migrations for all schema changes
- Implement proper indexes for query optimization
- Use foreign key constraints to maintain data integrity
- Regular database backups and monitoring
- Use connection pooling for efficient database connections

### Security Considerations
- Input validation on both client and server side
- SQL injection prevention through Prisma ORM
- XSS protection with proper data sanitization
- CSRF protection implementation
- Rate limiting on API endpoints
- Secure file upload handling with type validation
- Proper CORS configuration for production

### Performance Optimization
- Implement Redis caching for frequently accessed data
- Use pagination for large data sets
- Optimize database queries with proper indexing
- Implement lazy loading for React components
- Use code splitting for bundle size optimization
- Compress responses and enable gzip

### Testing Strategy
- Unit tests for services and utilities
- Integration tests for API endpoints
- Component tests for React components
- End-to-end tests for critical user workflows
- Performance testing for high-load scenarios
- Security testing for vulnerability assessment

## Deployment

### Production Checklist
- [ ] Environment variables properly configured
- [ ] Database migrations applied
- [ ] SSL/TLS certificates installed
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented
- [ ] Performance optimization applied
- [ ] Security audit completed

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Recommended Platforms
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: Railway, Render, DigitalOcean App Platform, AWS EC2
- **Database**: PostgreSQL on Railway, Supabase, AWS RDS
- **Cache**: Redis Cloud, AWS ElastiCache
- **CDN**: CloudFlare, AWS CloudFront
- **Monitoring**: Sentry, LogRocket, New Relic

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes with conventional commits
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request with detailed description

### Code Standards
- Use ESLint and Prettier for consistent code formatting
- Follow conventional commit message format
- Write comprehensive tests for new features
- Update documentation for significant changes
- Review code for security vulnerabilities

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

**Types**: feat, fix, docs, style, refactor, test, chore

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or contributions:
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check `/docs` directory for detailed guides
- **Email**: Contact development team at support@mitaoe.edu
- **Discord**: Join our community server for real-time support

---

**Built with ❤️ by MIT Academy of Engineering**

*Empowering education through artificial intelligence*