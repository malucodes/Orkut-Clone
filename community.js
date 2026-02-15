document.addEventListener('DOMContentLoaded', function() {
    // Utilitários locais (para garantir independência)
    const $ = (id) => document.getElementById(id);
    const qs = (sel) => document.querySelector(sel);
    const storage = {
        get: (k, d) => sessionStorage.getItem(k) || d,
        set: (k, v) => sessionStorage.setItem(k, v),
        getJson: (k, d) => JSON.parse(sessionStorage.getItem(k)) || d,
        setJson: (k, v) => sessionStorage.setItem(k, JSON.stringify(v))
    };

    // Carrega comunidades para encontrar a atual
    let allCommunities = storage.getJson('allCommunities', []);
    
    const urlParams = new URLSearchParams(window.location.search);
    const commId = parseInt(urlParams.get('id'));
    
    // Se não tiver dados no storage (acesso direto), tenta carregar do JSON
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

        // Renderiza dados básicos
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

        // Renderiza Membros (Preview)
        const membersContainer = $('comm-members-preview');
        if (membersContainer) {
            membersContainer.innerHTML = '';
            // Gera 9 membros aleatórios para exibir
            for (let i = 0; i < 9; i++) {
                const randomId = Math.floor(Math.random() * 1000);
                const names = ['Ana', 'Carlos', 'João', 'Maria', 'Pedro', 'Juliana', 'Fernanda', 'Roberto', 'Lucas', 'Gabriel'];
                const name = names[Math.floor(Math.random() * names.length)];
                
                const memberHtml = `
                    <div class="friend-item"><img src="https://picsum.photos/60?random=${randomId}"><span>${name}</span></div>
                `;
                membersContainer.insertAdjacentHTML('beforeend', memberHtml);
            }
        }

        // Renderiza Tópicos
        const forumContainer = $('comm-forum-topics');
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

        // Modal de Criar Tópico
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
                        
                        // Atualiza no storage global
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

        // Botão Participar/Sair
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

        // Denunciar
        const reportAbuseLink = $('report-abuse-link');
        if (reportAbuseLink) {
            reportAbuseLink.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Tem certeza que deseja denunciar esta comunidade por abuso?')) {
                    alert('Denúncia enviada para análise.');
                }
            });
        }

        // Enquetes
        const pollContainer = $('poll-container');
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
                        // Salvar dados da enquete se necessário (opcional para este escopo)
                        renderPoll();
                    } else {
                        alert('Selecione uma opção para votar.');
                    }
                });
            }
        }
        renderPoll();
    }
});