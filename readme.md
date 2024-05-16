# Desafio Java + Angular + OpenLayers

Este é um projeto que consiste em uma aplicação full-stack desenvolvida com Java Spring Boot para o backend e Angular para o frontend.

## Descrição

O objetivo deste projeto é criar uma aplicação de exemplo que demonstre a integração entre o backend Java Spring Boot e o frontend Angular. O projeto inclui um CRUD básico de usuários, onde os usuários podem ser criados, lidos, atualizados e deletados (CRUD).

## Tecnologias Utilizadas

- **Backend:**
  - Java 21
  - Spring Boot 3
  - Spring Data JPA para acesso ao banco de dados
  - Banco de dados PostgreSQL
  - Maven para gerenciamento de dependências
  
- **Frontend:**
  - Angular
  - Angular CLI para criação e gerenciamento de projetos Angular
  - TypeScript para programação frontend
  - HTML/SCSS para marcação e estilização
  - OpenLayers (Georreferenciamento)

## Instalação do Projeto

Fazer o clone do projeto em `https://github.com/samuelnunex/caduser-desafio.git`. 
Abrir o projeto pela IDE Intellij e aguardar as dependencias do maven serem baixadas para a maquina.


## Configuração no Projeto

- Usuário db padrão: postgres
- Senha db padrao: postgres

- Porta backend: 8086

- **Acesso Endpoint:**
Acesse o endereço:[Endpoint](http://localhost:8086/api/)

- **Frontend:**
- http://localhost:4200/
  

## Funcionalidades

- **Cadastro de Usuário:** Permite criar novos usuários fornecendo nome, e-mail e senha.
- **Listagem de Usuários:** Exibe uma lista de todos os usuários cadastrados.
- **Atualização de Usuário:** Permite atualizar as informações de um usuário existente.
- **Exclusão de Usuário:** Permite excluir um usuário da lista.

Desenvolvido por Samuel Nunes, para o desafio no processo seletivo da First Decision.

