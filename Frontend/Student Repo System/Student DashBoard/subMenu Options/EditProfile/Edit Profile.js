const profilePicInput = document.getElementById('profile-pic');
const profilePreview = document.getElementById('profile-preview');

profilePicInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePreview.src = e.target.result;
      profilePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});
