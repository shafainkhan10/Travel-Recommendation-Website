
// --- Simple data model for recommendations ---
const destinations = {
  beaches: [
    {
      name: "Bora Bora, French Polynesia",
      country: "France (Polynesia)",
      img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop",
      blurb: "Turquoise lagoons, overwater bungalows, idyllic snorkeling."
    },
    {
      name: "Goa, India",
      country: "India",
      img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1600&auto=format&fit=crop",
      blurb: "Laid-back beaches, vibrant nightlife, and spicy seafood."
    }
  ],
  temples: [
    {
      name: "Angkor Wat, Cambodia",
      country: "Cambodia",
      img: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=1600&auto=format&fit=crop",
      blurb: "The world’s largest religious monument — sunrise is magical."
    },
    {
      name: "Meenakshi Amman Temple, Madurai",
      country: "India",
      img: "https://images.unsplash.com/photo-1577613862361-2cb98631f92f?q=80&w=1600&auto=format&fit=crop",
      blurb: "Dravidian architecture with towering gopurams and vibrant sculptures."
    }
  ],
  byCountry: {
    Japan: [
      {
        name: "Kyoto — Fushimi Inari Shrine",
        img: "https://images.unsplash.com/photo-1502175353174-a7a70e73b362?q=80&w=1600&auto=format&fit=crop",
        blurb: "Thousands of vermilion torii gates climbing a sacred mountain."
      },
      {
        name: "Mount Fuji (Fuji Five Lakes)",
        img: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1600&auto=format&fit=crop",
        blurb: "Iconic volcano views, lakeside trails, and spring blossoms."
      }
    ],
    India: [
      {
        name: "Hampi, Karnataka",
        img: "https://images.unsplash.com/photo-1599661046289-d01c21c9dbcf?q=80&w=1600&auto=format&fit=crop",
        blurb: "UNESCO ruins set in surreal boulder-strewn landscapes."
      },
      {
        name: "Rishikesh, Uttarakhand",
        img: "https://images.unsplash.com/photo-1604671801904-6ad57aa65d26?q=80&w=1600&auto=format&fit=crop",
        blurb: "Yoga capital by the Ganges, bridges, rapids, and Himalayan foothills."
      }
    ],
    Italy: [
      {
        name: "Amalfi Coast",
        img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
        blurb: "Cliffside towns, lemon groves, and cobalt Mediterranean waters."
      },
      {
        name: "Rome — Colosseum",
        img: "https://images.unsplash.com/photo-1526481280698-8fcc13fd0c46?q=80&w=1600&auto=format&fit=crop",
        blurb: "Ancient amphitheater and living museum of the Roman Empire."
      }
    ]
  }
};

// --- Helpers ---
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.substring(2), v);
    else node.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (typeof c === "string") node.appendChild(document.createTextNode(c));
    else if (c) node.appendChild(c);
  });
  return node;
}

function card({img, name, blurb}) {
  return el("div", { class: "card" }, [
    el("img", { src: img, alt: name }),
    el("div", { class: "content" }, [
      el("h3", {}, name),
      el("p", {}, blurb)
    ])
  ]);
}

// --- Page initializers ---
function initHome() {
  // Beaches
  const beachGrid = document.getElementById("beachGrid");
  if (beachGrid) {
    destinations.beaches.forEach(d => beachGrid.appendChild(card(d)));
  }
  // Temples
  const templeGrid = document.getElementById("templeGrid");
  if (templeGrid) {
    destinations.temples.forEach(d => templeGrid.appendChild(card(d)));
  }
  // Country select
  const countrySelect = document.getElementById("countrySelect");
  const countryGrid = document.getElementById("countryGrid");
  if (countrySelect && countryGrid) {
    // Populate select
    Object.keys(destinations.byCountry).forEach(c => {
      const opt = el("option", { value: c }, c);
      countrySelect.appendChild(opt);
    });
    countrySelect.addEventListener("change", () => {
      const picked = countrySelect.value;
      countryGrid.innerHTML = "";
      (destinations.byCountry[picked] || []).forEach(item => countryGrid.appendChild(card(item)));
    });
    // Initial render
    countrySelect.value = "Japan";
    countrySelect.dispatchEvent(new Event("change"));
  }
}

function initContact() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    // very simple email check
    const validEmail = /.+@.+\..+/.test(data.email || "");
    const msg = document.getElementById("formMsg");
    if (!validEmail) {
      msg.textContent = "Please enter a valid email address.";
      msg.style.color = "#b91c1c";
      return;
    }
    msg.textContent = "Thanks! We’ll get back to you at " + data.email + ".";
    msg.style.color = "#065f46";
    form.reset();
  });
}

// Router-ish init
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.getAttribute("data-page");
  if (page === "home") initHome();
  if (page === "contact") initContact();
});
