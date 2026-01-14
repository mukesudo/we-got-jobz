
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, CreditCard, Lock, User } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <nav className="flex flex-col space-y-2">
            <a href="#account" className="font-semibold text-primary flex items-center"><User className="mr-2 h-5 w-5" /> Account</a>
            <a href="#security" className="hover:text-primary flex items-center"><Lock className="mr-2 h-5 w-5" /> Security</a>
            <a href="#notifications" className="hover:text-primary flex items-center"><Bell className="mr-2 h-5 w-5" /> Notifications</a>
            <a href="#billing" className="hover:text-primary flex items-center"><CreditCard className="mr-2 h-5 w-5" /> Billing</a>
          </nav>
        </div>
        
        <div className="md:col-span-3">
          <Card id="account" className="p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue="John" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue="Doe" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" />
              </div>
            </div>
            <Button className="mt-6">Save Changes</Button>
          </Card>

          <Card id="security" className="p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Security</h2>
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="mt-4">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <Button className="mt-6">Update Password</Button>
          </Card>
          
          {/* Placeholder for Notifications and Billing sections */}
          <Card id="notifications" className="p-8 mb-12">
             <h2 className="text-2xl font-bold mb-6">Notifications</h2>
             <p className="text-muted-foreground">Notification settings coming soon.</p>
          </Card>
          
          <Card id="billing" className="p-8">
             <h2 className="text-2xl font-bold mb-6">Billing</h2>
             <p className="text-muted-foreground">Billing management coming soon.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
