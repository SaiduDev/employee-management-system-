/**
 * API Module - All REST API requests for Employee Management System
 */

const API_BASE_URL = 'http://localhost:8080/api';

const TOKEN_KEY = 'ems_token';
const USER_KEY = 'ems_user';
const REMEMBER_KEY = 'ems_remember';

/**
 * Get stored JWT token
 */
function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

/**
 * Store JWT token securely
 */
function setToken(token, remember = false) {
  clearToken();
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REMEMBER_KEY, 'true');
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(REMEMBER_KEY);
  }
}

/**
 * Remove stored token
 */
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

/**
 * Get stored user data
 */
function getStoredUser() {
  const user = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

/**
 * Store user data
 */
function setStoredUser(user, remember = false) {
  const userStr = JSON.stringify(user);
  if (remember) {
    localStorage.setItem(USER_KEY, userStr);
  } else {
    sessionStorage.setItem(USER_KEY, userStr);
  }
}

/**
 * Clear stored user data
 */
function clearStoredUser() {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}

/**
 * Check if user chose remember me
 */
function isRemembered() {
  return localStorage.getItem(REMEMBER_KEY) === 'true';
}

/**
 * Core API request handler with JWT authentication
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  if (response.status === 401) {
    clearToken();
    clearStoredUser();
    if (!window.location.pathname.includes('login.html')) {
      window.location.href = 'login.html';
    }
    throw new Error('Session expired. Please log in again.');
  }

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message = data?.message || data?.detail || data?.error || `Request failed (${response.status})`;
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }

  return data;
}

/* ============================================
   Authentication Endpoints
   ============================================ */

async function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch {
    // Proceed with local logout even if API call fails
  }
  clearToken();
  clearStoredUser();
}

async function getCurrentUserProfile() {
  return apiRequest('/user/profile');
}

async function changePassword(currentPassword, newPassword) {
  return apiRequest('/auth/change-password', {
    method: 'PUT',
    body: { current_password: currentPassword, new_password: newPassword },
  });
}

/* ============================================
   Dashboard Endpoints
   ============================================ */

async function getDashboardStats() {
  return apiRequest('/dashboard/stats');
}

async function getRecentEmployees() {
  return apiRequest('/dashboard/recent-employees');
}

/* ============================================
   Employee Endpoints
   ============================================ */

async function getEmployees(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/employees${query ? `?${query}` : ''}`);
}

async function getEmployee(id) {
  return apiRequest(`/employees/${id}`);
}

async function createEmployee(data) {
  return apiRequest('/employees', {
    method: 'POST',
    body: data,
  });
}

async function updateEmployee(id, data) {
  return apiRequest(`/employees/${id}`, {
    method: 'PUT',
    body: data,
  });
}

async function deleteEmployee(id) {
  return apiRequest(`/employees/${id}`, {
    method: 'DELETE',
  });
}

/* ============================================
   Department Endpoints
   ============================================ */

async function getDepartments(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/departments${query ? `?${query}` : ''}`);
}

async function getDepartment(id) {
  return apiRequest(`/departments/${id}`);
}

async function createDepartment(data) {
  return apiRequest('/departments', {
    method: 'POST',
    body: data,
  });
}

async function updateDepartment(id, data) {
  return apiRequest(`/departments/${id}`, {
    method: 'PUT',
    body: data,
  });
}

async function deleteDepartment(id) {
  return apiRequest(`/departments/${id}`, {
    method: 'DELETE',
  });
}

/* ============================================
   Leave Management Endpoints
   ============================================ */

async function getLeaveRequests(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/leave${query ? `?${query}` : ''}`);
}

async function getLeaveRequest(id) {
  return apiRequest(`/leave/${id}`);
}

async function applyLeave(data) {
  return apiRequest('/leave', {
    method: 'POST',
    body: data,
  });
}

async function approveLeave(id) {
  return apiRequest(`/leave/${id}/approve`, {
    method: 'PUT',
  });
}

async function rejectLeave(id) {
  return apiRequest(`/leave/${id}/reject`, {
    method: 'PUT',
  });
}

async function deleteLeave(id) {
  return apiRequest(`/leave/${id}`, {
    method: 'DELETE',
  });
}

/* ============================================
   Profile Endpoints
   ============================================ */

async function updateProfile(data) {
  return apiRequest('/profile/update', {
    method: 'PUT',
    body: data,
  });
}
