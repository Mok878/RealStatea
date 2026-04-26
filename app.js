// ===== PAGE ROUTER =====
const pages = ['home','listings','services','map','agents','list-property','contact'];

function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show target page
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Update active nav link
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('nav-active');
    const href = a.getAttribute('href').replace('#','');
    if (href === pageId) a.classList.add('nav-active');
  });

  // Save current page
  localStorage.setItem('dardz-page', pageId);

  // Re-init map if navigating to map page (lazy init)
  if (pageId === 'map' && !window.mapInitialized) {
    setTimeout(initMap, 100);
    window.mapInitialized = true;
  }
}

// Intercept all nav link clicks
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-links a, .nav-actions a, .footer-links a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#') && pages.includes(href.replace('#',''))) {
        e.preventDefault();
        showPage(href.replace('#',''));
        // Close mobile menu if open
        document.getElementById('navLinks').classList.remove('open');
      }
    });
  });

  // Also handle hero CTA buttons and any other internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = a.getAttribute('href').replace('#','');
      if (pages.includes(target)) {
        e.preventDefault();
        showPage(target);
        document.getElementById('navLinks').classList.remove('open');
      }
    });
  });

  // Load last visited page or default to home
  const savedPage = localStorage.getItem('dardz-page') || 'home';
  showPage(savedPage);
});
// ===== PROPERTY DATA =====
const properties = [
  {
    id: 1,
    title: "Villa Moderne à Hydra",
    price: "85 000 000 DA",
    priceRaw: 85000000,
    location: "Hydra, Alger",
    type: "villa",
    status: "sale",
    beds: 5,
    baths: 4,
    sqft: "390 m²",
    garage: 2,
    description: "Superbe villa moderne au cœur du quartier résidentiel de Hydra, Alger. Salon spacieux, cuisine équipée, terrasse panoramique et jardin privé. Idéale pour une famille cherchant confort et prestige dans la capitale.",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    emoji: "🏡"
  },
  {
    id: 2,
    title: "Appartement F3 Bab Ezzouar",
    price: "55 000 DA/mois",
    priceRaw: 55000,
    location: "Bab Ezzouar, Alger",
    type: "apartment",
    status: "rent",
    beds: 3,
    baths: 2,
    sqft: "110 m²",
    garage: 1,
    description: "Bel appartement F3 bien ensoleillé dans une résidence sécurisée à Bab Ezzouar, proche de la zone technologique et des universités. Immeuble avec ascenseur, parking et gardien 24h/24.",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    emoji: "🏙️"
  },
  {
    id: 3,
    title: "Villa Bord de Mer – Aïn Taya",
    price: "120 000 000 DA",
    priceRaw: 120000000,
    location: "Aïn Taya, Alger",
    type: "villa",
    status: "sale",
    beds: 4,
    baths: 3,
    sqft: "320 m²",
    garage: 2,
    description: "Magnifique villa avec vue imprenable sur la mer Méditerranée à Aïn Taya. Accès direct à la plage, grande terrasse, piscine privée et jardin paysager. Un bien rare sur la côte algéroise.",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    emoji: "🏖️"
  },
  {
    id: 4,
    title: "Appartement F4 – Oran Centre",
    price: "38 000 000 DA",
    priceRaw: 38000000,
    location: "Oran Centre, Oran",
    type: "apartment",
    status: "sale",
    beds: 4,
    baths: 2,
    sqft: "145 m²",
    garage: 1,
    description: "Grand appartement F4 rénové au cœur d'Oran, à deux pas du front de mer. Cuisine moderne, double vitrage, parquet en bois. Quartier calme avec toutes les commodités à proximité.",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    emoji: "🏠"
  },
  {
    id: 5,
    title: "Penthouse Vue Mer – Annaba",
    price: "75 000 DA/mois",
    priceRaw: 75000,
    location: "Annaba Centre, Annaba",
    type: "apartment",
    status: "rent",
    beds: 3,
    baths: 3,
    sqft: "220 m²",
    garage: 2,
    description: "Penthouse d'exception avec vue panoramique sur la mer à Annaba. Grande terrasse privée, domotique, finitions haut de gamme. Résidence sécurisée avec piscine et salle de sport.",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    emoji: "🌆"
  },
  {
    id: 6,
    title: "Local Commercial – Constantine",
    price: "90 000 DA/mois",
    priceRaw: 90000,
    location: "Rue Larbi Ben M'hidi, Constantine",
    type: "commercial",
    status: "rent",
    beds: 0,
    baths: 2,
    sqft: "280 m²",
    garage: 3,
    description: "Local commercial idéalement situé sur l'artère principale de Constantine. Grande vitrine, espace ouvert modulable, réserve et sanitaires. Parfait pour commerce, showroom ou bureau. Fort passage piéton.",
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    emoji: "🏢"
  }
];

// ===== RENDER LISTINGS =====
let activeFilter = "all";

function getStatusBadge(status) {
  const map = { sale: ["For Sale", "badge-sale"], rent: ["For Rent", "badge-rent"], sold: ["Sold", "badge-sold"] };
  return map[status] || ["", ""];
}

function renderListings(filter = "all") {
  const grid = document.getElementById("listingsGrid");
  const filtered = filter === "all" ? properties : properties.filter(p => p.type === filter);

  grid.innerHTML = filtered.map(p => {
    const [label, cls] = getStatusBadge(p.status);
    const bedsHtml = p.beds > 0 ? `<span>🛏 ${p.beds} Beds</span>` : "";
    return `
      <div class="property-card" onclick="openModal(${p.id})">
        <div class="card-image">
          <div class="img-bg" style="background:${p.gradient};display:flex;align-items:center;justify-content:center;font-size:5rem;">${p.emoji}</div>
          <span class="card-badge ${cls}">${label}</span>
          <button class="card-favorite" onclick="toggleFav(event, this)" aria-label="Save property">♡</button>
        </div>
        <div class="card-body">
          <div class="card-price">${p.price} ${p.status === "rent" ? '<span>/ mois</span>' : ''}</div>
          <div class="card-title">${p.title}</div>
          <div class="card-location">📍 ${p.location}</div>
          <div class="card-features">
            ${bedsHtml}
            <span>🚿 ${p.baths} Bains</span>
            <span>📐 ${p.sqft}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function toggleFav(e, btn) {
  e.stopPropagation();
  btn.classList.toggle("liked");
  btn.textContent = btn.classList.contains("liked") ? "♥" : "♡";
}

// ===== FILTER BUTTONS =====
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderListings(activeFilter);
  });
});

// ===== MODAL =====
function openModal(id) {
  const p = properties.find(x => x.id === id);
  if (!p) return;
  const [label, cls] = getStatusBadge(p.status);
  const bedsHtml = p.beds > 0 ? `<div class="modal-feature"><strong>${p.beds}</strong>Chambres</div>` : "";

  document.getElementById("modalContent").innerHTML = `
    <div class="modal-img" style="background:${p.gradient};display:flex;align-items:center;justify-content:center;font-size:7rem;">${p.emoji}</div>
    <div class="modal-body">
      <span class="card-badge ${cls}" style="position:static;display:inline-block;margin-bottom:10px;">${label}</span>
      <h2>${p.title}</h2>
      <div class="modal-price">${p.price}${p.status === "rent" ? " <small style='font-size:.6em;color:#64748b'>/ mois</small>" : ""}</div>
      <div class="modal-location">📍 ${p.location}</div>
      <div class="modal-features-grid">
        ${bedsHtml}
        <div class="modal-feature"><strong>${p.baths}</strong>Salles de bain</div>
        <div class="modal-feature"><strong>${p.sqft}</strong>Surface</div>
        <div class="modal-feature"><strong>${p.garage}</strong>Garage</div>
      </div>
      <p class="modal-desc">${p.description}</p>
      <div class="modal-actions">
        <a href="#contact" class="btn btn-primary" onclick="closeModal()">Schedule a Tour →</a>
        <a href="#contact" class="btn btn-outline-dark" onclick="closeModal()">Contact Agent</a>
      </div>
    </div>
  `;
  document.getElementById("modalOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("active");
  document.body.style.overflow = "";
}

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalOverlay").addEventListener("click", e => {
  if (e.target === document.getElementById("modalOverlay")) closeModal();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});
navLinks.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => navLinks.classList.remove("open"));
});

// ===== SEARCH TABS =====
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
  });
});

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString() + (target >= 100 ? "+" : "");
  }, 16);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".counter").forEach(el => counterObserver.observe(el));

// ===== CONTACT FORM =====
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const note = document.getElementById("formNote");
  note.textContent = "✅ Thank you! We'll be in touch within 24 hours.";
  e.target.reset();
  setTimeout(() => note.textContent = "", 5000);
});

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".feature-card, .agent-card, .testimonial-card").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(24px)";
  el.style.transition = "opacity .5s ease, transform .5s ease";
  revealObserver.observe(el);
});

// ===== INIT =====
renderListings();

// ===== MAP =====
// Coordinates for Algerian cities
const propertyCoords = {
  1: [36.7372, 3.0466],    // Hydra, Alger
  2: [36.7213, 3.1840],    // Bab Ezzouar, Alger
  3: [36.7900, 3.2500],    // Aïn Taya, Alger
  4: [35.6969, -0.6331],   // Oran Centre
  5: [36.9000, 7.7667],    // Annaba Centre
  6: [36.3650, 6.6147],    // Constantine Centre
};

function initMap() {
  const map = L.map("propertyMap", {
    center: [28.0339, 1.6596],  // Centre of Algeria
    zoom: 5,
    zoomControl: true,
  });

  // OpenStreetMap tiles (free, no API key)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  const markers = {};
  const listEl = document.getElementById("mapList");

  properties.forEach(p => {
    const coords = propertyCoords[p.id];
    if (!coords) return;

    const [label, cls] = getStatusBadge(p.status);
    const badgeColor = p.status === "sale" ? "#2563eb" : p.status === "rent" ? "#10b981" : "#ef4444";

    // Custom marker icon
    const icon = L.divIcon({
      className: "",
      html: `<div style="
        background:${badgeColor};
        color:#fff;
        padding:5px 10px;
        border-radius:20px;
        font-size:.78rem;
        font-weight:700;
        white-space:nowrap;
        box-shadow:0 3px 10px rgba(0,0,0,.25);
        border:2px solid #fff;
        cursor:pointer;
      ">${p.price}</div>`,
      iconAnchor: [40, 16],
    });

    const bedsHtml = p.beds > 0 ? `<span>🛏 ${p.beds}</span>` : "";
    const popupHtml = `
      <div class="map-popup">
        <div class="pop-emoji" style="background:${p.gradient}">${p.emoji}</div>
        <div style="padding:12px 14px 14px">
          <div class="pop-price">${p.price}${p.status === "rent" ? "/mois" : ""}</div>
          <div class="pop-title">${p.title}</div>
          <div class="pop-loc">📍 ${p.location}</div>
          <div class="pop-features">
            ${bedsHtml}
            <span>🚿 ${p.baths}</span>
            <span>📐 ${p.sqft}</span>
          </div>
          <a href="#" class="pop-btn" onclick="openModal(${p.id});return false;">Voir les détails →</a>
        </div>
      </div>
    `;

    const marker = L.marker(coords, { icon })
      .addTo(map)
      .bindPopup(popupHtml, { maxWidth: 240, minWidth: 220 });

    markers[p.id] = { marker, coords };

    // Sidebar list item
    const item = document.createElement("div");
    item.className = "map-list-item";
    item.dataset.id = p.id;
    item.innerHTML = `
      <span class="mli-badge ${cls}">${label}</span>
      <div class="mli-price">${p.price}${p.status === "rent" ? "/mois" : ""}</div>
      <div class="mli-title">${p.title}</div>
      <div class="mli-loc">📍 ${p.location}</div>
    `;
    item.addEventListener("click", () => {
      // Highlight active
      document.querySelectorAll(".map-list-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      // Fly to marker and open popup
      map.flyTo(coords, 13, { duration: 1 });
      setTimeout(() => markers[p.id].marker.openPopup(), 900);
    });
    listEl.appendChild(item);
  });

  // Open popup on marker click → highlight sidebar item
  properties.forEach(p => {
    if (!markers[p.id]) return;
    markers[p.id].marker.on("click", () => {
      document.querySelectorAll(".map-list-item").forEach(i => i.classList.remove("active"));
      const sideItem = listEl.querySelector(`[data-id="${p.id}"]`);
      if (sideItem) {
        sideItem.classList.add("active");
        sideItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  });
}

// Map is initialized by the page router when the map page is first visited

// ===== LIST YOUR PROPERTY FORM =====

// --- Toggle Sale / Rent ---
document.querySelectorAll("#lp-listing-type .toggle-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#lp-listing-type .toggle-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById("lp-type").value = btn.dataset.value;
  });
});

// --- Character counter ---
const lpDesc = document.getElementById("lp-desc");
const lpDescCount = document.getElementById("lp-desc-count");
if (lpDesc) {
  lpDesc.addEventListener("input", () => {
    const len = lpDesc.value.length;
    lpDescCount.textContent = `${len} / 1000`;
    if (len > 1000) lpDesc.value = lpDesc.value.slice(0, 1000);
  });
}

// --- Photo upload & preview ---
const photoInput = document.getElementById("lp-photos");
const photoPreviews = document.getElementById("photoPreviews");
const photoUploadArea = document.getElementById("photoUploadArea");
const photoPlaceholder = document.getElementById("photoPlaceholder");
let uploadedFiles = [];

function renderPreviews() {
  photoPreviews.innerHTML = "";
  if (uploadedFiles.length === 0) {
    photoPlaceholder.style.display = "";
    return;
  }
  photoPlaceholder.style.display = "none";
  uploadedFiles.forEach((file, idx) => {
    const reader = new FileReader();
    reader.onload = e => {
      const item = document.createElement("div");
      item.className = "photo-preview-item";
      item.innerHTML = `
        <img src="${e.target.result}" alt="Preview ${idx + 1}" />
        <button type="button" class="photo-remove" data-idx="${idx}" aria-label="Remove photo">✕</button>
      `;
      item.querySelector(".photo-remove").addEventListener("click", () => {
        uploadedFiles.splice(idx, 1);
        renderPreviews();
      });
      photoPreviews.appendChild(item);
    };
    reader.readAsDataURL(file);
  });
}

if (photoInput) {
  photoInput.addEventListener("change", () => {
    const newFiles = Array.from(photoInput.files);
    const combined = [...uploadedFiles, ...newFiles].slice(0, 10);
    uploadedFiles = combined;
    renderPreviews();
    photoInput.value = "";
  });
}

// Drag & drop
if (photoUploadArea) {
  photoUploadArea.addEventListener("dragover", e => {
    e.preventDefault();
    photoUploadArea.classList.add("drag-over");
  });
  photoUploadArea.addEventListener("dragleave", () => photoUploadArea.classList.remove("drag-over"));
  photoUploadArea.addEventListener("drop", e => {
    e.preventDefault();
    photoUploadArea.classList.remove("drag-over");
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    uploadedFiles = [...uploadedFiles, ...files].slice(0, 10);
    renderPreviews();
  });
  photoUploadArea.addEventListener("click", e => {
    if (e.target.classList.contains("upload-link") || e.target.classList.contains("photo-remove")) return;
    document.getElementById("lp-photos").click();
  });
}

// --- Validation helpers ---
function setError(fieldId, errId, msg) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errId);
  if (field) field.classList.toggle("invalid", !!msg);
  if (err) err.textContent = msg || "";
  return !!msg;
}

function validateListingForm() {
  let hasError = false;

  hasError = setError("lp-name", "err-lp-name",
    !document.getElementById("lp-name").value.trim() ? "Full name is required." : "") || hasError;

  const phone = document.getElementById("lp-phone").value.trim();
  hasError = setError("lp-phone", "err-lp-phone",
    !phone ? "Phone number is required." :
    !/^[+\d\s\-()]{7,20}$/.test(phone) ? "Enter a valid phone number." : "") || hasError;

  const email = document.getElementById("lp-email").value.trim();
  hasError = setError("lp-email", "err-lp-email",
    !email ? "Email is required." :
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Enter a valid email address." : "") || hasError;

  hasError = setError("lp-prop-type", "err-lp-prop-type",
    !document.getElementById("lp-prop-type").value ? "Please select a property type." : "") || hasError;

  hasError = setError("lp-title", "err-lp-title",
    !document.getElementById("lp-title").value.trim() ? "Property title is required." : "") || hasError;

  hasError = setError("lp-city", "err-lp-city",
    !document.getElementById("lp-city").value.trim() ? "City is required." : "") || hasError;

  const price = document.getElementById("lp-price").value;
  hasError = setError("lp-price", "err-lp-price",
    !price ? "Price is required." :
    Number(price) <= 0 ? "Price must be greater than 0." : "") || hasError;

  const area = document.getElementById("lp-area").value;
  hasError = setError("lp-area", "err-lp-area",
    !area ? "Area is required." :
    Number(area) <= 0 ? "Area must be greater than 0." : "") || hasError;

  hasError = setError("lp-desc", "err-lp-desc",
    document.getElementById("lp-desc").value.trim().length < 30 ? "Please write at least 30 characters." : "") || hasError;

  const terms = document.getElementById("lp-terms");
  const termsErr = document.getElementById("err-lp-terms");
  if (!terms.checked) {
    termsErr.textContent = "You must agree to the terms.";
    hasError = true;
  } else {
    termsErr.textContent = "";
  }

  return !hasError;
}

// --- Form submit ---
const listPropertyForm = document.getElementById("listPropertyForm");
if (listPropertyForm) {
  listPropertyForm.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateListingForm()) return;

    // Collect data (in a real app, send to backend)
    const listing = {
      type: document.getElementById("lp-type").value,
      propType: document.getElementById("lp-prop-type").value,
      title: document.getElementById("lp-title").value.trim(),
      city: document.getElementById("lp-city").value.trim(),
      address: document.getElementById("lp-address").value.trim(),
      price: document.getElementById("lp-price").value,
      area: document.getElementById("lp-area").value,
      beds: document.getElementById("lp-beds").value,
      baths: document.getElementById("lp-baths").value,
      floor: document.getElementById("lp-floor").value,
      year: document.getElementById("lp-year").value,
      description: document.getElementById("lp-desc").value.trim(),
      amenities: [...document.querySelectorAll(".amenity-check input:checked")].map(i => i.value),
      owner: {
        name: document.getElementById("lp-name").value.trim(),
        phone: document.getElementById("lp-phone").value.trim(),
        email: document.getElementById("lp-email").value.trim(),
      },
      photos: uploadedFiles.length,
      submittedAt: new Date().toISOString(),
    };

    console.log("New listing submitted:", listing);

    // Show success modal
    document.getElementById("successOverlay").classList.add("active");
    document.body.style.overflow = "hidden";

    // Reset form
    listPropertyForm.reset();
    uploadedFiles = [];
    renderPreviews();
    document.querySelectorAll("#lp-listing-type .toggle-btn").forEach((b, i) => b.classList.toggle("active", i === 0));
    document.getElementById("lp-type").value = "sale";
    document.querySelectorAll(".field-error").forEach(el => el.textContent = "");
    document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
    lpDescCount.textContent = "0 / 1000";
  });
}

// Close success overlay on backdrop click
document.getElementById("successOverlay")?.addEventListener("click", e => {
  if (e.target === document.getElementById("successOverlay")) {
    document.getElementById("successOverlay").classList.remove("active");
    document.body.style.overflow = "";
  }
});


