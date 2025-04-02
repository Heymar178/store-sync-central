
import { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AppLabel {
  id: string;
  key: string;
  value: string;
  description: string;
}

const Labels = () => {
  const [labels, setLabels] = useState<AppLabel[]>([
    { 
      id: "1", 
      key: "homepage.welcome", 
      value: "Welcome to our store",
      description: "Welcome message on the homepage" 
    },
    { 
      id: "2", 
      key: "homepage.featuredSection", 
      value: "Featured Products",
      description: "Title for the featured products section" 
    },
    { 
      id: "3", 
      key: "homepage.newArrivalsSection", 
      value: "New Arrivals",
      description: "Title for the new arrivals section" 
    },
    { 
      id: "4", 
      key: "checkout.buttonText", 
      value: "Complete Order",
      description: "Text for the checkout button" 
    },
    { 
      id: "5", 
      key: "product.addToCartButton", 
      value: "Add to Cart",
      description: "Text for the add to cart button" 
    },
  ]);

  const handleLabelChange = (id: string, newValue: string) => {
    setLabels(
      labels.map((label) =>
        label.id === id ? { ...label, value: newValue } : label
      )
    );
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to Supabase
    toast.success("Label changes saved successfully");
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Labels & Text</CardTitle>
          <CardDescription>
            Customize the text labels used throughout the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {labels.map((label) => (
              <div key={label.id} className="border rounded-md p-4">
                <p className="font-medium text-sm text-gray-500">{label.key}</p>
                <p className="text-xs text-gray-400 mb-2">{label.description}</p>
                <Input
                  value={label.value}
                  onChange={(e) => handleLabelChange(label.id, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges} className="ml-auto">
            Save Label Changes
          </Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  );
};

export default Labels;
