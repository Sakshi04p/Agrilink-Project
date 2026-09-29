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

  // ── Availability filter chips ──
  // availFilter: '' = all, 'true' = available only, 'false' = unavailable only
  let availFilter = '';

  document.querySelectorAll('.avail-filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.avail-filter-chip').forEach(c => {
        c.classList.remove('active-chip', 'active-chip-amber', 'active-chip-muted');
      });
      availFilter = chip.dataset.avail;
      // Apply colour based on value
      if (availFilter === 'true')  chip.classList.add('active-chip');
      else if (availFilter === '') chip.classList.add('active-chip');
      else                         chip.classList.add('active-chip-muted');
      loadWorkers();
    });
  });
  // Activate "All" chip initially
  document.querySelector('.avail-filter-chip[data-avail=""]').classList.add('active-chip');

  // ── Search button ──
  document.getElementById('workerSearchBtn').addEventListener('click', loadWorkers);

  // Enter key triggers search
  ['workerLocSearch', 'workerSkillSearch'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') loadWorkers();
    });
  });

  // Clear filters
  document.getElementById('workerClearBtn').addEventListener('click', () => {
    document.getElementById('workerLocSearch').value   = '';
    document.getElementById('workerSkillSearch').value = '';
    availFilter = '';
    document.querySelectorAll('.avail-filter-chip').forEach(c => {
      c.classList.remove('active-chip', 'active-chip-amber', 'active-chip-muted');
    });
    document.querySelector('.avail-filter-chip[data-avail=""]').classList.add('active-chip');
    loadWorkers();
  });

  // ── Post Job form ──
  const jobForm = document.getElementById('jobForm');
  const postBtn = document.getElementById('postBtn');

  jobForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const workType = document.getElementById('workType').value.trim();
    const location = document.getElementById('jobLocation').value.trim();
    const phone    = document.getElementById('jobPhone').value.trim();

    if (!workType || !location || !phone) {
      showToast('Please fill in all fields.', true);
      return;
    }

    postBtn.disabled = true;
    postBtn.textContent = 'Posting...';

    try {
      const res  = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workType, location, phone })
      });
      const data = await res.json();
      if (data.success) {
        showToast('✅ Job posted! Workers can now see it.');
        jobForm.reset();
      } else {
        showToast(data.message || 'Something went wrong.', true);
      }
    } catch {
      showToast('❌ Could not connect to server.', true);
    } finally {
      postBtn.disabled = false;
      postBtn.textContent = '📢 Post Job';
    }
  });

  // Initial load
  loadWorkers();
});

// ── Fetch and render workers with current filters ──
async function loadWorkers() {
  const container = document.getElementById('workerList');
  container.innerHTML = loadingHTML();

  const filters = {
    location:  document.getElementById('workerLocSearch').value.trim(),
    skill:     document.getElementById('workerSkillSearch').value.trim(),
    available: document.querySelector('.avail-filter-chip.active-chip, .avail-filter-chip.active-chip-muted')?.dataset.avail ?? ''
  };

  try {
    const res  = await fetch('/api/workers' + buildQuery(filters));
    const data = await res.json();

    document.getElementById('workerCount').textContent =
      data.success ? `${data.count} worker${data.count !== 1 ? 's' : ''} found` : '';

    if (!data.success || data.data.length === 0) {
      container.innerHTML = emptyHTML('👷', 'No workers found. Try different filters.');
      return;
    }

    container.innerHTML = data.data.map(w => `
      <div class="worker-card ${w.available ? '' : 'unavailable'}">
        <div class="worker-name">
          👤 ${w.name}
          <span class="avail-badge ${w.available ? 'yes' : 'no'}">
            ${w.available ? '✅ Available' : '🔴 Unavailable'}
          </span>
        </div>
        <div class="worker-info">
          <div class="info-item">🔧 <span><strong>Skill:</strong> ${w.skill}</span></div>
          <div class="info-item">📍 <span><strong>Location:</strong> ${w.location}</span></div>
        </div>
        <div class="info-item" style="margin-top:4px">
          📅 <span style="font-size:.82rem;color:var(--text-muted)">Joined: ${formatDate(w.createdAt)}</span>
        </div>
        <a href="tel:${w.phone}" class="btn-call">📞 Call ${w.phone}</a>
      </div>
    `).join('');
  } catch {
    container.innerHTML = emptyHTML('❌', 'Failed to load workers. Please try again.');
  }
}
