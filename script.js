document.addEventListener('DOMContentLoaded', function() {
    const $ = (id) => document.getElementById(id);
    const qs = (sel) => document.querySelector(sel);
    const setTxt = (id, txt) => { const el = $(id); if(el) el.textContent = txt; };
    const storage = {
        get: (k, d) => sessionStorage.getItem(k) || d,
        set: (k, v) => sessionStorage.setItem(k, v),
        getJson: (k, d) => JSON.parse(sessionStorage.getItem(k)) || d,
        setJson: (k, v) => sessionStorage.setItem(k, JSON.stringify(v))
    };

    const editBtn = $('edit-profile-btn');
    
    const statusInput = qs('.status-box input');
    if (statusInput) {
        const statusSpan = document.createElement('span');
        Object.assign(statusSpan.style, { flexGrow: '1', padding: '3px', minHeight: '20px', border: '1px solid transparent' });
        statusSpan.id = 'profile-status';
        const placeholderText = statusInput.getAttribute('placeholder') || "Qual é a frase do seu perfil?";
        let currentStatus = storage.get('profile-status');
        
        if (!currentStatus) {
            statusSpan.textContent = placeholderText;
            statusSpan.classList.add('placeholder-text');
            Object.assign(statusSpan.style, { color: '#999', borderColor: '#ccc' });
        } else {
            statusSpan.textContent = currentStatus;
        }
        statusInput.parentNode.replaceChild(statusSpan, statusInput);
    }

    const fields = [
        { id: 'profile-status', type: 'input' },
        { id: 'profile-bio', type: 'textarea' },
        { id: 'profile-name', type: 'input' },
        { id: 'profile-sex', type: 'select', options: ['Masculino', 'Feminino', 'Outro'] },
        { id: 'profile-rel', type: 'select', options: ['Solteiro(a)', 'Casado(a)', 'Namorando', 'Enrolado(a)', 'Divorciado(a)', 'Viúvo(a)'] },
        { id: 'profile-birth', type: 'date' },
        { id: 'profile-age', type: 'input', onlyNumbers: true },
        { id: 'profile-interests', type: 'select', options: ['Música', 'Esportes', 'Filmes', 'Tecnologia', 'Moda', 'Viagens', 'Games'] },
        { id: 'profile-children', type: 'select', options: ['Não tenho', 'Tenho', 'Quero ter', 'Não quero ter'] },
        { id: 'profile-ethnicity', type: 'select', options: ['Branca', 'Negra', 'Parda', 'Amarela', 'Indígena', 'Outra'] },
        { id: 'profile-humor', type: 'select', options: ['Bem humorado', 'Sério', 'Sarcástico', 'Tímido', 'Extrovertido'] },
        { id: 'profile-sexual', type: 'select', options: ['Heterossexual', 'Homossexual', 'Bissexual', 'Assexual', 'Outro'] },
        { id: 'profile-style', type: 'select', options: ['Casual', 'Social', 'Alternativo', 'Esportivo', 'Geek'] },
        { id: 'profile-smoke', type: 'select', options: ['Não fumo', 'Fumo socialmente', 'Fumo regularmente'] },
        { id: 'profile-drink', type: 'select', options: ['Não bebo', 'Bebo socialmente', 'Bebo regularmente'] },
        { id: 'profile-pets', type: 'select', options: ['Gosto de animais', 'Não gosto de animais', 'Tenho animais'] },
        { id: 'profile-live', type: 'input' },
        { id: 'profile-hometown', type: 'input' },
        { id: 'profile-web', type: 'input' },
        { id: 'profile-passions', type: 'select', options: ['Viajar', 'Comer', 'Dormir', 'Estudar', 'Trabalhar', 'Arte'] },
        { id: 'profile-sports', type: 'select', options: ['Futebol', 'Vôlei', 'Basquete', 'Natação', 'Corrida', 'Nenhum'] },
        { id: 'profile-activities', type: 'select', options: ['Ler', 'Assistir TV', 'Sair com amigos', 'Jogar', 'Cozinhar'] },
        { id: 'profile-country', type: 'input' }
    ];

    const bioField = $('profile-bio');
    if (bioField) {
        const bioRow = bioField.closest('.data-row');
        if (bioRow && bioRow.parentElement) bioRow.parentElement.prepend(bioRow);
    }

    fields.forEach(field => {
        const el = $(field.id);
        if (el) {
            const savedValue = storage.get(field.id);
            el.textContent = savedValue ? savedValue : (field.id === 'profile-name' ? 'usuario' : '');
        }
    });

    function updateSidebar() {
        const nameToUse = $('profile-name')?.textContent || storage.get('profile-name', 'usuario');
        setTxt('sidebar-name', nameToUse);

        const headerEmail = qs('.user-info span');
        if (headerEmail) {
            const cleanName = nameToUse.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            const emailUser = cleanName.trim().split(/\s+/).join('123').toLowerCase();
            headerEmail.textContent = headerEmail.title = `${emailUser}@orkut.com`;
        }

        setTxt('sidebar-sex', $('profile-sex')?.textContent || 'sexo');
        setTxt('sidebar-rel', $('profile-rel')?.textContent || 'relacionamento');
        
        const loc = `${$('profile-hometown')?.textContent || ''}, ${$('profile-country')?.textContent || ''}`;
        setTxt('sidebar-loc', loc === ', ' ? '' : loc);
    }
    updateSidebar();

    const luckPhrases = [
        "A sorte favorece os audazes.",
        "Hoje é um bom dia para começar algo novo.",
        "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
        "Acredite em milagres, mas não dependa deles.",
        "A vida trará coisas boas se tiveres paciência.",
        "Demonstre amor e alegria em todas as oportunidades.",
        "Não compense na ira o que lhe falta na razão.",
        "Defeitos e virtudes são apenas dois lados da mesma moeda.",
        "A maior de todas as torres começa no solo.",
        "Não há que ser forte. Há que ser flexível."
    ];

    const luckEl = $('luck-of-day');
    if (luckEl) {
        const randomPhrase = luckPhrases[Math.floor(Math.random() * luckPhrases.length)];
        luckEl.innerHTML = `<span style="color: #cc0000; font-weight: bold;">Sorte do dia:</span> ${randomPhrase}`;
    }

    ['stat-photos', 'stat-videos', 'stat-fans'].forEach(id => {
        const el = $(id);
        if (el) {
            let val = storage.get(id);
            if (!val) {
                val = Math.floor(Math.random() * 250);
                storage.set(id, val);
            }
            el.textContent = val;
        }
    });

    if (editBtn) {
        editBtn.addEventListener('click', function() {
            const isEditing = editBtn.getAttribute('data-editing') === 'true';

            if (isEditing) {
                const nameEl = $('profile-name');
                const nameInput = nameEl ? nameEl.querySelector('.edit-input') : null;

                if (nameInput) {
                    const nameVal = nameInput.value.trim();
                    
                    const namePattern = /^[a-zA-Z\u00C0-\u00FF\s]+$/;
                    
                    if (!namePattern.test(nameVal)) {
                        alert('O nome deve conter apenas letras e espaços.');
                        nameInput.focus();
                        return;
                    }
                }

                const countryEl = $('profile-country');
                const countryInput = countryEl ? countryEl.querySelector('.edit-input') : null;

                if (countryInput && countryInput.value.trim() === '') {
                    alert('O campo "país" não pode ficar vazio!');
                    countryInput.focus();
                    return;
                }

                
                fields.forEach(field => {
                    const el = $(field.id);
                    const input = el.querySelector('.edit-input');
                    
                    if (input) {
                        let val = input.value;
                        
                        if (field.type === 'date' && val) {
                            const parts = val.split('-');
                            if (parts.length === 3) {
                                val = `${parts[2]}/${parts[1]}/${parts[0]}`;
                            }
                        }

                        if (field.id === 'profile-status') {
                            if (!val) {
                                el.textContent = "Qual é a frase do seu perfil?";
                                el.classList.add('placeholder-text');
                                Object.assign(el.style, { color: '#999', borderColor: '#ccc' });
                            } else {
                                el.textContent = val;
                                el.classList.remove('placeholder-text');
                                Object.assign(el.style, { color: '', borderColor: 'transparent' });
                            }
                        } else el.textContent = val;
                        
                        storage.set(field.id, val);
                    }
                });
                
                updateSidebar();

                editBtn.textContent = 'Editar Perfil';
                editBtn.setAttribute('data-editing', 'false');

            } else {

                fields.forEach(field => {
                    const el = $(field.id);
                    let text = el.textContent;
                    
                    if (field.id === 'profile-status' && el.classList.contains('placeholder-text')) {
                        text = '';
                    }

                    if (field.id === 'profile-status') {
                        el.style.borderColor = 'transparent';
                    }
                    
                    let inputHtml = '';
                    if (field.type === 'textarea') {
                        inputHtml = `<textarea class="edit-input" rows="4" placeholder="escreva aqui...">${text}</textarea>`;
                    } else if (field.type === 'select') {
                        const optionsHtml = field.options.map(opt => 
                            `<option value="${opt}" ${text === opt ? 'selected' : ''}>${opt}</option>`
                        ).join('');
                        inputHtml = `<select class="edit-input">${optionsHtml}</select>`;
                    } else if (field.type === 'date') {
                        let dateVal = '';
                        if (text && text.includes('/')) {
                            const parts = text.split('/');
                            if (parts.length === 3) dateVal = `${parts[2]}-${parts[1]}-${parts[0]}`;
                        }
                        inputHtml = `<input type="date" class="edit-input" value="${dateVal}">`;
                    } else {
                        const onInputAttr = field.onlyNumbers ? 'oninput="this.value = this.value.replace(/[^0-9]/g, \'\')"' : '';
                        let ph = "escreva aqui...";
                        let extraAttrs = '';

                        if (field.id === 'profile-status') {
                            ph = "Qual é a frase do seu perfil?";
                            extraAttrs = 'maxlength="140"';
                        }
                        inputHtml = `<input type="text" class="edit-input" value="${text}" placeholder="${ph}" ${onInputAttr} ${extraAttrs}>`;
                    }
                    
                    el.innerHTML = inputHtml;
                });

                editBtn.textContent = 'Salvar';
                editBtn.setAttribute('data-editing', 'true');
            }
        });
    }

    const profileImage = $('profile-image');
    const profileUpload = $('profile-upload');
    
    const savedImageUrl = storage.get('profile-image-url');
    if (savedImageUrl) {
        if (profileImage) profileImage.src = savedImageUrl;
        const sidebarImage = document.getElementById('profile-image-sidebar');
        if (sidebarImage) sidebarImage.src = savedImageUrl;
    }

    if (profileImage && profileUpload) {
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
                    const sidebarImage = $('profile-image-sidebar');
                    if (sidebarImage) sidebarImage.src = imageUrl;
                    try {
                        storage.set('profile-image-url', imageUrl);
                    } catch (error) {
                        console.error('Imagem muito grande para o SessionStorage', error);
                        alert('Imagem carregada! (Nota: Imagens muito grandes podem não salvar ao recarregar a página neste protótipo).');
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const extraFriendsData = [
        { name: 'Lucas', img: 'https://picsum.photos/60?random=4' },
        { name: 'Fernanda', img: 'https://picsum.photos/60?random=5' },
        { name: 'Mariana', img: 'https://picsum.photos/60?random=6' },
        { name: 'Gabriel', img: 'https://picsum.photos/60?random=7' },
        { name: 'Juliana', img: 'https://picsum.photos/60?random=8' },
        { name: 'Roberto', img: 'https://picsum.photos/60?random=9' }
    ];
    let friendsExpanded = false;
    
    const friendsCountEl = $('friends-count');
    if (friendsCountEl) {
        const initialFriendsCount = document.querySelectorAll('.friend-item').length;
        const totalFriends = initialFriendsCount + extraFriendsData.length;
        friendsCountEl.textContent = `amigos (${totalFriends})`;
    }

    const viewAllFriendsBtn = document.getElementById('view-all-friends');
    if (viewAllFriendsBtn) {
        viewAllFriendsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const friendsGrid = qs('.friends-grid');
            
            if (!friendsExpanded) {
                extraFriendsData.forEach(friend => {
                    const friendHtml = `<div class="friend-item extra-item"><img src="${friend.img}"><span>${friend.name}</span></div>`;
                    friendsGrid.insertAdjacentHTML('beforeend', friendHtml);
                });
                viewAllFriendsBtn.textContent = 'voltar';
                friendsExpanded = true;
            } else {
                const extras = friendsGrid.querySelectorAll('.extra-item');
                extras.forEach(item => item.remove());
                viewAllFriendsBtn.textContent = 'ver todos';
                friendsExpanded = false;
            }
        });
    }

    let allCommunities = [];
    let commExpanded = false;
    const commList = qs('.comm-list');
    const viewAllCommBtn = $('view-all-comm');

    fetch('communities.json')
        .then(response => response.json())
        .then(data => {
            allCommunities = data;
            
            const commCountEl = $('comm-count');
            if (commCountEl) {
                commCountEl.textContent = `comunidades (${allCommunities.length})`;
            }
            
            renderCommunities(allCommunities.slice(0, 3));

            const commNameMain = $('comm-name-main');
            if (commNameMain) {
                const urlParams = new URLSearchParams(window.location.search);
                const commId = parseInt(urlParams.get('id'));
                const community = allCommunities.find(c => c.id === commId);
                
                if (community) {
                    commNameMain.textContent = community.name;
                    document.title = `orkut - ${community.name}`;
                    const commImage = $('comm-image');
                    if (commImage) commImage.src = community.img;
                    const commNameSidebar = $('comm-name-sidebar');
                    if (commNameSidebar) commNameSidebar.textContent = community.name;
                    const commDesc = $('comm-description');
                    if (commDesc) commDesc.textContent = community.description;
                    const commMembers = $('comm-members-count');
                    if (commMembers) commMembers.textContent = community.members.toLocaleString('pt-BR');

                    const cards = document.querySelectorAll('.center-column .card');
                    let forumContentDiv = null;
                    cards.forEach(card => {
                        const h2 = card.querySelector('h2');
                        if (h2 && h2.textContent.toLowerCase().includes('fórum')) {
                            forumContentDiv = card.querySelector('div[style="padding: 10px;"]');
                        }
                    });

                    if (forumContentDiv && community.topics && community.topics.length > 0) {
                        let topicsHtml = '<table style="width:100%; border-collapse:collapse; font-size:11px; margin-bottom:10px;">';
                        topicsHtml += '<tr style="background:#d4e1f5; text-align:left;"><th style="padding:4px;">Tópico</th><th style="padding:4px;">Autor</th><th style="padding:4px; text-align:center;">Resps.</th><th style="padding:4px; text-align:right;">Última postagem</th></tr>';
                        
                        community.topics.forEach((topic, index) => {
                            const bg = index % 2 === 0 ? '#f0f5fa' : '#ffffff';
                            topicsHtml += `<tr style="background:${bg};">
                                <td style="padding:4px;"><a href="#" style="color:#003399; text-decoration:none;">${topic.title}</a></td>
                                <td style="padding:4px;"><a href="#" style="color:#003399; text-decoration:none;">${topic.author}</a></td>
                                <td style="padding:4px; text-align:center;">${topic.replies}</td>
                                <td style="padding:4px; text-align:right; color:#666;">${topic.date}</td>
                            </tr>`;
                        });
                        topicsHtml += '</table>';
                        topicsHtml += '<button class="orkut-btn">Criar tópico</button>';
                        forumContentDiv.innerHTML = topicsHtml;
                    }

                    const joinBtn = $('join-comm-btn');
                    if (joinBtn) {
                        const storageKey = `joined_comm_${commId}`;
                        const isJoined = storage.get(storageKey) === 'true';
                        joinBtn.textContent = isJoined ? 'sair' : 'participar';

                        joinBtn.addEventListener('click', function() {
                            if (joinBtn.textContent === 'participar') {
                                joinBtn.textContent = 'sair';
                                storage.set(storageKey, 'true');
                            } else {
                                joinBtn.textContent = 'participar';
                                storage.set(storageKey, 'false');
                            }
                        });
                    }
                }
            }
        })
        .catch(err => console.error('Erro ao carregar comunidades:', err));

    function renderCommunities(items) {
        if (!commList) return;
        commList.innerHTML = '';
        
        items.forEach(comm => {
            let memberCount = comm.members;
            if (memberCount >= 1000) {
                memberCount = Math.floor(memberCount / 1000) + 'k';
            }

            const commHtml = `
                <div class="comm-item">
                    <a href="community.html?id=${comm.id}" style="text-decoration: none;">
                        <img src="${comm.img}" alt="${comm.name}" title="${comm.description}">
                        <span style="display:block; margin-bottom: 2px;">${comm.name}</span>
                        <span style="color: #666; font-size: 9px;">(${memberCount})</span>
                    </a>
                </div>`;
            commList.insertAdjacentHTML('beforeend', commHtml);
        });
    }

    if (viewAllCommBtn && commList) {
        viewAllCommBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (!commExpanded) {
                renderCommunities(allCommunities);
                viewAllCommBtn.textContent = 'voltar';
                commExpanded = true;
            } else {
                renderCommunities(allCommunities.slice(0, 3));
                viewAllCommBtn.textContent = 'ver todas';
                commExpanded = false;
            }
        });
    }

    setupManageButton('manage-friends', '.friends-grid', '.friend-item', 'friends');
    setupManageButton('manage-comm', '.comm-list', '.comm-item', 'comm');

    function setupManageButton(btnId, containerSelector, itemSelector, type) {
        const btn = $(btnId);
        const container = qs(containerSelector);

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
                        const countId = type === 'friends' ? 'friends-count' : 'comm-count';
                        const countEl = $(countId);
                        let currentText = countEl.textContent;
                        let currentNum = parseInt(currentText.match(/\d+/)[0]);
                        countEl.textContent = currentText.replace(currentNum, currentNum - 1);
                    }
                }
            });
        }
    }

    const ratingBoxes = document.querySelectorAll('.rating-box');
    ratingBoxes.forEach(box => {
        const icons = box.querySelectorAll('.rate-icon');
        icons.forEach((icon, index) => {
            icon.addEventListener('click', () => {
                icons.forEach(i => i.classList.remove('active'));
                for (let i = 0; i <= index; i++) {
                    icons[i].classList.add('active');
                }
            });
        });
    });

    const tabSocial = $('tab-social');
    const tabProf = $('tab-prof');

    if (tabSocial && tabProf) {
        function switchTab(activeTab, inactiveTab) {
            activeTab.classList.add('active');
            inactiveTab.classList.remove('active');
        }

        tabSocial.addEventListener('click', () => switchTab(tabSocial, tabProf));
        tabProf.addEventListener('click', () => switchTab(tabProf, tabSocial));
    }

    const modal = $('reply-modal');
    const closeModal = qs('.close-modal');
    const replyAuthorName = $('reply-author-name');
    const replyMessage = $('reply-message');
    const sendReplyBtn = $('send-reply-btn');
    let replyContext = {};

    function openReplyModal(author, type, id) {
        replyContext = { type, id };
        if (modal) {
            if (replyAuthorName) replyAuthorName.textContent = author;
            if (replyMessage) replyMessage.value = '';
            modal.style.display = 'block';
            if (replyMessage) replyMessage.focus();
        } else {
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
                    author: 'usuario',
                    text: replyText,
                    date: new Date().toLocaleDateString('pt-BR')
                };

                const system = replyContext.type === 'scrap' ? Scraps : Testimonials;
                const item = system.data.find(i => i.id == replyContext.id);
                if (item) {
                    if (!item.replies) item.replies = [];
                    item.replies.push(replyObj);
                    system.save();
                    system.renderAll();
                }
                modal.style.display = 'none';
            }
        });
    }

    function createMessageSystem(key, defaultData, itemClass, typeName) {
        let data = storage.getJson(key, defaultData);
        const save = () => storage.setJson(key, data);
        
        const render = (containerId, limit = null) => {
            const container = $(containerId);
            if (!container) return;
            container.innerHTML = '';
            const list = limit ? data.slice(0, limit) : data;
            
            if (list.length === 0) {
                container.innerHTML = '<p style="padding:10px; color:#666;">Nenhum item ainda.</p>';
                return;
            }

            list.forEach(item => {
                let repliesHtml = item.replies?.length ? `<div class="item-replies">${item.replies.map(r => `<div class="reply-item"><strong>${r.author}:</strong> ${r.text}</div>`).join('')}</div>` : '';
                const dateHtml = item.date ? `<span style="font-size:9px; color:#999;">${item.date}</span>` : '';
                const contentHtml = itemClass === 'scrap-item' 
                    ? `<div style="display:flex; justify-content:space-between;"><strong>${item.author}:</strong>${dateHtml}</div><p style="margin-top:4px;">${item.text}</p>`
                    : `<strong>${item.author}:</strong> "${item.text}"`;

                const html = `<div class="${itemClass}">${contentHtml}${repliesHtml}${!limit ? `<div style="text-align:right; margin-top:5px;"><button class="orkut-btn reply-btn" data-author="${item.author}" data-id="${item.id}">responder</button></div>` : ''}</div>`;
                container.insertAdjacentHTML('beforeend', html);
            });

            if (!limit) {
                container.querySelectorAll('.reply-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => openReplyModal(e.target.dataset.author, typeName, e.target.dataset.id));
                });
            }
        };
        return { data, save, render, renderAll: () => { render(`${typeName}s-preview`, 2); render(`${typeName}s-list-full`); } };
    }

    const Scraps = createMessageSystem('orkut_scraps', [
        { id: 1, author: 'João', text: 'Passando para deixar um scrap e ganhar um de volta! haha', date: '20/07/2006' },
        { id: 2, author: 'Ana', text: 'Adorei as fotos do fim de semana!', date: '19/07/2006' },
        { id: 3, author: 'Carlos', text: 'E aí, sumida! Quando vamos marcar aquele churrasco?', date: '18/07/2006' },
        { id: 4, author: 'Julia', text: 'Feliz aniversário atrasado! Tudo de bom!', date: '17/07/2006' },
        { id: 5, author: 'Pedro', text: 'Me aceita na comunidade lá.', date: '16/07/2006' }
    ], 'scrap-item', 'scrap');
    Scraps.renderAll();

    const Testimonials = createMessageSystem('orkut_testimonials', [
        { id: 1, author: 'Fernanda', text: 'Amiga, você é incrível! Saudades das nossas conversas intermináveis.' },
        { id: 2, author: 'Roberto', text: 'Profissional exemplar e uma pessoa de coração gigante.' },
        { id: 3, author: 'Lucas', text: 'Conheço há anos, super gente boa. Podem confiar!' },
        { id: 4, author: 'Mariana', text: 'Minha parceira de todas as horas. Amo muito!' }
    ], 'testimonial-item', 'testimonial');
    Testimonials.renderAll();
});