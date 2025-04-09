
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Video, VideoOff, Mic, MicOff, Users, ArrowRight, Copy, 
  Calendar, Plus, MonitorSmartphone, VideoIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const VideoMeet = () => {
  const [meetLink, setMeetLink] = useState('');
  const [zoomLink, setZoomLink] = useState('');
  const [isCreatingMeet, setIsCreatingMeet] = useState(false);
  const [isCreatingZoom, setIsCreatingZoom] = useState(false);
  const [isJoiningMeet, setIsJoiningMeet] = useState(false);
  const [isJoiningZoom, setIsJoiningZoom] = useState(false);
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
  
  const createNewMeeting = (platform: 'google' | 'zoom') => {
    if (platform === 'google') {
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
    } else {
      setIsCreatingZoom(true);
      
      // Simulate Zoom API call delay
      setTimeout(() => {
        const zoomMeetingId = Math.floor(Math.random() * 1000000000) + 1000000000;
        const fullZoomLink = `https://zoom.us/j/${zoomMeetingId}`;
        setZoomLink(fullZoomLink);
        setIsCreatingZoom(false);
        
        toast({
          title: "Zoom meeting created",
          description: "New Zoom meeting link is ready to share",
        });
      }, 1500);
    }
  };
  
  const joinMeeting = (platform: 'google' | 'zoom') => {
    const link = platform === 'google' ? meetLink : zoomLink;
    const setIsJoining = platform === 'google' ? setIsJoiningMeet : setIsJoiningZoom;
    
    if (!link) {
      toast({
        variant: "destructive",
        title: `${platform === 'google' ? 'Google Meet' : 'Zoom'} link required`,
        description: `Please enter a valid ${platform === 'google' ? 'Google Meet' : 'Zoom'} link`,
      });
      return;
    }
    
    setIsJoining(true);
    
    // Simulate joining process
    setTimeout(() => {
      window.open(link, '_blank');
      setIsJoining(false);
    }, 1000);
  };
  
  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied to clipboard",
      description: "Meeting link copied successfully",
    });
  };
  
  const scheduleMeeting = (platform: 'google' | 'zoom') => {
    if (platform === 'google') {
      window.open('https://calendar.google.com/calendar/u/0/r/eventedit?add=meet', '_blank');
      toast({
        title: "Opening Google Calendar",
        description: "Schedule your meeting with Google Calendar",
      });
    } else {
      window.open('https://zoom.us/meeting/schedule', '_blank');
      toast({
        title: "Opening Zoom Scheduler",
        description: "Schedule your meeting with Zoom",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold gradient-text mb-2">Virtual Classroom</h1>
            <p className="text-gray-600 mb-8">Create or join video meetings for virtual teaching and learning</p>
            
            <Tabs defaultValue="google" className="mb-8">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="google" className="flex items-center gap-2">
                  <VideoIcon size={18} />
                  Google Meet
                </TabsTrigger>
                <TabsTrigger value="zoom" className="flex items-center gap-2">
                  <MonitorSmartphone size={18} />
                  Zoom
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="google">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="mb-4 text-center">
                      <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                        <Video className="h-8 w-8 text-blue-600" />
                      </div>
                      <h2 className="text-xl font-semibold mt-4">Create a Google Meet</h2>
                      <p className="text-gray-500 text-sm mt-1">Generate a new Google Meet link</p>
                    </div>
                    
                    <Button 
                      onClick={() => createNewMeeting('google')} 
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
                            onClick={() => copyToClipboard(meetLink)}
                            className="ml-2"
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={() => scheduleMeeting('google')}
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
                      <h2 className="text-xl font-semibold mt-4">Join a Google Meet</h2>
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
                      onClick={() => joinMeeting('google')} 
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
              </TabsContent>
              
              <TabsContent value="zoom">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border border-blue-400 shadow-sm hover:shadow-md transition-shadow">
                    <div className="mb-4 text-center">
                      <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                        <MonitorSmartphone className="h-8 w-8 text-blue-600" />
                      </div>
                      <h2 className="text-xl font-semibold mt-4">Create a Zoom Meeting</h2>
                      <p className="text-gray-500 text-sm mt-1">Generate a new Zoom meeting link</p>
                    </div>
                    
                    <Button 
                      onClick={() => createNewMeeting('zoom')} 
                      disabled={isCreatingZoom}
                      className="w-full bg-blue-600 hover:bg-blue-500 mt-4"
                    >
                      {isCreatingZoom ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus size={16} className="mr-2" />
                          Create New Zoom Meeting
                        </>
                      )}
                    </Button>
                    
                    {zoomLink && (
                      <div className="mt-4">
                        <label className="text-sm font-medium">Your Zoom Link:</label>
                        <div className="flex items-center mt-1">
                          <Input 
                            value={zoomLink} 
                            readOnly 
                            className="bg-gray-50"
                          />
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={() => copyToClipboard(zoomLink)}
                            className="ml-2"
                          >
                            <Copy size={16} />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={() => scheduleMeeting('zoom')}
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
                      <h2 className="text-xl font-semibold mt-4">Join a Zoom Meeting</h2>
                      <p className="text-gray-500 text-sm mt-1">Enter an existing Zoom meeting link</p>
                    </div>
                    
                    <div className="mt-4">
                      <label className="text-sm font-medium">Zoom Meeting Link:</label>
                      <Input
                        value={zoomLink}
                        onChange={(e) => setZoomLink(e.target.value)}
                        placeholder="https://zoom.us/j/1234567890"
                        className="mt-1"
                      />
                    </div>
                    
                    <Button 
                      onClick={() => joinMeeting('zoom')} 
                      disabled={isJoiningZoom || !zoomLink}
                      className="w-full bg-purple-600 hover:bg-purple-500 mt-4"
                    >
                      {isJoiningZoom ? (
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
              </TabsContent>
            </Tabs>
            
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
