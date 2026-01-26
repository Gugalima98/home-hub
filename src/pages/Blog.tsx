import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Blog = () => {
  const navigate = useNavigate();

  const posts = [
    {
      slug: "como-funciona-consorcio-imobiliario",
      title: "Entenda como funciona o Consórcio Imobiliário",
      excerpt: "Uma alternativa inteligente e econômica para adquirir seu imóvel sem juros. Saiba tudo sobre lances, sorteios e cartas de crédito.",
      category: "Educação Financeira",
      date: "26 Jan 2026",
      author: "Equipe R7",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      slug: "guia-financiamento-imobiliario",
      title: "Guia Completo do Financiamento Imobiliário",
      excerpt: "Taxas, prazos, documentos e as diferenças entre SFH e SFI. Tudo o que você precisa saber antes de financiar sua casa própria.",
      category: "Financiamento",
      date: "25 Jan 2026",
      author: "Especialistas R7",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      slug: "alugar-ou-comprar",
      title: "Alugar ou Comprar: Qual a melhor decisão?",
      excerpt: "Analisamos os prós e contras de cada opção para te ajudar a tomar a melhor decisão baseada no seu momento de vida.",
      category: "Dicas",
      date: "20 Jan 2026",
      author: "Equipe R7",
      image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Blog R7 Consultoria | Dicas e Mercado Imobiliário" 
        description="Fique por dentro das últimas notícias, dicas de decoração, mercado financeiro e tudo sobre imóveis no Blog da R7."
      />
      <Header />
      
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4 text-primary bg-primary/10">Blog & Notícias</Badge>
            <h1 className="text-4xl font-bold text-[#1f2022] mb-4">Conteúdo para sua jornada</h1>
            <p className="text-gray-600 text-lg">
              Informação de qualidade para você tomar as melhores decisões na hora de alugar, comprar ou investir.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.slug} className="overflow-hidden hover:shadow-xl transition-shadow border-none shadow-md group cursor-pointer" onClick={() => navigate(`/blog/${post.slug}`)}>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <Badge className="absolute top-4 left-4 bg-white text-[#1f2022] hover:bg-white">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <Button variant="link" className="p-0 h-auto font-semibold text-primary group-hover:underline">
                    Ler artigo completo <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
