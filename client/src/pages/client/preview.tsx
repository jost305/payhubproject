import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TimelineComments } from "@/components/ui/timeline-comments";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  Play, 
  CheckCircle, 
  MessageSquare, 
  CreditCard,
  Download,
  FileText,
  FileImage,
  FileVideo,
  Eye,
  Clock
} from "lucide-react";

export default function ClientPreview() {
  const { id } = useParams<{ id: string }>();
  const [location] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Extract email from URL params
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const clientEmail = urlParams.get('email');

  const [selectedFile, setSelectedFile] = useState<any>(null);

  const { data: previewData, isLoading } = useQuery({
    queryKey: [`/api/preview/${id}`, clientEmail],
    queryFn: async () => {
      const response = await fetch(`/api/preview/${id}?email=${encodeURIComponent(clientEmail || '')}`);
      if (!response.ok) throw new Error('Failed to fetch preview');
      return response.json();
    },
    enabled: !!id && !!clientEmail,
  });

  const approveProjectMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/projects/${id}/approve`, {
        clientEmail,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/preview/${id}`, clientEmail] });
      toast({
        title: "Preview approved",
        description: "You can now proceed to payment",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve preview",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (previewData?.files?.length > 0) {
      setSelectedFile(previewData.files.find((f: any) => f.isPreview) || previewData.files[0]);
    }
  }, [previewData]);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('video/')) return <FileVideo className="w-5 h-5" />;
    if (fileType.startsWith('image/')) return <FileImage className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  };

  if (!clientEmail) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <Eye className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Required</h2>
            <p className="text-slate-600">Please use the direct link provided by your freelancer to access this preview.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!previewData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <Eye className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Preview Not Found</h2>
            <p className="text-slate-600">The preview you're looking for doesn't exist or is no longer available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { project, files, comments } = previewData;
  const previewFiles = files.filter((f: any) => f.isPreview);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 payvidi-gradient rounded-lg flex items-center justify-center">
                <Play className="text-white w-4 h-4" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">{project.title}</h1>
                <p className="text-sm text-slate-600">Preview for {project.clientName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge 
                className={
                  project.status === "approved" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-blue-100 text-blue-800"
                }
              >
                {project.status === "approved" ? "Approved" : "Awaiting Review"}
              </Badge>
              
              {project.status === "preview_shared" && (
                <Button 
                  onClick={() => approveProjectMutation.mutate()}
                  disabled={approveProjectMutation.isPending}
                  className="payvidi-accent-gradient"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {approveProjectMutation.isPending ? "Approving..." : "Approve & Continue"}
                </Button>
              )}
              
              {project.status === "approved" && (
                <Link href={`/checkout/${project.id}?email=${encodeURIComponent(clientEmail)}`}>
                  <Button className="payvidi-accent-gradient">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Proceed to Payment
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Preview Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Preview */}
            {selectedFile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedFile.fileName}</span>
                    <Badge variant="secondary">Preview</Badge>
                  </CardTitle>
                  <CardDescription>
                    {selectedFile.fileType} • {formatFileSize(selectedFile.fileSize)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-100 rounded-xl aspect-video flex items-center justify-center relative overflow-hidden">
                    {selectedFile.fileType.startsWith('video/') ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <Play className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-600">Video Preview</p>
                          <p className="text-sm text-slate-500">Click to play</p>
                        </div>
                      </div>
                    ) : selectedFile.fileType.startsWith('image/') ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <FileImage className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-600">Image Preview</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-600">Document Preview</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Simulated timeline for video */}
                    {selectedFile.fileType.startsWith('video/') && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-black bg-opacity-80 rounded-lg p-3">
                          <div className="flex items-center justify-between text-white text-sm mb-2">
                            <span>0:00</span>
                            <span>2:34</span>
                          </div>
                          <div className="relative">
                            <div className="w-full h-2 bg-gray-600 rounded-full">
                              <div className="w-1/3 h-2 bg-primary rounded-full"></div>
                            </div>
                            {/* Comment markers */}
                            <div className="absolute top-0 left-1/4 w-3 h-3 bg-yellow-500 rounded-full comment-marker cursor-pointer"></div>
                            <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-500 rounded-full comment-marker cursor-pointer"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* File List */}
            {previewFiles.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview Files</CardTitle>
                  <CardDescription>Select a file to preview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {previewFiles.map((file: any) => (
                      <button
                        key={file.id}
                        onClick={() => setSelectedFile(file)}
                        className={`flex items-center space-x-3 p-3 border rounded-lg text-left transition-colors ${
                          selectedFile?.id === file.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {getFileIcon(file.fileType)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{file.fileName}</p>
                          <p className="text-sm text-slate-600">{formatFileSize(file.fileSize)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Description */}
            {project.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Project Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{project.description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-slate-600">Project</span>
                    <p className="font-medium">{project.title}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Total Amount</span>
                    <p className="text-2xl font-bold">${project.price}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-600">Status</span>
                    <div className="flex items-center space-x-2 mt-1">
                      {project.status === "approved" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-500" />
                      )}
                      <span className="text-sm">
                        {project.status === "approved" ? "Approved - Ready for Payment" : "Awaiting Your Approval"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Comments</span>
                  <MessageSquare className="w-4 h-4" />
                </CardTitle>
                <CardDescription>
                  Leave feedback for the creator
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimelineComments 
                  comments={comments}
                  projectId={parseInt(id!)}
                  clientEmail={clientEmail}
                  selectedFile={selectedFile}
                />
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {project.status === "preview_shared" && (
                    <>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">1</div>
                        <div className="flex-1">
                          <p className="font-medium">Review the preview</p>
                          <p className="text-sm text-slate-600">Check the files and leave any feedback</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center text-white text-xs font-semibold">2</div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-500">Approve the preview</p>
                          <p className="text-sm text-slate-500">Click "Approve" when satisfied</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center text-white text-xs font-semibold">3</div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-500">Complete payment</p>
                          <p className="text-sm text-slate-500">Pay securely to receive final files</p>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {project.status === "approved" && (
                    <>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">✓</div>
                        <div className="flex-1">
                          <p className="font-medium">Preview approved</p>
                          <p className="text-sm text-slate-600">Great! You're ready for payment</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">2</div>
                        <div className="flex-1">
                          <p className="font-medium">Complete payment</p>
                          <p className="text-sm text-slate-600">Pay securely to receive your final files via email</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
