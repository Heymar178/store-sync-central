
import { useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "ready" | "completed" | "cancelled";
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customerName: "John Smith",
      date: "2023-06-15",
      items: [
        { id: "1", name: "Organic Banana", quantity: 2, price: 0.99 },
        { id: "2", name: "Red Apple", quantity: 3, price: 1.29 },
      ],
      total: 5.85,
      status: "pending",
    },
    {
      id: "ORD-002",
      customerName: "Sarah Johnson",
      date: "2023-06-15",
      items: [
        { id: "3", name: "Broccoli", quantity: 1, price: 2.49 },
        { id: "4", name: "Whole Milk", quantity: 2, price: 3.99 },
      ],
      total: 10.47,
      status: "ready",
    },
    {
      id: "ORD-003",
      customerName: "Michael Brown",
      date: "2023-06-14",
      items: [
        { id: "5", name: "White Bread", quantity: 1, price: 2.99 },
        { id: "1", name: "Organic Banana", quantity: 3, price: 0.99 },
        { id: "4", name: "Whole Milk", quantity: 1, price: 3.99 },
      ],
      total: 9.95,
      status: "completed",
    },
    {
      id: "ORD-004",
      customerName: "Emily Wilson",
      date: "2023-06-14",
      items: [
        { id: "2", name: "Red Apple", quantity: 5, price: 1.29 },
        { id: "3", name: "Broccoli", quantity: 2, price: 2.49 },
      ],
      total: 11.43,
      status: "cancelled",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = (orderId: string, newStatus: "pending" | "ready" | "completed" | "cancelled") => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    
    toast.success(`Order ${orderId} status updated to ${newStatus}`);
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customer Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div className="w-full md:w-[180px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="ready">Ready for Pickup</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === "pending" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : order.status === "ready"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {order.status === "pending" 
                            ? "Pending" 
                            : order.status === "ready"
                            ? "Ready for Pickup"
                            : order.status === "completed"
                            ? "Completed"
                            : "Cancelled"
                          }
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order {selectedOrder.id}</DialogTitle>
              <DialogDescription>
                {selectedOrder.date} - {selectedOrder.customerName}
              </DialogDescription>
            </DialogHeader>
            
            <div>
              <h3 className="font-medium mb-2">Items</h3>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                      <TableCell className="text-right font-medium">${selectedOrder.total.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedOrder.status === "pending" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedOrder.id, "pending")}
                    className="text-yellow-800"
                  >
                    Pending
                  </Button>
                  <Button
                    variant={selectedOrder.status === "ready" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedOrder.id, "ready")}
                    className="text-blue-800"
                  >
                    Ready for Pickup
                  </Button>
                  <Button
                    variant={selectedOrder.status === "completed" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedOrder.id, "completed")}
                    className="text-green-800"
                  >
                    Completed
                  </Button>
                  <Button
                    variant={selectedOrder.status === "cancelled" ? "default" : "outline"}
                    onClick={() => handleUpdateStatus(selectedOrder.id, "cancelled")}
                    className="text-red-800"
                  >
                    Cancelled
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default Orders;
