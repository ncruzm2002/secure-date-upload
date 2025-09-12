import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DateMonthYearPicker } from "./DateMonthYearPicker";
import { FileUpload } from "./FileUpload";
import { LogOut, Send, FileText, Shield, Key, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MainFormProps {
  onLogout: () => void;
  username: string;
}

interface FormData {
  startDate?: { month: number; year: number };
  endDate?: { month: number; year: number };
  txtFile?: File | null;
  cerFile?: File | null;
  keyFile?: File | null;
}

export function MainForm({ onLogout, username }: MainFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.startDate) {
      newErrors.startDate = "La fecha de inicio es obligatoria";
    }

    if (!formData.endDate) {
      newErrors.endDate = "La fecha de fin es obligatoria";
    }

    if (formData.startDate && formData.endDate) {
      const startDateObj = new Date(formData.startDate.year, formData.startDate.month - 1);
      const endDateObj = new Date(formData.endDate.year, formData.endDate.month - 1);
      
      if (endDateObj <= startDateObj) {
        newErrors.endDate = "La fecha de fin debe ser posterior a la fecha de inicio";
      }
    }

    if (!formData.txtFile) {
      newErrors.txtFile = "El archivo .txt es obligatorio";
    } else {
      const extension = formData.txtFile.name.split('.').pop()?.toLowerCase();
      if (extension !== 'txt') {
        newErrors.txtFile = "El archivo debe tener extensión .txt";
      }
    }

    if (!formData.cerFile) {
      newErrors.cerFile = "El archivo .cer es obligatorio";
    } else {
      const extension = formData.cerFile.name.split('.').pop()?.toLowerCase();
      if (extension !== 'cer') {
        newErrors.cerFile = "El archivo debe tener extensión .cer";
      }
    }

    if (!formData.keyFile) {
      newErrors.keyFile = "El archivo .key es obligatorio";
    } else {
      const extension = formData.keyFile.name.split('.').pop()?.toLowerCase();
      if (extension !== 'key') {
        newErrors.keyFile = "El archivo debe tener extensión .key";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor, corrige los errores antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Formulario enviado exitosamente",
        description: "Los archivos han sido procesados correctamente.",
        className: "border-success bg-success/10",
      });

      // Reset form
      setFormData({});
      setErrors({});
    } catch (error) {
      toast({
        title: "Error al procesar",
        description: "Hubo un problema al procesar el formulario. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const allFieldsValid = formData.startDate && 
                        formData.endDate && 
                        formData.txtFile && 
                        formData.cerFile && 
                        formData.keyFile &&
                        Object.keys(errors).length === 0;

  return (
    <div className="min-h-screen bg-gradient-secondary p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary))_0%,_transparent_50%)] opacity-10"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 p-6 bg-gradient-card rounded-lg border border-border/50 shadow-glow backdrop-blur-sm">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent animate-float">
              Panel Principal
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              Bienvenido, <span className="font-semibold text-accent-foreground">{username}</span>
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="border-border/50 hover:bg-secondary/50 hover:border-primary/50 transition-all duration-300 hover:shadow-soft backdrop-blur-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-strong bg-gradient-card border border-border/50 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl text-foreground flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                Configuración de Fechas
              </CardTitle>
              <CardDescription>
                Selecciona el período de procesamiento (mes y año)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <DateMonthYearPicker
                  label="Fecha de Inicio"
                  value={formData.startDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                  error={errors.startDate}
                />
                <DateMonthYearPicker
                  label="Fecha de Fin"
                  value={formData.endDate}
                  onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                  error={errors.endDate}
                  minDate={formData.startDate}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-strong bg-gradient-card border border-border/50 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl text-foreground flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow animate-pulse">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                Carga de Archivos
              </CardTitle>
              <CardDescription>
                Sube los tres archivos requeridos para el procesamiento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="grid gap-6">
                <FileUpload
                  label="Archivo de Texto (.txt)"
                  acceptedTypes={[".txt"]}
                  file={formData.txtFile}
                  onFileChange={(file) => setFormData(prev => ({ ...prev, txtFile: file }))}
                  error={errors.txtFile}
                />
                <FileUpload
                  label="Certificado Digital (.cer)"
                  acceptedTypes={[".cer"]}
                  file={formData.cerFile}
                  onFileChange={(file) => setFormData(prev => ({ ...prev, cerFile: file }))}
                  error={errors.cerFile}
                />
                <FileUpload
                  label="Clave Privada (.key)"
                  acceptedTypes={[".key"]}
                  file={formData.keyFile}
                  onFileChange={(file) => setFormData(prev => ({ ...prev, keyFile: file }))}
                  error={errors.keyFile}
                />
              </div>
            </CardContent>
          </Card>

          {/* Progress Indicator */}
          {allFieldsValid && (
            <Alert className="border-success bg-success/10 shadow-glow animate-pulse backdrop-blur-sm">
              <CheckCircle className="h-5 w-5 text-success animate-spin-slow" />
              <AlertDescription className="text-success font-medium">
                🎉 Todos los campos están completos. Puedes proceder con el envío.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!allFieldsValid || isSubmitting}
              className="bg-gradient-primary hover:bg-primary-hover transition-all duration-500 shadow-glow hover:shadow-strong font-semibold px-12 py-3 text-lg hover:scale-105 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  <span className="animate-pulse">Procesando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Send className="w-5 h-5 animate-float" />
                  Procesar Archivos
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}