export interface Product {
  id: string;
  title: string;
  description: string;
  price?: number;
  base_price?: number;
  category?: string;
  images?: string[];
  image_url?: string;
  features?: string[];
  slug: string;
}

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Adesivo Recém Habilitada(o) - Paciência & Respeito",
    description: "Aviso visual de alta visibilidade para o vidro traseiro/vigia. Impressão premium resistente a sol e chuva. Ajuda a reduzir buzinas desnecessárias, intimidações e proporciona uma direção muito mais tranquila nos primeiros meses de volante.",
    price: 39.90,
    base_price: 39.90,
    category: "Adesivos Veiculares",
    slug: "adesivo-recem-habilitada",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop"
    ],
    features: [
      "Material Vinílico Automotivo de Alta Durabilidade",
      "Resistente a Raios UV, Sol Forte e Chuva",
      "Fácil Aplicação e Remoção sem Deixar Cola no Vidro",
      "Visibilidade Ideal para Distâncias de Frenagem"
    ]
  },
  {
    id: "2",
    title: "Adesivo Autismo a Bordo - Tenha Paciência",
    description: "Adesivo de conscientização com o símbolo oficial do quebra-cabeça e fita do autismo. Informa aos motoristas e equipes de resgate sobre a presença de pessoa autista no veículo, prevenindo situações de estresse sonoro e colisões.",
    price: 39.90,
    base_price: 39.90,
    category: "Adesivos de Conscientização",
    slug: "adesivo-autismo",
    images: [
      "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=800&auto=format&fit=crop"
    ],
    features: [
      "Símbolo Oficial de Conscientização",
      "Cores Vivas e Alta Nitidez",
      "Proteção Térmica e Resistência a Lavagens",
      "Item Essencial de Segurança Inclusiva"
    ]
  },
  {
    id: "3",
    title: "Adesivo Bebê a Bordo - Condução Cautelosa",
    description: "Alerta preventivo que estimula a distância regulamentar de segurança entre veículos. Proteja quem você mais ama com comunicação clara e amigável no trânsito.",
    price: 34.90,
    base_price: 34.90,
    category: "Adesivos Veiculares",
    slug: "adesivo-bebe-a-bordo",
    images: [
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop"
    ],
    features: [
      "Design Moderno e Acolhedor",
      "Vinil Impermeável Anti-Desbotamento",
      "Fixação Segura no Vidro Traseiro"
    ]
  },
  {
    id: "4",
    title: "Adesivo Melhor Idade - Respeito & Gentileza",
    description: "Informa aos demais condutores sobre a condução prudente de idosos ou transporte de passageiros da melhor idade, incentivando manobras sem pressão e mais empatia.",
    price: 34.90,
    base_price: 34.90,
    category: "Adesivos de Conscientização",
    slug: "adesivo-melhor-idade",
    images: [
      "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?q=80&w=800&auto=format&fit=crop"
    ],
    features: [
      "Comunicação Visual Clara e Educativa",
      "Alta Durabilidade para Uso Diário",
      "Fácil de Instalar"
    ]
  }
];
