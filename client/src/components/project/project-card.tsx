import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { Eye, MessageSquare, Calendar, DollarSign, User, Clock, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  showActions?: boolean;
  variant?: "default" | "compact" | "detailed";
  requestCount?: number;
  showRequestCount?: boolean;
}

export function ProjectCard({ project, showActions = true, variant = "default", requestCount = 0, showRequestCount = false }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'preview_shared': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'revision_requested': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'draft': return 20;
      case 'preview_shared': return 40;
      case 'approved': return 60;
      case 'paid': return 80;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = (deadline: string | null) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date() && project.status !== 'completed';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-3 h-3" />;
      case 'preview_shared': return <Eye className="w-3 h-3" />;
      case 'approved': return <CheckCircle className="w-3 h-3" />;
      case 'paid': return <DollarSign className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'revision_requested': return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getProgress = (status: string) => {
    switch (status) {
      case 'draft': return 20;
      case 'preview_shared': return 40;
      case 'approved': return 60;
      case 'paid': return 80;
      case 'completed': return 100;
      case 'revision_requested': return 25;
      default: return 0;
    }
  };

    const formatStatus = (status: string) => {
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };


  if (variant === "compact") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">{project.title}</h3>
              <p className="text-sm text-slate-600 truncate">{project.clientEmail}</p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <Badge className={getStatusColor(project.status)} variant="secondary">
                {project.status.replace('_', ' ')}
              </Badge>
              <span className="font-semibold text-slate-900">{formatCurrency(project.price)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "detailed") {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl">{project.title}</CardTitle>
              <CardDescription className="mt-1">
                {project.description || "No description provided"}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(project.status)}>
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Progress</span>
              <span className="font-medium">{getStatusProgress(project.status)}%</span>
            </div>
            <Progress value={getStatusProgress(project.status)} className="h-2" />
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-slate-600">Client</p>
                <p className="font-medium">{project.clientName || project.clientEmail}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-slate-600">Value</p>
                <p className="font-medium">{formatCurrency(project.price)}</p>
              </div>
            </div>
            {project.deadline && (
              <div className="flex items-center space-x-2">
                <Calendar className={`h-4 w-4 ${isOverdue(project.deadline) ? 'text-red-500' : 'text-slate-400'}`} />
                <div>
                  <p className="text-slate-600">Deadline</p>
                  <p className={`font-medium ${isOverdue(project.deadline) ? 'text-red-600' : ''}`}>
                    {formatDate(project.deadline)}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-slate-600">Created</p>
                <p className="font-medium">{formatDate(project.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex space-x-2 pt-2">
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/project/${project.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Project
                </Link>
              </Button>
              {project.status !== 'draft' && (
                <Button asChild variant="outline">
                  <Link href={`/preview/${project.id}?clientEmail=${project.clientEmail}`}>
                    <MessageSquare className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="hover:shadow-lg transition-shadow relative">
        {showRequestCount && requestCount > 0 && project.status === 'preview_shared' && (
            <div className="absolute -top-2 -right-2 z-10">
                <Badge className="bg-red-500 text-white px-2 py-1 rounded-full text-xs animate-pulse">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {requestCount} view{requestCount !== 1 ? 's' : ''}
                </Badge>
            </div>
        )}
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
        <div className="space-y-3">
          {/* Project Info */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Price:</span>
              <span className="font-semibold">{formatCurrency(project.price)}</span>
            </div>
            {project.deadline && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Deadline:</span>
                <span className={`text-sm ${isOverdue(project.deadline) ? 'text-red-600 font-medium' : ''}`}>
                  {formatDate(project.deadline)}
                  {isOverdue(project.deadline) && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      Overdue
                    </Badge>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Progress</span>
              <span>{getStatusProgress(project.status)}%</span>
            </div>
            <Progress value={getStatusProgress(project.status)} className="h-1.5" />
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex space-x-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/project/${project.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Link>
              </Button>
              {project.status !== 'draft' && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/preview/${project.id}?clientEmail=${project.clientEmail}`}>
                    <MessageSquare className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}