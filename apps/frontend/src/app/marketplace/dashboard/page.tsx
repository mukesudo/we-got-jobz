'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Users,
  Briefcase,
  ArrowRight,
  FileText,
  CheckCircle2,
  Clock,
  MessageSquare,
  Wallet,
  PlusCircle,
  Search,
} from 'lucide-react';
import { UsersService, type UserStatsResponse } from '@/lib/users.service';

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await UsersService.getMyStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const cards = useMemo(() => {
    if (!stats) return [];

    if (stats.role === 'CLIENT') {
      return [
        {
          title: 'Jobs Posted',
          value: String(stats.stats.jobsPosted ?? 0),
          icon: <Briefcase className="h-5 w-5" />,
          href: '/marketplace/jobs/my-jobs',
          tone: 'blue',
        },
        {
          title: 'Open Jobs',
          value: String(stats.stats.openJobs ?? 0),
          icon: <FileText className="h-5 w-5" />,
          href: '/marketplace/jobs/my-jobs?status=OPEN',
          tone: 'emerald',
        },
        {
          title: 'Active Contracts',
          value: String(stats.stats.activeContracts ?? 0),
          icon: <CheckCircle2 className="h-5 w-5" />,
          href: '/marketplace/contracts',
          tone: 'violet',
        },
        {
          title: 'Wallet Balance',
          value: `$${(stats.stats.walletBalance ?? 0).toLocaleString()}`,
          icon: <Wallet className="h-5 w-5" />,
          href: '/marketplace/settings#billing',
          tone: 'amber',
        },
      ] as const;
    }

    return [
      {
        title: 'Pending Bids',
        value: String(stats.stats.activeBids ?? 0),
        icon: <Clock className="h-5 w-5" />,
        href: '/marketplace/jobs',
        tone: 'blue',
      },
      {
        title: 'Accepted Bids',
        value: String(stats.stats.acceptedBids ?? 0),
        icon: <CheckCircle2 className="h-5 w-5" />,
        href: '/marketplace/contracts',
        tone: 'emerald',
      },
      {
        title: 'Active Contracts',
        value: String(stats.stats.activeContracts ?? 0),
        icon: <Briefcase className="h-5 w-5" />,
        href: '/marketplace/contracts',
        tone: 'violet',
      },
      {
        title: 'Wallet Balance',
        value: `$${(stats.stats.walletBalance ?? 0).toLocaleString()}`,
        icon: <Wallet className="h-5 w-5" />,
        href: '/marketplace/settings#billing',
        tone: 'amber',
      },
    ] as const;
  }, [stats]);

  const toneClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 md:px-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 md:px-6">Error: {error}</div>;
  }

  const isClient = stats?.role === 'CLIENT';

  const quickLinks = isClient
    ? [
        { label: 'Post a new job', href: '/jobs/create', icon: PlusCircle },
        { label: 'Find talent', href: '/marketplace/talent', icon: Search },
        { label: 'Manage contracts', href: '/marketplace/contracts', icon: Briefcase },
        { label: 'Messages', href: '/marketplace/messages', icon: MessageSquare },
      ]
    : [
        { label: 'Browse jobs', href: '/marketplace/jobs', icon: Search },
        { label: 'My contracts', href: '/marketplace/contracts', icon: Briefcase },
        { label: 'Edit my profile', href: '/marketplace/profile/edit', icon: FileText },
        { label: 'Messages', href: '/marketplace/messages', icon: MessageSquare },
      ];

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back. Here's a quick overview of your activity.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat) => (
          <Link key={stat.title} href={stat.href} className="block group">
            <Card className="p-5 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer h-full">
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-2.5 ${toneClasses[stat.tone]}`}>
                  {stat.icon}
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="mb-3 text-lg font-semibold">Snapshot</h2>
          <Card className="divide-y divide-slate-100">
            <Link
              href="/marketplace/messages"
              className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Unread messages</p>
                  <p className="text-xs text-muted-foreground">
                    {stats?.stats.unreadMessages ?? 0} waiting for your reply
                  </p>
                </div>
              </div>
              <span className="text-xl font-semibold text-slate-900">
                {stats?.stats.unreadMessages ?? 0}
              </span>
            </Link>

            <Link
              href={isClient ? '/marketplace/jobs/my-jobs' : '/marketplace/contracts'}
              className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  {isClient ? <Clock className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {isClient ? 'In-progress jobs' : 'Completed contracts'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isClient
                      ? 'Jobs currently being delivered'
                      : 'All time deliveries'}
                  </p>
                </div>
              </div>
              <span className="text-xl font-semibold text-slate-900">
                {isClient
                  ? stats?.stats.inProgressJobs ?? 0
                  : stats?.stats.completedContracts ?? 0}
              </span>
            </Link>

            <Link
              href="/marketplace/profile"
              className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Account role</p>
                  <p className="text-xs text-muted-foreground">
                    Switch in settings any time
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-700 capitalize">
                {stats?.role.toLowerCase()}
              </span>
            </Link>
          </Card>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Quick actions</h2>
          <Card className="p-3">
            <ul className="space-y-1">
              {quickLinks.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors group"
                  >
                    <Icon className="h-4 w-4 text-slate-400 group-hover:text-slate-700" />
                    <span className="flex-1">{label}</span>
                    <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-slate-600" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
