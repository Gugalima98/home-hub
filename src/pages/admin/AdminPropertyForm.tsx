import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { propertySchema, PropertyFormValues, IMAGE_CATEGORIES } from "@/schemas/propertySchema";
import { useToast } from "@/hooks/use-toast";
import { ImageUploadSection } from "@/components/admin/ImageUploadSection";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Opções para checkboxes
const FEATURE_LISTS = {
  condo_amenities: ["Academia", "Piscina", "Salão de Festas", "Churrasqueira", "Playground", "Portaria 24h", "Elevador"],
  available_items: ["Ar Condicionado", "Varanda", "Closet", "Box Blindex", "Janelas Grandes"],
  furniture_items: ["Cama", "Sofá", "Mesa de Jantar", "Armários Cozinha", "Armários Quarto", "Geladeira", "Fogão"],
  wellness_items: ["Sol da Manhã", "Vista Livre", "Rua Silenciosa", "Ventilação Natural"],
  accessibility_items: ["Rampa de Acesso", "Banheiro Adaptado", "Elevador Acessível", "Portas Amplas"],
};

interface IBGEUF {
  id: number;
  sigla: string;
  nome: string;
}

interface IBGECity {
  id: number;
  nome: string;
}

export default function AdminPropertyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  
  // Location States
  const [ufs, setUfs] = useState<IBGEUF[]>([]);
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [cepLoading, setCepLoading] = useState(false);

  const isEditing = !!id;

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      operation_type: "rent",
      property_type: "Apartamento",
      state: "",
      city: "",
      neighborhood: "",
      address: "",
      near_subway: false,
      furnished: false,
      pet_friendly: false,
      availability: "immediate",
      condo_amenities: [],
      available_items: [],
      furniture_items: [],
      wellness_items: [],
      accessibility_items: [],
      images: {},
    },
  });

  // Watch state to fetch cities
  const selectedState = form.watch("state");

  // Fetch UFs on mount
  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
      .then((res) => res.json())
      .then((data) => setUfs(data));
  }, []);

  // Fetch Cities when State changes
  useEffect(() => {
    if (selectedState) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`)
        .then((res) => res.json())
        .then((data) => setCities(data));
    } else {
      setCities([]);
    }
  }, [selectedState]);

  // Handle CEP Blur
  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast({
          variant: "destructive",
          title: "CEP não encontrado",
          description: "Verifique o número digitado.",
        });
        return;
      }

      form.setValue("state", data.uf);
      form.setValue("city", data.localidade); 
      form.setValue("neighborhood", data.bairro);
      form.setValue("address", data.logradouro);
      
      // Buscar Coordenadas Automaticamente
      fetchCoordinates(`${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`);
      
      toast({ title: "Endereço encontrado!", description: "Os campos foram preenchidos automaticamente." });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao buscar CEP",
        description: "Tente preencher manualmente.",
      });
    } finally {
      setCepLoading(false);
    }
  };

  // Função para buscar coordenadas (Geocoding)
  const fetchCoordinates = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        // @ts-ignore - Adicionando campos dinamicamente se não estiverem no tipo estrito, ou garantir que estão no PropertyFormValues
        form.setValue("latitude", lat);
        // @ts-ignore
        form.setValue("longitude", lon);
        console.log("Coordenadas encontradas:", lat, lon);
      }
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error);
    }
  };

  // Carregar dados se for edição
  useEffect(() => {
    if (!id) return;

    const loadProperty = async () => {
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        form.reset({
          ...data,
          condo_amenities: data.condo_amenities || [],
          available_items: data.available_items || [],
          furniture_items: data.furniture_items || [],
          wellness_items: data.wellness_items || [],
          accessibility_items: data.accessibility_items || [],
          images: data.images || {},
        });
      } catch (error) {
        console.error("Erro ao carregar imóvel:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar",
          description: "Não foi possível buscar os dados do imóvel.",
        });
        navigate("/admin/properties");
      } finally {
        setFetching(false);
      }
    };

    loadProperty();
  }, [id, form, navigate, toast]);

  const onSubmit = async (data: PropertyFormValues) => {
    setLoading(true);
    try {
      if (isEditing) {
        const { error } = await supabase
          .from("properties")
          .update(data)
          .eq("id", id);
        if (error) throw error;
        toast({ title: "Imóvel atualizado!", description: "As alterações foram salvas." });
      } else {
        const { error } = await supabase
          .from("properties")
          .insert(data);
        if (error) throw error;
        toast({ title: "Imóvel cadastrado!", description: "O imóvel foi criado com sucesso." });
      }
      
      navigate("/admin/properties");
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao salvar o imóvel.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-500">Carregando dados do imóvel...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {isEditing ? "Editar Imóvel" : "Novo Imóvel"}
        </h2>
        <p className="text-muted-foreground">
          {isEditing ? "Atualize as informações do imóvel." : "Preencha os dados abaixo para cadastrar um novo imóvel."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Básico</TabsTrigger>
              <TabsTrigger value="location">Localização & Valores</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="features">Características</TabsTrigger>
              <TabsTrigger value="photos">Fotos</TabsTrigger>
            </TabsList>

            {/* TAB: BÁSICO */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                  <CardDescription>Dados principais do anúncio.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título do Anúncio</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Apartamento incrível na Paulista" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="operation_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Operação</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="rent">Alugar</SelectItem>
                              <SelectItem value="buy">Comprar</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="property_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Imóvel</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Apartamento">Apartamento</SelectItem>
                              <SelectItem value="Casa">Casa</SelectItem>
                              <SelectItem value="Casa de Condomínio">Casa de Condomínio</SelectItem>
                              <SelectItem value="Kitnet/Studio">Kitnet/Studio</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição Completa</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva os detalhes do imóvel..." 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disponibilidade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="immediate">Imediata</SelectItem>
                            <SelectItem value="soon">Em breve</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: LOCALIZAÇÃO & VALORES */}
            <TabsContent value="location">
              <Card>
                <CardHeader>
                  <CardTitle>Localização e Preço</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* CEP Field */}
                  <div className="w-full max-w-xs">
                    <FormLabel>CEP</FormLabel>
                    <div className="relative mt-1">
                      <Input 
                        placeholder="00000-000" 
                        maxLength={9} 
                        onBlur={handleCepBlur}
                        className="pr-10"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {cepLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      </div>
                    </div>
                    <p className="text-[0.8rem] text-muted-foreground mt-1">
                      Digite o CEP para preencher o endereço.
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                     {/* Estado (UF) Select */}
                     <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado (UF)</FormLabel>
                          <Select 
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.setValue("city", ""); // Reset city on state change
                            }} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o Estado" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              {ufs.map((uf) => (
                                <SelectItem key={uf.id} value={uf.sigla}>
                                  {uf.nome} ({uf.sigla})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Cidade Select */}
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={!selectedState}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={selectedState ? "Selecione a Cidade" : "Selecione um Estado primeiro"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              <ScrollArea className="h-[200px]">
                                {cities.map((city) => (
                                  <SelectItem key={city.id} value={city.nome}>
                                    {city.nome}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Bairro" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua, Número..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="near_subway"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Próximo ao Metrô</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor (R$)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormDescription>Valor do Aluguel ou Venda</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="condo_fee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Condomínio (R$)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="iptu"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IPTU (R$)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fire_insurance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Seguro Incêndio (R$)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: DETALHES */}
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes do Imóvel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Área (m²)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="bedrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quartos</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="suites"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suítes</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banheiros</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="parking_spots"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vagas</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="floor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Andar</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-6">
                    <FormField
                      control={form.control}
                      name="furnished"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 flex-1">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Mobiliado</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pet_friendly"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 flex-1">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Aceita Pets</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: CARACTERÍSTICAS (Checkboxes) */}
            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle>Características e Comodidades</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  
                  {/* Função auxiliar para renderizar grupos de checkboxes */}
                  {[
                    { name: "condo_amenities", label: "Condomínio", options: FEATURE_LISTS.condo_amenities },
                    { name: "available_items", label: "Comodidades do Imóvel", options: FEATURE_LISTS.available_items },
                    { name: "furniture_items", label: "Mobília", options: FEATURE_LISTS.furniture_items },
                    { name: "wellness_items", label: "Bem-estar", options: FEATURE_LISTS.wellness_items },
                    { name: "accessibility_items", label: "Acessibilidade", options: FEATURE_LISTS.accessibility_items },
                  ].map((group) => (
                    <FormField
                      key={group.name}
                      control={form.control}
                      name={group.name as any}
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base font-semibold">{group.label}</FormLabel>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {group.options.map((item) => (
                              <FormField
                                key={item}
                                control={form.control}
                                name={group.name as any}
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, item])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value: string) => value !== item
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {item}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />
                  ))}
                  
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB: FOTOS (NOVA) */}
            <TabsContent value="photos">
              <Card>
                <CardHeader>
                  <CardTitle>Fotos do Imóvel</CardTitle>
                  <CardDescription>
                    Adicione fotos organizadas por cômodo. Isso ajuda na exibição do anúncio.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {IMAGE_CATEGORIES.map((category) => (
                      <FormField
                        key={category}
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <ImageUploadSection
                                category={category}
                                images={field.value[category] || []}
                                onImagesChange={(newImages) => {
                                  // Atualiza apenas a categoria específica no objeto de imagens
                                  field.onChange({
                                    ...field.value,
                                    [category]: newImages,
                                  });
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>

          {/* Hidden Fields for Coordinates */}
          <FormField control={form.control} name="latitude" render={({ field }) => <input type="hidden" {...field} />} />
          <FormField control={form.control} name="longitude" render={({ field }) => <input type="hidden" {...field} />} />

          <div className="flex justify-end gap-4 sticky bottom-0 bg-white p-4 border-t shadow-lg z-10">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/properties")}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 w-40" disabled={loading}>
              {loading ? "Salvando..." : isEditing ? "Atualizar Imóvel" : "Criar Imóvel"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
