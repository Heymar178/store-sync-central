import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase.ts';// Adjusted path to match project structure

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  sku: string;
  inStock: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, price, category, sku, available");

    if (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } else {
      const formattedProducts = data.map((product) => ({
        ...product,
        inStock: product.available,
      }));
      setProducts(formattedProducts);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
    } else {
      setCurrentProduct({
        id: "",
        name: "",
        price: 0,
        category: "Fruits",
        sku: "",
        inStock: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentProduct(null);
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } else {
      setProducts(products.filter(product => product.id !== id));
      toast.success("Product deleted successfully");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProduct) return;

    if (currentProduct.id) {
      // Update existing product
      const { error } = await supabase
        .from("products")
        .update({
          name: currentProduct.name,
          price: currentProduct.price,
          category: currentProduct.category,
          sku: currentProduct.sku,
          available: currentProduct.inStock,
        })
        .eq("id", currentProduct.id);

      if (error) {
        console.error("Error updating product:", error);
        toast.error("Failed to update product");
      } else {
        setProducts(products.map(product => 
          product.id === currentProduct.id ? currentProduct : product
        ));
        toast.success("Product updated successfully");
      }
    } else {
      // Add new product
      const { data, error } = await supabase
        .from("products")
        .insert({
          name: currentProduct.name,
          price: currentProduct.price,
          category: currentProduct.category,
          sku: currentProduct.sku,
          available: currentProduct.inStock,
        })
        .select();

      if (error) {
        console.error("Error adding product:", error);
        toast.error("Failed to add product");
      } else {
        setProducts([...products, { ...currentProduct, id: data[0].id }]);
        toast.success("Product added successfully");
      }
    }
    
    handleCloseDialog();
  };

  return (
    <DashboardLayout>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products</CardTitle>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.inStock 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentProduct?.id ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {currentProduct?.id
                ? "Update the product details below."
                : "Fill in the product details below."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={currentProduct?.name || ""}
                  onChange={(e) => 
                    setCurrentProduct(prev => 
                      prev ? { ...prev, name: e.target.value } : null
                    )
                  }
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentProduct?.price || 0}
                  onChange={(e) => 
                    setCurrentProduct(prev => 
                      prev ? { ...prev, price: parseFloat(e.target.value) } : null
                    )
                  }
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={currentProduct?.category || "Fruits"}
                  onValueChange={(value) => 
                    setCurrentProduct(prev => 
                      prev ? { ...prev, category: value } : null
                    )
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fruits">Fruits</SelectItem>
                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                    <SelectItem value="Dairy">Dairy</SelectItem>
                    <SelectItem value="Bakery">Bakery</SelectItem>
                    <SelectItem value="Meat">Meat</SelectItem>
                    <SelectItem value="Seafood">Seafood</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sku" className="text-right">
                  SKU
                </Label>
                <Input
                  id="sku"
                  value={currentProduct?.sku || ""}
                  onChange={(e) => 
                    setCurrentProduct(prev => 
                      prev ? { ...prev, sku: e.target.value } : null
                    )
                  }
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={currentProduct?.inStock ? "inStock" : "outOfStock"}
                  onValueChange={(value) => 
                    setCurrentProduct(prev => 
                      prev ? { ...prev, inStock: value === "inStock" } : null
                    )
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inStock">In Stock</SelectItem>
                    <SelectItem value="outOfStock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {currentProduct?.id ? "Save Changes" : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Products;