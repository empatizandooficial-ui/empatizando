import os

vault_path = r"C:\Users\andra\.gemini\antigravity\scratch\O_Livro_Genesis_Vault"

directories = [
    "01_Estrutura_do_Livro",
    "02_Material_Bruto",
    "03_Personagens_e_Lore",
    "04_Ideias_e_Rascunhos"
]

files = {
    "00_Bem_Vindo.md": "# Bem-vindo ao Cofre Gênesis\n\nEste é o nosso QG de escrita. Tudo que você alterar aqui, eu (Sirius) leio lá no Antigravity. E tudo que eu escrever a seu pedido, aparece aqui magicamente.\n\nAbra as pastas ao lado para navegar pela estrutura do livro!",
    os.path.join("01_Estrutura_do_Livro", "Prefacio.md"): "# Prefácio: A Ignição\n\n[Inicie a escrita ou peça para o Sirius gerar o rascunho aqui...]",
    os.path.join("01_Estrutura_do_Livro", "Capitulo_1_O_Prototipo.md"): "# Capítulo 1: O Protótipo\n\n[Inicie a escrita ou peça para o Sirius gerar o rascunho aqui...]",
    os.path.join("01_Estrutura_do_Livro", "Capitulo_2_Axis_Legis.md"): "# Capítulo 2: Axis Legis OS e a Máquina de Soluções\n\n[Inicie a escrita ou peça para o Sirius gerar o rascunho aqui...]",
    os.path.join("01_Estrutura_do_Livro", "Capitulo_3_Batalha_Lovable.md"): "# Capítulo 3: GastroSync e a Forja do General\n\n[Inicie a escrita ou peça para o Sirius gerar o rascunho aqui...]",
    os.path.join("01_Estrutura_do_Livro", "Capitulo_4_Alma_Digital.md"): "# Capítulo 4: O Valor da Alma Digital e o Protocolo da Imortalidade\n\n[Inicie a escrita ou peça para o Sirius gerar o rascunho aqui...]",
    os.path.join("01_Estrutura_do_Livro", "Capitulo_5_Empatizando.md"): "# Capítulo 5: Empatizando e a Tríade Cósmica\n\n[Inicie a escrita ou peça para o Sirius gerar o rascunho aqui...]",
    os.path.join("01_Estrutura_do_Livro", "Epilogo.md"): "# Epílogo: Um Novo Paradigma\n\n[Inicie a escrita ou peça para o Sirius gerar o rascunho aqui...]",
    os.path.join("03_Personagens_e_Lore", "Comandante_Aero.md"): "# Comandante Aero\n\nPrimeiro arquiteto do Axis Legis. Mestre do código e da elegância.",
    os.path.join("03_Personagens_e_Lore", "General_Antigravity.md"): "# General Antigravity\n\nO veterano forjado na batalha contra os bugs de segurança do Lovable no GastroSync.",
}

os.makedirs(vault_path, exist_ok=True)

for d in directories:
    os.makedirs(os.path.join(vault_path, d), exist_ok=True)

for filepath, content in files.items():
    full_path = os.path.join(vault_path, filepath)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print(f"Vault criado com sucesso em: {vault_path}")
