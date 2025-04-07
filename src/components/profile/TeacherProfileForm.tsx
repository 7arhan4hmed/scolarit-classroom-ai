
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { School, BookOpen, GraduationCap, Clock } from 'lucide-react';

type TeacherProfileFormProps = {
  step: number;
};

// Step 1: Basic Information Schema
const basicInfoSchema = z.object({
  schoolName: z.string().min(2, 'School name is required'),
  position: z.string().min(2, 'Position is required'),
  department: z.string().min(2, 'Department is required'),
  yearsExperience: z.string().min(1, 'Years of experience is required'),
});

// Step 2: Teaching Details Schema
const teachingDetailsSchema = z.object({
  subjectsTaught: z.string().min(2, 'Please enter at least one subject'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  classSize: z.string().min(1, 'Average class size is required'),
  teachingStyle: z.string().min(2, 'Teaching style is required'),
});

// Step 3: AI Preferences Schema
const aiPreferencesSchema = z.object({
  gradingPreferences: z.string().min(2, 'Grading preferences are required'),
  feedbackStyle: z.string().min(1, 'Feedback style is required'),
  useAIForGrading: z.boolean().optional(),
  useAIForFeedback: z.boolean().optional(),
  useAIForLessonPlanning: z.boolean().optional(),
});

const TeacherProfileForm = ({ step }: TeacherProfileFormProps) => {
  // Form for Step 1
  const basicInfoForm = useForm<z.infer<typeof basicInfoSchema>>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      schoolName: '',
      position: '',
      department: '',
      yearsExperience: '',
    },
  });

  // Form for Step 2
  const teachingDetailsForm = useForm<z.infer<typeof teachingDetailsSchema>>({
    resolver: zodResolver(teachingDetailsSchema),
    defaultValues: {
      subjectsTaught: '',
      gradeLevel: '',
      classSize: '',
      teachingStyle: '',
    },
  });

  // Form for Step 3
  const aiPreferencesForm = useForm<z.infer<typeof aiPreferencesSchema>>({
    resolver: zodResolver(aiPreferencesSchema),
    defaultValues: {
      gradingPreferences: '',
      feedbackStyle: 'balanced',
      useAIForGrading: true,
      useAIForFeedback: true,
      useAIForLessonPlanning: false,
    },
  });

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Form {...basicInfoForm}>
            <form className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">School Information</h2>
              
              <FormField
                control={basicInfoForm.control}
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
                control={basicInfoForm.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input placeholder="e.g., Teacher, Department Head" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={basicInfoForm.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <Input placeholder="e.g., English, Science" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={basicInfoForm.control}
                  name="yearsExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <Input placeholder="e.g., 5" type="number" className="pl-10" {...field} />
                        </div>
                      </FormControl>
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
          <Form {...teachingDetailsForm}>
            <form className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">Teaching Details</h2>
              
              <FormField
                control={teachingDetailsForm.control}
                name="subjectsTaught"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subjects Taught</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List the subjects you teach, separated by commas" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Example: Algebra, Geometry, Calculus
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={teachingDetailsForm.control}
                  name="gradeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="elementary">Elementary School</SelectItem>
                          <SelectItem value="middle">Middle School</SelectItem>
                          <SelectItem value="high">High School</SelectItem>
                          <SelectItem value="college">College/University</SelectItem>
                          <SelectItem value="mixed">Multiple Levels</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={teachingDetailsForm.control}
                  name="classSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Class Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="small">Small (1-15 students)</SelectItem>
                          <SelectItem value="medium">Medium (16-25 students)</SelectItem>
                          <SelectItem value="large">Large (26-35 students)</SelectItem>
                          <SelectItem value="xl">Extra Large (36+ students)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={teachingDetailsForm.control}
                name="teachingStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teaching Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your primary teaching style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lecture">Lecture-based</SelectItem>
                        <SelectItem value="discussion">Discussion-based</SelectItem>
                        <SelectItem value="activity">Activity-based</SelectItem>
                        <SelectItem value="flipped">Flipped Classroom</SelectItem>
                        <SelectItem value="project">Project-based</SelectItem>
                        <SelectItem value="blended">Blended Learning</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        );
      
      case 3:
        return (
          <Form {...aiPreferencesForm}>
            <form className="space-y-6">
              <h2 className="text-xl font-semibold text-blue-700 mb-4">AI Preferences</h2>
              
              <FormField
                control={aiPreferencesForm.control}
                name="gradingPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grading Preferences</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe how you typically grade assignments and what criteria you value" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This helps our AI understand your grading style
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={aiPreferencesForm.control}
                name="feedbackStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your feedback style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="detailed">Highly Detailed</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="concise">Concise</SelectItem>
                        <SelectItem value="positive">Positive-focused</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How would you like AI to structure feedback for your students?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-medium">AI Features You Want to Use</h3>
                
                <FormField
                  control={aiPreferencesForm.control}
                  name="useAIForGrading"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>AI-assisted grading</FormLabel>
                        <FormDescription>
                          Let AI help grade assignments based on your criteria
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={aiPreferencesForm.control}
                  name="useAIForFeedback"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>AI-generated feedback</FormLabel>
                        <FormDescription>
                          Generate personalized feedback for students
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={aiPreferencesForm.control}
                  name="useAIForLessonPlanning"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>AI-assisted lesson planning</FormLabel>
                        <FormDescription>
                          Get suggestions for lesson plans and activities
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        );
      
      default:
        return null;
    }
  };
  
  return <div>{renderStepContent()}</div>;
};

export default TeacherProfileForm;
