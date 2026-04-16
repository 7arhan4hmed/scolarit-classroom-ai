import React, { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Control } from 'react-hook-form';

interface PasswordFieldProps {
  control: Control<any>;
  disabled?: boolean;
  accentColor?: string;
  label?: string;
  name?: string;
}

const PasswordField = ({
  control,
  disabled,
  accentColor = '#4F46E5',
  label = 'Password',
  name = 'password',
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel className="text-sm font-semibold text-[hsl(220,15%,20%)]">{label}</FormLabel>
          <FormControl>
            <div className="relative group">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,55%)] group-focus-within:text-[var(--accent)] transition-colors"
                size={18}
                style={{ ['--accent' as any]: accentColor }}
              />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10 h-11 rounded-[10px] border-[hsl(220,15%,88%)] bg-white text-[hsl(220,15%,15%)] placeholder:text-[hsl(220,10%,60%)] focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:border-transparent transition-all"
                style={{ ['--tw-ring-color' as any]: `${accentColor}33` }}
                disabled={disabled}
                {...field}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,55%)] hover:text-[hsl(220,15%,25%)] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordField;
