const navbar = document.getElementById("navbar");
const toggle = document.getElementById("menuToggle");
const links = document.getElementById("navLinks");

function updateHeader() {
  navbar.classList.toggle("scrolled", window.scrollY > 30);
}

toggle.addEventListener("click", () => links.classList.toggle("open"));
links.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => links.classList.remove("open"));
});
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
