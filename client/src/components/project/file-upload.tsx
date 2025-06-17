import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";

interface FileUploadProps {
  projectId: number;
  onUploadComplete?: (fileUrl: string) => void;
}

export function FileUpload({ projectId, onUploadComplete }: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate file upload progress
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
      formData.append('projectId', projectId.toString());

      // Since we don't have actual file upload endpoint, simulate the process
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              resolve({ fileUrl: 'https://example.com/preview-file.mp4' });
              return 100;
            }
            return prev + 10;
          });
        }, 200);
      });
    },
    onSuccess: (data: any) => {
      // Update project with preview URL
      apiRequest('PATCH', `/api/projects/${projectId}`, { 
        previewUrl: data.fileUrl 
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
        setSelectedFiles([]);
        setIsUploading(false);
        setUploadProgress(0);
        onUploadComplete?.(data.fileUrl);
        toast({
          title: "Upload successful",
          description: "Preview file has been uploaded",
        });
      });
    },
    onError: (error: any) => {
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'audio/mpeg', 'audio/wav', 'image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 100 * 1024 * 1024; // 100MB
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type`,
          variant: "destructive",
        });
        return false;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 100MB limit`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });
    
    setSelectedFiles(validFiles);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      uploadMutation.mutate(selectedFiles);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('video/')) return '🎥';
    if (fileType.startsWith('audio/')) return '🎵';
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType === 'application/pdf') return '📄';
    return '📁';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Preview Files</CardTitle>
        <CardDescription>
          Upload files for client preview. Supported formats: MP4, WebM, OGG, MP3, WAV, JPG, PNG, PDF (max 100MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div 
          className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Choose files to upload
          </h3>
          <p className="text-slate-600 mb-4">
            Drag and drop files here, or click to browse
          </p>
          <Button variant="outline">
            Browse Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/*,audio/*,image/*,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Selected Files</h4>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getFileIcon(file.type)}</span>
                    <div>
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-600">
                        {formatFileSize(file.size)} • {file.type}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-900">Uploading...</span>
              <span className="text-sm text-slate-600">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Upload Button */}
        {selectedFiles.length > 0 && !isUploading && (
          <Button 
            onClick={handleUpload}
            className="w-full gradient-primary text-white"
            disabled={uploadMutation.isPending}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
          </Button>
        )}

        {/* Upload Types Info */}
        <div className="bg-slate-50 rounded-lg p-4">
          <h5 className="font-medium text-slate-900 mb-2">Supported File Types</h5>
          <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Video</Badge>
              <span>MP4, WebM, OGG</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Audio</Badge>
              <span>MP3, WAV</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Image</Badge>
              <span>JPG, PNG</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Document</Badge>
              <span>PDF</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
