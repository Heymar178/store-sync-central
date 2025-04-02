
import { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Section {
  id: string;
  name: string;
  order: number;
  enabled: boolean;
}

const StoreLayout = () => {
  const [sections, setSections] = useState<Section[]>([
    { id: "1", name: "Featured", order: 0, enabled: true },
    { id: "2", name: "New Arrivals", order: 1, enabled: true },
    { id: "3", name: "Best Sellers", order: 2, enabled: true },
    { id: "4", name: "On Sale", order: 3, enabled: true },
  ]);
  
  const [newSectionName, setNewSectionName] = useState("");

  const handleAddSection = () => {
    if (!newSectionName.trim()) {
      toast.error("Section name cannot be empty");
      return;
    }
    
    const newSection: Section = {
      id: Date.now().toString(),
      name: newSectionName,
      order: sections.length,
      enabled: true,
    };
    
    setSections([...sections, newSection]);
    setNewSectionName("");
    toast.success("New section added");
  };

  const handleRemoveSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
    toast.success("Section removed");
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to Supabase
    toast.success("Layout changes saved successfully");
  };

  return (
    <DashboardLayout>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Store Layout Configuration</CardTitle>
          <CardDescription>
            Configure the sections that appear in the mobile application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newSection">Add New Section</Label>
              <div className="flex mt-1 space-x-2">
                <Input
                  id="newSection"
                  placeholder="Enter section name"
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                />
                <Button onClick={handleAddSection}>
                  <Plus className="mr-2 h-4 w-4" /> Add
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md">
              <div className="bg-gray-50 p-4 border-b">
                <h3 className="font-medium">Current Sections</h3>
              </div>
              <div className="divide-y">
                {sections.map((section) => (
                  <div key={section.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{section.name}</p>
                      <p className="text-sm text-gray-500">Order: {section.order + 1}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveSection(section.id)}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </div>
                ))}
                {sections.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No sections defined. Add a new section above.
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges} className="ml-auto">
            Save Layout Changes
          </Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
};

export default StoreLayout;
