document.querySelectorAll('.open-project').forEach(button => {
  button.addEventListener('click', () => {
    const detail = document.getElementById(button.dataset.target);
    const isOpen = detail.classList.contains('active');

    document.querySelectorAll('.project-detail').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.open-project').forEach(item => item.textContent = 'Open Project →');

    if (!isOpen) {
      detail.classList.add('active');
      button.textContent = 'Close Project ↑';
      setTimeout(() => detail.scrollIntoView({behavior:'smooth', block:'nearest'}), 50);
    }
  });
});

const conceptForm = document.getElementById('concept-form');
const saveStatus = document.getElementById('save-status');
const conceptKey = 'startups-business-888399-concept';

function loadConceptDraft() {
  const saved = localStorage.getItem(conceptKey);
  if (!saved || !conceptForm) return;
  const data = JSON.parse(saved);
  Object.entries(data).forEach(([key, value]) => {
    if (conceptForm.elements[key]) conceptForm.elements[key].value = value;
  });
  saveStatus.textContent = 'Draft loaded';
}

if (conceptForm) {
  loadConceptDraft();

  conceptForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(conceptForm).entries());
    localStorage.setItem(conceptKey, JSON.stringify(data));
    saveStatus.textContent = 'Saved on this device';
  });

  document.getElementById('clear-concept').addEventListener('click', () => {
    if (!confirm('Clear this 888399 draft from this device?')) return;
    localStorage.removeItem(conceptKey);
    conceptForm.reset();
    saveStatus.textContent = 'Draft cleared';
  });
}