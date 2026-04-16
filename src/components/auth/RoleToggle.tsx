import React from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleToggleProps {
  value: 'teacher' | 'student';
  onChange: (v: 'teacher' | 'student') => void;
}

const RoleToggle = ({ value, onChange }: RoleToggleProps) => {
  return (
    <div className="relative grid grid-cols-2 p-1 rounded-[12px] bg-[hsl(220,15%,95%)] border border-[hsl(220,15%,90%)]">
      {/* Sliding indicator */}
      <div
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-[10px] bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out"
        style={{
          left: value === 'teacher' ? '4px' : 'calc(50% + 0px)',
        }}
      />
      {[
        { key: 'teacher' as const, label: 'Teacher', Icon: BookOpen, color: '#4F46E5' },
        { key: 'student' as const, label: 'Student', Icon: GraduationCap, color: '#7C3AED' },
      ].map(({ key, label, Icon, color }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              'relative z-10 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-[10px] transition-colors duration-200',
              active ? '' : 'text-[hsl(220,10%,45%)] hover:text-[hsl(220,15%,25%)]'
            )}
            style={active ? { color } : undefined}
          >
            <Icon size={16} />
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default RoleToggle;
