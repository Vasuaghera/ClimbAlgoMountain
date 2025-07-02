import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import UserProfile from './components/auth/UserProfile';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import TreasureChestAdventure from './components/games/TreasureChestAdventure';
import WordWizardQuest from './components/games/WordWizardQuest';
import ChainMastersAdventure from './components/games/ChainMastersAdventure';
import StackQueueMaster from './components/games/StackQueueMaster';
import SortingMaster from './components/games/SortingMaster';
import WindowPointerMaster from './components/games/WindowPointerMaster';
import HeapPriorityQueueMaster from './components/games/HeapPriorityQueueMaster';
import BitManipulationMaster from './components/games/BitManipulationMaster';
import RecursionRealm from './components/games/RecursionRealm';
import TreeGame from "./components/games/TreeGame";
import GraphGame from "./components/games/GraphGame";
import DynamicProgrammingGame from './components/games/DynamicProgrammingGame';
import Leaderboard from './components/Leaderboard';
import Friends from "./components/Friends";
import Games from './components/Games';
import PremiumPurchase from './components/PremiumPurchase';
import ForgotPassword from './components/auth/ForgotPassword';
import Rewards from './components/Rewards';
import ForumHome from './components/forum/ForumHome';
import AskQuestion from './components/forum/AskQuestion';
import QuestionDetail from './components/forum/QuestionDetail';
import Chatbot from './components/Chatbot';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import NotFound from './components/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <ScrollToTopButton />
        <div className="w-full min-h-screen bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/games'
              element={
                <ProtectedRoute>
                  <Games/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/premium-purchase"
              element={
                <ProtectedRoute>
                  <PremiumPurchase />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userId"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            {/* Route for the Treasure Chest Adventure game */}
            <Route
              path="/arrays"
              element={
                <ProtectedRoute>
                  <TreasureChestAdventure />
                </ProtectedRoute>
              }
            />
            {/* Route for the Word Wizard's Quest game */}
            <Route
              path="/string-manipulation"
              element={
                <ProtectedRoute>
                  <WordWizardQuest />
                </ProtectedRoute>
              }
            />
            {/* Route for the Chain Master's Adventure game */}
            <Route
              path="/linked-lists"
              element={
                <ProtectedRoute>
                  <ChainMastersAdventure />
                </ProtectedRoute>
              }
            />
            {/* Route for the Stack & Queue Master game */}
            <Route
              path="/stack-&-queue"
              element={
                <ProtectedRoute>
                  <StackQueueMaster />
                </ProtectedRoute>
              }
            />
            {/* Route for the Sorting Master game */}
            <Route
              path="/sorting-algorithms"
              element={
                <ProtectedRoute>
                  <SortingMaster />
                </ProtectedRoute>
              }
            />
            {/* sliding-window-&-two-pointer */}
            <Route
              path="/sliding-window-&-two-pointer"
              element={
                <ProtectedRoute>
                  <WindowPointerMaster />
                </ProtectedRoute>
              }
            />
            {/* Route for the Heap Priority Queue Master game */}
            <Route
              path="/heaps-&-priority-queues"
              element={
                <ProtectedRoute>
                  <HeapPriorityQueueMaster />
                </ProtectedRoute>
              }
            />
            {/* bit-manipulation */}
            <Route
              path="/bit-manipulation"
              element={
                <ProtectedRoute>
                  <BitManipulationMaster />
                </ProtectedRoute>
              }
            />
            {/* Route for the Recursion Realm game */}
            <Route
              path="/recursion"
              element={
                <ProtectedRoute>
                  <RecursionRealm />
                </ProtectedRoute>
              }
            />
            {/* Route for the tree game */}
            <Route
              path="/binary-trees-&-bst"
              element={
                <ProtectedRoute>
                  <TreeGame/>
                </ProtectedRoute>
              }
            />
            {/* Route for the graphs game */}
            <Route
              path="/graphs-&-graph-algorithms"
              element={
                <ProtectedRoute>
                  <GraphGame/>
                </ProtectedRoute>
              }
            />
            {/* Route for the dynamic-programming game */}
            <Route
              path="/dynamic-programming"
              element={
                <ProtectedRoute>
                  <DynamicProgrammingGame/>
                </ProtectedRoute>
              }
            />
            {/* Route for the Leaderboard component */}
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            {/* Friend */}
            <Route 
              path="/friends"
              element={
                <ProtectedRoute>
                  <Friends/>
                </ProtectedRoute>
              }
            />
            {/* Rewards */}
            <Route
              path="/rewards"
              element={
                <ProtectedRoute>
                  <Rewards />
                </ProtectedRoute>
              }
            />
            {/* Redirect root to dashboard if authenticated, otherwise to login */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              }
            />
            {/* Q&A routes */}
            <Route path="/forum" element={<ForumHome />} />
            <Route path="/forum/ask" element={<AskQuestion />} />
            <Route path="/forum/questions/:id" element={<QuestionDetail />} />

            {/* Chatbot route */}
            <Route path="/chatbot" element={<Chatbot />} />

            {/* About Us page */}
            <Route path="/about" element={<AboutUs />} />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 