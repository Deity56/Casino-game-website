/********************************
 * DATA: Casino Games, Esports Events, Live Scores, Deposit/Withdrawal History
 ********************************/
const casinoGames = [
    { name: 'Blackjack', img: 'assets/Blackjack.jpg' },
    { name: 'Roulette', img: 'assets/roulette.png' },
    { name: 'Slots', img: 'assets/Slot.jpg' },
    { name: 'Poker', img: 'assets/poker.png' },
    { name: 'Baccarat', img: 'assets/baccarat.png' }
];

let userBalance = 100;  // Default user balance
let depositHistory = JSON.parse(localStorage.getItem('depositHistory')) || [];
let withdrawalHistory = JSON.parse(localStorage.getItem('withdrawalHistory')) || [];

/********************************
 * UI: Load Data (Games, Events, Scores)
 ********************************/
function loadCasinoGames() {
    const gameGrid = document.getElementById('gameGrid');
    if (gameGrid) {
        casinoGames.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.classList.add('game-card');
            gameCard.innerHTML = `
                <img src="${game.img}" alt="${game.name}" class="game-img">
                <h3>${game.name}</h3>
                <button>Play Now</button>
            `;
            gameGrid.appendChild(gameCard);
        });
    }
}

const footballEvents = [
    { name: 'UEFA Champions League', date: '2024-10-10', teams: 'Real Madrid vs Bayern Munich' },
    { name: 'English Premier League', date: '2024-10-12', teams: 'Manchester United vs Chelsea' },
    { name: 'La Liga', date: '2024-10-15', teams: 'Barcelona vs Atletico Madrid' }
];

function loadFootballEvents() {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = ''; // Clear the previous content

    footballEvents.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');
        eventCard.innerHTML = `
            <h3>${event.name}</h3>
            <p>${event.date}</p>
            <p>${event.teams}</p>
        `;
        eventList.appendChild(eventCard);
    });
}

function loadFootballScores() {
    const scoreList = document.getElementById('scoreList');
    if (scoreList) {
        liveFootballScores.forEach(score => {
            const scoreCard = document.createElement('div');
            scoreCard.classList.add('score-card');
            scoreCard.innerHTML = `
                <h3>${score.match}</h3>
                <p>${score.score}</p>
                <p>${score.status}</p>
            `;
            scoreList.appendChild(scoreCard);
        });
    }
}

const liveFootballScores = [
    { match: 'Team A vs Team B', score: '2 - 1', status: 'Ongoing' },
    { match: 'Team C vs Team D', score: '1 - 1', status: 'Full-Time' }
];

/********************************
 * MODAL: Sign-up and Sign-in Handling
 ********************************/
const signupModal = document.getElementById('signupModal');
const signinModal = document.getElementById('signinModal');
const usernameModal = document.getElementById('usernameModal');
const historyModal = document.getElementById('historyModal');

const signupBtn = document.getElementById('signupBtn');
const signinBtn = document.getElementById('loginBtn');
const closeSignup = document.getElementById('closeSignup');
const closeSignin = document.getElementById('closeSignin');
const closeUsernameModal = document.getElementById('closeUsernameModal');
const closeHistoryModal = document.getElementById('closeHistoryModal');

const signOutBtn = document.getElementById('signOutBtn'); // Sign Out Button

let isLoggedIn = false;  // Track user login state

// Open and close modals
if (signupBtn) signupBtn.onclick = () => signupModal.style.display = 'flex';
if (signinBtn) signinBtn.onclick = () => signinModal.style.display = 'flex';
if (closeSignup) closeSignup.onclick = () => signupModal.style.display = 'none';
if (closeSignin) closeSignin.onclick = () => signinModal.style.display = 'none';
if (closeUsernameModal) closeUsernameModal.onclick = () => usernameModal.style.display = 'none';
if (closeHistoryModal) closeHistoryModal.onclick = () => historyModal.style.display = 'none';

window.onclick = function (event) {
    if (event.target === signupModal) signupModal.style.display = 'none';
    if (event.target === signinModal) signinModal.style.display = 'none';
    if (event.target === usernameModal) usernameModal.style.display = 'none';
    if (event.target === historyModal) historyModal.style.display = 'none';
};

/********************************
 * USER AUTHENTICATION: Sign-up and Sign-in Logic
 ********************************/
document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const username = document.getElementById('signupUsername').value;

    let users = getUsers();

    // Check if the email already exists
    if (users.find(user => user.email === email)) {
        showNotification('Email already exists.');
        return;
    }

    // Create new user and save
    const newUser = { email, password, username, profilePic: 'assets/avatar.png', balance: userBalance };
    users.push(newUser);
    saveUsers(users);

    showNotification('Sign Up Successful!');
    signupModal.style.display = 'none';
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));
    updateUI();
});

document.getElementById('signinForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;

    let users = getUsers();
    let user = users.find(user => user.email === email && user.password === password);

    if (user) {
        showNotification('Sign In Successful!');
        signinModal.style.display = 'none';
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        updateUI();
    } else {
        showNotification('User does not exist or password is incorrect.');
    }
});

/********************************
 * PROFILE: Picture and Username Change
 ********************************/
const profilePic = document.getElementById('profilePic');
const profileImageInput = document.getElementById('profileImageInput');
const uploadProfileBtn = document.getElementById('uploadProfileBtn');
const changeUsernameBtn = document.getElementById('changeUsernameBtn');
const usernameDisplay = document.getElementById('usernameDisplay');
const walletContainer = document.getElementById('walletContainer');
const balanceAmount = document.getElementById('balanceAmount');

// Handle profile picture change
uploadProfileBtn.addEventListener('click', () => {
    if (isLoggedIn) {
        profileImageInput.click();  // Trigger file input click if signed in
    } else {
        showNotification('Please sign in first to change your profile picture.');
    }
});

profileImageInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profilePic.src = e.target.result;  // Set profile picture to selected image
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            loggedInUser.profilePic = e.target.result;
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

            let users = getUsers();
            users = users.map(user => user.email === loggedInUser.email ? loggedInUser : user);
            saveUsers(users);
        };
        reader.readAsDataURL(file);
    }
});

// Handle username change
changeUsernameBtn.addEventListener('click', () => {
    if (isLoggedIn) {
        usernameModal.style.display = 'flex';
    } else {
        alert("Please sign in first to change your username.");
    }
});

// Confirm Username Change
document.getElementById('confirmUsernameChange').addEventListener('click', () => {
    const newUsername = document.getElementById('newUsername').value;
    if (newUsername) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        loggedInUser.username = newUsername;
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        let users = getUsers();
        users = users.map(user => user.email === loggedInUser.email ? loggedInUser : user);
        saveUsers(users);
        usernameDisplay.textContent = newUsername;
        showNotification('Username changed successfully!');
        usernameModal.style.display = 'none';
    }
});

/********************************
 * SIGN OUT LOGIC
 ********************************/
signOutBtn.addEventListener('click', () => {
    clearInactivityTimer(); // Clear the inactivity timer
    localStorage.removeItem('loggedInUser');  // Clear user data from localStorage
    showNotification('Signed out successfully!');
    updateUI();  // Update UI to reflect sign out
});

/********************************
 * INACTIVITY TIMER
 ********************************/
function startInactivityTimer() {
    clearTimeout(inactivityTimer);  // Clear any existing timers
    inactivityTimer = setTimeout(() => {
        showNotification('Signed out due to inactivity.');
        localStorage.removeItem('loggedInUser');
        updateUI();
    }, 30000);  // 30 seconds inactivity timeout
}

// Reset the timer on any activity (mouse movement, key press, etc.)
window.addEventListener('mousemove', startInactivityTimer);
window.addEventListener('keydown', startInactivityTimer);

/********************************
 * NOTIFICATION HANDLING
 ********************************/
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notificationMessage');

function showNotification(message) {
    notificationMessage.textContent = message;  // Set the message text
    notification.classList.add('visible');      // Add the 'visible' class to show the notification
    setTimeout(() => {
        notification.classList.remove('visible');  // Remove the 'visible' class after 3 seconds
    }, 3000);
}

/********************************
 * UTILITY: User Data Storage and UI Update
 ********************************/
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function updateUI() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
        isLoggedIn = true;
        usernameDisplay.textContent = loggedInUser.username;
        profilePic.src = loggedInUser.profilePic;
        balanceAmount.textContent = `${loggedInUser.balance} USDT`;

        // Show the wallet, balance, and sign out button
        walletContainer.style.display = 'flex';
        signOutBtn.style.display = 'inline-block';

        // Hide the sign-in and sign-up buttons if user is signed in
        signinBtn.style.display = 'none';
        signupBtn.style.display = 'none';

        // Start the inactivity timer
        startInactivityTimer();
    } else {
        isLoggedIn = false;

        // Show the sign-in and sign-up buttons if no user is signed in
        signinBtn.style.display = 'inline-block';
        signupBtn.style.display = 'inline-block';

        // Hide the wallet, balance, and sign out button
        walletContainer.style.display = 'none';
        signOutBtn.style.display = 'none';

        // Clear the inactivity timer when the user is signed out
        clearInactivityTimer();
    }
}

/********************************
 * WALLET MODALS: Deposit and Withdrawal Handling
 ********************************/
const walletModal = document.getElementById('walletModal');
const depositModal = document.getElementById('depositModal');
const withdrawalModal = document.getElementById('withdrawalModal');

// Wallet buttons
walletBtn.addEventListener('click', () => walletModal.style.display = 'flex');
openDepositModal.addEventListener('click', () => {
    walletModal.style.display = 'none';
    depositModal.style.display = 'flex';
});
openWithdrawalModal.addEventListener('click', () => {
    walletModal.style.display = 'none';
    withdrawalModal.style.display = 'flex';
});
openHistoryModal.addEventListener('click', () => {
    walletModal.style.display = 'none';
    displayHistory();
    historyModal.style.display = 'flex';
});

// Deposit and Withdrawal confirmation
confirmDeposit.addEventListener('click', () => {
    const depositAmount = depositAmountInput.value;
    if (depositAmount) {
        showNotification(`Deposit of ${depositAmount} USDT pending.`);
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        loggedInUser.balance += parseFloat(depositAmount);
        depositHistory.push({ amount: depositAmount, date: new Date().toLocaleString() });
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        localStorage.setItem('depositHistory', JSON.stringify(depositHistory));
        updateUI();
        depositModal.style.display = 'none';
        depositAmountInput.value = '';
    } else {
        showNotification('Please enter a deposit amount.');
    }
});

confirmWithdrawal.addEventListener('click', () => {
    const withdrawAmount = withdrawAmountInput.value;
    const receivingAddress = receivingAddressInput.value;
    if (withdrawAmount && receivingAddress) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser.balance >= withdrawAmount) {
            showNotification(`Withdrawal of ${withdrawAmount} USDT pending.`);
            loggedInUser.balance -= parseFloat(withdrawAmount);
            withdrawalHistory.push({ amount: withdrawAmount, address: receivingAddress, date: new Date().toLocaleString() });
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            localStorage.setItem('withdrawalHistory', JSON.stringify(withdrawalHistory));
            updateUI();
            withdrawalModal.style.display = 'none';
            withdrawAmountInput.value = '';
            receivingAddressInput.value = '';
        } else {
            showNotification('Insufficient balance for withdrawal.');
        }
    } else {
        showNotification('Please enter the withdrawal amount and receiving address.');
    }
});

// Define your API key (replace 'YOUR_API_KEY' with the key you got from API-FOOTBALL)
const apiKey = 'd666f6b5a6d0bff313a987b9343aeeb6';
const liveApiUrl = 'https://v3.football.api-sports.io/fixtures?live=all';
const upcomingApiUrl = 'https://v3.football.api-sports.io/fixtures?next=10';

// Function to fetch live football scores
async function fetchLiveFootballScores() {
    try {
        const response = await fetch(liveApiUrl, {
            method: 'GET',
            headers: {
                'x-apisports-key': apiKey,  // Authentication header
            },
        });

        if (response.ok) {
            const data = await response.json();
            displayLiveFootballScores(data.response);
        } else {
            console.error('Failed to fetch live football scores');
        }
    } catch (error) {
        console.error('Error fetching live football scores:', error);
    }
}

// Function to display live football scores
function displayLiveFootballScores(fixtures) {
    const scoreList = document.getElementById('scoreList');
    scoreList.innerHTML = '';  // Clear the current scores

    if (fixtures.length === 0) {
        scoreList.innerHTML = '<p>No live football matches at the moment.</p>';
        return;
    }

    fixtures.forEach(fixture => {
        const status = fixture.status && fixture.status.long ? fixture.status.long : 'Unknown Status';
        const scoreCard = document.createElement('div');
        scoreCard.classList.add('score-card');
        scoreCard.innerHTML = `
            <h3>${fixture.teams.home.name} vs ${fixture.teams.away.name}</h3>
            <p>Score: ${fixture.goals.home} - ${fixture.goals.away}</p>
            <p>Status: ${status}</p>
        `;
        scoreList.appendChild(scoreCard);
    });
}

// Function to fetch upcoming football events
async function fetchUpcomingFootballEvents() {
    try {
        const response = await fetch(upcomingApiUrl, {
            method: 'GET',
            headers: {
                'x-apisports-key': apiKey
            }
        });

        const data = await response.json();
        displayUpcomingFootballEvents(data.response);
    } catch (error) {
        console.error('Error fetching upcoming football events:', error);
    }
}

// Function to display upcoming football events
function displayUpcomingFootballEvents(events) {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = '';

    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');
        eventCard.innerHTML = `
            <h3>${event.league.name}</h3>
            <p>${event.fixture.date}</p>
            <p>${event.teams.home.name} vs ${event.teams.away.name}</p>
        `;
        eventList.appendChild(eventCard);
    });
}


setInterval(fetchLiveFootballScores, 3000);
setInterval(fetchUpcomingFootballEvents, 3000);


window.onload = function () {
    loadCasinoGames();
    loadEsportsEvents();
    loadFootballScores();
    updateUI();
    fetchLiveFootballScores();
    fetchUpcomingFootballEvents()  
};
