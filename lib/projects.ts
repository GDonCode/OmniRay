/** Real client work. Used by the home showreel and the /work page. */
export type Project = {
  slug: string;
  name: string;
  client: string;
  kind: string;
  /** Public site, when there is one to link to. */
  url?: string;
  /** Client logo in /public (shown once, beside "What we used"). Falls back to the client name as a wordmark. */
  logo?: { src: string; alt: string };
  result: string;
  built: string[];
  tech: string[];
  /** Screenshots in /public (16:10 works best). */
  shots: { src: string; alt: string }[];
};

export const PROJECTS: Project[] = [
  {
    slug: "fl-logistics",
    name: "FL Logistics",
    client: "FL Logistic Excel International LLC",
    kind: "Freight forwarding platform",
    url: "https://fllogisticsintl.com",
    result:
      "Moved a Jamaica–Florida freight forwarder from manual order handling to a self-serve platform where customers quote, book, pay and track freight online, and where the business also runs live auctions and an online shop.",
    built: [
      "A fully custom WordPress/WooCommerce theme and ecommerce system.",
      "Quote and booking forms for sea, air and ground freight, with live pricing calculators.",
      "A custom My Account dashboard with a sortable order table, custom freight statuses, in-order chat with file uploads, and invoice PDF downloads.",
      "A custom card checkout built on Authorize.Net Accept.js, plus bank transfer (BACS) and branded transactional emails.",
      "Automatic bill of lading generation.",
      "A live auction system.",
      "A shop with custom product cards.",
      "Truck routing for ground freight.",
      "Fraud protection: reCAPTCHA, IP lockouts and a shop kill switch.",
    ],
    tech: [
      "WordPress",
      "WooCommerce",
      "PHP",
      "JavaScript (AJAX)",
      "CSS variables (Manrope)",
      "Authorize.Net CIM and Accept.js",
      "WP Overnight PDF Invoices, mPDF fallback",
      "TomTom Routing",
      "Mapbox",
      "Google reCAPTCHA v3",
      "SiteGround",
      "Cloudflare",
      "Laragon",
      "Git and GitHub",
    ],
    shots: [{ src: "/reel/fllogistics.webp", alt: "FL Logistics home page: Think it. Move it. Done." }],
  },
  {
    slug: "gameboy-records",
    name: "Gameboy Records",
    client: "Gameboy Records (Alexx A-Game)",
    kind: "Record label site, shop and members club",
    result:
      "A single branded site where fans can stream the music, buy merch, get show tickets, sign in to a members club and play trivia.",
    built: [
      "Worked on the existing site: updated the page copy and styling across the Home, About, Shop, Shows and login pages.",
      "Gave the Home music cards a colour-matched 3D edge.",
      "Rebuilt the trivia “guess the music video” round around real video stills.",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "WooCommerce", "NextAuth"],
    shots: [
      { src: "/reel/gameboyrecords.webp", alt: "Gameboy Records home page" },
      { src: "/reel/gameboyrecords-music.webp", alt: "Gameboy Records music page" },
      { src: "/reel/gameboyrecords-vibes.webp", alt: "Gameboy Records vibes page" },
    ],
  },
];

/** Cards in the home showreel, each linking to its case study. */
export const REEL = [
  { name: "FL Logistics", project: "fl-logistics", image: "/reel/fllogistics.webp" },
  { name: "Gameboy Records", project: "gameboy-records", image: "/reel/gameboyrecords.gif" },
  { name: "Gameboy Records: Music", project: "gameboy-records", image: "/reel/gameboyrecords-music.webp" },
  { name: "Gameboy Records: Vibes", project: "gameboy-records", image: "/reel/gameboyrecords-vibes.webp" },
] as const;
