export function initQuiz() {
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

  // Dynamically initialize scores for each unique type
  const scores = questions.reduce((acc, q) => {
    if (!(q.type in acc)) {
      acc[q.type] = 0;
    }
    return acc;
  }, {});

  // Cache DOM elements
  const container = document.getElementById("quiz-questions");
  const form = document.getElementById("quiz-form");

  // Render questions using DOM methods
  questions.forEach((q, index) => {
    const block = document.createElement("div");

    const label = document.createElement("label");
    label.innerHTML = `<strong>Q${index + 1}:</strong> ${q.text}`;
    block.appendChild(label);
    block.appendChild(document.createElement("br"));

    const input = document.createElement("input");
    input.type = "range";
    input.min = "1";
    input.max = "5";
    input.value = "3";
    input.name = `q${index}`;
    input.dataset.type = q.type;
    block.appendChild(input);

    block.appendChild(document.createElement("br"));
    block.appendChild(document.createElement("br"));

    container.appendChild(block);
  });

  // Form submission handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Reset scores for each type
    Object.keys(scores).forEach(key => (scores[key] = 0));

    // Calculate scores based on range inputs in the form
    const inputs = form.querySelectorAll("input[type='range']");
    inputs.forEach(input => {
      const type = input.dataset.type;
      const value = Number(input.value);
      scores[type] += value;
    });

    // Compute top 3 types
    const top3 = Object.entries(scores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, 3)
      .map(([type, score]) => ({
        type,
        score,
        percent: Math.round((score / 10) * 100) // Assuming a max score of 10 per type
      }));

    try {
      
      const response = await fetch("https://us-central1-<your-project-id>.cloudfunctions.net/generate_karoka_profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ top3 })
      });

      const data = await response.json();

      // Save the result in localStorage (optional for your result page)
      localStorage.setItem("karoka_result", data.result);

      // Redirect to results page
      window.location.hash = "/results";
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  });
}
