import { useState, useCallback } from "react";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void;
}

const FileUpload = ({ onFilesUploaded }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === "text/plain" || file.name.endsWith(".txt")
    );
    
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files]);
      onFilesUploaded(files);
    }
  }, [onFilesUploaded]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files]);
      onFilesUploaded(files);
    }
  }, [onFilesUploaded]);

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-2 border-dashed border-border/50 transition-colors hover:border-primary/30">
      <CardContent className="p-8">
        <div
          className={`text-center transition-all duration-200 ${
            dragActive ? "scale-105" : ""
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            Carregar Arquivos de Log
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Arraste e solte seus arquivos de log aqui ou clique para selecioná-los
          </p>

          <input
            type="file"
            multiple
            accept=".txt"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          
          <Button asChild className="mb-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              Selecionar Arquivos
            </label>
          </Button>

          <p className="text-xs text-muted-foreground">
            Suporta apenas arquivos .txt
          </p>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-medium text-foreground">Arquivos Carregados:</h4>
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
              >
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-primary" />
                  <span className="text-sm text-foreground">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;