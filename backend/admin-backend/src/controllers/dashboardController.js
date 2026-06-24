import Student from '../models/Student.js';
import Placement from '../models/Placement.js';
import Activity from '../models/Activity.js';

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const eligibleStudents = await Student.countDocuments({ isEligible: true });
    const placedStudents = await Student.countDocuments({ placementStatus: 'Placed' });
    const activePlacementDrives = await Placement.countDocuments({ status: 'Active' });

    const placementRate = totalStudents > 0 ? ((placedStudents / totalStudents) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        eligibleStudents,
        placedStudents,
        placementRate,
        activePlacementDrives,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get top students
export const getTopStudents = async (req, res) => {
  try {
    const topStudents = await Student.find()
      .sort({ cgpa: -1 })
      .limit(8)
      .select('name branch cgpa placementStatus companyPlaced');

    // Add badge based on CGPA
    const studentsWithBadge = topStudents.map((student, index) => {
      let badge = 'Good';
      if (student.cgpa >= 9.5) badge = 'Exceptional';
      else if (student.cgpa >= 9.0) badge = 'Outstanding';
      else if (student.cgpa >= 8.5) badge = 'Excellent';

      return {
        rank: index + 1,
        name: student.name,
        branch: student.branch,
        cgpa: student.cgpa,
        score: Math.round(student.cgpa * 10),
        badge,
        placementStatus: student.placementStatus,
        companyPlaced: student.companyPlaced,
      };
    });

    res.status(200).json({
      success: true,
      data: studentsWithBadge,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get recent activities
export const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('relatedStudentId', 'name')
      .populate('relatedPlacementId', 'companyName');

    const formattedActivities = activities.map((activity) => {
      const now = new Date();
      const activityTime = new Date(activity.createdAt);
      const diffMs = now - activityTime;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      let timeAgo = `${diffMins} min ago`;
      if (diffMins < 1) timeAgo = 'Just now';
      else if (diffHours > 0) timeAgo = `${diffHours}h ago`;
      else if (diffDays > 0) timeAgo = `${diffDays}d ago`;

      return {
        text: activity.text,
        time: timeAgo,
        type: activity.type,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedActivities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get performance data (monthly)
export const getPerformanceData = async (req, res) => {
  try {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const performanceData = [];

    const now = new Date();
    const currentYear = now.getFullYear();

    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(currentYear, i, 1);
      const monthEnd = new Date(currentYear, i + 1, 0);

      const placementsInMonth = await Placement.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
        status: 'Completed',
      });

      const studentCGPAAvg = await Student.aggregate([
        {
          $match: {
            createdAt: { $gte: monthStart, $lte: monthEnd },
          },
        },
        {
          $group: {
            _id: null,
            avgCGPA: { $avg: '$cgpa' },
          },
        },
      ]);

      const score = studentCGPAAvg.length > 0 ? Math.round(studentCGPAAvg[0].avgCGPA * 10) : 70;

      performanceData.push({
        month: months[i],
        score,
        placements: placementsInMonth,
      });
    }

    res.status(200).json({
      success: true,
      data: performanceData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get branch distribution
export const getBranchDistribution = async (req, res) => {
  try {
    const branches = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    const branchData = await Promise.all(
      branches.map(async (branch, index) => {
        const count = await Student.countDocuments({ branch });
        return {
          name: branch,
          value: count,
          color: colors[index],
        };
      })
    );

    res.status(200).json({
      success: true,
      data: branchData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select('name email rollNumber branch cgpa placementStatus companyPlaced salary');

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all placement drives
export const getAllPlacementDrives = async (req, res) => {
  try {
    const drives = await Placement.find().sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      data: drives,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
