import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Clock, User, Plus } from "lucide-react";
import type { Comment } from "@shared/schema";

interface TimelineCommentsProps {
  projectId: number;
  comments: Comment[];
  darkMode?: boolean;
  clientEmail?: string;
  clientName?: string;
}

export function TimelineComments({ 
  projectId, 
  comments, 
  darkMode = false,
  clientEmail,
  clientName 
}: TimelineCommentsProps) {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newComment, setNewComment] = useState({
    content: "",
    timestamp: "",
    authorEmail: clientEmail || "",
    authorName: clientName || "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: async (commentData: any) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/comments`, commentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/comments`] });
      setNewComment({ content: "", timestamp: "", authorEmail: clientEmail || "", authorName: clientName || "" });
      setIsAddingComment(false);
      toast({
        title: "Comment added",
        description: "Your feedback has been recorded",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.content.trim()) return;

    addCommentMutation.mutate(newComment);
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return null;
    return timestamp.match(/^\d+:\d+$/) ? timestamp : null;
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const cardClass = darkMode ? "bg-slate-800 border-slate-700" : "bg-white";
  const titleClass = darkMode ? "text-white" : "text-slate-900";
  const textClass = darkMode ? "text-slate-300" : "text-slate-600";
  const mutedClass = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <Card className={cardClass}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`flex items-center space-x-2 ${titleClass}`}>
              <MessageSquare className="h-5 w-5" />
              <span>Comments</span>
            </CardTitle>
            <CardDescription className={textClass}>
              Feedback and discussions about this project
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {comments.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className={`h-12 w-12 mx-auto mb-4 ${mutedClass}`} />
            <h3 className={`text-lg font-semibold mb-2 ${titleClass}`}>No comments yet</h3>
            <p className={mutedClass}>Be the first to leave feedback on this project</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {comments.map((comment, index) => (
              <div key={comment.id || index} className="space-y-3">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      darkMode ? 'bg-primary text-white' : 'bg-primary text-white'
                    }`}>
                      {getInitials(comment.authorName || comment.authorEmail)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`font-medium ${titleClass}`}>
                          {comment.authorName || comment.authorEmail}
                        </span>
                        {comment.timestamp && formatTimestamp(comment.timestamp) && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {comment.timestamp}
                          </Badge>
                        )}
                        <span className={`text-xs ${mutedClass}`}>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={textClass}>{comment.content}</p>
                    </div>
                  </div>
                </div>
                {index < comments.length - 1 && <Separator className={darkMode ? 'border-slate-600' : ''} />}
              </div>
            ))}
          </div>
        )}

        {/* Add Comment Form */}
        {!isAddingComment ? (
          <Button
            onClick={() => setIsAddingComment(true)}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Comment
          </Button>
        ) : (
          <Card className={darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50'}>
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="authorName" className={titleClass}>
                      Your Name
                    </Label>
                    <Input
                      id="authorName"
                      value={newComment.authorName}
                      onChange={(e) => setNewComment({ ...newComment, authorName: e.target.value })}
                      placeholder="Enter your name"
                      required
                      className={darkMode ? 'bg-slate-600 border-slate-500 text-white' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="authorEmail" className={titleClass}>
                      Email
                    </Label>
                    <Input
                      id="authorEmail"
                      type="email"
                      value={newComment.authorEmail}
                      onChange={(e) => setNewComment({ ...newComment, authorEmail: e.target.value })}
                      placeholder="your@email.com"
                      required
                      className={darkMode ? 'bg-slate-600 border-slate-500 text-white' : ''}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="timestamp" className={titleClass}>
                    Time Reference (Optional)
                  </Label>
                  <Input
                    id="timestamp"
                    value={newComment.timestamp}
                    onChange={(e) => setNewComment({ ...newComment, timestamp: e.target.value })}
                    placeholder="e.g., 1:30 for specific time"
                    className={darkMode ? 'bg-slate-600 border-slate-500 text-white' : ''}
                  />
                  <p className={`text-xs mt-1 ${mutedClass}`}>
                    Format: MM:SS (e.g., 1:30) for timeline comments
                  </p>
                </div>
                <div>
                  <Label htmlFor="content" className={titleClass}>
                    Comment
                  </Label>
                  <Textarea
                    id="content"
                    value={newComment.content}
                    onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                    placeholder="Share your feedback..."
                    rows={3}
                    required
                    className={darkMode ? 'bg-slate-600 border-slate-500 text-white' : ''}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    className="gradient-primary text-white"
                    disabled={addCommentMutation.isPending}
                  >
                    {addCommentMutation.isPending ? "Adding..." : "Add Comment"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsAddingComment(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
