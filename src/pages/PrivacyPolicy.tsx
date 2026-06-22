import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24 md:py-32 max-w-4xl prose prose-slate dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>
        <p className="text-muted-foreground mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        
        <section className="space-y-6">
          <h2>1. Nosso Compromisso (LGPD)</h2>
          <p>O Empatizando respeita a sua privacidade e garante o sigilo absoluto das suas informações em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>

          <h2>2. Dados Coletados</h2>
          <p>Coletamos os dados fornecidos no cadastro (nome, e-mail) e os históricos de conversas mantidos com a nossa Inteligência Artificial para prover continuidade de contexto nas suas interações (memória de longo prazo).</p>

          <h2>3. Uso dos Dados</h2>
          <p>O histórico de conversas é criptografado e utilizado <strong>exclusivamente</strong> para melhorar o seu atendimento personalizado. Não vendemos, alugamos ou compartilhamos suas conversas com terceiros ou anunciantes.</p>

          <h2>4. Exclusão de Dados</h2>
          <p>Você tem o direito de solicitar a exclusão permanente de todos os seus registros do nosso banco de dados a qualquer momento.</p>

          <h2>5. Contato e Encarregado de Dados (DPO)</h2>
          <p>Para exercer seus direitos de privacidade ou solicitar exclusão de conta, envie um e-mail para: <strong>contato@empatizando.com</strong></p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
