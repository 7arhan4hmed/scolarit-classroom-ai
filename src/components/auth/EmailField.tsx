import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { Control } from 'react-hook-form';

interface EmailFieldProps {
  control: Control<any>;
  disabled?: boolean;
  placeholder?: string;
  accentColor?: string;
}

const EmailField = ({ control, disabled, placeholder, accentColor = '#4F46E5' }: EmailFieldProps) => {
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm font-semibold text-[hsl(220,15%,20%)]">Email address</FormLabel>
          <FormControl>
            <div className="relative group">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,55%)] group-focus-within:text-[var(--accent)] transition-colors duration-200 z-10"
                size={18}
                style={{ ['--accent' as any]: accentColor }}
              />
              <Input
                placeholder={placeholder || 'email@example.com'}
                className="pl-10 h-11 rounded-[10px] border-[hsl(220,15%,88%)] bg-white text-[hsl(220,15%,15%)] placeholder:text-[hsl(220,10%,60%)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[var(--accent)] focus-visible:shadow-[0_0_0_4px_var(--glow)] transition-all duration-200 hover:border-[hsl(220,15%,80%)]"
                style={{
                  ['--accent' as any]: accentColor,
                  ['--glow' as any]: `${accentColor}1F`,
                }}
                disabled={disabled}
                {...field}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default EmailField;
