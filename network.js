const svg = document.getElementById("net");
const NS = "http://www.w3.org/2000/svg";

// створює елемент і додає його (в svg або в parent)
function make(tag, attrs, parent) {
  const el = document.createElementNS(NS, tag);
  for (const name in attrs) el.setAttribute(name, attrs[name]);
  (parent || svg).appendChild(el);
  return el;
}

const blue = [
  { x: 100, y: 150, text: ["Промпт:", "«З чого складається ШІ?»"], link: "how-it-works.html" },
];
const pink = [
  { x: 300, y: 80, text: ["можливості"], link: "advantagesAI.html" },
  { x: 300, y: 220, text: ["виклики та ризики"], link: "risks.html" },
];
const green = [
  { x: 520, y: 50, text: ["Переваги"], link: "advantagesAI.html" },
  { x: 520, y: 150, text: ["ШІ в навчанні"], link: "education.html" },
  { x: 520, y: 250, text: ["Друг чи загроза"], link: "friend-or-threat.html" },
];

// лінія + жовта точка, яка біжить по ній
function connect(a, b) {
  make("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y });
  const dot = make("circle", { cx: a.x, cy: a.y, r: 4, fill: "#ffc83d" });
  const time = { dur: "2s", begin: Math.random() * 2 + "s", repeatCount: "indefinite" };
  make("animate", { attributeName: "cx", from: a.x, to: b.x, ...time }, dot);
  make("animate", { attributeName: "cy", from: a.y, to: b.y, ...time }, dot);
}

// коло, яке трохи "дихає", і підпис під ним
function node(p, color, r, parent) {
  const c = make("circle", { cx: p.x, cy: p.y, r: r, class: color }, parent);
  make("animate", {
    attributeName: "r",
    values: r + ";" + (r + 3) + ";" + r,
    dur: "2s",
    begin: Math.random() * 2 + "s",
    repeatCount: "indefinite",
  }, c);

  // кожен рядок підпису - окремий tspan
  const t = make("text", { x: p.x, y: p.y + r + 25 }, parent);
  p.text.forEach((line, i) => {
    make("tspan", { x: p.x, dy: i === 0 ? 0 : 20 }, t).textContent = line;
  });
}

// кожне коло - це посилання на свою сторінку
function draw(list, color, r) {
  list.forEach((p) => node(p, color, r, make("a", { href: p.link })));
}

blue.forEach((a) => pink.forEach((b) => connect(a, b)));
pink.forEach((a) => green.forEach((b) => connect(a, b)));

draw(blue, "blue", 35);
draw(pink, "pink", 30);
draw(green, "green", 30);