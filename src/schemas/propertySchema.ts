import { z } from "zod";

export const IMAGE_CATEGORIES = [
  "Sala",
  "Cozinha",
  "Quartos",
  "Banheiros",
  "Varanda",
  "Garagem",
  "Quintal",
  "Vista",
  "Área de Serviço",
  "Fachada",
  "Planta",
  "Outros",
] as const;

export const propertySchema = z.object({
  // Informações Básicas
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  description: z.string().optional(),
  operation_type: z.enum(["rent", "buy"], {
    required_error: "Selecione o tipo de operação",
  }),
  property_type: z.string().min(1, "Selecione o tipo do imóvel"),

  // Localização
  address: z.string().min(5, "Endereço é obrigatório"),
  neighborhood: z.string().min(2, "Bairro é obrigatório"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório").default("SP"),
  near_subway: z.boolean().default(false),
  latitude: z.number().optional(),
  longitude: z.number().optional(),

  // Valores
  price: z.coerce.number().min(1, "O valor é obrigatório"),
  condo_fee: z.coerce.number().optional().default(0),
  iptu: z.coerce.number().optional().default(0),
  fire_insurance: z.coerce.number().optional().default(0),
  service_fee: z.coerce.number().optional().default(0),

  // Detalhes
  bedrooms: z.coerce.number().min(0).default(0),
  suites: z.coerce.number().min(0).default(0),
  bathrooms: z.coerce.number().min(0).default(0),
  parking_spots: z.coerce.number().min(0).default(0),
  area: z.coerce.number().min(1, "A área é obrigatória"),
  floor: z.coerce.number().optional().default(0),
  
  // Imagens (JSONB: { "Sala": ["url1"], "Cozinha": ["url2"] })
  images: z.record(z.array(z.string())).default({}),

  // Booleanos e Status
  furnished: z.boolean().default(false),
  pet_friendly: z.boolean().default(false),
  availability: z.enum(["immediate", "soon"]).default("immediate"),

  // Listas (Checkboxes)
  condo_amenities: z.array(z.string()).default([]),
  available_items: z.array(z.string()).default([]),
  furniture_items: z.array(z.string()).default([]),
  wellness_items: z.array(z.string()).default([]),
  appliances_items: z.array(z.string()).default([]),
  room_items: z.array(z.string()).default([]),
  accessibility_items: z.array(z.string()).default([]),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;