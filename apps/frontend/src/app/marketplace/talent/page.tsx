"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TalentService, type TalentFilters } from "@/lib/talent.service";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Star, MapPin, Filter, X } from "lucide-react";

type Talent = {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  freelancerProfile?: {
    title?: string | null;
    bio?: string | null;
    hourlyRate?: number | null;
    rating?: number | null;
    totalReviews?: number | null;
    isVerified?: boolean | null;
    skills?: { id: string; name: string }[];
  } | null;
};

const SUGGESTED_SKILLS = [
  "React", "TypeScript", "Node.js", "Python", "UI/UX",
  "Figma", "AWS", "Docker", "Next.js", "GraphQL", "DevOps", "Mobile",
];

export default function TalentPage() {
  const [talent, setTalent] = useState<Talent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [q, setQ] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<TalentFilters["sort"]>("newest");

  const filters: TalentFilters = useMemo(() => ({
    q: q.trim() || undefined,
    skills: selectedSkills.length ? selectedSkills.join(",") : undefined,
    minRate: minRate ? Number(minRate) : undefined,
    maxRate: maxRate ? Number(maxRate) : undefined,
    minRating: minRating > 0 ? minRating : undefined,
    sort,
  }), [q, selectedSkills, minRate, maxRate, minRating, sort]);

  const fetchTalent = async () => {
    setLoading(true);
    try {
      const data = await TalentService.getAll(filters);
      setTalent(data);
    } catch (error) {
      console.error("Failed to fetch talent:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchTalent, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const clearFilters = () => {
    setQ("");
    setSelectedSkills([]);
    setMinRate("");
    setMaxRate("");
    setMinRating(0);
    setSort("newest");
  };

  const hasActiveFilters =
    q || selectedSkills.length > 0 || minRate || maxRate || minRating > 0 || sort !== "newest";

  return (
    <div className="bg-slate-50 min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Find Talent
          </h1>
          <p className="mt-2 text-slate-500">
            Browse vetted freelancers by skill, rate, and rating.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, title, or keywords..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="sm:w-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white">
                  {[
                    selectedSkills.length,
                    minRate ? 1 : 0,
                    maxRate ? 1 : 0,
                    minRating > 0 ? 1 : 0,
                  ].reduce((a, b) => a + b, 0) || "•"}
                </span>
              )}
            </Button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as TalentFilters["sort"])}
              className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest</option>
              <option value="rating">Top rated</option>
              <option value="rate_asc">Lowest rate</option>
              <option value="rate_desc">Highest rate</option>
            </select>
          </div>

          {showFilters && (
            <div className="mt-6 p-5 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <X className="h-3 w-3" /> Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Hourly rate ($/hr)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={minRate}
                      onChange={(e) => setMinRate(e.target.value)}
                      min="0"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={maxRate}
                      onChange={(e) => setMaxRate(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Minimum rating
                  </label>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setMinRating(n)}
                        className={`flex-1 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                          minRating === n
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {n === 0 ? "Any" : `${n}+`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-3">
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_SKILLS.map((skill) => {
                      const active = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                            active
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4 text-sm text-slate-500">
            {loading ? "Searching..." : `${talent.length} freelancer${talent.length === 1 ? "" : "s"} found`}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 rounded-xl bg-white border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : talent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {talent.map((t) => (
                <Link href={`/marketplace/profile/${t.id}`} key={t.id}>
                  <Card className="hover:shadow-lg hover:border-slate-300 transition-all duration-200 cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={t.image || ""} alt={t.name || "User"} />
                          <AvatarFallback>{t.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 truncate">
                            {t.name || "Unnamed"}
                          </h3>
                          <p className="text-sm text-slate-500 truncate">
                            {t.freelancerProfile?.title || "Freelancer"}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="font-medium text-slate-700">
                              {(t.freelancerProfile?.rating ?? 0).toFixed(1)}
                            </span>
                            <span>({t.freelancerProfile?.totalReviews ?? 0})</span>
                          </div>
                        </div>
                      </div>

                      {t.freelancerProfile?.bio && (
                        <p className="mt-4 text-sm text-slate-600 line-clamp-2">
                          {t.freelancerProfile.bio}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {(t.freelancerProfile?.skills || []).slice(0, 4).map((skill) => (
                          <Badge key={skill.id} variant="secondary" className="text-xs">
                            {skill.name}
                          </Badge>
                        ))}
                        {(t.freelancerProfile?.skills?.length || 0) > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{(t.freelancerProfile?.skills?.length || 0) - 4} more
                          </Badge>
                        )}
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-lg font-bold text-slate-900">
                          ${t.freelancerProfile?.hourlyRate ?? 0}
                          <span className="text-sm font-normal text-slate-500">/hr</span>
                        </span>
                        <span className="text-sm font-medium text-blue-600">View profile →</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <MapPin className="mx-auto h-10 w-10 text-slate-300" />
              <h2 className="mt-3 text-lg font-semibold text-slate-700">
                No freelancers found
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Try adjusting your search or filters.
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline" className="mt-4">
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
