
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';

interface UserTypeTabContentProps {
  value: 'teacher' | 'student';
  children: React.ReactNode;
}

const UserTypeTabContent = ({ value, children }: UserTypeTabContentProps) => {
  const isTeacher = value === 'teacher';
  
  return (
    <TabsContent value={value}>
      <div className={`bg-${isTeacher ? 'blue' : 'purple'}-50 p-4 rounded-lg mb-6`}>
        <h3 className={`font-medium text-${isTeacher ? 'blue' : 'purple'}-800 mb-2`}>
          {isTeacher ? 'Teacher Portal' : 'Student Portal'}
        </h3>
        <p className={`text-sm text-${isTeacher ? 'blue' : 'purple'}-700`}>
          {isTeacher 
            ? 'Access your classes, grade assignments, and view student progress.' 
            : 'View your assignments, check grades, and communicate with teachers.'}
        </p>
      </div>
      {children}
    </TabsContent>
  );
};

export default UserTypeTabContent;
