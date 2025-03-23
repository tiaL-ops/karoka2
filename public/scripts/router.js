// router.js

// Define routes mapping to component HTML files
const routes = {
  "/quiz": "components/quiz.html",
  "/results": "components/results.html",
  "/profile": "components/profile.html"
};

// The container where dynamic content is injected
const appView = document.getElementById("app-view");

async function loadRoute() {
  // Get the current route from the URL hash (default to "/" if none)
  const path = window.location.hash.replace("#", "") || "/";
  const file = routes[path];

  if (!file) {
    appView.innerHTML = "<h2>404 - Page not found</h2>";
    return;
  }

  try {
    const res = await fetch(file);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const html = await res.text();
    appView.innerHTML = html;
  } catch (error) {
    console.error("Failed to load route:", error);
    appView.innerHTML = "<h2>Error loading page</h2>";
  }

  // Optionally import route-specific JavaScript
  if (path === "/quiz") {
    import('./quiz.js').then(module => {
      if (module.initQuiz) module.initQuiz();
    });
  } else if (path === "/results") {
    import('./results.js').then(module => {
      if (module.initResults) module.initResults();
    });
  } else if (path === "/profile") {
    import('./profile.js').then(module => {
      if (module.initProfile) module.initProfile();
    });
  }
}

// Listen for page load and hash changes
window.addEventListener("load", loadRoute);
window.addEventListener("hashchange", loadRoute);
