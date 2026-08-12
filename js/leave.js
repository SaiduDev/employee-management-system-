/**
 * Leave Management Page
 */

let allLeaveRequests = [];
let allEmployees = [];
let currentFilter = 'all';
let currentPage = 1;
const perPage = 10;

document.addEventListener('DOMContentLoaded', async () => {
  if (!initLayout('leave', 'Leave Management')) return;

  const pageContent = document.getElementById('pageContent');
  pageContent.innerHTML = `
    <div class="page-header">
      <h1>Leave Management</h1>
      <p>View, apply for, and manage employee leave requests.</p>
    </div>

    <div class="toolbar">
      <div class="filter-group" id="statusFilters">
        <button class="filter-btn active" data-status="all">All</button>
        <button class="filter-btn" data-status="pending">Pending</button>
        <button class="filter-btn" data-status="approved">Approved</button>
        <button class="filter-btn" data-status="rejected">Rejected</button>
      </div>
      <div class="toolbar-actions">
        <button class="btn btn-primary" id="applyLeaveBtn">
          Apply for Leave
        </button>
      </div>
    </div>

    <div class="card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="leaveTableBody">
            <tr><td colspan="6" class="empty-state">Loading...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="pagination" id="pagination"></div>`;

  setupModalClose('applyLeaveModal');

  document.getElementById('applyLeaveBtn').addEventListener('click', () => {
    document.getElementById('applyLeaveForm').reset();
    clearFormErrors(document.getElementById('applyLeaveForm'));
    openModal('applyLeaveModal');
  });

  document.getElementById('applyLeaveForm').addEventListener('submit', handleApplyLeave);

  document.getElementById('statusFilters').addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;
    document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.status;
    currentPage = 1;
    renderLeaveRequests();
  });

  await loadEmployees();
  await loadLeaveRequests();
});

async function loadEmployees() {
  try {
    const response = await getEmployees();
    allEmployees = response.data || response || [];
    const employeeSelect = document.getElementById('leaveEmployee');
    employeeSelect.innerHTML = '<option value="">Select Employee</option>';

    if (!allEmployees.length) {
      employeeSelect.innerHTML += '<option value="" disabled>No employees available</option>';
      return;
    }

    allEmployees.forEach((employee) => {
      const employeeName = escapeHtml(employee.full_name || employee.name || `${employee.first_name || ''} ${employee.last_name || ''}`.trim() || 'Unnamed');
      employeeSelect.innerHTML += `<option value="${escapeHtml(employee.id)}">${employeeName}</option>`;
    });
  } catch (error) {
    showNotification('Warning', 'Unable to load employee list. Leave requests can still be submitted with a name.', 'warning');
  }
}

async function loadLeaveRequests() {
  showLoading();
  try {
    const response = await getLeaveRequests();

    // Normalize different possible API response shapes into an array
    function normalizeResponseToArray(resp) {
      if (!resp) return [];
      if (Array.isArray(resp)) return resp;
      if (Array.isArray(resp.data)) return resp.data;
      if (Array.isArray(resp.items)) return resp.items;
      if (Array.isArray(resp.leaves)) return resp.leaves;

      // If response is an object, try to find the first array-valued property
      if (typeof resp === 'object') {
        for (const k of Object.keys(resp)) {
          if (Array.isArray(resp[k])) return resp[k];
        }
      }

      // Fallback: not an array
      console.warn('Unexpected shape for leave requests response, expected array-like but got:', resp);
      return [];
    }

    allLeaveRequests = normalizeResponseToArray(response);
    renderLeaveRequests();
  } catch (error) {
    allLeaveRequests = [];
    document.getElementById('leaveTableBody').innerHTML = `
      <tr><td colspan="6" class="empty-state">Failed to load leave requests: ${escapeHtml(error.message)}</td></tr>`;
    showNotification('Error', error.message, 'error');
  } finally {
    hideLoading();
  }
}

function getFilteredLeaveRequests() {
  if (currentFilter === 'all') return allLeaveRequests;
  return allLeaveRequests.filter(
    (req) => (req.status || '').toLowerCase() === currentFilter
  );
}

function formatLeaveType(type) {
  if (!type) return '-';
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderLeaveRequests() {
  const filtered = getFilteredLeaveRequests();
  const { items, currentPage: page, totalPages } = paginateArray(filtered, currentPage, perPage);
  currentPage = page;

  const tbody = document.getElementById('leaveTableBody');

  if (!items.length) {
    tbody.innerHTML = `
      <tr><td colspan="6">
        <div class="empty-state">
          <h3>No leave requests found</h3>
          <p>Apply for leave or adjust your filter.</p>
        </div>
      </td></tr>`;
    renderPagination(document.getElementById('pagination'), 1, 1, () => {});
    return;
  }

  tbody.innerHTML = items
    .map((req) => {
      const status = (req.status || 'pending').toLowerCase();
      const actions =
        status === 'pending'
          ? `
          <button class="btn btn-sm btn-success btn-approve" data-id="${req.id}" title="Approve">✅</button>
          <button class="btn btn-sm btn-danger btn-reject" data-id="${req.id}" title="Reject">❌</button>`
          : '<span class="text-muted">—</span>';

      return `
    <tr>
      <td>${escapeHtml(req.employee_name || req.employee?.full_name || req.employee?.name || '-')}</td>
      <td>${escapeHtml(formatLeaveType(req.leave_type || req.type))}</td>
      <td>${formatDate(req.start_date)}</td>
      <td>${formatDate(req.end_date)}</td>
      <td>${getStatusBadge(req.status)}</td>
      <td><div class="table-actions">${actions}</div></td>
    </tr>`;
    })
    .join('');

  tbody.querySelectorAll('.btn-approve').forEach((btn) => {
    btn.addEventListener('click', () => handleApproveLeave(btn.dataset.id));
  });
  tbody.querySelectorAll('.btn-reject').forEach((btn) => {
    btn.addEventListener('click', () => handleRejectLeave(btn.dataset.id));
  });

  renderPagination(document.getElementById('pagination'), currentPage, totalPages, (page) => {
    currentPage = page;
    renderLeaveRequests();
  });
}

async function handleApplyLeave(e) {
  e.preventDefault();
  const form = document.getElementById('applyLeaveForm');
  clearFormErrors(form);

  const employeeId = document.getElementById('leaveEmployee').value;
  const employeeName = document.getElementById('leaveEmployee').selectedOptions[0]?.text.trim() || '';
  const leaveType = document.getElementById('leaveType').value;
  const startDate = document.getElementById('leaveStartDate').value;
  const endDate = document.getElementById('leaveEndDate').value;
  const reason = document.getElementById('leaveReason').value.trim();

  let hasError = false;

  if (!employeeId) {
    setFieldError(document.getElementById('leaveEmployee'), 'Employee is required.');
    hasError = true;
  }

  if (!leaveType) {
    setFieldError(document.getElementById('leaveType'), 'Leave type is required.');
    hasError = true;
  }

  if (!startDate) {
    setFieldError(document.getElementById('leaveStartDate'), 'Start date is required.');
    hasError = true;
  }

  if (!endDate) {
    setFieldError(document.getElementById('leaveEndDate'), 'End date is required.');
    hasError = true;
  }

  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    setFieldError(document.getElementById('leaveEndDate'), 'End date must be after start date.');
    hasError = true;
  }

  if (hasError) return;

  const submitBtn = document.getElementById('submitLeaveBtn');
  submitBtn.disabled = true;
  showLoading();

  try {
    await applyLeave({
      employee_id: employeeId,
      employee_name: employeeName,
      leave_type: leaveType,
      start_date: startDate,
      end_date: endDate,
      reason,
    });
    showNotification('Success', 'Leave request submitted successfully.', 'success');
    closeModal('applyLeaveModal');
    await loadLeaveRequests();
  } catch (error) {
    showNotification('Error', error.message, 'error');
  } finally {
    hideLoading();
    submitBtn.disabled = false;
  }
}

async function handleApproveLeave(id) {
  showLoading();
  try {
    await approveLeave(id);
    showNotification('Success', 'Leave request approved.', 'success');
    await loadLeaveRequests();
  } catch (error) {
    showNotification('Error', error.message, 'error');
  } finally {
    hideLoading();
  }
}

async function handleRejectLeave(id) {
  showLoading();
  try {
    await rejectLeave(id);
    showNotification('Success', 'Leave request rejected.', 'success');
    await loadLeaveRequests();
  } catch (error) {
    showNotification('Error', error.message, 'error');
  } finally {
    hideLoading();
  }
}
