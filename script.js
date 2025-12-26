// Global Variables
let currentUser = null
let currentLanguage = "en"
let userIP = null
let chatMessages = []

// Discord Webhooks
const SUSPENDED_WEBHOOK =
  "https://discord.com/api/webhooks/1453870994233233672/ECP6u8tLh4ui2t3HOagXinv9QkeAU8mUScKLKkiY47mFNejrQhGU9v3xRNaHI4UjeqfC"
const LOG_WEBHOOK =
  "https://discord.com/api/webhooks/1453871095672340612/U1fotOujLXmOESKp0JJXLEa3zcqGnImE2ENz_Vpw8ekLI81wD0uvDbTWIkHLMV9SE3K0"

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  await detectLanguage()
  await getUserIP()
  checkUserSession()
  initializeEventListeners()
  applyTheme()
  sendVisitorLog()
})

// Language Detection
async function detectLanguage() {
  try {
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()
    currentLanguage = data.country_code === "BR" ? "pt" : "en"
    updateLanguage()
  } catch (error) {
    console.log("[v0] Language detection error:", error)
    currentLanguage = "en"
    updateLanguage()
  }
}

function updateLanguage() {
  document.querySelectorAll("[data-en]").forEach((element) => {
    const text = element.getAttribute(`data-${currentLanguage}`)
    if (text) {
      if (element.tagName === "INPUT" || element.tagName === "BUTTON") {
        if (element.placeholder !== undefined) {
          element.placeholder = element.getAttribute(`data-${currentLanguage}-placeholder`) || text
        } else {
          element.textContent = text
        }
      } else {
        element.textContent = text
      }
    }
  })
}

// Get User IP
async function getUserIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json()
    userIP = data.ip
    console.log("[v0] User IP detected:", userIP)
  } catch (error) {
    console.log("[v0] IP detection error:", error)
    userIP = "unknown"
  }
}

// Send Visitor Log to Discord
async function sendVisitorLog() {
  const timestamp = new Date().toISOString()
  const message = {
    embeds: [
      {
        title: "🌐 New Visitor",
        color: 15158332,
        fields: [
          { name: "IP", value: userIP, inline: true },
          { name: "Language", value: currentLanguage.toUpperCase(), inline: true },
          { name: "Timestamp", value: timestamp, inline: false },
        ],
      },
    ],
  }

  try {
    await fetch(LOG_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    })
  } catch (error) {
    console.log("[v0] Failed to send visitor log:", error)
  }
}

// Initialize Event Listeners
function initializeEventListeners() {
  // Mobile Menu
  const hamburger = document.querySelector(".hamburger")
  const navLinks = document.querySelector(".nav-links")
  hamburger?.addEventListener("click", () => {
    navLinks.classList.toggle("active")
  })

  const signupBtn = document.querySelector(".btn-signup")
  const signinBtn = document.querySelector(".btn-signin")
  const loginBtn = document.querySelector(".btn-login")
  const loginModal = document.getElementById("loginModal")
  const closeModal = document.querySelector(".close")

  // Sign-up button - opens modal in register mode
  signupBtn?.addEventListener("click", () => {
    if (currentUser) {
      document.getElementById("userMenu").style.display =
        document.getElementById("userMenu").style.display === "none" ? "block" : "none"
    } else {
      loginModal.style.display = "block"
      document.getElementById("loginForm").style.display = "none"
      document.getElementById("registerForm").style.display = "block"
      document.getElementById("modalTitle").textContent = currentLanguage === "pt" ? "Registrar" : "Register"
    }
  })

  // Sign-in button - opens modal in login mode
  signinBtn?.addEventListener("click", () => {
    if (currentUser) {
      document.getElementById("userMenu").style.display =
        document.getElementById("userMenu").style.display === "none" ? "block" : "none"
    } else {
      loginModal.style.display = "block"
      document.getElementById("loginForm").style.display = "block"
      document.getElementById("registerForm").style.display = "none"
      document.getElementById("modalTitle").textContent = currentLanguage === "pt" ? "Entrar" : "Login"
    }
  })

  loginBtn?.addEventListener("click", () => {
    if (currentUser) {
      document.getElementById("userMenu").style.display =
        document.getElementById("userMenu").style.display === "none" ? "block" : "none"
    } else {
      loginModal.style.display = "block"
    }
  })

  closeModal?.addEventListener("click", () => {
    loginModal.style.display = "none"
  })

  // Switch between Login and Register
  document.getElementById("switchToRegister")?.addEventListener("click", () => {
    document.getElementById("loginForm").style.display = "none"
    document.getElementById("registerForm").style.display = "block"
    document.getElementById("modalTitle").textContent = currentLanguage === "pt" ? "Registrar" : "Register"
  })

  document.getElementById("switchToLogin")?.addEventListener("click", () => {
    document.getElementById("registerForm").style.display = "none"
    document.getElementById("loginForm").style.display = "block"
    document.getElementById("modalTitle").textContent = currentLanguage === "pt" ? "Entrar" : "Login"
  })

  // Login
  document.getElementById("loginBtn")?.addEventListener("click", handleLogin)

  // Register
  document.getElementById("registerBtn")?.addEventListener("click", handleRegister)

  // Settings Modal
  const settingsBtn = document.getElementById("settingsBtn")
  const headerSettingsBtn = document.getElementById("headerSettingsBtn")
  const settingsModal = document.getElementById("settingsModal")
  const closeSettings = document.querySelector(".close-settings")

  settingsBtn?.addEventListener("click", () => {
    settingsModal.style.display = "block"
    loadSettings()
  })

  headerSettingsBtn?.addEventListener("click", () => {
    settingsModal.style.display = "block"
    loadSettings()
  })

  closeSettings?.addEventListener("click", () => {
    settingsModal.style.display = "none"
  })

  // Save Settings
  document.getElementById("saveSettings")?.addEventListener("click", handleSaveSettings)

  // Admin Panel
  const adminBtn = document.getElementById("adminBtn")
  const adminModal = document.getElementById("adminModal")
  const closeAdmin = document.querySelector(".close-admin")

  adminBtn?.addEventListener("click", () => {
    adminModal.style.display = "block"
    loadAdminPanel()
  })

  closeAdmin?.addEventListener("click", () => {
    adminModal.style.display = "none"
  })

  // Admin Tabs
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"))
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"))
      btn.classList.add("active")
      const tabName = btn.getAttribute("data-tab")
      document.getElementById(`${tabName}Tab`).classList.add("active")
    })
  })

  // Logout
  document.getElementById("logoutBtn")?.addEventListener("click", handleLogout)

  // Chat
  document.getElementById("sendMessage")?.addEventListener("click", sendChatMessage)
  document.getElementById("chatInput")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendChatMessage()
  })

  document.getElementById("redirectYes")?.addEventListener("click", () => {
    const url = document.getElementById("redirectUrl").textContent
    window.open(url, "_blank")
    document.getElementById("redirectModal").style.display = "none"
  })

  document.getElementById("redirectNo")?.addEventListener("click", () => {
    document.getElementById("redirectModal").style.display = "none"
  })

  // Close modals on outside click
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none"
    }
  })
}

// Authentication
function handleLogin() {
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value

  if (!username || !password) {
    alert(currentLanguage === "pt" ? "Preencha todos os campos!" : "Please fill all fields!")
    return
  }

  // Admin Login
  if (username === "admin" && password === "admin") {
    currentUser = {
      username: "admin",
      email: "admin@clarastack.com",
      isAdmin: true,
      verified: true,
      ip: userIP,
      avatar: "https://via.placeholder.com/50",
    }
    saveToLocalStorage("currentUser", currentUser)
    loginSuccess()
    return
  }

  // Regular User Login
  const users = getFromLocalStorage("users") || []
  const user = users.find((u) => u.username === username && u.password === password)

  if (user) {
    // Check IP
    if (user.ip !== userIP) {
      user.suspended = true
      saveToLocalStorage("users", users)
      sendSuspendedLog(user)
      alert(
        currentLanguage === "pt"
          ? "Conta suspensa! IP diferente detectado."
          : "Account suspended! Different IP detected.",
      )
      return
    }

    if (user.suspended) {
      alert(currentLanguage === "pt" ? "Sua conta está suspensa!" : "Your account is suspended!")
      return
    }

    currentUser = user
    saveToLocalStorage("currentUser", currentUser)
    loginSuccess()
  } else {
    alert(currentLanguage === "pt" ? "Usuário ou senha incorretos!" : "Incorrect username or password!")
  }
}

function handleRegister() {
  const username = document.getElementById("regUsername").value
  const email = document.getElementById("regEmail").value
  const password = document.getElementById("regPassword").value

  if (!username || !email || !password) {
    alert(currentLanguage === "pt" ? "Preencha todos os campos!" : "Please fill all fields!")
    return
  }

  const users = getFromLocalStorage("users") || []

  if (users.find((u) => u.username === username)) {
    alert(currentLanguage === "pt" ? "Nome de usuário já existe!" : "Username already exists!")
    return
  }

  if (users.find((u) => u.email === email)) {
    alert(currentLanguage === "pt" ? "E-mail já cadastrado!" : "Email already registered!")
    return
  }

  const newUser = {
    username,
    email,
    password,
    ip: userIP,
    verified: false,
    suspended: false,
    isAdmin: false,
    avatar: "https://via.placeholder.com/50",
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveToLocalStorage("users", users)

  currentUser = newUser
  saveToLocalStorage("currentUser", currentUser)

  loginSuccess()
}

function loginSuccess() {
  document.getElementById("loginModal").style.display = "none"
  updateUserInterface()
  sendLoginLog()
}

function updateUserInterface() {
  const signupBtn = document.querySelector(".btn-signup")
  const signinBtn = document.querySelector(".btn-signin")
  const loginBtn = document.querySelector(".btn-login")

  const userProfileHeader = document.getElementById("userProfileHeader")
  const headerUserAvatar = document.getElementById("headerUserAvatar")
  const headerUsername = document.getElementById("headerUsername")
  const headerVerifiedBadge = document.getElementById("headerVerifiedBadge")

  if (signupBtn && signinBtn) {
    signupBtn.style.display = "none"
    signinBtn.style.display = "none"
  }

  if (userProfileHeader) {
    userProfileHeader.style.display = "flex"
    headerUserAvatar.src = currentUser.avatar
    headerUsername.textContent = currentUser.username

    if (currentUser.verified) {
      headerVerifiedBadge.style.display = "inline"
    } else {
      headerVerifiedBadge.style.display = "none"
    }
  }

  if (loginBtn) {
    loginBtn.style.display = "block"
    loginBtn.textContent = currentUser.username
  }

  document.getElementById("userDisplayName").textContent = currentUser.username
  document.getElementById("userAvatar").src = currentUser.avatar

  if (currentUser.verified) {
    document.getElementById("verifiedBadge").style.display = "inline"
  }

  if (currentUser.isAdmin) {
    document.getElementById("adminBtn").style.display = "block"
  }

  loadChatMessages()
}

function handleLogout() {
  currentUser = null
  localStorage.removeItem("currentUser")
  document.getElementById("userMenu").style.display = "none"

  const signupBtn = document.querySelector(".btn-signup")
  const signinBtn = document.querySelector(".btn-signin")
  const loginBtn = document.querySelector(".btn-login")
  const userProfileHeader = document.getElementById("userProfileHeader")

  if (signupBtn && signinBtn) {
    signupBtn.style.display = "block"
    signinBtn.style.display = "block"
  }

  if (userProfileHeader) {
    userProfileHeader.style.display = "none"
  }

  if (loginBtn) {
    loginBtn.style.display = "none"
  }

  location.reload()
}

function checkUserSession() {
  const savedUser = getFromLocalStorage("currentUser")
  if (savedUser) {
    // Check IP
    if (savedUser.ip !== userIP && !savedUser.isAdmin) {
      const users = getFromLocalStorage("users") || []
      const userIndex = users.findIndex((u) => u.username === savedUser.username)
      if (userIndex !== -1) {
        users[userIndex].suspended = true
        saveToLocalStorage("users", users)
        sendSuspendedLog(users[userIndex])
      }
      localStorage.removeItem("currentUser")
      alert(
        currentLanguage === "pt"
          ? "Conta suspensa! IP diferente detectado."
          : "Account suspended! Different IP detected.",
      )
      return
    }

    currentUser = savedUser
    updateUserInterface()
  } else {
    const loginBtn = document.querySelector(".btn-login")
    const userProfileHeader = document.getElementById("userProfileHeader")
    if (loginBtn) {
      loginBtn.style.display = "none"
    }
    if (userProfileHeader) {
      userProfileHeader.style.display = "none"
    }
  }
}

// Settings
function loadSettings() {
  if (currentUser) {
    document.getElementById("settingsUsername").value = currentUser.username
    const theme = localStorage.getItem("theme") || "system"
    document.getElementById("themeSelector").value = theme
  }
}

function handleSaveSettings() {
  const newUsername = document.getElementById("settingsUsername").value
  const newPassword = document.getElementById("settingsPassword").value
  const profilePicture = document.getElementById("profilePicture").files[0]
  const theme = document.getElementById("themeSelector").value

  if (newUsername && newUsername !== currentUser.username) {
    const users = getFromLocalStorage("users") || []
    if (users.find((u) => u.username === newUsername && u.username !== currentUser.username)) {
      alert(currentLanguage === "pt" ? "Nome de usuário já existe!" : "Username already exists!")
      return
    }
    currentUser.username = newUsername
  }

  if (newPassword) {
    currentUser.password = newPassword
  }

  if (profilePicture) {
    const reader = new FileReader()
    reader.onload = (e) => {
      currentUser.avatar = e.target.result
      document.getElementById("userAvatar").src = e.target.result
      document.getElementById("headerUserAvatar").src = e.target.result
      updateUserInStorage()
    }
    reader.readAsDataURL(profilePicture)
  }

  localStorage.setItem("theme", theme)
  applyTheme()

  updateUserInStorage()
  alert(currentLanguage === "pt" ? "Configurações salvas!" : "Settings saved!")
  document.getElementById("settingsModal").style.display = "none"
}

function updateUserInStorage() {
  if (!currentUser.isAdmin) {
    const users = getFromLocalStorage("users") || []
    const index = users.findIndex((u) => u.email === currentUser.email)
    if (index !== -1) {
      users[index] = currentUser
      saveToLocalStorage("users", users)
    }
  }
  saveToLocalStorage("currentUser", currentUser)
  updateUserInterface()
}

// Theme
function applyTheme() {
  const theme = localStorage.getItem("theme") || "system"

  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    document.body.className = prefersDark ? "dark-theme" : "light-theme"
  } else {
    document.body.className = theme === "dark" ? "dark-theme" : "light-theme"
  }
}

// Chat
function sendChatMessage() {
  if (!currentUser) {
    alert(currentLanguage === "pt" ? "Faça login para enviar mensagens!" : "Please login to send messages!")
    return
  }

  const input = document.getElementById("chatInput")
  const message = input.value.trim()

  if (!message) return

  const chatMessage = {
    username: currentUser.username,
    message: message,
    verified: currentUser.verified,
    timestamp: new Date().toISOString(),
    avatar: currentUser.avatar,
  }

  chatMessages = getFromLocalStorage("chatMessages") || []
  chatMessages.push(chatMessage)
  saveToLocalStorage("chatMessages", chatMessages)

  input.value = ""
  loadChatMessages()
  sendChatLog(chatMessage)
}

function loadChatMessages() {
  chatMessages = getFromLocalStorage("chatMessages") || []
  const container = document.getElementById("chatMessages")
  container.innerHTML = ""

  chatMessages.forEach((msg) => {
    const messageDiv = document.createElement("div")
    messageDiv.className = `chat-message ${msg.verified ? "verified" : ""}`

    const time = new Date(msg.timestamp).toLocaleTimeString()

    messageDiv.innerHTML = `
            <div class="message-header">
                <img src="${msg.avatar}" alt="${msg.username}" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 8px;">
                <span>${msg.username}</span>
                ${msg.verified ? '<span class="verified-badge">✓</span>' : ""}
                <span class="message-time">${time}</span>
            </div>
            <div>${msg.message}</div>
        `

    container.appendChild(messageDiv)
  })

  container.scrollTop = container.scrollHeight
}

// Admin Panel
function loadAdminPanel() {
  loadUsersList()
  loadLogsList()
  loadBannedList()
}

function loadUsersList() {
  const users = getFromLocalStorage("users") || []
  const container = document.getElementById("usersList")
  container.innerHTML = ""

  users.forEach((user, index) => {
    const userDiv = document.createElement("div")
    userDiv.className = "user-item"
    userDiv.innerHTML = `
            <div>
                <strong>${user.username}</strong> (${user.email})
                ${user.verified ? '<span style="color: #28a745;">✓</span>' : ""}
                ${user.suspended ? '<span style="color: #dc3545;">[SUSPENDED]</span>' : ""}
            </div>
            <div class="user-actions">
                <button class="verify" onclick="toggleVerify(${index})">${user.verified ? "Unverify" : "Verify"}</button>
                <button class="ban" onclick="toggleBan(${index})">${user.suspended ? "Unban" : "Ban"}</button>
                <button onclick="viewUserLogs('${user.username}')">Logs</button>
            </div>
        `
    container.appendChild(userDiv)
  })
}

function loadLogsList() {
  const logs = getFromLocalStorage("systemLogs") || []
  const container = document.getElementById("logsList")
  container.innerHTML = ""

  logs
    .slice(-50)
    .reverse()
    .forEach((log) => {
      const logDiv = document.createElement("div")
      logDiv.className = "log-item"
      logDiv.innerHTML = `
            <div>
                <strong>${log.type}</strong>: ${log.message}
                <br><small>${new Date(log.timestamp).toLocaleString()}</small>
            </div>
        `
      container.appendChild(logDiv)
    })
}

function loadBannedList() {
  const users = getFromLocalStorage("users") || []
  const bannedUsers = users.filter((u) => u.suspended)
  const container = document.getElementById("bannedList")
  container.innerHTML = ""

  bannedUsers.forEach((user) => {
    const bannedDiv = document.createElement("div")
    bannedDiv.className = "banned-item"
    bannedDiv.innerHTML = `
            <div>
                <strong>${user.username}</strong>
                <br>IP: ${user.ip}
            </div>
            <div class="banned-actions">
                <button onclick="unbanByIP('${user.ip}')">Unban</button>
            </div>
        `
    container.appendChild(bannedDiv)
  })
}

// Admin Functions
function toggleVerify(index) {
  const users = getFromLocalStorage("users") || []
  users[index].verified = !users[index].verified
  saveToLocalStorage("users", users)

  if (currentUser.username === users[index].username) {
    currentUser.verified = users[index].verified
    saveToLocalStorage("currentUser", currentUser)
    updateUserInterface()
  }

  loadUsersList()
  addSystemLog("VERIFY", `User ${users[index].username} ${users[index].verified ? "verified" : "unverified"}`)
}

function toggleBan(index) {
  const users = getFromLocalStorage("users") || []
  users[index].suspended = !users[index].suspended
  saveToLocalStorage("users", users)

  if (users[index].suspended) {
    sendSuspendedLog(users[index])
  }

  loadUsersList()
  loadBannedList()
  addSystemLog("BAN", `User ${users[index].username} ${users[index].suspended ? "banned" : "unbanned"}`)
}

function unbanByIP(ip) {
  const users = getFromLocalStorage("users") || []
  users.forEach((user) => {
    if (user.ip === ip) {
      user.suspended = false
    }
  })
  saveToLocalStorage("users", users)
  loadUsersList()
  loadBannedList()
  addSystemLog("UNBAN", `IP ${ip} unbanned`)
}

function viewUserLogs(username) {
  const chatMessages = getFromLocalStorage("chatMessages") || []
  const userMessages = chatMessages.filter((msg) => msg.username === username)

  alert(
    `Messages from ${username}:\n\n` +
      userMessages.map((msg) => `[${new Date(msg.timestamp).toLocaleString()}] ${msg.message}`).join("\n\n"),
  )
}

// Discord Logging
async function sendSuspendedLog(user) {
  const message = {
    embeds: [
      {
        title: "🚫 Account Suspended",
        color: 15158332,
        fields: [
          { name: "Username", value: user.username, inline: true },
          { name: "Email", value: user.email, inline: true },
          { name: "IP", value: user.ip, inline: true },
          { name: "Reason", value: "IP Address Changed", inline: false },
          { name: "Timestamp", value: new Date().toISOString(), inline: false },
        ],
      },
    ],
  }

  try {
    await fetch(SUSPENDED_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    })
  } catch (error) {
    console.log("[v0] Failed to send suspension log:", error)
  }
}

async function sendLoginLog() {
  const message = {
    embeds: [
      {
        title: "🔐 User Login",
        color: 3066993,
        fields: [
          { name: "Username", value: currentUser.username, inline: true },
          { name: "IP", value: userIP, inline: true },
          { name: "Verified", value: currentUser.verified ? "Yes" : "No", inline: true },
          { name: "Timestamp", value: new Date().toISOString(), inline: false },
        ],
      },
    ],
  }

  try {
    await fetch(LOG_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    })
  } catch (error) {
    console.log("[v0] Failed to send login log:", error)
  }
}

async function sendChatLog(chatMessage) {
  const message = {
    embeds: [
      {
        title: "💬 New Chat Message",
        color: 5793266,
        fields: [
          { name: "Username", value: chatMessage.username, inline: true },
          { name: "Verified", value: chatMessage.verified ? "Yes" : "No", inline: true },
          { name: "Message", value: chatMessage.message, inline: false },
          { name: "Timestamp", value: new Date(chatMessage.timestamp).toISOString(), inline: false },
        ],
      },
    ],
  }

  try {
    await fetch(LOG_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    })
  } catch (error) {
    console.log("[v0] Failed to send chat log:", error)
  }
}

// System Logs
function addSystemLog(type, message) {
  const logs = getFromLocalStorage("systemLogs") || []
  logs.push({
    type,
    message,
    timestamp: new Date().toISOString(),
  })
  saveToLocalStorage("systemLogs", logs)
}

// LocalStorage Helpers
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function getFromLocalStorage(key) {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  })
})

// IT: Welcome to Derry redirect handler
function handleITRedirect() {
  const redirectUrl =
    "https://www.google.com/aclk?sa=L&ai=DChsSEwilu9zG99uRAxUIZ0gAHc3hF5UYACICCAEQABoCY2U&co=1&gclid=Cj0KCQiAgbnKBhDgARIsAGCDdlcbmHt1C0YlZ3xRnFR_6tgKNxa4iwUMRwOKiFF9KeH7iUJ3KmuqIVkaAmYEEALw_wcB&cid=CAAS3QHkaB2OkeqnpS4f7fKMHp84g9gopnJMyhTKMFuOjv77waUgJH_gwpYmnLkHh1jsmSzsPpIKa92dCuHW0bwb8AT2Brk_BlhEJxkyHRTrylsih3PnKl70MD2Zy0l4fDMZqvYb0Ogi6cT7_TRTvtOWQQZwGBrx0xAN2eYlopYeJd6b3JM_6i6r0xmq_WnacWk3mcgoF6eSxpIo25lI3jvhAmYn9tIcZ0xtXVQg9RBw-CpfpBglHsPs_JVINubV1MBq3BBc1qLSUz2L0ArGPfDTYKI9ErL8EZPPfyXusoxN_A&cce=2&sig=AOD64_1nT-8kQKHDi3ziOR9P8q0_66zwVg&q&adurl&ved=2ahUKEwjQpdXG99uRAxVsqpUCHQSlENUQ0Qx6BAgREAE"

  const modal = document.getElementById("redirectModal")
  const urlDisplay = document.getElementById("redirectUrl")

  // Show beginning of URL
  const urlPreview = redirectUrl.substring(0, 50) + "..."
  urlDisplay.textContent = urlPreview
  urlDisplay.setAttribute("data-full-url", redirectUrl)

  modal.style.display = "block"
}
