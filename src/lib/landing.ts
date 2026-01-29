export function initLandingInteractions() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  const reveal = () => {
    const reveals = document.querySelectorAll<HTMLElement>(".reveal");
    for (let i = 0; i < reveals.length; i += 1) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const elementVisible = 80;
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      }
    }
  };

  window.addEventListener("scroll", reveal);
  reveal();

  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("mobile-menu-overlay");
  const closeBtn = document.getElementById("mobile-menu-close");

  if (!menuBtn || !mobileMenu || !overlay) {
    return () => {
      window.removeEventListener("scroll", reveal);
    };
  }

  const setMenuOpen = (isOpen: boolean) => {
    overlay.classList.toggle("hidden", !isOpen);
    mobileMenu.classList.toggle("-translate-x-full", !isOpen);
    menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.classList.toggle("overflow-hidden", isOpen);
  };

  const onMenuToggle = () => {
    setMenuOpen(mobileMenu.classList.contains("-translate-x-full"));
  };

  const onMenuClose = () => {
    setMenuOpen(false);
  };

  menuBtn.addEventListener("click", onMenuToggle);
  overlay.addEventListener("click", onMenuClose);

  if (closeBtn) {
    closeBtn.addEventListener("click", onMenuClose);
  }

  const mobileLinks = mobileMenu.querySelectorAll<HTMLAnchorElement>("a");
  for (let i = 0; i < mobileLinks.length; i += 1) {
    mobileLinks[i].addEventListener("click", onMenuClose);
  }

  return () => {
    window.removeEventListener("scroll", reveal);
    menuBtn.removeEventListener("click", onMenuToggle);
    overlay.removeEventListener("click", onMenuClose);
    if (closeBtn) {
      closeBtn.removeEventListener("click", onMenuClose);
    }
    for (let i = 0; i < mobileLinks.length; i += 1) {
      mobileLinks[i].removeEventListener("click", onMenuClose);
    }
  };
}
