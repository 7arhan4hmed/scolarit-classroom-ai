
import React from 'react';
import { BookOpen } from 'lucide-react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <div className="rounded-lg blue-purple-gradient p-2 text-white">
          <BookOpen size={28} />
        </div>
      </div>
      <h2 className="mt-6 text-3xl font-bold font-display gradient-text">{title}</h2>
      <p className="mt-2 text-sm text-gray-600">
        {subtitle}
      </p>
    </div>
  );
};

export default AuthHeader;
