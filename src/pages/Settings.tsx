import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Settings, Bell, Lock, User, Globe, Moon, Sun, Check, Smartphone, Laptop, Cloud, Download, Upload, RefreshCw, AlertCircle, Save, Mail, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

const SettingsPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    alerts: {
      weather: true,
      pests: true,
      irrigation: false,
      harvest: true
    }
  });
  const [dataSharing, setDataSharing] = useState({
    analytics: true,
    marketing: false,
    research: true,
    thirdParty: false
  });
  
  const [profile, setProfile] = useState({
    name: 'John Farmer',
    email: 'john@fieldprime.com',
    phone: '+91 98765 43210',
    organization: 'Field Prime Farms',
    role: 'Farm Manager'
  });
  
  const [syncStatus, setSyncStatus] = useState({
    lastSync: new Date().toLocaleString(),
    syncProgress: 100,
    syncInProgress: false,
    dataSize: '2.4 GB'
  });
  
  // Simulate sync progress
  useEffect(() => {
    if (syncStatus.syncInProgress) {
      const interval = setInterval(() => {
        setSyncStatus(prev => {
          const newProgress = prev.syncProgress + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            return {
              ...prev,
              syncProgress: 100,
              syncInProgress: false,
              lastSync: new Date().toLocaleString()
            };
          }
          return {
            ...prev,
            syncProgress: newProgress
          };
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [syncStatus.syncInProgress]);
  
  const handleSaveSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated successfully.',
      });
    }, 1000);
  };
  
  const handleSaveGeneral = () => {
    toast({
      title: 'General settings saved',
      description: 'Your general settings have been updated.',
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: 'Notification settings saved',
      description: 'Your notification preferences have been updated.',
    });
  };

  const handleSavePrivacy = () => {
    toast({
      title: 'Privacy settings saved',
      description: 'Your privacy settings have been updated.',
    });
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    
    // This would typically update the theme in a real application
    document.documentElement.classList.toggle('dark', !darkMode);
  };
  
  const handleStartSync = () => {
    setSyncStatus(prev => ({
      ...prev,
      syncProgress: 0,
      syncInProgress: true
    }));
    
    toast({
      title: 'Sync started',
      description: 'Synchronizing your data with the cloud...',
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-6"
    >
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Settings', href: '#' },
        ]}
      />
      
      <div className="flex items-center justify-between mb-6 mt-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your application preferences and account settings.</p>
        </div>
      </div>
      
      {/* Settings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Theme</p>
                <h3 className="text-lg font-medium">{darkMode ? 'Dark Mode' : 'Light Mode'}</h3>
              </div>
              {darkMode ? (
                <Moon className="h-6 w-6 text-blue-500" />
              ) : (
                <Sun className="h-6 w-6 text-yellow-500" />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data Sync</p>
                <h3 className="text-lg font-medium">{syncStatus.syncInProgress ? 'Syncing...' : 'Last: ' + syncStatus.lastSync}</h3>
              </div>
              {syncStatus.syncInProgress ? (
                <RefreshCw className="h-6 w-6 text-blue-500 animate-spin" />
              ) : (
                <Cloud className="h-6 w-6 text-green-500" />
              )}
            </div>
            {syncStatus.syncInProgress && (
              <Progress value={syncStatus.syncProgress} className="h-2 mt-2" />
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                <h3 className="text-lg font-medium">{Object.values(notifications).filter(Boolean).length} Enabled</h3>
              </div>
              <Bell className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your basic application preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <Switch 
                      checked={darkMode} 
                      onCheckedChange={setDarkMode} 
                    />
                    <Moon className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="fieldprime_user" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="user@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select 
                    id="language" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email alerts for important updates</p>
                  </div>
                  <Switch checked={notifications.email} onCheckedChange={(checked) => setNotifications(prev => ({...prev, email: checked}))} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Alert Frequency</Label>
                    <p className="text-sm text-muted-foreground">How often you want to receive alerts</p>
                  </div>
                  <select 
                    className="w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="realtime">Real-time</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>Manage your privacy and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Data Sharing</Label>
                    <p className="text-sm text-muted-foreground">Allow anonymous usage data to improve services</p>
                  </div>
                  <Switch checked={dataSharing} onCheckedChange={setDataSharing} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>

                <div className="pt-4">
                  <Button variant="destructive" className="w-full sm:w-auto">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePrivacy}>Update Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default SettingsPage;