# Resolve+

**Resolve+** é uma plataforma de gerenciamento de chamados e suporte técnico, projetada para otimizar a resolução de problemas em ambientes corporativos. Com uma interface intuitiva e funcionalidades avançadas, o Resolve+ permite que usuários e administradores acompanhem, gerenciem e resolvam chamados de forma eficiente.

---

## **Informações do Projeto**

- **Título**: Resolve+ - Sistema de Gerenciamento de Chamados  
- **Autores**: Equipe de Desenvolvimento Resolve+  
- **Repositório**: [GitHub](https://github.com/Brunn0B/Projeto-StartTup2-Resolve-)  
- **Dashboard**: `/public/img/imagen.png`

---

## **Instalação & Dependências**

### **Dependências Necessárias:**
- **Node.js** (v16 ou superior)  
- **NGROK** (para teste de servidor)  
- **Express** (para o backend)  
- **MongoDB** (banco de dados)  
- **nodemon** (para reinicialização automática do servidor)  
- **Bibliotecas Adicionais** (listadas no `package.json`)  

### **Passos para Instalação:**

1. Clone o repositório:
```bash
git clone https://github.com/Brunn0B/Projeto-StartTup2-Resolve-.git
cd Projeto-StartTup2-Resolve-
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o MongoDB:
- Certifique-se de ter o MongoDB instalado e rodando.
- Crie um banco de dados chamado `resolveplus`.

4. Configure a conexão no arquivo `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/resolveplus
```

5. Inicie o servidor:
```bash
npm start
```

6. Para testes com NGROK:
```bash
ngrok http 3000
```

---

## **Links e Ferramentas**

### **Links**
- [GitHub](https://github.com/Brunn0B/Projeto-StartTup2-Resolve-) - Repositório do Projeto  
- Trello - Quadro de Tarefas  

### **Ferramentas Utilizadas**
- **JavaScript** (linguagem principal)  
- **HTML** (estrutura do frontend)  
- **CSS** (estilização)  
- **Node.js** (backend)  
- **Express** (framework para APIs)  
- **MongoDB** (banco de dados NoSQL)  
- **NGROK** (teste de servidor)  
- **nodemon** (desenvolvimento)  

**Futuramente:** Integração com **Machine Learning (Python)** para Chat Bot.

---

## **Estrutura do Projeto**

### **Backend (Node.js + Express)**
#### Rotas:
- `/api/chamados`: Gerencia chamados (CRUD).  
- `/api/usuarios`: Gerencia usuários (autenticação e permissões).  
- `/api/relatorios`: Gera relatórios de chamados.  

#### Modelos:
- `Chamado.js`: Modelo de dados para chamados.  
- `Usuario.js`: Modelo de dados para usuários.  

#### Controladores:
- `chamadosController.js`: Lógica para manipulação de chamados.  
- `usuariosController.js`: Lógica para autenticação e gerenciamento de usuários.  

### **Frontend (HTML + CSS + JavaScript)**
#### Páginas:
- `index.html`: Página inicial com login e dashboard.  
- `chamados.html`: Listagem e criação de chamados.  
- `relatorios.html`: Visualização de relatórios.  

#### Funcionalidades:
- Autenticação de usuários.  
- Criação, edição e exclusão de chamados.  
- Visualização de relatórios em tempo real.  

### **Banco de Dados (MongoDB)**
#### Coleções Principais:

**Chamados:**
- `titulo` (String): Título do chamado.  
- `descricao` (String): Descrição detalhada.  
- `status` (String): Status atual (Aberto, Em andamento, Resolvido).  
- `dataCriacao` (Date): Data de criação.  
- `usuario` (ObjectId): Referência ao usuário criador.  

**Usuários:**
- `nome` (String): Nome do usuário.  
- `email` (String): E-mail único.  
- `senha` (String): Senha criptografada.  
- `permissao` (String): Nível de permissão (Admin, Usuário).  

---

## **Requisições (API)**

### **Endpoints:**

**Listar Chamados:**
- Método: GET  
- URL: `/api/chamados`

**Criar Chamado:**
- Método: POST  
- URL: `/api/chamados`  
- Corpo:
```json
{
  "titulo": "Novo Problema",
  "descricao": "Descrição do problema.",
  "status": "Aberto"
}
```

**Atualizar Chamado:**
- Método: PUT  
- URL: `/api/chamados/:id`  
- Corpo:
```json
{
  "status": "Resolvido"
}
```

**Deletar Chamado:**
- Método: DELETE  
- URL: `/api/chamados/:id`

---

## **Funcionalidades Futuras**
- Integração com Machine Learning:
  - Chat Bot para atendimento automático.
  - Análise preditiva de chamados.
- Relatórios Avançados:
  - Gráficos interativos.
  - Exportação em PDF/Excel.
- Autenticação Segura:
  - Implementação de OAuth2.
  - Autenticação de dois fatores (2FA).

---

## **Contribuição**

Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature:
```bash
git checkout -b minha-feature
```
3. Commit suas mudanças:
```bash
git commit -m "Adicionando nova funcionalidade"
```
4. Envie para o repositório remoto:
```bash
git push origin minha-feature
```
5. Abra um Pull Request.

---

## **Licença**
Este projeto está licenciado sob a **MIT License**. Consulte o arquivo `LICENSE` para mais detalhes.

---

## **Contato**
Para mais informações, entre em contato com a equipe de desenvolvimento:

- **Email**: brito.brunnob@gmail.com  
- **Site**: [Resolve+](https://resolvemais.netlify.app/public/index.html)

## **Professores Envolvidos**

- **Eliney Sabino**: *Orientador de StartTup*
- **Tulio**: *Cyber-Segurança*
- **Daniel Ohata**: *Inteligência Artificial/MachineLarning*
- **Cilene Renata**: *Desenvolvimento Web Back-end*
- **Fabricio Tonetto**: *Desenvolvimento App-Mobile*

![GIF do Projeto](/public/img/Apresentaçao%20Inicial.gif)

### Vídeo no completo no YouTube
[![Assista ao vídeo](https://www.youtube.com/watch?v=YtUuTxyDDyg)](https://www.youtube.com/watch?v=YtUuTxyDDyg)

## Hierarquia Do diretório
```
|—— .env
|—— index.html
|—— main.js
|—— manifest.json
|—— node_modules
|—— package-lock.json
|—— package.json
|—— public
|    |—— abrir-chamado.css
|    |—— abrir-chamado.html
|    |—— abrir-chamado.js
|    |—— Cartão.css
|    |—— Cartão.js
|    |—— Configuracoes.html
|    |—— EstiloGlobal.css
|    |—— EstiloGlobal.js
|    |—— Gerenciador de Chamdos.html
|    |—— img
|    |—— index.html
|    |—— Loguin.html
|    |—— PerfilUser.html
|    |—— service-worker.js
|    |—— SuporteUsuario.html
|    |—— TelaChamados.css
|    |—— TelaChamados.html
|    |—— TelaChamados.js
|    |—— Uploads
|—— server.js
|—— uploads
```