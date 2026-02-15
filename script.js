// Definições globais e utilitários (fora do DOMContentLoaded para acesso imediato)
const $ = (id) => document.getElementById(id);
const qs = (sel) => document.querySelector(sel);
const setTxt = (id, txt) => { const el = $(id); if(el) el.textContent = txt; };

const storage = {
    get: (k, d) => sessionStorage.getItem(k) || d,
    set: (k, v) => sessionStorage.setItem(k, v),
    getJson: (k, d) => JSON.parse(sessionStorage.getItem(k)) || d,
    setJson: (k, v) => sessionStorage.setItem(k, JSON.stringify(v))
};
window.storage = storage;

function updateSidebar() {
    const nameToUse = $('profile-name')?.textContent || storage.get('profile-name', 'usuario');
    setTxt('sidebar-name', nameToUse);

    const headerEmail = qs('.user-info span');
    if (headerEmail) {
        const cleanName = nameToUse.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        const emailUser = cleanName.trim().split(/\s+/).join('123').toLowerCase();
        headerEmail.textContent = headerEmail.title = `${emailUser}@orkut.com`;
    }

    setTxt('sidebar-sex', $('profile-sex')?.textContent || storage.get('profile-sex', 'sexo'));
    setTxt('sidebar-rel', $('profile-rel')?.textContent || storage.get('profile-rel', 'relacionamento'));
    
    const city = $('profile-hometown')?.textContent || storage.get('profile-hometown', '');
    const country = $('profile-country')?.textContent || storage.get('profile-country', '');
    const locParts = [city, country].filter(p => p && p.trim() !== '');
    const loc = locParts.length > 0 ? locParts.join(', ') : 'Brasil';
    setTxt('sidebar-loc', loc);
}
window.updateSidebar = updateSidebar;

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
                btn.addEventListener('click', (e) => {
                    if(window.openReplyModal) window.openReplyModal(e.target.dataset.author, typeName, e.target.dataset.id);
                });
            });
        }
    };
    return { data, save, render, renderAll: () => { render(`${typeName}s-preview`, 2); render(`${typeName}s-list-full`); } };
}
window.createMessageSystem = createMessageSystem;

document.addEventListener('DOMContentLoaded', function() {
    // Carrega dados salvos nos campos de perfil (apenas visualização inicial)
    const fields = ['profile-status', 'profile-bio', 'profile-name', 'profile-sex', 'profile-rel', 'profile-birth', 'profile-age', 'profile-interests', 'profile-children', 'profile-ethnicity', 'profile-humor', 'profile-sexual', 'profile-style', 'profile-smoke', 'profile-drink', 'profile-pets', 'profile-live', 'profile-hometown', 'profile-web', 'profile-passions', 'profile-sports', 'profile-activities', 'profile-country'];
    fields.forEach(field => {
        const el = $(typeof field === 'string' ? field : field.id);
        if (el) {
            const id = typeof field === 'string' ? field : field.id;
            const savedValue = storage.get(id);
            let defaultVal = '';
            if (id === 'profile-name') defaultVal = 'usuario';
            if (id === 'profile-status') defaultVal = 'Qual é a frase do seu perfil?';
            el.textContent = savedValue ? savedValue : defaultVal;
        }
    });

    updateSidebar();
    
    const savedImageUrl = storage.get('profile-image-url');
    if (savedImageUrl) {
        const profileImage = $('profile-image');
        if (profileImage) profileImage.src = savedImageUrl;
        const sidebarImage = document.getElementById('profile-image-sidebar');
        if (sidebarImage) sidebarImage.src = savedImageUrl;
    }

    let allCommunities = [];
    let commExpanded = false;
    const commList = qs('.comm-list');
    const viewAllCommBtn = $('view-all-comm');

    const loadCommunities = () => {
        return fetch('communities.json')
            .then(r => {
                if (!r.ok) throw new Error('Erro ao carregar arquivo');
                return r.json();
            })
            .then(d => {
                storage.setJson('allCommunities', d);
                return d;
            })
            .catch(err => {
                console.warn('Erro no fetch (possível bloqueio local), usando cache:', err);
                return storage.getJson('allCommunities', []);
            });
    };

    loadCommunities().then(data => {
            allCommunities = data;
            console.log('Total de comunidades carregadas:', allCommunities.length);
            
            if (!storage.get('default_comms_init_all')) {
                allCommunities.forEach(c => storage.set(`joined_comm_${c.id}`, 'true'));
                storage.set('default_comms_init_all', 'true');
            }

            const joinedComms = allCommunities.filter(c => storage.get(`joined_comm_${c.id}`) === 'true');

            const commCountEl = $('comm-count');
            if (commCountEl) {
                commCountEl.textContent = `comunidades (${joinedComms.length})`;
            }
            
            renderCommunities(joinedComms.slice(0, 6));

            const allCommsGrid = $('all-communities-grid');
            if (allCommsGrid) {
                joinedComms.forEach(comm => {
                    const html = `
                        <div class="card-large-item">
                            <a href="community.html?id=${comm.id}">
                                <img src="${comm.img}" alt="${comm.name}">
                            </a>
                            <a href="community.html?id=${comm.id}">
                                <span>${comm.name}</span>
                            </a>
                            <div style="color: #666; font-size: 10px; margin-top: 2px;">(${comm.members.toLocaleString('pt-BR')} membros)</div>
                        </div>`;
                    allCommsGrid.insertAdjacentHTML('beforeend', html);
                });
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

            const joinedComms = allCommunities.filter(c => storage.get(`joined_comm_${c.id}`) === 'true');
            if (!commExpanded) {
                renderCommunities(joinedComms);
                viewAllCommBtn.textContent = 'voltar';
                commExpanded = true;
            } else {
                renderCommunities(joinedComms.slice(0, 6));
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
    window.openReplyModal = openReplyModal;

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
                    author: storage.get('profile-name', 'usuario'),
                    text: replyText,
                    date: new Date().toLocaleDateString('pt-BR')
                };

                const system = replyContext.type === 'scrap' ? window.ScrapsSystem : window.TestimonialsSystem;
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
});