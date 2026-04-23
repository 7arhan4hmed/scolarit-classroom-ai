import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import type { TeacherSubmission } from '@/hooks/useTeacherData';

interface Props {
  submissions: TeacherSubmission[];
  onView: (s: TeacherSubmission) => void;
}

const gradeVariant = (grade: string | null): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (!grade) return 'outline';
  const g = grade.toUpperCase();
  if (g.startsWith('A')) return 'default';
  if (g.startsWith('B')) return 'secondary';
  if (g.startsWith('F')) return 'destructive';
  return 'outline';
};

export const SubmissionTable = ({ submissions, onView }: Props) => {
  if (submissions.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center bg-card">
        <p className="text-muted-foreground">No student submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Assignment</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((s) => (
            <TableRow
              key={s.assignment_id}
              className="cursor-pointer"
              onClick={() => onView(s)}
            >
              <TableCell className="font-medium">{s.student_name}</TableCell>
              <TableCell className="max-w-xs truncate">{s.title}</TableCell>
              <TableCell className="text-right tabular-nums">
                {s.score != null ? `${Math.round(s.score)}%` : '—'}
              </TableCell>
              <TableCell>
                <Badge variant={gradeVariant(s.grade)}>{s.grade ?? 'Pending'}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(s.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(s);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" /> View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
