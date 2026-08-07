/**
 * Settings Page
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!initLayout('settings', 'Settings')) return;

  const pageContent = document.getElementById('pageContent');
  const currentTheme = getTheme();

  pageContent.innerHTML = `
    <div class="page-header">
      <h1>Settings</h1>
      <p>Manage your application preferences.</p>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="settings-section">
          <h3>Appearance</h3>
          <div class="setting-item">
            <div class="setting-info">
              <h4>Dark Mode</h4>
              <p>Switch between light and dark theme</p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="themeToggle" ${currentTheme === 'dark' ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div class="settings-section">
          <h3>Account</h3>
          <div class="setting-item">
            <div class="setting-info">
              <h4>Logout</h4>
              <p>Sign out of your account on this device</p>
            </div>
            <button class="btn btn-danger" id="logoutBtn">${ICONS.logout} Logout</button>
          </div>
        </div>

        <div class="settings-section">
          <h3>About System</h3>
          <div class="about-info">
            <p><strong>Application:</strong> Employee Management System</p>
            <p><strong>Version:</strong> ${APP_VERSION}</p>
            <p><strong>Description:</strong> A modern employee management platform for managing employees, departments, leave requests, and user profiles.</p>
            <p><strong>Built with:</strong> HTML, CSS, Vanilla JavaScript</p>
          </div>
        </div>
      </div>
    </div>`;

  document.getElementById('themeToggle').addEventListener('change', (e) => {
    toggleTheme();
    showNotification(
      'Theme Updated',
      `Switched to ${e.target.checked ? 'dark' : 'light'} mode.`,
      'success'
    );
  });

  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});
