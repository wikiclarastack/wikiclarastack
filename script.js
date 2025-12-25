// Global Variables
let currentUser = null;
let currentLanguage = 'en';
let users = JSON.parse(localStorage.getItem('users')) || [];
let chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
let visitors = JSON.parse(localStorage.getItem('visitors')) || [];

// Discord Webhooks
const WEBHOOKS = {
    newUser: 'https://discord.com/api/webhooks/1453870908946256136/m8Abdnk_2moAy2nojUYmJ6_slK5xbWZ3tBxahEemij9zBu8wf31n5nPmf2HG3I1gM1ax',
    suspended: 'https://discord.com/api/webhooks/1453870994233233672/ECP6u8tLh4ui2t3HOagXinv9QkeAU8mUScKLKkiY47mFNejrQhGU9v3xRNaHI4UjeqfC',
    visitors: 'https://discord.com/api/webhooks/1453871095672340612/U1fotOujLXmOESKp0JJXLEa3zcqGnImE2ENz_Vpw8ekLI81wD0uvDbTWIkHLMV9SE3K0'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    detectRegion();
    initTheme();
    logVisitor();
    checkSession();
    setupEventListeners();
    loadChatMessages();
    updateLanguage();
});

// Detect Region
async function detectRegion() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        currentLanguage = data.country_code === 'BR' ? 'pt' : 'en';
        updateLanguage();
    } catch (error) {
        console.log('Region detection failed, using default');
    }
}

// Update Language
function updateLanguage() {
    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute(`data-${currentLanguage}`);
        if (text) el.textContent = text;
    });
    
    document.querySelectorAll('[data-en-placeholder]').forEach(el => {
        const placeholder = el.getAttribute(`data-${currentLanguage}-placeholder`);
        if (placeholder) el.placeholder = placeholder;
    });
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDark ? 'dark' : 'light';
    }
    
    if (theme === 'light') {
        document.body.setAttribute('data-theme', 'light');
    } else {
        document.body.removeAttribute('data-theme');
    }
}

// Get IP Address
async function getIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'unknown';
    }
}

// Log Visitor
async function logVisitor() {
    const ip = await getIPAddress();
    const timestamp = new Date().toISOString();
    const visitor = { ip, timestamp };
    
    visitors.push(visitor);
    localStorage.setItem('visitors', JSON.stringify(visitors));
    
    await sendWebhook(WEBHOOKS.visitors, {
        content: `New visitor: IP ${ip} at ${new Date().toLocaleString()}`
    });
}

// Send Webhook
async function sendWebhook(url, data) {
    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Webhook error:', error);
    }
}

// Check Session
async function checkSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        const currentIP = await getIPAddress();
        
        if (user.ip !== currentIP) {
            // Suspend account
            const userIndex = users.findIndex(u => u.username === user.username);
            if (userIndex !== -1) {
                users[userIndex].suspended = true;
                localStorage.setItem('users', JSON.stringify(users));
                
                await sendWebhook(WEBHOOKS.suspended, {
                    content: `Account suspended: ${user.username} (IP changed from ${user.ip} to ${currentIP})`
                });
            }
            
            logout();
            alert(currentLanguage === 'en' ? 
                'Your account has been suspended due to IP change. Contact admin.' : 
                'Sua conta foi suspensa devido a mudança de IP. Contate o administrador.');
        } else {
            currentUser = user;
            updateUIForLoggedInUser();
        }
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Login/Register Buttons
    document.getElementById('loginBtn').addEventListener('click', () => openModal('loginModal'));
    document.getElementById('registerBtn').addEventListener('click', () => openModal('registerModal'));
    document.getElementById('settingsBtn')?.addEventListener('click', () => openModal('settingsModal'));
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    
    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('saveSettings')?.addEventListener('click', saveSettings);
    
    // Chat
    document.getElementById('sendMessage').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
    
    // Theme
    document.getElementById('themeSelect')?.addEventListener('change', (e) => {
        localStorage.setItem('theme', e.target.value);
        applyTheme(e.target.value);
    });
    
    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Admin tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            switchAdminTab(tab);
        });
    });
}

// Modal Management
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    if (modalId === 'settingsModal') {
        loadSettings();
    }
    if (modalId === 'adminModal') {
        loadAdminPanel();
    }
}

// Handle Register
async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const ip = await getIPAddress();
    
    if (users.find(u => u.username === username)) {
        alert(currentLanguage === 'en' ? 'Username already exists' : 'Nome de usuário já existe');
        return;
    }
    
    const newUser = {
        username,
        email,
        password,
        ip,
        verified: false,
        suspended: false,
        registeredAt: new Date().toISOString(),
        profilePic: null
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    await sendWebhook(WEBHOOKS.newUser, {
        content: `New registration: ${username} (${email}) from IP ${ip}`
    });
    
    document.getElementById('registerModal').style.display = 'none';
    alert(currentLanguage === 'en' ? 'Registration successful! Please login.' : 'Registro bem-sucedido! Faça login.');
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const ip = await getIPAddress();
    
    // Admin login
    if (username === 'admin' && password === 'admin') {
        currentUser = { username: 'admin', isAdmin: true, ip };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        document.getElementById('loginModal').style.display = 'none';
        openModal('adminModal');
        return;
    }
    
    // Regular user login
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        alert(currentLanguage === 'en' ? 'Invalid credentials' : 'Credenciais inválidas');
        return;
    }
    
    if (user.suspended) {
        alert(currentLanguage === 'en' ? 'Your account is suspended' : 'Sua conta está suspensa');
        return;
    }
    
    if (user.ip !== ip) {
        user.suspended = true;
        localStorage.setItem('users', JSON.stringify(users));
        
        await sendWebhook(WEBHOOKS.suspended, {
            content: `Account suspended: ${username} (IP mismatch: ${user.ip} vs ${ip})`
        });
        
        alert(currentLanguage === 'en' ? 
            'IP address changed. Account suspended.' : 
            'Endereço IP alterado. Conta suspensa.');
        return;
    }
    
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUIForLoggedInUser();
    document.getElementById('loginModal').style.display = 'none';
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForLoggedInUser();
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const userMenu = document.getElementById('userMenu');
    
    if (currentUser) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        userMenu.style.display = 'flex';
        document.getElementById('usernameDisplay').textContent = currentUser.username;
        
        if (currentUser.isAdmin) {
            document.getElementById('usernameDisplay').textContent += ' (Admin)';
        }
    } else {
        loginBtn.style.display = 'block';
        registerBtn.style.display = 'block';
        userMenu.style.display = 'none';
    }
}

// Settings
function loadSettings() {
    if (!currentUser || currentUser.isAdmin) return;
    
    document.getElementById('settingsUsername').value = currentUser.username;
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.getElementById('themeSelect').value = savedTheme;
}

function saveSettings() {
    if (!currentUser || currentUser.isAdmin) return;
    
    const newUsername = document.getElementById('settingsUsername').value;
    const newPassword = document.getElementById('settingsPassword').value;
    const profilePicInput = document.getElementById('profilePicture');
    
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    
    if (userIndex !== -1) {
        if (newUsername !== currentUser.username) {
            users[userIndex].username = newUsername;
            currentUser.username = newUsername;
        }
        
        if (newPassword) {
            users[userIndex].password = newPassword;
        }
        
        if (profilePicInput.files && profilePicInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                users[userIndex].profilePic = e.target.result;
                currentUser.profilePic = e.target.result;
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            };
            reader.readAsDataURL(profilePicInput.files[0]);
        }
        
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        alert(currentLanguage === 'en' ? 'Settings saved!' : 'Configurações salvas!');
        document.getElementById('settingsModal').style.display = 'none';
        updateUIForLoggedInUser();
    }
}

// Chat
function loadChatMessages() {
    const chatMessagesContainer = document.getElementById('chatMessages');
    chatMessagesContainer.innerHTML = '';
    
    chatMessages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${msg.verified ? 'verified' : ''}`;
        messageDiv.innerHTML = `
            <div class="message-username">${msg.username}</div>
            <div class="message-text">${msg.message}</div>
            <div class="message-time">${new Date(msg.timestamp).toLocaleString()}</div>
        `;
        chatMessagesContainer.appendChild(messageDiv);
    });
    
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function sendChatMessage() {
    if (!currentUser || currentUser.isAdmin) {
        alert(currentLanguage === 'en' ? 'Please login to chat' : 'Faça login para usar o chat');
        return;
    }
    
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatMessage = {
        username: currentUser.username,
        message,
        verified: currentUser.verified,
        timestamp: new Date().toISOString()
    };
    
    chatMessages.push(chatMessage);
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    
    input.value = '';
    loadChatMessages();
}

// Admin Panel
function loadAdminPanel() {
    loadUsersList();
    loadChatLogs();
    loadVisitorsList();
}

function switchAdminTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.querySelector(`[data-content="${tab}"]`).classList.add('active');
}

function loadUsersList() {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';
    
    users.forEach((user, index) => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-item';
        userDiv.innerHTML = `
            <div><strong>${user.username}</strong> ${user.verified ? '<span class="verified-badge">✓ Verified</span>' : ''} ${user.suspended ? '<span class="banned-badge">Suspended</span>' : ''}</div>
            <div>Email: ${user.email}</div>
            <div>IP: ${user.ip}</div>
            <div>Registered: ${new Date(user.registeredAt).toLocaleString()}</div>
            <div class="user-actions">
                <button class="btn-primary btn-verify" onclick="toggleVerify(${index})">${user.verified ? 'Unverify' : 'Verify'}</button>
                <button class="btn-primary btn-ban" onclick="toggleBan(${index})">${user.suspended ? 'Unban' : 'Ban'}</button>
                <button class="btn-secondary btn-view" onclick="viewUserLogs('${user.username}')">View Logs</button>
            </div>
        `;
        usersList.appendChild(userDiv);
    });
}

function loadChatLogs() {
    const chatLogs = document.getElementById('chatLogs');
    chatLogs.innerHTML = '';
    
    chatMessages.forEach(msg => {
        const logDiv = document.createElement('div');
        logDiv.className = 'chat-log-item';
        logDiv.innerHTML = `
            <div><strong>${msg.username}</strong> ${msg.verified ? '✓' : ''}</div>
            <div>${msg.message}</div>
            <div>${new Date(msg.timestamp).toLocaleString()}</div>
        `;
        chatLogs.appendChild(logDiv);
    });
}

function loadVisitorsList() {
    const visitorsList = document.getElementById('visitorsList');
    visitorsList.innerHTML = '';
    
    visitors.forEach(visitor => {
        const visitorDiv = document.createElement('div');
        visitorDiv.className = 'visitor-item';
        visitorDiv.innerHTML = `
            <div>IP: ${visitor.ip}</div>
            <div>Time: ${new Date(visitor.timestamp).toLocaleString()}</div>
        `;
        visitorsList.appendChild(visitorDiv);
    });
}

async function toggleVerify(index) {
    users[index].verified = !users[index].verified;
    localStorage.setItem('users', JSON.stringify(users));
    loadUsersList();
}

async function toggleBan(index) {
    users[index].suspended = !users[index].suspended;
    localStorage.setItem('users', JSON.stringify(users));
    
    if (users[index].suspended) {
        await sendWebhook(WEBHOOKS.suspended, {
            content: `Account suspended by admin: ${users[index].username}`
        });
    }
    
    loadUsersList();
}

function viewUserLogs(username) {
    const userMessages = chatMessages.filter(msg => msg.username === username);
    alert(`Messages from ${username}:\n\n${userMessages.map(m => `${new Date(m.timestamp).toLocaleString()}: ${m.message}`).join('\n')}`);
}
