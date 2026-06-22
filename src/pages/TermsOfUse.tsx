import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24 md:py-32 max-w-4xl prose prose-slate dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8">Termos de Uso</h1>
        <p className="text-muted-foreground mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        
        <section className="space-y-6">
          <div className="bg-destructive/10 border-l-4 border-destructive p-6 rounded-r-lg mb-8">
            <h2 className="text-destructive text-xl font-semibold mt-0 mb-2">Aviso Médico Importante</h2>
            <p className="m-0 text-foreground">
              O Empatizando é uma plataforma educacional e de suporte emocional alimentada por Inteligência Artificial. 
              <strong> Sob nenhuma circunstância as interações com nossos agentes virtuais substituem, anulam ou equivalem a um tratamento médico, psiquiátrico ou terapia com um profissional de saúde qualificado.</strong>
              Se você está em crise, pensando em suicídio ou precisando de ajuda imediata, procure o CVV (Ligue 188) ou uma emergência médica.
            </p>
          </div>

          <h2>1. Aceitação dos Termos</h2>
          <p>Ao acessar e utilizar o Empatizando, você concorda com estes Termos de Uso. Se não concordar, não utilize nossos serviços.</p>

          <h2>2. Natureza do Serviço</h2>
          <p>Oferecemos um hub de conteúdos, conexões e agentes virtuais empáticos. Nosso objetivo é o acolhimento inicial e o direcionamento para profissionais holísticos parceiros.</p>

          <h2>3. Responsabilidade do Usuário</h2>
          <p>Você é responsável por todas as informações fornecidas e por manter o sigilo de suas credenciais de acesso.</p>

          <h2>4. Contato</h2>
          <p>Dúvidas sobre estes termos podem ser encaminhadas para: <strong>contato@empatizando.com</strong></p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfUse;
