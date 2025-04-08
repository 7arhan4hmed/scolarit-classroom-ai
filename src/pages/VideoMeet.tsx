
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Video, VideoOff, Mic, MicOff, Users, ArrowRight, Copy, Calendar, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VideoMeet = () => {
  const [meetLink, setMeetLink] = useState('');
  const [isCreatingMeet, setIsCreatingMeet] = useState(false);
  const [isJoiningMeet, setIsJoiningMeet] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign up or login first.",
      });
      navigate('/login');
      return;
    }
  }, [navigate, toast]);
  
  const generateMeetId = () => {
    // Generate a random meet ID (in reality, this would use Google Meet API)
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      if (i < 2) result += '-';
    }
    return result;
  };
  
  const createNewMeeting = () => {
    setIsCreatingMeet(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newMeetId = generateMeetId();
      const fullMeetLink = `https://meet.google.com/${newMeetId}`;
      setMeetLink(fullMeetLink);
      setIsCreatingMeet(false);
      
      toast({
        title: "Meeting created",
        description: "New Google Meet link is ready to share",
      });
    }, 1500);
  };
  
  const joinMeeting = () => {
    if (!meetLink) {
      toast({
        variant: "destructive",
        title: "Meeting link required",
        description: "Please enter a valid Google Meet link",
      });
      return;
    }
    
    setIsJoiningMeet(true);
    
    // Simulate joining process
    setTimeout(() => {
      // In a real implementation, this would redirect to the actual Google Meet URL
      // or embed the Google Meet iframe if their API allows
      window.open(meetLink, '_blank');
      setIsJoiningMeet(false);
    }, 1000);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(meetLink);
    toast({
      title: "Copied to clipboard",
      description: "Meeting link copied successfully",
    });
  };
  
  const scheduleMeeting = () => {
    // This would integrate with Google Calendar API in a real implementation
    window.open('https://calendar.google.com/calendar/u/0/r/eventedit?add=meet', '_blank');
    toast({
      title: "Opening Google Calendar",
      description: "Schedule your meeting with Google Calendar",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold gradient-text mb-2">Virtual Classroom</h1>
            <p className="text-gray-600 mb-8">Create or join Google Meet sessions for virtual teaching and learning</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Video className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold mt-4">Create a Meeting</h2>
                  <p className="text-gray-500 text-sm mt-1">Generate a new Google Meet link</p>
                </div>
                
                <Button 
                  onClick={createNewMeeting} 
                  disabled={isCreatingMeet}
                  className="w-full bg-blue-600 hover:bg-blue-500 mt-4"
                >
                  {isCreatingMeet ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={16} className="mr-2" />
                      Create New Meeting
                    </>
                  )}
                </Button>
                
                {meetLink && (
                  <div className="mt-4">
                    <label className="text-sm font-medium">Your Meeting Link:</label>
                    <div className="flex items-center mt-1">
                      <Input 
                        value={meetLink} 
                        readOnly 
                        className="bg-gray-50"
                      />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={copyToClipboard}
                        className="ml-2"
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  onClick={scheduleMeeting}
                  className="w-full mt-4 border-blue-200 text-blue-700"
                >
                  <Calendar size={16} className="mr-2" />
                  Schedule for Later
                </Button>
              </Card>
              
              <Card className="p-6 border border-purple-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-semibold mt-4">Join a Meeting</h2>
                  <p className="text-gray-500 text-sm mt-1">Enter an existing Google Meet link</p>
                </div>
                
                <div className="mt-4">
                  <label className="text-sm font-medium">Meeting Link:</label>
                  <Input
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    placeholder="https://meet.google.com/abc-def-ghi"
                    className="mt-1"
                  />
                </div>
                
                <Button 
                  onClick={joinMeeting} 
                  disabled={isJoiningMeet || !meetLink}
                  className="w-full bg-purple-600 hover:bg-purple-500 mt-4"
                >
                  {isJoiningMeet ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                      Joining...
                    </>
                  ) : (
                    <>
                      <ArrowRight size={16} className="mr-2" />
                      Join Meeting
                    </>
                  )}
                </Button>
              </Card>
            </div>
            
            <Card className="p-6 border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Tips for Online Teaching</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Mic className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Audio Quality Matters</h3>
                    <p className="text-gray-600 text-sm">Use a headset with a microphone for clearer audio and reduced background noise.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Video className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Camera Positioning</h3>
                    <p className="text-gray-600 text-sm">Position your camera at eye level and ensure good lighting on your face.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Engage Your Students</h3>
                    <p className="text-gray-600 text-sm">Use polls, breakout rooms, and interactive questions to keep students engaged.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VideoMeet;
