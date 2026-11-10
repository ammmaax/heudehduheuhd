// Спільні для всіх сторінок хедер і футер.
// Щоб змінити меню або футер — правите лише цей файл.
 
const PAGES = [
  { href: "index.html", label: "Головна" },
  { href: "advantagesAI.html", label: "Переваги" },
  { href: "risks.html", label: "Ризики" },
  { href: "education.html", label: "ШІ в навчанні" },
];
 
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
      <a class="brand" href="index.html"><span class="brand-dot"></span>ШІ</a>
      <ul class="nav-menu">${items}
      </ul>
    </nav>`;
 
  // Шапка темнішає, коли сторінку прокрутили
  const onScroll = () => target.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}
 
function renderFooter() {
  const target = document.getElementById("site-footer");
  if (!target) return;
 
  const year = new Date().getFullYear();
  const links = PAGES.map(
    (page) => `<a href="${page.href}">${page.label}</a>`
  ).join("");
 
  target.innerHTML = `
    <div class="footer-inner">
      <p class="footer-title">Штучний інтелект: друг чи загроза?</p>
      <div class="footer-links">${links}</div>
      <p class="footer-copy">© ${year} Усі права захищено</p>
    </div>`;
}
 
// ---------- Фон: вузли нейромережі, що тягнуться до курсора ----------
function initBackground() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.createElement("canvas");
  canvas.id = "bg-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
 
  const ctx = canvas.getContext("2d");
  const COLORS = ["208,225,249", "77,100,141"]; // periwinkle, blueberry
  const mouse = { x: -9999, y: -9999 };
  let w, h, dots = [];
 
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
 
    const count = Math.min(90, Math.floor((w * h) / 16000));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
      c: COLORS[Math.random() < 0.7 ? 1 : 0],
    }));
  }
 
  function draw() {
    ctx.clearRect(0, 0, w, h);
 
    for (const d of dots) {
      if (!reduce) {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
      }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${d.c},0.8)`;
      ctx.fill();
    }
 
    // Лінії між близькими вузлами та до курсора
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dist = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(77,100,141,${(1 - dist / 130) * 0.45})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
      const md = Math.hypot(dots[i].x - mouse.x, dots[i].y - mouse.y);
      if (md < 170) {
        ctx.strokeStyle = `rgba(208,225,249,${(1 - md / 170) * 0.6})`;
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    }
 
    if (!reduce) requestAnimationFrame(draw);
  }
 
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener("mouseout", () => { mouse.x = mouse.y = -9999; });
 
  resize();
  draw();
}
 
// ---------- Підсвітка карток за курсором ----------
function initCardSpotlight() {
  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest && e.target.closest(".card");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  });
}
 
// ---------- Поява блоків при прокрутці ----------
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el, i) => {
    // невелика затримка, щоб картки з'являлися «хвилею»
    el.style.transitionDelay = `${(i % 3) * 90}ms`;
    observer.observe(el);
  });
}
 
// ---------- Безшовний рядок, що біжить ----------
function initMarquee() {
  const track = document.querySelector(".marquee-track");
  if (track) track.innerHTML += track.innerHTML;
}
 
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  initBackground();
  initCardSpotlight();
  initMarquee();
  initReveal();
});