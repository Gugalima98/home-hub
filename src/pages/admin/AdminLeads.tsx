import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, MessageSquare } from "lucide-react";

interface Lead {
    id: string;
    created_at: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    property: {
        title: string;
        code: number;
    } | null;
}

export default function AdminLeads() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("leads")
            .select("*, property:properties(title, code)")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching leads:", error);
        } else {
            setLeads(data || []);
        }
        setLoading(false);
    };

    const openWhatsApp = (phone: string, name: string) => {
        // Remove non-numeric characters
        const cleanPhone = phone.replace(/\D/g, "");
        const message = `Olá, ${name}. Vi seu interesse em um imóvel no nosso site.`;
        window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Leads e Contatos</h1>
                <Button onClick={fetchLeads} variant="outline" size="sm">
                    Atualizar
                </Button>
            </div>

            <div className="bg-white rounded-md border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Contato</TableHead>
                            <TableHead>Imóvel</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    Carregando leads...
                                </TableCell>
                            </TableRow>
                        ) : leads.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    Nenhum lead encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            leads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell className="text-xs text-gray-500">
                                        {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                    </TableCell>
                                    <TableCell className="font-medium">{lead.name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span>{lead.email}</span>
                                            <span className="text-gray-500 text-xs">{lead.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {lead.property ? (
                                            <div className="flex flex-col text-sm max-w-[200px]">
                                                <span className="truncate font-medium">{lead.property.title}</span>
                                                <span className="text-xs text-gray-500">Cód. {lead.property.code}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">Imóvel removido</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                            {lead.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-green-600"
                                            onClick={() => openWhatsApp(lead.phone, lead.name)}
                                            title="Chamar no WhatsApp"
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                        </Button>
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
