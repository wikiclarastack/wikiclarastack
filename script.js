// Initialize
let currentUser = null
let isRegistering = false
const chatCooldownTime = 0
let lastMessageTime = 0

// Webhooks
const WEBHOOK_SUSPEND =
  "https://discord.com/api/webhooks/1453870994233233672/ECP6u8tLh4ui2t3HOagXinv9QkeAU8mUScKLKkiY47mFNejrQhGU9v3xRNaHI4UjeqfC"
const WEBHOOK_LOG =
  "https://discord.com/api/webhooks/1453871095672340612/U1fotOujLXmOESKp0JJXLEa3zcqGnImE2ENz_Vpw8ekLI81wD0uvDbTWIkHLMV9SE3K0"

// Translations
const translations = {
  en: {
    home: "Home",
    about: "About",
    works: "Works",
    gallery: "Gallery",
    chat: "Chat",
    settings: "Settings",
    logout: "Logout",
    login: "Login",
  },
  pt: {
    home: "Início",
    about: "Sobre",
    works: "Trabalhos",
    gallery: "Galeria",
    chat: "Chat",
    settings: "Configurações",
    logout: "Sair",
    login: "Login",
  },
}

// Get user IP
async function getUserIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json()
    return data.ip
  } catch (error) {
    return "unknown"
  }
}

// Get IP location
async function getIPLocation(ip) {
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

// Send to Discord webhook
async function sendToDiscord(webhook, message) {
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    })
  } catch (error) {
    console.error("Webhook error:", error)
  }
}

// Detect language based on location
async function detectLanguage() {
  const savedLang = localStorage.getItem("language")
  if (savedLang) {
    return savedLang
  }

  const ip = await getUserIP()
  const location = await getIPLocation(ip)

  if (location.country === "Brazil") {
    return "pt"
  }
  return "en"
}

// Apply language
function applyLanguage(lang) {
  document.querySelectorAll("[data-en]").forEach((element) => {
    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      element.placeholder = element.getAttribute(`data-${lang}-placeholder`)
    } else {
      element.textContent = element.getAttribute(`data-${lang}`)
    }
  })

  localStorage.setItem("language", lang)
}

// Theme handling
function applyTheme(theme) {
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    theme = prefersDark ? "dark" : "light"
  }

  document.body.className = theme + "-mode"
  localStorage.setItem("theme", theme)
}

// Initialize database structure
function initDatabase() {
  if (!localStorage.getItem("users")) {
    const users = [
      {
        username: "admin",
        password: "admin",
        email: "admin@clarastack.com",
        ip: "admin",
        isAdmin: true,
        isVerified: true,
        canPostMedia: true,
        avatar:
          "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png",
        createdAt: Date.now(),
      },
    ]
    localStorage.setItem("users", JSON.stringify(users))
  }

  if (!localStorage.getItem("messages")) {
    localStorage.setItem("messages", JSON.stringify([]))
  }

  if (!localStorage.getItem("gallery")) {
    const defaultGallery = [
      "https://image.tmdb.org/t/p/w500/yMK3IADqV2oReJMKdkrcEIBxdtu.jpg",
      "https://ntvb.tmsimg.com/assets/assets/GNLZZGG002G2JKZ.jpg",
      "https://media.gettyimages.com/id/2242330361/photo/los-angeles-premiere-of-hbo-original-series-it-welcome-to-derry-red-carpet.jpg?s=1024x1024&w=gi&k=20&c=SATqk9OF8uyP8-6xKlIUS4AhKcPg3unpDSieOnkrGrc=",
      "https://static.tvtropes.org/pmwiki/pub/images/img_4865_8.jpeg",
      "https://media.gettyimages.com/id/2242313791/photo/los-angeles-premiere-of-hbo-original-series-it-welcome-to-derry.jpg?s=1024x1024&w=gi&k=20&c=ozLhw5EvhFSpQeDS36PfCZIG0bY4ofPNxelcsJSN3ew=",
      "https://elcomercio.pe/resizer/v2/ZLEZYAYGJBAYNNIRVWBIOMJ6Z4.jpg?auth=585dcbc947baaa48292c190c1cce1d5fb0444fa13e83d411f29e0c5638ee7452&width=1200&height=1371&quality=75&smart=true",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvTMnnpP9p4yr3TbS1aqUktmPvVVyy7lvwqQ&s",
    ]
    localStorage.setItem("gallery", JSON.stringify(defaultGallery))
  }

  if (!localStorage.getItem("siteSettings")) {
    localStorage.setItem(
      "siteSettings",
      JSON.stringify({
        maintenance: false,
        chatLocked: false,
        chatCooldown: 0,
      }),
    )
  }
}

// Load gallery
function loadGallery() {
  const gallery = JSON.parse(localStorage.getItem("gallery") || "[]")
  const galleryGrid = document.getElementById("galleryGrid")
  galleryGrid.innerHTML = ""

  gallery.forEach((url) => {
    const img = document.createElement("img")
    img.src = url
    img.alt = "Clara Stack"
    galleryGrid.appendChild(img)
  })
}

// Check maintenance mode
function checkMaintenance() {
  const settings = JSON.parse(localStorage.getItem("siteSettings"))
  const maintenancePassword = sessionStorage.getItem("maintenanceAccess")

  if (settings.maintenance && maintenancePassword !== "admin") {
    document.getElementById("maintenanceMode").style.display = "flex"
    document.getElementById("mainContent").style.display = "none"
    return true
  } else {
    document.getElementById("maintenanceMode").style.display = "none"
    document.getElementById("mainContent").style.display = "block"
    return false
  }
}

// Authentication
async function register(username, email, password) {
  const users = JSON.parse(localStorage.getItem("users"))
  const ip = await getUserIP()
  const location = await getIPLocation(ip)

  // Check if email already exists
  if (users.find((u) => u.email === email)) {
    alert("Email already registered!")
    return false
  }

  // Check if username already exists
  if (users.find((u) => u.username === username)) {
    alert("Username already taken!")
    return false
  }

  // Check banned IPs
  const bannedIPs = JSON.parse(localStorage.getItem("bannedIPs") || "[]")
  if (bannedIPs.includes(ip)) {
    await sendToDiscord(
      WEBHOOK_SUSPEND,
      `🚫 Banned user attempted to register:\nUsername: ${username}\nIP: ${ip}\nLocation: ${location.city}, ${location.country}`,
    )
    alert("Your IP has been banned from this site.")
    return false
  }

  const newUser = {
    username,
    email,
    password,
    ip,
    location,
    isAdmin: false,
    isVerified: false,
    canPostMedia: false,
    avatar:
      "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png",
    createdAt: Date.now(),
    lastLogin: Date.now(),
  }

  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))

  await sendToDiscord(
    WEBHOOK_LOG,
    `✅ New user registered:\nUsername: ${username}\nEmail: ${email}\nIP: ${ip}\nLocation: ${location.city}, ${location.country}`,
  )

  return true
}

async function login(username, password) {
  const users = JSON.parse(localStorage.getItem("users"))
  const ip = await getUserIP()
  const location = await getIPLocation(ip)

  const user = users.find((u) => u.username === username && u.password === password)

  if (!user) {
    alert("Invalid credentials!")
    return false
  }

  // Check banned IPs
  const bannedIPs = JSON.parse(localStorage.getItem("bannedIPs") || "[]")
  if (bannedIPs.includes(ip)) {
    await sendToDiscord(
      WEBHOOK_SUSPEND,
      `🚫 Banned user attempted to login:\nUsername: ${username}\nIP: ${ip}\nLocation: ${location.city}, ${location.country}`,
    )
    alert("Your account has been suspended.")
    return false
  }

  // Check IP change (except for admin)
  if (user.username !== "admin" && user.ip !== ip) {
    await sendToDiscord(
      WEBHOOK_SUSPEND,
      `⚠️ IP change detected:\nUsername: ${username}\nOld IP: ${user.ip}\nNew IP: ${ip}\nAccount suspended.`,
    )
    alert("IP change detected. Your account has been suspended. Contact administrator.")
    return false
  }

  user.lastLogin = Date.now()
  localStorage.setItem("users", JSON.stringify(users))

  await sendToDiscord(
    WEBHOOK_LOG,
    `🔐 User logged in:\nUsername: ${username}\nIP: ${ip}\nLocation: ${location.city}, ${location.country}`,
  )

  currentUser = user
  sessionStorage.setItem("currentUser", JSON.stringify(user))
  updateUI()

  return true
}

function logout() {
  currentUser = null
  sessionStorage.removeItem("currentUser")
  updateUI()
}

function updateUI() {
  const loginBtn = document.getElementById("loginBtn")
  const userProfile = document.getElementById("userProfile")
  const settingsSection = document.getElementById("settings")
  const adminBtn = document.getElementById("adminPanelBtn")

  if (currentUser) {
    loginBtn.style.display = "none"
    userProfile.style.display = "flex"
    document.getElementById("userName").textContent = currentUser.username
    document.getElementById("userAvatar").src = currentUser.avatar
    settingsSection.style.display = "block"

    if (currentUser.isAdmin) {
      adminBtn.style.display = "block"
    }
  } else {
    loginBtn.style.display = "block"
    userProfile.style.display = "none"
    settingsSection.style.display = "none"
    adminBtn.style.display = "none"
  }
}

// Chat functionality
function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("messages") || "[]")
  const chatMessages = document.getElementById("chatMessages")
  chatMessages.innerHTML = ""

  messages.forEach((msg) => {
    const messageDiv = document.createElement("div")
    messageDiv.className = "chat-message"

    const headerDiv = document.createElement("div")
    headerDiv.className = "message-header"

    const usernameSpan = document.createElement("span")
    usernameSpan.className = msg.isAdmin ? "username admin" : "username"
    usernameSpan.textContent = msg.username
    headerDiv.appendChild(usernameSpan)

    if (msg.isAdmin) {
      const adminBadge = document.createElement("img")
      adminBadge.src = "https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png"
      adminBadge.className = "admin-badge"
      headerDiv.appendChild(adminBadge)
    }

    if (msg.isVerified) {
      const verifiedBadge = document.createElement("img")
      verifiedBadge.src = "https://cdn-icons-png.flaticon.com/512/7641/7641727.png"
      verifiedBadge.className = "verified-badge"
      headerDiv.appendChild(verifiedBadge)
    }

    const timestamp = document.createElement("span")
    timestamp.className = "timestamp"
    timestamp.textContent = new Date(msg.timestamp).toLocaleTimeString()
    headerDiv.appendChild(timestamp)

    messageDiv.appendChild(headerDiv)

    const messageText = document.createElement("div")
    messageText.textContent = msg.message
    messageDiv.appendChild(messageText)

    chatMessages.appendChild(messageDiv)
  })

  chatMessages.scrollTop = chatMessages.scrollHeight
}

async function sendMessage(message) {
  if (!currentUser) {
    alert("Please login to send messages")
    return
  }

  const settings = JSON.parse(localStorage.getItem("siteSettings"))

  if (settings.chatLocked) {
    alert("Chat is currently locked by admin")
    return
  }

  // Check cooldown
  const now = Date.now()
  const cooldown = settings.chatCooldown * 1000
  if (now - lastMessageTime < cooldown) {
    const remaining = Math.ceil((cooldown - (now - lastMessageTime)) / 1000)
    alert(`Please wait ${remaining} seconds before sending another message`)
    return
  }

  const messages = JSON.parse(localStorage.getItem("messages") || "[]")
  const newMessage = {
    username: currentUser.username,
    message,
    timestamp: Date.now(),
    isAdmin: currentUser.isAdmin,
    isVerified: currentUser.isVerified,
  }

  messages.push(newMessage)
  localStorage.setItem("messages", JSON.stringify(messages))

  lastMessageTime = now
  loadMessages()

  // Trigger storage event for other tabs
  window.dispatchEvent(new Event("storage"))
}

// Admin functions
function loadActiveUsers() {
  const users = JSON.parse(localStorage.getItem("users"))
  const activeUsers = document.getElementById("activeUsers")
  activeUsers.innerHTML = ""

  // Show users who logged in within last hour
  const oneHourAgo = Date.now() - 60 * 60 * 1000
  const active = users.filter((u) => u.lastLogin && u.lastLogin > oneHourAgo)

  active.forEach((user) => {
    const userDiv = createUserItem(user)
    activeUsers.appendChild(userDiv)
  })

  if (active.length === 0) {
    activeUsers.innerHTML = '<p style="color: #888;">No active users</p>'
  }
}

function loadAllUsers() {
  const users = JSON.parse(localStorage.getItem("users"))
  const allUsersDiv = document.getElementById("allUsers")
  allUsersDiv.innerHTML = ""

  users.forEach((user) => {
    const userDiv = createUserItem(user)
    allUsersDiv.appendChild(userDiv)
  })
}

function createUserItem(user) {
  const userDiv = document.createElement("div")
  userDiv.className = "user-item"

  const avatar = document.createElement("img")
  avatar.src = user.avatar
  userDiv.appendChild(avatar)

  const userInfo = document.createElement("div")
  userInfo.className = "user-info"

  const nameDiv = document.createElement("div")
  nameDiv.className = user.isAdmin ? "user-name admin" : "user-name"
  nameDiv.textContent = user.username

  if (user.isAdmin) {
    const adminBadge = document.createElement("img")
    adminBadge.src = "https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png"
    adminBadge.style.width = "20px"
    adminBadge.style.height = "20px"
    nameDiv.appendChild(adminBadge)
  }

  if (user.isVerified) {
    const verifiedBadge = document.createElement("img")
    verifiedBadge.src = "https://cdn-icons-png.flaticon.com/512/7641/7641727.png"
    verifiedBadge.style.width = "20px"
    verifiedBadge.style.height = "20px"
    nameDiv.appendChild(verifiedBadge)
  }

  userInfo.appendChild(nameDiv)

  const details = document.createElement("div")
  details.className = "user-details"
  details.innerHTML = `
        Email: ${user.email}<br>
        IP: ${user.ip}<br>
        Location: ${user.location ? `${user.location.city}, ${user.location.country}` : "Unknown"}<br>
        Registered: ${new Date(user.createdAt).toLocaleDateString()}<br>
        Last Login: ${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}
    `
  userInfo.appendChild(details)

  userDiv.appendChild(userInfo)
  return userDiv
}

// Event Listeners
document.addEventListener("DOMContentLoaded", async () => {
  initDatabase()

  // Check maintenance
  if (checkMaintenance()) {
    return
  }

  // Detect and apply language
  const lang = await detectLanguage()
  applyLanguage(lang)
  document.getElementById("languageSelect").value = lang

  // Apply theme
  const savedTheme = localStorage.getItem("theme") || "dark"
  applyTheme(savedTheme)
  document.getElementById("themeSelect").value = savedTheme

  // Load gallery
  loadGallery()

  // Load messages
  loadMessages()

  // Check session
  const savedUser = sessionStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    updateUI()
  }

  // Log visit
  const ip = await getUserIP()
  const location = await getIPLocation(ip)
  await sendToDiscord(
    WEBHOOK_LOG,
    `👁️ Site visit:\nIP: ${ip}\nLocation: ${location.city}, ${location.country}\nTime: ${new Date().toLocaleString()}`,
  )
})

// Login/Register Modal
document.getElementById("loginBtn").addEventListener("click", () => {
  document.getElementById("authModal").style.display = "block"
})

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("authModal").style.display = "none"
})

document.getElementById("switchAuth").addEventListener("click", (e) => {
  e.preventDefault()
  isRegistering = !isRegistering
  const authTitle = document.getElementById("authTitle")
  const authSubmit = document.getElementById("authSubmit")
  const authSwitch = document.getElementById("switchAuth")
  const emailInput = document.getElementById("authEmail")

  if (isRegistering) {
    authTitle.textContent = "Register"
    authSubmit.textContent = "Register"
    authSwitch.textContent = "Login"
    emailInput.style.display = "block"
    document.getElementById("authSwitch").innerHTML = 'Already have an account? <a href="#" id="switchAuth">Login</a>'
  } else {
    authTitle.textContent = "Login"
    authSubmit.textContent = "Login"
    authSwitch.textContent = "Register"
    emailInput.style.display = "none"
    document.getElementById("authSwitch").innerHTML = 'Don\'t have an account? <a href="#" id="switchAuth">Register</a>'
  }
})

document.getElementById("authForm").addEventListener("submit", async (e) => {
  e.preventDefault()
  const username = document.getElementById("authUsername").value
  const email = document.getElementById("authEmail").value
  const password = document.getElementById("authPassword").value

  if (isRegistering) {
    if (await register(username, email, password)) {
      alert("Registration successful! Please login.")
      document.getElementById("switchAuth").click()
    }
  } else {
    if (await login(username, password)) {
      document.getElementById("authModal").style.display = "none"
    }
  }
})

document.getElementById("logoutBtn").addEventListener("click", logout)

// Navigation
document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const targetId = link.getAttribute("href").substring(1)
    const target = document.getElementById(targetId)

    if (target) {
      target.scrollIntoView({ behavior: "smooth" })
    }
  })
})

// Chat
document.getElementById("chatForm").addEventListener("submit", (e) => {
  e.preventDefault()
  const input = document.getElementById("chatInput")
  const message = input.value.trim()

  if (message) {
    sendMessage(message)
    input.value = ""
  }
})

// Settings
document.getElementById("themeSelect").addEventListener("change", (e) => {
  applyTheme(e.target.value)
})

document.getElementById("languageSelect").addEventListener("change", (e) => {
  applyLanguage(e.target.value)
})

document.getElementById("saveProfile").addEventListener("click", () => {
  if (!currentUser) return

  const users = JSON.parse(localStorage.getItem("users"))
  const userIndex = users.findIndex((u) => u.username === currentUser.username)

  const newAvatar = document.getElementById("profilePicture").value
  const newUsername = document.getElementById("changeUsername").value
  const newPassword = document.getElementById("changePassword").value

  if (newAvatar) {
    users[userIndex].avatar = newAvatar
    currentUser.avatar = newAvatar
  }

  if (newUsername && newUsername !== currentUser.username) {
    // Check if username already exists
    if (users.find((u) => u.username === newUsername)) {
      alert("Username already taken!")
      return
    }
    users[userIndex].username = newUsername
    currentUser.username = newUsername
  }

  if (newPassword) {
    users[userIndex].password = newPassword
  }

  localStorage.setItem("users", JSON.stringify(users))
  sessionStorage.setItem("currentUser", JSON.stringify(currentUser))
  updateUI()

  alert("Profile updated successfully!")

  // Clear inputs
  document.getElementById("profilePicture").value = ""
  document.getElementById("changeUsername").value = ""
  document.getElementById("changePassword").value = ""
})

// Admin Panel
document.getElementById("adminPanelBtn").addEventListener("click", () => {
  document.getElementById("adminPanel").style.display = "block"
  loadActiveUsers()
  loadAllUsers()

  // Load current settings
  const settings = JSON.parse(localStorage.getItem("siteSettings"))
  document.getElementById("chatCooldown").value = settings.chatCooldown
})

document.getElementById("closeAdmin").addEventListener("click", () => {
  document.getElementById("adminPanel").style.display = "none"
})

document.getElementById("toggleMaintenance").addEventListener("click", () => {
  const settings = JSON.parse(localStorage.getItem("siteSettings"))
  settings.maintenance = !settings.maintenance
  localStorage.setItem("siteSettings", JSON.stringify(settings))

  alert(`Maintenance mode ${settings.maintenance ? "enabled" : "disabled"}`)
  checkMaintenance()
})

document.getElementById("clearChat").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all chat messages?")) {
    localStorage.setItem("messages", JSON.stringify([]))
    loadMessages()
    alert("Chat cleared!")
  }
})

document.getElementById("toggleChatLock").addEventListener("click", () => {
  const settings = JSON.parse(localStorage.getItem("siteSettings"))
  settings.chatLocked = !settings.chatLocked
  localStorage.setItem("siteSettings", JSON.stringify(settings))

  const chatLocked = document.getElementById("chatLocked")
  const chatForm = document.getElementById("chatForm")

  if (settings.chatLocked) {
    chatLocked.style.display = "block"
    chatForm.style.display = "none"
  } else {
    chatLocked.style.display = "none"
    chatForm.style.display = "flex"
  }

  alert(`Chat ${settings.chatLocked ? "locked" : "unlocked"}`)
})

document.getElementById("setCooldown").addEventListener("click", () => {
  const cooldown = Number.parseInt(document.getElementById("chatCooldown").value)
  const settings = JSON.parse(localStorage.getItem("siteSettings"))
  settings.chatCooldown = cooldown
  localStorage.setItem("siteSettings", JSON.stringify(settings))
  alert(`Chat cooldown set to ${cooldown} seconds`)
})

document.getElementById("createPost").addEventListener("click", () => {
  const content = document.getElementById("postContent").value
  if (content) {
    alert("Post created: " + content)
    document.getElementById("postContent").value = ""
  }
})

document.getElementById("addGalleryImage").addEventListener("click", () => {
  const imageUrl = document.getElementById("galleryImage").value
  if (imageUrl) {
    const gallery = JSON.parse(localStorage.getItem("gallery"))
    gallery.push(imageUrl)
    localStorage.setItem("gallery", JSON.stringify(gallery))
    loadGallery()
    document.getElementById("galleryImage").value = ""
    alert("Image added to gallery!")
  }
})

document.getElementById("verifyUser").addEventListener("click", () => {
  const username = document.getElementById("manageUsername").value
  if (!username) return

  const users = JSON.parse(localStorage.getItem("users"))
  const user = users.find((u) => u.username === username)

  if (user) {
    user.isVerified = !user.isVerified
    localStorage.setItem("users", JSON.stringify(users))
    alert(`${username} verification toggled`)
    loadAllUsers()
  } else {
    alert("User not found")
  }
})

document.getElementById("makeAdmin").addEventListener("click", () => {
  const username = document.getElementById("manageUsername").value
  if (!username) return

  const users = JSON.parse(localStorage.getItem("users"))
  const user = users.find((u) => u.username === username)

  if (user) {
    user.isAdmin = !user.isAdmin
    localStorage.setItem("users", JSON.stringify(users))
    alert(`${username} admin status toggled`)
    loadAllUsers()
  } else {
    alert("User not found")
  }
})

document.getElementById("allowMedia").addEventListener("click", () => {
  const username = document.getElementById("manageUsername").value
  if (!username) return

  const users = JSON.parse(localStorage.getItem("users"))
  const user = users.find((u) => u.username === username)

  if (user) {
    user.canPostMedia = !user.canPostMedia
    localStorage.setItem("users", JSON.stringify(users))
    alert(`${username} media permission toggled`)
    loadAllUsers()
  } else {
    alert("User not found")
  }
})

document.getElementById("banUser").addEventListener("click", async () => {
  const username = document.getElementById("manageUsername").value
  if (!username) return

  if (confirm(`Are you sure you want to ban ${username}?`)) {
    const users = JSON.parse(localStorage.getItem("users"))
    const user = users.find((u) => u.username === username)

    if (user) {
      const bannedIPs = JSON.parse(localStorage.getItem("bannedIPs") || "[]")
      bannedIPs.push(user.ip)
      localStorage.setItem("bannedIPs", JSON.stringify(bannedIPs))

      await sendToDiscord(
        WEBHOOK_SUSPEND,
        `🔨 User banned:\nUsername: ${username}\nIP: ${user.ip}\nBanned by: ${currentUser.username}`,
      )

      alert(`${username} has been banned`)
    } else {
      alert("User not found")
    }
  }
})

// Maintenance login
document.getElementById("maintenanceLogin").addEventListener("submit", (e) => {
  e.preventDefault()
  const password = e.target.querySelector("input").value

  if (password === "admin") {
    sessionStorage.setItem("maintenanceAccess", "admin")
    checkMaintenance()
  } else {
    alert("Invalid password")
  }
})

// Listen for storage changes (for multi-tab sync)
window.addEventListener("storage", () => {
  loadMessages()
  loadGallery()
  checkMaintenance()
})

// Periodic refresh for chat (simulating real-time)
setInterval(() => {
  if (currentUser) {
    loadMessages()
    if (currentUser.isAdmin) {
      loadActiveUsers()
    }
  }
}, 5000)
