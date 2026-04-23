'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Users, Briefcase, DollarSign, Flag } from 'lucide-react';
import { AdminService, type AdminStats } from '@/lib/admin.service';
import type { Contract, User } from '@/lib';

type DisputeItem = Contract & {
  project?: { title?: string };
  client?: { name?: string | null };
  freelancer?: { name?: string | null };
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [disputes, setDisputes] = useState<DisputeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [statsData, usersData, disputesData] = await Promise.all([
          AdminService.getStats(),
          AdminService.getUsers(),
          AdminService.getDisputes(),
        ]);

        setStats(statsData);
        setUsers((usersData || []).slice(0, 5));
        setDisputes((disputesData as DisputeItem[]).slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const statCards = useMemo(
    () => [
      {
        title: 'Total Users',
        value: stats?.totalUsers?.toLocaleString() ?? '0',
        icon: <Users />,
      },
      {
        title: 'Total Jobs',
        value: stats?.totalJobs?.toLocaleString() ?? '0',
        icon: <Briefcase />,
      },
      {
        title: 'Platform Revenue',
        value: `$${(stats?.platformRevenue ?? 0).toLocaleString()}`,
        icon: <DollarSign />,
      },
      {
        title: 'Open Disputes',
        value: (stats?.disputedContracts ?? 0).toString(),
        icon: <Flag />,
      },
    ],
    [stats],
  );

  if (loading) {
    return <div className="container mx-auto px-4 py-8 md:px-6">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 md:px-6">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className="rounded-full bg-primary p-3 text-primary-foreground">{stat.icon}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-2xl font-bold">Recent Users</h2>
          <Card className="p-6">
            {users.length === 0 ? (
              <p className="text-sm text-muted-foreground">No users found.</p>
            ) : (
              <ul>
                {users.map((user) => (
                  <li key={user.id} className="flex items-center justify-between border-b py-2 last:border-b-0">
                    <span>{user.name || user.email}</span>
                    <span className="text-xs text-muted-foreground">{user.role}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold">Open Disputes</h2>
          <Card className="p-6">
            {disputes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active disputes.</p>
            ) : (
              <ul>
                {disputes.map((dispute) => (
                  <li key={dispute.id} className="flex items-center justify-between border-b py-2 last:border-b-0">
                    <span>
                      {dispute.project?.title || 'Untitled Project'}
                    </span>
                    <Link href={`/admin/disputes/${dispute.id}`} className="text-sm text-primary hover:underline">
                      Review
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
