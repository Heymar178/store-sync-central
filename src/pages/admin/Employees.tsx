
import { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  status: "active" | "inactive";
}

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      firstName: "Alex",
      lastName: "Johnson",
      email: "alex.johnson@example.com",
      phone: "555-123-4567",
      position: "Store Manager",
      status: "active",
    },
    {
      id: "2",
      firstName: "Jamie",
      lastName: "Smith",
      email: "jamie.smith@example.com",
      phone: "555-987-6543",
      position: "Cashier",
      status: "active",
    },
    {
      id: "3",
      firstName: "Taylor",
      lastName: "Brown",
      email: "taylor.brown@example.com",
      phone: "555-456-7890",
      position: "Stock Clerk",
      status: "inactive",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredEmployees = employees.filter(employee => 
    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setCurrentEmployee(employee);
    } else {
      setCurrentEmployee({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "Cashier",
        status: "active",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentEmployee(null);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(employee => employee.id !== id));
    toast.success("Employee removed successfully");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentEmployee) return;

    if (currentEmployee.id) {
      // Update existing employee
      setEmployees(employees.map(employee => 
        employee.id === currentEmployee.id ? currentEmployee : employee
      ));
      toast.success("Employee updated successfully");
    } else {
      // Add new employee
      const newEmployee = {
        ...currentEmployee,
        id: Date.now().toString(),
      };
      setEmployees([...employees, newEmployee]);
      toast.success("Employee added successfully");
    }
    
    handleCloseDialog();
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Employees</CardTitle>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.phone}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          employee.status === "active" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {employee.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(employee)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      No employees found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Employee Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentEmployee?.id ? "Edit Employee" : "Add New Employee"}
            </DialogTitle>
            <DialogDescription>
              {currentEmployee?.id
                ? "Update the employee details below."
                : "Fill in the employee details below."}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={currentEmployee?.firstName || ""}
                  onChange={(e) => 
                    setCurrentEmployee(prev => 
                      prev ? { ...prev, firstName: e.target.value } : null
                    )
                  }
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={currentEmployee?.lastName || ""}
                  onChange={(e) => 
                    setCurrentEmployee(prev => 
                      prev ? { ...prev, lastName: e.target.value } : null
                    )
                  }
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={currentEmployee?.email || ""}
                  onChange={(e) => 
                    setCurrentEmployee(prev => 
                      prev ? { ...prev, email: e.target.value } : null
                    )
                  }
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={currentEmployee?.phone || ""}
                  onChange={(e) => 
                    setCurrentEmployee(prev => 
                      prev ? { ...prev, phone: e.target.value } : null
                    )
                  }
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">
                  Position
                </Label>
                <Select
                  value={currentEmployee?.position || "Cashier"}
                  onValueChange={(value) => 
                    setCurrentEmployee(prev => 
                      prev ? { ...prev, position: value } : null
                    )
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Store Manager">Store Manager</SelectItem>
                    <SelectItem value="Assistant Manager">Assistant Manager</SelectItem>
                    <SelectItem value="Cashier">Cashier</SelectItem>
                    <SelectItem value="Stock Clerk">Stock Clerk</SelectItem>
                    <SelectItem value="Customer Service">Customer Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={currentEmployee?.status || "active"}
                  onValueChange={(value: "active" | "inactive") => 
                    setCurrentEmployee(prev => 
                      prev ? { ...prev, status: value } : null
                    )
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {currentEmployee?.id ? "Save Changes" : "Add Employee"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Employees;
