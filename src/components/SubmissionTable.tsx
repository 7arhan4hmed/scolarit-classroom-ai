import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Inbox, Upload } from 'lucide-react';
import type { TeacherSubmission } from '@/hooks/useTeacherData';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  if (submissions.length === 0) {
    return (
      <div className="border rounded-xl p-12 text-center bg-card shadow-sm">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No submissions yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          Once students submit their assignments, they'll appear here for review and grading.
        </p>
        <Button
          className="mt-5"
          onClick={() => navigate('/upload-assignments')}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload an assignment
        </Button>
      </div>
    );
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
      <div className="max-h-[560px] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-muted/60 backdrop-blur supports-[backdrop-filter]:bg-muted/50">
            <TableRow className="hover:bg-transparent border-b">
              <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-foreground/70">Student</TableHead>
              <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-foreground/70">Assignment</TableHead>
              <TableHead className="h-11 text-right text-xs font-semibold uppercase tracking-wider text-foreground/70">Score</TableHead>
              <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-foreground/70">Grade</TableHead>
              <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-foreground/70">Date</TableHead>
              <TableHead className="h-11 w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((s) => (
              <TableRow
                key={s.assignment_id}
                className="group cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => onView(s)}
              >
                <TableCell className="py-4 font-medium text-foreground">{s.student_name}</TableCell>
                <TableCell className="py-4 max-w-xs truncate text-foreground/90">{s.title}</TableCell>
                <TableCell className="py-4 text-right tabular-nums font-semibold text-foreground">
                  {s.score != null ? `${Math.round(s.score)}%` : '—'}
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant={gradeVariant(s.grade)}>{s.grade ?? 'Pending'}</Badge>
                </TableCell>
                <TableCell className="py-4 text-muted-foreground tabular-nums">
                  {new Date(s.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="py-4 text-right pr-4">
                  <ChevronRight className="h-4 w-4 text-muted-foreground/60 inline-block transition-all duration-200 group-hover:text-primary group-hover:translate-x-1" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
