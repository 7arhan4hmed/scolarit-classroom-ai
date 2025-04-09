import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, FileText, Upload, Search, Plus, Filter, ArrowUpRight, Eye, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/contexts/AuthContext';

const recentAssignments = [
  {
    id: 1,
    title: 'Essay: The Impact of Climate Change',
    subject: 'Environmental Science',
    date: '2025-04-05',
    grade: 'A-',
    status: 'Graded'
  },
  {
    id: 2,
    title: 'Analysis of Shakespeare\'s Hamlet',
    subject: 'English Literature',
    date: '2025-04-03',
    grade: 'B+',
    status: 'Graded'
  },
  {
    id: 3,
    title: 'Physics Problem Set #4',
    subject: 'Physics',
    date: '2025-04-01',
    grade: 'Pending',
    status: 'In Review'
  }
];

const classes = [
  { id: 1, name: 'Environmental Science 101', students: 28, assignments: 12 },
  { id: 2, name: 'English Literature', students: 25, assignments: 8 },
  { id: 3, name: 'Physics 202', students: 22, assignments: 15 },
  { id: 4, name: 'World History', students: 30, assignments: 10 }
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const { profile, user } = useAuth();

  const isProfileComplete = profile?.institution !== null;
  const userType = profile?.user_type || 'student';

  const handleViewDetails = (id: number) => {
    toast({
      title: "Assignment Details",
      description: `Viewing details for assignment #${id}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#005558]">
                {userType === 'teacher' ? 'Teacher Dashboard' : 'Student Dashboard'}
              </h1>
              <p className="text-gray-500">Welcome{profile?.full_name ? `, ${profile.full_name}` : ''} to your SCOLARIT dashboard</p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              {userType === 'teacher' && (
                <Button asChild variant="outline" size="sm">
                  <Link to="/google-classroom">
                    Connect Class
                  </Link>
                </Button>
              )}
              <Button asChild className="bg-[#005558] hover:bg-[#005558]/90" size="sm">
                <Link to="/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  {userType === 'teacher' ? 'Create Assignment' : 'Submit Assignment'}
                </Link>
              </Button>
            </div>
          </div>
          
          {!isProfileComplete && (
            <Alert className="mb-6 border-yellow-500 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-700">Complete your profile</AlertTitle>
              <AlertDescription className="text-yellow-600">
                Your profile is incomplete. Complete your profile to unlock all features.
                <div className="mt-2">
                  <Button asChild variant="outline" size="sm" className="border-yellow-500 text-yellow-700 hover:bg-yellow-100">
                    <Link to={`/profile-setup?type=${userType}`}>
                      Complete Profile
                    </Link>
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assignments">
                {userType === 'teacher' ? 'Assignments' : 'My Work'}
              </TabsTrigger>
              <TabsTrigger value="classes">
                {userType === 'teacher' ? 'My Classes' : 'Enrolled Classes'}
              </TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {userType === 'teacher' ? 'Total Assignments' : 'Assignments Due'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {userType === 'teacher' ? '24' : '8'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {userType === 'teacher' 
                        ? '12 graded, 8 in review, 4 draft' 
                        : '3 submitted, 5 pending'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {userType === 'teacher' ? 'Classes Taught' : 'Average Grade'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {userType === 'teacher' ? '4' : 'B+'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {userType === 'teacher' 
                        ? '105 total students' 
                        : '3.4 GPA equivalent'}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {userType === 'teacher' ? 'Time Saved' : 'Feedback Received'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {userType === 'teacher' ? '18h' : '14'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {userType === 'teacher' 
                        ? 'This semester' 
                        : 'Detailed comments'}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Assignments</CardTitle>
                  <CardDescription>
                    {userType === 'teacher' 
                      ? 'Your recently created or graded assignments' 
                      : 'Your recently submitted or graded work'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAssignments.map(assignment => (
                      <div key={assignment.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{assignment.title}</h3>
                          <div className="text-sm text-gray-500">{assignment.subject} • {new Date(assignment.date).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 md:mt-0">
                          <div className={`text-sm font-medium px-2 py-1 rounded ${
                            assignment.status === 'Graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {assignment.status}
                          </div>
                          <div className="font-medium">{assignment.grade}</div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewDetails(assignment.id)}
                          >
                            <Eye size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/assignments">
                        View All Assignments
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="assignments" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between md:items-center">
                    <CardTitle>All Assignments</CardTitle>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input type="search" placeholder="Search..." className="pl-8 h-9" />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="mr-1 h-4 w-4" />
                        Filter
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...recentAssignments, ...recentAssignments].map((assignment, index) => (
                      <div key={`assignment-${index}`} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{assignment.title}</h3>
                          <div className="text-sm text-gray-500">{assignment.subject} • {new Date(assignment.date).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 md:mt-0">
                          <div className={`text-sm font-medium px-2 py-1 rounded ${
                            assignment.status === 'Graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {assignment.status}
                          </div>
                          <div className="font-medium">{assignment.grade}</div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewDetails(assignment.id)}
                          >
                            <Eye size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="classes" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between md:items-center">
                    <CardTitle>
                      {userType === 'teacher' ? 'My Classes' : 'Enrolled Classes'}
                    </CardTitle>
                    {userType === 'teacher' && (
                      <Button asChild className="mt-2 md:mt-0">
                        <Link to="/google-classroom">
                          <Plus className="mr-1 h-4 w-4" />
                          Add Class
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {classes.map(cls => (
                      <div key={cls.id} className="border rounded-lg p-4">
                        <h3 className="font-medium text-lg mb-2">{cls.name}</h3>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{cls.students} Students</span>
                          <span>{cls.assignments} Assignments</span>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm">
                            {userType === 'teacher' ? 'Manage Class' : 'View Class'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>Track student progress and identify learning trends</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex flex-col items-center justify-center">
                  <BarChart className="h-16 w-16 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium">Analytics Dashboard</h3>
                  <p className="text-gray-500 text-center max-w-md mt-2">
                    Detailed analytics are available in the full version of SCOLARIT. 
                    Upgrade your account to access performance insights.
                  </p>
                  <Button className="mt-6 bg-[#005558] hover:bg-[#005558]/90">Upgrade Account</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
