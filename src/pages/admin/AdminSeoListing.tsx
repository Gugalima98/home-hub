import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import locationsData from "@/data/locations.json";
import spNeighborhoods from "@/data/saopaulo_neighborhoods.json";
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
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Trash2, Edit, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SeoLink {
  label: string;
  url: string;
}

interface SeoLinkUI {
  label: string;
  neighborhood: string;
}

interface SeoListing {
  id: string;
  city: string;
  operation: "rent" | "buy";
  links: SeoLink[];
}

export default function AdminSeoListing() {
  const [items, setItems] = useState<SeoListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [availableUfs, setAvailableUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>("");
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    city: string;
    operation: "rent" | "buy";
    links: SeoLinkUI[];
  }>({
    city: "",
    operation: "rent",
    links: [{ label: "", neighborhood: "" }]
  });

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("seo_listing_links")
      .select("*")
      .order("city");
    
    if (error) {
      toast({ variant: "destructive", title: "Erro ao buscar dados" });
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
    setAvailableUfs(Object.keys(locationsData).sort());
  }, []);

  // Update Cities when UF changes
  useEffect(() => {
    if (selectedUf && locationsData[selectedUf as keyof typeof locationsData]) {
      let cities = Object.keys(locationsData[selectedUf as keyof typeof locationsData]);
      
      // Force include São Paulo capital if UF is SP
      if (selectedUf === 'SP' && !cities.includes('São Paulo')) {
         cities.push('São Paulo');
      }
      
      setAvailableCities(cities.sort());
    } else {
      setAvailableCities([]);
    }
  }, [selectedUf]);

  // Update Neighborhoods when City changes (and UF is set)
  useEffect(() => {
    // Override for São Paulo Capital
    if (formData.city === "São Paulo" || formData.city === "Sao Paulo") {
       setAvailableNeighborhoods(spNeighborhoods.sort());
       return;
    }

    if (selectedUf && formData.city && locationsData[selectedUf as keyof typeof locationsData]) {
      const cityData = locationsData[selectedUf as keyof typeof locationsData];
      // @ts-ignore
      const neighborhoods = cityData[formData.city] || [];
      setAvailableNeighborhoods(neighborhoods.sort());
    } else {
      setAvailableNeighborhoods([]);
    }
  }, [formData.city, selectedUf]);

  const handleOpenDialog = (item?: SeoListing) => {
    if (item) {
      setEditingId(item.id);
      
      // Attempt to auto-detect UF for existing city
      let foundUf = "";
      for (const [uf, cities] of Object.entries(locationsData)) {
        if (Object.prototype.hasOwnProperty.call(cities, item.city)) {
          foundUf = uf;
          break;
        }
      }
      if (foundUf) setSelectedUf(foundUf);

      const citySlug = item.city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
      
      const uiLinks = (item.links as SeoLink[]).map(l => {
        let neigh = "";
        const parts = l.url.split('/imovel/');
        if (parts.length >= 2) {
           const slug = parts[1];
           let cleanSlug = slug.replace(`-${citySlug}-rj-brasil`, '').replace(`-${citySlug}-sp-brasil`, '').replace(`-${citySlug}-brasil`, '');
           if (cleanSlug === slug) {
               const idx = slug.lastIndexOf(`-${citySlug}`);
               if (idx > 0) cleanSlug = slug.substring(0, idx);
           }
           neigh = cleanSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
        return { label: l.label, neighborhood: neigh };
      });

      setFormData({
        city: item.city,
        operation: item.operation,
        links: uiLinks.length > 0 ? uiLinks : [{ label: "", neighborhood: "" }]
      });
    } else {
      setEditingId(null);
      setSelectedUf(""); // Reset UF
      setFormData({
        city: "",
        operation: "rent",
        links: [{ label: "", neighborhood: "" }]
      });
    }
    setDialogOpen(true);
  };

  const handleLinkChange = (index: number, field: "label" | "neighborhood", value: string) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData({ ...formData, links: newLinks });
  };

  const addLinkField = () => {
    setFormData({ ...formData, links: [...formData.links, { label: "", neighborhood: "" }] });
  };

  const removeLinkField = (index: number) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: newLinks });
  };

  const handleSave = async () => {
    if (!formData.city) {
      toast({ variant: "destructive", title: "Cidade obrigatória" });
      return;
    }

    const slugify = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
    const citySlug = slugify(formData.city);

    const dbLinks = formData.links
      .filter(l => l.label.trim() !== "" && l.neighborhood.trim() !== "")
      .map(l => {
        const nSlug = slugify(l.neighborhood);
        
        // Try to be smarter about state suffix based on selectedUf
        let stateSuffix = "-brasil";
        if (selectedUf) {
            stateSuffix = `-${selectedUf.toLowerCase()}-brasil`;
        } else {
            // Fallback heuristics
            if (citySlug.includes("rio")) stateSuffix = "-rj-brasil";
            if (citySlug.includes("sao-paulo")) stateSuffix = "-sp-brasil";
        }

        const fullSlug = `${nSlug}-${citySlug}${stateSuffix}`;
        const opPath = formData.operation === 'buy' ? 'comprar' : 'alugar';
        
        return {
          label: l.label,
          url: `/${opPath}/imovel/${fullSlug}`
        };
      });

    try {
      const payload = {
        city: formData.city,
        operation: formData.operation,
        links: dbLinks
      };

      if (editingId) {
        const { error } = await supabase
          .from("seo_listing_links")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("seo_listing_links")
          .insert([payload]);
        if (error) throw error;
      }
      toast({ title: "Salvo com sucesso!" });
      setDialogOpen(false);
      fetchItems();
    } catch (err: any) {
      console.error(err);
      toast({ variant: "destructive", title: "Erro ao salvar" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir?")) return;
    const { error } = await supabase.from("seo_listing_links").delete().eq("id", id);
    if (!error) {
      toast({ title: "Excluído" });
      fetchItems();
    }
  };

  const renderTable = (op: "rent" | "buy") => {
    const filtered = items.filter(i => i.operation === op);
    return (
      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cidade</TableHead>
              <TableHead>Links</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
               <TableRow>
                 <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">Nenhum registro.</TableCell>
               </TableRow>
            ) : (
              filtered.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.city}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {item.links.slice(0, 3).map((l, i) => (
                        <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded inline-block w-fit text-slate-700">
                          {l.label}
                        </span>
                      ))}
                      {item.links.length > 3 && <span className="text-xs text-muted-foreground">...mais {item.links.length - 3}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}><Edit className="h-4 w-4 text-blue-600" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">SEO - Página de Imóveis</h2>
          <p className="text-muted-foreground">Gerencie os links de bairros sugeridos na listagem.</p>
        </div>
        <Button onClick={() => handleOpenDialog()}><Plus className="mr-2 h-4 w-4" /> Novo</Button>
      </div>

      <Tabs defaultValue="rent" className="w-full">
        <TabsList>
          <TabsTrigger value="rent">Alugar</TabsTrigger>
          <TabsTrigger value="buy">Comprar</TabsTrigger>
        </TabsList>
        <TabsContent value="rent" className="mt-4">{renderTable("rent")}</TabsContent>
        <TabsContent value="buy" className="mt-4">{renderTable("buy")}</TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? "Editar Links" : "Novo Grupo de Links"}</DialogTitle></DialogHeader>
          <div className="space-y-6 py-4">
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Estado (UF)</Label>
                <Select value={selectedUf} onValueChange={setSelectedUf}>
                  <SelectTrigger>
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUfs.map(uf => (
                      <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Select value={formData.city} onValueChange={(v) => setFormData({...formData, city: v})} disabled={!selectedUf}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCities.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Operação</Label>
                <Select value={formData.operation} onValueChange={(v: any) => setFormData({...formData, operation: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">Alugar</SelectItem>
                    <SelectItem value="buy">Comprar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Links de Bairros</Label>
                <Button size="sm" variant="outline" onClick={addLinkField}><Plus className="h-3 w-3 mr-1" /> Adicionar</Button>
              </div>
              <div className="space-y-3 bg-slate-50 p-4 rounded-md border">
                {formData.links.map((link, i) => (
                  <div key={i} className="flex gap-3 items-end">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">Texto do Link</Label>
                      <Input placeholder="Ex: Aluguel em Copacabana" value={link.label} onChange={e => handleLinkChange(i, "label", e.target.value)} className="bg-white" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">Bairro</Label>
                      <Select 
                        value={link.neighborhood} 
                        onValueChange={(v) => handleLinkChange(i, "neighborhood", v)}
                        disabled={!formData.city}
                      >
                        <SelectTrigger className="h-10 bg-white">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableNeighborhoods.map(n => (
                            <SelectItem key={n} value={n}>{n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => removeLinkField(i)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * As URLs serão geradas automaticamente no formato: <code>/operacao/imovel/bairro-cidade-uf-brasil</code>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={loading}><Save className="mr-2 h-4 w-4" /> Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
