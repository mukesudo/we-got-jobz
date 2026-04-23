'use client';

import { useEffect, useState } from 'react';
import { ContractsService } from '@/lib/contracts.service';
import type { Contract } from '@/lib';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  async function loadContracts() {
    try {
      setLoading(true);
      setError(null);
      const data = await ContractsService.getMyContracts();
      setContracts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contracts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadContracts();
  }, []);

  const handleComplete = async (id: string) => {
    try {
      setActionLoadingId(id);
      await ContractsService.markComplete(id);
      await loadContracts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete contract');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDispute = async (id: string) => {
    try {
      setActionLoadingId(id);
      await ContractsService.raiseDispute(id);
      await loadContracts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to dispute contract');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading contracts...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Contracts</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <Card className="p-6">
        {contracts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No contracts yet.</p>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div
                key={contract.id}
                className="flex flex-col gap-3 rounded-md border p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold">{contract.project?.title || 'Untitled project'}</p>
                  <p className="text-sm text-muted-foreground">
                    Status: {contract.status} | Amount: ${contract.amount}
                  </p>
                </div>

                {contract.status === 'ACTIVE' ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={actionLoadingId === contract.id}
                      onClick={() => handleDispute(contract.id)}
                    >
                      Dispute
                    </Button>
                    <Button
                      disabled={actionLoadingId === contract.id}
                      onClick={() => handleComplete(contract.id)}
                    >
                      Mark Complete
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No actions available</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
