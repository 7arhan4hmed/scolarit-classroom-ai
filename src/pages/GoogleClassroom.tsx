
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, RefreshCw, Download, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mock data for classes and assignments
const mockClasses = [
  { id: '1', name: 'AP Biology', students: 32, assignments: 5 },
  { id: '2', name: 'English Literature', students: 28, assignments: 3 },
  { id: '3', name: 'World History', students: 30, assignments: 4 },
];

const mockAssignments = [
  { 
    id: '101', 
    title: 'Midterm Essay', 
    dueDate: '2025-04-10', 
    className: 'AP Biology',
    submitted: 28,
    graded: 0,
    status: 'ready'  // ready, in-progress, completed
  },
  { 
    id: '102', 
    title: 'Lab Report: Photosynthesis', 
    dueDate: '2025-04-07', 
    className: 'AP Biology',
    submitted: 30,
    graded: 15,
    status: 'in-progress'
  },
  { 
    id: '103', 
    title: 'Character Analysis', 
    dueDate: '2025-04-05', 
    className: 'English Literature',
    submitted: 25,
    graded: 25,
    status: 'completed'
  },
];

const GoogleClassroomPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [classes] = useState(mockClasses);
  const [assignments] = useState(mockAssignments);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Classes Refreshed",
        description: "Your Google Classroom data has been synchronized.",
      });
    }, 1500);
  };

  const handleGradeAssignment = (assignmentId: string) => {
    setSelectedAssignment(assignmentId);
    // In a real app, this would navigate to a grading interface
    toast({
      title: "Starting Automated Grading",
      description: "EduGrade AI is now processing student submissions.",
    });
    
    setTimeout(() => {
      const updatedAssignments = assignments.map(a => 
        a.id === assignmentId ? { ...a, status: 'in-progress' } : a
      );
      // In a real app, you would update the assignment status
      setSelectedAssignment(null);
      toast({
        title: "Grading In Progress",
        description: "You will be notified when the grading is complete.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 pt-6 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="mb-4" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Google Classroom Integration</h1>
              <Button 
                onClick={handleRefresh} 
                disabled={isRefreshing}
              >
                <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Sync Classes'}
              </Button>
            </div>
            <p className="text-muted-foreground mt-2">
              Manage your Google Classroom classes and assignments with EduGrade
            </p>
          </div>

          <Tabs defaultValue="assignments">
            <TabsList className="mb-6">
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="settings">Integration Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assignments">
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">Assignments to Grade</h2>
                </div>
                <div className="divide-y">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{assignment.title}</h3>
                          <div className="text-sm text-muted-foreground mt-1">
                            <span className="inline-block mr-4">
                              {assignment.className}
                            </span>
                            <span className="inline-flex items-center">
                              <Clock size={14} className="mr-1" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {assignment.status === 'ready' && (
                            <Button 
                              onClick={() => handleGradeAssignment(assignment.id)}
                              disabled={selectedAssignment === assignment.id}
                            >
                              {selectedAssignment === assignment.id ? (
                                <>
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Download size={16} className="mr-2" />
                                  Grade with AI
                                </>
                              )}
                            </Button>
                          )}
                          
                          {assignment.status === 'in-progress' && (
                            <div className="flex items-center text-amber-600">
                              <AlertTriangle size={16} className="mr-2" />
                              <span className="mr-2">Grading in progress</span>
                              <Button variant="outline" size="sm">Review</Button>
                            </div>
                          )}
                          
                          {assignment.status === 'completed' && (
                            <div className="flex items-center text-green-600">
                              <CheckCircle2 size={16} className="mr-2" />
                              <span className="mr-2">Grading completed</span>
                              <Button variant="outline" size="sm">View Results</Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-3">
                        <div className="bg-gray-100 h-2 flex-grow rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              assignment.status === 'completed' 
                                ? 'bg-green-500' 
                                : assignment.status === 'in-progress' 
                                ? 'bg-amber-500' 
                                : 'bg-gray-300'
                            }`} 
                            style={{ width: `${(assignment.graded / assignment.submitted) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-muted-foreground ml-3">
                          {assignment.graded}/{assignment.submitted} graded
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="classes">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                  <div key={cls.id} className="bg-white rounded-lg border shadow-sm p-5">
                    <h3 className="text-xl font-medium">{cls.name}</h3>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Students:</span>
                        <span className="font-medium">{cls.students}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assignments:</span>
                        <span className="font-medium">{cls.assignments}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View Class
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Integration Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Connected Account</h3>
                    <div className="flex items-center p-3 bg-gray-50 border rounded-md">
                      <img 
                        src="/google-classroom-icon.png" 
                        alt="Google Classroom"
                        className="h-8 w-8 mr-3 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      <div>
                        <div className="font-medium">teacher@school.edu</div>
                        <div className="text-sm text-muted-foreground">Connected on Apr 5, 2025</div>
                      </div>
                      <Button variant="outline" className="ml-auto">
                        Disconnect
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Sync Settings</h3>
                    <div className="space-y-3 p-3 bg-gray-50 border rounded-md">
                      <div className="flex items-center justify-between">
                        <label className="font-medium" htmlFor="auto-sync">
                          Auto-sync classes and assignments
                        </label>
                        <input 
                          type="checkbox" 
                          id="auto-sync" 
                          defaultChecked 
                          className="h-5 w-5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue/25"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="font-medium" htmlFor="push-grades">
                          Automatically push grades to Google Classroom
                        </label>
                        <input 
                          type="checkbox" 
                          id="push-grades" 
                          defaultChecked 
                          className="h-5 w-5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue/25"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="font-medium" htmlFor="notify-students">
                          Notify students when grades are published
                        </label>
                        <input 
                          type="checkbox" 
                          id="notify-students" 
                          defaultChecked 
                          className="h-5 w-5 rounded border-gray-300 text-brand-blue focus:ring-brand-blue/25"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Settings</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GoogleClassroomPage;
