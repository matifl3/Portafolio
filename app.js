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
