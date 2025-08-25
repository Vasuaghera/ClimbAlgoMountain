# ClimbAlgoMountain (DSA Game)

## 1. Project Overview

ClimbAlgoMountain is a gamified platform designed to make learning Data Structures and Algorithms (DSA) fun, interactive, and accessible for everyone. Through a series of engaging games, visualizations, and a supportive community, users can master DSA concepts, track their progress, participate in Q&A, and unlock rewards( Only for a Testing). The platform is ideal for students, children, and anyone looking to strengthen their DSA skills in an enjoyable way.

📸 **Visual Tour of ClimbAlgoMountain**

Explore the complete user interface and experience of our DSA learning platform through our comprehensive screenshot collection:

**[View All Website Screenshots & Images](https://drive.google.com/drive/folders/19OF71Bek1uMhk86j7YZz5g4HccErLwij?usp=sharing)**

The screenshot collection includes:
- 🏠 **Home Page** - Landing page with hero section and feature overview
- 🎮 **Game Home Page** - Central hub for all DSA games
- 🔐 **Authentication Pages** - Login, signup, and password recovery flows
- 🎯 **Individual Game Pages** - Screenshots of all 12+ DSA games
- 👥 **Community Features** - Forum, friends, and leaderboard interfaces
- 🏆 **Rewards & Premium** - Achievement system and premium purchase flow
- 📱 **Responsive Design** - Mobile and desktop interface variations
- 🎨 **UI/UX Elements** - Navigation, modals, and interactive components

*Perfect for developers, users, and stakeholders to understand the complete user experience before diving into the codebase.*

---

## 1b. Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. Features](#2-features)
- [3. Game Modules](#3-game-modules)
- [4. Tech Stack](#4-tech-stack)
- [5. Project Structure](#7-project-structure)
- [6. Getting Started](#8-getting-started)

---

## 2. Features

- 🎮 **Interactive DSA Games:** Play topic-based games for Arrays, Linked Lists, Stacks, Queues, Sorting, Heaps, Bit Manipulation, Sliding Window, Recursion, Strings, Trees, Graphs, and more.
- 🏆 **Level Progression & Gamification:** Multiple levels per game, progress and score tracking, achievements, and badges.
- 📈 **Progress Tracking & Analytics:** Personal dashboard, detailed analytics, and global leaderboard.
- 👥 **Community & Social Features:** Q&A, friends system, and integrated chatbot for instant help.
- 💎 **Rewards & Premium:** Earn and redeem points, unlock premium content and advanced games via secure payment.
- 🔒 **Authentication & Security:** User accounts, secure login, password recovery, and access control for premium content.
- 🧩 **Visualizations & Learning Tools:** Algorithm visualizers, step-by-step guidance, and hints.
- 🧒 **Child-Friendly & Accessible:** Engaging, colorful UI and accessible language for all ages.
- 🛠️ **Developer Friendly:** Modular codebase, API-driven architecture, and extensive documentation for easy contribution.

---

## 3. Game Modules
Each DSA topic is presented as a unique, interactive game with 10 levels and engaging challenges:

- **Arrays:** Treasure Chest Adventure – Collect gems, solve puzzles, and master array operations.
- **Linked Lists:** Chain Masters Adventure – Build, traverse, and manipulate chains in creative scenarios.
- **Stacks & Queues:** Stack & Queue Master – Solve stacking and queuing challenges, bracket matching, postfix evaluation, and more.
- **Sorting Algorithms:** Sorting Master – Sort items using Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, and Radix sorts.
- **Heap & Priority Queue:** Heap Priority Queue Master – Build heaps, repair trees, manage queues, and compare heap types.
- **Bit Manipulation:** Bit Manipulation Master – Toggle bits, perform AND/OR/XOR/NOT, and solve bit puzzles.
- **Sliding Window & Two Pointer:** Window Pointer Master – Solve classic sliding window and two-pointer problems interactively.
- **Recursion:** Recursion Realm – Explore recursion with factorials, Fibonacci, Tower of Hanoi, permutations, mazes, fractals, palindromes, and N-Queens.
- **Strings:** Word Wizard Quest – Practice string manipulation, pattern matching, and word puzzles.
- **Trees (Premium):** Tree Game – Visualize and build binary trees, perform traversals, and solve tree-based puzzles.
- **Graphs (Premium):** Graph Game – Learn graph concepts, traversals (BFS/DFS), shortest paths, cycles, and more with visual tools.
- **Dynamic Programming (Comming soon):** Dynamic Programming Game – (Coming Soon) Solve optimization puzzles and master DP techniques.

---

## 4. Tech Stack

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

## 5. Project Structure
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

## 6. Getting Started
1. **Clone the repository:**
   ```bash
   git clone (https://github.com/Vasuaghera/ClimbAlgoMountain)
   cd https://github.com/Vasuaghera/ClimbAlgoMountain)
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

server.js (entry point)
config/ (database, cloud, payment config)
models/ (data structure)
middleware/ (request processing helpers)
controllers/ (business logic)
routes/ (API endpoints)
utils/ (helper functions)
scripts/ (data seeding, etc.)
