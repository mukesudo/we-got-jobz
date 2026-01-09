'use client';

import React from 'react';
import Link from 'next/link';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    description: string;
    category?: string;
    budget: number;
    budgetType: string;
    skills?: string[];
    status: string;
    createdAt: string;
  };
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      <div className="mb-4">
        <Link href={`/marketplace/jobs/${job.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
            {job.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1">{job.category}</p>
      </div>

      <p className="text-gray-700 text-sm line-clamp-2 mb-4">
        {job.description}
      </p>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {job.skills && job.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {skill}
            </span>
          ))}
          {job.skills && job.skills.length > 3 && (
            <span className="text-gray-600 text-xs px-2 py-1">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            ${job.budget}
          </p>
          <p className="text-xs text-gray-600">{job.budgetType}</p>
        </div>
        <Link
          href={`/marketplace/jobs/${job.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
