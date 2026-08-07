/**
 * Employees Page
 */

let allEmployees = [];
let departments = [];
let currentPage = 1;
const perPage = 10;
let deleteTargetId = null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!initLayout('employees', 'Employees')) return;

  const pageContent = document.getElementById('pageContent');
  pageContent.innerHTML = `
    <div class="page-header">
      <h1>Employees</h1>
      <p>Manage your organization's employee records.</p>
    </div>

    <div class="toolbar">
      <div class="search-box">
        ${ICONS.search}
        <input type="text" id="searchInput" class="form-control" placeholder="Search employees...">
      </div>
      <div class="toolbar-actions">
        <button class="btn btn-primary" id="addEmployeeBtn">
          ${ICONS.plus} Add Employee
        </button>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Position</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="employeesTableBody">
            <tr><td colspan="7" class="empty-state">Loading...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="pagination" id="pagination"></div>`;

  setupModals();
  setupEventListeners();
  await loadDepartments();
  await loadEmployees();
});

function setupModals() {
  setupModalClose('employeeModal');
  setupModalClose('viewEmployeeModal');
  setupModalClose('deleteEmployeeModal');
}

function setupEventListeners() {
  document.getElementById('addEmployeeBtn').addEventListener('click', () => openEmployeeModal());
  document.getElementById('searchInput').addEventListener('input', debounce(handleSearch, 300));
  document.getElementById('employeeForm').addEventListener('submit', handleSaveEmployee);
  document.getElementById('confirmDeleteBtn').addEventListener('click', handleConfirmDelete);
}

async function loadDepartments() {
  try {
    const response = await getDepartments();
    departments = response.data || response || [];
    populateDepartmentSelect();
  } catch {
    departments = [];
  }
}

function populateDepartmentSelect() {
  const select = document.getElementById('empDepartment');
  select.innerHTML = '<option value="">Select Department</option>';
  departments.forEach((dept) => {
    select.innerHTML += `<option value="${dept.id}">${escapeHtml(dept.name)}</option>`;
  });
}

async function loadEmployees() {
  showLoading();
  try {
    const response = await getEmployees();
    allEmployees = response.data || response || [];
    renderEmployees();
  } catch (error) {
    allEmployees = [];
    document.getElementById('employeesTableBody').innerHTML = `
      <tr><td colspan="7" class="empty-state">Failed to load employees: ${escapeHtml(error.message)}</td></tr>`;
    showNotification('Error', error.message, 'error');
  } finally {
    hideLoading();
  }
}

function handleSearch() {
  currentPage = 1;
  renderEmployees();
}

function getFilteredEmployees() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!query) return allEmployees;

  return allEmployees.filter(
    (emp) =>
      (emp.full_name || emp.name || '').toLowerCase().includes(query) ||
      (emp.email || '').toLowerCase().includes(query) ||
      (emp.department_name || emp.department || '').toLowerCase().includes(query) ||
      (emp.position || '').toLowerCase().includes(query)
  );
}

function renderEmployees() {
  const filtered = getFilteredEmployees();
  const { items, currentPage: page, totalPages } = paginateArray(filtered, currentPage, perPage);
  currentPage = page;

  const tbody = document.getElementById('employeesTableBody');

  if (!items.length) {
    tbody.innerHTML = `
      <tr><td colspan="7">
        <div class="empty-state">
          <h3>No employees found</h3>
          <p>Add a new employee or adjust your search.</p>
        </div>
      </td></tr>`;
    renderPagination(document.getElementById('pagination'), 1, 1, () => {});
    return;
  }

  tbody.innerHTML = items
    .map(
      (emp) => `
    <tr>
      <td>${escapeHtml(emp.full_name || emp.name || '-')}</td>
      <td>${escapeHtml(emp.email || '-')}</td>
      <td>${escapeHtml(emp.phone || '-')}</td>
      <td>${escapeHtml(emp.department_name || emp.department || '-')}</td>
      <td>${escapeHtml(emp.position || '-')}</td>
      <td>${getStatusBadge(emp.employment_status || emp.status)}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-secondary btn-view" data-id="${emp.id}" title="View">${ICONS.eye}</button>
          <button class="btn btn-sm btn-secondary btn-edit" data-id="${emp.id}" title="Edit">${ICONS.edit}</button>
          <button class="btn btn-sm btn-danger btn-delete" data-id="${emp.id}" data-name="${escapeHtml(emp.full_name || emp.name)}" title="Delete">${ICONS.trash}</button>
        </div>
      </td>
    </tr>`
    )
    .join('');

  tbody.querySelectorAll('.btn-view').forEach((btn) => {
    btn.addEventListener('click', () => viewEmployee(btn.dataset.id));
  });
  tbody.querySelectorAll('.btn-edit').forEach((btn) => {
    btn.addEventListener('click', () => editEmployee(btn.dataset.id));
  });
  tbody.querySelectorAll('.btn-delete').forEach((btn) => {
    btn.addEventListener('click', () => confirmDeleteEmployee(btn.dataset.id, btn.dataset.name));
  });

  renderPagination(document.getElementById('pagination'), currentPage, totalPages, (page) => {
    currentPage = page;
    renderEmployees();
  });
}

function openEmployeeModal(employee = null) {
  const form = document.getElementById('employeeForm');
  clearFormErrors(form);
  form.reset();
  document.getElementById('employeeId').value = '';

  if (employee) {
    document.getElementById('employeeModalTitle').textContent = 'Edit Employee';
    document.getElementById('employeeId').value = employee.id;
    document.getElementById('empFullName').value = employee.full_name || employee.name || '';
    document.getElementById('empEmail').value = employee.email || '';
    document.getElementById('empPhone').value = employee.phone || '';
    document.getElementById('empDepartment').value = employee.department_id || '';
    document.getElementById('empPosition').value = employee.position || '';
    document.getElementById('empStatus').value = employee.employment_status || employee.status || 'active';
  } else {
    document.getElementById('employeeModalTitle').textContent = 'Add Employee';
  }

  openModal('employeeModal');
}

async function editEmployee(id) {
  showLoading();
  try {
    const response = await getEmployee(id);
    const employee = response.data || response;
    openEmployeeModal(employee);
  } catch (error) {
    showNotification('Error', error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function viewEmployee(id) {
  showLoading();
  try {
    const response = await getEmployee(id);
    const emp = response.data || response;

    document.getElementById('employeeDetails').innerHTML = `
      <div class="detail-grid">
        <div class="detail-item"><label>Full Name</label><span>${escapeHtml(emp.full_name || emp.name || '-')}</span></div>
        <div class="detail-item"><label>Email</label><span>${escapeHtml(emp.email || '-')}</span></div>
        <div class="detail-item"><label>Phone</label><span>${escapeHtml(emp.phone || '-')}</span></div>
        <div class="detail-item"><label>Department</label><span>${escapeHtml(emp.department_name || emp.department || '-')}</span></div>
        <div class="detail-item"><label>Position</label><span>${escapeHtml(emp.position || '-')}</span></div>
        <div class="detail-item"><label>Status</label><span>${getStatusBadge(emp.employment_status || emp.status)}</span></div>
      </div>`;

    openModal('viewEmployeeModal');
  } catch (error) {
    showNotification('Error', error.message, 'error');
  } finally {
    hideLoading();
  }
}

function confirmDeleteEmployee(id, name) {
  deleteTargetId = id;
  document.getElementById('deleteEmployeeName').textContent = name;
  openModal('deleteEmployeeModal');
}

async function handleConfirmDelete() {
  if (!deleteTargetId) return;

  showLoading();
  try {
    await deleteEmployee(deleteTargetId);
    showNotification('Success', 'Employee deleted successfully.', 'success');
    closeModal('deleteEmployeeModal');
    deleteTargetId = null;
    await loadEmployees();
  } catch (error) {
    showNotification('Error', error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function handleSaveEmployee(e) {
  e.preventDefault();
  const form = document.getElementById('employeeForm');
  clearFormErrors(form);

  const id = document.getElementById('employeeId').value;
  const fullName = document.getElementById('empFullName').value.trim();
  const email = document.getElementById('empEmail').value.trim();
  const phone = document.getElementById('empPhone').value.trim();
  const departmentId = document.getElementById('empDepartment').value;
  const position = document.getElementById('empPosition').value.trim();
  const status = document.getElementById('empStatus').value;

  let hasError = false;

  const nameError = validateRequired(fullName, 'Full name');
  if (nameError) { setFieldError(document.getElementById('empFullName'), nameError); hasError = true; }

  const emailError = validateRequired(email, 'Email');
  if (emailError) { setFieldError(document.getElementById('empEmail'), emailError); hasError = true; }
  else if (!validateEmail(email)) { setFieldError(document.getElementById('empEmail'), 'Invalid email address.'); hasError = true; }

  const phoneError = validatePhone(phone);
  if (phoneError) { setFieldError(document.getElementById('empPhone'), phoneError); hasError = true; }

  if (!departmentId) { setFieldError(document.getElementById('empDepartment'), 'Department is required.'); hasError = true; }

  const posError = validateRequired(position, 'Position');
  if (posError) { setFieldError(document.getElementById('empPosition'), posError); hasError = true; }

  if (hasError) return;

  const data = {
    full_name: fullName,
    email,
    phone,
    department_id: departmentId,
    position,
    employment_status: status,
  };

  const saveBtn = document.getElementById('saveEmployeeBtn');
  saveBtn.disabled = true;
  showLoading();

  try {
    if (id) {
      await updateEmployee(id, data);
      showNotification('Success', 'Employee updated successfully.', 'success');
    } else {
      await createEmployee(data);
      showNotification('Success', 'Employee created successfully.', 'success');
    }
    closeModal('employeeModal');
    await loadEmployees();
  } catch (error) {
    showNotification('Error', error.message, 'error');
  } finally {
    hideLoading();
    saveBtn.disabled = false;
  }
}
