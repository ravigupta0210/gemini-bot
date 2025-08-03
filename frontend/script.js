const startBtn = document.getElementById('start-btn');
const transcriptDiv = document.getElementById('transcript');

const synth = window.speechSynthesis;
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-IN';
recognition.interimResults = false;
recognition.continuous = false; // we'll handle looping manually

// 🧹 Clean Gemini response before speaking
function cleanTextForSpeech(text) {
  return text
    .replace(/\/\/.*$/gm, '')      // remove comments
    .replace(/[`*_#>~]/g, '')      // remove markdown symbols
    .replace(/\/+/g, '')           // remove forward slashes
    .replace(/\\+/g, '')           // remove backslashes
    .replace(/\s{2,}/g, ' ')       // collapse extra spaces
    .trim();
}

// 🎤 Start listening on button click
startBtn.onclick = () => {
  transcriptDiv.textContent = '🎤 Listening...';
  recognition.start();
};

// 🎙️ When speech is recognized
recognition.onresult = async (event) => {
  const spokenText = event.results[0][0].transcript;
  transcriptDiv.innerHTML += `<div><strong>You:</strong> ${spokenText}</div>`;

  try {
    const response = await fetch('http://localhost:5050/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: spokenText }),
    });

    const data = await response.json();
    const reply = data.reply || 'Sorry, I couldn’t understand that.';

    const cleaned = cleanTextForSpeech(reply);
    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = 'en-IN';

    // 🎵 Use nicer voice (Google Indian voice if available)
    const voices = synth.getVoices();
    const indianVoice = voices.find(v => v.name.includes("Google") && v.lang === 'en-IN');
    if (indianVoice) utterance.voice = indianVoice;

    // 🔁 Restart listening after speaking
    utterance.onend = () => {
      transcriptDiv.innerHTML += `<div style="color: gray;">🎤 Listening again...</div>`;
      recognition.start();
    };

    synth.speak(utterance);
    transcriptDiv.innerHTML += `<div><strong>🤖:</strong> ${reply}</div>`;
  } catch (err) {
    transcriptDiv.innerHTML += `<div>❌ Could not get response from Gemini.</div>`;
    console.error(err);
  }
};

// 🎧 Handle mic errors
recognition.onerror = (e) => {
  transcriptDiv.innerHTML += `<div>❌ Mic error: ${e.error}</div>`;
};

recognition.onaudiostart = () => console.log('🎙️ Audio started');
recognition.onspeechstart = () => console.log('🗣️ Speech started');
recognition.onspeechend = () => console.log('🔇 Speech ended');
