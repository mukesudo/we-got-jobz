'use client';
import React from 'react';
import { Button } from './button';

export function Pagination({ page, hasMore, onPrev, onNext, isLoading }: {
  page: number;
  hasMore: boolean;
  onPrev: () => void;
  onNext: () => void;
  isLoading?: boolean;
}) {
  return (
    <div className="flex justify-center gap-4 mt-8">
      <Button onClick={onPrev} disabled={page === 1 || isLoading} variant="secondary">Previous</Button>
      <span className="px-2 py-2">Page {page}</span>
      <Button onClick={onNext} disabled={!hasMore || isLoading} variant="secondary">Next</Button>
    </div>
  );
}
