import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Trash2, Edit, Save, X, Link as LinkIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SeoLink {
  label: string;
  url: string;
}

interface SeoCity {
  id: string;
  city: string;
  operation: "rent" | "buy";
  links: SeoLink[];
}

export default function AdminSeoCities() {
  const [cities, setCities] = useState<SeoCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    city: string;
    operation: "rent" | "buy";
    links: SeoLink[];
  }>({
    city: "",
    operation: "rent",
    links: [{ label: "", url: "" }]
  });

  const fetchCities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("seo_cities")
      .select("*")
      .order("city");
    
    if (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro ao buscar dados" });
    } else {
      setCities(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleOpenDialog = (city?: SeoCity) => {
    if (city) {
      setEditingId(city.id);
      setFormData({
        city: city.city,
        operation: city.operation,
        links: Array.isArray(city.links) && city.links.length > 0 
          ? city.links 
          : [{ label: "", url: "" }]
      });
    } else {
      setEditingId(null);
      setFormData({
        city: "",
        operation: "rent",
        links: [{ label: "", url: "" }]
      });
    }
    setDialogOpen(true);
  };

  const handleLinkChange = (index: number, field: "label" | "url", value: string) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData({ ...formData, links: newLinks });
  };

  const addLinkField = () => {
    setFormData({ ...formData, links: [...formData.links, { label: "", url: "" }] });
  };

  const removeLinkField = (index: number) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: newLinks });
  };

  const handleSave = async () => {
    if (!formData.city) {
      toast({ variant: "destructive", title: "O nome da cidade é obrigatório" });
      return;
    }

    // Filter empty links
    const cleanLinks = formData.links.filter(l => l.label.trim() !== "" && l.url.trim() !== "");

    try {
      if (editingId) {
        const { error } = await supabase
          .from("seo_cities")
          .update({
            city: formData.city,
            operation: formData.operation,
            links: cleanLinks
          })
          .eq("id", editingId);
        
        if (error) throw error;
        toast({ title: "Atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from("seo_cities")
          .insert([{
            city: formData.city,
            operation: formData.operation,
            links: cleanLinks
          }]);

        if (error) throw error;
        toast({ title: "Criado com sucesso!" });
      }

      setDialogOpen(false);
      fetchCities();
    } catch (err: any) {
      console.error(err);
      toast({ 
        variant: "destructive", 
        title: "Erro ao salvar", 
        description: err.message.includes("unique") ? "Já existe um registro para essa cidade e operação." : "Erro desconhecido."
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    const { error } = await supabase.from("seo_cities").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Erro ao excluir" });
    } else {
      toast({ title: "Excluído com sucesso" });
      fetchCities();
    }
  };

  const renderTable = (operation: "rent" | "buy") => {
    const filtered = cities.filter(c => c.operation === operation);
    
    return (
      <div className="border rounded-lg overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cidade</TableHead>
              <TableHead>Links Cadastrados</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.city}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {item.links.slice(0, 3).map((link, i) => (
                        <div key={i} className="text-sm text-gray-600 truncate max-w-[400px]">
                          • {link.label}
                        </div>
                      ))}
                      {item.links.length > 3 && (
                        <span className="text-xs text-muted-foreground">+ {item.links.length - 3} outros</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleOpenDialog(item)}>
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cidades & SEO</h2>
          <p className="text-muted-foreground">Gerencie os links de rodapé da Home Page.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Nova Cidade
        </Button>
      </div>

      <Tabs defaultValue="rent" className="w-full">
        <TabsList>
          <TabsTrigger value="rent">Alugar</TabsTrigger>
          <TabsTrigger value="buy">Comprar</TabsTrigger>
          <TabsTrigger value="popular">Populares (Home)</TabsTrigger>
        </TabsList>
        <TabsContent value="rent" className="mt-4">
          {renderTable("rent")}
        </TabsContent>
        <TabsContent value="buy" className="mt-4">
          {renderTable("buy")}
        </TabsContent>
        <TabsContent value="popular" className="mt-4">
          {(() => {
            const popularCity = cities.find(c => c.city === "Popular Searches");
            return (
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Seção: Buscas Populares</h3>
                    <p className="text-sm text-gray-500">
                      Esta é a seção de links variados que aparece no rodapé da Home (fundo bege).
                    </p>
                  </div>
                  {popularCity ? (
                    <Button onClick={() => handleOpenDialog(popularCity)}>
                      <Edit className="mr-2 h-4 w-4" /> Editar Links ({popularCity.links.length})
                    </Button>
                  ) : (
                    <Button onClick={() => {
                      setEditingId(null);
                      setFormData({
                        city: "Popular Searches",
                        operation: "rent", // Internal flag
                        links: [{ label: "", url: "" }]
                      });
                      setDialogOpen(true);
                    }}>
                      <Plus className="mr-2 h-4 w-4" /> Criar Seção Popular
                    </Button>
                  )}
                </div>
                
                {popularCity && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 bg-slate-50 p-4 rounded-md">
                    {popularCity.links.map((link, i) => (
                      <div key={i} className="text-sm bg-white p-2 border rounded flex flex-col">
                         <span className="font-medium">{link.label}</span>
                         <span className="text-xs text-gray-400 truncate">{link.url}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Cidade" : "Nova Cidade"}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input 
                  placeholder="Ex: São Paulo" 
                  value={formData.city} 
                  onChange={e => setFormData({...formData, city: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Operação</Label>
                <Select 
                  value={formData.operation} 
                  onValueChange={(val: "rent" | "buy") => setFormData({...formData, operation: val})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">Alugar</SelectItem>
                    <SelectItem value="buy">Comprar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Links de SEO</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLinkField}>
                  <Plus className="mr-2 h-3 w-3" /> Adicionar Link
                </Button>
              </div>
              
              <div className="space-y-3">
                {formData.links.map((link, index) => (
                  <div key={index} className="flex gap-3 items-end p-3 bg-slate-50 rounded-lg border">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-gray-500">Texto do Link</Label>
                      <Input 
                        placeholder="Ex: Apartamentos na Av. Paulista" 
                        value={link.label}
                        onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-gray-500">URL Destino</Label>
                      <div className="relative">
                        <LinkIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                        <Input 
                          placeholder="/imoveis?..." 
                          value={link.url}
                          onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                          className="pl-8 bg-white"
                        />
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeLinkField(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="mr-2 h-4 w-4" /> Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
