import { Card } from "@/components/ui/card";
import { Users, Briefcase, DollarSign, Flag } from "lucide-react";

export default function AdminDashboardPage() {
  const adminStats = [
    { title: "Total Users", value: "1,250", icon: <Users /> },
    { title: "Total Jobs", value: "3,400", icon: <Briefcase /> },
    { title: "Platform Revenue", value: "$50,000", icon: <DollarSign /> },
    { title: "Reported Issues", value: "15", icon: <Flag /> },
  ];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {adminStats.map((stat, index) => (
          <Card key={index} className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className="bg-primary text-primary-foreground p-3 rounded-full">
              {stat.icon}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent User Registrations</h2>
          <Card className="p-6">
            {/* User list would be dynamically rendered here */}
            <ul>
              <li className="flex justify-between items-center py-2 border-b">
                <span>Alice (alice@example.com)</span>
                <span className="text-muted-foreground text-sm">Joined 2 hours ago</span>
              </li>
              <li className="flex justify-between items-center py-2 border-b">
                <span>Bob (bob@example.com)</span>
                <span className="text-muted-foreground text-sm">Joined 1 day ago</span>
              </li>
              <li className="flex justify-between items-center py-2">
                <span>Charlie (charlie@example.com)</span>
                <span className="text-muted-foreground text-sm">Joined 3 days ago</span>
              </li>
            </ul>
          </Card>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Platform Moderation</h2>
          <Card className="p-6">
            {/* Moderation items would be dynamically rendered here */}
            <ul>
                <li className="flex justify-between items-center py-2 border-b">
                    <span>Dispute between Client X and Freelancer Y</span>
                    <a href="#" className="text-primary hover:underline text-sm">Review</a>
                </li>
                <li className="flex justify-between items-center py-2">
                    <span>New report on Job "XYZ"</span>
                    <a href="#" className="text-primary hover:underline text-sm">Investigate</a>
                </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
