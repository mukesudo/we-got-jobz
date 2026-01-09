'use client';

import React from 'react';
import { useSession } from '@/lib/auth-client';
import Navbar from '@/components/layout/navbar';

export default function DashboardPage() {
  const { session } = useSession();
  const [stats, setStats] = React.useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!session?.user) return;

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [session]);

  if (!session?.user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="text-center">
            <p className="text-gray-600">Please log in to view your dashboard</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600">
              Welcome back, {session.user.name || session.user.email}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Stats cards */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase">Active Projects</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{typeof stats?.activeProjects === 'number' ? stats.activeProjects : 0}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase">Total Earnings</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">${typeof stats?.totalEarnings === 'number' ? stats.totalEarnings : 0}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase">Completed Jobs</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{typeof stats?.completedJobs === 'number' ? stats.completedJobs : 0}</p>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase">Rating</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{typeof stats?.rating === 'number' ? stats.rating : 'N/A'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
