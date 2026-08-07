/**
 * Auth & Shared UI Module
 */

const APP_VERSION = '1.0.0';

const NAV_SECTIONS = [
  {
    title: 'Main Menu',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: 'dashboard' },
      { id: 'employees', label: 'Employees', href: 'employees.html', icon: 'employees' },
      { id: 'departments', label: 'Departments', href: 'departments.html', icon: 'departments' },
      { id: 'leave', label: 'Leave Management', href: 'leave.html', icon: 'leave' },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'profile', label: 'My Profile', href: 'profile.html', icon: 'profile' },
      { id: 'settings', label: 'Settings', href: 'settings.html', icon: 'settings' },
    ],
  },
];

const ICONS = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  employees: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  departments: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  leave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
};

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
  return !!getToken();
}

/**
 * Protect private pages - redirect to login if not authenticated
 */
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

/**
 * Redirect authenticated users away from login page
 */
function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    window.location.href = 'dashboard.html';
    return true;
  }
  return false;
}

/**
 * Get current logged-in user
 */
function getCurrentUser() {
  return getStoredUser();
}

/**
 * Get user initials for avatar
 */
function getUserInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Handle logout
 */
async function handleLogout() {
  showLoading();
  try {
    await logout();
    showNotification('Success', 'You have been logged out.', 'success');
  } catch {
    clearToken();
    clearStoredUser();
  } finally {
    hideLoading();
    window.location.href = 'login.html';
  }
}

/**
 * Initialize theme from localStorage
 */
function initTheme() {
  const theme = localStorage.getItem('ems_theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  return theme;
}

/**
 * Toggle theme
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ems_theme', next);
  return next;
}

/**
 * Get current theme
 */
function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

/* ============================================
   UI Helpers
   ============================================ */

function createLoadingOverlay() {
  if (document.getElementById('loadingOverlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'loadingOverlay';
  overlay.className = 'loading-overlay';
  overlay.innerHTML = '<div class="spinner"></div>';
  document.body.appendChild(overlay);
}

function showLoading() {
  createLoadingOverlay();
  document.getElementById('loadingOverlay').classList.add('show');
}

function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.classList.remove('show');
}

function createToastContainer() {
  if (document.getElementById('toastContainer')) return;
  const container = document.createElement('div');
  container.id = 'toastContainer';
  container.className = 'toast-container';
  document.body.appendChild(container);
}

function showNotification(title, message, type = 'success') {
  createToastContainer();
  const container = document.getElementById('toastContainer');

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title">${escapeHtml(title)}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
    </div>
    <button class="toast-close" aria-label="Close">${ICONS.close}</button>
  `;

  toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ============================================
   Form Validation
   ============================================ */

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateRequired(value, fieldName) {
  if (!value || !String(value).trim()) {
    return `${fieldName} is required.`;
  }
  return null;
}

function validatePhone(phone) {
  if (!phone) return null;
  const regex = /^[\d\s\-+()]{7,20}$/;
  return regex.test(phone) ? null : 'Please enter a valid phone number.';
}

function validatePassword(password) {
  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters.';
  }
  return null;
}

function setFieldError(input, message) {
  input.classList.add('error');
  let errorEl = input.parentElement.querySelector('.form-error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    input.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

function clearFieldError(input) {
  input.classList.remove('error');
  const errorEl = input.parentElement.querySelector('.form-error');
  if (errorEl) errorEl.remove();
}

function clearFormErrors(form) {
  form.querySelectorAll('.form-control.error').forEach((input) => clearFieldError(input));
}

/* ============================================
   Layout Components
   ============================================ */

function renderSidebar(activePage) {
  const user = getCurrentUser();
  const name = user?.full_name || user?.name || 'User';
  const email = user?.email || '';

  const navSections = NAV_SECTIONS.map(
    (section) => `
    <div class="nav-section">
      <span class="nav-section-title">${section.title}</span>
      <ul class="nav-list">
        ${section.items
          .map(
            (item) => `
          <li class="nav-item">
            <a href="${item.href}" class="nav-link ${item.id === activePage ? 'active' : ''}" data-nav-link>
              <span class="nav-icon">${ICONS[item.icon]}</span>
              <span class="nav-label">${item.label}</span>
            </a>
          </li>`
          )
          .join('')}
      </ul>
    </div>`
  ).join('');

  return `
    <aside class="sidebar" id="sidebar" aria-label="Main navigation">
      <div class="sidebar-header">
        <div class="sidebar-brand-wrap">
          <div class="sidebar-logo">EM</div>
          <div>
            <span class="sidebar-brand">Employee MS</span>
            <span class="sidebar-tagline">Management System</span>
          </div>
        </div>
        <button class="sidebar-close" id="sidebarClose" aria-label="Close menu">
          ${ICONS.close}
        </button>
      </div>

      <div class="sidebar-user">
        <div class="sidebar-user-avatar">${getUserInitials(name)}</div>
        <div class="sidebar-user-info">
          <span class="sidebar-user-name">${escapeHtml(name)}</span>
          <span class="sidebar-user-email">${escapeHtml(email)}</span>
        </div>
      </div>

      <nav class="sidebar-nav">${navSections}</nav>

      <div class="sidebar-footer">
        <a href="#" class="nav-link nav-link-logout" id="sidebarLogout">
          <span class="nav-icon">${ICONS.logout}</span>
          <span class="nav-label">Logout</span>
        </a>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebarOverlay" aria-hidden="true"></div>`;
}

function renderTopbar(pageTitle) {
  const user = getCurrentUser();
  const name = user?.full_name || user?.name || 'User';

  return `
    <header class="topbar">
      <div class="topbar-left">
        <button class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-expanded="false" aria-controls="sidebar">
          <span class="burger-icon">
            <span class="burger-line"></span>
            <span class="burger-line"></span>
            <span class="burger-line"></span>
          </span>
        </button>
        <h1 class="topbar-title">${escapeHtml(pageTitle)}</h1>
      </div>
      <div class="topbar-right">
        <div class="user-info">
          <div class="user-avatar">${getUserInitials(name)}</div>
          <span class="user-name">${escapeHtml(name)}</span>
        </div>
      </div>
    </header>`;
}

function initLayout(activePage, pageTitle) {
  if (!requireAuth()) return false;

  initTheme();

  const layoutContainer = document.getElementById('appLayout');
  if (!layoutContainer) return false;

  layoutContainer.innerHTML = `
    ${renderSidebar(activePage)}
    <div class="main-content">
      ${renderTopbar(pageTitle)}
      <div class="page-content" id="pageContent"></div>
    </div>`;

  document.getElementById('sidebarLogout').addEventListener('click', (e) => {
    e.preventDefault();
    handleLogout();
  });

  initSidebarControls();

  return true;
}

/**
 * Sidebar open/close controls (mobile burger + click outside to hide)
 */
function initSidebarControls() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const menuToggle = document.getElementById('menuToggle');
  const sidebarClose = document.getElementById('sidebarClose');

  if (!sidebar || !overlay || !menuToggle) return;

  const isMobile = () => window.innerWidth <= 992;

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    overlay.setAttribute('aria-hidden', 'false');
    if (isMobile()) document.body.classList.add('sidebar-open');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('sidebar-open');
  }

  function toggleSidebar() {
    if (sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar();
  });

  sidebarClose?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeSidebar();
  });

  overlay.addEventListener('click', closeSidebar);

  sidebar.addEventListener('click', (e) => e.stopPropagation());

  sidebar.querySelectorAll('[data-nav-link]').forEach((link) => {
    link.addEventListener('click', () => {
      if (isMobile()) closeSidebar();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });

  window.addEventListener('resize', () => {
    if (!isMobile()) closeSidebar();
  });
}

/**
 * Modal helpers
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('show');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('show');
}

function setupModalClose(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.querySelector('.modal-close')?.addEventListener('click', () => closeModal(modalId));
  modal.querySelector('[data-dismiss="modal"]')?.addEventListener('click', () => closeModal(modalId));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modalId);
  });
}

/**
 * Format date for display
 */
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Get status badge HTML
 */
function getStatusBadge(status) {
  const statusMap = {
    active: 'success',
    inactive: 'error',
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    on_leave: 'warning',
  };
  const type = statusMap[status?.toLowerCase()] || 'info';
  const label = status ? status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Unknown';
  return `<span class="badge badge-${type}">${escapeHtml(label)}</span>`;
}

/**
 * Debounce utility
 */
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Paginate array client-side
 */
function paginateArray(array, page, perPage) {
  const total = array.length;
  const totalPages = Math.ceil(total / perPage) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;
  const items = array.slice(start, start + perPage);

  return { items, currentPage, totalPages, total, perPage };
}

/**
 * Render pagination controls
 */
function renderPagination(container, currentPage, totalPages, onPageChange) {
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = `
    <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">Prev</button>`;

  for (let i = 1; i <= totalPages; i++) {
    if (totalPages > 7 && Math.abs(i - currentPage) > 2 && i !== 1 && i !== totalPages) {
      if (i === 2 || i === totalPages - 1) html += '<span class="pagination-info">...</span>';
      continue;
    }
    html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }

  html += `
    <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">Next</button>
    <span class="pagination-info">Page ${currentPage} of ${totalPages}</span>`;

  container.innerHTML = html;

  container.querySelectorAll('.pagination-btn:not([disabled])').forEach((btn) => {
    btn.addEventListener('click', () => onPageChange(parseInt(btn.dataset.page, 10)));
  });
}
