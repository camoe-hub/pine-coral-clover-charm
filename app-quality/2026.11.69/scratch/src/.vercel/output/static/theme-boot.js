try {
  if (window.top !== window.self) document.documentElement.classList.add("in-preview");
  var saved = localStorage.getItem("rivetcare-theme");
  var dark = saved === "dark" || (saved !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  if (dark) document.documentElement.classList.add("dark");
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", "#152A6A");
} catch {
  /* storage or matchMedia can throw; the page still paints */
}
