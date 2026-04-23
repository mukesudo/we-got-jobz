'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { BidsService } from '@/lib/bids.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserRole } from '@/lib';

type JobBid = {
  id: string;
  amount: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  coverLetter?: string | null;
  estimatedHours?: number | null;
  freelancer?: {
    id: string;
    name?: string | null;
    freelancerProfile?: {
      title?: string | null;
    } | null;
  } | null;
};

type BidManagementProps = {
  jobClientId?: string;
  bids: JobBid[];
};

export default function BidManagement({ jobClientId, bids }: BidManagementProps) {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const [loadingBidId, setLoadingBidId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currentUser = sessionData?.user as
    | { id?: string; role?: UserRole }
    | undefined;

  const canManage = useMemo(() => {
    return (
      !!sessionData?.session &&
      currentUser?.id === jobClientId &&
      currentUser?.role === UserRole.CLIENT
    );
  }, [currentUser?.id, currentUser?.role, jobClientId, sessionData?.session]);

  const handleAccept = async (id: string) => {
    try {
      setError(null);
      setLoadingBidId(id);
      await BidsService.accept(id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept bid');
    } finally {
      setLoadingBidId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setError(null);
      setLoadingBidId(id);
      await BidsService.reject(id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject bid');
    } finally {
      setLoadingBidId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposals ({bids.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        {bids.length === 0 ? (
          <p className="text-sm text-muted-foreground">No proposals yet.</p>
        ) : (
          <div className="space-y-3">
            {bids.map((bid) => (
              <div key={bid.id} className="rounded-md border p-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {bid.freelancer?.name || 'Freelancer'}{' '}
                      <span className="text-xs text-muted-foreground">
                        {bid.freelancer?.freelancerProfile?.title || ''}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Bid: ${bid.amount}
                      {bid.estimatedHours ? ` | Est. ${bid.estimatedHours} hrs` : ''}
                    </p>
                    {bid.coverLetter && (
                      <p className="mt-2 text-sm text-muted-foreground">{bid.coverLetter}</p>
                    )}
                    <p className="mt-1 text-xs font-medium">Status: {bid.status}</p>
                  </div>

                  {canManage && bid.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={loadingBidId === bid.id}
                        onClick={() => handleReject(bid.id)}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        disabled={loadingBidId === bid.id}
                        onClick={() => handleAccept(bid.id)}
                      >
                        Accept
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
