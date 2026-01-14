
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


type User = {
  id: string;
  name: string;
  email: string;
};

type Job = {
  id: string;
  title: string;
};  

type DisputedContract = Contract & {
  job: Job;
  client: User;
  talent: User;
};

type Contract = {
  id: string;
  status: string;
};



export default function DisputeManagementPage() {
  const [disputes, setDisputes] = useState<DisputedContract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDisputes() {
      try {
        const response = await fetch('/api/admin/disputes');
        if (!response.ok) {
          throw new Error('Failed to fetch disputes');
        }
        const data = await response.json();
        setDisputes(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    }
    fetchDisputes();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dispute Management</h1>
      <Card className="p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talent</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {disputes.map((dispute) => (
              <tr key={dispute.id}>
                <td className="px-6 py-4 whitespace-nowrap">{dispute.job.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{dispute.client.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{dispute.talent.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{dispute.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/disputes/${dispute.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
