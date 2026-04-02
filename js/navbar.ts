function tryUrl(url: string) {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

function getNavbarLinks() {
  const entries = Array.from(
    document.querySelectorAll<HTMLAnchorElement>("a.navbar-item"),
  )
    .map<[string, HTMLAnchorElement]>((e) => {
      const url = tryUrl(e.href);
      return url !== null && url.hash ? [url.hash.substring(1), e] : ["", e];
    })
    .filter(([k]) => k.length > 0);
  return new Map(entries);
}

function activeLinks() {
  const navlinks = getNavbarLinks();
  const observer = new IntersectionObserver((entries) => {
    const [last] = entries.filter((e) => e.isIntersecting)
      .slice(-1);
    if (!last) {
      return;
    }
    let navlink;
    for (navlink of navlinks.values()) {
      navlink.classList.remove("is-active");
    }
    navlink = navlinks.get(last.target.id);
    if (navlink) {
      navlink.classList.add("is-active");
    }
  }, {
    threshold: 0.3,
    root: null,
    rootMargin: "0px",
  });

  for (const section of getSections()) {
    observer.observe(section);
  }
  observer.observe(document.body);
}

function getSections(): HTMLElement[] {
  return Array.from(
    document.querySelectorAll<HTMLElement>("div.container > section"),
  )
    .filter((s) => s.id);
}

function getRequiredElement<E extends Element>(selector: string): E {
  const element = document.querySelector<E>(selector);
  if (element === null) {
    throw new Error(`Cannot find the element from: "${selector}"`);
  }
  return element;
}

(() => {
  const burger = getRequiredElement("a.navbar-burger");
  const navbar = getRequiredElement("div.navbar-menu");

  burger.addEventListener("click", () => {
    burger.classList.toggle("is-active");
    navbar.classList.toggle("is-active");
  });

  activeLinks();
})();
