// ==========================================================================
// AMAZON PRIME VIDEO TV - SYNCED CATALOG WITH REAL TMDB METADATA & STREAM EMBEDS
// ==========================================================================

// Ad / Popup Blocker
(function _adBlock() {
  try { window.open = () => { console.warn("[AdBlock] popup blocked"); return null; }; } catch(e) {}
  try {
    Object.defineProperty(window, "Notification", {
      get: () => ({ requestPermission: () => Promise.resolve("denied"), permission: "denied" }),
      configurable: false
    });
  } catch(e) {}
  document.addEventListener("click", (ev) => {
    const a = ev.target.closest("a");
    if (a && ["_blank","_top","_parent","_new"].includes(a.target)) {
      ev.preventDefault(); ev.stopImmediatePropagation();
    }
  }, true);
  window.addEventListener("beforeunload", (ev) => {
    if (document.getElementById("playerView")?.classList.contains("active")) {
      ev.preventDefault(); ev.returnValue = "";
    }
  });
})();

// ── Stream servers ──────────────────────────────────────────────────────────
const SERVERS = [
  {
    id: "framex",
    name: "⚡ Server 1 — FrameX Native",
    buildUrl: (type, id, s, e) =>
      type === "tv"
        ? `https://framextv.cc/embed/tv/${id}/${s}/${e}?autoplay=1`
        : `https://framextv.cc/embed/movie/${id}?autoplay=1`
  },
  {
    id: "videasy",
    name: "🚀 Server 2 — Videasy 4K Ultra",
    buildUrl: (type, id, s, e) =>
      type === "tv"
        ? `https://player.videasy.to/tv/${id}/${s}/${e}`
        : `https://player.videasy.to/movie/${id}`
  },
  {
    id: "vidlink",
    name: "🌐 Server 3 — VidLink Pro",
    buildUrl: (type, id, s, e) =>
      type === "tv"
        ? `https://vidlink.pro/tv/${id}/${s}/${e}`
        : `https://vidlink.pro/movie/${id}`
  }
];

let activeServerIndex = 0;

const CATALOG = [
  {
    id: "106379",
    title: "Fallout",
    type: "tv",
    year: "2024",
    rating: "8.5",
    seasons: "Season 1",
    quality: "4K UHD",
    category: "Action • Sci-Fi • Drama",
    badge: "AMAZON ORIGINAL",
    backdrop: "https://image.tmdb.org/t/p/w1280/coaPCIqQBPUZsOnJcWZxhaORcDT.jpg",
    poster: "https://image.tmdb.org/t/p/w500/c15BtJxCXMrISLVmysdsnZUPQft.jpg",
    description: "In a future, post-apocalyptic Los Angeles brought about by nuclear decimation, citizens must live in underground bunkers to protect themselves from radiation, mutants and bandits.",
    cast: [
      { name: "Ella Purnell", role: "Lucy MacLean", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Walton Goggins", role: "The Ghoul", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Aaron Moten", role: "Maximus", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    episodes: [
      { ep: 1, s: 1, title: "The End", duration: "64m", desc: "A young woman leaves the safety of Vault 33 to venture into the treacherous wasteland." },
      { ep: 2, s: 1, title: "The Target", duration: "59m", desc: "Lucy meets a mysterious doctor and his modified companion." },
      { ep: 3, s: 1, title: "The Head", duration: "54m", desc: "Maximus assumes a new identity to maintain command in the field." }
    ],
    trivia: "The iconic Vault suits were handmade using heavy tactical twill to replicate the retro-futuristic 1950s atomic aesthetic."
  },
  {
    id: "76479",
    title: "The Boys",
    type: "tv",
    year: "2024",
    rating: "8.7",
    seasons: "Season 4",
    quality: "4K UHD",
    category: "Action • Comedy • Sci-Fi",
    badge: "PRIME EXCLUSIVE",
    backdrop: "https://image.tmdb.org/t/p/w1280/bq28ajZaoMyzEIm6REelqyqtEDZ.jpg",
    poster: "https://image.tmdb.org/t/p/w500/in1R2dDc421JxsoRWaIIAqVI2KE.jpg",
    description: "A fun and irreverent take on what happens when superheroes, who are as popular as celebrities and as influential as politicians, abuse their superpowers rather than use them for good.",
    cast: [
      { name: "Karl Urban", role: "Billy Butcher", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80" },
      { name: "Antony Starr", role: "Homelander", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80" },
      { name: "Jack Quaid", role: "Hughie Campbell", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" }
    ],
    episodes: [
      { ep: 1, s: 4, title: "Department of Dirty Tricks", duration: "58m", desc: "Butcher searches for a way to save Ryan while dealing with dwindling time." },
      { ep: 2, s: 4, title: "Life Among the Septics", duration: "61m", desc: "The Boys head into extreme conspiracy circuits." }
    ],
    trivia: "Homelander's suit requires 3 team members over 45 minutes to seal and align for stunt cameras."
  },
  {
    id: "108978",
    title: "Reacher",
    type: "tv",
    year: "2023",
    rating: "8.1",
    seasons: "Season 2",
    quality: "HDR10+",
    category: "Action • Crime • Drama",
    badge: "AMAZON ORIGINAL",
    backdrop: "https://image.tmdb.org/t/p/w1280/pF0qkRsrHkdYadPWY9AMeFZfcwk.jpg",
    poster: "https://image.tmdb.org/t/p/w500/f1VCQIG2iCyOookdgOzwtUpwWC0.jpg",
    description: "When retired Military Police Officer Jack Reacher is arrested for a murder he did not commit, he finds himself in the middle of a deadly conspiracy full of dirty cops, shady businessmen and scheming politicians.",
    cast: [
      { name: "Alan Ritchson", role: "Jack Reacher", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Maria Sten", role: "Frances Neagley", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    ],
    episodes: [
      { ep: 1, s: 2, title: "ATM", duration: "52m", desc: "Reacher receives a coded message regarding his former unit." },
      { ep: 2, s: 2, title: "What Happens in Atlantic City", duration: "50m", desc: "The investigation leads Reacher to high-stakes casino floors." }
    ],
    trivia: "Alan Ritchson gained over 30 pounds of pure lean muscle mass to embody the physical stature described in Lee Child's novels."
  },
  {
    id: "693134",
    title: "Dune: Part Two",
    type: "movie",
    year: "2024",
    rating: "8.6",
    seasons: "2h 46m",
    quality: "4K UHD",
    category: "Sci-Fi • Adventure",
    badge: "BLOCKBUSTER",
    backdrop: "https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
    poster: "https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, facing a choice between the love of his life and the fate of the universe.",
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "Zendaya", role: "Chani", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    ],
    episodes: [
      { ep: 1, s: 1, title: "Feature Film", duration: "166m", desc: "Full feature presentation in IMAX certified master." }
    ],
    trivia: "Hans Zimmer created entirely new bespoke acoustic and electronic instruments to capture the alien soundscape of Arrakis."
  },
  {
    id: "533535",
    title: "Deadpool & Wolverine",
    type: "movie",
    year: "2024",
    rating: "7.9",
    seasons: "2h 8m",
    quality: "4K UHD",
    category: "Action • Comedy • Sci-Fi",
    badge: "TOP HIT",
    backdrop: "https://image.tmdb.org/t/p/w1280/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg",
    poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    description: "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up with Wolverine.",
    cast: [
      { name: "Ryan Reynolds", role: "Wade Wilson / Deadpool", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80" },
      { name: "Hugh Jackman", role: "Logan / Wolverine", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ],
    episodes: [
      { ep: 1, s: 1, title: "Feature Film", duration: "128m", desc: "Full feature film presentation." }
    ],
    trivia: "Hugh Jackman wears the comic-accurate yellow-and-blue Wolverine suit on film for the first time in 24 years."
  },
  {
    id: "872585",
    title: "Oppenheimer",
    type: "movie",
    year: "2023",
    rating: "8.9",
    seasons: "3h 0m",
    quality: "4K UHD",
    category: "Biography • Drama • History",
    badge: "ACADEMY AWARD WINNER",
    backdrop: "https://image.tmdb.org/t/p/w1280/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    cast: [
      { name: "Cillian Murphy", role: "J. Robert Oppenheimer", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
      { name: "Robert Downey Jr.", role: "Lewis Strauss", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ],
    episodes: [
      { ep: 1, s: 1, title: "Full Movie", duration: "180m", desc: "Christopher Nolan's masterwork in native 65mm IMAX print." }
    ],
    trivia: "The Trinity test was captured completely using practical practical chemical explosions without CGI composites."
  },
  {
    id: "84773",
    title: "The Rings of Power",
    type: "tv",
    year: "2024",
    rating: "7.1",
    seasons: "Season 2",
    quality: "4K UHD",
    category: "Fantasy • Adventure • Drama",
    badge: "AMAZON ORIGINAL",
    backdrop: "https://image.tmdb.org/t/p/w1280/o2wg8QiSCQrhj91tBfxunE3O5Ba.jpg",
    poster: "https://image.tmdb.org/t/p/w500/kf5Hz70tjNAHg4swGDzOr9BfoZ1.jpg",
    description: "Epic drama set thousands of years before the events of J.R.R. Tolkien's 'The Hobbit' and 'The Lord of the Rings' follows an ensemble cast of characters facing the re-emergence of evil.",
    cast: [
      { name: "Morfydd Clark", role: "Galadriel", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
      { name: "Charlie Vickers", role: "Sauron / Halbrand", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
    ],
    episodes: [
      { ep: 1, s: 2, title: "Elven Kings Under the Sky", duration: "76m", desc: "The Three Rings are forged while shadows deepen in Eregion." }
    ],
    trivia: "The practical armor and jewelry were forged by Master Armorer artisans in New Zealand and the UK."
  },
  {
    id: "84105",
    title: "Mirzapur",
    type: "tv",
    year: "2024",
    rating: "8.5",
    seasons: "Season 3",
    quality: "4K UHD",
    category: "Action • Crime • Thriller",
    badge: "AMAZON ORIGINAL",
    backdrop: "https://image.tmdb.org/t/p/w1280/3dV7pWAdwIPKR2lMIACMfObXdgK.jpg",
    poster: "https://image.tmdb.org/t/p/w500/p0qM8hhlMF5DuxHBzl2EZR6TehX.jpg",
    description: "A shocking incident at a wedding procession ignites a series of events entangling two families in the lawless belt of Purvanchal.",
    cast: [
      { name: "Pankaj Tripathi", role: "Kaleen Bhaiya", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { name: "Ali Fazal", role: "Guddu Pandit", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80" }
    ],
    episodes: [
      { ep: 1, s: 3, title: "Tetua", duration: "53m", desc: "The throne of Purvanchal hangs in delicate balance." }
    ],
    trivia: "Pankaj Tripathi's character's subtle pauses and hand gestures were completely improvised on set."
  },
  {
    id: "126308",
    title: "Shōgun",
    type: "tv",
    year: "2024",
    rating: "8.8",
    seasons: "Season 1",
    quality: "4K UHD",
    category: "Drama • History • War",
    badge: "EMMY RECORD BREAKER",
    backdrop: "https://image.tmdb.org/t/p/w1280/bwSmgmd90hCWwqOKQYTEraeOZhJ.jpg",
    poster: "https://image.tmdb.org/t/p/w500/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg",
    description: "When a mysterious European ship is found marooned in a nearby fishing village, Lord Yoshii Toranaga discovers secrets that could tip the scales of power.",
    cast: [
      { name: "Hiroyuki Sanada", role: "Lord Yoshii Toranaga", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { name: "Anna Sawai", role: "Toda Mariko", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    ],
    episodes: [
      { ep: 1, s: 1, title: "Chapter One: Anjin", duration: "68m", desc: "Destinies converge in feudal Japan as an English navigator washes ashore." }
    ],
    trivia: "Won a record-shattering 18 Primetime Emmy Awards in a single television season."
  },
  {
    id: "66732",
    title: "Stranger Things",
    type: "tv",
    year: "2024",
    rating: "8.7",
    seasons: "Season 4",
    quality: "4K UHD",
    category: "Sci-Fi • Horror • Mystery",
    badge: "GLOBAL HIT",
    backdrop: "https://image.tmdb.org/t/p/w1280/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg",
    poster: "https://image.tmdb.org/t/p/w500/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    cast: [
      { name: "Millie Bobby Brown", role: "Eleven", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" }
    ],
    episodes: [
      { ep: 1, s: 4, title: "Chapter One: The Hellfire Club", duration: "76m", desc: "El struggles to fit in at school while Hawkins braces for a new terror." }
    ],
    trivia: "The Duffer brothers based the atmospheric look on 1980s 35mm anamorphic lenses."
  }
];

let currentHeroItem = CATALOG[0];
let activeModalItem = null;
let currentPlayingItem = null;
let currentPlayingEpisode = null;
let hudTimeout = null;
let failoverTimer = null;
let billboardTimer = null;
let billboardIndex = 0;
let billboardItems = [];
let pwaInstallEvent = null;

// ── Persistent Watchlist (localStorage) ────────────────────────────────────
const WATCHLIST_KEY  = 'prime_watchlist_v1';
const PROGRESS_KEY   = 'prime_watch_progress_v1';
const CONTINUE_KEY   = 'prime_continue_watching_v1';

function _loadWatchlist() {
  try { return new Set(JSON.parse(localStorage.getItem(WATCHLIST_KEY)) || []); } catch { return new Set(); }
}
function _saveWatchlist() {
  try { localStorage.setItem(WATCHLIST_KEY, JSON.stringify([...watchlist])); } catch {}
}
let watchlist = _loadWatchlist();

// id → { pct: 0-100, ts: Date.now(), item: {...}, episode: {...} }
function _loadContinue() {
  try { return JSON.parse(localStorage.getItem(CONTINUE_KEY)) || {}; } catch { return {}; }
}
function _saveContinue(map) {
  try { localStorage.setItem(CONTINUE_KEY, JSON.stringify(map)); } catch {}
}

// ── Watch Progress helpers ─────────────────────────────────────────────────
function saveWatchProgress(item, episode, pct) {
  if (!item) return;
  const map = _loadContinue();
  const key = episode ? `${item.id}_s${episode.s}e${episode.ep}` : item.id;
  map[key] = { pct: Math.min(Math.round(pct), 97), ts: Date.now(), itemId: item.id, episode: episode || null };
  _saveContinue(map);
  // Also save item data for the Continue Watching row
  const items = _loadContinueItems();
  const existIdx = items.findIndex(c => c.id === item.id && (!episode || (c._ep && c._ep.s === episode.s && c._ep.ep === episode.ep)));
  const entry = { ...item, _ep: episode, _pct: Math.min(Math.round(pct), 97), _ts: Date.now() };
  if (existIdx !== -1) { items[existIdx] = entry; } else { items.unshift(entry); }
  // Cap at 20 items
  _saveContinueItems(items.slice(0, 20));
  refreshContinueRow();
}

function _loadContinueItems() {
  try { return JSON.parse(localStorage.getItem(CONTINUE_KEY + '_items')) || []; } catch { return []; }
}
function _saveContinueItems(arr) {
  try { localStorage.setItem(CONTINUE_KEY + '_items', JSON.stringify(arr)); } catch {}
}

// ==========================================================================
// CURATED MULTI-PLATFORM COLLECTIONS (NETFLIX, HOTSTAR, PRIME, HBO MAX, LIVE)
// ==========================================================================

const PLATFORM_SHOWS = {
  netflix: [
    { id: "66732", title: "Stranger Things", type: "tv", year: "2024", rating: "8.7", seasons: "Season 4", quality: "4K UHD", badge: "NETFLIX ORIGINAL", platformClass: "badge-netflix", platformLabel: "NETFLIX", backdrop: "https://image.tmdb.org/t/p/w1280/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg", poster: "https://image.tmdb.org/t/p/w500/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg", description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl." },
    { id: "93405", title: "Squid Game", type: "tv", year: "2024", rating: "8.4", seasons: "Season 2", quality: "4K UHD", badge: "NETFLIX HIT", platformClass: "badge-netflix", platformLabel: "NETFLIX", backdrop: "https://image.tmdb.org/t/p/w1280/2meX1nMdScFOoV4370rqHWKmXhY.jpg", poster: "https://image.tmdb.org/t/p/w500/1QdXdRYfktUSONkl1oD5gc6Be0s.jpg", description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games with deadly high stakes." },
    { id: "119051", title: "Wednesday", type: "tv", year: "2024", rating: "8.5", seasons: "Season 2", quality: "4K UHD", badge: "NETFLIX TOP 10", platformClass: "badge-netflix", platformLabel: "NETFLIX", backdrop: "https://image.tmdb.org/t/p/w1280/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg", poster: "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg", description: "A sleuthing, supernaturally infused mystery charting Wednesday Addams' years as a student at Nevermore Academy." },
    { id: "71446", title: "Money Heist (La Casa de Papel)", type: "tv", year: "2021", rating: "8.2", seasons: "Part 5", quality: "4K UHD", badge: "NETFLIX PHENOMENON", platformClass: "badge-netflix", platformLabel: "NETFLIX", backdrop: "https://image.tmdb.org/t/p/w1280/xGexTKCJDkl12dTW4YCBDXWb1AD.jpg", poster: "https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg", description: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain." },
    { id: "71912", title: "The Witcher", type: "tv", year: "2023", rating: "8.0", seasons: "Season 3", quality: "4K UHD", badge: "NETFLIX FANTASY", platformClass: "badge-netflix", platformLabel: "NETFLIX", backdrop: "https://image.tmdb.org/t/p/w1280/foGkPxpw9h8zln81j63mix5B7m8.jpg", poster: "https://image.tmdb.org/t/p/w500/AoGsDM02UVt0npBA8OvpDcZbaMi.jpg", description: "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts." },
    { id: "60574", title: "Peaky Blinders", type: "tv", year: "2022", rating: "8.8", seasons: "Series 6", quality: "4K UHD", badge: "CRIME MASTERPIECE", platformClass: "badge-netflix", platformLabel: "NETFLIX", backdrop: "https://image.tmdb.org/t/p/w1280/dzq83RHwQcnP6WGJ6YkenIqeaa5.jpg", poster: "https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg", description: "A notorious gang in 1919 Birmingham, England, is led by the fierce Tommy Shelby, a crime boss set on moving up in the world no matter the cost." },
    { id: "70523", title: "Dark", type: "tv", year: "2020", rating: "8.7", seasons: "Cycle 3", quality: "4K UHD", badge: "MIND BENDER", platformClass: "badge-netflix", platformLabel: "NETFLIX", backdrop: "https://image.tmdb.org/t/p/w1280/3jDXL4Xvj3AzDOF6UH1xeyHW8MH.jpg", poster: "https://image.tmdb.org/t/p/w500/wSXJHO9WHLb0aCwvQrtco7vOmWA.jpg", description: "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations." },
    { id: "42009", title: "Black Mirror", type: "tv", year: "2023", rating: "8.7", seasons: "Season 6", quality: "4K UHD", badge: "DYSTOPIAN SCI-FI", platformClass: "badge-netflix", platformLabel: "NETFLIX", backdrop: "https://image.tmdb.org/t/p/w1280/dg3OindVAGZBjlT3xYKqIAdukPL.jpg", poster: "https://image.tmdb.org/t/p/w500/seN6rRfN0I6n8iDXjlSMk1QjNcq.jpg", description: "A contemporary British speculative fiction anthology series explores a twisted, high-tech near-future where humanity's greatest innovations and darkest instincts collide." }
  ],
  hotstar: [
    { id: "84958", title: "Loki", type: "tv", year: "2023", rating: "8.2", seasons: "Season 2", quality: "4K UHD", badge: "DISNEY+ EXCLUSIVE", platformClass: "badge-hotstar", platformLabel: "HOTSTAR", backdrop: "https://image.tmdb.org/t/p/w1280/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg", poster: "https://image.tmdb.org/t/p/w500/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg", description: "The mercurial villain Loki resumes his role as the God of Mischief in a new series that takes place after the events of 'Avengers: Endgame'." },
    { id: "126308", title: "Shōgun", type: "tv", year: "2024", rating: "8.8", seasons: "Season 1", quality: "4K UHD", badge: "18 EMMY AWARDS", platformClass: "badge-hotstar", platformLabel: "HOTSTAR", backdrop: "https://image.tmdb.org/t/p/w1280/bwSmgmd90hCWwqOKQYTEraeOZhJ.jpg", poster: "https://image.tmdb.org/t/p/w500/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg", description: "When a mysterious European ship is found marooned in a nearby fishing village, Lord Yoshii Toranaga discovers secrets that could tip the scales of power." },
    { id: "82856", title: "The Mandalorian", type: "tv", year: "2023", rating: "8.6", seasons: "Season 3", quality: "4K UHD", badge: "STAR WARS ORIGINAL", platformClass: "badge-hotstar", platformLabel: "HOTSTAR", backdrop: "https://image.tmdb.org/t/p/w1280/9zcbqSxdsRMZWHYtyCd1nXPr2xq.jpg", poster: "https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg", description: "After the fall of the Galactic Empire, a lone gunfighter makes his way through the outer reaches of the lawless galaxy." },
    { id: "85271", title: "WandaVision", type: "tv", year: "2021", rating: "8.0", seasons: "Limited Series", quality: "4K UHD", badge: "MARVEL STUDIOS", platformClass: "badge-hotstar", platformLabel: "HOTSTAR", backdrop: "https://image.tmdb.org/t/p/w1280/cq62fLH3vwOmiaLKMqkDI86tPtH.jpg", poster: "https://image.tmdb.org/t/p/w500/ijWWwINc8h71NQ8j1LTJMFSj5wr.jpg", description: "Wanda Maximoff and Vision—two super-powered beings living idealized suburban lives—begin to suspect that everything is not as it seems." },
    { id: "92749", title: "Moon Knight", type: "tv", year: "2022", rating: "7.7", seasons: "Season 1", quality: "4K UHD", badge: "MARVEL ORIGINAL", platformClass: "badge-hotstar", platformLabel: "HOTSTAR", backdrop: "https://image.tmdb.org/t/p/w1280/1uegR4uAxRxiMyX4nQnpzbXhrTw.jpg", poster: "https://image.tmdb.org/t/p/w500/9K3lbMf8TKvL9xGEbzi7TggWCNQ.jpg", description: "Steven Grant discovers he's been granted the powers of an Egyptian moon god, but quickly finds these new abilities can be both a blessing and a curse." },
    { id: "202555", title: "Daredevil: Born Again", type: "tv", year: "2025", rating: "8.6", seasons: "Upcoming", quality: "4K UHD", badge: "MARVEL STUDIOS", platformClass: "badge-hotstar", platformLabel: "HOTSTAR", backdrop: "https://image.tmdb.org/t/p/w1280/qrTAc0ZtQ859Qu5O8cixJzNJpQs.jpg", poster: "https://image.tmdb.org/t/p/w500/xDUoAsU8lQHOOoRkFiBuarmACDN.jpg", description: "Matt Murdock and Wilson Fisk try to leave behind their darker personas, but their pasts quickly catch up with them in Hell's Kitchen." },
    { id: "105971", title: "Star Wars: The Bad Batch", type: "tv", year: "2024", rating: "8.2", seasons: "Season 3", quality: "4K UHD", badge: "LUCASFILM", platformClass: "badge-hotstar", platformLabel: "HOTSTAR", backdrop: "https://image.tmdb.org/t/p/w1280/sjxtIUCWR74yPPcZFfTsToepfWm.jpg", poster: "https://image.tmdb.org/t/p/w500/5mHus672nuinyaE0FtqvD0AddcY.jpg", description: "The 'Bad Batch' of elite and experimental clones navigate their way through an evolving galaxy in the immediate aftermath of the Clone Wars." }
  ],
  max: [
    { id: "94997", title: "House of the Dragon", type: "tv", year: "2024", rating: "8.4", seasons: "Season 2", quality: "4K UHD", badge: "HBO ORIGINAL", platformClass: "badge-max", platformLabel: "HBO MAX", backdrop: "https://image.tmdb.org/t/p/w1280/577eXC8wFQT0eUrJcgznSiFPRmk.jpg", poster: "https://image.tmdb.org/t/p/w500/7V0Ebks0GgpKvQ7QbLAIdX5dos4.jpg", description: "The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. Most empires crumble from such heights." },
    { id: "100088", title: "The Last of Us", type: "tv", year: "2023", rating: "8.8", seasons: "Season 1", quality: "4K UHD", badge: "HBO MASTERPIECE", platformClass: "badge-max", platformLabel: "HBO MAX", backdrop: "https://image.tmdb.org/t/p/w1280/lY2DhbA7Hy44fAKddr06UrXWWaQ.jpg", poster: "https://image.tmdb.org/t/p/w500/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg", description: "Twenty years after modern civilization has been destroyed, Joel is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone." },
    { id: "1399", title: "Game of Thrones", type: "tv", year: "2019", rating: "9.2", seasons: "Season 8", quality: "4K UHD", badge: "GLOBAL PHENOMENON", platformClass: "badge-max", platformLabel: "HBO MAX", backdrop: "https://image.tmdb.org/t/p/w1280/zZqpAXxVSBtxV9qPBcscfXBcL2w.jpg", poster: "https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg", description: "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war." },
    { id: "76331", title: "Succession", type: "tv", year: "2023", rating: "8.9", seasons: "Season 4", quality: "4K UHD", badge: "EMMY WINNER", platformClass: "badge-max", platformLabel: "HBO MAX", backdrop: "https://image.tmdb.org/t/p/w1280/d87JXX3DLkRJMfm5StCmmnmhHuX.jpg", poster: "https://image.tmdb.org/t/p/w500/z0XiwdrCQ9yVIr4O0pxzaAYRxdW.jpg", description: "The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their aging father steps down." },
    { id: "85552", title: "Euphoria", type: "tv", year: "2022", rating: "8.3", seasons: "Season 2", quality: "4K UHD", badge: "HBO DRAMA", platformClass: "badge-max", platformLabel: "HBO MAX", backdrop: "https://image.tmdb.org/t/p/w1280/mez2Z3WqlPKNXpi7mWoiiE5guE9.jpg", poster: "https://image.tmdb.org/t/p/w500/aJrG7OkoTMPWG5c8opz8a93AZPY.jpg", description: "A group of high school students navigate love and friendships in a world of drugs, sex, trauma and social media." }
  ],
  liveChannels: [
    { id: "star-sports-1", title: "Star Sports 1 HD", type: "live", quality: "1080p 60FPS", category: "Cricket • Premier League", badge: "LIVE NOW", backdrop: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=640&q=80", platformClass: "badge-hotstar", platformLabel: "HOTSTAR" },
    { id: "espn-hd", title: "ESPN Ultra HD", type: "live", quality: "4K UHD", category: "NBA • F1 • NFL", badge: "LIVE MATCH", backdrop: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=640&q=80", platformClass: "badge-prime", platformLabel: "PRIME" },
    { id: "sony-ten-1", title: "Sony Ten 1 HD", type: "live", quality: "1080p", category: "UEFA Champions League", badge: "LIVE", backdrop: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=640&q=80", platformClass: "badge-prime", platformLabel: "SPORTS" },
    { id: "hbo-cinema", title: "HBO Cinema 24/7", type: "live", quality: "4K Dolby", category: "Non-Stop Blockbusters", badge: "ON AIR", backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=640&q=80", platformClass: "badge-max", platformLabel: "HBO MAX" },
    { id: "discovery-hd", title: "Discovery Wildlife HD", type: "live", quality: "1080p", category: "Documentary & Nature", badge: "24/7 STREAM", backdrop: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=640&q=80", platformClass: "badge-netflix", platformLabel: "DISCOVERY" }
  ]
};

const FALLBACK_FRAMEX_RAILS = {
  trending_movies: [
    { id: "1198654", title: "Bad Apples", type: "movie", rating: "6.7", year: "2026", poster: "https://image.tmdb.org/t/p/w500/pcPLnxCThCIo9JFQIMFX4kAE5Yz.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/pcPLnxCThCIo9JFQIMFX4kAE5Yz.jpg", overview: "A rebellious teacher is pushed to her limits in a suburban school system." },
    { id: "1059128", title: "By Any Means", type: "movie", rating: "6.9", year: "2026", poster: "https://image.tmdb.org/t/p/w500/8d8H05z36940GqC4R5eMh7eO490.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/8d8H05z36940GqC4R5eMh7eO490.jpg", overview: "An elite detective embarks on a dangerous manhunt across borders." },
    { id: "933260", title: "Clayface", type: "movie", rating: "8.2", year: "2026", poster: "https://image.tmdb.org/t/p/w500/4q8bJm7Wk7h7d4V6n1A6m6q0p90.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/4q8bJm7Wk7h7d4V6n1A6m6q0p90.jpg", overview: "The tragic rise and descent of a shapeshifting Gotham villain." },
    { id: "1084199", title: "The Weight", type: "movie", rating: "6.9", year: "2026", poster: "https://image.tmdb.org/t/p/w500/d5iS9H5gW1pL8D3jF8n1E6q0p90.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/d5iS9H5gW1pL8D3jF8n1E6q0p90.jpg", overview: "A gripping survival drama set in the harsh Alaskan wilderness." },
    { id: "1114513", title: "Tenzing", type: "movie", rating: "8.3", year: "2026", poster: "https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg", overview: "The untold epic journey of Tenzing Norgay reaching the summit of Mount Everest." },
    { id: "114479", title: "Hope", type: "movie", rating: "6.9", year: "2026", poster: "https://image.tmdb.org/t/p/w500/9bC1YfQfJ01sD4V4p8e4M8q0p90.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/9bC1YfQfJ01sD4V4p8e4M8q0p90.jpg", overview: "An isolated harbor town faces an existential threat from beyond." },
    { id: "980489", title: "Spider-Man: Brand New Day", type: "movie", rating: "8.5", year: "2026", poster: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yUmCqP.jpg", overview: "Peter Parker navigates a world that doesn't remember him while confronting new threats." },
    { id: "1064213", title: "Masterplan", type: "movie", rating: "7.1", year: "2026", poster: "https://image.tmdb.org/t/p/w500/eShw0EVqnGH2NxRkg4yauCJ958P.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/eShw0EVqnGH2NxRkg4yauCJ958P.jpg", overview: "A high-stakes international heist orchestrated across European banking capitals." },
    { id: "1084242", title: "Street Fighter", type: "movie", rating: "6.3", year: "2026", poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/qJ2tW6WMUDux911r6m7haRef0WH.jpg", overview: "Martial arts champions clash in the underground world warrior tournament." },
    { id: "1123490", title: "Resident Evil: Requiem", type: "movie", rating: "7.3", year: "2026", poster: "https://image.tmdb.org/t/p/w500/7O09Cq3z8f9F2n1A6m6q0p90aBc.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/7O09Cq3z8f9F2n1A6m6q0p90aBc.jpg", overview: "Surviving operatives investigate a new bio-organic containment facility in Eastern Europe." },
    { id: "1154981", title: "You Can See Everything", type: "movie", rating: "7.7", year: "2026", poster: "https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sD4V4p8e4M8q0p9.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/u3bZgnGQ9T01sD4V4p8e4M8q0p9.jpg", overview: "A psychological mystery surrounding an omniscient digital surveillance program." },
    { id: "1138290", title: "Sacrifice", type: "movie", rating: "7.5", year: "2026", poster: "https://image.tmdb.org/t/p/w500/393K3sE9hF2n1A6m6q0p90aBcDe.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/393K3sE9hF2n1A6m6q0p90aBcDe.jpg", overview: "A devoted team ventures into extreme volcanic depths on a rescue operation." }
  ],
  popular_movies: [
    { id: "980489", title: "Spider-Man: Brand New Day", type: "movie", rating: "8.5", year: "2026", poster: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yUmCqP.jpg", overview: "Peter Parker navigates a world that doesn't remember him while confronting new threats." },
    { id: "693134", title: "Dune: Part Two", type: "movie", rating: "8.6", year: "2024", poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5200bm.jpg", overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators." },
    { id: "533535", title: "Deadpool & Wolverine", type: "movie", rating: "7.8", year: "2024", poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/yDHYTjA3R0ne84GuT43Q9Wz14x4.jpg", overview: "A listless Wade Wilson toils away in civilian life when the Time Variance Authority recruits him." },
    { id: "872585", title: "Oppenheimer", type: "movie", rating: "8.9", year: "2023", poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg", overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb." },
    { id: "1084242", title: "Street Fighter", type: "movie", rating: "6.3", year: "2026", poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/qJ2tW6WMUDux911r6m7haRef0WH.jpg", overview: "Martial arts champions clash in the underground world warrior tournament." },
    { id: "1198654", title: "Bad Apples", type: "movie", rating: "6.7", year: "2026", poster: "https://image.tmdb.org/t/p/w500/pcPLnxCThCIo9JFQIMFX4kAE5Yz.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/pcPLnxCThCIo9JFQIMFX4kAE5Yz.jpg", overview: "A rebellious teacher is pushed to her limits in a suburban school system." }
  ],
  popular_tv: [
    { id: "1396", title: "Breaking Bad", type: "tv", rating: "9.5", year: "2008", poster: "https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg", overview: "A high school chemistry teacher diagnosed with terminal lung cancer turns to manufacturing methamphetamine." },
    { id: "106379", title: "Fallout", type: "tv", rating: "8.6", year: "2024", poster: "https://image.tmdb.org/t/p/w500/c15BtJxCXMrISLVmysdsnZUPQft.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/coaPCIqQBPUZsOnJcWZxhaORcDT.jpg", overview: "In a future, post-apocalyptic Los Angeles, citizens must live in underground bunkers to protect themselves." },
    { id: "66732", title: "Stranger Things", type: "tv", rating: "8.7", year: "2016", poster: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/56v2KjUmLeVoVnBsw19vWkn9xuv.jpg", overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments." },
    { id: "94997", title: "House of the Dragon", type: "tv", rating: "8.4", year: "2022", poster: "https://image.tmdb.org/t/p/w500/1X4h40fcB4WWUmIBK0auT4zRBAV.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/etj5CuMuam3hD6MfP2bgji5gW2r.jpg", overview: "The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke." }
  ],
  popular_anime: [
    { id: "1429", title: "Attack on Titan", type: "tv", rating: "9.1", year: "2013", poster: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/yvRWg0w0aBcDe4V4p8e4M8q0p90.jpg", overview: "After his hometown is destroyed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans." },
    { id: "85937", title: "Demon Slayer: Kimetsu no Yaiba", type: "tv", rating: "8.9", year: "2019", poster: "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/nTvM4mhqZlpHKwZa09AIYGE0F5e.jpg", overview: "Tanjiro sets out to become a demon slayer to avenge his family and cure his sister." },
    { id: "95479", title: "Jujutsu Kaisen", type: "tv", rating: "8.8", year: "2020", poster: "https://image.tmdb.org/t/p/w500/hCwW0e8a4V4p8e4M8q0p90aBcDe.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/3f5G8k4V4p8e4M8q0p90aBcDeFg.jpg", overview: "Yuji Itadori swallows a cursed talisman and enrolls at Tokyo Jujutsu High." },
    { id: "37854", title: "One Piece", type: "tv", rating: "8.9", year: "1999", poster: "https://image.tmdb.org/t/p/w500/cMD9Ygz11zjJzAovURpO75Qg7rT.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/2rmK7mnchw9Xr3XdiTFSxTT0Yqi.jpg", overview: "Monkey D. Luffy sets sail with his crew in search of the legendary treasure known as 'One Piece'." }
  ],
  new_releases: [
    { id: "1059128", title: "By Any Means", type: "movie", rating: "6.9", year: "2026", poster: "https://image.tmdb.org/t/p/w500/8d8H05z36940GqC4R5eMh7eO490.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/8d8H05z36940GqC4R5eMh7eO490.jpg", overview: "An elite detective embarks on a dangerous manhunt across borders." },
    { id: "1198654", title: "Bad Apples", type: "movie", rating: "6.7", year: "2026", poster: "https://image.tmdb.org/t/p/w500/pcPLnxCThCIo9JFQIMFX4kAE5Yz.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/pcPLnxCThCIo9JFQIMFX4kAE5Yz.jpg", overview: "A rebellious teacher is pushed to her limits in a suburban school system." },
    { id: "114479", title: "Hope", type: "movie", rating: "6.9", year: "2026", poster: "https://image.tmdb.org/t/p/w500/9bC1YfQfJ01sD4V4p8e4M8q0p90.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/9bC1YfQfJ01sD4V4p8e4M8q0p90.jpg", overview: "An isolated harbor town faces an existential threat from beyond." },
    { id: "1064213", title: "Masterplan", type: "movie", rating: "7.1", year: "2026", poster: "https://image.tmdb.org/t/p/w500/eShw0EVqnGH2NxRkg4yauCJ958P.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/eShw0EVqnGH2NxRkg4yauCJ958P.jpg", overview: "A high-stakes international heist orchestrated across European banking capitals." }
  ],
  action_movies: [
    { id: "980489", title: "Spider-Man: Brand New Day", type: "movie", rating: "8.5", year: "2026", poster: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yUmCqP.jpg", overview: "Peter Parker navigates a world that doesn't remember him while confronting new threats." },
    { id: "693134", title: "Dune: Part Two", type: "movie", rating: "8.6", year: "2024", poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5200bm.jpg", overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators." },
    { id: "1084242", title: "Street Fighter", type: "movie", rating: "6.3", year: "2026", poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/qJ2tW6WMUDux911r6m7haRef0WH.jpg", overview: "Martial arts champions clash in the underground world warrior tournament." }
  ],
  comedy_movies: [
    { id: "533535", title: "Deadpool & Wolverine", type: "movie", rating: "7.8", year: "2024", poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/yDHYTjA3R0ne84GuT43Q9Wz14x4.jpg", overview: "A listless Wade Wilson toils away in civilian life when the Time Variance Authority recruits him." },
    { id: "840430", title: "The Holdovers", type: "movie", rating: "7.9", year: "2023", poster: "https://image.tmdb.org/t/p/w500/5a5L5s5e5q0p90aBcDeFgHiJkLm.jpg", backdrop: "https://image.tmdb.org/t/p/w1280/5a5L5s5e5q0p90aBcDeFgHiJkLm.jpg", overview: "A cranky history teacher at a remote prep school is forced to remain on campus during Christmas break." }
  ]
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Render initial fallback content immediately so rails are never empty
  renderInitialCatalog();

  // Render initial platform curated content
  renderRail("scrollerNetflix", PLATFORM_SHOWS.netflix, false, "badge-netflix", "NETFLIX");
  renderRail("scrollerHotstar", PLATFORM_SHOWS.hotstar, false, "badge-hotstar", "HOTSTAR");
  renderRail("scrollerMax", PLATFORM_SHOWS.max, false, "badge-max", "HBO MAX");
  renderRail("scrollerOriginals", CATALOG, false, "badge-prime", "PRIME");
  renderRail("scrollerLive", PLATFORM_SHOWS.liveChannels, false, "badge-prime", "LIVE");

  setupScrollListener();
  setupSearch();
  setupTVNavigation();
  setupPlayerHudInteraction();
  initSliderArrows();
  initContinueWatchingRow();
  initMyListRow();
  initBillboardAutoRotate();
  setupKeyboardShortcuts();
  setupPwaInstall();

  // Fetch all live categories from backend/proxy
  loadLiveFrameXCatalog();

  // Start continuous infinite discover catalog on home page
  initHomeEndlessCatalog("all", false);
});

function renderSkeletons(scroller, count = 6) {
  const el = document.getElementById(scroller);
  if (!el) return;
  el.innerHTML = Array(count).fill(0).map(() => `
    <div class="skeleton-card">
      <div class="skeleton-thumb"></div>
      <div class="skeleton-info">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>
  `).join('');
}

function renderInitialCatalog() {
  // Show skeleton placeholders immediately for main rows
  ['scrollerTrending','scrollerPopularMovies','scrollerPopularTV','scrollerAnime','scrollerNewReleases','scrollerAction','scrollerComedy'].forEach(id => renderSkeletons(id));
  const trending = FALLBACK_FRAMEX_RAILS.trending_movies.map(d => formatSearchResult(d, "badge-prime", "MOVIE"));
  CATEGORY_ITEMS.trending = trending;
  renderRail("scrollerTrending", trending);
  const countTrending = document.getElementById("countTrending");
  if (countTrending) countTrending.innerText = trending.length;

  const popular = FALLBACK_FRAMEX_RAILS.popular_movies.map(d => formatSearchResult(d, "badge-prime", "MOVIE"));
  CATEGORY_ITEMS.popular_movies = popular;
  renderRail("scrollerPopularMovies", popular);
  const countPopular = document.getElementById("countPopularMovies");
  if (countPopular) countPopular.innerText = popular.length;

  const tv = FALLBACK_FRAMEX_RAILS.popular_tv.map(d => formatSearchResult(d, "badge-netflix", "TV"));
  CATEGORY_ITEMS.popular_tv = tv;
  renderRail("scrollerPopularTV", tv);
  const countTV = document.getElementById("countPopularTV");
  if (countTV) countTV.innerText = tv.length;

  const anime = FALLBACK_FRAMEX_RAILS.popular_anime.map(d => formatSearchResult(d, "badge-anime", "ANIME"));
  CATEGORY_ITEMS.anime = anime;
  renderRail("scrollerAnime", anime, false, "badge-anime", "ANIME");
  const countAnime = document.getElementById("countAnime");
  if (countAnime) countAnime.innerText = anime.length;

  const newRel = FALLBACK_FRAMEX_RAILS.new_releases.map(d => formatSearchResult(d, "badge-prime", "NEW"));
  CATEGORY_ITEMS.new_releases = newRel;
  renderRail("scrollerNewReleases", newRel);
  const countNew = document.getElementById("countNewReleases");
  if (countNew) countNew.innerText = newRel.length;

  const action = FALLBACK_FRAMEX_RAILS.action_movies.map(d => formatSearchResult(d, "badge-prime", "ACTION"));
  CATEGORY_ITEMS.action = action;
  renderRail("scrollerAction", action);
  const countAction = document.getElementById("countAction");
  if (countAction) countAction.innerText = action.length;

  const comedy = FALLBACK_FRAMEX_RAILS.comedy_movies.map(d => formatSearchResult(d, "badge-prime", "COMEDY"));
  CATEGORY_ITEMS.comedy = comedy;
  renderRail("scrollerComedy", comedy);
  const countComedy = document.getElementById("countComedy");
  if (countComedy) countComedy.innerText = comedy.length;

  // Set billboard hero
  renderBillboard(popular[0] || trending[0] || currentHeroItem);
}

// ==========================================================================
// RENDER BILLBOARD HERO
// ==========================================================================

function renderBillboard(item) {
  if (!item) return;
  currentHeroItem = item;
  const billboard = document.getElementById("heroBillboard");
  const title = document.getElementById("heroTitle");
  const desc = document.getElementById("heroDesc");

  if (!billboard) return;
  const heroImg = item.backdrop || item.poster || item.image;
  billboard.style.backgroundImage = `url('${heroImg}')`;
  if (title) title.innerText = (item.title || "").toUpperCase();
  if (desc) desc.innerText = item.description || item.overview || "Now streaming on Prime Video.";
}

function playHeroMovie() {
  openPlayer(currentHeroItem);
}

function openHeroDetails() {
  openDetailsModal(currentHeroItem);
}

// ==========================================================================
// RENDER ROWS & CAROUSELS (LIVE FRAMEX ENDPOINT SYNC)
// ==========================================================================

const CATEGORY_ITEMS = {
  trending: [],
  popular_movies: [],
  popular_tv: [],
  netflix: PLATFORM_SHOWS.netflix,
  hotstar: PLATFORM_SHOWS.hotstar,
  originals: CATALOG,
  max: PLATFORM_SHOWS.max,
  anime: [],
  new_releases: [],
  action: [],
  comedy: [],
  live: PLATFORM_SHOWS.liveChannels
};

const CATEGORY_META = {
  trending: { title: "Trending Movies & Shows", subtitle: "Most-watched films and series streaming right now across all platforms", tag: "TRENDING NOW" },
  popular_movies: { title: "Popular Movies", subtitle: "Global crowd favorites and blockbuster cinema", tag: "BLOCKBUSTER CINEMA" },
  popular_tv: { title: "Popular TV Series", subtitle: "Binge-worthy drama, mysteries, and episodic television", tag: "EPISODIC TV" },
  netflix: { title: "Trending on Netflix", subtitle: "Top Netflix Originals, global sensations, and international dramas", tag: "NETFLIX HITS" },
  hotstar: { title: "Disney+ & Hotstar Specials", subtitle: "Marvel Studios, Star Wars saga, and Hotstar Exclusives", tag: "DISNEY+ HOTSTAR" },
  originals: { title: "Amazon Prime Originals", subtitle: "Award-winning Prime Video exclusive series, blockbusters, and documentaries", tag: "AMAZON ORIGINAL" },
  max: { title: "HBO Max Blockbusters", subtitle: "Critically acclaimed HBO dramas, Warner Bros releases, and cinematic hits", tag: "HBO MAX" },
  anime: { title: "Popular Anime Hub", subtitle: "Top Japanese animation, shonen epics, and seasonal simulcasts", tag: "ANIME HUB" },
  new_releases: { title: "New Releases", subtitle: "Fresh digital releases, premieres, and newly arrived movies", tag: "NEW ARRIVALS" },
  action: { title: "Action & Sci-Fi Blockbusters", subtitle: "High-octane action, superhero spectacles, and futuristic odysseys", tag: "ACTION & SCI-FI" },
  comedy: { title: "Comedy & Entertainment", subtitle: "Laugh-out-loud comedies, family films, and comedy specials", tag: "COMEDY & FUN" },
  live: { title: "Live Channels & Sports", subtitle: "24/7 sports feeds, live cricket, football, and news networks", tag: "LIVE CHANNELS" },
  all: { title: "All Shows & Movies", subtitle: "Complete catalog aggregated across Netflix, Hotstar, Prime, HBO Max & Box Office", tag: "COMPLETE CATALOG" },
  all_movies: { title: "All Featured Movies", subtitle: "Every full-length feature presentation and blockbuster across platforms", tag: "FEATURE MOVIES" },
  all_tv: { title: "All TV Series", subtitle: "Every episodic series, mini-series, and anime across all networks", tag: "TV SERIES" },
  mylist: { title: "My Watchlist", subtitle: "All titles you've saved to watch later", tag: "MY LIST" }
};

let currentViewAllItems = [];
let activeViewAllCategory = "all";
let activeViewAllFilter = "all";

function extractRailResults(rail) {
  if (!rail) return [];
  if (Array.isArray(rail)) return rail;
  if (Array.isArray(rail.results)) return rail.results;
  if (Array.isArray(rail.items)) return rail.items;
  return [];
}

async function fetchApiJson(endpoint) {
  // 1. Try local/relative endpoint (localhost server.js or Vercel serverless function)
  try {
    const res = await fetch(endpoint);
    const ct = res.headers.get("content-type") || "";
    if (res.ok && ct.includes("json")) {
      const data = await res.json();
      if (data && (data.rails || data.results || data.items || Array.isArray(data))) {
        return data;
      }
    }
  } catch (e) {
    console.warn("[API] Relative fetch error:", e);
  }

  // 2. Try direct FrameXTV backend
  try {
    const directUrl = endpoint.startsWith("/api/") ? `https://api.framextv.tech${endpoint}` : endpoint;
    const res = await fetch(directUrl);
    const ct = res.headers.get("content-type") || "";
    if (res.ok && ct.includes("json")) {
      return await res.json();
    }
  } catch (e) {
    console.warn("[API] Direct fetch error:", e);
  }

  // 3. Try public HTTPS CORS proxy
  try {
    const directUrl = endpoint.startsWith("/api/") ? `https://api.framextv.tech${endpoint}` : endpoint;
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(directUrl)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("[API] CORS proxy error:", e);
  }

  return null;
}

async function loadLiveFrameXCatalog() {
  try {
    const data = await fetchApiJson('/api/home');

    if (!data || !data.rails) {
      console.warn("[FrameX Catalog] Using cached catalog (live API returned empty)");
      fetchLivePlatformRows();
      return;
    }

    console.log("[FrameX Catalog] Live Rails Loaded:", Object.keys(data.rails));

    // 1. Trending Movies (Bad Apples, By Any Means, Clayface, The Weight, Tenzing...)
    const trending = extractRailResults(data.rails.trending_movies);
    if (trending.length > 0) {
      const items = trending.map(d => formatSearchResult(d, "badge-prime", "MOVIE"));
      CATEGORY_ITEMS.trending = items;
      renderRail("scrollerTrending", items);
      const countEl = document.getElementById("countTrending");
      if (countEl) countEl.innerText = trending.length;
    }

    // 2. Popular Movies (Spider-Man: Brand New Day, The Odyssey, Street Fighter, Hope...)
    const popularMovies = extractRailResults(data.rails.popular_movies);
    if (popularMovies.length > 0) {
      const items = popularMovies.map(d => formatSearchResult(d, "badge-prime", "MOVIE"));
      CATEGORY_ITEMS.popular_movies = items;
      renderRail("scrollerPopularMovies", items);
      const countEl = document.getElementById("countPopularMovies");
      if (countEl) countEl.innerText = popularMovies.length;

      // Set featured hero to top popular blockbuster
      if (popularMovies[0]) {
        renderBillboard(formatSearchResult(popularMovies[0]));
      }
    }

    // 3. Popular TV Series (Breaking Bad, etc.)
    const popularTv = extractRailResults(data.rails.popular_tv);
    if (popularTv.length > 0) {
      const items = popularTv.map(d => formatSearchResult(d, "badge-netflix", "TV"));
      CATEGORY_ITEMS.popular_tv = items;
      renderRail("scrollerPopularTV", items);
      const countEl = document.getElementById("countPopularTV");
      if (countEl) countEl.innerText = popularTv.length;
    }

    // 4. Popular Anime (Attack on Titan, ONE PIECE, etc.)
    const animeItems = extractRailResults(data.rails.popular_anime).concat(extractRailResults(data.rails.airing_anime));
    if (animeItems.length > 0) {
      const items = animeItems.map(d => formatSearchResult(d, "badge-anime", "ANIME"));
      CATEGORY_ITEMS.anime = items;
      renderRail("scrollerAnime", items, false, "badge-anime", "ANIME");
      const countEl = document.getElementById("countAnime");
      if (countEl) countEl.innerText = animeItems.length;
    }

    // 5. New Releases (The Odyssey, etc.)
    const newReleases = extractRailResults(data.rails.new_releases);
    if (newReleases.length > 0) {
      const items = newReleases.map(d => formatSearchResult(d, "badge-prime", "NEW"));
      CATEGORY_ITEMS.new_releases = items;
      renderRail("scrollerNewReleases", items);
      const countEl = document.getElementById("countNewReleases");
      if (countEl) countEl.innerText = newReleases.length;
    }

    // 6. Action & Sci-Fi Blockbusters
    const actionItems = extractRailResults(data.rails.action_movies).concat(extractRailResults(data.rails.scifi_movies));
    if (actionItems.length > 0) {
      const items = actionItems.map(d => formatSearchResult(d, "badge-prime", "ACTION"));
      CATEGORY_ITEMS.action = items;
      renderRail("scrollerAction", items);
      const countEl = document.getElementById("countAction");
      if (countEl) countEl.innerText = actionItems.length;
    }

    // 7. Comedy Movies
    const comedyItems = extractRailResults(data.rails.comedy_movies);
    if (comedyItems.length > 0) {
      const items = comedyItems.map(d => formatSearchResult(d, "badge-prime", "COMEDY"));
      CATEGORY_ITEMS.comedy = items;
      renderRail("scrollerComedy", items);
      const countEl = document.getElementById("countComedy");
      if (countEl) countEl.innerText = comedyItems.length;
    }

    // 8. Dynamic platform rows
    fetchLivePlatformRows();

  } catch (err) {
    console.warn("[FrameX Catalog] Live API error:", err);
    fetchLivePlatformRows();
  }
}

async function fetchLivePlatformRows() {
  try {
    const netflixQueries = ['stranger things', 'squid game', 'wednesday', 'money heist', 'the witcher', 'peaky blinders', 'dark', 'black mirror'];
    const hotstarQueries = ['loki', 'shogun', 'the mandalorian', 'wandavision', 'daredevil', 'moon knight', 'percy jackson'];
    const maxQueries = ['house of the dragon', 'the last of us', 'game of thrones', 'succession', 'euphoria'];

    Promise.all(netflixQueries.map(q => 
      fetchApiJson(`/api/search?q=${encodeURIComponent(q)}`)
        .then(d => {
          if (!d) return null;
          const res = extractRailResults(d);
          return res.length > 0 ? formatSearchResult(res[0], "badge-netflix", "NETFLIX") : null;
        })
        .catch(() => null)
    )).then(hits => {
      const valid = hits.filter(Boolean);
      if (valid.length > 0) {
        CATEGORY_ITEMS.netflix = valid;
        renderRail("scrollerNetflix", valid, false, "badge-netflix", "NETFLIX");
      }
    });

    Promise.all(hotstarQueries.map(q => 
      fetchApiJson(`/api/search?q=${encodeURIComponent(q)}`)
        .then(d => {
          if (!d) return null;
          const res = extractRailResults(d);
          return res.length > 0 ? formatSearchResult(res[0], "badge-hotstar", "HOTSTAR") : null;
        })
        .catch(() => null)
    )).then(hits => {
      const valid = hits.filter(Boolean);
      if (valid.length > 0) {
        CATEGORY_ITEMS.hotstar = valid;
        renderRail("scrollerHotstar", valid, false, "badge-hotstar", "HOTSTAR");
      }
    });

    Promise.all(maxQueries.map(q => 
      fetchApiJson(`/api/search?q=${encodeURIComponent(q)}`)
        .then(d => {
          if (!d) return null;
          const res = extractRailResults(d);
          return res.length > 0 ? formatSearchResult(res[0], "badge-max", "HBO MAX") : null;
        })
        .catch(() => null)
    )).then(hits => {
      const valid = hits.filter(Boolean);
      if (valid.length > 0) {
        CATEGORY_ITEMS.max = valid;
        renderRail("scrollerMax", valid, false, "badge-max", "HBO MAX");
      }
    });

    setTimeout(() => initSliderArrows(), 400);
  } catch (e) {
    console.warn("[Platform Sync] Background fetch completed");
  }
}

// ==========================================================================
// VIEW ALL - FULL-PAGE GRID LISTING ENGINE
// ==========================================================================

let viewAllCurrentCategory = "all";
let viewAllCurrentFilter = "all";
let viewAllCurrentPage = 1;
let viewAllIsLoading = false;
let viewAllHasMore = true;
let viewAllItems = [];
let viewAllSeenIds = new Set();
let viewAllSortBy = "featured";
let isViewAllInfiniteScrollAttached = false;

function getInitialLocalPool(catKey) {
  if (catKey === "trending") return (CATEGORY_ITEMS.trending || []).slice();
  if (catKey === "popular_movies") return (CATEGORY_ITEMS.popular_movies || []).slice();
  if (catKey === "popular_tv") return (CATEGORY_ITEMS.popular_tv || []).slice();
  if (catKey === "netflix") return (PLATFORM_SHOWS.netflix || []).slice();
  if (catKey === "hotstar") return (PLATFORM_SHOWS.hotstar || []).slice();
  if (catKey === "originals") return (CATALOG || []).slice();
  if (catKey === "max") return (PLATFORM_SHOWS.max || []).slice();
  if (catKey === "anime") return (CATEGORY_ITEMS.anime || []).slice();
  return getAllKnownItems();
}

function getViewAllEndpoint(catKey, filter, page) {
  if (catKey === "trending") {
    return `/api/trending?page=${page}`;
  }
  if (filter === "anime" || catKey === "anime") {
    return `/api/anime?page=${page}`;
  }
  if (filter === "movie" || catKey === "popular_movies" || catKey === "all_movies") {
    return `/api/movies?page=${page}`;
  }
  if (filter === "tv" || catKey === "popular_tv" || catKey === "all_tv") {
    return `/api/tv?page=${page}`;
  }
  return `/api/discover?page=${page}`;
}

let viewAllObserver = null;

async function openViewAllCategory(catKey = "all") {
  viewAllCurrentCategory = catKey;
  viewAllCurrentFilter = (catKey === "popular_movies" || catKey === "all_movies") ? "movie" :
                         (catKey === "popular_tv" || catKey === "all_tv") ? "tv" :
                         (catKey === "anime") ? "anime" : "all";
  viewAllCurrentPage = 1;
  viewAllIsLoading = false;
  viewAllHasMore = true;
  viewAllItems = [];
  viewAllSeenIds = new Set();
  viewAllSortBy = "featured";

  const page = document.getElementById("viewAllPage");
  const hero = document.getElementById("heroBillboard");
  const channels = document.getElementById("channelsRail");
  const content = document.getElementById("contentContainer");
  const searchRow = document.getElementById("rowSearch");

  if (hero) hero.style.display = "none";
  if (channels) channels.style.display = "none";
  if (content) content.style.display = "none";
  if (searchRow) searchRow.style.display = "none";
  if (page) page.style.display = "flex";

  const meta = CATEGORY_META[catKey] || {
    title: "All Shows & Movies",
    subtitle: "Complete streaming catalog aggregated across all major platforms",
    tag: "COMPLETE CATALOG"
  };

  const titleEl = document.getElementById("viewAllTitle");
  const countEl = document.getElementById("viewAllCount");
  const subEl = document.getElementById("viewAllSubtitle");
  const tagEl = document.getElementById("viewAllTag");
  const loadMoreBtn = document.getElementById("viewAllLoadMoreBtn");

  if (titleEl) titleEl.innerText = meta.title;
  if (subEl) subEl.innerText = meta.subtitle;
  if (tagEl) tagEl.innerText = meta.tag;

  let catalogMaxLabel = "50,000+ Titles";
  if (viewAllCurrentFilter === "movie") {
    catalogMaxLabel = "20,000+ Movies";
  } else if (viewAllCurrentFilter === "tv") {
    catalogMaxLabel = "20,000+ TV Series";
  } else if (viewAllCurrentFilter === "anime") {
    catalogMaxLabel = "5,000+ Anime";
  }

  if (countEl) countEl.innerText = `Connecting to ${catalogMaxLabel}…`;
  if (loadMoreBtn) loadMoreBtn.innerText = `Load Next 50 Titles (${catalogMaxLabel} Available) ▾`;

  document.querySelectorAll(".viewall-filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === viewAllCurrentFilter);
  });

  const select = document.getElementById("viewAllSortSelect");
  if (select) select.value = "featured";

  if (catKey === "mylist") {
    const list = getAllKnownItems().filter(item => watchlist.has(item.id));
    viewAllItems = list;
    viewAllHasMore = false;
    renderViewAllGrid(list);
    if (countEl) countEl.innerText = `${list.length} Titles`;
    if (loadMoreBtn) loadMoreBtn.style.display = "none";
    window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }
  if (loadMoreBtn) loadMoreBtn.style.display = "block";

  // For specific curated platforms (netflix, hotstar, max, originals, live), pre-seed with curated items
  const isCuratedChannel = ['netflix', 'hotstar', 'max', 'originals', 'live'].includes(catKey);
  if (isCuratedChannel) {
    const initialPool = getInitialLocalPool(catKey);
    initialPool.forEach(item => {
      if (item && item.id && !viewAllSeenIds.has(item.id)) {
        viewAllSeenIds.add(item.id);
        viewAllItems.push(item);
      }
    });
  }

  const grid = document.getElementById("viewAllGrid");
  if (viewAllItems.length > 0) {
    renderViewAllGrid(viewAllItems);
    if (countEl) countEl.innerText = `${viewAllItems.length} of ${catalogMaxLabel}`;
  } else {
    if (grid) {
      grid.innerHTML = Array(18).fill(0).map(() => `
        <div class="skeleton-card" style="width: 100%;">
          <div class="skeleton-thumb" style="height: 250px;"></div>
          <div class="skeleton-info">
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
          </div>
        </div>
      `).join('');
    }
  }

  window.scrollTo({ top: 0, behavior: "instant" });
  setupViewAllInfiniteScroll();

  // Load first 3 live pages from backend (54+ items) in parallel!
  await loadNextViewAllBatch(3);
}

async function loadNextViewAllBatch(batchCount = 3) {
  if (viewAllIsLoading || !viewAllHasMore) return;
  viewAllIsLoading = true;

  const loader = document.getElementById("viewAllLoader");
  const loadMoreBtn = document.getElementById("viewAllLoadMoreBtn");
  if (loader) loader.style.display = "flex";
  if (loadMoreBtn) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.innerText = "Loading titles from catalog…";
  }

  const startPage = viewAllCurrentPage;
  const pagePromises = [];
  for (let i = 0; i < batchCount; i++) {
    const pageNum = startPage + i;
    const url = getViewAllEndpoint(viewAllCurrentCategory, viewAllCurrentFilter, pageNum);
    pagePromises.push(
      fetchApiJson(url).then(data => ({ pageNum, data })).catch(err => {
        console.warn(`[ViewAll] Page ${pageNum} error:`, err);
        return { pageNum, data: null };
      })
    );
  }

  try {
    const settled = await Promise.all(pagePromises);
    const grid = document.getElementById("viewAllGrid");
    const countEl = document.getElementById("viewAllCount");

    // Remove any leftover skeletons
    if (grid) {
      grid.querySelectorAll(".skeleton-card").forEach(s => s.remove());
    }

    let addedCount = 0;
    for (const res of settled) {
      if (!res.data) continue;
      const rawResults = extractRailResults(res.data);
      if (rawResults && rawResults.length > 0) {
        rawResults.forEach(raw => {
          const item = formatSearchResult(raw, raw.type === "tv" ? "badge-netflix" : "badge-prime", raw.type === "tv" ? "TV" : "MOVIE");
          if (item && item.id && !viewAllSeenIds.has(item.id)) {
            viewAllSeenIds.add(item.id);
            viewAllItems.push(item);
            addedCount++;

            // Check if matches active filter
            const matchesFilter =
              viewAllCurrentFilter === "all" ||
              (viewAllCurrentFilter === "movie" && item.type !== "tv") ||
              (viewAllCurrentFilter === "tv" && item.type === "tv") ||
              (viewAllCurrentFilter === "anime");

            if (matchesFilter && grid) {
              grid.appendChild(createStandardCard(item));
            }
          }
        });
      }

      if (res.data.totalPages && res.pageNum >= res.data.totalPages) {
        viewAllHasMore = false;
      }
    }

    viewAllCurrentPage += batchCount;

    // Update dynamic counter badge
    const visibleCount = grid ? grid.querySelectorAll(".movie-card").length : viewAllItems.length;
    let catalogMaxLabel = "50,000+ Titles";
    let catalogTypeLabel = "Titles";
    if (viewAllCurrentFilter === "movie") {
      catalogMaxLabel = "20,000+ Movies";
      catalogTypeLabel = "Movies";
    } else if (viewAllCurrentFilter === "tv") {
      catalogMaxLabel = "20,000+ TV Series";
      catalogTypeLabel = "TV Series";
    } else if (viewAllCurrentFilter === "anime") {
      catalogMaxLabel = "5,000+ Anime";
      catalogTypeLabel = "Anime";
    }

    if (countEl) {
      countEl.innerText = `${visibleCount.toLocaleString()} of ${catalogMaxLabel}`;
    }

    if (loadMoreBtn) {
      loadMoreBtn.disabled = false;
      if (viewAllHasMore) {
        loadMoreBtn.innerText = `Load Next 50 ${catalogTypeLabel} (${catalogMaxLabel} Available) ▾`;
      } else {
        loadMoreBtn.innerText = `All ${catalogTypeLabel} Catalog Loaded (${visibleCount.toLocaleString()} Titles)`;
      }
    }

    // Auto-fill if screen is large and not enough content yet to scroll
    if (viewAllHasMore && viewAllItems.length < 50 && document.documentElement.scrollHeight <= window.innerHeight + 300) {
      setTimeout(() => loadNextViewAllBatch(2), 200);
    }
  } catch (err) {
    console.warn("[ViewAll] Batch fetch error:", err);
  } finally {
    viewAllIsLoading = false;
    if (loader) loader.style.display = "none";
    if (loadMoreBtn && loadMoreBtn.disabled) loadMoreBtn.disabled = false;
  }
}
window.loadNextViewAllBatch = loadNextViewAllBatch;

// Single-page backward compatibility alias
async function loadNextViewAllPage() {
  return loadNextViewAllBatch(2);
}

function setupViewAllInfiniteScroll() {
  const loader = document.getElementById("viewAllLoader");
  const loadMoreBtn = document.getElementById("viewAllLoadMoreBtn");

  // IntersectionObserver triggers load before user even hits the bottom!
  if (!viewAllObserver && "IntersectionObserver" in window) {
    viewAllObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const page = document.getElementById("viewAllPage");
          if (page && page.style.display !== "none" && !viewAllIsLoading && viewAllHasMore) {
            loadNextViewAllBatch(2);
          }
        }
      }
    }, {
      root: null,
      rootMargin: "1000px 0px", // Trigger 1000px ahead!
      threshold: 0
    });
  }

  if (viewAllObserver) {
    if (loader) viewAllObserver.observe(loader);
    if (loadMoreBtn) viewAllObserver.observe(loadMoreBtn);
  }

  if (isViewAllInfiniteScrollAttached) return;
  isViewAllInfiniteScrollAttached = true;

  window.addEventListener("scroll", () => {
    const page = document.getElementById("viewAllPage");
    if (!page || page.style.display === "none") return;

    const scrollBottom = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    // Trigger next page load when 900px from bottom
    if (scrollBottom >= documentHeight - 900) {
      if (!viewAllIsLoading && viewAllHasMore) {
        loadNextViewAllBatch(2);
      }
    }
  }, { passive: true });
}

function closeViewAllPage() {
  const page = document.getElementById("viewAllPage");
  const hero = document.getElementById("heroBillboard");
  const channels = document.getElementById("channelsRail");
  const content = document.getElementById("contentContainer");

  if (page) page.style.display = "none";
  if (hero) hero.style.display = "flex";
  if (channels) channels.style.display = "flex";
  if (content) content.style.display = "flex";

  switchCategory("all");
}

function renderViewAllGrid(items) {
  const grid = document.getElementById("viewAllGrid");
  if (!grid) return;
  grid.innerHTML = "";

  if (!items || items.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; color: var(--text-secondary); font-size: 16px;">
        No titles found in this category. Try switching the filter above.
      </div>
    `;
    return;
  }

  items.forEach(item => {
    grid.appendChild(createStandardCard(item));
  });
}

async function filterViewAllType(type) {
  viewAllCurrentFilter = type;
  document.querySelectorAll(".viewall-filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === type);
  });

  const titleEl = document.getElementById("viewAllTitle");
  const countEl = document.getElementById("viewAllCount");
  const subEl = document.getElementById("viewAllSubtitle");
  const tagEl = document.getElementById("viewAllTag");
  const loadMoreBtn = document.getElementById("viewAllLoadMoreBtn");

  if (type === "movie") {
    if (titleEl) titleEl.innerText = "All Movies & Blockbusters";
    if (tagEl) tagEl.innerText = "20,000+ MOVIES";
    if (subEl) subEl.innerText = "Endless cinema catalog — stream 20,000+ feature films, Hollywood hits & classics";
    if (countEl) countEl.innerText = "Loading 20,000+ Movies…";
    if (loadMoreBtn) loadMoreBtn.innerText = "Load Next 50 Movies (20,000+ Available) ▾";
  } else if (type === "tv") {
    if (titleEl) titleEl.innerText = "All TV Shows & Web Series";
    if (tagEl) tagEl.innerText = "20,000+ TV SERIES";
    if (subEl) subEl.innerText = "Endless episodic library — binge 20,000+ complete seasons, series & dramas";
    if (countEl) countEl.innerText = "Loading 20,000+ TV Series…";
    if (loadMoreBtn) loadMoreBtn.innerText = "Load Next 50 Series (20,000+ Available) ▾";
  } else if (type === "anime") {
    if (titleEl) titleEl.innerText = "All Anime Series & Movies";
    if (tagEl) tagEl.innerText = "5,000+ ANIME SERIES";
    if (subEl) subEl.innerText = "Endless anime catalog — thousands of episodes, legendary shonen franchises & movies";
    if (countEl) countEl.innerText = "Loading 5,000+ Anime…";
    if (loadMoreBtn) loadMoreBtn.innerText = "Load Next Anime (5,000+ Available) ▾";
  } else {
    if (titleEl) titleEl.innerText = "Complete Streaming Catalog";
    if (tagEl) tagEl.innerText = "50,000+ TITLES";
    if (subEl) subEl.innerText = "Continuous streaming catalog — browse 50,000+ movies, series & anime titles across all platforms";
    if (countEl) countEl.innerText = "Loading 50,000+ Titles…";
    if (loadMoreBtn) loadMoreBtn.innerText = "Load Next 50 Titles (50,000+ Available) ▾";
  }

  // Reset pagination state for selected filter
  viewAllCurrentPage = 1;
  viewAllHasMore = true;
  viewAllIsLoading = false;
  viewAllSeenIds = new Set();
  viewAllItems = [];

  const grid = document.getElementById("viewAllGrid");
  // Immediate shimmering skeletons while loading
  if (grid) {
    grid.innerHTML = Array(18).fill(0).map(() => `
      <div class="skeleton-card" style="width: 100%;">
        <div class="skeleton-thumb" style="height: 250px;"></div>
        <div class="skeleton-info">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
    `).join('');
  }

  // Scroll to top of grid
  window.scrollTo({ top: 0, behavior: "instant" });

  // Load first large batch (3 pages = 54+ movies)
  await loadNextViewAllBatch(3);
}

function sortViewAllGrid(sortBy) {
  viewAllSortBy = sortBy;
  const list = getSortedViewAllList(viewAllItems);
  renderViewAllGrid(list);
}

function getSortedViewAllList(items) {
  let list = items.slice();
  if (viewAllCurrentFilter === "movie") {
    list = list.filter(i => i.type !== "tv");
  } else if (viewAllCurrentFilter === "tv") {
    list = list.filter(i => i.type === "tv");
  }

  if (viewAllSortBy === "rating") {
    list.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
  } else if (viewAllSortBy === "year") {
    list.sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0));
  } else if (viewAllSortBy === "title") {
    list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  }
  return list;
}

window.openViewAllCategory = openViewAllCategory;
window.filterViewAllType = filterViewAllType;
window.closeViewAllPage = closeViewAllPage;
window.sortViewAllGrid = sortViewAllGrid;

function slideRow(scrollerId, direction) {
  const el = document.getElementById(scrollerId);
  if (!el) return;

  // Measure card width + gap (card is 176px + 16px gap = 192px)
  const card = el.querySelector(".movie-card");
  const cardWidth = card ? (card.offsetWidth + 16) : 192;
  // Calculate how many cards are visible
  const visibleCards = Math.max(1, Math.floor(el.clientWidth / cardWidth));
  // Jump by visible cards minus 1 (or at least 2 cards)
  const cardsToJump = Math.max(2, visibleCards > 2 ? visibleCards - 1 : 2);
  const scrollDistance = (cardsToJump * cardWidth) * direction;

  // Calculate target offset clamped to bounds
  const maxScroll = el.scrollWidth - el.clientWidth;
  const targetLeft = Math.max(0, Math.min(el.scrollLeft + scrollDistance, maxScroll));

  // Perform smooth scrolling
  try {
    el.scrollTo({
      left: targetLeft,
      behavior: "smooth"
    });
  } catch (err) {
    el.scrollLeft = targetLeft;
  }

  // Backup guard to guarantee movement even if browser smooth scrolling gets blocked
  setTimeout(() => {
    if (direction > 0 && el.scrollLeft < targetLeft - 40) {
      el.scrollLeft = targetLeft;
    } else if (direction < 0 && el.scrollLeft > targetLeft + 40) {
      el.scrollLeft = targetLeft;
    }
    updateSliderArrows(el);
  }, 350);
}

function updateSliderArrows(scroller) {
  if (typeof scroller === "string") {
    scroller = document.getElementById(scroller);
  }
  if (!scroller) return;
  const wrapper = scroller.closest(".scroller-wrapper");
  if (!wrapper) return;

  const prevBtn = wrapper.querySelector(".slider-prev");
  const nextBtn = wrapper.querySelector(".slider-next");

  const scrollLeft = scroller.scrollLeft;
  const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;

  if (prevBtn) {
    if (scrollLeft <= 15) {
      prevBtn.classList.add("hidden");
    } else {
      prevBtn.classList.remove("hidden");
    }
  }

  if (nextBtn) {
    if (maxScrollLeft <= 15 || scrollLeft >= maxScrollLeft - 15) {
      nextBtn.classList.add("hidden");
    } else {
      nextBtn.classList.remove("hidden");
    }
  }
}

function initSliderArrows() {
  const wrappers = document.querySelectorAll(".scroller-wrapper");
  wrappers.forEach(wrapper => {
    const scroller = wrapper.querySelector(".cards-scroller");
    if (!scroller) return;

    const prevBtn = wrapper.querySelector(".slider-prev");
    const nextBtn = wrapper.querySelector(".slider-next");

    if (prevBtn) {
      prevBtn.onclick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        slideRow(scroller.id, -1);
      };
    }

    if (nextBtn) {
      nextBtn.onclick = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        slideRow(scroller.id, 1);
      };
    }

    updateSliderArrows(scroller);

    scroller.addEventListener("scroll", () => {
      updateSliderArrows(scroller);
    }, { passive: true });
  });

  window.addEventListener("resize", () => {
    document.querySelectorAll(".cards-scroller").forEach(updateSliderArrows);
  });
}

// Expose globally so inline onclick always resolves
window.slideRow = slideRow;
window.updateSliderArrows = updateSliderArrows;
window.initSliderArrows = initSliderArrows;

function renderRail(containerId, items, showProgress = false, defaultPlatformClass = "badge-prime", defaultPlatformLabel = "MOVIE") {
  const container = document.getElementById(containerId);
  if (!container || !items) return;
  container.innerHTML = "";
  items.forEach(item => {
    container.appendChild(createStandardCard(item, showProgress, defaultPlatformClass, defaultPlatformLabel));
  });
  setTimeout(() => updateSliderArrows(container), 80);
}

function createStandardCard(item, showProgress = false, defaultPlatformClass = "badge-prime", defaultPlatformLabel = "MOVIE") {
  const card = document.createElement("div");
  card.className = "movie-card";
  card.tabIndex = 0;
  card.onclick = () => openDetailsModal(item);

  const pClass = item.platformClass || defaultPlatformClass;
  const pLabel = item.platformLabel || defaultPlatformLabel || (item.type === "tv" ? "TV" : "MOVIE");
  
  // Prefer vertical poster image first (like on FrameXTV)
  const thumb = item.poster || item.image || item.backdrop || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=640&q=80";
  const ratingVal = item.rating && item.rating !== "N/A" ? String(item.rating) : "7.5";
  const yearVal = item.year || (item.release_date ? item.release_date.substring(0, 4) : "2026");
  const typeVal = item.type === "tv" ? "TV" : "Film";

  const inList = watchlist.has(item.id);
  const progressPct = item._pct || 0;

  card.innerHTML = `
    <div class="card-thumb-wrapper">
      <img class="card-thumb" src="${thumb}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=640&q=80'">
      <div class="card-prime-badge ${pClass}">${pLabel}</div>
      <div class="card-rating-badge">★ ${ratingVal}</div>
      <button class="card-watchlist-btn ${inList ? 'in-list' : ''}" data-id="${item.id}"
        title="${inList ? 'Remove from My List' : 'Add to My List'}"
        onclick="event.stopPropagation(); toggleWatchlist(window._cardItemMap && window._cardItemMap['${item.id}'] || {id:'${item.id}',title:'${item.title}'}, this)">
        ${inList ? '❤️' : '♡'}
      </button>
      ${showProgress && progressPct > 0 ? `
        <div class="card-progress-bar">
          <div class="card-progress-fill" style="width: ${progressPct}%"></div>
        </div>
      ` : ''}
    </div>
    <div class="card-info">
      <div class="card-title" title="${item.title}">${item.title}</div>
      <div class="card-sub">
        <span>${yearVal}</span>
        <span>•</span>
        <span>${typeVal}</span>
      </div>
    </div>
  `;
  // Store item ref for watchlist toggle
  if (!window._cardItemMap) window._cardItemMap = {};
  window._cardItemMap[item.id] = item;
  return card;
}

// ==========================================================================
// DETAILS MODAL & EPISODES
// ==========================================================================

// TV Series & Seasons dynamic episode caches
const tvSeriesCache = {};
const tvSeasonEpisodesCache = {};
let currentActiveSeasonNumber = 1;

// ============================================================
// BUILT-IN SERIES CATALOG: Real season/episode data
// Used as instant fallback on Vercel & when API is slow/blocked
// Updated from live FrameXTV API data
// ============================================================
const TV_CATALOG_DB = {
  "66732":  { title: "Stranger Things",    seasons: [{n:1,name:"Season 1",eps:8},{n:2,name:"Stranger Things 2",eps:9},{n:3,name:"Stranger Things 3",eps:8},{n:4,name:"Stranger Things 4",eps:9},{n:5,name:"Stranger Things 5",eps:8}] },
  "119051": { title: "Wednesday",          seasons: [{n:1,name:"Season 1",eps:8},{n:2,name:"Season 2",eps:8}] },
  "93405":  { title: "Squid Game",         seasons: [{n:1,name:"Season 1",eps:9},{n:2,name:"Season 2",eps:7},{n:3,name:"Season 3",eps:6}] },
  "106379": { title: "Fallout",            seasons: [{n:1,name:"Season 1",eps:8},{n:2,name:"Season 2",eps:8}] },
  "76479":  { title: "The Boys",           seasons: [{n:1,name:"Season 1",eps:8},{n:2,name:"Season 2",eps:8},{n:3,name:"Season 3",eps:8},{n:4,name:"Season 4",eps:8},{n:5,name:"Season 5",eps:8}] },
  "108978": { title: "Reacher",            seasons: [{n:1,name:"Season 1",eps:8},{n:2,name:"Season 2",eps:8},{n:3,name:"Season 3",eps:8},{n:4,name:"Season 4",eps:8}] },
  "94997":  { title: "House of the Dragon",seasons: [{n:1,name:"Season 1",eps:10},{n:2,name:"Season 2",eps:8},{n:3,name:"Season 3",eps:8}] },
  "1399":   { title: "Game of Thrones",    seasons: [{n:1,name:"Season 1",eps:10},{n:2,name:"Season 2",eps:10},{n:3,name:"Season 3",eps:10},{n:4,name:"Season 4",eps:10},{n:5,name:"Season 5",eps:10},{n:6,name:"Season 6",eps:10},{n:7,name:"Season 7",eps:7},{n:8,name:"Season 8",eps:6}] },
  "100088": { title: "The Last of Us",     seasons: [{n:1,name:"Season 1",eps:9},{n:2,name:"Season 2",eps:7}] },
  "76331":  { title: "Succession",         seasons: [{n:1,name:"Season 1",eps:10},{n:2,name:"Season 2",eps:10},{n:3,name:"Season 3",eps:9},{n:4,name:"Season 4",eps:10}] },
  "85552":  { title: "Euphoria",           seasons: [{n:1,name:"Season 1",eps:8},{n:2,name:"Season 2",eps:8},{n:3,name:"Season 3",eps:8}] },
  "1396":   { title: "Breaking Bad",       seasons: [{n:1,name:"Season 1",eps:7},{n:2,name:"Season 2",eps:13},{n:3,name:"Season 3",eps:13},{n:4,name:"Season 4",eps:13},{n:5,name:"Season 5",eps:16}] },
  "71446":  { title: "Money Heist",        seasons: [{n:1,name:"Season 1",eps:15},{n:2,name:"Season 2",eps:16},{n:3,name:"Season 3",eps:10}] },
  "71912":  { title: "The Witcher",        seasons: [{n:1,name:"Season 1",eps:8},{n:2,name:"Season 2",eps:8},{n:3,name:"Season 3",eps:8},{n:4,name:"Season 4",eps:8}] },
  "82856":  { title: "The Mandalorian",    seasons: [{n:1,name:"Season 1",eps:8},{n:2,name:"Season 2",eps:8},{n:3,name:"Season 3",eps:8}] },
  "92749":  { title: "Moon Knight",        seasons: [{n:1,name:"Season 1",eps:6}] },
  "60625":  { title: "Rick and Morty",     seasons: [{n:1,name:"Season 1",eps:11},{n:2,name:"Season 2",eps:10},{n:3,name:"Season 3",eps:10},{n:4,name:"Season 4",eps:10},{n:5,name:"Season 5",eps:10},{n:6,name:"Season 6",eps:10},{n:7,name:"Season 7",eps:10},{n:8,name:"Season 8",eps:10},{n:9,name:"Season 9",eps:10}] },
  "94605":  { title: "Arcane",             seasons: [{n:1,name:"Season 1",eps:9},{n:2,name:"Season 2",eps:9}] },
  "91239":  { title: "Bridgerton",         seasons: [{n:1,name:"Season 1",eps:8},{n:2,name:"Season 2",eps:8},{n:3,name:"Season 3",eps:8},{n:4,name:"Season 4",eps:8}] },
  "84773":  { title: "Rings of Power",     seasons: [{n:1,name:"Season 1",eps:8},{n:2,name:"Season 2",eps:8},{n:3,name:"Season 3",eps:8}] },
  "108545": { title: "3 Body Problem",     seasons: [{n:1,name:"Season 1",eps:8}] },
  "1402":   { title: "The Walking Dead",   seasons: [{n:1,name:"Season 1",eps:6},{n:2,name:"Season 2",eps:13},{n:3,name:"Season 3",eps:16},{n:4,name:"Season 4",eps:16},{n:5,name:"Season 5",eps:16},{n:6,name:"Season 6",eps:16},{n:7,name:"Season 7",eps:16},{n:8,name:"Season 8",eps:16},{n:9,name:"Season 9",eps:16},{n:10,name:"Season 10",eps:22},{n:11,name:"Season 11",eps:24}] },
  "63174":  { title: "Lucifer",            seasons: [{n:1,name:"Season 1",eps:13},{n:2,name:"Season 2",eps:18},{n:3,name:"Season 3",eps:26},{n:4,name:"Season 4",eps:10},{n:5,name:"Season 5",eps:16},{n:6,name:"Season 6",eps:10}] },
  "76669":  { title: "Elite",              seasons: [{n:1,name:"Season 1",eps:8},{n:2,name:"Season 2",eps:8},{n:3,name:"Season 3",eps:8},{n:4,name:"Season 4",eps:8},{n:5,name:"Season 5",eps:8},{n:6,name:"Season 6",eps:8},{n:7,name:"Season 7",eps:8},{n:8,name:"Season 8",eps:8}] },
  "95557":  { title: "Invincible",         seasons: [{n:1,name:"Season 1",eps:8},{n:2,name:"Season 2",eps:8},{n:3,name:"Season 3",eps:8},{n:4,name:"Season 4",eps:8}] },
  "1429":   { title: "Attack on Titan",    seasons: [{n:1,name:"Season 1",eps:25},{n:2,name:"Season 2",eps:12},{n:3,name:"Season 3",eps:22},{n:4,name:"Season 4",eps:28}] },
  "85937":  { title: "Demon Slayer",       seasons: [{n:1,name:"Season 1",eps:26},{n:2,name:"Season 2",eps:7},{n:3,name:"Season 3",eps:11},{n:4,name:"Season 4",eps:11},{n:5,name:"Season 5",eps:8}] },
  "95479":  { title: "Jujutsu Kaisen",     seasons: [{n:1,name:"Season 1",eps:59}] },
  "37854":  { title: "One Piece",          seasons: [{n:1,name:"Season 1",eps:61},{n:2,name:"Season 2",eps:16},{n:3,name:"Season 3",eps:14},{n:4,name:"Season 4",eps:39},{n:5,name:"Season 5",eps:13},{n:6,name:"Season 6",eps:52},{n:7,name:"Season 7",eps:33},{n:8,name:"Season 8",eps:35},{n:9,name:"Season 9",eps:73},{n:10,name:"Season 10",eps:45},{n:11,name:"Season 11",eps:26},{n:12,name:"Season 12",eps:14},{n:13,name:"Season 13",eps:101},{n:14,name:"Season 14",eps:58},{n:15,name:"Season 15",eps:62},{n:16,name:"Season 16",eps:50},{n:17,name:"Season 17",eps:56},{n:18,name:"Season 18",eps:55},{n:19,name:"Season 19",eps:74},{n:20,name:"Season 20",eps:14},{n:21,name:"Season 21",eps:197},{n:22,name:"Season 22",eps:67},{n:23,name:"Season 23",eps:25}] },
  "93740":  { title: "Foundation",         seasons: [{n:1,name:"Season 1",eps:10},{n:2,name:"Season 2",eps:10},{n:3,name:"Season 3",eps:10}] },
  "88329":  { title: "Hawkeye",            seasons: [{n:1,name:"Season 1",eps:6}] },
  "77169":  { title: "Cobra Kai",          seasons: [{n:1,name:"Season 1",eps:10},{n:2,name:"Season 2",eps:10},{n:3,name:"Season 3",eps:10},{n:4,name:"Season 4",eps:10},{n:5,name:"Season 5",eps:10},{n:6,name:"Season 6",eps:15}] },
  "105971": { title: "Star Wars: The Bad Batch", seasons: [{n:1,name:"Season 1",eps:16},{n:2,name:"Season 2",eps:16},{n:3,name:"Season 3",eps:15}] },
  "90228":  { title: "Dune: Prophecy",     seasons: [{n:1,name:"Season 1",eps:6},{n:2,name:"Season 2",eps:8}] },
  "1418":   { title: "The Big Bang Theory",seasons: [{n:1,name:"Season 1",eps:17},{n:2,name:"Season 2",eps:23},{n:3,name:"Season 3",eps:23},{n:4,name:"Season 4",eps:24},{n:5,name:"Season 5",eps:24},{n:6,name:"Season 6",eps:24},{n:7,name:"Season 7",eps:24},{n:8,name:"Season 8",eps:24},{n:9,name:"Season 9",eps:24},{n:10,name:"Season 10",eps:24},{n:11,name:"Season 11",eps:24},{n:12,name:"Season 12",eps:24}] },
  "209867": { title: "Frieren",            seasons: [{n:1,name:"Season 1",eps:38}] },
};

function openDetailsModal(item) {
  activeModalItem = item;
  const modal = document.getElementById("detailsModal");
  const banner = document.getElementById("modalBanner");
  const title = document.getElementById("modalTitle");
  const meta = document.getElementById("modalMeta");
  const desc = document.getElementById("modalDescription");
  const castList = document.getElementById("modalCastList");
  const genres = document.getElementById("modalGenres");
  const playBtn = document.getElementById("modalPlayBtn");
  const trivia = document.getElementById("modalTrivia");
  const episodesTabBtn = document.querySelector('[data-tab="episodes"]');

  banner.style.backgroundImage = `url('${item.backdrop || item.poster}')`;
  title.innerText = item.title;
  desc.innerText = item.description || "Stream now in 4K Ultra HD and Dolby Atmos.";
  genres.innerText = item.category || "Drama • Action • Prime Original";
  trivia.innerText = item.trivia || "Streamed in master Dolby Vision HDR with multi-channel audio.";

  castList.innerText = item.cast ? item.cast.map(c => c.name).join(", ") : "Prime Video Ensemble";

  meta.innerHTML = `
    <span class="meta-rating"><span>★</span> ${item.rating || '8.5'} IMDb</span>
    <span class="badge-pill">${item.quality || '4K UHD'}</span>
    <span class="badge-pill">${item.type === 'tv' ? 'SERIES' : 'MOVIE'}</span>
    <span>${item.year || ''}</span>
    <span>${item.seasons || (item.type === 'tv' ? 'Series' : 'Movie')}</span>
  `;

  playBtn.onclick = () => {
    closeDetailsModal();
    const firstEp = item.firstEpisode || (item.episodes && item.episodes[0]) || { s: 1, ep: 1, title: 'Episode 1' };
    openPlayer(item, firstEp);
  };

  // Render X-Ray cast
  const castContainer = document.getElementById("xrayCastGrid");
  castContainer.innerHTML = "";
  if (item.cast && item.cast.length > 0) {
    item.cast.forEach(c => {
      const card = document.createElement("div");
      card.className = "cast-card";
      card.innerHTML = `
        <img class="cast-img" src="${c.img || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}" alt="${c.name}">
        <div class="cast-name">${c.name}</div>
        <div class="cast-role">${c.role}</div>
      `;
      castContainer.appendChild(card);
    });
  }

  // Handle TV Episodes Tab vs Movie Presentation
  if (item.type === 'tv') {
    if (episodesTabBtn) episodesTabBtn.style.display = "inline-flex";
    initTvSeasonsAndEpisodes(item);
  } else {
    if (episodesTabBtn) episodesTabBtn.style.display = "none";
  }

  modal.classList.add("active");
  switchModalTab("overview");
}

async function initTvSeasonsAndEpisodes(item) {
  const seasonsRail = document.getElementById("seasonsRail");
  const countBadge = document.getElementById("seasonsCountBadge");
  const epContainer = document.getElementById("episodesList");
  const loading = document.getElementById("episodesLoading");

  seasonsRail.innerHTML = "";
  epContainer.innerHTML = "";
  loading.style.display = "flex";

  // ─── STEP 1: Instant render from built-in database (works on ALL deployments) ───
  const builtIn = TV_CATALOG_DB[item.id];
  let seasons = [];

  if (builtIn && builtIn.seasons && builtIn.seasons.length > 0) {
    // Map compact format to full season objects
    seasons = builtIn.seasons.map(s => ({
      season_number: s.n,
      name: s.name,
      episode_count: s.eps
    }));
    loading.style.display = "none";
    countBadge.innerText = `${seasons.length} ${seasons.length === 1 ? 'season' : 'seasons'} available`;
    _renderSeasonPills(item, seasons, seasonsRail);
    currentActiveSeasonNumber = seasons[0].season_number;
    await loadSeasonEpisodes(item, seasons[0].season_number, seasons[0].episode_count);
  } else {
    // ─── STEP 2: Try API for unknown series ───
    try {
      let seriesData = tvSeriesCache[item.id];
      if (!seriesData) {
        let res;
        try { res = await Promise.race([
          fetch(`/api/tv?id=${item.id}`),
          fetch(`https://api.framextv.tech/api/tv/${item.id}`, { headers: { 'User-Agent':'Mozilla/5.0','Referer':'https://framextv.cc/' } })
        ]); } catch(e) { res = null; }
        if (res && res.ok) {
          seriesData = await res.json();
          tvSeriesCache[item.id] = seriesData;
        }
      }

      if (seriesData && seriesData.seasons) {
        seasons = seriesData.seasons.filter(s => s.season_number > 0 && (s.episode_count || 0) >= 0)
          .map(s => ({ season_number: s.season_number, name: s.name, episode_count: s.episode_count || 8 }));
      }

      if (seasons.length === 0) {
        seasons = [{ season_number: 1, name: "Season 1", episode_count: 8 }];
      }

      loading.style.display = "none";
      countBadge.innerText = `${seasons.length} ${seasons.length === 1 ? 'season' : 'seasons'} available`;
      _renderSeasonPills(item, seasons, seasonsRail);
      currentActiveSeasonNumber = seasons[0].season_number;
      await loadSeasonEpisodes(item, seasons[0].season_number, seasons[0].episode_count || 8);

    } catch (err) {
      console.error("[TV Engine] API failed:", err);
      loading.style.display = "none";
      seasons = [{ season_number: 1, name: "Season 1", episode_count: 8 }];
      countBadge.innerText = "1 season available";
      _renderSeasonPills(item, seasons, seasonsRail);
      renderFallbackEpisodes(item, epContainer);
    }
  }
}

function _renderSeasonPills(item, seasons, container) {
  container.innerHTML = "";
  seasons.forEach((s, idx) => {
    const pill = document.createElement("button");
    pill.className = `season-pill ${idx === 0 ? 'active' : ''}`;
    pill.dataset.season = s.season_number;
    const countText = s.episode_count ? `(${s.episode_count})` : '';
    pill.innerHTML = `${s.name || `Season ${s.season_number}`} <span style="font-size: 11px; opacity: 0.8;">${countText}</span>`;
    pill.onclick = () => {
      container.querySelectorAll(".season-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      currentActiveSeasonNumber = s.season_number;
      loadSeasonEpisodes(item, s.season_number, s.episode_count || 8);
    };
    container.appendChild(pill);
  });
}

async function loadSeasonEpisodes(item, seasonNumber, expectedEpisodeCount = 8) {
  const epContainer = document.getElementById("episodesList");
  const loading = document.getElementById("episodesLoading");

  epContainer.innerHTML = "";
  loading.style.display = "flex";

  const cacheKey = `${item.id}_s${seasonNumber}`;

  try {
    let seasonData = tvSeasonEpisodesCache[cacheKey];
    if (!seasonData) {
      let res = await fetch(`/api/tv?id=${item.id}&season=${seasonNumber}`);
      if (!res.ok || res.status === 404) {
        res = await fetch(`/api/tv/${item.id}/season/${seasonNumber}`);
      }
      if (res.ok) {
        seasonData = await res.json();
        if (seasonData && (seasonData.episodes || seasonData.name)) {
          tvSeasonEpisodesCache[cacheKey] = seasonData;
        }
      }
    }

    loading.style.display = "none";
    let episodes = (seasonData && seasonData.episodes && seasonData.episodes.length > 0)
      ? seasonData.episodes
      : [];

    // Fallback: Generate full season episodes if upstream returned empty so user is never blocked
    if (episodes.length === 0) {
      const count = expectedEpisodeCount || 8;
      episodes = [];
      for (let i = 1; i <= count; i++) {
        episodes.push({
          episode_number: i,
          season_number: seasonNumber,
          name: `Chapter ${i}: Episode ${i}`,
          overview: `Stream ${item.title} Season ${seasonNumber} Episode ${i} in 4K Ultra HD and Dolby Atmos.`,
          vote_average: 8.5
        });
      }
    }

    if (seasonNumber === 1 && episodes.length > 0) {
      item.firstEpisode = {
        s: seasonNumber,
        ep: episodes[0].episode_number || episodes[0].number || 1,
        title: episodes[0].name || 'Episode 1'
      };
    }

    episodes.forEach(ep => {
      const epNum = ep.episode_number || ep.number || 1;
      const epTitle = ep.name || `Episode ${epNum}`;
      const epAirDate = ep.air_date ? ep.air_date : '';
      const epRating = ep.vote_average ? Number(ep.vote_average).toFixed(1) : '';
      const epDesc = ep.overview || `Now streaming ${item.title} Season ${seasonNumber} Episode ${epNum} in 4K Ultra HD.`;
      const epThumb = ep.still || ep.still_path || item.backdrop || item.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80';

      const card = document.createElement("div");
      card.className = "ep-card";
      card.tabIndex = 0;

      card.onclick = () => {
        closeDetailsModal();
        openPlayer(item, {
          s: seasonNumber,
          ep: epNum,
          title: epTitle
        });
      };

      card.innerHTML = `
        <div class="ep-thumb-wrap">
          <img class="ep-thumb" src="${epThumb}" alt="EP ${epNum}" loading="lazy" onerror="this.src='${item.backdrop || item.poster}'">
          <div class="ep-badge">EP ${epNum}</div>
          <div class="ep-play-overlay">
            <div class="ep-play-circle">▶</div>
          </div>
        </div>
        <div class="ep-info">
          <div class="ep-title-row">
            <span class="ep-title">${epNum}. ${epTitle}</span>
          </div>
          <div class="ep-meta-row">
            ${epAirDate ? `<span>📅 ${epAirDate}</span>` : ''}
            ${epRating ? `<span class="ep-rating">★ ${epRating}</span>` : ''}
            <span>HD • 5.1</span>
          </div>
          <div class="ep-desc">${epDesc}</div>
        </div>
        <button class="ep-play-btn" onclick="event.stopPropagation(); closeDetailsModal(); openPlayer(activeModalItem, { s: ${seasonNumber}, ep: ${epNum}, title: '${epTitle.replace(/'/g, "\\'")}' });">
          ▶ Play
        </button>
      `;

      epContainer.appendChild(card);
    });

  } catch (err) {
    console.error(`[TV Season] Error loading Season ${seasonNumber}:`, err);
  }
}

function renderFallbackEpisodes(item, container, seasonNumber = 1) {
  container.innerHTML = "";
  const eps = (item.episodes && item.episodes.length > 0) ? item.episodes : [
    { ep: 1, s: seasonNumber, title: `Season ${seasonNumber} Premiere`, desc: item.description || "Season premiere." },
    { ep: 2, s: seasonNumber, title: `Episode 2`, desc: "Episode 2 presentation in 4K Ultra HD." },
    { ep: 3, s: seasonNumber, title: `Episode 3`, desc: "Episode 3 presentation in 4K Ultra HD." },
    { ep: 4, s: seasonNumber, title: `Episode 4`, desc: "Episode 4 presentation in 4K Ultra HD." }
  ];

  eps.forEach(ep => {
    const card = document.createElement("div");
    card.className = "ep-card";
    card.tabIndex = 0;
    card.onclick = () => {
      closeDetailsModal();
      openPlayer(item, { s: ep.s || seasonNumber, ep: ep.ep, title: ep.title });
    };
    card.innerHTML = `
      <div class="ep-thumb-wrap">
        <img class="ep-thumb" src="${item.backdrop || item.poster}" alt="EP ${ep.ep}">
        <div class="ep-badge">EP ${ep.ep}</div>
        <div class="ep-play-overlay">
          <div class="ep-play-circle">▶</div>
        </div>
      </div>
      <div class="ep-info">
        <div class="ep-title-row">
          <span class="ep-title">${ep.ep}. ${ep.title}</span>
        </div>
        <div class="ep-desc">${ep.desc || item.description || ''}</div>
      </div>
      <button class="ep-play-btn">▶ Play</button>
    `;
    container.appendChild(card);
  });
}


function closeDetailsModal() {
  document.getElementById("detailsModal").classList.remove("active");
  activeModalItem = null;
}

function switchModalTab(tabId) {
  document.querySelectorAll(".modal-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });
  document.querySelectorAll(".modal-tab-content").forEach(content => {
    content.classList.toggle("active", content.id === `tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
  });
}

function toggleWatchlist(item, btnEl) {
  if (!item) return;
  if (watchlist.has(item.id)) {
    watchlist.delete(item.id);
    _saveWatchlist();
    showToast('🗑️', `Removed "${item.title}" from My List`, 'warning');
  } else {
    watchlist.add(item.id);
    _saveWatchlist();
    showToast('❤️', `Added "${item.title}" to My List`, 'success');
    if (btnEl) {
      btnEl.classList.add('pop');
      setTimeout(() => btnEl.classList.remove('pop'), 400);
    }
  }
  // Update all heart buttons for this item across the page
  document.querySelectorAll(`.card-watchlist-btn[data-id="${item.id}"]`).forEach(b => {
    b.classList.toggle('in-list', watchlist.has(item.id));
    b.title = watchlist.has(item.id) ? 'Remove from My List' : 'Add to My List';
  });
  // Update modal watchlist button if open
  const modalBtn = document.getElementById('modalWatchlistBtn');
  if (modalBtn && activeModalItem?.id === item.id) {
    modalBtn.innerHTML = watchlist.has(item.id) ? '<span>❤️</span>' : '<span>+</span>';
  }
  refreshMyListRow();
}

// ==========================================================================
// DEDICATED PRIME VIDEO THEATRE PLAYER (DIRECT CLEAN EMBED STREAM)
// ==========================================================================

function openPlayer(item, episode = null) {
  currentPlayingItem = item;
  currentPlayingEpisode = episode || (item.episodes ? item.episodes[0] : null);

  activeServerIndex = 0;

  const playerView = document.getElementById("playerView");
  const nameLabel = document.getElementById("playerMovieName");
  const subLabel = document.getElementById("playerMovieSub");

  nameLabel.innerText = item.title;
  if (item.type === "tv") {
    const s = currentPlayingEpisode?.s || 1;
    const e = currentPlayingEpisode?.ep || 1;
    subLabel.innerText = `Season ${s} • Episode ${e}: ${currentPlayingEpisode?.title || ''}`;
  } else {
    subLabel.innerText = `${item.year} • ${item.seasons} • ${item.quality}`;
  }

  loadStreamUrl();
  playerView.classList.add('active');
  showPlayerHud();
  startFailoverTimer();
}

function loadStreamUrl() {
  const iframe = document.getElementById("theatreIframe");
  const item = currentPlayingItem;
  if (!item) return;

  const s = currentPlayingEpisode?.s || 1;
  const e = currentPlayingEpisode?.ep || 1;

  const server = SERVERS[activeServerIndex] || SERVERS[0];
  const streamUrl = server.buildUrl(item.type, item.id, s, e);

  console.log(`[Prime Stream] ${item.title} → ${server.name}`);
  iframe.src = streamUrl;

  // Keep dropdown in sync
  const sel = document.getElementById("serverSelect");
  if (sel) sel.selectedIndex = activeServerIndex;
}

function switchServer(index) {
  activeServerIndex = index;
  loadStreamUrl();
  stopFailoverTimer();
  startFailoverTimer();
  const badge = document.getElementById('failoverBadge');
  if (badge) badge.classList.remove('visible');
}

function closePlayer() {
  stopFailoverTimer();
  const playerView = document.getElementById('playerView');
  const iframe = document.getElementById('theatreIframe');
  // Save ~30% placeholder progress when closing (real tracking would need iframe postMessage)
  if (currentPlayingItem) {
    saveWatchProgress(currentPlayingItem, currentPlayingEpisode, 35);
  }
  iframe.src = 'about:blank';
  playerView.classList.remove('active');
  currentPlayingItem = null;
  currentPlayingEpisode = null;
}

function setupPlayerHudInteraction() {
  const playerView = document.getElementById("playerView");
  const hud = document.getElementById("playerHud");

  playerView.addEventListener("mousemove", () => {
    showPlayerHud();
  });
}

function showPlayerHud() {
  const hud = document.getElementById("playerHud");
  hud.classList.remove("autohide");
  clearTimeout(hudTimeout);
  hudTimeout = setTimeout(() => {
    hud.classList.add("autohide");
  }, 3500);
}

function togglePlayerFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

// ==========================================================================
// SEARCH & CATEGORY FILTERING
// ==========================================================================

// ==========================================================================
// HOME ENDLESS DISCOVER CATALOG (CONTINUOUS INFINITE DROP SCROLLER)
// ==========================================================================

let homeEndlessFilter = "all";
let homeEndlessPage = 1;
let homeEndlessIsLoading = false;
let homeEndlessHasMore = true;
let homeEndlessSeenIds = new Set();
let isHomeInfiniteScrollAttached = false;

function getHomeEndlessEndpoint(filter, page) {
  if (filter === "movie") return `/api/movies?page=${page}`;
  if (filter === "tv")    return `/api/tv?page=${page}`;
  if (filter === "anime") return `/api/anime?page=${page}`;
  return `/api/discover?page=${page}`;
}

let homeEndlessObserver = null;

async function initHomeEndlessCatalog(filter = "all", reset = false) {
  homeEndlessFilter = filter;
  if (reset) {
    homeEndlessPage = 1;
    homeEndlessHasMore = true;
    homeEndlessIsLoading = false;
    homeEndlessSeenIds = new Set();
    const grid = document.getElementById("homeEndlessGrid");
    if (grid) grid.innerHTML = "";
  }

  setupHomeInfiniteScroll();
  await loadNextHomeEndlessBatch(2);
}

async function loadNextHomeEndlessBatch(batchCount = 2) {
  if (homeEndlessIsLoading || !homeEndlessHasMore) return;
  homeEndlessIsLoading = true;

  const loader = document.getElementById("homeEndlessLoader");
  const loadMoreBtn = document.getElementById("homeLoadMoreBtn");
  if (loader) loader.style.display = "flex";
  if (loadMoreBtn) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.innerText = "Loading more titles from catalog…";
  }

  const startPage = homeEndlessPage;
  const pagePromises = [];
  for (let i = 0; i < batchCount; i++) {
    const pageNum = startPage + i;
    const url = getHomeEndlessEndpoint(homeEndlessFilter, pageNum);
    pagePromises.push(
      fetchApiJson(url).then(data => ({ pageNum, data })).catch(err => {
        console.warn(`[HomeEndless] Page ${pageNum} error:`, err);
        return { pageNum, data: null };
      })
    );
  }

  try {
    const settled = await Promise.all(pagePromises);
    const grid = document.getElementById("homeEndlessGrid");
    const countEl = document.getElementById("endlessDiscoverCount");

    for (const res of settled) {
      if (!res.data) continue;
      const results = extractRailResults(res.data);
      if (results && results.length > 0) {
        results.forEach(raw => {
          const item = formatSearchResult(raw, raw.type === "tv" ? "badge-netflix" : "badge-prime", raw.type === "tv" ? "TV" : "MOVIE");
          if (item && item.id && !homeEndlessSeenIds.has(item.id)) {
            homeEndlessSeenIds.add(item.id);
            if (grid) grid.appendChild(createStandardCard(item));
          }
        });
      }

      if (res.data.totalPages && res.pageNum >= res.data.totalPages) {
        homeEndlessHasMore = false;
      }
    }

    homeEndlessPage += batchCount;

    let catalogLabel = "20,000+ Available";
    if (homeEndlessFilter === "anime") catalogLabel = "5,000+ Available";
    else if (homeEndlessFilter === "all") catalogLabel = "50,000+ Available";

    if (countEl) countEl.innerText = `${homeEndlessSeenIds.size.toLocaleString()}+`;

    if (loadMoreBtn) {
      loadMoreBtn.disabled = false;
      if (homeEndlessHasMore) {
        loadMoreBtn.innerText = `Load More Titles (${catalogLabel}) ▾`;
      } else {
        loadMoreBtn.innerText = `All ${homeEndlessSeenIds.size.toLocaleString()} Titles Loaded`;
      }
    }
  } catch (err) {
    console.warn("[HomeEndless] Batch fetch error:", err);
  } finally {
    homeEndlessIsLoading = false;
    if (loader) loader.style.display = "none";
    if (loadMoreBtn && loadMoreBtn.disabled) loadMoreBtn.disabled = false;
  }
}
window.loadNextHomeEndlessBatch = loadNextHomeEndlessBatch;

async function loadNextHomeEndlessPage() {
  return loadNextHomeEndlessBatch(2);
}

function setupHomeInfiniteScroll() {
  const loader = document.getElementById("homeEndlessLoader");
  const loadMoreBtn = document.getElementById("homeLoadMoreBtn");

  if (!homeEndlessObserver && "IntersectionObserver" in window) {
    homeEndlessObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const viewAllPage = document.getElementById("viewAllPage");
          if ((!viewAllPage || viewAllPage.style.display === "none") && !homeEndlessIsLoading && homeEndlessHasMore) {
            loadNextHomeEndlessBatch(2);
          }
        }
      }
    }, {
      root: null,
      rootMargin: "900px 0px",
      threshold: 0
    });
  }

  if (homeEndlessObserver) {
    if (loader) homeEndlessObserver.observe(loader);
    if (loadMoreBtn) homeEndlessObserver.observe(loadMoreBtn);
  }

  if (isHomeInfiniteScrollAttached) return;
  isHomeInfiniteScrollAttached = true;

  window.addEventListener("scroll", () => {
    // Only trigger if Home screen is visible
    const viewAllPage = document.getElementById("viewAllPage");
    if (viewAllPage && viewAllPage.style.display !== "none") return;

    const scrollBottom = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    // Trigger next page when 900px from bottom of the page
    if (scrollBottom >= documentHeight - 900) {
      if (!homeEndlessIsLoading && homeEndlessHasMore) {
        loadNextHomeEndlessBatch(2);
      }
    }
  }, { passive: true });
}

function switchCategory(cat) {
  // If user is currently on the fullpage All Shows & Movies page:
  const viewAllPage = document.getElementById("viewAllPage");
  if (viewAllPage && viewAllPage.style.display !== "none") {
    if (cat === "movie") {
      filterViewAllType("movie");
      return;
    } else if (cat === "tv") {
      filterViewAllType("tv");
      return;
    } else if (cat === "anime") {
      filterViewAllType("anime");
      return;
    } else if (cat === "all") {
      filterViewAllType("all");
      return;
    } else {
      closeViewAllPage();
    }
  }

  // Sync top navigation bar
  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.cat === cat);
  });

  // Sync channels pill selector
  document.querySelectorAll(".channel-pill").forEach(pill => {
    pill.classList.toggle("active", pill.dataset.channel === cat);
  });

  const rowSearch = document.getElementById("rowSearch");
  if (rowSearch) rowSearch.style.display = "none";

  const rowTrending = document.getElementById("rowTrending");
  const rowPopularMovies = document.getElementById("rowPopularMovies");
  const rowPopularTV = document.getElementById("rowPopularTV");
  const rowNetflix = document.getElementById("rowNetflix");
  const rowHotstar = document.getElementById("rowHotstar");
  const rowOriginals = document.getElementById("rowOriginals");
  const rowMax = document.getElementById("rowMax");
  const rowAnime = document.getElementById("rowAnime");
  const rowNewReleases = document.getElementById("rowNewReleases");
  const rowAction = document.getElementById("rowAction");
  const rowComedy = document.getElementById("rowComedy");
  const rowLive = document.getElementById("rowLive");
  const rowEndless = document.getElementById("rowEndlessDiscover");
  const endlessTitle = document.getElementById("endlessSectionTitle");
  const endlessSub = document.getElementById("endlessSectionSubtitle");

  const allRows = [rowTrending, rowPopularMovies, rowPopularTV, rowNetflix, rowHotstar, rowOriginals, rowMax, rowAnime, rowNewReleases, rowAction, rowComedy, rowLive].filter(Boolean);

  if (rowEndless) rowEndless.style.display = "flex";

  if (cat === "all") {
    allRows.forEach(r => r.style.display = "flex");
    if (endlessTitle) endlessTitle.innerText = "Explore All Titles — Movies, Series & Anime";
    if (endlessSub) endlessSub.innerText = "Continuous streaming catalog — scroll down to explore endless blockbusters and episodes";
    initHomeEndlessCatalog("all", true);
    renderBillboard(currentHeroItem || CATALOG[0]);
  } else if (cat === "movie") {
    allRows.forEach(r => r.style.display = "none");
    if (rowTrending) rowTrending.style.display = "flex";
    if (rowPopularMovies) rowPopularMovies.style.display = "flex";
    if (rowNewReleases) rowNewReleases.style.display = "flex";
    if (rowAction) rowAction.style.display = "flex";
    if (rowComedy) rowComedy.style.display = "flex";
    if (endlessTitle) endlessTitle.innerText = "All Movies — Blockbusters & Feature Films (20,000+)";
    if (endlessSub) endlessSub.innerText = "Scroll down to browse the complete cinematic catalog";
    initHomeEndlessCatalog("movie", true);
    if (CATALOG[3]) renderBillboard(CATALOG[3]); // Dune 2
  } else if (cat === "tv") {
    allRows.forEach(r => r.style.display = "none");
    if (rowPopularTV) rowPopularTV.style.display = "flex";
    if (rowNetflix) rowNetflix.style.display = "flex";
    if (rowHotstar) rowHotstar.style.display = "flex";
    if (rowOriginals) rowOriginals.style.display = "flex";
    if (rowMax) rowMax.style.display = "flex";
    if (rowAnime) rowAnime.style.display = "flex";
    if (endlessTitle) endlessTitle.innerText = "All TV Series — Binge-Worthy Shows & Seasons (20,000+)";
    if (endlessSub) endlessSub.innerText = "Scroll down to explore all television series and seasons";
    initHomeEndlessCatalog("tv", true);
    if (CATALOG[0]) renderBillboard(CATALOG[0]); // Fallout
  } else if (cat === "anime") {
    allRows.forEach(r => r.style.display = "none");
    if (rowAnime) {
      rowAnime.style.display = "flex";
      rowAnime.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (endlessTitle) endlessTitle.innerText = "All Anime — Top Series, Movies & OVAs";
    if (endlessSub) endlessSub.innerText = "Continuous stream of Japanese animation, shonen, and simulcasts";
    initHomeEndlessCatalog("anime", true);
  } else if (cat === "netflix") {
    allRows.forEach(r => r.style.display = "none");
    if (rowNetflix) {
      rowNetflix.style.display = "flex";
      rowNetflix.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (endlessTitle) endlessTitle.innerText = "More Trending Content";
    initHomeEndlessCatalog("all", false);
    if (PLATFORM_SHOWS.netflix[0]) renderBillboard(PLATFORM_SHOWS.netflix[0]);
  } else if (cat === "hotstar") {
    allRows.forEach(r => r.style.display = "none");
    if (rowHotstar) {
      rowHotstar.style.display = "flex";
      rowHotstar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (endlessTitle) endlessTitle.innerText = "More Trending Content";
    initHomeEndlessCatalog("all", false);
    if (PLATFORM_SHOWS.hotstar[0]) renderBillboard(PLATFORM_SHOWS.hotstar[0]);
  } else if (cat === "prime") {
    allRows.forEach(r => r.style.display = "none");
    if (rowOriginals) {
      rowOriginals.style.display = "flex";
      rowOriginals.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (endlessTitle) endlessTitle.innerText = "More Trending Content";
    initHomeEndlessCatalog("all", false);
    renderBillboard(CATALOG[0]);
  } else if (cat === "max") {
    allRows.forEach(r => r.style.display = "none");
    if (rowMax) {
      rowMax.style.display = "flex";
      rowMax.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (endlessTitle) endlessTitle.innerText = "More Trending Content";
    initHomeEndlessCatalog("all", false);
    if (PLATFORM_SHOWS.max[0]) renderBillboard(PLATFORM_SHOWS.max[0]);
  } else if (cat === "mylist") {
    allRows.forEach(r => r.style.display = "none");
    if (rowEndless) rowEndless.style.display = "none";
    const rowMyList = document.getElementById("rowMyList");
    if (rowMyList) {
      rowMyList.style.display = "flex";
      rowMyList.classList.add("has-items");
      refreshMyListRow();
      rowMyList.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const myItems = getAllKnownItems().filter(i => watchlist.has(i.id));
    if (myItems[0]) renderBillboard(myItems[0]);
    else showToast('❤️', 'Your Watchlist is empty. Tap ♡ on any title to add!', 'warning');
  }
}

let searchDebounceTimer = null;
let currentDropdownItems = [];

function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchDropdown = document.getElementById("searchDropdown");
  const searchContainer = document.getElementById("searchBoxContainer");

  // Show dropdown when focused or clicked
  searchInput.addEventListener("focus", () => {
    const q = searchInput.value.trim();
    if (!q) {
      renderDropdownTrending();
    } else {
      performLiveSearch(q);
    }
  });

  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.trim();
    clearTimeout(searchDebounceTimer);

    if (!q) {
      renderDropdownTrending();
      const rowSearch = document.getElementById("rowSearch");
      if (rowSearch) rowSearch.style.display = "none";
      return;
    }

    // Show instant searching placeholder in dropdown
    searchDropdown.style.display = "flex";
    searchDropdown.innerHTML = `
      <div class="dropdown-header">
        <span>Recommendations for "${q}"</span>
      </div>
      <div class="search-spinner" style="padding: 16px;">
        <div class="spinner-icon"></div>
        <span>Searching Prime Video catalog...</span>
      </div>
    `;

    searchDebounceTimer = setTimeout(() => {
      performLiveSearch(q);
    }, 280);
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      clearTimeout(searchDebounceTimer);
      const q = searchInput.value.trim();
      if (q) performLiveSearch(q);
    } else if (e.key === "ArrowDown") {
      const firstItem = searchDropdown.querySelector(".dropdown-item");
      if (firstItem) {
        firstItem.focus();
        e.preventDefault();
      }
    } else if (e.key === "Escape") {
      closeSearchDropdown();
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (searchContainer && !searchContainer.contains(e.target)) {
      closeSearchDropdown();
    }
  });
}

function closeSearchDropdown() {
  const searchDropdown = document.getElementById("searchDropdown");
  if (searchDropdown) searchDropdown.style.display = "none";
}

function renderDropdownTrending() {
  const searchDropdown = document.getElementById("searchDropdown");
  if (!searchDropdown) return;

  searchDropdown.style.display = "flex";
  searchDropdown.innerHTML = `
    <div class="dropdown-header">
      <span>Popular on Prime Video</span>
      <span style="font-size: 11px; cursor: pointer; color: var(--text-muted);" onclick="closeSearchDropdown()">✕</span>
    </div>
  `;

  CATALOG.slice(0, 5).forEach((item, idx) => {
    const row = createDropdownItemElement(item, idx);
    searchDropdown.appendChild(row);
  });
}

async function performLiveSearch(q) {
  const searchDropdown = document.getElementById("searchDropdown");
  const rowSearch = document.getElementById("rowSearch");
  const searchGrid = document.getElementById("searchGrid");
  const searchQueryLabel = document.getElementById("searchQueryLabel");

  searchDropdown.style.display = "flex";

  // First check local catalog for instant matches
  const localMatches = CATALOG.filter(item => 
    item.title.toLowerCase().includes(q.toLowerCase())
  );

  try {
    const data = await fetchApiJson(`/api/search?q=${encodeURIComponent(q)}`);
    if (!data) throw new Error("Search API request returned no results");
    
    const rawList = Array.isArray(data) ? data : (data.results || data.items || []);
    let items = rawList.map(d => formatSearchResult(d));

    // Merge any unique local matches
    localMatches.forEach(lm => {
      if (!items.some(i => i.id === lm.id)) items.unshift(lm);
    });

    currentDropdownItems = items;
    renderDropdownResults(items, q);
    renderGridResults(items, q);
  } catch (err) {
    console.warn("[Prime Search] Remote fallback to local:", err);
    currentDropdownItems = localMatches;
    renderDropdownResults(localMatches, q);
    renderGridResults(localMatches, q);
  }
}

function renderDropdownResults(items, q) {
  const searchDropdown = document.getElementById("searchDropdown");
  if (!searchDropdown) return;

  searchDropdown.innerHTML = "";

  if (!items || items.length === 0) {
    searchDropdown.innerHTML = `
      <div class="dropdown-header">
        <span>No Matches Found</span>
        <span style="cursor: pointer;" onclick="closeSearchDropdown()">✕</span>
      </div>
      <div class="dropdown-empty">
        No titles found for "<strong>${q}</strong>". Try searching for another movie, TV show, or actor.
      </div>
    `;
    return;
  }

  const header = document.createElement("div");
  header.className = "dropdown-header";
  header.innerHTML = `
    <span>Top Matches (${items.length})</span>
    <span style="cursor: pointer; font-size: 11px; text-transform: none; color: var(--text-secondary);" onclick="closeSearchDropdown()">Close ✕</span>
  `;
  searchDropdown.appendChild(header);

  // Render top 7 matches in dropdown list
  items.slice(0, 7).forEach((item, idx) => {
    const row = createDropdownItemElement(item, idx);
    searchDropdown.appendChild(row);
  });
}

function createDropdownItemElement(item, idx) {
  const row = document.createElement("div");
  row.className = "dropdown-item";
  row.tabIndex = 0;

  row.onclick = () => {
    closeSearchDropdown();
    openDetailsModal(item);
  };

  row.onkeydown = (e) => {
    if (e.key === "Enter") {
      closeSearchDropdown();
      openDetailsModal(item);
    } else if (e.key === "ArrowDown") {
      const next = row.nextElementSibling;
      if (next && next.classList.contains("dropdown-item")) {
        next.focus();
        e.preventDefault();
      }
    } else if (e.key === "ArrowUp") {
      const prev = row.previousElementSibling;
      if (prev && prev.classList.contains("dropdown-item")) {
        prev.focus();
      } else {
        document.getElementById("searchInput").focus();
      }
      e.preventDefault();
    } else if (e.key === "Escape") {
      closeSearchDropdown();
    }
  };

  const thumbImg = item.poster || item.backdrop || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=200&q=80";

  row.innerHTML = `
    <img class="dropdown-thumb" src="${thumbImg}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=200&q=80'">
    <div class="dropdown-meta">
      <div class="dropdown-title">${item.title}</div>
      <div class="dropdown-sub">
        <span class="tag">${item.type}</span>
        <span>★ ${item.rating}</span>
        <span>${item.year}</span>
      </div>
    </div>
    <button class="dropdown-play-btn" onclick="event.stopPropagation(); closeSearchDropdown(); openPlayer(currentDropdownItems[${idx}] || CATALOG[0]);">
      ▶ Watch
    </button>
  `;
  return row;
}

function renderGridResults(items, q) {
  const rowSearch = document.getElementById("rowSearch");
  const searchGrid = document.getElementById("searchGrid");
  const searchQueryLabel = document.getElementById("searchQueryLabel");

  if (!rowSearch || !searchGrid) return;

  rowSearch.style.display = "flex";
  
  // Safely hide all other rows while searching
  const rowsToHide = [
    document.getElementById("rowTop10"),
    document.getElementById("rowNetflix"),
    document.getElementById("rowHotstar"),
    document.getElementById("rowOriginals"),
    document.getElementById("rowMax"),
    document.getElementById("rowTV"),
    document.getElementById("rowAction"),
    document.getElementById("rowAnime"),
    document.getElementById("rowLive")
  ].filter(Boolean);
  rowsToHide.forEach(r => r.style.display = "none");

  searchQueryLabel.innerText = `for "${q}"`;
  searchGrid.innerHTML = "";

  if (items && items.length > 0) {
    renderBillboard(items[0]);

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "search-card";
      card.tabIndex = 0;
      card.onclick = () => openDetailsModal(item);

      card.innerHTML = `
        <div class="card-thumb-wrapper">
          <img class="card-thumb" src="${item.backdrop || item.poster || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=640&q=80'}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=640&q=80'">
          <div class="card-prime-badge ${item.platformClass || 'badge-prime'}">${item.platformLabel || 'PRIME'}</div>
          <div class="card-quality-badge">${item.quality}</div>
        </div>
        <div class="card-info">
          <div class="card-title">${item.title}</div>
          <div class="card-sub">
            <span>★ ${item.rating}</span>
            <span>${item.year}</span>
            <span style="text-transform: uppercase; font-size: 10px; background: rgba(255,255,255,0.1); padding: 1px 4px; border-radius: 2px;">${item.type}</span>
          </div>
        </div>
      `;
      searchGrid.appendChild(card);
    });
  }
}

function formatSearchResult(d, defaultPlatformClass = "badge-prime", defaultPlatformLabel = "PRIME") {
  const isTv = d.type === "tv";
  const validBackdrop = d.backdrop && !d.backdrop.includes("placeholder") ? d.backdrop : null;
  const validPoster = d.poster && !d.poster.includes("placeholder") ? d.poster : (d.image && !d.image.includes("placeholder") ? d.image : null);
  const fallbackImg = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1280&q=80";

  return {
    id: String(d.id),
    title: d.title || d.name || "Untitled",
    type: isTv ? "tv" : "movie",
    year: d.year || (d.release_date ? d.release_date.substring(0, 4) : (d.first_air_date ? d.first_air_date.substring(0, 4) : "2024")),
    rating: d.rating && d.rating !== "N/A" ? String(d.rating) : "8.0",
    quality: "4K UHD",
    category: isTv ? "TV Series • Multi-Platform" : "Feature Film • 4K UHD",
    badge: d.badge || "INCLUDED WITH PRIME",
    platformClass: d.platformClass || defaultPlatformClass,
    platformLabel: d.platformLabel || defaultPlatformLabel,
    backdrop: validBackdrop || validPoster || fallbackImg,
    poster: validPoster || validBackdrop || fallbackImg,
    description: d.overview || "Now streaming in 4K Ultra HD and Dolby Atmos.",
    seasons: isTv ? (d.seasons || "Series") : (d.year || "Movie"),
    trivia: "Available with multi-language subtitle tracks and master audio.",
    episodes: isTv ? [
      { ep: 1, s: 1, title: "Episode 1", duration: "52m", desc: d.overview || "Episode 1 presentation." },
      { ep: 2, s: 1, title: "Episode 2", duration: "48m", desc: "Episode 2 presentation." }
    ] : [
      { ep: 1, s: 1, title: "Full Feature Presentation", duration: "Feature Film", desc: d.overview || "Full Movie" }
    ]
  };
}

function clearSearch() {
  const searchInput = document.getElementById("searchInput");
  const rowSearch = document.getElementById("rowSearch");
  if (searchInput) searchInput.value = "";
  if (rowSearch) rowSearch.style.display = "none";
  closeSearchDropdown();
  switchCategory("all");
}

function setupScrollListener() {
  const header = document.getElementById("primeHeader");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

// ==========================================================================
// TV REMOTE (D-PAD) & KEYBOARD ACCESSIBILITY
// ==========================================================================

function setupTVNavigation() {
  window.addEventListener("keydown", (e) => {
    const activeModal = document.getElementById("detailsModal").classList.contains("active");
    const activePlayer = document.getElementById("playerView").classList.contains("active");

    if (e.key === "Escape" || e.key === "Backspace") {
      if (document.activeElement.tagName === "INPUT") return;
      if (activePlayer) {
        closePlayer();
        e.preventDefault();
      } else if (activeModal) {
        closeDetailsModal();
        e.preventDefault();
      } else if (document.getElementById("viewAllPage") && document.getElementById("viewAllPage").style.display !== "none") {
        closeViewAllPage();
        e.preventDefault();
      }
      return;
    }

    if (activePlayer) {
      showPlayerHud();
    }

    if (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "ArrowDown" || e.key === "ArrowUp") {
      const focusable = Array.from(document.querySelectorAll(
        "button, .movie-card, .top10-card, .nav-item, input, select"
      )).filter(el => el.offsetParent !== null);

      const currentIndex = focusable.indexOf(document.activeElement);
      if (currentIndex === -1) {
        if (focusable.length > 0) focusable[0].focus();
        return;
      }

      if (e.key === "ArrowRight") {
        const next = focusable[currentIndex + 1];
        if (next) { next.focus(); e.preventDefault(); }
      } else if (e.key === "ArrowLeft") {
        const prev = focusable[currentIndex - 1];
        if (prev) { prev.focus(); e.preventDefault(); }
      }
    }
  });
}


// ==========================================================================
// TOAST NOTIFICATION SYSTEM
// ==========================================================================

let _toastTimer = null;
function showToast(icon, msg, type = '') {
  const toast = document.getElementById('primeToast');
  const iconEl = document.getElementById('primeToastIcon');
  const msgEl  = document.getElementById('primeToastMsg');
  if (!toast) return;
  if (iconEl) iconEl.textContent = icon;
  if (msgEl)  msgEl.textContent  = msg;
  toast.className = 'prime-toast' + (type ? ' toast-' + type : '');
  // Force reflow to restart animation
  toast.offsetHeight;
  toast.classList.add('visible');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
}

// ==========================================================================
// CONTINUE WATCHING ROW
// ==========================================================================

function initContinueWatchingRow() {
  refreshContinueRow();
}

function refreshContinueRow() {
  const items = _loadContinueItems();
  const row   = document.getElementById('rowContinueWatching');
  const scroller = document.getElementById('scrollerContinue');
  if (!row || !scroller) return;

  if (!items || items.length === 0) {
    row.classList.remove('has-items');
    return;
  }
  row.classList.add('has-items');
  scroller.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'continue-card';
    const thumb = item.backdrop || item.poster || item.image || '';
    const pct   = item._pct || 0;
    const epLabel = item._ep
      ? `S${item._ep.s} E${item._ep.ep}${item._ep.title ? ' · ' + item._ep.title : ''}`
      : (item.year || '');

    card.innerHTML = `
      <div class="continue-thumb-wrap">
        <img src="${thumb}" alt="${item.title}" loading="lazy" onerror="this.style.display='none'">
        <div class="continue-play-overlay"><span>▶</span></div>
        <div class="continue-progress-bar">
          <div class="continue-progress-fill" style="width:${pct}%"></div>
        </div>
        <button class="continue-remove-btn" data-remove-id="${item.id}" title="Remove from Continue Watching">✕</button>
      </div>
      <div class="continue-info">
        <div class="continue-title">${item.title}</div>
        <div class="continue-sub">${epLabel} · ${pct}% watched</div>
      </div>
    `;

    card.onclick = (ev) => {
      if (ev.target.closest('.continue-remove-btn')) return;
      openPlayer(item, item._ep || null);
    };
    card.querySelector('.continue-remove-btn').addEventListener('click', (ev) => {
      ev.stopPropagation();
      removeContinueItem(item.id);
    });

    scroller.appendChild(card);
  });
  initSliderArrows();
}

function removeContinueItem(id) {
  const items = _loadContinueItems().filter(i => i.id !== id);
  _saveContinueItems(items);
  refreshContinueRow();
}

function clearContinueWatching() {
  _saveContinueItems([]);
  refreshContinueRow();
  showToast('🗑️', 'Continue Watching cleared', 'warning');
}

// ==========================================================================
// MY WATCHLIST ROW
// ==========================================================================

function initMyListRow() {
  refreshMyListRow();
}

function refreshMyListRow() {
  const row      = document.getElementById('rowMyList');
  const scroller = document.getElementById('scrollerMyList');
  if (!row || !scroller) return;

  // Collect all known items that are in watchlist
  const allItems = getAllKnownItems();
  const listed = allItems.filter(item => watchlist.has(item.id));

  const myListNavBtn = document.getElementById('myListNavBtn');
  if (myListNavBtn) {
    myListNavBtn.textContent = listed.length > 0 ? `❤️ My List (${listed.length})` : '❤️ My List';
  }

  if (listed.length === 0) {
    row.classList.remove('has-items');
    return;
  }
  row.classList.add('has-items');
  renderRail('scrollerMyList', listed);
}

function getAllKnownItems() {
  const all = [];
  const seen = new Set();
  const add = (arr) => arr.forEach(item => { if (item && item.id && !seen.has(item.id)) { seen.add(item.id); all.push(item); } });
  add(CATALOG);
  Object.values(PLATFORM_SHOWS).forEach(arr => Array.isArray(arr) && add(arr));
  Object.values(CATEGORY_ITEMS).forEach(arr => Array.isArray(arr) && add(arr));
  return all;
}

// switchCategory override for 'mylist'
const _origSwitchCategory = typeof switchCategory === 'function' ? switchCategory : null;

// ==========================================================================
// SURPRISE ME — RANDOM TITLE PICKER
// ==========================================================================

function surpriseMe() {
  const all = getAllKnownItems();
  if (!all.length) return;
  const item = all[Math.floor(Math.random() * all.length)];
  showToast('🎲', `Surprising you with: ${item.title}!`, 'success');
  setTimeout(() => openDetailsModal(item), 600);
}

// ==========================================================================
// AUTO-ROTATING BILLBOARD HERO
// ==========================================================================

function initBillboardAutoRotate() {
  // Collect hero candidates from popular_movies + trending (populated after render)
  setTimeout(() => {
    const candidates = [
      ...(CATEGORY_ITEMS.popular_movies || []),
      ...(CATEGORY_ITEMS.trending || []),
      ...CATALOG.slice(0, 5)
    ].filter(i => i && (i.backdrop || i.poster));

    if (candidates.length < 2) return;
    billboardItems = candidates.slice(0, 8); // max 8 items
    billboardIndex = 0;

    // Build dots
    const dotsEl = document.getElementById('billboardDots');
    if (dotsEl) {
      dotsEl.innerHTML = billboardItems.map((_, i) => `
        <button class="billboard-dot-progress ${i === 0 ? 'active' : ''}" onclick="jumpBillboard(${i})">
          <div class="billboard-dot-progress-fill" id="billDotFill${i}"></div>
        </button>
      `).join('');
    }

    startBillboardRotation();
  }, 800);
}

let _billDotInterval = null;
function startBillboardRotation() {
  clearInterval(billboardTimer);
  clearInterval(_billDotInterval);
  let elapsed = 0;
  const TOTAL = 6000; // 6s per slide
  const TICK  = 100;

  _billDotInterval = setInterval(() => {
    elapsed += TICK;
    const fill = document.getElementById('billDotFill' + billboardIndex);
    if (fill) fill.style.width = Math.min((elapsed / TOTAL) * 100, 100) + '%';
    if (elapsed >= TOTAL) {
      elapsed = 0;
      advanceBillboard();
    }
  }, TICK);
}

function advanceBillboard() {
  if (!billboardItems.length) return;
  billboardIndex = (billboardIndex + 1) % billboardItems.length;
  _applyBillboard(billboardIndex);
}

function jumpBillboard(idx) {
  if (!billboardItems.length) return;
  billboardIndex = idx;
  _applyBillboard(idx);
  startBillboardRotation(); // restart timer
}

function _applyBillboard(idx) {
  const item = billboardItems[idx];
  if (!item) return;

  const billboard = document.getElementById('heroBillboard');
  if (!billboard) return;

  // Update dots
  document.querySelectorAll('.billboard-dot-progress').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
    const f = document.getElementById('billDotFill' + i);
    if (f) f.style.width = i < idx ? '100%' : '0%';
  });

  // Crossfade
  billboard.classList.add('fading');
  setTimeout(() => {
    renderBillboard(item);
    billboard.classList.remove('fading');
    billboard.classList.add('fading-in');
    setTimeout(() => billboard.classList.remove('fading-in'), 600);
  }, 400);
}

// ==========================================================================
// AUTO-FAILOVER (Server auto-switch on iframe load timeout)
// ==========================================================================

function startFailoverTimer() {
  stopFailoverTimer();
  const iframe = document.getElementById('theatreIframe');
  if (!iframe) return;

  failoverTimer = setTimeout(() => {
    if (!currentPlayingItem) return;
    const nextIdx = (activeServerIndex + 1) % SERVERS.length;
    if (nextIdx === 0 && activeServerIndex === SERVERS.length - 1) {
      // All servers tried
      showToast('⚠️', 'All servers tried. Try again in a moment.', 'error');
      return;
    }
    showToast('⚡', `Server ${activeServerIndex + 1} slow — switching to Server ${nextIdx + 1}…`, 'warning');
    const badge = document.getElementById('failoverBadge');
    if (badge) { badge.textContent = `⚡ Auto-switched to Server ${nextIdx + 1}`; badge.classList.add('visible'); setTimeout(() => badge.classList.remove('visible'), 5000); }
    switchServer(nextIdx);
    const sel = document.getElementById('serverSelect');
    if (sel) sel.selectedIndex = nextIdx;
  }, 10000); // 10 seconds
}

function stopFailoverTimer() {
  if (failoverTimer) { clearTimeout(failoverTimer); failoverTimer = null; }
}

// ==========================================================================
// ENHANCED KEYBOARD SHORTCUTS (override existing setupTVNavigation)
// ==========================================================================

function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    const activePlayer = document.getElementById('playerView')?.classList.contains('active');
    const activeModal  = document.getElementById('detailsModal')?.classList.contains('active');
    const isInput = document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA';
    if (isInput) return;

    if (activePlayer) {
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        togglePlayerFullscreen();
      }
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        // Focus iframe so space key reaches the embedded player
        const iframe = document.getElementById('theatreIframe');
        if (iframe) iframe.focus();
      }
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && currentPlayingItem?.type === 'tv') {
        e.preventDefault();
        _navigateEpisode(e.key === 'ArrowRight' ? 1 : -1);
      }
    }

    if (e.key === 'm' || e.key === 'M') {
      if (!activePlayer && !activeModal) {
        e.preventDefault();
        surpriseMe();
      }
    }
  });
}

function _navigateEpisode(dir) {
  if (!currentPlayingItem || !currentPlayingEpisode) return;
  // Find current ep in episodes list
  const item = currentPlayingItem;
  const allEps = (item.episodes || []);
  if (!allEps.length) return;
  const curIdx = allEps.findIndex(ep => ep.s === currentPlayingEpisode.s && ep.ep === currentPlayingEpisode.ep);
  const nextIdx = curIdx + dir;
  if (nextIdx < 0 || nextIdx >= allEps.length) return;
  const nextEp = allEps[nextIdx];
  showToast('⏭️', `S${nextEp.s} E${nextEp.ep}: ${nextEp.title || ''}`, '');
  openPlayer(item, nextEp);
}

// ==========================================================================
// PWA INSTALL
// ==========================================================================

function setupPwaInstall() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.warn('[PWA] ServiceWorker registration failed:', err);
      });
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    pwaInstallEvent = e;
    // Show PWA banner after 30s on site
    setTimeout(() => {
      const banner = document.getElementById('pwaInstallBanner');
      if (banner) banner.classList.add('visible');
    }, 30000);
  });
  window.addEventListener('appinstalled', () => {
    dismissPwaBanner();
    showToast('🎉', 'Prime Video installed successfully!', 'success');
  });
}

function triggerPwaInstall() {
  if (!pwaInstallEvent) {
    showToast('ℹ️', 'Use your browser menu to install this app', '');
    return;
  }
  pwaInstallEvent.prompt();
  pwaInstallEvent.userChoice.then(result => {
    if (result.outcome === 'accepted') showToast('🎉', 'Installing Prime Video…', 'success');
    pwaInstallEvent = null;
    dismissPwaBanner();
  });
}

function dismissPwaBanner() {
  const banner = document.getElementById('pwaInstallBanner');
  if (banner) banner.classList.remove('visible');
}

// Add failoverBadge HTML to player HUD dynamically
document.addEventListener('DOMContentLoaded', () => {
  const hudTop = document.querySelector('.player-hud-top > div:last-child');
  if (hudTop) {
    const badge = document.createElement('div');
    badge.className = 'failover-badge';
    badge.id = 'failoverBadge';
    badge.textContent = '⚡ Auto-switched server';
    hudTop.prepend(badge);
  }
});
