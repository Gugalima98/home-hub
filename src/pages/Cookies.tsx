import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

const CookiesPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Política de Cookies | R7 Consultoria" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-[#1f2022]">Política de Cookies</h1>
        <div className="prose prose-lg max-w-none text-gray-700">
          <p>Última atualização: 26 de Janeiro de 2026</p>
          
          <h3>1. O que são Cookies?</h3>
          <p>
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, tablet ou celular) quando você visita um site. Eles são amplamente utilizados para fazer os sites funcionarem de maneira mais eficiente e fornecer informações aos proprietários do site.
          </p>

          <h3>2. Como usamos os Cookies?</h3>
          <p>
            Utilizamos cookies para entender como você interage com nosso site, lembrar suas preferências (como login e filtros de busca) e melhorar sua experiência de navegação.
          </p>

          <h3>3. Tipos de Cookies que utilizamos</h3>
          <ul>
            <li><strong>Essenciais:</strong> Necessários para o funcionamento do site (ex: autenticação).</li>
            <li><strong>Desempenho:</strong> Coletam dados anônimos sobre como os visitantes usam o site.</li>
            <li><strong>Funcionais:</strong> Lembram suas escolhas para oferecer uma experiência personalizada.</li>
            <li><strong>Publicidade:</strong> Usados para fornecer anúncios relevantes aos seus interesses.</li>
          </ul>

          <h3>4. Gerenciamento de Cookies</h3>
          <p>
            Você pode controlar e/ou excluir cookies conforme desejar através das configurações do seu navegador. Note que desativar cookies pode afetar a funcionalidade deste site.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CookiesPage;
