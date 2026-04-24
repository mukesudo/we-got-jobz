import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Briefcase,
  DollarSign,
  Search,
  ShieldCheck,
  Star,
  Users,
  Zap,
  Globe,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/get-session";
import { UserRole } from "@/lib";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'We Got Jobz - Where talent meets opportunity. Connect with top-rated freelancers and visionary companies. Secure escrow payments, verified reviews, and seamless project management.',
  keywords: [
    'freelance marketplace',
    'hire freelancers',
    'find remote work',
    'freelance jobs',
    'remote work',
    'contract work',
    'gig economy',
    'freelance platform'
  ],
  openGraph: {
    title: 'We Got Jobz - Where Talent Meets Opportunity',
    description: 'Connect with top-rated freelancers and visionary companies. Secure escrow payments, verified reviews, and seamless project management.',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'We Got Jobz',
  description: 'Premier freelance marketplace connecting businesses with talented professionals worldwide',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://we-gotjobz.com',
  logo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://we-gotjobz.com'}/logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@wegotjobz.com',
    contactType: 'customer service',
  },
  sameAs: [
    'https://twitter.com/wegotjobz',
    'https://linkedin.com/company/wegotjobz',
  ],
};

export default async function LandingPage() {
  const session = await getSession();
  const userRole = session?.user?.role;

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <meta name="google-site-verification" content="TisjEgAeymUqCQ_uC4Q6Jb5zS_zvGfTz1gDlM6wmjDk" />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-24 md:py-36">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
            <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-indigo-500/15 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
            {/* Grid pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-8 text-sm font-medium text-blue-200">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span>Trusted by 10,000+ professionals worldwide</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Where Talent Meets
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
                Opportunity
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop scrolling through endless job boards. We match exceptional freelancers
              with visionary companies — so you can focus on doing what you do best.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100 h-14 px-8 text-base font-semibold rounded-xl shadow-lg shadow-white/10 transition-all hover:shadow-white/20 hover:scale-[1.02]">
                <Link href="/marketplace/jobs">
                  Find Work <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {userRole === UserRole.CLIENT ? (
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white h-14 px-8 text-base font-semibold rounded-xl border border-blue-500/30 transition-all hover:scale-[1.02]">
                  <Link href="/jobs/create">Post a Job</Link>
                </Button>
              ) : userRole === UserRole.FREELANCER ? (
                <Button asChild size="lg" className="bg-transparent border border-white/20 text-white hover:bg-white/10 hover:text-white h-14 px-8 text-base font-semibold rounded-xl transition-all hover:scale-[1.02]">
                  <Link href="/marketplace/profile">
                    My Profile
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-transparent border border-white/20 text-white hover:bg-white/10 hover:text-white h-14 px-8 text-base font-semibold rounded-xl transition-all hover:scale-[1.02]">
                  <Link href="/auth/signup">
                    Join as a Client
                  </Link>
                </Button>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { number: "50K+", label: "Active Freelancers" },
                { number: "12K+", label: "Projects Completed" },
                { number: "98%", label: "Client Satisfaction" },
                { number: "$25M+", label: "Paid to Freelancers" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white">{stat.number}</p>
                  <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Simple process</p>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                Get started in minutes
              </h2>
              <p className="text-lg text-slate-500 max-w-xl mx-auto">
                Whether you&apos;re hiring or looking for work, our streamlined process gets you moving fast.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: <Briefcase className="h-7 w-7" />,
                  step: "01",
                  title: "Post or Browse",
                  description:
                    "Clients describe their project needs. Freelancers browse curated opportunities that match their skills — no noise, just relevant work.",
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  icon: <Search className="h-7 w-7" />,
                  step: "02",
                  title: "Connect & Collaborate",
                  description:
                    "Review proposals, check verified portfolios, and start a conversation. Find the right fit based on skills, reviews, and track record.",
                  gradient: "from-violet-500 to-purple-500",
                },
                {
                  icon: <DollarSign className="h-7 w-7" />,
                  step: "03",
                  title: "Work & Get Paid",
                  description:
                    "Track milestones, submit deliverables, and get paid through our secure escrow system. No chasing invoices — just reliable payments.",
                  gradient: "from-emerald-500 to-teal-500",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="group relative bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-2">
                    Step {item.step}
                  </p>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Why We Got Jobz</p>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
                Built for professionals who mean business
              </h2>
              <p className="text-lg text-slate-500 max-w-xl mx-auto">
                Every feature is designed to remove friction and let you focus on what matters — great work.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  icon: <ShieldCheck className="h-6 w-6" />,
                  title: "Escrow Protection",
                  description: "Funds are held securely until milestones are approved. Both parties are protected — always.",
                  color: "text-emerald-600 bg-emerald-50",
                },
                {
                  icon: <Star className="h-6 w-6" />,
                  title: "Verified Reviews",
                  description: "Every review comes from a completed contract. No fake ratings — just authentic feedback you can trust.",
                  color: "text-amber-600 bg-amber-50",
                },
                {
                  icon: <Globe className="h-6 w-6" />,
                  title: "Global Talent Pool",
                  description: "Access skilled professionals from every timezone. Build distributed teams that deliver around the clock.",
                  color: "text-blue-600 bg-blue-50",
                },
                {
                  icon: <TrendingUp className="h-6 w-6" />,
                  title: "Smart Matching",
                  description: "Our algorithm surfaces the most relevant opportunities based on your skills, experience, and preferences.",
                  color: "text-violet-600 bg-violet-50",
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Team Collaboration",
                  description: "Built-in messaging, milestone tracking, and contract management — everything you need in one platform.",
                  color: "text-rose-600 bg-rose-50",
                },
                {
                  icon: <Zap className="h-6 w-6" />,
                  title: "Instant Payouts",
                  description: "No more waiting weeks for payments. Once work is approved, funds are released to your wallet immediately.",
                  color: "text-orange-600 bg-orange-50",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-7 border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.color} mb-5`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Testimonials</p>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
                Loved by freelancers & clients
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  quote: "I landed my first $5K project within a week of signing up. The escrow system gave my client total confidence to hire someone new.",
                  name: "Sarah Chen",
                  role: "Full-Stack Developer",
                  initials: "SC",
                },
                {
                  quote: "As a startup founder, I needed to move fast. We Got Jobz helped me find a designer who understood our vision immediately.",
                  name: "Marcus Johnson",
                  role: "CEO, LaunchPad",
                  initials: "MJ",
                },
                {
                  quote: "The milestone-based payments keep projects on track. It's the most professional freelancing platform I've used.",
                  name: "Aisha Patel",
                  role: "UX Researcher",
                  initials: "AP",
                },
              ].map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="bg-slate-50 rounded-2xl p-8 border border-slate-100 flex flex-col"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed mb-6 flex-grow italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-xs text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-white/5 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-lg text-blue-100 max-w-xl mx-auto mb-10">
              Join thousands of freelancers and clients who are already building the future of work together.
            </p>
            {session?.user ? (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-slate-100 h-14 px-8 text-base font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02]">
                  <Link href="/marketplace/dashboard">
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-slate-100 h-14 px-8 text-base font-semibold rounded-xl shadow-lg transition-all hover:scale-[1.02]">
                  <Link href="/auth/signup">
                    Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" className="bg-transparent border border-white/30 text-white hover:bg-white/10 hover:text-white h-14 px-8 text-base font-semibold rounded-xl transition-all hover:scale-[1.02]">
                  <Link href="/marketplace/jobs">Browse Jobs</Link>
                </Button>
              </div>
            )}
            <div className="flex items-center justify-center gap-6 mt-10 text-sm text-blue-200">
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Free to join</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Cancel anytime</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
