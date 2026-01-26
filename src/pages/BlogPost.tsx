import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const postsContent: Record<string, any> = {
  "como-funciona-consorcio-imobiliario": {
    title: "Entenda como funciona o Consórcio Imobiliário",
    date: "26 Jan 2026",
    author: "Equipe R7",
    category: "Educação Financeira",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    content: (
      <>
        <p className="lead text-xl text-gray-600 mb-8">
          O consórcio imobiliário tem se destacado como uma das formas mais inteligentes de planejar a compra da casa própria, reforma ou investimento em imóveis, fugindo das altas taxas de juros dos financiamentos tradicionais.
        </p>
        
        <h2 className="text-2xl font-bold text-[#1f2022] mt-8 mb-4">O que é o consórcio?</h2>
        <p className="mb-6 text-gray-700 leading-relaxed">
          É a união de pessoas físicas ou jurídicas em um grupo, com prazo de duração e número de cotas previamente determinados, promovida por uma Administradora de Consórcio, com a finalidade de propiciar a seus integrantes, de forma isonômica, a aquisição de bens ou serviços.
        </p>

        <h2 className="text-2xl font-bold text-[#1f2022] mt-8 mb-4">Principais Vantagens</h2>
        <ul className="list-disc pl-6 space-y-3 mb-6 text-gray-700">
          <li><strong>Sem Juros:</strong> Diferente do financiamento, não há cobrança de juros, apenas uma taxa de administração diluída nas parcelas.</li>
          <li><strong>Poder de Compra à Vista:</strong> Com a carta de crédito em mãos, você negocia o imóvel como se estivesse pagando à vista, conseguindo melhores descontos.</li>
          <li><strong>Flexibilidade:</strong> Possibilidade de usar o crédito para comprar terreno, construir, reformar ou comprar imóvel novo/usado.</li>
          <li><strong>Uso do FGTS:</strong> É possível utilizar seu saldo do FGTS para ofertar lances ou complementar a carta de crédito.</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#1f2022] mt-8 mb-4">Como ser contemplado?</h2>
        <p className="mb-6 text-gray-700 leading-relaxed">
          Existem duas formas: sorteio ou lance. Nos sorteios mensais, todos concorrem igualmente. Já o lance funciona como um leilão: quem antecipa mais parcelas leva a carta.
        </p>
      </>
    )
  },
  "guia-financiamento-imobiliario": {
    title: "Guia Completo do Financiamento Imobiliário",
    date: "25 Jan 2026",
    author: "Especialistas R7",
    category: "Financiamento",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    content: (
      <>
        <p className="lead text-xl text-gray-600 mb-8">
          Conquistar a casa própria é o sonho de muitos brasileiros. O financiamento imobiliário é a ferramenta que torna esse sonho possível para quem não dispõe do valor total à vista.
        </p>
        
        <h2 className="text-2xl font-bold text-[#1f2022] mt-8 mb-4">Sistemas de Amortização</h2>
        <p className="mb-6 text-gray-700 leading-relaxed">
          Os mais comuns são a Tabela SAC (parcelas decrescentes) e a Tabela Price (parcelas fixas). Na SAC, você amortiza mais no início, pagando menos juros no total. Na Price, a parcela inicial é menor, mas o saldo devedor cai mais lentamente.
        </p>

        <h2 className="text-2xl font-bold text-[#1f2022] mt-8 mb-4">Documentação Necessária</h2>
        <ul className="list-disc pl-6 space-y-3 mb-6 text-gray-700">
          <li>RG e CPF (do casal, se houver).</li>
          <li>Comprovante de Estado Civil.</li>
          <li>Comprovante de Renda (Holerites ou IR).</li>
          <li>Comprovante de Residência.</li>
        </ul>

        <h2 className="text-2xl font-bold text-[#1f2022] mt-8 mb-4">Passo a Passo na R7</h2>
        <p className="mb-6 text-gray-700 leading-relaxed">
          Nós cuidamos de tudo. Desde a simulação nos principais bancos para encontrar a menor taxa, até a organização da documentação e acompanhamento no cartório. Nossa assessoria garante segurança jurídica e agilidade.
        </p>
      </>
    )
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = slug ? postsContent[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
        <Button onClick={() => navigate("/blog")}>Voltar para o Blog</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title={`${post.title} | Blog R7`} 
        description={`Leia sobre ${post.title} no Blog da R7 Consultoria.`}
      />
      <Header />
      
      <main className="flex-1 pb-20">
        {/* Hero Image */}
        <div className="h-[400px] w-full relative">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white container mx-auto">
                <Badge className="bg-primary hover:bg-primary text-white mb-4 border-none">{post.category}</Badge>
                <h1 className="text-3xl md:text-5xl font-bold max-w-4xl leading-tight mb-4">{post.title}</h1>
                <div className="flex items-center gap-6 text-sm font-medium opacity-90">
                    <span className="flex items-center gap-2"><User size={16}/> {post.author}</span>
                    <span className="flex items-center gap-2"><Calendar size={16}/> {post.date}</span>
                </div>
            </div>
        </div>

        <div className="container mx-auto px-4 mt-12 max-w-3xl">
            <Button variant="ghost" onClick={() => navigate("/blog")} className="mb-8 pl-0 hover:bg-transparent hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Blog
            </Button>

            <article className="prose prose-lg max-w-none text-justify">
                {post.content}
            </article>

            <div className="mt-12 pt-8 border-t flex justify-between items-center">
                <p className="font-bold text-[#1f2022]">Gostou do artigo?</p>
                <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" /> Compartilhar
                </Button>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
