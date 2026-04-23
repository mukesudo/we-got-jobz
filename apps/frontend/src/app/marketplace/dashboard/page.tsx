'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { DollarSign, Users, Briefcase, Bell } from 'lucide-react';
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
          icon: <Briefcase />,
        },
        {
          title: 'Open Jobs',
          value: String(stats.stats.openJobs ?? 0),
          icon: <Users />,
        },
        {
          title: 'Active Contracts',
          value: String(stats.stats.activeContracts ?? 0),
          icon: <Bell />,
        },
        {
          title: 'Wallet Balance',
          value: `$${(stats.stats.walletBalance ?? 0).toLocaleString()}`,
          icon: <DollarSign />,
        },
      ];
    }

    return [
      {
        title: 'Pending Bids',
        value: String(stats.stats.activeBids ?? 0),
        icon: <Briefcase />,
      },
      {
        title: 'Accepted Bids',
        value: String(stats.stats.acceptedBids ?? 0),
        icon: <Users />,
      },
      {
        title: 'Active Contracts',
        value: String(stats.stats.activeContracts ?? 0),
        icon: <Bell />,
      },
      {
        title: 'Wallet Balance',
        value: `$${(stats.stats.walletBalance ?? 0).toLocaleString()}`,
        icon: <DollarSign />,
      },
    ];
  }, [stats]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 md:px-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 md:px-6">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat) => (
          <Card key={stat.title} className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className="rounded-full bg-primary p-3 text-primary-foreground">{stat.icon}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="mb-4 text-2xl font-bold">Snapshot</h2>
          <Card className="p-6">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Unread messages: {stats?.stats.unreadMessages ?? 0}</li>
              <li>
                {stats?.role === 'CLIENT'
                  ? `In-progress jobs: ${stats?.stats.inProgressJobs ?? 0}`
                  : `Completed contracts: ${stats?.stats.completedContracts ?? 0}`}
              </li>
              <li>Role: {stats?.role}</li>
            </ul>
          </Card>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold">Quick Links</h2>
          <Card className="p-6">
            <ul className="space-y-3">
              <li>
                <Link href="/jobs/create" className="text-primary hover:underline">
                  Post a New Job
                </Link>
              </li>
              <li>
                <Link href="/marketplace/jobs" className="text-primary hover:underline">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/marketplace/contracts" className="text-primary hover:underline">
                  View Contracts
                </Link>
              </li>
              <li>
                <Link href="/marketplace/settings" className="text-primary hover:underline">
                  Account Settings
                </Link>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
