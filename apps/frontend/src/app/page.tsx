import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, DollarSign, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-background text-foreground py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              &quot;Find Your Next Great Hire, or Your Next Great Gig&quot;
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We connect top-tier freelance talent with innovative companies. Whether you&apos;re looking to hire experts or find your next project, your search ends here.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/marketplace/jobs">
                  Find a Job <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/jobs/create">
                  Post a Job
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Post a Job</h3>
                <p className="text-muted-foreground">
                  Clients post their project requirements, and our platform instantly notifies relevant freelancers.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Find & Hire Talent</h3>
                <p className="text-muted-foreground">
                  Browse profiles, review proposals, and hire the perfect candidate for your project.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full p-4 mb-4">
                  <DollarSign className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Work & Get Paid</h3>
                <p className="text-muted-foreground">
                  Collaborate seamlessly and get paid securely through our escrow-powered payment system.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 border rounded-lg">
                <ShieldCheck className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                <p className="text-muted-foreground">
                  With our escrow system, your funds are held safely until the work is completed and approved.
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                 <Search className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Vetted Talent</h3>
                <p className="text-muted-foreground">
                  Access a pool of pre-screened professionals with verified skills and work history.
                </p>
              </div>
              <div className="p-6 border rounded-lg">
                <Briefcase className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">All-in-One Platform</h3>
                <p className="text-muted-foreground">
                  From job posting to messaging and payments, manage your entire freelance workflow in one place.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}