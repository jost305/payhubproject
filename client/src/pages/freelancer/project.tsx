import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/layout/navbar";
import { FileUpload } from "@/components/ui/file-upload";
import { TimelineComments } from "@/components/ui/timeline-comments";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Upload, 
  Eye, 
  MessageSquare, 
  DollarSign,
  Send,
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

export default function FreelancerProject() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: [`/api/projects/${id}`],
    enabled: !!id,
  });

  const { data: files, isLoading: filesLoading } = useQuery({
    queryKey: [`/api/projects/${id}/files`],
    enabled: !!id,
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: [`/api/projects/${id}/comments`],
    enabled: !!id,
  });

  const sharePreviewMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/projects/${id}/share-preview`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}`] });
      toast({
        title: "Preview shared",
        description: "Client has been notified via email",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
      case "preview_shared": return "bg-blue-100 text-blue-800";
      case "approved": return "bg-green-100 text-green-800";
      case "paid": return "bg-purple-100 text-purple-800";
      case "completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft": return <FileText className="w-4 h-4" />;
      case "preview_shared": return <Eye className="w-4 h-4" />;
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "paid": return <DollarSign className="w-4 h-4" />;
      case "completed": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (projectLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
              <p className="text-slate-600 mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
              <Link href="/dashboard">
                <Button>Back to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
              <p className="text-slate-600 mt-2">{project.description}</p>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(project.status)}
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <span className="text-slate-600">Client: {project.clientName}</span>
                <span className="text-slate-600">Price: ${project.price}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {project.status === "draft" && files?.length > 0 && (
                <Button 
                  onClick={() => sharePreviewMutation.mutate()}
                  disabled={sharePreviewMutation.isPending}
                  className="payvidi-gradient"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sharePreviewMutation.isPending ? "Sharing..." : "Share Preview"}
                </Button>
              )}
              {project.status === "preview_shared" && (
                <Button variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View Client Preview
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Current Status</span>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Files Uploaded</span>
                      <span className="font-medium">{files?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Comments</span>
                      <span className="font-medium">{comments?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Client Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-slate-600">Name</span>
                      <p className="font-medium">{project.clientName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-600">Email</span>
                      <p className="font-medium">{project.clientEmail}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-slate-600">Total Amount</span>
                      <p className="text-2xl font-bold">${project.price}</p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-600">Platform Fee (5%)</span>
                      <p className="font-medium">${(parseFloat(project.price) * 0.05).toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-600">You'll Receive</span>
                      <p className="font-bold text-green-600">${(parseFloat(project.price) * 0.95).toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
                <CardDescription>Track the progress of your project</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-slate-200"></div>
                  <div className="space-y-6">
                    {/* Project Created */}
                    <div className="flex items-start space-x-3 relative">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-slate-900">Project Created</p>
                          <p className="text-xs text-slate-500">{new Date(project.createdAt).toLocaleDateString()}</p>
                        </div>
                        <p className="text-sm text-slate-600">Initial project setup completed</p>
                      </div>
                    </div>
                    
                    {/* Files Uploaded */}
                    {files?.length > 0 ? (
                      <div className="flex items-start space-x-3 relative">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-900">Files Uploaded</p>
                            <p className="text-xs text-slate-500">Recently</p>
                          </div>
                          <p className="text-sm text-slate-600">{files.length} file(s) added to project</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-3 relative">
                        <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center z-10">
                          <Upload className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-500">Upload Files</p>
                          <p className="text-sm text-slate-400">Add preview files to share with client</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Preview Shared */}
                    {["preview_shared", "approved", "paid", "completed"].includes(project.status) ? (
                      <div className="flex items-start space-x-3 relative">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center z-10">
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-900">Preview Shared</p>
                            <p className="text-xs text-slate-500">Recently</p>
                          </div>
                          <p className="text-sm text-slate-600">Client notified and can now review</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-3 relative">
                        <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center z-10">
                          <Eye className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-500">Share Preview</p>
                          <p className="text-sm text-slate-400">Send preview link to client</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Client Feedback */}
                    {comments?.length > 0 && ["preview_shared", "approved", "paid", "completed"].includes(project.status) && (
                      <div className="flex items-start space-x-3 relative">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center z-10">
                          <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-900">Client Feedback</p>
                            <p className="text-xs text-slate-500">Recently</p>
                          </div>
                          <p className="text-sm text-slate-600">{comments.length} comment(s) received</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Preview Approved */}
                    {["approved", "paid", "completed"].includes(project.status) ? (
                      <div className="flex items-start space-x-3 relative">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-900">Preview Approved</p>
                            <p className="text-xs text-slate-500">Recently</p>
                          </div>
                          <p className="text-sm text-slate-600">Client approved and ready for payment</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-3 relative">
                        <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center z-10">
                          <CheckCircle className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-500">Client Approval</p>
                          <p className="text-sm text-slate-400">Waiting for client approval</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Payment Received */}
                    {["paid", "completed"].includes(project.status) ? (
                      <div className="flex items-start space-x-3 relative">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center z-10">
                          <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-900">Payment Received</p>
                            <p className="text-xs text-slate-500">Recently</p>
                          </div>
                          <p className="text-sm text-slate-600">Payment processed, final files delivered</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-3 relative">
                        <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center z-10">
                          <DollarSign className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-500">Payment</p>
                          <p className="text-sm text-slate-400">Awaiting client payment</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Project Completed */}
                    {project.status === "completed" ? (
                      <div className="flex items-start space-x-3 relative">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center z-10">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-900">Project Completed</p>
                            <p className="text-xs text-slate-500">Recently</p>
                          </div>
                          <p className="text-sm text-slate-600">All deliverables completed successfully</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start space-x-3 relative">
                        <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center z-10">
                          <CheckCircle className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-500">Project Completion</p>
                          <p className="text-sm text-slate-400">Final step - mark project as complete</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <CardDescription>
                  Upload your project files. Mark files as previews to share with clients.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload 
                  projectId={parseInt(id!)}
                  onUploadComplete={() => {
                    queryClient.invalidateQueries({ queryKey: [`/api/projects/${id}/files`] });
                  }}
                />
              </CardContent>
            </Card>

            {/* Files List */}
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Files</CardTitle>
                <CardDescription>{files?.length || 0} file(s) uploaded</CardDescription>
              </CardHeader>
              <CardContent>
                {filesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : files?.length > 0 ? (
                  <div className="space-y-3">
                    {files.map((file: any) => (
                      <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="font-medium">{file.fileName}</p>
                            <p className="text-sm text-slate-600">
                              {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {file.isPreview && (
                            <Badge variant="secondary">Preview</Badge>
                          )}
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No files uploaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Feedback</CardTitle>
                <CardDescription>
                  View and respond to client comments on your work
                </CardDescription>
              </CardHeader>
              <CardContent>
                {commentsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <TimelineComments 
                    comments={comments || []}
                    projectId={parseInt(id!)}
                    readOnly={true}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Settings</CardTitle>
                <CardDescription>
                  Manage project configuration and client access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Preview Link</h4>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 p-2 bg-slate-100 rounded text-sm">
                        {`${window.location.origin}/preview/${project.id}?email=${encodeURIComponent(project.clientEmail)}`}
                      </code>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/preview/${project.id}?email=${encodeURIComponent(project.clientEmail)}`);
                          toast({ title: "Copied to clipboard" });
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Project Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Download Project Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Archive Project
                      </Button>
                    </div>
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
