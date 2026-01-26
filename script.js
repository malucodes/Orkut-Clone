document.addEventListener('DOMContentLoaded', function() {
    const editBtn = document.getElementById('edit-profile-btn');
    
    // Mapeamento dos campos que podem ser editados
    // id: ID do elemento HTML
    // type: tipo de input a ser criado (input simples ou textarea para textos longos)
    const fields = [
        { id: 'profile-name', type: 'input' },
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

    // Atualizar nome na barra lateral se tiver sido carregado
    const mainNameEl = document.getElementById('profile-name');
    const sidebarNameEl = document.getElementById('sidebar-name');
    if (mainNameEl && sidebarNameEl) {
        sidebarNameEl.textContent = mainNameEl.textContent;
    }

    if (editBtn) {
        editBtn.addEventListener('click', function() {
            // Verifica se estamos no modo de edição checando um atributo customizado
            const isEditing = editBtn.getAttribute('data-editing') === 'true';

            if (isEditing) {
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
                
                // Atualiza também o nome na barra lateral esquerda para ficar igual
                const mainName = document.getElementById('profile-name').textContent;
                const sidebarName = document.getElementById('sidebar-name');
                if (sidebarName) {
                    sidebarName.textContent = mainName;
                }

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
    if (profileImage) {
        // Carregar imagem salva
        const savedImageUrl = localStorage.getItem('profile-image-url');
        if (savedImageUrl) {
            profileImage.src = savedImageUrl;
        }

        profileImage.addEventListener('click', function() {
            const imageUrl = prompt('Por favor, insira a URL da nova foto de perfil:');
            if (imageUrl && imageUrl.trim() !== "") {
                profileImage.src = imageUrl;
                localStorage.setItem('profile-image-url', imageUrl);
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
            updateCount('friends');
        });
    }

    // Funcionalidade para expandir comunidades
    const extraCommData = [
        { name: 'Eu amo sexta-feira', img: 'https://picsum.photos/30?random=14' },
        { name: 'Frio é melhor que calor', img: 'https://picsum.photos/30?random=15' },
        { name: 'Não fui eu', img: 'https://picsum.photos/30?random=16' }
    ];
    let commExpanded = false;

    const viewAllCommBtn = document.getElementById('view-all-comm');
    if (viewAllCommBtn) {
        viewAllCommBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const commList = document.querySelector('.comm-list');

            if (!commExpanded) {
                extraCommData.forEach(comm => {
                    const commHtml = `<div class="comm-item extra-item"><img src="${comm.img}"><span>${comm.name}</span></div>`;
                    commList.insertAdjacentHTML('beforeend', commHtml);
                });
                viewAllCommBtn.textContent = 'voltar';
                commExpanded = true;
            } else {
                const extras = commList.querySelectorAll('.extra-item');
                extras.forEach(item => item.remove());
                viewAllCommBtn.textContent = 'ver todas';
                commExpanded = false;
            }
            updateCount('comm');
        });
    }

    // Função auxiliar para atualizar contadores
    function updateCount(type) {
        if (type === 'friends') {
            const count = document.querySelectorAll('.friend-item').length;
            document.getElementById('friends-count').textContent = `amigos (${count})`;
        } else if (type === 'comm') {
            const count = document.querySelectorAll('.comm-item').length;
            document.getElementById('comm-count').textContent = `comunidades (${count})`;
        }
    }

    // Inicializa contadores corretos
    updateCount('friends');
    updateCount('comm');

    // Funcionalidade de Gerenciar (Amigos e Comunidades)
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
                // Só apaga se estiver no modo de gerenciamento
                if (container.classList.contains('managing')) {
                    const item = e.target.closest(itemSelector);
                    if (item) {
                        item.remove();
                        updateCount(type);
                    }
                }
            });
        }
    }
});