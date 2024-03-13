document.addEventListener('DOMContentLoaded', function () {
    const cardsContainer = document.getElementById('cardsContainer');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const paginationBulletsContainer = document.getElementById('paginationBullets');
    let currentPage = 1;
    let totalPages = 1;

    // Fetch and display initial set of users
    fetchAndDisplayUsers(currentPage);

    // Pagination event listeners
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchAndDisplayUsers(currentPage);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchAndDisplayUsers(currentPage);
        }
    });

    // Function to fetch and display users for a given page
    function fetchAndDisplayUsers(page) {
        fetch(`/api/users?count=6&page=${page}`)
            .then(response => response.json())
            .then(data => {
                const { users, totalCount } = data;
                totalPages = Math.ceil(totalCount / 6);
                updatePaginationBullets(currentPage, totalPages);
                renderUsers(users);
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    // Function to render users on the page
    function renderUsers(users) {
        // Clear previous cards
        cardsContainer.innerHTML = '';

        // Iterate over users and create card elements
        users.forEach(user => {
            // Fetch profile picture for the user
            fetch(`/api/pfp/${user.id}`)
                .then(response => {
                    if (response.ok) {
                        return response.blob();
                    } else if (response.status === 404) {
                        return 'default'; // Use default image URL
                    } else {
                        throw new Error('Failed to fetch profile picture');
                    }
                })
                .then(blobOrUrl => {
                    // If blobOrUrl is a Blob object, create Blob URL
                    const imageUrl = blobOrUrl === 'default' ? 'https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg' : URL.createObjectURL(blobOrUrl);

                    // Create card HTML
                    const cardHTML = `
                    <div class="card">
                        <div class="left">
                            <img src="${imageUrl}" alt="Profile Picture">
                        </div>
                        <div class="divider"></div>
                        <div class="right">
                            <h2>${user.username}</h2>
                            <p class="description">${getRandomDescription(user)}</p>
                            <a href="/${user.username}"><button class="visit__button">Visit</button></a>
                        </div>
                    </div>
                `;
                    cardsContainer.insertAdjacentHTML('beforeend', cardHTML);
                })
                .catch(error => console.error('Error fetching profile picture:', error));
        });
    }

    // Function to update pagination bullets
    function updatePaginationBullets(currentPage, totalPages) {
        // Clear previous bullets
        paginationBulletsContainer.innerHTML = '';

        // Add bullets for each page
        for (let i = 1; i <= totalPages; i++) {
            const bullet = document.createElement('span');
            bullet.classList.add('bullet');
            if (i === currentPage) {
                bullet.classList.add('active');
            }
            bullet.addEventListener('click', createBulletClickHandler(i));
            paginationBulletsContainer.appendChild(bullet);
        }
    }

    // Function to create a click handler for pagination bullets
    function createBulletClickHandler(pageNumber) {
        return function () {
            currentPage = pageNumber;
            fetchAndDisplayUsers(currentPage);
            // Update active class for pagination bullets
            const bullets = document.querySelectorAll('.bullet');
            bullets.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        };
    }







    // Function to generate a random description
    function getRandomDescription(user) {
        // Array of descriptions
        const descriptions = [
            `Discover new connections with ${user.username} on LinkserV!`,
            `Meet ${user.username} and expand your professional circle.`,
            `Connect with ${user.username} and unlock opportunities.`,
            `Join ${user.username} and explore the professional world.`,
            `Get inspired by ${user.username}'s journey and insights.`,
            `Explore the expertise of ${user.username}.`,
            `Connect with ${user.username} and elevate your career journey.`,
            `Embark on a journey of growth with ${user.username}.`,
            `Start building meaningful connections with ${user.username} today!`,
            `Discover opportunities and insights with ${user.username}.`,
            `Explore ${user.username}'s unique perspective.`,
            `Connect with ${user.username} for a professional boost.`,
            `Let ${user.username} be your guide to success.`,
            `Unlock new opportunities with ${user.username}.`,
            `Connect with ${user.username} and pave the way for collaboration.`,
            `Join ${user.username} in the pursuit of excellence!`,
            `Connect with ${user.username} and broaden your horizons.`,
            `Engage with ${user.username} to drive innovation.`,
            `Discover new possibilities with ${user.username} as your partner.`,
            `Connect with ${user.username} to create lasting relationships.`,
            // Branded descriptions
            `Visit ${user.username}'s LinkserV page here!`,
            `Take your professional network to the next level with LinkserV.`,
            `Connect with industry leaders and peers on LinkserV.`,
            `Unlock career opportunities and insights on LinkserV.`,
            `Join the LinkserV community and expand your horizons.`,
            `Discover new connections and collaborations through LinkserV.`,
            `Elevate your professional journey with LinkserV.`,
            `Experience growth and development with LinkserV.`,
            `Connect with LinkserV to empower your career.`,
            // Add more variations and branded descriptions here
        ];
        const randomIndex = Math.floor(Math.random() * descriptions.length);
        return descriptions[randomIndex];
    }

});
