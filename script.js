// Webhooks do Discord
const WEBHOOKS = {
  suspended:
    "https://discord.com/api/webhooks/1453870994233233672/ECP6u8tLh4ui2t3HOagXinv9QkeAU8mUScKLKkiY47mFNejrQhGU9v3xRNaHI4UjeqfC",
  log: "https://discord.com/api/webhooks/1453871095672340612/U1fotOujLXmOESKp0JJXLEa3zcqGnImE2ENz_Vpw8ekLI81wD0uvDbTWIkHLMV9SE3K0",
}

// Traduções
const translations = {
  pt: {
    nav_home: "Início",
    nav_about: "Sobre",
    nav_projects: "Trabalhos",
    nav_gallery: "Galeria",
    nav_chat: "Chat",
    login_button: "Entrar",
    login_title: "Entrar",
    register_title: "Registrar",
    register_button: "Criar Conta",
    no_account: "Não tem conta?",
    have_account: "Já tem conta?",
    settings_title: "Configurações",
    profile_section: "Perfil",
    choose_photo: "Escolher Foto",
    update_username: "Atualizar Username",
    update_password: "Atualizar Senha",
    language_section: "Idioma",
    logout_button: "Sair",
    hero_title: "Clara Stack",
    hero_subtitle: "Atriz | Lilly Bainbridge em IT: Welcome to Derry",
    about_title: "Sobre Clara Stack",
    about_text:
      'Clara Stack é uma talentosa atriz americana conhecida por seu papel marcante como Lilly Bainbridge na série "IT: Welcome to Derry" da HBO Max. Ela começou sua carreira no teatro, interpretando Matilda no musical "Matilda the Musical" em Nova York.',
    curiosities_title: "Curiosidades",
    curiosity_1: "Começou no teatro interpretando Matilda no musical Matilda the Musical em Nova York",
    curiosity_2: "Seus pais são Eoin e Amanda Stack",
    curiosity_3: "Tem uma irmã gêmea chamada Maggie Stack",
    projects_title: "Trabalhos",
    project_it_desc: "Série HBO Max - Lilly Bainbridge",
    featured_badge: "Destaque",
    project_naughty_desc: "Filme Disney",
    project_hawkeye_desc: "Minissérie Marvel",
    project_madam_desc: "Série de TV",
    character_title: "Personagem Mais Marcante",
    gallery_title: "Galeria",
    chat_title: "Chat Global",
    chat_locked_message: "🔒 O chat está trancado no momento",
    chat_placeholder: "Digite sua mensagem...",
    send_button: "Enviar",
    follow_title: "Siga Clara Stack",
    credits_title: "Créditos",
    credits_text: "Site desenvolvido por",
    portfolio_link: "Portfólio",
    copyright_hbo:
      "As imagens que envolvem a série IT: Welcome to Derry são de propriedade da HBO Max. Para remoção, entre em contato via portfólio.",
    rights_reserved: "Todos os direitos reservados.",
    unauthorized_warning: "⚠️ Reprodução não autorizada é proibida.",
    admin_panel_title: "Painel Administrativo",
    users_tab: "Usuários",
    gallery_tab: "Galeria",
    posts_tab: "Postagens",
    settings_tab: "Configurações",
    registered_users: "Usuários Registrados",
    active_users: "Usuários Ativos",
    add_gallery_image: "Adicionar Imagem à Galeria",
    add_button: "Adicionar",
    create_post: "Criar Postagem",
    publish_button: "Publicar",
    site_settings: "Configurações do Site",
    chat_cooldown: "Cooldown do Chat (segundos):",
    update_button: "Atualizar",
    lock_chat: "Trancar Chat",
    clear_chat: "Limpar Chat",
    shutdown_site: "Modo Manutenção",
    maintenance_title: "🔧 Site em Manutenção",
    maintenance_text: "Voltaremos em breve!",
    access_button: "Acessar",
    news_title: "Notícias",
    disclaimer_text:
      "ℹ️ Todas as informações e fotos são retiradas da internet. Este site não é afiliado à HBO Max ou qualquer outra plataforma.",
    made_with_love: "Feito com muito amor e carinho ❤️",
    actor_offer:
      "Atores/atrizes de IT: Welcome to Derry podem ter um site como este totalmente de graça! Basta visitar meu portfólio e entrar em contato via aba 'Contact'.",
  },
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_projects: "Works",
    nav_gallery: "Gallery",
    nav_chat: "Chat",
    login_button: "Login",
    login_title: "Login",
    register_title: "Register",
    register_button: "Create Account",
    no_account: "Don't have an account?",
    have_account: "Already have an account?",
    settings_title: "Settings",
    profile_section: "Profile",
    choose_photo: "Choose Photo",
    update_username: "Update Username",
    update_password: "Update Password",
    language_section: "Language",
    logout_button: "Logout",
    hero_title: "Clara Stack",
    hero_subtitle: "Actress | Lilly Bainbridge in IT: Welcome to Derry",
    about_title: "About Clara Stack",
    about_text:
      'Clara Stack is a talented American actress known for her striking role as Lilly Bainbridge in the HBO Max series "IT: Welcome to Derry". She began her career in theater, playing Matilda in the musical "Matilda the Musical" in New York.',
    curiosities_title: "Fun Facts",
    curiosity_1: "Started in theater playing Matilda in the musical Matilda the Musical in New York",
    curiosity_2: "Her parents are Eoin and Amanda Stack",
    curiosity_3: "Has a twin sister named Maggie Stack",
    projects_title: "Works",
    project_it_desc: "HBO Max Series - Lilly Bainbridge",
    featured_badge: "Featured",
    project_naughty_desc: "Disney Movie",
    project_hawkeye_desc: "Marvel Miniseries",
    project_madam_desc: "TV Series",
    character_title: "Most Iconic Character",
    gallery_title: "Gallery",
    chat_title: "Global Chat",
    chat_locked_message: "🔒 Chat is currently locked",
    chat_placeholder: "Type your message...",
    send_button: "Send",
    follow_title: "Follow Clara Stack",
    credits_title: "Credits",
    credits_text: "Website developed by",
    portfolio_link: "Portfolio",
    copyright_hbo:
      "Images involving the IT: Welcome to Derry series are property of HBO Max. For removal, contact via portfolio.",
    rights_reserved: "All rights reserved.",
    unauthorized_warning: "⚠️ Unauthorized reproduction is prohibited.",
    admin_panel_title: "Admin Panel",
    users_tab: "Users",
    gallery_tab: "Gallery",
    posts_tab: "Posts",
    settings_tab: "Settings",
    registered_users: "Registered Users",
    active_users: "Active Users",
    add_gallery_image: "Add Image to Gallery",
    add_button: "Add",
    create_post: "Create Post",
    publish_button: "Publish",
    site_settings: "Site Settings",
    chat_cooldown: "Chat Cooldown (seconds):",
    update_button: "Update",
    lock_chat: "Lock Chat",
    clear_chat: "Clear Chat",
    shutdown_site: "Maintenance Mode",
    maintenance_title: "🔧 Under Maintenance",
    maintenance_text: "We will be back soon!",
    access_button: "Access",
    news_title: "News",
    disclaimer_text:
      "ℹ️ All information and photos are sourced from the internet. This site is not affiliated with HBO Max or any other platform.",
    made_with_love: "Made with lots of love and care ❤️",
    actor_offer:
      "Actors/actresses from IT: Welcome to Derry can have a website like this completely free! Just visit my portfolio and contact me via the 'Contact' tab.",
  },
}

// Estado global da aplicação
const appState = {
  currentUser: null,
  currentLanguage: "en",
  currentTheme: "dark",
  chatCooldown: 0,
  lastMessageTime: 0,
  userIP: null,
}

// Inicializar servidor local (simulação de backend)
function initializeServer() {
  if (!localStorage.getItem("server_users")) {
    const defaultUsers = {
      admin: {
        email: "admin@clarastack.com",
        password: "admin",
        ip: "any",
        verified: true,
        isAdmin: true,
        profileImage:
          "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png",
        canPostImages: true,
        createdAt: new Date().toISOString(),
      },
    }
    localStorage.setItem("server_users", JSON.stringify(defaultUsers))
  }
  if (!localStorage.getItem("server_gallery")) {
    const defaultGallery = [
      {
        url: "https://media.gettyimages.com/id/2242330361/photo/los-angeles-premiere-of-hbo-original-series-it-welcome-to-derry-red-carpet.jpg?s=1024x1024&w=gi&k=20&c=SATqk9OF8uyP8-6xKlIUS4AhKcPg3unpDSieOnkrGrc=",
        caption: "Matilda and Clara Stack - IT: Welcome to Derry Premiere",
      },
      {
        url: "https://media.gettyimages.com/id/2242313791/photo/los-angeles-premiere-of-hbo-original-series-it-welcome-to-derry.jpg?s=1024x1024&w=gi&k=20&c=ozLhw5EvhFSpQeDS36PfCZIG0bY4ofPNxelcsJSN3ew=",
        caption: "Clara Stack at IT: Welcome to Derry Premiere",
      },
      {
        url: "https://elcomercio.pe/resizer/v2/ZLEZYAYGJBAYNNIRVWBIOMJ6Z4.jpg?auth=585dcbc947baaa48292c190c1cce1d5fb0444fa13e83d411f29e0c5638ee7452&width=1200&height=1371&quality=75&smart=true",
        caption: "Clara Stack as Lilly Bainbridge",
      },
      {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvTMnnpP9p4yr3TbS1aqUktmPvVVyy7lvwqQ&s",
        caption: "Behind the Scenes",
      },
    ]
    localStorage.setItem("server_gallery", JSON.stringify(defaultGallery))
  }
  if (!localStorage.getItem("server_chat")) {
    localStorage.setItem("server_chat", JSON.stringify([]))
  }
  if (!localStorage.getItem("server_posts")) {
    localStorage.setItem("server_posts", JSON.stringify([]))
  }
  if (!localStorage.getItem("server_config")) {
    const config = {
      chatLocked: false,
      chatCooldown: 3,
      maintenance: false,
      maintenancePassword: "admin",
    }
    localStorage.setItem("server_config", JSON.stringify(config))
  }
  if (!localStorage.getItem("server_active_users")) {
    localStorage.setItem("server_active_users", JSON.stringify({}))
  }
}

// Detectar região do usuário
async function detectUserRegion() {
  try {
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()
    appState.userIP = data.ip

    // Enviar log para Discord
    sendWebhook(WEBHOOKS.log, {
      content: `🌍 **Novo visitante**\nIP: ${data.ip}\nPaís: ${data.country_name}\nCidade: ${data.city}`,
    })

    // Se for dos EUA, mudar idioma para inglês
    if (data.country_code === "US") {
      appState.currentLanguage = "en"
      document.documentElement.lang = "en"
    }

    return data
  } catch (error) {
    console.error("Erro ao detectar região:", error)
    appState.userIP = "unknown"
    return { country_code: "BR" }
  }
}

// Enviar webhook para Discord
async function sendWebhook(url, data) {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error("Erro ao enviar webhook:", error)
  }
}

// Traduzir página
function translatePage() {
  const elements = document.querySelectorAll("[data-translate]")
  elements.forEach((element) => {
    const key = element.getAttribute("data-translate")
    if (translations[appState.currentLanguage][key]) {
      element.textContent = translations[appState.currentLanguage][key]
    }
  })

  // Traduzir placeholders
  const placeholders = document.querySelectorAll("[data-translate-placeholder]")
  placeholders.forEach((element) => {
    const key = element.getAttribute("data-translate-placeholder")
    if (translations[appState.currentLanguage][key]) {
      element.placeholder = translations[appState.currentLanguage][key]
    }
  })
}

// Sistema de temas
function applyTheme() {
  document.body.setAttribute("data-theme", "dark")
  appState.currentTheme = "dark"
}

// Autenticação
function register(username, email, password) {
  const users = JSON.parse(localStorage.getItem("server_users"))

  // Verificar se email já existe
  if (Object.values(users).some((u) => u.email === email)) {
    showNotification("Este email já está cadastrado!", "error")
    return false
  }

  // Verificar se username já existe
  if (users[username]) {
    showNotification("Este username já está em uso!", "error")
    return false
  }

  // Criar usuário
  users[username] = {
    email,
    password,
    ip: appState.userIP,
    verified: false,
    isAdmin: username === "admin",
    profileImage:
      "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small/user-icon-on-transparent-background-free-png.png",
    canPostImages: false,
    createdAt: new Date().toISOString(),
  }

  localStorage.setItem("server_users", JSON.stringify(users))
  syncToAllTabs("users_updated")

  showNotification("Conta criada com sucesso!", "success")
  return true
}

function login(username, password) {
  const users = JSON.parse(localStorage.getItem("server_users"))
  const user = users[username]

  if (!user) {
    showNotification("Usuário não encontrado!", "error")
    return false
  }

  if (user.password !== password) {
    showNotification("Senha incorreta!", "error")
    return false
  }

  if (user.ip !== appState.userIP && user.ip !== "any" && username !== "admin") {
    showNotification("Sua conta foi desativada devido a mudança de IP. Contate um administrador.", "error")
    sendWebhook(WEBHOOKS.suspended, {
      content: `🚫 **Conta Suspensa**\nUsuário: ${username}\nIP Original: ${user.ip}\nIP Atual: ${appState.userIP}`,
    })
    return false
  }

  // Login bem-sucedido
  appState.currentUser = { username, ...user }
  localStorage.setItem("current_user", username)

  // Adicionar aos usuários ativos
  addActiveUser(username)

  updateUserInterface()
  showNotification("Login realizado com sucesso!", "success")

  sendWebhook(WEBHOOKS.log, {
    content: `✅ **Login**\nUsuário: ${username}\nIP: ${appState.userIP}`,
  })

  return true
}

function logout() {
  if (appState.currentUser) {
    removeActiveUser(appState.currentUser.username)
  }
  appState.currentUser = null
  localStorage.removeItem("current_user")
  updateUserInterface()
  showNotification("Logout realizado com sucesso!", "success")
}

// Usuários ativos
function addActiveUser(username) {
  const activeUsers = JSON.parse(localStorage.getItem("server_active_users"))
  activeUsers[username] = {
    timestamp: Date.now(),
    ip: appState.userIP,
  }
  localStorage.setItem("server_active_users", JSON.stringify(activeUsers))
  syncToAllTabs("active_users_updated")
}

function removeActiveUser(username) {
  const activeUsers = JSON.parse(localStorage.getItem("server_active_users"))
  delete activeUsers[username]
  localStorage.setItem("server_active_users", JSON.stringify(activeUsers))
  syncToAllTabs("active_users_updated")
}

function cleanupInactiveUsers() {
  const activeUsers = JSON.parse(localStorage.getItem("server_active_users"))
  const now = Date.now()
  const timeout = 5 * 60 * 1000 // 5 minutos

  Object.keys(activeUsers).forEach((username) => {
    if (now - activeUsers[username].timestamp > timeout) {
      delete activeUsers[username]
    }
  })

  localStorage.setItem("server_active_users", JSON.stringify(activeUsers))
  syncToAllTabs("active_users_updated")
}

// Atualizar interface do usuário
function updateUserInterface() {
  const authButtons = document.getElementById("authButtons")
  const userProfile = document.getElementById("userProfile")
  const usernameDisplay = document.getElementById("usernameDisplay")
  const userProfileImg = document.getElementById("userProfileImg")
  const adminBtn = document.getElementById("adminBtn")

  if (appState.currentUser) {
    authButtons.classList.add("hidden")
    userProfile.classList.remove("hidden")

    let displayName = appState.currentUser.username

    // Adicionar badges
    if (appState.currentUser.verified) {
      displayName +=
        ' <img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" class="verified-badge" alt="Verified">'
    }

    if (appState.currentUser.isAdmin) {
      displayName = `<span class="admin-username">${appState.currentUser.username}</span> <img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" class="admin-badge" alt="Admin">`
      adminBtn.classList.remove("hidden")
      adminBtn.classList.add("admin-only")
      document.querySelectorAll(".admin-only").forEach((el) => (el.style.display = "inline-block"))
    }

    usernameDisplay.innerHTML = displayName
    userProfileImg.src = appState.currentUser.profileImage
  } else {
    authButtons.classList.remove("hidden")
    userProfile.classList.add("hidden")
    adminBtn.classList.add("hidden")
  }
}

// Sistema de notificações
function showNotification(message, type = "info") {
  const container = document.getElementById("notificationContainer")
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.textContent = message

  if (type === "error") {
    notification.style.borderLeftColor = "var(--danger)"
  } else if (type === "success") {
    notification.style.borderLeftColor = "var(--success)"
  }

  container.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 5000)
}

// Chat
function loadChat() {
  const messages = JSON.parse(localStorage.getItem("server_chat"))
  const chatMessages = document.getElementById("chatMessages")
  chatMessages.innerHTML = ""

  messages.forEach((msg) => {
    addMessageToUI(msg)
  })

  chatMessages.scrollTop = chatMessages.scrollHeight
}

function sendMessage(text) {
  if (!appState.currentUser) {
    showNotification("Você precisa estar logado para enviar mensagens!", "error")
    return
  }

  const config = JSON.parse(localStorage.getItem("server_config"))

  if (config.chatLocked && !appState.currentUser.isAdmin) {
    showNotification("O chat está trancado no momento!", "error")
    return
  }

  const now = Date.now()
  const timeSinceLastMessage = (now - appState.lastMessageTime) / 1000

  if (timeSinceLastMessage < config.chatCooldown && !appState.currentUser.isAdmin) {
    const remaining = Math.ceil(config.chatCooldown - timeSinceLastMessage)
    showNotification(`Aguarde ${remaining} segundos antes de enviar outra mensagem!`, "error")
    return
  }

  const message = {
    username: appState.currentUser.username,
    text,
    timestamp: new Date().toISOString(),
    profileImage: appState.currentUser.profileImage,
    verified: appState.currentUser.verified,
    isAdmin: appState.currentUser.isAdmin,
  }

  const messages = JSON.parse(localStorage.getItem("server_chat"))
  messages.push(message)
  localStorage.setItem("server_chat", JSON.stringify(messages))

  appState.lastMessageTime = now

  syncToAllTabs("chat_updated")

  // Log para admin
  if (appState.currentUser.verified) {
    console.log(`[VERIFIED MESSAGE] ${appState.currentUser.username}: ${text}`)
  }
}

function addMessageToUI(msg) {
  const chatMessages = document.getElementById("chatMessages")
  const messageDiv = document.createElement("div")
  messageDiv.className = "chat-message"

  const img = document.createElement("img")
  img.src = msg.profileImage
  img.alt = msg.username

  const contentDiv = document.createElement("div")
  contentDiv.className = "chat-message-content"

  const headerDiv = document.createElement("div")
  headerDiv.className = "chat-message-header"

  const username = document.createElement("span")
  username.className = "chat-username"
  if (msg.isAdmin) {
    username.classList.add("admin")
  }
  username.textContent = msg.username

  headerDiv.appendChild(username)

  if (msg.verified) {
    const verifiedBadge = document.createElement("img")
    verifiedBadge.src = "https://cdn-icons-png.flaticon.com/512/7641/7641727.png"
    verifiedBadge.className = "verified-badge"
    verifiedBadge.alt = "Verified"
    headerDiv.appendChild(verifiedBadge)
  }

  if (msg.isAdmin) {
    const adminBadge = document.createElement("img")
    adminBadge.src = "https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png"
    adminBadge.className = "admin-badge"
    adminBadge.alt = "Admin"
    headerDiv.appendChild(adminBadge)
  }

  const timestamp = document.createElement("span")
  timestamp.className = "chat-timestamp"
  timestamp.textContent = new Date(msg.timestamp).toLocaleTimeString()
  headerDiv.appendChild(timestamp)

  const textDiv = document.createElement("div")
  textDiv.textContent = msg.text

  contentDiv.appendChild(headerDiv)
  contentDiv.appendChild(textDiv)

  messageDiv.appendChild(img)
  messageDiv.appendChild(contentDiv)

  chatMessages.appendChild(messageDiv)
}

// Galeria
function loadGallery() {
  const gallery = JSON.parse(localStorage.getItem("server_gallery")) || []
  const galleryGrid = document.getElementById("galleryGrid")
  galleryGrid.innerHTML = ""

  gallery.forEach((item) => {
    const galleryItem = document.createElement("div")
    galleryItem.className = "gallery-item"

    const img = document.createElement("img")
    img.src = item.url
    img.alt = item.caption

    const caption = document.createElement("div")
    caption.className = "gallery-caption"
    caption.textContent = item.caption

    galleryItem.appendChild(img)
    galleryItem.appendChild(caption)
    galleryGrid.appendChild(galleryItem)
  })
}

// Posts
function loadPosts() {
  const posts = JSON.parse(localStorage.getItem("server_posts"))
  const postsContainer = document.getElementById("postsContainer")
  postsContainer.innerHTML = ""

  posts.reverse().forEach((post) => {
    const postCard = document.createElement("div")
    postCard.className = "post-card"

    const title = document.createElement("h3")
    title.textContent = post.title

    const content = document.createElement("p")
    content.textContent = post.content

    const meta = document.createElement("div")
    meta.className = "post-meta"
    meta.textContent = `Publicado em ${new Date(post.timestamp).toLocaleDateString()}`

    postCard.appendChild(title)
    postCard.appendChild(content)
    postCard.appendChild(meta)

    postsContainer.appendChild(postCard)
  })
}

// Painel Admin
function openAdminPanel() {
  if (!appState.currentUser || !appState.currentUser.isAdmin) {
    showNotification("Acesso negado!", "error")
    return
  }

  document.getElementById("adminPanel").classList.add("active")
  loadAdminUsers()
  loadAdminActiveUsers()
}

function loadAdminUsers() {
  const users = JSON.parse(localStorage.getItem("server_users"))
  const usersList = document.getElementById("usersList")
  usersList.innerHTML = ""

  Object.keys(users).forEach((username) => {
    const user = users[username]
    const userItem = document.createElement("div")
    userItem.className = "user-item"

    const img = document.createElement("img")
    img.src = user.profileImage

    const userInfo = document.createElement("div")
    userInfo.className = "user-info"

    const name = document.createElement("h4")
    name.textContent = username
    if (user.verified) {
      name.innerHTML += ' <img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" class="verified-badge">'
    }
    if (user.isAdmin) {
      name.innerHTML +=
        ' <img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" class="admin-badge">'
    }

    const info = document.createElement("p")
    info.textContent = `Email: ${user.email} | IP: ${user.ip}`

    userInfo.appendChild(name)
    userInfo.appendChild(info)

    const actions = document.createElement("div")
    actions.className = "user-actions"

    // Botão verificado
    const verifyBtn = document.createElement("button")
    verifyBtn.textContent = user.verified ? "✓ Verificado" : "Verificar"
    verifyBtn.style.background = user.verified ? "var(--success)" : "var(--verified-color)"
    verifyBtn.style.color = "white"
    verifyBtn.onclick = () => toggleUserVerified(username)
    actions.appendChild(verifyBtn)

    // Botão admin
    if (username !== "admin") {
      const adminBtn = document.createElement("button")
      adminBtn.textContent = user.isAdmin ? "Remover Admin" : "Tornar Admin"
      adminBtn.style.background = user.isAdmin ? "var(--danger)" : "var(--admin-color)"
      adminBtn.style.color = "white"
      adminBtn.onclick = () => toggleUserAdmin(username)
      actions.appendChild(adminBtn)
    }

    // Botão postar imagens
    const imageBtn = document.createElement("button")
    imageBtn.textContent = user.canPostImages ? "Bloquear Imagens" : "Permitir Imagens"
    imageBtn.style.background = user.canPostImages ? "var(--danger)" : "var(--success)"
    imageBtn.style.color = "white"
    imageBtn.onclick = () => toggleUserImagePermission(username)
    actions.appendChild(imageBtn)

    // Botão banir
    if (username !== "admin") {
      const banBtn = document.createElement("button")
      banBtn.textContent = "Banir IP"
      banBtn.style.background = "var(--danger)"
      banBtn.style.color = "white"
      banBtn.onclick = () => banUser(username)
      actions.appendChild(banBtn)
    }

    userItem.appendChild(img)
    userItem.appendChild(userInfo)
    userItem.appendChild(actions)

    usersList.appendChild(userItem)
  })
}

function loadAdminActiveUsers() {
  const activeUsers = JSON.parse(localStorage.getItem("server_active_users"))
  const users = JSON.parse(localStorage.getItem("server_users"))
  const activeUsersList = document.getElementById("activeUsersList")
  activeUsersList.innerHTML = ""

  Object.keys(activeUsers).forEach((username) => {
    const user = users[username]
    if (!user) return

    const userItem = document.createElement("div")
    userItem.className = "user-item"
    userItem.style.background = "var(--success)"
    userItem.style.color = "white"

    const img = document.createElement("img")
    img.src = user.profileImage

    const userInfo = document.createElement("div")
    userInfo.className = "user-info"

    const name = document.createElement("h4")
    name.textContent = username + " 🟢"
    name.style.color = "white"

    const info = document.createElement("p")
    info.textContent = `IP: ${activeUsers[username].ip}`
    info.style.color = "white"

    userInfo.appendChild(name)
    userInfo.appendChild(info)

    userItem.appendChild(img)
    userItem.appendChild(userInfo)

    activeUsersList.appendChild(userItem)
  })
}

function toggleUserVerified(username) {
  const users = JSON.parse(localStorage.getItem("server_users"))
  users[username].verified = !users[username].verified
  localStorage.setItem("server_users", JSON.stringify(users))
  syncToAllTabs("users_updated")
  loadAdminUsers()
  showNotification(`Status de verificação de ${username} atualizado!`, "success")
}

function toggleUserAdmin(username) {
  const users = JSON.parse(localStorage.getItem("server_users"))
  users[username].isAdmin = !users[username].isAdmin
  localStorage.setItem("server_users", JSON.stringify(users))
  syncToAllTabs("users_updated")
  loadAdminUsers()
  showNotification(`Permissões de admin de ${username} atualizadas!`, "success")
}

function toggleUserImagePermission(username) {
  const users = JSON.parse(localStorage.getItem("server_users"))
  users[username].canPostImages = !users[username].canPostImages
  localStorage.setItem("server_users", JSON.stringify(users))
  syncToAllTabs("users_updated")
  loadAdminUsers()
  showNotification(`Permissão de imagens de ${username} atualizada!`, "success")
}

function banUser(username) {
  if (!confirm(`Tem certeza que deseja banir ${username}?`)) return

  const users = JSON.parse(localStorage.getItem("server_users"))
  const user = users[username]

  sendWebhook(WEBHOOKS.suspended, {
    content: `🔨 **Usuário Banido**\nUsuário: ${username}\nIP: ${user.ip}\nEmail: ${user.email}`,
  })

  delete users[username]
  localStorage.setItem("server_users", JSON.stringify(users))

  // Remover dos ativos
  removeActiveUser(username)

  syncToAllTabs("users_updated")
  loadAdminUsers()
  showNotification(`${username} foi banido!`, "success")
}

// Sincronização entre abas
function syncToAllTabs(event) {
  localStorage.setItem("sync_event", JSON.stringify({ event, timestamp: Date.now() }))
}

function handleStorageChange(e) {
  if (e.key === "sync_event") {
    const { event } = JSON.parse(e.newValue)

    switch (event) {
      case "chat_updated":
        loadChat()
        break
      case "gallery_updated":
        loadGallery()
        break
      case "posts_updated":
        loadPosts()
        break
      case "users_updated":
        if (appState.currentUser) {
          const users = JSON.parse(localStorage.getItem("server_users"))
          appState.currentUser = { username: appState.currentUser.username, ...users[appState.currentUser.username] }
          updateUserInterface()
        }
        if (document.getElementById("adminPanel").classList.contains("active")) {
          loadAdminUsers()
        }
        break
      case "active_users_updated":
        if (document.getElementById("adminPanel").classList.contains("active")) {
          loadAdminActiveUsers()
        }
        break
      case "config_updated":
        const config = JSON.parse(localStorage.getItem("server_config"))
        updateChatLockUI(config.chatLocked)
        break
    }
  }
}

function updateChatLockUI(locked) {
  const chatLocked = document.getElementById("chatLocked")
  const chatContainer = document.getElementById("chatContainer")

  if (locked) {
    chatLocked.classList.remove("hidden")
    chatContainer.style.opacity = "0.5"
  } else {
    chatLocked.classList.add("hidden")
    chatContainer.style.opacity = "1"
  }
}

// Verificar modo manutenção
function checkMaintenanceMode() {
  const config = JSON.parse(localStorage.getItem("server_config"))
  const maintenanceMode = document.getElementById("maintenanceMode")

  if (config.maintenance && (!appState.currentUser || !appState.currentUser.isAdmin)) {
    maintenanceMode.classList.remove("hidden")
    return true
  } else {
    maintenanceMode.classList.add("hidden")
    return false
  }
}

// Atualizar configurações do chat
function updateChatConfig() {
  const config = JSON.parse(localStorage.getItem("server_config"))
  appState.chatCooldown = config.chatCooldown
  updateChatLockUI(config.chatLocked)
  const lockChatBtn = document.getElementById("lockChatBtn")
  if (lockChatBtn) {
    lockChatBtn.textContent = config.chatLocked ? "Destrancar Chat" : "Trancar Chat"
  }
  const chatCooldownInput = document.getElementById("chatCooldown")
  if (chatCooldownInput) {
    chatCooldownInput.value = config.chatCooldown
  }
}

// Limpar usuários inativos
function updateActiveUsersList() {
  cleanupInactiveUsers()
  const activeUsers = JSON.parse(localStorage.getItem("server_active_users"))
  const users = JSON.parse(localStorage.getItem("server_users"))
  const activeUsersList = document.getElementById("activeUsersList")
  if (activeUsersList) {
    activeUsersList.innerHTML = ""
    Object.keys(activeUsers).forEach((username) => {
      const user = users[username]
      if (!user) return
      const userItem = document.createElement("div")
      userItem.className = "user-item"
      userItem.style.background = "var(--success)"
      userItem.style.color = "white"
      const img = document.createElement("img")
      img.src = user.profileImage
      const userInfo = document.createElement("div")
      userInfo.className = "user-info"
      const name = document.createElement("h4")
      name.textContent = username + " 🟢"
      name.style.color = "white"
      const info = document.createElement("p")
      info.textContent = `IP: ${activeUsers[username].ip}`
      info.style.color = "white"
      userInfo.appendChild(name)
      userInfo.appendChild(info)
      userItem.appendChild(img)
      userItem.appendChild(userInfo)
      activeUsersList.appendChild(userItem)
    })
  }
}

// Inicializar aplicação
async function initApp() {
  initializeServer()
  await detectUserRegion()

  appState.currentLanguage = "en"
  document.documentElement.lang = "en"

  applyTheme()
  translatePage()

  // Verificar se usuário já está logado
  const savedUser = localStorage.getItem("current_user")
  if (savedUser) {
    const users = JSON.parse(localStorage.getItem("server_users"))
    const user = users[savedUser]
    if (user) {
      appState.currentUser = { username: savedUser, ...user }
      addActiveUser(savedUser)
    }
  }

  updateUserInterface()
  loadGallery()
  loadChat()
  loadPosts()

  // Atualizar usuários ativos a cada 30 segundos
  setInterval(() => {
    if (appState.currentUser) {
      addActiveUser(appState.currentUser.username)
    }
    cleanupInactiveUsers()
  }, 30000)

  // Sincronizar entre abas
  window.addEventListener("storage", handleStorageChange)
}

// Event Listeners
const authModal = document.getElementById("authModal")
const loginBtn = document.getElementById("loginBtn")
const registerBtn = document.getElementById("registerBtn")
const closeModalBtns = document.querySelectorAll(".close-modal")
const showRegisterLink = document.getElementById("showRegister")
const showLoginLink = document.getElementById("showLogin")

loginBtn.addEventListener("click", () => {
  authModal.classList.remove("hidden")
  document.getElementById("loginForm").classList.remove("hidden")
  document.getElementById("registerForm").classList.add("hidden")
})

registerBtn.addEventListener("click", () => {
  authModal.classList.remove("hidden")
  document.getElementById("loginForm").classList.add("hidden")
  document.getElementById("registerForm").classList.remove("hidden")
})

closeModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.closest(".modal").classList.add("hidden")
  })
})

showRegisterLink.addEventListener("click", (e) => {
  e.preventDefault()
  document.getElementById("loginForm").classList.add("hidden")
  document.getElementById("registerForm").classList.remove("hidden")
})

showLoginLink.addEventListener("click", (e) => {
  e.preventDefault()
  document.getElementById("registerForm").classList.add("hidden")
  document.getElementById("loginForm").classList.remove("hidden")
})

// Login form
document.getElementById("loginFormElement").addEventListener("submit", (e) => {
  e.preventDefault()
  const username = document.getElementById("loginUsername").value
  const password = document.getElementById("loginPassword").value

  if (login(username, password)) {
    document.getElementById("authModal").classList.add("hidden")
    e.target.reset()
  }
})

// Register form
document.getElementById("registerFormElement").addEventListener("submit", (e) => {
  e.preventDefault()
  const username = document.getElementById("registerUsername").value
  const email = document.getElementById("registerEmail").value
  const password = document.getElementById("registerPassword").value

  if (register(username, email, password)) {
    document.getElementById("registerForm").classList.add("hidden")
    document.getElementById("loginForm").classList.remove("hidden")
    e.target.reset()
  }
})

// Settings
document.getElementById("settingsBtn").addEventListener("click", () => {
  document.getElementById("settingsModal").classList.remove("hidden")
  document.getElementById("currentProfileImg").src = appState.currentUser.profileImage
  document.getElementById("languageSelector").value = appState.currentLanguage
})

document.getElementById("profileImageInput").addEventListener("change", (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      document.getElementById("currentProfileImg").src = event.target.result
      appState.currentUser.profileImage = event.target.result

      const users = JSON.parse(localStorage.getItem("server_users"))
      users[appState.currentUser.username].profileImage = event.target.result
      localStorage.setItem("server_users", JSON.stringify(users))
      syncToAllTabs("users_updated")

      updateUserInterface()
      showNotification("Foto de perfil atualizada!", "success")
    }
    reader.readAsDataURL(file)
  }
})

document.getElementById("updateUsername").addEventListener("click", () => {
  const newUsername = document.getElementById("changeUsername").value.trim()
  if (!newUsername) return

  const users = JSON.parse(localStorage.getItem("server_users"))

  if (users[newUsername]) {
    showNotification("Este username já está em uso!", "error")
    return
  }

  const oldUsername = appState.currentUser.username
  users[newUsername] = users[oldUsername]
  delete users[oldUsername]

  localStorage.setItem("server_users", JSON.stringify(users))
  localStorage.setItem("current_user", newUsername)

  appState.currentUser.username = newUsername

  syncToAllTabs("users_updated")
  updateUserInterface()
  showNotification("Username atualizado!", "success")
  document.getElementById("changeUsername").value = ""
})

document.getElementById("updatePassword").addEventListener("click", () => {
  const newPassword = document.getElementById("changePassword").value
  if (!newPassword) return

  const users = JSON.parse(localStorage.getItem("server_users"))
  users[appState.currentUser.username].password = newPassword
  localStorage.setItem("server_users", JSON.stringify(users))

  syncToAllTabs("users_updated")
  showNotification("Senha atualizada!", "success")
  document.getElementById("changePassword").value = ""
})

document.getElementById("languageSelector").addEventListener("change", (e) => {
  appState.currentLanguage = e.target.value
  localStorage.setItem("language", e.target.value) // Adicionado para salvar a preferência de idioma
  document.documentElement.lang = e.target.value
  translatePage()
  showNotification("Idioma alterado!", "success")
})

document.getElementById("logoutBtn").addEventListener("click", () => {
  logout()
  document.getElementById("settingsModal").classList.add("hidden")
})

// Chat
document.getElementById("chatForm").addEventListener("submit", (e) => {
  e.preventDefault()
  const input = document.getElementById("chatInput")
  const text = input.value.trim()

  if (text) {
    sendMessage(text)
    input.value = ""
  }
})

// Admin Panel
document.getElementById("adminBtn").addEventListener("click", () => {
  openAdminPanel()
})

document.getElementById("closeAdminPanel").addEventListener("click", () => {
  document.getElementById("adminPanel").classList.remove("active")
})

// Admin Tabs
document.querySelectorAll(".admin-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("active"))
    document.querySelectorAll(".admin-tab-content").forEach((c) => c.classList.remove("active"))

    tab.classList.add("active")
    const content = document.querySelector(`[data-content="${tab.dataset.tab}"]`)
    content.classList.add("active")
  })
})

// Admin Gallery
document.getElementById("addGalleryImage").addEventListener("click", () => {
  const url = document.getElementById("galleryImageUrl").value.trim()
  const caption = document.getElementById("galleryImageCaption").value.trim()

  if (!url) {
    showNotification("Insira uma URL válida!", "error")
    return
  }

  const gallery = JSON.parse(localStorage.getItem("server_gallery"))
  gallery.push({ url, caption })
  localStorage.setItem("server_gallery", JSON.stringify(gallery))

  syncToAllTabs("gallery_updated")
  loadGallery()

  document.getElementById("galleryImageUrl").value = ""
  document.getElementById("galleryImageCaption").value = ""

  showNotification("Imagem adicionada à galeria!", "success")
})

// Admin Posts
document.getElementById("createPost").addEventListener("click", () => {
  const title = document.getElementById("postTitle").value.trim()
  const content = document.getElementById("postContent").value.trim()

  if (!title || !content) {
    showNotification("Preencha todos os campos!", "error")
    return
  }

  const posts = JSON.parse(localStorage.getItem("server_posts"))
  posts.push({
    title,
    content,
    timestamp: new Date().toISOString(),
  })
  localStorage.setItem("server_posts", JSON.stringify(posts))

  syncToAllTabs("posts_updated")
  loadPosts()

  document.getElementById("postTitle").value = ""
  document.getElementById("postContent").value = ""

  showNotification("Postagem criada!", "success")
})

// Admin Settings
document.getElementById("updateCooldown").addEventListener("click", () => {
  const cooldown = Number.parseInt(document.getElementById("chatCooldown").value)
  const config = JSON.parse(localStorage.getItem("server_config"))
  config.chatCooldown = cooldown
  localStorage.setItem("server_config", JSON.stringify(config))
  syncToAllTabs("config_updated")
  showNotification("Cooldown atualizado!", "success")
})

document.getElementById("lockChatBtn").addEventListener("click", () => {
  const config = JSON.parse(localStorage.getItem("server_config"))
  config.chatLocked = !config.chatLocked
  localStorage.setItem("server_config", JSON.stringify(config))

  const btn = document.getElementById("lockChatBtn")
  btn.textContent = config.chatLocked ? "Destrancar Chat" : "Trancar Chat"

  syncToAllTabs("config_updated")
  updateChatLockUI(config.chatLocked)
  showNotification(config.chatLocked ? "Chat trancado!" : "Chat destrancado!", "success")
})

document.getElementById("clearChatBtn").addEventListener("click", () => {
  if (!confirm("Tem certeza que deseja limpar todas as mensagens?")) return

  localStorage.setItem("server_chat", JSON.stringify([]))
  syncToAllTabs("chat_updated")
  loadChat()
  showNotification("Chat limpo!", "success")
})

document.getElementById("shutdownSiteBtn").addEventListener("click", () => {
  const config = JSON.parse(localStorage.getItem("server_config"))
  config.maintenance = !config.maintenance
  localStorage.setItem("server_config", JSON.stringify(config))

  const btn = document.getElementById("shutdownSiteBtn")
  btn.textContent = config.maintenance ? "Sair da Manutenção" : "Modo Manutenção"

  showNotification(config.maintenance ? "Site em modo manutenção!" : "Site ativo!", "success")

  setTimeout(() => {
    window.location.reload()
  }, 1000)
})

// Maintenance Password
document.getElementById("maintenancePasswordForm").addEventListener("submit", (e) => {
  e.preventDefault()
  const password = document.getElementById("maintenancePassword").value
  const config = JSON.parse(localStorage.getItem("server_config"))

  if (password === config.maintenancePassword) {
    document.getElementById("maintenanceMode").classList.add("hidden")
    showNotification("Acesso liberado!", "success")
  } else {
    showNotification("Senha incorreta!", "error")
  }
})

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("light-mode")
  document.body.classList.add("dark-mode")

  initializeServer()
})
