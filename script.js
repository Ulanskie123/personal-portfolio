// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// Highlight the nav link of the section in view
const links = [...nav.querySelectorAll("a")];
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

document.querySelectorAll("main section").forEach((s) => observer.observe(s));

// Contact form: opens the visitor's email app with the message filled in
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const subject = encodeURIComponent("Portfolio message from " + f.get("name"));
  const body = encodeURIComponent(
    f.get("message") + "\n\nFrom: " + f.get("name") + " (" + f.get("email") + ")"
  );
  window.location.href =
    "mailto:raymundorainjustin71@gmail.com?subject=" + subject + "&body=" + body;
  document.getElementById("formNote").textContent = "Opening your email app…";
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Liquid background: moves and changes color on its own, and reacts when the pointer passes over it
const hero = document.getElementById("home");
const liquid = document.getElementById("liquid");
const disp = document.querySelector("#liquidFx feDisplacementMap");
const turb = document.querySelector("#liquidFx feTurbulence");

if (hero && liquid && disp && turb && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const REST = 140,
    MAX = 320;
  const RANGE = window.innerWidth < 800 ? 60 : 170; // how far the liquid can travel (px)
  let pressed = false;
  let tx = 0,
    ty = 0,
    x = 0,
    y = 0; // target and current position
  let boost = 0,
    scaleNow = REST; 
  let px = null,
    py = null; 
  let t = 0,
    last = 0,
    raf = null;

  function tick(now) {
    if (now - last > 33) {
      last = now;
      x += (tx - x) * 0.07; // glide toward the pointer
      y += (ty - y) * 0.07;
      liquid.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;

      boost *= 0.92; // splash fades out
      const goal = Math.min(MAX, REST + boost + (pressed ? 160 : 0));
      scaleNow += (goal - scaleNow) * 0.12;
      disp.setAttribute("scale", scaleNow.toFixed(1));

      t += 0.005 + boost * 0.00004 + (pressed ? 0.007 : 0);
      const fx = 0.008 + Math.sin(t) * 0.003;
      const fy = 0.012 + Math.cos(t * 0.8) * 0.004;
      turb.setAttribute("baseFrequency", fx.toFixed(5) + " " + fy.toFixed(5));
    }
    raf = requestAnimationFrame(tick);
  }

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !raf) raf = requestAnimationFrame(tick);
    else if (!entry.isIntersecting && raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  }).observe(hero);

  // Just moving the pointer over the hero is enough
  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2 * RANGE;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2 * RANGE;
    if (px !== null) {
      const speed = Math.hypot(e.clientX - px, e.clientY - py);
      boost = Math.min(180, boost + speed * 1.2); // faster pointer = bigger splash
    }
    px = e.clientX;
    py = e.clientY;
  });

  hero.addEventListener("pointerleave", () => {
    tx = 0;
    ty = 0;
    px = py = null;
    pressed = false;
    liquid.classList.remove("pressed");
  });

  // Pressing still makes it swirl even more
  hero.addEventListener("pointerdown", () => {
    pressed = true;
    liquid.classList.add("pressed");
  });

  window.addEventListener("pointerup", () => {
    pressed = false;
    liquid.classList.remove("pressed");
  });

  window.addEventListener("pointercancel", () => {
    pressed = false;
    liquid.classList.remove("pressed");
  });
}