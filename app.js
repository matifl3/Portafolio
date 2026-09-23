"use strict";
const navbar = document.querySelector("#navbar");
const navToggle = document.querySelector("#navToggle");
const navMenu = document.querySelector("#navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const backToTop = document.querySelector("#backToTop");
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");
function switchTab(tab) {
    const panelId = tab.dataset["panel"];
    if (!panelId)
        return;
    tabs.forEach((t) => {
        const isActive = t === tab;
        t.classList.toggle("active", isActive);
        t.setAttribute("aria-selected", String(isActive));
    });
    panels.forEach((p) => {
        const isTarget = p.id === `panel-${panelId}`;
        p.classList.toggle("active", isTarget);
    });
}
tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab));
});
document.querySelectorAll('a[href="#proyectos"]').forEach((anchor) => {
    anchor.addEventListener("click", () => {
        const itTab = document.querySelector('.tab[data-panel="it"]');
        if (itTab)
            switchTab(itTab);
    });
});
function toggleMenu(force) {
    if (!navToggle || !navMenu)
        return;
    const open = force !== undefined ? force : !navMenu.classList.contains("open");
    navMenu.classList.toggle("open", open);
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
}
if (navToggle) {
    navToggle.addEventListener("click", () => toggleMenu());
}
navLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
});
function onScroll() {
    if (!backToTop)
        return;
    const shouldShow = window.scrollY > 400;
    backToTop.classList.toggle("visible", shouldShow);
    navbar?.classList.toggle("scrolled", window.scrollY > 10);
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    const scrollPos = window.scrollY + 120;
    navLinks.forEach((link) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#")
            return;
        const target = document.querySelector(targetId);
        if (!target)
            return;
        let inRange;
        if (atBottom) {
            inRange = link === navLinks[navLinks.length - 1];
        }
        else {
            const top = target.offsetTop;
            const height = target.offsetHeight;
            inRange = scrollPos >= top && scrollPos < top + height;
        }
        link.classList.toggle("active", inRange);
    });
}
if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();
function initGalleryArrows() {
    document.querySelectorAll(".project-gallery-wrap").forEach((wrap) => {
        const gallery = wrap.querySelector(".project-gallery");
        const prev = wrap.querySelector(".gallery-prev");
        const next = wrap.querySelector(".gallery-next");
        if (!gallery || !prev || !next)
            return;
        const updateArrows = () => {
            prev.disabled = gallery.scrollLeft <= 2;
            next.disabled = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 2;
        };
        const scrollByStep = (dir) => {
            gallery.scrollBy({ left: dir * gallery.clientWidth * 0.8, behavior: "smooth" });
        };
        prev.addEventListener("click", () => scrollByStep(-1));
        next.addEventListener("click", () => scrollByStep(1));
        gallery.addEventListener("scroll", updateArrows, { passive: true });
        window.addEventListener("resize", updateArrows);
        updateArrows();
    });
}
initGalleryArrows();
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { rootMargin: "0px 0px -60px 0px", threshold: 0 });
const revealTargets = document.querySelectorAll(".section-title, .section-lead, .block-title, .card, .project-section, .contact-card, .tabs, .center");
revealTargets.forEach((el) => {
    const target = el;
    if (target.classList.contains("card") && target.parentElement && target.parentElement.classList.contains("card-grid")) {
        const idx = Array.prototype.indexOf.call(target.parentElement.children, target);
        target.style.transitionDelay = `${(0.04 * idx).toFixed(2)}s`;
        target.addEventListener("transitionend", (e) => {
            if (e.propertyName === "transform")
                target.style.transitionDelay = "";
        }, { once: true });
    }
    target.classList.add("reveal");
    revealObserver.observe(target);
});
function initParticles() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;
    document.querySelectorAll("canvas.particles").forEach((canvas) => {
        const zone = canvas.parentElement;
        if (!zone)
            return;
        const ctx = canvas.getContext("2d");
        if (!ctx)
            return;
        let particles = [];
        let width = 0;
        let height = 0;
        const dpr = window.devicePixelRatio || 1;
        function resize() {
            const rect = zone.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.min(Math.floor((width * height) / 3200), 420);
            particles = Array.from({ length: Math.max(count, 1) }, () => {
                const d = Math.random() * 0.7 + 0.3;
                return {
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.4 * d,
                    vy: (Math.random() - 0.5) * 0.4 * d,
                    r: (Math.random() * 1.6 + 0.5) * d,
                    d,
                    accent: Math.random() < 0.25,
                    tw: Math.random() * Math.PI * 2,
                    twSpeed: Math.random() * 0.02 + 0.005,
                };
            });
        }
        function draw() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                p.tw += p.twSpeed;
                if (p.x < -20)
                    p.x = width + 20;
                if (p.x > width + 20)
                    p.x = -20;
                if (p.y < -20)
                    p.y = height + 20;
                if (p.y > height + 20)
                    p.y = -20;
                const alpha = 0.25 + p.d * (0.4 + (Math.sin(p.tw) + 1) * 0.25);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.accent
                    ? `rgba(225, 6, 0, ${alpha})`
                    : `rgba(245, 245, 247, ${alpha})`;
                ctx.fill();
            });
            requestAnimationFrame(draw);
        }
        resize();
        draw();
        window.addEventListener("resize", resize);
    });
}
initParticles();
const lightbox = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightboxImg");
const lightboxClose = document.querySelector("#lightboxClose");
const lightboxPrev = document.querySelector("#lightboxPrev");
const lightboxNext = document.querySelector("#lightboxNext");
let lightboxImages = [];
let lightboxIndex = 0;
function updateLightbox() {
    const img = lightboxImages[lightboxIndex];
    if (!img || !lightboxImg)
        return;
    lightboxImg.src = img.getAttribute("src") ?? "";
    lightboxImg.alt = img.alt || "Captura ampliada";
    if (lightboxPrev)
        lightboxPrev.disabled = lightboxIndex <= 0;
    if (lightboxNext)
        lightboxNext.disabled = lightboxIndex >= lightboxImages.length - 1;
}
function openLightbox(img) {
    const gallery = img.closest(".project-gallery");
    lightboxImages = gallery
        ? Array.from(gallery.querySelectorAll(".project-image"))
        : [img];
    lightboxIndex = lightboxImages.indexOf(img);
    updateLightbox();
    lightbox?.classList.add("open");
    lightbox?.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
}
function closeLightbox() {
    lightbox?.classList.remove("open");
    lightbox?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
}
document.querySelectorAll(".project-image").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openLightbox(img));
});
lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => {
    if (lightboxIndex > 0) {
        lightboxIndex--;
        updateLightbox();
    }
});
lightboxNext?.addEventListener("click", () => {
    if (lightboxIndex < lightboxImages.length - 1) {
        lightboxIndex++;
        updateLightbox();
    }
});
lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox)
        closeLightbox();
});
window.addEventListener("keydown", (e) => {
    if (!lightbox?.classList.contains("open"))
        return;
    if (e.key === "Escape") {
        closeLightbox();
    }
    else if (e.key === "ArrowLeft" && lightboxIndex > 0) {
        lightboxIndex--;
        updateLightbox();
    }
    else if (e.key === "ArrowRight" && lightboxIndex < lightboxImages.length - 1) {
        lightboxIndex++;
        updateLightbox();
    }
});
function initHeroTyping() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;
    const title = document.querySelector(".hero-title");
    if (!title || title.dataset["typed"])
        return;
    title.classList.add("typing-wrap");
    title.dataset["typed"] = "true";
    const wrap = (node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
            const frag = document.createDocumentFragment();
            for (const ch of node.textContent) {
                const span = document.createElement("span");
                span.className = "typing-char";
                span.textContent = ch === " " ? "\u00A0" : ch;
                frag.appendChild(span);
            }
            node.parentNode?.replaceChild(frag, node);
        }
        else if (node.nodeType === Node.ELEMENT_NODE) {
            Array.from(node.childNodes).forEach(wrap);
        }
    };
    Array.from(title.childNodes).forEach(wrap);
    const chars = Array.from(title.querySelectorAll(".typing-char"));
    chars.forEach((char, i) => {
        char.style.transitionDelay = `${(0.03 * i + 0.15).toFixed(3)}s`;
    });
    requestAnimationFrame(() => {
        title.classList.add("typing-done");
    });
}
initHeroTyping();
