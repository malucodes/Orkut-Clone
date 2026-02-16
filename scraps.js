document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.createMessageSystem === 'function') {
        fetch('scraps.json')
            .then(r => r.json())
            .then(data => {
                const Scraps = window.createMessageSystem('orkut_scraps', data, 'scrap-item', 'scrap');
                Scraps.renderAll();
                window.ScrapsSystem = Scraps;
            })
            .catch(err => console.error('Erro ao carregar scraps:', err));
    }
});