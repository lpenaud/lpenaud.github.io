export function getLocalLink(languages: [string, string][]) {
  const map = new Map<string, string>();
  for (const [lang, url] of languages) {
    map.set(lang, url);
    const sub = lang.substring(0, 2);
    if (lang !== sub) {
      map.set(sub, url);
    }
  }
  let url = map.get(navigator.language);
  if (url) {
    return url;
  }
  [url] = navigator.languages
    .map((v) => map.get(v.substring(0, 2)));
  if (url) {
    return url;
  }
  return map.get("en") as string;
}

export function automaticRedirect() {
  const list = Array.from(document.querySelectorAll<HTMLAnchorElement>("ul#languages-list a"))
  const link = getLocalLink(list.map(v => [v.textContent, v.href]));
  location.replace(link);
}
