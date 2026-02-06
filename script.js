document.addEventListener('DOMContentLoaded', function() {
    const editBtn = document.getElementById('edit-profile-btn');
    
    // Mapeamento dos campos que podem ser editados
    // id: ID do elemento HTML
    // type: tipo de input a ser criado (input simples ou textarea para textos longos)
    const fields = [
        { id: 'profile-name', type: 'input' },
        { id: 'profile-sex', type: 'input' },
        { id: 'profile-rel', type: 'input' },
        { id: 'profile-birth', type: 'input' },
        { id: 'profile-age', type: 'input', onlyNumbers: true },
        { id: 'profile-interests', type: 'input' },
        { id: 'profile-bio', type: 'textarea' },
        { id: 'profile-children', type: 'input' },
        { id: 'profile-ethnicity', type: 'input' },
        { id: 'profile-humor', type: 'input' },
        { id: 'profile-sexual', type: 'input' },
        { id: 'profile-style', type: 'input' },
        { id: 'profile-smoke', type: 'input' },
        { id: 'profile-drink', type: 'input' },
        { id: 'profile-pets', type: 'input' },
        { id: 'profile-live', type: 'input' },
        { id: 'profile-hometown', type: 'input' },
        { id: 'profile-web', type: 'input' },
        { id: 'profile-passions', type: 'input' },
        { id: 'profile-sports', type: 'input' },
        { id: 'profile-activities', type: 'input' },
        { id: 'profile-country', type: 'input' }
    ];

    // Carregar informações salvas no LocalStorage ao abrir a página
    fields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) {
            const savedValue = localStorage.getItem(field.id);
            el.textContent = savedValue || '';
        }
    });

    // Função para sincronizar dados da lateral com o card principal
    function updateSidebar() {
        // Tenta pegar do elemento principal (se estiver na home) ou do storage
        const mainName = document.getElementById('profile-name');
        const sidebarName = document.getElementById('sidebar-name');
        const storedName = localStorage.getItem('profile-name') || 'Malu';
        const nameToUse = mainName ? mainName.textContent : storedName;

        if (sidebarName) sidebarName.textContent = nameToUse;

        // Atualiza o email no header
        const headerEmail = document.querySelector('.user-info span');
        if (headerEmail) {
            // Remove acentos e substitui espaços por '123'
            const cleanName = nameToUse.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            const emailUser = cleanName.trim().split(/\s+/).join('123').toLowerCase();
            const fullEmail = `${emailUser}@orkut.com`;
            headerEmail.textContent = fullEmail;
            headerEmail.title = fullEmail;
        }

        const mainSex = document.getElementById('profile-sex');
        const sidebarSex = document.getElementById('sidebar-sex');
        if (mainSex && sidebarSex) sidebarSex.textContent = mainSex.textContent || 'sexo';

        const mainRel = document.getElementById('profile-rel');
        const sidebarRel = document.getElementById('sidebar-rel');
        if (mainRel && sidebarRel) sidebarRel.textContent = mainRel.textContent || 'relacionamento';

        const mainCity = document.getElementById('profile-hometown');
        const mainCountry = document.getElementById('profile-country');
        const sidebarLoc = document.getElementById('sidebar-loc');
        if (sidebarLoc) sidebarLoc.textContent = `${mainCity ? mainCity.textContent : ''}, ${mainCountry ? mainCountry.textContent : ''}`;
    }
    updateSidebar();

    if (editBtn) {
        editBtn.addEventListener('click', function() {
            // Verifica se estamos no modo de edição checando um atributo customizado
            const isEditing = editBtn.getAttribute('data-editing') === 'true';

            if (isEditing) {
                // Validação do Nome
                const nameEl = document.getElementById('profile-name');
                const nameInput = nameEl ? nameEl.querySelector('.edit-input') : null;

                if (nameInput) {
                    const nameVal = nameInput.value.trim();
                    
                    // 1. Regex: Permite apenas letras (incluindo acentos) e espaços
                    // \u00C0-\u00FF cobre caracteres acentuados comuns do português
                    const namePattern = /^[a-zA-Z\u00C0-\u00FF\s]+$/;
                    
                    if (!namePattern.test(nameVal)) {
                        alert('O nome deve conter apenas letras e espaços.');
                        nameInput.focus();
                        return; // Impede o salvamento
                    }

                    // 2. Validação do tamanho do email gerado
                    const cleanName = nameVal.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                    const emailUser = cleanName.split(/\s+/).join('123').toLowerCase();

                }

                // Validação da Data de Nascimento
                const birthEl = document.getElementById('profile-birth');
                const birthInput = birthEl ? birthEl.querySelector('.edit-input') : null;

                if (birthInput && birthInput.value.trim() !== '') {
                    const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
                    const match = birthInput.value.match(datePattern);
                    let isValid = false;

                    if (match) {
                        const d = parseInt(match[1], 10);
                        const m = parseInt(match[2], 10);
                        const y = parseInt(match[3], 10);
                        const date = new Date(y, m - 1, d);
                        if (date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d) {
                            isValid = true;
                        }
                    }

                    if (!isValid) {
                        alert('Data de nascimento inválida! Por favor, use o formato DD/MM/AAAA.');
                        birthInput.focus();
                        return; // Impede o salvamento se a data for inválida
                    }
                }

                // --- AÇÃO DE SALVAR ---
                
                fields.forEach(field => {
                    const el = document.getElementById(field.id);
                    const input = el.querySelector('.edit-input');
                    
                    // Se encontrar o input, pega o valor e coloca de volta como texto
                    if (input) {
                        el.textContent = input.value;
                        localStorage.setItem(field.id, input.value);
                    }
                });
                
                updateSidebar();

                // Restaura o botão
                editBtn.textContent = 'Editar Perfil';
                editBtn.setAttribute('data-editing', 'false');

            } else {
                // --- AÇÃO DE EDITAR ---

                fields.forEach(field => {
                    const el = document.getElementById(field.id);
                    const text = el.textContent;
                    
                    let inputHtml = '';
                    if (field.type === 'textarea') {
                        // Usa textarea para a bio, pois pode ser grande
                        inputHtml = `<textarea class="edit-input" rows="4" placeholder="escreva aqui...">${text}</textarea>`;
                    } else {
                        // Usa input normal para os outros campos
                        const onInputAttr = field.onlyNumbers ? 'oninput="this.value = this.value.replace(/[^0-9]/g, \'\')"' : '';
                        inputHtml = `<input type="text" class="edit-input" value="${text}" placeholder="escreva aqui..." ${onInputAttr}>`;
                    }
                    
                    el.innerHTML = inputHtml;
                });

                // Muda o botão para "Salvar"
                editBtn.textContent = 'Salvar';
                editBtn.setAttribute('data-editing', 'true');
            }
        });
    }

    // Funcionalidade para trocar a foto de perfil
    const profileImage = document.getElementById('profile-image');
    const profileUpload = document.getElementById('profile-upload');

    if (profileImage && profileUpload) {
        // Carregar imagem salva
        const savedImageUrl = localStorage.getItem('profile-image-url');
        if (savedImageUrl) {
            profileImage.src = savedImageUrl;
        }
        
        // Sincronizar imagem da sidebar nas outras páginas
        const sidebarImage = document.getElementById('profile-image-sidebar');
        if (sidebarImage && savedImageUrl) {
            sidebarImage.src = savedImageUrl;
        }

        profileImage.addEventListener('click', function() {
            profileUpload.click();
        });

        profileUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const imageUrl = event.target.result;
                    profileImage.src = imageUrl;
                    try {
                        localStorage.setItem('profile-image-url', imageUrl);
                    } catch (error) {
                        console.error('Imagem muito grande para o LocalStorage', error);
                        alert('Imagem carregada! (Nota: Imagens muito grandes podem não salvar ao recarregar a página neste protótipo).');
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Funcionalidade para expandir lista de amigos
    // Dados fixos para não repetir pessoas
    const extraFriendsData = [
        { name: 'Lucas', img: 'https://picsum.photos/60?random=4' },
        { name: 'Fernanda', img: 'https://picsum.photos/60?random=5' },
        { name: 'Mariana', img: 'https://picsum.photos/60?random=6' },
        { name: 'Gabriel', img: 'https://picsum.photos/60?random=7' },
        { name: 'Juliana', img: 'https://picsum.photos/60?random=8' },
        { name: 'Roberto', img: 'https://picsum.photos/60?random=9' }
    ];
    let friendsExpanded = false;
    
    // Atualizar contador de amigos com o total real (HTML inicial + Extras)
    const friendsCountEl = document.getElementById('friends-count');
    if (friendsCountEl) {
        const initialFriendsCount = document.querySelectorAll('.friend-item').length;
        const totalFriends = initialFriendsCount + extraFriendsData.length;
        friendsCountEl.textContent = `amigos (${totalFriends})`;
    }

    const viewAllFriendsBtn = document.getElementById('view-all-friends');
    if (viewAllFriendsBtn) {
        viewAllFriendsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const friendsGrid = document.querySelector('.friends-grid');
            
            if (!friendsExpanded) {
                // Adicionar amigos
                extraFriendsData.forEach(friend => {
                    const friendHtml = `<div class="friend-item extra-item"><img src="${friend.img}"><span>${friend.name}</span></div>`;
                    friendsGrid.insertAdjacentHTML('beforeend', friendHtml);
                });
                viewAllFriendsBtn.textContent = 'voltar';
                friendsExpanded = true;
            } else {
                // Remover amigos adicionados
                const extras = friendsGrid.querySelectorAll('.extra-item');
                extras.forEach(item => item.remove());
                viewAllFriendsBtn.textContent = 'ver todos';
                friendsExpanded = false;
            }
            // Não atualizamos o texto do contador aqui para manter o número total visível
        });
    }

    // Funcionalidade para expandir comunidades
    let allCommunities = [];
    let commExpanded = false;
    const commList = document.querySelector('.comm-list');
    const viewAllCommBtn = document.getElementById('view-all-comm');

    // Carregar comunidades do JSON
    fetch('communities.json')
        .then(response => response.json())
        .then(data => {
            allCommunities = data;
            
            // Atualiza o contador com o total do JSON
            const commCountEl = document.getElementById('comm-count');
            if (commCountEl) {
                commCountEl.textContent = `comunidades (${allCommunities.length})`;
            }
            
            // Renderiza as 9 primeiras (simulando a visualização inicial)
            renderCommunities(allCommunities.slice(0, 9));

            // Lógica para página de detalhes da comunidade
            const commNameMain = document.getElementById('comm-name-main');
            if (commNameMain) {
                const urlParams = new URLSearchParams(window.location.search);
                const commId = parseInt(urlParams.get('id'));
                const community = allCommunities.find(c => c.id === commId);
                
                if (community) {
                    commNameMain.textContent = community.name;
                    document.title = `orkut - ${community.name}`;
                    const commImage = document.getElementById('comm-image');
                    if (commImage) commImage.src = community.img;
                    const commNameSidebar = document.getElementById('comm-name-sidebar');
                    if (commNameSidebar) commNameSidebar.textContent = community.name;

                    // Botão de Participar/Sair
                    const joinBtn = document.getElementById('join-comm-btn');
                    if (joinBtn) {
                        const storageKey = `joined_comm_${commId}`;
                        const isJoined = localStorage.getItem(storageKey) === 'true';
                        joinBtn.textContent = isJoined ? 'sair' : 'participar';

                        joinBtn.addEventListener('click', function() {
                            if (joinBtn.textContent === 'participar') {
                                joinBtn.textContent = 'sair';
                                localStorage.setItem(storageKey, 'true');
                            } else {
                                joinBtn.textContent = 'participar';
                                localStorage.setItem(storageKey, 'false');
                            }
                        });
                    }
                }
            }
        })
        .catch(err => console.error('Erro ao carregar comunidades:', err));

    function renderCommunities(items) {
        if (!commList) return;
        commList.innerHTML = ''; // Limpa a lista atual
        
        items.forEach(comm => {
            // Cria o item com link para a página da comunidade
            const commHtml = `
                <div class="comm-item">
                    <a href="community.html?id=${comm.id}" style="text-decoration: none;">
                        <img src="${comm.img}" alt="${comm.name}">
                        <span>${comm.name}</span>
                    </a>
                </div>`;
            commList.insertAdjacentHTML('beforeend', commHtml);
        });
    }

    if (viewAllCommBtn && commList) {
        viewAllCommBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (!commExpanded) {
                // Mostrar todas
                renderCommunities(allCommunities);
                viewAllCommBtn.textContent = 'voltar';
                commExpanded = true;
            } else {
                // Mostrar apenas as 9 primeiras
                renderCommunities(allCommunities.slice(0, 9));
                viewAllCommBtn.textContent = 'ver todas';
                commExpanded = false;
            }
        });
    }

    setupManageButton('manage-friends', '.friends-grid', '.friend-item', 'friends');
    setupManageButton('manage-comm', '.comm-list', '.comm-item', 'comm');

    function setupManageButton(btnId, containerSelector, itemSelector, type) {
        const btn = document.getElementById(btnId);
        const container = document.querySelector(containerSelector);

        if (btn && container) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                container.classList.toggle('managing');
            });

            container.addEventListener('click', function(e) {
                if (container.classList.contains('managing')) {
                    const item = e.target.closest(itemSelector);
                    if (item) {
                        item.remove();
                        // Atualiza contagem visualmente apenas subtraindo 1
                        const countId = type === 'friends' ? 'friends-count' : 'comm-count';
                        const countEl = document.getElementById(countId);
                        let currentText = countEl.textContent;
                        let currentNum = parseInt(currentText.match(/\d+/)[0]);
                        countEl.textContent = currentText.replace(currentNum, currentNum - 1);
                    }
                }
            });
        }
    }

    // Lógica para as avaliações (Confiável, Legal, Sexy)
    const ratingBoxes = document.querySelectorAll('.rating-box');
    ratingBoxes.forEach(box => {
        const icons = box.querySelectorAll('.rate-icon');
        icons.forEach((icon, index) => {
            icon.addEventListener('click', () => {
                // Remove ativo de todos
                icons.forEach(i => i.classList.remove('active'));
                // Adiciona ativo até o índice clicado
                for (let i = 0; i <= index; i++) {
                    icons[i].classList.add('active');
                }
            });
        });
    });

    // Lógica para as abas (Social / Profissional)
    const tabSocial = document.getElementById('tab-social');
    const tabProf = document.getElementById('tab-prof');

    if (tabSocial && tabProf) {
        function switchTab(activeTab, inactiveTab) {
            activeTab.classList.add('active');
            inactiveTab.classList.remove('active');
        }

        tabSocial.addEventListener('click', () => switchTab(tabSocial, tabProf));
        tabProf.addEventListener('click', () => switchTab(tabProf, tabSocial));
    }

    // --- MODAL DE RESPOSTA ---
    const modal = document.getElementById('reply-modal');
    const closeModal = document.querySelector('.close-modal');
    const replyAuthorName = document.getElementById('reply-author-name');
    const replyMessage = document.getElementById('reply-message');
    const sendReplyBtn = document.getElementById('send-reply-btn');
    let replyContext = {}; // Armazena o contexto da resposta (tipo e id)

    function openReplyModal(author, type, id) {
        replyContext = { type, id };
        if (modal) {
            if (replyAuthorName) replyAuthorName.textContent = author;
            if (replyMessage) replyMessage.value = '';
            modal.style.display = 'block';
            if (replyMessage) replyMessage.focus();
        } else {
            // Fallback caso o modal não exista na página
            alert(`Responder para ${author}`);
        }
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    if (sendReplyBtn) {
        sendReplyBtn.addEventListener('click', () => {
            if (replyMessage && replyMessage.value.trim() !== '') {
                const replyText = replyMessage.value;
                const replyObj = {
                    author: 'Malu', // Usuário logado
                    text: replyText,
                    date: new Date().toLocaleDateString('pt-BR')
                };

                if (replyContext.type === 'scrap') {
                    const item = scraps.find(s => s.id == replyContext.id);
                    if (item) {
                        if (!item.replies) item.replies = [];
                        item.replies.push(replyObj);
                        saveScraps();
                        renderScraps('scraps-preview', 2);
                        renderScraps('scraps-list-full');
                    }
                } else if (replyContext.type === 'testimonial') {
                    const item = testimonials.find(t => t.id == replyContext.id);
                    if (item) {
                        if (!item.replies) item.replies = [];
                        item.replies.push(replyObj);
                        saveTestimonials();
                        renderTestimonials('testimonials-preview', 2);
                        renderTestimonials('testimonials-list-full');
                    }
                }
                modal.style.display = 'none';
            }
        });
    }

    // --- SISTEMA DE RECADOS (SCRAPS) ---
    const defaultScraps = [
        { id: 1, author: 'João', text: 'Passando para deixar um scrap e ganhar um de volta! haha', date: '20/07/2006' },
        { id: 2, author: 'Ana', text: 'Adorei as fotos do fim de semana!', date: '19/07/2006' },
        { id: 3, author: 'Carlos', text: 'E aí, sumida! Quando vamos marcar aquele churrasco?', date: '18/07/2006' },
        { id: 4, author: 'Julia', text: 'Feliz aniversário atrasado! Tudo de bom!', date: '17/07/2006' },
        { id: 5, author: 'Pedro', text: 'Me aceita na comunidade lá.', date: '16/07/2006' }
    ];

    // Carregar ou iniciar
    let scraps = JSON.parse(localStorage.getItem('orkut_scraps')) || defaultScraps;

    function saveScraps() {
        localStorage.setItem('orkut_scraps', JSON.stringify(scraps));
    }

    function renderScraps(containerId, limit = null) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        const list = limit ? scraps.slice(0, limit) : scraps;

        if (list.length === 0) {
            container.innerHTML = '<p style="padding:10px; color:#666;">Nenhum recado ainda.</p>';
            return;
        }

        list.forEach(scrap => {
            let repliesHtml = '';
            if (scrap.replies && scrap.replies.length > 0) {
                repliesHtml = '<div class="item-replies">';
                scrap.replies.forEach(r => {
                    repliesHtml += `<div class="reply-item"><strong>${r.author}:</strong> ${r.text}</div>`;
                });
                repliesHtml += '</div>';
            }

            const html = `
                <div class="scrap-item">
                    <div style="display:flex; justify-content:space-between;">
                        <strong>${scrap.author}:</strong>
                        <span style="font-size:9px; color:#999;">${scrap.date || ''}</span>
                    </div>
                    <p style="margin-top:4px;">${scrap.text}</p>
                    ${repliesHtml}
                    ${!limit ? `<div style="text-align:right; margin-top:5px;"><button class="orkut-btn reply-btn" data-author="${scrap.author}" data-id="${scrap.id}">responder</button></div>` : ''}
                </div>
            `;
            container.insertAdjacentHTML('beforeend', html);
        });

        // Evento para botões de responder
        if (!limit) {
            container.querySelectorAll('.reply-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const author = e.target.getAttribute('data-author');
                    const id = e.target.getAttribute('data-id');
                    openReplyModal(author, 'scrap', id);
                });
            });
        }
    }

    // Renderizar nas páginas
    renderScraps('scraps-preview', 2); // Na home
    renderScraps('scraps-list-full');  // Na página de recados

    // --- SISTEMA DE DEPOIMENTOS ---
    const defaultTestimonials = [
        { id: 1, author: 'Fernanda', text: 'Amiga, você é incrível! Saudades das nossas conversas intermináveis.' },
        { id: 2, author: 'Roberto', text: 'Profissional exemplar e uma pessoa de coração gigante.' },
        { id: 3, author: 'Lucas', text: 'Conheço há anos, super gente boa. Podem confiar!' },
        { id: 4, author: 'Mariana', text: 'Minha parceira de todas as horas. Amo muito!' }
    ];

    let testimonials = JSON.parse(localStorage.getItem('orkut_testimonials')) || defaultTestimonials;

    function saveTestimonials() {
        localStorage.setItem('orkut_testimonials', JSON.stringify(testimonials));
    }

    function renderTestimonials(containerId, limit = null) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        const list = limit ? testimonials.slice(0, limit) : testimonials;

        list.forEach(testi => {
            let repliesHtml = '';
            if (testi.replies && testi.replies.length > 0) {
                repliesHtml = '<div class="item-replies">';
                testi.replies.forEach(r => {
                    repliesHtml += `<div class="reply-item"><strong>${r.author}:</strong> ${r.text}</div>`;
                });
                repliesHtml += '</div>';
            }

            const html = `
                <div class="testimonial-item">
                    <strong>${testi.author}:</strong> "${testi.text}"
                    ${repliesHtml}
                    ${!limit ? `<div style="text-align:right; margin-top:5px;"><button class="orkut-btn reply-testi-btn" data-author="${testi.author}" data-id="${testi.id}">responder</button></div>` : ''}
                </div>`;
            container.insertAdjacentHTML('beforeend', html);
        });

        if (!limit) {
            container.querySelectorAll('.reply-testi-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const author = e.target.getAttribute('data-author');
                    const id = e.target.getAttribute('data-id');
                    openReplyModal(author, 'testimonial', id);
                });
            });
        }
    }

    renderTestimonials('testimonials-preview', 2);
    renderTestimonials('testimonials-list-full');
});