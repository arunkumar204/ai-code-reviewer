'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { type CodeReview } from '@/src/lib/code-review';
import { FileCode, Calendar, RefreshCw } from 'lucide-react';

interface ReviewHistoryProps {
  reviews: CodeReview[];
  onViewReview: (review: CodeReview) => void;
  onRefresh: () => void;
}

export default function ReviewHistory({ reviews, onViewReview, onRefresh }: ReviewHistoryProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Review History</h2>
          <p className="text-muted-foreground mt-1">View and manage your code review history</p>
        </div>

        <Button variant="outline" onClick={() => window.location.reload()}>
  <RefreshCw className="h-4 w-4 mr-2" />
  Refresh
</Button>

      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileCode className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground text-center">
              Start by submitting your first code review
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">

          {reviews.map((review) => (
            <Card
              key={review.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onViewReview(review)}
            >
              <CardHeader>

                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">

                    <CardTitle className="flex items-center space-x-2">
                      <FileCode className="h-5 w-5" />
                      <span>{review.fileName || 'Untitled Review'}</span>
                    </CardTitle>

                    {/* FIXED — no div inside <p> now */}
                    <CardDescription>
                      <span className="text-muted-foreground">
                        Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </CardDescription>

                    {/* This wrapper div prevents p > div nesting */}
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="flex items-center text-muted-foreground text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>

                      <Badge variant="outline">{review.language}</Badge>
                    </div>

                  </div>

                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(review.analysis.overallScore)}`}>
                      {review.analysis.overallScore}%
                    </div>

                    <Badge variant={getScoreBadge(review.analysis.overallScore)}>Score</Badge>
                  </div>
                </div>

              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex space-x-4">
                    <span className="text-muted-foreground">
                      {review.analysis.issues.length} issues found
                    </span>
                    <span className="text-muted-foreground">
                      {review.analysis.issues.filter(i => i.severity === 'critical').length} critical
                    </span>
                  </div>

                  <Button variant="ghost" size="sm">
                    View Details →
                  </Button>
                </div>
              </CardContent>

            </Card>
          ))}

        </div>
      )}
    </div>
  );
}
