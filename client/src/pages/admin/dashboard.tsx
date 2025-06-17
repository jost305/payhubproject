import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/layout/navbar";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Settings,
  FileText,
  CreditCard,
  UserCheck
} from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">Monitor platform performance and manage users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.monthlyRevenue || 0}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Freelancers</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeFreelancers || 0}</div>
              <p className="text-xs text-muted-foreground">
                +5% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingApprovals || 0}</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Platform Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent User Registrations</CardTitle>
                <CardDescription>Latest users who joined the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock data - replace with actual user data */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">JD</span>
                      </div>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-slate-600">john@example.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge>Freelancer</Badge>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">SM</span>
                      </div>
                      <div>
                        <p className="font-medium">Sarah Miller</p>
                        <p className="text-sm text-slate-600">sarah@example.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Client</Badge>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest payment activities on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <CreditCard className="w-10 h-10 text-green-600" />
                      <div>
                        <p className="font-medium">Brand Video Project</p>
                        <p className="text-sm text-slate-600">Payment from client@example.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$1,500.00</p>
                      <p className="text-sm text-slate-600">Commission: $75.00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <CreditCard className="w-10 h-10 text-green-600" />
                      <div>
                        <p className="font-medium">Logo Design</p>
                        <p className="text-sm text-slate-600">Payment from another@example.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">$800.00</p>
                      <p className="text-sm text-slate-600">Commission: $40.00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Commission Settings</CardTitle>
                  <CardDescription>Configure platform commission rates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Starter Plan Commission</span>
                    <span className="font-semibold">5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Professional Plan Commission</span>
                    <span className="font-semibold">3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Enterprise Plan Commission</span>
                    <span className="font-semibold">2%</span>
                  </div>
                  <Button className="w-full">Update Rates</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>General platform configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Max File Size</span>
                    <span className="font-semibold">100MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Download Link Expiry</span>
                    <span className="font-semibold">7 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Max Download Attempts</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <Button className="w-full">Update Settings</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
