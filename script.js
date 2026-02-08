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

    const loadCommunities = () => {
        const stored = storage.getJson('allCommunities');
        if (stored) return Promise.resolve(stored);
        return fetch('communities.json').then(r => r.json()).then(d => {
            storage.setJson('allCommunities', d);
            return d;
        });
    };

    loadCommunities().then(data => {
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
                    document.title = `orkut - ${community.name}`;

                    const commImage = $('comm-image');
                    if (commImage) commImage.src = community.img;
                    
                    const commNameSidebar = $('comm-name-sidebar');
                    if (commNameSidebar) commNameSidebar.textContent = community.name;
                    
                    const commMembers = $('comm-members-count');
                    if (commMembers) commMembers.textContent = `${community.members.toLocaleString('pt-BR')} membros`;
                    
                    const commMembersCard = $('comm-members-count-card');
                    if (commMembersCard) commMembersCard.textContent = community.members.toLocaleString('pt-BR');

                    const commNameMain = $('comm-name-main');
                    if (commNameMain) commNameMain.textContent = community.name;
                    
                    const commDesc = $('comm-description');
                    if (commDesc) commDesc.textContent = community.description;

                    const forumContainer = $('comm-forum-topics');
                    const forumContainerFull = $('comm-forum-topics-full');

                    const renderTopics = () => {
                        if (forumContainer || forumContainerFull) {
                            let topicsHtml = '';
                            if (community.topics && community.topics.length > 0) {
                                community.topics.forEach((topic, index) => {
                                    const isLast = index === community.topics.length - 1;
                                    topicsHtml += `
                                        <div class="comm-topic-row">
                                            <img src="https://picsum.photos/30/30?random=${index + 100}" class="comm-topic-img">
                                            <div class="comm-topic-content">
                                                <a href="#" class="comm-topic-title">${topic.title}</a>
                                                <div class="comm-topic-replies">(${topic.replies} respostas)</div>
                                            </div>
                                            <div class="comm-topic-meta">
                                                <div>última resposta: ${topic.author}...</div>
                                                <div>${topic.date}</div>
                                            </div>
                                            <div class="comm-topic-toggle">v</div>
                                        </div>
                                        ${!isLast ? '<div class="comm-topic-divider"></div>' : ''}
                                    `;
                                });
                            } else {
                                topicsHtml = '<div style="padding:10px; color:#666;">Nenhum tópico.</div>';
                            }
                            if (forumContainer) forumContainer.innerHTML = topicsHtml;
                            if (forumContainerFull) forumContainerFull.innerHTML = topicsHtml;
                        }
                    };
                    renderTopics();

                    const createTopicBtns = document.querySelectorAll('.comm-create-topic-btn');
                    const topicModal = $('create-topic-modal');
                    const closeTopicModal = $('close-topic-modal');
                    const submitTopicBtn = $('submit-topic-btn');

                    if (createTopicBtns.length > 0 && topicModal) {
                        createTopicBtns.forEach(btn => btn.addEventListener('click', () => {
                            topicModal.style.display = 'block';
                            const titleInput = $('new-topic-title');
                            if(titleInput) titleInput.focus();
                        }));
                        
                        if (closeTopicModal) closeTopicModal.addEventListener('click', () => topicModal.style.display = 'none');
                        window.addEventListener('click', (e) => { if (e.target == topicModal) topicModal.style.display = 'none'; });

                        if (submitTopicBtn) {
                            submitTopicBtn.addEventListener('click', () => {
                                const title = $('new-topic-title').value;
                                if (title.trim()) {
                                    const newTopic = { title: title, author: 'usuario', replies: 0, date: new Date().toLocaleDateString('pt-BR') };
                                    if (!community.topics) community.topics = [];
                                    community.topics.unshift(newTopic);
                                    storage.setJson('allCommunities', allCommunities);
                                    renderTopics();
                                    topicModal.style.display = 'none';
                                    $('new-topic-title').value = '';
                                    $('new-topic-body').value = '';
                                } else alert('Digite um título para o tópico.');
                            });
                        }
                    }

                    const joinBtn = $('join-comm-btn-main');
                    const joinLink = $('join-comm-link');
                    const storageKey = `joined_comm_${commId}`;
                    
                    const updateJoinState = () => {
                        const isJoined = storage.get(storageKey) === 'true';
                        if (joinBtn) {
                            if (isJoined) {
                                joinBtn.innerHTML = `<span class="comm-join-icon" style="color: #333;">-</span> Sair da comunidade`;
                            } else {
                                joinBtn.innerHTML = `<span class="comm-join-icon" style="color: #ccc;">+</span> Participar da comunidade`;
                            }
                        }
                        if (joinLink) {
                            joinLink.textContent = isJoined ? 'Sair da comunidade' : 'Participar da comunidade';
                        }
                    };
                    
                    updateJoinState();

                    const toggleJoin = (e) => {
                        e.preventDefault();
                        const current = storage.get(storageKey) === 'true';
                        storage.set(storageKey, !current);
                        updateJoinState();
                    };

                    if (joinBtn) joinBtn.addEventListener('click', toggleJoin);
                    if (joinLink) joinLink.addEventListener('click', toggleJoin);

                    const reportAbuseLink = $('report-abuse-link');
                    if (reportAbuseLink) {
                        reportAbuseLink.addEventListener('click', (e) => {
                            e.preventDefault();
                            if (confirm('Tem certeza que deseja denunciar esta comunidade por abuso?')) {
                                alert('Denúncia enviada para análise. Obrigado por colaborar com a segurança do orkut.');
                            }
                        });
                    }

                    const membersLink = $('comm-members-link');
                    const membersModal = $('members-modal');
                    const closeMembersModal = $('close-members-modal');
                    const membersListContainer = $('members-list-container');

                    if (membersLink && membersModal) {
                        membersLink.addEventListener('click', (e) => {
                            e.preventDefault();
                            membersModal.style.display = 'block';
                            
                            if (membersListContainer) {
                                membersListContainer.innerHTML = '';
                                const totalToShow = Math.min(community.members, 20);
                                
                                for (let i = 0; i < totalToShow; i++) {
                                    const randomId = Math.floor(Math.random() * 1000);
                                    const names = ['Ana', 'Carlos', 'João', 'Maria', 'Pedro', 'Juliana', 'Fernanda', 'Roberto', 'Lucas', 'Gabriel'];
                                    const name = names[Math.floor(Math.random() * names.length)] + ' ' + names[Math.floor(Math.random() * names.length)];
                                    
                                    const memberHtml = `
                                        <div style="display: flex; align-items: center; padding: 5px; border-bottom: 1px solid #eee;">
                                            <img src="https://picsum.photos/40/40?random=${randomId}" style="width: 40px; height: 40px; margin-right: 10px; border: 1px solid #ccc;">
                                            <div>
                                                <a href="#" style="color: #0044cc; font-weight: bold; text-decoration: none; font-size: 12px;">${name}</a>
                                                <div style="color: #666; font-size: 10px;">Membro desde 2006</div>
                                            </div>
                                        </div>
                                    `;
                                    membersListContainer.insertAdjacentHTML('beforeend', memberHtml);
                                }
                                
                                if (community.members > 20) {
                                     membersListContainer.insertAdjacentHTML('beforeend', `<div style="padding: 10px; text-align: center; color: #666;">E mais ${(community.members - 20).toLocaleString('pt-BR')} membros...</div>`);
                                }
                            }
                        });
                        
                        if (closeMembersModal) {
                            closeMembersModal.addEventListener('click', () => membersModal.style.display = 'none');
                        }
                        window.addEventListener('click', (e) => {
                            if (e.target == membersModal) membersModal.style.display = 'none';
                        });
                    }

                    const tabMain = $('comm-tab-main');
                    const tabForum = $('comm-tab-forum');
                    const tabPolls = $('comm-tab-polls');
                    const contentMain = $('comm-content-main');
                    const contentForum = $('comm-content-forum');
                    const contentPolls = $('comm-content-polls');

                    function setActiveTab(activeTab) {
                        [tabMain, tabForum, tabPolls].forEach(t => {
                            if(t) t.classList.remove('active');
                        });
                        if(activeTab) activeTab.classList.add('active');
                    }

                    if (tabMain && contentMain) {
                        tabMain.addEventListener('click', (e) => {
                            e.preventDefault();
                            setActiveTab(tabMain);
                            contentMain.style.display = 'block';
                            if(contentForum) contentForum.style.display = 'none';
                            if(contentPolls) contentPolls.style.display = 'none';
                        });
                    }

                    if (tabForum && contentForum) {
                        tabForum.addEventListener('click', (e) => {
                            e.preventDefault();
                            setActiveTab(tabForum);
                            if(contentMain) contentMain.style.display = 'none';
                            contentForum.style.display = 'block';
                            if(contentPolls) contentPolls.style.display = 'none';
                        });
                    }

                    if (tabPolls && contentPolls) {
                        tabPolls.addEventListener('click', (e) => {
                            e.preventDefault();
                            setActiveTab(tabPolls);
                            if(contentMain) contentMain.style.display = 'none';
                            if(contentForum) contentForum.style.display = 'none';
                            contentPolls.style.display = 'block';
                            renderPoll();
                        });
                    }

                    const pollContainer = $('poll-container');
                    const pollStorageKey = `poll_vote_${commId}`;
                    
                    const pollData = {
                        question: "O que você acha desta comunidade?",
                        options: ["Excelente", "Boa", "Regular", "Ruim"],
                        votes: [12, 5, 2, 1]
                    };

                    function renderPoll() {
                        if (!pollContainer) return;
                        
                        const userVote = storage.get(pollStorageKey);
                        let html = `<h4 style="margin-top:0; margin-bottom:10px;">${pollData.question}</h4>`;

                        if (userVote) {
                            const totalVotes = pollData.votes.reduce((a, b) => a + b, 0) + (userVote ? 0 : 0);
                            
                            pollData.options.forEach((opt, i) => {
                                const votes = pollData.votes[i];
                                const percent = totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
                                html += `
                                    <div class="poll-result-row">
                                        <div>${opt} (${votes} votos - ${percent}%)</div>
                                        <div class="poll-bar-container"><div class="poll-bar-fill" style="width: ${percent}%"></div></div>
                                    </div>
                                `;
                            });
                            html += `<div style="margin-top:10px; font-size:10px; color:#666;">Total de votos: ${totalVotes}</div>`;
                        } else {
                            html += `<form id="poll-form">`;
                            pollData.options.forEach((opt, i) => {
                                html += `<label class="poll-option"><input type="radio" name="poll_opt" value="${i}"> ${opt}</label>`;
                            });
                            html += `<button type="submit" class="orkut-btn" style="margin-top:10px;">Votar</button></form>`;
                        }
                        pollContainer.innerHTML = html;

                        const pollForm = $('poll-form');
                        if (pollForm) {
                            pollForm.addEventListener('submit', (e) => {
                                e.preventDefault();
                                const selected = pollForm.querySelector('input[name="poll_opt"]:checked');
                                if (selected) {
                                    const idx = parseInt(selected.value);
                                    pollData.votes[idx]++;
                                    storage.set(pollStorageKey, 'true');
                                    renderPoll();
                                } else {
                                    alert('Selecione uma opção para votar.');
                                }
                            });
                        }
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