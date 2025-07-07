# AI-Course-MITAOE 🎓

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Stytch](https://img.shields.io/badge/Stytch-Auth-purple)
![WorqHat](https://img.shields.io/badge/WorqHat-AI-orange)
A comprehensive AI-powered learning and assessment platform designed for engineering institutions. This modern system enables teachers to create intelligent courses, generate questions aligned with Bloom's Taxonomy, and evaluate student performance through advanced analytics. Built with cutting-edge authentication via Stytch and AI integration through WorqHat APIs, featuring a robust database schema with WorqHat Database for scalable data management.

## 🚀 Architecture Overview

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
│  ├── Stytch Authentication (Magic Links)                        │
│  ├── JWT Token Management                                       │
│  ├── Role-Based Authorization                                   │
│  ├── Controllers (Route Handlers)                               │
│  ├── Services (Business Logic)                                  │
│  ├── Validators (Input Validation)                              │
│  └── AI Integration (WorqHat APIs)                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ WorqHat Database API
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  WorqHat Database                                                │
│  ├── User Management System                                     │
│  ├── School & Course Hierarchy                                  │
│  ├── Chapter & Topic Organization                               │
│  ├── Test & Question Management                                 │
│  ├── Enrollment & Submission Tracking                           │
│  ├── Analytics & Performance Data                               │
│  └── Notification System                                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ External Services
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
├─────────────────────────────────────────────────────────────────┤
│  ├── Stytch (Authentication & User Management)                  │
│  ├── WorqHat AI (Question Generation & Analysis)                │
│  ├── WorqHat Database (Data Storage)                            │
│  └── Email Services (Notifications)                             │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

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
- **TypeScript** - Type-safe backend development
- **JWT** - JSON Web Tokens for secure session management
- **Winston** - Professional logging solution
- **Express Validator** - Input validation middleware

### Database & Authentication
- **WorqHat Database** - Cloud-based database solution with direct API integration
- **Stytch** - Modern authentication platform with magic links
- **JWT** - Stateless authentication tokens
- **Encryption** - Data security and privacy protection

### AI/ML Integration
- **WorqHat AI APIs** - Advanced AI models for question generation and content analysis
- **Natural Language Processing** - Content categorization and analysis
- **Bloom's Taxonomy Engine** - Intelligent question classification
- **Automated Grading** - AI-powered assessment evaluation

## 📊 Database Schema

### Core Entities Overview

```
Schools (1) → (Many) Users
Schools (1) → (Many) Courses
Semesters (1) → (Many) Courses
Users (Teachers) (1) → (Many) Courses
Courses (1) → (Many) Chapters
Chapters (1) → (Many) Topics
Topics (1) → (Many) Tests
Tests (Many) ← → (Many) Questions (via TestQuestions)
Questions (1) → (Many) TestCases
Users (Students) (Many) ← → (Many) Courses (via Enrollments)
```

### Database Tables

#### 1. User Table
```typescript
interface User {
  id: string;                    // UUID Primary Key
  name: string;                  // Full name
  username: string;              // Unique username
  prn: number;                   // Unique PRN number
  email: string;                 // Unique email
  password: string;              // Hashed password
  role: Role;                    // ADMIN | TEACHER | STUDENT
  schoolId?: string;             // Optional foreign key to School
  createdAt: Date;               // Creation timestamp
  
  // Relations
  teachingCourses: Course[];     // Courses taught (teachers)
  enrollments: Enrollment[];     // Course enrollments (students)
  createdTests: Test[];          // Tests created (teachers)
  createdQuestions: Question[];  // Questions created (teachers)
  testStatuses: TestStatus[];    // Test progress tracking
  testSubmissions: TestSubmission[]; // Test submissions
  notifications: Notification[]; // User notifications
}
```

#### 2. School Table
```typescript
interface School {
  id: string;                    // UUID Primary Key
  name: string;                  // Unique school name
  createdAt: Date;               // Creation timestamp
  
  // Relations
  users: User[];                 // School users
  courses: Course[];             // School courses
}
```

#### 3. Semester Table
```typescript
interface Semester {
  id: string;                    // UUID Primary Key
  name: string;                  // Semester name (e.g., "Fall 2024")
  createdAt: Date;               // Creation timestamp
  
  // Relations
  courses: Course[];             // Semester courses
}
```

#### 4. Course Table
```typescript
interface Course {
  id: string;                    // UUID Primary Key
  name: string;                  // Course name
  description?: string;          // Optional description
  enrollmentKey: string;         // Unique enrollment key
  teacherId: string;             // Foreign key to User (teacher)
  schoolId: string;              // Foreign key to School
  semesterId: string;            // Foreign key to Semester
  createdAt: Date;               // Creation timestamp
  
  // Relations
  teacher: User;                 // Course teacher
  school: School;                // Associated school
  semester: Semester;            // Associated semester
  chapters: Chapter[];           // Course chapters
  enrollments: Enrollment[];     // Student enrollments
  tests: Test[];                 // Course tests
  questions: Question[];         // Course questions
}
```

#### 5. Chapter Table
```typescript
interface Chapter {
  id: string;                    // UUID Primary Key
  name: string;                  // Chapter name
  courseId: string;              // Foreign key to Course
  createdAt: Date;               // Creation timestamp
  
  // Relations
  course: Course;                // Parent course
  topics: Topic[];               // Chapter topics
}
```

#### 6. Topic Table
```typescript
interface Topic {
  id: string;                    // UUID Primary Key
  name: string;                  // Topic name
  chapterId: string;             // Foreign key to Chapter
  createdAt: Date;               // Creation timestamp
  
  // Relations
  chapter: Chapter;              // Parent chapter
  tests: Test[];                 // Topic tests
}
```

#### 7. Test Table
```typescript
interface Test {
  id: string;                    // UUID Primary Key
  name: string;                  // Test name
  totalMarks: number;            // Total marks
  duration: number;              // Duration in minutes
  startTime: Date;               // Test start time
  endTime: Date;                 // Test end time
  maxAttempts: number;           // Maximum attempts allowed
  courseId: string;              // Foreign key to Course
  teacherId: string;             // Foreign key to User (teacher)
  topicId: string;               // Foreign key to Topic
  createdAt: Date;               // Creation timestamp
  
  // Relations
  course: Course;                // Associated course
  teacher: User;                 // Test creator
  topic: Topic;                  // Associated topic
  testQuestions: TestQuestion[]; // Test questions (many-to-many)
  testStatuses: TestStatus[];    // Student test statuses
  testSubmissions: TestSubmission[]; // Test submissions
}
```

#### 8. Question Table
```typescript
interface Question {
  id: string;                    // UUID Primary Key
  text: string;                  // Question text
  type: QuestionType;            // MCQ | DIRECT_ANSWER | CODING
  difficulty: number;            // Difficulty level (1-5)
  options: string[];             // Multiple choice options
  correctAnswer: string;         // Correct answer
  hints: string[];               // Hints array
  problemStatement?: string;     // Coding problem statement
  inputFormat?: string;          // Coding input format
  outputFormat?: string;         // Coding output format
  constraints?: string;          // Coding constraints
  courseId: string;              // Foreign key to Course
  teacherId: string;             // Foreign key to User (teacher)
  createdAt: Date;               // Creation timestamp
  
  // Relations
  course: Course;                // Associated course
  teacher: User;                 // Question creator
  testCases: TestCase[];         // Coding test cases
  testQuestions: TestQuestion[]; // Test associations
  testSubmissions: TestSubmission[]; // Student submissions
}
```

#### 9. TestCase Table
```typescript
interface TestCase {
  id: string;                    // String Primary Key (not UUID)
  questionId: string;            // Foreign key to Question
  input: string;                 // Input data
  expectedOutput: string;        // Expected output
  isHidden: boolean;             // Hidden test case flag
  createdAt: Date;               // Creation timestamp
  
  // Relations
  question: Question;            // Associated question
}
```

#### 10. Enrollment Table
```typescript
interface Enrollment {
  id: string;                    // UUID Primary Key
  studentId: string;             // Foreign key to User (student)
  courseId: string;              // Foreign key to Course
  status: EnrollmentStatus;      // ENROLLED | UNENROLLED
  completedTestIds: string[];    // Array of completed test IDs
  enrolledAt: Date;              // Enrollment timestamp
  
  // Relations
  student: User;                 // Enrolled student
  course: Course;                // Enrolled course
}
```

#### 11. TestQuestion Table (Junction)
```typescript
interface TestQuestion {
  id: string;                    // UUID Primary Key
  testId: string;                // Foreign key to Test
  questionId: string;            // Foreign key to Question
  isValid: boolean;              // Question validity flag
  
  // Relations
  test: Test;                    // Associated test
  question: Question;            // Associated question
}
```

#### 12. TestStatus Table
```typescript
interface TestStatus {
  id: string;                    // UUID Primary Key
  studentId: string;             // Foreign key to User (student)
  testId: string;                // Foreign key to Test
  status: TestStatusType;        // NOT_STARTED | IN_PROGRESS | COMPLETED
  cheatingReason?: string;       // Optional cheating detection reason
  lastUpdated: Date;             // Last update timestamp
  
  // Relations
  student: User;                 // Student taking test
  test: Test;                    // Associated test
}
```

#### 13. TestSubmission Table
```typescript
interface TestSubmission {
  id: string;                    // UUID Primary Key
  studentId: string;             // Foreign key to User (student)
  testId: string;                // Foreign key to Test
  questionId: string;            // Foreign key to Question
  answer: string;                // Student's answer
  marksObtained: number;         // Marks obtained (default: 0)
  hintsUsed: number;             // Number of hints used (default: 0)
  submittedAt: Date;             // Submission timestamp
  
  // Relations
  student: User;                 // Student who submitted
  test: Test;                    // Associated test
  question: Question;            // Associated question
}
```

#### 14. Notification Table
```typescript
interface Notification {
  id: string;                    // UUID Primary Key
  userId: string;                // Foreign key to User
  message: string;               // Notification message
  type: NotificationType;        // Notification type enum
  seen: boolean;                 // Seen status (default: false)
  createdAt: Date;               // Creation timestamp
  
  // Relations
  user: User;                    // Notification recipient
}
```

### Enums

```typescript
enum Role {
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT"
}

enum QuestionType {
  MCQ = "MCQ",
  DIRECT_ANSWER = "DIRECT_ANSWER",
  CODING = "CODING"
}

enum EnrollmentStatus {
  ENROLLED = "ENROLLED",
  UNENROLLED = "UNENROLLED"
}

enum TestStatusType {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED"
}

enum NotificationType {
  CREATED_TEST = "CREATED_TEST",
  ADMIN_NOTIFICATION = "ADMIN_NOTIFICATION",
  CREATED_COURSE = "CREATED_COURSE",
  COURSE_ENROLLED = "COURSE_ENROLLED"
}
```

## 📁 Project Structure

```
AI-Course-MITAOE/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts           # WorqHat Database configuration
│   │   │   ├── env.ts                # Environment configuration
│   │   │   └── stytch.ts             # Stytch client setup
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts    # Authentication logic
│   │   │   ├── course.controller.ts  # Course management
│   │   │   ├── test.controller.ts    # Test management
│   │   │   ├── question.controller.ts # Question management
│   │   │   └── user.controller.ts    # User management
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts    # JWT verification
│   │   │   ├── role.middleware.ts    # Role-based access control
│   │   │   └── errorHandler.ts       # Error handling
│   │   ├── routes/
│   │   │   ├── auth/
│   │   │   │   └── auth.routes.ts    # Authentication routes
│   │   │   ├── admin/
│   │   │   │   └── admin.routes.ts   # Admin routes
│   │   │   ├── teacher/
│   │   │   │   └── teacher.routes.ts # Teacher routes
│   │   │   └── student/
│   │   │       └── student.routes.ts # Student routes
│   │   ├── services/
│   │   │   ├── auth.service.ts       # Authentication business logic
│   │   │   ├── course.service.ts     # Course operations
│   │   │   ├── test.service.ts       # Test operations
│   │   │   ├── question.service.ts   # Question operations
│   │   │   ├── ai.service.ts         # AI integration
│   │   │   └── user.service.ts       # User operations
│   │   ├── validators/
│   │   │   ├── auth.validator.ts     # Authentication validation
│   │   │   ├── course.validator.ts   # Course validation
│   │   │   ├── test.validator.ts     # Test validation
│   │   │   └── question.validator.ts # Question validation
│   │   ├── types/
│   │   │   ├── auth.ts               # Auth type definitions
│   │   │   ├── course.ts             # Course type definitions
│   │   │   ├── test.ts               # Test type definitions
│   │   │   └── question.ts           # Question type definitions
│   │   ├── utils/
│   │   │   ├── jwt.ts                # JWT utilities
│   │   │   ├── logger.ts             # Logging utilities
│   │   │   ├── worqhat.ts            # WorqHat Database client
│   │   │   └── ai.ts                 # AI utilities
│   │   └── errors/
│   │       ├── ApiError.ts           # Custom error classes
│   │       └── errorHandler.ts       # Global error handler
│   ├── package.json
│   └── app.ts                        # Main application file
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui base components
│   │   │   ├── layout/
│   │   │   │   ├── app-sidebar.tsx   # Application sidebar
│   │   │   │   ├── nav-main.tsx      # Main navigation
│   │   │   │   └── nav-user.tsx      # User navigation
│   │   │   ├── auth/
│   │   │   │   ├── login-form.tsx    # Login component
│   │   │   │   └── signup-form.tsx   # Registration component
│   │   │   ├── course/
│   │   │   │   ├── course-card.tsx   # Course display component
│   │   │   │   ├── course-form.tsx   # Course creation form
│   │   │   │   └── chapter-form.tsx  # Chapter creation form
│   │   │   ├── test/
│   │   │   │   ├── test-card.tsx     # Test display component
│   │   │   │   ├── test-form.tsx     # Test creation form
│   │   │   │   └── test-taking.tsx   # Test taking interface
│   │   │   ├── question/
│   │   │   │   ├── question-form.tsx # Question creation form
│   │   │   │   ├── mcq-question.tsx  # MCQ question component
│   │   │   │   ├── coding-question.tsx # Coding question component
│   │   │   │   └── ai-generate.tsx   # AI question generation
│   │   │   └── shared/
│   │   │       ├── loading.tsx       # Loading components
│   │   │       ├── error-boundary.tsx # Error boundary
│   │   │       └── analytics.tsx     # Analytics components
│   │   ├── pages/
│   │   │   ├── Authentication/
│   │   │   │   └── AuthenticateLayout.tsx
│   │   │   ├── Admin/
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── Schools.tsx
│   │   │   │   ├── Users.tsx
│   │   │   │   └── Analytics.tsx
│   │   │   ├── Teacher/
│   │   │   │   ├── TeacherDashboard.tsx
│   │   │   │   ├── Courses.tsx
│   │   │   │   ├── CreateCourse.tsx
│   │   │   │   ├── Tests.tsx
│   │   │   │   ├── CreateTest.tsx
│   │   │   │   ├── Questions.tsx
│   │   │   │   ├── CreateQuestion.tsx
│   │   │   │   └── Analytics.tsx
│   │   │   └── Student/
│   │   │       ├── StudentDashboard.tsx
│   │   │       ├── Courses.tsx
│   │   │       ├── EnrollCourse.tsx
│   │   │       ├── TakeTest.tsx
│   │   │       ├── TestHistory.tsx
│   │   │       └── Progress.tsx
│   │   ├── hooks/
│   │   │   ├── AuthContext.tsx       # Authentication context
│   │   │   ├── userContext.tsx       # User state management
│   │   │   ├── useApi.tsx            # API interaction hook
│   │   │   ├── useCourse.tsx         # Course operations hook
│   │   │   ├── useTest.tsx           # Test operations hook
│   │   │   └── useQuestion.tsx       # Question operations hook
│   │   ├── services/
│   │   │   ├── api.js                # Base API configuration
│   │   │   ├── auth.service.js       # Authentication API
│   │   │   ├── course.service.js     # Course API
│   │   │   ├── test.service.js       # Test API
│   │   │   ├── question.service.js   # Question API
│   │   │   └── user.service.js       # User API
│   │   ├── utils/
│   │   │   ├── constants.js          # Application constants
│   │   │   ├── helpers.js            # Utility functions
│   │   │   └── validation.js         # Client-side validation
│   │   ├── assets/
│   │   │   └── logo_MITAOE.jpg       # Institution logo
│   │   ├── lib/
│   │   │   └── utils.ts              # Utility functions
│   │   └── main.tsx                  # Application entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── docs/
│   ├── api/                          # API documentation
│   ├── database/                     # Database schema docs
│   └── deployment/                   # Deployment guides
│
├── .env.example
├── docker-compose.yml
└── README.md
```

## 🔐 Authentication System

### Stytch Magic Link Authentication
The platform uses Stytch's modern authentication system with magic links for secure, passwordless login:

1. **Magic Link Flow**
   - User enters email address
   - Stytch sends magic link to email
   - User clicks link to authenticate
   - Backend verifies token and creates session

2. **User Registration**
   - New users complete profile after first authentication
   - Profile includes name, PRN, role, and school information
   - Data stored in WorqHat Database via direct API calls

3. **Session Management**
   - JWT tokens for stateless authentication
   - 7-day token expiration
   - Secure token refresh mechanism

### Role-Based Access Control

**Admin Role (Role: ADMIN)**
- Full system access and configuration
- User management and role assignment
- School and system-wide settings management
- Global analytics and reporting access
- User creation and deletion
- System-wide notifications

**Teacher Role (Role: TEACHER)**
- Course creation and management
- Chapter and topic content management
- Test creation with AI-powered question generation
- Question bank management with multiple question types
- Student enrollment management
- Student progress monitoring and analytics
- Test case creation for coding questions
- Notification management for courses

**Student Role (Role: STUDENT)**
- Course enrollment using enrollment keys
- Access to enrolled course content
- Test taking with time limits and attempt tracking
- Performance analytics and progress tracking
- Notification viewing
- Test history and submission review

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/send-magic-link` - Send magic link to user email
- `POST /api/auth/authenticate` - Authenticate magic link token
- `POST /api/auth/complete-signup` - Complete user registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### User Management
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/notifications` - Get user notifications
- `PUT /api/user/notifications/:id/read` - Mark notification as read

### Admin Routes
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/schools` - List all schools
- `POST /api/admin/schools` - Create new school
- `GET /api/admin/analytics` - System-wide analytics

### Course Management
- `GET /api/courses` - List courses (role-based filtering)
- `POST /api/courses` - Create new course (teachers only)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course (teachers only)
- `DELETE /api/courses/:id` - Delete course (teachers only)
- `POST /api/courses/:id/enroll` - Enroll in course (students only)
- `GET /api/courses/:id/chapters` - Get course chapters
- `POST /api/courses/:id/chapters` - Create new chapter
- `GET /api/courses/:id/topics` - Get course topics
- `POST /api/courses/:id/topics` - Create new topic

### Test Management
- `GET /api/tests` - List tests (role-based filtering)
- `POST /api/tests` - Create new test (teachers only)
- `GET /api/tests/:id` - Get test details
- `PUT /api/tests/:id` - Update test (teachers only)
- `DELETE /api/tests/:id` - Delete test (teachers only)
- `POST /api/tests/:id/start` - Start test (students only)
- `POST /api/tests/:id/submit` - Submit test answers (students only)
- `GET /api/tests/:id/results` - Get test results
- `GET /api/tests/:id/status` - Get test status for student

### Question Management
- `GET /api/questions` - List questions (teachers only)
- `POST /api/questions` - Create new question (teachers only)
- `GET /api/questions/:id` - Get question details
- `PUT /api/questions/:id` - Update question (teachers only)
- `DELETE /api/questions/:id` - Delete question (teachers only)
- `POST /api/questions/generate` - AI-powered question generation
- `POST /api/questions/:id/test-cases` - Create test cases (coding questions)

### Analytics
- `GET /api/analytics/course/:id` - Course analytics
- `GET /api/analytics/test/:id` - Test analytics
- `GET /api/analytics/student/:id` - Student performance analytics
- `GET /api/analytics/teacher/:id` - Teacher analytics

## 🚀 Installation and Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Stytch account and API keys
- WorqHat account and API keys
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
# Initialize WorqHat Database connection
npm run db:init

# Create database tables (if needed)
npm run db:setup

# Seed the database (optional)
npm run db:seed
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

## 🔧 Environment Variables

### Backend (.env)
```bash
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database Configuration
WORQHAT_DATABASE_URL="your-worqhat-database-url"
WORQHAT_DATABASE_API_KEY="your-worqhat-database-api-key"

# Stytch Configuration
STYTCH_PROJECT_ID=your-stytch-project-id
STYTCH_SECRET=your-stytch-secret-key
STYTCH_PUBLIC_TOKEN=your-stytch-public-token

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRY=7d

# WorqHat Configuration
WORQHAT_API_KEY=your-worqhat-api-key
WORQHAT_DATABASE_URL=your-worqhat-database-url
WORQHAT_DATABASE_API_KEY=your-worqhat-database-api-key

# AI Configuration
AI_QUESTION_GENERATION_ENDPOINT=your-ai-endpoint
AI_GRADING_ENDPOINT=your-ai-grading-endpoint
```

### Frontend (.env)
```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=AI Course MITAOE

# Application Configuration
VITE_NODE_ENV=development
VITE_APP_VERSION=1.0.0

# Stytch Configuration
VITE_STYTCH_PUBLIC_TOKEN=your-stytch-public-token
```

## 🎯 Key Features

### Current Features
- ✅ **Magic Link Authentication** - Passwordless login via Stytch
- ✅ **User Registration** - Complete signup with profile information
- ✅ **Role-Based Access** - Admin, Teacher, Student roles
- ✅ **JWT Authentication** - Secure session management
- ✅ **Profile Management** - User profile updates
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Input Validation** - Server-side validation
- ✅ **Logging** - Professional logging with Winston
- ✅ **TypeScript** - Full type safety
- ✅ **WorqHat Database** - Direct API integration for data persistence

### Upcoming Features
- 🔄 **Course Management** - Create and manage courses with hierarchical structure
- 🔄 **Chapter & Topics** - Organize course content systematically
- 🔄 **Test Creation** - Build comprehensive assessments with AI
- 🔄 **Question Generation** - AI-powered question creation with multiple types
- 🔄 **Student Enrollment** - Secure course enrollment with keys
- 🔄 **Performance Analytics** - Advanced reporting and insights
- 🔄 **Real-time Notifications** - Live updates and alerts
- 🔄 **Mobile Optimization** - Responsive design for all devices
- 🔄 **Coding Question Support** - Test cases and automated grading
- 🔄 **Bloom's Taxonomy Integration** - Intelligent question classification