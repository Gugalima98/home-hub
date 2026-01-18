import { useState } from "react";
import { Loader2, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadSectionProps {
  category: string;
  images: string[];
  onImagesChange: (newImages: string[]) => void;
}

export function ImageUploadSection({ category, images = [], onImagesChange }: ImageUploadSectionProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    setUploading(true);
    const files = Array.from(event.target.files);
    const newUrls: string[] = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${category.toLowerCase()}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("property-images")
          .getPublicUrl(filePath);

        newUrls.push(data.publicUrl);
      }

      onImagesChange([...images, ...newUrls]);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: error.message || "Não foi possível enviar a imagem.",
      });
    } finally {
      setUploading(false);
      // Limpa o input para permitir selecionar o mesmo arquivo novamente se necessário
      event.target.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
          {category}
          <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {images.length}
          </span>
        </h4>
        <div className="relative">
          <input
            type="file"
            multiple
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            className="gap-2 pointer-events-none" // pointer-events-none para o clique passar para o input
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Adicionar Fotos
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
          <ImageIcon className="h-6 w-6 mb-1 opacity-50" />
          <span className="text-xs">Sem fotos</span>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((url, index) => (
            <div key={index} className="group relative aspect-square rounded-md overflow-hidden bg-gray-100 border">
              <img
                src={url}
                alt={`${category} ${index + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 h-6 w-6 bg-red-500/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
