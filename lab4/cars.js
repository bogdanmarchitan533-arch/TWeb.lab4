const cars = [
  {
    id: 1, name: "Dacia Logan", type: "Sedan · Economică", category: "economic",
    fuel: "Benzină", transmission: "Manuală", seats: 5, price: 250,
    img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80",
    badge: "Economică",
    desc: "Dacia Logan este alegerea ideală pentru cei care caută o mașină fiabilă și economică. Perfectă pentru deplasări urbane și excursii de weekend, consumă puțin și este ușor de condus.",
    extras: ["AC", "Radio Bluetooth", "Geamuri electrice"]
  },
  {
    id: 2, name: "Volkswagen Polo", type: "Hatchback · Confort", category: "confort",
    fuel: "Benzină", transmission: "Automată", seats: 5, price: 320,
    img: "https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=600&q=80",
    badge: "Confort",
    desc: "Volkswagen Polo combină designul elegant cu confortul zilnic. Cutia automată face condusul în trafic urban un adevărat plăcere. Echipat cu tehnologie modernă și sisteme de siguranță avansate.",
    extras: ["AC Automat", "Apple CarPlay", "Camera Marșarier", "Lane Assist"]
  },
  {
    id: 3, name: "Toyota Camry", type: "Sedan · Premium", category: "premium",
    fuel: "Hibrid", transmission: "Automată", seats: 5, price: 480,
    img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80",
    badge: "Premium",
    desc: "Toyota Camry Hybrid îmbină eleganța cu eficiența. Tehnologia hibridă reduce consumul de carburant cu până la 40% față de versiunile convenționale. Perfectă pentru călătorii lungi și stil de viață premium.",
    extras: ["Hybrid", "Scaune Piele", "Sunroof", "Apple CarPlay", "Adaptive Cruise"]
  },
  {
    id: 4, name: "Ford Transit", type: "Van · Spațios", category: "van",
    fuel: "Diesel", transmission: "Manuală", seats: 9, price: 600,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    badge: "Van 9 locuri",
    desc: "Ford Transit este soluția perfectă pentru grupuri mari sau transport de marfă. Cu 9 locuri spațioase și un portbagaj generos, este ideal pentru excursii de grup, aeroporturi sau evenimente.",
    extras: ["9 locuri", "AC Față/Spate", "USB Charging", "Portbagaj Mare"]
  },
  {
    id: 5, name: "BMW Seria 3", type: "Sedan · Sport", category: "premium",
    fuel: "Benzină", transmission: "Automată", seats: 5, price: 750,
    img: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
    badge: "Sport",
    desc: "BMW Seria 3 reprezintă perfecțiunea în clasa sport premium. Motorul puternic, suspensia sportivă și interiorul luxos te fac să te simți șofer profesionist la fiecare oprire de semafor.",
    extras: ["Sport Mode", "Scaune M", "Head-Up Display", "Harman Kardon", "Wireless Charging"]
  },
  {
    id: 6, name: "Skoda Octavia", type: "Sedan · Familial", category: "confort",
    fuel: "Diesel", transmission: "Manuală", seats: 5, price: 380,
    img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80",
    badge: "Familial",
    desc: "Skoda Octavia este mașina de familie prin excelență. Spațioasă, confortabilă și economică, oferă tot ce ai nevoie pentru o familie modernă. Portbagajul uriaș și consumul redus o fac ideală pentru vacanțe.",
    extras: ["Portbagaj 580L", "AC Automat", "Senzori Parcare", "Bluetooth"]
  },
  {
    id: 7, name: "Kia Sportage", type: "SUV · Confort", category: "van",
    fuel: "Benzină", transmission: "Automată", seats: 5, price: 580,
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
    badge: "SUV",
    desc: "Kia Sportage este SUV-ul modern care combină utilitatea cu stilul. Înaltă, spațioasă și sigură, este perfectă atât pentru oraș cât și pentru drumuri mai grele.",
    extras: ["AWD disponibil", "Sunroof", "Camera 360°", "Wireless CarPlay"]
  },
  {
    id: 8, name: "Mercedes C-Class", type: "Sedan · Lux", category: "premium",
    fuel: "Benzină", transmission: "Automată", seats: 5, price: 1200,
    img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80",
    badge: "Lux",
    desc: "Mercedes-Benz C-Class este simbolul luxului accesibil. Fiecare detaliu al interiorului a fost conceput pentru confort maxim. Sistemul MBUX cu comandă vocală și ecranele curbate fac din fiecare călătorie o experiență premium.",
    extras: ["MBUX AI", "Burmester Sound", "Masaj Scaune", "Night Vision", "Parbriz HUD"]
  }
];

function renderCars(gridId, filterFn) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  const list = filterFn ? cars.filter(filterFn) : cars;
  grid.innerHTML = list.map(c => `
    <a class="car-card" href="masina.html?id=${c.id}">
      <div class="car-photo">
        <img src="${c.img}" alt="${c.name}" loading="lazy" />
        <span class="car-badge">${c.badge}</span>
      </div>
      <div class="car-body">
        <h3>${c.name}</h3>
        <p class="car-tip">${c.type}</p>
        <div class="car-specs">
          <span>⛽ ${c.fuel}</span>
          <span>⚙️ ${c.transmission}</span>
          <span>👥 ${c.seats} locuri</span>
        </div>
        <div class="car-footer">
          <div class="car-price">${c.price} <small>lei/zi</small></div>
          <a class="btn-reserve" href="rezervare.html?id=${c.id}" onclick="event.stopPropagation()">Rezervă</a>
        </div>
      </div>
    </a>
  `).join('');
  document.dispatchEvent(new CustomEvent('carsrendered', { detail: { gridId } }));
}
