
function tryUrl(url) {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

function activeLinks() {
  const navlinks = new Map(Array.from(document.querySelectorAll("a.navbar-item"))
  .map(e => {
    const url = tryUrl(e.href);
    return url !== null && url.hash ? [url.hash.substring(1), e] : [];
  })
  .filter(e => e.length === 2));
  const observer = new IntersectionObserver((entries) => {
    console.log(entries)
    const [last] = entries.filter(e => e.isIntersecting)
      .slice(-1);
    if (!last) {
      return;
    }
    let navlink
    for (navlink of navlinks.values()) {
      navlink.classList.remove("is-active");
    }
    navlink = navlinks.get(last.target.id);
    if (navlink) {
      navlink.classList.add("is-active");
    }
  }, {
    threshold: 0.3,
  });

  for (const section of getSections()) {
    observer.observe(section);
  }
  observer.observe(document.body);
}

/**
 * 
 * @returns {HTMLElement[]}
 */
function getSections() {
  return Array.from(document.querySelectorAll("div.container > section"))
  .filter(s => s.id);
}

(() => {
  const burger = document.querySelector("a.navbar-burger");
  const navbar = document.querySelector("div.navbar-menu");

  burger.addEventListener("click", () => {
    burger.classList.toggle("is-active");
    navbar.classList.toggle("is-active");
  })

  activeLinks();
})();
