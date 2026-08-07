/**
 * Dashboard Page
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (!initLayout('dashboard', 'Dashboard')) return;

  const pageContent = document.getElementById('pageContent');
  const user = getCurrentUser();
  const userName = user?.full_name || user?.name || 'User';
  const greeting = getGreeting();

  pageContent.innerHTML = `
    <div class="welcome-banner">
      <h2>${greeting}, ${escapeHtml(userName)}!</h2>
      <p>Here's an overview of your employee management system.</p>
    </div>

    <div class="stats-grid" id="statsGrid">
      <div class="stat-card"><div class="spinner"></div></div>
      <div class="stat-card"><div class="spinner"></div></div>
      <div class="stat-card"><div class="spinner"></div></div>
      <div class="stat-card"><div class="spinner"></div></div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <h3>Recent Employees</h3>
        </div>
        <div class="card-body" id="recentEmployees">
          <div class="empty-state"><div class="spinner"></div></div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>Quick Actions</h3>
        </div>
        <div class="card-body">
          <div class="quick-actions">
            <a href="employees.html" class="quick-action-btn">
              ${ICONS.plus}
              Add Employee
            </a>
            <a href="departments.html" class="quick-action-btn">
              ${ICONS.departments}
              Add Department
            </a>
            <a href="leave.html" class="quick-action-btn">
              ${ICONS.leave}
              Apply Leave
            </a>
            <a href="profile.html" class="quick-action-btn">
              ${ICONS.profile}
              My Profile
            </a>
          </div>
        </div>
      </div>
    </div>`;

  await loadDashboardData();
});

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

async function loadDashboardData() {
  showLoading();
  try {
    const [stats, recent] = await Promise.all([
      getDashboardStats(),
      getRecentEmployees().catch(() => ({ data: [] })),
    ]);

    renderStats(stats);
    renderRecentEmployees(recent.data || recent || []);
  } catch (error) {
    renderStats({
      total_employees: 0,
      total_departments: 0,
      employees_on_leave: 0,
      new_employees: 0,
    });
    document.getElementById('recentEmployees').innerHTML = `
      <div class="empty-state">
        <p>Unable to load dashboard data. ${escapeHtml(error.message)}</p>
      </div>`;
    showNotification('Error', error.message, 'error');
  } finally {
    hideLoading();
  }
}

function renderStats(stats) {
  const data = stats.data || stats;
  const cards = [
    {
      label: 'Total Employees',
      value: data.total_employees ?? 0,
      icon: 'employees',
      iconSvg: ICONS.employees,
    },
    {
      label: 'Total Departments',
      value: data.total_departments ?? 0,
      icon: 'departments',
      iconSvg: ICONS.departments,
    },
    {
      label: 'Employees on Leave',
      value: data.employees_on_leave ?? 0,
      icon: 'leave',
      iconSvg: ICONS.leave,
    },
    {
      label: 'New Employees',
      value: data.new_employees ?? 0,
      icon: 'new-hires',
      iconSvg: ICONS.plus,
    },
  ];

  document.getElementById('statsGrid').innerHTML = cards
    .map(
      (card) => `
    <div class="stat-card">
      <div class="stat-icon ${card.icon}">${card.iconSvg}</div>
      <div class="stat-content">
        <div class="stat-label">${card.label}</div>
        <div class="stat-value">${card.value}</div>
      </div>
    </div>`
    )
    .join('');
}

function renderRecentEmployees(employees) {
  const container = document.getElementById('recentEmployees');

  if (!employees.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No recent employees</h3>
        <p>New employees will appear here.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <ul class="recent-list">
      ${employees
        .slice(0, 5)
        .map(
          (emp) => `
        <li class="recent-item">
          <div class="recent-avatar">${getUserInitials(emp.full_name || emp.name)}</div>
          <div class="recent-info">
            <h4>${escapeHtml(emp.full_name || emp.name || 'Unknown')}</h4>
            <p>${escapeHtml(emp.position || emp.department || 'Employee')}</p>
          </div>
          <span class="recent-meta">${formatDate(emp.created_at || emp.hire_date)}</span>
        </li>`
        )
        .join('')}
    </ul>`;
}
