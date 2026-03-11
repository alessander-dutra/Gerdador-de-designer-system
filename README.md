# DG Studio - AI Template Manager

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white)

## Visão Geral do Projeto
O **DG Studio** é uma aplicação web moderna projetada para atuar como um painel profissional (dashboard) para gerenciamento e geração de templates de design. A principal inovação do projeto é a integração com a inteligência artificial **Gemini AI** do Google, permitindo que os usuários gerem novos templates de forma automatizada e inteligente.

## Para que serve?
Este projeto serve como uma ferramenta centralizada para designers, desenvolvedores e criadores de conteúdo que precisam criar, organizar e reutilizar templates (modelos) para seus projetos. 

Em vez de criar designs do zero todas as vezes, o usuário pode:
1. **Explorar** uma biblioteca de templates pré-existentes.
2. **Gerar** novos templates sob medida utilizando prompts de texto processados pela IA do Gemini.
3. **Gerenciar** seus templates favoritos, acompanhando métricas como número de downloads e curtidas.

## Principais Funcionalidades

* **Geração de Templates com IA:** Utiliza a API do Google Gemini para criar novos modelos de design baseados nas descrições fornecidas pelo usuário.
* **Dashboard Interativo:** Uma interface limpa e responsiva para visualizar templates, com opções de ordenação (mais populares, mais recentes).
* **Sistema de Autenticação:** Fluxo de Login e Registro para controle de acesso de usuários.
* **Gerenciamento de Favoritos:** Os usuários podem curtir ("dar like") nos templates que mais gostam, salvando-os em uma área de favoritos para acesso rápido.
* **Visualização de Detalhes:** Páginas dedicadas para cada template, mostrando estatísticas (downloads, curtidas) e permitindo a visualização aprofundada.
* **Persistência de Dados Local:** Utiliza `IndexedDB` e `localStorage` no navegador para garantir que os templates gerados, curtidas e preferências do usuário não sejam perdidos ao recarregar a página.

## Tecnologias Utilizadas

O projeto foi construído utilizando uma stack moderna de desenvolvimento frontend:
* **React 19:** Biblioteca principal para construção da interface de usuário.
* **TypeScript:** Adiciona tipagem estática ao JavaScript, garantindo um código mais seguro e fácil de manter.
* **Tailwind CSS:** Framework de CSS utilitário para estilização rápida, responsiva e consistente.
* **Vite:** Ferramenta de build e servidor de desenvolvimento extremamente rápido.
* **Google Gemini API (`@google/genai`):** Motor de inteligência artificial responsável por interpretar os pedidos e gerar os templates.
* **IndexedDB:** Banco de dados no navegador para armazenamento persistente dos templates gerados.
* **Lucide React:** Biblioteca de ícones modernos e minimalistas.

## Estrutura da Aplicação

A aplicação é dividida em visualizações principais (Views):
* **Dashboard (`/pages/Dashboard.tsx`):** A tela inicial após o login, onde a galeria de templates é exibida.
* **Generator (`/pages/Generator.tsx`):** A interface onde a mágica acontece; o usuário insere os parâmetros e a IA gera o template.
* **Template Details (`/pages/TemplateDetails.tsx`):** Tela de foco em um template específico.
* **Login / Register (`/pages/Login.tsx`, `/pages/Register.tsx`):** Telas de controle de acesso.

## Como funciona o fluxo básico?
1. O usuário acessa a plataforma e faz login.
2. No **Dashboard**, ele pode navegar pelos templates existentes ou ir para a aba de **Favoritos**.
3. Se precisar de algo novo, ele acessa o **Generator**, descreve o que precisa e a IA cria um novo template.
4. O novo template é salvo localmente no navegador (IndexedDB) e passa a aparecer no Dashboard.
5. O usuário pode curtir ou simular o download dos templates, atualizando as estatísticas em tempo real.
