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
