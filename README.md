# SkillCraft Technology — Web Development Internship

A collection of four production-quality web applications built as part of the **SkillCraft Technology** internship program. Each project is implemented with vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies.

---

## Projects

### 01 · Responsive Landing Page

A fully responsive personal portfolio landing page based on [lekhanhr.online](https://www.lekhanhr.online/).

**Features**
- Sticky navigation with scroll-aware styling and mobile hamburger menu
- Full-screen hero section with animated floating cards
- Auto-scrolling marquee ticker
- About section with stats (10+ apps, 42+ repos, GSoC aspirant, IEEE published)
- 4-column skills grid (Frontend, Backend, AI & Data, Tools & DevOps)
- Featured projects section with real project data (Chess Post Game Analyst, AARS, Nova Agent, PhantomTrace, and more)
- Vertical experience timeline from Apr 2024 → Feb 2026
- Contact form with simulated submission
- Scroll-reveal animations on cards and timeline items
- Fully responsive down to 320px

---

### 02 · Stopwatch Web Application

A clean, centered stopwatch with lap tracking.

**Features**
- Start / Pause / Resume / Reset controls
- Lap recording with per-lap split time and delta from previous lap
- Lap counter badge
- Fully centered layout — no distractions, no navigation
- Responsive on all screen sizes

---

### 03 · Tic Tac Toe Web Application

An interactive Tic Tac Toe game with two play modes.

**Features**
- **vs Computer** — unbeatable AI powered by the Minimax algorithm
- **2 Players** — local two-player mode on the same device
- Mode toggle pill that resets the board on switch
- Score tracking across rounds (Player 1 vs Player 2 / Computer)
- Winning cells highlighted
- Restart button to begin a new round

---

### 04 · To-Do Web App

A minimal, elegant task manager with persistent storage.

**Features**
- Time-aware greeting (Good Morning / Afternoon / Evening)
- Add tasks with a single input
- Inline edit on double-click
- Mark tasks complete with animated checkbox
- Completed tasks separated into their own section
- Data persisted in `localStorage` — survives page refresh
- Fully responsive

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Markup     | HTML5 (semantic)                  |
| Styling    | CSS3 (custom properties, grid, flexbox, animations) |
| Logic      | Vanilla JavaScript (ES2020+)      |
| Fonts      | Google Fonts — Inter              |
| Storage    | localStorage (To-Do App)          |
| Server     | Node.js `http-server` / Python    |

---

## Running Locally

**Option 1 — Node.js (recommended)**

```sh
npx http-server -p 8000 -c-1
```

**Option 2 — Python**

```sh
python3 -m http.server 8000
```

Then open any project in your browser:

| Project | URL |
|---------|-----|
| Landing Page | http://localhost:8000/Responsive_Landing_Page/ |
| Stopwatch | http://localhost:8000/Stopwatch_Web_Application/ |
| Tic Tac Toe | http://localhost:8000/Tic_Tac_Toe_Web_Application/ |
| To-Do App | http://localhost:8000/To_Do_Web_App/ |

---

## Project Structure

```
skillcraft_intern_tasks/
├── Responsive_Landing_Page/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── Stopwatch_Web_Application/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── Tic_Tac_Toe_Web_Application/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── To_Do_Web_App/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

---

## Author

**Lekhan H R**  
Full-Stack Developer & AI Enthusiast · Bangalore  
[GitHub](https://github.com/lekhanpro) · [LinkedIn](https://linkedin.com/in/lekhan-h-r) · [Portfolio](https://www.lekhanhr.online/)

---

*Built for SkillCraft Technology Web Development Internship — 2025*
