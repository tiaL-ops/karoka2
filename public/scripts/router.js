// router.js

const routes = {
    "/quiz": "components/quiz.html",
    "/results": "components/results.html",
    "/profile": "components/profile.html",
    "/modify": "components/modify.html",
  };
  
  const appView = document.getElementById("app-view");
  const staticSection = document.querySelector("section");
  const competitionGrid = document.getElementById("competition-container");
  const filterButtons = document.getElementById("filter-buttons");
  
  async function loadRoute() {
    const path = window.location.hash.replace("#", "") || "/";
    console.log("Current route:", path);
  
    if (path !== "/") {
      console.log("Hiding static components.");
      staticSection?.classList.add("hidden");
      competitionGrid?.classList.add("hidden");
      filterButtons?.classList.add("hidden");
    } else {
      console.log("Showing static components.");
      staticSection?.classList.remove("hidden");
      competitionGrid?.classList.remove("hidden");
      filterButtons?.classList.remove("hidden");
    }
  
    const file = routes[path];
    if (!file) {
      // Show a 404 message if no route is found.
      if (path !== "/") {
        appView.innerHTML = "<h2>404 - Page not found</h2>";
      }
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
  
    if (path === "/quiz") {
      import("./quiz.js").then(module => {
        if (module.initQuiz) module.initQuiz();
      });
    } else if (path === "/results") {
      import("./results.js").then(module => {
        if (module.initResults) module.initResults();
      });
    } else if (path === "/profile") {
      import("./profile.js").then(module => {
        if (module.initProfile) module.initProfile();
      });
    } else if (path === "/modify") {
      // Modify-specific code if needed.
    }
  }
  
  window.addEventListener("load", loadRoute);
  window.addEventListener("hashchange", loadRoute);
  