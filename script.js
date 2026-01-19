/*
  COMP 10259 – Assignment 3
  Name: Mahtabin Tushi
  Student Number: 000952184
  File: script.js
  Description: JavaScript functionality for Image Randomizer App — handles image switching, animation, refresh interval, and counters.
*/

// 2D array of image paths (3 themes, 3 images each)
const images = [
  ["images/cat1.png", "images/cat2.png", "images/cat3.png"],
  ["images/dog1.png", "images/dog2.png", "images/dog3.png"],
  ["images/star1.png", "images/star2.png", "images/star3.png"]
];

let refreshInterval = 5000;  // Default auto-refresh time (ms)
let countdown = refreshInterval;
let counter = 0;  // Tracks total number of image changes
let timerId, refreshId;  // IDs for setInterval and setTimeout

// DOM elements
const timerEl = document.getElementById("timer");
const counterEl = document.getElementById("counter");
const inputEl = document.getElementById("refreshInterval");
const randomizeBtn = document.getElementById("randomizeBtn");

/**
 * Picks a random image from a specified theme group.
 * @param {number} group - Index of the theme (0–2)
 * @returns {string} - Path to a randomly selected image
 */
function getRandomFromGroup(group) {
  const index = Math.floor(Math.random() * 3);
  return images[group][index];
}

/**
 * Replaces the 3 displayed images with 1 random image from each group.
 * Adds 3 to the image change counter.
 */
function displayRandomImages() {
  const usedImages = new Set();
  const selectedImages = [];

  for (let group = 0; group < 3; group++) {
    let img;
    do {
      const index = Math.floor(Math.random() * 3);
      img = images[group][index];
    } while (usedImages.has(img)); // make sure no duplicates

    usedImages.add(img);
    selectedImages.push(img);
  }

  document.getElementById("img1").src = selectedImages[0];
  document.getElementById("img2").src = selectedImages[1];
  document.getElementById("img3").src = selectedImages[2];

  counter += 3;
  updateCounter();
}



/**
 * Updates the displayed image change counter text.
 */
function updateCounter() {
  counterEl.textContent = `Images changed: ${counter}`;
}

/**
 * Stops any active timers and restarts the countdown.
 */
function resetCountdown() {
  clearInterval(timerId);
  clearTimeout(refreshId);
  countdown = refreshInterval;
  startTimer();
}

/**
 * Starts a countdown timer that triggers image randomization on completion.
 * Updates the UI color as time progresses.
 */
function startTimer() {
  timerId = setInterval(() => {
    countdown -= 100;
    updateTimerUI();

    if (countdown <= 0) {
      clearInterval(timerId);
      displayRandomImages();
      resetCountdown();
    }
  }, 100);
}

/**
 * Dynamically updates the timer text and background colors
 * based on remaining countdown time.
 */
function updateTimerUI() {
  const sec = (countdown / 1000).toFixed(1);
  timerEl.textContent = `Next refresh in: ${sec}s`;

  if (countdown > refreshInterval * 0.5) {
    timerEl.style.backgroundColor = "green";
    timerEl.style.color = "white";
  } else if (countdown > refreshInterval * 0.2) {
    timerEl.style.backgroundColor = "yellow";
    timerEl.style.color = "black";
  } else {
    timerEl.style.backgroundColor = "red";
    timerEl.style.color = "white";
  }
}

/**
 * Validates user input for refresh interval and updates the timer.
 */
function validateInterval() {
  const value = parseInt(inputEl.value);
  if (!isNaN(value) && value >= 500 && value <= 10000) {
    refreshInterval = value;
    resetCountdown();
  } else {
    alert("Please enter a value between 500 and 10000 milliseconds.");
  }
}

/**
 * Animation handler for image click.
 * Plays spin animation, changes image to a random one,
 * resets timer, and increments counter.
 * @param {Event} event - Click event object
 */
function doAnimation(event) {
  const target = event.target;

  // Restart animation by removing and re-adding class
  target.classList.remove('spin');
  setTimeout(() => {
    target.classList.add('spin');
  }, 0);

  // Change image source to a random image from all groups
  const allImages = images.flat();
  const newSrc = allImages[Math.floor(Math.random() * allImages.length)];
  target.src = newSrc;

  // Update image change count and reset timer
  counter++;
  updateCounter();
  resetCountdown();
}

/**
 * Initialization logic on page load:
 * - Displays initial images
 * - Starts countdown
 * - Adds event listeners
 */
window.onload = function () {
  displayRandomImages();
  startTimer();

  // Add click event to all images
  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("click", doAnimation);
  });

  // Refresh interval input validation
  inputEl.addEventListener("change", validateInterval);

  // Manual randomize button
  randomizeBtn.addEventListener("click", () => {
    displayRandomImages();
    resetCountdown();
  });
};
