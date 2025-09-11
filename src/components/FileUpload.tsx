import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, CheckCircle, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  acceptedTypes: string[];
  onFileChange: (file: File | null) => void;
  error?: string;
  file?: File | null;
}

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
        <Upload className="w-4 h-4" />
        {label}
      </Label>
      
      <Card 
        className={cn(
          "border-2 border-dashed transition-all duration-300 cursor-pointer hover:shadow-soft",
          isDragOver ? "border-primary bg-accent/20" : "border-input",
          error ? "border-destructive" : "",
          isValidFile ? "border-success bg-success/5" : ""
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleButtonClick}
      >
        <CardContent className="p-6">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(",")}
            onChange={handleFileInputChange}
            className="hidden"
          />
          
          {file ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isValidFile ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-destructive" />
                )}
                <File className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{file.name}</span>
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
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-accent-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Arrastra y suelta tu archivo aquí
                </p>
                <p className="text-xs text-muted-foreground">
                  o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground">
                  Formatos permitidos: {acceptedTypes.join(", ")}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {error && <p className="text-sm text-destructive flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        {error}
      </p>}
      
      {file && !isValidFile && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Formato de archivo no válido. Se requiere: {acceptedTypes.join(", ")}
        </p>
      )}
    </div>
  );
}