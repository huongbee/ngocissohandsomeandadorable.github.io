let currentPage = 1;
let readingScore = 0; // Store the reading score globally
let userAnswers = {}; // Store user's answers globally
let studentName = ""; // Store the student's name
let readingTimer; // Timer for reading tasks
let writingTimer; // Timer for writing tasks

// Start Quiz Button
document.getElementById('startQuiz').addEventListener('click', function () {
  const studentName = document.getElementById('studentName').value;

  if (studentName.trim() !== '') {
    // Hide the welcome page
    document.querySelector('.welcome-page').style.display = 'none';

    // Show the timer
    document.getElementById('timer').style.display = 'block';

    // Show the reading task
    document.querySelector('.reading-task').style.display = 'block';
  } else {
    alert('Please enter your name to begin.');
  }
  // Start the reading timer
  startReadingTimer(60); // 60 minutes for reading tasks
});

// Function to start the reading timer
function startReadingTimer(minutes) {
  let timeLeft = minutes * 60; // Convert minutes to seconds
  readingTimer = setInterval(() => {
    const minutesLeft = Math.floor(timeLeft / 60);
    const secondsLeft = timeLeft % 60;
    document.getElementById('timeLeft').textContent = `${minutesLeft}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(readingTimer);
      alert("Time's up for the reading tasks! Moving to the writing tasks...");
      moveToWritingTasks();
    }
  }, 1000);
}

// Move to Writing Button
document.getElementById('moveToWriting').addEventListener('click', () => {
  // Stop the reading timer
  clearInterval(readingTimer);

  // Calculate reading score before moving to writing tasks
  const answers = {
    q1: 'a', q2: 'b', q3: 'c', q4: 'a', q5: 'b', q6: 'c', q7: 'a', q8: 'b', q9: 'c', q10: 'a',
    q11: 'b', q12: 'c', q13: 'a', q14: 'b', q15: 'c', q16: 'a', q17: 'b', q18: 'c', q19: 'a', q20: 'b',
    q21: 'c', q22: 'a', q23: 'b', q24: 'c', q25: 'a', q26: 'b', q27: 'c', q28: 'a', q29: 'b', q30: 'c',
    q31: 'a', q32: 'b', q33: 'c', q34: 'a', q35: 'b', q36: 'c', q37: 'a', q38: 'b', q39: 'c', q40: 'a'
  };

  readingScore = 0;

  for (const [key, value] of Object.entries(answers)) {
    const selected = document.querySelector(`input[name="${key}"]:checked`);
    const feedbackSpans = document.querySelectorAll(`input[name="${key}"] + .feedback`);
    feedbackSpans.forEach(span => span.classList.remove('correct', 'incorrect'));
    if (selected) {
      userAnswers[key] = selected.value; // Store user's answer
      if (selected.value === value) {
        readingScore++;
        selected.nextElementSibling.classList.add('correct');
      } else {
        selected.nextElementSibling.classList.add('incorrect');
        document.querySelector(`input[name="${key}"][value="${value}"]`)
          .nextElementSibling.classList.add('correct');
      }
    } else {
      userAnswers[key] = null; // No answer selected
      document.querySelector(`input[name="${key}"][value="${value}"]`)
        .nextElementSibling.classList.add('correct');
    }
  }

  alert(`Your reading score: ${readingScore}/${Object.keys(answers).length}`);

  // Transition to the writing task page
  document.querySelector('.reading-task').style.display = 'none';
  document.querySelector('.writing-task').style.display = 'block';

  // Start the writing timer
  startWritingTimer(60); // 60 minutes for writing tasks
});

// Function to move to writing tasks
function moveToWritingTasks() {
  document.querySelector('.reading-task').style.display = 'none';
  document.querySelector('.writing-task').style.display = 'block';

  // Start the writing timer
  startWritingTimer(60); // 60 minutes for writing tasks
}

// Function to start the writing timer
function startWritingTimer(minutes) {
  let timeLeft = minutes * 60; // Convert minutes to seconds
  writingTimer = setInterval(() => {
    const minutesLeft = Math.floor(timeLeft / 60);
    const secondsLeft = timeLeft % 60;
    document.getElementById('timeLeft').textContent = `${minutesLeft}:${secondsLeft < 10 ? '0' : ''}${secondsLeft}`;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(writingTimer);
      alert("Time's up for the writing tasks! Submitting your quiz...");
      submitWritingTasks();
    }
  }, 1000);
}

// Submit Writing Button
document.getElementById('submitWriting').addEventListener('click', () => {
  // Stop the writing timer
  clearInterval(writingTimer);

  // Get the values from the textareas
  const email = document.querySelectorAll('textarea')[0].value;
  const essay = document.querySelectorAll('textarea')[1].value;

  // Determine writing task status
  const task1Status = email.trim() ? "Completed" : "Incomplete";
  const task2Status = essay.trim() ? "Completed" : "Incomplete";

  // Combine quiz results and writing task
  const payload = {
    studentName: studentName,
    readingScore: readingScore,
    answers: userAnswers,
    emailContent: email,
    essayContent: essay
  };

  // Send the data to your HTTP server
  fetch('https://your-infinityfree-domain.com/vstep_results.php', { // Replace with your actual InfinityFree URL
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: document.getElementById("studentName").value,
      score: readingScore,
      task1: task1Status,
      task2: task2Status
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      alert("Results submitted successfully!");
    } else {
      alert("Error: " + data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("An error occurred while submitting your quiz.");
  });
  

// Review Answers Button
document.getElementById('reviewAnswers').addEventListener('click', () => {
  // Show the reading task section again
  document.querySelector('.results-page').style.display = 'none';
  document.querySelector('.reading-task').style.display = 'block';
});

// Navigation Buttons
document.getElementById('nextPage').addEventListener('click', () => {
  if (currentPage < 4) {
    document.getElementById(`page${currentPage}`).style.display = 'none';
    document.getElementById(`readingText${currentPage}`).style.display = 'none';
    currentPage++;
    document.getElementById(`page${currentPage}`).style.display = 'block';
    document.getElementById(`readingText${currentPage}`).style.display = 'block';
  }
  if (currentPage === 4) {
    document.getElementById('nextPage').style.display = 'none';
    document.getElementById('moveToWriting').style.display = 'inline-block';
  }
});

document.getElementById('prevPage').addEventListener('click', () => {
  if (currentPage > 1) {
    document.getElementById(`page${currentPage}`).style.display = 'none';
    document.getElementById(`readingText${currentPage}`).style.display = 'none';
    currentPage--;
    document.getElementById(`page${currentPage}`).style.display = 'block';
    document.getElementById(`readingText${currentPage}`).style.display = 'block';
  }
  document.getElementById('nextPage').style.display = 'inline-block';
  document.getElementById('moveToWriting').style.display = 'none';
});

// Function to update word count
function updateWordCount(taskType) {
  let textarea, wordCountElement;

  if (taskType === 'email') {
    textarea = document.getElementById('emailTextarea');
    wordCountElement = document.getElementById('emailWordCount');
  } else if (taskType === 'essay') {
    textarea = document.getElementById('essayTextarea');
    wordCountElement = document.getElementById('essayWordCount');
  }

  // Get the value of the textarea and split by spaces to count words
  const text = textarea.value.trim();
  const wordCount = text === '' ? 0 : text.split(/\s+/).length;

  // Update the word count display
  wordCountElement.textContent = wordCount;
}
