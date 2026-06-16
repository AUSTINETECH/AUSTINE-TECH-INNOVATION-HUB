/* ── YEARS ── */
const YR = new Date().getFullYear();
document.querySelectorAll('.yr').forEach(e => e.textContent = YR);

/* ── CURSOR GLOW ── */
const cg = document.getElementById('cursor-glow');
document.addEventListener('mousemove', e => {
    cg.style.left = e.clientX + 'px';
    cg.style.top = e.clientY + 'px';
});

/* ── FLOATING CTA ── */
const floatCta = document.getElementById('floatingCta');
window.addEventListener('scroll', () => {
    if (window.scrollY > 600) floatCta.classList.add('visible');
    else floatCta.classList.remove('visible');
});

/* ── ROUTING ── */
let cur = 'landing';
let fieldDone = false,
    sceneDone = false;

function go(id) {
    if (id === cur) return;
    const old = document.getElementById('page-' + cur);
    const nxt = document.getElementById('page-' + id);
    old.classList.add('out');
    setTimeout(() => {
        old.classList.remove('active', 'out');
        nxt.classList.add('active');
        window.scrollTo(0, 0);
        cur = id;
        if (id === 'main' && !fieldDone) { fieldDone = true;
            initField(); }
        if (id === '3d' && !sceneDone) { sceneDone = true;
            initScene(); }
        observe();
        initCounters();
    }, 280);
}

function goContact() { go('main');
    setTimeout(() => document.getElementById('main-contact')?.scrollIntoView({ behavior: 'smooth' }), 380); }

/* ── MOB NAV ── */
function toggleMob() { document.getElementById('mob').classList.toggle('open'); }

function closeMob() { document.getElementById('mob').classList.remove('open'); }

/* ── ANIMATED COUNTERS ── */
let countersDone = false;

function initCounters() {
    if (countersDone) return;
    const els = document.querySelectorAll('.stat-n[data-count]');
    if (!els.length) return;
    const obs = new IntersectionObserver(ents => {
        ents.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                if (el.dataset.animated) return;
                el.dataset.animated = '1';
                let current = 0,
                    step = Math.max(1, Math.floor(target / 40));
                const inc = () => { current += step; if (current > target) current = target;
                    el.textContent = current.toLocaleString(); if (current < target) requestAnimationFrame(inc); };
                inc();
                obs.unobserve(el);
            }
        });
    }, { threshold: .3 });
    els.forEach(el => obs.observe(el));
    countersDone = true;
}

/* ── REVEAL ── */
function observe() {
    if (!('IntersectionObserver' in window)) { document.querySelectorAll('.rev').forEach(e => e.classList.add('vis')); return; }
    const obs = new IntersectionObserver(ents => {
        ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis');
                obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    document.querySelectorAll('.rev:not(.vis)').forEach(e => obs.observe(e));
}
observe();

/* ── PARTICLES (Landing) ── */
const pCanvas = document.getElementById('particles-canvas');
if (pCanvas && typeof THREE !== 'undefined') {
    const pScene = new THREE.Scene();
    const pCam = new THREE.PerspectiveCamera(60, 1, .1, 100);
    const pRnd = new THREE.WebGLRenderer({ canvas: pCanvas, antialias: true, alpha: true });
    pRnd.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const pts = [];
    for (let i = 0; i < 280; i++) pts.push((Math.random() - .5) * 20, (Math.random() - .5) * 12, (Math.random() - .5) * 10 - 4);
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const pm = new THREE.PointsMaterial({ color: 0x00E5FF, size: .04, transparent: true, opacity: .3 });
    const pMesh = new THREE.Points(pg, pm);
    pScene.add(pMesh);

    function pResize() { const r = pCanvas.parentElement.getBoundingClientRect();
        pRnd.setSize(r.width, r.height, false);
        pCam.aspect = r.width / r.height;
        pCam.updateProjectionMatrix(); }
    pResize();
    window.addEventListener('resize', pResize);
    let pt = 0;

    function pAnim(t) { pt += .001;
        pMesh.rotation.y = Math.sin(pt * .05) * .06;
        pRnd.render(pScene, pCam);
        requestAnimationFrame(pAnim); }
    requestAnimationFrame(pAnim);
}

/* ── FIELD SCENE ── */
function initField() {
    const cv = document.getElementById('field-scene');
    if (!cv || typeof THREE === 'undefined') return;
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(46, 1, .1, 100);
    const rnd = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    rnd.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    cam.position.set(0, 4.8, 10);
    cam.lookAt(0, .8, 0);
    const grp = new THREE.Group();
    scene.add(grp);
    const soil = new THREE.Mesh(new THREE.PlaneGeometry(18, 10, 34, 18), new THREE.MeshBasicMaterial({ color: 0x0052FF, wireframe: true, transparent: true, opacity: .1 }));
    soil.rotation.x = -Math.PI / 2;
    soil.position.set(2.4, -1.6, 0);
    grp.add(soil);
    const rm = new THREE.LineBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: .25 });
    for (let i = -5; i <= 5; i++) {
        const c = new THREE.CatmullRomCurve3([new THREE.Vector3(i * .72 + 2.4, -1.54, -4.6), new THREE.Vector3(i * .62 + 2.1, -1.2, -1.8), new THREE.Vector3(i * .48 + 1.8, -.84, 1.4), new THREE.Vector3(i * .32 + 1.4, -.42, 4.6)]);
        grp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(c.getPoints(36)), rm));
    }
    const npts = [
        [-2.3, 1.3, -1.2],
        [-.6, 2.3, .8],
        [1.7, 1.7, -.7],
        [3.2, 2.6, 1.2],
        [4.4, 1.15, -1.4]
    ];
    const nm = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pm2 = new THREE.MeshBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: .5 });
    const nmesh = [];
    npts.forEach((p, i) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(i === 3 ? .12 : .09, 18, 18), nm);
        m.position.set(p[0], p[1], p[2]);
        grp.add(m);
        nmesh.push(m);
        const pu = new THREE.Mesh(new THREE.SphereGeometry(.18, 18, 18), pm2);
        pu.position.copy(m.position);
        pu.userData.o = i * .55;
        grp.add(pu);
        nmesh.push(pu);
    });
    grp.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(npts.map(p => new THREE.Vector3(p[0], p[1], p[2]))), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .15 })));
    const hero = cv.closest('.mhero');

    function resize() { if (!hero) return; const r = hero.getBoundingClientRect();
        rnd.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
        cam.aspect = Math.max(1, r.width) / Math.max(1, r.height);
        cam.updateProjectionMatrix(); }
    resize();
    window.addEventListener('resize', resize);

    function anim(t) { const s = t * .001;
        grp.rotation.y = Math.sin(s * .18) * .08;
        soil.position.y = -1.62 + Math.sin(s * .55) * .04;
        nmesh.forEach(m => { if (m.userData.o !== undefined) m.scale.setScalar(1 + Math.sin(s * 1.8 + m.userData.o) * .26); });
        rnd.render(scene, cam);
        requestAnimationFrame(anim); }
    requestAnimationFrame(anim);
}

/* ── 3D PROJECT SCENE ── */
const PROJS = [
    { id: 'git-vizor', name: 'git-vizor', lang: 'HTML', status: 'live', desc: 'HTML project shipped live to Vercel. First verified live deployment from the studio.', img: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&q=80', repo: 'https://github.com/Greenbird122/git-vizor', live: 'https://git-vizor.vercel.app', col: 0x0052FF },
    { id: 'my-portifolio', name: 'my-portifolio', lang: 'HTML', status: 'live', desc: 'Personal portfolio and web publishing practice. Deployed live to Vercel.', img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80', repo: 'https://github.com/Greenbird122/my-portifolio', live: 'https://my-portifolio-six-pearl.vercel.app', col: 0x00E5FF },
    { id: 'urban-umbrella', name: 'urban-umbrella', lang: 'TypeScript', status: 'repo', desc: 'Active TypeScript practice and product experimentation. Most recently updated repo.', img: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=600&q=80', repo: 'https://github.com/Greenbird122/urban-umbrella', live: null, col: 0xFF6B00 },
    { id: 'probable-goggles', name: 'probable-goggles', lang: 'TypeScript', status: 'repo', desc: 'Product-building practice in a typed web stack. Compact and focused.', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80', repo: 'https://github.com/Greenbird122/probable-goggles', live: null, col: 0xFF6B00 },
    { id: 'symmetrical-couscous', name: 'symmetrical-couscous', lang: 'TypeScript', status: 'repo', desc: 'Broader practice across modern project scaffolds.', img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=80', repo: 'https://github.com/Greenbird122/symmetrical-couscous', live: null, col: 0xFF6B00 },
    { id: 'ideal-funicular', name: 'ideal-funicular', lang: 'TypeScript', status: 'offline', desc: 'TypeScript repository with Vercel deployment intent. Deployment currently offline.', img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80', repo: 'https://github.com/Greenbird122/ideal-funicular', live: null, col: 0x4A8AFF },
    { id: 'hub-site', name: 'Hub Website', lang: 'HTML · TS', status: 'live', desc: 'The company site — demonstrating multi-page front-end craft and immersive 3D exploration.', img: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=600&q=80', repo: 'https://github.com/Greenbird122', live: null, col: 0x00E5FF }
];

let activeF = 'all',
    selId = null,
    scO = {};

function filt(f, btn) {
    activeF = f;
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    renderList();
    if (scO.nodeGroups) {
        scO.nodeGroups.forEach((ng, i) => {
            const p = PROJS[i];
            ng.visible = f === 'all' || (f === 'live' && p.status === 'live') || (f === 'ts' && p.lang.includes('TypeScript')) || (f === 'html' && p.lang.includes('HTML'));
        });
    }
}

function renderList() {
    const el = document.getElementById('t3list');
    if (!el) return;
    const vis = PROJS.filter(p => activeF === 'all' || (activeF === 'live' && p.status === 'live') || (activeF === 'ts' && p.lang.includes('TypeScript')) || (activeF === 'html' && p.lang.includes('HTML')));
    el.innerHTML = vis.map(p =>
        `<div class="t3-item${selId === p.id ? ' on' : ''}" onclick="selProj('${p.id}')">
            <div class="t3-item-lang">${p.lang}</div>
            <h4>${p.name}</h4>
            <p>${p.desc.slice(0, 75)}…</p>
            <div class="t3-item-links">
                <a href="${p.repo}" target="_blank" rel="noreferrer" class="t3-link" onclick="event.stopPropagation()">GitHub</a>
                ${p.live ? `<a href="${p.live}" target="_blank" rel="noreferrer" class="t3-link" onclick="event.stopPropagation()">Live ↗</a>` : ''}
            </div>
        </div>`
    ).join('');
}

function selProj(id) {
    selId = id;
    renderList();
    const p = PROJS.find(x => x.id === id);
    if (!p) return;
    const el = document.getElementById('t3detail');
    if (!el) return;
    el.classList.add('vis');
    el.innerHTML = `
        <div class="t3-detail-img"><img src="${p.img}" alt="${p.name}"></div>
        <div class="t3-detail-body">
            <div class="t3-det-name">${p.name}</div>
            <div class="t3-det-desc">${p.desc}</div>
            <div class="t3-meta">
                <div><span>Language</span><span>${p.lang}</span></div>
                <div><span>Status</span><span>${p.status === 'live' ? '✓ Live' : p.status === 'offline' ? '⚠ Offline' : 'Repository'}</span></div>
            </div>
            <div class="t3-acts">
                <a href="${p.repo}" target="_blank" rel="noreferrer" class="t3a t3a-p">GitHub →</a>
                ${p.live ? `<a href="${p.live}" target="_blank" rel="noreferrer" class="t3a t3a-s">Live ↗</a>` : '<span class="t3a t3a-s" style="opacity:.35;pointer-events:none">No live URL</span>'}
            </div>
        </div>
    `;
    if (scO.nodeGroups) {
        const idx = PROJS.findIndex(x => x.id === id);
        scO.nodeGroups.forEach((ng, i) => ng.children[0] && ng.children[0].scale.setScalar(i === idx ? 1.5 : 1));
    }
}

function initScene() {
    renderList();
    const cv = document.getElementById('proj-canvas');
    if (!cv || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080C1A);
    scene.fog = new THREE.FogExp2(0x080C1A, .028);

    const cam = new THREE.PerspectiveCamera(52, 1, .1, 200);
    const rnd = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
    rnd.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    scene.add(new THREE.AmbientLight(0x10172B, 1.0));
    const dl = new THREE.DirectionalLight(0x00E5FF, 1.4);
    dl.position.set(6, 10, 6);
    scene.add(dl);
    const rl = new THREE.DirectionalLight(0x0052FF, .7);
    rl.position.set(-8, 4, -6);
    scene.add(rl);
    const pl = new THREE.PointLight(0x00E5FF, .5, 25);
    pl.position.set(0, 8, 0);
    scene.add(pl);

    const gl = new THREE.LineBasicMaterial({ color: 0x10172B, transparent: true, opacity: .4 });
    for (let x = -15; x <= 15; x += 2) { const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, -1.5, -16), new THREE.Vector3(x, -1.5, 16)]);
        scene.add(new THREE.Line(g, gl)); }
    for (let z = -16; z <= 16; z += 2) { const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-15, -1.5, z), new THREE.Vector3(15, -1.5, z)]);
        scene.add(new THREE.Line(g, gl)); }

    const sv = [];
    for (let i = 0; i < 600; i++) sv.push((Math.random() - .5) * 100, (Math.random() - .5) * 50, (Math.random() - .5) * 100);
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.Float32BufferAttribute(sv, 3));
    scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0x8892B0, size: .07, transparent: true, opacity: .7 })));

    const orbRing = new THREE.Mesh(new THREE.TorusGeometry(14, .04, 8, 80), new THREE.MeshBasicMaterial({ color: 0x10172B, transparent: true, opacity: .5 }));
    orbRing.rotation.x = Math.PI / 2.5;
    scene.add(orbRing);

    const POS = [
        [-7, .5, 0],
        [-4, 2.5, -5],
        [-1, -1, 4],
        [2, 3, -1],
        [5, .5, 4],
        [7, 2.5, -4],
        [9, -.5, 1]
    ];

    const nodeGroups = [],
        clickTargets = [];
    PROJS.forEach((p, i) => {
        const grp = new THREE.Group();
        grp.position.set(POS[i][0], POS[i][1], POS[i][2]);
        scene.add(grp);
        nodeGroups.push(grp);
        const mat = new THREE.MeshPhongMaterial({ color: p.col, emissive: new THREE.Color(p.col).multiplyScalar(.12), shininess: 80, transparent: true, opacity: .95 });
        const sz = p.status === 'live' ? .7 : .52;
        const sph = new THREE.Mesh(new THREE.SphereGeometry(sz, 28, 28), mat);
        sph.userData.pid = p.id;
        grp.add(sph);
        clickTargets.push(sph);
        if (p.status === 'live') {
            const rm = new THREE.Mesh(new THREE.RingGeometry(sz + .15, sz + .28, 36), new THREE.MeshBasicMaterial({ color: 0x00E5FF, transparent: true, opacity: .55, side: THREE.DoubleSide }));
            rm.rotation.x = Math.PI / 2;
            grp.add(rm);
        }
        const pm = new THREE.Mesh(new THREE.SphereGeometry(sz + .25, 18, 18), new THREE.MeshBasicMaterial({ color: p.col, transparent: true, opacity: .12, side: THREE.DoubleSide }));
        pm.userData.pu = true;
        pm.userData.off = i * .68;
        grp.add(pm);
    });

    const cm = new THREE.LineBasicMaterial({ color: 0x10172B, transparent: true, opacity: .45 });
    for (let i = 0; i < POS.length - 1; i++) scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...POS[i]), new THREE.Vector3(...POS[i + 1])]), cm));

    scO = { scene, cam, rnd, nodeGroups, clickTargets };

    let drag = false,
        px = 0,
        py = 0,
        theta = 0,
        phi = .38,
        radius = 22;
    const tgt = new THREE.Vector3(1, .5, 0);
    const raycaster = new THREE.Raycaster();

    function camPos() { cam.position.set(tgt.x + radius * Math.sin(phi) * Math.sin(theta), tgt.y + radius * Math.cos(phi), tgt.z + radius * Math.sin(phi) * Math.cos(theta));
        cam.lookAt(tgt); }

    cv.addEventListener('mousedown', e => { drag = true;
        px = e.clientX;
        py = e.clientY; });
    window.addEventListener('mouseup', () => drag = false);
    window.addEventListener('mousemove', e => { if (!drag) return;
        theta -= (e.clientX - px) * .007;
        phi = Math.max(.12, Math.min(1.45, phi - (e.clientY - py) * .007));
        px = e.clientX;
        py = e.clientY;
        camPos(); });
    cv.addEventListener('wheel', e => { radius = Math.max(7, Math.min(42, radius + e.deltaY * .04));
        camPos();
        e.preventDefault(); }, { passive: false });
    let lt = null;
    cv.addEventListener('touchstart', e => { if (e.touches.length === 1) lt = { x: e.touches[0].clientX, y: e.touches[0].clientY }; });
    cv.addEventListener('touchmove', e => { if (e.touches.length === 1 && lt) { theta -= (e.touches[0].clientX - lt.x) * .01;
            phi = Math.max(.12, Math.min(1.45, phi - (e.touches[0].clientY - lt.y) * .01));
            lt = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            camPos(); }
        e.preventDefault(); }, { passive: false });

    cv.addEventListener('click', e => {
        const rect = cv.getBoundingClientRect();
        const mouse = new THREE.Vector2(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
        raycaster.setFromCamera(mouse, cam);
        const hits = raycaster.intersectObjects(clickTargets);
        if (hits.length && hits[0].object.userData.pid) selProj(hits[0].object.userData.pid);
    });

    function resize() { const w = cv.parentElement.clientWidth,
            h = cv.parentElement.clientHeight;
        rnd.setSize(w, h, false);
        cam.aspect = w / h;
        cam.updateProjectionMatrix(); }
    resize();
    window.addEventListener('resize', resize);

    let autoT = theta;

    function anim(t) {
        const s = t * .001;
        if (!drag) { autoT += .0025;
            theta = autoT;
            phi = .38 + Math.sin(s * .15) * .08;
            camPos(); }
        orbRing.rotation.z = s * .05;
        pl.position.set(Math.sin(s * .3) * 10, 8, Math.cos(s * .3) * 10);
        nodeGroups.forEach((ng, i) => {
            ng.rotation.y = Math.sin(s * .4 + i * .9) * .08;
            ng.children.forEach(c => { if (c.userData.pu) { const sc = 1 + Math.sin(s * 1.5 + c.userData.off) * .25;
                    c.scale.setScalar(sc);
                    c.material.opacity = .1 + Math.sin(s * 1.5 + c.userData.off) * .07; } });
        });
        rnd.render(scene, cam);
        requestAnimationFrame(anim);
    }
    camPos();
    requestAnimationFrame(anim);
}

/* ── INIT ── */
setTimeout(() => { initCounters(); }, 500);
