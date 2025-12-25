// Admin Panel JavaScript

function checkAdminAccess() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (!currentUser || !currentUser.isAdmin) {
    alert("Access denied. Admin only.")
    window.location.href = "index.html"
    return
  }
  document.getElementById("adminUserName").textContent = currentUser.username
  loadAdminDashboard()
}

function showAdminTab(tabName) {
  document.querySelectorAll(".admin-section").forEach((section) => {
    section.classList.remove("active")
  })
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.classList.remove("active")
  })
  document.getElementById(tabName).classList.add("active")
  event.target.classList.add("active")

  if (tabName === "users") loadUsersTable()
  if (tabName === "gallery") loadGalleryManager()
  if (tabName === "chat") loadChatLog()
  if (tabName === "dashboard") loadAdminDashboard()
}

function loadAdminDashboard() {
  const users = JSON.parse(localStorage.getItem("users")) || []
  const activeUsers = JSON.parse(localStorage.getItem("activeUsers")) || []

  document.getElementById("statTotalUsers").textContent = users.length
  document.getElementById("statActiveUsers").textContent = activeUsers.length
  document.getElementById("statVerifiedUsers").textContent = users.filter((u) => u.verified).length
  document.getElementById("statBannedUsers").textContent = users.filter((u) => u.banned).length

  const activeUsersList = document.getElementById("activeUsersList")
  activeUsersList.innerHTML = activeUsers
    .map((username) => {
      const user = users.find((u) => u.username === username)
      return `
            <div class="active-user">
                <div class="online-indicator"></div>
                <img src="${user?.avatar || "https://via.placeholder.com/40"}" class="user-avatar-small" alt="${username}">
                <span>${username}</span>
                ${user?.verified ? '<img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" class="badge-small">' : ""}
                ${user?.isAdmin ? '<img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" class="badge-small">' : ""}
            </div>
        `
    })
    .join("")
}

function loadUsersTable() {
  const users = JSON.parse(localStorage.getItem("users")) || []
  const tbody = document.getElementById("usersTableBody")

  tbody.innerHTML = users
    .map(
      (user) => `
        <tr>
            <td><img src="${user.avatar}" class="user-avatar-small" alt="${user.username}"></td>
            <td>
                ${user.username}
                ${user.verified ? '<img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" class="badge-small">' : ""}
                ${user.isAdmin ? '<img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" class="badge-small">' : ""}
            </td>
            <td>${user.email}</td>
            <td>${user.ip}</td>
            <td>${user.banned ? "🚫 Banned" : "✅ Active"}</td>
            <td>
                <button class="action-btn verify-btn" onclick="toggleVerification('${user.username}')">
                    ${user.verified ? "Unverify" : "Verify"}
                </button>
                <button class="action-btn ban-btn" onclick="toggleBan('${user.username}')">
                    ${user.banned ? "Unban" : "Ban"}
                </button>
                <button class="action-btn admin-btn" onclick="toggleAdmin('${user.username}')">
                    ${user.isAdmin ? "Remove Admin" : "Make Admin"}
                </button>
            </td>
        </tr>
    `,
    )
    .join("")
}

function filterUsers(searchTerm) {
  const users = JSON.parse(localStorage.getItem("users")) || []
  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const tbody = document.getElementById("usersTableBody")
  tbody.innerHTML = filtered
    .map(
      (user) => `
        <tr>
            <td><img src="${user.avatar}" class="user-avatar-small" alt="${user.username}"></td>
            <td>
                ${user.username}
                ${user.verified ? '<img src="https://cdn-icons-png.flaticon.com/512/7641/7641727.png" class="badge-small">' : ""}
                ${user.isAdmin ? '<img src="https://icons.veryicon.com/png/o/miscellaneous/yuanql/icon-admin.png" class="badge-small">' : ""}
            </td>
            <td>${user.email}</td>
            <td>${user.ip}</td>
            <td>${user.banned ? "🚫 Banned" : "✅ Active"}</td>
            <td>
                <button class="action-btn verify-btn" onclick="toggleVerification('${user.username}')">
                    ${user.verified ? "Unverify" : "Verify"}
                </button>
                <button class="action-btn ban-btn" onclick="toggleBan('${user.username}')">
                    ${user.banned ? "Unban" : "Ban"}
                </button>
                <button class="action-btn admin-btn" onclick="toggleAdmin('${user.username}')">
                    ${user.isAdmin ? "Remove Admin" : "Make Admin"}
                </button>
            </td>
        </tr>
    `,
    )
    .join("")
}

function toggleVerification(username) {
  const users = JSON.parse(localStorage.getItem("users")) || []
  const user = users.find((u) => u.username === username)
  if (user) {
    user.verified = !user.verified
    localStorage.setItem("users", JSON.stringify(users))
    loadUsersTable()
    showNotification(`${username} ${user.verified ? "verified" : "unverified"} successfully`)
  }
}

function toggleBan(username) {
  const users = JSON.parse(localStorage.getItem("users")) || []
  const user = users.find((u) => u.username === username)
  if (user) {
    user.banned = !user.banned
    localStorage.setItem("users", JSON.stringify(users))

    if (user.banned) {
      sendWebhook(
        "https://discord.com/api/webhooks/1453870994233233672/ECP6u8tLh4ui2t3HOagXinv9QkeAU8mUScKLKkiY47mFNejrQhGU9v3xRNaHI4UjeqfC",
        {
          content: `🚫 User Suspended: ${username} (IP: ${user.ip})`,
        },
      )
    }

    loadUsersTable()
    showNotification(`${username} ${user.banned ? "banned" : "unbanned"} successfully`)
  }
}

function toggleAdmin(username) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  if (username === currentUser.username) {
    showNotification("You cannot modify your own admin status")
    return
  }

  const users = JSON.parse(localStorage.getItem("users")) || []
  const user = users.find((u) => u.username === username)
  if (user) {
    user.isAdmin = !user.isAdmin
    localStorage.setItem("users", JSON.stringify(users))
    loadUsersTable()
    showNotification(`${username} ${user.isAdmin ? "granted" : "revoked"} admin access`)
  }
}

function createPost() {
  const content = document.getElementById("postContent").value.trim()
  if (!content) {
    showNotification("Please write something")
    return
  }

  const currentUser = JSON.parse(localStorage.getItem("currentUser"))
  const notification = {
    id: Date.now(),
    content: content,
    author: currentUser.username,
    timestamp: new Date().toISOString(),
  }

  const notifications = JSON.parse(localStorage.getItem("globalNotifications")) || []
  notifications.unshift(notification)
  localStorage.setItem("globalNotifications", JSON.stringify(notifications))

  document.getElementById("postContent").value = ""
  showNotification("Announcement published successfully!")
}

function loadGalleryManager() {
  const gallery = JSON.parse(localStorage.getItem("gallery")) || []
  const container = document.getElementById("galleryManager")

  container.innerHTML = gallery
    .map(
      (img, index) => `
        <div class="gallery-item">
            <img src="${img}" alt="Gallery image">
            <button class="gallery-item-delete" onclick="removeGalleryImage(${index})">Delete</button>
        </div>
    `,
    )
    .join("")
}

function addGalleryImage() {
  const url = document.getElementById("newGalleryImageUrl").value.trim()
  if (!url) {
    showNotification("Please enter an image URL")
    return
  }

  const gallery = JSON.parse(localStorage.getItem("gallery")) || []
  gallery.push(url)
  localStorage.setItem("gallery", JSON.stringify(gallery))

  document.getElementById("newGalleryImageUrl").value = ""
  loadGalleryManager()
  showNotification("Image added to gallery")
}

function removeGalleryImage(index) {
  const gallery = JSON.parse(localStorage.getItem("gallery")) || []
  gallery.splice(index, 1)
  localStorage.setItem("gallery", JSON.stringify(gallery))
  loadGalleryManager()
  showNotification("Image removed from gallery")
}

function updateChatCooldown() {
  const cooldown = Number.parseInt(document.getElementById("chatCooldown").value) || 0
  localStorage.setItem("chatCooldown", cooldown.toString())
  showNotification(`Chat cooldown set to ${cooldown} seconds`)
}

function clearAllChatMessages() {
  if (confirm("Are you sure you want to delete ALL chat messages? This cannot be undone.")) {
    localStorage.setItem("chatMessages", JSON.stringify([]))
    showNotification("All chat messages cleared")
    loadChatLog()
  }
}

function loadChatLog() {
  const messages = JSON.parse(localStorage.getItem("chatMessages")) || []
  const container = document.getElementById("chatLogAdmin")

  container.innerHTML =
    messages
      .slice(-50)
      .reverse()
      .map(
        (msg) => `
        <div class="log-entry">
            <div class="log-time">${new Date(msg.timestamp).toLocaleString()}</div>
            <strong>${msg.username}</strong>: ${msg.message}
        </div>
    `,
      )
      .join("") || "<p>No messages yet</p>"
}

function toggleMaintenance() {
  const password = document.getElementById("maintenancePasswordInput").value.trim()
  const currentStatus = localStorage.getItem("maintenanceMode") === "true"

  if (!currentStatus && !password) {
    showNotification("Please set a maintenance password")
    return
  }

  if (!currentStatus) {
    localStorage.setItem("maintenanceMode", "true")
    localStorage.setItem("maintenancePassword", password)
    document.getElementById("maintenanceStatus").textContent = "🔒 Site is in MAINTENANCE MODE"
    showNotification("Maintenance mode ENABLED")
  } else {
    localStorage.setItem("maintenanceMode", "false")
    document.getElementById("maintenanceStatus").textContent = "✅ Site is LIVE"
    showNotification("Maintenance mode DISABLED")
  }
}

function toggleUserImagePermission() {
  const username = document.getElementById("permissionUsername").value.trim()
  if (!username) {
    showNotification("Please enter a username")
    return
  }

  const users = JSON.parse(localStorage.getItem("users")) || []
  const user = users.find((u) => u.username === username)

  if (!user) {
    showNotification("User not found")
    return
  }

  user.canPostImages = !user.canPostImages
  localStorage.setItem("users", JSON.stringify(users))
  showNotification(`${username} ${user.canPostImages ? "can now" : "cannot"} post images`)
  document.getElementById("permissionUsername").value = ""
}

function exportData() {
  const data = {
    users: JSON.parse(localStorage.getItem("users")) || [],
    chatMessages: JSON.parse(localStorage.getItem("chatMessages")) || [],
    gallery: JSON.parse(localStorage.getItem("gallery")) || [],
    notifications: JSON.parse(localStorage.getItem("globalNotifications")) || [],
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `clara-stack-data-${Date.now()}.json`
  a.click()

  showNotification("Data exported successfully")
}

function showNotification(message) {
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.textContent = message
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s;
    `
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s"
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

function sendWebhook(url, data) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    })
    .then((json) => {
      console.log("Success:", json)
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  checkAdminAccess()

  // Update maintenance status display
  const maintenanceMode = localStorage.getItem("maintenanceMode") === "true"
  const statusEl = document.getElementById("maintenanceStatus")
  if (statusEl) {
    statusEl.textContent = maintenanceMode ? "🔒 Site is in MAINTENANCE MODE" : "✅ Site is LIVE"
  }
})
