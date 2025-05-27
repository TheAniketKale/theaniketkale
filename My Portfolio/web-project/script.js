// JavaScript for Dark Mode Toggle and Other Interactions
document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const toggleButton = document.getElementById("dark-mode-btn");

  // Check local storage for theme preference
  const currentTheme = localStorage.getItem("theme") || "dark";
  body.classList.add(currentTheme);
  updateButtonIcon(currentTheme);

  // Toggle theme
  toggleButton.addEventListener("click", () => {
    const newTheme = body.classList.contains("dark") ? "light" : "dark";
    body.classList.remove("dark", "light");
    body.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    updateButtonIcon(newTheme);
  });

  function updateButtonIcon(theme) {
    toggleButton.innerHTML = theme === "dark" 
      ? '<i class="fas fa-sun"></i>' 
      : '<i class="fas fa-moon"></i>';
  }

  // Smooth Scrolling
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = e.target.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      targetSection.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Animations on Scroll
  const sections = document.querySelectorAll('.section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
      }
    });
  }, {
    threshold: 0.5
  });

  sections.forEach(section => {
    observer.observe(section);
  });

  // Form Submission Handler (Mock)
  document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! I will get back to you soon.');
  });
});