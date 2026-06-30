import Student from '../models/Student.js';
import Placement from '../models/Placement.js';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const getReportStats = async (req, res) => {
  try {
    const totalPlacements = await Placement.countDocuments({ status: 'Completed' });
    const avgPackageResult = await Placement.aggregate([
      { $match: { status: 'Completed', ctc: { $ne: null } } },
      { $group: { _id: null, avgCtc: { $avg: '$ctc' } } },
    ]);
    const avgPackageLPA = avgPackageResult[0]?.avgCtc
      ? Number((avgPackageResult[0].avgCtc / 100000).toFixed(2))
      : 0;

    const eligiblePool = await Student.countDocuments({ isEligible: true });
    const companiesVisited = await Placement.distinct('companyName').then((arr) => arr.length);

    res.json({ totalPlacements, avgPackageLPA, eligiblePool, companiesVisited });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBranchPlacements = async (req, res) => {
  try {
    const branches = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical'];
    const data = await Promise.all(
      branches.map(async (branch) => {
        const total = await Student.countDocuments({ branch });
        const placed = await Student.countDocuments({ branch, placementStatus: 'Placed' });
        return { branch, total, placed };
      })
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlacementTrend = async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();

    const data = await Promise.all(
      MONTH_NAMES.map(async (_, monthIndex) => {
        const start = new Date(year, monthIndex, 1);
        const end = new Date(year, monthIndex + 1, 1);
        const count = await Placement.countDocuments({
          createdAt: { $gte: start, $lt: end },
          status: 'Completed',
        });
        return { month: MONTH_NAMES[monthIndex], value: count };
      })
    );

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
