import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Search, Building2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Property {
  id: string;
  title: string;
  city: string;
  state: string;
  price: number;
  operation_type: string;
  property_type: string;
  created_at: string;
  status: "draft" | "active" | "inactive" | "rented" | "sold";
  views_count: number;
}

export default function AdminProperties() {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("id, title, city, state, price, operation_type, property_type, created_at, status, views_count")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching properties:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar",
        description: "Não foi possível carregar a lista de imóveis.",
      });
    } else {
      // @ts-ignore
      setProperties(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este imóvel?")) return;

    const { error } = await supabase.from("properties").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao tentar excluir o imóvel.",
      });
    } else {
      toast({
        title: "Imóvel excluído",
        description: "O imóvel foi removido com sucesso.",
      });
      fetchProperties(); // Recarrega a lista
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600 hover:bg-green-700">Ativo</Badge>;
      case "draft":
        return <Badge variant="outline" className="text-gray-500">Rascunho</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inativo</Badge>;
      case "rented":
        return <Badge className="bg-blue-600">Alugado</Badge>;
      case "sold":
        return <Badge className="bg-blue-600">Vendido</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Imóveis</h2>
          <p className="text-muted-foreground">Gerencie o catálogo de imóveis do sistema.</p>
        </div>
        <Link to="/admin/properties/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Imóvel
          </Button>
        </Link>
      </div>

      {/* Filtros e Busca */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar por título..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Operação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Carregando imóveis...
                </TableCell>
              </TableRow>
            ) : filteredProperties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <Building2 className="h-8 w-8 mb-2 opacity-20" />
                    <p>Nenhum imóvel encontrado.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>{getStatusBadge(property.status)}</TableCell>
                  <TableCell className="font-medium">
                    {property.title}
                    <div className="text-xs text-muted-foreground">
                      {property.views_count || 0} visualizações
                    </div>
                  </TableCell>
                  <TableCell>{property.city}/{property.state}</TableCell>
                  <TableCell>{property.property_type}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(property.price)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={property.operation_type === "rent" ? "secondary" : "default"}>
                      {property.operation_type === "rent" ? "Aluguel" : "Venda"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/properties/edit/${property.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-indigo-600">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-600"
                        onClick={() => handleDelete(property.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
