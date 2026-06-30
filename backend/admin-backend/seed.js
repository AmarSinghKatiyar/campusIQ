import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './src/models/Student.js';
import Placement from './src/models/Placement.js';
import Activity from './src/models/Activity.js';
import Admin from './src/models/Admin.js';
import connectDB from './src/config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing existing data...');
    await Student.deleteMany({});
    await Placement.deleteMany({});
    await Activity.deleteMany({});
    await Admin.deleteMany({});

    console.log('Creating sample students...');
    const students = await Student.insertMany([
      { name: "Priya Sharma", email: "priya.sharma@university.edu", rollNumber: "CS001", branch: "Computer Science", cgpa: 9.8, batch: 2025, isEligible: true, placementStatus: "Placed", companyPlaced: "Google", salary: 2400000, profileCompletion: 100 },
      { name: "Arjun Mehta", email: "arjun.mehta@university.edu", rollNumber: "EC001", branch: "Electronics", cgpa: 9.6, batch: 2025, isEligible: true, placementStatus: "Placed", companyPlaced: "Microsoft", salary: 2200000, profileCompletion: 95 },
      { name: "Sneha Iyer", email: "sneha.iyer@university.edu", rollNumber: "CS002", branch: "Computer Science", cgpa: 9.5, batch: 2025, isEligible: true, placementStatus: "In-Progress", profileCompletion: 85 },
      { name: "Rahul Verma", email: "rahul.verma@university.edu", rollNumber: "ME001", branch: "Mechanical", cgpa: 9.3, batch: 2025, isEligible: true, placementStatus: "Placed", companyPlaced: "Infosys", salary: 1800000, profileCompletion: 80 },
      { name: "Kavya Nair", email: "kavya.nair@university.edu", rollNumber: "CS003", branch: "Computer Science", cgpa: 9.2, batch: 2025, isEligible: true, placementStatus: "Unplaced", profileCompletion: 70 },
      { name: "Dev Patel", email: "dev.patel@university.edu", rollNumber: "CV001", branch: "Civil", cgpa: 9.1, batch: 2025, isEligible: true, placementStatus: "Placed", companyPlaced: "TCS", salary: 1600000, profileCompletion: 90 },
      { name: "Ananya Singh", email: "ananya.singh@university.edu", rollNumber: "CS004", branch: "Computer Science", cgpa: 9.0, batch: 2025, isEligible: true, placementStatus: "In-Progress", profileCompletion: 75 },
      { name: "Karan Joshi", email: "karan.joshi@university.edu", rollNumber: "EC002", branch: "Electronics", cgpa: 8.9, batch: 2025, isEligible: true, placementStatus: "Placed", companyPlaced: "Wipro", salary: 1700000, profileCompletion: 85 },
    ]);

    console.log('Creating sample placements...');
    const placements = await Placement.insertMany([
      { companyName: "Google", ctc: 2400000, jobRole: "Software Engineer", registeredStudents: 45, selectedStudents: 3, status: "Completed", startDate: new Date("2024-12-01"), endDate: new Date("2024-12-10"), eligibilityCriteria: { minCGPA: 8.0, branchesAllowed: ["Computer Science", "Electronics"] } },
      { companyName: "Microsoft", ctc: 2200000, jobRole: "Software Developer", registeredStudents: 38, selectedStudents: 2, status: "Completed", startDate: new Date("2024-12-05"), endDate: new Date("2024-12-12"), eligibilityCriteria: { minCGPA: 8.5, branchesAllowed: ["Computer Science"] } },
      { companyName: "TCS", ctc: 1600000, jobRole: "Systems Engineer", registeredStudents: 120, selectedStudents: 15, status: "Active", startDate: new Date("2024-12-15"), eligibilityCriteria: { minCGPA: 7.0, branchesAllowed: ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical"] } },
      { companyName: "Infosys", ctc: 1800000, jobRole: "Software Engineer", registeredStudents: 95, selectedStudents: 12, status: "Active", startDate: new Date("2024-12-18"), eligibilityCriteria: { minCGPA: 7.5, branchesAllowed: ["Computer Science", "Electronics"] } },
    ]);

    console.log('Creating sample activities...');
    await Activity.insertMany([
      { type: "profile", text: "Priya Sharma completed profile update", relatedStudentId: students[0]._id },
      { type: "drive", text: "TCS recruitment drive registered — 45 students applied", relatedPlacementId: placements[2]._id },
      { type: "placement", text: "Arjun Mehta selected in Microsoft drive", relatedStudentId: students[1]._id, relatedPlacementId: placements[1]._id },
      { type: "other", text: "New students registered via student portal" },
      { type: "drive", text: "Infosys interview round scheduled", relatedPlacementId: placements[3]._id },
      { type: "profile", text: "Sneha Iyer updated resume in profile" },
    ]);

    console.log('Creating sample admin...');
    await Admin.create({
      name: "Dr. Rajesh Kumar",
      email: "admin@university.edu",
      password: "password123",
      role: "admin",
    });

    console.log('✅ Seed data created successfully!');
    console.log(`Created: ${students.length} students, ${placements.length} placements, ${6} activities, 1 admin`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
