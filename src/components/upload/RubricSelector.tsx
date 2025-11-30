import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export interface Rubric {
  id: string;
  name: string;
  description: string;
  criteria: string[];
}

const DEFAULT_RUBRICS: Rubric[] = [
  {
    id: 'essay',
    name: 'Essay Grading',
    description: 'Standard essay evaluation with focus on structure, argumentation, and writing quality',
    criteria: ['Thesis & Argument', 'Evidence & Support', 'Organization', 'Writing Quality', 'Grammar & Mechanics']
  },
  {
    id: 'research',
    name: 'Research Paper',
    description: 'Comprehensive evaluation for research-based assignments',
    criteria: ['Research Quality', 'Methodology', 'Analysis & Interpretation', 'Citations', 'Presentation']
  },
  {
    id: 'creative',
    name: 'Creative Writing',
    description: 'Assessment focused on creativity, originality, and narrative structure',
    criteria: ['Creativity & Originality', 'Narrative Structure', 'Character Development', 'Style & Voice', 'Technical Quality']
  },
  {
    id: 'technical',
    name: 'Technical Report',
    description: 'Evaluation for technical and scientific writing',
    criteria: ['Technical Accuracy', 'Clarity & Precision', 'Methodology', 'Data Presentation', 'Conclusions']
  }
];

interface RubricSelectorProps {
  selectedRubricId: string | null;
  onRubricSelect: (rubricId: string) => void;
}

const RubricSelector = ({ selectedRubricId, onRubricSelect }: RubricSelectorProps) => {
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
          {DEFAULT_RUBRICS.map((rubric) => (
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
                      {selectedRubricId === rubric.id && (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      )}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">{rubric.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {rubric.criteria.map((criterion, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                        >
                          {criterion}
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
export { DEFAULT_RUBRICS };
