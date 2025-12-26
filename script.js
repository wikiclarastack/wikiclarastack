// Global Variables
let currentUser = null
let currentLanguage = "en"
const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png"
const lastChatTime = 0
const userPresenceRef = null

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
let maintenanceMode = false
let chatLocked = false
let chatCooldown = 0 // This will be updated from localStorage
let maintenancePassword = ""

function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "{}")
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users))
}

function getUser(username) {
  const users = getUsers()
  return users[username] || null
}

function saveUser(username, userData) {
  const users = getUsers()
  users[username] = userData
  saveUsers(users)
}

// Send webhook to Discord
async function sendWebhook(url, data) {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    console.log("[v0] Webhook enviado com sucesso")
  } catch (error) {
    console.error("[v0] Erro ao enviar webhook:", error)
  }
}

// Get user IP and location
async function getUserIPInfo() {
  try {
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()
    console.log("[v0] IP Info obtido:", data)
    return {
      ip: data.ip,
      city: data.city,
      country: data.country_name,
      region: data.region,
    }
  } catch (error) {
    console.error("[v0] Erro ao obter IP:", error)
    return { ip: "unknown", city: "Unknown", country: "Unknown", region: "Unknown" }
  }
}

// Detect user language
function detectLanguage() {
  const browserLang = navigator.language || navigator.userLanguage
  currentLanguage = browserLang.startsWith("en") ? "en" : "pt"
  console.log("[v0] Idioma detectado:", currentLanguage)
  updateLanguage()
}

// Update language
function updateLanguage() {
  const t = translations[currentLanguage]
  document.querySelectorAll("[data-translate]").forEach((element) => {
    const key = element.getAttribute("data-translate")
    if (t[key]) {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.placeholder = t[key]
      } else {
        element.textContent = t[key]
      }
    }
  })
  console.log("[v0] Idioma atualizado para:", currentLanguage)
}

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "system"
  applyTheme(savedTheme)
}

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

// Initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
  console.log("[v0] Página carregada, inicializando...")

  initTheme()
  detectLanguage()

  const ipInfo = await getUserIPInfo()

  // Send visitor webhook
  sendWebhook(WEBHOOKS.visitors, {
    // Changed from WEBHOOKS.siteVisitors to WEBHOOKS.visitors
    embeds: [
      {
        title: "👁️ Novo Visitante",
        fields: [
          { name: "IP", value: ipInfo.ip },
          { name: "Localização", value: `${ipInfo.city}, ${ipInfo.country}` },
          { name: "Data", value: new Date().toLocaleString() },
        ],
        color: 3447003,
      },
    ],
  })

  // Check maintenance mode
  const savedMaintenanceMode = localStorage.getItem("maintenanceMode")
  if (savedMaintenanceMode) {
    maintenanceMode = JSON.parse(savedMaintenanceMode)
    console.log("[v0] Modo manutenção:", maintenanceMode)
    if (maintenanceMode && (!currentUser || !currentUser.isAdmin)) {
      showMaintenanceScreen()
    }
  }

  // Check chat locked
  const savedChatLocked = localStorage.getItem("chatLocked")
  if (savedChatLocked) {
    chatLocked = JSON.parse(savedChatLocked)
    console.log("[v0] Chat bloqueado:", chatLocked)
    updateChatUI()
  }

  // Check chat cooldown
  chatCooldown = Number.parseInt(localStorage.getItem("chatCooldown") || "0")
  console.log("[v0] Chat cooldown:", chatCooldown)

  // Check maintenance password
  maintenancePassword = localStorage.getItem("maintenancePassword") || ""
  console.log("[v0] Senha de manutenção:", maintenancePassword)

  // Check if user is logged in
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    const user = JSON.parse(savedUser)
    // Verify user in localStorage
    const dbUser = getUser(user.username)
    if (dbUser && !dbUser.suspended) {
      if (dbUser.ip !== ipInfo.ip) {
        // IP changed, suspend account
        suspendUser(user.username, ipInfo.ip)
      } else {
        currentUser = dbUser
        updateUIForLoggedInUser()
        setUserOnline(true)
      }
    } else {
      localStorage.removeItem("currentUser")
    }
  }

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
})

// Suspend user
function suspendUser(username, newIP) {
  console.log("[v0] Suspendendo usuário:", username)
  const users = getUsers()
  users[username].suspended = true
  saveUsers(users)

  sendWebhook(WEBHOOKS.suspended, {
    // Changed from WEBHOOKS.suspendedAccounts to WEBHOOKS.suspended
    embeds: [
      {
        title: "🚫 Conta Suspensa",
        fields: [
          { name: "Usuário", value: username },
          { name: "Motivo", value: "Mudança de IP" },
          { name: "Novo IP", value: newIP },
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

// Set user online status
function setUserOnline(online) {
  if (!currentUser) return

  console.log("[v0] Atualizando status online:", online)

  const onlineUsers = JSON.parse(localStorage.getItem("onlineUsers")) || {}
  if (online) {
    onlineUsers[currentUser.username] = {
      username: currentUser.username,
      profilePicture: currentUser.profilePicture,
      isVerified: currentUser.isVerified,
      isAdmin: currentUser.isAdmin,
      timestamp: Date.now(),
    }
    localStorage.setItem("onlineUsers", JSON.stringify(onlineUsers))
  } else {
    delete onlineUsers[currentUser.username]
    localStorage.setItem("onlineUsers", JSON.stringify(onlineUsers))
  }
}

// Show maintenance screen
function showMaintenanceScreen() {
  document.body.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; text-align: center;">
      <h1 style="font-size: 48px; margin-bottom: 20px;">🔧</h1>
      <h2>Site em Manutenção</h2>
      <p>Voltaremos em breve!</p>
      <div style="margin-top: 30px;">
        <input type="password" id="maintenancePassword" placeholder="Senha de acesso" style="padding: 10px; margin-right: 10px;">
        <button onclick="checkMaintenancePassword()">Entrar</button>
      </div>
    </div>
  `
}

window.checkMaintenancePassword = () => {
  const password = document.getElementById("maintenancePassword").value
  if (password === maintenancePassword) {
    location.reload()
  } else {
    alert("Senha incorreta!")
  }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
  console.log("[v0] Atualizando UI para usuário logado")
  document.getElementById("loginBtn").style.display = "none"
  document.getElementById("userProfile").style.display = "flex"
  document.getElementById("profileImg").src = currentUser.profilePicture
  document.getElementById("profileUsername").textContent = currentUser.username

  if (currentUser.isVerified) {
    document.getElementById("profileUsername").innerHTML +=
      ' <img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" style="width: 16px; height: 16px; margin-left: 4px;">'
  }

  if (currentUser.isAdmin) {
    document.getElementById("profileUsername").innerHTML +=
      ' <img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" style="width: 16px; height: 16px; margin-left: 4px;">'
    document.getElementById("adminPanelBtn").style.display = "block"
  }

  // Enable chat
  document.getElementById("chatInput").disabled = false
  document.getElementById("sendChatBtn").disabled = false
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
  document.getElementById("loginBtn").addEventListener("click", showAuthModal)
  document.getElementById("registerBtn").addEventListener("click", showAuthModal) // This might be redundant if loginBtn handles both

  // Close modals
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".modal").forEach((modal) => (modal.style.display = "none"))
    })
  })

  // Auth forms
  document.getElementById("showRegister").addEventListener("click", (e) => {
    e.preventDefault()
    showRegisterForm()
  })

  document.getElementById("showLogin").addEventListener("click", (e) => {
    e.preventDefault()
    showLoginForm()
  })

  document.getElementById("loginForm").addEventListener("submit", handleLogin)
  document.getElementById("registerForm").addEventListener("submit", handleRegister)

  // Chat
  document.getElementById("sendChatBtn").addEventListener("click", sendMessage)
  document.getElementById("chatInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage()
  })

  // Settings
  document.getElementById("settingsBtn").addEventListener("click", showSettings)
  document.getElementById("settingsForm").addEventListener("submit", handleSettingsUpdate)

  // Theme
  document.getElementById("themeSelect").addEventListener("change", (e) => {
    applyTheme(e.target.value)
  })

  // Language
  document.getElementById("languageSelect").addEventListener("change", (e) => {
    currentLanguage = e.target.value
    updateLanguage()
  })

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", logout)

  // Admin panel
  document.getElementById("adminPanelBtn")?.addEventListener("click", showAdminPanel)
}

// Show section
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active")
  })
  document.getElementById(sectionId).classList.add("active")

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
  })
  document.querySelector(`[data-section="${sectionId}"]`).classList.add("active")
}

// Show auth modal
function showAuthModal() {
  document.getElementById("authModal").style.display = "flex"
  showLoginForm()
}

// Show login form
function showLoginForm() {
  document.getElementById("loginFormContainer").style.display = "block"
  document.getElementById("registerFormContainer").style.display = "none"
}

// Show register form
function showRegisterForm() {
  document.getElementById("loginFormContainer").style.display = "none"
  document.getElementById("registerFormContainer").style.display = "block"
}

// Handle login
async function handleLogin(e) {
  e.preventDefault()
  console.log("[v0] Tentando fazer login...")

  const username = document.getElementById("loginUsername").value.trim()
  const password = document.getElementById("loginPassword").value

  if (!username || !password) {
    alert(translations[currentLanguage].fillAllFields)
    return
  }

  const user = getUser(username)

  if (!user) {
    alert(translations[currentLanguage].userNotFound || "Usuário não encontrado!")
    return
  }

  if (user.password !== password) {
    alert(translations[currentLanguage].incorrectPassword || "Senha incorreta!")
    return
  }

  if (user.suspended) {
    alert(
      translations[currentLanguage].accountSuspended ||
        "Sua conta está suspensa. Entre em contato com o administrador.",
    )
    return
  }

  const ipInfo = await getUserIPInfo()

  if (user.ip !== ipInfo.ip) {
    user.suspended = true
    saveUser(username, user)

    sendWebhook(WEBHOOKS.suspended, {
      embeds: [
        {
          title: "🚫 Conta Suspensa - IP Alterado",
          fields: [
            { name: "Usuário", value: username },
            { name: "IP Original", value: user.ip },
            { name: "IP Atual", value: ipInfo.ip },
            { name: "Localização", value: `${ipInfo.city}, ${ipInfo.country}` },
            { name: "Data", value: new Date().toLocaleString() },
          ],
          color: 15158332,
        },
      ],
    })

    alert("Seu IP mudou! Sua conta foi suspensa por segurança. Entre em contato com o administrador.")
    return
  }

  currentUser = user
  localStorage.setItem("currentUser", JSON.stringify(user))

  console.log("[v0] Login realizado com sucesso")
  updateUIForLoggedInUser()
  document.getElementById("authModal").style.display = "none"
  document.getElementById("loginForm").reset()

  alert(translations[currentLanguage].loginSuccess || "Login realizado com sucesso!")
}

// Handle register
async function handleRegister(e) {
  e.preventDefault()
  console.log("[v0] Tentando registrar...")

  const username = document.getElementById("registerUsername").value.trim()
  const email = document.getElementById("registerEmail").value.trim()
  const password = document.getElementById("registerPassword").value
  const confirmPassword = document.getElementById("registerConfirmPassword").value

  if (!username || !email || !password || !confirmPassword) {
    alert(translations[currentLanguage].fillAllFields)
    return
  }

  if (password !== confirmPassword) {
    alert("As senhas não coincidem!")
    return
  }

  const users = getUsers()

  if (users[username]) {
    alert("Este nome de usuário já está em uso!")
    return
  }

  const emailExists = Object.values(users).some((u) => u.email === email)
  if (emailExists) {
    alert("Este email já está cadastrado!")
    return
  }

  const ipInfo = await getUserIPInfo()

  const newUser = {
    username,
    email,
    password,
    ip: ipInfo.ip,
    profilePicture:
      "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png",
    isVerified: false,
    isAdmin: username === "admin" && password === "admin",
    canPostImages: false,
    suspended: false,
    createdAt: Date.now(),
  }

  saveUser(username, newUser)

  console.log("[v0] Registro realizado com sucesso")

  sendWebhook(WEBHOOKS.newUser, {
    embeds: [
      {
        title: "✅ Novo Usuário Registrado",
        fields: [
          { name: "Usuário", value: username },
          { name: "Email", value: email },
          { name: "IP", value: ipInfo.ip },
          { name: "Localização", value: `${ipInfo.city}, ${ipInfo.country}` },
          { name: "Data", value: new Date().toLocaleString() },
        ],
        color: 3066993,
      },
    ],
  })

  alert("Conta criada com sucesso! Faça login para continuar.")
  showLoginForm()
  document.getElementById("registerForm").reset()
}

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
      profilePicture: currentUser.profilePicture,
      isVerified: currentUser.isVerified,
      isAdmin: currentUser.isAdmin,
      timestamp: now,
    })
    localStorage.setItem("chatMessages", JSON.stringify(chatMessages))

    console.log("[v0] Mensagem enviada")
    localStorage.setItem("lastMessageTime", now.toString())
    input.value = ""
  } catch (error) {
    console.error("[v0] Erro ao enviar mensagem:", error)
  }
}

// Update chat UI
function updateChatUI(messages = []) {
  const chatMessages = document.getElementById("chatMessages")

  if (chatLocked && (!currentUser || !currentUser.isAdmin)) {
    chatMessages.innerHTML =
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

  chatMessages.innerHTML = messages
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

  chatMessages.scrollTop = chatMessages.scrollHeight
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

// Show settings
function showSettings() {
  document.getElementById("settingsModal").style.display = "flex"

  // Load current settings
  document.getElementById("settingsUsername").value = currentUser.username
  document.getElementById("themeSelect").value = localStorage.getItem("theme") || "system"
  document.getElementById("languageSelect").value = currentLanguage
}

// Handle settings update
async function handleSettingsUpdate(e) {
  e.preventDefault()
  console.log("[v0] Atualizando configurações...")

  const newUsername = document.getElementById("settingsUsername").value
  const newPassword = document.getElementById("settingsPassword").value
  const profilePictureInput = document.getElementById("settingsProfilePicture")

  try {
    const updates = {}

    if (newUsername !== currentUser.username) {
      // Check if new username is available
      const users = getUsers()
      if (users[newUsername]) {
        alert("Este nome de usuário já está em uso!")
        return
      }

      // Copy user data to new username
      const userData = { ...currentUser, username: newUsername }
      users[newUsername] = userData
      delete users[currentUser.username]
      saveUsers(users)

      currentUser.username = newUsername
    }

    if (newPassword) {
      updates.password = newPassword
    }

    if (profilePictureInput.files && profilePictureInput.files[0]) {
      // In a real app, you would upload to Firebase Storage
      // For now, we'll use a placeholder
      alert("Upload de imagem requer Firebase Storage. Use uma URL de imagem.")
    }

    if (Object.keys(updates).length > 0) {
      const users = getUsers()
      users[currentUser.username] = { ...users[currentUser.username], ...updates }
      saveUsers(users)
      Object.assign(currentUser, updates)
    }

    localStorage.setItem("currentUser", JSON.stringify(currentUser))

    console.log("[v0] Configurações atualizadas")
    alert("Configurações atualizadas com sucesso!")
    document.getElementById("settingsModal").style.display = "none"
    updateUIForLoggedInUser()
  } catch (error) {
    console.error("[v0] Erro ao atualizar configurações:", error)
    alert("Erro ao atualizar configurações. Tente novamente.")
  }
}

// Logout
function logout() {
  console.log("[v0] Fazendo logout...")
  setUserOnline(false)
  currentUser = null
  localStorage.removeItem("currentUser")
  location.reload()
}

// Admin Panel
function showAdminPanel() {
  if (!currentUser || !currentUser.isAdmin) {
    alert("Acesso negado!")
    return
  }

  document.getElementById("adminModal").style.display = "flex"
  loadAdminData()
}

// Load admin data
async function loadAdminData() {
  try {
    // Load statistics
    const users = getUsers()
    const totalUsers = Object.keys(users).length

    const onlineUsers = JSON.parse(localStorage.getItem("onlineUsers")) || {}
    const activeUsers = Object.keys(onlineUsers).length

    const posts = JSON.parse(localStorage.getItem("posts")) || []
    const totalPosts = posts.length

    document.getElementById("totalUsersCount").textContent = totalUsers
    document.getElementById("activeUsersCountAdmin").textContent = activeUsers
    document.getElementById("totalPostsCount").textContent = totalPosts

    // Load users list
    const usersList = document.getElementById("adminUsersList")
    usersList.innerHTML = Object.entries(users)
      .map(
        ([username, user]) => `
      <div class="admin-user-item">
        <img src="${user.profilePicture}" alt="${username}">
        <div class="admin-user-info">
          <strong>${username}</strong>
          <small>${user.email}</small>
          <small>IP: ${user.ip}</small>
          ${user.suspended ? '<span class="badge-suspended">Suspenso</span>' : ""}
          ${user.isVerified ? '<span class="badge-verified">Verificado</span>' : ""}
          ${user.isAdmin ? '<span class="badge-admin">Admin</span>' : ""}
        </div>
        <div class="admin-user-actions">
          <button onclick="toggleVerified('${username}')">${user.isVerified ? "Remover" : "Verificar"}</button>
          <button onclick="toggleAdmin('${username}')">${user.isAdmin ? "Remover Admin" : "Tornar Admin"}</button>
          <button onclick="toggleBan('${username}')">${user.suspended ? "Desbanir" : "Banir"}</button>
        </div>
      </div>
    `,
      )
      .join("")
  } catch (error) {
    console.error("[v0] Erro ao carregar dados admin:", error)
  }
}

// Toggle verified
window.toggleVerified = async (username) => {
  try {
    const users = getUsers()
    users[username].isVerified = !users[username].isVerified
    saveUsers(users)
    console.log("[v0] Verificação alterada para:", username)
    loadAdminData()
  } catch (error) {
    console.error("[v0] Erro ao alterar verificação:", error)
  }
}

// Toggle admin
window.toggleAdmin = async (username) => {
  try {
    const users = getUsers()
    users[username].isAdmin = !users[username].isAdmin
    saveUsers(users)
    console.log("[v0] Status admin alterado para:", username)
    loadAdminData()
  } catch (error) {
    console.error("[v0] Erro ao alterar admin:", error)
  }
}

// Toggle ban
window.toggleBan = async (username) => {
  try {
    const users = getUsers()
    const newStatus = !users[username].suspended
    users[username].suspended = newStatus
    saveUsers(users)

    if (newStatus) {
      sendWebhook(WEBHOOKS.suspended, {
        // Changed from WEBHOOKS.suspendedAccounts to WEBHOOKS.suspended
        embeds: [
          {
            title: "🚫 Usuário Banido",
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
  } catch (error) {
    console.error("[v0] Erro ao banir/desbanir:", error)
  }
}

// Toggle chat lock
window.toggleChatLock = async () => {
  const newStatus = !chatLocked
  localStorage.setItem("chatLocked", JSON.stringify(newStatus))
  console.log("[v0] Chat bloqueado:", newStatus)
  alert(`Chat ${newStatus ? "bloqueado" : "desbloqueado"}!`)
}

// Clear chat
window.clearChat = async () => {
  if (!confirm("Tem certeza que deseja apagar todas as mensagens?")) return

  localStorage.removeItem("chatMessages")
  console.log("[v0] Chat limpo")
  alert("Chat limpo com sucesso!")
}

// Set chat cooldown
window.setChatCooldown = async () => {
  const seconds = prompt("Digite o cooldown em segundos (0 para desativar):")
  if (seconds === null) return

  const cooldown = Number.parseInt(seconds)
  if (isNaN(cooldown) || cooldown < 0) {
    alert("Valor inválido!")
    return
  }

  localStorage.setItem("chatCooldown", JSON.stringify(cooldown))
  console.log("[v0] Cooldown definido:", cooldown)
  alert(`Cooldown definido para ${cooldown} segundos!`)
}

// Toggle maintenance
window.toggleMaintenance = async () => {
  const newStatus = !maintenanceMode

  if (newStatus) {
    const password = prompt("Digite a senha de acesso para modo manutenção:")
    if (!password) return

    localStorage.setItem("maintenancePassword", password)
  }

  localStorage.setItem("maintenanceMode", JSON.stringify(newStatus))
  console.log("[v0] Modo manutenção:", newStatus)
  alert(`Modo manutenção ${newStatus ? "ativado" : "desativado"}!`)
}

// Add gallery image
window.addGalleryImage = async () => {
  const url = prompt("Digite a URL da imagem:")
  if (!url) return

  try {
    const gallery = JSON.parse(localStorage.getItem("gallery")) || []
    gallery.push({ url, addedBy: currentUser.username, timestamp: Date.now() })
    localStorage.setItem("gallery", JSON.stringify(gallery))
    console.log("[v0] Imagem adicionada à galeria")
    alert("Imagem adicionada com sucesso!")
  } catch (error) {
    console.error("[v0] Erro ao adicionar imagem:", error)
  }
}

// Create post
window.createPost = async () => {
  const content = prompt("Digite o conteúdo do post:")
  if (!content) return

  try {
    const posts = JSON.parse(localStorage.getItem("posts")) || []
    posts.push({
      author: currentUser.username,
      authorPicture: currentUser.profilePicture,
      content,
      timestamp: Date.now(),
    })
    localStorage.setItem("posts", JSON.stringify(posts))
    console.log("[v0] Post criado")
    alert("Post criado com sucesso!")
  } catch (error) {
    console.error("[v0] Erro ao criar post:", error)
  }
}

// Enter key support
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const activeElement = document.activeElement
    if (activeElement.id === "chatInput") {
      sendMessage()
    }
  }
})
