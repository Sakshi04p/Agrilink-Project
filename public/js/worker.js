document.addEventListener('DOMContentLoaded', () => {

  // ── Tab switching ──
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  // ── Worker registration form ──
  const form      = document.getElementById('workerForm');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name      = document.getElementById('name').value.trim();
    const phone     = document.getElementById('phone').value.trim();
    const skill     = document.getElementById('skill').value;
    const location  = document.getElementById('location').value.trim();
    const available = document.getElementById('available').checked;

    if (!name || !phone || !skill || !location) {
      showToast('Please fill in all fields.', true);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering...';

    try {
      const res  = await fetch('/api/workers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, skill, location, available })
      });
      const data = await res.json();
      if (data.success) {
        showToast('✅ Registered successfully!');
        form.reset();
        document.getElementById('available').checked = true;
      } else {
        showToast(data.message || 'Something went wrong.', true);
      }
    } catch {
      showToast('❌ Could not connect to server.', true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '✅ Register as Worker';
    }
  });

  // ── Jobs Board: search state ──
  let jobFilters = { location: '', workType: '' };

  // Search button
  document.getElementById('jobSearchBtn').addEventListener('click', () => {
    jobFilters.location = document.getElementById('jobLocSearch').value.trim();
    jobFilters.workType = document.getElementById('jobTypeSearch').value.trim();
    loadJobs();
  });

  // Enter key triggers search
  ['jobLocSearch', 'jobTypeSearch'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('jobSearchBtn').click();
    });
  });

  // Clear filters
  document.getElementById('jobClearBtn').addEventListener('click', () => {
    jobFilters = { location: '', workType: '' };
    document.getElementById('jobLocSearch').value  = '';
    document.getElementById('jobTypeSearch').value = '';
    loadJobs();
  });

  // Initial load
  loadJobs();
});

// ── Fetch and render jobs ──
async function loadJobs() {
  const container = document.getElementById('jobList');
  container.innerHTML = loadingHTML();

  const filters = {
    location: document.getElementById('jobLocSearch').value.trim(),
    workType: document.getElementById('jobTypeSearch').value.trim()
  };

  try {
    const res  = await fetch('/api/jobs' + buildQuery(filters));
    const data = await res.json();

    // Result count
    document.getElementById('jobCount').textContent =
      data.success ? `${data.count} job${data.count !== 1 ? 's' : ''} found` : '';

    if (!data.success || data.data.length === 0) {
      container.innerHTML = emptyHTML('📋', 'No jobs found. Try clearing the search.');
      return;
    }

    container.innerHTML = data.data.map(j => `
      <div class="job-card">
        <div class="job-title">🌾 ${j.workType}</div>
        <div class="worker-info">
          <div class="info-item">📍 <span><strong>Location:</strong> ${j.location}</span></div>
          <div class="info-item">📅 <span style="font-size:.82rem;color:var(--text-muted)">${formatDate(j.createdAt)}</span></div>
        </div>
        <a href="tel:${j.phone}" class="btn-call">📞 Call Farmer: ${j.phone}</a>
      </div>
    `).join('');
  } catch {
    container.innerHTML = emptyHTML('❌', 'Failed to load jobs. Please try again.');
  }
}
