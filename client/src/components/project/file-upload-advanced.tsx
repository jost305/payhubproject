
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Upload,
  FileText,
  Image,
  Video,
  Music,
  File,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  Clock
} from "lucide-react";

interface FileUploadAdvancedProps {
  projectId: number;
  onUploadComplete?: () => void;
  existingFiles?: any[];
}

export function FileUploadAdvanced({ 
  projectId, 
  onUploadComplete, 
  existingFiles = [] 
}: FileUploadAdvancedProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadQueue, setUploadQueue] = useState<any[]>([]);
  const [changeDescription, setChangeDescription] = useState("");

  const uploadMutation = useMutation({
    mutationFn: async (fileData: any) => {
      // Simulate file upload - in real implementation, this would upload to cloud storage
      const formData = new FormData();
      formData.append('file', fileData.file);
      formData.append('projectId', projectId.toString());
      formData.append('isPreview', fileData.isPreview.toString());
      formData.append('version', fileData.version.toString());
      formData.append('changeDescription', fileData.changeDescription || '');
      
      const response = await apiRequest('POST', '/api/upload-file', formData);
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Update upload queue to show success
      setUploadQueue(prev => 
        prev.map(item => 
          item.id === variables.id 
            ? { ...item, status: 'completed', url: data.fileUrl }
            : item
        )
      );
      
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/files`] });
      onUploadComplete?.();
      
      toast({
        title: "File uploaded successfully",
        description: `${variables.file.name} has been uploaded`,
      });
    },
    onError: (error: any, variables) => {
      setUploadQueue(prev => 
        prev.map(item => 
          item.id === variables.id 
            ? { ...item, status: 'error', error: error.message }
            : item
        )
      );
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => {
      const existingFile = existingFiles.find(ef => ef.fileName === file.name);
      const nextVersion = existingFile ? (existingFile.version || 1) + 1 : 1;
      
      return {
        id: Date.now() + Math.random(),
        file,
        isPreview: false,
        version: nextVersion,
        status: 'pending',
        changeDescription: '',
      };
    });
    
    setUploadQueue(prev => [...prev, ...newFiles]);
  }, [existingFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 500 * 1024 * 1024, // 500MB
  });

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <Image className="h-5 w-5 text-blue-600" />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
        return <Video className="h-5 w-5 text-red-600" />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <Music className="h-5 w-5 text-green-600" />;
      case 'pdf':
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-orange-600" />;
      default:
        return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleUpload = (fileItem: any) => {
    const updatedItem = {
      ...fileItem,
      status: 'uploading',
      changeDescription,
    };
    
    setUploadQueue(prev => 
      prev.map(item => item.id === fileItem.id ? updatedItem : item)
    );
    
    uploadMutation.mutate(updatedItem);
  };

  const handleUploadAll = () => {
    const pendingFiles = uploadQueue.filter(item => item.status === 'pending');
    pendingFiles.forEach(file => handleUpload(file));
  };

  const removeFromQueue = (id: string) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id));
  };

  const updateFileSettings = (id: string, updates: any) => {
    setUploadQueue(prev => 
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* File Drop Zone */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors">
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`text-center cursor-pointer ${
              isDragActive ? 'bg-indigo-50' : ''
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-indigo-600">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Drag & drop files here, or <span className="text-indigo-600 font-medium">browse</span>
                </p>
                <p className="text-sm text-gray-500">
                  Support for images, videos, audio, and documents (max 500MB per file)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Queue</h3>
              <div className="flex items-center space-x-2">
                <div className="space-y-2">
                  <Label htmlFor="changeDescription" className="text-sm text-gray-700">
                    Version Notes (optional)
                  </Label>
                  <Input
                    id="changeDescription"
                    placeholder="Describe what changed in this version..."
                    value={changeDescription}
                    onChange={(e) => setChangeDescription(e.target.value)}
                    className="w-64 text-sm"
                  />
                </div>
                <Button
                  onClick={handleUploadAll}
                  disabled={uploadQueue.every(item => item.status !== 'pending')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Upload All
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {uploadQueue.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {getFileIcon(item.file.name)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900 truncate">
                          {item.file.name}
                        </p>
                        {item.version > 1 && (
                          <Badge variant="secondary" className="text-xs">
                            v{item.version}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(item.file.size)}
                        {item.changeDescription && (
                          <span className="ml-2">• {item.changeDescription}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {item.status === 'pending' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`preview-${item.id}`}
                            checked={item.isPreview}
                            onCheckedChange={(checked) =>
                              updateFileSettings(item.id, { isPreview: checked })
                            }
                          />
                          <Label
                            htmlFor={`preview-${item.id}`}
                            className="text-sm text-gray-700"
                          >
                            Preview file
                          </Label>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleUpload(item)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          Upload
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromQueue(item.id)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    {item.status === 'uploading' && (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <Clock className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    )}
                    
                    {item.status === 'completed' && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Completed</span>
                      </div>
                    )}
                    
                    {item.status === 'error' && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Failed</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Files with Versions */}
      {existingFiles.length > 0 && (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">File Versions</h3>
            <div className="space-y-3">
              {existingFiles.map((file: any) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.fileName)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{file.fileName}</p>
                        <Badge variant="secondary" className="text-xs">
                          v{file.version || 1}
                        </Badge>
                        {file.isPreview && (
                          <Badge className="bg-blue-100 text-blue-700 text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            Preview
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.fileSize)}
                        {file.changeDescription && (
                          <span className="ml-2">• {file.changeDescription}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
