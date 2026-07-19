import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ExchangePolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24 md:py-32 max-w-4xl prose prose-slate dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8">Política de Trocas e Devoluções</h1>
        <p className="text-muted-foreground mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        
        <section className="space-y-6">
          <h2>1. Prazo de Arrependimento (CDC)</h2>
          <p>
            Em conformidade com o Código de Defesa do Consumidor (CDC), você tem o direito de se arrepender da compra em até 
            <strong> 7 (sete) dias corridos</strong> após o recebimento do produto. O produto deve ser devolvido em sua embalagem 
            original, sem indícios de uso ou violação.
          </p>

          <h2>2. Condições para Troca e Devolução</h2>
          <p>
            Para que a troca ou devolução seja aceita, o adesivo deve estar intacto, em seu liner (papel de fundo) original. 
            <strong>Atenção: um adesivo, uma vez utilizado, descolado de sua base original ou colado em qualquer superfície, perde imediatamente a garantia de devolução ou troca</strong>.
          </p>
          <p>
            Adesivos que apresentem marcas de tentativa de colagem, rasgos causados por manuseio inadequado, ou exposição a 
            elementos que danifiquem a cola antes da aplicação não serão aceitos como devolução.
          </p>

          <h2>3. Produtos com Defeito de Fabricação</h2>
          <p>
            Caso você receba um produto com defeito de fabricação (erro de impressão, corte incorreto), você tem o prazo de 
            até 30 dias para comunicar a nossa equipe. Solicitaremos fotos evidenciando o problema para analisarmos a troca ou reembolso.
          </p>

          <h2>4. Processo de Reembolso</h2>
          <p>
            Após o recebimento do produto devolvido e a análise de suas condições, o estorno será providenciado. 
            Pagamentos via PIX serão devolvidos em até 3 dias úteis. Pagamentos via Cartão de Crédito podem levar de uma a duas faturas para constar o estorno, dependendo da sua administradora.
          </p>

          <h2>5. Contato para Trocas</h2>
          <p>Para iniciar um processo de devolução, envie um e-mail para: <strong>contato@empatizando.com</strong>, informando o número do pedido e o motivo.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ExchangePolicy;
