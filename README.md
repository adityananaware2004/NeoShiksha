#NeoShiksha-Learning Management System

A comprehensive Learning Management System (LMS) built with React.js, Node.js, and MongoDB. This platform enables instructors to create and manage courses while providing students with an interactive learning experience.

## 🚀 Features

### For Students
- *Course Discovery*: Browse and search through a wide variety of courses
- *Interactive Learning*: Watch video lectures with progress tracking
- *Course Progress*: Mark lectures as complete and track learning progress
- *Enrollment Management*: Purchase and enroll in courses
- *Profile Management*: Update personal information and preferences
- *Learning Dashboard*: View enrolled courses and progress

### For Instructors
- *Course Creation*: Build comprehensive courses with sections and subsections
- *Content Management*: Upload videos, add descriptions, and organize content
- *Student Analytics*: Track student progress and engagement
- *Course Publishing*: Publish courses for public access
- *Instructor Dashboard*: Manage all courses and view analytics

### Technical Features
- *Responsive Design*: Works seamlessly on desktop, tablet, and mobile
- *Real-time Progress Tracking*: Track learning progress in real-time
- *Secure Authentication*: JWT-based authentication with role-based access
- *Payment Integration*: Secure payment processing with Razorpay
- *File Upload*: Cloudinary integration for media uploads
- *Email Notifications*: Automated email notifications for various events

## 🛠 Tech Stack

### Frontend
- *React.js*: Modern UI library for building user interfaces
- *Redux Toolkit*: State management for complex application state
- *Tailwind CSS*: Utility-first CSS framework for styling
- *React Router*: Client-side routing
- *Axios*: HTTP client for API communication
- *React Hook Form*: Form handling and validation

### Backend
- *Node.js*: JavaScript runtime environment
- *Express.js*: Web application framework
- *MongoDB*: NoSQL database for data storage
- *Mongoose*: MongoDB object modeling
- *JWT*: JSON Web Tokens for authentication
- *bcrypt*: Password hashing and verification
- *Multer*: File upload handling
- *Nodemailer*: Email sending functionality

### External Services
- *Cloudinary*: Cloud-based image and video management
- *Razorpay*: Payment gateway integration
- *MongoDB Atlas*: Cloud database hosting

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

### Setup Instructions

1. *Clone the repository*
   bash
   git clone <repository-url>
   cd MindForgeCodex
   

2. *Install dependencies*
   bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   

3. *Environment Configuration*
   
   Create .env files in both root and server directories:

   **Root .env (Frontend)**
   env
   REACT_APP_BASE_URL=http://localhost:4000
   

   **Server .env (Backend)**
   env
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CORS_ORIGIN=http://localhost:3000
   
   # Cloudinary Configuration
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FOLDER_NAME=your_cloudinary_folder_name
   
   # Razorpay Configuration
   RAZORPAY_KEY=your_razorpay_key
   RAZORPAY_SECRET=your_razorpay_secret
   
   # Email Configuration
   MAIL_HOST=your_smtp_host
   MAIL_USER=your_email
   MAIL_PASS=your_email_password
   

4. *Database Setup*
   
   Run the sample data script to populate the database:
   bash
   cd server
   node sampleData.js
   

5. *Start the application*
   bash
   # Start both frontend and backend (from root directory)
   npm run dev
   
   # Or start separately
   npm start          # Frontend (port 3000)
   npm run server     # Backend (port 4000)
   

## 📊 Sample Data

The application comes with pre-configured sample data including:
- *5 Categories*: Web Development, Data Science, Mobile Development, Cybersecurity, DevOps
- *3 Instructors*: Nilesh Shinde, Omkar Patil,Swapnil Jadhav
- *2 Students*: Rahul Sawant, Amruta Phadke
- *3 Sample Courses*: Complete Web Development Bootcamp, Data Science & Machine Learning Masterclass, Mobile App Development with React Native

### Sample Login Credentials
- *Instructor*: nanawareaditya41@gmail.com / 123456
- *Student*: amruta.phadke@student.com / Student123

## 🔧 API Endpoints

### Authentication
- POST /api/v1/auth/signup - User registration
- POST /api/v1/auth/login - User login
- POST /api/v1/auth/logout - User logout
- POST /api/v1/auth/reset-password-token - Request password reset
- POST /api/v1/auth/reset-password - Reset password

### Courses
- GET /api/v1/course/getAllCourses - Get all published courses
- POST /api/v1/course/getCourseDetails - Get course details
- POST /api/v1/course/createCourse - Create new course (Instructor only)
- POST /api/v1/course/editCourse - Edit course (Instructor only)
- POST /api/v1/course/updateCourseProgress - Update course progress (Student only)

### Payments
- POST /api/v1/payment/capturePayment - Process payment
- POST /api/v1/payment/verifyPayment - Verify payment signature

### Profile
- PUT /api/v1/profile/updateProfile - Update user profile
- DELETE /api/v1/profile/deleteAccount - Delete user account

## 🎯 Key Features Implementation

### Course Progress Tracking
The system automatically creates course progress records when students enroll and tracks completed lectures in real-time.

### Video Player Integration
Custom video player with progress tracking and lecture completion functionality.

### Responsive Design
Mobile-first approach with Tailwind CSS ensuring optimal experience across all devices.

### Security Features
- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Input validation and sanitization


### Planned Features
- *Real-time Chat*: Student-instructor communication
- *Live Classes*: Video conferencing integration
- *AI-powered Recommendations*: Course suggestions
- *Mobile App*: React Native application
- *Advanced Analytics*: Detailed learning analytics
- *Multi-language Support*: Internationalization

## 🙏 Acknowledgments

- *Design Inspiration*: Modern e-learning platforms
- *Icons*: React Icons library
- *UI Components*: Custom-built with Tailwind CSS
- *Backend Architecture*: RESTful API best practices

---

*NeoShiksha*- Empowering education through technology
