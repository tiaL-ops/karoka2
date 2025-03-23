const questions = [
    { text: "I like learning by doing, not reading.", type: "finisher" },
    { text: "I often copy how others do things.", type: "mirror" },
    { text: "I feel better when I follow a plan.", type: "strategist" },
    { text: "I’d rather support than lead.", type: "shadow" },
    { text: "I learn best when I’m relaxed.", type: "giant" },
    { text: "I naturally take the lead.", type: "visionary" },
    { text: "I improve by practicing a lot.", type: "climber" },
    { text: "I get bored without challenge.", type: "finisher" },
    { text: "I enjoy performing or presenting.", type: "mirror" },
    { text: "I notice small details others miss.", type: "strategist" },
    { text: "I love being the team glue.", type: "shadow" },
    { text: "I step up when needed, not before.", type: "giant" },
    { text: "I recognize talent in others.", type: "visionary" },
    { text: "I grow through hard work.", type: "climber" }
  ];
  
  const scores = {
    finisher: 0,
    mirror: 0,
    strategist: 0,
    shadow: 0,
    giant: 0,
    visionary: 0,
    climber: 0
  };
  
  const form = document.getElementById("quiz-form");
  const container = document.getElementById("quiz-questions");
  const results = document.getElementById("results");
  
  // Render quiz
  questions.forEach((q, index) => {
    const block = document.createElement("div");
    block.innerHTML = `
      <label><strong>Q${index + 1}:</strong> ${q.text}</label><br/>
      <input type="range" min="1" max="5" value="3" name="q${index}" data-type="${q.type}">
      <br><br>
    `;
    container.appendChild(block);
  });
  
  // Handle submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Reset scores
    for (let type in scores) scores[type] = 0;
  
    const inputs = document.querySelectorAll("input[type='range']");
    inputs.forEach(input => {
      const type = input.dataset.type;
      scores[type] += parseInt(input.value);
    });
  
    // Sort and pick top 3
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top3 = sorted.slice(0, 3).map(([type, score]) => ({
      type,
      score,
      percent: Math.round((score / 10) * 100)
    }));
  
    // Call GPT via Firebase Function
    const response = await fetch("https://YOUR_PROJECT.cloudfunctions.net/generateKarokaProfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ top3 })
    });
  
    const data = await response.json();
    results.innerText = data.result;
  });
  