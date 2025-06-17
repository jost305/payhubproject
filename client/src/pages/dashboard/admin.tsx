import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { Users, CreditCard, TrendingUp, Settings, FileText, DollarSign } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import type { User, Project, Payment } from "@shared/schema";

export default function AdminDashboard() {
  const { user } = useAuth();

  const { data: users } = useQuery({
    queryKey: ['/api/admin/users'],
  });

  const { data: projects } = useQuery({
    queryKey: ['/api/projects'],
  });

  const { data: payments } = useQuery({
    queryKey: ['/api/admin/payments'],
  });

  const stats = {
    totalUsers: users?.users?.length || 0,
    totalFreelancers: users?.users?.filter((u: User) => u.role === 'freelancer').length || 0,
    totalProjects: projects?.projects?.length || 0,
    totalRevenue: payments?.payments?.reduce((sum: number, p: Payment) => sum + parseFloat(p.amount), 0) || 0,
    totalCommission: payments?.payments?.reduce((sum: number, p: Payment) => sum + parseFloat(p.commission), 0) || 0,
    completedPayments: payments?.payments?.filter((p: Payment) => p.status === 'completed').length || 0,
  };

  if (!user || user.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600">Platform overview and management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-900">{stats.totalUsers}</p>
                  <p className="text-sm text-slate-600">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-900">{stats.totalProjects}</p>
                  <p className="text-sm text-slate-600">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-900">${stats.totalRevenue.toFixed(2)}</p>
                  <p className="text-sm text-slate-600">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-900">${stats.totalCommission.toFixed(2)}</p>
                  <p className="text-sm text-slate-600">Commission Earned</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
                <CardDescription>Manage platform users and freelancers</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Subdomain</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.users?.map((user: User) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.subdomain || '-'}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Projects Overview</CardTitle>
                <CardDescription>Monitor all projects across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Freelancer</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects?.projects?.map((project: Project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>ID: {project.freelancerId}</TableCell>
                        <TableCell>{project.clientEmail}</TableCell>
                        <TableCell>${project.price}</TableCell>
                        <TableCell>
                          <Badge className={
                            project.status === 'completed' ? 'bg-green-100 text-green-800' :
                            project.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'approved' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {project.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Transactions</CardTitle>
                <CardDescription>Monitor all payment transactions and commissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project ID</TableHead>
                      <TableHead>Client Email</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments?.payments?.map((payment: Payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>#{payment.projectId}</TableCell>
                        <TableCell>{payment.clientEmail}</TableCell>
                        <TableCell>${payment.amount}</TableCell>
                        <TableCell>${payment.commission}</TableCell>
                        <TableCell>
                          <Badge className={
                            payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure platform-wide settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-slate-900">Default Commission Rate</p>
                    <p className="text-sm text-slate-600">5%</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Active Freelancers</p>
                    <p className="text-sm text-slate-600">{stats.totalFreelancers}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Completed Payments</p>
                    <p className="text-sm text-slate-600">{stats.completedPayments}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Platform Status</p>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
