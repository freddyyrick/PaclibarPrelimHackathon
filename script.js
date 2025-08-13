const questions = [
    {
        question: "🌍 What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        answer: "Paris"
    },
    {
        question: "🪐 Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        answer: "Mars"
    },
    {
        question: "🧬 What is the powerhouse of the cell?",
        options: ["Nucleus", "Ribosome", "Mitochondrion", "Chloroplast"],
        answer: "Mitochondrion"
    }
];

let currentQuestionIndex = 0;
let score = 0;

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreText = document.getElementById('score-text');
const progressBar = document.getElementById('progress-bar');
const quizContent = document.getElementById('quiz-content');
const resultsContainer = document.getElementById('results-container');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const darkModeToggle = document.getElementById('dark-mode-toggle');

const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    optionsContainer.innerHTML = '';

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option, button));
        optionsContainer.appendChild(button);
    });

    updateProgress();
}

function checkAnswer(selectedOption, buttonElement) {
    const correctAnswer = questions[currentQuestionIndex].answer;
    if (selectedOption === correctAnswer) {
        score++;
        correctSound.play();
        buttonElement.classList.add('correct');
    } else {
        wrongSound.play();
        buttonElement.classList.add('wrong');
    }
    scoreText.textContent = `Score: ${score}`;

    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 600);
}

function updateProgress() {
    const progressPercentage = (currentQuestionIndex / questions.length) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function showResults() {
    // Get the header element
    const quizHeader = document.querySelector('.quiz-header');
    
    // Fade out quiz content and header
    quizContent.style.opacity = '0';
    quizContent.style.transform = 'translateY(-20px)';
    if (quizHeader) {
        quizHeader.style.opacity = '0';
        quizHeader.style.transform = 'translateY(-20px)';
    }

    setTimeout(() => {
        // Hide quiz content and header
        quizContent.style.display = 'none';
        if (quizHeader) {
            quizHeader.style.display = 'none';
        }
        
        resultsContainer.style.display = 'block';
        
        // Set initial state for fade in
        resultsContainer.style.opacity = '0';
        resultsContainer.style.transform = 'translateY(20px)';
        
        // Trigger fade in
        setTimeout(() => {
            resultsContainer.style.opacity = '1';
            resultsContainer.style.transform = 'translateY(0)';
            finalScore.textContent = `🎉 Congratulations! You scored ${score} out of ${questions.length}.`;
            
            // Stop game music
            gameMusic.pause();
            gameMusic.currentTime = 0;

            // Play mission complete music
            endMusic.play();
        }, 50);
    }, 300);
}


restartBtn.addEventListener('click', () => {
    // Stop any music
    gameMusic.pause();
    gameMusic.currentTime = 0;
    endMusic.pause();
    endMusic.currentTime = 0;

    // Reset score & question index
    currentQuestionIndex = 0;
    score = 0;
    scoreText.textContent = `Score: 0`;

    // Get the header element
    const quizHeader = document.querySelector('.quiz-header');

    // Fade out results container
    resultsContainer.style.opacity = '0';
    resultsContainer.style.transform = 'translateY(-20px)';

    setTimeout(() => {
        // Hide results & quiz
        resultsContainer.style.display = 'none';
        quizContent.style.display = 'none';
        
        // Show and reset header
        if (quizHeader) {
            quizHeader.style.display = 'flex';
            quizHeader.style.opacity = '1';
            quizHeader.style.transform = 'translateY(0)';
        }
        
        // Show and fade in start screen
        startScreen.style.display = 'flex';
        startScreen.style.opacity = '0';
        startScreen.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            startScreen.style.opacity = '1';
            startScreen.style.transform = 'translateY(0)';
        }, 50);
    }, 300);
});


/* ---------- DARK MODE WITH SAVE ---------- */
function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-mode', isDark);
    darkModeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Change the video source based on theme
    const bgVideo = document.getElementById('bg-video');
    bgVideo.src = isDark ? 'darkspace.mp4' : 'whitespace.mp4';
    bgVideo.load(); // Reload the video with new source
    bgVideo.play(); // Start playing the new video
}

(function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
        applyTheme(saved);
    } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }
})();

darkModeToggle.addEventListener('click', () => {
    const isCurrentlyDark = document.body.classList.contains('dark-mode');
    applyTheme(isCurrentlyDark ? 'light' : 'dark');
});

const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const startSound = document.getElementById('start-sound');
const gameMusic = document.getElementById('game-music');
const endMusic = document.getElementById('end-music');
const bgVideo = document.getElementById('bg-video');

// Initial load
// Start button click
startBtn.addEventListener('click', () => {
    // Add fade out class to start screen
    startScreen.style.opacity = '0';
    startScreen.style.transform = 'translateY(-20px)';
    
    // Play start sound and game music
    startSound.play();
    gameMusic.play();
    
    // Wait for fade out animation
    setTimeout(() => {
        startScreen.style.display = 'none';
        quizContent.style.display = 'block';
        
        // Fade in quiz content
        setTimeout(() => {
            quizContent.style.opacity = '1';
            quizContent.style.transform = 'translateY(0)';
            // Load the first question
            loadQuestion();
        }, 50);
    }, 300);
});

document.addEventListener('DOMContentLoaded', () => {
    // Sound control setup
    const soundToggle = document.getElementById('sound-toggle');
    let isMuted = false;

    // Function to update sound states
    function updateSoundState(muted) {
        isMuted = muted;
        soundToggle.textContent = isMuted ? '🔇' : '🔊';
        soundToggle.classList.toggle('muted', isMuted);
        
        // Update all audio elements
        [startSound, gameMusic, endMusic].forEach(audio => {
            if (audio) {
                audio.muted = isMuted;
            }
        });
    }

    // Sound toggle click handler
    soundToggle.addEventListener('click', () => {
        updateSoundState(!isMuted);
    });

    // Initialize game elements
    startBtn.addEventListener('click', () => {
        // Hide start screen and show quiz section
        startScreen.style.display = 'none';
        quizContent.style.display = 'block';
        // Play start sound and game music if not muted
        if (!isMuted) {
            startSound.play();
            gameMusic.play();
        }
        // Load the first question
        loadQuestion();
    });
});


