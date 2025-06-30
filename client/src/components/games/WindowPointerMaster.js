import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import GameDecorations from './GameDecorations';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const WindowPointerMaster = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [highestLevel, setHighestLevel] = useState(1);
  const [gameMessage, setGameMessage] = useState('');
  const [completedLevels, setCompletedLevels] = useState(new Set()); // New state to track completed levels
  const [levelStartTime, setLevelStartTime] = useState(Date.now()); // Add this line

  // Level 1 (Sliding Window) state
  const [windowSize, setWindowSize] = useState(3);
  const [numbers, setNumbers] = useState([2, 1, 5, 1, 3, 2]);
  const [currentWindow, setCurrentWindow] = useState({ start: 0, end: 2 });
  const [windowSum, setWindowSum] = useState(8); // Initial sum of [2, 1, 5]
  const [maxSum, setMaxSum] = useState(8); // Track maximum sum found
  const [isMovingWindow, setIsMovingWindow] = useState(false);
  const [isLevel1Complete, setIsLevel1Complete] = useState(false);

  // Level 2 (Fixed Sliding Window) state
  const [level2Numbers, setLevel2Numbers] = useState([]);
  const [level2WindowSize, setLevel2WindowSize] = useState(0);
  const [level2CurrentWindow, setLevel2CurrentWindow] = useState({ start: 0, end: 0 });
  const [level2WindowSum, setLevel2WindowSum] = useState(0);
  const [level2MaxSum, setLevel2MaxSum] = useState(0);
  const [isMovingWindow2, setIsMovingWindow2] = useState(false);
  const [isLevel2Complete, setIsLevel2Complete] = useState(false);

  // Level 3 (Variable Sliding Window) state
  const [level3Numbers, setLevel3Numbers] = useState([]);
  const [level3TargetSum, setLevel3TargetSum] = useState(0);
  const [level3WindowSum, setLevel3WindowSum] = useState(0);
  const [level3MinLength, setLevel3MinLength] = useState(Infinity);
  const [level3WindowStart, setLevel3WindowStart] = useState(0);
  const [level3WindowEnd, setLevel3WindowEnd] = useState(0);
  const [isSlidingWindow3, setIsSlidingWindow3] = useState(false);
  const [isLevel3Complete, setIsLevel3Complete] = useState(false);

  // Level 4 (Sliding Window with Hash Map) state
  const [level4String, setLevel4String] = useState("");
  const [level4K, setLevel4K] = useState(0);
  const [level4WindowStart, setLevel4WindowStart] = useState(0);
  const [level4WindowEnd, setLevel4WindowEnd] = useState(0);
  const [level4CharFrequency, setLevel4CharFrequency] = useState({});
  const [level4LongestLength, setLevel4LongestLength] = useState(0);
  const [isSlidingWindow4, setIsSlidingWindow4] = useState(false);
  const [isLevel4Complete, setIsLevel4Complete] = useState(false);

  // Level 5 (Maximum Fruits in Baskets) state - formerly Level 6
  const [level5Fruits, setLevel5Fruits] = useState([]);
  const [level5WindowStart, setLevel5WindowStart] = useState(0);
  const [level5WindowEnd, setLevel5WindowEnd] = useState(0);
  const [level5FruitFrequency, setLevel5FruitFrequency] = useState({});
  const [level5MaxFruits, setLevel5MaxFruits] = useState(0);
  const [isSlidingWindow5, setIsSlidingWindow5] = useState(false);
  const [isLevel5Complete, setIsLevel5Complete] = useState(false);

  // Level 6 (Two Sum in Sorted Array) state - formerly Level 7
  const [level6Array, setLevel6Array] = useState([]);
  const [level6LeftPointer, setLevel6LeftPointer] = useState(0);
  const [level6RightPointer, setLevel6RightPointer] = useState(0);
  const [level6TargetSum, setLevel6TargetSum] = useState(0);
  const [isMovingPointers6, setIsMovingPointers6] = useState(false);
  const [isLevel6Complete, setIsLevel6Complete] = useState(false);

  // Level 7 (Middle Finder) state
  const [level7Balloons, setLevel7Balloons] = useState([]);
  const [level7LeftPointer, setLevel7LeftPointer] = useState(0);
  const [level7RightPointer, setLevel7RightPointer] = useState(0);
  const [isMovingPointers7, setIsMovingPointers7] = useState(false);
  const [isLevel7Complete, setIsLevel7Complete] = useState(false);
  const [level7Message, setLevel7Message] = useState('');

  // Level 8 (Matching Pairs Picnic) state
  const [level8Fruits, setLevel8Fruits] = useState([]);
  const [level8LeftPointer, setLevel8LeftPointer] = useState(0);
  const [level8RightPointer, setLevel8RightPointer] = useState(0);
  const [isLevel8Complete, setIsLevel8Complete] = useState(false);
  const [level8Message, setLevel8Message] = useState('');
  const [foundMatch8, setFoundMatch8] = useState(false);

  // Level 9 (Water Collector Challenge) state
  const [level9Heights, setLevel9Heights] = useState([]);
  const [level9LeftPointer, setLevel9LeftPointer] = useState(0);
  const [level9RightPointer, setLevel9RightPointer] = useState(0);
  const [level9MaxArea, setLevel9MaxArea] = useState(0);
  const [level9CurrentArea, setLevel9CurrentArea] = useState(0);
  const [isCalculating9, setIsCalculating9] = useState(false);
  const [isLevel9Complete, setIsLevel9Complete] = useState(false);
  const [level9Message, setLevel9Message] = useState('');
  const [waterOverlayStyle, setWaterOverlayStyle] = useState({}); // Re-add state for water visual style

  // Level 10 (Subarray Sum Challenge) state
  const [level10Numbers, setLevel10Numbers] = useState([]);
  const [level10WindowSize, setLevel10WindowSize] = useState(3);
  const [level10CurrentSum, setLevel10CurrentSum] = useState(0);
  const [level10MaxSum, setLevel10MaxSum] = useState(0);
  const [level10WindowStart, setLevel10WindowStart] = useState(0);
  const [level10WindowEnd, setLevel10WindowEnd] = useState(0);
  const [isSliding10, setIsSliding10] = useState(false);
  const [isLevel10Complete, setIsLevel10Complete] = useState(false);
  const [level10Message, setLevel10Message] = useState('');
  const [level10Step, setLevel10Step] = useState(0);
  const [level10Explanation, setLevel10Explanation] = useState('');

  // Refs for precise element positioning
  const barsContainerRef = useRef(null); // Re-add ref for bars container

  // Initialize Level 1
  const initializeLevel1 = () => {
    setNumbers([2, 1, 5, 1, 3, 2]);
    setCurrentWindow({ start: 0, end: 2 });
    setWindowSum(8); // Initial sum of [2, 1, 5]
    setMaxSum(8);
    setIsLevel1Complete(false); // Level 1 is now an interactive game again
    setGameMessage('Find the maximum sum of any window of size 3!');
  };

  // Initialize Level 2 (Fixed Sliding Window)
  const initializeLevel2 = () => {
    const newNumbers = [1, 4, 2, 9, 5, 10, 23, 8, 2, 5];
    const newWindowSize = 4;
    setLevel2Numbers(newNumbers);
    setLevel2WindowSize(newWindowSize);
    setLevel2CurrentWindow({ start: 0, end: newWindowSize - 1 });
    // Calculate initial window sum
    const initialSum = newNumbers.slice(0, newWindowSize).reduce((a, b) => a + b, 0);
    setLevel2WindowSum(initialSum);
    setLevel2MaxSum(initialSum);
    setIsLevel2Complete(false);
    setGameMessage('Find the maximum sum of K consecutive elements (K=4)!');
  };

  // Initialize Level 3 (Variable Sliding Window)
  const initializeLevel3 = () => {
    setLevel3Numbers([2, 1, 2, 4, 3, 1]);
    setLevel3TargetSum(7);
    setLevel3WindowSum(0);
    setLevel3MinLength(Infinity);
    setLevel3WindowStart(0);
    setLevel3WindowEnd(0);
    setIsSlidingWindow3(false);
    setIsLevel3Complete(false);
    setGameMessage('Find the smallest subarray with a sum greater than or equal to the target!');
  };

  // Initialize Level 4 (Sliding Window with Hash Map)
  const initializeLevel4 = () => {
    setLevel4String("araaci");
    setLevel4K(2);
    setLevel4WindowStart(0);
    setLevel4WindowEnd(0);
    setLevel4CharFrequency({});
    setLevel4LongestLength(0);
    setIsSlidingWindow4(false);
    setIsLevel4Complete(false);
    setGameMessage('Find the longest substring with K distinct characters!');
  };

  // Initialize Level 5 (Maximum Fruits in Baskets) - formerly Level 6
  const initializeLevel5 = () => {
    setLevel5Fruits([1, 2, 1, 2, 3, 1, 1]);
    setLevel5WindowStart(0);
    setLevel5WindowEnd(0);
    setLevel5FruitFrequency({});
    setLevel5MaxFruits(0);
    setIsSlidingWindow5(false);
    setIsLevel5Complete(false);
    setGameMessage('Pick the maximum number of fruits from a basket with only 2 types!');
  };

  // Initialize Level 6 (Two Sum in Sorted Array) - formerly Level 7
  const initializeLevel6 = () => {
    const newArray = [1, 2, 3, 4, 6, 8, 9, 14, 15];
    const newTargetSum = 13;
    setLevel6Array(newArray);
    setLevel6LeftPointer(0);
    setLevel6RightPointer(newArray.length - 1);
    setLevel6TargetSum(newTargetSum);
    setIsLevel6Complete(false);
    setGameMessage('Find two numbers that sum to the target!');
  };

  // Initialize Level 7 (Middle Finder)
  const initializeLevel7 = () => {
    // Create an array of colorful balloon numbers
    const balloons = [1, 2, 3, 4, 5, 6, 7];
    setLevel7Balloons(balloons);
    setLevel7LeftPointer(0);
    setLevel7RightPointer(balloons.length - 1);
    setIsMovingPointers7(false);
    setIsLevel7Complete(false);
    setLevel7Message('Help find the middle balloon!');
    setGameMessage('Move the pointers to find the middle balloon!');
  };

  // Initialize Level 8 (Matching Pairs Picnic)
  const initializeLevel8 = () => {
    const fruits = ['🍎', '🍌', '🍇', '🍊', '🍌', '🍎', '🍍'];
    setLevel8Fruits(fruits);
    setLevel8LeftPointer(0);
    setLevel8RightPointer(fruits.length - 1);
    setIsLevel8Complete(false);
    setFoundMatch8(false);
    setLevel8Message('Can you find two matching fruits?');
    setGameMessage('Move pointers to find matching fruits!');
  };

  // Initialize Level 9 (Water Collector Challenge)
  const initializeLevel9 = () => {
    const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]; // Example heights
    setLevel9Heights(heights);
    setLevel9LeftPointer(0);
    setLevel9RightPointer(heights.length - 1);
    setLevel9MaxArea(0);
    setLevel9CurrentArea(0);
    setIsCalculating9(false);
    setIsLevel9Complete(false);
    setLevel9Message('Find the largest area that can be contained!');
    setGameMessage('Collect the most water!');
  };

  // Initialize Level 10
  const initializeLevel10 = () => {
    // Array with negative numbers and varying sums
    const numbers = [2, -3, 4, -1, 5, -2, 3, 1, -4, 6];
    setLevel10Numbers(numbers);
    setLevel10WindowSize(3);
    setLevel10CurrentSum(0);
    setLevel10MaxSum(0);
    setLevel10WindowStart(0);
    setLevel10WindowEnd(0);
    setIsSliding10(false);
    setIsLevel10Complete(false);
    setLevel10Message('');
    setLevel10Step(0);
    setLevel10Explanation('Find the maximum sum of a subarray of size 3. Watch out for negative numbers!');
  };

  // Load progress from database
  useEffect(() => {
    let isMounted = true;  // Add mounted flag for cleanup

    const fetchWindowPointerProgress = async () => {
      if (!user) {
        console.log('[WindowPointerMaster] No user, skipping progress fetch');
        return;
      }
      
      try {
        console.log('[WindowPointerMaster] Fetching progress for user:', user);
        const token = localStorage.getItem('token');
        console.log('[WindowPointerMaster] Token exists for fetch:', !!token);
        
        const response = await fetch(`${BACKEND_URL}/api/game-progress/all-progress`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!isMounted) {
          console.log('[WindowPointerMaster] Component unmounted, stopping fetch');
          return;
        }
        
        console.log('[WindowPointerMaster] Fetch response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch progress: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[WindowPointerMaster] Received progress data:', data);
        
        // Find window-pointer progress
        const windowPointerProgress = data.progress?.find(p => p.topicId === 'sliding-window-two-pointer');
        console.log('[WindowPointerMaster] Found sliding-window-two-pointer progress:', windowPointerProgress);
        console.log('[WindowPointerMaster] Sliding-window-two-pointer progress keys:', windowPointerProgress ? Object.keys(windowPointerProgress) : 'No progress found');
        console.log('[WindowPointerMaster] Sliding-window-two-pointer progress levels:', windowPointerProgress?.levels);
        console.log('[WindowPointerMaster] Sliding-window-two-pointer progress gameLevels:', windowPointerProgress?.gameLevels);
        
        if (windowPointerProgress) {
          console.log('[WindowPointerMaster] Processing sliding-window-two-pointer progress:', windowPointerProgress);
          
          // Extract completed levels - try both possible structures
          let completed = new Set();
          
          if (windowPointerProgress.gameLevels) {
            completed = new Set(
              windowPointerProgress.gameLevels
                ?.filter(level => level.completed)
                .map(level => level.level) || []
            );
            console.log('[WindowPointerMaster] Using gameLevels structure');
          } else if (windowPointerProgress.levels) {
            completed = new Set(
              windowPointerProgress.levels
                ?.filter(level => level.completed)
                .map(level => level.level) || []
            );
            console.log('[WindowPointerMaster] Using levels structure');
          } else {
            console.log('[WindowPointerMaster] No levels structure found, checking for direct level data');
            // Check if levels are stored directly in the progress object
            if (windowPointerProgress.level) {
              completed = new Set([windowPointerProgress.level]);
              console.log('[WindowPointerMaster] Using direct level data');
            }
          }
          
          console.log('[WindowPointerMaster] Extracted completed levels:', completed);
          console.log('[WindowPointerMaster] Highest level from server:', windowPointerProgress.highestLevel);
          
          setCompletedLevels(completed);
          
          console.log('[WindowPointerMaster] State updated with completed levels:', completed);
          console.log('[WindowPointerMaster] State updated with highest level:', windowPointerProgress.highestLevel || 1);
        } else {
          console.log('[WindowPointerMaster] No sliding-window-two-pointer progress found, using defaults');
          setCompletedLevels(new Set());
        }
        
      } catch (error) {
        console.error('[WindowPointerMaster] Error fetching progress:', error);
        if (isMounted) {
          setCompletedLevels(new Set());
        }
      }
    };

    fetchWindowPointerProgress();
    
    return () => {
      isMounted = false;  // Cleanup function
    };
  }, [user]);

  // Reset level state when changing levels
  useEffect(() => {
    console.log(`[WindowPointerMaster] Level changed to ${currentLevel}, resetting state`);
    setLevelStartTime(Date.now());
    setShowSuccess(false);
    setGameMessage('');
    
    // Initialize the current level
    switch (currentLevel) {
      case 1:
        initializeLevel1();
        break;
      case 2:
        initializeLevel2();
        break;
      case 3:
        initializeLevel3();
        break;
      case 4:
        initializeLevel4();
        break;
      case 5:
        initializeLevel5();
        break;
      case 6:
        initializeLevel6();
        break;
      case 7:
        initializeLevel7();
        break;
      case 8:
        initializeLevel8();
        break;
      case 9:
        initializeLevel9();
        break;
      case 10:
        initializeLevel10();
        break;
      default:
        initializeLevel1();
    }
    
  }, [currentLevel]);

  // Effect to update water overlay position and size based on actual bar positions
  useEffect(() => {
    const updateWaterOverlay = () => {
      if (barsContainerRef.current && level9LeftPointer < level9RightPointer) {
        const containerRect = barsContainerRef.current.getBoundingClientRect();

        const leftBarElement = barsContainerRef.current.children[level9LeftPointer];
        const rightBarElement = barsContainerRef.current.children[level9RightPointer];

        if (leftBarElement && rightBarElement) {
          const leftBarRect = leftBarElement.getBoundingClientRect();
          const rightBarRect = rightBarElement.getBoundingClientRect();

          // Calculate left from the parent container's content area
          const waterLeft = leftBarRect.left - containerRect.left;
          // Calculate width from the left edge of the left bar to the right edge of the right bar
          const waterWidth = rightBarRect.right - leftBarRect.left;
          const waterHeight = Math.min(level9Heights[level9LeftPointer], level9Heights[level9RightPointer]) * 20; // Scale height

          setWaterOverlayStyle({
            position: 'absolute',
            bottom: '0px',
            left: `${waterLeft}px`,
            width: `${waterWidth}px`,
            height: `${waterHeight > 0 ? waterHeight : 0}px`,
            opacity: 0.7, // Increased opacity for visibility
            border: '1px solid blue', // Keep border for visibility
            zIndex: 10,
          });

          // Log for debugging
          console.log('--- Water Overlay Calculated (useEffect) ---');
          console.log('Container Rect:', containerRect);
          console.log('Left Bar Rect:', leftBarRect);
          console.log('Right Bar Rect:', rightBarRect);
          console.log('waterLeft (from effect):', waterLeft);
          console.log('waterWidth (from effect):', waterWidth);
          console.log('waterHeight (from effect):', waterHeight);
          console.log('LPointer:', level9LeftPointer, 'RPointer:', level9RightPointer);
          console.log('Height L:', level9Heights[level9LeftPointer], 'Height R:', level9Heights[level9RightPointer]);
        } else {
          setWaterOverlayStyle({}); // Clear style if elements not found
        }
      } else {
        setWaterOverlayStyle({}); // Clear style if not applicable
      }
    };

    updateWaterOverlay();
    window.addEventListener('resize', updateWaterOverlay);
    return () => window.removeEventListener('resize', updateWaterOverlay);

  }, [level9LeftPointer, level9RightPointer, level9Heights]);

  // Save progress
  const saveProgress = async (level) => {
    if (!user) {
      console.log('[WindowPointerMaster] No user found, progress will not be saved');
      return;
    }

    try {
      console.log(`[WindowPointerMaster] Starting to save progress for level ${level}`);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('[WindowPointerMaster] No authentication token found');
        return;
      }

      const timeSpent = Math.floor((Date.now() - levelStartTime) / 1000);
      const score = calculateScore(level);

      // Ensure all values are of the correct type and match server expectations
      const progressData = {
        topicId: 'sliding-window-two-pointer',
        level: Number(level),
        score: Number(score),
        timeSpent: Number(timeSpent)
      };

      console.log('[WindowPointerMaster] Saving progress data:', progressData);

      const response = await fetch(`${BACKEND_URL}/api/game-progress/save-progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(progressData)
      });

      console.log('[WindowPointerMaster] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[WindowPointerMaster] Failed to save progress:', errorData.message || response.statusText);
        throw new Error(`Failed to save progress: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      console.log('[WindowPointerMaster] Progress save response:', result);
      
      if (result.success) {
        // Update local state
        setCompletedLevels(prev => {
          const newSet = new Set([...prev, level]);
          console.log('[WindowPointerMaster] Updated completed levels:', newSet);
          return newSet;
        });
        
        // Dispatch progress update event for Games component
        window.dispatchEvent(new CustomEvent('progressUpdated', {
          detail: { topicId: 'sliding-window-two-pointer', level, score }
        }));
        
        console.log(`[WindowPointerMaster] Successfully saved progress for level ${level}:`, result);
      } else {
        throw new Error(result.error || 'Failed to save progress');
      }

    } catch (error) {
      console.error('[WindowPointerMaster] Error saving progress:', error);
    }
  };

  // Calculate score
  const calculateScore = (level) => {
    return 10; // Fixed base score of 10 points per level
  };

  // Handle level completion
  const handleLevelComplete = async (level) => {
    console.log(`[WindowPointerMaster] Level ${level} completed!`);
    setShowSuccess(true);
    
    // Update completed levels immediately
    setCompletedLevels(prev => {
      const newSet = new Set([...prev, level]);
      console.log('[WindowPointerMaster] Updated completed levels:', newSet);
      return newSet;
    });
    
    // Save progress to database
    await saveProgress(level);
    
    // Reset level start time for next level
    setLevelStartTime(Date.now());
    
    // Update game message based on level
    const messages = {
      1: "Excellent! You've mastered basic sliding window technique. The window slides smoothly!",
      2: "Fantastic! You've conquered fixed size sliding windows. Your window control is precise!",
      3: "Amazing! You've mastered variable size sliding windows. You can adapt the window size!",
      4: "Outstanding! You've conquered sliding windows with hash maps. Your data structure skills are sharp!",
      5: "Brilliant! You've mastered maximum fruits in baskets. Your basket management is perfect!",
      6: "Spectacular! You've conquered two sum with pointers. Your pointer coordination is excellent!",
      7: "Incredible! You've mastered the middle finder technique. Your center detection is spot on!",
      8: "Magnificent! You've conquered matching pairs picnic. Your pair finding skills are unmatched!",
      9: "Legendary! You've mastered the water collector challenge. Your area calculation is precise!",
      10: "Epic! You've conquered the subarray sum challenge. You are the Window & Pointer Master!"
    };
    
    setGameMessage(messages[level] || "Level completed! You're doing great!");
  };

  // Handle sliding window movement for Level 1
  const handleSlideWindow = () => {
    console.log('handleSlideWindow called');
    console.log('Before slide: isMovingWindow=', isMovingWindow, 'currentWindow.end=', currentWindow.end, 'numbers.length=', numbers.length);

    if (isMovingWindow || currentWindow.end >= numbers.length - 1) {
      console.log('Slide prevented: isMovingWindow=', isMovingWindow, 'currentWindow.end >= numbers.length - 1 is ', currentWindow.end >= numbers.length - 1);
      return;
    }
    setIsMovingWindow(true);

    const newStart = currentWindow.start + 1;
    const newEnd = currentWindow.end + 1;
    const newSum = numbers.slice(newStart, newEnd + 1).reduce((a, b) => a + b, 0);
    
    // Update maximum sum if new sum is greater
    if (newSum > maxSum) {
      setMaxSum(newSum);
    }

    setCurrentWindow({ start: newStart, end: newEnd });
    setWindowSum(newSum);

    console.log('After slide: newStart=', newStart, 'newEnd=', newEnd, 'newSum=', newSum, 'maxSum=', maxSum);

    setTimeout(() => {
      setIsMovingWindow(false);
      console.log('After timeout: isMovingWindow=', false);
      if (newEnd === numbers.length - 1) {
        setIsLevel1Complete(true);
        handleLevelComplete(1);
        console.log('Level 1 complete!');
      }
    }, 500);
  };

  // Handle sliding window movement for Level 2 (Fixed Window)
  const handleSlideWindow2 = () => {
    if (isMovingWindow2 || level2CurrentWindow.end >= level2Numbers.length - 1) return;
    setIsMovingWindow2(true);

    const newStart = level2CurrentWindow.start + 1;
    const newEnd = level2CurrentWindow.end + 1;

    let newSum = level2WindowSum - level2Numbers[level2CurrentWindow.start] + level2Numbers[newEnd];

    if (newSum > level2MaxSum) {
      setLevel2MaxSum(newSum);
    }

    setLevel2CurrentWindow({ start: newStart, end: newEnd });
    setLevel2WindowSum(newSum);

    setTimeout(() => {
      setIsMovingWindow2(false);
      // Level 2 completion logic: if currentWindow.end reaches level2Numbers.length - 1
      if (newEnd === level2Numbers.length - 1) {
        setIsLevel2Complete(true);
        handleLevelComplete(2); // Removed attempts parameter
      }
    }, 500);
  };

  // Handle sliding window movement for Level 3 (Variable Window)
  const handleSlideWindow3 = () => {
    if (isSlidingWindow3 || level3WindowEnd > level3Numbers.length) return; // Prevent out of bounds
    setIsSlidingWindow3(true);

    let currentSum = level3WindowSum;
    let windowStart = level3WindowStart;
    let windowEnd = level3WindowEnd;
    let minLength = level3MinLength;
    let newGameComplete = isLevel3Complete;

    // Expand window
    if (windowEnd < level3Numbers.length) {
      currentSum += level3Numbers[windowEnd];
      windowEnd++;
    }

    // Contract window if sum is greater than or equal to target
    while (currentSum >= level3TargetSum) {
      minLength = Math.min(minLength, windowEnd - windowStart);
      currentSum -= level3Numbers[windowStart];
      windowStart++;
    }

    // Check if we've processed all possible starting points
    if (windowEnd === level3Numbers.length && currentSum < level3TargetSum) {
      newGameComplete = true;
      if (minLength === Infinity) {
        // No subarray found
        setGameMessage('No subarray found that meets the target sum.');
      } else {
        handleLevelComplete(3); // Removed attempts parameter
      }
    }

    setLevel3WindowSum(currentSum);
    setLevel3MinLength(minLength);
    setLevel3WindowStart(windowStart);
    setLevel3WindowEnd(windowEnd);
    setIsLevel3Complete(newGameComplete);

    setTimeout(() => {
      setIsSlidingWindow3(false);
      // If not yet complete, recursively call to continue sliding
      if (!newGameComplete) {
        // No need for recursion here, just let the user click again to continue
        // The state update will reflect the new window position
      }
    }, 500);
  };

  // Handle sliding window movement for Level 4 (Hash Map)
  const handleSlideWindow4 = () => {
    if (isSlidingWindow4 || level4WindowEnd > level4String.length) return; // Prevent out of bounds
    setIsSlidingWindow4(true);

    let windowStart = level4WindowStart;
    let windowEnd = level4WindowEnd;
    let charFrequency = { ...level4CharFrequency };
    let longestLength = level4LongestLength;
    let newGameComplete = isLevel4Complete;

    // Expand window
    if (windowEnd < level4String.length) {
      const char = level4String[windowEnd];
      charFrequency[char] = (charFrequency[char] || 0) + 1;
      windowEnd++;
    }

    // Contract window if distinct characters exceed K
    while (Object.keys(charFrequency).length > level4K) {
      const char = level4String[windowStart];
      charFrequency[char]--;
      if (charFrequency[char] === 0) {
        delete charFrequency[char];
      }
      windowStart++;
    }

    // Update longest length
    if (Object.keys(charFrequency).length <= level4K) { // Ensure window is valid before updating length
      longestLength = Math.max(longestLength, windowEnd - windowStart);
    }

    // Check for completion: All characters processed
    if (windowEnd === level4String.length && Object.keys(charFrequency).length <= level4K) {
      newGameComplete = true;
      handleLevelComplete(4); // Removed attempts parameter
    }

    setLevel4CharFrequency(charFrequency);
    setLevel4LongestLength(longestLength);
    setLevel4WindowStart(windowStart);
    setLevel4WindowEnd(windowEnd);
    setIsLevel4Complete(newGameComplete);

    setTimeout(() => {
      setIsSlidingWindow4(false);
    }, 500);
  };

  // Handle sliding window movement for Level 5 (Constraint) - formerly Level 6
  const handleSlideWindow5 = () => {
    if (isSlidingWindow5 || level5WindowEnd > level5Fruits.length) return; // Prevent out of bounds
    setIsSlidingWindow5(true);

    let windowStart = level5WindowStart;
    let windowEnd = level5WindowEnd;
    let fruitFrequency = { ...level5FruitFrequency }; // Create a new object to avoid direct state mutation
    let maxFruits = level5MaxFruits;
    let newGameComplete = isLevel5Complete;

    // Expand window
    if (windowEnd < level5Fruits.length) {
      const fruit = level5Fruits[windowEnd];
      fruitFrequency[fruit] = (fruitFrequency[fruit] || 0) + 1;
      windowEnd++;
    }

    // Contract window if distinct fruit types exceed 2
    while (Object.keys(fruitFrequency).length > 2) {
      const fruit = level5Fruits[windowStart];
      fruitFrequency[fruit]--;
      if (fruitFrequency[fruit] === 0) {
        delete fruitFrequency[fruit];
      }
      windowStart++;
    }

    // Update max fruits after expansion and potential contraction
    maxFruits = Math.max(maxFruits, windowEnd - windowStart);

    // Check for completion: All fruits processed
    if (windowEnd === level5Fruits.length) {
      newGameComplete = true;
      handleLevelComplete(5); // Removed attempts parameter
    }

    setLevel5FruitFrequency(fruitFrequency);
    setLevel5MaxFruits(maxFruits);
    setLevel5WindowStart(windowStart);
    setLevel5WindowEnd(windowEnd);
    setIsLevel5Complete(newGameComplete);

    setTimeout(() => {
      setIsSlidingWindow5(false);
    }, 500);
  };

  // Handle two pointer movement for Level 6 - formerly Level 7
  const handleMovePointers6 = () => {
    if (isMovingPointers6) return;
    setIsMovingPointers6(true);

    const currentSum = level6Array[level6LeftPointer] + level6Array[level6RightPointer];
    
    if (currentSum === level6TargetSum) {
      setIsLevel6Complete(true);
      handleLevelComplete(6); // Removed attempts parameter
    } else if (currentSum < level6TargetSum) {
      setLevel6LeftPointer(prev => prev + 1);
    } else {
      setLevel6RightPointer(prev => prev - 1);
    }

    setTimeout(() => {
      setIsMovingPointers6(false);
    }, 500);
  };

  // Handle middle finder movement for Level 7
  const handleMovePointers7 = () => {
    if (isMovingPointers7) return;
    setIsMovingPointers7(true);

    const left = level7LeftPointer;
    const right = level7RightPointer;
    
    // Move pointers towards the middle
    if (left < right) {
      setLevel7LeftPointer(left + 1);
      setLevel7RightPointer(right - 1);
      setLevel7Message('Moving closer to the middle...');
    } else {
      // Pointers have met in the middle
      setIsLevel7Complete(true);
      setLevel7Message('You found the middle balloon! 🎉');
      handleLevelComplete(7); // Removed attempts parameter
    }

    setTimeout(() => {
      setIsMovingPointers7(false);
    }, 500);
  };

  // Handle matching pairs check for Level 8 (now just checks for match)
  const handleCheckMatch8 = () => {
    if (isLevel8Complete || foundMatch8) return;

    const left = level8LeftPointer;
    const right = level8RightPointer;

    if (left < right) {
      if (level8Fruits[left] === level8Fruits[right]) {
        setFoundMatch8(true);
        setIsLevel8Complete(true);
        setLevel8Message(`Yay! You found a matching pair of ${level8Fruits[left]}s! 🎉`);
        handleLevelComplete(8); // Removed attempts parameter
      } else {
        setLevel8Message('No match at current pointers. Keep moving!');
      }
    } else {
      setLevel8Message('Pointers have crossed/met. No match found in this path. Reset to try again!');
    }
  };

  // Handle moving left pointer for Level 8
  const handleMoveLeftPointer8 = () => {
    if (level8LeftPointer < level8RightPointer - 1 && !isLevel8Complete) {
      setLevel8LeftPointer(prev => prev + 1);
      setLevel8Message('Moving left pointer...');
    } else if (level8LeftPointer >= level8RightPointer - 1) {
      setLevel8Message('Left pointer cannot move further right!');
    }
  };

  // Handle moving right pointer for Level 8
  const handleMoveRightPointer8 = () => {
    if (level8RightPointer > level8LeftPointer + 1 && !isLevel8Complete) {
      setLevel8RightPointer(prev => prev - 1);
      setLevel8Message('Moving right pointer...');
    } else if (level8RightPointer <= level8LeftPointer + 1) {
      setLevel8Message('Right pointer cannot move further left!');
    }
  };

  // Handle water collection for Level 9
  const handleCalculateArea9 = () => {
    if (isCalculating9 || isLevel9Complete || level9LeftPointer >= level9RightPointer) {
      if (level9LeftPointer >= level9RightPointer && !isLevel9Complete) {
        // Pointers have crossed or met, level is complete
        setIsLevel9Complete(true);
        setLevel9Message(`Challenge Complete! Max Area Found: ${level9MaxArea} 🎉`);
        handleLevelComplete(9); // Removed attempts parameter
      }
      return;
    }

    setIsCalculating9(true);

    const left = level9LeftPointer;
    const right = level9RightPointer;
    const heightLeft = level9Heights[left];
    const heightRight = level9Heights[right];

    // Calculate current area
    const currentWidth = right - left;
    const currentHeight = Math.min(heightLeft, heightRight);
    const calculatedArea = currentWidth * currentHeight;
    setLevel9CurrentArea(calculatedArea);

    console.log(`Current Area Calculation: width=${currentWidth}, height=${currentHeight}, area=${calculatedArea}`);
    console.log(`Pointers: L=${left} (height=${heightLeft}), R=${right} (height=${heightRight})`);

    // Update max area
    if (calculatedArea > level9MaxArea) {
      setLevel9MaxArea(calculatedArea);
    }

    // Move pointer inward (strategic movement)
    if (heightLeft < heightRight) {
      setLevel9LeftPointer(left + 1);
      setLevel9Message(`Area: ${calculatedArea}. Move left pointer to ${heightLeft} < ${heightRight}.`);
    } else if (heightRight < heightLeft) {
      setLevel9RightPointer(right - 1);
      setLevel9Message(`Area: ${calculatedArea}. Move right pointer to ${heightRight} < ${heightLeft}.`);
    } else {
      // If heights are equal, move both (or one, convention varies)
      setLevel9LeftPointer(left + 1);
      setLevel9RightPointer(right - 1);
      setLevel9Message(`Area: ${calculatedArea}. Heights are equal, moving both pointers.`);
    }

    setTimeout(() => {
      setIsCalculating9(false);
    }, 700);
  };

  // Handle sliding window for Level 10
  const handleSlideWindow10 = () => {
    if (isSliding10 || level10WindowEnd >= level10Numbers.length) return;

    setIsSliding10(true);
    setLevel10Step(prev => prev + 1);

    // Calculate current window sum
    let currentSum = 0;
    for (let i = level10WindowStart; i <= level10WindowEnd; i++) {
      currentSum += level10Numbers[i];
    }
    setLevel10CurrentSum(currentSum);

    // Update max sum if current sum is larger
    if (currentSum > level10MaxSum) {
      setLevel10MaxSum(currentSum);
      setLevel10Message(`New maximum sum found: ${currentSum}`);
    }

    // Move window
    if (level10WindowEnd - level10WindowStart + 1 === level10WindowSize) {
      setLevel10WindowStart(prev => prev + 1);
    }
    setLevel10WindowEnd(prev => prev + 1);

    // Check if we've reached the end
    if (level10WindowEnd >= level10Numbers.length - 1) {
      setIsLevel10Complete(true);
      setLevel10Message(`Challenge complete! Maximum sum found: ${level10MaxSum}`);
      handleLevelComplete(10); // Add this line to call level completion
    }

    setIsSliding10(false);
  };

  // Render Level 1: Sliding Window
  const renderLevel1 = () => {
    console.log('Render Level 1: isMovingWindow=', isMovingWindow, 'currentWindow.end=', currentWindow.end, 'numbers.length=', numbers.length, 'isLevel1Complete=', isLevel1Complete);
    return (
      <div className="flex flex-col items-center space-y-8">
        {/* Instructions Panel */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 w-full max-w-4xl">
          <h3 className="text-2xl font-bold text-blue-600 mb-4">🪟 Sliding Window: The Moving Frame</h3>
          <div className="grid md:grid-cols-2 gap-4 ">
            <div>
              <h4 className="font-semibold mb-2 text-pink-400">How it works:</h4>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• Start with a window of size 3 at the beginning</li>
                <li>• Calculate the sum of numbers inside the window</li>
                <li>• Slide the window one position to the right</li>
                <li>• Keep track of the maximum sum found</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-pink-400">Visual Guide:</h4>
              <ul className="space-y-1 text-sm text-green-600">
                <li>• <span className="bg-green-500 text-white px-2 py-1 rounded">Green</span> numbers are inside the current window</li>
                <li>• <span className="bg-gray-600 text-white px-2 py-1 rounded">Gray</span> numbers are outside the window</li>
                <li>• Find the maximum sum of any window of size 3!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Progress Display */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-purple-700">Current Window Sum: <span className="text-yellow-600">{windowSum}</span></p>
            <p className="text-lg font-semibold text-purple-700">Maximum Sum Found: <span className="text-green-600">{maxSum}</span></p>
          </div>
        </div>

        {/* Number Line Visualization */}
        <div className="flex justify-center items-center bg-gradient-to-b from-gray-50 to-gray-100 p-6 rounded-2xl shadow-lg border-2 border-gray-200 min-h-[200px] w-full max-w-4xl">
          {numbers.map((num, index) => {
            const isInWindow = index >= currentWindow.start && index <= currentWindow.end;
            return (
              <motion.div
                key={index}
                layoutId={`number-${index}`}
                className={`w-20 h-20 rounded-xl shadow-lg flex items-center justify-center text-2xl font-bold mx-3 relative transition-all duration-300 hover:scale-110
                  ${isInWindow 
                    ? 'bg-gradient-to-br from-green-500 to-green-600 text-white border-2 border-green-400' 
                    : 'bg-gradient-to-br from-gray-400 to-gray-600 text-white border-2 border-gray-300'
                  }`}
              >
                {num}
                {isInWindow && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-600 font-semibold text-sm bg-white px-2 py-1 rounded-full shadow-md">
                    {index === currentWindow.start ? 'Start' : index === currentWindow.end ? 'End' : 'Mid'}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Control Buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={handleSlideWindow}
            disabled={isMovingWindow || currentWindow.end >= numbers.length - 1}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
          >
            ➡️ Slide Window
          </button>
          <button
            onClick={initializeLevel1}
            className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-xl transition-all duration-300 hover:from-gray-600 hover:to-gray-700 hover:scale-105 shadow-lg"
          >
            🔄 Reset Numbers
          </button>
        </div>

        {/* Window Status */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
          <div className="text-center">
            <span className="text-lg font-semibold text-blue-600">
              Window Position: [{currentWindow.start}, {currentWindow.end}] | Size: {currentWindow.end - currentWindow.start + 1}
            </span> 
          </div>
        </div>
      </div>
    );
  };

  // Render Level 2: Maximum Sum Subarray (Fixed Window)
  const renderLevel2 = () => {
    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-blue-50 p-6 rounded-lg w-full max-w-4xl mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Fixed Sliding Window: Optimized Sum</h3>
          <div className="text-blue-700 space-y-2">
            <p>Optimize your sliding window by avoiding recalculating the entire sum!</p>
            <ul className="list-disc list-inside space-y-1">
              <li>We have a fixed window size of K={level2WindowSize}</li>
              <li>Instead of summing all elements each time, we:</li>
              <li className="ml-4">Subtract the element leaving the window</li>
              <li className="ml-4">Add the new element entering the window</li>
              <li>Blue numbers are inside the current window</li>
              <li>Gray numbers are outside the window</li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg text-gray-300">Find the maximum sum of {level2WindowSize} consecutive elements!</p>
          <p className="text-sm text-gray-400">Current Window Sum: <span className="font-bold text-yellow-300">{level2WindowSum}</span></p>
          <p className="text-sm text-gray-400">Maximum Sum Found: <span className="font-bold text-green-300">{level2MaxSum}</span></p>
        </div>

        {/* Number Line */}
        <div className="flex justify-center items-center bg-gray-800 p-4 rounded-lg min-h-[150px] w-full max-w-4xl shadow-lg">
          {level2Numbers.map((num, index) => {
            const isInWindow = index >= level2CurrentWindow.start && index <= level2CurrentWindow.end;
            return (
              <motion.div
                key={index}
                layoutId={`number2-${index}`}
                className={`w-16 h-16 rounded-lg shadow-md flex items-center justify-center text-2xl font-bold
                  ${isInWindow ? 'bg-blue-500' : 'bg-gray-600'} text-white mx-2 relative`}
              >
                {num}
                {isInWindow && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-blue-300">
                    {index === level2CurrentWindow.start ? 'Start' : index === level2CurrentWindow.end ? 'End' : ''}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="w-full max-w-md flex justify-center space-x-4 mt-4">
          <button
            onClick={handleSlideWindow2}
            disabled={isMovingWindow2 || isLevel2Complete}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Slide Window
          </button>
          <button
            onClick={initializeLevel2}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Numbers
          </button>
        </div>
      </div>
    );
  };

  // Render Level 3: Variable Sliding Window
  const renderLevel3 = () => {
    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-blue-50 p-6 rounded-lg w-full max-w-4xl mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Variable Sliding Window: Smallest Subarray</h3>
          <div className="text-blue-700 space-y-2">
            <p>Variable Sliding Window is used when the window size is not fixed!</p>
            <ul className="list-disc list-inside space-y-1">
              <li>We have a target sum of {level3TargetSum}</li>
              <li>We slide the window to find the smallest subarray with a sum greater than or equal to the target</li>
              <li>Blue numbers are inside the current window</li>
              <li>Gray numbers are outside the window</li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">Find the smallest subarray with a sum greater than or equal to {level3TargetSum}!</p>
          <p className="text-sm text-gray-400">Current Window Sum: <span className="font-bold text-yellow-300">{level3WindowSum}</span></p>
          <p className="text-sm text-gray-400">Minimum Length: <span className="font-bold text-green-300">{level3MinLength}</span></p>
        </div>

        {/* Number Line */}
        <div className="flex justify-center items-center bg-blue-200 p-4 rounded-lg min-h-[150px] w-full max-w-4xl shadow-lg">
          {level3Numbers.map((num, index) => {
            const isInWindow = index >= level3WindowStart && index <= level3WindowEnd;
            return (
              <motion.div
                key={index}
                layoutId={`number3-${index}`}
                className={`w-16 h-16 rounded-lg shadow-md flex items-center justify-center text-2xl font-bold
                  ${isInWindow ? 'bg-blue-600' : 'bg-gray-400'} text-white mx-2 relative`}
              >
                {num}
                {isInWindow && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-600">
                    {index === level3WindowStart ? 'Start' : index === level3WindowEnd ? 'End' : ''}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="w-full max-w-md flex justify-center space-x-4 mt-4">
          <button
            onClick={handleSlideWindow3}
            disabled={isSlidingWindow3 || isLevel3Complete}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Slide Window
          </button>
          <button
            onClick={initializeLevel3}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Numbers
          </button>
        </div>
      </div>
    );
  };

  // Render Level 4: Longest Substring with K Distinct Characters
  const renderLevel4 = () => {
    // Helper to render character frequency map
    const renderCharFrequency = () => {
      return (Object.keys(level4CharFrequency).length > 0 ?
        <div className="bg-blue-200 p-3 rounded-lg mt-4 w-full max-w-sm">
          <p className="text-lg font-bold mb-2 text-blue-600">Character Frequencies:</p>
          {Object.entries(level4CharFrequency).map(([char, count]) => (
            <p key={char} className="text-pink-600">'{char}': {count}</p>
          ))}
        </div>
        : null
      );
    };

    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-blue-50 p-6 rounded-lg w-full max-w-4xl mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Sliding Window with Hash Map: Distinct Characters</h3>
          <div className="text-blue-700 space-y-2">
            <p>Use a sliding window combined with a hash map to efficiently track character frequencies!</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Find the longest substring that contains exactly K={level4K} distinct characters.</li>
              <li>Expand the window by adding characters and updating their frequency in the hash map.</li>
              <li>If the number of distinct characters exceeds K, contract the window from the left.</li>
              <li>Remove characters from the hash map if their count drops to zero during contraction.</li>
              <li>Blue characters are inside the current window.</li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">String: "{level4String}" | K: {level4K}</p>
          <p className="text-sm text-gray-400">Current Window: <span className="font-bold text-yellow-300">{level4String.substring(level4WindowStart, level4WindowEnd)}</span></p>
          <p className="text-sm text-gray-400">Longest Length: <span className="font-bold text-green-300">{level4LongestLength}</span></p>
          {renderCharFrequency()}
        </div>

        {/* String Visualization */}
        <div className="flex justify-center items-center bg-blue-200 p-4 rounded-lg min-h-[150px] w-full max-w-4xl shadow-lg">
          {level4String.split('').map((char, index) => {
            const isInWindow = index >= level4WindowStart && index < level4WindowEnd;
            return (
              <motion.div
                key={index}
                layoutId={`char-${index}`}
                className={`w-16 h-16 rounded-lg shadow-md flex items-center justify-center text-2xl font-bold
                  ${isInWindow ? 'bg-blue-600' : 'bg-gray-400'} text-white mx-1 relative`}
              >
                {char}
                {isInWindow && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-blue-600 text-xs">
                    {index === level4WindowStart ? 'Start' : index === level4WindowEnd - 1 ? 'End' : ''}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="w-full max-w-md flex justify-center space-x-4 mt-4">
          <button
            onClick={handleSlideWindow4}
            disabled={isSlidingWindow4 || isLevel4Complete}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Slide Window
          </button>
          <button
            onClick={initializeLevel4}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    );
  };

  // Render Level 5: Maximum Fruits in Baskets (formerly Level 6)
  const renderLevel5 = () => {
    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-blue-50 p-6 rounded-lg w-full max-w-4xl mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Sliding Window with Constraint: Maximum Fruits</h3>
          <div className="text-blue-700 space-y-2">
            <p>Use a sliding window to pick the maximum number of fruits from a basket with only 2 types!</p>
            <ul className="list-disc list-inside space-y-1">
              <li>We have a basket of fruits with only 2 types.</li>
              <li>We slide the window to pick the maximum number of fruits.</li>
              <li>Blue fruits are inside the current window.</li>
              <li>Gray fruits are outside the window.</li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">Fruits: {level5Fruits.join(', ')}</p>
          <p className="text-sm text-gray-400">Current Window: <span className="font-bold text-yellow-300">{level5Fruits.slice(level5WindowStart, level5WindowEnd).join(', ')}</span></p>
          <p className="text-sm text-gray-400">Maximum Fruits: <span className="font-bold text-green-300">{level5MaxFruits}</span></p>
        </div>

        {/* Number Line */}
        <div className="flex justify-center items-center bg-blue-200 p-4 rounded-lg min-h-[150px] w-full max-w-4xl shadow-lg">
          {level5Fruits.map((fruit, index) => {
            const isInWindow = index >= level5WindowStart && index < level5WindowEnd;
            return (
              <motion.div
                key={index}
                layoutId={`fruit-${index}`}
                className={`w-16 h-16 rounded-lg shadow-md flex items-center justify-center text-2xl font-bold
                  ${isInWindow ? 'bg-blue-600' : 'bg-gray-400'} text-white mx-2 relative`}
              >
                {fruit}
                {isInWindow && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-600">
                    {index === level5WindowStart ? 'Start' : index === level5WindowEnd - 1 ? 'End' : ''}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="w-full max-w-md flex justify-center space-x-4 mt-4">
          <button
            onClick={handleSlideWindow5}
            disabled={isSlidingWindow5 || isLevel5Complete}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Slide Window
          </button>
          <button
            onClick={initializeLevel5}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Fruits
          </button>
        </div>
      </div>
    );
  };

  // Render Level 6: Two Sum in Sorted Array (formerly Level 7)
  const renderLevel6 = () => {
    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-blue-50 p-6 rounded-lg w-full max-w-4xl mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Two Sum: Find Pair in Sorted Array</h3>
          <div className="text-blue-700 space-y-2">
            <p>Use the basic two-pointer technique to find two numbers that sum to a target in a sorted array.</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Start with a left pointer at the beginning and a right pointer at the end.</li>
              <li>If the sum is less than the target, move the left pointer right.</li>
              <li>If the sum is greater than the target, move the right pointer left.</li>
              <li>If the sum equals the target, you found the pair!</li>
              <li>Blue numbers are the current pointers.</li>
              <li>Gray numbers are not being considered.</li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">Find two numbers that sum to {level6TargetSum}!</p>
          <p className="text-sm text-gray-400">Current Sum: <span className="font-bold text-yellow-300">{level6LeftPointer < level6Array.length && level6RightPointer >= 0 && level6LeftPointer <= level6RightPointer ? level6Array[level6LeftPointer] + level6Array[level6RightPointer] : 'N/A'}</span></p>
        </div>

        {/* Number Line */}
        <div className="flex justify-center items-center bg-blue-200 p-4 rounded-lg min-h-[150px] w-full max-w-4xl shadow-lg">
          {level6Array.map((num, index) => {
            const isPointer = index === level6LeftPointer || index === level6RightPointer;
            return (
              <motion.div
                key={index}
                layoutId={`number6-${index}`}
                className={`w-16 h-16 rounded-lg shadow-md flex items-center justify-center text-2xl font-bold
                  ${isPointer ? 'bg-blue-600' : 'bg-gray-400'} text-white mx-2`}
              >
                {num}
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="w-full max-w-md flex justify-center space-x-4 mt-4">
          <button
            onClick={handleMovePointers6}
            disabled={isMovingPointers6 || isLevel6Complete}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Move Pointers
          </button>
          <button
            onClick={initializeLevel6}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Array
          </button>
        </div>
      </div>
    );
  };

  // Render Level 7: Middle Finder
  const renderLevel7 = () => {
    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-blue-50 p-6 rounded-lg w-full max-w-4xl mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-3">The Middle Finder: Two Pointers Adventure</h3>
          <div className="text-blue-700 space-y-2">
            <p>Help find the middle balloon using two pointers!</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Start with one pointer at each end of the line</li>
              <li>Move both pointers towards the middle</li>
              <li>When they meet, you've found the middle!</li>
              <li>Blue balloons are where the pointers are</li>
              <li>Gray balloons are not being pointed at</li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">Find the middle balloon!</p>
          <p className="text-sm text-gray-400">{level7Message}</p>
        </div>

        {/* Balloon Line */}
        <div className="flex justify-center items-center bg-blue-200 p-4 rounded-lg min-h-[200px] w-full max-w-4xl shadow-lg">
          {level7Balloons.map((num, index) => {
            const isPointer = index === level7LeftPointer || index === level7RightPointer;
            const isMiddle = index === Math.floor(level7Balloons.length / 2);
            return (
              <motion.div
                key={index}
                layoutId={`balloon-${index}`}
                className={`w-20 h-24 rounded-full shadow-md flex items-center justify-center text-2xl font-bold
                  ${isPointer ? 'bg-blue-500' : 'bg-gray-600'} 
                  ${isMiddle && isLevel7Complete ? 'bg-green-500' : ''} 
                  text-white mx-2 relative transform hover:scale-110 transition-transform`}
                style={{
                  backgroundImage: isPointer ? 'radial-gradient(circle at 30% 30%, #60A5FA, #3B82F6)' : 
                                  isMiddle && isLevel7Complete ? 'radial-gradient(circle at 30% 30%, #34D399, #059669)' :
                                  'radial-gradient(circle at 30% 30%, #9CA3AF, #4B5563)'
                }}
              >
                {num}
                {isPointer && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-blue-600 text-sm font-bold">
                    {index === level7LeftPointer ? 'Left' : 'Right'}
                  </div>
                )}
                {isMiddle && isLevel7Complete && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-green-300 text-sm font-bold">
                    Middle!
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="w-full max-w-md flex justify-center space-x-4 mt-4">
          <button
            onClick={handleMovePointers7}
            disabled={isMovingPointers7 || isLevel7Complete}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Move Pointers
          </button>
          <button
            onClick={initializeLevel7}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Balloons
          </button>
        </div>
      </div>
    );
  };

  // Render Level 8: Matching Pairs Picnic
  const renderLevel8 = () => {
    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-green-50 p-6 rounded-lg w-full max-w-4xl mb-4">
          <h3 className="text-xl font-bold text-green-800 mb-3">The Matching Pairs Picnic: Find Identical Fruits!</h3>
          <div className="text-green-700 space-y-2">
            <p>Help find matching pairs of fruits using two pointers!</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Start with one pointer at each end of the fruit basket.</li>
              <li>Click 'Check Match' to see if the fruits at your pointers are the same.</li>
              <li>If they're not, move the pointers closer to the middle.</li>
              <li>Find a match to complete the level!</li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">Find a matching pair of fruits!</p>
          <p className="text-sm text-gray-400">{String(level8Message || '')}</p>
        </div>

        {/* Fruit Line */}
        <div className="flex justify-center items-center bg-blue-200 p-4 rounded-lg min-h-[200px] w-full max-w-4xl shadow-lg">
          {level8Fruits.map((fruit, index) => {
            const isLeftPointer = index === level8LeftPointer;
            const isRightPointer = index === level8RightPointer;
            const isMatched = foundMatch8 && (isLeftPointer || isRightPointer);

            let itemClass = 'bg-gray-600';
            let pointerLabel = '';

            if (isLeftPointer || isRightPointer) {
              itemClass = 'bg-orange-500'; // Pointers are orange
              if (isLeftPointer) pointerLabel = 'Left';
              if (isRightPointer) pointerLabel = 'Right';
            }

            if (isMatched) {
              itemClass = 'bg-green-600'; // Matched items turn green
            }

            return (
              <motion.div
                key={index}
                layoutId={`fruit-${index}`}
                className={`w-24 h-24 rounded-full shadow-md flex items-center justify-center text-4xl font-bold
                  ${itemClass}
                  text-white mx-2 relative transform hover:scale-110 transition-transform`}
                style={{
                  backgroundImage: isMatched ? 'radial-gradient(circle at 30% 30%, #34D399, #059669)' :
                                  (isLeftPointer || isRightPointer) ? 'radial-gradient(circle at 30% 30%, #FBBF24, #F59E0B)' :
                                  'radial-gradient(circle at 30% 30%, #9CA3AF, #4B5563)'
                }}
              >
                {fruit}
                {(isLeftPointer || isRightPointer) && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-orange-800 text-sm font-bold">
                    {pointerLabel}
                  </div>
                )}
                {isMatched && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-green-600 text-sm font-bold">
                    Match!
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="w-full max-w-md flex justify-center space-x-4 mt-4">
          <button
            onClick={handleMoveLeftPointer8}
            disabled={isLevel8Complete || level8LeftPointer >= level8RightPointer - 1}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Move Left →
          </button>
          <button
            onClick={handleMoveRightPointer8}
            disabled={isLevel8Complete || level8RightPointer <= level8LeftPointer + 1}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            ← Move Right
          </button>
          <button
            onClick={handleCheckMatch8}
            disabled={isLevel8Complete}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            Check Match!
          </button>
          <button
            onClick={initializeLevel8}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Fruits
          </button>
        </div>
      </div>
    );
  };

  // Render Level 9: Water Collector Challenge
  const renderLevel9 = () => {
    // Define bar dimensions for consistent calculations (still useful for local logic)
    const barWidthPx = 48; // w-12 = 48px
    const barMarginPx = 8; // mx-1 = 0.5rem on each side = 8px total per bar
    const barTotalWidthPx = barWidthPx + barMarginPx; // 56px

    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-blue-50 p-6 rounded-lg w-full max-w-4xl mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-3">The Water Collector Challenge: Maximize Your Container!</h3>
          <div className="text-blue-700 space-y-2">
            <p>Find two lines that can hold the most water!</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Each number is a line's height.</li>
              <li>You pick two lines (your pointers).</li>
              <li>The water area is determined by the shorter line's height and the distance between them.</li>
              <li>Strategically move the shorter line's pointer inward to try and find a taller line.</li>
              <li>Red lines are your current pointers.</li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">Goal: Find the maximum water area!</p>
          <p className="text-sm text-gray-400">Current Area: <span className="font-bold text-yellow-300">{level9CurrentArea}</span> | Max Area Found: <span className="font-bold text-green-300">{level9MaxArea}</span></p>
          <p className="text-sm text-gray-400">{level9Message}</p>
        </div>

        {/* Height Bars */}
        <div ref={barsContainerRef} className="flex justify-center items-end bg-blue-200 p-4 rounded-lg min-h-[250px] w-full max-w-4xl shadow-lg relative">
          {level9Heights.map((height, index) => {
            const isLeftPointer = index === level9LeftPointer;
            const isRightPointer = index === level9RightPointer;
            const isPointer = isLeftPointer || isRightPointer;

            // Revert bar coloring: default grey unless it's a pointer
            let barBgColor = 'bg-gray-600'; // Default color
            let barGradient = 'linear-gradient(to top, #6B7280, #4B5563)'; // Default gradient

            if (isPointer) {
              barBgColor = 'bg-red-500'; // Pointers are red
              barGradient = 'linear-gradient(to top, #EF4444, #DC2626)';
            }

            return (
              <motion.div
                key={index}
                layoutId={`bar-${index}`}
                className={`w-12 mx-1 shadow-md flex items-end justify-center text-xl font-bold rounded-t-md
                  ${barBgColor} text-white relative`}
                style={{
                  height: `${height * 20}px`, // Scale height for visualization
                  backgroundImage: barGradient
                }}
              >
                {height}
                {isPointer && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-red-600 text-sm font-bold">
                    {isLeftPointer ? 'Left' : 'Right'}
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Visual water overlay */}
          {level9LeftPointer < level9RightPointer && (
            <div
              className="absolute bottom-0 bg-blue-800 z-10" // Class for styling (opacity is in style object)
              style={waterOverlayStyle} // Apply dynamic style from state
            />
          )}
        </div>

        {/* Controls */}
        <div className="w-full max-w-md flex justify-center space-x-4 mt-4">
          <button
            onClick={handleCalculateArea9}
            disabled={isCalculating9 || isLevel9Complete || level9LeftPointer >= level9RightPointer}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Calculate Next Area
          </button>
          <button
            onClick={initializeLevel9}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Challenge
          </button>
        </div>
      </div>
    );
  };

  // Render Level 10: Subarray Sum Challenge
  const renderLevel10 = () => {
    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-blue-50 p-6 rounded-lg shadow-lg max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Level 10: The Subarray Sum Challenge</h2>
          <p className="text-blue-700 mb-4">
            Find the maximum sum of a subarray of size {level10WindowSize}. 
            The array contains both positive and negative numbers.
            Use the sliding window technique to efficiently find the maximum sum.
          </p>
          <div className="text-pink-400 font-mono text-lg">
            Current Sum: {level10CurrentSum} | Max Sum: {level10MaxSum}
          </div>
          {level10Message && (
            <div className="mt-4 p-3 bg-blue-900 rounded-lg text-blue-200">
              {level10Message}
            </div>
          )}
        </div>

        {/* Number Bars */}
        <div className="flex justify-center items-end bg-blue-200 p-4 rounded-lg min-h-[250px] w-full max-w-4xl shadow-lg relative">
          {level10Numbers.map((num, index) => {
            const isInWindow = index >= level10WindowStart && index <= level10WindowEnd;
            const isWindowStart = index === level10WindowStart;
            const isWindowEnd = index === level10WindowEnd;

            let barBgColor = 'bg-gray-600';
            let barGradient = 'linear-gradient(to top, #6B7280, #4B5563)';

            if (isInWindow) {
              if (isWindowStart || isWindowEnd) {
                barBgColor = 'bg-red-800';
                barGradient = 'linear-gradient(to top, #EF4444, #DC2626)';
              } else {
                barBgColor = 'bg-green-800';
                barGradient = 'linear-gradient(to top, #48BB78, #38A169)';
              }
            }

            return (
              <motion.div
                key={index}
                layoutId={`bar-${index}`}
                className={`w-12 mx-1 shadow-md flex items-end justify-center text-xl font-bold rounded-t-md
                  ${barBgColor} text-white relative`}
                style={{
                  height: `${Math.abs(num) * 20}px`,
                  backgroundImage: barGradient
                }}
              >
                {num}
                {isWindowStart && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-red-800 text-sm font-bold">
                    Start
                  </div>
                )}
                {isWindowEnd && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-red-800 text-sm font-bold">
                    End
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex space-x-4">
          <button
            onClick={handleSlideWindow10}
            disabled={isSliding10 || isLevel10Complete}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300
              ${isSliding10 || isLevel10Complete
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            Slide Window
          </button>
          <button
            onClick={initializeLevel10}
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold text-lg transition-all duration-300"
          >
            Reset
          </button>
        </div>

        {/* Step Explanation */}
        {level10Step > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg shadow-lg max-w-2xl">
            <h3 className="text-xl font-bold text-blue-700 mb-2">Step {level10Step}</h3>
            <p className="text-pink-600">
              {level10Explanation}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render current level
  const renderLevel = () => {
    switch (currentLevel) {
      case 1:
        return renderLevel1();
      case 2:
        return renderLevel2();
      case 3:
        return renderLevel3();
      case 4:
        return renderLevel4();
      case 5:
        return renderLevel5();
      case 6:
        return renderLevel6();
      case 7:
        return renderLevel7();
      case 8:
        return renderLevel8();
      case 9:
        return renderLevel9();
      case 10:
        return renderLevel10();
      default:
        return renderLevel1();
    }
  };

  // Render tutorial modal
  const renderTutorialModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl mx-4 border-2 border-green-500">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
            Welcome to Window & Pointer Master! 🎯
          </h2>
          
          <div className="space-y-6">
            {/* Sliding Window Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-3 flex items-center">
                🪟 Sliding Window Technique (Levels 1-4 & 10)
              </h3>
              <div className="space-y-3">
                <p className="text-lg text-blue-700">A powerful technique where we maintain a window of elements and slide it through an array to solve problems efficiently.</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2 text-pink-600">Key Concepts:</h4>
                    <ul className="space-y-1">
                      <li>• Fixed-size windows for consistent analysis</li>
                      <li>• Variable-size windows for dynamic problems</li>
                      <li>• Optimized calculations by reusing previous results</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-pink-600">Common Applications:</h4>
                    <ul className="space-y-1">
                      <li>• Maximum/minimum subarray sums</li>
                      <li>• Longest substring with K distinct characters</li>
                      <li>• Fixed-size window optimizations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Pointer Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-200">
              <h3 className="text-xl font-bold text-emerald-800 mb-3 flex items-center">
                👆 Two Pointer Technique (Levels 5-9)
              </h3>
              <div className="space-y-3 ">
                <p className="text-lg text-blue-700">A technique that uses two pointers to solve array problems efficiently, often reducing time complexity from O(n²) to O(n).</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2 text-pink-600">Key Concepts:</h4>
                    <ul className="space-y-1">
                      <li>• Two pointers moving in different directions</li>
                      <li>• Converging pointers for optimal solutions</li>
                      <li>• Efficient space and time complexity</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-pink-600">Common Applications:</h4>
                    <ul className="space-y-1">
                      <li>• Two sum in sorted arrays</li>
                      <li>• Container with most water</li>
                      <li>• Palindrome checking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowTutorial(false)}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:scale-105"
            >
              🚀 Start Learning!
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative pt-16 min-h-screen">
      <div className="absolute bg-gradient-to-br from-white via-blue-50 to-indigo-100 inset-0 pointer-events-none z-0">
        <GameDecorations />
      </div>
      {/* Card-like main container */}
      <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-3xl shadow-2xl p-8 border-2 border-green-600 relative z-10 flex flex-col items-center">
           {/* Navigation Buttons */}
           <div className="mt-8 mb-8 flex justify-between items-center w-full max-w-4xl">
          <button
            onClick={() => setCurrentLevel(Math.max(1, currentLevel - 1))}
            disabled={currentLevel === 1}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg
              ${currentLevel === 1 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:scale-105'
              }`}
          >
            ← Previous Level
          </button>
          
          <div className="text-center">
            <span className="text-lg font-semibold text-green-700">Level {currentLevel} of 10</span>
          </div>
          
          <button
            onClick={() => setCurrentLevel(Math.min(10, currentLevel + 1))}
            disabled={currentLevel === 10}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg
              ${currentLevel === 10 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105'
              }`}
          >
            Next Level →
          </button>
        </div>
        
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
                        ? 'bg-gradient-to-br from-green-600 to-green-700 text-white scale-110 border-green-600' 
                        : 'bg-gradient-to-br from-green-400 to-green-500 text-white border-green-500'
                      : isCurrent 
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white scale-110 border-green-500' 
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50 hover:border-green-300'
                    } hover:scale-105`}
                  title={isCompleted ? `Level ${levelNumber} - Completed` : `Level ${levelNumber}`}
                >
                  {isCompleted ? '✓' : levelNumber}
                </button>
              );
            })}
          </div>
        </div>

        {/* Game Title */}
        <h1 className="text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-green-600 via-emerald-700 to-green-800 bg-clip-text text-transparent drop-shadow-lg tracking-tight relative z-10 font-serif">
          Window & Pointer Master
        </h1>

        {/* Level Title */}
        <h2 className="text-3xl font-bold text-center mb-4 text-blue-600">
          {currentLevel === 1 ? "Level 1: Basic Sliding Window" :
           currentLevel === 2 ? "Level 2: Fixed Size Window" :
           currentLevel === 3 ? "Level 3: Variable Size Window" :
           currentLevel === 4 ? "Level 4: Window with Hash Map" :
           currentLevel === 5 ? "Level 5: Maximum Fruits in Baskets" :
           currentLevel === 6 ? "Level 6: Two Sum with Pointers" :
           currentLevel === 7 ? "Level 7: Middle Finder" :
           currentLevel === 8 ? "Level 8: Matching Pairs Picnic" :
           currentLevel === 9 ? "Level 9: Water Collector Challenge" :
           currentLevel === 10 ? "Level 10: Subarray Sum Challenge" :
           ""}
        </h2>

        {/* Game Message */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl shadow-lg border border-green-200 w-full max-w-4xl">
          <p className="text-xl text-center text-pink-400 font-semibold">{gameMessage}</p>
        </div>

        {/* Level Content */}
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 border border-green-200">
          {showTutorial && renderTutorialModal()}
          {renderLevel()}
        </div>

        {/* Success Message Modal */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-2 border-green-500">
              <h2 className="text-2xl font-bold text-green-600 mb-4">Level Complete! 🎉</h2>
              <p className="text-lg mb-6 text-gray-700">Great job! You've mastered this technique!</p>
              <div className="flex justify-center space-x-4">
                {currentLevel < 10 ? (
                  <button
                    onClick={() => {
                      setShowSuccess(false);
                      setCurrentLevel(prev => prev + 1);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
                  >
                    Next Level
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
                  >
                    Go to Dashboard
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default WindowPointerMaster; 