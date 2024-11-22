document.addEventListener('DOMContentLoaded', () => {
    // Płynne przewijanie do sekcji po kliknięciu w link
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animacja licznika trofeów
    const trophyCounts = document.querySelectorAll('.trophy-count');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const trophyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const count = parseInt(entry.target.textContent);
                animateCount(entry.target, count);
                trophyObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    trophyCounts.forEach(count => {
        trophyObserver.observe(count);
    });

    function animateCount(element, target) {
        let current = 0;
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = target / steps;
        const stepTime = duration / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }

    // Animacja banera Champions League
    const banner = document.querySelector('.champions-league-banner');
    if (banner) {
        let position = 0;
        setInterval(() => {
            position -= 1;
            banner.querySelector('.trophy-icons').style.backgroundPosition = `${position}px center`;
        }, 50);
    }

    // Zarządzanie zawodnikami
    let players = [];

    // Dodaj istniejących zawodników z HTML
    document.querySelectorAll('.player-card').forEach(card => {
        const name = card.querySelector('h3').textContent;
        const number = card.querySelector('.player-number').textContent;
        const position = card.querySelector('.player-info p:first-child').textContent.replace('Pozycja: ', '');
        
        players.push({ name, number, position });
    });

    // Aktualizuj licznik i komunikat
    updatePlayerCount();

    // Funkcja aktualizująca licznik zawodników
    function updatePlayerCount() {
        const playersCount = players.length;
        const playersNeeded = 11 - playersCount;
        
        const counterDiv = document.createElement('div');
        counterDiv.id = 'player-counter';
        counterDiv.style.textAlign = 'center';
        counterDiv.style.margin = '20px 0';
        counterDiv.style.fontWeight = 'bold';
        counterDiv.style.color = '#FAB90A';
        
        const validationDiv = document.createElement('div');
        validationDiv.id = 'validation-message';
        validationDiv.style.textAlign = 'center';
        validationDiv.style.margin = '10px 0';
        
        if (playersCount < 11) {
            counterDiv.textContent = `Liczba zawodników: ${playersCount}`;
            validationDiv.textContent = `Potrzebujesz jeszcze ${playersNeeded} zawodników do minimalnego składu`;
            validationDiv.style.color = '#FAB90A';
        } else {
            counterDiv.textContent = `Liczba zawodników: ${playersCount}`;
            validationDiv.textContent = 'Masz wystarczającą liczbę zawodników!';
            validationDiv.style.color = '#FAB90A';
        }

        let counterContainer = document.querySelector('#player-counter');
        if (!counterContainer) {
            counterContainer = document.createElement('div');
            counterContainer.id = 'player-counter-container';
            const playersGrid = document.querySelector('.players-grid');
            playersGrid.parentNode.insertBefore(counterContainer, playersGrid);
        } else {
            counterContainer.innerHTML = '';
        }

        counterContainer.appendChild(counterDiv);
        counterContainer.appendChild(validationDiv);
    }

    // Dodaj przycisk "Usuń" do każdej karty zawodnika
    document.querySelectorAll('.player-card').forEach((card, index) => {
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Usuń';
        removeBtn.style.backgroundColor = '#0B1F3F';
        removeBtn.style.color = 'white';
        removeBtn.style.border = 'none';
        removeBtn.style.padding = '5px 10px';
        removeBtn.style.borderRadius = '4px';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.marginTop = '10px';
        
        removeBtn.onclick = () => {
            players.splice(index, 1);
            card.remove();
            updatePlayerCount();
        };
        
        card.querySelector('.player-info').appendChild(removeBtn);
    });

    // Dodaj formularz do dodawania nowych zawodników
    const formContainer = document.createElement('div');
    formContainer.style.display = 'flex';
    formContainer.style.gap = '10px';
    formContainer.style.margin = '20px';
    formContainer.style.padding = '20px';
    formContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
    formContainer.style.borderRadius = '8px';
    formContainer.style.flexWrap = 'wrap';

    const nameInput = document.createElement('input');
    nameInput.placeholder = 'Imię zawodnika';
    nameInput.style.padding = '8px';
    nameInput.style.borderRadius = '4px';
    nameInput.style.border = '1px solid #ddd';
    nameInput.style.flex = '1';

    const numberInput = document.createElement('input');
    numberInput.type = 'number';
    numberInput.placeholder = 'Numer';
    numberInput.style.padding = '8px';
    numberInput.style.borderRadius = '4px';
    numberInput.style.border = '1px solid #ddd';
    numberInput.style.flex = '1';

    const positionInput = document.createElement('input');
    positionInput.placeholder = 'Pozycja';
    positionInput.style.padding = '8px';
    positionInput.style.borderRadius = '4px';
    positionInput.style.border = '1px solid #ddd';
    positionInput.style.flex = '1';

    const addButton = document.createElement('button');
    addButton.textContent = 'Dodaj zawodnika';
    addButton.style.padding = '8px 16px';
    addButton.style.backgroundColor = '#0B1F3F';
    addButton.style.color = 'white';
    addButton.style.border = 'none';
    addButton.style.borderRadius = '4px';
    addButton.style.cursor = 'pointer';

    formContainer.appendChild(nameInput);
    formContainer.appendChild(numberInput);
    formContainer.appendChild(positionInput);
    formContainer.appendChild(addButton);

    const playersGrid = document.querySelector('.players-grid');
    playersGrid.parentNode.insertBefore(formContainer, playersGrid);

    // Obsługa dodawania nowego zawodnika
    addButton.onclick = () => {
        if (nameInput.value && numberInput.value && positionInput.value) {
            const newPlayer = {
                name: nameInput.value,
                number: numberInput.value,
                position: positionInput.value
            };

            players.push(newPlayer);

            const playerCard = document.createElement('div');
            playerCard.className = 'player-card';
            playerCard.innerHTML = `
                <div class="player-image-container">
                    <img src="https://via.placeholder.com/300x400" alt="${newPlayer.name}">
                    <div class="player-stats">
                        <div class="stat">
                            <span class="label">Gole</span>
                            <span class="value">0</span>
                        </div>
                        <div class="stat">
                            <span class="label">Asysty</span>
                            <span class="value">0</span>
                        </div>
                    </div>
                </div>
                <h3>${newPlayer.name}</h3>
                <p class="player-number">${newPlayer.number}</p>
                <div class="player-info">
                    <p>Pozycja: ${newPlayer.position}</p>
                    <button onclick="this.parentElement.parentElement.remove(); updatePlayerCount();" style="background-color: #0B1F3F; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 10px;">Usuń</button>
                </div>
            `;

            playersGrid.appendChild(playerCard);
            updatePlayerCount();

            // Wyczyść formularz
            nameInput.value = '';
            numberInput.value = '';
            positionInput.value = '';
        }
    };
});
