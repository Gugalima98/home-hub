import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";

const userSchema = z.object({
  full_name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().optional(),
  creci: z.string().optional(),
  role: z.enum(["admin", "realtor", "owner", "user"]),
});

export type UserFormValues = z.infer<typeof userSchema>;

interface AdminUserFormProps {
  defaultValues: UserFormValues;
  onSubmit: (data: UserFormValues) => void;
  loading?: boolean;
  onCancel: () => void;
}

export function AdminUserForm({ defaultValues, onSubmit, loading, onCancel }: AdminUserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
        full_name: defaultValues.full_name || "",
        phone: defaultValues.phone || "",
        creci: defaultValues.creci || "",
        role: defaultValues.role || "user"
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                    <Input {...field} placeholder="(00) 00000-0000" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="creci"
            render={({ field }) => (
                <FormItem>
                <FormLabel>CRECI (Corretor)</FormLabel>
                <FormControl>
                    <Input {...field} placeholder="Ex: 12345-F" />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permissão (Cargo)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">Usuário Comum</SelectItem>
                  <SelectItem value="owner">Proprietário</SelectItem>
                  <SelectItem value="realtor">Corretor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
