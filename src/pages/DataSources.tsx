import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Database, Plus, RefreshCw, Trash2, ExternalLink, AlertCircle, CheckCircle, CloudOff, Cloud, BarChart, FileText, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';

const DataSources = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStats, setConnectionStats] = useState({
    total: 0,
    connected: 0,
    disconnected: 0,
    syncing: 0
  });
  
  const [dataSources, setDataSources] = useState([
    { 
      id: 1, 
      name: 'Weather API', 
      type: 'API', 
      status: 'connected',
      lastSync: '2023-10-15 14:30',
      dataPoints: 1240,
      health: 98
    },
    { 
      id: 2, 
      name: 'Soil Sensors', 
      type: 'IoT', 
      status: 'connected',
      lastSync: '2023-10-15 15:45',
      dataPoints: 5678,
      health: 100
    },
    { 
      id: 3, 
      name: 'Drone Imagery', 
      type: 'File Import', 
      status: 'disconnected',
      lastSync: '2023-10-10 09:15',
      dataPoints: 342,
      health: 0
    },
    { 
      id: 4, 
      name: 'Satellite Data', 
      type: 'API', 
      status: 'connected',
      lastSync: '2023-10-15 12:00',
      dataPoints: 890,
      health: 87
    },
  ]);

  const [newSource, setNewSource] = useState({
    name: '',
    type: '',
    endpoint: '',
    apiKey: '',
    refreshInterval: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSource(prev => ({ ...prev, [name]: value }));
  };

  // Calculate connection statistics
  useEffect(() => {
    if (dataSources.length > 0) {
      const connected = dataSources.filter(source => source.status === 'connected').length;
      const disconnected = dataSources.filter(source => source.status === 'disconnected').length;
      const syncing = dataSources.filter(source => source.status === 'syncing').length;
      
      setConnectionStats({
        total: dataSources.length,
        connected,
        disconnected,
        syncing
      });
    }
  }, [dataSources]);

  const handleAddSource = () => {
    if (!newSource.name || !newSource.type) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newId = dataSources.length > 0 ? Math.max(...dataSources.map(s => s.id)) + 1 : 1;
      
      setDataSources(prev => [
        ...prev,
        {
          id: newId,
          name: newSource.name,
          type: newSource.type,
          status: 'connected',
          lastSync: new Date().toLocaleString(),
          dataPoints: 0,
          health: 100
        },
      ]);

      setNewSource({
        name: '',
        type: '',
        endpoint: '',
        apiKey: '',
        refreshInterval: '',
      });
      
      setIsLoading(false);

      toast({
        title: 'Data source added',
        description: `${newSource.name} has been connected successfully.`,
      });
    }, 1000);
  };

  const handleDeleteSource = (id: number) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setDataSources(prev => prev.filter(source => source.id !== id));
      
      setIsLoading(false);
      
      toast({
        title: 'Data source removed',
        description: 'The data source has been disconnected and removed.',
      });
    }, 1000);
  };

  const handleSyncSource = (id: number) => {
    setIsLoading(true);
    
    // Update status to syncing
    setDataSources(prev => prev.map(source => {
      if (source.id === id) {
        return {
          ...source,
          status: 'syncing',
        };
      }
      return source;
    }));
    
    // Simulate API call
    setTimeout(() => {
      setDataSources(prev => prev.map(source => {
        if (source.id === id) {
          return {
            ...source,
            status: 'connected',
            lastSync: new Date().toLocaleString(),
            health: Math.min(100, source.health + 5)
          };
        }
        return source;
      }));
      
      setIsLoading(false);
      
      toast({
        title: 'Sync initiated',
        description: 'The data source is being synchronized.',
    });
    }, 1000);
  };

  const handleToggleStatus = (id: number) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setDataSources(prev => prev.map(source => {
        if (source.id === id) {
          const newStatus = source.status === 'connected' ? 'disconnected' : 'connected';
          return {
            ...source,
            status: newStatus
          };
        }
        return source;
      }));
      
      setIsLoading(false);
      
      toast({
        title: 'Status updated',
        description: 'Data source connection status has been updated.',
      });
    }, 800);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'connected':
        return <Badge className="bg-green-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Connected</Badge>;
      case 'disconnected':
        return <Badge className="bg-red-500 flex items-center gap-1"><CloudOff className="h-3 w-3" /> Disconnected</Badge>;
      case 'syncing':
        return <Badge variant="outline" className="border-blue-500 text-blue-500 flex items-center gap-1"><RefreshCw className="h-3 w-3 animate-spin" /> Syncing</Badge>;
      default:
        return <Badge className="bg-blue-500">{status}</Badge>;
    }
  };

  const getHealthIndicator = (health: number) => {
    if (health === 0) {
      return <CloudOff className="h-5 w-5 text-red-500" />;
    }
    if (health < 70) {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-6"
    >
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Management', href: '#' },
          { label: 'Data Sources', href: '#' },
        ]}
      />
      
      <div className="flex items-center justify-between mb-6 mt-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Sources</h1>
          <p className="text-muted-foreground">Manage your data connections and integrations</p>
          <p className="text-muted-foreground">Manage your data integrations and connections.</p>
        </div>
        <Database className="h-8 w-8 text-muted-foreground" />
      </div>
      
      {/* Connection Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sources</p>
                <h3 className="text-2xl font-bold">{connectionStats.total}</h3>
              </div>
              <Database className="h-8 w-8 text-primary opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Connected</p>
                <h3 className="text-2xl font-bold">{connectionStats.connected}</h3>
              </div>
              <Cloud className="h-8 w-8 text-green-500" />
            </div>
            <Progress 
              value={(connectionStats.connected / connectionStats.total) * 100 || 0} 
              className="h-2 mt-2" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Disconnected</p>
                <h3 className="text-2xl font-bold">{connectionStats.disconnected}</h3>
              </div>
              <CloudOff className="h-8 w-8 text-destructive opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Syncing</p>
                <h3 className="text-2xl font-bold">{connectionStats.syncing}</h3>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sources" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="add">Add New Source</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Connected Data Sources</CardTitle>
                  <CardDescription>Manage your data integrations and monitor their status.</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="iot">IoT Devices</SelectItem>
                      <SelectItem value="file">File Import</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Data Points</TableHead>
                    <TableHead>Health</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataSources.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <Database className="h-10 w-10 mb-2" />
                          <p>No data sources connected yet.</p>
                          <p className="text-sm">Add your first data source to get started.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    dataSources.map((source) => (
                      <TableRow key={source.id}>
                        <TableCell className="font-medium">{source.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {source.type === 'API' && <Wifi className="h-4 w-4 text-blue-500" />}
                            {source.type === 'Database' && <Database className="h-4 w-4 text-purple-500" />}
                            {source.type === 'IoT' && <BarChart className="h-4 w-4 text-green-500" />}
                            {source.type === 'File Import' && <FileText className="h-4 w-4 text-orange-500" />}
                            {source.type}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            className="px-2 py-1 h-auto" 
                            onClick={() => handleToggleStatus(source.id)}
                            disabled={source.status === 'syncing'}
                          >
                            {getStatusBadge(source.status)}
                          </Button>
                        </TableCell>
                        <TableCell>{source.lastSync}</TableCell>
                        <TableCell>{source.dataPoints.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getHealthIndicator(source.health)}
                            <Progress value={source.health} className="w-[60px] h-2" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleSyncSource(source.id)}
                              disabled={source.status === 'disconnected' || source.status === 'syncing' || isLoading}
                            >
                              <RefreshCw className={`h-4 w-4 ${source.status === 'syncing' ? 'animate-spin' : ''}`} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteSource(source.id)}
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add Data Source</CardTitle>
              <CardDescription>Connect a new data source to your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Source Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={newSource.name} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Weather API" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Source Type</Label>
                  <Select 
                    onValueChange={(value) => setNewSource(prev => ({ ...prev, type: value }))}
                    value={newSource.type}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="API">API</SelectItem>
                      <SelectItem value="Database">Database</SelectItem>
                      <SelectItem value="IoT">IoT Devices</SelectItem>
                      <SelectItem value="File Import">File Import</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endpoint">Endpoint URL</Label>
                <Input 
                  id="endpoint" 
                  name="endpoint" 
                  value={newSource.endpoint} 
                  onChange={handleInputChange} 
                  placeholder="https://api.example.com/data" 
                />
              </div>
              
              <div className="space-y-2 pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-sync" className="cursor-pointer">Enable Auto-Sync</Label>
                  <Switch id="auto-sync" />
                </div>
                <p className="text-sm text-muted-foreground">Automatically sync data at regular intervals</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddSource} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Data Source
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Synchronization Logs</CardTitle>
              <CardDescription>View data synchronization history and events.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <RefreshCw className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sync Logs Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  We're working on detailed synchronization logs including error tracking, 
                  performance metrics, and data quality monitoring.
                </p>
                <Button variant="outline">
                  Get Notified When Available
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Available Integrations</CardTitle>
              <CardDescription>Connect with third-party services and data providers.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Weather Services</CardTitle>
                      <Badge>Available</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">Access real-time weather data and forecasts for your fields.</p>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-3 w-3" /> Connect
                      </Button>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Soil Sensors</CardTitle>
                      <Badge>Available</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">Connect with soil moisture and nutrient sensors in your fields.</p>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-3 w-3" /> Connect
                      </Button>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Drone Imagery</CardTitle>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">Import and analyze aerial imagery from drone surveys.</p>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm" disabled>
                        <AlertCircle className="mr-2 h-3 w-3" /> Unavailable
                      </Button>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Irrigation Systems</CardTitle>
                      <Badge>Available</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">Connect and control smart irrigation systems remotely.</p>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-3 w-3" /> Connect
                      </Button>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Satellite Imagery</CardTitle>
                      <Badge>Available</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">Access satellite imagery and vegetation indices for your fields.</p>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-3 w-3" /> Connect
                      </Button>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Equipment Tracking</CardTitle>
                      <Badge variant="outline">Coming Soon</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">Track and monitor farm equipment location and usage.</p>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" size="sm" disabled>
                        <AlertCircle className="mr-2 h-3 w-3" /> Unavailable
                      </Button>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default DataSources;