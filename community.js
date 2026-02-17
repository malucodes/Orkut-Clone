document.addEventListener('DOMContentLoaded', function() {
    const $ = (id) => document.getElementById(id);
    const qs = (sel) => document.querySelector(sel);
    const storage = {
        get: (k, d) => sessionStorage.getItem(k) || d,
        set: (k, v) => sessionStorage.setItem(k, v),
        getJson: (k, d) => JSON.parse(sessionStorage.getItem(k)) || d,
        setJson: (k, v) => sessionStorage.setItem(k, JSON.stringify(v))
    };

    let allCommunities = storage.getJson('allCommunities', []);
    
    const urlParams = new URLSearchParams(window.location.search);
    const commId = parseInt(urlParams.get('id'));
    
    if (allCommunities.length === 0) {
        fetch('communities.json')
            .then(r => r.json())
            .then(data => {
                allCommunities = data;
                storage.setJson('allCommunities', data);
                initCommunityPage(commId);
            })
            .catch(err => console.error('Erro ao carregar comunidades:', err));
    } else {
        initCommunityPage(commId);
    }

    function initCommunityPage(id) {
        const community = allCommunities.find(c => c.id === id);
        
        if (!community) {
            const mainCard = qs('.center-column .card');
            if(mainCard) mainCard.innerHTML = '<h3>Comunidade não encontrada</h3><p><a href="my_communities.html">Voltar</a></p>';
            return;
        }

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
        
        const infoCard = qs('.comm-info-card');
        if (infoCard) {
            const oldGrid = infoCard.querySelector('.comm-details-grid');
            const oldDivider = infoCard.querySelector('.comm-divider');
            const oldDesc = infoCard.querySelector('.comm-desc-text');
            
            if (oldGrid) oldGrid.style.display = 'none';
            if (oldDivider) oldDivider.style.display = 'none';
            if (oldDesc) oldDesc.style.display = 'none';

            let newGrid = infoCard.querySelector('.generated-info-grid');
            if (!newGrid) {
                newGrid = document.createElement('div');
                newGrid.className = 'generated-info-grid';
                newGrid.style.marginTop = '15px';
                infoCard.appendChild(newGrid);
            }

            newGrid.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                        <div class="info-row">
                            <div class="info-label">Idioma:</div>
                            <div class="info-data">Português (Brasil)</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Categoria:</div>
                            <div class="info-data">Outros</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Dono:</div>
                            <div class="info-data"><a href="#" style="color:#0044cc; text-decoration:none;">moderador</a></div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Tipo:</div>
                            <div class="info-data">Pública</div>
                        </div>
                    </div>
                    <div>
                        <div class="info-row">
                            <div class="info-label">Privacidade:</div>
                            <div class="info-data">Aberta</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Criação:</div>
                            <div class="info-data">20/07/2006</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Membros:</div>
                            <div class="info-data">${community.members.toLocaleString('pt-BR')}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Local:</div>
                            <div class="info-data">Brasil</div>
                        </div>
                    </div>
                </div>
                <div style="border-top: 1px solid #e0e0e0; margin: 15px 0;"></div>
                <div style="padding: 0 5px;">
                    <div style="line-height: 1.5; white-space: pre-wrap;">${community.description}</div>
                </div>
            `;
        }

        const membersContainer = $('comm-members-preview');
        if (membersContainer) {
            membersContainer.innerHTML = '';
            for (let i = 0; i < 9; i++) {
                const randomId = Math.floor(Math.random() * 1000);
                const names = ['Ana', 'Carlos', 'Felipe', 'Maria', 'Pedro', 'Juliana', 'Fernanda', 'Roberto', 'Lucas', 'Gabriel'];
                const name = names[Math.floor(Math.random() * names.length)];
                
                const memberHtml = `
                    <div class="friend-item"><img src="https://picsum.photos/60?random=${randomId}"><span>${name}</span></div>
                `;
                membersContainer.insertAdjacentHTML('beforeend', memberHtml);
            }
        }

        let forumContainer = $('comm-forum-topics');
        
        if (!forumContainer) {
            const contentArea = qs('.center-column .card') || qs('.card');
            if (contentArea) {
                const header = document.createElement('h3');
                header.textContent = 'Fórum';
                header.style.marginTop = '20px';
                contentArea.appendChild(header);
                
                forumContainer = document.createElement('div');
                forumContainer.id = 'comm-forum-topics';
                contentArea.appendChild(forumContainer);
            }
        }
        
        if (!community.topics) community.topics = [];
        community.topics = community.topics.filter(t => t.title !== 'Enquete' && t.title !== 'Enquetes' && t.title !== 'Membros');

        const renderTopics = () => {
            if (forumContainer) {
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
                forumContainer.innerHTML = topicsHtml;
            }
        };
        renderTopics();

        const menuItems = document.querySelectorAll('.comm-menu-item');
        const centerColumn = qs('.center-column');

        if (!document.getElementById('members-modal')) {
            const modalHtml = `
                <div id="members-modal" class="modal">
                    <div class="modal-content" style="width: 400px; text-align: center;">
                        <span class="close-modal" id="close-members-modal" style="float:right; cursor:pointer;">&times;</span>
                        <h3 style="margin-top:0; color:#003399;">Membros da Comunidade</h3>
                        <div id="members-modal-list" style="max-height: 300px; overflow-y: auto; margin-top: 15px; text-align: left;"></div>
                    </div>
                </div>`;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            
            document.addEventListener('click', (e) => {
                if (e.target.id === 'close-members-modal' || e.target.id === 'members-modal') {
                    const m = document.getElementById('members-modal');
                    if (m) m.style.display = 'none';
                }
            });
        }

        const switchTab = (tabName) => {
            const infoCard = qs('.comm-info-card');
            const forumCard = qs('#comm-forum-topics')?.closest('.comm-forum-card') || qs('#comm-forum-topics');
            const pollCard = qs('#poll-container')?.closest('.comm-forum-card') || qs('#poll-container');

            if (infoCard) infoCard.style.display = 'none';
            if (forumCard) forumCard.style.display = 'none';
            if (pollCard) pollCard.style.display = 'none';

            if (tabName === 'perfil') {
                if (infoCard) infoCard.style.display = 'block';
                if (forumCard) forumCard.style.display = 'block';
            } else if (tabName === 'fórum') {
                if (forumCard) forumCard.style.display = 'block';
            } else if (tabName === 'enquetes') {
                if (pollCard) {
                    pollCard.style.display = 'block';
                    renderPoll();
                }
            }

            menuItems.forEach(item => {
                if (item.textContent.trim().toLowerCase() === tabName) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        };

        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = item.textContent.trim().toLowerCase();
                
                if (tabName === 'membros') {
                    const modal = $('members-modal');
                    const list = $('members-modal-list');
                    if (modal && list) {
                        list.innerHTML = '';
                        const limit = 12;
                        for (let i = 0; i < limit; i++) {
                            const randomId = Math.floor(Math.random() * 1000) + i;
                            const names = ['Ana', 'Carlos', 'Felipe', 'Maria', 'Pedro', 'Juliana', 'Fernanda', 'Roberto', 'Lucas', 'Gabriel'];
                            const name = names[Math.floor(Math.random() * names.length)];
                            list.insertAdjacentHTML('beforeend', `
                                <div style="display: flex; align-items: center; padding: 5px; border-bottom: 1px solid #eee;">
                                    <img src="https://picsum.photos/30?random=${randomId}" style="width:30px; height:30px; object-fit:cover; margin-right: 10px; border: 1px solid #ccc;">
                                    <span style="color: #003399; font-size: 11px;">${name}</span>
                                </div>`);
                        }

                        const totalMembers = community.members || 0;
                        const remaining = totalMembers - limit;
                        
                        if (remaining > 0) {
                            list.insertAdjacentHTML('beforeend', `
                                <div style="padding: 10px; text-align: center; color: #666; font-size: 11px; margin-top: 5px; font-style: italic;">
                                    ... e mais ${remaining.toLocaleString('pt-BR')} membros nesta comunidade
                                </div>`);
                        }

                        modal.style.display = 'block';
                    }
                } else {
                    switchTab(tabName);
                }
            });
        });

        switchTab('perfil');

        const createTopicBtn = qs('.comm-create-topic-btn');
        const topicModal = $('create-topic-modal');
        const closeTopicModal = $('close-topic-modal');
        const submitTopicBtn = $('submit-topic-btn');

        if (createTopicBtn && topicModal) {
            createTopicBtn.addEventListener('click', (e) => {
                e.preventDefault();
                topicModal.style.display = 'block';
                const titleInput = $('new-topic-title');
                if(titleInput) titleInput.focus();
            });
            
            if (closeTopicModal) closeTopicModal.addEventListener('click', () => topicModal.style.display = 'none');
            window.addEventListener('click', (e) => { if (e.target == topicModal) topicModal.style.display = 'none'; });

            if (submitTopicBtn) {
                submitTopicBtn.addEventListener('click', () => {
                    const title = $('new-topic-title').value;
                    if (title.trim()) {
                        const newTopic = { title: title, author: 'usuario', replies: 0, date: new Date().toLocaleDateString('pt-BR') };
                        if (!community.topics) community.topics = [];
                        community.topics.unshift(newTopic);
                        
                        const allComms = storage.getJson('allCommunities', []);
                        const idx = allComms.findIndex(c => c.id === id);
                        if(idx !== -1) {
                            allComms[idx] = community;
                            storage.setJson('allCommunities', allComms);
                        }

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
        const storageKey = `joined_comm_${id}`;
        
        const updateJoinState = () => {
            const isJoined = storage.get(storageKey) === 'true';
            if (joinBtn) {
                if (isJoined) {
                    joinBtn.innerHTML = `<span class="comm-join-icon">-</span> sair`;
                } else {
                    joinBtn.innerHTML = `<span class="comm-join-icon">+</span> participar`;
                }
            }
            if (joinLink) {
                joinLink.textContent = isJoined ? 'sair' : 'participar';
            }
        };
        
        updateJoinState();

        if (joinBtn) {
            joinBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const current = storage.get(storageKey) === 'true';
                storage.set(storageKey, !current);
                updateJoinState();
            });
        }
        if (joinLink) {
            joinLink.addEventListener('click', (e) => {
                e.preventDefault();
                const current = storage.get(storageKey) === 'true';
                storage.set(storageKey, !current);
                updateJoinState();
            });
        }

        const reportAbuseLink = $('report-abuse-link');
        if (reportAbuseLink) {
            reportAbuseLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Tem certeza que deseja denunciar esta comunidade por abuso?')) {
                    alert('Denúncia enviada para análise.');
                }
            });
        }

        const pollStorageKey = `poll_vote_${id}`;
        const pollDataKey = `comm_poll_data_${id}`;
        
        let pollData = storage.getJson(pollDataKey, null);
        if (!pollData) {
            pollData = {
                question: "O que você acha desta comunidade?",
                options: ["Excelente", "Boa", "Regular", "Ruim"],
                votes: [12, 5, 2, 1]
            };
        }

        function renderPoll() {
            const container = $('poll-container');
            if (!container) return;
            
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
            container.innerHTML = html;

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

        if (!document.querySelector('.orkut-footer')) {
            const footerHtml = `<div class="orkut-footer"><img src="assets/images/orkut-logo.png" style="height: 20px;"><div class="footer-links"><a href="#">Sobre o Orkut</a> | <a href="#">Centro de Segurança</a> | <a href="#">Privacidade</a> | <a href="#">Termos</a> | <a href="#">Contato</a></div><div style="flex-grow: 1; text-align: right; font-size: 10px; color: #999;">© 2006 Google</div></div>`;
            const mainWrapper = qs('.main-wrapper');
            if (mainWrapper) {
                mainWrapper.insertAdjacentHTML('beforeend', footerHtml);
            }
        }
    }
});