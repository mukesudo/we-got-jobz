import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Briefcase, Mail, Phone, User, Edit } from "lucide-react";

export default function ProfilePage({ params }: { params: { id: string } }) {
  // Fetch user data based on params.id
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://github.com/shadcn.png",
    title: "Senior Developer",
    bio: "Passionate about building scalable web applications and contributing to open source. 10+ years of experience in the tech industry.",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "GraphQL"],
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-6">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-lg text-muted-foreground">{user.title}</p>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" /> {user.email}
              </div>
            </div>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0">
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </div>

        <Separator className="my-8" />

        <div>
          <h2 className="text-2xl font-bold mb-4">About Me</h2>
          <p className="text-muted-foreground leading-relaxed">{user.bio}</p>
        </div>

        <Separator className="my-8" />

        <div>
          <h2 className="text-2xl font-bold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill) => (
              <div key={skill} className="bg-secondary text-secondary-foreground rounded-full px-4 py-2 text-sm">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
