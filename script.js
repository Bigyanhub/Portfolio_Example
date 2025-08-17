"use strict";

// Google Sheets form submission
// const scriptURL =
//   "https://script.google.com/macros/s/AKfycbx-TYYEME202eqBjm2hV8gMAr9s-9SgaLWaYEzHV37Tpbv6ByVOEysIDSj2yBzTksAu/exec";
// const form = document.forms["submit-to-google-sheet"];
// const msg = document.getElementById("msg");

// if (form) {
//   form.addEventListener("submit", function (e) {
//     e.preventDefault();

    // Show loading state
//     msg.innerHTML = "Sending message...";
//     msg.className = "loading";

//     fetch(scriptURL, {
//       method: "POST",
//       body: new FormData(form),
//     })
//       .then((response) => {
//         if (response.ok) {
//           msg.innerHTML = "Message sent successfully!";
//           msg.className = "success";
//           form.reset();
//         } else {
//           throw new Error("Network response was not ok");
//         }
//       })
//       .catch((error) => {
//         console.error("Error!", error);
//         msg.innerHTML = "Failed to send message. Please try again.";
//         msg.className = "error";
//       })
//       .finally(() => {
//         setTimeout(() => {
//           msg.innerHTML = "";
//           msg.className = "";
//         }, 5000);
//       });
//   });
// }


function sendMail(){
}
function sendMail(e) {
  // Prevent the form from submitting normally
  if (e && e.preventDefault) e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const msgEl = document.getElementById("msg");

  if (!name || !email || !message) {
    if (msgEl) {
      msgEl.textContent = "Please fill in all fields.";
      msgEl.className = "error";
    }
    return;
  }

  const params = { name, email, message };

  // NOTE: service ID and template ID must be strings. Replace these with your actual IDs.
  const serviceID = "service_rki9gx8";
  const templateID = "template_rv247wr";

  if (msgEl) {
    msgEl.textContent = "Sending message...";
    msgEl.className = "loading";
  }

  emailjs
    .send(serviceID, templateID, params)
    .then((response) => {
      if (msgEl) {
        msgEl.textContent = "Message sent successfully!";
        msgEl.className = "success";
      }
      // reset form
      const form = document.forms["submit-to-google-sheet"];
      if (form) form.reset();
    })
    .catch((error) => {
      console.error("EmailJS error:", error);
      if (msgEl) {
        msgEl.textContent = "Failed to send message. Please try again.";
        msgEl.className = "error";
      }
    })
    .finally(() => {
      setTimeout(() => {
        if (msgEl) {
          msgEl.textContent = "";
          msgEl.className = "";
        }
      }, 5000);
    });
}

// Tab functionality
const tabLinks = document.getElementsByClassName("tab-links");
const tabContents = document.getElementsByClassName("tab-contents");

function openTab(tabName) {
  // Remove active classes from all tabs
  Array.from(tabLinks).forEach((tabLink) => {
    tabLink.classList.remove("active-link");
    tabLink.setAttribute("aria-selected", "false");
  });

  Array.from(tabContents).forEach((tabContent) => {
    tabContent.classList.remove("active-tab");
  });

  // Add active class to clicked tab and corresponding content
  // Use the passed event (if any) to determine the clicked tab safely
  const evt = window.event || arguments[1];
  if (evt && evt.currentTarget) {
    evt.currentTarget.classList.add("active-link");
    evt.currentTarget.setAttribute("aria-selected", "true");
  } else {
    // fallback: find the button by tabName
    const btn = document.querySelector(`.tab-links[onclick*="${tabName}"]`);
    if (btn) {
      btn.classList.add("active-link");
      btn.setAttribute("aria-selected", "true");
    }
  }

  const targetTab = document.getElementById(tabName);
  if (targetTab) {
    targetTab.classList.add("active-tab");
  }
}

// Mobile menu functionality
const sideMenu = document.getElementById("sidemenu");

function openMenu() {
  if (sideMenu) {
    sideMenu.style.right = "0";
    sideMenu.setAttribute("aria-hidden", "false");
    // Focus trap for accessibility
    const firstMenuItem = sideMenu.querySelector("a");
    if (firstMenuItem) firstMenuItem.focus();
  }
}

function closeMenu() {
  if (sideMenu) {
    sideMenu.style.right = "-200px";
    sideMenu.setAttribute("aria-hidden", "true");
  }
}

// Close menu when clicking on menu links (mobile)
document.querySelectorAll("#sidemenu a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 600) {
      closeMenu();
    }
  });
});

// Close menu when pressing Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && sideMenu && sideMenu.style.right === "0px") {
    closeMenu();
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Form validation enhancement
const inputs = document.querySelectorAll("input[required], textarea[required]");
inputs.forEach((input) => {
  input.addEventListener("blur", function () {
    if (!this.validity.valid) {
      this.classList.add("invalid");
    } else {
      this.classList.remove("invalid");
    }
  });

  input.addEventListener("input", function () {
    if (this.classList.contains("invalid") && this.validity.valid) {
      this.classList.remove("invalid");
    }
  });
});

// Intersection Observer for animations (optional enhancement)
if ("IntersectionObserver" in window) {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe sections for animation
  document.querySelectorAll("section").forEach((section) => {
    observer.observe(section);
  });
}

// Performance: Debounce resize events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle window resize for menu state
const handleResize = debounce(() => {
  if (window.innerWidth > 600 && sideMenu) {
    sideMenu.style.right = "";
    sideMenu.removeAttribute("aria-hidden");
  }
}, 250);

window.addEventListener("resize", handleResize);

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  // Set initial ARIA states
  if (sideMenu && window.innerWidth <= 600) {
    sideMenu.setAttribute("aria-hidden", "true");
  }

  // Set initial tab states
  const activeTab = document.querySelector(".tab-links.active-link");
  if (activeTab) {
    activeTab.setAttribute("aria-selected", "true");
  }
});
