document.addEventListener('DOMContentLoaded', function() {
    const $ = (id) => document.getElementById(id);
    const qs = (sel) => document.querySelector(sel);

    fetch('friends.json')
        .then(r => r.json())
        .then(data => {
            const extraFriendsData = data.extra || [];
            const initialFriendsData = data.initial || [];
            
            let friendsExpanded = false;
            
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

            const fullFriendsGrid = $('full-friends-grid');
            if (fullFriendsGrid) {
                const allFriends = [...initialFriendsData, ...extraFriendsData];
                allFriends.forEach(friend => {
                    const html = `
                        <div class="friend-card-large">
                            <img src="${friend.img}">
                            <span>${friend.name}</span>
                        </div>`;
                    fullFriendsGrid.insertAdjacentHTML('beforeend', html);
                });
            }
        })
        .catch(err => console.error('Erro ao carregar amigos:', err));
});