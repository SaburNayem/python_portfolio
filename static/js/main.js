const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
            }
        });
    },
    { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

document.querySelectorAll("a[href^='#']").forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

const form = document.querySelector(".contact-form");
if (form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
    });
}

if (!prefersReducedMotion) {
    const particleCanvas = document.getElementById("particle-canvas");
    if (particleCanvas) {
        const ctx = particleCanvas.getContext("2d");
        let w = 0;
        let h = 0;
        let particles = [];
        const pointer = { x: 0, y: 0, active: false };

        const resize = () => {
            w = particleCanvas.width = window.innerWidth;
            h = particleCanvas.height = window.innerHeight;
            const count = Math.max(30, Math.floor((w * h) / 26000));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.9 + 0.6,
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < particles.length; i += 1) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -10) p.x = w + 10;
                if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10;
                if (p.y > h + 10) p.y = -10;

                if (pointer.active) {
                    const dx = pointer.x - p.x;
                    const dy = pointer.y - p.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < 14000) {
                        p.x -= dx * 0.0012;
                        p.y -= dy * 0.0012;
                    }
                }

                ctx.beginPath();
                ctx.fillStyle = "rgba(158, 198, 255, 0.55)";
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();

                for (let j = i + 1; j < particles.length; j += 1) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 105) {
                        const alpha = (1 - dist / 105) * 0.22;
                        ctx.strokeStyle = `rgba(89, 156, 255, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", (event) => {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
            pointer.active = true;
        });
        window.addEventListener("mouseleave", () => {
            pointer.active = false;
        });

        resize();
        draw();
    }

    const parallaxItems = document.querySelectorAll("[data-parallax]");
    window.addEventListener("mousemove", (event) => {
        const rx = (event.clientX / window.innerWidth - 0.5) * 2;
        const ry = (event.clientY / window.innerHeight - 0.5) * 2;

        parallaxItems.forEach((item) => {
            const depth = Number(item.getAttribute("data-parallax")) || 10;
            item.style.transform = `translate3d(${(-rx * depth).toFixed(2)}px, ${(-ry * depth).toFixed(2)}px, 0)`;
        });
    });
}
