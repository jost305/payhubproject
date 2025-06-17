import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  File, 
  X, 
  FileVideo, 
  FileImage, 
  FileText,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface FileUploadProps {
  projectId: number;
  onUploadComplete?: () => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
}

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  isPreview: boolean;
  error?: string;
}

export function FileUpload({ 
  projectId, 
  onUploadComplete, 
  maxFiles = 10,
  maxFileSize = 100 
}: FileUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async ({ file, isPreview }: { file: File; isPreview: boolean }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('isPreview', isPreview.toString());

      const response = await fetch(`/api/projects/${projectId}/files`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      onUploadComplete?.();
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/files`] });
    },
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('video/')) return <FileVideo className="w-5 h-5 text-blue-500" />;
    if (fileType.startsWith('image/')) return <FileImage className="w-5 h-5 text-green-500" />;
    return <FileText className="w-5 h-5 text-slate-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    const allowedTypes = [
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'audio/mpeg',
      'audio/wav',
      'audio/mp3',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
    ];

    if (!allowedTypes.includes(file.type)) {
      return 'File type not supported';
    }

    return null;
  };

  const processFiles = (files: FileList) => {
    const newFiles: UploadFile[] = [];

    Array.from(files).forEach((file) => {
      if (uploadFiles.length + newFiles.length >= maxFiles) {
        toast({
          title: "Too many files",
          description: `Maximum ${maxFiles} files allowed`,
          variant: "destructive",
        });
        return;
      }

      const error = validateFile(file);
      if (error) {
        toast({
          title: "Invalid file",
          description: error,
          variant: "destructive",
        });
        return;
      }

      newFiles.push({
        file,
        id: Math.random().toString(36).substr(2, 9),
        progress: 0,
        status: 'pending',
        isPreview: false,
      });
    });

    setUploadFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFiles(e.target.files);
    }
  };

  const uploadFile = async (uploadFile: UploadFile) => {
    setUploadFiles(prev => 
      prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      )
    );

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadFiles(prev => 
          prev.map(f => 
            f.id === uploadFile.id && f.status === 'uploading'
              ? { ...f, progress: Math.min(f.progress + 10, 90) }
              : f
          )
        );
      }, 200);

      await uploadMutation.mutateAsync({
        file: uploadFile.file,
        isPreview: uploadFile.isPreview,
      });

      clearInterval(progressInterval);

      setUploadFiles(prev => 
        prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'success', progress: 100 }
            : f
        )
      );

      toast({
        title: "Upload successful",
        description: `${uploadFile.file.name} has been uploaded`,
      });
    } catch (error: any) {
      setUploadFiles(prev => 
        prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'error', error: error.message }
            : f
        )
      );

      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const togglePreview = (id: string) => {
    setUploadFiles(prev => 
      prev.map(f => 
        f.id === id ? { ...f, isPreview: !f.isPreview } : f
      )
    );
  };

  const uploadAll = () => {
    uploadFiles
      .filter(f => f.status === 'pending')
      .forEach(uploadFile);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-slate-300 hover:border-slate-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Upload className={`w-12 h-12 mb-4 ${dragActive ? 'text-primary' : 'text-slate-400'}`} />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            {dragActive ? 'Drop files here' : 'Upload your files'}
          </h3>
          <p className="text-slate-600 text-center mb-4">
            Drag and drop files here, or click to select files
          </p>
          <div className="text-sm text-slate-500">
            <p>Supported: MP4, MOV, AVI, MP3, WAV, JPG, PNG, GIF, PDF, ZIP</p>
            <p>Maximum file size: {maxFileSize}MB</p>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept="video/*,audio/*,image/*,.pdf,.zip"
      />

      {/* File List */}
      {uploadFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Files to Upload</h3>
            {uploadFiles.some(f => f.status === 'pending') && (
              <Button onClick={uploadAll} className="payvidi-gradient">
                Upload All
              </Button>
            )}
          </div>

          {uploadFiles.map((uploadFile) => (
            <Card key={uploadFile.id}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {getFileIcon(uploadFile.file.type)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-900 truncate">
                        {uploadFile.file.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        {uploadFile.status === 'success' && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {uploadFile.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(uploadFile.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                      <span>{formatFileSize(uploadFile.file.size)}</span>
                      <span>{uploadFile.file.type}</span>
                    </div>

                    {uploadFile.status === 'uploading' && (
                      <Progress value={uploadFile.progress} className="mb-2" />
                    )}

                    {uploadFile.status === 'error' && uploadFile.error && (
                      <p className="text-sm text-red-600 mb-2">{uploadFile.error}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`preview-${uploadFile.id}`}
                          checked={uploadFile.isPreview}
                          onCheckedChange={() => togglePreview(uploadFile.id)}
                          disabled={uploadFile.status !== 'pending'}
                        />
                        <label 
                          htmlFor={`preview-${uploadFile.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Share as preview
                        </label>
                      </div>

                      {uploadFile.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => uploadFile(uploadFile)}
                          disabled={uploadMutation.isPending}
                        >
                          Upload
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
