/**
 * Kéo Búa Bao - Visual Effects
 */

// Initialize Vanilla Tilt
VanillaTilt.init(document.querySelectorAll(".game-rules, .honey-banner"), {
    max: 10,
    speed: 400,
    glare: true,
    "max-glare": 0.2
});

VanillaTilt.init(document.querySelectorAll(".battle-arena"), {
    max: 5,
    speed: 400,
    glare: true,
    "max-glare": 0.1
});

// Mouse Trail Effect
const trailContainer = document.getElementById('mouse-trail-container');
const colors = ['#FFD700', '#FF4500', '#FFFFFF', '#FFA500'];

document.addEventListener('mousemove', (e) => {
    createTrail(e.clientX, e.clientY);
});

function createTrail(x, y) {
    if (Math.random() < 0.5) return; // Limit particles

    const particle = document.createElement('div');
    particle.className = 'trail-particle';

    // Random visual properties
    const size = Math.random() * 8 + 2;
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.background = color;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    trailContainer.appendChild(particle);

    // Animation
    const destinationX = x + (Math.random() - 0.5) * 50;
    const destinationY = y + (Math.random() - 0.5) * 50;

    const animation = particle.animate([
        { transform: `translate(0, 0) scale(1)`, opacity: 0.8 },
        { transform: `translate(${destinationX - x}px, ${destinationY - y}px) scale(0)`, opacity: 0 }
    ], {
        duration: 800,
        easing: 'cubic-bezier(0, .9, .57, 1)',
        delay: Math.random() * 100
    });

    animation.onfinish = () => particle.remove();
}

// Falling Apricot Blossoms (Hoa Mai)
const particlesContainer = document.getElementById('particles-container');

function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';

    // Random properties
    const startLeft = Math.random() * 100;
    const duration = Math.random() * 5000 + 5000;
    const size = Math.random() * 15 + 10;
    const rotate = Math.random() * 360;

    petal.style.left = `${startLeft}vw`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.transform = `rotate(${rotate}deg)`;
    petal.innerHTML = '🌸'; // Using emoji for simplicity, or could use SVG
    // For Tet (Yellow Apricot), we might want to style it yellow via CSS filter or just use a yellow element

    // Alternative: Simple yellow circle/shape if emoji doesn't fit 'Mai' flower well
    // Let's stick to the class styling to make it look like a yellow petal
    petal.innerHTML = '';

    particlesContainer.appendChild(petal);

    // Animate
    const animation = petal.animate([
        { transform: `translateY(-10px) rotate(${rotate}deg)`, opacity: 0 },
        { transform: `translateY(10vh) rotate(${rotate + 180}deg)`, opacity: 1, offset: 0.2 },
        { transform: `translateY(105vh) rotate(${rotate + 720}deg)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'linear'
    });

    animation.onfinish = () => petal.remove();
}

// Start loop
setInterval(createPetal, 300);
