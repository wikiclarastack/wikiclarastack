// Global Variables
let currentUser = null
let currentLanguage = "en"
const users = JSON.parse(localStorage.getItem("users")) || []
const chatMessages = JSON.parse(localStorage.getItem("chatMessages")) || []
const visitors = JSON.parse(localStorage.getItem("visitors")) || []
let activeUsers = JSON.parse(localStorage.getItem("activeUsers")) || []
const gallery = JSON.parse(localStorage.getItem("gallery")) || [
  "https://image.tmdb.org/t/p/w500/yMK3IADqV2oReJMKdkrcEIBxdtu.jpg",
  "https://ntvb.tmsimg.com/assets/assets/GNLZZGG002G2JKZ.jpg",
  "https://media.gettyimages.com/id/2242330361/photo/los-angeles-premiere-of-hbo-original-series-it-welcome-to-derry-red-carpet.jpg?s=1024x1024&w=gi&k=20&c=SATqk9OF8uyP8-6xKlIUS4AhKcPg3unpDSieOnkrGrc=",
]
let lastChatTime = 0

// Discord Webhooks
const WEBHOOKS = {
  newUser:
    "https://discord.com/api/webhooks/1453870908946256136/m8Abdnk_2moAy2nojUYmJ6_slK5xbWZ3tBxahEemij9zBu8wf31n5nPmf2HG3I1gM1ax",
  suspended:
    "https://discord.com/api/webhooks/1453870994233233672/ECP6u8tLh4ui2t3HOagXinv9QkeAU8mUScKLKkiY47mFNejrQhGU9v3xRNaHI4UjeqfC",
  visitors:
    "https://discord.com/api/webhooks/1453871095672340612/U1fotOujLXmOESKp0JJXLEa3zcqGnImE2ENz_Vpw8ekLI81wD0uvDbTWIkHLMV9SE3K0",
}

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

  // Update active users every 30 seconds
  setInterval(updateActiveUsers, 30000)
})

function checkMaintenanceMode() {
  const maintenanceMode = localStorage.getItem("maintenanceMode") === "true"
  const maintenanceScreen = document.getElementById("maintenanceScreen")

  if (maintenanceMode) {
    maintenanceScreen.style.display = "flex"
  }
}

function checkMaintenancePassword() {
  const password = document.getElementById("maintenancePassword").value
  const savedPassword = localStorage.getItem("maintenancePassword")

  if (password === savedPassword) {
    document.getElementById("maintenanceScreen").style.display = "none"
  } else {
    alert("Invalid password")
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

  try {
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()
    currentLanguage = data.country_code === "BR" ? "pt" : "en"
    updateLanguage()
  } catch (error) {
    console.log("Region detection failed, using default")
  }
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

// Log Visitor
async function logVisitor() {
  const ip = await getIPAddress()
  const timestamp = new Date().toISOString()
  const visitor = { ip, timestamp }

  visitors.push(visitor)
  localStorage.setItem("visitors", JSON.stringify(visitors))

  await sendWebhook(WEBHOOKS.visitors, {
    content: `🌐 New visitor: IP ${ip} at ${new Date().toLocaleString()}`,
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
    const currentIP = await getIPAddress()

    if (!user.isAdmin && user.ip !== currentIP) {
      // Suspend account
      const userIndex = users.findIndex((u) => u.username === user.username)
      if (userIndex !== -1) {
        users[userIndex].banned = true
        localStorage.setItem("users", JSON.stringify(users))

        await sendWebhook(WEBHOOKS.suspended, {
          content: `🚫 Account suspended: ${user.username} (IP changed from ${user.ip} to ${currentIP})`,
        })
      }

      logout()
      alert(
        currentLanguage === "en"
          ? "Your account has been suspended due to IP change. Contact admin."
          : "Sua conta foi suspensa devido a mudança de IP. Contate o administrador.",
      )
    } else {
      currentUser = user
      updateUIForLoggedInUser()
      addActiveUser(user.username)
    }
  }
}

function addActiveUser(username) {
  if (!activeUsers.includes(username)) {
    activeUsers.push(username)
    localStorage.setItem("activeUsers", JSON.stringify(activeUsers))
  }
}

function removeActiveUser(username) {
  activeUsers = activeUsers.filter((u) => u !== username)
  localStorage.setItem("activeUsers", JSON.stringify(activeUsers))
}

function updateActiveUsers() {
  if (currentUser && !currentUser.isAdmin) {
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
  window.open("admin.html", "_blank")
}

async function register() {
  const username = document.getElementById("registerUsername").value.trim()
  const email = document.getElementById("registerEmail").value.trim()
  const password = document.getElementById("registerPassword").value

  if (!username || !email || !password) {
    alert(currentLanguage === "en" ? "Please fill all fields" : "Preencha todos os campos")
    return
  }

  const ip = await getIPAddress()

  // Check if username exists
  if (users.find((u) => u.username === username)) {
    alert(currentLanguage === "en" ? "Username already exists" : "Nome de usuário já existe")
    return
  }

  // Check if email exists
  if (users.find((u) => u.email === email)) {
    alert(currentLanguage === "en" ? "Email already registered" : "Email já registrado")
    return
  }

  const newUser = {
    username,
    email,
    password,
    ip,
    verified: false,
    banned: false,
    isAdmin: false,
    canPostImages: false,
    registeredAt: new Date().toISOString(),
    avatar: "https://via.placeholder.com/100",
  }

  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))

  await sendWebhook(WEBHOOKS.newUser, {
    content: `✅ New registration: **${username}** (${email}) from IP ${ip}`,
  })

  closeAuthModal()
  alert(currentLanguage === "en" ? "Registration successful! Please login." : "Registro bem-sucedido! Faça login.")
}

async function login() {
  const username = document.getElementById("loginUsername").value.trim()
  const password = document.getElementById("loginPassword").value
  const ip = await getIPAddress()

  if (!username || !password) {
    alert(currentLanguage === "en" ? "Please fill all fields" : "Preencha todos os campos")
    return
  }

  // Admin login
  if (username === "admin" && password === "admin") {
    currentUser = {
      username: "admin",
      isAdmin: true,
      ip,
      avatar: "https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png",
    }
    localStorage.setItem("currentUser", JSON.stringify(currentUser))
    updateUIForLoggedInUser()
    closeAuthModal()
    return
  }

  // Regular user login
  const user = users.find((u) => u.username === username && u.password === password)

  if (!user) {
    alert(currentLanguage === "en" ? "Invalid credentials" : "Credenciais inválidas")
    return
  }

  if (user.banned) {
    alert(currentLanguage === "en" ? "Your account is suspended" : "Sua conta está suspensa")
    return
  }

  // Check for admins created by main admin
  if (!user.isAdmin && user.ip !== ip) {
    user.banned = true
    localStorage.setItem("users", JSON.stringify(users))

    await sendWebhook(WEBHOOKS.suspended, {
      content: `🚫 Account suspended: ${username} (IP mismatch: ${user.ip} vs ${ip})`,
    })

    alert(currentLanguage === "en" ? "IP address changed. Account suspended." : "Endereço IP alterado. Conta suspensa.")
    return
  }

  currentUser = user
  localStorage.setItem("currentUser", JSON.stringify(currentUser))
  updateUIForLoggedInUser()
  addActiveUser(user.username)
  closeAuthModal()
}

// Logout
function logout() {
  if (currentUser) {
    removeActiveUser(currentUser.username)
  }
  currentUser = null
  localStorage.removeItem("currentUser")
  updateUIForLoggedInUser()
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
    document.getElementById("cornerUserAvatar").src = currentUser.avatar || "https://via.placeholder.com/40"
    document.getElementById("cornerUserName").textContent = currentUser.username

    // Show admin panel link
    if (currentUser.isAdmin) {
      adminPanelLink.style.display = "block"
    }

    // Show chat
    chatContainer.style.display = "block"
    chatLoginPrompt.style.display = "none"
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
  if (!currentUser || currentUser.username === "admin") return

  document.getElementById("settingsUsername").value = currentUser.username
  document.getElementById("currentProfilePic").src = currentUser.avatar || "https://via.placeholder.com/100"

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
  if (!currentUser || currentUser.username === "admin") return

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
  galleryGrid.innerHTML = ""

  gallery.forEach((imgUrl) => {
    const img = document.createElement("img")
    img.src = imgUrl
    img.alt = "Clara Stack"
    galleryGrid.appendChild(img)
  })
}

function loadNotifications() {
  const notifications = JSON.parse(localStorage.getItem("globalNotifications")) || []
  const container = document.getElementById("notificationsContainer")

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
  const chatMessagesContainer = document.getElementById("chatMessages")
  if (!chatMessagesContainer) return

  chatMessagesContainer.innerHTML = ""

  chatMessages.forEach((msg) => {
    const user = users.find((u) => u.username === msg.username)
    const isAdmin = msg.isAdmin || user?.isAdmin

    const messageDiv = document.createElement("div")
    messageDiv.className = "chat-message"
    messageDiv.innerHTML = `
            <div class="chat-message-header">
                <img src="${msg.avatar || "https://via.placeholder.com/40"}" class="chat-avatar" alt="${msg.username}">
                <span class="chat-username ${isAdmin ? "admin" : ""}">${msg.username}</span>
                ${msg.verified ? '<img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" class="verified-badge" alt="Verified">' : ""}
                ${isAdmin ? '<img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" class="admin-badge" alt="Admin">' : ""}
                <span class="chat-time">${new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="chat-message-content">${msg.message}</div>
        `
    chatMessagesContainer.appendChild(messageDiv)
  })

  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight
}

function sendMessage() {
  if (!currentUser) {
    alert(currentLanguage === "en" ? "Please login to chat" : "Faça login para usar o chat")
    return
  }

  const cooldown = Number.parseInt(localStorage.getItem("chatCooldown")) || 0
  const now = Date.now()

  if (now - lastChatTime < cooldown * 1000 && !currentUser.isAdmin) {
    const remaining = Math.ceil((cooldown * 1000 - (now - lastChatTime)) / 1000)
    document.getElementById("chatCooldown").style.display = "block"
    document.getElementById("cooldownTimer").textContent = remaining

    setTimeout(() => {
      document.getElementById("chatCooldown").style.display = "none"
    }, remaining * 1000)

    return
  }

  const input = document.getElementById("chatInput")
  const message = input.value.trim()

  if (!message) return

  const user = users.find((u) => u.username === currentUser.username)

  const chatMessage = {
    username: currentUser.username,
    message,
    verified: user?.verified || false,
    isAdmin: currentUser.isAdmin || false,
    avatar: currentUser.avatar || "https://via.placeholder.com/40",
    timestamp: new Date().toISOString(),
  }

  chatMessages.push(chatMessage)
  localStorage.setItem("chatMessages", JSON.stringify(chatMessages))

  input.value = ""
  lastChatTime = now
  loadChatMessages()
}

// Close modals when clicking outside
window.onclick = (event) => {
  const authModal = document.getElementById("authModal")
  const settingsModal = document.getElementById("settingsModal")

  if (event.target === authModal) {
    authModal.style.display = "none"
  }
  if (event.target === settingsModal) {
    settingsModal.style.display = "none"
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
