
import React from 'react';

interface UserTypeInfoProps {
  userType: 'teacher' | 'student';
}

const UserTypeInfo: React.FC<UserTypeInfoProps> = ({ userType }) => {
  if (userType === 'teacher') {
    return (
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-blue-800 mb-2">Teacher Portal</h3>
        <p className="text-sm text-blue-700">Access your classes, grade assignments, and view student progress.</p>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 p-4 rounded-lg mb-6">
      <h3 className="font-medium text-purple-800 mb-2">Student Portal</h3>
      <p className="text-sm text-purple-700">View your assignments, check grades, and communicate with teachers.</p>
    </div>
  );
};

export default UserTypeInfo;
