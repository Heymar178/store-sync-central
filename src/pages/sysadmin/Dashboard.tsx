
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SysAdminDashboard = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Store Layout</CardTitle>
            <CardDescription>Configure app layout sections</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Manage homepage sections, category layouts, and navigation elements.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Icons & Images</CardTitle>
            <CardDescription>Manage visual elements</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Update category icons, promotional banners, and other visual assets.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Labels & Text</CardTitle>
            <CardDescription>Customize terminology</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Edit section names, button text, and other content elements.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SysAdminDashboard;
