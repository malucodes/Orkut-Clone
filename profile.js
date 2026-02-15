document.addEventListener('DOMContentLoaded', function() {
    const $ = (id) => document.getElementById(id);
    const qs = (sel) => document.querySelector(sel);
    
    // Reutiliza helpers globais se disponíveis, senão define locais
    const storage = window.storage || {
        get: (k, d) => sessionStorage.getItem(k) || d,
        set: (k, v) => sessionStorage.setItem(k, v)
    };

    // --- Sorte do Dia ---
    fetch('profile.json')
        .then(r => r.json())
        .then(data => {
            const luckPhrases = data.luckPhrases || [];
            const luckEl = $('luck-of-day');
            if (luckEl && luckPhrases.length > 0) {
                const randomPhrase = luckPhrases[Math.floor(Math.random() * luckPhrases.length)];
                luckEl.innerHTML = `<span style="color: #cc0000; font-weight: bold;">Sorte do dia:</span> ${randomPhrase}`;
            }
        })
        .catch(err => console.error('Erro ao carregar perfil:', err));

    // --- Estatísticas (Fotos, Vídeos, Fãs) ---
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

    // --- Upload de Foto de Perfil ---
    const profileImage = $('profile-image');
    const profileUpload = $('profile-upload');
    
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

    // --- Edição de Perfil ---
    const editBtn = $('edit-profile-btn');
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

    if (editBtn) {
        editBtn.addEventListener('click', function() {
            const isEditing = editBtn.getAttribute('data-editing') === 'true';

            if (isEditing) {
                // Salvar
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
                    if (!el) return;
                    const input = el.querySelector('.edit-input');
                    if (input) {
                        let val = input.value;
                        if (field.type === 'date' && val) {
                            const parts = val.split('-');
                            if (parts.length === 3) val = `${parts[2]}/${parts[1]}/${parts[0]}`;
                        }
                        el.textContent = val;
                        storage.set(field.id, val);
                    }
                });
                
                if (window.updateSidebar) window.updateSidebar();
                editBtn.textContent = 'Editar Perfil';
                editBtn.setAttribute('data-editing', 'false');

            } else {
                // Editar
                fields.forEach(field => {
                    const el = $(field.id);
                    if (!el) return;
                    let text = el.textContent;
                    let inputHtml = '';
                    
                    if (field.type === 'textarea') {
                        inputHtml = `<textarea class="edit-input" rows="4" placeholder="escreva aqui...">${text}</textarea>`;
                    } else if (field.type === 'select') {
                        const optionsHtml = field.options.map(opt => `<option value="${opt}" ${text === opt ? 'selected' : ''}>${opt}</option>`).join('');
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
                        inputHtml = `<input type="text" class="edit-input" value="${text}" placeholder="escreva aqui..." ${onInputAttr}>`;
                    }
                    el.innerHTML = inputHtml;
                });

                editBtn.textContent = 'Salvar';
                editBtn.setAttribute('data-editing', 'true');
            }
        });
    }

    // --- Abas e Avaliações ---
    const tabSocial = $('tab-social');
    const tabProf = $('tab-prof');
    if (tabSocial && tabProf) {
        tabSocial.addEventListener('click', () => { tabSocial.classList.add('active'); tabProf.classList.remove('active'); });
        tabProf.addEventListener('click', () => { tabProf.classList.add('active'); tabSocial.classList.remove('active'); });
    }
});