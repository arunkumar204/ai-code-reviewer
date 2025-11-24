'use client';

import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { Separator } from '@/src/components/ui/separator';
import { Progress } from '@/src/components/ui/progress';
import { type CodeReview } from '@/src/lib/code-review';
import { deleteReview } from '@/src/lib/code-review';
import { getCurrentUser } from '@/src/lib/auth';
import { ArrowLeft, AlertCircle, CheckCircle, Info, Lightbulb, Trash2, Calendar, Code } from 'lucide-react';
import { toast } from 'sonner';

interface ReviewDetailProps {
  review: CodeReview;
  onBack: () => void;
  onDelete: () => void;
}

export default function ReviewDetail({ review, onBack, onDelete }: ReviewDetailProps) {
  const user = getCurrentUser();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-yellow-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bug':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'security':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'performance':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'style':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleDelete = () => {
    if (!user) return;
    
    const result = deleteReview(review.id, user.id);
    if (result.success) {
      toast.success('Review deleted successfully');
      onDelete();
    } else {
      toast.error(result.error || 'Failed to delete review');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to History
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Review
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{review.fileName || 'Untitled Review'}</CardTitle>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(review.createdAt).toLocaleString()}
                </span>
                <Badge variant="outline">{review.language}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">
                {review.analysis.overallScore}%
              </div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Summary */}
          <div>
            <h3 className="font-semibold mb-2">Summary</h3>
            <p className="text-muted-foreground">{review.analysis.summary}</p>
          </div>

          <Separator />

          {/* Metrics */}
          <div>
            <h3 className="font-semibold mb-4">Code Metrics</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {['complexity', 'maintainability', 'readability', 'security'].map((metric) => (
                <div key={metric} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{metric.charAt(0).toUpperCase() + metric.slice(1)}</span>
                    <span className="font-medium">
                      {review.analysis.metrics[metric as keyof typeof review.analysis.metrics]}/10
                    </span>
                  </div>
                  <Progress
                    value={(review.analysis.metrics[metric as keyof typeof review.analysis.metrics] as number) * 10}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Issues */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Issues Found ({review.analysis.issues.length})
            </h3>
            {review.analysis.issues.length === 0 ? (
              <p className="text-muted-foreground">No issues found. Great job!</p>
            ) : (
              <div className="space-y-3">
                {review.analysis.issues.map((issue) => (
                  <Card key={issue.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start space-x-3">
                        {getSeverityIcon(issue.severity)}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant={getSeverityBadge(issue.severity) as any}>
                              {issue.severity}
                            </Badge>
                            <Badge className={getTypeColor(issue.type)}>
                              {issue.type}
                            </Badge>
                            {issue.line && (
                              <span className="text-xs text-muted-foreground">
                                Line {issue.line}
                              </span>
                            )}
                          </div>
                          <p className="font-medium">{issue.message}</p>
                          {issue.suggestion && (
                            <p className="text-sm text-muted-foreground">
                              💡 {issue.suggestion}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Suggestions */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Suggestions
            </h3>
            <ul className="space-y-2">
              {review.analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Original Code */}
          <div>
            <h3 className="font-semibold mb-4 flex items-center">
              <Code className="h-5 w-5 mr-2" />
              Original Code
            </h3>
            <div className="bg-muted rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap">{review.code}</pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
