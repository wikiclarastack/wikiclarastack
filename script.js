// Configuration
const CONFIG = {
  discordWebhooks: {
    suspendedAccounts:
      "https://discord.com/api/webhooks/1453870994233233672/ECP6u8tLh4ui2t3HOagXinv9QkeAU8mUScKLKkiY47mFNejrQhGU9v3xRNaHI4UjeqfC",
    siteLog:
      "https://discord.com/api/webhooks/1453871095672340612/U1fotOujLXmOESKp0JJXLEa3zcqGnImE2ENz_Vpw8ekLI81wD0uvDbTWIkHLMV9SE3K0",
  },
  adminCredentials: {
    username: "admin",
    password: "admin",
  },
  defaultGallery: [
    "https://image.tmdb.org/t/p/original/yMK3IADqV2oReJMKdkrcEIBxdtu.jpg",
    "https://image.tmdb.org/t/p/original/6vS09IasA8vU2vXjXq9tG7POnCj.jpg",
    "https://image.tmdb.org/t/p/original/7Xp799uL6vIDWof2mYmUu6pS8p9.jpg",
    "https://image.tmdb.org/t/p/original/m9YpS27Yv5K2z7r6K6u9O6uJ2uJ.jpg",
    "https://image.tmdb.org/t/p/original/8Z09v6A9uS8P6r6u8O6uJ2uJ2uJ.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvTMnnpP9p4yr3TbS1aqUktmPvVVyy7lvwqQ&s",
    "https://static.tvtropes.org/pmwiki/pub/images/img_4865_8.jpeg",
  ],
}

// State Management
let currentUser = null
let currentLanguage = "pt"
let currentIP = null

// Utility Functions
function generateID() {
  return Date.now() + Math.random().toString(36).substr(2, 9)
}

async function getIPAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error("Error getting IP:", error)
    return "unknown"
  }
}

async function getIPInfo(ip) {
  if (ip === "unknown") return { country: "Unknown", city: "Unknown", region: "Unknown" }
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`)
    const data = await response.json()
    return {
      country: data.country_name || "Unknown",
      city: data.city || "Unknown",
      region: data.region || "Unknown",
    }
  } catch (error) {
    return { country: "Unknown", city: "Unknown", region: "Unknown" }
  }
}

async function sendDiscordWebhook(webhookUrl, message) {
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    })
  } catch (error) {
    console.error("Discord webhook error:", error)
  }
}

function detectLanguage() {
  const userLang = navigator.language || navigator.userLanguage
  return userLang.startsWith("en") ? "en" : "pt"
}

function applyLanguage(lang) {
  currentLanguage = lang
  document.querySelectorAll("[data-lang-en]").forEach((element) => {
    const text = element.getAttribute(`data-lang-${lang}`)
    if (text) {
      if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        element.placeholder = text
      } else {
        element.textContent = text
      }
    }
  })
}

function applyTheme(theme) {
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    theme = prefersDark ? "dark" : "light"
  }
  document.body.setAttribute("data-theme", theme)
  localStorage.setItem("theme", theme)
}

// Storage Functions
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function getFromStorage(key) {
  const data = localStorage.getItem(key)
  try {
    return data ? JSON.parse(data) : null
  } catch (e) {
    return null
  }
}

// User Management
function getAllUsers() {
  return getFromStorage("users") || []
}

function getUserByUsername(username) {
  const users = getAllUsers()
  return users.find((u) => u.username.toLowerCase() === username.toLowerCase())
}

function getUserByEmail(email) {
  const users = getAllUsers()
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

function saveUser(user) {
  const users = getAllUsers()
  const index = users.findIndex((u) => u.id === user.id)
  if (index !== -1) {
    users[index] = user
  } else {
    users.push(user)
  }
  saveToStorage("users", users)
}

async function registerUser(username, email, password) {
  if (getUserByUsername(username)) {
    return { success: false, message: "Username already exists / Usuário já existe" }
  }
  if (getUserByEmail(email)) {
    return { success: false, message: "Email already registered / Email já registrado" }
  }

  const ip = await getIPAddress()
  const ipInfo = await getIPInfo(ip)

  const user = {
    id: generateID(),
    username,
    email,
    password,
    ip,
    ipInfo,
    avatar: "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png",
    verified: false,
    isAdmin: false,
    canPostImages: false,
    banned: false,
    createdAt: new Date().toISOString(),
  }

  saveUser(user)

  sendDiscordWebhook(
    CONFIG.discordWebhooks.siteLog,
    `✅ New user registered: ${username} (${email}) from ${ipInfo.city}, ${ipInfo.country} [IP: ${ip}]`
  )

  return { success: true, user }
}

async function loginUser(username, password) {
  const user = getUserByUsername(username)

  if (!user) {
    return { success: false, message: "User not found / Usuário não encontrado" }
  }

  if (user.banned) {
    sendDiscordWebhook(
      CONFIG.discordWebhooks.suspendedAccounts,
      `🚫 Banned user attempted login: ${username} [IP: ${user.ip}]`
    )
    return { success: false, message: "Account suspended / Conta suspensa" }
  }

  if (user.password !== password) {
    return { success: false, message: "Incorrect password / Senha incorreta" }
  }

  const freshIP = await getIPAddress()

  if (user.ip !== freshIP && username !== CONFIG.adminCredentials.username) {
    user.banned = true
    saveUser(user)
    sendDiscordWebhook(
      CONFIG.discordWebhooks.suspendedAccounts,
      `⚠️ Account auto-suspended due to IP change: ${username}\nOriginal IP: ${user.ip}\nNew IP: ${freshIP}`
    )
    return {
      success: false,
      message: "IP changed - Account suspended. Contact admin. / IP alterado - Conta suspensa.",
    }
  }

  const ipInfo = await getIPInfo(freshIP)
  sendDiscordWebhook(
    CONFIG.discordWebhooks.siteLog,
    `👤 User logged in: ${username} from ${ipInfo.city}, ${ipInfo.country} [IP: ${freshIP}]`
  )

  return { success: true, user }
}

function logout() {
  currentUser = null
  localStorage.removeItem("currentUser")
  updateUI()
  location.reload()
}

function updateUI() {
  const authBtn = document.getElementById("authBtn")
  const userProfile = document.getElementById("userProfile")
  const userName = document.getElementById("userName")
  const userAvatar = document.getElementById("userAvatar")
  const openAdminBtn = document.getElementById("openAdminPanel")
  const chatInput = document.getElementById("chatInput")
  const chatButton = document.querySelector("#chatForm button")

  if (currentUser) {
    authBtn.style.display = "none"
    userProfile.classList.add("active")
    userName.textContent = currentUser.username
    userAvatar.src = currentUser.avatar
    if (currentUser.isAdmin) openAdminBtn.classList.remove("hidden")
    chatInput.disabled = false
    chatButton.disabled = false
    chatInput.placeholder = currentLanguage === "en" ? "Type a message..." : "Digite uma mensagem..."
  } else {
    authBtn.style.display = "block"
    userProfile.classList.remove("active")
    chatInput.disabled = true
    chatButton.disabled = true
    chatInput.placeholder = currentLanguage === "en" ? "Login to chat..." : "Faça login para conversar..."
  }
}

// Gallery Management
function initGallery() {
  let gallery = getFromStorage("gallery")
  if (!gallery) {
    gallery = CONFIG.defaultGallery.map((url) => ({
      id: generateID(),
      url,
      caption: "",
      addedBy: "system",
      addedAt: new Date().toISOString(),
    }))
    saveToStorage("gallery", gallery)
  }
  renderGallery()
}

function renderGallery() {
  const gallery = getFromStorage("gallery") || []
  const galleryGrid = document.getElementById("galleryGrid")
  if (!galleryGrid) return

  galleryGrid.innerHTML = gallery
    .map(
      (item) => `
        <div class="gallery-item" data-id="${item.id}">
            <img src="${item.url}" alt="${item.caption || "Gallery image"}" loading="lazy" onerror="this.src='https://placehold.co/600x400?text=Image+Error'">
        </div>
    `
    )
    .join("")
}

function addToGallery(url, caption = "") {
  const gallery = getFromStorage("gallery") || []
  gallery.push({
    id: generateID(),
    url,
    caption,
    addedBy: currentUser ? currentUser.username : "admin",
    addedAt: new Date().toISOString(),
  })
  saveToStorage("gallery", gallery)
  renderGallery()
  renderAdminGallery()
}

function renderAdminGallery() {
  const gallery = getFromStorage("gallery") || []
  const galleryManager = document.getElementById("galleryManager")
  if (!galleryManager) return

  galleryManager.innerHTML = gallery
    .map(
      (item) => `
        <div class="gallery-item" style="position: relative; margin-bottom: 10px;">
            <img src="${item.url}" alt="${item.caption}" style="width: 100px; height: 100px; object-fit: cover;">
            <button onclick="removeFromGallery('${item.id}')" style="position: absolute; top: 0; right: 0; background: red; color: white; border: none; cursor: pointer;">X</button>
        </div>
    `
    )
    .join("")
}

function removeFromGallery(id) {
  let gallery = getFromStorage("gallery") || []
  gallery = gallery.filter((item) => item.id !== id)
  saveToStorage("gallery", gallery)
  renderGallery()
  renderAdminGallery()
}

// Posts Management
function getPosts() {
  return getFromStorage("posts") || []
}

function createPost(content) {
  const posts = getPosts()
  const post = {
    id: generateID(),
    content,
    author: currentUser.username,
    authorAvatar: currentUser.avatar,
    isVerified: currentUser.verified,
    isAdmin: currentUser.isAdmin,
    createdAt: new Date().toISOString(),
  }
  posts.unshift(post)
  saveToStorage("posts", posts)
  renderPosts()
}

function renderPosts() {
  const posts = getPosts()
  const postsContainer = document.getElementById("postsContainer")
  if (!postsContainer) return

  if (posts.length === 0) {
    postsContainer.innerHTML = `<p style="text-align: center; opacity: 0.6;">${currentLanguage === "en" ? "No posts yet" : "Nenhuma postagem ainda"}</p>`
    return
  }

  postsContainer.innerHTML = posts
    .map(
      (post) => `
        <div class="post-item">
            <div class="post-header">
                <img src="${post.authorAvatar}" alt="${post.author}">
                <strong class="${post.isAdmin ? "admin" : ""}">${post.author}</strong>
                ${post.isVerified ? '<img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" class="verified-badge" style="width:15px; margin-left:5px;">' : ""}
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-time">${new Date(post.createdAt).toLocaleString()}</div>
        </div>
    `
    )
    .join("")
}

// Chat Management
function getMessages() {
  return getFromStorage("messages") || []
}

function getChatSettings() {
  return getFromStorage("chatSettings") || { locked: false, cooldown: 0 }
}

function saveChatSettings(settings) {
  saveToStorage("chatSettings", settings)
}

let lastMessageTime = 0

async function sendMessage(content) {
  const chatSettings = getChatSettings()
  if (chatSettings.locked && !currentUser.isAdmin) return alert("Chat locked")

  const now = Date.now()
  if (now - lastMessageTime < chatSettings.cooldown * 1000 && !currentUser.isAdmin) return alert(`Wait ${chatSettings.cooldown}s`)

  lastMessageTime = now
  const messages = getMessages()
  const message = {
    id: generateID(),
    content,
    author: currentUser.username,
    isAdmin: currentUser.isAdmin,
    isVerified: currentUser.verified,
    timestamp: new Date().toISOString(),
  }

  messages.push(message)
  saveToStorage("messages", messages)
  renderMessages()
}

function renderMessages() {
  const messages = getMessages()
  const chatMessages = document.getElementById("chatMessages")
  if (!chatMessages) return

  chatMessages.innerHTML = messages
    .map(
      (msg) => `
        <div class="chat-message">
            <span class="chat-username ${msg.isAdmin ? "admin" : ""}">${msg.author}:</span>
            <span>${msg.content}</span>
        </div>
    `
    )
    .join("")
  chatMessages.scrollTop = chatMessages.scrollHeight
}

function clearChat() {
  if (confirm("Clear all chat messages?")) {
    saveToStorage("messages", [])
    renderMessages()
  }
}

// Admin Functions
function renderAdminUsers() {
  const users = getAllUsers()
  const activeUsersList = document.getElementById("activeUsersList")
  const allUsersList = document.getElementById("allUsersList")
  if (!activeUsersList || !allUsersList) return

  const renderUser = (user) => `
        <div class="user-item" style="border-bottom: 1px solid #444; padding: 10px;">
            <span>${user.username} (${user.ipInfo.city})</span>
            <div class="user-actions">
                <button onclick="toggleVerified('${user.id}')">${user.verified ? "Unverify" : "Verify"}</button>
                <button onclick="toggleBan('${user.id}')" style="background:red;">${user.banned ? "Unban" : "Ban"}</button>
            </div>
        </div>
    `
  activeUsersList.innerHTML = users.filter((u) => !u.banned).map(renderUser).join("")
  allUsersList.innerHTML = users.map(renderUser).join("")
}

async function toggleVerified(userId) {
  const users = getAllUsers()
  const user = users.find((u) => u.id === userId)
  if (user) {
    user.verified = !user.verified
    saveUser(user)
    renderAdminUsers()
  }
}

async function toggleBan(userId) {
  const users = getAllUsers()
  const user = users.find((u) => u.id === userId)
  if (user && user.username !== CONFIG.adminCredentials.username) {
    user.banned = !user.banned
    saveUser(user)
    renderAdminUsers()
  }
}

// Event Listeners Principal
document.addEventListener("DOMContentLoaded", () => {
  // 1. Esconder loading o mais rápido possível
  setTimeout(() => {
    const loader = document.getElementById("loadingScreen")
    if (loader) loader.classList.add("hidden")
  }, 400)

  // 2. Tarefas de background (IP e Logs) - SEM AWAIT NO TOPO
  const initLogs = async () => {
    currentIP = await getIPAddress()
    const ipInfo = await getIPInfo(currentIP)
    sendDiscordWebhook(CONFIG.discordWebhooks.siteLog, `👁️ Visit: ${ipInfo.city}, ${ipInfo.country} [IP: ${currentIP}]`)
    
    // Validar sessão do usuário após pegar o IP
    const savedUser = getFromStorage("currentUser")
    if (savedUser) {
      const user = getUserByUsername(savedUser.username)
      if (user && !user.banned && (user.ip === currentIP || user.isAdmin)) {
        currentUser = user
        updateUI()
      } else {
        localStorage.removeItem("currentUser")
      }
    }
  }
  initLogs()

  // 3. Inicialização Visual
  const savedLang = localStorage.getItem("language") || detectLanguage()
  applyLanguage(savedLang === "auto" ? detectLanguage() : savedLang)
  applyTheme(localStorage.getItem("theme") || "system")

  initGallery()
  renderPosts()
  renderMessages()
  updateUI()

  // Listeners de Formulários
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      const res = await loginUser(document.getElementById("loginUsername").value, document.getElementById("loginPassword").value)
      if (res.success) {
        currentUser = res.user
        saveToStorage("currentUser", currentUser)
        location.reload()
      } else alert(res.message)
    })
  }

  const registerForm = document.getElementById("registerForm")
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      const res = await registerUser(
        document.getElementById("registerUsername").value,
        document.getElementById("registerEmail").value,
        document.getElementById("registerPassword").value
      )
      if (res.success) {
        alert("Success! Please login.")
        document.querySelector('.auth-tab[data-tab="login"]').click()
      } else alert(res.message)
    })
  }

  const chatForm = document.getElementById("chatForm")
  if (chatForm) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault()
      const input = document.getElementById("chatInput")
      if (input.value.trim()) {
        await sendMessage(input.value.trim())
        input.value = ""
      }
    })
  }

  // Botoes simples
  document.getElementById("authBtn")?.addEventListener("click", () => document.getElementById("authModal").classList.remove("hidden"))
  document.getElementById("logoutBtn")?.addEventListener("click", logout)
  document.getElementById("openAdminPanel")?.addEventListener("click", () => {
    document.getElementById("adminPanel").classList.remove("hidden")
    renderAdminUsers()
    renderAdminGallery()
  })

  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", () => btn.closest(".modal, .admin-panel").classList.add("hidden"))
  })
})

// Globais para os botões do HTML
window.toggleVerified = toggleVerified
window.toggleBan = toggleBan
window.removeFromGallery = removeFromGallery
