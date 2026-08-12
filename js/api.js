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

/**
 * Endpoint: POST /auth/login
 * Description: Authenticates a user and returns a session token.
 * Expected payload: { email, password }
 */
async function login(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

/**
 * Endpoint: POST /auth/logout
 * Description: Ends the current user session on the server.
 * Expected payload/data: No body required; uses the current auth token from storage.
 */
async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch {
    // Proceed with local logout even if API call fails
  }
  clearToken();
  clearStoredUser();
}

/**
 * Endpoint: GET /user/profile
 * Description: Retrieves the authenticated user's profile information.
 * Expected payload/data: No body required.
 */
async function getCurrentUserProfile() {
  return apiRequest('/user/profile');
}

/**
 * Endpoint: PUT /auth/change-password
 * Description: Changes the authenticated user's password.
 * Expected payload: { current_password, new_password }
 */
async function changePassword(currentPassword, newPassword) {
  return apiRequest('/auth/change-password', {
    method: 'PUT',
    body: { current_password: currentPassword, new_password: newPassword },
  });
}

/* ============================================
   Dashboard Endpoints
   ============================================ */

/**
 * Endpoint: GET /dashboard/stats
 * Description: Retrieves dashboard summary statistics.
 * Expected payload/data: No body required.
 */
async function getDashboardStats() {
  return apiRequest('/dashboard/stats');
}

/**
 * Endpoint: GET /dashboard/recent-employees
 * Description: Fetches a list of recently added or updated employees for the dashboard.
 * Expected payload/data: No body required.
 */
async function getRecentEmployees() {
  return apiRequest('/dashboard/recent-employees');
}

/* ============================================
   Employee Endpoints
   ============================================ */

/**
 * Endpoint: GET /employees
 * Description: Retrieves a paginated or filtered list of employees.
 * Expected payload/data: Query parameters object such as { page, limit, search, departmentId }.
 */
async function getEmployees(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/employees`);
}

/**
 * Endpoint: GET /employees/:id
 * Description: Retrieves a single employee by ID.
 * Expected payload/data: No body required; pass the employee ID in the URL.
 */
async function getEmployee(id) {
  return apiRequest(`/getEmployeeById/${id}`);
}

/**
 * Endpoint: POST /employees
 * Description: Creates a new employee record.
 * Expected payload: Employee data object containing the required employee fields.
 */
async function createEmployee(data) {
  return apiRequest('/new/employee', {
    method: 'POST',
    body: data,
  });
}

/**
 * Endpoint: PUT /employees/:id
 * Description: Updates an existing employee record.
 * Expected payload: Employee update object with the fields to change.
 */
async function updateEmployee(id, data) {
  return apiRequest(`/update/employee/${id}`, {
    method: 'PUT',
    body: data,
  });
}

/**
 * Endpoint: DELETE /employees/:id
 * Description: Deletes an employee record by ID.
 * Expected payload/data: No body required; pass the employee ID in the URL.
 */
async function deleteEmployee(id) {
  return apiRequest(`/remove/employee/${id}`, {
    method: 'DELETE',
  });
}

/* ============================================
   Department Endpoints
   ============================================ */

/**
 * Endpoint: GET /departments
 * Description: Retrieves a list of departments.
 * Expected payload/data: Query parameters object such as { page, limit, search }.
 */
async function getDepartments(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/all/departments`);
}

/**
 * Endpoint: GET /departments/:id
 * Description: Retrieves a single department by ID.
 * Expected payload/data: No body required; pass the department ID in the URL.
 */
async function getDepartment(id) {
  return apiRequest(`/departments/${id}`);
}

/**
 * Endpoint: POST /departments
 * Description: Creates a new department.
 * Expected payload: Department data object containing the required department fields.
 */
async function createDepartment(data) {
  return apiRequest('/new/departments', {
    method: 'POST',
    body: data,
  });
}

/**
 * Endpoint: PUT /departments/:id
 * Description: Updates an existing department.
 * Expected payload: Department update object with the fields to change.
 */
async function updateDepartment(id, data) {
  return apiRequest(`/update/departments/${id}`, {
    method: 'PUT',
    body: data,
  });
}

/**
 * Endpoint: DELETE /departments/:id
 * Description: Deletes a department by ID.
 * Expected payload/data: No body required; pass the department ID in the URL.
 */
async function deleteDepartment(id) {
  return apiRequest(`/delete/departments/${id}`, {
    method: 'DELETE',
  });
}

/* ============================================
   Leave Management Endpoints
   ============================================ */

/**
 * Endpoint: GET /leave
 * Description: Retrieves leave requests.
 * Expected payload/data: Query parameters object such as { page, limit, status }.
 */
async function getLeaveRequests(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/getAllLeaves`);
}

/**
 * Endpoint: GET /leave/:id
 * Description: Retrieves a specific leave request by ID.
 * Expected payload/data: No body required; pass the leave ID in the URL.
 */
async function getLeaveRequest(id) {
  return apiRequest(`/leave/${id}`);
}

/**
 * Endpoint: POST /leave
 * Description: Submits a new leave request.
 * Expected payload: Leave request data object containing the leave details.
 */
async function applyLeave(data) {
  return apiRequest('/submit/leave', {
    method: 'POST',
    body: data,
  });
}

/**
 * Endpoint: PUT /leave/:id/approve
 * Description: Approves a leave request.
 * Expected payload/data: No body required; pass the leave ID in the URL.
 */
async function approveLeave(id) {
  return apiRequest(`/leave/${id}/approve`, {
    method: 'PUT',
  });
}

/**
 * Endpoint: PUT /leave/:id/reject
 * Description: Rejects a leave request.
 * Expected payload/data: No body required; pass the leave ID in the URL.
 */
async function rejectLeave(id) {
  return apiRequest(`/leave/${id}/reject`, {
    method: 'PUT',
  });
}

/**
 * Endpoint: DELETE /leave/:id
 * Description: Deletes a leave request by ID.
 * Expected payload/data: No body required; pass the leave ID in the URL.
 */
async function deleteLeave(id) {
  return apiRequest(`/leave/delete/${id}`, {
    method: 'DELETE',
  });
}

/* ============================================
   Profile Endpoints
   ============================================ */

/**
 * Endpoint: PUT /profile/update
 * Description: Updates the authenticated user's profile information.
 * Expected payload: Profile update object with the fields to change.
 */
async function updateProfile(data) {
  return apiRequest('/profile/update', {
    method: 'PUT',
    body: data,
  });
}
