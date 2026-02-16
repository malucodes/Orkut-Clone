document.addEventListener('DOMContentLoaded', function() {
    const $ = (id) => document.getElementById(id);
    const storage = window.storage;
    
    const formatNumber = (num) => num.toLocaleString('pt-BR');

    fetch('communities.json')
        .then(r => r.json())
        .then(data => {
            if (!storage.get('default_comms_init_all')) {
                data.forEach(c => storage.set(`joined_comm_${c.id}`, 'true'));
                storage.set('default_comms_init_all', 'true');
            }

            const grid = $('all-communities-grid');
            if (grid) {
                grid.innerHTML = '';
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

                if (!document.querySelector('.orkut-footer')) {
                    const footerHtml = `<div class="orkut-footer"><img src="assets/images/orkut-logo.png" style="height: 20px;"><div class="footer-links"><a href="#">Sobre o Orkut</a> | <a href="#">Centro de Segurança</a> | <a href="#">Privacidade</a> | <a href="#">Termos</a> | <a href="#">Contato</a></div><div style="flex-grow: 1; text-align: right; font-size: 10px; color: #999;">© 2006 Google</div></div>`;
                    const mainWrapper = document.querySelector('.main-wrapper');
                    if (mainWrapper) {
                        mainWrapper.insertAdjacentHTML('beforeend', footerHtml);
                    } else {
                        grid.parentElement.insertAdjacentHTML('afterend', footerHtml);
                    }
                }
            }
        })
        .catch(err => console.error('Erro ao carregar comunidades:', err));
});