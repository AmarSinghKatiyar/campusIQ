import { useEffect, useState } from "react";
import { WelcomeBanner } from "./WelcomeBanner";
import { StatCardsRow } from "./StatCardsRow";
import { PerformanceChart } from "./PerformanceChart";
import { TopStudentsTable } from "./TopStudentsTable";
import { BranchDistribution } from "./BranchDistribution";
import { RecentActivityPanel } from "./RecentActivityPanel";
import { dashboardAPI } from "../../services/api";
import { toast } from "sonner";

export function DashboardHome({ loading }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [topStudents, setTopStudents] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [stats, students, performance, branch, activities] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getTopStudents(),
        dashboardAPI.getPerformanceData(),
        dashboardAPI.getBranchDistribution(),
        dashboardAPI.getRecentActivities(),
      ]);

      setDashboardData(stats.data || stats);
      setTopStudents(students.data || students || []);
      setPerformanceData(performance.data || performance || []);
      setBranchData(branch.data || branch || []);
      setRecentActivities(activities.data || activities || []);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <WelcomeBanner />
      <StatCardsRow 
        data={dashboardData} 
        loading={loading || isLoading} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Charts + Table */}
        <div className="xl:col-span-2 space-y-6">
          <PerformanceChart data={performanceData} />
          <TopStudentsTable data={topStudents} />
        </div>

        {/* Right: Pie + Activity */}
        <div className="space-y-5">
          <BranchDistribution data={branchData} />
          <RecentActivityPanel data={recentActivities} />
        </div>
      </div>
    </div>
  );
}
