document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.createMessageSystem === 'function') {
        fetch('testimonials.json')
            .then(r => r.json())
            .then(data => {
                const Testimonials = window.createMessageSystem('orkut_testimonials', data, 'testimonial-item', 'testimonial');
                Testimonials.renderAll();
                window.TestimonialsSystem = Testimonials; // Expor para o modal de resposta
            })
            .catch(err => console.error('Erro ao carregar depoimentos:', err));
    }
});