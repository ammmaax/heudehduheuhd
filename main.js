// Спільні для всіх сторінок хедер і футер.
// Щоб змінити меню або футер — правите лише цей файл.

// Ім'я поточного файлу; порожній шлях (відкрито "/") вважаємо головною
function currentPage() {
  const name = location.pathname.split("/").pop();
  return name || "index.html";
}

function renderHeader() {
  const target = document.getElementById("site-header");
  if (!target) return;

  const current = currentPage();
  const items = PAGES.map((page) => {
    const isActive = page.href === current;
    return `
      <li class="nav-item">
        <a href="${page.href}"${isActive ? ' class="active" aria-current="page"' : ""}>${page.label}</a>
      </li>`;
  }).join("");

  target.innerHTML = `
    <nav class="nav-container">
      <ul class="nav-menu">${items}
      </ul>
    </nav>`;
}

function renderFooter() {
  const target = document.getElementById("site-footer");
  if (!target) return;

  const year = new Date().getFullYear();

  target.innerHTML = `
    <div class="footer-inner">
      <p class="footer-title">Штучний інтелект: друг чи загроза?</p>
      <p class="footer-copy">© ${year} Усі права захищено</p>
    </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});