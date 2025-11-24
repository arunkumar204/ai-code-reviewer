export interface CodeReview {
  id: string;
  userId: string;
  code: string;
  language: string;
  fileName?: string;
  createdAt: string;
  analysis: CodeAnalysis;
}

export interface CodeAnalysis {
  overallScore: number;
  issues: CodeIssue[];
  suggestions: string[];
  metrics: CodeMetrics;
  summary: string;
}

export interface CodeIssue {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'bug' | 'security' | 'performance' | 'style' | 'best-practice';
  line?: number;
  message: string;
  suggestion?: string;
}

export interface CodeMetrics {
  complexity: number;
  maintainability: number;
  readability: number;
  security: number;
}

const REVIEWS_STORAGE_KEY = 'ai_code_reviewer_reviews';

function getReviews(): CodeReview[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(REVIEWS_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveReviews(reviews: CodeReview[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
}

export function getUserReviews(userId: string): CodeReview[] {
  const reviews = getReviews();
  return reviews
    .filter(r => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getReviewById(reviewId: string): CodeReview | null {
  const reviews = getReviews();
  return reviews.find(r => r.id === reviewId) || null;
}

export function deleteReview(reviewId: string, userId: string): { success: boolean; error?: string } {
  const reviews = getReviews();
  const reviewIndex = reviews.findIndex(r => r.id === reviewId && r.userId === userId);
  if (reviewIndex === -1) return { success: false, error: 'Review not found' };
  reviews.splice(reviewIndex, 1);
  saveReviews(reviews);
  return { success: true };
}

// ----------------------
// CODE VALIDATION FUNCTION
// ----------------------
function isValidCode(input: string): boolean {
  const codePattern = /[{}();=<>]|function|class|import|const|let|var/;
  return codePattern.test(input.trim());
}

// ----------------------
// AI CODE ANALYSIS
// ----------------------
export async function analyzeCode(
  code: string,
  language: string,
  userId: string,
  fileName?: string
): Promise<CodeReview> {
  // Only analyze if valid code
  if (!isValidCode(code)) {
    throw new Error('Invalid input. Please enter valid code to analyze.');
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  const reviewId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const createdAt = new Date().toISOString();

  const analysis = performCodeAnalysis(code, language);

  const review: CodeReview = { id: reviewId, userId, code, language, fileName, createdAt, analysis };

  const reviews = getReviews();
  reviews.push(review);
  saveReviews(reviews);

  return review;
}

// ----------------------
// PERFORM CODE ANALYSIS
// ----------------------
function performCodeAnalysis(code: string, language: string): CodeAnalysis {
  const lines = code.split('\n');
  const issues: CodeIssue[] = [];

  let nestedBlocks = 0;
  let functionsCount = 0;
  let longLinesCount = 0;
  let commentsCount = 0;

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    if (trimmed.startsWith('//') || trimmed.startsWith('/*')) commentsCount++;

    if (line.length > 120) {
      longLinesCount++;
      issues.push({
        id: `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        severity: 'low',
        type: 'style',
        line: lineNum,
        message: 'Line exceeds 120 characters',
        suggestion: 'Break long lines into smaller lines for readability',
      });
    }

    if (/function\s+\w+\(|\w+\s*=\s*\(.*\)\s*=>/.test(trimmed)) functionsCount++;

    if (trimmed.includes('{')) nestedBlocks++;
    if (trimmed.includes('}')) nestedBlocks = Math.max(0, nestedBlocks - 1);

    if (trimmed.includes('console.log')) {
      issues.push({
        id: `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        severity: 'low',
        type: 'best-practice',
        line: lineNum,
        message: 'Console.log statement found',
        suggestion: 'Remove console.log in production code',
      });
    }

    if (trimmed.includes('var ')) {
      issues.push({
        id: `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        severity: 'medium',
        type: 'best-practice',
        line: lineNum,
        message: 'Use of var keyword',
        suggestion: 'Use let or const instead of var',
      });
    }

    if (trimmed.includes('==') && !trimmed.includes('===')) {
      issues.push({
        id: `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        severity: 'medium',
        type: 'bug',
        line: lineNum,
        message: 'Loose equality operator used',
        suggestion: 'Use === instead of == for strict comparison',
      });
    }

    if (trimmed.includes('eval(')) {
      issues.push({
        id: `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        severity: 'critical',
        type: 'security',
        line: lineNum,
        message: 'Use of eval() is risky',
        suggestion: 'Avoid eval() to prevent security vulnerabilities',
      });
    }
  });

  if (code.includes('async') && !code.includes('try') && !code.includes('catch')) {
    issues.push({
      id: `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      severity: 'high',
      type: 'bug',
      message: 'Async function without error handling',
      suggestion: 'Add try-catch blocks in async functions',
    });
  }

  const complexity = Math.min(10, nestedBlocks + functionsCount + Math.floor(lines.length / 20));
  const maintainability = Math.max(1, 10 - Math.floor(issues.length / 2));
  const readability = Math.max(1, 10 - longLinesCount - Math.floor((lines.length - commentsCount) / 50));
  const criticalIssues = issues.filter(i => i.severity === 'critical').length;
  const highIssues = issues.filter(i => i.severity === 'high').length;
  const security = Math.max(1, 10 - (criticalIssues * 3 + highIssues * 2));

  let penalty = 0;
  issues.forEach(issue => {
    switch (issue.severity) {
      case 'critical':
        penalty += 25;
        break;
      case 'high':
        penalty += 15;
        break;
      case 'medium':
        penalty += 7;
        break;
      case 'low':
        penalty += 3;
        break;
    }
  });
  const overallScore = Math.max(0, 100 - penalty);

  const suggestions = issues.slice(0, 5).map(issue => issue.suggestion || issue.message);

  let summary = '';
  if (overallScore >= 80)
    summary = 'Excellent code quality! Your code follows best practices with minimal issues.';
  else if (overallScore >= 60)
    summary =
      'Good code quality with some areas for improvement. Address the identified issues to enhance code reliability.';
  else if (overallScore >= 40)
    summary =
      'Moderate code quality. Several issues need attention to improve maintainability and security.';
  else
    summary =
      'Code needs significant improvement. Please address critical and high-severity issues immediately.';

  return { overallScore, issues, suggestions, metrics: { complexity, maintainability, readability, security }, summary };
}
