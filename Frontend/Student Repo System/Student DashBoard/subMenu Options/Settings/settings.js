const darkModeToggle = document.getElementById('dark-mode-toggle');
const modeLabel = document.getElementById('mode-label');

// Load the user's preference from localStorage (if any)
const savedMode = localStorage.getItem('darkMode') === 'true';
if (savedMode) {
  document.body.classList.add('dark-mode');
  darkModeToggle.checked = true;
  modeLabel.textContent = 'Dark Mode';
} else {
  document.body.classList.remove('dark-mode');
  darkModeToggle.checked = false;
  modeLabel.textContent = 'Light Mode';
}

// Event listener to toggle dark mode
darkModeToggle.addEventListener('change', () => {
  const isDarkMode = darkModeToggle.checked;






  if (isDarkMode) {
    document.body.classList.add('dark-mode');
    modeLabel.textContent = 'Dark Mode';
  } else {
    document.body.classList.remove('dark-mode');
    modeLabel.textContent = 'Light Mode';
  }




  
  // Save the user's preference in localStorage
  localStorage.setItem('darkMode', isDarkMode.toString());
}
















);
