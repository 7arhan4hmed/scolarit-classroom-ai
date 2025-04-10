
import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import UserTypeTabContent from '@/components/auth/UserTypeTabContent';

const Login = () => {
  const [userType, setUserType] = useState<'teacher' | 'student'>('teacher');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="rounded-lg blue-purple-gradient p-2 text-white">
              <BookOpen size={28} />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold font-display gradient-text">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue to SCOLARIT
          </p>
        </div>
        
        <Tabs defaultValue="teacher" onValueChange={(value) => setUserType(value as 'teacher' | 'student')} className="mt-8">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="teacher" className="text-center">Teacher</TabsTrigger>
            <TabsTrigger value="student" className="text-center">Student</TabsTrigger>
          </TabsList>
          
          <UserTypeTabContent value="teacher">
            <LoginForm userType="teacher" />
          </UserTypeTabContent>
          
          <UserTypeTabContent value="student">
            <LoginForm userType="student" />
          </UserTypeTabContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
