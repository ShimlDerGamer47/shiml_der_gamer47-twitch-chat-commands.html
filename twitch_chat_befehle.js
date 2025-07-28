document.addEventListener("DOMContentLoaded", function () {
  const html = document.documentElement;
  const fontFamily = "--font-family";
  const robotoBold = getComputedStyle(html).getPropertyValue(fontFamily).trim();
  const body = document.body;

  body.style.fontFamily = robotoBold;

  const backgroundImgContainer = document.getElementById(
    "backgroundImgContainerId"
  );
  const backgroundImg = document.getElementById("backgroundImgId");
  const imgLogo = document.getElementById("imgLogoId");
  const formSeek = document.getElementById("formSeekId");
  const inputSeek = document.getElementById("inputSeekId");
  const spanResults = document.getElementById("spanResultsId");
  const selectCommands = document.getElementById("selectCommandsId");
  const twitchEmbedContainer = document.getElementById(
    "twitchEmbedContainerId"
  );

  const mobileQuery = window.matchMedia("(max-width: 768px)");

  function mobileWarningToken(e = mobileQuery) {
    const mobileWarning = document.getElementById("mobileWarning");

    const isMatches = e.matches;

    Object.assign(mobileWarning.style, {
      display: "none",
      position: "fixed",
      top: "0%",
      left: "0%",
      width: "100%",
      padding: "1rem",
      background: "#ff4444",
      color: "white",
      textAlign: "center",
      zIndex: "9999"
    });

    mobileWarning.style.display = isMatches ? "block" : "none";

    if (isMatches) body.classList.add("desktop-hidden");
    else body.classList.remove("desktop-hidden");
  }

  mobileQuery.addEventListener("change", mobileWarningToken);

  mobileWarningToken();

  function backgroundImgToken() {
    const els = [backgroundImgContainer, backgroundImg];

    const evs = ["copy", "keydown", "dragstart", "select"];

    const style = {
      fontFamily: robotoBold,
      userSelect: "none",
      cursor: "default",
      pointerEvents: "none"
    };

    els.forEach((el) => {
      evs.forEach((ev) => el.addEventListener(ev, (e) => e.preventDefault()));
      Object.assign(el.style, style);
    });
  }
  backgroundImgToken();

  function imgLogoToken() {
    const evs = ["copy", "keydown", "dragstart", "select"];
    const style = {
      fontFamily: robotoBold,
      userSelect: "none",
      cursor: "default",
      pointerEvents: "none"
    };

    evs.forEach((ev) =>
      imgLogo.addEventListener(ev, (e) => e.preventDefault())
    );

    Object.assign(imgLogo.style, style);
  }

  imgLogoToken();

  function twitchEmbedToken() {
    const domain = window.location.hostname;

    const io = new IntersectionObserver((entries, obs) => {
      if (!entries[0].isIntersecting) return;

      const script = document.createElement("script");
      script.src = "https://embed.twitch.tv/embed/v1.js";
      twitchEmbedContainer.appendChild(script);

      obs.unobserve(twitchEmbedContainer);

      script.addEventListener("load", () => {
        const embed = new Twitch.Embed("twitchEmbedContainerId", {
          width: 1920,
          height: 1080,
          channel: "shiml_der_gamer47",
          theme: "dark",
          allowfullscreen: true,
          frameborder: 0,
          scrolling: "no",
          allow: "autoplay; fullscreen",
          autoplay: true,
          layout: "video",
          parent: [domain]
        });

        embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
          const player = embed.getPlayer();
          player.setVolume(1);
          player.setMuted(true);
          player.setQuality("chunked");
        });

        const iframe = document.querySelector("iframe");

        if (iframe) {
          iframe.classList.add("twitch-embed");
          iframe.style.fontFamily = robotoBold;
          iframe.style.userSelect = "none";
        }
      });
    });

    io.observe(twitchEmbedContainer, { threshold: 0.1 });
  }
  twitchEmbedToken();

  function newDateToken() {
    const timeTxt = document.getElementById("timeTxtId");
    const dateTxt = document.getElementById("dateTxtId");

    const now = new Date();

    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const ms = String(now.getMilliseconds()).padStart(3, "0");

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    const timeText = `${hh}:${mm}:${ss}:${ms} Uhr`;
    const dateText = `${day}.${month}.${year}`;

    timeTxt.textContent = timeText;
    dateTxt.textContent = dateText;
  }

  setInterval(newDateToken, 1);

  function commandsToken() {
    const form = formSeek;
    const input = inputSeek;
    const select = selectCommands;
    const preview = spanResults;

    const suggestions = Array.from(select.options).map((o) => o.value);

    const commandMap = {};

    suggestions.forEach((cmd) => {
      const norm = cmd.replace(/^!/, "").toLowerCase();

      commandMap[norm] = cmd;

      commandMap[cmd.toLowerCase()] = cmd;
    });

    const wrapper = input.parentElement;
    wrapper.style.position = "relative";
    const dd = document.createElement("div");
    Object.assign(dd.style, {
      position: "absolute",
      top: `${input.offsetHeight + 2}px`,
      left: "0",
      width: `${input.offsetWidth}px`,
      background: "#000",
      color: "#0ff",
      borderRadius: "6px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.8)",
      maxHeight: "200px",
      overflowY: "auto",
      display: "none",
      zIndex: "999"
    });
    wrapper.appendChild(dd);

    let selIndex = -1;

    function showDropdown(items) {
      dd.innerHTML = "";

      items.forEach((text, i) => {
        const item = document.createElement("div");
        item.textContent = text;

        item.style.padding = "8px 12px";

        item.style.cursor = "pointer";

        item.dataset.index = i;

        item.addEventListener("mouseenter", () => highlight(i));

        item.addEventListener("mouseleave", () => unhighlight(i));

        item.addEventListener("click", () => {
          selectCommand(text);

          hideDropdown();
        });

        dd.appendChild(item);
      });

      selIndex = -1;

      dd.style.display = items.length ? "block" : "none";
    }

    function hideDropdown() {
      dd.style.display = "none";

      selIndex = -1;

      clearHighlights();
    }

    function highlight(i) {
      clearHighlights();

      const c = dd.children[i];

      if (c) {
        c.style.background = "#0ff3";

        selIndex = i;
      }
    }

    function unhighlight(i) {
      const c = dd.children[i];

      if (c) c.style.removeProperty("background");
    }

    function clearHighlights() {
      Array.from(dd.children).forEach((c) =>
        c.style.removeProperty("background")
      );
    }

    function selectCommand(cmd) {
      preview.innerText = cmd;

      select.value = cmd;

      localStorage.setItem("selectedCommand", cmd);
    }

    input.addEventListener("input", () => {
      const txt = input.value.trim().toLowerCase();
      if (!txt) return hideDropdown();

      const matches = suggestions.filter((s) =>
        s.replace(/^!/, "").toLowerCase().startsWith(txt)
      );

      showDropdown(matches);
    });

    input.addEventListener("keydown", (e) => {
      if (dd.style.display === "none") return;

      const count = dd.children.length;
      if (!count) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();

        highlight((selIndex + 1 + count) % count);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();

        highlight((selIndex - 1 + count) % count);
      } else if (e.key === "Enter") {
        e.preventDefault();

        if (selIndex > -1) dd.children[selIndex].click();
      } else if (e.key === "Escape") {
        hideDropdown();
      }
    });

    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) hideDropdown();
    });

    select.addEventListener("change", () => selectCommand(select.value));

    preview.addEventListener("dblclick", (e) => {
      e.preventDefault();

      localStorage.clear();

      preview.innerText = "";
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const raw = input.value.trim();

      input.value = "";

      const key = raw.replace(/^!/, "").toLowerCase();

      if (commandMap[key]) {
        selectCommand(commandMap[key]);
      } else {
        alert(
          "Ungültiger Command! Bitte wähle aus der Liste oder gib einen gültigen ein."
        );
      }

      hideDropdown();
    });

    preview.innerText = "";
    const stored = localStorage.getItem("selectedCommand");

    if (stored && suggestions.includes(stored)) {
      select.value = stored;
    }
  }
  commandsToken();
});
