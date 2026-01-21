import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldAlert, Pencil, Trash2, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminUserForm, UserFormValues } from "./components/AdminUserForm";
import { AdminUserCreateForm, CreateUserFormValues } from "./components/AdminUserCreateForm";

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  creci: string | null;
  role: 'admin' | 'realtor' | 'owner' | 'user';
  created_at: string;
}

export default function AdminUsers() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State dos Dialogs
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar",
        description: "Não foi possível carregar a lista de usuários.",
      });
    } else {
      // @ts-ignore
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: Profile) => {
    setEditingUser(user);
    setIsEditOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (userId === currentUser?.id) {
        toast({ variant: "destructive", title: "Ação bloqueada", description: "Você não pode excluir a si mesmo." });
        return;
    }

    if (!confirm("Tem certeza que deseja excluir este usuário? Isso removerá o perfil, mas o login pode permanecer ativo até ser limpo do sistema de Auth.")) return;

    const { error } = await supabase.from("profiles").delete().eq("id", userId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível remover o perfil.",
      });
    } else {
      toast({ title: "Usuário excluído", description: "O perfil foi removido com sucesso." });
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleSaveEdit = async (data: UserFormValues) => {
    if (!editingUser) return;
    setSaving(true);

    try {
        const { error } = await supabase
            .from("profiles")
            .update({
                full_name: data.full_name,
                phone: data.phone,
                creci: data.creci,
                role: data.role
            })
            .eq("id", editingUser.id);

        if (error) throw error;

        toast({ title: "Sucesso!", description: "Dados do usuário atualizados." });
        
        // Atualiza lista localmente
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...data } : u));
        setIsEditOpen(false);
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Erro ao salvar",
            description: error.message || "Erro desconhecido.",
        });
    } finally {
        setSaving(false);
    }
  };

  const handleCreateUser = async (data: CreateUserFormValues) => {
    setSaving(true);
    try {
      // Garantir token fresco
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error("Sessão expirada. Faça login novamente.");

      const { data: responseData, error } = await supabase.functions.invoke('create-user', {
        body: data,
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) throw error;

      toast({ 
        title: "Usuário Criado!", 
        description: `O usuário ${data.full_name} foi criado com sucesso.` 
      });
      
      setIsCreateOpen(false);
      fetchUsers(); // Recarrega a lista
    } catch (error: any) {
      console.error("Erro na Edge Function:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar usuário",
        description: error.message || "Verifique se a Edge Function está implantada corretamente.",
      });
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-600 hover:bg-red-700">Admin</Badge>;
      case "realtor":
        return <Badge className="bg-indigo-600 hover:bg-indigo-700">Corretor</Badge>;
      case "owner":
        return <Badge className="bg-amber-600 hover:bg-amber-700">Proprietário</Badge>;
      default:
        return <Badge variant="secondary" className="text-gray-500">Usuário</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Usuários e Permissões</h2>
            <p className="text-muted-foreground">Gerencie quem tem acesso ao sistema administrativo.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <UserPlus className="mr-2 h-4 w-4" />
            Novo Usuário
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Permissão</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex justify-center items-center gap-2 text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.full_name || "Sem nome"}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500 hover:text-indigo-600"
                            onClick={() => handleEdit(user)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500 hover:text-red-600"
                            onClick={() => handleDelete(user.id)}
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
      
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-yellow-800 text-sm">Atenção com permissões</h4>
          <p className="text-yellow-700 text-sm mt-1">
            <strong>Admins</strong> têm acesso total ao sistema.<br/>
            <strong>Corretores</strong> podem ver leads e editar imóveis.<br/>
          </p>
        </div>
      </div>

      {/* Dialog de Edição */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Editar Usuário</DialogTitle>
            </DialogHeader>
            
            {editingUser && (
                <AdminUserForm 
                    defaultValues={editingUser} 
                    onSubmit={handleSaveEdit} 
                    loading={saving}
                    onCancel={() => setIsEditOpen(false)}
                />
            )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Criação */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Novo Usuário</DialogTitle>
            </DialogHeader>
            <AdminUserCreateForm 
                onSubmit={handleCreateUser} 
                loading={saving}
                onCancel={() => setIsCreateOpen(false)}
            />
        </DialogContent>
      </Dialog>
    </div>
  );
}
