'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

enum ContractStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

type User = {
  id: string;
  name: string;
  email: string;
};

type Job = {
  id: string;
  title: string;
};  

type Contract = {
  id: string;
  status: ContractStatus;
};

type DisputedContractDetails = Contract & {
  job: Job;
  client: User;
  talent: User;
  amount: number;
};

export default function DisputeDetailsPage() {
  const [dispute, setDispute] = useState<DisputedContractDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<ContractStatus | null>(null);

  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      async function fetchDispute() {
        try {
          const response = await fetch(`/api/admin/disputes/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch dispute details');
          }
          const data = await response.json();
          setDispute(data);
          setNewStatus(data.status);
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
      fetchDispute();
    }
  }, [id]);

  const handleStatusChange = async () => {
    if (!dispute || !newStatus) return;

    try {
      const response = await fetch(`/api/admin/disputes/${dispute.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update dispute status');
      }
      
      router.push('/admin/disputes');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!dispute) return <div>Dispute not found.</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dispute Details</h1>
      <Card className="p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">{dispute.job.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><strong>Client:</strong> {dispute.client.name}</div>
          <div><strong>Talent:</strong> {dispute.talent.name}</div>
          <div><strong>Amount:</strong> ${dispute.amount}</div>
          <div><strong>Status:</strong> {dispute.status}</div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Update Status</h2>
        <Select onValueChange={(value) => setNewStatus(value as ContractStatus)} defaultValue={dispute.status}>
          <SelectTrigger>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ContractStatus).map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={() => router.push('/admin/disputes')}>Cancel</Button>
          <Button className="ml-4" onClick={handleStatusChange}>Save Changes</Button>
        </div>
      </Card>
    </div>
  );
}
