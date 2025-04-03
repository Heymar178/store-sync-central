import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
import { supabase } from "@/lib/supabase.ts";

const mapStatusLabel: Record<string, string> = {
  Pending: "Pending",
  Ready: "Ready for Pickup",
  Completed: "Completed",
  Cancelled: "Cancelled",
  Refunded: "Refunded",
};

const statusOptions = Object.keys(mapStatusLabel);

const mapStatusToDbValue: Record<string, string> = {
  Pending: "Pending",
  Ready: "Ready",
  Completed: "Completed",
  Cancelled: "Cancelled",
  Refunded: "Refunded",
};

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
  status: keyof typeof mapStatusLabel;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchOrders = async () => {
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select(`
        id,
        user_id,
        status,
        total_price,
        created_at,
        users (name),
        order_items (
          id,
          quantity,
          price,
          products (name)
        )
      `);

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      toast.error("Failed to fetch orders");
      return;
    }

    const formattedOrders = ordersData.map((order: any) => ({
      id: order.id,
      customerName: order.users?.name || "Unknown Customer",
      date: new Date(order.created_at).toLocaleDateString(),
      items: order.order_items.map((item: any) => ({
        id: item.id,
        name: item.products?.name || "Unknown Product",
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total_price,
      status: order.status || "Pending",
    }));

    setOrders(formattedOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

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

  const handleUpdateStatus = async (orderId: string, newStatus: Order["status"]) => {
    const dbStatus = mapStatusToDbValue[newStatus];

    const { error } = await supabase
      .from("orders")
      .update({ status: dbStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Supabase update error:", error.message);
      toast.error("Failed to update order status");
      return;
    }

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prevSelectedOrder) =>
        prevSelectedOrder ? { ...prevSelectedOrder, status: newStatus } : null
      );
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
            <div className="w-full md:w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {mapStatusLabel[status]}
                    </SelectItem>
                  ))}
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
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "Ready"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {mapStatusLabel[order.status]}
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
                        <TableCell className="text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${selectedOrder.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <Button
                      key={status}
                      variant={selectedOrder.status === status ? "default" : "outline"}
                      onClick={() => handleUpdateStatus(selectedOrder.id, status as Order["status"])}
                      className={
                        status === "Pending"
                          ? "text-yellow-800"
                          : status === "Ready"
                          ? "text-blue-800"
                          : status === "Completed"
                          ? "text-green-800"
                          : status === "Cancelled"
                          ? "text-red-800"
                          : "text-gray-800"
                      }
                    >
                      {mapStatusLabel[status]}
                    </Button>
                  ))}
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
