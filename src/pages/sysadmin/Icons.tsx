
import { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";

interface CategoryIcon {
  id: string;
  name: string;
  imageUrl: string;
}

const Icons = () => {
  const [icons, setIcons] = useState<CategoryIcon[]>([
    { id: "1", name: "Fruits", imageUrl: "https://via.placeholder.com/150" },
    { id: "2", name: "Vegetables", imageUrl: "https://via.placeholder.com/150" },
    { id: "3", name: "Dairy", imageUrl: "https://via.placeholder.com/150" },
    { id: "4", name: "Bakery", imageUrl: "https://via.placeholder.com/150" },
  ]);

  const handleIconNameChange = (id: string, newName: string) => {
    setIcons(
      icons.map((icon) =>
        icon.id === id ? { ...icon, name: newName } : icon
      )
    );
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to Supabase
    toast.success("Icon changes saved successfully");
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload to Supabase Storage
    toast.success("Image upload would happen here");
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Category Icons</CardTitle>
          <CardDescription>
            Update the icons and labels used for product categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {icons.map((icon) => (
              <Card key={icon.id} className="overflow-hidden">
                <div className="aspect-square bg-gray-100 relative flex items-center justify-center">
                  <img
                    src={icon.imageUrl}
                    alt={icon.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Label 
                      htmlFor={`upload-${icon.id}`} 
                      className="bg-white text-black rounded-md px-3 py-2 cursor-pointer flex items-center"
                    >
                      <UploadCloud className="mr-2 h-4 w-4" />
                      Change Icon
                    </Label>
                    <Input
                      id={`upload-${icon.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(icon.id, e)}
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  <Label htmlFor={`name-${icon.id}`} className="sr-only">
                    Category Name
                  </Label>
                  <Input
                    id={`name-${icon.id}`}
                    value={icon.name}
                    onChange={(e) => handleIconNameChange(icon.id, e.target.value)}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Icons;
