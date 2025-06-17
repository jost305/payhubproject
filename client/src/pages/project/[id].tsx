import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/layout/navbar";
import { FileUpload } from "@/components/project/file-upload";
import { TimelineComments } from "@/components/project/timeline-comments";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Share, Upload, Eye, MessageSquare, Settings } from "lucide-react";
import { Link } from "wouter";
import type { Project } from "@shared/schema";

export default function ProjectPage() {
  const [, params] = useRoute("/project/:id");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: project, isLoading } = useQuery({
    queryKey: [`/api/projects/${params?.id}`],
    enabled: !!params?.id,
  });

  const { data: comments } = useQuery({
    queryKey: [`/api/projects/${params?.id}/comments`],
    enabled: !!params?.id,
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (updates: Partial<Project>) => {
      const response = await apiRequest('PATCH', `/api/projects/${params?.id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${params?.id}`] });
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = async (newStatus: string) => {
    updateProjectMutation.mutate({ status: newStatus });
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

  if (isLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  if (!project?.project) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Project not found</div>;
  }

  const projectData = project.project;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard/freelancer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{projectData.title}</h1>
              <p className="text-slate-600">{projectData.description}</p>
            </div>
            <Badge className={getStatusColor(projectData.status)}>
              {projectData.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Client Name</Label>
                        <p className="text-slate-900">{projectData.clientName || 'Not specified'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Client Email</Label>
                        <p className="text-slate-900">{projectData.clientEmail}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Price</Label>
                        <p className="text-slate-900 font-semibold">${projectData.price}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Deadline</Label>
                        <p className="text-slate-900">
                          {projectData.deadline ? new Date(projectData.deadline).toLocaleDateString() : 'Not set'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {projectData.status === 'draft' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Next Steps</CardTitle>
                      <CardDescription>Complete these steps to share your project with the client</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs">1</div>
                          <span className="text-slate-600">Upload preview files</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs">2</div>
                          <span className="text-slate-600">Share preview with client</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs">3</div>
                          <span className="text-slate-600">Wait for client approval and payment</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="files" className="space-y-6">
                <FileUpload projectId={projectData.id} />
                
                {projectData.previewUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Preview File</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-slate-100 rounded-lg p-8 text-center">
                        <Eye className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 mb-4">Preview file uploaded</p>
                        <Button variant="outline">
                          View Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="comments" className="space-y-6">
                <TimelineComments projectId={projectData.id} comments={comments?.comments || []} />
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Project Title</Label>
                      <Input id="title" defaultValue={projectData.title} />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" defaultValue={projectData.description || ""} />
                    </div>
                    <Button className="gradient-primary text-white">
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {projectData.status === 'draft' && (
                  <Button 
                    className="w-full gradient-primary text-white"
                    onClick={() => handleStatusChange('preview_shared')}
                    disabled={!projectData.previewUrl}
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share Preview
                  </Button>
                )}
                
                {projectData.status !== 'draft' && (
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/preview/${projectData.id}?clientEmail=${projectData.clientEmail}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View as Client
                    </Link>
                  </Button>
                )}

                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Final Files
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Preview Link</CardTitle>
              </CardHeader>
              <CardContent>
                {projectData.status === 'draft' ? (
                  <p className="text-sm text-slate-600">Preview link will be available after sharing</p>
                ) : (
                  <div className="space-y-2">
                    <Input 
                      readOnly 
                      value={`${window.location.origin}/preview/${projectData.id}?clientEmail=${projectData.clientEmail}`}
                      className="text-xs"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/preview/${projectData.id}?clientEmail=${projectData.clientEmail}`);
                        toast({ title: "Copied", description: "Preview link copied to clipboard" });
                      }}
                    >
                      Copy Link
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Comments</span>
                  <span className="font-medium">{comments?.comments?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Created</span>
                  <span className="text-sm">{new Date(projectData.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Last Updated</span>
                  <span className="text-sm">{new Date(projectData.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
