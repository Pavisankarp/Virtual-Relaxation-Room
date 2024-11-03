let sounds = {};
let autoExitTimer;
let gameInterval;
let score = 0;
let bubblesPopped = 0;
let breathingInterval;
let breathingActive = false; // Flag to control breathing activity
const holdCount = 10; // Set the count for holding breath

// Function to toggle sound playback
function toggleSound(type, buttonId) {
    if (!sounds[type]) {
        sounds[type] = new Audio(`${type}.mp3`);
        sounds[type].volume = 0.5;
    }

    const button = document.getElementById(buttonId);
    if (sounds[type].paused) {
        sounds[type].play().then(() => {
            button.textContent = "Pause " + type.charAt(0).toUpperCase() + type.slice(1);
        }).catch(error => {
            console.error("Error playing sound:", error);
            alert("Sound cannot be played. Please check the file path or permissions.");
        });
    } else {
        sounds[type].pause();
        button.textContent = "Play " + type.charAt(0).toUpperCase() + type.slice(1);
    }
}

// Auto-exit after 30 minutes
function startAutoExitTimer() {
    autoExitTimer = setTimeout(() => {
        alert("Session expired. Returning to the main menu.");
        goBackToIntro();
    }, 1800000);
}

function clearAutoExitTimer() {
    clearTimeout(autoExitTimer);
}

function goBackToIntro() {
    document.querySelectorAll('.section, .options').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById("intro").style.display = "block";
    clearAutoExitTimer();
}

function showOptions() {
    document.getElementById("intro").style.display = "none";
    document.getElementById("options").style.display = "block";
    startAutoExitTimer();
}

function showSection(sectionId) {
    document.getElementById("options").style.display = "none";
    document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
    document.getElementById(sectionId).style.display = "block";
}

// Function to exit the application
function exitApp() {
    const confirmation = confirm("Are you sure you want to exit?");
    if (confirmation) {
        alert("Thank you for visiting the Virtual Relaxation Room! We hope you had a relaxing experience.");
        goBackToIntro(); // Return to intro
    }
}

function goBack() {
    document.querySelectorAll('.section').forEach(section => section.style.display = 'none');
    document.getElementById("options").style.display = "block";
    clearAutoExitTimer();
    startAutoExitTimer();
}

function showVideo(type) {
    alert(`${type} Video...`);
}

// Start the game
function startGame() {
    score = 0; // Reset score
    bubblesPopped = 0; // Reset bubbles popped
    document.getElementById("game-container").innerHTML = ''; // Clear previous bubbles
    gameInterval = setInterval(createBubble, 1000); // Create a bubble every second
}

// Create a bubble
function createBubble() {
    const gameContainer = document.getElementById("game-container");
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");

    const size = Math.random() * 30 + 20; // Random size between 20 and 50
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * (gameContainer.offsetWidth - size)}px`;
    bubble.style.top = `${Math.random() * (gameContainer.offsetHeight - size)}px`;
    bubble.style.position = 'absolute';

    // Event listener to pop bubble
    bubble.onclick = () => {
        bubble.remove(); // Remove bubble
        score += 10; // Increase score
        bubblesPopped++; // Increment bubbles popped
    };

    gameContainer.appendChild(bubble);

    // Remove the bubble after 5 seconds if not popped
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.remove();
        }
    }, 5000);
}

// Stop the game
function stopGame() {
    clearInterval(gameInterval);
    document.getElementById("game-container").innerHTML = '';
    alert(`Game stopped! Your final score is: ${score}`); // Show final score when the game stops
}

// Function to start the breathing exercise
function startBreathing() {
    if (breathingActive) return; // Prevent multiple instances

    breathingActive = true;
    const instructionDiv = document.getElementById("breathingAnimation");
    let step = 0; // Step for breathing cycle
    instructionDiv.innerHTML = ""; // Set initially blank

    function breathingCycle() {
        if (!breathingActive) return; // Stop if breathing is inactive

        if (step === 0) {
            instructionDiv.innerHTML = "Inhale..."; // Inhale for 4 seconds
            step++;
            setTimeout(breathingCycle, 4000);
        } else if (step === 1) {
            let count = holdCount;
            instructionDiv.innerHTML = `Hold your breath... ${count}`;

            // Countdown for the hold phase
            const holdInterval = setInterval(() => {
                if (!breathingActive) {
                    clearInterval(holdInterval);
                    return;
                }
                count--;
                if (count > 0) {
                    instructionDiv.innerHTML = `Hold your breath... ${count}`;
                } else {
                    clearInterval(holdInterval);
                    step++;
                    setTimeout(breathingCycle, 0); // Proceed to exhale phase
                }
            }, 1000);
        } else if (step === 2) {
            instructionDiv.innerHTML = "Exhale...";
            step = 0; // Reset to beginning of cycle after exhale
            setTimeout(() => {
                if (breathingActive) breathingCycle();
            }, 3000); // Exhale for 3 seconds, then repeat
        }
    }

    breathingCycle(); // Start the first cycle
}

// Function to stop the breathing exercise
function stopBreathing() {
    breathingActive = false; // Stop breathing cycle
    document.getElementById("breathingAnimation").innerHTML = ""; // Clear breathing instruction
    alert("Breathing exercise stopped.");
}
// Function to show About section
function showAbout() {
    document.getElementById("intro").style.display = "none";
    document.getElementById("about").style.display = "block";
}

// Function to go back to the Intro section
function goBackToIntro() {
    document.querySelectorAll('.section, .options, .about-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById("intro").style.display = "block";
}

// Function to exit to Intro page and show exit message
function exitApp() {
    alert("Thank you for visiting the Virtual Relaxation Room. Have a great day!");
    goBackToIntro(); // Ensure all sections are hidden except the intro
}

