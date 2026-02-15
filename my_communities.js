document.addEventListener('DOMContentLoaded', function() {
    const $ = (id) => document.getElementById(id);
    const storage = window.storage;
    
    // Helper to format numbers
    const formatNumber = (num) => num.toLocaleString('pt-BR');

    fetch('communities.json')
        .then(r => r.json())
        .then(data => {
            // Inicializa comunidades padrão se não existirem
            if (!storage.get('default_comms_init_all')) {
                data.forEach(c => storage.set(`joined_comm_${c.id}`, 'true'));
                storage.set('default_comms_init_all', 'true');
            }

            const grid = $('all-communities-grid');
            if (grid) {
                // Filtra apenas as comunidades que o usuário participa
                const joinedComms = data.filter(c => storage.get(`joined_comm_${c.id}`) === 'true');

                joinedComms.forEach(comm => {
                    const html = `
                        <div class="community-card-large">
                            <a href="community.html?id=${comm.id}">
                                <img src="${comm.img}" alt="${comm.name}">
                            </a>
                            <a href="community.html?id=${comm.id}">
                                <span>${comm.name}</span>
                            </a>
                            <div style="color: #666; font-size: 10px; margin-top: 2px;">(${formatNumber(comm.members)} membros)</div>
                        </div>`;
                    grid.insertAdjacentHTML('beforeend', html);
                });
            }
        })
        .catch(err => console.error('Erro ao carregar comunidades:', err));
});