import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para gerar URL amigável (Slug)
export function generatePropertyUrl(property: {
  id: string;
  code?: number;
  operation_type: string;
  property_type: string;
  bedrooms: number;
  neighborhood: string;
  city: string;
}) {
  const operation = property.operation_type === "rent" ? "alugar" : "comprar";
  
  // Normaliza string (remove acentos, caixa baixa, espaços para hifens)
  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD") // Separa acentos das letras
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/\s+/g, "-") // Espaços para hifens
      .replace(/[^\w\-]+/g, "") // Remove caracteres especiais
      .replace(/\-\-+/g, "-") // Remove hifens duplicados
      .replace(/^-+/, "") // Remove hifen do inicio
      .replace(/-+$/, ""); // Remove hifen do fim
  };

  const title = slugify(
    `${property.property_type}-${property.bedrooms}-quartos-${property.neighborhood}-${property.city}`
  );

  // Usa o CODE se disponível, senão usa o ID (UUID)
  const identifier = property.code ? property.code : property.id;

  return `/imovel/${identifier}/${operation}/${title}`;
}
