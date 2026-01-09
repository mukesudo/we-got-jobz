import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, Clock, ShieldCheck } from "lucide-react";

// Placeholder data - we will replace this with a real API call later
const getJobDetails = async (id: string) => {
  console.log(`Fetching job details for id: ${id}`);
  return {
    id: "1",
    title: "Senior Full-Stack Engineer (React & Node.js)",
    company: "Innovate Inc.",
    location: "Remote",
    type: "Full-time",
    experience: "Senior",
    salary: "120,000 - 150,000",
    description: `
      <p>Innovate Inc. is at the forefront of digital transformation, and we're looking for a passionate Senior Full-Stack Engineer to join our growing team. You will be responsible for designing, developing, and maintaining our cutting-edge web applications from end to end.</p>
      <h3 class="font-bold mt-4 mb-2">Responsibilities:</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>Develop and maintain scalable web applications using React.js for the frontend and Node.js for the backend.</li>
        <li>Collaborate with cross-functional teams to define, design, and ship new features.</li>
        <li>Write clean, maintainable, and efficient code while adhering to best practices.</li>
        <li>Ensure the performance, quality, and responsiveness of applications.</li>
        <li>Identify and correct bottlenecks and fix bugs.</li>
      </ul>
      <h3 class="font-bold mt-4 mb-2">Qualifications:</h3>
      <ul class="list-disc list-inside space-y-2">
        <li>5+ years of professional experience in software development.</li>
        <li>Strong proficiency in JavaScript, TypeScript, React.js, and Node.js.</li>
        <li>Experience with RESTful APIs and modern authorization mechanisms, such as JSON Web Token.</li>
        <li>Familiarity with modern front-end build pipelines and tools like Webpack, Babel, etc.</li>
        <li>Experience with relational databases (e.g., PostgreSQL) and ORMs (e.g., Prisma).</li>
      </ul>
    `,
    client: {
      name: "John Doe",
      paymentVerified: true,
      rating: 4.9,
      reviews: 24,
    }
  };
};


export default async function JobDetailsPage({ params }: { params: { id: string } }) {
  const job = await getJobDetails(params.id);

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="bg-secondary/40">
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="bg-background rounded-lg shadow-sm p-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{job.title}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <span className="font-semibold text-lg">{job.company}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    <span>{job.salary}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>{job.experience} Level</span>
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            <div className="space-y-6">
               <Button size="lg" className="w-full text-lg">
                Submit a Proposal
              </Button>
              <Card>
                <CardHeader>
                  <CardTitle>About the Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                     <p className="font-semibold text-lg">{job.client.name}</p>
                     <div className="flex items-center gap-2 text-muted-foreground">
                        <ShieldCheck className={`h-5 w-5 ${job.client.paymentVerified ? 'text-green-500' : 'text-gray-400'}`} />
                        <span>{job.client.paymentVerified ? 'Payment method verified' : 'Payment method not verified'}</span>
                    </div>
                     <p>{job.client.rating} stars from {job.client.reviews} reviews</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}