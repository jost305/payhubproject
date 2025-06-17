import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PreviewPlayer } from "@/components/project/preview-player";
import { TimelineComments } from "@/components/project/timeline-comments";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, CreditCard, MessageSquare, Play, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import type { Project, Comment } from "@shared/schema";

export default function PreviewPage() {
  const [, params] = useRoute("/preview/:id");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [newComment, setNewComment] = useState({ content: "", timestamp: "" });
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState("");

  // Get client email from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const urlClientEmail = urlParams.get('clientEmail') || "";

  const { data: project, isLoading } = useQuery({
    queryKey: [`/api/projects/${params?.id}?clientEmail=${urlClientEmail}`],
    enabled: !!params?.id && !!urlClientEmail,
  });

  const { data: comments } = useQuery({
    queryKey: [`/api/projects/${params?.id}/comments`],
    enabled: !!params?.id,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (commentData: any) => {
      const response = await apiRequest('POST', `/api/projects/${params?.id}/comments`, commentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${params?.id}/comments`] });
      setNewComment({ content: "", timestamp: "" });
      toast({
        title: "Comment added",
        description: "Your feedback has been recorded",
      });
    },
  });

  const approveProjectMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('PATCH', `/api/projects/${params?.id}`, { 
        status: 'approved' 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${params?.id}?clientEmail=${urlClientEmail}`] });
      toast({
        title: "Project approved!",
        description: "You can now proceed to payment",
      });
    },
  });

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.content.trim()) return;

    addCommentMutation.mutate({
      authorEmail: urlClientEmail,
      authorName: clientName || urlClientEmail,
      content: newComment.content,
      timestamp: newComment.timestamp,
    });
  };

  const handleApprove = async () => {
    approveProjectMutation.mutate();
  };

  const requestRevisionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/projects/${params?.id}/revisions`, {
        feedback: revisionFeedback,
        clientEmail: urlClientEmail
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${params?.id}?clientEmail=${urlClientEmail}`] });
      setShowRevisionForm(false);
      setRevisionFeedback("");
      toast({
        title: "Revision requested",
        description: "Your feedback has been sent to the freelancer.",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!project?.project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Preview not found</h2>
            <p className="text-slate-600">The requested preview is not available or you don't have access to it.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const projectData = project.project;

  if (projectData.status === 'approved' && projectData.clientEmail === urlClientEmail) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="gradient-accent text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">Preview Approved!</CardTitle>
                <CardDescription className="text-emerald-100">
                  Complete your payment to receive the final files
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="mb-6">
              <h3 className="font-semibold text-slate-900 mb-2">Order Summary</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600">{projectData.title}</span>
                  <span className="font-semibold text-slate-900">${projectData.price}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Processing fee (3%)</span>
                  <span className="text-slate-500">${(parseFloat(projectData.price) * 0.03).toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 mt-3 pt-3">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-900">Total</span>
                    <span className="text-slate-900">${(parseFloat(projectData.price) * 1.03).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button asChild className="w-full gradient-accent text-white" size="lg">
              <Link href={`/checkout/${projectData.id}?clientEmail=${urlClientEmail}`}>
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Payment
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Play className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold text-white">PayVidi</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{projectData.title}</h1>
          <p className="text-slate-300">{projectData.description}</p>
          <Badge className="mt-2 bg-blue-600 text-white">
            Preview - Awaiting Your Approval
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-0">
                <PreviewPlayer 
                  projectId={projectData.id}
                  previewUrl={projectData.previewUrl}
                  comments={comments?.comments || []}
                />
              </CardContent>
            </Card>
          </div>

          {/* Comments and Actions */}
          <div className="space-y-6">
            {/* Client Info */}
            {!clientName && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Your Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="clientName" className="text-slate-300">Your Name</Label>
                      <Input
                        id="clientName"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Enter your name"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Revision Request Form */}
            {showRevisionForm && projectData.status === 'preview_shared' && (
              <Card className="bg-slate-800 border-slate-700 border-orange-500/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-orange-400" />
                    Request Revisions
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    Let the freelancer know what changes you'd like to see
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="revision-feedback" className="text-white">What would you like to change?</Label>
                      <Textarea
                        id="revision-feedback"
                        placeholder="Please describe the specific changes you'd like to see..."
                        value={revisionFeedback}
                        onChange={(e) => setRevisionFeedback(e.target.value)}
                        rows={4}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => requestRevisionMutation.mutate()}
                        disabled={requestRevisionMutation.isPending || !revisionFeedback.trim()}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        {requestRevisionMutation.isPending ? "Sending..." : "Request Revisions"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowRevisionForm(false)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comment Form */}
            {showCommentForm && projectData.status === 'preview_shared' && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Add Feedback</CardTitle>
                  <CardDescription className="text-slate-300">
                    Leave specific feedback about the preview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddComment} className="space-y-4">
                    <div>
                      <Label htmlFor="timestamp" className="text-white">Timestamp (optional)</Label>
                      <Input
                        id="timestamp"
                        placeholder="e.g., 1:30 or 00:45"
                        value={newComment.timestamp}
                        onChange={(e) => setNewComment({ ...newComment, timestamp: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="comment" className="text-white">Your Feedback</Label>
                      <Textarea
                        id="comment"
                        placeholder="Share your thoughts about this preview..."
                        value={newComment.content}
                        onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                        rows={3}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        disabled={addCommentMutation.isPending || !newComment.content.trim()}
                        className="payvidi-accent-gradient"
                      >
                        {addCommentMutation.isPending ? "Adding..." : "Add Feedback"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowCommentForm(false)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Comments List */}
            <TimelineComments 
              projectId={projectData.id} 
              comments={comments?.comments || []}
              darkMode={true}
            />

            {/* Project Status */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Project Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Comments</span>
                    <span className="text-white font-medium">{comments?.comments?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Price</span>
                    <span className="text-white font-medium">${projectData.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-sm">Status</span>
                    <Badge className="bg-yellow-600 text-yellow-100">
                      Awaiting Approval
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {projectData.status === 'preview_shared' && (
                <>
                  <Button 
                    onClick={() => approveProjectMutation.mutate()}
                    disabled={approveProjectMutation.isPending}
                    className="w-full gradient-accent text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {approveProjectMutation.isPending ? "Approving..." : "Approve & Proceed to Payment"}
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                    onClick={() => setShowRevisionForm(!showRevisionForm)}
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Request Revisions
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowCommentForm(!showCommentForm)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Feedback
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}