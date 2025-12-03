import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useRubrics } from '@/hooks/useRubrics';

export interface Rubric {
  id: string;
  name: string;
  description: string | null;
  criteria: { name: string; weight: number }[];
  is_default: boolean;
}

interface RubricSelectorProps {
  selectedRubricId: string | null;
  onRubricSelect: (rubricId: string) => void;
}

const RubricSelector = ({ selectedRubricId, onRubricSelect }: RubricSelectorProps) => {
  const { rubrics, loading } = useRubrics();

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">Grading Rubric</Label>
          <p className="text-sm text-muted-foreground mt-1">Loading rubrics...</p>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">Grading Rubric</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Select a rubric to guide the AI assessment
        </p>
      </div>

      <RadioGroup value={selectedRubricId || ''} onValueChange={onRubricSelect}>
        <div className="grid gap-3">
          {rubrics.map((rubric) => (
            <Card
              key={rubric.id}
              className={`cursor-pointer transition-all ${
                selectedRubricId === rubric.id
                  ? 'ring-2 ring-primary bg-accent/50'
                  : 'hover:bg-accent/20'
              }`}
              onClick={() => onRubricSelect(rubric.id)}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <RadioGroupItem value={rubric.id} id={rubric.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={rubric.id} className="cursor-pointer font-semibold flex items-center gap-2">
                      {rubric.name}
                      {rubric.is_default && (
                        <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                          Default
                        </span>
                      )}
                      {selectedRubricId === rubric.id && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </Label>
                    {rubric.description && (
                      <p className="text-sm text-muted-foreground mt-1">{rubric.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {rubric.criteria.map((criterion, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                        >
                          {criterion.name} ({criterion.weight}%)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default RubricSelector;
