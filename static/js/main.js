const state = {
    lampOn: false,
    sceneReady: false,
    renderer: null,
    ambientLight: null,
    fillLight: null,
    spotLight: null,
    lampBulb: null,
    deskGlow: null,
    lightCone: null,
    lowerArmPivot: null,
    upperArmPivot: null,
    headPivot: null,
    clickable: [],
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobile = window.matchMedia("(max-width: 768px)").matches;

const contentEl = document.getElementById("portfolio-content");
const lampToggleBtn = document.getElementById("lampToggle");
const themeToggleBtn = document.getElementById("themeToggle");

function setLamp(on) {
    state.lampOn = on;

    if (contentEl) {
        contentEl.classList.toggle("content-hidden", !on);
        contentEl.classList.toggle("content-visible", on);
    }

    if (lampToggleBtn) {
        lampToggleBtn.textContent = on ? "Turn Lamp Off" : "Turn Lamp On";
        lampToggleBtn.classList.toggle("btn-primary", !on);
        lampToggleBtn.classList.toggle("btn-outline-light", on);
    }

    if (state.ambientLight) {
        gsap.to(state.ambientLight, { intensity: on ? 0.33 : 0.12, duration: 0.65, ease: "power2.out" });
    }
    if (state.fillLight) {
        gsap.to(state.fillLight, { intensity: on ? 0.45 : 0.08, duration: 0.65, ease: "power2.out" });
    }
    if (state.spotLight) {
        gsap.to(state.spotLight, { intensity: on ? 3.2 : 0.05, duration: 0.65, ease: "power2.out" });
    }
    if (state.lampBulb?.material) {
        gsap.to(state.lampBulb.material, { emissiveIntensity: on ? 3.2 : 0.2, duration: 0.55 });
    }
    if (state.deskGlow?.material) {
        gsap.to(state.deskGlow.material, { opacity: on ? 0.7 : 0.04, duration: 0.6 });
    }
    if (state.lightCone?.material) {
        gsap.to(state.lightCone.material, { opacity: on ? 0.28 : 0.02, duration: 0.6 });
    }

    if (state.lowerArmPivot && state.upperArmPivot && state.headPivot) {
        gsap.to(state.lowerArmPivot.rotation, { z: on ? -0.58 : -0.35, duration: 0.65, ease: "power2.inOut" });
        gsap.to(state.upperArmPivot.rotation, { z: on ? 0.92 : 0.46, duration: 0.65, ease: "power2.inOut" });
        gsap.to(state.headPivot.rotation, { z: on ? -1.34 : -0.7, duration: 0.65, ease: "power2.inOut" });
    }
}

function initRevealObserver() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.add("in-view");
            });
        },
        { threshold: 0.18 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function initSmoothScroll() {
    document.querySelectorAll("a[href^='#']").forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const target = document.querySelector(anchor.getAttribute("href"));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

function initThemeToggle() {
    const key = "nh_theme";
    const saved = localStorage.getItem(key);
    if (saved) document.documentElement.setAttribute("data-theme", saved);

    if (themeToggleBtn) {
        themeToggleBtn.textContent = document.documentElement.getAttribute("data-theme") === "light" ? "Dark" : "Light";
        themeToggleBtn.addEventListener("click", () => {
            const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
            document.documentElement.setAttribute("data-theme", next);
            localStorage.setItem(key, next);
            themeToggleBtn.textContent = next === "light" ? "Dark" : "Light";
        });
    }
}

function initParticles() {
    if (prefersReducedMotion) return;
    const canvas = document.getElementById("particles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w = 0;
    let h = 0;
    let particles = [];

    const resize = () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        const count = Math.max(30, Math.floor((w * h) / 28000));
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.24,
            vy: (Math.random() - 0.5) * 0.24,
            r: Math.random() * 1.8 + 0.5,
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

            ctx.fillStyle = "rgba(125, 168, 255, 0.55)";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();

            for (let j = i + 1; j < particles.length; j += 1) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < 95) {
                    const alpha = (1 - d / 95) * 0.18;
                    ctx.strokeStyle = `rgba(86, 146, 255, ${alpha})`;
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
    resize();
    draw();
}

function initParallax() {
    if (prefersReducedMotion) return;
    const cards = document.querySelectorAll("[data-depth]");
    if (!cards.length) return;

    window.addEventListener("mousemove", (event) => {
        const rx = (event.clientX / window.innerWidth - 0.5) * 2;
        const ry = (event.clientY / window.innerHeight - 0.5) * 2;
        cards.forEach((el) => {
            const depth = Number(el.getAttribute("data-depth")) || 12;
            el.style.transform = `translate3d(${(-rx * depth).toFixed(2)}px, ${(-ry * depth).toFixed(2)}px, 0)`;
        });
    });
}

function initRoomScene() {
    const canvas = document.getElementById("room-canvas");
    if (!canvas || typeof THREE === "undefined") {
        setLamp(true);
        return;
    }

    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || Math.round(window.innerHeight * 0.58);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    state.renderer = renderer;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x05070f, 8, 22);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.4, 8.4);
    camera.lookAt(0, 0.7, 0);

    const ambientLight = new THREE.AmbientLight(0x354776, 0.12);
    scene.add(ambientLight);
    state.ambientLight = ambientLight;

    const fillLight = new THREE.HemisphereLight(0x6e87be, 0x0f1220, 0.1);
    scene.add(fillLight);
    state.fillLight = fillLight;

    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 16),
        new THREE.MeshStandardMaterial({ color: 0x0d1324, roughness: 0.92, metalness: 0.05 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.28;
    floor.receiveShadow = true;
    scene.add(floor);

    const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 8),
        new THREE.MeshStandardMaterial({ color: 0x0a1122, roughness: 0.95 })
    );
    backWall.position.set(0, 2.1, -6.2);
    scene.add(backWall);

    const desk = new THREE.Mesh(
        new THREE.BoxGeometry(7.4, 0.28, 3.2),
        new THREE.MeshStandardMaterial({ color: 0x1e2438, roughness: 0.8, metalness: 0.12 })
    );
    desk.position.y = -1.0;
    desk.castShadow = true;
    desk.receiveShadow = true;
    scene.add(desk);

    const deskGlow = new THREE.Mesh(
        new THREE.CircleGeometry(2.2, 56),
        new THREE.MeshBasicMaterial({ color: 0xffe6a5, transparent: true, opacity: 0.04 })
    );
    deskGlow.rotation.x = -Math.PI / 2;
    deskGlow.position.set(0.1, -0.858, 0.1);
    scene.add(deskGlow);
    state.deskGlow = deskGlow;

    const laptopBase = new THREE.Mesh(
        new THREE.BoxGeometry(1.9, 0.09, 1.25),
        new THREE.MeshStandardMaterial({ color: 0x9aa8c9, metalness: 0.66, roughness: 0.24 })
    );
    laptopBase.position.set(-1.35, -0.82, -0.15);
    laptopBase.castShadow = true;
    scene.add(laptopBase);

    const laptopScreen = new THREE.Mesh(
        new THREE.BoxGeometry(1.82, 1.0, 0.06),
        new THREE.MeshStandardMaterial({ color: 0x274179, emissive: 0x102240, emissiveIntensity: 0.8, metalness: 0.4, roughness: 0.3 })
    );
    laptopScreen.position.set(-1.35, -0.3, -0.72);
    laptopScreen.rotation.x = -0.38;
    laptopScreen.castShadow = true;
    scene.add(laptopScreen);

    const mug = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.16, 0.3, 22),
        new THREE.MeshStandardMaterial({ color: 0x7a95d8, metalness: 0.15, roughness: 0.45 })
    );
    mug.position.set(1.65, -0.83, -0.25);
    mug.castShadow = true;
    scene.add(mug);

    const lampGroup = new THREE.Group();
    scene.add(lampGroup);

    const metalMat = new THREE.MeshStandardMaterial({ color: 0xb5c2e5, metalness: 0.82, roughness: 0.18 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x5c6681, metalness: 0.74, roughness: 0.24 });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.72, 0.2, 36), darkMetalMat);
    base.position.set(0.7, -0.9, 0.1);
    base.castShadow = true;
    base.receiveShadow = true;
    lampGroup.add(base);

    const lowerArmPivot = new THREE.Group();
    lowerArmPivot.position.set(0.7, -0.8, 0.1);
    lampGroup.add(lowerArmPivot);
    state.lowerArmPivot = lowerArmPivot;

    const lowerArm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 1.2, 24), metalMat);
    lowerArm.position.y = 0.6;
    lowerArm.castShadow = true;
    lowerArmPivot.add(lowerArm);

    const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.1, 22, 22), darkMetalMat);
    elbowJoint.position.y = 1.2;
    elbowJoint.castShadow = true;
    lowerArmPivot.add(elbowJoint);

    const upperArmPivot = new THREE.Group();
    upperArmPivot.position.set(0, 1.2, 0);
    lowerArmPivot.add(upperArmPivot);
    state.upperArmPivot = upperArmPivot;

    const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.0, 24), metalMat);
    upperArm.position.y = 0.5;
    upperArm.castShadow = true;
    upperArmPivot.add(upperArm);

    const neckJoint = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 20), darkMetalMat);
    neckJoint.position.y = 1.0;
    neckJoint.castShadow = true;
    upperArmPivot.add(neckJoint);

    const headPivot = new THREE.Group();
    headPivot.position.set(0, 1.0, 0);
    upperArmPivot.add(headPivot);
    state.headPivot = headPivot;

    const shade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.45, 0.66, 28, 1, true),
        new THREE.MeshStandardMaterial({ color: 0xd6dff3, metalness: 0.48, roughness: 0.24, side: THREE.DoubleSide })
    );
    shade.rotation.z = -1.12;
    shade.castShadow = true;
    headPivot.add(shade);

    const bulbMaterial = new THREE.MeshStandardMaterial({
        color: 0xfff2c2,
        emissive: 0xffd68a,
        emissiveIntensity: 0.2,
        roughness: 0.35,
    });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 22, 22), bulbMaterial);
    bulb.position.set(0.28, -0.12, 0);
    bulb.castShadow = true;
    headPivot.add(bulb);
    state.lampBulb = bulb;

    const spotLight = new THREE.SpotLight(0xffedbf, 0.05, 14, Math.PI / 7, 0.35, 1.6);
    spotLight.position.copy(bulb.getWorldPosition(new THREE.Vector3()));
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.bias = -0.0004;
    scene.add(spotLight);

    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(1.1, -0.9, 0.2);
    scene.add(lightTarget);
    spotLight.target = lightTarget;
    state.spotLight = spotLight;

    const lightCone = new THREE.Mesh(
        new THREE.ConeGeometry(0.9, 2.2, 40, 1, true),
        new THREE.MeshBasicMaterial({ color: 0xffe2a5, transparent: true, opacity: 0.02, depthWrite: false, side: THREE.DoubleSide })
    );
    lightCone.position.set(1.04, -0.1, 0.05);
    lightCone.rotation.z = -1.12;
    headPivot.add(lightCone);
    state.lightCone = lightCone;

    const floatingIcons = [];
    const iconGeometry = new THREE.IcosahedronGeometry(0.1, 0);
    const palette = [0x5bf0e7, 0x5a86ff, 0xfb7dff];
    for (let i = 0; i < 8; i += 1) {
        const icon = new THREE.Mesh(
            iconGeometry,
            new THREE.MeshStandardMaterial({
                color: palette[i % palette.length],
                emissive: palette[i % palette.length],
                emissiveIntensity: 0.22,
                metalness: 0.35,
                roughness: 0.3,
            })
        );
        icon.position.set((Math.random() - 0.5) * 6.2, Math.random() * 2.2 + 0.1, (Math.random() - 0.5) * 2.2);
        icon.userData = { offset: Math.random() * Math.PI * 2 };
        icon.castShadow = true;
        floatingIcons.push(icon);
        scene.add(icon);
    }

    state.clickable = [base, lowerArm, upperArm, shade, bulb, elbowJoint, neckJoint];

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hovered = null;

    function updatePointer(event) {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function handleHover(event) {
        updatePointer(event);
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(state.clickable, false);
        if (hits.length > 0) {
            canvas.style.cursor = "pointer";
            if (hovered !== hits[0].object) {
                hovered = hits[0].object;
                if (shade.material?.emissive) shade.material.emissive.setHex(0x222222);
            }
        } else {
            canvas.style.cursor = "default";
            hovered = null;
            if (shade.material?.emissive) shade.material.emissive.setHex(0x000000);
        }
    }

    function onClick(event) {
        updatePointer(event);
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(state.clickable, false);
        if (hits.length > 0) setLamp(!state.lampOn);
    }

    canvas.addEventListener("mousemove", handleHover);
    canvas.addEventListener("click", onClick);

    function resize() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
    }
    window.addEventListener("resize", resize);

    const clock = new THREE.Clock();
    function animate() {
        const t = clock.getElapsedTime();

        lampGroup.rotation.y = Math.sin(t * 0.28) * 0.05;
        floatingIcons.forEach((icon, idx) => {
            icon.position.y += Math.sin(t * 1.2 + icon.userData.offset + idx) * 0.0012;
            icon.rotation.x += 0.004;
            icon.rotation.y += 0.006;
        });

        const bulbWorld = bulb.getWorldPosition(new THREE.Vector3());
        spotLight.position.copy(bulbWorld);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    state.sceneReady = true;
    animate();

    if (!isMobile && !prefersReducedMotion) {
        gsap.fromTo(
            camera.position,
            { z: 10, y: 2.8 },
            { z: 8.4, y: 2.4, duration: 1.2, ease: "power2.out" }
        );
    }
}

function initLampControls() {
    if (lampToggleBtn) {
        lampToggleBtn.addEventListener("click", () => setLamp(!state.lampOn));
    }

    if (isMobile || prefersReducedMotion) {
        setLamp(true);
    } else {
        setLamp(false);
    }
}

initRevealObserver();
initSmoothScroll();
initThemeToggle();
initParticles();
initParallax();
initRoomScene();
initLampControls();
