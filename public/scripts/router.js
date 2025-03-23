const routes = {
    "/quiz": "components/quiz.html",
    "/results": "components/results.html",
    "/profile": "components/profile.html"
  };
  
  const appView = document.getElementById("app-view");
  
  async function loadRoute() {
    const path = window.location.hash.replace("#", "") || "/";
    const file = routes[path];
  
    if (!file) {
      appView.innerHTML = "<h2>404 - Page not found</h2>";
      return;
    }
  
    const res = await fetch(file);
    const html = await res.text();
    appView.innerHTML = html;
  
    // Dynamically import logic per route
    if (path === "/quiz") {
      import('./quiz.js').then(module => module.initQuiz());
    }
  }
  
  window.addEventListener("load", loadRoute);
  window.addEventListener("hashchange", loadRoute);
  