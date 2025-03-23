export function initResults() {
    const container = document.getElementById("results-output");
    const result = localStorage.getItem("karoka_result");
  
    if (container && result) {
      container.textContent = result;
    } else {
      container.textContent = "No result found. Please take the quiz first.";
    }
  }
  