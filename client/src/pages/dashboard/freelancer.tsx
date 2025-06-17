
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
import { Plus, Eye, MessageSquare, CreditCard, Settings, FileText, BarChart3, Users, TrendingUp, DollarSign, Clock } from "lucide-react";
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
      case 'draft': return 'bg-gray-600 text-gray-300';
      case 'preview_shared': return 'bg-blue-600 text-blue-300';
      case 'approved': return 'bg-yellow-600 text-yellow-300';
      case 'paid': return 'bg-green-500 text-black';
      case 'completed': return 'bg-green-600 text-green-300';
      default: return 'bg-gray-600 text-gray-300';
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
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Please log in</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user.username}</p>
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-2.5 rounded-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Project</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Add a new project for your client
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateProject}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white">Project Title</Label>
                      <Input
                        id="title"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        required
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white">Description</Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientName" className="text-white">Client Name</Label>
                        <Input
                          id="clientName"
                          value={newProject.clientName}
                          onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientEmail" className="text-white">Client Email</Label>
                        <Input
                          id="clientEmail"
                          type="email"
                          value={newProject.clientEmail}
                          onChange={(e) => setNewProject({ ...newProject, clientEmail: e.target.value })}
                          required
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-white">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProject.price}
                          onChange={(e) => setNewProject({ ...newProject, price: e.target.value })}
                          required
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deadline" className="text-white">Deadline</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={newProject.deadline}
                          onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreating(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-green-500 hover:bg-green-600 text-black font-semibold" disabled={createProjectMutation.isPending}>
                      {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
                  <p className="text-sm text-gray-400">Total Projects</p>
                </div>
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{stats.approvedProjects}</p>
                  <p className="text-sm text-gray-400">Approved</p>
                </div>
                <div className="w-12 h-12 bg-blue-900/50 rounded-xl flex items-center justify-center">
                  <Eye className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{stats.paidProjects}</p>
                  <p className="text-sm text-gray-400">Paid</p>
                </div>
                <div className="w-12 h-12 bg-green-900/50 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">${stats.totalEarnings.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">Total Earnings</p>
                </div>
                <div className="w-12 h-12 bg-purple-900/50 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-xl">Recent Projects</CardTitle>
                <CardDescription className="text-gray-400">Manage your active projects</CardDescription>
              </div>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="text-center py-12 text-gray-400">Loading projects...</div>
            ) : projects?.projects?.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
                <p className="text-gray-400 mb-6">Create your first project to get started</p>
                <Button onClick={() => setIsCreating(true)} className="bg-green-500 hover:bg-green-600 text-black font-semibold">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {projects?.projects?.slice(0, 5).map((project: Project) => (
                  <div key={project.id} className="p-6 hover:bg-gray-750 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{project.title}</h4>
                          <p className="text-sm text-gray-400">{project.clientName || project.clientEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-white">${project.price}</p>
                          {project.deadline && (
                            <p className="text-sm text-gray-400">{new Date(project.deadline).toLocaleDateString()}</p>
                          )}
                        </div>
                        <Badge className={`${getStatusColor(project.status)} font-medium`}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button asChild variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                            <Link href={`/project/${project.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {project.status !== 'draft' && (
                            <Button asChild variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                              <Link href={`/preview/${project.id}`}>
                                <MessageSquare className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
