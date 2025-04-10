
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { School, Book, GraduationCap, Brain } from 'lucide-react';

type StudentProfileFormProps = {
  step: number;
};

// Step 1: Education Information Schema
const educationInfoSchema = z.object({
  schoolName: z.string().min(2, 'School name is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  major: z.string().optional(),
  studentId: z.string().optional(),
});

// Step 2: Learning Preferences Schema
const learningPreferencesSchema = z.object({
  subjects: z.string().min(2, 'Please enter at least one subject'),
  learningStyle: z.string().min(1, 'Learning style is required'),
  challengeAreas: z.string().optional(),
  accommodations: z.string().optional(),
  notificationsEnabled: z.boolean().optional(),
});

const StudentProfileForm = ({ step }: StudentProfileFormProps) => {
  // Form for Step 1
  const educationInfoForm = useForm<z.infer<typeof educationInfoSchema>>({
    resolver: zodResolver(educationInfoSchema),
    defaultValues: {
      schoolName: '',
      gradeLevel: '',
      major: '',
      studentId: '',
    },
  });

  // Form for Step 2
  const learningPreferencesForm = useForm<z.infer<typeof learningPreferencesSchema>>({
    resolver: zodResolver(learningPreferencesSchema),
    defaultValues: {
      subjects: '',
      learningStyle: '',
      challengeAreas: '',
      accommodations: '',
      notificationsEnabled: true,
    },
  });

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Form {...educationInfoForm}>
            <form className="space-y-6">
              <h2 className="text-xl font-semibold text-purple-700 mb-4">Education Information</h2>
              
              <FormField
                control={educationInfoForm.control}
                name="schoolName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <School className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input placeholder="Enter your school name" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={educationInfoForm.control}
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your grade level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="elementary">Elementary School</SelectItem>
                        <SelectItem value="middle">Middle School</SelectItem>
                        <SelectItem value="9">9th Grade</SelectItem>
                        <SelectItem value="10">10th Grade</SelectItem>
                        <SelectItem value="11">11th Grade</SelectItem>
                        <SelectItem value="12">12th Grade</SelectItem>
                        <SelectItem value="freshman">College Freshman</SelectItem>
                        <SelectItem value="sophomore">College Sophomore</SelectItem>
                        <SelectItem value="junior">College Junior</SelectItem>
                        <SelectItem value="senior">College Senior</SelectItem>
                        <SelectItem value="graduate">Graduate Student</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={educationInfoForm.control}
                  name="major"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Major/Focus Area (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Book className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <Input placeholder="e.g., Biology, Computer Science" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        For college students or specialized high school programs
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={educationInfoForm.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <Input placeholder="Your student ID number" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        May be required by your teacher
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        );
      
      case 2:
        return (
          <Form {...learningPreferencesForm}>
            <form className="space-y-6">
              <h2 className="text-xl font-semibold text-purple-700 mb-4">Learning Preferences</h2>
              
              <FormField
                control={learningPreferencesForm.control}
                name="subjects"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subjects You're Taking</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List the subjects you're currently studying, separated by commas" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Example: Math, English, Biology, History
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={learningPreferencesForm.control}
                name="learningStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Learning Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="How do you learn best?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="visual">Visual Learner</SelectItem>
                        <SelectItem value="auditory">Auditory Learner</SelectItem>
                        <SelectItem value="reading">Reading/Writing</SelectItem>
                        <SelectItem value="kinesthetic">Kinesthetic (Hands-on) Learner</SelectItem>
                        <SelectItem value="mixed">Mixed Learning Style</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This helps us tailor your learning experience
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={learningPreferencesForm.control}
                name="challengeAreas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Challenge Areas (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Brain className="absolute left-3 top-3 text-gray-400" size={18} />
                        <Textarea 
                          placeholder="Describe any subjects or topics you find challenging" 
                          className="pl-10"
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      This helps us provide better feedback on difficult topics
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={learningPreferencesForm.control}
                name="accommodations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accommodations (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any accommodations or specific learning needs we should know about" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This information remains private and helps us better support you
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={learningPreferencesForm.control}
                name="notificationsEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enable notifications</FormLabel>
                      <FormDescription>
                        Receive assignment feedback and grade notifications
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      
      default:
        return null;
    }
  };
  
  return <div>{renderStepContent()}</div>;
};

export default StudentProfileForm;
