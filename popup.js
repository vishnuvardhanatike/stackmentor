document.addEventListener("DOMContentLoaded", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  let list = document.getElementById("stackList");

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {

      let clues = [];

      const scripts = Array.from(document.scripts).map(s => s.src.toLowerCase());
      const html = document.documentElement.innerHTML.toLowerCase();

      // 🔍 CLUE COLLECTION
      scripts.forEach(src => {
        if (src.includes("react")) clues.push("react");
        if (src.includes("next")) clues.push("nextjs");
        if (src.includes("vue")) clues.push("vue");
        if (src.includes("angular")) clues.push("angular");
        if (src.includes("analytics") || src.includes("gtag")) clues.push("analytics");
        if (src.includes("graphql")) clues.push("graphql");
      });

      if (html.includes("react")) clues.push("react");
      if (html.includes("next")) clues.push("nextjs");

      document.querySelectorAll("link").forEach(link => {
        let href = (link.href || "").toLowerCase();
        if (href.includes("bootstrap")) clues.push("bootstrap");
        if (href.includes("font")) clues.push("icons");
      });

      if (window.fetch) clues.push("api");
      if (window.jQuery) clues.push("jquery");

      performance.getEntriesByType("resource").forEach(res => {
        let url = res.name.toLowerCase();
        if (url.includes("/api/")) clues.push("rest");
        if (url.includes("graphql")) clues.push("graphql");
      });

      clues = [...new Set(clues)];

      // 🔥 CATEGORIES
      let categorized = {
        frontend: [],
        ui: [],
        analytics: [],
        network: [],
        backend: [],
        database: [],
        hosting: []
      };

      function addTech(arr, name) {
        if (!arr.includes(name)) arr.push(name);
      }

      // FRONTEND
      if (clues.includes("react")) addTech(categorized.frontend, "React");
      if (clues.includes("nextjs")) addTech(categorized.frontend, "Next.js");
      if (clues.includes("vue")) addTech(categorized.frontend, "Vue");

      // UI
      if (clues.includes("bootstrap")) addTech(categorized.ui, "Bootstrap");
      if (clues.includes("jquery")) addTech(categorized.ui, "jQuery");
      if (clues.includes("icons")) addTech(categorized.ui, "Icon Libraries");

      // ANALYTICS
      if (clues.includes("analytics")) addTech(categorized.analytics, "Analytics");

      // NETWORK
      if (clues.includes("graphql")) addTech(categorized.network, "GraphQL API");
      if (clues.includes("rest") || clues.includes("api")) addTech(categorized.network, "REST API");

      // BACKEND
      if (categorized.network.length > 0) addTech(categorized.backend, "Application Server");

      // DATABASE
      if (categorized.backend.length > 0) addTech(categorized.database, "Database");

      // HOSTING
      if (window.location.hostname.includes("github")) addTech(categorized.hosting, "GitHub Hosting");
      if (html.includes("cloudflare")) addTech(categorized.hosting, "Cloudflare CDN");
      if (html.includes("aws")) addTech(categorized.hosting, "AWS");

      return categorized;
    }

  }, (results) => {

    let categorized = results[0].result;

    list.innerHTML = "";

    function render(title, items) {
      if (!items.length) return;

      let t = document.createElement("li");
      t.className = "category";
      t.textContent = title;
      list.appendChild(t);

      items.forEach(i => {
        let li = document.createElement("li");
        li.className = "item";
        li.textContent = i;
        list.appendChild(li);
      });
    }

    // 🔥 RENDER SECTIONS
    render("Frontend Framework", categorized.frontend);
    render("UI Libraries", categorized.ui);
    render("Analytics", categorized.analytics);
    render("Network Layer", categorized.network);
    render("Backend", categorized.backend);
    render("Database", categorized.database);
    render("Hosting / CDN", categorized.hosting);

    // 🔥 PIPELINE (ORDER FIXED)
    let parts = ["User"];

    if (categorized.frontend.length) parts.push(categorized.frontend.join(", "));
    if (categorized.ui.length) parts.push(categorized.ui.join(", "));
    if (categorized.analytics.length) parts.push(categorized.analytics.join(", "));
    if (categorized.network.length) parts.push(categorized.network.join(", "));
    if (categorized.backend.length) parts.push(categorized.backend.join(", "));
    if (categorized.database.length) parts.push(categorized.database.join(", "));
    if (categorized.hosting.length) parts.push(categorized.hosting.join(", "));

    let html = "";
    parts.forEach((p, i) => {
      html += `<div class="box">${p}</div>`;
      if (i !== parts.length - 1) html += `<div class="arrow">&rarr;</div>`;
    });

    document.getElementById("pipeline").innerHTML = html;

    // 🔥 EXPLANATION
    document.getElementById("explanation").innerText =
      `This website uses ${categorized.frontend.join(", ") || "frontend technologies"}.\n` +
      `UI is built using ${categorized.ui.join(", ") || "libraries"}.\n` +
      `It communicates via ${categorized.network.join(", ") || "APIs"} to backend.\n` +
      `Backend interacts with ${categorized.database.join(", ") || "a database"}.\n` +
      `Hosted on ${categorized.hosting.join(", ") || "a platform"}.`;

    // 🔥 SIMPLE EXPLANATION (FIXED SYMBOLS)
    const desc = {
      "React": "Builds interactive UI",
      "Next.js": "Fast React framework",
      "Vue": "Frontend framework",
      "Bootstrap": "CSS UI framework",
      "jQuery": "Simplifies JavaScript",
      "REST API": "Connects frontend and backend",
      "GraphQL API": "Fetch specific data",
      "Database": "Stores data",
      "Application Server": "Handles logic",
      "Cloudflare CDN": "Speeds up website",
      "AWS": "Cloud hosting platform"
    };

    let simple = document.getElementById("simpleExplain");
    simple.innerHTML = "";

    let allTech = Object.values(categorized).flat();
    allTech = [...new Set(allTech)];

    allTech.forEach(t => {
      let li = document.createElement("li");
      li.textContent = `${t} - ${desc[t] || "Used in web development"}`;
      simple.appendChild(li);
    });

    // 🔥 LEARNING PATH
    const resources = {
      "React": "https://react.dev",
      "Next.js": "https://nextjs.org/docs",
      "Vue": "https://vuejs.org/guide/",
      "Bootstrap": "https://getbootstrap.com/docs/",
      "jQuery": "https://api.jquery.com/",
      "REST API": "https://developer.mozilla.org/en-US/docs/Web/HTTP",
      "GraphQL API": "https://graphql.org/learn/",
      "Database": "https://www.w3schools.com/sql/",
      "Application Server": "https://nodejs.org/en/docs",
      "Cloudflare CDN": "https://www.cloudflare.com/learning/cdn/",
      "AWS": "https://aws.amazon.com/getting-started/"
    };

    let learn = document.getElementById("learningPath");
    learn.innerHTML = "";

    allTech.forEach(t => {
      if (resources[t]) {
        let li = document.createElement("li");

        let a = document.createElement("a");
        a.href = resources[t];
        a.textContent = `Learn ${t}`;
        a.target = "_blank";

        li.appendChild(a);
        learn.appendChild(li);
      }
    });

  });
});