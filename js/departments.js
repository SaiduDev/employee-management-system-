/**
 * Departments Page
 */

let allDepartments = [];
let deleteTargetId = null;

document.addEventListener('DOMContentLoaded', async () => {
  if (!initLayout('departments', 'Departments')) return;

  const pageContent = document.getElementById('pageContent');
  pageContent.innerHTML = `
    <div class="page-header">
      <h1>Departments</h1>
      <p>Manage company departments and their details.</p>
    </div>

    <div class="toolbar">
      <div class="search-box">
        ${ICONS.search}
        <input type="text" id="searchInput" class="form-control" placeholder="Search departments...">
      </div>
      <div class="toolbar-actions">
        <button class="btn btn-primary" id="addDepartmentBtn">
          ${ICONS.plus} Add Department
        </button>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="departmentsTableBody">
            <tr><td colspan="3" class="empty-state">Loading...</td></tr>
          </tbody>
        </table>
      </div>
    </div>`;

  setupModalClose('departmentModal');
  setupModalClose('deleteDepartmentModal');

  document.getElementById('addDepartmentBtn').addEventListener('click', () => openDepartmentModal());
  document.getElementById('searchInput').addEventListener('input', debounce(renderDepartments, 300));
  document.getElementById('departmentForm').addEventListener('submit', handleSaveDepartment);
  document.getElementById('confirmDeleteDeptBtn').addEventListener('click', handleConfirmDelete);

  await loadDepartments();
});

async function loadDepartments() {
  showLoading();
  try {
    const response = await getDepartments();
    allDepartments = response.data || response || [];
    renderDepartments();
  } catch (error) {
    allDepartments = [];
    document.getElementById('departmentsTableBody').innerHTML = `
      <tr><td colspan="3" class="empty-state">Failed to load departments: ${escapeHtml(error.message)}</td></tr>`;
    showNotification('Error', error.message, 'error');
  } finally {
    hideLoading();
  }
}

function getFilteredDepartments() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!query) return allDepartments;

  return allDepartments.filter(
    (dept) =>
      (dept.name || '').toLowerCase().includes(query) ||
      (dept.description || '').toLowerCase().includes(query)
  );
}

function renderDepartments() {
  const filtered = getFilteredDepartments();
  const tbody = document.getElementById('departmentsTableBody');

  if (!filtered.length) {
    tbody.innerHTML = `
      <tr><td colspan="3">
        <div class="empty-state">
          <h3>No departments found</h3>
          <p>Add a new department or adjust your search.</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = filtered
    .map(
      (dept) => `
    <tr>
      <td><strong>${escapeHtml(dept.name)}</strong></td>
      <td>${escapeHtml(dept.description || '-')}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn-sm btn-secondary btn-edit" data-id="${dept.id}" title="Edit">${ICONS.edit}</button>
          <button class="btn btn-sm btn-danger btn-delete" data-id="${dept.id}" data-name="${escapeHtml(dept.name)}" title="Delete">${ICONS.trash}</button>
        </div>
      </td>
    </tr>`
    )
    .join('');

  tbody.querySelectorAll('.btn-edit').forEach((btn) => {
    btn.addEventListener('click', () => editDepartment(btn.dataset.id));
  });
  tbody.querySelectorAll('.btn-delete').forEach((btn) => {
    btn.addEventListener('click', () => confirmDeleteDepartment(btn.dataset.id, btn.dataset.name));
  });
}

function openDepartmentModal(department = null) {
  const form = document.getElementById('departmentForm');
  clearFormErrors(form);
  form.reset();
  document.getElementById('departmentId').value = '';

  if (department) {
    document.getElementById('departmentModalTitle').textContent = 'Edit Department';
    document.getElementById('departmentId').value = department.id;
    document.getElementById('deptName').value = department.name || '';
    document.getElementById('deptDescription').value = department.description || '';
  } else {
    document.getElementById('departmentModalTitle').textContent = 'Add Department';
  }

  openModal('departmentModal');
}

async function editDepartment(id) {
  showLoading();
  try {
    const response = await getDepartment(id);
    openDepartmentModal(response.data || response);
  } catch (error) {
    showNotification('Error', error.message, 'error');
  } finally {
    hideLoading();
  }
}

function confirmDeleteDepartment(id, name) {
  deleteTargetId = id;
  document.getElementById('deleteDepartmentName').textContent = name;
  openModal('deleteDepartmentModal');
}

async function handleConfirmDelete() {
  if (!deleteTargetId) return;

  showLoading();
  try {
    await deleteDepartment(deleteTargetId);
    showNotification('Success', 'Department deleted successfully.', 'success');
    closeModal('deleteDepartmentModal');
    deleteTargetId = null;
    await loadDepartments();
  } catch (error) {
    showNotification('Error', error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function handleSaveDepartment(e) {
  e.preventDefault();
  const form = document.getElementById('departmentForm');
  clearFormErrors(form);

  const id = document.getElementById('departmentId').value;
  const name = document.getElementById('deptName').value.trim();
  const description = document.getElementById('deptDescription').value.trim();

  const nameError = validateRequired(name, 'Department name');
  if (nameError) {
    setFieldError(document.getElementById('deptName'), nameError);
    return;
  }

  const data = { name, description };
  const saveBtn = document.getElementById('saveDepartmentBtn');
  saveBtn.disabled = true;
  showLoading();

  try {
    if (id) {
      await updateDepartment(id, data);
      showNotification('Success', 'Department updated successfully.', 'success');
    } else {
      await createDepartment(data);
      showNotification('Success', 'Department created successfully.', 'success');
    }
    closeModal('departmentModal');
    await loadDepartments();
  } catch (error) {
    showNotification('Error', error.message, 'error');
  } finally {
    hideLoading();
    saveBtn.disabled = false;
  }
}
