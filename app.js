var SUPABASE_URL = 'https://scfotrsaabcgxiyemmlg.supabase.co'
var SUPABASE_KEY = 'sb_publishable_oHLqCHsF2_3HdGKNRK-OkA_whE04ZHI'
var sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

var currentUser = null
var currentProfile = null

// Check auth — call this on every app page
function requireAuth(callback) {
  sb.auth.getSession().then(function(res) {
    if (!res.data.session) {
      window.location.href = 'login.html'
      return
    }
    currentUser = res.data.session.user
    sb.from('profiles').select('*').eq('id', currentUser.id).single()
      .then(function(res) {
        if (res.data) currentProfile = res.data
        if (callback) callback(currentUser, currentProfile)
      })
  })
}

// Logout - redirect to homepage
function logout() {
  sb.auth.signOut().then(function() {
    window.location.href = 'index.html'
  })
}

// Render the sidebar
function renderSidebar(activePage) {
  var pages = [
    {
      id: 'inbox',
      href: 'inbox.html',
      label: 'Inbox',
      icon: '<path d="M4 4h16v16H4z" stroke-width="2" fill="none"/><path d="M4 9h16" stroke-width="2"/>'
    },
    {
      id: 'properties',
      href: 'properties.html',
      label: 'Properties',
      icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke-width="2" fill="none"/>'
    },
    {
      id: 'settings',
      href: 'settings.html',
      label: 'Settings',
      icon: '<circle cx="12" cy="12" r="3" stroke-width="2" fill="none"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke-width="2" fill="none"/>'
    }
  ]

  var html = '<aside style="width:68px;min-height:100vh" class="bg-white border-r border-[#E2E8F0] flex flex-col items-center py-4 gap-1 shrink-0">'

  // Logo
  html += '<a href="inbox.html" class="flex items-center justify-center w-10 h-10 bg-[#5B4FE8] rounded-xl mb-4">'
  html += '<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2L3 8V17H8V12H12V17H17V8L10 2Z" fill="white" fill-opacity="0.95"/></svg>'
  html += '</a>'

  // Navigation items
  pages.forEach(function(p) {
    var active = activePage === p.id
    html += '<a href="' + p.href + '" title="' + p.label + '"'
    html += ' class="flex items-center justify-center w-10 h-10 rounded-xl transition-all mb-1 group relative'
    html += active ? ' bg-[#EEF0FF] text-[#5B4FE8]' : ' text-[#94A3B8] hover:bg-[#F5F6FA] hover:text-[#5B4FE8]'
    html += '">'
    html += '<svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none">' + p.icon + '</svg>'
    html += '</a>'
  })

  // Spacer + logout at bottom
  html += '<div class="flex-1"></div>'
  html += '<button onclick="logout()" title="Log out" class="flex items-center justify-center w-10 h-10 rounded-xl text-[#94A3B8] hover:bg-red-50 hover:text-red-500 transition">'
  html += '<svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" fill="none">'
  html += '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke-width="2"/>'
  html += '<polyline points="16 17 21 12 16 7" stroke-width="2"/>'
  html += '<line x1="21" y1="12" x2="9" y2="12" stroke-width="2"/>'
  html += '</svg>'
  html += '</button>'

  html += '</aside>'
  return html
}

// Format date nicely
function formatDate(dateStr) {
  if (!dateStr) return ''
  var d = new Date(dateStr)
  var now = new Date()
  var diff = now - d
  var mins = Math.floor(diff / 60000)
  var hours = Math.floor(diff / 3600000)
  var days = Math.floor(diff / 86400000)

  if (mins < 1) return 'Just now'
  if (mins < 60) return mins + 'm ago'
  if (hours < 24) return hours + 'h ago'
  if (days < 7) return days + 'd ago'
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// Status badge
function statusBadge(status) {
  var map = {
    new: 'bg-amber-100 text-amber-700',
    draft_ready: 'bg-[#EEF0FF] text-[#5B4FE8]',
    sent: 'bg-emerald-100 text-emerald-700',
    archived: 'bg-gray-100 text-gray-500',
    notification: 'bg-gray-100 text-gray-500',
  }

  var label = {
    new: 'New',
    draft_ready: 'Draft ready',
    sent: 'Sent',
    archived: 'Archived',
    notification: 'Info'
  }

  var cls = map[status] || 'bg-gray-100 text-gray-500'
  return '<span class="text-xs font-medium px-2 py-0.5 rounded-full ' + cls + '">' + (label[status] || status) + '</span>'
}

// ===== PWA FIX - Force full page navigation =====
// This ensures all navigation works properly in standalone mode on iOS
(function() {
  // Detect if running as standalone PWA (added to home screen)
  var isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
  
  if (isStandalone) {
    // Add a class to body for styling if needed
    document.documentElement.classList.add('pwa-standalone')
    
    // Intercept all link clicks to ensure they use full page navigation
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a')
      if (!link) return
      if (!link.href) return
      if (link.target === '_blank') return
      
      // Only intercept internal links
      var isInternal = link.href.indexOf(window.location.origin) === 0 || 
                       link.href.indexOf('/') === 0 ||
                       link.getAttribute('href') === 'inbox.html' ||
                       link.getAttribute('href') === 'properties.html' ||
                       link.getAttribute('href') === 'settings.html'
      
      if (isInternal) {
        e.preventDefault()
        var targetUrl = link.href
        window.location.href = targetUrl
      }
    })
  }
})()
