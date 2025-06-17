import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { Plus, Eye, MessageSquare, CreditCard, Settings, FileText, BarChart3, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/layout/navbar";
import type { Project } from "@shared/schema";

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    clientEmail: "",
    clientName: "",
    price: "",
    deadline: "",
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      const response = await apiRequest('POST', '/api/projects', projectData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setIsCreating(false);
      setNewProject({
        title: "",
        description: "",
        clientEmail: "",
        clientName: "",
        price: "",
        deadline: "",
      });
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate(newProject);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'preview_shared': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalProjects: projects?.projects?.length || 0,
    approvedProjects: projects?.projects?.filter((p: Project) => p.status === 'approved').length || 0,
    paidProjects: projects?.projects?.filter((p: Project) => p.status === 'paid' || p.status === 'completed').length || 0,
    totalEarnings: projects?.projects
      ?.filter((p: Project) => p.status === 'paid' || p.status === 'completed')
      ?.reduce((sum: number, p: Project) => sum + parseFloat(p.price), 0) || 0,
  };

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Welcome back, {user.username}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-primary" />
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
                <Eye className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-900">{stats.approvedProjects}</p>
                  <p className="text-sm text-slate-600">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-900">{stats.paidProjects}</p>
                  <p className="text-sm text-slate-600">Paid</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-slate-900">${stats.totalEarnings.toFixed(2)}</p>
                  <p className="text-sm text-slate-600">Total Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Add a new project for your client
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateProject}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title</Label>
                      <Input
                        id="title"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientName">Client Name</Label>
                        <Input
                          id="clientName"
                          value={newProject.clientName}
                          onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientEmail">Client Email</Label>
                        <Input
                          id="clientEmail"
                          type="email"
                          value={newProject.clientEmail}
                          onChange={(e) => setNewProject({ ...newProject, clientEmail: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProject.price}
                          onChange={(e) => setNewProject({ ...newProject, price: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={newProject.deadline}
                          onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="gradient-primary text-white" disabled={createProjectMutation.isPending}>
                      {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="projects">
            {isLoading ? (
              <div className="text-center py-8">Loading projects...</div>
            ) : projects?.projects?.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects yet</h3>
                  <p className="text-slate-600 mb-4">Create your first project to get started</p>
                  <Button onClick={() => setIsCreating(true)} className="gradient-primary text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects?.projects?.map((project: Project) => (
                  <Card key={project.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription>{project.clientName || project.clientEmail}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Price:</span>
                          <span className="font-semibold">${project.price}</span>
                        </div>
                        {project.deadline && (
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Deadline:</span>
                            <span className="text-sm">{new Date(project.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link href={`/project/${project.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                        {project.status !== 'draft' && (
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/preview/${project.id}`}>
                              <MessageSquare className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="subdomain">Custom Subdomain</Label>
                  <div className="flex mt-1">
                    <Input
                      id="subdomain"
                      placeholder="yourname"
                      className="rounded-r-none"
                      value={user.subdomain || ""}
                    />
                    <div className="bg-slate-100 border border-l-0 border-slate-300 px-3 py-2 rounded-r-lg text-sm text-slate-600">
                      .payvidi.com
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    Your clients will access your projects at yourname.payvidi.com
                  </p>
                </div>
                <Button className="gradient-primary text-white">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
