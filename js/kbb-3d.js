// Basic Three.js scene setup
const container = document.getElementById('game-canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(20, 50, 20);
scene.add(directionalLight);

// Materials
const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.8, emissive: 0x000000 });
const paperMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, emissive: 0x000000 });
const scissorsMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0, roughness: 0.4, emissive: 0x000000 });

// Rock
const rockGeometry = new THREE.IcosahedronGeometry(0.8, 1);
const rock = new THREE.Mesh(rockGeometry, rockMaterial);
rock.name = "Búa";
rock.position.x = -3;
scene.add(rock);

// Paper
const paperGeometry = new THREE.PlaneGeometry(1.5, 2);
const paper = new THREE.Mesh(paperGeometry, paperMaterial);
paper.name = "Bao";
scene.add(paper);

// Scissors
const scissorsShape = new THREE.Shape();
// handles
scissorsShape.moveTo(0, 0);
scissorsShape.absarc(0.25, 0.35, 0.2, Math.PI * 1.5, Math.PI * 3.5);
scissorsShape.moveTo(0,0);
scissorsShape.absarc(0.25, -0.35, 0.2, Math.PI * 0.5, Math.PI * 2.5);
//blades
scissorsShape.moveTo(0.4, 0.15);
scissorsShape.lineTo(1.1, 0.35);
scissorsShape.lineTo(0.4, 0.1);
scissorsShape.moveTo(0.4, -0.15);
scissorsShape.lineTo(1.1, -0.35);
scissorsShape.lineTo(0.4, -0.1);

const extrudeSettings = { depth: 0.1, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.03, bevelThickness: 0.03 };
const scissorsGeometry = new THREE.ExtrudeGeometry(scissorsShape, extrudeSettings);
const scissors = new THREE.Mesh(scissorsGeometry, scissorsMaterial);
scissors.name = "Kéo";
scissors.position.x = 3;
scissors.rotation.z = -Math.PI / 8;
scene.add(scissors);

const choices3D = [rock, paper, scissors];
const choiceObjects = {
    "Búa": rock,
    "Bao": paper,
    "Kéo": scissors
};

camera.position.z = 5;

// Raycaster for interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let INTERSECTED;

function onMouseMove(event) {
    mouse.x = (event.clientX / container.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / container.clientHeight) * 2 + 1;
}

function onMouseClick(event) {
    if (INTERSECTED) {
        handleSelection(INTERSECTED);
    }
}

function handleSelection(selectedObject) {
    if (!isGameActive) return;
    isGameActive = false; // Prevent further selections
    
    container.removeEventListener('mousemove', onMouseMove);
    if(INTERSECTED) {
        gsap.to(INTERSECTED.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
        gsap.to(INTERSECTED.material.emissive, { r: 0, g: 0, b: 0, duration: 0.3 });
        INTERSECTED = null;
    }

    const playerSelection = selectedObject.name;
    // We need the computer's choice right away to know which object to animate in.
    const computerSelection = computerChoice(); 
    
    const tl = gsap.timeline({
        onComplete: () => {
            // The core game logic is called after the initial animations.
            handleGameLogic(playerSelection, computerSelection).then(() => {
                // After logic, trigger result animations.
                const result = resultText.textContent;
                const playerChoiceObj = selectedObject;
                const computerChoiceObj = scene.getObjectByName("computerChoice");

                if (!computerChoiceObj) return;

                const resultTl = gsap.timeline({
                    onComplete: () => {
                        // Cleanup scene after result animations
                        if (result.includes("thắng")) {
                            scene.remove(computerChoiceObj);
                        } else if (result.includes("thua")) {
                            scene.remove(playerChoiceObj);
                        }
                    }
                });

                if (result.includes("Bạn thắng!")) {
                    // Player wins: Computer's object scales down and vanishes.
                    resultTl.to(computerChoiceObj.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: "back.in(1.7)" }, "+=0.5");
                    resultTl.to(playerChoiceObj.position, { y: 1.5, yoyo: true, repeat: 1, duration: 0.3, ease: "power1.inOut" }); // Victory bounce
                } else if (result.includes("BOT thắng!")) {
                    // Player loses: Player's object scales down and vanishes.
                    resultTl.to(playerChoiceObj.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: "back.in(1.7)" }, "+=0.5");
                     resultTl.to(computerChoiceObj.position, { y: 1.5, yoyo: true, repeat: 1, duration: 0.3, ease: "power1.inOut" }); // Victory bounce
                } else {
                    // Draw: Objects bump into each other.
                    resultTl.to(playerChoiceObj.position, { x: -1.5, duration: 0.3, ease: "power1.inOut" }, "+=0.5");
                    resultTl.to(computerChoiceObj.position, { x: 1.5, duration: 0.3, ease: "power1.inOut" }, "-=0.3");
                    resultTl.to([playerChoiceObj.position, computerChoiceObj.position], { x: (i) => i === 0 ? -2 : 2, duration: 0.5, ease: "bounce.out" });
                }
            });
        }
    });

    // 1. Animate out non-selected items
    choices3D.forEach(choice => {
        if (choice !== selectedObject) {
            tl.to(choice.scale, { x: 0, y: 0, z: 0, duration: 0.5, ease: "back.in(1.7)" }, 0);
        }
    });

    // 2. Animate selected item to player position
    tl.to(selectedObject.position, { x: -2, y: 1, z: 0, duration: 0.7, ease: "power2.out" }, 0.5);
    tl.to(selectedObject.rotation, { x: 0, y: 0, z: 0, duration: 0.7, ease: "power2.out" }, 0.5);

    // 3. Create and animate computer's choice
    const computerChoiceObj = choiceObjects[computerSelection].clone();
    computerChoiceObj.name = "computerChoice"; // Name it for later retrieval
    computerChoiceObj.position.set(2, 1, 0); // Start at its final y-position
    computerChoiceObj.scale.set(0, 0, 0); // Start invisible
    scene.add(computerChoiceObj);
    
    playerChoiceDiv.textContent = choiceEmojis[playerSelection];
    computerChoiceDiv.textContent = choiceEmojis[computerSelection];

    tl.to(computerChoiceObj.scale, { x: 1, y: 1, z: 1, duration: 0.7, ease: "back.out(1.7)" }, 0.8);
}


container.addEventListener('click', onMouseClick, false);
container.addEventListener('mousemove', onMouseMove, false);


// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Hover effect
    if (isGameActive) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(choices3D);

        if (intersects.length > 0) {
            if (INTERSECTED != intersects[0].object) {
                if (INTERSECTED) {
                    gsap.to(INTERSECTED.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
                    gsap.to(INTERSECTED.material.emissive, { r: 0, g: 0, b: 0, duration: 0.3 });
                }
                INTERSECTED = intersects[0].object;
                gsap.to(INTERSECTED.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.3 });
                gsap.to(INTERSECTED.material.emissive, { r: 0.1, g: 0.1, b: 0.1, duration: 0.3 });
            }
        } else {
            if (INTERSECTED) {
                gsap.to(INTERSECTED.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
                gsap.to(INTERSECTED.material.emissive, { r: 0, g: 0, b: 0, duration: 0.3 });
            }
            INTERSECTED = null;
        }
    }

    // Initial rotation for the choices
    choices3D.forEach(choice => {
        if(choice.scale.x > 0) { // Only rotate if visible
            choice.rotation.y += 0.005;
        }
    });

    // Rotation for the computer's choice after it appears
    const computerChoiceObj = scene.getObjectByName("computerChoice");
    if(computerChoiceObj) {
        computerChoiceObj.rotation.y -= 0.005;
    }


    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
});
