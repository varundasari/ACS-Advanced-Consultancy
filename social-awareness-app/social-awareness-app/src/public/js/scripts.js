
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('input[type="text"]');
    const authLink = document.getElementById('auth-link');

    
    searchInput.addEventListener('input', function(event) {
        const query = event.target.value.toLowerCase();
        const campaigns = document.querySelectorAll('.campaign');
        
        campaigns.forEach(campaign => {
            const title = campaign.querySelector('h2').textContent.toLowerCase();
            const description = campaign.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                campaign.style.display = 'block';
            } else {
                campaign.style.display = 'none';
            }
        });
    });

    
    authLink.addEventListener('click', function(event) {
        
        if (authLink.textContent === 'Login') {
            
            window.location.href = '/auth/login';
        } else {
            
            window.location.href = '/auth/logout';
        }
    });
});
