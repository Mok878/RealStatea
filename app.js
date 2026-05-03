// ===== PAGE ROUTER =====
var mapInitialized = false;

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(function(p){ p.classList.remove("active"); });
  var target = document.getElementById("page-" + pageId);
  if (target) {
    target.classList.add("active");
    window.scrollTo(0, 0);
  }
  document.querySelectorAll(".nav-links a").forEach(function(a){
    a.classList.toggle("nav-active", a.dataset.page === pageId);
  });
  localStorage.setItem("dardz-page", pageId);
  if (pageId === "map" && !mapInitialized) {
    mapInitialized = true;
    setTimeout(initMap, 200);
  }
  if (pageId === "services") {
    setTimeout(function(){
      document.querySelectorAll(".counter").forEach(function(el){
        if (!el.dataset.counted) { el.dataset.counted = "1"; animateCounter(el); }
      });
    }, 300);
  }
}

// ===== PROPERTY DATA =====
var properties = [
  { id:1, title:"Villa Moderne a Hydra", price:"85 000 000 DA", location:"Hydra, Alger", type:"villa", status:"sale", beds:5, baths:4, sqft:"390 m2", garage:2, description:"Superbe villa moderne au coeur du quartier residentiel de Hydra, Alger. Salon spacieux, cuisine equipee, terrasse panoramique et jardin prive.", gradient:"linear-gradient(135deg,#667eea,#764ba2)", emoji:"&#127969;" },
  { id:2, title:"Appartement F3 Bab Ezzouar", price:"55 000 DA/mois", location:"Bab Ezzouar, Alger", type:"apartment", status:"rent", beds:3, baths:2, sqft:"110 m2", garage:1, description:"Bel appartement F3 dans une residence securisee a Bab Ezzouar, proche de la zone technologique. Immeuble avec ascenseur et gardien 24h/24.", gradient:"linear-gradient(135deg,#f093fb,#f5576c)", emoji:"&#127961;" },
  { id:3, title:"Villa Bord de Mer - Ain Taya", price:"120 000 000 DA", location:"Ain Taya, Alger", type:"villa", status:"sale", beds:4, baths:3, sqft:"320 m2", garage:2, description:"Magnifique villa avec vue sur la mer Mediterranee a Ain Taya. Acces direct a la plage, grande terrasse et piscine privee.", gradient:"linear-gradient(135deg,#4facfe,#00f2fe)", emoji:"&#127958;" },
  { id:4, title:"Appartement F4 - Oran Centre", price:"38 000 000 DA", location:"Oran Centre, Oran", type:"apartment", status:"sale", beds:4, baths:2, sqft:"145 m2", garage:1, description:"Grand appartement F4 renove au coeur d Oran. Cuisine moderne, double vitrage, parquet en bois. Quartier calme avec toutes les commodites.", gradient:"linear-gradient(135deg,#43e97b,#38f9d7)", emoji:"&#127968;" },
  { id:5, title:"Penthouse Vue Mer - Annaba", price:"75 000 DA/mois", location:"Annaba Centre, Annaba", type:"apartment", status:"rent", beds:3, baths:3, sqft:"220 m2", garage:2, description:"Penthouse d exception avec vue panoramique sur la mer a Annaba. Grande terrasse privee, domotique, finitions haut de gamme.", gradient:"linear-gradient(135deg,#fa709a,#fee140)", emoji:"&#127750;" },
  { id:6, title:"Local Commercial - Constantine", price:"90 000 DA/mois", location:"Rue Larbi Ben Mhidi, Constantine", type:"commercial", status:"rent", beds:0, baths:2, sqft:"280 m2", garage:3, description:"Local commercial sur l artere principale de Constantine. Grande vitrine, espace ouvert modulable. Fort passage pieton.", gradient:"linear-gradient(135deg,#a18cd1,#fbc2eb)", emoji:"&#127970;" }
];

// ===== RENDER LISTINGS =====
function getStatusBadge(status) {
  var map = { sale:["For Sale","badge-sale"], rent:["For Rent","badge-rent"], sold:["Sold","badge-sold"] };
  return map[status] || ["",""];
}

function renderListings(filter) {
  filter = filter || "all";
  var grid = document.getElementById("listingsGrid");
  if (!grid) return;
  var filtered = filter === "all" ? properties : properties.filter(function(p){ return p.type === filter; });
  grid.innerHTML = filtered.map(function(p) {
    var badge = getStatusBadge(p.status);
    var bedsHtml = p.beds > 0 ? "<span>&#127761; " + p.beds + " Beds</span>" : "";
    return "<div class=\"property-card\" onclick=\"openModal(" + p.id + ")\">" +
      "<div class=\"card-image\">" +
      "<div class=\"img-bg\" style=\"background:" + p.gradient + ";display:flex;align-items:center;justify-content:center;font-size:5rem;\">" + p.emoji + "</div>" +
      "<span class=\"card-badge " + badge[1] + "\">" + badge[0] + "</span>" +
      "<button class=\"card-favorite\" onclick=\"toggleFav(event,this)\">&#9825;</button>" +
      "</div>" +
      "<div class=\"card-body\">" +
      "<div class=\"card-price\">" + p.price + "</div>" +
      "<div class=\"card-title\">" + p.title + "</div>" +
      "<div class=\"card-location\">&#128205; " + p.location + "</div>" +
      "<div class=\"card-features\">" + bedsHtml + "<span>&#128703; " + p.baths + " Baths</span><span>&#128208; " + p.sqft + "</span></div>" +
      "</div></div>";
  }).join("");
}

function toggleFav(e, btn) {
  e.stopPropagation();
  btn.classList.toggle("liked");
  btn.innerHTML = btn.classList.contains("liked") ? "&#9829;" : "&#9825;";
}

document.querySelectorAll(".filter-btn").forEach(function(btn){
  btn.addEventListener("click", function(){
    document.querySelectorAll(".filter-btn").forEach(function(b){ b.classList.remove("active"); });
    btn.classList.add("active");
    renderListings(btn.dataset.filter);
  });
});

// ===== MODAL =====
function openModal(id) {
  var p = properties.find(function(x){ return x.id === id; });
  if (!p) return;
  var badge = getStatusBadge(p.status);
  var bedsHtml = p.beds > 0 ? "<div class=\"modal-feature\"><strong>" + p.beds + "</strong>Bedrooms</div>" : "";
  document.getElementById("modalContent").innerHTML =
    "<div class=\"modal-img\" style=\"background:" + p.gradient + ";display:flex;align-items:center;justify-content:center;font-size:7rem;\">" + p.emoji + "</div>" +
    "<div class=\"modal-body\">" +
    "<span class=\"card-badge " + badge[1] + "\" style=\"position:static;display:inline-block;margin-bottom:10px;\">" + badge[0] + "</span>" +
    "<h2>" + p.title + "</h2>" +
    "<div class=\"modal-price\">" + p.price + "</div>" +
    "<div class=\"modal-location\">&#128205; " + p.location + "</div>" +
    "<div class=\"modal-features-grid\">" + bedsHtml +
    "<div class=\"modal-feature\"><strong>" + p.baths + "</strong>Bathrooms</div>" +
    "<div class=\"modal-feature\"><strong>" + p.sqft + "</strong>Surface</div>" +
    "<div class=\"modal-feature\"><strong>" + p.garage + "</strong>Garage</div></div>" +
    "<p class=\"modal-desc\">" + p.description + "</p>" +
    "<div class=\"modal-actions\">" +
    "<a href=\"#\" class=\"btn btn-primary\" onclick=\"closeModal();showPage('contact');return false;\">Schedule a Tour</a>" +
    "<a href=\"#\" class=\"btn btn-outline-dark\" onclick=\"closeModal();showPage('contact');return false;\">Contact Agent</a>" +
    "</div></div>";
  document.getElementById("modalOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("active");
  document.body.style.overflow = "";
}

document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modalOverlay").addEventListener("click", function(e){
  if (e.target === document.getElementById("modalOverlay")) closeModal();
});
document.addEventListener("keydown", function(e){ if (e.key === "Escape") closeModal(); });

// ===== NAVBAR SCROLL =====
var navbar = document.getElementById("navbar");
window.addEventListener("scroll", function(){
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// ===== HAMBURGER =====
document.getElementById("hamburger").addEventListener("click", function(){
  document.getElementById("navLinks").classList.toggle("open");
});

// ===== SEARCH TABS =====
document.querySelectorAll(".tab").forEach(function(tab){
  tab.addEventListener("click", function(){
    document.querySelectorAll(".tab").forEach(function(t){ t.classList.remove("active"); });
    tab.classList.add("active");
  });
});

// ===== COUNTER =====
function animateCounter(el) {
  var target = parseInt(el.dataset.target);
  var step = target / 80;
  var current = 0;
  var timer = setInterval(function(){
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString() + "+";
  }, 20);
}

// ===== CONTACT FORM =====
document.getElementById("contactForm").addEventListener("submit", function(e){
  e.preventDefault();
  var note = document.getElementById("formNote");
  note.textContent = "Thank you! We will be in touch within 24 hours.";
  e.target.reset();
  setTimeout(function(){ note.textContent = ""; }, 5000);
});

// ===== MAP =====
var propertyCoords = {
  1:[36.7372,3.0466], 2:[36.7213,3.1840], 3:[36.7900,3.2500],
  4:[35.6969,-0.6331], 5:[36.9000,7.7667], 6:[36.3650,6.6147]
};

function initMap() {
  var mapEl = document.getElementById("propertyMap");
  if (!mapEl || mapEl._leaflet_id) return;
  var map = L.map("propertyMap", { center:[28.0339,1.6596], zoom:5 });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:"&copy; OpenStreetMap contributors", maxZoom:19
  }).addTo(map);
  var markers = {};
  var listEl = document.getElementById("mapList");
  if (listEl) listEl.innerHTML = "";
  properties.forEach(function(p){
    var coords = propertyCoords[p.id];
    if (!coords) return;
    var badge = getStatusBadge(p.status);
    var color = p.status==="sale"?"#2563eb":p.status==="rent"?"#10b981":"#ef4444";
    var icon = L.divIcon({ className:"", html:"<div style=\"background:"+color+";color:#fff;padding:5px 10px;border-radius:20px;font-size:.78rem;font-weight:700;white-space:nowrap;box-shadow:0 3px 10px rgba(0,0,0,.25);border:2px solid #fff;\">"+p.price+"</div>", iconAnchor:[40,16] });
    var bedsHtml = p.beds > 0 ? "<span>&#127761; "+p.beds+"</span>" : "";
    var popup = "<div class=\"map-popup\"><div class=\"pop-emoji\" style=\"background:"+p.gradient+";padding:20px;text-align:center;font-size:3rem;\">"+p.emoji+"</div><div style=\"padding:12px 14px\"><div class=\"pop-price\">"+p.price+"</div><div class=\"pop-title\">"+p.title+"</div><div class=\"pop-loc\">&#128205; "+p.location+"</div><div class=\"pop-features\">"+bedsHtml+"<span>&#128703; "+p.baths+"</span><span>&#128208; "+p.sqft+"</span></div><a href=\"#\" class=\"pop-btn\" onclick=\"openModal("+p.id+");return false;\">View Details</a></div></div>";
    var marker = L.marker(coords,{icon:icon}).addTo(map).bindPopup(popup,{maxWidth:240,minWidth:220});
    markers[p.id] = {marker:marker, coords:coords};
    if (listEl) {
      var item = document.createElement("div");
      item.className = "map-list-item";
      item.dataset.id = p.id;
      item.innerHTML = "<span class=\"mli-badge "+badge[1]+"\">"+badge[0]+"</span><div class=\"mli-price\">"+p.price+"</div><div class=\"mli-title\">"+p.title+"</div><div class=\"mli-loc\">&#128205; "+p.location+"</div>";
      item.addEventListener("click", function(){
        document.querySelectorAll(".map-list-item").forEach(function(i){ i.classList.remove("active"); });
        item.classList.add("active");
        map.flyTo(coords, 13, {duration:1});
        setTimeout(function(){ markers[p.id].marker.openPopup(); }, 900);
      });
      listEl.appendChild(item);
      marker.on("click", function(){
        document.querySelectorAll(".map-list-item").forEach(function(i){ i.classList.remove("active"); });
        item.classList.add("active");
        item.scrollIntoView({behavior:"smooth",block:"nearest"});
      });
    }
  });
  setTimeout(function(){ map.invalidateSize(); }, 300);
}

// ===== LIST PROPERTY FORM =====
document.querySelectorAll("#lp-listing-type .toggle-btn").forEach(function(btn){
  btn.addEventListener("click", function(){
    document.querySelectorAll("#lp-listing-type .toggle-btn").forEach(function(b){ b.classList.remove("active"); });
    btn.classList.add("active");
    document.getElementById("lp-type").value = btn.dataset.value;
  });
});

var lpDesc = document.getElementById("lp-desc");
var lpDescCount = document.getElementById("lp-desc-count");
if (lpDesc) {
  lpDesc.addEventListener("input", function(){
    var len = lpDesc.value.length;
    lpDescCount.textContent = len + " / 1000";
    if (len > 1000) lpDesc.value = lpDesc.value.slice(0,1000);
  });
}

var photoInput = document.getElementById("lp-photos");
var photoPreviews = document.getElementById("photoPreviews");
var photoPlaceholder = document.getElementById("photoPlaceholder");
var photoUploadArea = document.getElementById("photoUploadArea");
var uploadedFiles = [];

function renderPreviews() {
  if (!photoPreviews) return;
  photoPreviews.innerHTML = "";
  if (uploadedFiles.length === 0) { if(photoPlaceholder) photoPlaceholder.style.display=""; return; }
  if(photoPlaceholder) photoPlaceholder.style.display="none";
  uploadedFiles.forEach(function(file,idx){
    var reader = new FileReader();
    reader.onload = function(e){
      var item = document.createElement("div");
      item.className = "photo-preview-item";
      item.innerHTML = "<img src=\""+e.target.result+"\" alt=\"Preview\"/><button type=\"button\" class=\"photo-remove\" data-idx=\""+idx+"\">&#10005;</button>";
      item.querySelector(".photo-remove").addEventListener("click", function(){
        uploadedFiles.splice(idx,1); renderPreviews();
      });
      photoPreviews.appendChild(item);
    };
    reader.readAsDataURL(file);
  });
}

if (photoInput) {
  photoInput.addEventListener("change", function(){
    uploadedFiles = uploadedFiles.concat(Array.from(photoInput.files)).slice(0,10);
    renderPreviews(); photoInput.value="";
  });
}
if (photoUploadArea) {
  photoUploadArea.addEventListener("dragover", function(e){ e.preventDefault(); photoUploadArea.classList.add("drag-over"); });
  photoUploadArea.addEventListener("dragleave", function(){ photoUploadArea.classList.remove("drag-over"); });
  photoUploadArea.addEventListener("drop", function(e){
    e.preventDefault(); photoUploadArea.classList.remove("drag-over");
    uploadedFiles = uploadedFiles.concat(Array.from(e.dataTransfer.files).filter(function(f){ return f.type.startsWith("image/"); })).slice(0,10);
    renderPreviews();
  });
  photoUploadArea.addEventListener("click", function(e){
    if (!e.target.classList.contains("upload-link") && !e.target.classList.contains("photo-remove"))
      document.getElementById("lp-photos").click();
  });
}

function setError(fieldId, errId, msg) {
  var field = document.getElementById(fieldId);
  var err = document.getElementById(errId);
  if (field) field.classList.toggle("invalid", !!msg);
  if (err) err.textContent = msg || "";
  return !!msg;
}

var listPropertyForm = document.getElementById("listPropertyForm");
if (listPropertyForm) {
  listPropertyForm.addEventListener("submit", function(e){
    e.preventDefault();
    var hasError = false;
    hasError = setError("lp-name","err-lp-name", !document.getElementById("lp-name").value.trim()?"Name is required.":"") || hasError;
    hasError = setError("lp-phone","err-lp-phone", !document.getElementById("lp-phone").value.trim()?"Phone is required.":"") || hasError;
    hasError = setError("lp-email","err-lp-email", !document.getElementById("lp-email").value.trim()?"Email is required.":"") || hasError;
    hasError = setError("lp-prop-type","err-lp-prop-type", !document.getElementById("lp-prop-type").value?"Select a property type.":"") || hasError;
    hasError = setError("lp-title","err-lp-title", !document.getElementById("lp-title").value.trim()?"Title is required.":"") || hasError;
    hasError = setError("lp-city","err-lp-city", !document.getElementById("lp-city").value.trim()?"City is required.":"") || hasError;
    hasError = setError("lp-price","err-lp-price", !document.getElementById("lp-price").value?"Price is required.":"") || hasError;
    hasError = setError("lp-area","err-lp-area", !document.getElementById("lp-area").value?"Area is required.":"") || hasError;
    hasError = setError("lp-desc","err-lp-desc", document.getElementById("lp-desc").value.trim().length<30?"Write at least 30 characters.":"") || hasError;
    var terms = document.getElementById("lp-terms");
    var termsErr = document.getElementById("err-lp-terms");
    if (!terms.checked) { termsErr.textContent="You must agree to the terms."; hasError=true; } else { termsErr.textContent=""; }
    if (hasError) return;
    document.getElementById("successOverlay").classList.add("active");
    document.body.style.overflow="hidden";
    listPropertyForm.reset(); uploadedFiles=[]; renderPreviews();
    document.querySelectorAll("#lp-listing-type .toggle-btn").forEach(function(b,i){ b.classList.toggle("active",i===0); });
    document.getElementById("lp-type").value="sale";
    document.querySelectorAll(".field-error").forEach(function(el){ el.textContent=""; });
    document.querySelectorAll(".invalid").forEach(function(el){ el.classList.remove("invalid"); });
    if(lpDescCount) lpDescCount.textContent="0 / 1000";
  });
}

document.getElementById("successOverlay").addEventListener("click", function(e){
  if (e.target===document.getElementById("successOverlay")){ document.getElementById("successOverlay").classList.remove("active"); document.body.style.overflow=""; }
});

// ===== SCROLL REVEAL =====
var revealObserver = new IntersectionObserver(function(entries){
  entries.forEach(function(entry){ if(entry.isIntersecting){ entry.target.style.opacity="1"; entry.target.style.transform="translateY(0)"; } });
},{threshold:0.1});
document.querySelectorAll(".feature-card,.agent-card,.testimonial-card").forEach(function(el){
  el.style.opacity="0"; el.style.transform="translateY(24px)"; el.style.transition="opacity .5s ease,transform .5s ease";
  revealObserver.observe(el);
});

// ===== INIT =====
renderListings();
var savedPage = localStorage.getItem("dardz-page") || "home";
showPage(savedPage);



