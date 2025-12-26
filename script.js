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
    "https://image.tmdb.org/t/p/w500/yMK3IADqV2oReJMKdkrcEIBxdtu.jpg",
    "https://ntvb.tmsimg.com/assets/assets/GNLZZGG002G2JKZ.jpg",
    "https://media.gettyimages.com/id/2242330361/photo/los-angeles-premiere-of-hbo-original-series-it-welcome-to-derry-red-carpet.jpg?s=1024x1024&w=gi&k=20&c=SATqk9OF8uyP8-6xKlIUS4AhKcPg3unpDSieOnkrGrc=",
    "https://media.gettyimages.com/id/2242313791/photo/los-angeles-premiere-of-hbo-original-series-it-welcome-to-derry.jpg?s=1024x1024&w=gi&k=20&c=ozLhw5EvhFSpQeDS36PfCZIG0bY4ofPNxelcsJSN3ew=",
    "https://elcomercio.pe/resizer/v2/ZLEZYAYGJBAYNNIRVWBIOMJ6Z4.jpg?auth=585dcbc947baaa48292c190c1cce1d5fb0444fa13e83d411f29e0c5638ee7452&width=1200&height=1371&quality=75&smart=true",
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
      } else if (element.tagName === "OPTION") {
        element.textContent = text
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
  return data ? JSON.parse(data) : null
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
    avatar:
      "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png",
    verified: false,
    isAdmin: false,
    canPostImages: false,
    banned: false,
    createdAt: new Date().toISOString(),
  }

  saveUser(user)

  await sendDiscordWebhook(
    CONFIG.discordWebhooks.siteLog,
    `✅ New user registered: ${username} (${email}) from ${ipInfo.city}, ${ipInfo.country} [IP: ${ip}]`,
  )

  return { success: true, user }
}

async function loginUser(username, password) {
  const user = getUserByUsername(username)

  if (!user) {
    return { success: false, message: "User not found / Usuário não encontrado" }
  }

  if (user.banned) {
    await sendDiscordWebhook(
      CONFIG.discordWebhooks.suspendedAccounts,
      `🚫 Banned user attempted login: ${username} [IP: ${user.ip}]`,
    )
    return { success: false, message: "Account suspended / Conta suspensa" }
  }

  if (user.password !== password) {
    return { success: false, message: "Incorrect password / Senha incorreta" }
  }

  const currentIP = await getIPAddress()

  if (user.ip !== currentIP && username !== CONFIG.adminCredentials.username) {
    user.banned = true
    saveUser(user)

    await sendDiscordWebhook(
      CONFIG.discordWebhooks.suspendedAccounts,
      `⚠️ Account auto-suspended due to IP change: ${username}\nOriginal IP: ${user.ip}\nNew IP: ${currentIP}`,
    )

    return {
      success: false,
      message: "IP changed - Account suspended. Contact admin. / IP alterado - Conta suspensa. Contate o admin.",
    }
  }

  const ipInfo = await getIPInfo(currentIP)
  await sendDiscordWebhook(
    CONFIG.discordWebhooks.siteLog,
    `👤 User logged in: ${username} from ${ipInfo.city}, ${ipInfo.country} [IP: ${currentIP}]`,
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

    if (currentUser.isAdmin) {
      openAdminBtn.classList.remove("hidden")
    }

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
    gallery = CONFIG.defaultGallery.map((url, index) => ({
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

  galleryGrid.innerHTML = gallery
    .map(
      (item) => `
        <div class="gallery-item" data-id="${item.id}">
            <img src="${item.url}" alt="${item.caption || "Gallery image"}" loading="lazy">
        </div>
    `,
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

  galleryManager.innerHTML = gallery
    .map(
      (item) => `
        <div class="gallery-item" style="position: relative;">
            <img src="${item.url}" alt="${item.caption}">
            <button onclick="removeFromGallery('${item.id}')" style="position: absolute; top: 10px; right: 10px; background: red; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 5px;">Remove</button>
        </div>
    `,
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
                ${post.isVerified ? '<img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" class="verified-badge">' : ""}
                ${post.isAdmin ? '<img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" class="admin-badge">' : ""}
            </div>
            <div class="post-content">${post.content}</div>
            <div class="post-time">${new Date(post.createdAt).toLocaleString()}</div>
        </div>
    `,
    )
    .join("")
}

// Chat Management
function getMessages() {
  return getFromStorage("messages") || []
}

function getChatSettings() {
  return (
    getFromStorage("chatSettings") || {
      locked: false,
      cooldown: 0,
    }
  )
}

function saveChatSettings(settings) {
  saveToStorage("chatSettings", settings)
}

let lastMessageTime = 0

async function sendMessage(content) {
  const chatSettings = getChatSettings()

  if (chatSettings.locked && !currentUser.isAdmin) {
    alert(currentLanguage === "en" ? "Chat is locked by admin" : "Chat bloqueado pelo admin")
    return
  }

  const now = Date.now()
  if (now - lastMessageTime < chatSettings.cooldown * 1000 && !currentUser.isAdmin) {
    alert(
      currentLanguage === "en"
        ? `Please wait ${chatSettings.cooldown} seconds`
        : `Aguarde ${chatSettings.cooldown} segundos`,
    )
    return
  }

  lastMessageTime = now

  const messages = getMessages()
  const message = {
    id: generateID(),
    content,
    author: currentUser.username,
    authorAvatar: currentUser.avatar,
    isVerified: currentUser.verified,
    isAdmin: currentUser.isAdmin,
    timestamp: new Date().toISOString(),
  }

  messages.push(message)
  saveToStorage("messages", messages)
  renderMessages()

  if (currentUser.verified || currentUser.isAdmin) {
    await sendDiscordWebhook(
      CONFIG.discordWebhooks.siteLog,
      `💬 ${currentUser.isAdmin ? "[ADMIN]" : "[VERIFIED]"} ${currentUser.username}: ${content}`,
    )
  }
}

function renderMessages() {
  const messages = getMessages()
  const chatMessages = document.getElementById("chatMessages")

  chatMessages.innerHTML = messages
    .map(
      (msg) => `
        <div class="chat-message">
            <span class="chat-username ${msg.isAdmin ? "admin" : ""}">${msg.author}</span>
            ${msg.isVerified ? '<img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" class="verified-badge">' : ""}
            ${msg.isAdmin ? '<img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" class="admin-badge">' : ""}
            <span>${msg.content}</span>
        </div>
    `,
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

  // Simulating active users (in real app, you'd track this server-side)
  const activeUsers = users.filter((u) => !u.banned)
  document.getElementById("activeUsersCount").textContent = activeUsers.length

  const renderUser = (user) => `
        <div class="user-item">
            <div class="user-info">
                <img src="${user.avatar}" alt="${user.username}">
                <span>${user.username}</span>
                ${user.verified ? '<img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" class="verified-badge">' : ""}
                ${user.isAdmin ? '<img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" class="admin-badge">' : ""}
                <small style="opacity: 0.6; margin-left: 10px;">${user.ipInfo.city}, ${user.ipInfo.country}</small>
            </div>
            <div class="user-actions">
                <button class="btn-verify" onclick="toggleVerified('${user.id}')">${user.verified ? "Unverify" : "Verify"}</button>
                <button class="btn-ban" onclick="toggleBan('${user.id}')">${user.banned ? "Unban" : "Ban"}</button>
                <button class="btn-admin" onclick="toggleAdmin('${user.id}')">${user.isAdmin ? "Remove Admin" : "Make Admin"}</button>
                <button class="btn-image-perm" onclick="toggleImagePerm('${user.id}')">${user.canPostImages ? "Remove Image Perm" : "Allow Images"}</button>
            </div>
        </div>
    `

  activeUsersList.innerHTML = activeUsers.map(renderUser).join("")
  allUsersList.innerHTML = users.map(renderUser).join("")
}

async function toggleVerified(userId) {
  const users = getAllUsers()
  const user = users.find((u) => u.id === userId)
  if (user) {
    user.verified = !user.verified
    saveUser(user)
    renderAdminUsers()

    await sendDiscordWebhook(
      CONFIG.discordWebhooks.siteLog,
      `${user.verified ? "✅" : "❌"} User ${user.username} verification status changed by admin`,
    )
  }
}

async function toggleBan(userId) {
  const users = getAllUsers()
  const user = users.find((u) => u.id === userId)
  if (user && user.username !== CONFIG.adminCredentials.username) {
    user.banned = !user.banned
    saveUser(user)
    renderAdminUsers()

    if (user.banned) {
      await sendDiscordWebhook(
        CONFIG.discordWebhooks.suspendedAccounts,
        `🚫 User ${user.username} banned by admin [IP: ${user.ip}]`,
      )
    }
  }
}

function toggleAdmin(userId) {
  const users = getAllUsers()
  const user = users.find((u) => u.id === userId)
  if (user && user.username !== CONFIG.adminCredentials.username) {
    user.isAdmin = !user.isAdmin
    saveUser(user)
    renderAdminUsers()
  }
}

function toggleImagePerm(userId) {
  const users = getAllUsers()
  const user = users.find((u) => u.id === userId)
  if (user) {
    user.canPostImages = !user.canPostImages
    saveUser(user)
    renderAdminUsers()
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", async () => {
  // Get IP and log site visit
  try {
    currentIP = await getIPAddress()
    const ipInfo = await getIPInfo(currentIP)

    await sendDiscordWebhook(
      CONFIG.discordWebhooks.siteLog,
      `👁️ Site visit from ${ipInfo.city}, ${ipInfo.country} [IP: ${currentIP}]`,
    )
  } catch (error) {
    console.error("Error during initialization:", error)
    // Continue initialization even if IP detection fails
    currentIP = "unknown"
  }

  // Check for saved user session
  const savedUser = getFromStorage("currentUser")
  if (savedUser) {
    const user = getUserByUsername(savedUser.username)
    if (user && !user.banned && user.ip === currentIP) {
      currentUser = user
    } else {
      localStorage.removeItem("currentUser")
    }
  }

  // Check if site is in maintenance
  const siteSettings = getFromStorage("siteSettings") || { maintenance: false }
  if (siteSettings.maintenance && (!currentUser || !currentUser.isAdmin)) {
    document.getElementById("maintenanceScreen").classList.remove("hidden")
    document.getElementById("loadingScreen").classList.add("hidden")
    return
  }

  // Detect and apply language
  const savedLang = localStorage.getItem("language")
  if (savedLang && savedLang !== "auto") {
    currentLanguage = savedLang
  } else {
    currentLanguage = detectLanguage()
  }
  applyLanguage(currentLanguage)

  // Apply theme
  const savedTheme = localStorage.getItem("theme") || "system"
  applyTheme(savedTheme)

  // Initialize
  initGallery()
  renderPosts()
  renderMessages()
  updateUI()

  setTimeout(() => {
    document.getElementById("loadingScreen").classList.add("hidden")
  }, 500)

  // Auth button
  document.getElementById("authBtn").addEventListener("click", () => {
    document.getElementById("authModal").classList.remove("hidden")
  })

  // Close modals
  document.querySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.target.closest(".modal, .admin-panel").classList.add("hidden")
    })
  })

  // Auth tabs
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".auth-tab").forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      const tabName = tab.dataset.tab
      document.getElementById("loginForm").classList.toggle("hidden", tabName !== "login")
      document.getElementById("registerForm").classList.toggle("hidden", tabName !== "register")
    })
  })

  // Login form
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    const username = document.getElementById("loginUsername").value
    const password = document.getElementById("loginPassword").value

    const result = await loginUser(username, password)
    if (result.success) {
      currentUser = result.user
      saveToStorage("currentUser", currentUser)
      document.getElementById("authModal").classList.add("hidden")
      updateUI()
      renderPosts()
      renderMessages()
    } else {
      alert(result.message)
    }
  })

  // Register form
  document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    const username = document.getElementById("registerUsername").value
    const email = document.getElementById("registerEmail").value
    const password = document.getElementById("registerPassword").value

    const result = await registerUser(username, email, password)
    if (result.success) {
      alert(currentLanguage === "en" ? "Account created! Please login." : "Conta criada! Faça login.")
      document.querySelector('.auth-tab[data-tab="login"]').click()
      document.getElementById("loginUsername").value = username
    } else {
      alert(result.message)
    }
  })

  // Settings
  document.getElementById("openSettings").addEventListener("click", () => {
    document.getElementById("settingsModal").classList.remove("hidden")
    document.getElementById("themeSelect").value = localStorage.getItem("theme") || "system"
    document.getElementById("languageSelect").value = localStorage.getItem("language") || "auto"
  })

  document.getElementById("profilePictureInput").addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const preview = document.getElementById("profilePreview")
        preview.innerHTML = `<img src="${event.target.result}" alt="Preview">`
      }
      reader.readAsDataURL(file)
    }
  })

  document.getElementById("themeSelect").addEventListener("change", (e) => {
    applyTheme(e.target.value)
  })

  document.getElementById("languageSelect").addEventListener("change", (e) => {
    const lang = e.target.value
    localStorage.setItem("language", lang)
    if (lang === "auto") {
      applyLanguage(detectLanguage())
    } else {
      applyLanguage(lang)
    }
  })

  document.getElementById("saveSettings").addEventListener("click", () => {
    if (currentUser) {
      const newUsername = document.getElementById("changeUsername").value
      const newPassword = document.getElementById("changePassword").value
      const profilePic = document.getElementById("profilePictureInput").files[0]

      if (newUsername && newUsername !== currentUser.username) {
        if (getUserByUsername(newUsername)) {
          alert(currentLanguage === "en" ? "Username already taken" : "Nome de usuário já existe")
          return
        }
        currentUser.username = newUsername
      }

      if (newPassword) {
        currentUser.password = newPassword
      }

      if (profilePic) {
        const reader = new FileReader()
        reader.onload = (event) => {
          currentUser.avatar = event.target.result
          saveUser(currentUser)
          saveToStorage("currentUser", currentUser)
          updateUI()
        }
        reader.readAsDataURL(profilePic)
      }

      saveUser(currentUser)
      saveToStorage("currentUser", currentUser)
      updateUI()
      alert(currentLanguage === "en" ? "Settings saved!" : "Configurações salvas!")
      document.getElementById("settingsModal").classList.add("hidden")
    }
  })

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", logout)

  // Admin panel
  document.getElementById("openAdminPanel").addEventListener("click", () => {
    if (currentUser && currentUser.isAdmin) {
      document.getElementById("adminPanel").classList.remove("hidden")
      renderAdminUsers()
      renderAdminGallery()
    }
  })

  // Admin tabs
  document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab-btn").forEach((b) => b.classList.remove("active"))
      document.querySelectorAll(".admin-tab-content").forEach((c) => c.classList.remove("active"))

      btn.classList.add("active")
      const tabId =
        "admin" +
        btn.dataset.tab
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join("") +
        "Tab"
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Admin gallery
  document.getElementById("addGalleryImage").addEventListener("click", () => {
    const url = document.getElementById("adminGalleryUrl").value
    const caption = document.getElementById("adminGalleryCaption").value
    if (url) {
      addToGallery(url, caption)
      document.getElementById("adminGalleryUrl").value = ""
      document.getElementById("adminGalleryCaption").value = ""
    }
  })

  // Admin posts
  document.getElementById("createPost").addEventListener("click", () => {
    const content = document.getElementById("adminPostContent").value
    if (content && currentUser) {
      createPost(content)
      document.getElementById("adminPostContent").value = ""
    }
  })

  // Admin chat controls
  document.getElementById("setCooldown").addEventListener("click", () => {
    const cooldown = Number.parseInt(document.getElementById("chatCooldown").value)
    const settings = getChatSettings()
    settings.cooldown = cooldown
    saveChatSettings(settings)
    alert(`Cooldown set to ${cooldown} seconds`)
  })

  document.getElementById("lockChat").addEventListener("click", () => {
    const settings = getChatSettings()
    settings.locked = !settings.locked
    saveChatSettings(settings)
    document.getElementById("chatNotification").textContent = settings.locked
      ? currentLanguage === "en"
        ? "🔒 Chat locked by admin"
        : "🔒 Chat bloqueado pelo admin"
      : ""
    alert(settings.locked ? "Chat locked" : "Chat unlocked")
  })

  document.getElementById("clearChat").addEventListener("click", clearChat)

  // Admin site controls
  document.getElementById("shutdownSite").addEventListener("click", () => {
    if (confirm("Shutdown site for maintenance?")) {
      const settings = { maintenance: true }
      saveToStorage("siteSettings", settings)
      alert("Site will be in maintenance mode on next load")
    }
  })

  document.getElementById("reopenSite").addEventListener("click", () => {
    const settings = { maintenance: false }
    saveToStorage("siteSettings", settings)
    alert("Site reopened")
  })

  document.getElementById("sendNotification").addEventListener("click", () => {
    const text = document.getElementById("notificationText").value
    if (text) {
      alert(text)
      document.getElementById("notificationText").value = ""
    }
  })

  // Maintenance login
  document.getElementById("maintenanceLogin").addEventListener("submit", (e) => {
    e.preventDefault()
    const password = document.getElementById("maintenancePassword").value
    if (password === CONFIG.adminCredentials.password) {
      document.getElementById("maintenanceScreen").classList.add("hidden")
      location.reload()
    } else {
      alert("Incorrect password")
    }
  })

  // Chat form
  document.getElementById("chatForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    const input = document.getElementById("chatInput")
    const content = input.value.trim()

    if (content && currentUser) {
      await sendMessage(content)
      input.value = ""
    }
  })

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({ behavior: "smooth" })
      }
    })
  })
})

// Make functions global for onclick handlers
window.toggleVerified = toggleVerified
window.toggleBan = toggleBan
window.toggleAdmin = toggleAdmin
window.toggleImagePerm = toggleImagePerm
window.removeFromGallery = removeFromGallery
