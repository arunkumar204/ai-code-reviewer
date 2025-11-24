
'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Input } from '@/src/components/ui/input';
import { analyzeCode } from '@/src/lib/code-review';
import { toast } from 'sonner';
import { Loader2, Upload, Code } from 'lucide-react';

interface CodeSubmissionFormProps {
  userId: string;
  onComplete: () => void;
  onCancel: () => void;
}

export default function CodeSubmissionForm({ userId, onComplete, onCancel }: CodeSubmissionFormProps) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [fileName, setFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      toast.error('Please enter some code to review');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      await analyzeCode(code, language, userId, fileName || undefined);
      toast.success('Code analysis complete!');
      onComplete();
    } catch (error) {
      toast.error('Failed to analyze code');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCode(content);
      setFileName(file.name);
      
      // Auto-detect language from file extension
      const ext = file.name.split('.').pop()?.toLowerCase();
      const langMap: Record<string, string> = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'go': 'go',
        'rs': 'rust',
      };
      if (ext && langMap[ext]) {
        setLanguage(langMap[ext]);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Submit Code for Review</span>
          </CardTitle>
          <CardDescription>
            Paste your code or upload a file to get AI-powered analysis and suggestions
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fileName">File Name (Optional)</Label>
              <Input
                id="fileName"
                placeholder="example.js"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Programming Language</Label>
              <Select
  value={language}
  onValueChange={(value) => setLanguage(value)}
  disabled={isAnalyzing}
>
  <SelectTrigger>
    <SelectValue placeholder="Select language" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="javascript">JavaScript</SelectItem>
    <SelectItem value="typescript">TypeScript</SelectItem>
    <SelectItem value="python">Python</SelectItem>
    <SelectItem value="java">Java</SelectItem>
    <SelectItem value="cpp">C++</SelectItem>
    <SelectItem value="c">C</SelectItem>
    <SelectItem value="go">Go</SelectItem>
    <SelectItem value="rust">Rust</SelectItem>
    <SelectItem value="php">PHP</SelectItem>
    <SelectItem value="ruby">Ruby</SelectItem>
  </SelectContent>
</Select>


            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="code">Code</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isAnalyzing}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.go,.rs,.php,.rb"
                  onChange={handleFileUpload}
                  disabled={isAnalyzing}
                />
              </div>
              <Textarea
                id="code"
                placeholder="Paste your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isAnalyzing}
                className="font-mono text-sm min-h-[400px]"
              />
            </div>
            
            <div className="flex space-x-4">
              <Button type="submit" disabled={isAnalyzing} className="flex-1">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Code...
                  </>
                ) : (
                  'Analyze Code'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={isAnalyzing}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
