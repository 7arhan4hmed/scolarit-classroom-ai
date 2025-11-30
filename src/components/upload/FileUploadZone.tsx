import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileWithValidation {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  progress?: number;
}

interface FileUploadZoneProps {
  files: FileWithValidation[];
  onFilesAdd: (files: File[]) => void;
  onFileRemove: (id: string) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

const FileUploadZone = ({
  files,
  onFilesAdd,
  onFileRemove,
  maxFiles = 10,
  maxSizeMB = 20,
  acceptedTypes = ['.doc', '.docx', '.pdf', '.txt']
}: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    // Check file type
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.some(type => type.toLowerCase() === fileExt)) {
      return `File type not supported. Accepted: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    setValidationError(null);
    const fileArray = Array.from(newFiles);

    // Check max files limit
    if (files.length + fileArray.length > maxFiles) {
      setValidationError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate all files
    const validFiles: File[] = [];
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      onFilesAdd(validFiles);
    }
  }, [files.length, maxFiles, onFilesAdd, acceptedTypes, maxSizeMB]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-accent/5'
          }
        `}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className={`h-12 w-12 mx-auto mb-4 transition-colors ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          <p className="text-lg font-medium mb-2">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supported: {acceptedTypes.join(', ')} • Max {maxSizeMB}MB per file • Up to {maxFiles} files
          </p>
        </label>
      </div>

      {/* Validation Error */}
      {validationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Uploaded Files ({files.length}/{maxFiles})
          </p>
          {files.map((fileWithStatus) => (
            <div
              key={fileWithStatus.id}
              className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg border"
            >
              <FileText className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{fileWithStatus.file.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(fileWithStatus.file.size)}
                  </p>
                  {fileWithStatus.status === 'success' && (
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      Ready
                    </span>
                  )}
                  {fileWithStatus.status === 'error' && (
                    <span className="text-xs text-destructive">{fileWithStatus.error}</span>
                  )}
                </div>
                {fileWithStatus.status === 'uploading' && fileWithStatus.progress !== undefined && (
                  <Progress value={fileWithStatus.progress} className="h-1 mt-2" />
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFileRemove(fileWithStatus.id)}
                disabled={fileWithStatus.status === 'uploading'}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
