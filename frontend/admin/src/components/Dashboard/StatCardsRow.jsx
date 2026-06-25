import { Users, GraduationCap, Target, Briefcase } from "lucide-react";
import { StatCard } from "../Common";
import { COLORS } from "../../constants/colors";

export function StatCardsRow({ data, loading }) {
  const stats = [
    {
      title: "Total Students",
      value: data?.totalStudents || "0",
      subtitle: "Enrolled this academic year",
      icon: <Users size={20} />,
      trend: "+12%",
      color: COLORS.INDIGO,
    },
    {
      title: "Eligible Students",
      value: data?.eligibleStudents || "0",
      subtitle: "Meeting 7.0+ CGPA criteria",
      icon: <GraduationCap size={20} />,
      trend: "+8%",
      color: COLORS.EMERALD,
    },
    {
      title: "Avg. AI Score",
      value: data?.averageCGPA?.toFixed(1) || "0",
      subtitle: "Across all assessed students",
      icon: <Target size={20} />,
      trend: "+3.2",
      color: COLORS.PURPLE,
    },
    {
      title: "Active Drives",
      value: data?.activePlacementDrives || "0",
      subtitle: "3 interviews scheduled this week",
      icon: <Briefcase size={20} />,
      trend: "+2",
      color: COLORS.AMBER,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <StatCard 
          key={idx}
          loading={loading}
          title={stat.title}
          value={String(stat.value)}
          subtitle={stat.subtitle}
          icon={stat.icon}
          trend={stat.trend}
          color={stat.color}
        />
      ))}
    </div>
  );
}
