import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title="Termos de Uso | R7 Consultoria" />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-[#1f2022]">Termos de Uso</h1>
        <div className="prose prose-lg max-w-none text-gray-700">
          <p>Última atualização: 26 de Janeiro de 2026</p>
          
          <h3>1. Aceitação dos Termos</h3>
          <p>
            Ao acessar e usar o site da R7 Consultoria, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nosso serviço.
          </p>

          <h3>2. Uso do Site</h3>
          <p>
            O conteúdo deste site é para sua informação geral e uso pessoal. Está sujeito a alterações sem aviso prévio. O uso não autorizado deste site pode dar origem a um pedido de indenização e/ou ser considerado crime.
          </p>

          <h3>3. Propriedade Intelectual</h3>
          <p>
            Todo o conteúdo presente neste site (textos, imagens, logotipos, etc.) é de propriedade da R7 Consultoria ou licenciado para nós. A reprodução é proibida, exceto em conformidade com o aviso de copyright.
          </p>

          <h3>4. Limitação de Responsabilidade</h3>
          <p>
            A R7 Consultoria não garante a precisão, pontualidade, desempenho, integridade ou adequação das informações encontradas neste site para qualquer finalidade específica. Você reconhece que tais informações podem conter imprecisões.
          </p>

          <h3>5. Lei Aplicável</h3>
          <p>
            Estes termos são regidos pelas leis da República Federativa do Brasil.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
