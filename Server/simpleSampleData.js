const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Profile = require('./models/Profile');
const Course = require('./models/Course');
const Section = require('./models/Section');
const SubSection = require('./models/SubSection');
const Category = require('./models/Category');
const RatingAndReview = require('./models/RatingAndReview');
const CourseProgress = require('./models/CourseProgress');
const Payment = require('./models/Payment');
const Tag = require('./models/tags');

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URL || 'mongodb://localhost:27017/neoshiksha';
    console.log('Connecting to MongoDB...');
    console.log('URI:', mongoURI);
    
    const options = {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 60000, // 60 seconds
      bufferCommands: false
    };
    
    await mongoose.connect(mongoURI, options);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Sample data
const sampleCategories = [
  { name: "Development", description: "Web and mobile development courses" },
  { name: "Data Science", description: "Data analysis and machine learning courses" },
  { name: "DevOps", description: "DevOps and cloud computing courses" },
  { name: "Cybersecurity", description: "Security and ethical hacking courses" },
  { name: "AIML", description: "Artificial Intelligence and Machine Learning courses" }
];

const sampleInstructors = [
  {
    firstName: "Swapnil",
    lastName: "Jadhav",
    email: "swapnil.jadhav@mindforge.com",
    password: "Instructor123!",
    accountType: "Instructor",
    bio: "Experienced React developer with 5+ years of experience"
  },
  {
    firstName: "Rucha",
    lastName: "Deshpande", 
    email: "rucha.deshpande@mindforge.com",
    password: "Instructor123!",
    accountType: "Instructor",
    bio: "Python expert specializing in data science and ML"
  },
  {
    firstName: "Omkar",
    lastName: "Patil",
    email: "omkar.patil@mindforge.com", 
    password: "Instructor123!",
    accountType: "Instructor",
    bio: "Full-stack developer with expertise in React Native"
  }
];

const sampleStudents = [
  {
    firstName: "Amruta",
    lastName: "Phadke",
    email: "amruta.phadke@student.com",
    password: "Student123!",
    accountType: "Student"
  },
  {
    firstName: "Rahul",
    lastName: "Sawant", 
    email: "rahul.sawant@student.com",
    password: "Student123!",
    accountType: "Student"
  }
];

const sampleCourses = [
  {
    courseName: "Complete React.js Masterclass 2024",
    courseDescription: "Learn React.js from scratch to advanced concepts with hands-on projects",
    price: 2999,
    tag: ["React", "JavaScript", "Frontend"],
    category: "Development",
    instructor: "Swapnil Jadhav",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500",
    whatYouWillLearn: "React fundamentals, Hooks, State management, Redux, Next.js",
    instructions: ["Basic JavaScript knowledge", "HTML/CSS fundamentals"],
    status: "Published"
  },
  {
    courseName: "Python for Data Science & Machine Learning",
    courseDescription: "Master Python programming for data analysis and machine learning",
    price: 3999,
    tag: ["Python", "Data Science", "Machine Learning"],
    category: "Data Science", 
    instructor: "Rucha Deshpande",
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500",
    whatYouWillLearn: "Python basics, Pandas, NumPy, Scikit-learn, Deep Learning",
    instructions: ["Basic programming concepts", "Mathematics fundamentals"],
    status: "Published"
  }
];

// Generate sample data in batches
const generateSampleData = async () => {
  try {
    console.log('🚀 Starting simple sample data generation...');

    // 1. Create categories one by one
    console.log('📂 Creating categories...');
    const createdCategories = [];
    for (const categoryData of sampleCategories) {
      const category = await Category.create(categoryData);
      createdCategories.push(category);
      console.log(`✅ Created category: ${category.name}`);
    }

    // 2. Create instructor profiles
    console.log('👨‍🏫 Creating instructor profiles...');
    const instructorProfiles = [];
    for (const instructor of sampleInstructors) {
      const profile = await Profile.create({
        gender: "Male",
        dateOfBirth: "1990-01-01",
        about: instructor.bio,
        contactNumber: 9876543210,
      });
      instructorProfiles.push(profile);
    }

    // 3. Create instructors
    console.log('👨‍🏫 Creating instructors...');
    const hashedPassword = await bcrypt.hash("Instructor123!", 10);
    const instructors = [];
    for (let i = 0; i < sampleInstructors.length; i++) {
      const instructorData = sampleInstructors[i];
      const instructor = await User.create({
        ...instructorData,
        password: hashedPassword,
        additionalDetails: instructorProfiles[i]._id,
        courses: [],
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      });
      instructors.push(instructor);
      console.log(`✅ Created instructor: ${instructor.firstName} ${instructor.lastName}`);
    }

    // 4. Create student profiles
    console.log('👨‍🎓 Creating student profiles...');
    const studentProfiles = [];
    for (const student of sampleStudents) {
      const profile = await Profile.create({
        gender: "Male",
        dateOfBirth: "2000-01-01",
        about: "Passionate learner interested in technology and programming.",
        contactNumber: 9876543210,
      });
      studentProfiles.push(profile);
    }

    // 5. Create students
    console.log('👨‍🎓 Creating students...');
    const studentHashedPassword = await bcrypt.hash("Student123!", 10);
    const students = [];
    for (let i = 0; i < sampleStudents.length; i++) {
      const studentData = sampleStudents[i];
      const student = await User.create({
        ...studentData,
        password: studentHashedPassword,
        additionalDetails: studentProfiles[i]._id,
        courses: [],
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      });
      students.push(student);
      console.log(`✅ Created student: ${student.firstName} ${student.lastName}`);
    }

    // 6. Create courses one by one
    console.log('📚 Creating courses...');
    const createdCourses = [];
    
    for (let i = 0; i < sampleCourses.length; i++) {
      const courseData = sampleCourses[i];
      const instructor = instructors.find(inst => 
        inst.firstName + " " + inst.lastName === courseData.instructor
      );
      const category = createdCategories.find(cat => cat.name === courseData.category);

      console.log(`Creating course: ${courseData.courseName}`);
      console.log(`Instructor: ${instructor.firstName} ${instructor.lastName}`);
      console.log(`Category: ${category.name}`);

      // Create course
      const course = await Course.create({
        courseName: courseData.courseName,
        courseDescription: courseData.courseDescription,
        instructor: instructor._id,
        whatYouWillLearn: courseData.whatYouWillLearn,
        price: courseData.price,
        tag: courseData.tag,
        category: category._id,
        thumbnail: courseData.thumbnail,
        instructions: courseData.instructions,
        status: courseData.status,
        studentsEnrolled: [],
        sold: Math.floor(Math.random() * 50) + 10,
      });

      console.log(`✅ Created course: ${course.courseName}`);

      // Create sections and subsections
      const sections = [];
      for (let j = 1; j <= 2; j++) { // Reduced to 2 sections
        const section = await Section.create({
          sectionName: `Section ${j}: ${courseData.courseName} - Part ${j}`,
          courseId: course._id,
        });

        const subsections = [];
        for (let k = 1; k <= 2; k++) { // Reduced to 2 subsections
          const subsection = await SubSection.create({
            title: `Lecture ${j}.${k}: Introduction to ${courseData.courseName}`,
            timeDuration: `${Math.floor(Math.random() * 20) + 10} minutes`,
            description: `Detailed explanation of ${courseData.courseName} concepts`,
            videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          });
          subsections.push(subsection._id);
        }

        section.subSection = subsections;
        await section.save();
        sections.push(section._id);
      }

      course.courseContent = sections;
      await course.save();
      createdCourses.push(course);

      // Update instructor's courses
      instructor.courses.push(course._id);
      await instructor.save();

      // Update category's courses - THIS IS THE KEY FIX
      category.courses.push(course._id);
      await category.save();
      
      console.log(`✅ Added course to category: ${category.name}`);
    }

    // 7. Create sample enrollments
    console.log('💰 Creating sample enrollments...');
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const enrolledCourses = createdCourses.slice(0, 1); // 1 course per student

      for (const course of enrolledCourses) {
        // Find the instructor for this course
        const instructor = instructors.find(inst => inst._id.equals(course.instructor));
        
        // Enroll student in course
        course.studentsEnrolled.push(student._id);
        await course.save();

        student.courses.push(course._id);
        await student.save();

        // Create course progress
        const courseProgress = await CourseProgress.create({
          courseId: course._id,
          userId: student._id,
          completedVideos: [],
        });

        // Update student's courseProgress (single ObjectId, not array)
        student.courseProgress = courseProgress._id;
        await student.save();

        // Create payment record
        await Payment.create({
          userId: student._id,
          courseId: course._id,
          orderId: `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          paymentId: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          amount: course.price,
          currency: 'INR',
          status: 'Completed',
          paymentMethod: 'Razorpay',
          transactionDate: new Date(),
          courseDetails: {
            courseName: course.courseName,
            instructorName: instructor.firstName + " " + instructor.lastName,
            thumbnail: course.thumbnail,
          },
          userDetails: {
            firstName: student.firstName,
            lastName: student.lastName,
            email: student.email,
          },
        });

        console.log(`✅ Enrolled ${student.firstName} in ${course.courseName}`);
      }
    }

    // 8. Create sample reviews
    console.log('⭐ Creating sample reviews...');
    const sampleReviews = [
      "Excellent course! Very comprehensive and well-structured.",
      "Great instructor, clear explanations, and practical examples.",
      "Highly recommended for anyone wanting to learn this technology.",
      "The course exceeded my expectations. Very practical and hands-on.",
      "Perfect balance of theory and practice. Loved the projects!",
      "Instructor explains complex concepts in a simple way.",
      "Great course material and excellent support from the instructor.",
      "Worth every penny! Learned a lot from this course.",
      "Very well organized content with real-world applications.",
      "Fantastic course for beginners and intermediate learners."
    ];

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      const enrolledCourses = createdCourses.slice(0, 1); // 1 course per student

      for (const course of enrolledCourses) {
        // 70% chance of creating a review
        if (Math.random() > 0.3) {
          const review = await RatingAndReview.create({
            user: student._id,
            course: course._id,
            rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
            review: sampleReviews[Math.floor(Math.random() * sampleReviews.length)],
          });

          // Add review to course
          course.ratingAndReviews.push(review._id);
          await course.save();

          console.log(`✅ Created review for ${course.courseName} by ${student.firstName}`);
        }
      }
    }

    console.log('\n🎉 Sample data generation completed!');
    console.log('\n📊 Summary:');
    console.log(`   👨‍🏫 Instructors: ${instructors.length}`);
    console.log(`   👨‍🎓 Students: ${students.length}`);
    console.log(`   📚 Courses: ${createdCourses.length}`);
    console.log(`   📂 Categories: ${createdCategories.length}`);
    console.log(`   ⭐ Reviews: ${await RatingAndReview.countDocuments()}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('   Instructors:');
    sampleInstructors.forEach(inst => {
      console.log(`     ${inst.email} / Instructor123!`);
    });
    console.log('   Students:');
    sampleStudents.forEach(student => {
      console.log(`     ${student.email} / Student123!`);
    });

  } catch (error) {
    console.error('❌ Error generating sample data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected');
  }
};

// Run generation
if (require.main === module) {
  connectDB().then(() => {
    generateSampleData();
  });
}

module.exports = { generateSampleData }; 