const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta'; 

app.use(cors());

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB Atlas'))
    .catch(err => console.error('Erro ao conectar ao MongoDB Atlas:', err));

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['colaborador', 'administrador'], required: true },
    settings: {
        theme: { type: String, default: 'light' },
        language: { type: String, default: 'pt-br' }
    }
});

const User = mongoose.model('User', userSchema);

const mensagemSchema = new mongoose.Schema({
    texto: { type: String, required: true },
    criador: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    data: { type: Date, default: Date.now }
});

const chamadoSchema = new mongoose.Schema({
    titulo: String,
    descricao: String,
    localizacao: String,
    foto: String,
    criador: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pendente', 'em_andamento', 'concluido'], default: 'pendente' },
    createdAt: { type: Date, default: Date.now }
});

const Chamado = mongoose.model('Chamado', chamadoSchema);

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido ou expirado.' });
        }

        req.user = user;
        next();
    });
}

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(400).json({ message: 'Falha no login. Verifique suas credenciais.' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login efetuado com sucesso!', token, user });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer login: ' + error.message });
    }
});

app.post('/salvar-configuracoes', authenticateToken, async (req, res) => {
    const { theme } = req.body;
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        user.settings = { theme };
        await user.save();

        res.status(200).json({ message: 'Configurações salvas com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao salvar configurações: ' + error.message });
    }
});
app.get('/obter-configuracoes', authenticateToken, async (req, res) => {
    const userId = req.user.userId; 

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ theme: user.settings?.theme || 'light' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar configurações: ' + error.message });
    }
});

app.post('/abrir-chamado', authenticateToken, async (req, res) => {
    const { titulo, descricao, localizacao, foto } = req.body;
    const criador = req.user.userId; 

    if (!criador) {
        return res.status(400).json({ message: 'ID do criador não fornecido.' });
    }

    const novoChamado = new Chamado({
        titulo,
        descricao,
        localizacao,
        foto: foto || null,
        criador
    });

    try {
        await novoChamado.save();
        res.status(201).json({ message: 'Chamado aberto com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao abrir o chamado: ' + error.message });
    }
});

app.post('/adicionar-mensagem/:chamadoId', authenticateToken, async (req, res) => {
    const { texto } = req.body;
    const criador = req.user.userId;
    const chamadoId = req.params.chamadoId;

    try {
        const chamado = await Chamado.findById(chamadoId);
        if (!chamado) {
            return res.status(404).json({ message: 'Chamado não encontrado.' });
        }

        const novaMensagem = { texto, criador };
        chamado.mensagens.push(novaMensagem);
        await chamado.save();

        res.status(201).json({ message: 'Mensagem adicionada com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar mensagem: ' + error.message });
    }
});

app.get('/buscar-chamados-com-mensagens', async (req, res) => {
    try {
        const chamados = await Chamado.find()
            .populate('criador', 'name')
            .populate('mensagens.criador', 'name');

        res.status(200).json(chamados);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar chamados com mensagens: ' + error.message });
    }
});

app.get('/buscar-chamados', async (req, res) => {
    try {
        const chamados = await Chamado.find().populate('criador', 'name');
        res.status(200).json(chamados);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar chamados: ' + error.message });
    }
});

app.post('/signup', async (req, res) => {
    const { email, name, cpf, password, userType } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { cpf }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email ou CPF já cadastrado!' });
        }

        const newUser = new User({ email, name, cpf, password, userType });
        await newUser.save();
        res.status(201).json({ message: 'Cadastro efetuado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cadastrar usuário: ' + error.message });
    }
});

app.post('/reset-password', async (req, res) => {
    const { cpf, newPassword } = req.body;

    try {
        const user = await User.findOne({ cpf });
        if (user) {
            user.password = newPassword;
            await user.save();
            res.status(200).json({ message: 'Senha redefinida com sucesso!' });
        } else {
            res.status(404).json({ message: 'CPF não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao redefinir senha: ' + error.message });
    }
});


app.put('/atualizar-status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const chamado = await Chamado.findByIdAndUpdate(id, { status }, { new: true });
        if (!chamado) {
            return res.status(404).json({ message: 'Chamado não encontrado.' });
        }
        res.status(200).json(chamado);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar status: ' + error.message });
    }
});

app.get('/contar-chamados', async (req, res) => {
    try {
        const totalChamados = await Chamado.countDocuments();
        const emAndamento = await Chamado.countDocuments({ status: 'em_andamento' });
        const pendentes = await Chamado.countDocuments({ status: 'pendente' });
        const concluidos = await Chamado.countDocuments({ status: 'concluido' }); 

        res.status(200).json({ totalChamados, emAndamento, pendentes, concluidos });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao contar chamados: ' + error.message });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erro interno do servidor.' });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});