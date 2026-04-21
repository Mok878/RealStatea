// ===== PROPERTY DATA =====
const properties = [
  {
    id: 1,
    title: "Modern Family Villa",
    price: "$850,000",
    priceRaw: 850000,
    location: "Beverly Hills, CA",
    type: "villa",
    status: "sale",
    beds: 5,
    baths: 4,
    sqft: "4,200",
    garage: 2,
    description: "A stunning modern villa nestled in the heart of Beverly Hills. Features an open-plan living area, chef's kitchen, home theater, and a resort-style pool. Perfect for families seeking luxury and comfort.",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    emoji: "🏡"
  },
  {
    id: 2,
    title: "Downtown Luxury Apartment",
    price: "$3,200/mo",
    priceRaw: 3200,
    location: "Manhattan, NY",
    type: "apartment",
    status: "rent",
    beds: 2,
    baths: 2,
    sqft: "1,100",
    garage: 1,
    description: "Sleek and sophisticated apartment in the heart of Manhattan. Floor-to-ceiling windows offer breathtaking city views. Building amenities include a rooftop terrace, gym, and 24/7 concierge.",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    emoji: "🏙️"
  },
  {
    id: 3,
    title: "Beachfront Cottage",
    price: "$1,250,000",
    priceRaw: 1250000,
    location: "Malibu, CA",
    type: "house",
    status: "sale",
    beds: 3,
    baths: 2,
    sqft: "1,800",
    garage: 1,
    description: "Wake up to the sound of waves in this charming beachfront cottage. Direct beach access, wraparound deck, and stunning ocean views from every room. A rare gem on the Malibu coastline.",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    emoji: "🏖️"
  },
  {
    id: 4,
    title: "Suburban Family Home",
    price: "$425,000",
    priceRaw: 425000,
    location: "Austin, TX",
    type: "house",
    status: "sale",
    beds: 4,
    baths: 3,
    sqft: "2,600",
    garage: 2,
    description: "Spacious family home in a quiet, tree-lined neighborhood. Large backyard with a deck, updated kitchen, and top-rated school district. Move-in ready with fresh paint and new flooring throughout.",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    emoji: "🏠"
  },
  {
    id: 5,
    title: "Penthouse Suite",
    price: "$5,500/mo",
    priceRaw: 5500,
    location: "Chicago, IL",
    type: "apartment",
    status: "rent",
    beds: 3,
    baths: 3,
    sqft: "2,400",
    garage: 2,
    description: "Exclusive penthouse with panoramic views of Lake Michigan and the Chicago skyline. Private rooftop terrace, smart home technology, and premium finishes throughout. The pinnacle of urban living.",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    emoji: "🌆"
  },
  {
    id: 6,
    title: "Prime Office Space",
    price: "$8,000/mo",
    priceRaw: 8000,
    location: "San Francisco, CA",
    type: "commercial",
    status: "rent",
    beds: 0,
    baths: 4,
    sqft: "3,500",
    garage: 5,
    description: "Premium commercial office space in the heart of San Francisco's financial district. Open floor plan, private meeting rooms, high-speed fiber internet, and stunning bay views. Ideal for tech startups and established firms.",
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
          <div class="card-price">${p.price} ${p.status === "rent" ? '<span>/ month</span>' : ''}</div>
          <div class="card-title">${p.title}</div>
          <div class="card-location">📍 ${p.location}</div>
          <div class="card-features">
            ${bedsHtml}
            <span>🚿 ${p.baths} Baths</span>
            <span>📐 ${p.sqft} sqft</span>
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
  const bedsHtml = p.beds > 0 ? `<div class="modal-feature"><strong>${p.beds}</strong>Bedrooms</div>` : "";

  document.getElementById("modalContent").innerHTML = `
    <div class="modal-img" style="background:${p.gradient};display:flex;align-items:center;justify-content:center;font-size:7rem;">${p.emoji}</div>
    <div class="modal-body">
      <span class="card-badge ${cls}" style="position:static;display:inline-block;margin-bottom:10px;">${label}</span>
      <h2>${p.title}</h2>
      <div class="modal-price">${p.price}${p.status === "rent" ? " <small style='font-size:.6em;color:#64748b'>/ month</small>" : ""}</div>
      <div class="modal-location">📍 ${p.location}</div>
      <div class="modal-features-grid">
        ${bedsHtml}
        <div class="modal-feature"><strong>${p.baths}</strong>Bathrooms</div>
        <div class="modal-feature"><strong>${p.sqft}</strong>Sq Ft</div>
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
// Approximate coordinates for each property
const propertyCoords = {
  1: [34.0736, -118.4004],   // Beverly Hills, CA
  2: [40.7580, -73.9855],    // Manhattan, NY
  3: [34.0259, -118.7798],   // Malibu, CA
  4: [30.2672, -97.7431],    // Austin, TX
  5: [41.8827, -87.6233],    // Chicago, IL
  6: [37.7749, -122.4194],   // San Francisco, CA
};

function initMap() {
  const map = L.map("propertyMap", {
    center: [37.5, -96],
    zoom: 4,
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
          <div class="pop-price">${p.price}${p.status === "rent" ? "/mo" : ""}</div>
          <div class="pop-title">${p.title}</div>
          <div class="pop-loc">📍 ${p.location}</div>
          <div class="pop-features">
            ${bedsHtml}
            <span>🚿 ${p.baths}</span>
            <span>📐 ${p.sqft} sqft</span>
          </div>
          <a href="#" class="pop-btn" onclick="openModal(${p.id});return false;">View Details →</a>
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
      <div class="mli-price">${p.price}${p.status === "rent" ? "/mo" : ""}</div>
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

// Init map when section scrolls into view (lazy load)
const mapObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    initMap();
    mapObserver.disconnect();
  }
}, { threshold: 0.1 });

const mapSection = document.getElementById("propertyMap");
if (mapSection) mapObserver.observe(mapSection);

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
