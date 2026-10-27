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