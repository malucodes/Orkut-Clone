document.addEventListener('DOMContentLoaded', function() {
    const $ = (id) => document.getElementById(id);
    const qs = (sel) => document.querySelector(sel);

    fetch('friends.json')
        .then(r => r.json())
        .then(data => {
            const extraFriendsData = data.extra || [];
            const initialFriendsData = data.initial || [];
            const allFriends = [...initialFriendsData, ...extraFriendsData];
            
            let friendsCountEl = $('friends-count');
            
            if (!friendsCountEl) {
                const friendsGrid = qs('.friends-grid');
                if (friendsGrid) {
                    const parent = friendsGrid.closest('.card') || friendsGrid.parentElement;
                    if (parent) {
                        friendsCountEl = parent.querySelector('h3') || parent.querySelector('h4') || parent.querySelector('.box-header') || parent.querySelector('strong');
                    }
                }
            }

            if (friendsCountEl) {
                if (friendsCountEl.children.length > 0) {
                    let updated = false;
                    friendsCountEl.childNodes.forEach(node => {
                        if (node.nodeType === 3 && node.nodeValue.trim()) {
                            if (/\d+/.test(node.nodeValue)) {
                                node.nodeValue = node.nodeValue.replace(/\d+/, allFriends.length);
                                updated = true;
                            }
                        }
                    });
                    if (!updated) {
                        friendsCountEl.insertAdjacentText('beforeend', ` (${allFriends.length})`);
                    }
                } else {
                    const currentText = friendsCountEl.textContent.trim();
                    if (/\d+/.test(currentText)) {
                        friendsCountEl.textContent = currentText.replace(/\d+/, allFriends.length);
                    } else {
                        friendsCountEl.textContent = currentText ? `${currentText} (${allFriends.length})` : `amigos (${allFriends.length})`;
                    }
                }
            }
            
            const friendsGrid = qs('.friends-grid');
            if (friendsGrid) {
                friendsGrid.innerHTML = '';
                initialFriendsData.forEach(friend => {
                    const friendHtml = `<div class="friend-item"><img src="${friend.img}"><span>${friend.name}</span></div>`;
                    friendsGrid.insertAdjacentHTML('beforeend', friendHtml);
                });
            }

            const viewAllFriendsBtn = document.getElementById('view-all-friends');
            if (viewAllFriendsBtn) {
                viewAllFriendsBtn.style.display = 'inline-block';
                
                const manageBtn = $('manage-friends');
                if (manageBtn) {
                    viewAllFriendsBtn.insertAdjacentElement('afterend', manageBtn);
                    manageBtn.style.display = 'inline-block';
                    manageBtn.style.marginLeft = '10px';
                }

                let friendsExpanded = false;

                viewAllFriendsBtn.addEventListener('click', function(e) {
                    e.preventDefault();
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
                if (fullFriendsGrid.parentElement) {
                    fullFriendsGrid.parentElement.style.width = '100%';
                }

                fullFriendsGrid.style.display = 'grid';
                fullFriendsGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
                fullFriendsGrid.style.gap = '10px';
                fullFriendsGrid.style.width = '100%';
                fullFriendsGrid.innerHTML = '';
                allFriends.forEach(friend => {
                    const html = `
                        <div class="friend-item" style="text-align: center;">
                            <img src="${friend.img}" style="width: 100px; height: 100px; object-fit: cover; border: 1px solid #ccc; padding: 2px; background: #fff;">
                            <span style="display: block; margin-top: 5px;">${friend.name}</span>
                        </div>`;
                    fullFriendsGrid.insertAdjacentHTML('beforeend', html);
                });

                if (!document.querySelector('.orkut-footer')) {
                    const footerHtml = `<div class="orkut-footer"><img src="assets/images/orkut-logo.png" style="height: 20px;"><div class="footer-links"><a href="#">Sobre o Orkut</a> | <a href="#">Centro de Segurança</a> | <a href="#">Privacidade</a> | <a href="#">Termos</a> | <a href="#">Contato</a></div><div style="flex-grow: 1; text-align: right; font-size: 10px; color: #999;">© 2006 Google</div></div>`;
                    const mainWrapper = qs('.main-wrapper');
                    if (mainWrapper) {
                        mainWrapper.insertAdjacentHTML('beforeend', footerHtml);
                    } else {
                        fullFriendsGrid.parentElement.insertAdjacentHTML('afterend', footerHtml);
                    }
                }
            }
        })
        .catch(err => console.error('Erro ao carregar amigos:', err));
});