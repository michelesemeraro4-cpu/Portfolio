const cursor = document.querySelector('.cursor');

const planetsConfig = [
    { 
        element: document.getElementById('planet-1'), 
        radiusX: 150, radiusY: 50, speed: 0.006, angle: 0 
    },
    { 
        element: document.getElementById('planet-2'), 
        radiusX: 250, radiusY: 80, speed: 0.004, angle: 2 
    },
    { 
        element: document.getElementById('planet-3'), 
        radiusX: 400, radiusY: 120, speed: 0.003, angle: 4, 
        tiltAngle: -30
    },
    { 
        element: document.getElementById('planet-4'), 
        radiusX: 450, radiusY: 140, speed: 0.002, angle: 1 
    },
    { 
        element: document.getElementById('planet-5'), 
        radiusX: 700, radiusY: 225, speed: 0.001, angle: 3
    }
];

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}





// Variabili per la posizione del mouse
let mouseX = -1000;
let mouseY = -1000;

// Raggio di attrazione del buco nero (in pixel)
const blackHoleRadius = 200; 



// Movimento del mouse
window.addEventListener('mousemove', (e) => {

    if (window.innerWidth <= 768) return;

    
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});


function animateUniverse() {
    
    let isAnyPlanetAttracted = false; // Flag per capire se il buco nero sta attirando qualcosa

    planetsConfig.forEach(planet => {
        planet.angle += planet.speed;

        // -- Calcolo Base Orbita --
        let baseTargetX = Math.cos(planet.angle) * planet.radiusX;
        let baseTargetY = Math.sin(planet.angle) * planet.radiusY;

        let finalX = baseTargetX;
        let finalY = baseTargetY;

        if (planet.tiltAngle) {
            const tiltRad = toRadians(planet.tiltAngle);
            finalX = baseTargetX * Math.cos(tiltRad) - baseTargetY * Math.sin(tiltRad);
            finalY = baseTargetX * Math.sin(tiltRad) + baseTargetY * Math.cos(tiltRad);
        }

        // --- ATTRAZIONE GRAVITAZIONALE ---

        const planetScreenX = window.innerWidth / 2 + finalX;
        const planetScreenY = window.innerHeight / 2 + finalY;

        const depth = Math.sin(planet.angle); 
        
        // Oscurità dovuta all'eclissi
        let phaseDarkness = depth > 0 ? depth * 0.85 : 0;
        let zIndex = depth < 0 ? 5 : 15;

        // Pitagora
        const dx = mouseX - planetScreenX;
        const dy = mouseY - planetScreenY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if ((distance < blackHoleRadius)&&(!isModalOpen)) {
            isAnyPlanetAttracted = true;
            
            const force = 1 - (distance / blackHoleRadius); 
            
            finalX += dx * force;
            finalY += dy * force;
            zIndex = 100; // Primo piano
            
            phaseDarkness = phaseDarkness * (1 - force);
        } else {
            // -- Calcolo Z-Index e Illuminazione (se non è attratto) --
            const depth = Math.sin(planet.angle); 
            planet.element.style.zIndex = depth < 0 ? 5 : 15;
            let phaseDarkness = depth > 0 ? depth * 0.85 : 0;
            planet.element.style.setProperty('--phase-darkness', phaseDarkness);
        }

        planet.element.style.setProperty('--phase-darkness', phaseDarkness);

        // -- Scala e Applica il Movimento --
        const depthForScale = Math.sin(planet.angle);
        const scale = 1 + (depthForScale * 0.3); 
        planet.element.style.transform = `translate(${finalX}px, ${finalY}px) scale(${scale})`;

        // -- Illuminazione --
        const angleToStar = Math.atan2(-finalY, -finalX);
        const lightX = 50 + (Math.cos(angleToStar) * 45);
        const lightY = 50 + (Math.sin(angleToStar) * 45);
        let shadowIntensity = 1 - Math.abs(depthForScale); 
        let currentMaxShadow = 30 * shadowIntensity; 
        const shadowX = Math.cos(angleToStar) * currentMaxShadow;
        const shadowY = Math.sin(angleToStar) * currentMaxShadow;

        planet.element.style.setProperty('--light-x', `${lightX}%`);
        planet.element.style.setProperty('--light-y', `${lightY}%`);
        planet.element.style.setProperty('--shadow-x', `${shadowX}px`);
        planet.element.style.setProperty('--shadow-y', `${shadowY}px`);
    });

    if (isAnyPlanetAttracted) {
        cursor.classList.add('active');
    } else {
        cursor.classList.remove('active');
    }

    requestAnimationFrame(animateUniverse);
}

animateUniverse();



let isModalOpen = false;



// --- GESTIONE MODALI ---
const overlay = document.getElementById('overlay');
const closeBtns = document.querySelectorAll('.close-btn');

function chiudiModali() {
    overlay.classList.remove('show');
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');

        isModalOpen = false;
    });
}

// Aprire il modale corretto
planetsConfig.forEach((planet, index) => {

    const modalId = `modal-${index + 1}`;
    
    planet.element.addEventListener('click', () => {
        const modalDaAprire = document.getElementById(modalId);
        if (modalDaAprire) {
            overlay.classList.add('show');
            modalDaAprire.classList.add('show');

            isModalOpen = true;
        }
    });
});

// Chiudere cliccando sulla X
closeBtns.forEach(btn => {
    btn.addEventListener('click', chiudiModali);
});

// Chiudere cliccando fuori (sull'overlay sfocato)
overlay.addEventListener('click', chiudiModali);

closeBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => cursor.classList.add('active'));
    btn.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});


// --- GESTIONE UI (Impostazioni e Cursore) ---

const uiElements = document.querySelectorAll('.cv-star-btn, .settings-toggle, .setting-btn');
uiElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// --- GESTIONE MENU LATERALE ---

const navMenu = document.querySelector('.nav-menu');
const hamburgerBtn = document.getElementById('hamburger-btn');
const navLinkBtns = document.querySelectorAll('.nav-link-btn');

// Apri/Chiudi menu
hamburgerBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});

const menuInteractiveElements = document.querySelectorAll('.hamburger, .nav-link-btn, .setting-btn');
menuInteractiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// APERTURA RAPIDA DEI MODALI DAL MENU
navLinkBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetModalId = btn.getAttribute('data-modal');
        const modalDaAprire = document.getElementById(targetModalId);
        
        if (modalDaAprire) {
            navMenu.classList.remove('open');
            
            overlay.classList.add('show');
            modalDaAprire.classList.add('show');
            
            isModalOpen = true; 
        }
    });
});