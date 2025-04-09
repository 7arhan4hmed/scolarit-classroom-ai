import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';

const formSchemaStep1 = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
});

const formSchemaStep2 = z.object({
  department: z.string().min(2, {
    message: "Department must be at least 2 characters.",
  }),
  institution: z.string().min(2, {
    message: "Institution must be at least 2 characters.",
  }),
});

type FormValuesStep1 = z.infer<typeof formSchemaStep1>;
type FormValuesStep2 = z.infer<typeof formSchemaStep2>;

interface TeacherProfileFormProps {
  step: number;
  onUpdate: (data: any) => void;
}

const TeacherProfileForm: React.FC<TeacherProfileFormProps> = ({ step, onUpdate }) => {
  const formStep1 = useForm<FormValuesStep1>({
    resolver: zodResolver(formSchemaStep1),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const formStep2 = useForm<FormValuesStep2>({
    resolver: zodResolver(formSchemaStep2),
    defaultValues: {
      department: "",
      institution: "",
    },
  });

  const onSubmitStep1 = (values: FormValuesStep1) => {
    onUpdate(values);
  };

  const onSubmitStep2 = (values: FormValuesStep2) => {
    onUpdate(values);
  };

  if (step === 1) {
    return (
      <Form {...formStep1}>
        <form onSubmit={formStep1.handleSubmit(onSubmitStep1)} className="space-y-4">
          <FormField
            control={formStep1.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formStep1.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Next</Button>
        </form>
      </Form>
    );
  }

  if (step === 2) {
    return (
      <Form {...formStep2}>
        <form onSubmit={formStep2.handleSubmit(onSubmitStep2)} className="space-y-4">
          <FormField
            control={formStep2.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="Computer Science" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formStep2.control}
            name="institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution</FormLabel>
                <FormControl>
                  <Input placeholder="University of Example" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Next</Button>
        </form>
      </Form>
    );
  }

  return <p>Please proceed to the next step.</p>;
};

export default TeacherProfileForm;
