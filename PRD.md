# Product Requirements Document (PRD) - AI Template Generator & UI Kit Platform
<p align="left">
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>
## 1. Visão Geral do Produto
A plataforma é uma aplicação web inovadora projetada para gerar, explorar e gerenciar Sistemas de Design (Design Systems) e Kits de Interface de Usuário (UI Kits). Utilizando Inteligência Artificial (Google Gemini), a ferramenta permite que desenvolvedores e designers criem templates completos a partir de descrições em texto ou imagens de referência, além de oferecer um marketplace/dashboard para explorar templates pré-existentes.

## 2. Objetivos
- **Acelerar o Desenvolvimento:** Reduzir o tempo gasto na criação de UI Kits e especificações de design.
- **Democratizar o Design:** Permitir que usuários sem forte background em design gerem interfaces consistentes e modernas.
- **Centralização:** Servir como um repositório único para descobrir, salvar, avaliar e exportar templates de UI.

## 3. Público-Alvo
- **Desenvolvedores Frontend/Full-Stack:** Buscando acelerar o setup inicial de projetos.
- **UI/UX Designers:** Procurando inspiração ou gerando bases rápidas para refinamento.
- **Product Managers/Empreendedores:** Para prototipação rápida e validação de ideias.

## 4. Funcionalidades Principais (Features)
- **Autenticação de Usuários:** Login e Registro de contas.
- **Dashboard de Templates:** Listagem de templates com suporte a busca, filtros (categorias, preços, popularidade) e paginação/scroll.
- **Gerador de UI com IA (AI Generator):**
  - Input de texto (prompts) e upload de imagens de referência.
  - Geração de paletas de cores, tipografia, componentes e telas usando a API do Gemini.
  - Exportação do resultado em formato JSON.
- **Detalhes do Template:**
  - Visualização aprofundada de um template (Overview, Features, Reviews, Related).
  - Edição de informações do template (título, descrição, tags, funcionalidades).
  - Sistema de avaliação (estrelas e comentários).
  - Ações de curtir, salvar, compartilhar e baixar/exportar.
- **Gestão de Favoritos/Coleções:** Salvar templates para uso futuro.

## 5. Arquitetura Técnica
- **Frontend:** React 18+ com TypeScript, construído via Vite.
- **Estilização:** Tailwind CSS para design responsivo e utilitário.
- **Ícones:** Lucide React.
- **Integração de IA:** `@google/genai` (Gemini) para processamento de linguagem natural e visão computacional.
- **Armazenamento de Dados:** `localStorage` simulando um banco de dados no client-side (para favoritos, histórico e templates customizados).
- **Roteamento/Navegação:** Gerenciamento de estado interno (ViewState) simulando rotas (`dashboard`, `generator`, `template-details`, etc.).

## 6. Estrutura de Arquivos e Diretórios

Abaixo está o mapeamento completo da estrutura do projeto e a responsabilidade de cada arquivo:

```text
/
├── index.html                 # Ponto de entrada HTML da aplicação.
├── package.json               # Dependências do projeto e scripts de execução.
├── tsconfig.json              # Configurações do compilador TypeScript.
├── vite.config.ts             # Configurações do bundler Vite.
├── types.ts                   # Definições de interfaces e tipos globais do TypeScript (Template, User, etc.).
├── App.tsx                    # Componente raiz que gerencia o estado global, navegação e layout principal.
├── index.tsx                  # Ponto de montagem do React no DOM.
│
├── components/                # Componentes de UI reutilizáveis
│   ├── ErrorBoundary.tsx      # Captura e trata erros na árvore de componentes React.
│   ├── Header.tsx             # Barra de navegação superior (busca, perfil, notificações).
│   ├── Sidebar.tsx            # Menu de navegação lateral (Dashboard, Gerador, Favoritos).
│   ├── SkeletonCard.tsx       # Componente de loading (esqueleto) para os cards de template.
│   ├── TemplateCard.tsx       # Card de exibição resumida de um template na listagem.
│   └── TemplateFilters.tsx    # Barra de filtros (categorias, ordenação, preço) do Dashboard.
│
├── pages/                     # Componentes que representam páginas/telas completas
│   ├── Dashboard.tsx          # Tela principal com a vitrine de templates e filtros.
│   ├── Generator.tsx          # Interface do gerador de templates por IA (input de prompt/imagem).
│   ├── Login.tsx              # Tela de autenticação (Entrar).
│   ├── Register.tsx           # Tela de criação de conta.
│   └── TemplateDetails.tsx    # Tela de detalhes de um template específico (Overview, Reviews, etc.).
│
├── services/                  # Lógica de negócios e integrações externas
│   ├── auth.ts                # Serviço de simulação/gerenciamento de autenticação de usuários.
│   ├── gemini.ts              # Integração com a API do Google Gemini para geração de UI Kits.
│   └── storage.ts             # Funções utilitárias para persistência de dados no LocalStorage.
│
└── data/                      # Dados estáticos e mocks
    └── templates.ts           # Banco de dados mockado contendo os templates iniciais da plataforma.
```

## 7. Requisitos Não Funcionais
- **Performance:** Carregamento rápido utilizando Vite, feedback visual imediato (Skeletons, Spinners) durante requisições assíncronas.
- **Responsividade:** A interface deve se adaptar perfeitamente a dispositivos móveis, tablets e desktops (Mobile-first approach com Tailwind).
- **Usabilidade (UX):** Tratamento de erros amigável, estados vazios (empty states) claros e navegação intuitiva.
- **Segurança:** As chaves de API (como a do Gemini) devem ser gerenciadas via variáveis de ambiente.
- **Manutenibilidade:** Código modularizado, tipagem estrita com TypeScript e uso de princípios de Clean Code.
