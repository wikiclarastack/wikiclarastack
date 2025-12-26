// Import Firebase
// Removed Firebase import as per update

// REMOVED Firebase initialization as per update

console.log("[v0] Site inicializado com sucesso (sem Firebase)")

// Global Variables
let currentUser = null
let currentLanguage = "en"
const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png"
// const lastChatTime = 0 // Removed as per updates
// const userPresenceRef = null // Removed as per updates

// Webhooks
const WEBHOOKS = {
  newUser:
    "https://discord.com/api/webhooks/1453870908946256136/m8Abdnk_2moAy2nojUYmJ6_slK5xbWZ3tBxahEemij9zBu8wf31n5nPmf2HG3I1gM1ax",
  suspended:
    "https://discord.com/api/webhooks/1453870994233233672/ECP6u8tLh4ui2t3HOagXinv9QkeAU8mUScKLKkiY47mFNejrQhGU9v3xRNaHI4UjeqfC",
  visitors:
    "https://discord.com/api/webhooks/1453871095672340612/U1fotOujLXmOESKp0JJXLEa3zcqGnImE2ENz_Vpw8ekLI81wD0uvDbTWIkHLMV9SE3K0",
}

// Translations
const translations = {
  en: {
    title: "Clara Stack",
    subtitle: "Actress",
    about: "About",
    works: "Works",
    gallery: "Gallery",
    chat: "Chat",
    login: "Login",
    register: "Register",
    settings: "Settings",
    adminPanel: "Admin Panel",
    knownFor: "Known For",
    itSeries: "IT: Welcome to Derry (HBO Max)",
    naughtyNine: "The Naughty Nine (Disney)",
    hawkeye: "Hawkeye (Marvel)",
    madamSecretary: "Madam Secretary",
    officialSocial: "Official Social Media",
    credits: "Website created by silva777only at no cost to the actress",
    copyright: "© 2025 Clara Stack Official Website. All rights reserved.",
    hboDisclaimer:
      "Images involving the IT: Welcome to Derry series are property of HBO Max. For removal requests, contact the website owner via the contact page.",
    username: "Username",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    loginBtn: "Login",
    registerBtn: "Register",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    sendMessage: "Send message...",
    profilePicture: "Profile Picture",
    changeName: "Change Name",
    changePassword: "Change Password",
    theme: "Theme",
    language: "Language",
    light: "Light",
    dark: "Dark",
    system: "System",
    save: "Save",
    users: "Users",
    posts: "Posts",
    dashboard: "Dashboard",
    userManagement: "User Management",
    postManagement: "Post Management",
    galleryManagement: "Gallery Management",
    chatControl: "Chat Control",
    maintenance: "Maintenance Mode",
    activeUsers: "Active Users",
    totalUsers: "Total Users",
    totalPosts: "Total Posts",
    verified: "Verified",
    admin: "Admin",
    ban: "Ban",
    unban: "Unban",
    makeAdmin: "Make Admin",
    removeAdmin: "Remove Admin",
    online: "Online",
    logout: "Logout",
    fillAllFields: "Please fill all fields!",
    userNotFound: "User not found!",
    incorrectPassword: "Incorrect password!",
    accountSuspended: "Your account is suspended. Contact the administrator.",
    loginSuccess: "Login successful!",
  },
  pt: {
    title: "Clara Stack",
    subtitle: "Atriz",
    about: "Sobre",
    works: "Trabalhos",
    gallery: "Galeria",
    chat: "Chat",
    login: "Entrar",
    register: "Registrar",
    settings: "Configurações",
    adminPanel: "Painel Admin",
    knownFor: "Conhecida Por",
    itSeries: "IT: Welcome to Derry (HBO Max)",
    naughtyNine: "The Naughty Nine (Disney)",
    hawkeye: "Hawkeye (Marvel)",
    madamSecretary: "Madam Secretary",
    officialSocial: "Redes Sociais Oficiais",
    credits: "Site criado por silva777only sem custo algum para a atriz",
    copyright: "© 2025 Site Oficial Clara Stack. Todos os direitos reservados.",
    hboDisclaimer:
      "As imagens que envolvem a série IT: Welcome to Derry são de propriedade da HBO Max. Caso queira a remoção, entre em contato com o dono do site via página de contato.",
    username: "Usuário",
    email: "Email",
    password: "Senha",
    confirmPassword: "Confirmar Senha",
    loginBtn: "Entrar",
    registerBtn: "Registrar",
    noAccount: "Não tem uma conta?",
    hasAccount: "Já tem uma conta?",
    sendMessage: "Enviar mensagem...",
    profilePicture: "Foto de Perfil",
    changeName: "Mudar Nome",
    changePassword: "Mudar Senha",
    theme: "Tema",
    language: "Idioma",
    light: "Claro",
    dark: "Escuro",
    system: "Sistema",
    save: "Salvar",
    users: "Usuários",
    posts: "Posts",
    dashboard: "Painel",
    userManagement: "Gerenciamento de Usuários",
    postManagement: "Gerenciamento de Posts",
    galleryManagement: "Gerenciamento de Galeria",
    chatControl: "Controle do Chat",
    maintenance: "Modo Manutenção",
    activeUsers: "Usuários Ativos",
    totalUsers: "Total de Usuários",
    totalPosts: "Total de Posts",
    verified: "Verificado",
    admin: "Admin",
    ban: "Banir",
    unban: "Desbanir",
    makeAdmin: "Tornar Admin",
    removeAdmin: "Remover Admin",
    online: "Online",
    logout: "Sair",
    fillAllFields: "Por favor, preencha todos os campos!",
    userNotFound: "Usuário não encontrado!",
    incorrectPassword: "Senha incorreta!",
    accountSuspended: "Sua conta está suspensa. Entre em contato com o administrador.",
    loginSuccess: "Login realizado com sucesso!",
  },
}

// Global variables (updated)
const maintenanceMode = false
let chatLocked = false
let chatCooldown = 0 // This will be updated from localStorage
let maintenancePassword = ""
let ipInfo = null // Declare ipInfo variable

// Utility Functions
function sendWebhook(url, data) {
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).catch((err) => console.error("Webhook error:", err))
}

async function getIPInfo() {
  try {
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()
    ipInfo = {
      ip: data.ip,
      city: data.city,
      country: data.country_name,
    }
    return ipInfo
  } catch (error) {
    console.error("Error getting IP:", error)
    ipInfo = { ip: "unknown", city: "unknown", country: "unknown" }
    return ipInfo
  }
}

function detectLanguage() {
  const userLang = navigator.language || navigator.userLanguage
  currentLanguage = userLang.startsWith("pt") ? "pt" : "en"
  updateLanguage()
}

function updateLanguage() {
  document.querySelectorAll("[data-translate]").forEach((el) => {
    const key = el.getAttribute("data-translate")
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = translations[currentLanguage][key]
      } else {
        el.textContent = translations[currentLanguage][key]
      }
    }
  })
  console.log("[v0] Idioma atualizado para:", currentLanguage)
}

// LocalStorage Helper Functions
function getUsers() {
  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users))
}

function getSettings() {
  const settings = localStorage.getItem("siteSettings")
  return settings
    ? JSON.parse(settings)
    : {
        maintenance: false,
        maintenancePassword: "admin", // Default password
      }
}

function saveSettings(settings) {
  localStorage.setItem("siteSettings", JSON.stringify(settings))
}

// Authentication Functions
function showAuthModal() {
  document.getElementById("authModal").style.display = "flex"
  showLoginForm()
}

function closeAuthModal() {
  document.getElementById("authModal").style.display = "none"
}

function showLoginForm() {
  document.getElementById("loginFormContainer").style.display = "block" // Changed from loginForm
  document.getElementById("registerFormContainer").style.display = "none" // Changed from registerForm
}

function showRegisterForm() {
  document.getElementById("loginFormContainer").style.display = "none" // Changed from loginForm
  document.getElementById("registerFormContainer").style.display = "block" // Changed from registerForm
}

async function handleLogin(e) {
  e.preventDefault()
  console.log("[v0] Tentando fazer login...")

  const username = document.getElementById("loginUsername").value.trim()
  const password = document.getElementById("loginPassword").value.trim() // Added trim

  if (!username || !password) {
    alert(translations[currentLanguage].fillAllFields)
    return
  }

  const users = getUsers()
  const user = users.find((u) => u.username === username)

  if (!user) {
    alert(translations[currentLanguage].userNotFound)
    return
  }

  if (user.password !== password) {
    alert(translations[currentLanguage].incorrectPassword)
    return
  }

  // Check IP
  const ipInfo = await getIPInfo()
  if (user.ip && user.ip !== ipInfo.ip) {
    user.suspended = true
    saveUsers(users) // Save changes

    sendWebhook(WEBHOOKS.suspended, {
      embeds: [
        {
          title: "🚫 Conta Suspensa / Account Suspended",
          description: `Usuário **${username}** foi suspenso por mudança de IP.`,
          color: 15158332,
          fields: [
            { name: "IP Original", value: user.ip, inline: true },
            { name: "Novo IP", value: ipInfo.ip, inline: true },
          ],
        },
      ],
    })

    alert("Sua conta foi suspensa por mudança de IP. Entre em contato com o administrador.")
    return
  }

  if (user.suspended) {
    alert(translations[currentLanguage].accountSuspended)
    return
  }

  // Update IP and location if first login or changed
  if (!user.ip || user.ip !== ipInfo.ip) {
    // Added condition to update if IP changed
    user.ip = ipInfo.ip
    user.location = `${ipInfo.city}, ${ipInfo.country}`
    saveUsers(users)
  }

  currentUser = user
  localStorage.setItem("currentUser", JSON.stringify(user))
  closeAuthModal()
  updateUIForLoggedInUser()

  alert(translations[currentLanguage].loginSuccess || `Bem-vindo(a), ${user.username}!`)
}

async function handleRegister(e) {
  e.preventDefault()
  console.log("[v0] Tentando registrar...")

  const username = document.getElementById("registerUsername").value.trim()
  const email = document.getElementById("registerEmail").value.trim()
  const password = document.getElementById("registerPassword").value.trim()
  const confirmPassword = document.getElementById("registerConfirmPassword").value.trim()

  if (!username || !email || !password || !confirmPassword) {
    alert(translations[currentLanguage].fillAllFields)
    return
  }

  if (password !== confirmPassword) {
    alert("As senhas não coincidem!")
    return
  }

  const users = getUsers()

  // Check unique username
  if (users.find((u) => u.username === username)) {
    alert("Este nome de usuário já existe!")
    return
  }

  // Check unique email
  if (users.find((u) => u.email === email)) {
    alert("Este email já está cadastrado!")
    return
  }

  const ipInfo = await getIPInfo()

  const newUser = {
    username,
    email,
    password,
    ip: ipInfo.ip,
    location: `${ipInfo.city}, ${ipInfo.country}`,
    avatar: DEFAULT_AVATAR,
    isVerified: false, // Corresponds to user.verified in updates
    isAdmin: false, // Corresponds to user.admin in updates
    suspended: false,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  // Send webhook
  sendWebhook(WEBHOOKS.newUser, {
    embeds: [
      {
        title: "✅ Novo Usuário Registrado / New User Registered",
        description: `**${username}** criou uma conta!`,
        color: 5763719,
        fields: [
          { name: "Email", value: email, inline: true },
          { name: "IP", value: ipInfo.ip, inline: true },
          { name: "Localização", value: `${ipInfo.city}, ${ipInfo.country}`, inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  })

  alert("Conta criada com sucesso! Faça login agora.")
  showLoginForm()

  // Clear form
  document.getElementById("registerForm").reset() // Use reset for the form element
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
  if (!currentUser) return

  console.log("[v0] Atualizando UI para usuário logado")

  // Update nav links
  const authLink = document.getElementById("authLink")
  if (authLink) {
    authLink.textContent = currentUser.username
    authLink.onclick = showSettings // Use function reference directly
  }

  // Show admin panel if admin
  const adminPanelLink = document.getElementById("adminPanelLink")
  if (adminPanelLink) {
    adminPanelLink.style.display = currentUser.isAdmin || currentUser.username === "admin" ? "block" : "none"
  }

  // Update corner profile display
  const userProfileCorner = document.getElementById("userProfileCorner")
  if (userProfileCorner) {
    userProfileCorner.style.display = "flex"
    const cornerUserAvatar = document.getElementById("cornerUserAvatar")
    const cornerUserName = document.getElementById("cornerUserName")
    if (cornerUserAvatar) cornerUserAvatar.src = currentUser.avatar || DEFAULT_AVATAR
    if (cornerUserName) cornerUserName.textContent = currentUser.username
  }

  // Enable chat input if logged in and not locked
  const chatInput = document.getElementById("chatInput")
  const sendChatBtn = document.getElementById("sendChatBtn")
  if (chatInput && sendChatBtn) {
    chatInput.disabled = false
    sendChatBtn.disabled = false
  }

  // Update login button visibility
  const loginBtn = document.getElementById("loginBtn")
  if (loginBtn) {
    loginBtn.style.display = "none"
  }

  // Show profile section if it exists
  const userProfileSection = document.getElementById("userProfile")
  if (userProfileSection) {
    userProfileSection.style.display = "flex"
    const profileImg = document.getElementById("profileImg")
    const profileUsername = document.getElementById("profileUsername")

    if (profileImg) profileImg.src = currentUser.profilePicture || currentUser.avatar || DEFAULT_AVATAR
    if (profileUsername) profileUsername.textContent = currentUser.username

    if (currentUser.isVerified) {
      profileUsername.innerHTML +=
        ' <img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" style="width: 16px; height: 16px; margin-left: 4px;">'
    }

    if (currentUser.isAdmin) {
      profileUsername.innerHTML +=
        ' <img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" style="width: 16px; height: 16px; margin-left: 4px;">'
      // Ensure adminPanelBtn is visible if current user is admin
      document.getElementById("adminPanelBtn").style.display = "block"
    }
  }
}

function logout() {
  console.log("[v0] Fazendo logout...")
  // setUserOnline(false) // Removed setUserOnline call
  currentUser = null
  localStorage.removeItem("currentUser")

  // Reset nav links
  const authLink = document.getElementById("authLink")
  if (authLink) {
    authLink.textContent = translations[currentLanguage].login
    authLink.onclick = showAuthModal
  }
  const settingsLink = document.getElementById("settingsLink")
  if (settingsLink) settingsLink.style.display = "none"
  const adminPanelLink = document.getElementById("adminPanelLink")
  if (adminPanelLink) adminPanelLink.style.display = "none"
  const userProfileCorner = document.getElementById("userProfileCorner")
  if (userProfileCorner) userProfileCorner.style.display = "none"

  // Close modals if open
  closeSettings()
  closeAdminPanel() // Assuming this function exists

  // Reset UI elements
  const loginBtn = document.getElementById("loginBtn")
  if (loginBtn) loginBtn.style.display = "inline-block" // Or appropriate default display

  const userProfileSection = document.getElementById("userProfile")
  if (userProfileSection) userProfileSection.style.display = "none"

  alert("Você saiu da conta!")
  location.reload() // Reload to reset the entire UI state
}

// Settings Functions
function showSettings() {
  document.getElementById("settingsModal").style.display = "flex"

  if (currentUser) {
    document.getElementById("settingsUsername").value = currentUser.username
    document.getElementById("settingsAvatar").value = currentUser.avatar || DEFAULT_AVATAR
    // Load theme and language from localStorage
    document.getElementById("themeSelect").value = localStorage.getItem("theme") || "system"
    document.getElementById("languageSelect").value = currentLanguage
  }
}

function closeSettings() {
  document.getElementById("settingsModal").style.display = "none"
}

function saveSettingsChanges() {
  if (!currentUser) return

  const newUsername = document.getElementById("settingsUsername").value.trim()
  const newAvatar = document.getElementById("settingsAvatar").value.trim()
  const newPassword = document.getElementById("settingsNewPassword").value.trim()
  const theme = document.getElementById("themeSelect").value // Use themeSelect and languageSelect IDs
  const language = document.getElementById("languageSelect").value

  const users = getUsers()
  const userIndex = users.findIndex((u) => u.username === currentUser.username)

  if (userIndex === -1) return

  // Check if username is unique
  if (newUsername !== currentUser.username && users.find((u) => u.username === newUsername)) {
    alert("Este nome de usuário já existe!")
    return
  }

  users[userIndex].username = newUsername
  users[userIndex].avatar = newAvatar || DEFAULT_AVATAR

  if (newPassword) {
    users[userIndex].password = newPassword
  }

  saveUsers(users)

  // Update currentUser object and localStorage
  currentUser.username = newUsername
  currentUser.avatar = newAvatar || DEFAULT_AVATAR
  localStorage.setItem("currentUser", JSON.stringify(currentUser))

  // Update theme
  applyTheme(theme) // Use the existing applyTheme function

  // Update language
  currentLanguage = language
  updateLanguage()

  updateUIForLoggedInUser()
  closeSettings()

  alert("Configurações salvas com sucesso!")
}

// Admin Panel Functions
function showAdminPanel() {
  if (!currentUser || (!currentUser.isAdmin && currentUser.username !== "admin")) {
    // Check against isAdmin property
    alert("Acesso negado!")
    return
  }

  document.getElementById("adminModal").style.display = "flex"
  loadAdminData()
}

function closeAdminPanel() {
  // Renamed from closeAdminPanel to match convention
  document.getElementById("adminModal").style.display = "none"
}

// Load admin data
async function loadAdminData() {
  try {
    const users = getUsers() // Get all users from localStorage

    // Load statistics
    const totalUsers = users.length
    const onlineUsersData = JSON.parse(localStorage.getItem("onlineUsers")) || {}
    const activeUsers = Object.keys(onlineUsersData).length

    const posts = JSON.parse(localStorage.getItem("posts")) || []
    const totalPosts = posts.length

    document.getElementById("totalUsersCount").textContent = totalUsers
    document.getElementById("activeUsersCountAdmin").textContent = activeUsers
    document.getElementById("totalPostsCount").textContent = totalPosts

    // Load users list
    const usersList = document.getElementById("adminUsersList")
    usersList.innerHTML = "" // Clear existing list

    users.forEach((user) => {
      // Iterate through the users array
      const userCard = document.createElement("div")
      userCard.className = "admin-user-card"
      userCard.innerHTML = `
            <img src="${user.avatar || DEFAULT_AVATAR}" alt="${user.username}">
            <div class="admin-user-info">
                <strong>${user.username}</strong>
                ${user.isVerified ? '<img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" class="verified-badge" alt="Verified">' : ""}
                ${user.isAdmin ? '<img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" class="admin-badge" alt="Admin">' : ""}
                <div>${user.email}</div>
                <div>IP: ${user.ip || "N/A"}</div>
                <div>Location: ${user.location || "N/A"}</div>
                ${user.suspended ? '<div class="status-suspended">Suspended</div>' : ""}
            </div>
            <div class="admin-user-actions">
                <button onclick="toggleVerified('${user.username}')">${user.isVerified ? "Remove Verified" : "Verify"}</button>
                <button onclick="toggleAdmin('${user.username}')">${user.isAdmin ? "Remove Admin" : "Make Admin"}</button>
                <button onclick="toggleBan('${user.username}')">${user.suspended ? "Unban" : "Ban"}</button>
            </div>
        `
      usersList.appendChild(userCard)
    })
  } catch (error) {
    console.error("[v0] Erro ao carregar dados admin:", error)
  }
}

// Toggle verified
window.toggleVerified = async (username) => {
  try {
    const users = getUsers()
    const userIndex = users.findIndex((u) => u.username === username)
    if (userIndex !== -1) {
      users[userIndex].isVerified = !users[userIndex].isVerified
      saveUsers(users)
      console.log("[v0] Verificação alterada para:", username)
      loadAdminData()
    }
  } catch (error) {
    console.error("[v0] Erro ao alterar verificação:", error)
  }
}

// Toggle admin
window.toggleAdmin = async (username) => {
  try {
    const users = getUsers()
    const userIndex = users.findIndex((u) => u.username === username)
    if (userIndex !== -1) {
      users[userIndex].isAdmin = !users[userIndex].isAdmin
      saveUsers(users)
      console.log("[v0] Status admin alterado para:", username)
      loadAdminData()
    }
  } catch (error) {
    console.error("[v0] Erro ao alterar admin:", error)
  }
}

// Toggle ban
window.toggleBan = async (username) => {
  try {
    const users = getUsers()
    const userIndex = users.findIndex((u) => u.username === username)
    if (userIndex !== -1) {
      const newStatus = !users[userIndex].suspended
      users[userIndex].suspended = newStatus
      saveUsers(users)

      if (newStatus) {
        sendWebhook(WEBHOOKS.suspended, {
          embeds: [
            {
              title: "🚫 Usuário Banido / User Banned",
              fields: [
                { name: "Usuário", value: username },
                { name: "Banido por", value: currentUser.username },
                { name: "Data", value: new Date().toLocaleString() },
              ],
              color: 15158332,
            },
          ],
        })
      }

      console.log("[v0] Status de banimento alterado para:", username)
      loadAdminData()
    }
  } catch (error) {
    console.error("[v0] Erro ao banir/desbanir:", error)
  }
}

// Controls for site settings
function toggleMaintenance() {
  const settings = getSettings()
  settings.maintenance = !settings.maintenance
  saveSettings(settings)

  if (settings.maintenance) {
    document.getElementById("maintenanceScreen").style.display = "flex"
  } else {
    document.getElementById("maintenanceScreen").style.display = "none"
  }

  alert(`Modo de manutenção ${settings.maintenance ? "ativado" : "desativado"}!`)
}

function checkMaintenancePassword() {
  const passwordInput = document.getElementById("maintenancePassword")
  const password = passwordInput.value
  const settings = getSettings()

  if (password === settings.maintenancePassword) {
    document.getElementById("maintenanceScreen").style.display = "none"
    alert("Acesso concedido!")
    passwordInput.value = "" // Clear password field
  } else {
    alert("Senha incorreta!")
  }
}

function toggleChatLock() {
  const settings = getSettings() // Reusing getSettings for simplicity, could have specific chat settings
  settings.chatLocked = !settings.chatLocked // Assuming chatLocked is a setting
  saveSettings(settings)
  chatLocked = settings.chatLocked // Update global variable
  console.log("[v0] Chat bloqueado:", chatLocked)
  alert(`Chat ${chatLocked ? "bloqueado" : "desbloqueado"}!`)
  updateChatUI() // Update UI to reflect lock status
}

function clearChat() {
  if (!confirm("Tem certeza que deseja apagar todas as mensagens?")) return

  localStorage.removeItem("chatMessages")
  console.log("[v0] Chat limpo")
  alert("Chat limpo com sucesso!")
  updateChatUI([]) // Update UI with empty messages
}

function setChatCooldown() {
  const seconds = prompt("Digite o cooldown em segundos (0 para desativar):")
  if (seconds === null) return

  const cooldown = Number.parseInt(seconds)
  if (isNaN(cooldown) || cooldown < 0) {
    alert("Valor inválido!")
    return
  }

  localStorage.setItem("chatCooldown", JSON.stringify(cooldown))
  chatCooldown = cooldown // Update global variable
  console.log("[v0] Cooldown definido:", chatCooldown)
  alert(`Cooldown definido para ${cooldown} segundos!`)
}

// Initialize
async function init() {
  console.log("[v0] Inicializando site...")

  // Detect language
  detectLanguage()

  // Send visitor webhook
  ipInfo = await getIPInfo()
  sendWebhook(WEBHOOKS.visitors, {
    embeds: [
      {
        title: "👁️ Novo Visitante / New Visitor",
        color: 3447003,
        fields: [
          { name: "IP", value: ipInfo.ip, inline: true },
          { name: "Location", value: `${ipInfo.city}, ${ipInfo.country}`, inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  })

  // Check maintenance
  const settings = getSettings()
  if (settings.maintenance) {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      const user = JSON.parse(savedUser)
      // Only show maintenance if user is not admin or the special 'admin' user
      if (!user.isAdmin && user.username !== "admin") {
        document.getElementById("maintenanceScreen").style.display = "flex"
      }
    } else {
      document.getElementById("maintenanceScreen").style.display = "flex"
    }
  }

  // Check logged in user
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    // Verify user in localStorage against current data (optional, but good practice)
    const users = getUsers()
    const userInDB = users.find((u) => u.username === currentUser.username)
    if (userInDB && !userInDB.suspended) {
      // Check IP consistency on load
      if (userInDB.ip !== ipInfo.ip) {
        // IP changed, suspend account
        suspendUser(currentUser.username, ipInfo.ip) // Call the suspend function
      } else {
        currentUser = userInDB // Ensure currentUser has the latest data
        updateUIForLoggedInUser()
      }
    } else {
      // User not found or suspended in DB, clear local storage
      localStorage.removeItem("currentUser")
      currentUser = null
    }
  }

  // Create default admin if not exists
  const users = getUsers()
  if (!users.find((u) => u.username === "admin")) {
    users.push({
      username: "admin",
      email: "admin@admin.com",
      password: "admin", // Default password for admin
      avatar: DEFAULT_AVATAR,
      isVerified: true, // Corresponds to verified in updates
      isAdmin: true, // Corresponds to admin in updates
      suspended: false,
      createdAt: new Date().toISOString(),
    })
    saveUsers(users)
  }

  // Load chat cooldown from localStorage
  chatCooldown = Number.parseInt(localStorage.getItem("chatCooldown") || "0")
  console.log("[v0] Chat cooldown:", chatCooldown)

  // Load chat lock status
  const savedChatLocked = localStorage.getItem("chatLocked")
  chatLocked = savedChatLocked ? JSON.parse(savedChatLocked) : false
  console.log("[v0] Chat bloqueado:", chatLocked)

  // Load maintenance password
  maintenancePassword = localStorage.getItem("maintenancePassword") || "admin" // Default password if not set
  console.log("[v0] Senha de manutenção:", maintenancePassword)

  // Listen to gallery changes
  const savedGallery = localStorage.getItem("gallery")
  if (savedGallery) {
    const gallery = JSON.parse(savedGallery)
    console.log("[v0] Galeria atualizada:", gallery.length, "itens")
    updateGalleryUI(gallery)
  }

  // Listen to posts changes
  const savedPosts = localStorage.getItem("posts")
  if (savedPosts) {
    const posts = JSON.parse(savedPosts)
    console.log("[v0] Posts atualizados:", posts.length, "itens")
    updatePostsUI(posts)
  }

  // Listen to chat messages
  const savedChatMessages = localStorage.getItem("chatMessages")
  if (savedChatMessages) {
    const messages = JSON.parse(savedChatMessages)
    console.log("[v0] Mensagens do chat atualizadas:", messages.length)
    updateChatUI(messages)
  }

  // Listen to online users
  const savedOnlineUsers = localStorage.getItem("onlineUsers")
  if (savedOnlineUsers) {
    const onlineUsers = JSON.parse(savedOnlineUsers)
    const count = Object.keys(onlineUsers).length
    console.log("[v0] Usuários online:", count)
    updateOnlineUsersUI(onlineUsers)
  }

  setupEventListeners()
  console.log("[v0] Site inicializado com sucesso!")
}

// Setup event listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const target = link.getAttribute("data-section")
      showSection(target)
    })
  })

  // Auth buttons
  document.getElementById("loginBtn")?.addEventListener("click", showAuthModal) // Use optional chaining
  document.getElementById("registerBtn")?.addEventListener("click", showAuthModal) // This might be redundant if loginBtn handles both

  // Close modals
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".modal").forEach((modal) => (modal.style.display = "none"))
    })
  })

  // Auth forms
  document.getElementById("showRegister")?.addEventListener("click", (e) => {
    // Use optional chaining
    e.preventDefault()
    showRegisterForm()
  })

  document.getElementById("showLogin")?.addEventListener("click", (e) => {
    // Use optional chaining
    e.preventDefault()
    showLoginForm()
  })

  document.getElementById("loginForm")?.addEventListener("submit", handleLogin) // Use optional chaining
  document.getElementById("registerForm")?.addEventListener("submit", handleRegister) // Use optional chaining

  // Chat
  document.getElementById("sendChatBtn")?.addEventListener("click", sendMessage) // Use optional chaining
  document.getElementById("chatInput")?.addEventListener("keypress", (e) => {
    // Use optional chaining
    if (e.key === "Enter") sendMessage()
  })

  // Settings
  document.getElementById("settingsBtn")?.addEventListener("click", showSettings) // Use optional chaining
  document.getElementById("settingsForm")?.addEventListener("submit", saveSettingsChanges) // Use optional chaining and correct handler name

  // Theme
  document.getElementById("themeSelect")?.addEventListener("change", (e) => {
    // Use optional chaining
    applyTheme(e.target.value)
  })

  // Language
  document.getElementById("languageSelect")?.addEventListener("change", (e) => {
    // Use optional chaining
    currentLanguage = e.target.value
    updateLanguage()
  })

  // Logout
  document.getElementById("logoutBtn")?.addEventListener("click", logout) // Use optional chaining

  // Admin panel
  document.getElementById("adminPanelBtn")?.addEventListener("click", showAdminPanel) // Use optional chaining
}

// Show section
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active")
  })
  document.getElementById(sectionId)?.classList.add("active") // Use optional chaining

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
  })
  document.querySelector(`[data-section="${sectionId}"]`)?.classList.add("active") // Use optional chaining
}

// Show auth modal (already exists, but ensuring consistency)
// function showAuthModal() {
//   document.getElementById("authModal").style.display = "flex"
//   showLoginForm()
// }

// Show login form (already exists, but ensuring consistency)
// function showLoginForm() {
//   document.getElementById("loginFormContainer").style.display = "block"
//   document.getElementById("registerFormContainer").style.display = "none"
// }

// Show register form (already exists, but ensuring consistency)
// function showRegisterForm() {
//   document.getElementById("loginFormContainer").style.display = "none"
//   document.getElementById("registerFormContainer").style.display = "block"
// }

// Handle login (already exists, but updated logic above)
// async function handleLogin(e) { ... }

// Handle register (already exists, but updated logic above)
// async function handleRegister(e) { ... }

// Send message
async function sendMessage() {
  if (!currentUser) {
    alert("Faça login para enviar mensagens!")
    return
  }

  if (chatLocked && !currentUser.isAdmin) {
    alert("O chat está bloqueado!")
    return
  }

  const input = document.getElementById("chatInput")
  const message = input.value.trim()

  if (!message) return

  // Check cooldown
  const lastMessageTime = Number.parseInt(localStorage.getItem("lastMessageTime") || "0")
  const now = Date.now()

  if (!currentUser.isAdmin && chatCooldown > 0) {
    const timePassed = (now - lastMessageTime) / 1000
    if (timePassed < chatCooldown) {
      alert(`Aguarde ${Math.ceil(chatCooldown - timePassed)} segundos para enviar outra mensagem!`)
      return
    }
  }

  try {
    const chatMessages = JSON.parse(localStorage.getItem("chatMessages")) || []
    chatMessages.push({
      username: currentUser.username,
      message,
      profilePicture: currentUser.avatar || DEFAULT_AVATAR, // Use avatar from currentUser
      isVerified: currentUser.isVerified,
      isAdmin: currentUser.isAdmin,
      timestamp: now,
    })
    localStorage.setItem("chatMessages", JSON.stringify(chatMessages))

    console.log("[v0] Mensagem enviada")
    localStorage.setItem("lastMessageTime", now.toString())
    input.value = ""
    updateChatUI(chatMessages) // Update UI immediately
  } catch (error) {
    console.error("[v0] Erro ao enviar mensagem:", error)
  }
}

// Update chat UI
function updateChatUI(messages = []) {
  const chatMessagesContainer = document.getElementById("chatMessages")

  if (chatLocked && (!currentUser || !currentUser.isAdmin)) {
    chatMessagesContainer.innerHTML =
      '<div style="text-align: center; padding: 20px; color: #999;">🔒 Chat bloqueado pelo administrador</div>'
    document.getElementById("chatInput").disabled = true
    document.getElementById("sendChatBtn").disabled = true
    return
  }

  if (!currentUser) {
    document.getElementById("chatInput").disabled = true
    document.getElementById("sendChatBtn").disabled = true
  } else {
    document.getElementById("chatInput").disabled = false
    document.getElementById("sendChatBtn").disabled = false
  }

  chatMessagesContainer.innerHTML = messages
    .map((msg) => {
      let badges = ""
      if (msg.isVerified) {
        badges +=
          '<img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" style="width: 14px; height: 14px; margin-left: 4px;">'
      }
      if (msg.isAdmin) {
        badges +=
          '<img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" style="width: 14px; height: 14px; margin-left: 4px;">'
      }

      const usernameColor = msg.isAdmin ? "color: #ff4444;" : ""

      return `
      <div class="chat-message">
        <img src="${msg.profilePicture}" alt="${msg.username}">
        <div>
          <div class="chat-username" style="${usernameColor}">
            ${msg.username}${badges}
            <span class="chat-time">${new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
          <div class="chat-text">${msg.message}</div>
        </div>
      </div>
    `
    })
    .join("")

  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight
}

// Update online users UI
function updateOnlineUsersUI(onlineUsers) {
  const container = document.getElementById("onlineUsersList")
  if (!container) return

  const users = Object.values(onlineUsers)
  container.innerHTML = users
    .map((user) => {
      let badges = ""
      if (user.isVerified) {
        badges +=
          '<img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" style="width: 12px; height: 12px; margin-left: 4px;">'
      }
      if (user.isAdmin) {
        badges +=
          '<img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" style="width: 12px; height: 12px; margin-left: 4px;">'
      }

      return `
      <div class="online-user">
        <img src="${user.profilePicture}" alt="${user.username}">
        <span>${user.username}${badges}</span>
        <span class="online-indicator">🟢</span>
      </div>
    `
    })
    .join("")

  // Update count
  const countElement = document.getElementById("onlineUsersCount")
  if (countElement) {
    countElement.textContent = users.length
  }
}

// Update gallery UI
function updateGalleryUI(gallery) {
  const container = document.getElementById("galleryGrid")
  if (!container) return

  container.innerHTML = gallery
    .map(
      (img, index) => `
    <div class="gallery-item">
      <img src="${img.url}" alt="Gallery image ${index + 1}">
    </div>
  `,
    )
    .join("")
}

// Update posts UI
function updatePostsUI(posts) {
  const container = document.getElementById("postsContainer")
  if (!container) return

  container.innerHTML = posts
    .map(
      (post) => `
    <div class="post">
      <div class="post-header">
        <img src="${post.authorPicture}" alt="${post.author}">
        <div>
          <strong>${post.author}</strong>
          <small>${new Date(post.timestamp).toLocaleString()}</small>
        </div>
      </div>
      <div class="post-content">${post.content}</div>
      ${post.image ? `<img src="${post.image}" alt="Post image">` : ""}
    </div>
  `,
    )
    .join("")
}

// Show settings (already exists, but updated logic above)
// function showSettings() { ... }

// Handle settings update (renamed to saveSettingsChanges)
// async function handleSettingsUpdate(e) { ... }

// Logout (already exists, but updated logic above)
// function logout() { ... }

// Admin Panel (already exists, but updated logic above)
// function showAdminPanel() { ... }

// Load admin data (already exists, but updated logic above)
// async function loadAdminData() { ... }

// Toggle verified (already exists, but updated logic above)
// window.toggleVerified = async (username) => { ... }

// Toggle admin (already exists, but updated logic above)
// window.toggleAdmin = async (username) => { ... }

// Toggle ban (already exists, but updated logic above)
// window.toggleBan = async (username) => { ... }

// Toggle chat lock (new function, added above)
// window.toggleChatLock = async () => { ... }

// Clear chat (new function, added above)
// window.clearChat = async () => { ... }

// Set chat cooldown (new function, added above)
// window.setChatCooldown = async () => { ... }

// Toggle maintenance (new function, added above)
// window.toggleMaintenance = async () => { ... }

// Add gallery image (new function, added above)
window.addGalleryImage = async () => {
  const url = prompt("Digite a URL da imagem:")
  if (!url) return

  try {
    const gallery = JSON.parse(localStorage.getItem("gallery")) || []
    gallery.push({ url, addedBy: currentUser?.username, timestamp: Date.now() }) // Added optional chaining for currentUser
    localStorage.setItem("gallery", JSON.stringify(gallery))
    console.log("[v0] Imagem adicionada à galeria")
    alert("Imagem adicionada com sucesso!")
    updateGalleryUI(gallery) // Update UI
  } catch (error) {
    console.error("[v0] Erro ao adicionar imagem:", error)
  }
}

// Create post (new function, added above)
window.createPost = async () => {
  const content = prompt("Digite o conteúdo do post:")
  if (!content) return

  try {
    const posts = JSON.parse(localStorage.getItem("posts")) || []
    posts.push({
      author: currentUser.username,
      authorPicture: currentUser.avatar || DEFAULT_AVATAR, // Use avatar
      content,
      timestamp: Date.now(),
    })
    localStorage.setItem("posts", JSON.stringify(posts))
    console.log("[v0] Post criado")
    alert("Post criado com sucesso!")
    updatePostsUI(posts) // Update UI
  } catch (error) {
    console.error("[v0] Erro ao criar post:", error)
  }
}

// Suspend user (new function, updated existing logic)
function suspendUser(username, newIP) {
  console.log("[v0] Suspendendo usuário:", username)
  const users = getUsers()
  const userIndex = users.findIndex((u) => u.username === username)
  if (userIndex !== -1) {
    users[userIndex].suspended = true
    saveUsers(users)

    sendWebhook(WEBHOOKS.suspended, {
      embeds: [
        {
          title: "🚫 Conta Suspensa - IP Alterado",
          fields: [
            { name: "Usuário", value: username },
            { name: "IP Original", value: users[userIndex].ip }, // Use stored IP
            { name: "IP Atual", value: newIP },
            { name: "Localização", value: `${ipInfo.city}, ${ipInfo.country}` }, // Assumes ipInfo is accessible or passed
            { name: "Data", value: new Date().toLocaleString() },
          ],
          color: 15158332,
        },
      ],
    })

    alert(
      translations[currentLanguage].accountSuspended ||
        "Sua conta foi suspensa devido a mudança de IP. Entre em contato com o administrador.",
    )
    logout()
  }
}

// Set user online status (Removed as Firebase presence is no longer used)
// function setUserOnline(online) { ... }

// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
  console.log("[v0] Página carregada, inicializando...")

  init() // Call the unified init function

  // Removed old initialization logic as it's now in init()
})

// Event Listeners (moved to init() for unified initialization)
// document.addEventListener('DOMContentLoaded', init);

// Login/Register form submissions (moved to init() for unified initialization)
document.getElementById("loginForm")?.addEventListener("submit", handleLogin)
document.getElementById("registerForm")?.addEventListener("submit", handleRegister)

// Close modals on background click (moved to init() for unified initialization)
window.onclick = (event) => {
  if (event.target.className === "modal") {
    // Assuming .modal class exists for background overlay
    event.target.style.display = "none"
  }
}

// Enter key support (moved to init() for unified initialization)
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const activeElement = document.activeElement
    if (activeElement.id === "chatInput") {
      sendMessage()
    }
  }
})

// Helper function to apply theme (moved from original script)
function applyTheme(theme) {
  if (theme === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    document.body.classList.toggle("dark-theme", isDark)
  } else {
    document.body.classList.toggle("dark-theme", theme === "dark")
  }
  localStorage.setItem("theme", theme)
  console.log("[v0] Tema aplicado:", theme)
}

// Helper function to initialize theme (moved from original script)
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "system"
  applyTheme(savedTheme)
}

// Initial call to initTheme when DOM is ready (moved into init())
// document.addEventListener("DOMContentLoaded", initTheme);

// Show maintenance screen (logic integrated into init and checkMaintenancePassword)
// function showMaintenanceScreen() { ... }

// Check maintenance password (logic integrated into checkMaintenancePassword)
// window.checkMaintenancePassword = () => { ... }

// window.checkMaintenancePassword = () => { ... }
