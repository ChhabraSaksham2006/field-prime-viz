import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Leaf, Plus, Edit, Trash2, MapPin, Crop, ArrowUpDown, Calendar, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const FieldManagement = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, setFields] = useState([
    { id: 1, name: 'North Field', area: '12.5', crop: 'Wheat', health: 'Good', lastInspection: '2023-10-15' },
    { id: 2, name: 'South Field', area: '8.3', crop: 'Corn', health: 'Excellent', lastInspection: '2023-10-12' },
    { id: 3, name: 'East Field', area: '15.7', crop: 'Soybeans', health: 'Fair', lastInspection: '2023-10-08' },
    { id: 4, name: 'West Field', area: '10.2', crop: 'Rice', health: 'Good', lastInspection: '2023-10-14' },
  ]);

  const [newField, setNewField] = useState({
    name: '',
    area: '',
    crop: '',
    coordinates: '',
    soilType: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewField(prev => ({ ...prev, [name]: value }));
  };

  const handleAddField = () => {
    if (!newField.name || !newField.area || !newField.crop) {
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
      const newId = fields.length > 0 ? Math.max(...fields.map(f => f.id)) + 1 : 1;
      
      setFields(prev => [
        ...prev,
        {
          id: newId,
          name: newField.name,
          area: newField.area,
          crop: newField.crop,
          health: 'Not assessed',
          lastInspection: 'N/A',
        },
      ]);

      setNewField({
        name: '',
        area: '',
        crop: '',
        coordinates: '',
        soilType: '',
      });

      setIsLoading(false);
      
      toast({
        title: 'Field added',
        description: `${newField.name} has been added successfully.`,
      });
    }, 1000);
  };

  const handleDeleteField = (id: number) => {
    setFields(prev => prev.filter(field => field.id !== id));
    
    toast({
      title: 'Field deleted',
      description: 'The field has been removed successfully.',
    });
  };

  const getHealthBadge = (health: string) => {
    switch (health.toLowerCase()) {
      case 'excellent':
        return <Badge className="bg-green-500">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-green-400">Good</Badge>;
      case 'fair':
        return <Badge className="bg-yellow-500">Fair</Badge>;
      case 'poor':
        return <Badge className="bg-red-500">Poor</Badge>;
      default:
        return <Badge className="bg-gray-500">Not assessed</Badge>;
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Field Management</h1>
          <p className="text-muted-foreground">Manage your farm fields and monitor crop health.</p>
        </div>
        <Leaf className="h-8 w-8 text-muted-foreground" />
      </div>

      <Tabs defaultValue="fields" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="add">Add New Field</TabsTrigger>
          <TabsTrigger value="planning">Crop Planning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fields">
          <Card>
            <CardHeader>
              <CardTitle>Field Overview</CardTitle>
              <CardDescription>Manage and monitor all your agricultural fields.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Name</TableHead>
                        <TableHead className="w-[140px]">Area (ha)</TableHead>
                        <TableHead className="w-[180px]">Current Crop</TableHead>
                        <TableHead className="w-[160px]">Health Status</TableHead>
                        <TableHead className="w-[180px]">Last Inspection</TableHead>
                        <TableHead className="text-right w-[160px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                <TableBody>
                  {fields.map((field) => (
                    <TableRow key={field.id}>
                      <TableCell className="font-medium">{field.name}</TableCell>
                      <TableCell>{field.area}</TableCell>
                      <TableCell>{field.crop}</TableCell>
                      <TableCell>{getHealthBadge(field.health)}</TableCell>
                      <TableCell>{field.lastInspection}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleDeleteField(field.id)}
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
              <CardTitle>Add New Field</CardTitle>
              <CardDescription>Register a new agricultural field to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Field Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={newField.name} 
                    onChange={handleInputChange} 
                    placeholder="e.g., North Field" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area (hectares)</Label>
                  <Input 
                    id="area" 
                    name="area" 
                    type="number" 
                    value={newField.area} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 12.5" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crop">Current Crop</Label>
                  <Select 
                    onValueChange={(value) => setNewField(prev => ({ ...prev, crop: value }))}
                    value={newField.crop}
                  >
                    <SelectTrigger id="crop">
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wheat">Wheat</SelectItem>
                      <SelectItem value="Corn">Corn</SelectItem>
                      <SelectItem value="Rice">Rice</SelectItem>
                      <SelectItem value="Barley">Barley</SelectItem>
                      <SelectItem value="Soybeans">Soybeans</SelectItem>
                      <SelectItem value="Cotton">Cotton</SelectItem>
                      <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Select 
                    onValueChange={(value) => setNewField(prev => ({ ...prev, soilType: value }))}
                    value={newField.soilType}
                  >
                    <SelectTrigger id="soilType">
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Loamy">Loamy</SelectItem>
                      <SelectItem value="Clay">Clay</SelectItem>
                      <SelectItem value="Sandy">Sandy</SelectItem>
                      <SelectItem value="Silty">Silty</SelectItem>
                      <SelectItem value="Peaty">Peaty</SelectItem>
                      <SelectItem value="Chalky">Chalky</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="coordinates">Coordinates (optional)</Label>
                  <Input 
                    id="coordinates" 
                    name="coordinates" 
                    value={newField.coordinates} 
                    onChange={handleInputChange} 
                    placeholder="e.g., 12.345, 67.890" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plantingDate">Planting Date (optional)</Label>
                  <Input 
                    id="plantingDate" 
                    name="plantingDate" 
                    type="date"
                    value={newField['plantingDate'] || ''}
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="harvestDate">Expected Harvest Date (optional)</Label>
                  <Input 
                    id="harvestDate" 
                    name="harvestDate" 
                    type="date"
                    value={newField['harvestDate'] || ''}
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAddField}>
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
                    Add Field
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="planning">
          <Card>
            <CardHeader>
              <CardTitle>Crop Planning</CardTitle>
              <CardDescription>Plan your crop rotations and schedules.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Upcoming Planting Schedule</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Field</TableHead>
                        <TableHead className="w-[120px]">Crop</TableHead>
                        <TableHead className="w-[140px]">Planting Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>North Field</TableCell>
                        <TableCell>Wheat</TableCell>
                        <TableCell>2023-11-15</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>East Field</TableCell>
                        <TableCell>Barley</TableCell>
                        <TableCell>2023-11-20</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>South Field</TableCell>
                        <TableCell>Corn</TableCell>
                        <TableCell>2024-03-10</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="xl:col-span-1">
                  <h3 className="text-lg font-semibold mb-4">Upcoming Harvest Schedule</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Field</TableHead>
                        <TableHead className="w-[120px]">Crop</TableHead>
                        <TableHead className="w-[140px]">Harvest Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>West Field</TableCell>
                        <TableCell>Rice</TableCell>
                        <TableCell>2023-10-30</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>South Field</TableCell>
                        <TableCell>Corn</TableCell>
                        <TableCell>2023-11-05</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Recommended Crop Rotation</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">Field</TableHead>
                      <TableHead className="w-[140px]">Current Crop</TableHead>
                      <TableHead className="w-[160px]">Recommended Next Crop</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>North Field</TableCell>
                      <TableCell>Wheat</TableCell>
                      <TableCell>Legumes</TableCell>
                      <TableCell>Nitrogen fixation</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>East Field</TableCell>
                      <TableCell>Soybeans</TableCell>
                      <TableCell>Corn</TableCell>
                      <TableCell>Nutrient utilization</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>South Field</TableCell>
                      <TableCell>Corn</TableCell>
                      <TableCell>Wheat</TableCell>
                      <TableCell>Disease prevention</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                <div className="flex justify-end mt-4">
                  <Button variant="outline" className="mr-2">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Planning Meeting
                  </Button>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export Plan
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

export default FieldManagement;