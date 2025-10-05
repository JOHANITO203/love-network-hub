import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Camera } from "lucide-react";

interface ImageUploadProps {
  currentImage?: string;
  onImageUpdate: (imageUrl: string) => void;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
} as const;

const MAX_FILE_SIZE = 4 * 1024 * 1024;

export const ImageUpload = ({ currentImage, onImageUpdate, size = "md" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const displayImage = previewUrl || currentImage;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];

    try {
      setUploading(true);

      if (!file.type.startsWith("image/")) {
        throw new Error("Veuillez sélectionner un fichier image (JPG, PNG, WebP).");
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error("La taille de l'image doit être inférieure à 4MB.");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewUrl(base64);
        onImageUpdate(base64);
        toast({
          title: "Image ajoutée",
          description: "Votre photo a été enregistrée localement.",
        });
      };
      reader.onerror = () => {
        throw new Error("Impossible de lire le fichier.");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Une erreur est survenue.";
      toast({
        title: "Échec de l'upload",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onImageUpdate("");
    toast({
      title: "Image supprimée",
      description: "Votre photo de profil a été retirée.",
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className={SIZE_CLASSES[size]}>
          {displayImage ? (
            <AvatarImage src={displayImage} alt="Profile preview" />
          ) : (
            <AvatarFallback>
              <Camera className="h-6 w-6 text-muted-foreground" />
            </AvatarFallback>
          )}
        </Avatar>

        {displayImage && (
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          {uploading ? "Téléversement..." : displayImage ? "Changer" : "Ajouter une photo"}
        </Button>
      </div>
    </div>
  );
};
