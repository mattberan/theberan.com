/* ─── Projects ───────────────────────────────────────────── */
const PROJECTS = [
  {
    id: "ticket-to-the-top",
    title: "Ticket to the Top",
    description: "IT career simulation game from service desk to CIO. Navigate help desk tickets, build skills, manage teams, and climb the IT org chart in this strategy sim for aspiring IT leaders.\n\nThe core mechanic is the ticket queue — everything in IT flows through the ticket. Prioritization, communication, resource allocation all live there. Career progression mirrors real org charts: L1 support → L2 specialist → team lead → IT manager → director → VP → CIO, each tier unlocking new mechanics and responsibilities.",
    status: "active",
    priority: 1,
    lastUpdated: "2026-05-01",
    tags: ["game", "career", "ITSM", "simulation"],
    media: [],
    writeupIds: ["w001", "w002"],
    learningIds: ["l001"],
    url: ""
  },
  {
    id: "asset-chaos",
    title: "Asset Chaos",
    description: "Gamified ITAM training simulation using InvGate Asset Management. Players manage a spiraling asset inventory — tracking, reconciling, and defending audit-ready data under pressure.\n\nAsset management training has a credibility problem: everyone agrees it matters, nobody wants to sit through it. Asset Chaos starts from the opposite premise — what if the training was the chaos? Put learners in a situation where the asset data is a disaster and let them feel the pressure of cleaning it up. Real interface, real data problems, controlled environment.",
    status: "active",
    priority: 2,
    lastUpdated: "2026-04-28",
    tags: ["game", "ITAM", "training", "InvGate"],
    media: [],
    writeupIds: ["w003"],
    learningIds: ["l002"],
    url: ""
  },
  {
    id: "smtrendsetter",
    title: "SMTrendSetter",
    description: "Automated trend intelligence system that pulls emerging ITSM topics from Reddit and RSS feeds, synthesizes them with Claude AI, and surfaces content angles for TikTok and LinkedIn.\n\nBuilt on Django 4.2 + Celery + Redis + PostgreSQL. Synthesis runs Monday and Thursday at 7am via Celery Beat. The pipeline extracts signal from noise across dozens of ITSM sources and produces structured content briefs — reducing manual trend-watching from hours to minutes.",
    status: "active",
    priority: 3,
    lastUpdated: "2026-04-30",
    tags: ["AI", "automation", "ITSM", "content", "Django"],
    media: [],
    writeupIds: [],
    learningIds: ["l003"],
    url: ""
  },
  {
    id: "beran-brief",
    title: "The Beran Brief",
    description: "Standalone weekly email newsletter covering ITSM trends, career insights, and the intersection of service management and modern IT.\n\nBuilt on a custom Node.js stack with Porkbun SMTP and deployed on Vercel. After runs on Substack, ConvertKit, and Beehiiv, I rebuilt the infrastructure from scratch to own every layer — when something breaks, I can fix it; when I want a new feature, I can build it. The whole stack is ~400 lines of code.",
    status: "active",
    priority: 4,
    lastUpdated: "2026-05-01",
    tags: ["newsletter", "writing", "ITSM", "Node.js"],
    media: [],
    writeupIds: ["w004"],
    learningIds: [],
    url: ""
  },
  {
    id: "theberan-com",
    title: "theberan.com",
    description: "This site. A flat HTML/JS personal project dashboard — no framework, no build tools, no backend, no auth.\n\nA living index of what Matt is building, writing, learning, and shipping. Hosted on GitHub Pages. All content lives in a single data.js file — add a project there and it appears everywhere automatically. Companion site to mattberan.com.",
    status: "active",
    priority: 5,
    lastUpdated: "2026-05-02",
    tags: ["web", "personal", "dashboard", "HTML"],
    media: [],
    writeupIds: [],
    learningIds: [],
    url: "https://theberan.com"
  }
];

/* ─── Writing ─────────────────────────────────────────────── */
const WRITING = [
  {
    id: "w001",
    title: "Why IT Career Games Don't Exist Yet",
    projectId: "ticket-to-the-top",
    date: "2026-04-15",
    body: "I've spent 20 years in ITSM and I've never seen a career simulation game that gets the service desk right. The closest thing is a spreadsheet someone's manager built. Here's why that's a problem and what I'm doing about it.\n\nMost IT training is passive — watch a video, pass a quiz, move on. You don't actually learn to triage a P1 incident by reading about it. You learn by triaging a P1 incident. That's the core hypothesis behind Ticket to the Top: what if you could simulate the actual decisions IT leaders make, compressed into a game loop that teaches without feeling like training?\n\nThe game mechanic I keep coming back to is the ticket queue. Everything in IT flows through the ticket. Prioritization, communication, resource allocation — it all happens there. So Ticket to the Top is fundamentally a queue management game with RPG-style skill progression layered on top.\n\nThe market gap is real: there are tons of IT certification programs, plenty of training videos, zero games that make you feel the pressure of an SLA breach or the satisfaction of closing 50 tickets before end of day. That's the space I'm building into.",
    tags: ["game design", "ITSM", "career"]
  },
  {
    id: "w002",
    title: "Designing Game Mechanics Around ITIL Concepts",
    projectId: "ticket-to-the-top",
    date: "2026-04-28",
    body: "The challenge with any serious game is making the mechanics feel like play, not like homework. ITIL has concepts that are genuinely interesting — the idea that every IT action is a value exchange, that incidents and problems are different things, that change carries risk. These aren't dry compliance boxes. They're real tensions that IT professionals navigate every day.\n\nI'm mapping each ITIL practice to a specific game mechanic. Change management becomes a risk dial — push changes fast, score points, but raise the chance of a major incident. Incident management is real-time: tickets pile up, severity escalates, SLAs tick down. Problem management unlocks when you resolve the same incident three times — it becomes a detective minigame.\n\nThe career progression system mirrors real org charts: L1 support → L2 specialist → team lead → IT manager → director → VP → CIO. Each tier unlocks new mechanics and new responsibilities — at L1 you're clearing queue, at CIO you're setting strategy while your subordinate agents handle the tickets.\n\nThe design tension I'm working through: how do you make the game hard enough to be satisfying without making it feel punishing for people who are new to ITSM? The answer is probably a difficulty curve that introduces concepts gradually, with explicit callouts to real-world parallels.",
    tags: ["game design", "ITIL", "mechanics"]
  },
  {
    id: "w003",
    title: "What Makes ITAM Training Fail",
    projectId: "asset-chaos",
    date: "2026-04-20",
    body: "Asset management training has a credibility problem. Everyone agrees it matters. Nobody wants to sit through it. The content is usually a deck of slides about policies nobody reads, followed by a quiz about those policies.\n\nAsset Chaos starts from the opposite premise: what if the training was the chaos? Put learners in a situation where the asset data is a disaster — mismatched serials, ghost assets, software licenses about to expire, an audit in 48 hours — and let them feel the pressure of cleaning it up.\n\nThe sim uses InvGate Asset Management as the actual tool. Real interface, real data problems, but a controlled environment where mistakes teach rather than break things. The feedback loop is immediate: reconcile an asset correctly and you can see the audit readiness score climb. Miss a software entitlement and you get a simulated audit finding.\n\nThe goal isn't to teach people how to use a tool. It's to teach them why ITAM matters — and the game does that by letting them experience the consequences of bad asset data firsthand.",
    tags: ["ITAM", "training", "game design"]
  },
  {
    id: "w004",
    title: "Why I Rebuilt the Newsletter Infrastructure",
    projectId: "beran-brief",
    date: "2026-05-01",
    body: "I've been on Substack, ConvertKit, and Beehiiv. Each time, I hit a ceiling — usually around customization or data ownership. The Beran Brief is now running on a custom Node.js stack with Porkbun SMTP, and I'm not looking back.\n\nThe core benefit isn't technical purity. It's that I understand every layer of how my newsletter gets delivered. When something breaks, I can fix it. When I want a new feature, I can build it. The tradeoff is that I maintain it myself — but for a list this size, that's a reasonable trade.\n\nI use 1Password CLI to manage SMTP credentials in the build process. The site is deployed on Vercel. The whole stack is ~400 lines of code.\n\nThe thing that surprised me most: deliverability is better with direct SMTP than it was with any of the platforms I tried. I think it's because those platforms share IP ranges across all their customers — one bad actor affects everyone. With my own sending domain and dedicated IPs via Porkbun, I control the reputation.\n\nIf you're sending under 5k emails a week, building your own is worth considering.",
    tags: ["newsletter", "infrastructure", "writing", "Node.js"]
  }
];

/* ─── Learning ────────────────────────────────────────────── */
const LEARNING = [
  {
    id: "l001",
    title: "Game Design Fundamentals — MDA Framework",
    projectId: "ticket-to-the-top",
    date: "2026-04-10",
    type: "resource",
    notes: "MDA (Mechanics, Dynamics, Aesthetics) is the lens I'm using to design Ticket to the Top. Mechanics are the rules, dynamics are what emerges from play, aesthetics are the emotional response. The framework keeps me from over-engineering rules that won't produce the right dynamics. Key insight: designers experience games from M→D→A; players experience them A→D→M. You have to design for what the player feels, not just what the rules say.",
    url: "https://users.cs.northwestern.edu/~hunicke/MDA.pdf",
    tags: ["game design", "frameworks"]
  },
  {
    id: "l002",
    title: "IAITAM CAMSE Certification",
    projectId: "asset-chaos",
    date: "2026-03-22",
    type: "cert",
    notes: "Completed IAITAM's Certified Asset Management Solutions Expert certification. Did this to make sure Asset Chaos reflects how real audits work. The pressure mechanics in the game are directly based on audit timelines and common failure modes that came up in the coursework.",
    url: "",
    tags: ["ITAM", "certification", "audit"]
  },
  {
    id: "l003",
    title: "Django Celery Beat — Reliable Scheduling",
    projectId: "smtrendsetter",
    date: "2026-04-25",
    type: "experiment",
    notes: "Got Celery Beat working reliably for the Mon/Thu 7am synthesis runs in SMTrendSetter. Key insight: always seed the periodic tasks from code (via AppConfig.ready()) rather than the Django admin, so they survive redeployments. Also learned that using database-backed schedulers (django-celery-beat) is essential for multi-instance deploys — the default file-based scheduler doesn't handle concurrency.",
    url: "",
    tags: ["Django", "Celery", "Python", "scheduling"]
  }
];

/* ─── Media ───────────────────────────────────────────────── */
const MEDIA = [];
