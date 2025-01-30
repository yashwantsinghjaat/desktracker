// Common Utility: Format Time (HH:MM:SS or MM:SS)
function formatTime(seconds, showHours = true) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;
    return showHours
        ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
        : `${String(minutes).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// Main Timer Logic
let mainTimerInterval;
let mainTime = 0;

function setMainTimer() {
    const userTime = document.getElementById('user-time')?.value;
    if (!userTime) return;

    const timeParts = userTime.split(':');
    if (timeParts.length === 3) {
        const [hrs, mins, secs] = timeParts.map((part) => parseInt(part) || 0);
        mainTime = hrs * 3600 + mins * 60 + secs;
        document.getElementById('main-timer').innerText = formatTime(mainTime);
    }
}

function startMainTimer() {
    if (mainTime > 0 && !mainTimerInterval) {
        mainTimerInterval = setInterval(() => {
            if (mainTime > 0) {
                mainTime--;
                document.getElementById('main-timer').innerText = formatTime(mainTime);
            } else {
                stopMainTimer();
                alert("Main Timer Finished!");
            }
        }, 1000);
    }
}

function stopMainTimer() {
    clearInterval(mainTimerInterval);
    mainTimerInterval = null;
}

function resetMainTimer() {
    stopMainTimer();
    mainTime = 0;
    document.getElementById('main-timer').innerText = "00:00:00";
    document.getElementById('user-time').value = "";
}

// Stopwatch Logic
let stopwatchTime = 0;
let stopwatchInterval = null;

function startStopwatch() {
    if (stopwatchInterval) return;
    stopwatchInterval = setInterval(() => {
        stopwatchTime++;
        updateStopwatchDisplay(stopwatchTime);
    }, 1000);
}

function stopStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
}

function resetStopwatch() {
    stopStopwatch();
    stopwatchTime = 0;
    updateStopwatchDisplay(stopwatchTime);
}

function updateStopwatchDisplay(time) {
    const stopwatchDisplay = document.getElementById('stopwatch-display');
    if (stopwatchDisplay) {
        stopwatchDisplay.innerText = formatTime(time);
    }
}

// Break Timer Logic
let breakTimerInterval; // To store the interval ID
let breakTimeRemaining = 300; // Default: 5 minutes in seconds (5 * 60)

function startTimer() {
    const timerDisplay = document.getElementById('timer');
    const taskSuggestion = document.getElementById('break-task-suggestion');
    
    if (breakTimerInterval) {
        // Prevent multiple intervals from starting
        clearInterval(breakTimerInterval);
    }

    breakTimerInterval = setInterval(() => {
        if (breakTimeRemaining > 0) {
            breakTimeRemaining--;
            const minutes = Math.floor(breakTimeRemaining / 60).toString().padStart(2, '0');
            const seconds = (breakTimeRemaining % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${minutes}:${seconds}`;
        } else {
            clearInterval(breakTimerInterval);
            taskSuggestion.textContent = "Break is over! Time to get back to work!";
        }
    }, 1000); // Update every second
}

function stopTimer() {
    clearInterval(breakTimerInterval);
}

function resetTimer() {
    clearInterval(breakTimerInterval);
    breakTimeRemaining = 300; // Reset to 5 minutes
    document.getElementById('timer').textContent = "05:00";
    document.getElementById('break-task-suggestion').textContent = "Take a short walk or stretch!";
}

// Background Upload Logic
function uploadBackground() {
    const file = document.getElementById('upload-background')?.files[0];
    const background = document.getElementById('background');
    if (!file || !background) return;

    if (file.type.includes('image')) {
        background.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Background">`;
    } else if (file.type.includes('video')) {
        background.innerHTML = `<video src="${URL.createObjectURL(file)}" autoplay loop muted></video>`;
    } else {
        alert("Unsupported background file type!");
    }
}

// Music Logic
let music = null;

function uploadMusic() {
    const file = document.getElementById('upload-music')?.files[0];
    if (file) {
        music = new Audio(URL.createObjectURL(file));
    } else {
        alert("No music file selected!");
    }
}

function playMusic() {
    if (music) music.play();
    else alert("No music uploaded!");
}

function pauseMusic() {
    if (music) music.pause();
}

// Function to toggle the menu visibility
function toggleMenu() {
    const menu = document.getElementById("menu-options");
    if (menu.classList.contains("hidden")) {
      menu.classList.remove("hidden");
      menu.style.display = "block";
    } else {
      menu.classList.add("hidden");
      menu.style.display = "none";
    }
}
  
  // Function to toggle specific features
function toggleFeature(featureId) {
    const feature = document.getElementById(featureId);
    const container = document.getElementById("features-container");
  
    if (feature.classList.contains("hidden")) {
      feature.classList.remove("hidden");
      container.classList.remove("hidden"); // Show the container if it's hidden
    } else {
      feature.classList.add("hidden");
      // Hide the container if all features inside are hidden
      const allHidden = Array.from(container.children).every((child) => 
        child.classList.contains("hidden")
      );
      if (allHidden) {
        container.classList.add("hidden");
      }
    }
}

// Timer Color Logic
function changeTimerColor() {
    const color = document.getElementById('color-picker')?.value;
    document.getElementById('main-timer')?.style.setProperty('color', color);
}

// Weather Update Logic
async function fetchWeather() {
    const weatherElement = document.getElementById('weather');
    try {
        const response = await fetch('https://api.weatherapi.com/v1/current.json?key=f7cd48c33ff14fe6b21211010251801&q=auto:ip');
        if (!response.ok) throw new Error("Weather API request failed.");

        const weatherData = await response.json();
        const { name } = weatherData.location;
        const { temp_c, condition } = weatherData.current;
        weatherElement.innerText = `Location: ${name}, Temp: ${temp_c}°C, ${condition.text}`;
    } catch (error) {
        weatherElement.innerText = "Unable to fetch weather.";
    }
}

// Initialize Weather
fetchWeather();
