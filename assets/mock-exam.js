(() => {
  const byId = (id) => document.getElementById(id);
  const stopWords = new Set("about after again also and are because been being between both but can could does doing done each either for from had has have how into its just like many may more most much must not our out over same should some such than that the their them then there these they this those through too under until use used using very was were what when where which while who why will with would your you".split(" "));
  let questionIndex = -1;
  let programIndex = -1;
  let bestQuestionIndex = -1;
  let questionCount = 0;
  let score = 0;
  let bestQuestionCount = 0;
  let bestScore = 0;
  let bestAnswered = false;
  const bestAnswerQuestions = allLessons.filter((lesson) =>
    lesson.quiz && Array.isArray(lesson.quiz.options) && lesson.quiz.options.length > 1
      && Number.isInteger(lesson.quiz.answer) && lesson.quiz.answer >= 0
      && lesson.quiz.answer < lesson.quiz.options.length
  );
  let speechRecognition = null;
  let activeWorker = null;
  let activeRunTimeout = null;
  let speechActive = false;

  function chooseNextIndex(length, previous) {
    if (length < 2) return 0;
    let next = previous;
    while (next === previous) next = Math.floor(Math.random() * length);
    return next;
  }

  function startMockExam() {
    if (questionIndex < 0) nextQuestion();
    if (programIndex < 0) nextProgram();
    if (bestQuestionIndex < 0) nextBestQuestion();
  }

  function nextQuestion() {
    questionIndex = chooseNextIndex(interviewQuestions.length, questionIndex);
    const [category, question] = interviewQuestions[questionIndex];
    byId("mock-question-title").textContent = question;
    byId("mock-question-position").textContent = `${category} | Round ${questionCount + 1} | Score ${score}/${questionCount}`;
    byId("mock-answer").value = "";
    byId("mock-feedback").hidden = true;
    byId("mock-feedback").textContent = "";
  }

  function nextProgram() {
    if (activeWorker) activeWorker.terminate();
    activeWorker = null;
    if (activeRunTimeout) window.clearTimeout(activeRunTimeout);
    activeRunTimeout = null;
    byId("mock-run-code").disabled = false;
    programIndex = chooseNextIndex(interviewPrograms.length, programIndex);
    const program = interviewPrograms[programIndex];
    byId("mock-code-title").textContent = program.title;
    byId("mock-program-category").textContent = `${program.category} | ${program.difficulty}`;
    byId("mock-program-prompt").textContent = program.prompt;
    byId("mock-code").value = "# Write your Python solution here\n";
    byId("mock-solution-code").textContent = program.code;
    byId("mock-run-output").textContent = "Output will appear here.";
    byId("mock-runtime-status").textContent = "Python runtime loads when you run a solution.";
    byId("mock-runtime-status").classList.remove("error", "success");
  }

  function nextBestQuestion() {
    bestQuestionIndex = chooseNextIndex(bestAnswerQuestions.length, bestQuestionIndex);
    const lesson = bestAnswerQuestions[bestQuestionIndex];
    const quiz = lesson.quiz;
    const options = byId("mock-best-options");
    byId("mock-best-question-title").textContent = quiz.question;
    byId("mock-best-question-position").textContent = `${lesson.chapter || lesson.category} · Question ${bestQuestionCount + 1}`;
    byId("mock-best-feedback").hidden = true;
    byId("mock-best-feedback").textContent = "";
    byId("mock-next-best").disabled = true;
    byId("mock-finish-best").disabled = true;
    bestAnswered = false;
    options.replaceChildren(...quiz.options.map((label, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mock-best-option";
      button.textContent = label;
      button.addEventListener("click", () => evaluateBestAnswer(index));
      return button;
    }));
    byId("mock-best-score").textContent = `Score: ${bestScore} / ${bestQuestionCount}`;
  }

  function evaluateBestAnswer(selectedIndex) {
    if (bestAnswered) return;
    bestAnswered = true;
    bestQuestionCount += 1;
    const lesson = bestAnswerQuestions[bestQuestionIndex];
    const answerIndex = lesson.quiz.answer;
    const options = byId("mock-best-options");
    [...options.children].forEach((button, index) => {
      button.disabled = true;
      if (index === answerIndex) button.classList.add("correct");
      else if (index === selectedIndex) button.classList.add("incorrect");
    });
    const feedback = byId("mock-best-feedback");
    feedback.hidden = false;
    if (selectedIndex === answerIndex) {
      bestScore += 1;
      feedback.className = "mock-feedback success";
      feedback.textContent = "Correct. " + (lesson.goal || "You selected the best answer.");
    } else {
      feedback.className = "mock-feedback needs-work";
      feedback.textContent = `Not quite. Review: ${lesson.tip || lesson.intro}`;
    }
    byId("mock-best-question-position").textContent = `${lesson.chapter || lesson.category} · Question ${bestQuestionCount}`;
    byId("mock-best-score").textContent = `Score: ${bestScore} / ${bestQuestionCount}`;
    byId("mock-next-best").disabled = false;
    byId("mock-finish-best").disabled = false;
  }

  function finishVoicePractice() {
    const panel = byId("mock-voice-panel");
    const feedback = byId("mock-feedback");
    panel.querySelector(".mock-panel-heading").lastElementChild.textContent = `${questionCount} questions reviewed`;
    byId("mock-question-title").textContent = "Voice practice complete";
    panel.querySelector(".mock-answer-label").hidden = true;
    byId("mock-answer").hidden = true;
    panel.querySelector(".mock-actions").hidden = true;
    byId("mock-speech-status").hidden = true;
    feedback.hidden = false;
    feedback.className = "mock-feedback success";
    feedback.replaceChildren(document.createTextNode(`You covered ${score} of ${questionCount} answers. Your score is a keyword-match estimate; compare the reference answers to assess depth and accuracy. `));
    const restart = document.createElement("button");
    restart.type = "button";
    restart.className = "resource-action";
    restart.textContent = "Practice again";
    restart.addEventListener("click", () => {
      questionCount = 0;
      score = 0;
      questionIndex = -1;
      panel.querySelector(".mock-panel-heading").lastElementChild.textContent = "";
      panel.querySelector(".mock-answer-label").hidden = false;
      byId("mock-answer").hidden = false;
      panel.querySelector(".mock-actions").hidden = false;
      byId("mock-speech-status").hidden = false;
      feedback.hidden = true;
      nextQuestion();
    }, { once: true });
    feedback.append(restart);
  }

  function finishBestExam() {
    const panel = byId("mock-best-panel");
    byId("mock-best-question-position").textContent = `${bestQuestionCount} questions answered`;
    byId("mock-best-question-title").textContent = "Exam complete";
    byId("mock-best-options").hidden = true;
    byId("mock-best-feedback").hidden = true;
    byId("mock-best-score").textContent = `Final score: ${bestScore} / ${bestQuestionCount}`;
    byId("mock-next-best").hidden = true;
    byId("mock-finish-best").hidden = true;
    const restart = document.createElement("button");
    restart.type = "button";
    restart.className = "resource-action primary-action";
    restart.textContent = "Start a new exam";
    restart.addEventListener("click", () => {
      bestQuestionCount = 0;
      bestScore = 0;
      bestQuestionIndex = -1;
      byId("mock-best-options").hidden = false;
      byId("mock-next-best").hidden = false;
      byId("mock-finish-best").hidden = false;
      restart.remove();
      nextBestQuestion();
    }, { once: true });
    panel.querySelector(".mock-actions").append(restart);
  }

  function setMockMode(mode, moveFocus = false) {
    const voiceMode = mode === "voice";
    const voiceTab = byId("mock-voice-tab");
    const bestTab = byId("mock-best-tab");
    voiceTab.setAttribute("aria-selected", String(voiceMode));
    voiceTab.tabIndex = voiceMode ? 0 : -1;
    bestTab.setAttribute("aria-selected", String(!voiceMode));
    bestTab.tabIndex = voiceMode ? -1 : 0;
    byId("mock-voice-panel").hidden = !voiceMode;
    byId("mock-best-panel").hidden = voiceMode;
    if (moveFocus) (voiceMode ? voiceTab : bestTab).focus();
  }

  function evaluateAnswer() {
    const answer = byId("mock-answer").value.trim().toLowerCase();
    const reference = interviewQuestions[questionIndex][2].toLowerCase();
    const expected = [...new Set(reference.match(/[a-z][a-z0-9_+#.-]{3,}/g) || [])].filter((word) => !stopWords.has(word));
    const tokens = new Set(answer.match(/[a-z][a-z0-9_+#.-]{3,}/g) || []);
    const matched = expected.filter((word) => tokens.has(word));
    const coverage = expected.length ? matched.length / expected.length : 0;
    const percent = Math.round(coverage * 100);
    const feedback = byId("mock-feedback");
    feedback.hidden = false;
    if (!answer) {
      feedback.className = "mock-feedback needs-work";
      feedback.textContent = "Write or dictate an answer first.";
      return;
    }
    questionCount += 1;
    if (percent >= 35) score += 1;
    byId("mock-question-position").textContent = `${interviewQuestions[questionIndex][0]} | Round ${questionCount} | Score ${score}/${questionCount}`;
    feedback.className = `mock-feedback ${percent >= 35 ? "success" : "needs-work"}`;
    feedback.textContent = `${percent >= 65 ? "Strong answer" : percent >= 35 ? "Partly covered" : "Needs more detail"} | matched ${matched.length} of ${expected.length} key terms. ${percent >= 35 ? "You covered useful points." : "Add the central ideas and explain how they work."} Reference answer: ${interviewQuestions[questionIndex][2]}`;
  }

  function setupSpeechInput() {
    const SpeechApi = window.SpeechRecognition || window.webkitSpeechRecognition;
    const button = byId("mock-speech-button");
    if (!SpeechApi) {
      button.disabled = true;
      byId("mock-speech-status").textContent = "Speech recognition is not available in this browser. You can type your answer.";
      return;
    }
    speechRecognition = new SpeechApi();
    speechRecognition.lang = "en-US";
    speechRecognition.interimResults = true;
    speechRecognition.continuous = false;
    speechRecognition.onresult = (event) => {
      byId("mock-answer").value = Array.from(event.results).map((result) => result[0].transcript).join("");
    };
    speechRecognition.onerror = (event) => {
      speechActive = false;
      button.textContent = "Answer by voice";
      byId("mock-speech-status").textContent = `Speech input stopped: ${event.error}. You can type your answer.`;
    };
    speechRecognition.onend = () => {
      speechActive = false;
      button.textContent = "Answer by voice";
      if (byId("mock-answer").value.trim()) byId("mock-speech-status").textContent = "Speech transcribed. Review or edit it, then check your answer.";
    };
    button.addEventListener("click", () => {
      if (speechActive) {
        speechRecognition.stop();
        return;
      }
      try {
        byId("mock-speech-status").textContent = "Listening...";
        button.textContent = "Stop listening";
        speechActive = true;
        speechRecognition.start();
      } catch (error) {
        speechActive = false;
        button.textContent = "Answer by voice";
        byId("mock-speech-status").textContent = "Could not start speech input. Check microphone access or type your answer.";
      }
    });
  }

  async function runProgram() {
    const code = byId("mock-code").value;
    const status = byId("mock-runtime-status");
    const output = byId("mock-run-output");
    if (!code.trim() || code.length > 12000) {
      status.textContent = code.trim() ? "Keep the solution under 12,000 characters." : "Write a solution before running it.";
      status.classList.add("error");
      return;
    }
    if (activeWorker) activeWorker.terminate();
    if (activeRunTimeout) window.clearTimeout(activeRunTimeout);
    activeRunTimeout = null;
    const button = byId("mock-run-code");
    button.disabled = true;
    status.classList.remove("error", "success");
    status.textContent = "Starting the browser Python runtime. First start may take a little while.";
    output.textContent = "Running your code against the sample output...";
    const program = interviewPrograms[programIndex];
    const expected = program.output.replace(/\r\n/g, "\n").trim();
    activeWorker = new Worker("../assets/python-runner-worker.js");
    const worker = activeWorker;
    activeRunTimeout = window.setTimeout(() => {
      worker.terminate();
      if (activeWorker === worker) activeWorker = null;
      activeRunTimeout = null;
      button.disabled = false;
      status.textContent = "Execution stopped after 30 seconds.";
      status.classList.add("error");
      output.textContent = "The sample check timed out. Remove long-running loops and try again.";
    }, 30000);
    worker.onmessage = (event) => {
      clearTimeout(activeRunTimeout);
      activeRunTimeout = null;
      worker.terminate();
      if (activeWorker === worker) activeWorker = null;
      button.disabled = false;
      if (!event.data.ok) {
        status.textContent = "Python raised an error.";
        status.classList.add("error");
        output.textContent = event.data.error;
        return;
      }
      output.textContent = event.data.output || "(no output)";
      if (event.data.output.trim() === expected) {
        status.textContent = "Sample check passed. Add more cases to check edge conditions.";
        status.classList.add("success");
      } else {
        status.textContent = "Sample check did not match. Compare your output with the expected result.";
        status.classList.add("error");
        output.textContent = `Your output:\n${event.data.output || "(no output)"}\n\nExpected sample output:\n${expected}`;
      }
    };
    worker.onerror = (event) => {
      clearTimeout(activeRunTimeout);
      activeRunTimeout = null;
      worker.terminate();
      if (activeWorker === worker) activeWorker = null;
      button.disabled = false;
      status.textContent = "Could not start Python. Open this site from a local web server and check your internet connection.";
      status.classList.add("error");
      output.textContent = event.message || "Worker startup failed.";
    };
    worker.postMessage({ code });
  }

  byId("mock-grade-button").addEventListener("click", evaluateAnswer);
  byId("mock-next-question").addEventListener("click", nextQuestion);
  byId("mock-finish-voice").addEventListener("click", finishVoicePractice);
  byId("mock-voice-tab").addEventListener("click", () => setMockMode("voice"));
  byId("mock-best-tab").addEventListener("click", () => setMockMode("best"));
  byId("mock-next-best").addEventListener("click", nextBestQuestion);
  byId("mock-finish-best").addEventListener("click", finishBestExam);
  document.querySelector('[role="tablist"][aria-label="Mock exam mode"]').addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextMode = event.key === "Home" || event.key === "ArrowLeft" ? "voice" : "best";
    setMockMode(nextMode, true);
  });
  byId("mock-next-program").addEventListener("click", nextProgram);
  byId("mock-run-code").addEventListener("click", runProgram);
  setupSpeechInput();
  window.startMockExam = startMockExam;
})();
