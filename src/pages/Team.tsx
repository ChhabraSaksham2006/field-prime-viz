import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Mail, Phone, MessageSquare, UserCog, Trash2, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Team = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    { 
      id: 1, 
      name: 'Rahul Sharma', 
      role: 'Farm Manager', 
      email: 'rahul@example.com', 
      phone: '+91 98765 43210',
      status: 'active',
      avatar: '/placeholder.svg'
    },
    { 
      id: 2, 
      name: 'Priya Patel', 
      role: 'Agronomist', 
      email: 'priya@example.com', 
      phone: '+91 87654 32109',
      status: 'active',
      avatar: '/placeholder.svg'
    },
    { 
      id: 3, 
      name: 'Amit Kumar', 
      role: 'Field Technician', 
      email: 'amit@example.com', 
      phone: '+91 76543 21098',
      status: 'inactive',
      avatar: '/placeholder.svg'
    },
    { 
      id: 4, 
      name: 'Sneha Gupta', 
      role: 'Data Analyst', 
      email: 'sneha@example.com', 
      phone: '+91 65432 10987',
      status: 'active',
      avatar: '/placeholder.svg'
    },
  ]);

  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = () => {
    if (!newMember.name || !newMember.role || !newMember.email) {
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
      const newId = teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.id)) + 1 : 1;
      
      setTeamMembers(prev => [
        ...prev,
        {
          id: newId,
          name: newMember.name,
          role: newMember.role,
          email: newMember.email,
          phone: newMember.phone || 'Not provided',
          status: 'active',
          avatar: '/placeholder.svg'
        },
      ]);

      setNewMember({
        name: '',
        role: '',
        email: '',
        phone: '',
      });

      setIsLoading(false);
      
      toast({
        title: 'Team member added',
        description: `${newMember.name} has been added to the team.`,
      });
    }, 1000);
  };

  const handleDeleteMember = (id: number) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
    
    toast({
      title: 'Team member removed',
      description: 'The team member has been removed successfully.',
    });
  };

  const handleToggleStatus = (id: number) => {
    setTeamMembers(prev => prev.map(member => {
      if (member.id === id) {
        return {
          ...member,
          status: member.status === 'active' ? 'inactive' : 'active'
        };
      }
      return member;
    }));
    
    toast({
      title: 'Status updated',
      description: 'Team member status has been updated.',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inactive</Badge>;
      default:
        return <Badge className="bg-blue-500">{status}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">Manage your team members and their roles.</p>
        </div>
        <Users className="h-8 w-8 text-muted-foreground" />
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="add">Add Member</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Team Overview</CardTitle>
                  <CardDescription>Manage your team members and their contact information.</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="manager">Farm Manager</SelectItem>
                      <SelectItem value="agronomist">Agronomist</SelectItem>
                      <SelectItem value="technician">Field Technician</SelectItem>
                      <SelectItem value="analyst">Data Analyst</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{member.email}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{member.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          className="px-2 py-1 h-auto" 
                          onClick={() => handleToggleStatus(member.id)}
                        >
                          {member.status === 'active' ? (
                            <Badge className="bg-green-500 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" /> Inactive
                            </Badge>
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <UserCog className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDeleteMember(member.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add Team Member</CardTitle>
              <CardDescription>Add a new member to your agricultural team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name*</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={newMember.name} 
                    onChange={handleInputChange} 
                    placeholder="John Doe" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role*</Label>
                  <Select 
                    onValueChange={(value) => setNewMember(prev => ({ ...prev, role: value }))}
                    value={newMember.role}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Farm Manager">Farm Manager</SelectItem>
                      <SelectItem value="Agronomist">Agronomist</SelectItem>
                      <SelectItem value="Field Technician">Field Technician</SelectItem>
                      <SelectItem value="Data Analyst">Data Analyst</SelectItem>
                      <SelectItem value="Drone Operator">Drone Operator</SelectItem>
                      <SelectItem value="Irrigation Specialist">Irrigation Specialist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address*</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={newMember.email} 
                    onChange={handleInputChange} 
                    placeholder="john@example.com" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={newMember.phone} 
                    onChange={handleInputChange} 
                    placeholder="+91 98765 43210" 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddMember} disabled={isLoading}>
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
                    <UserPlus className="mr-2 h-4 w-4" /> Add Team Member
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
              <CardDescription>Manage team roles and access permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2 border-primary">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Farm Manager</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4">Full access to all system features and management capabilities.</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Dashboard</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Field Management</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Team Management</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Data Sources</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Settings</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Agronomist</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4">Access to field data, health maps, and analysis tools.</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Dashboard</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Field Management</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Team Management</span>
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Data Sources</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Settings</span>
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Field Technician</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4">Limited access focused on field operations and data collection.</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Dashboard</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Field Management</span>
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Team Management</span>
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Data Sources</span>
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Settings</span>
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button variant="outline" className="mr-2">
                    <Shield className="mr-2 h-4 w-4" />
                    Create Custom Role
                  </Button>
                  <Button>
                    <UserCog className="mr-2 h-4 w-4" />
                    Manage Permissions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Team;