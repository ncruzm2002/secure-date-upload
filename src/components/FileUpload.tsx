import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, CheckCircle, AlertCircle, X, Key, Award, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  acceptedTypes: string[];
  onFileChange: (file: File | null) => void;
  error?: string;
  file?: File | null;
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'txt':
      return FileText;
    case 'cer':
      return Award;
    case 'key':
      return Key;
    default:
      return File;
  }
};

const getFileIconAnimation = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'txt':
      return "animate-bounce-slow";
    case 'cer':
      return "animate-glow";
    case 'key':
      return "animate-float";
    default:
      return "";
  }
};

export function FileUpload({ label, acceptedTypes, onFileChange, error, file }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    if (fileExtension && acceptedTypes.includes(`.${fileExtension}`)) {
      onFileChange(selectedFile);
    } else {
      onFileChange(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isValidFile = file && acceptedTypes.includes(`.${file.name.split('.').pop()?.toLowerCase()}`);

  return (
    <div className="space-y-2">
      <Label className="text-foreground font-medium flex items-center gap-2">
        <Upload className="w-4 h-4 text-accent-foreground" />
        {label}
      </Label>
      
      <Card 
        className={cn(
          "border-2 border-dashed transition-all duration-500 cursor-pointer relative overflow-hidden",
          "hover:shadow-glow hover:border-primary/50 hover:bg-gradient-card",
          isDragOver ? "border-primary bg-primary/10 shadow-glow" : "border-border bg-gradient-card",
          error ? "border-destructive animate-pulse" : "",
          isValidFile ? "border-success bg-success/10 shadow-inner" : ""
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleButtonClick}
      >
        <CardContent className="p-6 relative z-10">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(",")}
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          {file ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {isValidFile ? (
                    <CheckCircle className="w-5 h-5 text-success animate-pulse" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-destructive animate-bounce" />
                  )}
                </div>
                <div className="relative">
                  {(() => {
                    const FileIcon = getFileIcon(file.name);
                    const animation = getFileIconAnimation(file.name);
                    return <FileIcon className={cn("w-8 h-8 text-primary", animation)} />;
                  })()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <Upload className="w-8 h-8 text-primary-foreground animate-float" />
              </div>
              <div className="space-y-2">
                <p className="text-base font-semibold text-foreground">
                  Arrastra y suelta tu archivo aquí
                </p>
                <p className="text-sm text-muted-foreground">
                  o haz clic para seleccionar
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {acceptedTypes.map((type) => (
                    <span key={type} className="px-2 py-1 bg-accent/50 text-accent-foreground text-xs rounded-full font-medium">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        
        {/* Animated background effect */}
        <div className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300",
          isDragOver ? "opacity-100" : "",
          "bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
        )} />
      </Card>
      
      {error && <p className="text-sm text-destructive flex items-center gap-2 animate-pulse">
        <AlertCircle className="w-4 h-4" />
        {error}
      </p>}
      
      {file && !isValidFile && (
        <p className="text-sm text-destructive flex items-center gap-2 animate-bounce">
          <AlertCircle className="w-4 h-4" />
          Formato de archivo no válido. Se requiere: {acceptedTypes.join(", ")}
        </p>
      )}
    </div>
  );
}