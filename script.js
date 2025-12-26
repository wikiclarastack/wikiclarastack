// Global state
let currentUser = null
let currentLanguage = "en"
const users = JSON.parse(localStorage.getItem("users")) || []
let chatMessages = JSON.parse(localStorage.getItem("chatMessages")) || []
const galleryImages = JSON.parse(localStorage.getItem("galleryImages")) || [
  {
    url: "https://image.tmdb.org/t/p/w500/yMK3IADqV2oReJMKdkrcEIBxdtu.jpg",
    caption: "Clara Stack",
  },
  {
    url: "https://ntvb.tmsimg.com/assets/assets/GNLZZGG002G2JKZ.jpg",
    caption: "Clara Stack",
  },
  {
    url: "https://media.gettyimages.com/id/2242330361/photo/los-angeles-premiere-of-hbo-original-series-it-welcome-to-derry-red-carpet.jpg?s=1024x1024&w=gi&k=20&c=SATqk9OF8uyP8-6xKlIUS4AhKcPg3unpDSieOnkrGrc=",
    caption: "Matilda and Clara Stack",
  },
]
const siteSettings = JSON.parse(localStorage.getItem("siteSettings")) || {
  chatCooldown: 5,
  chatLocked: false,
  siteClosed: false,
}
let lastMessageTime = 0

// Initialize
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none"
    detectLanguage()
    checkSession()
    loadGallery()
    setInterval(updateActiveUsers, 5000)
  }, 1000)
})

// Language detection
function detectLanguage() {
  const browserLang = navigator.language || navigator.userLanguage
  if (browserLang.startsWith("pt")) {
    currentLanguage = "pt"
  } else {
    currentLanguage = "en"
  }
  updateLanguage()
  document.getElementById("themeSelect").value = "dark"
  changeTheme()
}

function updateLanguage() {
  document.querySelectorAll("[data-en]").forEach((el) => {
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = el.getAttribute(`data-${currentLanguage}-placeholder`)
    } else {
      el.textContent = el.getAttribute(`data-${currentLanguage}`)
    }
  })
  document.getElementById("languageSelect").value = currentLanguage
}

function changeLanguage() {
  currentLanguage = document.getElementById("languageSelect").value
  updateLanguage()
}

// Theme
function changeTheme() {
  const theme = document.getElementById("themeSelect").value
  if (theme === "light") {
    document.body.classList.add("light-theme")
  } else if (theme === "dark") {
    document.body.classList.remove("light-theme")
  } else {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      document.body.classList.add("light-theme")
    } else {
      document.body.classList.remove("light-theme")
    }
  }
}

// IP Detection
async function getUserIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json()
    return data.ip
  } catch (error) {
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

// Discord Webhooks
async function sendToDiscord(webhookUrl, message) {
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    })
  } catch (error) {
    console.log("Discord webhook error:", error)
  }
}

// Auth functions
function switchToRegister() {
  document.getElementById("loginForm").classList.remove("active")
  document.getElementById("registerForm").classList.add("active")
}

function switchToLogin() {
  document.getElementById("registerForm").classList.remove("active")
  document.getElementById("loginForm").classList.add("active")
}

async function register() {
  const username = document.getElementById("regUsername").value.trim()
  const email = document.getElementById("regEmail").value.trim()
  const password = document.getElementById("regPassword").value

  if (!username || !email || !password) {
    alert(currentLanguage === "en" ? "Please fill all fields" : "Preencha todos os campos")
    return
  }

  // Check unique username
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    alert(currentLanguage === "en" ? "Username already exists" : "Nome de usuário já existe")
    return
  }

  // Check unique email
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    alert(currentLanguage === "en" ? "Email already registered" : "Email já registrado")
    return
  }

  const ip = await getUserIP()
  const ipInfo = await getIPInfo(ip)

  const newUser = {
    username,
    email,
    password,
    ip,
    ipInfo,
    profilePic:
      "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png",
    verified: false,
    isAdmin: false,
    banned: false,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))

  await sendToDiscord(
    "https://discord.com/api/webhooks/1453871095672340612/U1fotOujLXmOESKp0JJXLEa3zcqGnImE2ENz_Vpw8ekLI81wD0uvDbTWIkHLMV9SE3K0",
    `New user registered: ${username} (${email}) from ${ipInfo.city}, ${ipInfo.country} [IP: ${ip}]`,
  )

  alert(currentLanguage === "en" ? "Registration successful! Please login." : "Registro bem-sucedido! Faça login.")
  switchToLogin()
}

async function login() {
  const username = document.getElementById("loginUsername").value.trim()
  const password = document.getElementById("loginPassword").value

  if (!username || !password) {
    alert(currentLanguage === "en" ? "Please fill all fields" : "Preencha todos os campos")
    return
  }

  const user = users.find((u) => u.username === username && u.password === password)

  if (!user) {
    alert(currentLanguage === "en" ? "Invalid credentials" : "Credenciais inválidas")
    return
  }

  if (user.banned) {
    await sendToDiscord(
      "https://discord.com/api/webhooks/1453870994233233672/ECP6u8tLh4ui2t3HOagXinv9QkeAU8mUScKLKkiY47mFNejrQhGU9v3xRNaHI4UjeqfC",
      `Banned user tried to login: ${username} [IP: ${await getUserIP()}]`,
    )
    alert(currentLanguage === "en" ? "Your account has been suspended" : "Sua conta foi suspensa")
    return
  }

  const currentIP = await getUserIP()

  if (user.ip !== currentIP && username !== "admin") {
    user.banned = true
    localStorage.setItem("users", JSON.stringify(users))
    await sendToDiscord(
      "https://discord.com/api/webhooks/1453870994233233672/ECP6u8tLh4ui2t3HOagXinv9QkeAU8mUScKLKkiY47mFNejrQhGU9v3xRNaHI4UjeqfC",
      `Account suspended - IP changed: ${username} [Old IP: ${user.ip}, New IP: ${currentIP}]`,
    )
    alert(
      currentLanguage === "en"
        ? "Account suspended - IP address changed. Contact admin."
        : "Conta suspensa - Endereço IP alterado. Contate o administrador.",
    )
    return
  }

  user.lastLogin = new Date().toISOString()
  localStorage.setItem("users", JSON.stringify(users))

  currentUser = user
  sessionStorage.setItem("currentUser", JSON.stringify(user))

  const ipInfo = await getIPInfo(currentIP)
  await sendToDiscord(
    "https://discord.com/api/webhooks/1453871095672340612/U1fotOujLXmOESKp0JJXLEa3zcqGnImE2ENz_Vpw8ekLI81wD0uvDbTWIkHLMV9SE3K0",
    `User logged in: ${username} from ${ipInfo.city}, ${ipInfo.country} [IP: ${currentIP}]`,
  )

  showMainSite()
}

function checkSession() {
  const savedUser = sessionStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    showMainSite()
  }
}

function showMainSite() {
  document.getElementById("authScreen").style.display = "none"
  document.getElementById("mainSite").style.display = "block"

  // Update UI
  document.getElementById("navUsername").textContent = currentUser.username
  document.getElementById("navProfilePic").src = currentUser.profilePic
  document.getElementById("settingsUsername").textContent = currentUser.username
  document.getElementById("settingsProfilePic").src = currentUser.profilePic

  if (currentUser.verified) {
    document.getElementById("settingsVerified").style.display = "inline-flex"
  }

  if (currentUser.isAdmin || currentUser.username === "admin") {
    document.getElementById("adminLink").style.display = "block"
    currentUser.isAdmin = true
  }

  loadChat()
  updateActiveUsers()
}

function logout() {
  sessionStorage.removeItem("currentUser")
  currentUser = null
  location.reload()
}

// Navigation
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active")
  })
  document.getElementById(sectionId).classList.add("active")
}

// Gallery
function loadGallery() {
  const grid = document.getElementById("galleryGrid")
  grid.innerHTML = ""

  galleryImages.forEach((img, index) => {
    const item = document.createElement("div")
    item.className = "gallery-item"
    item.innerHTML = `
            <img src="${img.url}" alt="${img.caption}">
            ${img.caption ? `<div class="gallery-caption">${img.caption}</div>` : ""}
        `
    grid.appendChild(item)
  })
}

// Chat
function loadChat() {
  const container = document.getElementById("chatMessages")
  container.innerHTML = ""

  chatMessages.forEach((msg) => {
    const msgEl = document.createElement("div")
    msgEl.className = "chat-message"

    const isAdmin = msg.username === "admin" || msg.isAdmin
    const adminClass = isAdmin ? "admin" : ""
    const adminBadge = isAdmin
      ? '<img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" class="admin-badge">'
      : ""
    const verifiedBadge = msg.verified
      ? '<span class="verified-badge"><img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png"></span>'
      : ""

    msgEl.innerHTML = `
            <div class="chat-message-header">
                <span class="chat-message-user ${adminClass}">${msg.username}</span>
                ${adminBadge}
                ${verifiedBadge}
                <span class="chat-message-time">${new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="chat-message-content">${msg.message}</div>
        `
    container.appendChild(msgEl)
  })

  container.scrollTop = container.scrollHeight
}

function sendMessage() {
  if (siteSettings.chatLocked && !currentUser.isAdmin) {
    alert(currentLanguage === "en" ? "Chat is locked by administrator" : "Chat bloqueado pelo administrador")
    return
  }

  const input = document.getElementById("chatInput")
  const message = input.value.trim()

  if (!message) return

  const now = Date.now()
  const cooldown = (siteSettings.chatCooldown || 5) * 1000

  if (now - lastMessageTime < cooldown && !currentUser.isAdmin) {
    const remaining = Math.ceil((cooldown - (now - lastMessageTime)) / 1000)
    alert(
      currentLanguage === "en"
        ? `Please wait ${remaining} seconds before sending another message`
        : `Aguarde ${remaining} segundos antes de enviar outra mensagem`,
    )
    return
  }

  const newMessage = {
    username: currentUser.username,
    message,
    timestamp: new Date().toISOString(),
    verified: currentUser.verified,
    isAdmin: currentUser.isAdmin,
  }

  chatMessages.push(newMessage)
  localStorage.setItem("chatMessages", JSON.stringify(chatMessages))

  lastMessageTime = now
  input.value = ""
  loadChat()
}

document.getElementById("chatInput")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage()
  }
})

// Settings
function updateProfilePic() {
  const url = document.getElementById("profilePicInput").value.trim()
  if (!url) return

  currentUser.profilePic = url
  updateUserInStorage()

  document.getElementById("navProfilePic").src = url
  document.getElementById("settingsProfilePic").src = url

  alert(currentLanguage === "en" ? "Profile picture updated!" : "Foto de perfil atualizada!")
}

function updateUsername() {
  const newUsername = document.getElementById("newUsernameInput").value.trim()
  if (!newUsername) return

  if (
    users.some((u) => u.username.toLowerCase() === newUsername.toLowerCase() && u.username !== currentUser.username)
  ) {
    alert(currentLanguage === "en" ? "Username already exists" : "Nome de usuário já existe")
    return
  }

  currentUser.username = newUsername
  updateUserInStorage()

  document.getElementById("navUsername").textContent = newUsername
  document.getElementById("settingsUsername").textContent = newUsername

  alert(currentLanguage === "en" ? "Username updated!" : "Nome de usuário atualizado!")
}

function updatePassword() {
  const newPassword = document.getElementById("newPasswordInput").value
  if (!newPassword) return

  currentUser.password = newPassword
  updateUserInStorage()

  alert(currentLanguage === "en" ? "Password updated!" : "Senha atualizada!")
  document.getElementById("newPasswordInput").value = ""
}

function updateUserInStorage() {
  const index = users.findIndex((u) => u.email === currentUser.email)
  if (index !== -1) {
    users[index] = currentUser
    localStorage.setItem("users", JSON.stringify(users))
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser))
  }
}

// Active users
function updateActiveUsers() {
  const activeUsers = users.filter((u) => {
    const lastLogin = new Date(u.lastLogin)
    const now = new Date()
    return now - lastLogin < 300000 // 5 minutes
  })

  document.getElementById("activeUsersCount").textContent = activeUsers.length

  if (document.getElementById("adminPanel").style.display === "block") {
    loadAdminUsers()
  }
}

// Admin Panel
function showAdminPanel() {
  if (!currentUser.isAdmin && currentUser.username !== "admin") {
    alert(currentLanguage === "en" ? "Access denied" : "Acesso negado")
    return
  }

  document.getElementById("adminPanel").style.display = "flex"
  loadAdminUsers()
}

function closeAdminPanel() {
  document.getElementById("adminPanel").style.display = "none"
}

function showAdminTab(tabName) {
  document.querySelectorAll(".admin-tab").forEach((tab) => tab.classList.remove("active"))
  document.querySelectorAll(".admin-tab-content").forEach((content) => content.classList.remove("active"))

  event.target.classList.add("active")
  document.getElementById(`admin${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Tab`).classList.add("active")
}

function loadAdminUsers() {
  const activeUsersContainer = document.getElementById("adminActiveUsers")
  const allUsersContainer = document.getElementById("adminAllUsers")

  const activeUsers = users.filter((u) => {
    const lastLogin = new Date(u.lastLogin)
    const now = new Date()
    return now - lastLogin < 300000
  })

  activeUsersContainer.innerHTML = ""
  activeUsers.forEach((user) => {
    activeUsersContainer.appendChild(createAdminUserItem(user))
  })

  allUsersContainer.innerHTML = ""
  users.forEach((user) => {
    allUsersContainer.appendChild(createAdminUserItem(user))
  })
}

function createAdminUserItem(user) {
  const item = document.createElement("div")
  item.className = "admin-user-item"

  const verifiedBadge = user.verified
    ? '<span class="verified-badge"><img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png"></span>'
    : ""
  const adminBadge = user.isAdmin
    ? '<img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" class="admin-badge">'
    : ""

  item.innerHTML = `
        <div class="admin-user-info">
            <img src="${user.profilePic}" alt="${user.username}">
            <div>
                <strong>${user.username}</strong> ${verifiedBadge} ${adminBadge}
                <br>
                <small>${user.email}</small>
                <br>
                <small>${user.ipInfo.city}, ${user.ipInfo.country} [${user.ip}]</small>
            </div>
        </div>
        <div class="admin-user-actions">
            ${!user.verified ? `<button class="verify-btn" onclick="toggleVerify('${user.username}')">Verify</button>` : `<button class="unverify-btn" onclick="toggleVerify('${user.username}')">Unverify</button>`}
            ${!user.isAdmin ? `<button class="make-admin-btn" onclick="makeAdmin('${user.username}')">Make Admin</button>` : ""}
            <button class="ban-btn" onclick="banUser('${user.username}')">Ban</button>
        </div>
    `

  return item
}

function toggleVerify(username) {
  const user = users.find((u) => u.username === username)
  if (user) {
    user.verified = !user.verified
    localStorage.setItem("users", JSON.stringify(users))
    loadAdminUsers()

    if (currentUser.username === username) {
      currentUser.verified = user.verified
      updateUserInStorage()
      location.reload()
    }
  }
}

function makeAdmin(username) {
  const user = users.find((u) => u.username === username)
  if (user) {
    user.isAdmin = true
    localStorage.setItem("users", JSON.stringify(users))
    loadAdminUsers()
    alert(`${username} is now an administrator`)
  }
}

function banUser(username) {
  if (username === "admin") {
    alert("Cannot ban admin")
    return
  }

  const user = users.find((u) => u.username === username)
  if (user) {
    user.banned = true
    localStorage.setItem("users", JSON.stringify(users))

    sendToDiscord(
      "https://discord.com/api/webhooks/1453870994233233672/ECP6u8tLh4ui2t3HOagXinv9QkeAU8mUScKLKkiY47mFNejrQhGU9v3xRNaHI4UjeqfC",
      `User banned by admin: ${username} [IP: ${user.ip}]`,
    )

    loadAdminUsers()
    alert(`${username} has been banned`)
  }
}

function addGalleryImage() {
  const url = document.getElementById("adminGalleryUrl").value.trim()
  const caption = document.getElementById("adminGalleryCaption").value.trim()

  if (!url) return

  galleryImages.push({ url, caption })
  localStorage.setItem("galleryImages", JSON.stringify(galleryImages))

  document.getElementById("adminGalleryUrl").value = ""
  document.getElementById("adminGalleryCaption").value = ""

  loadGallery()
  alert("Image added to gallery")
}

function updateChatCooldown() {
  const cooldown = Number.parseInt(document.getElementById("chatCooldown").value)
  siteSettings.chatCooldown = cooldown
  localStorage.setItem("siteSettings", JSON.stringify(siteSettings))
  alert(`Chat cooldown updated to ${cooldown} seconds`)
}

function toggleChatLock() {
  siteSettings.chatLocked = !siteSettings.chatLocked
  localStorage.setItem("siteSettings", JSON.stringify(siteSettings))

  const btn = document.getElementById("chatLockBtn")
  btn.textContent = siteSettings.chatLocked
    ? currentLanguage === "en"
      ? "Unlock Chat"
      : "Destrancar Chat"
    : currentLanguage === "en"
      ? "Lock Chat"
      : "Trancar Chat"

  document.getElementById("chatLockedNotice").style.display = siteSettings.chatLocked ? "block" : "none"
}

function clearAllMessages() {
  if (confirm("Are you sure you want to delete all chat messages?")) {
    chatMessages = []
    localStorage.setItem("chatMessages", JSON.stringify(chatMessages))
    loadChat()
    alert("All messages deleted")
  }
}

function createAdminPost() {
  const content = document.getElementById("adminPostContent").value.trim()
  if (!content) return

  alert("Post functionality would send notifications to all users")
  document.getElementById("adminPostContent").value = ""
}

function shutdownSite() {
  alert("Site shutdown feature - would require backend implementation")
}

// Initialize admin user if not exists
if (!users.find((u) => u.username === "admin")) {
  users.push({
    username: "admin",
    email: "admin@clarastack.com",
    password: "admin",
    ip: "localhost",
    ipInfo: { country: "System", city: "System", region: "System" },
    profilePic:
      "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png",
    verified: true,
    isAdmin: true,
    banned: false,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  })
  localStorage.setItem("users", JSON.stringify(users))
}
