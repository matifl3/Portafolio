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
