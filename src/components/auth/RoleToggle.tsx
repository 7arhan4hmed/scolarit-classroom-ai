import React from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleToggleProps {
  value: 'teacher' | 'student';
  onChange: (v: 'teacher' | 'student') => void;
}

const RoleToggle = ({ value, onChange }: RoleToggleProps) => {
  const accent = value === 'teacher' ? '#4F46E5' : '#7C3AED';
  const accentSoft = value === 'teacher' ? '#6366F1' : '#8B5CF6';

  return (
    <div className="relative grid grid-cols-2 p-1 rounded-[12px] bg-[hsl(220,15%,95%)] border border-[hsl(220,15%,90%)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
      {/* Sliding indicator with accent gradient */}
      <div
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-[10px] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{
          left: value === 'teacher' ? '4px' : 'calc(50% + 0px)',
          background: `linear-gradient(180deg, #fff 0%, #fff 100%)`,
          boxShadow: `0 2px 8px -2px ${accent}40, 0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px ${accent}1A`,
        }}
      />
      {[
        { key: 'teacher' as const, label: 'Teacher', Icon: BookOpen },
        { key: 'student' as const, label: 'Student', Icon: GraduationCap },
      ].map(({ key, label, Icon }) => {
        const active = value === key;
        const color = key === 'teacher' ? '#4F46E5' : '#7C3AED';
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              'relative z-10 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-[10px] transition-all duration-200',
              active ? 'scale-[1.02]' : 'text-[hsl(220,10%,45%)] hover:text-[hsl(220,15%,25%)]'
            )}
            style={active ? { color } : undefined}
          >
            <Icon size={16} className="transition-transform duration-200" />
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default RoleToggle;
