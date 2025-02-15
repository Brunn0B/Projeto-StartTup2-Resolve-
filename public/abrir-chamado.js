document.addEventListener('DOMContentLoaded', function () {
    // Alternar entre temas claro e escuro
    var modeSwitch = document.querySelector('.mode-switch');
    modeSwitch.addEventListener('click', function () {
        document.documentElement.classList.toggle('dark');
        modeSwitch.classList.toggle('active');
    });

    // Alternar entre visualização de lista e grade (não aplicável nesta tela, mas mantido para consistência)
    var listView = document.querySelector('.list-view');
    var gridView = document.querySelector('.grid-view');
    var projectsList = document.querySelector('.project-boxes');

    if (listView && gridView && projectsList) {
        listView.addEventListener('click', function () {
            gridView.classList.remove('active');
            listView.classList.add('active');
            projectsList.classList.remove('jsGridView');
            projectsList.classList.add('jsListView');
        });

        gridView.addEventListener('click', function () {
            gridView.classList.add('active');
            listView.classList.remove('active');
            projectsList.classList.remove('jsListView');
            projectsList.classList.add('jsGridView');
        });
    }

    // Abrir e fechar a seção de mensagens (não aplicável nesta tela, mas mantido para consistência)
    var messagesBtn = document.querySelector('.messages-btn');
    var messagesClose = document.querySelector('.messages-close');
    var messagesSection = document.querySelector('.messages-section');

    if (messagesBtn && messagesClose && messagesSection) {
        messagesBtn.addEventListener('click', function () {
            messagesSection.classList.add('show');
        });

        messagesClose.addEventListener('click', function () {
            messagesSection.classList.remove('show');
        });
    }

    // Captura de foto
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const fotoCapturada = document.getElementById('fotoCapturada');
    const capturarFotoBtn = document.getElementById('capturarFoto');
    const anexoInput = document.getElementById('anexo');

    // Inicia a câmera
    async function iniciarCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
        } catch (err) {
            console.error('Erro ao acessar a câmera:', err);
            alert('Não foi possível acessar a câmera. Verifique as permissões.');
        }
    }

    // Captura a foto
    capturarFotoBtn.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        // Converte a imagem para base64
        const imagemBase64 = canvas.toDataURL('image/png');
        fotoCapturada.src = imagemBase64;
        fotoCapturada.style.display = 'block';

        // Converte base64 para Blob e define como arquivo no input de anexo
        const blob = dataURItoBlob(imagemBase64);
        const file = new File([blob], 'foto_capturada.png', { type: 'image/png' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        anexoInput.files = dataTransfer.files;
    });

    // Função para converter base64 para Blob
    function dataURItoBlob(dataURI) {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    // Envio do formulário
    document.getElementById('chamadoForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const titulo = document.getElementById('titulo').value;
        const descricao = document.getElementById('descricao').value;
        const localizacao = document.getElementById('localizacao').value;
        const anexo = document.getElementById('anexo').files[0];

        if (!titulo || !descricao || !localizacao) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const chamado = {
            titulo,
            descricao,
            localizacao,
            anexo: anexo ? anexo.name : 'Nenhum arquivo anexado'
        };

        console.log('Chamado criado:', chamado);
        alert('Chamado aberto com sucesso!');
        document.getElementById('chamadoForm').reset();
        fotoCapturada.style.display = 'none'; // Oculta a foto capturada
    });

    // Inicia a câmera ao carregar a página
    iniciarCamera();
});