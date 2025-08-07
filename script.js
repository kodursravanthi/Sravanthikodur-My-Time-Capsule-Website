const form = document.getElementById('memory-form');
const memoryList = document.getElementById('memory-list');
const filterCategory = document.getElementById('filter-category');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light-mode';
  body.className = savedTheme;
}

function toggleTheme() {
  const current = body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
  body.className = current;
  localStorage.setItem('theme', current);
}

function saveMemoryToStorage(memory) {
  const memories = JSON.parse(localStorage.getItem('memories') || '[]');
  memories.push(memory);
  localStorage.setItem('memories', JSON.stringify(memories));
}

function getMemoriesFromStorage() {
  return JSON.parse(localStorage.getItem('memories') || '[]');
}

function deleteMemory(index) {
  const memories = getMemoriesFromStorage();
  memories.splice(index, 1);
  localStorage.setItem('memories', JSON.stringify(memories));
  renderMemories();
}

function createMemoryCard(memory, index) {
  const card = document.createElement('div');
  const today = new Date().toISOString().split('T')[0];
  const isUnlocked = memory.unlockDate <= today;

  card.className = `memory-card ${isUnlocked ? 'unlocked' : 'locked'}`;

  card.innerHTML = `
    <h3>${memory.title}</h3>
    <p><strong>Category:</strong> ${memory.category}</p>
    <p><strong>Unlock Date:</strong> ${memory.unlockDate}</p>
    ${isUnlocked
      ? `<p>${memory.description}</p>`
      : `<p class="countdown">🔒 Locked - Unlocks in ${daysUntil(memory.unlockDate)} day(s)</p>`}
    <button class="delete-btn" data-index="${index}">Delete</button>
  `;

  return card;
}

function daysUntil(dateStr) {
  const future = new Date(dateStr);
  const today = new Date();
  const diff = future - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function renderMemories() {
  const memories = getMemoriesFromStorage();
  const selectedCategory = filterCategory.value;
  memoryList.innerHTML = '';

  memories
    .filter((mem, i) => selectedCategory === 'All' || mem.category === selectedCategory)
    .forEach((memory, i) => {
      const actualIndex = getMemoriesFromStorage().findIndex(m => JSON.stringify(m) === JSON.stringify(memory));
      const card = createMemoryCard(memory, actualIndex);
      memoryList.appendChild(card);
    });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'));
      deleteMemory(index);
    });
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const memory = {
    title: document.getElementById('title').value.trim(),
    description: document.getElementById('description').value.trim(),
    category: document.getElementById('category').value,
    unlockDate: document.getElementById('unlock-date').value,
  };
  saveMemoryToStorage(memory);
  form.reset();
  renderMemories();
});

filterCategory.addEventListener('change', renderMemories);
themeToggle.addEventListener('click', toggleTheme);

loadTheme();
renderMemories();