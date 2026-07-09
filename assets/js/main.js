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
