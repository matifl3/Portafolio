const navbar = document.querySelector<HTMLElement>("#navbar");
const navToggle = document.querySelector<HTMLButtonElement>("#navToggle");
const navMenu = document.querySelector<HTMLElement>("#navMenu");
const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
const backToTop = document.querySelector<HTMLButtonElement>("#backToTop");
const tabs = document.querySelectorAll<HTMLButtonElement>(".tab");
const panels = document.querySelectorAll<HTMLElement>(".panel");

function switchTab(tab: HTMLButtonElement): void {
    const panelId: string | undefined = tab.dataset["panel"];
    if (!panelId) return;

    tabs.forEach((t) => {
        const isActive: boolean = t === tab;
        t.classList.toggle("active", isActive);
        t.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((p) => {
        const isTarget: boolean = p.id === `panel-${panelId}`;
        p.classList.toggle("active", isTarget);
    });
}

tabs.forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab));
});

function toggleMenu(force?: boolean): void {
    if (!navToggle || !navMenu) return;
    const open: boolean = force !== undefined ? force : !navMenu.classList.contains("open");
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

function onScroll(): void {
    if (!backToTop) return;
    const shouldShow: boolean = window.scrollY > 400;
    backToTop.classList.toggle("visible", shouldShow);

    const atBottom: boolean =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

    const scrollPos: number = window.scrollY + 120;

    navLinks.forEach((link) => {
        const targetId: string | null = link.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const target = document.querySelector<HTMLElement>(targetId);
        if (!target) return;

        let inRange: boolean;

        if (atBottom) {
            inRange = link === navLinks[navLinks.length - 1];
        } else {
            const top: number = target.offsetTop;
            const height: number = target.offsetHeight;
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

function initGalleryArrows(): void {
    document.querySelectorAll<HTMLElement>(".project-gallery-wrap").forEach((wrap) => {
        const gallery = wrap.querySelector<HTMLElement>(".project-gallery");
        const prev = wrap.querySelector<HTMLButtonElement>(".gallery-prev");
        const next = wrap.querySelector<HTMLButtonElement>(".gallery-next");
        if (!gallery || !prev || !next) return;

        const updateArrows = (): void => {
            prev.disabled = gallery.scrollLeft <= 2;
            next.disabled = gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 2;
        };

        const scrollByStep = (dir: number): void => {
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

const lightbox = document.querySelector<HTMLElement>("#lightbox");
const lightboxImg = document.querySelector<HTMLImageElement>("#lightboxImg");
const lightboxClose = document.querySelector<HTMLButtonElement>("#lightboxClose");
const lightboxPrev = document.querySelector<HTMLButtonElement>("#lightboxPrev");
const lightboxNext = document.querySelector<HTMLButtonElement>("#lightboxNext");

let lightboxImages: HTMLImageElement[] = [];
let lightboxIndex: number = 0;

function updateLightbox(): void {
    const img = lightboxImages[lightboxIndex];
    if (!img || !lightboxImg) return;
    lightboxImg.src = img.getAttribute("src") ?? "";
    lightboxImg.alt = img.alt || "Captura ampliada";
    if (lightboxPrev) lightboxPrev.disabled = lightboxIndex <= 0;
    if (lightboxNext) lightboxNext.disabled = lightboxIndex >= lightboxImages.length - 1;
}

function openLightbox(img: HTMLImageElement): void {
    const gallery = img.closest<HTMLElement>(".project-gallery");
    lightboxImages = gallery
        ? Array.from(gallery.querySelectorAll<HTMLImageElement>(".project-image"))
        : [img];
    lightboxIndex = lightboxImages.indexOf(img);
    updateLightbox();
    lightbox?.classList.add("open");
    lightbox?.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
}

function closeLightbox(): void {
    lightbox?.classList.remove("open");
    lightbox?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
}

document.querySelectorAll<HTMLImageElement>(".project-image").forEach((img) => {
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
    if (e.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (e) => {
    if (!lightbox?.classList.contains("open")) return;
    if (e.key === "Escape") {
        closeLightbox();
    } else if (e.key === "ArrowLeft" && lightboxIndex > 0) {
        lightboxIndex--;
        updateLightbox();
    } else if (e.key === "ArrowRight" && lightboxIndex < lightboxImages.length - 1) {
        lightboxIndex++;
        updateLightbox();
    }
});
