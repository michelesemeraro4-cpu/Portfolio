// Selezioniamo il cursore e il contenitore
const cursor = document.querySelector('.cursor'); // Il tuo cursore "buco nero"

// 1. Definiamo le orbite per ogni pianeta
// Configurazione dei 5 pianeti (i radius corrispondono alla metà della width/height nel CSS)
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
        tiltAngle: -30 // QUESTO È NUOVO: L'inclinazione in gradi dell'orbita 3
    },
    { 
        element: document.getElementById('planet-4'), 
        radiusX: 450, radiusY: 140, speed: 0.002, angle: 1 
    },
    { 
        element: document.getElementById('planet-5'), 
        radiusX: 700, radiusY: 225, speed: 0.001, angle: 3 // Raggio molto largo
    }
];

// Funzione di utilità per convertire i gradi in radianti
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}
/*
function animateUniverse() {
    
    planetsConfig.forEach(planet => {
        planet.angle += planet.speed;

        // 1. Calcolo Base (Orbita Orizzontale)
        let baseTargetX = Math.cos(planet.angle) * planet.radiusX;
        let baseTargetY = Math.sin(planet.angle) * planet.radiusY;

        let finalX = baseTargetX;
        let finalY = baseTargetY;

        // 2. Se l'orbita è inclinata, applichiamo la rotazione 2D alle coordinate!
        if (planet.tiltAngle) {
            const tiltRad = toRadians(planet.tiltAngle);
            // Formule della matrice di rotazione 2D:
            finalX = baseTargetX * Math.cos(tiltRad) - baseTargetY * Math.sin(tiltRad);
            finalY = baseTargetX * Math.sin(tiltRad) + baseTargetY * Math.cos(tiltRad);
        }

        // 3. Profondità e Scala (usiamo l'angolo base per calcolare la Z-Index)
        const depth = Math.sin(planet.angle); 
        const scale = 1 + (depth * 0.3); 
        
        // Z-index: 5 (dietro la stella), 15 (davanti alla stella)
        planet.element.style.zIndex = depth < 0 ? 5 : 15;

        // 4. Applichiamo il movimento al CSS
        planet.element.style.transform = `translate(${finalX}px, ${finalY}px) scale(${scale})`;

        // --- INIZIO ILLUMINAZIONE DINAMICA ---
        
        // --- 1. L'ANGOLO VERSO LA STELLA ---
        const angleToStar = Math.atan2(-finalY, -finalX);

        // --- 2. LA LUCE (punta verso la stella) ---
        const lightX = 50 + (Math.cos(angleToStar) * 45);
        const lightY = 50 + (Math.sin(angleToStar) * 45);

        
        // Eclissi: se il pianeta è davanti (depth > 0) si oscura fino all'85%. Se è dietro, oscurità a 0.
        let phaseDarkness = depth > 0 ? depth * 0.85 : 0;
        
        // L'ombra sui bordi: è fortissima ai lati dell'orbita (mezza luna) e scompare davanti/dietro
        let shadowIntensity = 1 - Math.abs(depth); 
        
        // Abbiamo aumentato l'ombra massima da 12 a 30 per renderla molto più evidente
        let currentMaxShadow = 30 * shadowIntensity; 
        
        // RISOLTO IL BUG: Tolto il segno "-" per mettere l'ombra sul lato corretto!
        const shadowX = Math.cos(angleToStar) * currentMaxShadow;
        const shadowY = Math.sin(angleToStar) * currentMaxShadow;

        // --- 4. APPLICHIAMO LE VARIABILI AL CSS ---
        planet.element.style.setProperty('--light-x', `${lightX}%`);
        planet.element.style.setProperty('--light-y', `${lightY}%`);
        planet.element.style.setProperty('--shadow-x', `${shadowX}px`);
        planet.element.style.setProperty('--shadow-y', `${shadowY}px`);
        planet.element.style.setProperty('--phase-darkness', phaseDarkness);
        
        // --- FINE ILLUMINAZIONE DINAMICA ---
    });

    requestAnimationFrame(animateUniverse);
}
*/
// Inizializziamo il sistema






// 1. Variabili per la posizione del mouse
let mouseX = -1000;
let mouseY = -1000;

// Raggio di attrazione del buco nero (in pixel)
const blackHoleRadius = 200; 



// 2. Ascoltiamo il movimento del mouse
window.addEventListener('mousemove', (e) => {

    if (window.innerWidth <= 768) return;

    
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Muoviamo il cursore personalizzato
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});

// 3. Modifichiamo la funzione animateUniverse() per includere l'attrazione
function animateUniverse() {
    
    let isAnyPlanetAttracted = false; // Flag per capire se il buco nero sta attirando qualcosa

    planetsConfig.forEach(planet => {
        planet.angle += planet.speed;

        // -- Calcolo Base Orbita (Come prima) --
        let baseTargetX = Math.cos(planet.angle) * planet.radiusX;
        let baseTargetY = Math.sin(planet.angle) * planet.radiusY;

        let finalX = baseTargetX;
        let finalY = baseTargetY;

        if (planet.tiltAngle) {
            const tiltRad = toRadians(planet.tiltAngle);
            finalX = baseTargetX * Math.cos(tiltRad) - baseTargetY * Math.sin(tiltRad);
            finalY = baseTargetX * Math.sin(tiltRad) + baseTargetY * Math.cos(tiltRad);
        }

        // --- LA MAGIA: ATTRAZIONE GRAVITAZIONALE ---

        // 1. Calcoliamo la posizione REALE del pianeta sullo schermo
        // finalX/Y sono relativi al centro della finestra. Aggiungiamo metà finestra per avere coordinate globali.
        const planetScreenX = window.innerWidth / 2 + finalX;
        const planetScreenY = window.innerHeight / 2 + finalY;

        // 1. Calcolo la profondità e l'oscurità BASE (orbitale)
        const depth = Math.sin(planet.angle); 
        
        // Oscurità normale dovuta all'eclissi
        let phaseDarkness = depth > 0 ? depth * 0.85 : 0;
        let zIndex = depth < 0 ? 5 : 15;

        // 2. Calcoliamo la distanza tra il Pianeta e il Mouse (Pitagora)
        const dx = mouseX - planetScreenX;
        const dy = mouseY - planetScreenY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 3. Se il mouse è vicino...
        if ((distance < blackHoleRadius)&&(!isModalOpen)) {
            isAnyPlanetAttracted = true;
            
            const force = 1 - (distance / blackHoleRadius); 
            
            // Spostiamo il pianeta
            finalX += dx * force;
            finalY += dy * force;
            zIndex = 100; // Lo portiamo sempre in primissimo piano
            
            // LA MAGIA: Riduciamo l'oscurità in proporzione alla forza di attrazione!
            // Più lo tiri a te (force vicina a 1), più l'oscurità si avvicina a 0.
            phaseDarkness = phaseDarkness * (1 - force);
        } else {
            // -- Calcolo Z-Index e Illuminazione normale (se non è attratto) --
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

        // -- Illuminazione (Come prima) --
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

    // Cambiamo l'aspetto del cursore se sta attirando qualcosa
    if (isAnyPlanetAttracted) {
        cursor.classList.add('active');
    } else {
        cursor.classList.remove('active');
    }

    requestAnimationFrame(animateUniverse);
}

animateUniverse();



let isModalOpen = false; // NUOVA VARIABILE: Traccia se un modale è aperto



// --- 5. GESTIONE MODALI ---
const overlay = document.getElementById('overlay');
const closeBtns = document.querySelectorAll('.close-btn');

// Funzione per chiudere tutto
function chiudiModali() {
    overlay.classList.remove('show');
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('show');

        isModalOpen = false;
    });
}

// 1. Aprire il modale corretto cliccando il pianeta
planetsConfig.forEach((planet, index) => {
    // Usiamo index + 1 perché i nostri id sono modal-1, modal-2, ecc.
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

// 2. Chiudere cliccando sulle X
closeBtns.forEach(btn => {
    btn.addEventListener('click', chiudiModali);
});

// 3. Chiudere cliccando fuori (sull'overlay sfocato)
overlay.addEventListener('click', chiudiModali);

// --- BONUS: Effetto cursore sulle X di chiusura ---
closeBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => cursor.classList.add('active'));
    btn.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});


// --- 6. GESTIONE UI (Impostazioni e Cursore) ---

// Aggiungiamo i nuovi elementi cliccabili alla lista di quelli che ingrandiscono il cursore
const uiElements = document.querySelectorAll('.cv-star-btn, .settings-toggle, .setting-btn');
uiElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// --- 6. GESTIONE MENU LATERALE ---

const navMenu = document.querySelector('.nav-menu');
const hamburgerBtn = document.getElementById('hamburger-btn');
const navLinkBtns = document.querySelectorAll('.nav-link-btn');

// Apri/Chiudi l'hamburger menu
hamburgerBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
});

// Aggiungiamo hover effect al cursore su tutti i nuovi bottoni
const menuInteractiveElements = document.querySelectorAll('.hamburger, .nav-link-btn, .setting-btn');
menuInteractiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// APERTURA RAPIDA DEI MODALI DAL MENU
navLinkBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Leggiamo l'attributo data-modal (es. "modal-1")
        const targetModalId = btn.getAttribute('data-modal');
        const modalDaAprire = document.getElementById(targetModalId);
        
        if (modalDaAprire) {
            // 1. Chiudiamo il menu laterale
            navMenu.classList.remove('open');
            
            // 2. Apriamo l'overlay e il modale richiesto
            overlay.classList.add('show');
            modalDaAprire.classList.add('show');
            
            // 3. Fermiamo l'attrazione gravitazionale
            isModalOpen = true; 
        }
    });
});