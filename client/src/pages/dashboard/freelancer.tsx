
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Plus, 
  Eye, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  FileText, 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Clock,
  LogOut,
  Play,
  LayoutDashboard,
  Bell,
  FolderPlus,
  Upload,
  Palette,
  Mail,
  Tag,
  Folder,
  Search,
  Filter,
  MoreHorizontal,
  Globe,
  Save,
  Image,
  Monitor,
  Smartphone,
  Tablet,
  Download,
  Calendar,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  Copy,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Project, ProjectFolder } from "@shared/schema";
import { FileUploadAdvanced } from "@/components/project/file-upload-advanced";

export default function FreelancerDashboard() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    clientEmail: "",
    clientName: "",
    price: "",
    deadline: "",
    folderId: "",
    tags: [] as string[],
  });

  const [newFolder, setNewFolder] = useState({
    name: "",
    color: "#3B82F6",
  });

  const [brandingSettings, setBrandingSettings] = useState({
    logoUrl: user?.logoUrl || "",
    bannerUrl: user?.bannerUrl || "",
    coverImageUrl: user?.coverImageUrl || "",
    brandColor: user?.brandColor || "#4F46E5",
    customThankYouMessage: user?.customThankYouMessage || "",
    redirectAfterPayment: user?.redirectAfterPayment || "",
    redirectAfterApproval: user?.redirectAfterApproval || "",
  });

  const [accountSettings, setAccountSettings] = useState({
    username: user?.username || "",
    email: user?.email || "",
    subdomain: user?.subdomain || "",
    notifications: {
      emailComments: true,
      emailApprovals: true,
      emailPayments: true,
      pushNotifications: true,
    },
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/projects'],
  });

  const { data: folders } = useQuery({
    queryKey: ['/api/folders'],
  });

  const { data: analytics } = useQuery({
    queryKey: ['/api/analytics/overview'],
  });

  const { data: messages } = useQuery({
    queryKey: ['/api/messages'],
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
        folderId: "",
        tags: [],
      });
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    },
  });

  const createFolderMutation = useMutation({
    mutationFn: async (folderData: any) => {
      const response = await apiRequest('POST', '/api/folders', folderData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/folders'] });
      setIsCreatingFolder(false);
      setNewFolder({ name: "", color: "#3B82F6" });
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest('PATCH', `/api/users/${user?.id}`, userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    createProjectMutation.mutate(newProject);
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    createFolderMutation.mutate(newFolder);
  };

  const handleSaveBranding = async () => {
    updateUserMutation.mutate(brandingSettings);
  };

  const handleSaveSettings = async () => {
    updateUserMutation.mutate(accountSettings);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'preview_shared': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'approved': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const stats = {
    totalProjects: projects?.projects?.length || 0,
    approvedProjects: projects?.projects?.filter((p: Project) => p.status === 'approved').length || 0,
    paidProjects: projects?.projects?.filter((p: Project) => p.status === 'paid' || p.status === 'completed').length || 0,
    totalEarnings: projects?.projects
      ?.filter((p: Project) => p.status === 'paid' || p.status === 'completed')
      ?.reduce((sum: number, p: Project) => sum + parseFloat(p.price), 0) || 0,
    unreadMessages: messages?.messages?.filter((m: any) => !m.isRead).length || 0,
    thisMonthViews: analytics?.thisMonthViews || 0,
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FileText },
    { id: 'upload', label: 'Upload Files', icon: Upload },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: stats.unreadMessages },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const filteredProjects = projects?.projects?.filter((project: Project) => {
    const matchesFolder = selectedFolder === 'all' || project.folderId?.toString() === selectedFolder;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  }) || [];

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-900">Please log in</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Play className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold text-gray-900">PayVidi</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeTab === item.id 
                      ? 'bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                  {item.badge && item.badge > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-500">Welcome back, {user.username}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" className="border-gray-300 text-gray-600 hover:bg-gray-50">
                <Bell className="h-4 w-4" />
              </Button>
              <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white border border-gray-200 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900">Create New Project</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Add a new project for your client
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateProject}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-gray-900">Project Title</Label>
                        <Input
                          id="title"
                          value={newProject.title}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          required
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-gray-900">Description</Label>
                        <Textarea
                          id="description"
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          className="bg-white border-gray-300 text-gray-900"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="clientName" className="text-gray-900">Client Name</Label>
                          <Input
                            id="clientName"
                            value={newProject.clientName}
                            onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clientEmail" className="text-gray-900">Client Email</Label>
                          <Input
                            id="clientEmail"
                            type="email"
                            value={newProject.clientEmail}
                            onChange={(e) => setNewProject({ ...newProject, clientEmail: e.target.value })}
                            required
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price" className="text-gray-900">Price ($)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={newProject.price}
                            onChange={(e) => setNewProject({ ...newProject, price: e.target.value })}
                            required
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="deadline" className="text-gray-900">Deadline</Label>
                          <Input
                            id="deadline"
                            type="date"
                            value={newProject.deadline}
                            onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="folder" className="text-gray-900">Folder</Label>
                        <Select value={newProject.folderId} onValueChange={(value) => setNewProject({ ...newProject, folderId: value })}>
                          <SelectTrigger className="bg-white border-gray-300">
                            <SelectValue placeholder="Select a folder (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {folders?.folders?.map((folder: ProjectFolder) => (
                              <SelectItem key={folder.id} value={folder.id.toString()}>
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 rounded" style={{ backgroundColor: folder.color }}></div>
                                  <span>{folder.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsCreating(false)} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium" disabled={createProjectMutation.isPending}>
                        {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                        <p className="text-sm text-gray-500">Total Projects</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stats.thisMonthViews}</p>
                        <p className="text-sm text-gray-500">This Month Views</p>
                      </div>
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stats.paidProjects}</p>
                        <p className="text-sm text-gray-500">Paid Projects</p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Total Earnings</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Projects */}
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-gray-900 text-xl">Recent Projects</CardTitle>
                      <CardDescription className="text-gray-500">Your latest project activity</CardDescription>
                    </div>
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => setActiveTab('projects')}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="text-center py-12 text-gray-500">Loading projects...</div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                      <p className="text-gray-500 mb-6">Create your first project to get started</p>
                      <Button onClick={() => setIsCreating(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredProjects.slice(0, 5).map((project: Project) => (
                        <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{project.title}</h4>
                                <p className="text-sm text-gray-500">{project.clientName || project.clientEmail}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">${project.price}</p>
                                {project.deadline && (
                                  <p className="text-sm text-gray-500">{new Date(project.deadline).toLocaleDateString()}</p>
                                )}
                              </div>
                              <Badge className={`${getStatusColor(project.status)} font-medium border`}>
                                {project.status.replace('_', ' ')}
                              </Badge>
                              <div className="flex space-x-2">
                                <Button asChild variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                                  <Link href={`/project/${project.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                {project.status !== 'draft' && (
                                  <Button asChild variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
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
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              {/* Project Management Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white border-gray-300"
                    />
                  </div>
                  <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                    <SelectTrigger className="w-48 bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {folders?.folders?.map((folder: ProjectFolder) => (
                        <SelectItem key={folder.id} value={folder.id.toString()}>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: folder.color }}></div>
                            <span>{folder.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        <FolderPlus className="h-4 w-4 mr-2" />
                        New Folder
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border border-gray-200">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900">Create New Folder</DialogTitle>
                        <DialogDescription className="text-gray-600">
                          Organize your projects with folders
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateFolder}>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="folderName" className="text-gray-900">Folder Name</Label>
                            <Input
                              id="folderName"
                              value={newFolder.name}
                              onChange={(e) => setNewFolder({ ...newFolder, name: e.target.value })}
                              required
                              className="bg-white border-gray-300 text-gray-900"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="folderColor" className="text-gray-900">Color</Label>
                            <Input
                              id="folderColor"
                              type="color"
                              value={newFolder.color}
                              onChange={(e) => setNewFolder({ ...newFolder, color: e.target.value })}
                              className="bg-white border-gray-300 h-12"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setIsCreatingFolder(false)} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium" disabled={createFolderMutation.isPending}>
                            {createFolderMutation.isPending ? "Creating..." : "Create Folder"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={() => setIsCreating(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project: Project) => (
                  <Card key={project.id} className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{project.clientName || project.clientEmail}</p>
                        </div>
                        <Badge className={`${getStatusColor(project.status)} ml-2`}>
                          {project.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Price</span>
                          <span className="font-semibold text-gray-900">${project.price}</span>
                        </div>
                        {project.deadline && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Deadline</span>
                            <span className="text-gray-900">{new Date(project.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 pt-3">
                          <Button asChild size="sm" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Link href={`/project/${project.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedProject(project);
                              setUploadDialogOpen(true);
                            }}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                          {project.status !== 'draft' && (
                            <Button asChild variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                              <Link href={`/preview/${project.id}`}>
                                <MessageSquare className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProjects.length === 0 && !isLoading && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchQuery || selectedFolder !== 'all' 
                      ? "Try adjusting your search or filter criteria" 
                      : "Create your first project to get started"
                    }
                  </p>
                  {!searchQuery && selectedFolder === 'all' && (
                    <Button onClick={() => setIsCreating(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Project
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Upload Project Files</CardTitle>
                  <CardDescription className="text-gray-500">
                    Select a project and upload preview or final files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {projects?.projects?.length === 0 ? (
                    <div className="text-center py-12">
                      <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects available</h3>
                      <p className="text-gray-500 mb-6">Create a project first to upload files</p>
                      <Button onClick={() => setIsCreating(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Project
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-gray-900">Select Project</Label>
                        <Select value={selectedProject?.id.toString() || ""} onValueChange={(value) => {
                          const project = projects?.projects?.find((p: Project) => p.id === parseInt(value));
                          setSelectedProject(project || null);
                        }}>
                          <SelectTrigger className="bg-white border-gray-300">
                            <SelectValue placeholder="Choose a project to upload files to" />
                          </SelectTrigger>
                          <SelectContent>
                            {projects?.projects?.map((project: Project) => (
                              <SelectItem key={project.id} value={project.id.toString()}>
                                {project.title} - {project.clientName || project.clientEmail}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {selectedProject && (
                        <div className="border border-gray-200 rounded-lg p-6">
                          <h3 className="font-semibold text-gray-900 mb-4">Upload to: {selectedProject.title}</h3>
                          <FileUploadAdvanced 
                            projectId={selectedProject.id}
                            onUploadComplete={() => {
                              queryClient.invalidateQueries({ queryKey: [`/api/projects/${selectedProject.id}/files`] });
                              toast({
                                title: "Success",
                                description: "Files uploaded successfully",
                              });
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{analytics?.totalViews || 0}</p>
                        <p className="text-sm text-gray-500">Total Views</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Eye className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{analytics?.avgEngagement || 0}%</p>
                        <p className="text-sm text-gray-500">Avg Engagement</p>
                      </div>
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{analytics?.totalComments || 0}</p>
                        <p className="text-sm text-gray-500">Total Comments</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{analytics?.conversionRate || 0}%</p>
                        <p className="text-sm text-gray-500">Conversion Rate</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Project Performance</CardTitle>
                  <CardDescription className="text-gray-500">Detailed analytics for each project</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredProjects.map((project: Project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{project.title}</h4>
                            <p className="text-sm text-gray-500">{project.clientName || project.clientEmail}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <p className="font-semibold text-gray-900">0</p>
                            <p className="text-gray-500">Views</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-gray-900">0</p>
                            <p className="text-gray-500">Comments</p>
                          </div>
                          <div className="text-center">
                            <p className="font-semibold text-gray-900">0%</p>
                            <p className="text-gray-500">Engagement</p>
                          </div>
                          <Button asChild variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                            <Link href={`/project/${project.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Client Messages</CardTitle>
                  <CardDescription className="text-gray-500">Communication with your clients</CardDescription>
                </CardHeader>
                <CardContent>
                  {messages?.messages?.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                      <p className="text-gray-500">Client messages will appear here when they contact you</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages?.messages?.map((message: any, index: number) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{message.senderName || message.senderEmail}</h4>
                              <span className="text-sm text-gray-500">{new Date(message.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-700">{message.message}</p>
                            <div className="flex items-center space-x-2 mt-3">
                              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">Reply</Button>
                              {!message.isRead && (
                                <Badge className="bg-red-100 text-red-700">New</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branding" className="space-y-6">
              <Card className="bg-white border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Brand Customization</CardTitle>
                  <CardDescription className="text-gray-500">
                    Customize your client-facing experience with your brand
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="logoUrl" className="text-gray-900">Logo URL</Label>
                        <Input
                          id="logoUrl"
                          value={brandingSettings.logoUrl}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, logoUrl: e.target.value })}
                          placeholder="https://example.com/logo.png"
                          className="bg-white border-gray-300"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bannerUrl" className="text-gray-900">Banner URL</Label>
                        <Input
                          id="bannerUrl"
                          value={brandingSettings.bannerUrl}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, bannerUrl: e.target.value })}
                          placeholder="https://example.com/banner.jpg"
                          className="bg-white border-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="coverImageUrl" className="text-gray-900">Cover Image URL</Label>
                        <Input
                          id="coverImageUrl"
                          value={brandingSettings.coverImageUrl}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, coverImageUrl: e.target.value })}
                          placeholder="https://example.com/cover.jpg"
                          className="bg-white border-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="brandColor" className="text-gray-900">Brand Color</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="brandColor"
                            type="color"
                            value={brandingSettings.brandColor}
                            onChange={(e) => setBrandingSettings({ ...brandingSettings, brandColor: e.target.value })}
                            className="w-16 h-12 bg-white border-gray-300"
                          />
                          <Input
                            value={brandingSettings.brandColor}
                            onChange={(e) => setBrandingSettings({ ...brandingSettings, brandColor: e.target.value })}
                            className="flex-1 bg-white border-gray-300"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="customThankYouMessage" className="text-gray-900">Custom Thank You Message</Label>
                        <Textarea
                          id="customThankYouMessage"
                          value={brandingSettings.customThankYouMessage}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, customThankYouMessage: e.target.value })}
                          placeholder="Thank you for choosing our services..."
                          className="bg-white border-gray-300"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="redirectAfterPayment" className="text-gray-900">Redirect After Payment</Label>
                        <Input
                          id="redirectAfterPayment"
                          value={brandingSettings.redirectAfterPayment}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, redirectAfterPayment: e.target.value })}
                          placeholder="https://yourwebsite.com/thank-you"
                          className="bg-white border-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="redirectAfterApproval" className="text-gray-900">Redirect After Approval</Label>
                        <Input
                          id="redirectAfterApproval"
                          value={brandingSettings.redirectAfterApproval}
                          onChange={(e) => setBrandingSettings({ ...brandingSettings, redirectAfterApproval: e.target.value })}
                          placeholder="https://yourwebsite.com/approved"
                          className="bg-white border-gray-300"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Preview Mode</h3>
                      <p className="text-sm text-gray-500">See how your branding will look to clients</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        <Monitor className="h-4 w-4 mr-2" />
                        Desktop
                      </Button>
                      <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        <Tablet className="h-4 w-4 mr-2" />
                        Tablet
                      </Button>
                      <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        <Smartphone className="h-4 w-4 mr-2" />
                        Mobile
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button onClick={handleSaveBranding} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
                      <Save className="h-4 w-4 mr-2" />
                      Save Branding
                    </Button>
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      Reset to Default
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Account Settings</CardTitle>
                    <CardDescription className="text-gray-500">
                      Manage your account information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-gray-900">Username</Label>
                      <Input
                        id="username"
                        value={accountSettings.username}
                        onChange={(e) => setAccountSettings({ ...accountSettings, username: e.target.value })}
                        className="bg-white border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-900">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={accountSettings.email}
                        onChange={(e) => setAccountSettings({ ...accountSettings, email: e.target.value })}
                        className="bg-white border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subdomain" className="text-gray-900">Custom Subdomain</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="subdomain"
                          value={accountSettings.subdomain}
                          onChange={(e) => setAccountSettings({ ...accountSettings, subdomain: e.target.value })}
                          className="bg-white border-gray-300"
                          placeholder="yourname"
                        />
                        <span className="text-gray-500 text-sm">.payvidi.com</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Your portfolio will be available at: {accountSettings.subdomain || 'yourname'}.payvidi.com
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Portfolio Settings</h4>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Public Portfolio</p>
                          <p className="text-sm text-gray-500">Make your work visible to everyone</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Show Pricing</p>
                          <p className="text-sm text-gray-500">Display project prices on your portfolio</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Allow Contact Form</p>
                          <p className="text-sm text-gray-500">Let visitors contact you directly</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <Button onClick={handleSaveSettings} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Notification Settings</CardTitle>
                    <CardDescription className="text-gray-500">
                      Choose how you want to be notified
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-500">Get notified about new comments</p>
                        </div>
                        <Switch 
                          checked={accountSettings.notifications.emailComments}
                          onCheckedChange={(checked) => 
                            setAccountSettings({
                              ...accountSettings,
                              notifications: { ...accountSettings.notifications, emailComments: checked }
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Project Approvals</p>
                          <p className="text-sm text-gray-500">Get notified when projects are approved</p>
                        </div>
                        <Switch 
                          checked={accountSettings.notifications.emailApprovals}
                          onCheckedChange={(checked) => 
                            setAccountSettings({
                              ...accountSettings,
                              notifications: { ...accountSettings.notifications, emailApprovals: checked }
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Payment Notifications</p>
                          <p className="text-sm text-gray-500">Get notified about payments</p>
                        </div>
                        <Switch 
                          checked={accountSettings.notifications.emailPayments}
                          onCheckedChange={(checked) => 
                            setAccountSettings({
                              ...accountSettings,
                              notifications: { ...accountSettings.notifications, emailPayments: checked }
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Push Notifications</p>
                          <p className="text-sm text-gray-500">Browser notifications</p>
                        </div>
                        <Switch 
                          checked={accountSettings.notifications.pushNotifications}
                          onCheckedChange={(checked) => 
                            setAccountSettings({
                              ...accountSettings,
                              notifications: { ...accountSettings.notifications, pushNotifications: checked }
                            })
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Quick Links</h4>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Globe className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">Your Portfolio</p>
                            <p className="text-sm text-gray-500">{accountSettings.subdomain || 'yourname'}.payvidi.com</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyToClipboard(`https://${accountSettings.subdomain || 'yourname'}.payvidi.com`)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <a href={`https://${accountSettings.subdomain || 'yourname'}.payvidi.com`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="bg-white border border-gray-200 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              Upload Files - {selectedProject?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Upload preview and final files for this project
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <FileUploadAdvanced 
              projectId={selectedProject.id}
              onUploadComplete={() => {
                queryClient.invalidateQueries({ queryKey: [`/api/projects/${selectedProject.id}/files`] });
                toast({
                  title: "Success",
                  description: "Files uploaded successfully",
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
