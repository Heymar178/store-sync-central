
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage store products</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Add, edit, and organize products available for pickup.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Manage customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Review, update, and process customer pickup orders.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Employees</CardTitle>
            <CardDescription>Manage store employees</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Add and manage employees who can fulfill pickup orders.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
