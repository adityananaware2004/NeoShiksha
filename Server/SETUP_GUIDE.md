# NeoShiksha Project Setup Guide

## Prerequisites
1. **Node.js** (v16 or higher)
2. **MongoDB** (running locally or MongoDB Atlas)
3. **Git**

## Step 1: Environment Setup

### Create .env file in Server directory:
```bash
cd Server
cp env.example .env
```

### Edit .env file with your configurations:
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/neoshiksha

# Server Configuration
PORT=4000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration (optional for now)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
FOLDER_NAME=neoshiksha

# Razorpay Configuration (optional for now)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Email Configuration (optional for now)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Step 2: Install Dependencies

### Backend (Server):
```bash
cd Server
npm install
```

### Frontend:
```bash
cd ..  # Go back to root directory
npm install
```

## Step 3: Database Setup

### Start MongoDB:
- **Local MongoDB**: Make sure MongoDB is running on your system
- **MongoDB Atlas**: Use your connection string in .env file

### Clean existing data (if any):
```bash
cd Server
node cleanupData.js
```

### Generate sample data:
```bash
node runSampleData.js
```

## Step 4: Start the Application

### Start Backend Server:
```bash
cd Server
npm run dev
```

### Start Frontend (in new terminal):
```bash
# From root directory
npm start
```

## Step 5: Test the Application

### Backend URLs:
- Server: http://localhost:4000
- API Health: http://localhost:4000/api/v1/

### Frontend URLs:
- Application: http://localhost:3000

### Sample Login Credentials:

#### Instructors:
- Email: swapnil.jadhav@mindforge.com
- Password: Instructor123!

- Email: rucha.deshpande@mindforge.com
- Password: Instructor123!

- Email: omkar.patil@mindforge.com
- Password: Instructor123!

#### Students:
- Email: amruta.phadke@student.com
- Password: Student123!

- Email: rahul.sawant@student.com
- Password: Student123!

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**:
   - Make sure MongoDB is running
   - Check MONGODB_URI in .env file
   - Try: `mongodb://localhost:27017/neoshiksha`

2. **Port Already in Use**:
   - Change PORT in .env file
   - Kill existing processes on the port

3. **Module Not Found Errors**:
   - Run `npm install` in both Server and root directories
   - Check if all dependencies are installed

4. **Sample Data Generation Fails**:
   - Run cleanup first: `node cleanupData.js`
   - Check MongoDB connection
   - Ensure all models are properly created

## Project Structure

```
NeoShiksha/
├── Server/                 # Backend
│   ├── controllers/       # API controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middlewares/      # Authentication & validation
│   ├── config/           # Database & cloudinary config
│   ├── utils/            # Helper functions
│   └── mail/             # Email templates
├── src/                  # Frontend
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── slices/          # Redux slices
│   └── utils/           # Utility functions
└── public/              # Static assets
```

## Features Implemented

✅ **Authentication System**
- User registration & login
- JWT token authentication
- Role-based access (Student/Instructor)

✅ **Course Management**
- Create, edit, delete courses
- Course sections and lectures
- Course publishing system

✅ **Category System**
- Course categories
- Category-based filtering

✅ **Instructor Dashboard**
- Course statistics
- Student enrollment tracking
- Revenue analytics

✅ **Student Features**
- Course enrollment
- Progress tracking
- Course reviews and ratings

✅ **Payment Integration**
- Razorpay payment gateway
- Payment success/failure handling

✅ **Responsive Design**
- Mobile-friendly interface
- Modern UI/UX

## API Endpoints

### Authentication:
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/sendotp` - Send OTP

### Courses:
- `GET /api/v1/course/getAllCourses` - Get all courses
- `POST /api/v1/course/createCourse` - Create course
- `POST /api/v1/course/editCourse` - Edit course
- `GET /api/v1/course/getCourseDetails` - Get course details

### Categories:
- `GET /api/v1/course/showAllCategories` - Get all categories
- `POST /api/v1/course/getCategoryPageDetails` - Get category courses

### Profile:
- `GET /api/v1/profile/getUserDetails` - Get user details
- `PUT /api/v1/profile/updateProfile` - Update profile

## Development Commands

```bash
# Backend
cd Server
npm run dev          # Start development server
npm start           # Start production server

# Frontend
npm start           # Start React development server
npm run build       # Build for production

# Database
node cleanupData.js  # Clean all data
node runSampleData.js # Generate sample data
```

## Deployment

### Backend (Node.js/Express):
- Deploy to platforms like Heroku, Railway, or DigitalOcean
- Set environment variables
- Configure MongoDB connection

### Frontend (React):
- Build with `npm run build`
- Deploy to platforms like Vercel, Netlify, or GitHub Pages

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running
4. Check if all dependencies are installed

## License

This project is for educational purposes. 