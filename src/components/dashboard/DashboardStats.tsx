
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { FileCode, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { type CodeReview } from '@/src/lib/code-review';

interface DashboardStatsProps {
  reviews: CodeReview[];
}

export default function DashboardStats({ reviews }: DashboardStatsProps) {
  const totalReviews = reviews.length;
  const avgScore = reviews.length > 0
    ? Math.round(reviews.reduce((sum, r) => sum + r.analysis.overallScore, 0) / reviews.length)
    : 0;
  
  const totalIssues = reviews.reduce((sum, r) => sum + r.analysis.issues.length, 0);
  const criticalIssues = reviews.reduce(
    (sum, r) => sum + r.analysis.issues.filter(i => i.severity === 'critical').length,
    0
  );

  const stats = [
    {
      title: 'Total Reviews',
      value: totalReviews,
      icon: FileCode,
      color: 'text-blue-500',
    },
    {
      title: 'Average Score',
      value: `${avgScore}%`,
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      title: 'Total Issues',
      value: totalIssues,
      icon: AlertCircle,
      color: 'text-orange-500',
    },
    {
      title: 'Critical Issues',
      value: criticalIssues,
      icon: CheckCircle,
      color: 'text-red-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
