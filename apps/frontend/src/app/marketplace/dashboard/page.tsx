import { Card } from "@/components/ui/card";
import { DollarSign, Users, Briefcase, Bell } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const stats = [
    { title: "Revenue", value: "$4,050", icon: <DollarSign /> },
    { title: "Active Bids", value: "12", icon: <Briefcase /> },
    { title: "New Messages", value: "3", icon: <Bell /> },
    { title: "Active Clients", value: "5", icon: <Users /> },
  ];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <Card className="p-6">
            <ul>
              <li className="flex justify-between items-center py-3 border-b">
                <span>You placed a bid on "Build a Next.js App"</span>
                <span className="text-muted-foreground text-sm">2 hours ago</span>
              </li>
              <li className="flex justify-between items-center py-3 border-b">
                <span>Client "Acme Inc" accepted your proposal</span>
                <span className="text-muted-foreground text-sm">1 day ago</span>
              </li>
              <li className="flex justify-between items-center py-3">
                <span>New message from "John Doe"</span>
                <span className="text-muted-foreground text-sm">3 days ago</span>
              </li>
            </ul>
          </Card>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
          <Card className="p-6">
            <ul className="space-y-3">
              <li><Link href="/jobs/create" className="text-primary hover:underline">Post a New Job</Link></li>
              <li><Link href="/marketplace/jobs" className="text-primary hover:underline">Browse Jobs</Link></li>
              <li><Link href="/marketplace/profile" className="text-primary hover:underline">Update Profile</Link></li>
              <li><Link href="/marketplace/settings" className="text-primary hover:underline">Account Settings</Link></li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}