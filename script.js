// Global Variables
let currentUser = null
let currentLanguage = "en"
const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png"
const users = JSON.parse(localStorage.getItem("users")) || []
const chatMessages = JSON.parse(localStorage.getItem("chatMessages")) || []
const visitors = JSON.parse(localStorage.getItem("visitors")) || []
const activeUsers = JSON.parse(localStorage.getItem("activeUsers")) || []
const gallery = JSON.parse(localStorage.getItem("gallery")) || [
  "https://image.tmdb.org/t/p/w500/yMK3IADqV2oReJMKdkrcEIBxdtu.jpg",
  "https://ntvb.tmsimg.com/assets/assets/GNLZZGG002G2JKZ.jpg",
  "https://media.gettyimages.com/id/2242330361/photo/los-angeles-premiere-of-hbo-original-series-it-welcome-to-derry-red-carpet.jpg?s=1024x1024&w=gi&k=20&c=SATqk9OF8uyP8-6xKlIUS4AhKcPg3unpDSieOnkrGrc=",
]
let lastChatTime = 0
let chatLocked = localStorage.getItem("chatLocked") === "true"

// Discord Webhooks
const WEBHOOKS = {
  newUser:
    "https://discord.com/api/webhooks/1453870908946256136/m8Abdnk_2moAy2nojUYmJ6_slK5xbWZ3tBxahEemij9zBu8wf31n5nPmf2HG3I1gM1ax",
  suspended:
    "https://discord.com/api/webhooks/1453870994233233672/ECP6u8tLh4ui2t3HOagXinv9QkeAU8mUScKLKkiY47mFNejrQhGU9v3xRNaHI4UjeqfC",
  visitors:
    "https://discord.com/api/webhooks/1453871095672340612/U1fotOujLXmOESKp0JJXLEa3zcqGnImE2ENz_Vpw8ekLI81wD0uvDbTWIkHLMV9SE3K0",
}

window.addEventListener("storage", (e) => {
  if (e.key === "chatMessages") {
    loadChatMessages()
  } else if (e.key === "gallery") {
    loadGallery()
  } else if (e.key === "globalNotifications") {
    loadNotifications()
  } else if (e.key === "users") {
    if (currentUser && currentUser.isAdmin) {
      loadUsersList()
    }
  } else if (e.key === "chatLocked") {
    chatLocked = e.newValue === "true"
    updateChatLockStatus()
  }
})

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  checkMaintenanceMode()
  detectRegion()
  initTheme()
  logVisitor()
  checkSession()
  loadChatMessages()
  loadGallery()
  loadNotifications()
  updateLanguage()
  updateChatLockStatus()

  // Update active users every 30 seconds
  setInterval(updateActiveUsers, 30000)

  setInterval(loadChatMessages, 5000)
})

function checkMaintenanceMode() {
  const maintenanceMode = localStorage.getItem("maintenanceMode") === "true"
  const maintenanceScreen = document.getElementById("maintenanceScreen")

  if (maintenanceMode && maintenanceScreen) {
    maintenanceScreen.style.display = "flex"
  }
}

function checkMaintenancePassword() {
  const password = document.getElementById("maintenancePassword").value
  const savedPassword = localStorage.getItem("maintenancePassword")

  if (password === savedPassword) {
    document.getElementById("maintenanceScreen").style.display = "none"
  } else {
    alert(currentLanguage === "en" ? "Invalid password" : "Senha inválida")
  }
}

// Detect Region
async function detectRegion() {
  const savedLang = localStorage.getItem("language")
  if (savedLang && savedLang !== "auto") {
    currentLanguage = savedLang
    updateLanguage()
    return
  }

  fetch("https://ipapi.co/json/")
    .then((response) => response.json())
    .then((data) => {
      currentLanguage = data.country_code === "BR" ? "pt" : "en"
      updateLanguage()
    })
    .catch(() => {
      currentLanguage = "en"
      updateLanguage()
    })
}

function changeLanguage() {
  const select = document.getElementById("languageSelect")
  const value = select.value
  localStorage.setItem("language", value)

  if (value === "auto") {
    detectRegion()
  } else {
    currentLanguage = value
    updateLanguage()
  }
}

// Update Language
function updateLanguage() {
  document.querySelectorAll("[data-en]").forEach((el) => {
    const text = el.getAttribute(`data-${currentLanguage}`)
    if (text) el.textContent = text
  })

  document.querySelectorAll("[data-en-placeholder]").forEach((el) => {
    const placeholder = el.getAttribute(`data-${currentLanguage}-placeholder`)
    if (placeholder) el.placeholder = placeholder
  })
}

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark"
  applyTheme(savedTheme)
  const themeSelect = document.getElementById("themeSelect")
  if (themeSelect) themeSelect.value = savedTheme
}

function changeTheme() {
  const theme = document.getElementById("themeSelect").value
  localStorage.setItem("theme", theme)
  applyTheme(theme)
}

function applyTheme(theme) {
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    theme = prefersDark ? "dark" : "light"
  }

  if (theme === "light") {
    document.body.setAttribute("data-theme", "light")
  } else {
    document.body.removeAttribute("data-theme")
  }
}

// Get IP Address
async function getIPAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json()
    return data.ip
  } catch (error) {
    return "unknown"
  }
}

async function getIPInfo() {
  try {
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      country: data.country_name,
      countryCode: data.country_code,
    }
  } catch (error) {
    return {
      ip: "unknown",
      city: "Unknown",
      region: "Unknown",
      country: "Unknown",
      countryCode: "XX",
    }
  }
}

// Log Visitor
async function logVisitor() {
  const ipInfo = await getIPInfo()
  const timestamp = new Date().toISOString()
  const visitor = { ...ipInfo, timestamp }

  visitors.push(visitor)
  localStorage.setItem("visitors", JSON.stringify(visitors))

  await sendWebhook(WEBHOOKS.visitors, {
    content: `🌐 New visitor from ${ipInfo.city}, ${ipInfo.country} (IP: ${ipInfo.ip}) at ${new Date().toLocaleString()}`,
  })
}

// Send Webhook
async function sendWebhook(url, data) {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error("Webhook error:", error)
  }
}

// Check Session
async function checkSession() {
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    const user = JSON.parse(savedUser)
    const ipInfo = await getIPInfo()
    const currentIP = ipInfo.ip

    if (!user.isAdmin && user.ip !== currentIP) {
      const userIndex = users.findIndex((u) => u.username === user.username)
      if (userIndex !== -1) {
        users[userIndex].banned = true
        localStorage.setItem("users", JSON.stringify(users))

        await sendWebhook(WEBHOOKS.suspended, {
          content: `🚫 Account suspended: ${user.username} (IP changed from ${user.ip} to ${currentIP})`,
        })
      }

      alert(
        currentLanguage === "en"
          ? "Your account has been suspended due to IP change. Contact admin."
          : "Sua conta foi suspensa devido a mudança de IP. Contate o administrador.",
      )
      logout()
      return
    } else {
      currentUser = user
      updateUIForLoggedInUser()
      addActiveUser(user.username)
    }
  }
}

function addActiveUser(username) {
  const active = JSON.parse(localStorage.getItem("activeUsers")) || []
  if (!active.includes(username)) {
    active.push(username)
    localStorage.setItem("activeUsers", JSON.stringify(active))
  }
}

function removeActiveUser(username) {
  let active = JSON.parse(localStorage.getItem("activeUsers")) || []
  active = active.filter((u) => u !== username)
  localStorage.setItem("activeUsers", JSON.stringify(active))
}

function updateActiveUsers() {
  if (currentUser && !currentUser.banned) {
    addActiveUser(currentUser.username)
  }
}

function showAuthModal() {
  document.getElementById("authModal").style.display = "block"
}

function closeAuthModal() {
  document.getElementById("authModal").style.display = "none"
}

function showLoginForm() {
  document.getElementById("loginForm").style.display = "block"
  document.getElementById("registerForm").style.display = "none"
}

function showRegisterForm() {
  document.getElementById("registerForm").style.display = "block"
  document.getElementById("loginForm").style.display = "none"
}

function showSettings() {
  if (!currentUser) {
    showAuthModal()
    return
  }
  document.getElementById("settingsModal").style.display = "block"
  loadSettings()
}

function closeSettings() {
  document.getElementById("settingsModal").style.display = "none"
}

function openAdminPanel() {
  if (!currentUser || !currentUser.isAdmin) {
    alert("Access denied")
    return
  }
  document.getElementById("adminPanel").style.display = "block"
  loadAdminDashboard()
  updateLanguage()
}

function closeAdminPanel() {
  document.getElementById("adminPanel").style.display = "none"
}

function showAdminTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".admin-tab-content").forEach((tab) => {
    tab.classList.remove("active")
  })
  document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  // Show selected tab
  document.getElementById(`admin-${tabName}`).classList.add("active")
  event.target.classList.add("active")

  // Load content based on tab
  if (tabName === "dashboard") loadAdminDashboard()
  if (tabName === "users") loadUsersList()
  if (tabName === "chat") loadChatSettings()
  if (tabName === "settings") loadSiteSettings()
}

function loadAdminDashboard() {
  const totalUsersEl = document.getElementById("totalUsers")
  const activeUsersEl = document.getElementById("activeUsersCount")
  const totalMessagesEl = document.getElementById("totalMessages")
  const totalVisitorsEl = document.getElementById("totalVisitors")

  if (totalUsersEl) totalUsersEl.textContent = users.length
  if (activeUsersEl) activeUsersEl.textContent = activeUsers.length
  if (totalMessagesEl) totalMessagesEl.textContent = chatMessages.length
  if (totalVisitorsEl) totalVisitorsEl.textContent = visitors.length

  // Load active users
  const activeUsersList = document.getElementById("activeUsersList")
  if (activeUsersList) {
    activeUsersList.innerHTML = ""
    activeUsers.forEach((username) => {
      const user = users.find((u) => u.username === username)
      if (user) {
        const badge = document.createElement("div")
        badge.className = "active-user-badge"
        badge.innerHTML = `
          <img src="${user.avatar || DEFAULT_AVATAR}" alt="${username}">
          <span>${username}</span>
        `
        activeUsersList.appendChild(badge)
      }
    })
  }
}

function loadUsersList() {
  const usersList = document.getElementById("usersList")
  if (!usersList) return

  usersList.innerHTML = ""

  users.forEach((user) => {
    const ipInfo = user.ipInfo || { city: "Unknown", country: "Unknown" }
    const userCard = document.createElement("div")
    userCard.className = "user-card"
    userCard.innerHTML = `
      <div class="user-info">
        <img src="${user.avatar || DEFAULT_AVATAR}" alt="${user.username}" class="user-avatar">
        <div class="user-details">
          <h4>
            ${user.username}
            ${user.verified ? '<img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" width="16" alt="Verified">' : ""}
            ${user.isAdmin ? '<img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" width="16" alt="Admin">' : ""}
          </h4>
          <p>${user.email}</p>
          <p>IP: ${user.ip} | ${ipInfo.city}, ${ipInfo.country} ${user.banned ? "| ⛔ BANNED" : ""}</p>
          <p style="font-size: 0.8rem; opacity: 0.6;">Registered: ${new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <div class="user-actions">
        <button class="${user.verified ? "unverify-btn" : "verify-btn"}" onclick="toggleVerify('${user.username}')">
          ${user.verified ? "❌ Unverify" : "✅ Verify"}
        </button>
        <button class="${user.banned ? "unban-btn danger-btn" : "ban-btn warning-btn"}" onclick="toggleBan('${user.username}')">
          ${user.banned ? "🔓 Unban" : "🔒 Ban"}
        </button>
        <button class="promote-btn" onclick="toggleAdmin('${user.username}')">
          ${user.isAdmin ? "👤 Remove Admin" : "⚡ Make Admin"}
        </button>
        <button class="image-perm-btn" onclick="toggleImagePermission('${user.username}')">
          ${user.canPostImages ? "🚫 Remove Images" : "🖼️ Allow Images"}
        </button>
      </div>
    `
    usersList.appendChild(userCard)
  })
}

function toggleVerify(username) {
  const userIndex = users.findIndex((u) => u.username === username)
  if (userIndex !== -1) {
    users[userIndex].verified = !users[userIndex].verified
    localStorage.setItem("users", JSON.stringify(users))
    loadUsersList()
  }
}

async function toggleBan(username) {
  const userIndex = users.findIndex((u) => u.username === username)
  if (userIndex !== -1) {
    users[userIndex].banned = !users[userIndex].banned
    localStorage.setItem("users", JSON.stringify(users))

    if (users[userIndex].banned) {
      await sendWebhook(WEBHOOKS.suspended, {
        content: `🚫 User banned by admin: ${username}`,
      })
    }

    loadUsersList()
  }
}

function toggleAdmin(username) {
  const userIndex = users.findIndex((u) => u.username === username)
  if (userIndex !== -1) {
    users[userIndex].isAdmin = !users[userIndex].isAdmin
    localStorage.setItem("users", JSON.stringify(users))
    loadUsersList()
  }
}

function toggleImagePermission(username) {
  const userIndex = users.findIndex((u) => u.username === username)
  if (userIndex !== -1) {
    users[userIndex].canPostImages = !users[userIndex].canPostImages
    localStorage.setItem("users", JSON.stringify(users))
    loadUsersList()
  }
}

function createPost() {
  const title = document.getElementById("postTitle").value.trim()
  const content = document.getElementById("postContent").value.trim()

  if (!title || !content) {
    alert(currentLanguage === "en" ? "Please fill in all fields" : "Preencha todos os campos")
    return
  }

  const notifications = JSON.parse(localStorage.getItem("globalNotifications")) || []
  notifications.unshift({
    author: "Admin",
    content: `${title}: ${content}`,
    timestamp: new Date().toISOString(),
  })

  localStorage.setItem("globalNotifications", JSON.stringify(notifications))

  document.getElementById("postTitle").value = ""
  document.getElementById("postContent").value = ""

  loadNotifications()
  alert(currentLanguage === "en" ? "Post created successfully!" : "Post criado com sucesso!")
}

function addToGallery() {
  const url = document.getElementById("galleryImageUrl").value.trim()

  if (!url) {
    alert(currentLanguage === "en" ? "Please enter an image URL" : "Por favor, insira uma URL de imagem")
    return
  }

  const currentGallery = JSON.parse(localStorage.getItem("gallery")) || []
  currentGallery.push(url)
  localStorage.setItem("gallery", JSON.stringify(currentGallery))

  document.getElementById("galleryImageUrl").value = ""
  loadGallery()
  alert(currentLanguage === "en" ? "Image added to gallery!" : "Imagem adicionada à galeria!")
}

function loadChatSettings() {
  const currentCooldown = localStorage.getItem("chatCooldown") || "0"
  const cooldownInput = document.getElementById("chatCooldownInput")
  if (cooldownInput) {
    cooldownInput.value = currentCooldown
  }

  const chatLockBtn = document.getElementById("chatLockBtn")
  if (chatLockBtn) {
    chatLockBtn.innerHTML = chatLocked
      ? '<span data-en="🔓 Unlock Chat" data-pt="🔓 Desbloquear Chat">🔓 Desbloquear Chat</span>'
      : '<span data-en="🔒 Lock Chat" data-pt="🔒 Bloquear Chat">🔒 Bloquear Chat</span>'
    chatLockBtn.className = chatLocked ? "danger-btn" : "warning-btn"
  }

  updateLanguage()
}

function updateChatCooldown() {
  const cooldown = document.getElementById("chatCooldownInput").value
  localStorage.setItem("chatCooldown", cooldown)
  alert(currentLanguage === "en" ? "Chat cooldown updated!" : "Cooldown do chat atualizado!")
}

function clearAllMessages() {
  if (confirm(currentLanguage === "en" ? "Clear all chat messages?" : "Limpar todas as mensagens do chat?")) {
    localStorage.setItem("chatMessages", JSON.stringify([]))
    loadChatMessages()
    alert(currentLanguage === "en" ? "All messages cleared!" : "Todas as mensagens foram limpas!")
  }
}

function loadSiteSettings() {
  const maintenanceMode = localStorage.getItem("maintenanceMode") === "true"
  const btn = document.getElementById("maintenanceBtn")

  if (btn) {
    if (maintenanceMode) {
      btn.innerHTML =
        '<span data-en="Disable Maintenance Mode" data-pt="Desativar Modo Manutenção">Desativar Modo Manutenção</span>'
      btn.classList.remove("warning-btn")
      btn.classList.add("danger-btn")
    } else {
      btn.innerHTML =
        '<span data-en="Enable Maintenance Mode" data-pt="Ativar Modo Manutenção">Ativar Modo Manutenção</span>'
      btn.classList.remove("danger-btn")
      btn.classList.add("warning-btn")
    }
  }

  updateLanguage()
}

function toggleMaintenance() {
  const currentMode = localStorage.getItem("maintenanceMode") === "true"

  if (!currentMode) {
    document.getElementById("maintenancePasswordSection").style.display = "block"
  } else {
    localStorage.setItem("maintenanceMode", "false")
    loadSiteSettings()
    alert(currentLanguage === "en" ? "Maintenance mode disabled!" : "Modo de manutenção desativado!")
  }
}

function setMaintenancePassword() {
  const password = document.getElementById("maintenancePasswordInput").value

  if (!password) {
    alert(currentLanguage === "en" ? "Please enter a password" : "Por favor, insira uma senha")
    return
  }

  localStorage.setItem("maintenanceMode", "true")
  localStorage.setItem("maintenancePassword", password)
  document.getElementById("maintenancePasswordSection").style.display = "none"
  document.getElementById("maintenancePasswordInput").value = ""
  loadSiteSettings()
  alert(currentLanguage === "en" ? "Maintenance mode enabled!" : "Modo de manutenção ativado!")
}

function updateUIForLoggedInUser() {
  const authLink = document.getElementById("authLink")
  const settingsLink = document.getElementById("settingsLink")
  const adminPanelLink = document.getElementById("adminPanelLink")
  const userProfileCorner = document.getElementById("userProfileCorner")
  const chatContainer = document.getElementById("chatContainer")
  const chatLoginPrompt = document.getElementById("chatLoginPrompt")

  if (currentUser) {
    authLink.style.display = "none"
    settingsLink.style.display = "block"

    // Show profile corner
    userProfileCorner.style.display = "flex"
    document.getElementById("cornerUserAvatar").src = currentUser.avatar || DEFAULT_AVATAR
    document.getElementById("cornerUserName").textContent = currentUser.username

    // Show admin panel link
    if (currentUser.isAdmin) {
      adminPanelLink.style.display = "block"
    }

    // Show chat
    chatContainer.style.display = "block"
    chatLoginPrompt.style.display = "none"
    updateChatLockStatus()
  } else {
    authLink.style.display = "block"
    authLink.textContent = currentLanguage === "en" ? "Login" : "Entrar"
    settingsLink.style.display = "none"
    adminPanelLink.style.display = "none"
    userProfileCorner.style.display = "none"
    chatContainer.style.display = "none"
    chatLoginPrompt.style.display = "block"
  }
}

function loadSettings() {
  if (!currentUser) return

  if (currentUser.username === "admin") {
    document.getElementById("settingsUsername").disabled = true
    document.getElementById("settingsPassword").disabled = true
    document.getElementById("profilePicInput").disabled = true
  }

  document.getElementById("settingsUsername").value = currentUser.username
  document.getElementById("currentProfilePic").src = currentUser.avatar || DEFAULT_AVATAR

  const savedTheme = localStorage.getItem("theme") || "dark"
  document.getElementById("themeSelect").value = savedTheme

  const savedLang = localStorage.getItem("language") || "auto"
  document.getElementById("languageSelect").value = savedLang
}

function updateProfilePicture() {
  const input = document.getElementById("profilePicInput")
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      document.getElementById("currentProfilePic").src = e.target.result
    }
    reader.readAsDataURL(input.files[0])
  }
}

function updateProfile() {
  if (!currentUser || currentUser.username === "admin") {
    alert(currentLanguage === "en" ? "Admin profile cannot be edited" : "Perfil de admin não pode ser editado")
    return
  }

  const newUsername = document.getElementById("settingsUsername").value.trim()
  const newPassword = document.getElementById("settingsPassword").value
  const profilePicInput = document.getElementById("profilePicInput")

  if (!newUsername) {
    alert(currentLanguage === "en" ? "Username cannot be empty" : "Nome de usuário não pode ser vazio")
    return
  }

  const userIndex = users.findIndex((u) => u.username === currentUser.username)

  if (userIndex !== -1) {
    // Check if new username is taken
    if (newUsername !== currentUser.username && users.find((u) => u.username === newUsername)) {
      alert(currentLanguage === "en" ? "Username already taken" : "Nome de usuário já existe")
      return
    }

    users[userIndex].username = newUsername
    currentUser.username = newUsername

    if (newPassword) {
      users[userIndex].password = newPassword
    }

    if (profilePicInput.files && profilePicInput.files[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        users[userIndex].avatar = e.target.result
        currentUser.avatar = e.target.result
        localStorage.setItem("users", JSON.stringify(users))
        localStorage.setItem("currentUser", JSON.stringify(currentUser))
        updateUIForLoggedInUser()
      }
      reader.readAsDataURL(profilePicInput.files[0])
    }

    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("currentUser", JSON.stringify(currentUser))

    alert(currentLanguage === "en" ? "Profile updated!" : "Perfil atualizado!")
    closeSettings()
    updateUIForLoggedInUser()
  }
}

function loadGallery() {
  const galleryGrid = document.getElementById("galleryGrid")
  if (!galleryGrid) return

  const currentGallery = JSON.parse(localStorage.getItem("gallery")) || []
  galleryGrid.innerHTML = ""

  currentGallery.forEach((imgUrl) => {
    const img = document.createElement("img")
    img.src = imgUrl
    img.alt = "Clara Stack"
    galleryGrid.appendChild(img)
  })
}

function loadNotifications() {
  const notifications = JSON.parse(localStorage.getItem("globalNotifications")) || []
  const container = document.getElementById("notificationsContainer")
  if (!container) return

  container.innerHTML = ""

  notifications.slice(0, 3).forEach((notif) => {
    const card = document.createElement("div")
    card.className = "notification-card"
    card.innerHTML = `
            <div class="notification-header">
                <span class="notification-author">📢 ${notif.author}</span>
                <span class="notification-time">${new Date(notif.timestamp).toLocaleDateString()}</span>
            </div>
            <p>${notif.content}</p>
        `
    container.appendChild(card)

    // Auto remove after 10 seconds
    setTimeout(() => card.remove(), 10000)
  })
}

function loadChatMessages() {
  const container = document.getElementById("chatMessages")
  if (!container) return

  const messages = JSON.parse(localStorage.getItem("chatMessages")) || []
  container.innerHTML = ""

  messages.forEach((msg) => {
    const messageDiv = document.createElement("div")
    messageDiv.className = "chat-message"
    messageDiv.innerHTML = `
      <div class="chat-message-header">
        <img src="${msg.avatar || DEFAULT_AVATAR}" alt="${msg.username}" class="chat-avatar">
        <span class="chat-username ${msg.isAdmin ? "admin" : ""}">${msg.username}</span>
        ${msg.verified ? '<img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" class="verified-badge" alt="Verified">' : ""}
        ${msg.isAdmin ? '<img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" class="admin-badge" alt="Admin">' : ""}
        <span class="chat-time">${new Date(msg.timestamp).toLocaleTimeString()}</span>
      </div>
      <p>${msg.message}</p>
    `
    container.appendChild(messageDiv)
  })

  container.scrollTop = container.scrollHeight
}

function sendMessage() {
  if (!currentUser) {
    alert(currentLanguage === "en" ? "Please login first" : "Faça login primeiro")
    return
  }

  if (chatLocked && !currentUser.isAdmin) {
    alert(currentLanguage === "en" ? "Chat is locked by admin" : "Chat bloqueado pelo administrador")
    return
  }

  const input = document.getElementById("chatInput")
  const message = input.value.trim()

  if (!message) return

  const cooldown = Number.parseInt(localStorage.getItem("chatCooldown") || "0")
  const now = Date.now()

  if (!currentUser.isAdmin && now - lastChatTime < cooldown * 1000) {
    const remaining = Math.ceil((cooldown * 1000 - (now - lastChatTime)) / 1000)
    document.getElementById("cooldownTimer").textContent = remaining
    document.getElementById("chatCooldown").style.display = "block"
    return
  }

  const chatMessage = {
    username: currentUser.username,
    message,
    timestamp: new Date().toISOString(),
    avatar: currentUser.avatar || DEFAULT_AVATAR,
    verified: currentUser.verified || false,
    isAdmin: currentUser.isAdmin || false,
  }

  chatMessages.push(chatMessage)
  localStorage.setItem("chatMessages", JSON.stringify(chatMessages))

  input.value = ""
  lastChatTime = now
  loadChatMessages()

  if (!currentUser.isAdmin && cooldown > 0) {
    document.getElementById("chatCooldown").style.display = "block"
    let remaining = cooldown
    const interval = setInterval(() => {
      remaining--
      document.getElementById("cooldownTimer").textContent = remaining
      if (remaining <= 0) {
        document.getElementById("chatCooldown").style.display = "none"
        clearInterval(interval)
      }
    }, 1000)
  }
}

// Close modals when clicking outside
window.onclick = (event) => {
  const authModal = document.getElementById("authModal")
  const settingsModal = document.getElementById("settingsModal")
  const adminPanel = document.getElementById("adminPanel")

  if (event.target === authModal) {
    authModal.style.display = "none"
  }
  if (event.target === settingsModal) {
    settingsModal.style.display = "none"
  }
  if (event.target === adminPanel) {
    adminPanel.style.display = "none"
  }
}

// Enter key to send message
const chatInput = document.getElementById("chatInput")
if (chatInput) {
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  })
}

function logout() {
  if (currentUser) {
    removeActiveUser(currentUser.username)
  }
  currentUser = null
  localStorage.removeItem("currentUser")
  updateUIForLoggedInUser()
  location.reload()
}

function updateChatLockStatus() {
  const chatInput = document.getElementById("chatInput")
  const chatButton = document.querySelector(".chat-input-container button")

  if (chatInput && chatButton) {
    if (chatLocked && (!currentUser || !currentUser.isAdmin)) {
      chatInput.disabled = true
      chatInput.placeholder = currentLanguage === "en" ? "Chat is locked by admin" : "Chat bloqueado pelo admin"
      chatButton.disabled = true
    } else {
      chatInput.disabled = false
      chatInput.placeholder = currentLanguage === "en" ? "Type your message..." : "Digite sua mensagem..."
      chatButton.disabled = false
    }
  }
}

function toggleChatLock() {
  chatLocked = !chatLocked
  localStorage.setItem("chatLocked", chatLocked.toString())

  const btn = document.getElementById("chatLockBtn")
  if (btn) {
    btn.innerHTML = chatLocked
      ? '<span data-en="🔓 Unlock Chat" data-pt="🔓 Desbloquear Chat">🔓 Desbloquear Chat</span>'
      : '<span data-en="🔒 Lock Chat" data-pt="🔒 Bloquear Chat">🔒 Bloquear Chat</span>'
    btn.className = chatLocked ? "danger-btn" : "warning-btn"
  }

  updateLanguage()
  updateChatLockStatus()
  alert(
    chatLocked
      ? currentLanguage === "en"
        ? "Chat locked!"
        : "Chat bloqueado!"
      : currentLanguage === "en"
        ? "Chat unlocked!"
        : "Chat desbloqueado!",
  )
}

async function register() {
  const username = document.getElementById("registerUsername").value.trim()
  const email = document.getElementById("registerEmail").value.trim()
  const password = document.getElementById("registerPassword").value

  if (!username || !email || !password) {
    alert(currentLanguage === "en" ? "Please fill all fields" : "Preencha todos os campos")
    return
  }

  if (users.find((u) => u.email === email)) {
    alert(currentLanguage === "en" ? "Email already registered" : "Email já cadastrado")
    return
  }

  if (users.find((u) => u.username === username)) {
    alert(currentLanguage === "en" ? "Username already taken" : "Nome de usuário já existe")
    return
  }

  const ipInfo = await getIPInfo()

  const user = {
    username,
    email,
    password,
    ip: ipInfo.ip,
    ipInfo,
    avatar: DEFAULT_AVATAR, // Set default avatar
    verified: false,
    banned: false,
    isAdmin: false,
    canPostImages: false,
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  localStorage.setItem("users", JSON.stringify(users))

  await sendWebhook(WEBHOOKS.newUser, {
    content: `✅ New user registered: ${username} (${email}) from ${ipInfo.city}, ${ipInfo.country}`,
  })

  alert(currentLanguage === "en" ? "Registration successful!" : "Registro realizado com sucesso!")
  showLoginForm()
}

async function login() {
  const username = document.getElementById("loginUsername").value.trim()
  const password = document.getElementById("loginPassword").value

  if (username === "admin" && password === "admin") {
    const ipInfo = await getIPInfo()
    currentUser = {
      username: "admin",
      isAdmin: true,
      avatar: "https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png",
      ip: ipInfo.ip,
      ipInfo,
    }
    localStorage.setItem("currentUser", JSON.stringify(currentUser))
    closeAuthModal()
    updateUIForLoggedInUser()
    return
  }

  const user = users.find((u) => u.username === username && u.password === password)

  if (!user) {
    alert(currentLanguage === "en" ? "Invalid credentials" : "Credenciais inválidas")
    return
  }

  if (user.banned) {
    alert(currentLanguage === "en" ? "Your account is banned" : "Sua conta está banida")
    return
  }

  const ipInfo = await getIPInfo()
  const currentIP = ipInfo.ip

  if (user.ip !== currentIP && !user.isAdmin) {
    user.banned = true
    localStorage.setItem("users", JSON.stringify(users))

    await sendWebhook(WEBHOOKS.suspended, {
      content: `🚫 Account suspended during login: ${username} (IP changed from ${user.ip} to ${currentIP})`,
    })

    alert(
      currentLanguage === "en"
        ? "Account suspended due to IP change. Contact admin."
        : "Conta suspensa devido a mudança de IP. Contate o administrador.",
    )
    return
  }

  user.ipInfo = ipInfo
  currentUser = user
  localStorage.setItem("currentUser", JSON.stringify(currentUser))
  closeAuthModal()
  updateUIForLoggedInUser()
  addActiveUser(username)
}
