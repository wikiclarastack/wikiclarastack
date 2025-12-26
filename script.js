// Configuration
const DISCORD_WEBHOOK_SUSPENDED =
  "https://discord.com/api/webhooks/1453870994233233672/ECP6u8tLh4ui2t3HOagXinv9QkeAU8mUScKLKkiY47mFNejrQhGU9v3xRNaHI4UjeqfC"
const DISCORD_WEBHOOK_LOGS =
  "https://discord.com/api/webhooks/1453871095672340612/U1fotOujLXmOESKp0JJXLEa3zcqGnImE2ENz_Vpw8ekLI81wD0uvDbTWIkHLMV9SE3K0"

// Global State
let currentUser = null
let currentLanguage = "pt"
let chatCooldown = 0
let lastMessageTime = 0
let isChatLocked = false

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.getElementById("loadingScreen").style.display = "none"
    initializeApp()
  }, 2000)
})

function initializeApp() {
  detectRegionAndLanguage()
  checkMaintenance()
  loadTheme()
  initializeDefaultGallery()

  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    const user = JSON.parse(savedUser)
    if (validateUserIP(user)) {
      currentUser = user
      showMainContent()
    } else {
      suspendAccount(user)
    }
  } else {
    document.getElementById("authContainer").style.display = "flex"
  }

  // Log visitor
  logToDiscord("logs", `New visitor from ${getUserIP()}`)
}

// Region & Language Detection
function detectRegionAndLanguage() {
  const userLang = localStorage.getItem("preferredLanguage")
  if (userLang && userLang !== "auto") {
    currentLanguage = userLang
  } else {
    const browserLang = navigator.language || navigator.userLanguage
    currentLanguage = browserLang.startsWith("pt") ? "pt" : "en"
  }
  updateLanguage()
}

function updateLanguage() {
  document.querySelectorAll("[data-pt][data-en]").forEach((element) => {
    const text = currentLanguage === "pt" ? element.getAttribute("data-pt") : element.getAttribute("data-en")
    if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      element.placeholder = text
    } else {
      element.textContent = text
    }
  })

  document.querySelectorAll("[data-pt-placeholder][data-en-placeholder]").forEach((element) => {
    const placeholder =
      currentLanguage === "pt"
        ? element.getAttribute("data-pt-placeholder")
        : element.getAttribute("data-en-placeholder")
    element.placeholder = placeholder
  })
}

function changeLanguage() {
  const select = document.getElementById("languageSelect")
  const value = select.value
  localStorage.setItem("preferredLanguage", value)

  if (value === "auto") {
    const browserLang = navigator.language || navigator.userLanguage
    currentLanguage = browserLang.startsWith("pt") ? "pt" : "en"
  } else {
    currentLanguage = value
  }

  updateLanguage()
  showNotification("Language updated!", "success")
}

// IP Management
function getUserIP() {
  let ip = localStorage.getItem("userIP")
  if (!ip) {
    ip = Math.random().toString(36).substring(7)
    localStorage.setItem("userIP", ip)
  }
  return ip
}

function validateUserIP(user) {
  return user.ip === getUserIP()
}

function suspendAccount(user) {
  const users = getUsers()
  const userIndex = users.findIndex((u) => u.username === user.username)
  if (userIndex !== -1) {
    users[userIndex].suspended = true
    users[userIndex].suspendedReason = "IP changed"
    localStorage.setItem("users", JSON.stringify(users))

    logToDiscord("suspended", `Account suspended: ${user.username} - IP changed from ${user.ip} to ${getUserIP()}`)
  }

  localStorage.removeItem("currentUser")
  showNotification(
    currentLanguage === "pt" ? "Conta suspensa por mudança de IP" : "Account suspended due to IP change",
    "error",
  )
  location.reload()
}

// Authentication
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]")
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users))
}

function showRegister() {
  document.getElementById("loginForm").style.display = "none"
  document.getElementById("registerForm").style.display = "block"
}

function showLogin() {
  document.getElementById("registerForm").style.display = "none"
  document.getElementById("loginForm").style.display = "block"
}

function register() {
  const username = document.getElementById("registerUsername").value.trim()
  const email = document.getElementById("registerEmail").value.trim()
  const password = document.getElementById("registerPassword").value

  if (!username || !email || !password) {
    showNotification(currentLanguage === "pt" ? "Preencha todos os campos" : "Fill all fields", "error")
    return
  }

  const users = getUsers()

  if (users.find((u) => u.username === username)) {
    showNotification(currentLanguage === "pt" ? "Usuário já existe" : "Username already exists", "error")
    return
  }

  if (users.find((u) => u.email === email)) {
    showNotification(currentLanguage === "pt" ? "Email já cadastrado" : "Email already registered", "error")
    return
  }

  const user = {
    username,
    email,
    password,
    ip: getUserIP(),
    avatar:
      "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png",
    verified: false,
    isAdmin: false,
    canPost: false,
    suspended: false,
    registeredAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }

  users.push(user)
  saveUsers(users)

  logToDiscord("logs", `New user registered: ${username} from ${getUserIP()}`)
  showNotification(currentLanguage === "pt" ? "Conta criada com sucesso!" : "Account created successfully!", "success")
  showLogin()
}

function login() {
  const username = document.getElementById("loginUsername").value.trim()
  const password = document.getElementById("loginPassword").value

  if (!username || !password) {
    showNotification(currentLanguage === "pt" ? "Preencha todos os campos" : "Fill all fields", "error")
    return
  }

  const users = getUsers()
  const user = users.find((u) => u.username === username && u.password === password)

  if (!user) {
    showNotification(
      currentLanguage === "pt" ? "Usuário ou senha incorretos" : "Incorrect username or password",
      "error",
    )
    return
  }

  if (user.suspended && !user.isAdmin) {
    showNotification(
      currentLanguage === "pt"
        ? "Conta suspensa. Contate o administrador."
        : "Account suspended. Contact administrator.",
      "error",
    )
    return
  }

  if (username === "admin" && password === "admin") {
    if (!user.isAdmin) {
      user.isAdmin = true
      const userIndex = users.findIndex((u) => u.username === username)
      users[userIndex] = user
      saveUsers(users)
    }
  }

  if (!validateUserIP(user) && username !== "admin") {
    suspendAccount(user)
    return
  }

  user.lastLogin = new Date().toISOString()
  const userIndex = users.findIndex((u) => u.username === username)
  users[userIndex] = user
  saveUsers(users)

  currentUser = user
  localStorage.setItem("currentUser", JSON.stringify(user))

  logToDiscord("logs", `User logged in: ${username} from ${getUserIP()}`)
  showMainContent()
}

function logout() {
  logToDiscord("logs", `User logged out: ${currentUser.username}`)
  localStorage.removeItem("currentUser")
  location.reload()
}

function showMainContent() {
  document.getElementById("authContainer").style.display = "none"
  document.getElementById("mainContent").style.display = "block"

  updateUserDisplay()
  loadPosts()
  loadGallery()
  loadChatMessages()
  updateActiveUsers()

  if (currentUser.isAdmin) {
    document.getElementById("adminNavLink").style.display = "block"
  }

  setInterval(updateActiveUsers, 30000)
}

function updateUserDisplay() {
  document.getElementById("navUsername").textContent = currentUser.username
  document.getElementById("navUserAvatar").src = currentUser.avatar

  if (currentUser.verified) {
    document.getElementById("navVerified").style.display = "inline"
  }

  document.getElementById("settingsUsername").value = currentUser.username

  if (
    currentUser.avatar !==
    "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png"
  ) {
    document.getElementById("profilePreview").src = currentUser.avatar
    document.getElementById("profilePreview").style.display = "block"
  }
}

// Navigation
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active")
  })
  document.getElementById(sectionId).classList.add("active")

  if (sectionId === "chat") {
    loadChatMessages()
  }
}

function toggleUserMenu() {
  document.getElementById("userMenu").classList.toggle("active")
}

// Theme Management
function loadTheme() {
  const theme = localStorage.getItem("theme") || "system"
  applyTheme(theme)
  document.getElementById("themeSelect").value = theme
}

function changeTheme() {
  const theme = document.getElementById("themeSelect").value
  localStorage.setItem("theme", theme)
  applyTheme(theme)
  showNotification(currentLanguage === "pt" ? "Tema atualizado" : "Theme updated", "success")
}

function applyTheme(theme) {
  if (theme === "system") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    document.body.setAttribute("data-theme", isDark ? "dark" : "light")
  } else {
    document.body.setAttribute("data-theme", theme)
  }
}

// Settings
function changeProfilePicture() {
  const file = document.getElementById("profilePicture").files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      document.getElementById("profilePreview").src = e.target.result
      document.getElementById("profilePreview").style.display = "block"
    }
    reader.readAsDataURL(file)
  }
}

function saveSettings() {
  const username = document.getElementById("settingsUsername").value.trim()
  const password = document.getElementById("settingsPassword").value
  const profilePic = document.getElementById("profilePreview").src

  if (!username) {
    showNotification(
      currentLanguage === "pt" ? "Nome de usuário não pode estar vazio" : "Username cannot be empty",
      "error",
    )
    return
  }

  const users = getUsers()
  const userIndex = users.findIndex((u) => u.username === currentUser.username)

  if (username !== currentUser.username && users.find((u) => u.username === username)) {
    showNotification(currentLanguage === "pt" ? "Nome de usuário já existe" : "Username already exists", "error")
    return
  }

  users[userIndex].username = username
  if (password) {
    users[userIndex].password = password
  }
  if (profilePic && profilePic !== "") {
    users[userIndex].avatar = profilePic
  }

  saveUsers(users)
  currentUser = users[userIndex]
  localStorage.setItem("currentUser", JSON.stringify(currentUser))

  updateUserDisplay()
  showNotification(currentLanguage === "pt" ? "Configurações salvas!" : "Settings saved!", "success")
}

// Posts
function getPosts() {
  return JSON.parse(localStorage.getItem("posts") || "[]")
}

function savePosts(posts) {
  localStorage.setItem("posts", JSON.stringify(posts))
}

function loadPosts() {
  const posts = getPosts()
  const container = document.getElementById("postsList")
  container.innerHTML = ""

  posts
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .forEach((post) => {
      const postElement = createPostElement(post)
      container.appendChild(postElement)
    })
}

function createPostElement(post) {
  const div = document.createElement("div")
  div.className = "post-card"

  const timeAgo = getTimeAgo(post.timestamp)

  div.innerHTML = `
        <div class="post-header">
            <img src="${post.authorAvatar}" alt="${post.author}" class="post-avatar">
            <div>
                <div class="post-author">
                    <h4 ${post.isAdmin ? 'style="color: #dc143c;"' : ""}>${post.author}</h4>
                    ${post.isAdmin ? '<img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" class="admin-badge" alt="Admin">' : ""}
                    ${post.verified ? '<img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" class="verified-badge" alt="Verified">' : ""}
                </div>
                <div class="post-time">${timeAgo}</div>
            </div>
        </div>
        <div class="post-content">
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ""}
        </div>
    `

  return div
}

function createPost() {
  if (!currentUser.isAdmin && !currentUser.canPost) {
    showNotification(
      currentLanguage === "pt" ? "Você não tem permissão para postar" : "You do not have permission to post",
      "error",
    )
    return
  }

  const title = document.getElementById("postTitle").value.trim()
  const content = document.getElementById("postContent").value.trim()
  const imageFile = document.getElementById("postImage").files[0]

  if (!title || !content) {
    showNotification(currentLanguage === "pt" ? "Preencha título e conteúdo" : "Fill title and content", "error")
    return
  }

  const processPost = (imageData) => {
    const post = {
      id: Date.now(),
      author: currentUser.username,
      authorAvatar: currentUser.avatar,
      verified: currentUser.verified,
      isAdmin: currentUser.isAdmin,
      title,
      content,
      image: imageData,
      timestamp: new Date().toISOString(),
    }

    const posts = getPosts()
    posts.unshift(post)
    savePosts(posts)

    document.getElementById("postTitle").value = ""
    document.getElementById("postContent").value = ""
    document.getElementById("postImage").value = ""

    loadPosts()
    showNotification(currentLanguage === "pt" ? "Postagem criada!" : "Post created!", "success")
  }

  if (imageFile) {
    const reader = new FileReader()
    reader.onload = (e) => {
      processPost(e.target.result)
    }
    reader.readAsDataURL(imageFile)
  } else {
    processPost(null)
  }
}

// Gallery
function initializeDefaultGallery() {
  const gallery = getGallery()
  if (gallery.length === 0) {
    const defaultImages = [
      "https://image.tmdb.org/t/p/w500/yMK3IADqV2oReJMKdkrcEIBxdtu.jpg",
      "https://ntvb.tmsimg.com/assets/assets/GNLZZGG002G2JKZ.jpg",
      "https://media.gettyimages.com/id/2242330361/photo/los-angeles-premiere-of-hbo-original-series-it-welcome-to-derry-red-carpet.jpg?s=1024x1024&w=gi&k=20&c=SATqk9OF8uyP8-6xKlIUS4AhKcPg3unpDSieOnkrGrc=",
      "https://media.gettyimages.com/id/2242313791/photo/los-angeles-premiere-of-hbo-original-series-it-welcome-to-derry.jpg?s=1024x1024&w=gi&k=20&c=ozLhw5EvhFSpQeDS36PfCZIG0bY4ofPNxelcsJSN3ew=",
      "https://elcomercio.pe/resizer/v2/ZLEZYAYGJBAYNNIRVWBIOMJ6Z4.jpg?auth=585dcbc947baaa48292c190c1cce1d5fb0444fa13e83d411f29e0c5638ee7452&width=1200&height=1371&quality=75&smart=true",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvTMnnpP9p4yr3TbS1aqUktmPvVVyy7lvwqQ&s",
      "https://static.tvtropes.org/pmwiki/pub/images/img_4865_8.jpeg",
    ]
    saveGallery(defaultImages)
  }
}

function getGallery() {
  return JSON.parse(localStorage.getItem("gallery") || "[]")
}

function saveGallery(gallery) {
  localStorage.setItem("gallery", JSON.stringify(gallery))
}

function loadGallery() {
  const gallery = getGallery()
  const container = document.getElementById("galleryGrid")
  container.innerHTML = ""

  gallery.forEach((imageUrl) => {
    const div = document.createElement("div")
    div.className = "gallery-item"
    div.innerHTML = `<img src="${imageUrl}" alt="Gallery image">`
    container.appendChild(div)
  })
}

function addToGallery() {
  if (!currentUser.isAdmin) {
    showNotification(
      currentLanguage === "pt" ? "Apenas admins podem adicionar à galeria" : "Only admins can add to gallery",
      "error",
    )
    return
  }

  const files = document.getElementById("galleryImage").files
  if (files.length === 0) {
    showNotification(
      currentLanguage === "pt" ? "Selecione pelo menos uma imagem" : "Select at least one image",
      "error",
    )
    return
  }

  const gallery = getGallery()
  let processed = 0

  Array.from(files).forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      gallery.push(e.target.result)
      processed++

      if (processed === files.length) {
        saveGallery(gallery)
        loadGallery()
        document.getElementById("galleryImage").value = ""
        showNotification(currentLanguage === "pt" ? "Imagens adicionadas!" : "Images added!", "success")
      }
    }
    reader.readAsDataURL(file)
  })
}

// Chat
function getChatMessages() {
  return JSON.parse(localStorage.getItem("chatMessages") || "[]")
}

function saveChatMessages(messages) {
  localStorage.setItem("chatMessages", JSON.stringify(messages))
}

function loadChatMessages() {
  const messages = getChatMessages()
  const container = document.getElementById("chatMessages")
  container.innerHTML = ""

  messages.forEach((msg) => {
    const messageElement = createChatMessage(msg)
    container.appendChild(messageElement)
  })

  container.scrollTop = container.scrollHeight

  const chatSettings = JSON.parse(localStorage.getItem("chatSettings") || "{}")
  isChatLocked = chatSettings.locked || false
  chatCooldown = chatSettings.cooldown || 0

  updateChatStatus()
}

function createChatMessage(msg) {
  const div = document.createElement("div")
  div.className = "chat-message"

  const timeAgo = getTimeAgo(msg.timestamp)

  div.innerHTML = `
        <img src="${msg.avatar}" alt="${msg.username}" class="chat-avatar">
        <div class="chat-content">
            <div class="chat-user">
                <strong ${msg.isAdmin ? 'class="admin"' : ""}>${msg.username}</strong>
                ${msg.isAdmin ? '<img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" class="admin-badge" alt="Admin">' : ""}
                ${msg.verified ? '<img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" class="verified-badge" alt="Verified">' : ""}
                <span class="chat-time">${timeAgo}</span>
            </div>
            <div class="chat-text">${msg.message}</div>
        </div>
    `

  return div
}

function sendMessage() {
  if (isChatLocked && !currentUser.isAdmin) {
    showNotification(currentLanguage === "pt" ? "Chat trancado" : "Chat locked", "error")
    return
  }

  const now = Date.now()
  if (chatCooldown > 0 && now - lastMessageTime < chatCooldown * 1000 && !currentUser.isAdmin) {
    const remaining = Math.ceil((chatCooldown * 1000 - (now - lastMessageTime)) / 1000)
    showNotification(currentLanguage === "pt" ? `Aguarde ${remaining}s` : `Wait ${remaining}s`, "error")
    return
  }

  const input = document.getElementById("chatInput")
  const message = input.value.trim()

  if (!message) return

  const chatMessage = {
    id: Date.now(),
    username: currentUser.username,
    avatar: currentUser.avatar,
    verified: currentUser.verified,
    isAdmin: currentUser.isAdmin,
    message,
    timestamp: new Date().toISOString(),
  }

  const messages = getChatMessages()
  messages.push(chatMessage)
  saveChatMessages(messages)

  input.value = ""
  lastMessageTime = now
  loadChatMessages()
}

function updateChatStatus() {
  const statusDiv = document.getElementById("chatStatus")
  const input = document.getElementById("chatInput")
  const button = input.nextElementSibling

  if (isChatLocked && !currentUser.isAdmin) {
    statusDiv.innerHTML = `<span style="color: var(--danger);">${currentLanguage === "pt" ? "🔒 Chat Trancado" : "🔒 Chat Locked"}</span>`
    input.disabled = true
    button.disabled = true
  } else {
    statusDiv.innerHTML =
      chatCooldown > 0 ? `<span style="color: var(--warning);">⏱️ Cooldown: ${chatCooldown}s</span>` : ""
    input.disabled = false
    button.disabled = false
  }
}

// Admin Panel
function openAdminPanel() {
  if (!currentUser.isAdmin) {
    showNotification(currentLanguage === "pt" ? "Acesso negado" : "Access denied", "error")
    return
  }

  document.getElementById("adminPanel").classList.add("active")
  loadAdminUsers()
  updateAdminButtons()
}

function closeAdminPanel() {
  document.getElementById("adminPanel").classList.remove("active")
}

function showAdminTab(tabName) {
  document.querySelectorAll(".admin-tab").forEach((tab) => tab.classList.remove("active"))
  document.querySelectorAll(".admin-tab-content").forEach((content) => content.classList.remove("active"))

  event.target.classList.add("active")
  document.getElementById("admin" + tabName.charAt(0).toUpperCase() + tabName.slice(1)).classList.add("active")

  if (tabName === "users") {
    loadAdminUsers()
  }
}

function loadAdminUsers() {
  const users = getUsers()
  const activeList = document.getElementById("activeUsersList")
  const allList = document.getElementById("allUsersList")

  activeList.innerHTML = ""
  allList.innerHTML = ""

  const now = Date.now()
  const fiveMinutes = 5 * 60 * 1000

  users.forEach((user) => {
    const lastLogin = new Date(user.lastLogin).getTime()
    const isActive = now - lastLogin < fiveMinutes

    const userCard = createUserCard(user)

    if (isActive && !user.suspended) {
      activeList.appendChild(userCard)
    }

    allList.appendChild(userCard.cloneNode(true))
    attachUserCardEvents(allList.lastChild, user)
  })

  attachAllUserCardEvents(activeList)
}

function createUserCard(user) {
  const div = document.createElement("div")
  div.className = "user-card"

  div.innerHTML = `
        <div class="user-info">
            <img src="${user.avatar}" alt="${user.username}">
            <div>
                <h4>${user.username}</h4>
                <p>IP: ${user.ip} ${user.verified ? "✓" : ""} ${user.isAdmin ? "👑" : ""}</p>
                <p style="font-size: 0.9rem; color: var(--text-secondary);">
                    ${currentLanguage === "pt" ? "Registrado" : "Registered"}: ${new Date(user.registeredAt).toLocaleDateString()}
                </p>
                ${user.suspended ? `<p style="color: var(--danger);">${currentLanguage === "pt" ? "SUSPENSO" : "SUSPENDED"}</p>` : ""}
            </div>
        </div>
        <div class="user-actions">
            <button class="btn-verify" data-action="verify" data-username="${user.username}">
                ${user.verified ? (currentLanguage === "pt" ? "Remover ✓" : "Remove ✓") : currentLanguage === "pt" ? "Verificar" : "Verify"}
            </button>
            <button class="btn-ban" data-action="ban" data-username="${user.username}">
                ${user.suspended ? (currentLanguage === "pt" ? "Reativar" : "Reactivate") : currentLanguage === "pt" ? "Banir" : "Ban"}
            </button>
            <button class="btn-admin" data-action="admin" data-username="${user.username}">
                ${user.isAdmin ? (currentLanguage === "pt" ? "Remover Admin" : "Remove Admin") : currentLanguage === "pt" ? "Tornar Admin" : "Make Admin"}
            </button>
            <button class="btn-post" data-action="post" data-username="${user.username}">
                ${user.canPost ? (currentLanguage === "pt" ? "Remover Post" : "Remove Post") : currentLanguage === "pt" ? "Permitir Post" : "Allow Post"}
            </button>
        </div>
    `

  return div
}

function attachUserCardEvents(card, user) {
  card.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => handleUserAction(btn.dataset.action, btn.dataset.username))
  })
}

function attachAllUserCardEvents(container) {
  container.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => handleUserAction(btn.dataset.action, btn.dataset.username))
  })
}

function handleUserAction(action, username) {
  const users = getUsers()
  const userIndex = users.findIndex((u) => u.username === username)

  if (userIndex === -1) return

  switch (action) {
    case "verify":
      users[userIndex].verified = !users[userIndex].verified
      showNotification(currentLanguage === "pt" ? "Verificação atualizada" : "Verification updated", "success")
      break
    case "ban":
      users[userIndex].suspended = !users[userIndex].suspended
      if (users[userIndex].suspended) {
        logToDiscord("suspended", `User banned by admin: ${username}`)
      }
      showNotification(currentLanguage === "pt" ? "Status de banimento atualizado" : "Ban status updated", "success")
      break
    case "admin":
      users[userIndex].isAdmin = !users[userIndex].isAdmin
      showNotification(
        currentLanguage === "pt" ? "Permissão de admin atualizada" : "Admin permission updated",
        "success",
      )
      break
    case "post":
      users[userIndex].canPost = !users[userIndex].canPost
      showNotification(currentLanguage === "pt" ? "Permissão de post atualizada" : "Post permission updated", "success")
      break
  }

  saveUsers(users)
  loadAdminUsers()
}

function setChatCooldown() {
  const cooldown = Number.parseInt(document.getElementById("chatCooldown").value) || 0
  const settings = JSON.parse(localStorage.getItem("chatSettings") || "{}")
  settings.cooldown = cooldown
  localStorage.setItem("chatSettings", JSON.stringify(settings))
  chatCooldown = cooldown
  updateChatStatus()
  showNotification(currentLanguage === "pt" ? "Cooldown definido" : "Cooldown set", "success")
}

function clearAllMessages() {
  if (confirm(currentLanguage === "pt" ? "Limpar todas as mensagens?" : "Clear all messages?")) {
    saveChatMessages([])
    loadChatMessages()
    showNotification(currentLanguage === "pt" ? "Mensagens limpas" : "Messages cleared", "success")
  }
}

function toggleChatLock() {
  const settings = JSON.parse(localStorage.getItem("chatSettings") || "{}")
  settings.locked = !settings.locked
  localStorage.setItem("chatSettings", JSON.stringify(settings))
  isChatLocked = settings.locked
  updateChatStatus()
  updateAdminButtons()
  showNotification(
    currentLanguage === "pt"
      ? isChatLocked
        ? "Chat trancado"
        : "Chat destrancado"
      : isChatLocked
        ? "Chat locked"
        : "Chat unlocked",
    "success",
  )
}

function toggleMaintenance() {
  const maintenance = JSON.parse(localStorage.getItem("maintenanceMode") || "false")
  localStorage.setItem("maintenanceMode", JSON.stringify(!maintenance))
  updateAdminButtons()
  showNotification(currentLanguage === "pt" ? "Modo manutenção atualizado" : "Maintenance mode updated", "success")
}

function setMaintenancePassword() {
  const password = document.getElementById("maintenancePasswordSet").value
  localStorage.setItem("maintenancePassword", password)
  showNotification(currentLanguage === "pt" ? "Senha definida" : "Password set", "success")
}

function checkMaintenance() {
  const maintenance = JSON.parse(localStorage.getItem("maintenanceMode") || "false")
  if (maintenance) {
    document.getElementById("maintenanceMode").style.display = "flex"
  }
}

function unlockMaintenance() {
  const password = document.getElementById("maintenancePassword").value
  const savedPassword = localStorage.getItem("maintenancePassword") || "admin"

  if (password === savedPassword) {
    document.getElementById("maintenanceMode").style.display = "none"
  } else {
    showNotification(currentLanguage === "pt" ? "Senha incorreta" : "Incorrect password", "error")
  }
}

function updateAdminButtons() {
  const maintenanceBtn = document.getElementById("maintenanceBtn")
  const chatLockBtn = document.getElementById("chatLockBtn")

  if (maintenanceBtn) {
    const maintenance = JSON.parse(localStorage.getItem("maintenanceMode") || "false")
    maintenanceBtn.textContent = maintenance
      ? currentLanguage === "pt"
        ? "Desativar Modo Manutenção"
        : "Disable Maintenance Mode"
      : currentLanguage === "pt"
        ? "Ativar Modo Manutenção"
        : "Enable Maintenance Mode"
  }

  if (chatLockBtn) {
    const settings = JSON.parse(localStorage.getItem("chatSettings") || "{}")
    chatLockBtn.textContent = settings.locked
      ? currentLanguage === "pt"
        ? "Destrancar Chat"
        : "Unlock Chat"
      : currentLanguage === "pt"
        ? "Trancar Chat"
        : "Lock Chat"
  }
}

// Active Users
function updateActiveUsers() {
  if (currentUser) {
    const users = getUsers()
    const userIndex = users.findIndex((u) => u.username === currentUser.username)
    if (userIndex !== -1) {
      users[userIndex].lastLogin = new Date().toISOString()
      saveUsers(users)
    }
  }

  const users = getUsers()
  const now = Date.now()
  const fiveMinutes = 5 * 60 * 1000

  const activeCount = users.filter((user) => {
    const lastLogin = new Date(user.lastLogin).getTime()
    return now - lastLogin < fiveMinutes && !user.suspended
  }).length

  document.getElementById("activeUsersCount").textContent = activeCount
}

// Utilities
function getTimeAgo(timestamp) {
  const now = Date.now()
  const time = new Date(timestamp).getTime()
  const diff = now - time

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return currentLanguage === "pt" ? "Agora" : "Now"
  if (minutes < 60) return `${minutes}${currentLanguage === "pt" ? "min" : "min"}`
  if (hours < 24) return `${hours}${currentLanguage === "pt" ? "h" : "h"}`
  return `${days}${currentLanguage === "pt" ? "d" : "d"}`
}

function showNotification(message, type = "info") {
  const container = document.getElementById("notificationContainer")
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  container.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

function logToDiscord(type, message) {
  const webhook = type === "suspended" ? DISCORD_WEBHOOK_SUSPENDED : DISCORD_WEBHOOK_LOGS

  fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: `**[${new Date().toLocaleString()}]** ${message}`,
    }),
  }).catch(() => {})
}

// Event Listeners
document.getElementById("chatInput")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage()
  }
})

window.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-user")) {
    document.getElementById("userMenu")?.classList.remove("active")
  }
})
