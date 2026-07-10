/* =========================================================
   পুনিয়ানগর দারুস সালাম মাদরাসা — শেয়ারড জাভাস্ক্রিপ্ট
   প্রতিটি পেজে লোড হয়; সব ফাংশন এলিমেন্ট আছে কিনা যাচাই করে চলে
   ========================================================= */
(function () {
  "use strict";

  /* ---------- header height -> CSS var (for sticky notice offset) ---------- */
  function setHeaderHeightVar() {
    const header = document.getElementById("siteHeader");
    if (!header) return;
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }
  setHeaderHeightVar();
  window.addEventListener("resize", setHeaderHeightVar);

  /* ---------- header scroll shadow ---------- */
  const header = document.getElementById("siteHeader");
  function updateHeaderShadow() {
    if (!header) return;
    header.classList.toggle("shadow-lg", window.scrollY > 20);
  }
  updateHeaderShadow();
  window.addEventListener("scroll", updateHeaderShadow, { passive: true });

  /* ---------- mobile menu ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const menuClose = document.getElementById("menuClose");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuOverlay = document.getElementById("menuOverlay");

  function openMenu() {
    mobileMenu.classList.add("open");
    menuOverlay.classList.remove("hidden");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    mobileMenu.classList.remove("open");
    menuOverlay.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (menuToggle && mobileMenu && menuOverlay && menuClose) {
    menuToggle.addEventListener("click", openMenu);
    menuClose.addEventListener("click", closeMenu);
    menuOverlay.addEventListener("click", closeMenu);
    document.querySelectorAll("#mobileMenu a").forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------- mark active nav link based on current page ---------- */
  (function markActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link, .mobile-link").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        link.classList.add("active");
      }
    });
  })();

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- animated counters ---------- */
  const counters = document.querySelectorAll(".counter");
  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target"), 10) || 0;
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString("bn-BD");
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString("bn-BD");
    }
    requestAnimationFrame(tick);
  }
  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  }

  /* ---------- generic tabs (data-tab-group) ---------- */
  document.querySelectorAll("[data-tab-group]").forEach((group) => {
    const groupName = group.getAttribute("data-tab-group");
    const buttons = group.querySelectorAll(".tab-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        document.querySelectorAll(`[data-tab-panel="${groupName}"]`).forEach((p) => p.classList.add("hidden"));
        const targetPanel = document.querySelector(`[data-tab-panel="${groupName}"][data-tab-id="${btn.dataset.tab}"]`);
        if (targetPanel) targetPanel.classList.remove("hidden");
      });
    });
  });

  /* ---------- generic accordions (data-accordion) ---------- */
  document.querySelectorAll("[data-accordion] .acc-btn").forEach((btn) => {
    const panel = btn.parentElement.querySelector(".acc-panel");
    function setPanel(open) {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
    }
    setPanel(btn.getAttribute("aria-expanded") === "true");
    btn.addEventListener("click", () => setPanel(btn.getAttribute("aria-expanded") !== "true"));
  });

  /* ---------- gallery lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const lightboxTile = document.getElementById("lightboxTile");
    const lightboxCaption = document.getElementById("lightboxCaption");
    const lightboxClose = document.getElementById("lightboxClose");
    document.querySelectorAll(".gallery-item").forEach((item) => {
      item.addEventListener("click", () => {
        const tileClass = Array.from(item.classList).find((c) => c.startsWith("tile-"));
        lightboxTile.className = "h-64 rounded-xl mb-6 " + (tileClass || "tile-1");
        lightboxCaption.textContent = item.dataset.caption || "";
        lightbox.classList.remove("hidden");
        lightbox.classList.add("flex");
        document.body.style.overflow = "hidden";
      });
    });
    function closeLightbox() {
      lightbox.classList.add("hidden");
      lightbox.classList.remove("flex");
      document.body.style.overflow = "";
    }
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
  }

  /* ---------- generic filter groups (notice board, events page, etc.) ---------- */
  document.querySelectorAll("[data-filter-group]").forEach((group) => {
    const targetSelector = group.dataset.target;
    const emptyId = group.dataset.empty;
    const buttons = group.querySelectorAll(".filter-btn");
    const cards = targetSelector ? document.querySelectorAll(targetSelector + " .filter-card") : [];
    const emptyEl = emptyId ? document.getElementById(emptyId) : null;
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.dataset.filter;
        let visible = 0;
        cards.forEach((card) => {
          const show = filter === "all" || card.dataset.cat === filter;
          card.style.display = show ? "" : "none";
          if (show) visible++;
        });
        if (emptyEl) emptyEl.classList.toggle("hidden", visible !== 0);
      });
    });
  });

  /* ---------- toast ---------- */
  const toast = document.getElementById("toast");
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  /* ---------- copy to clipboard ---------- */
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(value);
      } catch (err) {
        const ta = document.createElement("textarea");
        ta.value = value;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      const original = btn.textContent;
      btn.textContent = "কপি হয়েছে ✓";
      showToast("নম্বরটি কপি করা হয়েছে");
      setTimeout(() => (btn.textContent = original), 1800);
    });
  });

  /* =========================================================
     ADMISSION FORM WIZARD (multi-step)
     ========================================================= */
  const admissionForm = document.getElementById("admissionForm");
  if (admissionForm && admissionForm.querySelector(".wizard-step")) {
    const steps = Array.from(admissionForm.querySelectorAll(".wizard-step"));
    const indicators = Array.from(document.querySelectorAll(".wizard-step-indicator"));
    const lines = Array.from(document.querySelectorAll(".step-line"));
    const prevBtn = document.getElementById("wizardPrev");
    const nextBtn = document.getElementById("wizardNext");
    const submitBtn = document.getElementById("wizardSubmit");
    let current = 1;

    function validateStep(stepEl) {
      let valid = true;
      stepEl.querySelectorAll("[required]").forEach((field) => {
        const wrap = field.closest("div");
        const errMsg = wrap ? wrap.querySelector(".err-msg") : null;
        let fieldValid;
        if (field.type === "radio") {
          fieldValid = stepEl.querySelectorAll(`input[name="${field.name}"]:checked`).length > 0;
        } else if (field.type === "checkbox") {
          fieldValid = field.checked;
        } else {
          fieldValid = field.checkValidity() && field.value.trim() !== "";
        }
        if (!fieldValid) {
          valid = false;
          field.classList.add("border-maroon");
          if (errMsg) errMsg.classList.remove("hidden");
        } else {
          field.classList.remove("border-maroon");
          if (errMsg) errMsg.classList.add("hidden");
        }
      });
      return valid;
    }

    function renderStep() {
      steps.forEach((s) => s.classList.toggle("hidden", parseInt(s.dataset.step, 10) !== current));
      indicators.forEach((ind) => {
        const n = parseInt(ind.dataset.stepIndicator, 10);
        ind.classList.toggle("active", n === current);
        ind.classList.toggle("done", n < current);
      });
      lines.forEach((line, i) => line.classList.toggle("done", i < current - 1));
      prevBtn.classList.toggle("hidden", current === 1);
      nextBtn.classList.toggle("hidden", current === steps.length);
      submitBtn.classList.toggle("hidden", current !== steps.length);
      admissionForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    nextBtn.addEventListener("click", () => {
      const stepEl = steps.find((s) => parseInt(s.dataset.step, 10) === current);
      if (!validateStep(stepEl)) return;
      current = Math.min(current + 1, steps.length);
      renderStep();
    });
    prevBtn.addEventListener("click", () => {
      current = Math.max(current - 1, 1);
      renderStep();
    });

    /* dependent class selects based on chosen department */
    const stuDept = document.getElementById("stuDept");
    const nooraniWrap = document.getElementById("nooraniClassWrap");
    const kitabWrap = document.getElementById("kitabClassWrap");
    if (stuDept) {
      stuDept.addEventListener("change", () => {
        nooraniWrap.classList.toggle("hidden", stuDept.value !== "noorani");
        kitabWrap.classList.toggle("hidden", stuDept.value !== "kitab");
      });
    }

    /* "same as present address" checkbox */
    const sameAddressCheck = document.getElementById("sameAddressCheck");
    const presentAddress = document.getElementById("presentAddress");
    const permanentAddress = document.getElementById("permanentAddress");
    if (sameAddressCheck) {
      sameAddressCheck.addEventListener("change", () => {
        if (sameAddressCheck.checked) {
          permanentAddress.value = presentAddress.value;
          permanentAddress.setAttribute("readonly", "true");
          permanentAddress.classList.add("opacity-60");
        } else {
          permanentAddress.removeAttribute("readonly");
          permanentAddress.classList.remove("opacity-60");
        }
      });
      presentAddress.addEventListener("input", () => {
        if (sameAddressCheck.checked) permanentAddress.value = presentAddress.value;
      });
    }

    /* final submit: validate last step, then show success and reset wizard */
    admissionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const lastStep = steps[steps.length - 1];
      if (!validateStep(lastStep)) return;
      const successMsg = document.getElementById("admissionSuccess");
      if (successMsg) successMsg.classList.remove("hidden");
      showToast("সফলভাবে আবেদন জমা হয়েছে");
      admissionForm.reset();
      current = 1;
      renderStep();
      setTimeout(() => { if (successMsg) successMsg.classList.add("hidden"); }, 6000);
    });

    renderStep();
  }

  /* ---------- generic form validation ---------- */
  function wireForm(formId, successId) {
    const form = document.getElementById(formId);
    if (!form) return;
    const successMsg = document.getElementById(successId);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]").forEach((field) => {
        const errMsg = field.parentElement.querySelector(".err-msg");
        const fieldValid = field.checkValidity() && field.value.trim() !== "";
        if (!fieldValid) {
          valid = false;
          field.classList.add("border-maroon");
          if (errMsg) errMsg.classList.remove("hidden");
        } else {
          field.classList.remove("border-maroon");
          if (errMsg) errMsg.classList.add("hidden");
        }
      });
      if (valid) {
        if (successMsg) successMsg.classList.remove("hidden");
        showToast("সফলভাবে জমা হয়েছে");
        form.reset();
        setTimeout(() => { if (successMsg) successMsg.classList.add("hidden"); }, 5000);
      }
    });
    form.querySelectorAll("[required]").forEach((field) => {
      field.addEventListener("input", () => {
        const errMsg = field.parentElement.querySelector(".err-msg");
        if (field.checkValidity() && field.value.trim() !== "") {
          field.classList.remove("border-maroon");
          if (errMsg) errMsg.classList.add("hidden");
        }
      });
    });
  }
  wireForm("contactForm", "contactSuccess");

  const downloadFormBtn = document.getElementById("downloadFormBtn");
  if (downloadFormBtn) {
    downloadFormBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("ফরমটি পেতে অফিসে যোগাযোগ করুন অথবা ইমেইল করুন");
    });
  }

  /* ---------- footer notice subscribe (static, no backend) ---------- */
  const footerSubscribe = document.getElementById("footerSubscribe");
  if (footerSubscribe) {
    footerSubscribe.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = footerSubscribe.querySelector("input");
      if (!input.value.trim()) return;
      showToast("সাবস্ক্রাইব করার জন্য ধন্যবাদ");
      footerSubscribe.reset();
    });
  }

  /* ---------- back to top ---------- */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => backToTop.classList.toggle("show", window.scrollY > 500), { passive: true });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  }

  /* =========================================================
     3D CARD CAROUSEL — achiever testimonials (achievers.html)
     ========================================================= */
  const card3dTrack = document.getElementById("card3dTrack");
  if (card3dTrack) {
    const cards = [
      { quote: "মুমতায ফলাফল অর্জন করতে পেরে আল্লাহর কাছে শুকরিয়া। উস্তাদগণের অক্লান্ত পরিশ্রম ও দোয়া ছাড়া এটা সম্ভব হতো না।", name: "মুহাম্মদ আরিফুল ইসলাম", role: "নাহবেমীর জামাত" },
      { quote: "প্রতিদিন ফজরের পর সবক প্রস্তুতির অভ্যাসই আমাকে হিফজ সম্পন্ন করতে সাহায্য করেছে। উস্তাদের ধৈর্য ছিল অসাধারণ।", name: "ফাহিম আহমেদ", role: "হিফজ বিভাগ" },
      { quote: "মিযান জামাতে পড়ার সময় যে শৃঙ্খলা শিখেছি, তা আমার সারা জীবনের পাথেয়। এখানকার পরিবেশ সত্যিই অনুপ্রেরণাদায়ক।", name: "সাদমান হোসাইন", role: "মিযান জামাত" },
      { quote: "ছোটবেলা থেকে এই মাদরাসায় পড়ছি। উস্তাদদের স্নেহ ও যত্নে আমি তিলাওয়াতে ভালো ফলাফল করতে পেরেছি।", name: "তানভীর হাসান", role: "নূরানী বিভাগ — ৩য় শ্রেণী" },
      { quote: "নিয়মিত মুতালাআ ও উস্তাদের পরামর্শ অনুসরণ করে আমি জাইয়্যিদ জিদ্দান অর্জন করতে পেরেছি। আলহামদুলিল্লাহ।", name: "নাঈম হোসাইন", role: "ইবতিদায়ী জামাত" },
    ];
    let c3dIndex = 0;
    const c3dDots = document.getElementById("card3dDots");

    function cardHTML(item, offset) {
      let transform, opacity, zIndex, pointerEvents;
      if (offset === 0) { transform = "translate(-50%,-50%) scale(1) rotateY(0deg)"; opacity = 1; zIndex = 30; pointerEvents = "auto"; }
      else if (offset === -1) { transform = "translate(-90%,-50%) scale(.82) rotateY(20deg)"; opacity = .55; zIndex = 20; pointerEvents = "none"; }
      else if (offset === 1) { transform = "translate(-10%,-50%) scale(.82) rotateY(-20deg)"; opacity = .55; zIndex = 20; pointerEvents = "none"; }
      else { transform = "translate(-50%,-50%) scale(.6)"; opacity = 0; zIndex = 10; pointerEvents = "none"; }
      return `
        <div class="card3d absolute top-1/2 left-1/2 w-[85%] max-w-sm bg-white rounded-lg p-6 md:p-8 border border-teal/10 shadow-lg text-center"
             style="transform:${transform}; opacity:${opacity}; z-index:${zIndex}; pointer-events:${pointerEvents};">
          <svg class="w-7 h-7 text-brass/50 mx-auto mb-3" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8c-4 2-6 6-6 10 0 3 2 5 5 5s5-2 5-5c0-2-1-4-3-5 0-3 2-5 5-6l-1-4c-2 1-4 3-5 5zm14 0c-4 2-6 6-6 10 0 3 2 5 5 5s5-2 5-5c0-2-1-4-3-5 0-3 2-5 5-6l-1-4c-2 1-4 3-5 5z"/></svg>
          <p class="text-sm text-ink/80 leading-relaxed mb-4">${item.quote}</p>
          <p class="font-serif font-bold text-teal text-sm">${item.name}</p>
          <p class="text-xs text-ink/55">${item.role}</p>
        </div>`;
    }

    function renderCard3d() {
      const n = cards.length;
      let html = "";
      [-1, 0, 1].forEach((offset) => {
        const idx = (c3dIndex + offset + n) % n;
        html += cardHTML(cards[idx], offset);
      });
      card3dTrack.innerHTML = html;
      c3dDots.innerHTML = cards
        .map((_, i) => `<button aria-label="কার্ড ${i + 1}" class="w-2.5 h-2.5 rounded-full ${i === c3dIndex ? "bg-brass" : "bg-teal/20"}" data-idx="${i}"></button>`)
        .join("");
      c3dDots.querySelectorAll("button").forEach((dot) => {
        dot.addEventListener("click", () => { c3dIndex = parseInt(dot.dataset.idx, 10); renderCard3d(); });
      });
    }
    document.getElementById("card3dPrev").addEventListener("click", () => {
      c3dIndex = (c3dIndex - 1 + cards.length) % cards.length;
      renderCard3d();
    });
    document.getElementById("card3dNext").addEventListener("click", () => {
      c3dIndex = (c3dIndex + 1) % cards.length;
      renderCard3d();
    });
    renderCard3d();
    setInterval(() => {
      c3dIndex = (c3dIndex + 1) % cards.length;
      renderCard3d();
    }, 6500);
  }

  /* =========================================================
     TEACHERS' WORDS CAROUSEL (হোম পেজ)
     ========================================================= */
  const teacherQuoteTrack = document.getElementById("teacherQuoteTrack");
  if (teacherQuoteTrack) {
    const teacherQuotes = [
      {
        quote: "আমাদের লক্ষ্য কেবল সনদধারী তৈরি করা নয়, বরং এমন মানুষ তৈরি করা যারা নিজ পরিবার, সমাজ ও উম্মাহর জন্য কল্যাণকর হবে। প্রতিটি শিক্ষার্থীর প্রতি ব্যক্তিগত যত্ন নেওয়াই আমাদের অগ্রাধিকার।",
        name: "হাফেয মাওলানা মোশাররফ হোসাইন",
        role: "মুহতামিম",
      },
      {
        quote: "প্রতিটি শিক্ষার্থীর মেধা ও সক্ষমতা ভিন্ন। আমরা চেষ্টা করি প্রত্যেকের সামর্থ্য অনুযায়ী পাঠ্যক্রম সাজিয়ে তাদের সর্বোচ্চ বিকাশ নিশ্চিত করতে।",
        name: "মাওলানা হাসনাত হোসাইন",
        role: "শিক্ষাসচিব",
      },
      {
        quote: "আবাসিক শিক্ষার্থীদের জন্য মাদরাসাই তাদের দ্বিতীয় ঘর। তাই তাদের থাকা-খাওয়া ও দৈনন্দিন শৃঙ্খলার প্রতিটি দিক নিয়ে আমরা সর্বোচ্চ যত্নশীল।",
        name: "হাফেয শাহরাজ হোসাইন",
        role: "দারুল ইকামা",
      },
      {
        quote: "কুরআন মুখস্থ করার পাশাপাশি তার অর্থ ও শিক্ষা জীবনে বাস্তবায়ন করাই প্রকৃত সফলতা। আমরা সে লক্ষ্যেই শিক্ষার্থীদের গড়ে তুলি।",
        name: "ক্বারী রফিকুল ইসলাম",
        role: "প্রধান হিফজ শিক্ষক",
      },
    ];
    let tqIndex = 0;
    const tqDots = document.getElementById("teacherQuoteDots");

    function renderTeacherQuote() {
      const t = teacherQuotes[tqIndex];
      teacherQuoteTrack.innerHTML = `
        <div class="reveal in grid md:grid-cols-[auto,1fr] gap-8 items-center w-full">
          <div class="avatar-photo mx-auto md:mx-0">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 8c0-3.3 3.1-6 7-6s7 2.7 7 6"/></svg>
          </div>
          <div class="text-center md:text-right">
            <p class="text-ink/85 leading-relaxed italic mb-4">"${t.quote}"</p>
            <p class="font-serif font-bold text-teal">${t.name}</p>
            <p class="text-xs text-ink/60">${t.role}, পুনিয়ানগর দারুস সালাম মাদরাসা</p>
          </div>
        </div>`;
      tqDots.innerHTML = teacherQuotes
        .map((_, i) => `<button aria-label="বাণী ${i + 1}" class="w-2.5 h-2.5 rounded-full ${i === tqIndex ? "bg-brass" : "bg-teal/20"}" data-idx="${i}"></button>`)
        .join("");
      tqDots.querySelectorAll("button").forEach((dot) => {
        dot.addEventListener("click", () => {
          tqIndex = parseInt(dot.dataset.idx, 10);
          renderTeacherQuote();
        });
      });
    }
    document.getElementById("teacherQuotePrev").addEventListener("click", () => {
      tqIndex = (tqIndex - 1 + teacherQuotes.length) % teacherQuotes.length;
      renderTeacherQuote();
    });
    document.getElementById("teacherQuoteNext").addEventListener("click", () => {
      tqIndex = (tqIndex + 1) % teacherQuotes.length;
      renderTeacherQuote();
    });
    renderTeacherQuote();
    setInterval(() => {
      tqIndex = (tqIndex + 1) % teacherQuotes.length;
      renderTeacherQuote();
    }, 8000);
  }

  /* =========================================================
     ALUMNI TESTIMONIAL SLIDER (হোম পেজ)
     ========================================================= */
  const testimonialTrack = document.getElementById("testimonialTrack");
  if (testimonialTrack) {
    const testimonials = [
      {
        quote: "এই মাদরাসা থেকে নাজেরা ও প্রাথমিক কিতাব শেষ করে আমি এখন শহরের একটি বড় জামিয়ায় দাওরায়ে হাদিস পড়ছি। এখানকার তারবিয়াহ আমার ভিত্তি তৈরি করে দিয়েছে।",
        name: "মাওলানা রাকিবুল ইসলাম",
        role: "প্রাক্তন শিক্ষার্থী, বর্তমানে জামিয়া মাদানিয়া, ঢাকা",
      },
      {
        quote: "কিতাব বিভাগের উস্তাদগণ শুধু পাঠদান করেননি, বরং জীবন গড়ার পথও দেখিয়েছেন। আজ আমি একজন খতিব হিসেবে সমাজে দ্বীনি খেদমত করছি।",
        name: "মাওলানা তানজিল আহমেদ",
        role: "প্রাক্তন শিক্ষার্থী, নাহবেমীর জামাত",
      },
      {
        quote: "হিফজ বিভাগে যে শৃঙ্খলা ও অধ্যবসায় শিখেছি, তা এখনো আমার প্রতিদিনের জীবনে কাজে লাগে। উস্তাদগণের আন্তরিকতা কখনো ভোলার নয়।",
        name: "হাফেয ফাহিম আহমেদ",
        role: "প্রাক্তন শিক্ষার্থী, হিফজ বিভাগ",
      },
      {
        quote: "আমার সন্তান এখানে নূরানী বিভাগে পড়ে। উস্তাদদের যত্ন ও পরিবেশ দেখে আমি সত্যিই সন্তুষ্ট। দারুল ইকামার নিয়ম-শৃঙ্খলাও প্রশংসনীয়।",
        name: "মোঃ আব্দুল হালিম",
        role: "অভিভাবক",
      },
    ];
    let testiIndex = 0;
    const testiDots = document.getElementById("testiDots");

    function renderTestimonial() {
      const t = testimonials[testiIndex];
      testimonialTrack.innerHTML = `
        <div class="reveal in">
          <svg class="w-8 h-8 text-brass/50 mx-auto mb-4" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8c-4 2-6 6-6 10 0 3 2 5 5 5s5-2 5-5c0-2-1-4-3-5 0-3 2-5 5-6l-1-4c-2 1-4 3-5 5zm14 0c-4 2-6 6-6 10 0 3 2 5 5 5s5-2 5-5c0-2-1-4-3-5 0-3 2-5 5-6l-1-4c-2 1-4 3-5 5z"/></svg>
          <p class="font-serif text-lg md:text-xl text-teal leading-relaxed mb-6">${t.quote}</p>
          <p class="font-semibold text-ink">${t.name}</p>
          <p class="text-xs text-ink/60">${t.role}</p>
        </div>`;
      testiDots.innerHTML = testimonials
        .map((_, i) => `<button aria-label="সাক্ষ্য ${i + 1}" class="w-2.5 h-2.5 rounded-full ${i === testiIndex ? "bg-brass" : "bg-teal/20"}" data-idx="${i}"></button>`)
        .join("");
      testiDots.querySelectorAll("button").forEach((dot) => {
        dot.addEventListener("click", () => {
          testiIndex = parseInt(dot.dataset.idx, 10);
          renderTestimonial();
        });
      });
    }
    document.getElementById("testiPrev").addEventListener("click", () => {
      testiIndex = (testiIndex - 1 + testimonials.length) % testimonials.length;
      renderTestimonial();
      restartAuto();
    });
    document.getElementById("testiNext").addEventListener("click", () => {
      testiIndex = (testiIndex + 1) % testimonials.length;
      renderTestimonial();
      restartAuto();
    });
    renderTestimonial();
    let testiAuto = setInterval(() => {
      testiIndex = (testiIndex + 1) % testimonials.length;
      renderTestimonial();
    }, 7000);
    function restartAuto() {
      clearInterval(testiAuto);
      testiAuto = setInterval(() => {
        testiIndex = (testiIndex + 1) % testimonials.length;
        renderTestimonial();
      }, 7000);
    }
  }

  /* =========================================================
     HERO SLIDER (হোম পেজ)
     ========================================================= */
  const heroSlider = document.getElementById("heroSlider");
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll(".hero-slide");
    const dotsWrap = document.getElementById("heroDots");
    const prevBtn = document.getElementById("heroPrev");
    const nextBtn = document.getElementById("heroNext");
    let current = 0;
    let autoTimer;

    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "hero-dot" + (i === current ? " active" : "");
        dot.setAttribute("aria-label", "স্লাইড " + (i + 1));
        dot.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(dot);
      });
    }
    function goTo(index) {
      slides[current].classList.remove("active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("active");
      renderDots();
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }
    function startAuto() {
      stopAuto();
      autoTimer = setInterval(next, 5500);
    }
    function stopAuto() { clearInterval(autoTimer); }

    if (nextBtn) nextBtn.addEventListener("click", () => { next(); startAuto(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { prev(); startAuto(); });
    heroSlider.addEventListener("mouseenter", stopAuto);
    heroSlider.addEventListener("mouseleave", startAuto);

    /* basic touch swipe */
    let touchStartX = 0;
    heroSlider.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    heroSlider.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(diff) > 40) { diff > 0 ? prev() : next(); startAuto(); }
    }, { passive: true });

    renderDots();
    startAuto();
  }

})();
