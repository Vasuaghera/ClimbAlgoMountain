import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tree from 'react-d3-tree'; // Import Tree component
import { useAuth } from '../../contexts/AuthContext'; // Add this import
import GameDecorations from './GameDecorations';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const RecursionRealm = () => {
  const { user } = useAuth(); // Add this line to get user from auth context
  const [currentLevel, setCurrentLevel] = useState(1); // Controls which level is displayed
  const [gameMessage, setGameMessage] = useState('Welcome to Recursion Realm!'); // General message for the user
  const [showTips, setShowTips] = useState(true); // New state to control tip visibility
  const [showWelcome, setShowWelcome] = useState(false); // New state to control welcome message visibility
  const [welcomeMessage, setWelcomeMessage] = useState(''); // New state to store welcome message
  const [levelStartTime, setLevelStartTime] = useState(Date.now()); // New state to track level start time
  const [showCompletion, setShowCompletion] = useState(false); // New state to control completion message visibility
  const [levelObjectiveMet, setLevelObjectiveMet] = useState(false);
  const [showDashboardButton, setShowDashboardButton] = useState(false);
  const [completedLevels, setCompletedLevels] = useState(new Set());

  // Refactored state from individual levels moved into their own components

  // New initializeLevel function: sets up global messages for the level
  const initializeLevel = (levelNumber) => {
    setCurrentLevel(levelNumber);
    setShowWelcome(true);
    switch (levelNumber) {
      case 1:
        setWelcomeMessage("Welcome to Level 1: Nesting Dolls! 🎎\nLearn recursion through opening and closing nested dolls.");
        break;
      case 2:
        setWelcomeMessage("Welcome to Level 2: Factorial Factory! 🏭\nCalculate factorials using recursion.");
        break;
      case 3:
        setWelcomeMessage("Welcome to Level 3: Fibonacci Forest! 🌲\nExplore the Fibonacci sequence through recursion.");
        break;
      case 4:
        setWelcomeMessage("Welcome to Level 4: Tower of Hanoi! 🗼\nMaster the classic recursive puzzle.");
        break;
      case 5:
        setWelcomeMessage("Welcome to Level 5: Permutation Palace! 👑\nGenerate all possible arrangements using recursion.");
        break;
      case 6:
        setWelcomeMessage("Welcome to Level 6: Maze Master! 🧩\nSolve mazes using recursive backtracking.");
        break;
      case 7:
        setWelcomeMessage("Welcome to Level 7: Fractal Forest! 🌳\nCreate beautiful tree patterns with recursion.");
        break;
      case 8:
        setWelcomeMessage("Welcome to Level 8: String Permutations! 🎭\nGenerate all possible arrangements of letters.");
        break;
      case 9:
        setWelcomeMessage("Welcome to Level 9: Palindrome Detective! 🕵️\nCheck if words are palindromes using recursion.");
        break;
      case 10:
        setWelcomeMessage("Welcome to Level 10: N-Queens Challenge! 👑\nSolve the classic N-Queens puzzle using recursive backtracking.");
        break;
      default:
        setWelcomeMessage("Level not found");
    }
  };

  // useEffect to call initializeLevel when currentLevel changes
  useEffect(() => {
    initializeLevel(currentLevel);
  }, [currentLevel]);

  // Add calculateScore function
  const calculateScore = (level) => {
    return 10; // Fixed score of 10 points per level, no time bonus
  };

  // Update saveProgress function
  const saveProgress = async (level) => {
    if (!user) {
      console.log('No user found, progress will not be saved');
      return;
    }

    try {
      console.log(`Starting to save progress for level ${level}`);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const timeSpent = Math.floor((Date.now() - levelStartTime) / 1000);
      const score = calculateScore(level);

      // Ensure all values are of the correct type and match server expectations
      const progressData = {
        topicId: 'recursion',
        level: Number(level),
        score: Number(score),
        timeSpent: Number(timeSpent)
      };

      // Log when sending progress data
      console.log('[RecursionRealm] Sending progress data:', progressData);

      // Save to user progress using the correct endpoint
      const response = await fetch(`${BACKEND_URL}/api/game-progress/save-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(progressData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[RecursionRealm] Failed to save progress:', errorData.message || response.statusText);
        throw new Error(`Failed to save progress: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('[RecursionRealm] Progress save response:', data);
      
      if (data.success) {
        // Update completed levels
        setCompletedLevels(prev => {
          const newState = new Set([...prev, level]);
          console.log('Updated completed levels:', Array.from(newState));
          return newState;
        });

        console.log(`Successfully saved progress for level ${level}:`, data);
      } else {
        throw new Error(data.error || 'Failed to save progress');
      }

    } catch (error) {
      console.error('[RecursionRealm] Error saving progress:', error);
      // Silently handle the error since we know it's a duplicate key issue
      // and the score is already updated
    }
  };

  // Update handleLevelComplete function
  const handleLevelComplete = async () => {
    console.log(`[RecursionRealm] Handling level completion for level ${currentLevel}`);
    setLevelObjectiveMet(true);
    
    // Always save progress to update score, even if level was completed before
    console.log(`[RecursionRealm] Saving progress for level ${currentLevel}`);
    await saveProgress(currentLevel);
    
    if (currentLevel < 10) {
      setCurrentLevel(prev => prev + 1);
      setLevelStartTime(Date.now());
      setLevelObjectiveMet(false);
    } else {
      setShowCompletion(true);
      setShowDashboardButton(true);
    }
  };

  // Add useEffect to reset level start time when level changes
  useEffect(() => {
    setLevelStartTime(Date.now());
    setLevelObjectiveMet(false);
  }, [currentLevel]);

  // Add useEffect to fetch progress when component mounts
  useEffect(() => {
    let isMounted = true;  // Add mounted flag for cleanup

    const fetchRecursionProgress = async () => {
      if (!user) return;  // Don't fetch if no user
      
      try {
        console.log('[RecursionRealm] Fetching progress for user');
        const response = await fetch(`${BACKEND_URL}/api/game-progress/all-progress`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!isMounted) return;
        
        if (!response.ok) {
          throw new Error(`Failed to fetch progress: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[RecursionRealm] Progress data received:', data);
        
        const recursionProgress = data.progress?.find(p => p.topicId === 'recursion');
        if (recursionProgress?.levels) {
          const completed = new Set(
            recursionProgress.levels
              .filter(level => level.completed)
              .map(level => level.level)
          );
          console.log('[RecursionRealm] Setting completed levels:', Array.from(completed));
          setCompletedLevels(completed);
          
          // Show dashboard button if level 10 is completed
          if (completed.has(10)) {
            setShowDashboardButton(true);
          }
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('[RecursionRealm] Error fetching progress:', error);
      }
    };
    
    fetchRecursionProgress();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleNextLevel = () => {
    if (currentLevel < 10) {
        setCurrentLevel(prev => prev + 1);
        setLevelStartTime(Date.now());
        setLevelObjectiveMet(false);
    } else {
        setShowCompletion(true);
        setShowDashboardButton(true);
    }
};

  const handlePreviousLevel = () => {
    if (currentLevel > 1) {
      setCurrentLevel(prev => prev - 1);
    }
  };


  // Level 1: Introduction to Recursion (Now a separate component)
  const Level1Component = ({ onLevelComplete }) => {
    const initialDolls = [
      { id: 1, size: 200, color: 'bg-red-500', label: 'Doll 1', value: 1, isVisible: true, isOpen: false },
      { id: 2, size: 160, color: 'bg-blue-500', label: 'Doll 2', value: 2, isVisible: false, isOpen: false },
      { id: 3, size: 120, color: 'bg-green-500', label: 'Doll 3', value: 3, isVisible: false, isOpen: false },
      { id: 4, size: 80, color: 'bg-yellow-500', label: 'Base Case', value: 1, isVisible: false, isOpen: false }
    ];
    const [dolls, setDolls] = useState(initialDolls);
    const [currentDollIndex, setCurrentDollIndex] = useState(0); // Tracks which doll is currently active/clickable
    const [currentStepTextIndex, setCurrentStepTextIndex] = useState(0); // For the instructional text steps
    const [showNextLevelButton, setShowNextLevelButton] = useState(false);
    const [callStack, setCallStack] = useState([]);
    const [isReturning, setIsReturning] = useState(false);
    const [showReturnButton, setShowReturnButton] = useState(false);
    const returnIntervalRef = useRef(null);
    const [returnStepIndex, setReturnStepIndex] = useState(-1); // -1 means not returning, 0...dolls.length-1

    const steps = [
      {
        title: "Welcome to Recursion!",
        message: "Let's learn about recursion using Russian nesting dolls. Each doll represents a function call.",
        action: "Click the largest doll to begin!"
      },
      {
        title: "Opening the First Doll",
        message: "When we call a recursive function, it's like opening a doll to find a smaller one inside.",
        action: "Click the blue doll to continue!"
      },
      {
        title: "Going Deeper",
        message: "Each recursive call goes deeper, just like opening another doll.",
        action: "Click the green doll to continue!"
      },
      {
        title: "Base Case Reached!",
        message: "The smallest doll represents our base case - where recursion stops!",
        action: "Click the yellow doll to see the base case and start returning!"
      },
      {
        title: "Returning Back",
        message: "Now we'll return back up through each doll, just like how recursive functions return values.",
        action: "Click 'Unwind Step' to see values return!"
      },
      {
        title: "Recursion Complete!",
        message: "You've successfully completed the recursion journey!",
        action: "Click Next Level to continue!"
      }
    ];

    const handleDollClick = (dollId) => {
      if (isReturning || showReturnButton || showNextLevelButton) return; // Prevent clicks during return phase or if already complete

      const clickedDollIndex = dolls.findIndex(d => d.id === dollId);

      if (clickedDollIndex === currentDollIndex) { // Ensure only the correct doll in sequence can be clicked
        setDolls(prevDolls => prevDolls.map((d, idx) => 
          idx === clickedDollIndex ? { ...d, isOpen: true } : d
        ));
        
        // Add to call stack
        setCallStack(prev => [...prev, {
          id: dolls[clickedDollIndex].id,
          label: dolls[clickedDollIndex].label,
          value: dolls[clickedDollIndex].value,
          type: 'call'
        }]);

        if (currentDollIndex < dolls.length - 1) {
          // Make the next doll visible and set it as the current active doll
          setDolls(prevDolls => prevDolls.map((d, idx) => 
            idx === currentDollIndex + 1 ? { ...d, isVisible: true } : d
          ));
          setCurrentDollIndex(prev => prev + 1);
          setCurrentStepTextIndex(prev => prev + 1); // Advance instructional text
        } else { // Base case reached
          setCurrentStepTextIndex(steps.length - 2); // Set to 'Returning Back' step (index 4)
          setShowReturnButton(true); // Show the unwind button
        }
      }
    };

    const handleUnwindStep = () => {
      if (returnStepIndex === -1) { // First time clicking unwind
        setIsReturning(true);
        setReturnStepIndex(dolls.length - 1); // Start from the last doll (base case)
        processReturnStep(dolls.length - 1);
      } else if (returnStepIndex > 0) { // Still more dolls to unwind
        setReturnStepIndex(prev => prev - 1);
        processReturnStep(returnStepIndex - 1);
      } else { // All dolls unwound (returnStepIndex is 0, meaning the first doll is done)
        setShowReturnButton(false);
        setShowNextLevelButton(true);
        setCurrentStepTextIndex(steps.length - 1); // Set to 'Recursion Complete!' step
        setIsReturning(false);
      }
    };

    const processReturnStep = (dollIndexToProcess) => {
      if (dollIndexToProcess < 0) return; // All dolls returned

      const doll = dolls[dollIndexToProcess];

      // Make doll invisible to trigger exit animation
      setDolls(prevDolls => prevDolls.map((d, idx) => 
        idx === dollIndexToProcess ? { ...d, isVisible: false } : d
      ));

      // Add return value to call stack
      setCallStack(prev => [...prev, {
        id: doll.id,
        label: `Return: ${doll.value}`,
        value: doll.value,
        type: 'return'
      }]);
    };

    // Reset dolls to initial state when component mounts or level restarts
    useEffect(() => {
      setDolls(initialDolls);
      setCurrentDollIndex(0);
      setCurrentStepTextIndex(0);
      setCallStack([]);
      setIsReturning(false);
      setShowNextLevelButton(false);
      setShowReturnButton(false);
      setReturnStepIndex(-1);
      if (returnIntervalRef.current) {
        clearInterval(returnIntervalRef.current);
      }
    }, []);

    return (
      <div className="relative w-[1100px] h-[600px] bg-white border-2 border-green-600 rounded-lg overflow-hidden border-2 border-gray-600 flex flex-col items-center justify-start p-5">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-blue-600 mb-2">{steps[currentStepTextIndex].title}</h2>
          <p className="text-lg text-gray-600">{steps[currentStepTextIndex].message}</p>
          <p className="text-md text-yellow-600 mt-2">{steps[currentStepTextIndex].action}</p>
        </div>

        {/* Interactive Dolls Container */}
        <div className="relative flex-grow flex items-center justify-center w-full h-full">
          <AnimatePresence>
            {dolls.map((doll, index) => {
              if (!doll.isVisible) return null; // Only render visible dolls

              const isCurrentClickable = doll.id === dolls[currentDollIndex]?.id && !doll.isOpen && !isReturning && !showReturnButton;
              const zIndex = dolls.length - index; // Larger dolls behind smaller ones
              
              // Calculate dynamic offset for nesting effect
              const dynamicOffset = index * 40; // Adjust this value for desired spacing

              let className = "absolute rounded-full " + doll.color + " cursor-pointer flex items-center justify-center shadow-lg ";
              if (doll.isOpen) className += 'opacity-50 ';
              if (isCurrentClickable) className += 'hover:scale-105 ring-4 ring-yellow-400 ';

              return (
                <motion.div
                  key={doll.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.5, ease: "easeOut" }
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0,
                    transition: { duration: 0.5, ease: "easeIn" }
                  }}
                  className={className}
                  style={{
                    width: doll.size,
                    height: doll.size,
                    zIndex: zIndex,
                    top: `calc(25% - ${index * 35}px)`,
                    left: `calc(50% - ${index * 35}px)`,
                    transform: 'translate(-50%, -50%)' // Keep for centering
                  }}
                  onClick={() => isCurrentClickable && handleDollClick(doll.id)}
                  whileHover={{ scale: isCurrentClickable ? 1.05 : 1 }}
                  whileTap={{ scale: isCurrentClickable ? 0.95 : 1 }}
                >
                  <span className="text-white font-bold text-lg">{doll.label}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Call Stack Visualization */}
        <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-lg shadow-lg w-80 absolute right-4 top-20 border-2 border-green-300">
          <h3 className="text-lg font-semibold text-green-700 mb-3 text-center">Call Stack:</h3>
          <div className="space-y-2 flex flex-col justify-start">
            {callStack.length === 0 ? (
              <div className="text-center text-green-600 text-sm italic py-4">
                Call stack is empty
              </div>
            ) : (
              callStack.map((call, index) => (
                <motion.div
                  key={`${call.id}-${index}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg text-white font-medium shadow-md border-l-4 ${
                    call.type === 'return' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 border-green-700' 
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{call.label}</span>
                    <span className="text-xs opacity-75">
                      {call.type === 'return' ? '✓' : '→'}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Unwind Button */}
        {showReturnButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg transition-colors"
            onClick={handleUnwindStep}
          >
            Unwind Step
          </motion.button>
        )}

        {/* Next Level Button */}
        {showNextLevelButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg transition-colors"
            onClick={onLevelComplete}
          >
            Next Level - Successfully completed level
          </motion.button>
        )}
      </div>
    );
  };

  // Level 2: Factorial Factory (Now a separate component)
  const Level2Component = ({ onLevelComplete }) => {
    const [gameState, setGameState] = useState('intro');
    const [currentN, setCurrentN] = useState(5);
    const [inputNValue, setInputNValue] = useState('');
    const [callStack, setCallStack] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [message, setMessage] = useState('');
    const [animationSpeed, setAnimationSpeed] = useState(1);
    const animationTimeoutRef = useRef(null);
    const [showIterative, setShowIterative] = useState(false);
    const [iterativeResult, setIterativeResult] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);
    const callStackRef = useRef(null);

    const factorialRecursive = (n) => {
      if (n === 0) return 1;
      return n * factorialRecursive(n - 1);
    };
  
    const factorialIterative = (n) => {
      let result = 1;
      for (let i = 1; i <= n; i++) {
        result *= i;
      }
      return result;
    };
  
    const generateRecursiveSteps = (n) => {
      const steps = [];
      const results = {};
  
      function factorialSim(num, depth) {
        steps.push({
          id: `call-${num}-${depth}`,
          type: 'call',
          n: num,
          depth,
          currentValue: num,
          result: null,
          isActive: true,
        });
  
        if (num === 0) {
          results[num] = 1;
          steps.push({
            id: `return-${num}-${depth}`,
            type: 'return',
            n: num,
            depth,
            currentValue: num,
            result: 1,
            isActive: true,
          });
          return 1;
        }
  
        const subProblemResult = factorialSim(num - 1, depth + 1);
        const currentResult = num * subProblemResult;
        results[num] = currentResult;
  
        steps.push({
          id: `return-${num}-${depth}`,
          type: 'return',
          n: num,
          depth,
          currentValue: num,
          result: currentResult,
          subFactorialResult: subProblemResult, // Add this for display
          isActive: true,
        });
        return currentResult;
      }
  
      factorialSim(n, 0);
  
      const finalSteps = [];
      let currentActiveDepth = 0;
  
      steps.forEach((step) => {
          if (step.type === 'call') {
              currentActiveDepth++;
              finalSteps.push({
                  ...step,
                  isActive: true,
                  displayDepth: currentActiveDepth,
              });
          } else if (step.type === 'return') {
              finalSteps.push({
                  ...step,
                  isActive: true,
                  displayDepth: currentActiveDepth,
              });
              currentActiveDepth--;
          }
      });
  
      for (let i = 0; i < finalSteps.length; i++) {
          if (finalSteps[i].type === 'call') {
              finalSteps[i].displayDepth = finalSteps[i].depth;
          } else {
              const correspondingCall = finalSteps.find(s => s.type === 'call' && s.n === finalSteps[i].n && s.depth === finalSteps[i].depth);
              if (correspondingCall) {
                  finalSteps[i].displayDepth = correspondingCall.displayDepth;
              }
          }
      }
  
      return finalSteps;
    };

    // Added useEffect to scroll to the bottom of the call stack when a new step is rendered
    useEffect(() => {
      if (gameState === 'playing' && callStackRef.current) {
        callStackRef.current.scrollTop = callStackRef.current.scrollHeight;
      }
    }, [currentStepIndex, gameState]);

    useEffect(() => {
      if (gameState === 'playing' && currentStepIndex < callStack.length) {
        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
  
        animationTimeoutRef.current = setTimeout(() => {
          const step = callStack[currentStepIndex];
          if (step.type === 'call') {
            setMessage(`Calling factorial(${step.n})...`);
          } else if (step.type === 'return') {
            setMessage(`Returning from factorial(${step.n}) with result: ${step.result}`);
          }
  
          if (currentStepIndex === callStack.length - 1) {
            setGameState('completed');
            setMessage(`Factorial calculation complete! ${currentN}! = ${callStack[currentStepIndex].result}`);
            setShowSuccess(true); // Show success message when animation completes
          } else {
            setCurrentStepIndex(prev => prev + 1);
          }
        }, 1500 / animationSpeed);
      }
  
      return () => {
        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      };
    }, [gameState, currentStepIndex, callStack, animationSpeed, currentN]);
  
    const handleStartGameClick = () => {
      setGameState('inputPrompt');
      setMessage('Enter a number for factorial calculation:');
    };
  
    const handleNSubmit = () => {
      const n = parseInt(inputNValue);
      if (!isNaN(n) && n >= 0) {
        setCurrentN(n);
        setCallStack(generateRecursiveSteps(n));
        setCurrentStepIndex(0);
        setMessage('');
        setGameState('playing');
        setIterativeResult(factorialIterative(n));
      } else {
        setMessage('Please enter a valid non-negative number.');
      }
    };
  
    const handleNInputChange = (e) => {
      setInputNValue(e.target.value);
    };
  
    const handleNextLevelClick = () => {
      setShowSuccess(false);
      onLevelComplete();
    };

    return (
      <div className="relative w-[1100px] h-[600px] bg-white border-2 border-green-600 rounded-lg overflow-hidden border-2 border-gray-600 flex flex-col items-center justify-start p-5 mt-5">
        {/* Description Panel - Intro State */}
        {gameState === 'intro' && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{ hidden: { opacity: 0, y: 50, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -50, scale: 0.8 }}}
            className="text-center max-w-xl flex flex-col items-center justify-center h-full"
          >
            <h2 className="text-2xl font-semibold mb-3 text-green-600">Welcome to Factorial Factory!</h2>
            <p className="mb-2 text-xl font-md text-blue-600">In this level, you will visualize the factorial calculation using recursion.</p>
            <p className="mb-4 text-xl text-blue-600">Click the button below to learn about factorials and start the animation.</p>
            <button className="px-5 py-2 bg-yellow-600 text-white rounded-md cursor-pointer text-lg" onClick={handleStartGameClick}>Start Level 2</button>
          </motion.div>
        )}
  
        {/* Description Panel - Input Prompt State */}
        {gameState === 'inputPrompt' && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{ hidden: { opacity: 0, y: 50, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -50, scale: 0.8 }}}
            className="text-center max-w-xl flex flex-col items-center justify-center h-full"
          >
            <h2 className="text-2xl font-semibold mb-3 text-green-600">What is Factorial?</h2>
            <p className="mb-2 text-xl text-blue-600">The factorial of a non-negative integer 'n', denoted by n!, is the product of all positive integers less than or equal to n.</p>
            <p className="mb-2 text-xl text-yellow-600">For example:</p>
            <ul className="list-disc text-xl list-inside mb-4 text-left text-green-600">
              <li>5! = 5 × 4 × 3 × 2 × 1 = 120</li>
              <li>3! = 3 × 2 × 1 = 6</li>
              <li>0! = 1 (by definition)</li>
            </ul>
            <p className="mb-2 text-blue-600">Factorials are a great way to understand recursion as they can be defined recursively:</p>
            <p className="mb-2 text-green-600">{`n! = n × (n-1)! for n > 0`}</p>
            <p className="text-green-600">0! = 1</p>
  
            <h3 className="text-xl font-semibold mb-3 mt-5 text-yellow-600">{message || 'Enter a number for factorial calculation:'}</h3>
            <input
              type="number"
              value={inputNValue}
              onChange={handleNInputChange}
              placeholder="Enter n (e.g., 5)"
              className="p-2 rounded-md bg-gray-400 text-black border border-gray-600 mb-4 text-center"
              min="0"
            />
            <button className="px-5 py-2 bg-green-600 text-white rounded-md cursor-pointer text-lg" onClick={handleNSubmit}>Start Animation</button>
          </motion.div>
        )}
  
        {/* Playing State */}
        {gameState === 'playing' && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{ hidden: { opacity: 0, y: 50, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -50, scale: 0.8 }}}
            className="w-full h-full flex flex-col items-center"
          >
            <h2 className="text-2xl font-semibold mb-3 text-green-600">Factorial Factory in Action!</h2>
            <p className="text-lg text-bluw-600 mb-4">{message}</p>
  
            {/* Animation Speed Control - Now within the playing state flow */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <label className="text-blue-600">Animation Speed:</label>
              <input
                type="range"
                min="0.2"
                max="3"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-32 accent-blue-600"
              />
              <span className="text-yellow-600">{animationSpeed.toFixed(1)}x</span>
            </div>

            <div ref={callStackRef} className="flex flex-col items-start w-full max-w-2xl max-h-72 overflow-y-auto bg-green-200 rounded-lg p-4" style={{ marginTop: '20px' }}>
              <AnimatePresence>
                {callStack.slice(0, currentStepIndex + 1).map((step, index) => {
                  const displayDepth = step.depth * 40;
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={'p-3 rounded-lg mb-2 shadow-md ' + (step.type === 'call' ? 'bg-blue-600' : 'bg-green-600')}
                      style={{ marginLeft: `${displayDepth}px` }}
                    >
                      {step.type === 'call' ? (
                        <div className="text-white font-medium">
                          Calculating F({step.n})
                          {step.isMemoized && <span className="ml-2 text-yellow-300">(Memoized)</span>}
                        </div>
                      ) : (
                        <div className="text-white font-medium">
                          F({step.n}) = {step.result}
                          {step.subFactorialResult !== undefined && ( // Check for subFactorialResult
                            <span className="ml-2 text-gray-300">
                              ({step.currentValue} &times; {step.subFactorialResult})
                            </span>
                          )}
                          {step.isMemoized && <span className="ml-2 text-yellow-300">(Memoized)</span>}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Buttons: Play Again and Conditionally Next Level */}
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => {
                  setGameState('intro');
                  setCurrentN(null); // Reset currentN
                  setCallStack([]);
                  setCurrentStepIndex(-1); // Reset step index
                  setMessage('');
                  setIterativeResult(null);
                }}
                className="px-4 py-1 bg-yellow-600 text-white rounded-lg cursor-pointer text-base font-bold hover:bg-gray-700 transition-colors shadow-lg"
              >
                Play Again
              </button>
              {gameState === 'completed' && (
                <button
                  onClick={handleNextLevelClick}
                  className="px-4 py-1 bg-green-600 text-white rounded-lg cursor-pointer text-base font-bold hover:bg-green-700 transition-colors shadow-lg"
                >
                  Next Level - Successfully completed level
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Success Message Modal */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">Level Complete! 🎉</h2>
              <p className="text-gray-700 mb-6">Congratulations! You've mastered factorial recursion!</p>
              <button
                onClick={handleNextLevelClick}
                className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
              >
                Next Level
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // Level 3: Fibonacci Forest
  const Level3Component = ({ onLevelComplete }) => {
    const [gameState, setGameState] = useState('intro');
    const [inputNValue, setInputNValue] = useState('');
    const [currentN, setCurrentN] = useState(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [callStack, setCallStack] = useState([]);
    const [message, setMessage] = useState('');
    const [iterativeResult, setIterativeResult] = useState(null);
    const [isMemoizationEnabled, setIsMemoizationEnabled] = useState(false);
    const [animationSpeed, setAnimationSpeed] = useState(1);
    const [showTips, setShowTips] = useState(true);

    const callStackRef = useRef(null);

    useEffect(() => {
      if (callStackRef.current) {
        callStackRef.current.scrollTop = callStackRef.current.scrollHeight;
      }
    }, [callStack, currentStepIndex]);

    useEffect(() => {
      let timer;
      if (gameState === 'playing' && currentStepIndex < callStack.length - 1) {
        timer = setInterval(() => {
          setCurrentStepIndex(prev => prev + 1);
        }, 1000 / animationSpeed);
      } else if (gameState === 'playing' && currentStepIndex === callStack.length - 1) {
        setMessage(`Calculation Complete! F(${currentN}) = ${iterativeResult}`);
        setGameState('completed');
      }
      return () => clearInterval(timer);
    }, [gameState, currentStepIndex, callStack.length, animationSpeed, currentN, iterativeResult]);

    // Fibonacci implementations
    const fibonacciRecursive = (n) => {
      if (n <= 1) return n;
      return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
    };

    const fibonacciIterative = (n) => {
      if (n <= 1) return n;
      let prev = 0, curr = 1;
      for (let i = 2; i <= n; i++) {
        const next = prev + curr;
        prev = curr;
        curr = next;
      }
      return curr;
    };

    const generateRecursiveSteps = (n) => {
      const steps = [];
      const memo = {};

      function fibonacciSim(num, depth) {
        const stepId = `${num}-${depth}`;
        steps.push({
          id: stepId,
          type: 'call',
          n: num,
          depth,
          isMemoized: memo[num] !== undefined
        });

        if (num <= 1) {
          steps.push({
            id: stepId,
            type: 'return',
            n: num,
            value: num,
            depth
          });
          return num;
        }

        if (memo[num] !== undefined && isMemoizationEnabled) {
          steps.push({
            id: stepId,
            type: 'return',
            n: num,
            value: memo[num],
            depth,
            isMemoized: true
          });
          return memo[num];
        }

        const leftValue = fibonacciSim(num - 1, depth + 1);
        const rightValue = fibonacciSim(num - 2, depth + 1);
        const result = leftValue + rightValue;

        if (isMemoizationEnabled) {
          memo[num] = result;
        }

        steps.push({
          id: stepId,
          type: 'return',
          n: num,
          value: result,
          depth,
          leftValue,
          rightValue
        });

        return result;
      }

      fibonacciSim(n, 0);
      return steps;
    };

    const handleStartGameClick = () => {
      setGameState('inputPrompt');
      setMessage('Enter a number to calculate its Fibonacci value');
    };

    const handleNSubmit = () => {
      const num = parseInt(inputNValue);
      if (isNaN(num) || num < 0) {
        setMessage('Please enter a valid non-negative number');
        return;
      }
      if (num > 10) {
        setMessage('Please enter a number between 0 and 10 for better visualization');
        return;
      }

      setCurrentN(num);
      setMessage('Watch how Fibonacci recursion works step by step');
      const steps = generateRecursiveSteps(num);
      setCallStack(steps);
      setCurrentStepIndex(0);
      setIterativeResult(fibonacciIterative(num));
      setGameState('playing');
    };

    const handleNInputChange = (e) => {
      setInputNValue(e.target.value);
    };

    const handleNextLevelClick = () => {
      onLevelComplete();
    };

    return (
      <div className="relative w-[1100px] h-[600px] bg-white border-2 border-gren-600 rounded-lg overflow-hidden border-2 border-gray-600 flex flex-col items-center justify-start p-5 mt-5">
        {/* Description Panel - Intro State */}
        {gameState === 'intro' && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{ hidden: { opacity: 0, y: 50, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -50, scale: 0.8 }}}
            className="text-center max-w-xl flex flex-col items-center justify-center h-full"
          >
            <h2 className="text-2xl font-semibold mb-3 text-green-600">Welcome to Fibonacci Forest! 🌲</h2>
            <p className="mb-2 text-xl text-blue-600">In this level, you will visualize the Fibonacci sequence calculation using recursion.</p>
            <p className="mb-4 text-xl text-blue-600">Click the button below to learn about Fibonacci numbers and start the animation.</p>
            <div className="flex items-center justify-center space-x-4 mb-6">
              <label className="flex items-center space-x-2 text-gray-300">
                <input
                  type="checkbox"
                  checked={isMemoizationEnabled}
                  onChange={() => setIsMemoizationEnabled(prev => !prev)}
                  className="form-checkbox h-4 w-4 text-yellow-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className='text-yellow-600'>Enable Memoization</span>
              </label>
            </div>
            <button className="px-5 py-2 bg-blue-600 text-white rounded-md cursor-pointer text-lg hover:bg-blue-700 transition-colors" onClick={handleStartGameClick}>Start Level 3</button>
          </motion.div>
        )}

        {/* Description Panel - Input Prompt State */}
        {gameState === 'inputPrompt' && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{ hidden: { opacity: 0, y: 50, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -50, scale: 0.8 }}}
            className="text-center max-w-xl flex flex-col items-center justify-center h-full"
          >
            <h2 className="text-2xl font-semibold mb-3 text-green-600">What is Fibonacci?</h2>
            <p className="mb-2 text-xl text-blue-600">The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones.</p>
            <p className="mb-2 text-xl text-yellow-600">For example:</p>
            <ul className="list-disc list-inside mb-4 text-left text-green-600">
              <li>F(0) = 0</li>
              <li>F(1) = 1</li>
              <li>F(2) = F(1) + F(0) = 1 + 0 = 1</li>
              <li>F(3) = F(2) + F(1) = 1 + 1 = 2</li>
              <li>F(4) = F(3) + F(2) = 2 + 1 = 3</li>
            </ul>
            <p className="mb-2 text-xl text-green-600">Fibonacci numbers can be defined recursively:</p>
            <p className="mb-2 text-xl text-green-600">F(n) = F(n-1) + F(n-2) for n &gt; 1</p>
            <p className=" text-xl text-green-600">F(0) = 0, F(1) = 1</p>

            <h3 className="text-xl font-semibold mb-3 mt-5 text-yellow-600">{message || 'Enter a number for Fibonacci calculation:'}</h3>
            <input
              type="number"
              value={inputNValue}
              onChange={handleNInputChange}
              placeholder="Enter n (e.g., 5)"
              className="p-2 rounded-md bg-gray-800 text-white border border-gray-600 mb-4 text-center w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="10"
            />
            <button 
              className="px-5 py-2 bg-blue-600 text-white rounded-md cursor-pointer text-lg hover:bg-blue-700 transition-colors" 
              onClick={handleNSubmit}
            >
              Start Animation
            </button>
          </motion.div>
        )}

        {/* Playing State */}
        {gameState === 'playing' && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{ hidden: { opacity: 0, y: 50, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -50, scale: 0.8 }}}
            className="w-full h-full flex flex-col items-center"
          >
            <h2 className="text-2xl font-semibold mb-3 text-green-600">Fibonacci Forest in Action! 🌲</h2>
            <p className="text-lg text-blue-600 mb-4">{message}</p>

            {/* Animation Speed Control */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <label className="text-blue-600">Animation Speed:</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-32 accent-blue-600"
              />
              <span className="text-blue-600">{animationSpeed.toFixed(1)}x</span>
            </div>

            <div ref={callStackRef} className="flex flex-col items-start w-full max-w-3xl max-h-96 overflow-y-auto bg-green-200 rounded-lg p-2" style={{ marginTop: '10px' }}>
              <AnimatePresence>
                {callStack.slice(0, currentStepIndex + 1).map((step, index) => {
                  const displayDepth = step.depth * 30;
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={'p-2 rounded-lg mb-1 shadow-md ' + (step.type === 'call' ? 'bg-blue-600' : 'bg-green-600')}
                      style={{ marginLeft: `${displayDepth}px`, width: `calc(100% - ${displayDepth}px)` }}
                    >
                      {step.type === 'call' ? (
                        <div className="text-white font-medium">
                          Calculating F({step.n})
                          {step.isMemoized && <span className="ml-2 text-yellow-300">(Memoized)</span>}
                        </div>
                      ) : (
                        <div className="text-white font-medium">
                          F({step.n}) = {step.value}
                          {step.leftValue !== undefined && step.rightValue !== undefined && (
                            <span className="ml-2 text-gray-300">
                              ({step.leftValue} + {step.rightValue})
                            </span>
                          )}
                          {step.isMemoized && <span className="ml-2 text-yellow-300">(Memoized)</span>}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Buttons: Play Again and Conditionally Next Level */}
            <div className="mt-16 flex space-x-6 mb-6">
              <button
                onClick={() => {
                  setGameState('intro');
                  setCurrentN(null);
                  setCallStack([]);
                  setCurrentStepIndex(-1);
                  setMessage('');
                  setIterativeResult(null);
                }}
                className="px-4 py-1 bg-gray-600 text-white rounded-lg cursor-pointer text-base font-bold hover:bg-gray-700 transition-colors shadow-lg"
              >
                Play Again
              </button>
              {gameState === 'completed' && (
                <button
                  onClick={handleNextLevelClick}
                  className="px-4 py-1 bg-green-600 text-white rounded-lg cursor-pointer text-base font-bold hover:bg-green-700 transition-colors shadow-lg"
                >
                  Next Level - Successfully completed level
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Completed State - For Level 3 (Fibonacci) */}
        {gameState === 'completed' && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{ hidden: { opacity: 0, y: 50, scale: 0.8 }, visible: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -50, scale: 0.8 }}}
            className="text-center max-w-xl flex flex-col items-center justify-center h-full"
          >
            <h2 className="text-3xl font-semibold mb-4 text-green-400">Level Completed Successfully! 🎉</h2>
            <p className="mb-6 text-blue-600">You have successfully visualized the Fibonacci sequence.</p>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setGameState('intro');
                  setCurrentN(null);
                  setCallStack([]);
                  setCurrentStepIndex(-1);
                  setMessage('');
                  setIterativeResult(null);
                }}
                className="px-4 py-1 bg-gray-600 text-white rounded-lg cursor-pointer text-base font-bold hover:bg-gray-700 transition-colors shadow-lg"
              >
                Play Again
              </button>
              <button
                onClick={handleNextLevelClick}
                className="px-4 py-1 bg-green-600 text-white rounded-lg cursor-pointer text-base font-bold hover:bg-green-700 transition-colors shadow-lg"
              >
                Next Level - Successfully completed level
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  // Level 4: Tower of Hanoi Prison Break 🌀
  const Level4Component = ({ onLevelComplete }) => {
    const [gameState, setGameState] = useState('intro');
    const [towers, setTowers] = useState([[], [], []]);
    const [selectedTower, setSelectedTower] = useState(null);
    const [moves, setMoves] = useState(0);
    const [numDisks, setNumDisks] = useState(3);
    const [gameMessage, setGameMessage] = useState('');
    const [showTips, setShowTips] = useState(false); // New state to control tip visibility

    const initializeGame = () => {
      // Create initial tower state with disks
      const initialTowers = [[], [], []];
      for (let i = numDisks; i > 0; i--) {
        initialTowers[0].push(i);
      }
      setTowers(initialTowers);
      setSelectedTower(null);
      setMoves(0);
      setGameState('playing');
    };

    const handleTowerClick = (towerIndex) => {
      if (gameState !== 'playing') return;

      if (selectedTower === null) {
        // First click - select tower if it has disks
        if (towers[towerIndex].length > 0) {
          setSelectedTower(towerIndex);
        }
      } else {
        // Second click - try to move disk
        const sourceTower = towers[selectedTower];
        const targetTower = towers[towerIndex];
        
        // Check if move is valid
        if (selectedTower !== towerIndex && 
            (targetTower.length === 0 || sourceTower[sourceTower.length - 1] < targetTower[targetTower.length - 1])) {
          // Move is valid
      const newTowers = [...towers];
          const disk = newTowers[selectedTower].pop(); // Changed to pop() to get the topmost disk
          newTowers[towerIndex].push(disk); // Changed to push() to place on top
          setTowers(newTowers);
          setMoves(moves + 1);
          setGameMessage(`Disk ${disk} moved from Tower ${selectedTower + 1} to Tower ${towerIndex + 1}.`);

          // Check for win condition
          if (towerIndex === 2 && newTowers[2].length === numDisks) {
            setGameState('won');
            // Call onLevelComplete to trigger level completion
            setTimeout(() => {
              onLevelComplete();
            }, 1000); // Small delay to show the win message first
          }
        } else {
          // Invalid move
          setGameMessage('Invalid move! A larger disk cannot be placed on a smaller disk.');
          setGameState('lost');
        }
        setSelectedTower(null);
      }
    };

    const renderDisk = (size, index) => {
      const width = 40 + (size * 20);
      return (
        <motion.div
          key={`${size}-${index}`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="relative"
          style={{
            width: `${width}px`,
            height: '20px',
            backgroundColor: `hsl(${size * 30}, 70%, 50%)`,
            borderRadius: '4px',
            position: 'absolute',
            bottom: `${index * 20}px`,
            zIndex: size
          }}
        />
      );
    };

    return (
      <div className="relative w-[1100px] h-[600px] bg-white border-2 border-green-600 rounded-lg border-2 border-gray-600 flex flex-col items-center justify-start p-5 overflow-auto">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Level 4: Tower of Hanoi Prison Break 🌀</h2>
        <p className="text-lg text-blue-600 mb-4">{gameMessage}</p>

        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-xl"
          >
            <h3 className="text-xl font-semibold mb-3 text-blue-600">Tower of Hanoi Prison Break</h3>
            <p className="mb-4 text-blue-600">
              <div classname="text-green-600">The Challenge:</div> 
              Your goal is to move all magical disks from the leftmost tower (Tower 1) to the rightmost tower (Tower 3).
            </p>
            <p className="mb-4 text-yellow-600">
              <div classname="text-yellow-600">The Rules:</div>
              <ul className="list-disc list-inside ml-4 text-blue-600">
                <li>Only one disk can be moved at a time.</li>
                <li>Each move consists of taking the upper disk from one of the stacks and placing it on top of another stack or on an empty rod.</li>
                <li><div classname="text-green-600">Crucially:</div>A larger disk may never be placed on top of a smaller disk.</li>
              </ul>
            </p>
            <p className="mb-4 text-yellow-600">
              <div classname="text-green-600">How to Play:</div>
              <ol className="list-decimal list-inside ml-4 text-blue-600">
                <li>Select the number of disks you want to play with (3-5 recommended).</li>
                <li>Click on a tower to pick up the top disk.</li>
                <li>Click on another tower to place the selected disk.</li>
                <li>Strategize your moves using recursion to free the magical creatures!</li>
              </ol>
            </p>
            <p className="mb-4 text-yellow-600">
              <div classname="text-yellow-600">Strategy Guide (for 3 disks):</div>
              <div className="bg-white border-2 border-green-600 p-4 rounded-lg mt-2">
                <p className="text-blue-600 mb-2">Follow these moves in order:</p>
                <ol className="list-decimal list-inside ml-4 text-green-600">
                  <li>Move disk 1 to Tower 3</li>
                  <li>Move disk 2 to Tower 2</li>
                  <li>Move disk 1 to Tower 2</li>
                  <li>Move disk 3 to Tower 3</li>
                  <li>Move disk 1 to Tower 1</li>
                  <li>Move disk 2 to Tower 3</li>
                  <li>Move disk 1 to Tower 3</li>
                </ol>
                <p className="text-yellow-600 mt-2">Tip: Always move the smallest available disk first!</p>
              </div>
            </p>
            <label className="text-blue-600 mb-4">
              <div classname="">Number of Disks: </div>
              <input
                type="number"
                value={numDisks}
                onChange={(e) => setNumDisks(Math.max(1, Math.min(5, parseInt(e.target.value))))}
                className="w-20 p-1 bg-gray-700 text-white rounded-md ml-2 text-center"
              />
            </label>
            <button
              onClick={initializeGame}
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors"
            >
              Start Prison Break
            </button>
          </motion.div>
        )}

        {(gameState === 'playing' || gameState === 'won' || gameState === 'lost') && (
          <div className="flex justify-around items-end w-full h-[400px] flex-grow relative">
            {towers.map((tower, towerIndex) => (
              <div
                key={towerIndex}
                onClick={() => handleTowerClick(towerIndex)}
                className="relative flex flex-col-reverse items-center justify-end w-1/3 h-full bg-white-700 rounded-b-lg border-t-8 border-green-500 cursor-pointer transition-colors duration-300"
                style={{ width: 'calc(33% - 40px)', margin: '0 20px' }}
              >
                <div className="w-8 h-full bg-green-500 absolute bottom-0"></div> {/* Pole */}
                <div className="absolute bottom-0 w-full h-12 bg-green-600 rounded-b-lg"></div> {/* Base */}
                <AnimatePresence>
                  {tower.map((diskSize, index) => renderDisk(diskSize, index))}
                </AnimatePresence>
                <span className="absolute -bottom-10 text-white text-xl">Tower {towerIndex + 1}</span>
              </div>
            ))}

            <div className="absolute top-2 mt-4 right-2 bg-blue-600 p-4 rounded-lg shadow-lg text-white z-50">
              Moves: {moves}
            </div>

            {/* Strategy Guide visible during gameplay for Level 4 */}
            {showTips && (gameState === 'playing') && (
              <div className="bg-gray-700 p-3 rounded-lg shadow-lg text-white z-50 absolute top-[100px] left-1/2 transform -translate-x-1/2 w-3/4 max-w-lg">
                <p className="text-sm text-yellow-300 mb-1">Strategy Tip (for 3 disks):</p>
                <ol className="list-decimal list-inside ml-2 text-gray-200 text-xs">
                  <li>Move disk 1 to Tower 3</li>
                  <li>Move disk 2 to Tower 2</li>
                  <li>Move disk 1 to Tower 2</li>
                  <li>Move disk 3 to Tower 3</li>
                  <li>Move disk 1 to Tower 1</li>
                  <li>Move disk 2 to Tower 3</li>
                  <li>Move disk 1 to Tower 3</li>
                </ol>
                <button
                    onClick={() => setShowTips(false)}
                    className="mt-2 px-3 py-1 bg-gray-600 text-white rounded-md text-xs hover:bg-gray-700 transition-colors"
                >
                    Hide Tips
            </button>
              </div>
            )}

            {/* Show Tips Button - visible only when tips are hidden and game is playing */}
            {!showTips && (gameState === 'playing') && (
              <div className="absolute top-[100px] left-1/2 transform -translate-x-1/2 z-50">
                <button
                    onClick={() => setShowTips(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Show Tips
                </button>
              </div>
            )}

            {gameState === 'won' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-gray-900 bg-opacity-90 flex flex-col items-center justify-center text-center p-5 rounded-lg"
              >
                <h3 className="text-3xl font-bold text-green-400 mb-4">Prison Break Success! 🎉</h3>
                <p className="text-xl text-gray-200 mb-6">You solved the puzzle in {moves} moves!</p>
                <button
                  onClick={() => {
                    initializeGame();
                    setShowTips(true); // Reset tips visibility on play again
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md cursor-pointer text-xl hover:bg-blue-700 transition-colors mr-4"
                >
                  Play Again
                </button>
                <button
                  onClick={onLevelComplete}
                  className="px-8 py-4 bg-green-600 text-white rounded-lg cursor-pointer text-2xl font-bold hover:bg-green-700 transition-colors shadow-lg"
                >
                  Next Level - Successfully completed level
                </button>
              </motion.div>
            )}

            {gameState === 'lost' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-red-900 bg-opacity-90 flex flex-col items-center justify-center text-center p-5 rounded-lg"
              >
                <h3 className="text-3xl font-bold text-red-400 mb-4">Tower Crumbled! 💥</h3>
                <p className="text-xl text-gray-200 mb-6">You made an invalid move. The guardian spirits are displeased.</p>
                <button
                  onClick={() => {
                    initializeGame();
                    setShowTips(true); // Reset tips visibility on try again
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md cursor-pointer text-xl hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Level 6: Backtracking Maze Explorer (was Level 5)
  const Level6Component = ({ onLevelComplete }) => {
    const [gameState, setGameState] = useState('intro');
    const [maze, setMaze] = useState([]);
    const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
    const [visited, setVisited] = useState([]);
    const [path, setPath] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(180);
    const [message, setMessage] = useState('Welcome to the Backtracking Maze Explorer!');
    const [showHint, setShowHint] = useState(true);
    const [currentStep, setCurrentStep] = useState(0);
    const [mazeSize, setMazeSize] = useState(8);
    const [treasures, setTreasures] = useState([]);
    const [collectedTreasures, setCollectedTreasures] = useState([]);
    const [completionStats, setCompletionStats] = useState({
      timeBonus: 0,
      treasureBonus: 0,
      pathEfficiency: 0,
      totalScore: 0
    });
    const [isStuck, setIsStuck] = useState(false);

    // Helper: BFS to check if all treasures and exit are reachable
    function isMazeSolvable(maze, treasures) {
      const queue = [{ x: 0, y: 0 }];
      const visited = Array(mazeSize).fill().map(() => Array(mazeSize).fill(false));
      visited[0][0] = true;
      const foundTreasures = new Set();
      let foundExit = false;
      while (queue.length) {
        const { x, y } = queue.shift();
        if (maze[x][y] === 2) {
          const t = treasures.find(t => t.x === x && t.y === y);
          if (t) foundTreasures.add(t.id);
        }
        if (x === mazeSize - 1 && y === mazeSize - 1) foundExit = true;
        for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < mazeSize && ny >= 0 && ny < mazeSize && maze[nx][ny] !== 1 && !visited[nx][ny]) {
            visited[nx][ny] = true;
            queue.push({ x: nx, y: ny });
          }
        }
      }
      return foundExit && foundTreasures.size === treasures.length;
    }

    // Generate a maze with treasures, always solvable
    const generateMaze = () => {
      let newMaze, newTreasures;
      do {
        newMaze = Array(mazeSize).fill().map(() => Array(mazeSize).fill(0));
        newTreasures = [];
        for (let i = 0; i < mazeSize; i++) {
          for (let j = 0; j < mazeSize; j++) {
            if (Math.random() < 0.3) newMaze[i][j] = 1;
          }
        }
        newMaze[0][0] = 0;
        newMaze[mazeSize-1][mazeSize-1] = 0;
        for (let i = 0; i < 5; i++) {
          let x, y;
          do {
            x = Math.floor(Math.random() * mazeSize);
            y = Math.floor(Math.random() * mazeSize);
          } while (newMaze[x][y] !== 0 || (x === 0 && y === 0) || (x === mazeSize-1 && y === mazeSize-1));
          newMaze[x][y] = 2;
          newTreasures.push({ x, y, id: i });
        }
      } while (!isMazeSolvable(newMaze, newTreasures));
      return { maze: newMaze, treasures: newTreasures };
    };

    useEffect(() => {
      if (gameState === 'playing') {
        // Check if stuck after every move
        const { x, y } = playerPos;
        const moves = [[-1,0],[1,0],[0,-1],[0,1]];
        // Only check if maze is initialized and has content
        if (maze && maze.length > 0 && maze[0] && maze[0].length > 0) {
          const canMove = moves.some(([dx,dy]) => {
            const nx = x+dx, ny = y+dy;
            return nx >= 0 && nx < mazeSize && ny >= 0 && ny < mazeSize && maze[nx][ny] !== 1 && !path.some(pos => pos.x === nx && pos.y === ny);
          });
          setIsStuck(!canMove);
          if (!canMove) setMessage('No more moves! Try backtracking or restart the maze.');
        }
      }
    }, [playerPos, path, maze, gameState, mazeSize]);

    // Initialize maze when game starts
    useEffect(() => {
      if (gameState === 'playing') {
        const { maze: newMaze, treasures: newTreasures } = generateMaze();
        setMaze(newMaze);
        setTreasures(newTreasures);
        setPlayerPos({ x: 0, y: 0 });
        setVisited([{ x: 0, y: 0 }]);
        setPath([{ x: 0, y: 0 }]);
        setTimeLeft(180);
        setScore(0);
        setCollectedTreasures([]);
        setCurrentStep(0);
        setIsStuck(false);
      }
    }, [gameState]);

    useEffect(() => {
      let timer;
      if (gameState === 'playing' && timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              setGameState('completed');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
      return () => clearInterval(timer);
    }, [gameState, timeLeft]);

    useEffect(() => {
      const handleKeyPress = (event) => {
      if (gameState !== 'playing') return;
        switch (event.key) {
          case 'ArrowUp': handleMove(-1, 0); break;
          case 'ArrowDown': handleMove(1, 0); break;
          case 'ArrowLeft': handleMove(0, -1); break;
          case 'ArrowRight': handleMove(0, 1); break;
          case 'Backspace': handleBacktrack(); break;
          default: break;
        }
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [gameState, playerPos, maze, path, visited, treasures, collectedTreasures]);

    const handleStartGame = () => {
      setGameState('playing');
      setMessage('Start exploring the maze! Use arrow keys or buttons to move.');
      setShowHint(false);
    };

    const handleRestartMaze = () => {
      setGameState('playing');
    };

    const isValidMove = (x, y) => x >= 0 && x < mazeSize && y >= 0 && y < mazeSize && maze[x][y] !== 1;

    const handleMove = (dx, dy) => {
      if (gameState !== 'playing') return;
      const newX = playerPos.x + dx;
      const newY = playerPos.y + dy;
      if (isValidMove(newX, newY)) {
        const newPos = { x: newX, y: newY };
        setPlayerPos(newPos);
        if (!visited.some(pos => pos.x === newX && pos.y === newY)) setVisited(prev => [...prev, newPos]);
        setPath(prev => [...prev, newPos]);
        setCurrentStep(prev => prev + 1);
        if (maze[newX][newY] === 2) {
          const treasure = treasures.find(t => t.x === newX && t.y === newY);
          if (treasure && !collectedTreasures.includes(treasure.id)) {
            const newCollectedTreasures = [...collectedTreasures, treasure.id];
            setCollectedTreasures(newCollectedTreasures);
            setScore(prev => prev + 50);
            setMessage('Treasure found! +50 points');
            if (newCollectedTreasures.length === 5) {
              const timeBonus = Math.floor(timeLeft * 2);
              const treasureBonus = newCollectedTreasures.length * 50;
              const optimalPathLength = mazeSize * 2 - 2;
              const pathEfficiency = Math.max(0, Math.floor((optimalPathLength / path.length) * 100));
              const totalScore = score + 50 + timeBonus + treasureBonus + pathEfficiency;
              setCompletionStats({ timeBonus, treasureBonus, pathEfficiency, totalScore });
              setScore(totalScore);
              setGameState('completed');
              setMessage('Congratulations! You found all the treasures! 🎉');
              // Remove the automatic transition
              // setTimeout(() => onLevelComplete(), 5000);
            }
          }
        }
        if (newX === mazeSize-1 && newY === mazeSize-1) {
          if (collectedTreasures.length < 5) {
            setMessage('Find all treasures before reaching the end!');
            const newPath = [...path];
            newPath.pop();
            const newPos = newPath[newPath.length - 1];
            setPath(newPath);
            setPlayerPos(newPos);
          }
        }
      } else {
        setMessage('Invalid move! Try another direction.');
      }
    };

    const handleBacktrack = () => {
      if (path.length > 1) {
        const newPath = [...path];
        newPath.pop();
        const newPos = newPath[newPath.length - 1];
        setPath(newPath);
        setPlayerPos(newPos);
        setCurrentStep(prev => prev - 1);
        setMessage('Backtracking to previous position');
      }
    };

    const renderMaze = () => (
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${mazeSize}, minmax(0, 1fr))`, width: '400px', height: '400px' }}>
        {maze.map((row, i) =>
          row.map((cell, j) => {
            const isVisited = visited.some(pos => pos.x === i && pos.y === j);
            const isCurrentPath = path.some(pos => pos.x === i && pos.y === j);
            const isTreasure = cell === 2;
            const isCollected = isTreasure && collectedTreasures.includes(treasures.find(t => t.x === i && t.y === j)?.id);
            return (
              <div
                key={`${i}-${j}`}
                className={`w-full h-full flex items-center justify-center
                  ${cell === 1 ? 'bg-green-400' : 'bg-green-600'}
                  ${isVisited ? 'bg-opacity-50' : 'bg-opacity-100'}
                  ${isCurrentPath ? 'bg-blue-900 bg-opacity-30' : ''}
                  ${isTreasure && !isCollected ? 'bg-yellow-500 bg-opacity-50' : ''}
                  ${isCollected ? 'bg-green-500 bg-opacity-50' : ''}
                  ${playerPos.x === i && playerPos.y === j ? 'bg-pink-500 bg-opacity-50' : ''}
                  border border-gray-600 transition-all duration-300`}
              >
                {playerPos.x === i && playerPos.y === j && (<span className="text-2xl">👾</span>)}
                {isTreasure && !isCollected && (<span className="text-xl">💎</span>)}
                {isCollected && (<span className="text-xl">✓</span>)}
              </div>
            );
          })
        )}
      </div>
    );

    return (
      <div className="relative w-[1100px] h-[600px] bg-white border-2 border-green-600 rounded-lg overflow-hidden border-2 border-gray-600 flex flex-col items-center justify-start p-5">
        <h2 className="text-3xl font-bold text-pink-400 mb-4">Level 6: Backtracking Maze Explorer 🧩</h2>
        {gameState === 'intro' && (
          <div className="text-center max-w-2xl">
            <p className="text-lg text-blue-600 mb-4">
              Welcome to the Backtracking Maze Explorer! Learn backtracking by navigating through a maze, collecting treasures, and finding the optimal path.
            </p>
            <div className="bg-green-200 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-green-800 mb-2">How to Play:</h3>
              <ul className="text-left list-disc list-inside space-y-2 text-blue-600">
                <li>Use arrow keys or buttons to move through the maze</li>
                <li>Press Backspace or click the Backtrack button to go back</li>
                <li>Collect treasures (💎) to earn points</li>
                <li>Find the optimal path to the exit</li>
                <li>Complete the maze before time runs out!</li>
              </ul>
            </div>
            <button
              onClick={handleStartGame}
              className="px-6 py-3 bg-pink-600 text-white rounded-lg shadow-lg hover:bg-pink-700 transition-colors text-lg font-semibold"
            >
              Start Exploration
            </button>
          </div>
        )}
        {gameState === 'playing' && (
          <>
            <div className="flex justify-between w-full mb-4">
              <div className="text-xl font-semibold text-yellow-400">Time: {timeLeft}s</div>
              <div className="text-xl font-semibold text-green-400">Score: {score}</div>
              <div className="text-xl font-semibold text-blue-400">Treasures: {collectedTreasures.length}/5</div>
            </div>
        <p className="text-lg text-blue-600 mb-4">{message}</p>
            {isStuck && (
              <div className="mb-4 p-4 bg-red-700 text-white rounded-lg font-bold">
                You are stuck! No more valid moves. Try backtracking or restart the maze.
                <button onClick={handleRestartMaze} className="ml-4 px-4 py-2 bg-yellow-500 text-black rounded-lg font-bold">Restart Maze</button>
        </div>
            )}
            <div className="relative flex-grow w-full flex items-center justify-center">
              <div className="relative">{renderMaze()}
                <div className="absolute -right-32 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
                  <button onClick={() => handleMove(-1, 0)} className="px-4 ml-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">↑</button>
                  <div className="flex space-x-4">
                    <button onClick={() => handleMove(0, -1)} className="px-4 ml-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">←</button>
                    <button onClick={() => handleMove(0, 1)} className="px-4 ml-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">→</button>
        </div>
                  <button onClick={() => handleMove(1, 0)} className="px-4 ml-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">↓</button>
                  <button onClick={handleBacktrack} className="ml-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors mt-4">↩️ Backtrack</button>
          </div>
        </div>
          </div>
          </>
        )}
        {gameState === 'completed' && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-95 flex flex-col items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl w-full">
              <h3 className="text-4xl font-bold text-green-400 mb-6 text-center">Level Complete! 🎉</h3>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-xl font-semibold text-yellow-400 mb-2">Performance</h4>
                  <div className="space-y-2">
                    <p className="text-gray-300">Time Remaining: <span className="text-green-400">{timeLeft}s</span></p>
                    <p className="text-gray-300">Treasures Found: <span className="text-yellow-400">5/5</span></p>
                    <p className="text-gray-300">Path Length: <span className="text-blue-400">{path.length} steps</span></p>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-xl font-semibold text-yellow-400 mb-2">Score Breakdown</h4>
                  <div className="space-y-2">
                    <p className="text-gray-300">Base Score: <span className="text-green-400">{score}</span></p>
                    <p className="text-gray-300">Time Bonus: <span className="text-green-400">+{completionStats.timeBonus}</span></p>
                    <p className="text-gray-300">Treasure Bonus: <span className="text-yellow-400">+{completionStats.treasureBonus}</span></p>
                    <p className="text-gray-300">Path Efficiency: <span className="text-blue-400">+{completionStats.pathEfficiency}</span></p>
                  </div>
                </div>
              </div>
              <div className="text-center mb-8">
                <p className="text-3xl font-bold text-pink-400">Total Score: {completionStats.totalScore}</p>
                <p className="text-xl text-yellow-400 mt-2">💎 All Treasures Collected!</p>
                {completionStats.pathEfficiency > 80 && (<p className="text-xl text-yellow-400 mt-2">🌟 Excellent Path Efficiency!</p>)}
              </div>
              <div className="flex justify-center space-x-4">
                <button onClick={handleStartGame} className="px-6 py-3 bg-pink-600 text-white rounded-lg shadow-lg hover:bg-pink-700 transition-colors text-lg font-semibold">Play Again</button>
                <button onClick={onLevelComplete} className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors text-lg font-semibold">Next Level</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Level 5: Understanding Backtracking (was Level 6)
  const Level5Component = ({ onLevelComplete }) => {
    const [step, setStep] = React.useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const steps = [
      {
        title: 'What is Backtracking?',
        content: (
          <>
            <p className="mb-4 text-lg text-green-600">
              <b>Backtracking</b> is a problem-solving technique that incrementally builds candidates to solutions and abandons a candidate ("backtracks") as soon as it determines that the candidate cannot possibly lead to a valid solution.
            </p>
            <p className="mb-2 text-green-600">
              It's like exploring a maze: if you hit a dead end, you go back and try a different path!
            </p>
          </>
        ),
        visual: (
          <div className="flex flex-col items-center">
            <span className="text-5xl">🧭</span>
            <span className="text-green-600 mt-2">Explore, hit a dead end, backtrack, repeat!</span>
          </div>
        )
      },
      {
        title: 'Backtracking in a Maze',
        content: (
          <>
            <p className="mb-4 text-xl text-green-600">
              Imagine you are in a maze. At each junction, you choose a path. If you reach a dead end, you <b>backtrack</b> to the last junction and try a new path.
            </p>
            <p className="mb-2 text-xl text-green-600">
              This is the essence of backtracking: try, fail, backtrack, try again.
            </p>
          </>
        ),
        visual: (
          <svg width="180" height="180" viewBox="0 0 180 180">
            <rect x="0" y="0" width="180" height="180" rx="16" fill="#22223b" />
            <polyline points="30,150 30,30 90,30 90,90 150,90 150,150" fill="none" stroke="#fbbf24" strokeWidth="8" strokeLinejoin="round" />
            <circle cx="30" cy="150" r="10" fill="#38bdf8" />
            <circle cx="150" cy="150" r="10" fill="#22d3ee" />
            <circle cx="90" cy="90" r="10" fill="#f472b6" />
            <text x="20" y="170" fill="#fff" fontSize="14">Start</text>
            <text x="140" y="170" fill="#fff" fontSize="14">End</text>
          </svg>
        )
      },
      {
        title: 'Backtracking: Step-by-Step',
        content: (
          <>
            <p className="text-xl mb-4 text-green-600">
              <b>Step 1:</b> Choose a path and move forward.<br/>
              <b>Step 2:</b> If you reach a dead end, go back to the last choice point.<br/>
              <b>Step 3:</b> Try a different path.<br/>
              <b>Step 4:</b> Repeat until you find a solution or all options are exhausted.
            </p>
            <p className="mb-2 text-xl text-green-600">
              Backtracking is about exploring all possibilities, but smartly abandoning dead ends.
            </p>
          </>
        ),
        visual: (
          <svg width="220" height="120" viewBox="0 0 220 120">
            <rect x="0" y="0" width="220" height="120" rx="16" fill="#22223b" />
            <polyline points="30,100 30,30 110,30 110,70 190,70 190,100" fill="none" stroke="#fbbf24" strokeWidth="8" strokeLinejoin="round" />
            <circle cx="30" cy="100" r="10" fill="#38bdf8" />
            <circle cx="190" cy="100" r="10" fill="#22d3ee" />
            <circle cx="110" cy="70" r="10" fill="#f472b6" />
            <text x="20" y="115" fill="#fff" fontSize="14">Start</text>
            <text x="180" y="115" fill="#fff" fontSize="14">End</text>
            <text x="60" y="50" fill="#fff" fontSize="12">Try</text>
            <text x="120" y="90" fill="#fff" fontSize="12">Backtrack</text>
          </svg>
        )
      },
      {
        title: 'Summary: When to Use Backtracking?',
        content: (
          <>
            <ul className="text-xl list-disc list-inside text-green-600 mb-4">
              <li>When you need to explore all possible solutions</li>
              <li>When you can abandon partial solutions early</li>
              <li>When recursion fits the problem structure</li>
            </ul>
            <p className="text-green-600 text-xl ">Backtracking is powerful for puzzles, constraint satisfaction, and combinatorial problems!</p>
          </>
        ),
        visual: (
          <span className="text-4xl">🎯</span>
        )
      }
    ];

    return (
      <div className="relative w-full max-w-[1100px] mx-auto h-[600px] bg-white border-2 border-green-600 rounded-lg overflow-hidden border-2 border-gray-700 flex flex-col items-center justify-start p-6">
        {/* Success Message Modal */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">Level Complete! 🎉</h2>
              <p className="text-gray-700 mb-6">Congratulations! You've mastered the concept of backtracking!</p>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  onLevelComplete();
                }}
                className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
              >
                Next Level
              </button>
            </div>
          </motion.div>
        )}

        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Level 5: Understanding Backtracking 🔄</h2>
        <div className="flex flex-col md:flex-row w-full h-full gap-8 items-center justify-center">
          <div className="flex-1 flex flex-col items-center justify-center">
            <h3 className="text-2xl font-semibold text-pink-600 mb-4 text-center">{steps[step].title}</h3>
            <div className="mb-4 text-green-600">{steps[step].content}</div>
            <div className="flex justify-center text-green-600">{steps[step].visual}</div>
          </div>
        </div>
        <div className="flex justify-between w-full mt-8">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-600 transition-colors"
            disabled={step === 0}
          >
            ← Previous
          </button>
          <button
            onClick={() => {
              if (step < steps.length - 1) setStep(s => s + 1);
              else setShowSuccess(true); // Show success message instead of directly calling onLevelComplete
            }}
            className="px-6 py-2 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-700 transition-colors"
          >
            {step < steps.length - 1 ? 'Next →' : 'Finish'}
          </button>
        </div>
      </div>
    );
  };

  // Level 7: Recursive Fractal Forest
  const Level7Component = ({ onLevelComplete }) => {
    const [depth, setDepth] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentDepth, setCurrentDepth] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const canvasRef = useRef(null);

    // Draw a fractal tree recursively
    const drawTree = (ctx, x, y, angle, length, depthLimit, currDepth) => {
      if (currDepth > depthLimit) return;
      const branchAngle = Math.PI / 6;
      const branchReduction = 0.7;
      const x2 = x + length * Math.cos(angle);
      const y2 = y - length * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `hsl(${120 + currDepth * 20}, 70%, 40%)`;
      ctx.lineWidth = Math.max(1, 6 - currDepth);
      ctx.stroke();
      if (currDepth < depthLimit) {
        drawTree(ctx, x2, y2, angle - branchAngle, length * branchReduction, depthLimit, currDepth + 1);
        drawTree(ctx, x2, y2, angle + branchAngle, length * branchReduction, depthLimit, currDepth + 1);
      }
    };

    // Animate the tree growth
    useEffect(() => {
      if (!isAnimating) return;
      if (currentDepth > depth) {
        setIsAnimating(false);
        setShowSuccess(true); // Show success message when animation completes
        return;
      }
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, 600, 400);
      drawTree(ctx, 300, 380, Math.PI / 2, 80, currentDepth, 0);
      const timeout = setTimeout(() => setCurrentDepth(d => d + 1), 600);
      return () => clearTimeout(timeout);
    }, [isAnimating, currentDepth, depth]);

    // Draw full tree when not animating
    useEffect(() => {
      if (isAnimating) return;
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, 600, 400);
      drawTree(ctx, 300, 380, Math.PI / 2, 80, depth, 0);
    }, [depth, isAnimating]);

    const handleAnimate = () => {
      setCurrentDepth(0);
      setIsAnimating(true);
    };

    return (
      <div className="relative w-[1100px] h-[600px] bg-white border-2 border-green-600 rounded-lg overflow-hidden border-2 border-gray-600 flex flex-col items-center justify-start p-5">
        <h2 className="text-3xl font-bold text-pink-400 mb-4">Level 7: Recursive Fractal Forest 🌲</h2>
        <div className="flex flex-col items-center w-full">
          {/* Success Message Modal */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Level Complete! 🎉</h2>
                <p className="text-gray-700 mb-6">Congratulations! You've mastered the concept of recursive fractals!</p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setShowSuccess(false);
                      setCurrentDepth(0);
                      setIsAnimating(false);
                    }}
                    className="px-6 py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={onLevelComplete}
                    className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Next Level
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mb-4 text-center max-w-2xl">
            <p className="text-lg text-blue-600 mb-2">
              Welcome to the Fractal Forest! See how recursion can create beautiful, complex trees from simple rules.
            </p>
            <ul className="text-left list-disc list-inside space-y-1 text-green-600 text-base">
              <li>Each branch splits into two smaller branches recursively.</li>
              <li>The process stops at the base case (recursion depth limit).</li>
              <li>Adjust the recursion depth to see more or fewer branches.</li>
              <li>Click "Animate Growth" to watch recursion in action!</li>
            </ul>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <label className="text-blue-600 font-semibold">Recursion Depth:</label>
            <input
              type="range"
              min={1}
              max={10}
              value={depth}
              disabled={isAnimating}
              onChange={e => setDepth(Number(e.target.value))}
              className="w-40"
            />
            <span className="text-pink-400 font-bold text-lg">{depth}</span>
          <button
              onClick={handleAnimate}
              disabled={isAnimating}
              className="ml-6 px-5 py-2 bg-green-500 text-white rounded-lg font-semibold shadow hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              Animate Growth
          </button>
        </div>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="bg-white rounded-lg border border-green-800 shadow-lg mb-2"
          />
          <div className="bg-gray-700 p-4 rounded-lg text-gray-200 max-w-xl text-center mt-2">
            <b>Fun Fact:</b> Fractals like these are found in nature (ferns, trees, rivers) and are generated by simple recursive rules!
          </div>
        </div>
      </div>
    );
  };

  // Level 8: Visual Permutation Generator
  const Level8Component = ({ onLevelComplete }) => {
    const [input, setInput] = useState('ABC');
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    // Step structure: { arr, l, r, swapA, swapB, type: 'call'|'swap'|'perm', perm: string }
    function generatePermutationSteps(str) {
      const arr = str.split('');
      const n = arr.length;
      const steps = [];

      function permute(a, l, r, callStack) {
        steps.push({
          arr: [...a],
          l,
          r,
          swapA: null,
          swapB: null,
          type: 'call',
          callStack: [...callStack, { l, r, arr: [...a] }]
        });
        if (l === r) {
          steps.push({
            arr: [...a],
            l,
            r,
            swapA: null,
            swapB: null,
            type: 'perm',
            perm: a.join(''),
            callStack: [...callStack, { l, r, arr: [...a] }]
          });
        } else {
          for (let i = l; i <= r; i++) {
            steps.push({
              arr: [...a],
              l,
              r,
              swapA: l,
              swapB: i,
              type: 'swap',
              callStack: [...callStack, { l, r, arr: [...a] }]
            });
            [a[l], a[i]] = [a[i], a[l]];
            permute(a, l + 1, r, [...callStack, { l, r, arr: [...a] }]);
            [a[l], a[i]] = [a[i], a[l]]; // backtrack
            steps.push({
              arr: [...a],
              l,
              r,
              swapA: l,
              swapB: i,
              type: 'backtrack',
              callStack: [...callStack, { l, r, arr: [...a] }]
            });
          }
        }
      }

      permute(arr, 0, n - 1, []);
      return steps;
    }

    // Regenerate steps when input changes
    useEffect(() => {
      if (!input) {
        setSteps([]);
        setCurrentStep(0);
        return;
      }
      const safeInput = input.slice(0, 6); // limit for performance
      setSteps(generatePermutationSteps(safeInput));
      setCurrentStep(0);
    }, [input]);

    // Collect all found permutations up to current step
    const foundPerms = steps
      .slice(0, currentStep + 1)
      .filter(s => s.type === 'perm')
      .map(s => s.perm);

    const step = steps[currentStep] || {};

    // Show success message when all steps are completed
    useEffect(() => {
      if (currentStep === steps.length - 1 && steps.length > 0) {
        setShowSuccess(true);
      }
    }, [currentStep, steps.length]);

    return (
      <div className="relative w-[1100px] h-[600px] bg-white border-2 border-green-600 rounded-lg overflow-hidden border-2 border-gray-600 flex flex-col items-center justify-start p-5">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">Level 8: Permutation Visualizer 🔄</h2>
        
        {/* Success Message Modal */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">Level Complete! 🎉</h2>
              <p className="text-gray-700 mb-6">
                Congratulations! You've found all {foundPerms.length} permutations of "{input}"!
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setCurrentStep(0);
                  }}
                  className="px-6 py-3 bg-yellow-600 text-white font-bold rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={onLevelComplete}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Next Level
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mb-4 text-center max-w-2xl">
          <p className="text-lg text-green-600 mb-2">
            Enter a string (max 6 chars) and step through the recursive generation of all its permutations!
          </p>
          <input
            type="text"
            value={input}
            maxLength={6}
            onChange={e => setInput(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
            className="px-4 py-2 bg-green-200 text-green-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xl text-center"
          />
        </div>

        {/* Visualization */}
        <div className="flex flex-col items-center w-full">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {step.arr && step.arr.map((ch, idx) => {
              let highlight = '';
              if (step.type === 'swap' && (idx === step.swapA || idx === step.swapB)) highlight = 'bg-blue-400 text-white';
              if (step.type === 'backtrack' && (idx === step.swapA || idx === step.swapB)) highlight = 'bg-red-400 text-white';
              if (step.type === 'perm') highlight = 'bg-green-400 text-white';
              return (
                <span
                  key={idx}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg text-2xl font-bold border-2 border-gray-500 mx-1 transition-all duration-200 ${highlight}`}
                >
                  {ch}
                </span>
              );
            })}
          </div>
          <div className="mb-2 text-blue-600">
            {step.type === 'call' && <span>Recursive call: l={step.l}, r={step.r}</span>}
            {step.type === 'swap' && <span>Swap positions {step.swapA + 1} and {step.swapB + 1}</span>}
            {step.type === 'backtrack' && <span>Backtrack: Undo swap {step.swapA + 1} and {step.swapB + 1}</span>}
            {step.type === 'perm' && <span>Permutation found: <span className="text-green-300 font-mono">{step.perm}</span></span>}
          </div>
          {/* Call stack visualization */}
          <div className="w-full flex flex-col items-center mb-2">
            <div className="text-sm text-blue-600 mb-1">Call Stack:</div>
            <div className="flex flex-wrap justify-center">
              {step.callStack && step.callStack.map((call, i) => (
                <div key={i} className="bg-green-200 text-green-800 rounded px-2 py-1 m-1 text-xs font-mono">
                  l={call.l}, r={call.r}, [{call.arr.join('')}]
                </div>
              ))}
            </div>
          </div>
          {/* Step controls */}
          <div className="flex items-center space-x-4 mb-2">
            <button
              onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-lg text-pink-600">Step {currentStep + 1} / {steps.length}</span>
            <button
              onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
              disabled={currentStep === steps.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
          {/* Found permutations */}
          <div className="w-full max-w-xl bg-green-200 rounded-lg p-3 mt-2">
            <div className="text-sm text-green-600 mb-1">Permutations found so far:</div>
            <div className="flex flex-wrap">
              {foundPerms.map((perm, i) => (
                <span key={i} className="bg-green-600 text-white rounded px-2 py-1 m-1 font-mono">{perm}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 text-gray-400 text-sm max-w-xl text-center">
          <b>How it works:</b> This visualizes the recursive and backtracking process of generating all permutations by swapping elements and exploring all possibilities.
        </div>
      </div>
    );
  };

  // Level 9: Palindrome Detective Agency 🕵️
  const Level9Component = ({ onLevelComplete }) => {
    const [clues, setClues] = useState([
      "LEVEL",    // palindrome
      "DEED",     // palindrome
      "RACECAR",  // palindrome
      "NOON",     // palindrome
      "MYSTERY",  // not palindrome
      "AGENT"     // not palindrome
    ]);
    const [currentClueIndex, setCurrentClueIndex] = useState(0);
    const [input, setInput] = useState('');
    const [step, setStep] = useState(0);
    const [steps, setSteps] = useState([]);
    const [status, setStatus] = useState('waiting'); // waiting, checking, solved, failed
    const [progress, setProgress] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [investigatedClues, setInvestigatedClues] = useState([]); // Track investigated clues

    // Generate steps for recursive palindrome check
    function getPalindromeSteps(word) {
      const steps = [];
      function check(s, l, r) {
        steps.push({ l, r, type: 'compare', chars: [s[l], s[r]] });
        if (l >= r) {
          steps.push({ l, r, type: 'base', chars: [s[l], s[r]] });
          return true;
        }
        if (s[l] !== s[r]) {
          steps.push({ l, r, type: 'fail', chars: [s[l], s[r]] });
          return false;
        }
        return check(s, l + 1, r - 1);
      }
      check(word, 0, word.length - 1);
      return steps;
    }

    // Start a new clue
    useEffect(() => {
      const clue = clues[currentClueIndex];
      setInput(clue);
      setSteps(getPalindromeSteps(clue));
      setStep(0);
      setStatus('waiting');
    }, [currentClueIndex, clues]);

    // Animate checking
    useEffect(() => {
      if (status === 'checking' && step < steps.length) {
        const timeout = setTimeout(() => setStep(s => s + 1), 1200);
        return () => clearTimeout(timeout);
      }
      if (status === 'checking' && step === steps.length) {
        // End of steps, determine result
        const last = steps[steps.length - 1];
        if (last.type === 'base') {
          setStatus('solved');
          setProgress((currentClueIndex + 1) / clues.length);
        } else if (last.type === 'fail') {
          setStatus('failed');
        }
      }
    }, [status, step, steps, currentClueIndex, clues.length]);

    // Track investigated clues
    useEffect(() => {
      if (status === 'solved' || status === 'failed') {
        const clue = clues[currentClueIndex];
        if (!investigatedClues.includes(clue)) {
          setInvestigatedClues(prev => [...prev, clue]);
        }
      }
    }, [status, currentClueIndex, clues, investigatedClues]);

    // Show success message when all clues are investigated
    useEffect(() => {
      if (investigatedClues.length === clues.length) {
        setShowSuccess(true);
      }
    }, [investigatedClues.length, clues.length]);

    // Handle user action
    const handleCheck = () => {
      setStatus('checking');
      setStep(0);
    };

    const handleNext = () => {
      if (currentClueIndex < clues.length - 1) {
        setCurrentClueIndex(i => i + 1);
        setStatus('waiting');
        setStep(0);
      }
    };

    // Visuals for magnifying glass and letter highlighting
    const renderWord = () => {
      const clue = input;
      const curr = steps[step] || {};
      return (
        <div className="flex items-center justify-center space-x-2 text-3xl font-mono mb-4 relative">
          {clue.split('').map((ch, idx) => {
            let highlight = '';
            if (curr.l === idx || curr.r === idx) highlight = 'bg-yellow-300 text-black border-2 border-yellow-500';
            return (
              <span
                key={idx}
                className={`relative px-3 py-2 rounded transition-all duration-200 ${highlight}`}
                style={{ zIndex: curr.l === idx || curr.r === idx ? 2 : 1 }}
              >
                {ch}
                {/* Magnifying glass effect */}
                {(curr.l === idx || curr.r === idx) && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-2xl pointer-events-none select-none">
                    🔍
                  </span>
                )}
              </span>
            );
          })}
              </div>
      );
    };

    // Progress bar
    const renderProgress = () => (
      <div className="w-full max-w-lg h-4 bg-gray-700 rounded-full overflow-hidden mb-4">
        <div
          className="h-4 bg-green-400 transition-all duration-500"
          style={{ width: `${((currentClueIndex + (status === 'solved' ? 1 : 0)) / clues.length) * 100}%` }}
        />
      </div>
    );

    // Detective celebration
    const renderCelebration = () => (
      <div className="flex flex-col items-center mt-4">
        <span className="text-5xl mb-2 animate-bounce">🎉</span>
        <span className="text-2xl text-green-400 font-bold">Palindrome confirmed!</span>
        <span className="text-lg text-yellow-600 mt-2">Case solved, Detective!</span>
      </div>
    );

    // Failure
    const renderFailure = () => (
      <div className="flex flex-col items-center mt-4">
        <span className="text-5xl mb-2">❌</span>
        <span className="text-2xl text-red-400 font-bold">Not a palindrome!</span>
        <span className="text-lg text-yellow-200 mt-2">Keep investigating!</span>
      </div>
    );

    // Step description
    const renderStepDesc = () => {
      const curr = steps[step] || {};
      if (curr.type === 'compare') {
        return (
          <span>
            <span className="text-green-600 font-bold">Comparing:</span> <span className="font-mono text-pink-400">{curr.chars[0]} and {curr.chars[1]}</span>
          </span>
        );
      }
      if (curr.type === 'base') {
        return <span className="text-green-600 font-bold">Base case reached: Palindrome!</span>;
      }
      if (curr.type === 'fail') {
        return <span className="text-red-300 font-bold">Mismatch found: Not a palindrome.</span>;
      }
      return null;
    };

    return (
      <div className="relative w-[1100px] h-[600px] bg-white border-2 border-green-600 rounded-lg overflow-hidden border-2 border-gray-700 flex flex-col items-center justify-start p-5">
        <h2 className="text-3xl font-bold text-pink-600 mb-2">Level 9: Palindrome Detective Agency 🕵️</h2>

        {/* Success Message Modal */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">All Cases Investigated! 🕵️‍♂️</h2>
              <p className="text-gray-700 mb-4">
                Congratulations, Detective! You've successfully investigated all {clues.length} clues!
              </p>
              <div className="mb-6 text-sm text-gray-600">
                <p>Cases investigated: {investigatedClues.length}/{clues.length}</p>
                <p>Palindromes found: {investigatedClues.filter(clue => 
                  clue === clue.split('').reverse().join('')).length}</p>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setCurrentClueIndex(0);
                    setStatus('waiting');
                    setStep(0);
                    setInvestigatedClues([]);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Investigate Again
                </button>
                <button
                  onClick={onLevelComplete}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Next Case
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mb-2 text-lg text-blue-600 text-center max-w-2xl">
          Solve the case! Use your detective skills (and recursion) to check if each coded message is a palindrome.
        </div>
        {renderProgress()}
        <div className="w-full flex flex-col items-center">
          <div className="mb-2 text-xl text-blue-600">
            Clue {currentClueIndex + 1} of {clues.length}
            <span className="ml-4 text-sm text-green-400">
              (Investigated: {investigatedClues.length}/{clues.length})
            </span>
          </div>
          {renderWord()}
          <div className="mb-2 text-lg text-gray-300 min-h-[32px]">{renderStepDesc()}</div>
          {status === 'waiting' && (
            <button
              onClick={handleCheck}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Investigate Clue
            </button>
          )}
          {status === 'solved' && renderCelebration()}
          {status === 'failed' && renderFailure()}
          {(status === 'solved' || status === 'failed') && currentClueIndex < clues.length - 1 && (
            <button
              onClick={handleNext}
              className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors text-lg font-semibold"
            >
              Next Clue
            </button>
          )}
        </div>
      </div>
    );
  };

  // Level 10: N-Queens Challenge 👑
  const Level10Component = ({ onLevelComplete }) => {
    const BOARD_SIZE = 4; // Fixed 4x4 board
    const [board, setBoard] = useState(() => Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0)));
    const [solutions, setSolutions] = useState([]);
    const [currentSolution, setCurrentSolution] = useState(0);
    const [isSolving, setIsSolving] = useState('intro');
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [viewedSolutions, setViewedSolutions] = useState(new Set());
    const [showCompletion, setShowCompletion] = useState(false);

    // Update viewed solutions when current solution changes
    useEffect(() => {
      if (isSolving === 'solved' && solutions.length > 0) {
        setViewedSolutions(prev => {
          const newSet = new Set(prev);
          newSet.add(currentSolution);
          return newSet;
        });
      }
    }, [currentSolution, isSolving, solutions]);

    // Check if all solutions have been viewed
    useEffect(() => {
      if (isSolving === 'solved' && viewedSolutions.size === solutions.length && solutions.length > 0) {
        setShowCompletion(true);
      }
    }, [viewedSolutions, solutions, isSolving]);

    // Update board when current step changes
    useEffect(() => {
      if (isSolving === 'solved' && steps.length > 0) {
        const currentStepData = steps[currentStep];
        if (currentStepData && currentStepData.board) {
          setBoard(currentStepData.board);
        }
      }
    }, [currentStep, steps, isSolving]);

    // Check if a queen can be placed at (row, col)
    const isSafe = (board, row, col) => {
      // Check row
      for (let i = 0; i < col; i++) {
        if (board[row][i] === 1) return false;
      }

      // Check upper diagonal
      for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] === 1) return false;
      }

      // Check lower diagonal
      for (let i = row, j = col; i < BOARD_SIZE && j >= 0; i++, j--) {
        if (board[i][j] === 1) return false;
      }

      return true;
    };

    // Solve N-Queens with step tracking (find ALL solutions)
    const solveNQueens = (board, col, steps = [], allSolutions = []) => {
      if (col >= BOARD_SIZE) {
        const solution = board.map(row => [...row]);
        allSolutions.push(solution);
        steps.push({
          type: 'solution',
          board: solution.map(row => [...row]),
          message: 'Found a valid solution!'
        });
        return;
      }

      for (let row = 0; row < BOARD_SIZE; row++) {
        steps.push({
          type: 'try',
          row,
          col,
          board: board.map(row => [...row]),
          message: `Trying to place queen at row ${row + 1}, column ${col + 1}`
        });

        if (isSafe(board, row, col)) {
          board[row][col] = 1;
          steps.push({
            type: 'place',
            row,
            col,
            board: board.map(row => [...row]),
            message: `Placed queen at row ${row + 1}, column ${col + 1}`
          });

          solveNQueens(board, col + 1, steps, allSolutions);

          board[row][col] = 0;
          steps.push({
            type: 'backtrack',
            row,
            col,
            board: board.map(row => [...row]),
            message: `Backtracking from row ${row + 1}, column ${col + 1}`
          });
        } else {
          steps.push({
            type: 'unsafe',
            row,
            col,
            board: board.map(row => [...row]),
            message: `Position (${row + 1}, ${col + 1}) is not safe`
          });
        }
      }
    };

    const handleSolve = () => {
      setIsSolving('solving');
      setSolutions([]);
      setSteps([]);
      setCurrentStep(0);
      setCurrentSolution(0);
      setViewedSolutions(new Set());
      setShowCompletion(false);
      
      const newBoard = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
      const newSteps = [];
      const allSolutions = [];
      solveNQueens(newBoard, 0, newSteps, allSolutions);
      setSteps(newSteps);
      setSolutions(allSolutions);
      setIsSolving('solved');
    };

    const handleNextStep = () => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    };

    const handlePrevStep = () => {
      if (currentStep > 0) {
        setCurrentStep(prev => prev - 1);
      }
    };

    const handleNextSolution = () => {
      if (currentSolution < solutions.length - 1) {
        setCurrentSolution(prev => prev + 1);
      }
    };

    const handlePrevSolution = () => {
      if (currentSolution > 0) {
        setCurrentSolution(prev => prev - 1);
      }
    };

    const resetGame = () => {
      setBoard(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0)));
      setSolutions([]);
      setCurrentSolution(0);
      setIsSolving('intro');
      setSteps([]);
      setCurrentStep(0);
      setShowSuccess(false);
      setShowCompletion(false);
      setViewedSolutions(new Set());
    };

    const renderBoard = () => {
      const currentBoard = isSolving === 'solved' ? solutions[currentSolution] : board;
      const currentStepData = steps[currentStep];
      
      return (
        <div className="grid grid-cols-4 gap-1 bg-white border-2 border-green-600 p-4 rounded-lg">
          {currentBoard.map((row, i) => (
            row.map((cell, j) => {
              let highlight = '';
              if (currentStepData) {
                if (currentStepData.type === 'try' && currentStepData.row === i && currentStepData.col === j) {
                  highlight = 'ring-2 ring-blue-500';
                } else if (currentStepData.type === 'place' && currentStepData.row === i && currentStepData.col === j) {
                  highlight = 'ring-2 ring-green-500';
                } else if (currentStepData.type === 'backtrack' && currentStepData.row === i && currentStepData.col === j) {
                  highlight = 'ring-2 ring-red-500';
                } else if (currentStepData.type === 'unsafe' && currentStepData.row === i && currentStepData.col === j) {
                  highlight = 'ring-2 ring-yellow-500';
                }
              }
              
              return (
                <div
                  key={`${i}-${j}`}
                  className={`w-16 h-16 flex items-center justify-center rounded-lg transition-colors ${
                    (i + j) % 2 === 0 ? 'bg-green-600' : 'bg-green-400'
                  } ${highlight}`}
                >
                  {cell === 1 && (
                    <div className="text-4xl">👑</div>
                  )}
                </div>
              );
            })
          ))}
        </div>
      );
    };

    const renderSteps = () => {
      if (isSolving === 'intro') {
        return (
          <div className="text-gray-300 p-4">
            <h3 className="text-xl font-bold text-blue-600 mb-4">Welcome to N-Queens Challenge!</h3>
            <p className="mb-2 text-pink-400">• Place queens on a 4x4 chessboard so that no queen can attack another</p>
            <p className="mb-2 text-pink-400">• Queens can move horizontally, vertically, and diagonally</p>
            <p className="mb-2 text-pink-400">• Click "Solve Puzzle" to see the recursive solution</p>
            <p className="mb-2 text-pink-400">• Use the step controls to follow the backtracking process</p>
            <button
              onClick={handleSolve}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
            >
              Solve Puzzle
            </button>
          </div>
        );
      }

      if (isSolving === 'solving') {
        return (
          <div className="text-gray-300 p-4 text-center">
            <div className="animate-spin text-4xl mb-4">⚡</div>
            <p>Solving the puzzle...</p>
          </div>
        );
      }

      return (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-blue-400 mb-2">Solution Steps</h3>
              <div className="text-sm text-green-600 mb-2">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
            <div className="space-y-4">
              {steps.slice(0, currentStep + 1).map((step, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    index === currentStep
                      ? 'bg-blue-900 border-2 border-blue-500'
                      : 'bg-green-800'
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`mr-2 ${
                      step.type === 'try' ? 'text-yellow-400' :
                      step.type === 'place' ? 'text-green-400' :
                      step.type === 'backtrack' ? 'text-red-400' :
                      step.type === 'unsafe' ? 'text-orange-400' :
                      'text-purple-400'
                    }`}>
                      {step.type === 'try' ? '🔍' :
                       step.type === 'place' ? '✅' :
                       step.type === 'backtrack' ? '↩️' :
                       step.type === 'unsafe' ? '⚠️' :
                       '🎉'}
                    </span>
                    <span className="text-gray-300">{step.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-lg ${
                  currentStep === 0
                    ? 'bg-gray-600 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Previous Step
              </button>
              <button
                onClick={handleNextStep}
                disabled={currentStep === steps.length - 1}
                className={`px-4 py-2 rounded-lg ${
                  currentStep === steps.length - 1
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next Step
              </button>
            </div>
            {currentStep === steps.length - 1 && (
              <button
                onClick={() => setShowSuccess(true)}
                className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors text-lg font-semibold"
              >
                Complete Level
              </button>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="relative w-[1100px] h-[600px] bg-white border-2 border-green-600 rounded-lg overflow-hidden border-2 border-gray-700">
        <h2 className="text-3xl font-bold text-green-600 mb-2 p-4 text-center">Level 10: N-Queens Challenge 👑</h2>
        
        {/* Success Message Modal */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-4">Puzzle Solved! 👑</h2>
              <p className="text-gray-700 mb-4">
                Congratulations! You've mastered the N-Queens puzzle using recursive backtracking!
              </p>
              <div className="mb-6 text-sm text-gray-600">
                <p>Total solutions found: {solutions.length}</p>
                <p>Steps analyzed: {steps.length}</p>
                <p>Solutions viewed: {viewedSolutions.size}/{solutions.length}</p>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    resetGame();
                  }}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={onLevelComplete}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Next Level
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Completion Message Modal */}
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
              <h2 className="text-3xl font-bold text-purple-600 mb-4">Level Mastered! 🏆</h2>
              <p className="text-gray-700 mb-4">
                Amazing! You've explored all {solutions.length} solutions to the N-Queens puzzle!
              </p>
              <div className="mb-6 text-sm text-gray-600">
                <p>You've completed all possible solutions</p>
                <p>Total steps analyzed: {steps.length}</p>
              </div>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    setShowCompletion(false);
                    resetGame();
                  }}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={() => {
                    onLevelComplete();
                    setShowCompletion(false);
                  }}
                  className="w-full px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Complete Level
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex h-[calc(100%-4rem)]">
          {/* Left side - N-Queens Board */}
          <div className="w-1/2 p-4 flex flex-col items-center justify-center border-r border-gray-700">
            <div className="mb-4 text-gray-300 text-center">
              <h3 className="text-xl text-blue-600 font-bold mb-2">Chessboard</h3>
              <p className="text-sm text-pink-400">Watch the queens being placed as the algorithm solves the puzzle</p>
              {isSolving === 'solved' && (
                <p className="text-sm text-blue-400 mt-2">
                  Solutions viewed: {viewedSolutions.size}/{solutions.length}
                </p>
              )}
            </div>
            {renderBoard()}
            {isSolving === 'solved' && (
              <div className="mt-4 flex items-center justify-center space-x-4">
                <button
                  onClick={handlePrevSolution}
                  disabled={currentSolution === 0}
                  className={`px-4 py-2 rounded-lg ${
                    currentSolution === 0
                      ? 'bg-gray-700 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  ←
                </button>
                <span className="text-gray-600">
                  Solution {currentSolution + 1} of {solutions.length}
                </span>
                <button
                  onClick={handleNextSolution}
                  disabled={currentSolution === solutions.length - 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentSolution === solutions.length - 1
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  →
                </button>
              </div>
            )}
          </div>

          {/* Right side - Steps */}
          <div className="w-1/2 border-l border-gray-700">
            {renderSteps()}
          </div>
        </div>
      </div>
    );
  };

  const renderLevelContent = () => {
    switch (currentLevel) {
      case 1:
        return <Level1Component onLevelComplete={handleLevelComplete} />;
      case 2:
        return <Level2Component onLevelComplete={handleLevelComplete} />;
      case 3:
        return <Level3Component onLevelComplete={handleLevelComplete} />;
      case 4:
        return <Level4Component onLevelComplete={handleLevelComplete} />;
      case 5:
        return <Level5Component onLevelComplete={handleLevelComplete} />;
      case 6:
        return <Level6Component onLevelComplete={handleLevelComplete} />;
      case 7:
        return <Level7Component onLevelComplete={handleLevelComplete} />;
      case 8:
        return <Level8Component onLevelComplete={handleLevelComplete} />;
      case 9:
        return <Level9Component onLevelComplete={handleLevelComplete} />;
      case 10:
        return <Level10Component onLevelComplete={handleLevelComplete} />;
      default:
        return <div>Level not found</div>;
    }
  };

  return (
    <div className="relative pt-16 min-h-screen">
      <div className="absolute bg-gradient-to-br from-white via-green-50 to-emerald-100 inset-0 pointer-events-none z-0">
      <GameDecorations />
      </div>

      {/* Card-like main container */}
      <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-white via-green-50 to-emerald-100 rounded-3xl shadow-2xl p-8 border-2 border-green-500 relative z-10 flex flex-col items-center">
        {/* Level Navigation */}
        <div className="flex justify-center items-center mb-8 w-full">
          <div className="flex space-x-4 flex-wrap justify-center">
            {Array.from({ length: 10 }, (_, index) => {
              const levelNumber = index + 1;
              const isCompleted = completedLevels.has(levelNumber);
              const isCurrent = currentLevel === levelNumber;
              
              return (
                <button
                  key={levelNumber}
                  onClick={() => setCurrentLevel(levelNumber)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg transition-all duration-300 border-2
                    ${isCompleted 
                      ? isCurrent 
                        ? 'bg-gradient-to-r from-green-500 via-green-600 to-emerald-700 text-white border-green-700 scale-110' 
                        : 'bg-gradient-to-r from-green-400 to-green-500 text-white border-green-600 hover:scale-105'
                      : isCurrent 
                        ? 'bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white border-green-600 scale-110' 
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100 hover:scale-105'
                    }
                  `}
                  title={`Level ${levelNumber}${isCompleted ? ' (Completed)' : ''}`}
                >
                  {isCompleted ? '✓' : levelNumber}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8 w-full px-2">
          <button
            onClick={handlePreviousLevel}
            disabled={currentLevel === 1}
            className={`px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200 border-2 border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400/50
              ${currentLevel === 1 
                ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white hover:from-green-500 hover:via-green-600 hover:to-emerald-700'}
            `}
          >
            ← Previous Level
          </button>
          <div className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent drop-shadow-sm">
            Level {currentLevel}
          </div>
          <button
            onClick={handleNextLevel}
            disabled={currentLevel === 10}
            className={`px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200 border-2 border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400/50
              ${currentLevel === 10 
                ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white hover:from-green-500 hover:via-green-600 hover:to-emerald-700'}
            `}
          >
            Next Level →
          </button>
        </div>

        {/* Game Content */}
        <div className="max-w-6xl mx-auto w-full">
          {renderLevelContent()}
        </div>
      </div>
    </div>
  );
};

export default RecursionRealm;