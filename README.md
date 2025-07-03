# AI-Course-MITAOE


An AI-powered learning and assessment platform designed for engineering institutions. It enables teachers to manage courses, generate intelligent test questions aligned with Bloom's Taxonomy, and evaluate student performance with advanced analytics. With role-based access (Admin, Teacher, Student), real-time notifications, and intuitive UI, the platform brings together AI and education effectively.

---

  Architecture Overview


┌────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                            │
├────────────────────────────────────────────────────────────────┤
│  React + Vite Frontend                                         │
│  ├── TypeScript, Tailwind CSS                                  │
│  ├── Component Library (shadcn/ui)                             │                         │
└────────────────────────────────────────────────────────────────┘
                                │
                                │ REST API
                                ▼
┌────────────────────────────────────────────────────────────────┐
│                    APPLICATION / API LAYER                     │
├────────────────────────────────────────────────────────────────┤
│  Node.js + Express Backend                                     │
│  ├── Controllers, Services, Middleware                         │
│  ├── Role-based Auth (JWT)                                     │
│  ├── Real-time Notifications (Redis)                           │
│  └── Question Generation (AI models / external APIs)           │
└────────────────────────────────────────────────────────────────┘
                                │
                                │ ORM
                                ▼
┌────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                            │
├────────────────────────────────────────────────────────────────┤
│  PostgreSQL + Prisma ORM                                       │
│  ├── Prisma Schema, Relations                                  │
│  ├── Migrations & Seed Data                                    │
│  └── Encrypted Enrollment Keys                                 │
└────────────────────────────────────────────────────────────────┘


---

  Technology Stack

 Frontend

* React 18+ + Vite  – Fast, modern SPA development
* TypeScript – Static typing
* Tailwind CSS – Utility-first CSS
* shadcn/ui + Radix UI – Modern, accessible components

 Backend

* Node.js + Express.js – REST API backend
* Prisma – Type-safe ORM for PostgreSQL
* PostgreSQL – Relational database
* Redis – Real-time pub-sub for notifications
* Crypto & Bcrypt – Secure enrollment key encryption

 AI/ML

* WorqHat APIs 

 Authentication

* Role-Based Access Control – Admin, Teacher, Student

---

  Folder Structure 


AI-Course-MITAOE/
├── Backend/
│   ├── package.json
│   ├── package-lock.json
│   ├
│   └── src/
│       ├── server.js
│       ├── config/
│       │   ├── database.js
│       │   └── passport.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── course.controller.js
│       │   ├── createquestion.js
│       │   ├── enrollment.controller.js
│       │   ├── getschool.js
│       │   ├── getsemesterController.js
│       │   ├── manualtestController.js
│       │   ├── questionbank.js
│       │   ├── schoolController.js
│       │   ├── semester.controller.js
│       │   ├── testController.js
│       │   └── user.controller.js
│       ├── errors/
│       │   ├── ApiError.js
│       │   ├── errorHandler.js
│       │   └── index.js
│       ├── middleware/
│       │   ├── auth.middleware.js
│       │   ├── session.middleware.js
│       │   └── validation.middleware.js
│       ├── routes/.     //remove any
│       │   ├── auth/
│       │   │   └── auth.routes.js
│       │   ├── getschoolRoutes.js
│       │   ├── getsemesterRoutes.js
│       │   ├── manualtestRoutes.js
│       │   ├── questionbankroutes.js
│       │   ├── questionRoutes.js
│       │   ├── studentRoutes/
│       │   │   ├── course.routes.js
│       │   │   ├── semister.routes.js
│       │   │   ├── test.routes.js
│       │   │   └── user.routes.js
│       │   ├── teacherRoutes/
│       │   │   ├── course.routes.js
│       │   │   └── schoolRoutes.js
│       │   └── testRoutes.js
│       ├── services/
│       │   ├── auth.service.js
│       │   ├── course.service.js
│       │   ├── enrollment.service.js
│       │   ├── schoolService.js
│       │   ├── test.service.js
│       │   └── user.service.js
│       ├── utils/
│       │   ├── bcrypt.js
│       │   ├── crypto.js
│       │   ├── EmailTemplates.js
│       │   ├── jwt.js
│       │   └── resend.js
│       └── validators/
│           
├── Frontend
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.cjs
│   ├── public
│   │   └── logo.png
│   ├── README.md
│   ├── src
│   │   ├── app
│   │   │   └── dashboard
│   │   │       └── page.tsx
│   │   ├── App.tsx
│   │   ├── assets
│   │   │   ├── logo_MITAOE.jpg
│   │   │   └── MITAOE Landing IMAGE.jpg
│   │   ├── components
│   │   │   ├── 404.tsx
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── login-form.tsx
│   │   │   ├── mode-toggle.tsx
│   │   │   ├── nav-main.tsx
│   │   │   ├── nav-projects.tsx
│   │   │   ├── nav-user.tsx
│   │   │   ├── protectedRoute.tsx
│   │   │   ├── signup-from.tsx
│   │   │   ├── team-switcher.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   └── ui
│   │   │       ├── accordion.tsx
│   │   │       ├── alert-dialog.tsx
│   │   │       ├── aspect-ratio.tsx
│   │   │       ├── avatar.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── breadcrumb.tsx
│   │   │       ├── button.tsx
│   │   │       ├── calendar.tsx
│   │   │       ├── card.tsx
│   │   │       ├── chart.tsx
│   │   │       ├── checkbox.tsx
│   │   │       ├── collapsible.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── hover-card.tsx
│   │   │       ├── input-otp.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── pagination.tsx
│   │   │       ├── popover.tsx
│   │   │       ├── progress.tsx
│   │   │       ├── radio-group.tsx
│   │   │       ├── scroll-area.tsx
│   │   │       ├── select.tsx
│   │   │       ├── separator.tsx
│   │   │       ├── sheet.tsx
│   │   │       ├── sidebar.tsx
│   │   │       ├── skeleton.tsx
│   │   │       ├── table.tsx
│   │   │       ├── tabs.tsx
│   │   │       ├── textarea.tsx
│   │   │       └── tooltip.tsx
│   │   ├── Database
│   │   │   └── 
│   │   ├── Functions
│   │   │   └── RegisterApi.ts
│   │   ├── hooks
│   │   │   ├── AuthContext.tsx
│   │   │   ├── studentCoursesContext.tsx
│   │   │   ├── studentDashboardContext.tsx
│   │   │   ├── use-mobile.tsx
│   │   │   └── userContext.tsx
│   │   ├── index.css
│   │   ├── Interfaces
│   │   │   ├── AppSidebar.tsx
│   │   │   ├── Database.tsx
│   │   │   └── MissionandVision.tsx
│   │   ├── lib
│   │   │   └── utils.ts
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   ├── Admin
│   │   │   │   ├── adminDashboardContents.tsx
│   │   │   │   ├── Schools.tsx
│   │   │   │   └── usersList.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── Authentication
│   │   │   │   ├── AuthenticateLayout.tsx
│   │   │   │   └── ForgotPassword.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── student
│   │   │   │   ├── assets
│   │   │   │   │   ├── contactForm.webp
│   │   │   │   │   ├── MITAOE-black.png
│   │   │   │   │   ├── MITAOE-white.png
│   │   │   │   │   ├── Teaching-Data-Structures-and-Algorithms.jpg
│   │   │   │   │   └── User.png
│   │   │   │   ├── common
│   │   │   │   │   ├── ComingSoon.tsx
│   │   │   │   │   ├── CountDownTimer.tsx
│   │   │   │   │   ├── IconAndLabel.tsx
│   │   │   │   │   └── ProgressCircular.tsx
│   │   │   │   ├── Contact.tsx
│   │   │   │   ├── courses
│   │   │   │   │   ├── Card.tsx
│   │   │   │   │   ├── Chapter.tsx
│   │   │   │   │   ├── Course.tsx
│   │   │   │   │   ├── PieChart.tsx
│   │   │   │   │   ├── QuestionAnalysis.tsx
│   │   │   │   │   ├── Test.tsx
│   │   │   │   │   ├── TestAnalytics.tsx
│   │   │   │   │   ├── TestCard.tsx
│   │   │   │   │   └── Topic.tsx
│   │   │   │   ├── Courses.tsx
│   │   │   │   ├── Dashboard
│   │   │   │   │   └── TimeLine.tsx
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Notifications.tsx
│   │   │   │   ├── sitehhome
│   │   │   │   │   ├── CourseEnroll.tsx
│   │   │   │   │   ├── Department.tsx
│   │   │   │   │   └── SchoolCard.tsx
│   │   │   │   ├── SiteHome.tsx
│   │   │   │   └── Test
│   │   │   │       ├── Question.tsx
│   │   │   │       ├── TestPage.tsx
│   │   │   │       ├── Timer.tsx
│   │   │   │       └── Webcam.tsx
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── TeacherDashboard.tsx
│   │   │   ├── teachers
│   │   │   │   ├── CourseLayout.tsx
│   │   │   │   ├── Courses
│   │   │   │   │   ├── Chapter.tsx
│   │   │   │   │   ├── Course.tsx
│   │   │   │   │   ├── TestCard.tsx
│   │   │   │   │   └── Topic.tsx
│   │   │   │   ├── CourseSettings.tsx
│   │   │   │   ├── CreateCourse.tsx
│   │   │   │   ├── CreateQuestion.tsx
│   │   │   │   ├── CreateTest.tsx
│   │   │   │   ├── CreateTestManually.tsx
│   │   │   │   ├── generate-question.tsx
│   │   │   │   ├── ListCourses.tsx
│   │   │   │   ├── question-bank.tsx
│   │   │   │   ├── SiteHome.tsx
│   │   │   │   ├── TeacherDashboard.tsx
│   │   │   │   ├── TeacherNotification.tsx
│   │   │   │   └── TimeSettings.tsx
│   │   │   └── UserProfile.tsx
│   │   ├── Spinner
│   │   │   └── Spinner.tsx
│   │   └── vite-env.d.ts
│   ├── table.toggleAllPageRowsSelected(!!value)}
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── README.md



---

  Authentication & Authorization Flow

* Users log in via the frontend login page.
* Backend middleware verifies token on protected routes.
* Role-based permissions check whether user can access/modify resources.

 Roles:

* Admin: Manages users, system settings
* Teacher: Creates courses, tests, questions
* Student: Takes tests, views performance, receives notifications

---

  Features

* Course/Chapter/Topic creation and management
* AI-generated questions (MCQ, Short Answer)
* Real-time test assignment and submission
* Auto-grading & analytics (test stats, charts)
* Encrypted enrollment key verification
* Notifications for new tests, updates, results
* Role-specific dashboards

---

  Setup Instructions

 Backend


 1. Navigate to backend folder
cd Backend

 2. Install backend dependencies
npm install

 3. Setup environment variables
cp .env.example .env
 Then update .env with correct DATABASE_URL and other secrets

 4. Generate Prisma Client
npx prisma generate

 5. Apply DB migrations (creates tables in PostgreSQL)
npx prisma migrate dev --name init

 6. Start the development server with nodemon
npm run dev



 Frontend

bash
 1. Navigate to frontend folder
cd Frontend

 2. Install frontend dependencies
npm install

 3. Setup environment variables
cp .env.example .env
 Fill in API URL (e.g., http://localhost:5000/api) and Firebase vars if used

 4. Start the Vite dev server
npm run dev



---

  Environment Variables

 Backend (`.env`)


PORT=5000
DATABASE_URL
 Email API
RESEND_API_KEY
RESEND_EMAIL

GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
ENCRYPTION_KEY
REDIS_URL


 Frontend (`.env`)


VITE_API_URL=http://localhost:5000/api




  License

This project is licensed under the MIT License.



