import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Aviso de Privacidade | R7 Consultoria" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-[#1f2022]">Aviso de Privacidade</h1>
        <div className="prose prose-lg max-w-none text-gray-700">
          <p>Última atualização: 26 de Janeiro de 2026</p>
          
          <h3>1. Introdução</h3>
          <p>
            A R7 Consultoria valoriza sua privacidade. Este Aviso de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você visita nosso site ou utiliza nossos serviços.
          </p>

          <h3>2. Coleta de Informações</h3>
          <p>
            Podemos coletar informações pessoais que você nos fornece voluntariamente, como nome, endereço de e-mail e número de telefone, quando você se cadastra, preenche formulários ou entra em contato conosco.
          </p>

          <h3>3. Uso das Informações</h3>
          <p>
            Utilizamos suas informações para fornecer e melhorar nossos serviços, responder a suas perguntas, enviar comunicações de marketing (se autorizado) e para fins de segurança.
          </p>

          <h3>4. Compartilhamento de Dados</h3>
          <p>
            Não vendemos suas informações pessoais. Podemos compartilhar dados com prestadores de serviços terceirizados que nos ajudam a operar nosso negócio, sempre sob estritas obrigações de confidencialidade.
          </p>

          <h3>5. Seus Direitos</h3>
          <p>
            De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem o direito de acessar, corrigir ou solicitar a exclusão de seus dados pessoais. Entre em contato conosco para exercer esses direitos.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
