# ClimbAlgoMountain (DSA Game)

A gamified platform to master Data Structures and Algorithms (DSA) through interactive games, visualizations, and community support. Track your progress, join forums, and unlock rewards—perfect for students, children, and anyone making DSA learning fun and accessible!

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Game Modules](#game-modules)
- [Level Progression System](#level-progression-system)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Authentication & Premium](#authentication--premium)
- [Community & Social Features](#community--social-features)
- [Rewards & Achievements](#rewards--achievements)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)
- [Contact](#contact)

---

## Overview
ClimbAlgoMountain transforms DSA learning into an adventure. Play interactive games for each DSA topic, visualize algorithms, track your journey, and connect with a supportive community. Designed for all ages, especially students and beginners.

---

## Features

### 🎮 Interactive DSA Games
- **Arrays:** Solve puzzles, collect gems, and master array operations.
- **Linked Lists:** Build, traverse, and manipulate chains in creative scenarios.
- **Stacks & Queues:** Play with stacking, queuing, bracket matching, postfix evaluation, and more.
- **Sorting Algorithms:** Sort toys, books, and more using Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, and Radix sorts.
- **Heap & Priority Queue:** Build heaps, repair trees, manage hospital queues, and compare heap types.
- **Bit Manipulation:** Toggle bits, perform AND/OR/XOR/NOT, solve bit puzzles, and pattern matching.
- **Sliding Window & Two Pointer:** Solve classic sliding window and two-pointer problems interactively.
- **Recursion:** Explore recursion with nesting dolls, factorials, Fibonacci, Tower of Hanoi, permutations, mazes, fractals, palindromes, and N-Queens.
- **Strings:** Word Wizard Quest – Practice string manipulation, pattern matching, and word puzzles.
- **Trees (Premium):** Visualize and build binary trees, perform traversals, and solve tree-based puzzles.
- **Graphs (Premium):** Learn graph concepts, traversals (BFS/DFS), shortest paths, cycles, and more with visual tools.
- **Dynamic Programming:** (Coming Soon) Solve optimization puzzles and master DP techniques.

### 🏆 Level Progression & Gamification
- **Multiple Levels per Game:** Each game is divided into several levels, allowing for gradual mastery of each topic.
- **Manual Level Access:** All levels are accessible; there is currently no automatic unlocking system.
- **Progress Tracking:** Your progress is tracked for each level and game.
- **Score Tracking:** Earn points for each level and game completed.
- **Achievements & Badges:** Collect badges for milestones, streaks, and high scores.

> **Note:** The current system does not include animated transitions or a reusable sidebar/menu for level navigation. Level unlocking and advanced gamification features are planned for future updates.

### 📈 Progress Tracking & Analytics
- **Personal Dashboard:** View your overall progress, scores, and completed topics.
- **Detailed Analytics:** Track your learning journey, level completion, and time spent.
- **Leaderboard:** See top performers and your global rank.

### 👥 Community & Social Features
- **Forum:** Ask questions, answer others, and discuss DSA topics.
- **Friends System:** Add friends, view their progress, and compete.
- **Chatbot:** Get instant help, hints, and DSA explanations.

### 💎 Rewards & Premium
- **Rewards System:** Earn points and redeem them for real or virtual rewards (badges, kits, etc.).
- **Premium Games:** Unlock advanced games (Tree, Graph, Bundle) via secure payment (Razorpay).
- **Premium-Only Content:** Access exclusive levels, visualizations, and advanced challenges.

### 🔒 Authentication & Security
- **User Accounts:** Register, login, and manage your profile.
- **Password Recovery:** Secure OTP-based password reset.
- **Access Control:** Premium content is protected and only available to users with access.

### 🧩 Visualizations & Learning Tools
- **Algorithm Visualizers:** (Planned/Partial) Visualize sorting, trees, graphs, and more.
- **Step-by-Step Guidance:** Hints, tooltips, and explanations for each level and concept.

### 🧒 Child-Friendly & Accessible
- **Kid-Friendly Design:** Colorful, engaging, and easy-to-use interface.
- **Accessible Language:** Explanations and instructions suitable for all ages.

### 🛠️ Developer & Contributor Features
- **Modular Codebase:** Easy to add new games, levels, and features.
- **API-Driven:** Clean separation of frontend and backend for scalability.
- **Extensive Documentation:** Level progression, project structure, and contribution guidelines.

---

## Game Modules
Each DSA topic is a unique, interactive game with multiple levels:

- **Arrays:** Treasure Chest Adventure – Collect gems, solve puzzles, and master array operations.
- **Linked Lists:** Chain Masters Adventure – Build, traverse, and manipulate chains in creative scenarios.
- **Stacks & Queues:** Stack & Queue Master – Solve stacking and queuing challenges, bracket matching, postfix evaluation, and more.
- **Sorting Algorithms:** Sorting Master – Sort toys, books, and more using Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, and Radix sorts.
- **Heap & Priority Queue:** Heap Priority Queue Master – Build heaps, repair trees, manage hospital queues, and compare heap types.
- **Bit Manipulation:** Bit Manipulation Master – Toggle bits, perform AND/OR/XOR/NOT, solve bit puzzles.
- **Sliding Window & Two Pointer:** Window Pointer Master – Solve classic sliding window and two-pointer problems interactively.
- **Recursion:** Recursion Realm – Explore recursion with nesting dolls, factorials, Fibonacci, Tower of Hanoi, permutations, mazes, fractals, palindromes, and N-Queens.
- **Trees (Premium):** Tree Game – Visualize and build binary trees, perform traversals, and solve tree-based puzzles.
- **Graphs (Premium):** Graph Game – Learn graph concepts, traversals (BFS/DFS), shortest paths, cycles, and more with visual tools.
- **Dynamic Programming:** Dynamic Programming Game – (Coming Soon) Solve optimization puzzles and master DP techniques.

---

## Level Progression System
- **Sidebar Menu:** Shows all levels and it show completed and incompleted levels.
- **Animated Progress:** Smooth transitions, pulsing effects, and progress bars.
- **Progress Saved:** All progress is saved to your profile and can be resumed anytime.

---

## Tech Stack

**Frontend:**
- **React 18** (core UI library)
- **React Router DOM** (routing)
- **Styled Components** (CSS-in-JS styling)
- **Framer Motion** (animations)
- **DnD Kit** (`@dnd-kit/core`, `@dnd-kit/sortable`) (drag-and-drop)
- **React D3 Tree** (tree visualizations)
- **React DnD** and **React DnD HTML5 Backend** (additional drag-and-drop support)
- **Axios** (HTTP requests)
- **Tailwind CSS** (utility-first CSS framework)
- **Jest** and **React Testing Library** (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`) (testing)
- **Web Vitals** (performance monitoring)
- **React Scripts** (build and development scripts)

**Backend:**
- **Node.js** (runtime)
- **Express.js** (web framework)
- **MongoDB** with **Mongoose** (database and ODM)
- **JWT (jsonwebtoken)** (authentication)
- **BcryptJS** (password hashing)
- **Cloudinary** (media/image storage)
- **Razorpay** (payment gateway)
- **Nodemailer** (email/OTP)
- **CORS** (cross-origin resource sharing)
- **Dotenv** (environment variables)
- **Helmet** (security headers)
- **Express Rate Limit** (rate limiting)
- **Express Validator** (input validation)
- **Multer** and **Multer Storage Cloudinary** (file uploads)
- **Node Fetch** (server-side HTTP requests)
- **Morgan** (logging)
- **Nodemon** (development auto-reload, dev dependency)

---

## Project Structure
```
.
├── client/                          # Frontend (React)
│   ├── public/                      # Static files (index.html, manifest, robots.txt)
│   │   └── Heroimg.jfif
│   ├── src/
│   │   ├── assets/                  # Images and static assets
│   │   │   └── Heroimg.jfif
│   │   ├── components/              # All React components
│   │   │   ├── AboutUs.js
│   │   │   ├── Chatbot.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Footer.js
│   │   │   ├── Friends.js
│   │   │   ├── Games.js
│   │   │   ├── Leaderboard.js
│   │   │   ├── Loading.js
│   │   │   ├── Navbar.js
│   │   │   ├── NotFound.js
│   │   │   ├── PremiumPurchase.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── Rewards.js
│   │   │   ├── ScrollToTop.js
│   │   │   ├── ScrollToTopButton.js
│   │   │   ├── auth/                # Auth-related components
│   │   │   │   ├── ForgotPassword.js
│   │   │   │   ├── LoginForm.js
│   │   │   │   ├── RegisterForm.js
│   │   │   │   └── UserProfile.js
│   │   │   ├── forum/               # Forum components
│   │   │   │   ├── AskQuestion.js
│   │   │   │   ├── ForumHome.js
│   │   │   │   └── QuestionDetail.js
│   │   │   ├── games/               # All game modules
│   │   │   │   ├── BitManipulationMaster.js
│   │   │   │   ├── ChainMastersAdventure.js
│   │   │   │   ├── DynamicProgrammingGame.js
│   │   │   │   ├── GameDecorations.js
│   │   │   │   ├── GraphGame.js
│   │   │   │   ├── HeapPriorityQueueMaster.js
│   │   │   │   ├── ItemTypes.js
│   │   │   │   ├── RecursionRealm.js
│   │   │   │   ├── SortingMaster.js
│   │   │   │   ├── StackQueueMaster.js
│   │   │   │   ├── TreasureChestAdventure.js
│   │   │   │   ├── TreeGame.js
│   │   │   │   ├── WindowPointerMaster.js
│   │   │   │   └── WordWizardQuest.js
│   │   │   └── visualizers/         # (empty, for future visualizer modules)
│   │   ├── config/                  # (empty, for future config files)
│   │   ├── contexts/                # React context providers
│   │   │   └── AuthContext.js
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useApi.js
│   │   │   ├── useLoading.js
│   │   │   └── useScrollTo.js
│   │   ├── services/                # Service modules (API, progress, etc.)
│   │   │   └── gameProgressService.js
│   │   ├── utils/                   # Utility functions
│   │   │   └── gameProgress.js
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── package.json
│   ├── package-lock.json
│   ├── package.2.json
│   └── tailwind.config.js
│
├── server/                          # Backend (Node.js/Express)
│   ├── config/                      # Configuration files
│   │   ├── cloudinary.js
│   │   ├── connectDB.js
│   │   └── razorpay.js
│   ├── controllers/                 # Route controllers
│   │   ├── auth.controller.js
│   │   ├── forum.controller.js
│   │   ├── friends.controller.js
│   │   ├── leaderboard.controller.js
│   │   ├── premium.controller.js
│   │   ├── rewards.controller.js
│   ├── middleware/                  # Express middleware
│   │   └── auth.middleware.js
│   ├── models/                      # Mongoose models
│   │   ├── ForumAnswer.js
│   │   ├── ForumQuestion.js
│   │   ├── Leaderboard.js
│   │   ├── UserFriends.js
│   │   ├── UserProfile.js
│   │   ├── UserProgress.js
│   │   └── topic.model.js
│   ├── routes/                      # API route definitions
│   │   ├── auth.routes.js
│   │   ├── chatbot.routes.js
│   │   ├── forum.routes.js
│   │   ├── gameProgress.js
│   │   ├── leaderboard.routes.js
│   │   ├── premium.routes.js
│   │   ├── rewards.routes.js
│   │   ├── topic.routes.js
│   │   └── user.routes.js
│   ├── scripts/                     # Utility scripts (e.g., seeding)
│   │   └── seedAllTopics.js
│   ├── utils/                       # Utility modules
│   │   └── email.js
│   ├── server.js                    # Main server entry point
│   ├── package.json
│   └── package-lock.json
│
├── LEVEL_PROGRESSION_README.md      # Level progression system documentation
├── README.md                        # Main project documentation
```

---

## Getting Started
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <project-root>
   ```
2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```
3. **Install frontend dependencies:**
   ```bash
   cd ../client
   npm install
   ```
4. **Set up environment variables:**
   - Create `.env` files in both `server/` and `client/` as needed (see sample `.env.example` if provided).
5. **Start the development servers:**
   - Backend: `cd server && npm start`
   - Frontend: `cd client && npm start`
6. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

---

## Authentication & Premium
- **User Accounts:** Register, login, and manage your profile.
- **Password Recovery:** Secure OTP-based password reset.
- **Premium Games:** Purchase access to advanced games (Tree, Graph, Bundle) via Razorpay.
- **Access Control:** Premium content is protected and only available to users with access.

---

## Community & Social Features
- **Forum:** Ask questions, answer others, and discuss DSA topics.
- **Friends:** Add friends, view their progress, and compete.
- **Leaderboard:** See top performers and your global rank.
- **Chatbot:** Get instant help and DSA explanations.

---

## Rewards & Achievements
- **Earn Points:** Complete levels and games to earn points.
- **Unlock Rewards:** Redeem points for real or virtual rewards (badges, kits, etc.).
- **Achievements:** Collect badges for milestones and streaks.

---

## Contribution Guidelines
1. **Fork the repository** and create your branch from `main`.
2. **Describe your changes** clearly in pull requests.
3. **Follow code style** and add comments where helpful.
4. **Add tests** for new features if possible.
5. **Be respectful** and constructive in discussions.

---

## Contact
**Creator:** Vasu Aghera  
**Role:** Full Stack Developer & DSA Enthusiast  
**Mission:** Making DSA learning fun, accessible, and effective for everyone.  

For questions, suggestions, or support, open an issue or contact via the project repository. 
