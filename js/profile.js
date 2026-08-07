/**
 * Profile Page
 */

document.addEventListener('DOMContentLoaded', async () => {
  if (!initLayout('profile', 'My Profile')) return;

  const pageContent = document.getElementById('pageContent');
  const user = getCurrentUser();
  const name = user?.full_name || user?.name || 'User';

  pageContent.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar profile-avatar-placeholder">
        ${getUserInitials(name)}
        <span style="font-size:0.65rem;margin-top:4px;">Photo</span>
      </div>
      <div>
        <h1>${escapeHtml(name)}</h1>
        <p>${escapeHtml(user?.email || '')}</p>
      </div>
    </div>

    <div class="profile-tabs">
      <button class="tab-btn active" data-tab="profileInfo">Profile Information</button>
      <button class="tab-btn" data-tab="changePassword">Change Password</button>
    </div>

    <div class="tab-content active" id="profileInfo">
      <div class="card">
        <div class="card-header">
          <h3>Edit Profile</h3>
        </div>
        <div class="card-body">
          <form id="profileForm">
            <div class="form-row">
              <div class="form-group">
                <label for="profileFullName">Full Name *</label>
                <input type="text" id="profileFullName" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="profileEmail">Email *</label>
                <input type="email" id="profileEmail" class="form-control" required>
              </div>
            </div>
            <div class="form-group">
              <label for="profilePhone">Phone Number</label>
              <input type="tel" id="profilePhone" class="form-control">
            </div>
            <button type="submit" class="btn btn-primary" id="saveProfileBtn">Save Changes</button>
          </form>
        </div>
      </div>
    </div>

    <div class="tab-content" id="changePassword">
      <div class="card">
        <div class="card-header">
          <h3>Change Password</h3>
        </div>
        <div class="card-body">
          <form id="passwordForm">
            <div class="form-group">
              <label for="currentPassword">Current Password *</label>
              <input type="password" id="currentPassword" class="form-control" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="newPassword">New Password *</label>
                <input type="password" id="newPassword" class="form-control" required>
              </div>
              <div class="form-group">
                <label for="confirmPassword">Confirm New Password *</label>
                <input type="password" id="confirmPassword" class="form-control" required>
              </div>
            </div>
            <button type="submit" class="btn btn-primary" id="changePasswordBtn">Update Password</button>
          </form>
        </div>
      </div>
    </div>`;

  setupTabs();
  await loadProfile();
  document.getElementById('profileForm').addEventListener('submit', handleSaveProfile);
  document.getElementById('passwordForm').addEventListener('submit', handleChangePassword);
});

function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });
}

async function loadProfile() {
  showLoading();
  try {
    const response = await getCurrentUserProfile();
    const profile = response.data || response;

    document.getElementById('profileFullName').value = profile.full_name || profile.name || '';
    document.getElementById('profileEmail').value = profile.email || '';
    document.getElementById('profilePhone').value = profile.phone || profile.phone_number || '';

    const remember = isRemembered();
    setStoredUser(profile, remember);
  } catch (error) {
    const user = getCurrentUser();
    if (user) {
      document.getElementById('profileFullName').value = user.full_name || user.name || '';
      document.getElementById('profileEmail').value = user.email || '';
      document.getElementById('profilePhone').value = user.phone || user.phone_number || '';
    }
    showNotification('Warning', 'Could not refresh profile from server.', 'warning');
  } finally {
    hideLoading();
  }
}

async function handleSaveProfile(e) {
  e.preventDefault();
  const form = document.getElementById('profileForm');
  clearFormErrors(form);

  const fullName = document.getElementById('profileFullName').value.trim();
  const email = document.getElementById('profileEmail').value.trim();
  const phone = document.getElementById('profilePhone').value.trim();

  let hasError = false;

  const nameError = validateRequired(fullName, 'Full name');
  if (nameError) { setFieldError(document.getElementById('profileFullName'), nameError); hasError = true; }

  const emailError = validateRequired(email, 'Email');
  if (emailError) { setFieldError(document.getElementById('profileEmail'), emailError); hasError = true; }
  else if (!validateEmail(email)) { setFieldError(document.getElementById('profileEmail'), 'Invalid email address.'); hasError = true; }

  const phoneError = validatePhone(phone);
  if (phoneError) { setFieldError(document.getElementById('profilePhone'), phoneError); hasError = true; }

  if (hasError) return;

  const saveBtn = document.getElementById('saveProfileBtn');
  saveBtn.disabled = true;
  showLoading();

  try {
    const response = await updateProfile({ full_name: fullName, email, phone });
    const updated = response.data || response;
    const remember = isRemembered();
    setStoredUser(updated, remember);
    showNotification('Success', 'Profile updated successfully.', 'success');
  } catch (error) {
    showNotification('Error', error.message, 'error');
  } finally {
    hideLoading();
    saveBtn.disabled = false;
  }
}

async function handleChangePassword(e) {
  e.preventDefault();
  const form = document.getElementById('passwordForm');
  clearFormErrors(form);

  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  let hasError = false;

  const currentError = validateRequired(currentPassword, 'Current password');
  if (currentError) { setFieldError(document.getElementById('currentPassword'), currentError); hasError = true; }

  const newError = validatePassword(newPassword);
  if (newError) { setFieldError(document.getElementById('newPassword'), newError); hasError = true; }

  if (newPassword !== confirmPassword) {
    setFieldError(document.getElementById('confirmPassword'), 'Passwords do not match.');
    hasError = true;
  }

  if (hasError) return;

  const changeBtn = document.getElementById('changePasswordBtn');
  changeBtn.disabled = true;
  showLoading();

  try {
    await changePassword(currentPassword, newPassword);
    showNotification('Success', 'Password changed successfully.', 'success');
    form.reset();
  } catch (error) {
    showNotification('Error', error.message, 'error');
  } finally {
    hideLoading();
    changeBtn.disabled = false;
  }
}
