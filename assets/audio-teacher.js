const tamilLessonGuides = {
  "Variables, values & types": "Variable-னா value-க்கு வைக்கிற பெயர். Python-ல type variable-க்கு நிரந்தரமா fix ஆகாது; அந்த நேரத்துல அதுக்குள்ள இருக்கிற value-க்குத்தான் type. age-ல 12 வச்சா int; பின்னாடி twelve-னு மாற்றினா str.",
  "Variables & naming": "Variable name-ஐ ஒரு label மாதிரி நினைச்சுக்கோங்க. score = score + 5-ல முதல்ல பழைய score value எடுத்து 5 add பண்ணி, வந்த result-ஐ score-க்கு திரும்ப assign பண்ணுறோம்.",
  "Numbers & arithmetic": "int முழு எண்களுக்கு, float decimal value-க்கு. plus, minus, multiply மாதிரி operators கொண்டு கணக்கு போடலாம்; slash division, double slash முழு quotient, percent remainder தரும்.",
  "Strings & text": "String-னா text value. String immutable; upper மாதிரி method பழைய text-ஐ மாற்றாது, மாற்றிய புதிய string-ஐ return பண்ணும். f-string-ல braces உள்ளே variable value-ஐ சேர்க்கலாம்.",
  "Strings across types: format, convert & transform": "name, age, height, is_ready எல்லாம் வேறு type values. f-string இவைகளை readable message-ஆ காட்டும்; age original-ஆ int-தான் இருக்கும். strip, title, upper புதிய string உருவாக்கும்; join list-ல இருக்கிற text-ஐ சேர்க்கும்.",
  "Collections: choose the right container": "பல value-களை சேர்த்து வைக்குறது collection. list order-ஆ இருக்கும், change பண்ணலாம்; tuple fixed. dict key-க்கு value வைச்சிருக்கும்; set duplicate-ஐ ஒரே item-ஆ வைக்கும்.",
  "Lists & tuples": "List-ல items order-ஆ இருக்கும்; append பண்ணலாம், update பண்ணலாம். Index பூஜ்ஜியத்திலிருந்து தொடங்கும். Tuple-ம் order-ஆ இருக்கும், ஆனா உருவாக்கின பிறகு மாற்ற முடியாது.",
  "Dictionaries & sets": "Dictionary-ல key கொடுத்து value எடுக்கலாம்; get பயன்படுத்தினா key இல்லாதப்போ default value கிடைக்கும். Set duplicate values-ஐ நீக்கி unique items மட்டும் வைக்கும்.",
  "Comprehensions": "Comprehension ஒரு collection-லிருந்து புதிய collection உருவாக்கும். ஒவ்வொரு item-ஐ filter பண்ணி, தேவைப்பட்டா transform பண்ணி, result-ஆ சேர்க்கும்.",
  "Conditionals: if, elif, else": "if condition முதல்ல check ஆகும். அது false-னா elif check பண்ணும்; true ஆன முதல் branch மட்டும் run ஆகும். score 82 என்றா grade B branch தேர்வு ஆகுது.",
  "Loops: for & while": "for loop ஒவ்வொரு item-ஆ எடுத்து body-ஐ திரும்ப run பண்ணும். range stop value-ஐ சேர்க்காது. while loop condition true இருக்கிற வரைக்கும் repeat ஆகும்.",
  "Classes & objects": "Class-ஐ blueprint-ஆவும் object-ஐ அதிலிருந்து உருவான instance-ஆவும் நினைச்சுக்கோங்க. Dog class-லிருந்து Mochi-யை உருவாக்கி, pet.speak call பண்ணும்போது self அந்த pet-ஐ குறிக்கும்.",
  "Functions & return values": "Function-க்கு arguments கொடுக்கிறோம்; function body வேலை செய்து return value-ஐ caller-க்கு திருப்பித் தரும். Return இல்லனா Python None தரும்.",
  "What is Playwright?": "Playwright ஒரு browser automation library. Python test command அனுப்பும்; Playwright Chromium, Firefox அல்லது WebKit browser-ஐ control பண்ணி result-ஐ திருப்பித் தரும்.",
  "Launch, page & browser context": "Browser ஒரு browser process. BrowserContext தனி cookies, storage உள்ள isolated session. அந்த context-க்குள்ள Page ஒரு tab; page.goto URL-க்கு navigate பண்ணும்.",
  "Locators & auto-waiting": "Locator page-ல element-ஐ கண்டுபிடிக்கிற வழி. click செய்யும்போது element ready ஆகும்வரை Playwright auto-wait பண்ணும்; fixed sleep தேவையில்லை.",
  "User-facing locators": "Button-ஐ CSS class-ல தேடாம, get_by_role button name Continue மாதிரி user பார்க்கிற role, label வைத்து தேடுங்க. இப்படிச் செய்தா test புரியவும் stable-ஆவும் இருக்கும்.",
  "Click, fill & keyboard actions": "Text box-க்கு fill, checkbox-க்கு check, select menu-க்கு select_option, button-க்கு click. User செய்யும் action-க்கு சரியான Playwright method-ஐ தேர்வு பண்ணுங்க.",
  "Assertions & expect": "expect assertion result வரும்வரை retry பண்ணும். Heading visible-ஆ இருக்கா அல்லது text சரியா இருக்கானு check பண்ணி, timeout முடிஞ்சா clear failure காட்டும்.",
  "Frames, popups & downloads": "Popup வரப்போகுதுனா click செய்வதற்கு முன்னாடியே page.expect_popup wait-ஐ set பண்ணுங்க. அப்புறம் click செய்து popup_info.value-ல புதிய page-ஐ எடுங்க. Download-க்கும் இதே pattern.",
  "Network requests & API testing": "முதல்ல expect_response wait-ஐ register பண்ணுங்க; பிறகு button click பண்ணுங்க. Page request அனுப்பும், server response தரும்; test status அல்லது JSON payload check பண்ணலாம்.",
  "Authentication & storage state": "ஒரு test login செய்து cookies, local storage-ஐ storage_state-ஆ save பண்ணலாம். அடுத்த isolated BrowserContext-ல அந்த state load பண்ணினா மீண்டும் login செய்ய வேண்டாம்."
};

const tamilGroupGuides = {
  "Start with Python": "Python code மேலிருந்து கீழே run ஆகும். Syntax சரியா எழுதுறதும் indentation-ல block-ஐ காட்டுறதும் முக்கியம்.",
  "Variables & value types": "Name ஒரு value-ஐ reference பண்ணும். Value-க்கு int, float, str, bool மாதிரி type இருக்கும்; பெயரை வேறு type value-க்கு மறுபடியும் assign பண்ணலாம்.",
  "Logic & decisions": "Comparison True அல்லது False தரும். if, elif, else அந்த result-ஐ வைத்து எந்த code run ஆகணும்னு தேர்வு செய்கிறது.",
  "Loops & iteration": "Iterable-லிருந்து values ஒவ்வொன்றாக எடுத்து loop body-ஐ run பண்ணுங்க. ஒவ்வொரு pass-ல variable எப்படி மாறுதுனு கவனிங்க.",
  "Collections & containers": "Data-வுக்கு ஏற்ற collection-ஐ தேர்வு செய்யுங்க: ordered list, fixed tuple, key-value dict, அல்லது unique-items set.",
  "Functions & scope": "Function inputs-ஐ parameter-ல வாங்கி, local scope-ல வேலை செய்து, return மூலம் result-ஐ caller-க்கு அனுப்பும்.",
  "Functional tools": "map ஒவ்வொரு item-ஐ transform பண்ணும்; filter condition pass ஆன items-ஐ மட்டும் வைக்கும். Simple case-ல comprehension-ம் பயன்படுத்தலாம்.",
  "Modules & packages": "Module ஒரு Python file; package related modules-ஐ group பண்ணும். import மூலம் தேவையான code-ஐ reuse பண்ணலாம்.",
  "Object-oriented Python": "Class data, behavior-ஐ define பண்ணும்; instance தனக்கான state-ஐ வைத்திருக்கும். Inheritance is-a; composition has-a relationship.",
  "Errors & resource handling": "Exception வந்தா matching handler-க்கு போகலாம். File மாதிரி resource-ஐ with block-ல திறந்தா முடிவில் சரியாக close ஆகும்.",
  "Iteration & async": "Iterator அடுத்த value-ஐ ஒவ்வொன்றாக தரும். Async operation await-ல நிற்கும்போது event loop வேற task-ஐ run பண்ண முடியும்.",
  "Functions & reusable behavior": "Decorator existing function-ஐ wrap பண்ணி கூடுதல் behavior சேர்க்கும்; original function-ஐ நேரடியாக மாற்ற வேண்டியதில்லை.",
  "Testing & tooling": "சிறிய test எழுதுங்க, failure-ஐ reproduce பண்ணுங்க, interpreter மற்றும் package environment சரியா இருக்கானு verify பண்ணுங்க.",
  "Browser setup & lifecycle": "Playwright package, browser binary இரண்டும் தேவை. Browser process-க்குள்ள isolated context உருவாக்கி, அதில் page/tab திறக்கிறோம்.",
  "Test structure & verification": "Test arrange, act, assert pattern-ல எழுதுங்க. User பார்க்கிற result-ஐ verify பண்ணிட்டு resource cleanup-ஐ மறக்காதீங்க.",
  "Finding elements": "Role, accessible name, label அல்லது stable test id வைத்து locator உருவாக்குங்க. Locator action நடக்கும்போது element-ஐ resolve பண்ணும்.",
  "User actions": "Playwright API browser-க்கு click அல்லது fill command அனுப்பும். expect assertion UI update ஆகும்வரை retry பண்ணும்.",
  "Pytest & isolation": "Pytest fixture ஒவ்வொரு test-க்கும் page/context தயார் பண்ணி முடிவில் cleanup பண்ணும். Tests ஒன்றை ஒன்று சாராமல் இருக்கட்டும்.",
  "Navigation & page events": "Navigation அல்லது popup event வருவதற்கு முன்னாடியே wait-ஐ register பண்ணுங்க; பிறகு trigger action செய்யுங்க.",
  "Network & authentication": "Page request அனுப்பும்போது matching response-க்காக wait பண்ணி status/payload check பண்ணலாம். Login state-ஐ storage_state-ஆ save பண்ணலாம்.",
  "Debugging & delivery": "Trace, screenshot, browser settings எல்லாம் failure-ஐ புரிஞ்சுக்க உதவும். CI-ல browser versions-ஐ consistent-ஆ வைத்துக்கோங்க."
};

function createLessonNarration(lesson, isPlaywright, language) {
  if (language === "ta") {
    const exact = tamilLessonGuides[lesson.title];
    if (exact) return exact;
    const group = curriculumSubgroup(lesson.title, isPlaywright);
    const guide = tamilGroupGuides[group];
    if (guide) return `சரி, இப்போ ${lesson.title} concept-ஐ பாக்கலாம். ${guide}`;
    if (lesson.intro) return `சரி, இப்போ ${lesson.title} concept-ஐ பாக்கலாம். ${lesson.intro} ${lesson.bullets?.join(". ") || ""} ${lesson.tip || ""}`;
    return `சரி, இப்போ ${lesson.title} concept-ஐ பாக்கலாம். Code example-ஐ படிச்சு, ஒவ்வொரு step-ல value எப்படி மாறுதுனு கவனிங்க.`;
  }
  return [
    lesson.title,
    lesson.theory || lesson.intro,
    lesson.analogy || lesson.tip,
    lesson.goal || lesson.heading
  ].filter(Boolean).join(". ");
}

function setupLessonAudio(getLesson, isPlaywright) {
  const button = document.getElementById("audio-button");
  const languageSelect = document.getElementById("audio-language");
  const status = document.getElementById("audio-status");
  const languageKey = "sathishram-audio-language";
  let activeUtterance = null;
  let voiceCheckTimer = null;
  const savedLanguage = localStorage.getItem(languageKey);
  languageSelect.value = savedLanguage === "ta" ? "ta" : "en";

  function tamilVoice() {
    return window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("ta"));
  }

  function showTamilVoiceHelp() {
    const isWindows = /Win/i.test(navigator.platform || navigator.userAgent);
    status.replaceChildren();
    status.appendChild(document.createTextNode(isWindows
      ? "No Tamil speech voice is installed. In Language & region, add Tamil and install its Speech feature. "
      : "No Tamil speech voice is installed. Install a Tamil text-to-speech voice in your device settings, then check again. "));
    if (isWindows) {
      const settingsLink = document.createElement("a");
      settingsLink.className = "audio-install-link";
      settingsLink.href = "ms-settings:regionlanguage";
      settingsLink.textContent = "Open language settings";
      status.appendChild(settingsLink);
    }
    const retry = document.createElement("button");
    retry.className = "audio-retry-button";
    retry.type = "button";
    retry.textContent = "Check again";
    retry.addEventListener("click", checkTamilVoice);
    status.append(" · ", retry);
  }

  function checkTamilVoice() {
    if (languageSelect.value !== "ta" || !("speechSynthesis" in window)) return;
    if (voiceCheckTimer) window.clearTimeout(voiceCheckTimer);
    if (tamilVoice()) {
      status.textContent = "Tamil speech voice found. You can now teach this lesson in Tamil.";
      return;
    }
    if (!window.speechSynthesis.getVoices().length) {
      status.textContent = "Checking installed speech voices…";
      voiceCheckTimer = window.setTimeout(() => {
        if (languageSelect.value === "ta" && !tamilVoice()) showTamilVoiceHelp();
      }, 1500);
      return;
    }
    showTamilVoiceHelp();
  }

  function setButton(isSpeaking) {
    button.innerHTML = `${schoolIcon(isSpeaking ? "stop" : "volume")}<span>${isSpeaking ? "Stop audio" : "Teach this lesson"}</span>`;
  }

  function stopAudio(message) {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    activeUtterance = null;
    setButton(false);
    if (message) status.textContent = message;
  }

  languageSelect.addEventListener("change", () => {
    localStorage.setItem(languageKey, languageSelect.value);
    stopAudio("Audio language changed.");
    if (languageSelect.value === "ta") checkTamilVoice();
  });
  if ("speechSynthesis" in window) {
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      if (languageSelect.value === "ta") checkTamilVoice();
    });
  }
  if (languageSelect.value === "ta") checkTamilVoice();
  button.addEventListener("click", () => {
    if (activeUtterance) {
      stopAudio("Audio stopped.");
      return;
    }
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      status.textContent = "Audio is not supported by this browser.";
      return;
    }
    const language = languageSelect.value;
    const utterance = new SpeechSynthesisUtterance(createLessonNarration(getLesson(), isPlaywright, language));
    utterance.lang = language === "ta" ? "ta-IN" : "en-US";
    utterance.rate = 0.92;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((item) => item.lang.toLowerCase().startsWith(language === "ta" ? "ta" : "en"));
    if (language === "ta" && !voice) {
      checkTamilVoice();
      return;
    }
    if (voice) utterance.voice = voice;
    utterance.onstart = () => {
      activeUtterance = utterance;
      setButton(true);
      status.textContent = `Teaching in ${language === "ta" ? "Tamil" : "English"}.`;
    };
    utterance.onend = () => {
      if (activeUtterance !== utterance) return;
      activeUtterance = null;
      setButton(false);
      status.textContent = "Lesson audio finished.";
    };
    utterance.onerror = (event) => {
      if (activeUtterance !== utterance) return;
      activeUtterance = null;
      setButton(false);
      status.textContent = `Audio playback failed: ${event.error}.`;
    };
    status.textContent = "Preparing lesson audio...";
    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  });

  return { stop: () => stopAudio("") };
}
