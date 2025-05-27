document.addEventListener("DOMContentLoaded", function () {
  console.log("JS loaded"); // Debug log

  // Fade-in animation for content boxes and text (not for section backgrounds)
  document.querySelectorAll(".fade-in").forEach((el) => {
    el.style.opacity = 0;
    el.style.animation = "fadeInSection 1s forwards";
    el.style.animationPlayState = "paused";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = "running";
            entry.target.style.opacity = 1;
            // Restore pointer events and transitions after fade-in
            entry.target.style.transition = "transform 0.3s, box-shadow 0.3s";
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
  });

  // Form Submission Handler (Mock)
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Thank you for reaching out! I will get back to you soon.");
      contactForm.reset();
    });
  }

  // Dark/Light mode toggle with localStorage
  const themeToggle = document.getElementById("theme-toggle");
  function setTheme(mode) {
    if (mode === "dark") {
      document.body.classList.add("dark-mode");
      // No text needed, handled by CSS
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      // No text needed, handled by CSS
      localStorage.setItem("theme", "light");
    }
  }
  // On load, set theme from localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      if (document.body.classList.contains("dark-mode")) {
        setTheme("light");
      } else {
        setTheme("dark");
      }
    });
  }

  // Show only the active section and center it
  function showSection(sectionId) {
    document.querySelectorAll(".section").forEach((sec) => {
      sec.classList.toggle("active", sec.id === sectionId);
    });
    document.querySelectorAll(".nav-links a").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === "#" + sectionId);
    });
    if (sectionId === 'home') animateHomeHighlights();
  }

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        showSection(targetId);
        window.location.hash = "#" + targetId;
      }
    });
  });

  function handleHashChange() {
    const sectionId = window.location.hash ? window.location.hash.substring(1) : "home";
    showSection(sectionId);
  }
  window.addEventListener("hashchange", handleHashChange);
  handleHashChange();

  // Fallback: if no section is active, activate home
  setTimeout(() => {
    if (!document.querySelector(".section.active")) {
      const home = document.getElementById("home");
      if (home) home.classList.add("active");
    }
  }, 100);

  // --- Highlight nav link based on visible section (on scroll) ---
  const sectionIds = [
    "home", "about", "resume", "experience", "education", "projects", "skills", "career", "contact"
  ];
  const sectionElements = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  let currentActiveId = null;

  function setActiveNavBySection(sectionId) {
    if (currentActiveId === sectionId) return;
    currentActiveId = sectionId;
    document.querySelectorAll(".nav-links a").forEach((a) => {
      if (a.getAttribute("href") === "#" + sectionId) {
        a.classList.add("active");
      } else {
        a.classList.remove("active");
      }
    });
  }

  // Intersection Observer to track which section is most visible
  const observer = new IntersectionObserver(
    (entries) => {
      // Find the entry with the largest intersection ratio
      let maxRatio = 0;
      let visibleSectionId = null;
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          visibleSectionId = entry.target.id;
        }
      });
      if (visibleSectionId) {
        setActiveNavBySection(visibleSectionId);
      }
    },
    {
      threshold: Array.from({length: 21}, (_, i) => i * 0.05), // 0, 0.05, ..., 1
      rootMargin: "-20% 0px -60% 0px" // triggers a bit before/after
    }
  );

  sectionElements.forEach(section => observer.observe(section));

  // Sidebar collapse/expand toggle
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('navbar-toggle');
  const expandBtn = document.getElementById('navbar-expand');

  function updateExpandBtn() {
    if (sidebar.classList.contains('collapsed')) {
      expandBtn.style.display = 'block';
    } else {
      expandBtn.style.display = 'none';
    }
  }

  toggleBtn.addEventListener('click', function () {
    sidebar.classList.toggle('collapsed');
    document.body.classList.toggle('collapsed-navbar');
    updateExpandBtn();
  });

  expandBtn.addEventListener('click', function () {
    sidebar.classList.remove('collapsed');
    document.body.classList.remove('collapsed-navbar');
    updateExpandBtn();
  });

  updateExpandBtn();

  function animateHomeHighlights() {
    const homeSection = document.getElementById('home');
    const highlights = homeSection ? homeSection.querySelectorAll('.home-highlights li') : [];
    highlights.forEach(li => {
      li.style.opacity = 0;
      li.style.animation = 'none';
      // force reflow to restart animation
      void li.offsetWidth;
      li.style.animation = '';
    });
    highlights.forEach((li, idx) => {
      li.style.animation = `fadeInUpLine 0.7s forwards`;
      li.style.animationDelay = `${0.2 + idx * 0.2}s`;
    });
  }

  // Call on page load and when home section is shown
  // On initial load, animate if home is active
  if (document.getElementById('home').classList.contains('active')) {
    animateHomeHighlights();
  }
});