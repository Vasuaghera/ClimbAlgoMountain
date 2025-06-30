import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useApi from '../../hooks/useApi';
import { useAuth } from '../../contexts/AuthContext';
import GameDecorations from './GameDecorations';

const SortingMaster = () => {
  const { user } = useAuth();
  const api = useApi();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameMessage, setGameMessage] = useState('Welcome to Sorting Master!');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState({});
  const [completedLevels, setCompletedLevels] = useState(new Set());
  const [levelStartTime, setLevelStartTime] = useState(Date.now());
  const [highestLevel, setHighestLevel] = useState(1);
  const [levelObjectiveMet, setLevelObjectiveMet] = useState(false);
  const [showDashboardButton, setShowDashboardButton] = useState(false); // Add this state variable

  // Level 1: Toy Room Sorting
  const [toys, setToys] = useState([]);
  const [sortingCriteria, setSortingCriteria] = useState('size'); // 'size', 'color', 'type'
  const [selectedToy, setSelectedToy] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [sortingAttempts, setSortingAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  // Add new state for tutorial steps
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [highlightedToy, setHighlightedToy] = useState(null);

  // Level 2: The Library Helper states
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [comparisonMessage, setComparisonMessage] = useState('');
  const [isSortedLevel2, setIsSortedLevel2] = useState(false);
  const [level2Attempts, setLevel2Attempts] = useState(0);

  // Level 3: Bubble Pop Garden states
  const [flowers, setFlowers] = useState([]);
  const [currentComparisonIndex, setCurrentComparisonIndex] = useState(0);
  const [swapsMadeThisPass, setSwapsMadeThisPass] = useState(0);
  const [passesCompleted, setPassesCompleted] = useState(0);
  const [isSortedLevel3, setIsSortedLevel3] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  // Level 4: Selection Tournament states
  const [people, setPeople] = useState([]);
  const [currentMinIndex, setCurrentMinIndex] = useState(null);
  const [currentSelectionZoneStart, setCurrentSelectionZoneStart] = useState(0);
  const [isSortingLevel4, setIsSortingLevel4] = useState(false);
  const [isSortedLevel4, setIsSortedLevel4] = useState(false);

  // Level 5: Insertion Library states
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [currentCardToInsert, setCurrentCardToInsert] = useState(null);
  const [insertionIndex, setInsertionIndex] = useState(null);
  const [isSortingLevel5, setIsSortingLevel5] = useState(false);
  const [isSortedLevel5, setIsSortedLevel5] = useState(false);

  // Level 6: Merge Academy states
  const [array1, setArray1] = useState([]);
  const [array2, setArray2] = useState([]);
  const [mergedArray, setMergedArray] = useState([]);
  const [pointer1, setPointer1] = useState(0);
  const [pointer2, setPointer2] = useState(0);
  const [isSortingLevel6, setIsSortingLevel6] = useState(false);
  const [isSortedLevel6, setIsSortedLevel6] = useState(false);

  // Level 7: Quick Quest states
  const [chests, setChests] = useState([]);
  const [activeRange, setActiveRange] = useState({ start: null, end: null });
  const [pivotIndex, setPivotIndex] = useState(null);
  const [leftPointer, setLeftPointer] = useState(null);
  const [rightPointer, setRightPointer] = useState(null);
  const [sortedRanges, setSortedRanges] = useState([]); // Stores { start, end } of sorted segments
  const [partitionStack, setPartitionStack] = useState([]); // { start, end } ranges to process
  const [isSortingLevel7, setIsSortingLevel7] = useState(false);
  const [isSortedLevel7, setIsSortedLevel7] = useState(false);
  const [currentStepMessage, setCurrentStepMessage] = useState("");

  // Level 8: Heap Mountain states
  const [climbers, setClimbers] = useState([]);
  const [heapSize, setHeapSize] = useState(0);
  const [sortedClimbers, setSortedClimbers] = useState([]);
  const [currentHeapifyRoot, setCurrentHeapifyRoot] = useState(null);
  const [highlightedHeapChildren, setHighlightedHeapChildren] = useState([]);
  const [currentExtractingNode, setCurrentExtractingNode] = useState(null);
  const [isBuildingHeap, setIsBuildingHeap] = useState(true); // Flag to track build vs sort phase
  const [isSortingLevel8, setIsSortingLevel8] = useState(false);
  const [isSortedLevel8, setIsSortedLevel8] = useState(false);

  // Level 9: Counting Factory states
  const [balls, setBalls] = useState([]);
  const [colorCounts, setColorCounts] = useState({});
  const [sortedBalls, setSortedBalls] = useState([]);
  const [colorOrder, setColorOrder] = useState(['red', 'blue', 'green', 'yellow', 'purple']);
  const [currentPhase, setCurrentPhase] = useState('counting'); // 'counting', 'placing'
  const [countingIndex, setCountingIndex] = useState(0); // Index for iterating colors to count
  const [placingIndex, setPlacingIndex] = useState(0); // Index for iterating colors to place
  const [ballHighlightIndex, setBallHighlightIndex] = useState(null); // Highlight ball being processed
  const [isSortingLevel9, setIsSortingLevel9] = useState(false);
  const [isSortedLevel9, setIsSortedLevel9] = useState(false);

  // Ref to store initial counts for placing phase (actual total counts of each color)
  const initialColorCountsRef = useRef({});

  // Level 10: Radix Space Station states
  const [spaceships, setSpaceships] = useState([]);
  const [currentDigitPlace, setCurrentDigitPlace] = useState(1); // 1 for ones, 10 for tens, etc.
  const [radixBuckets, setRadixBuckets] = useState(Array.from({ length: 10 }, () => []));
  const [radixPhase, setRadixPhase] = useState('distributing'); // 'distributing', 'collecting'
  const [maxDigits, setMaxDigits] = useState(0);
  const [spaceshipHighlightId, setSpaceshipHighlightId] = useState(null);
  const [bucketHighlightIndex, setBucketHighlightIndex] = useState(null);
  const [isSortingLevel10, setIsSortingLevel10] = useState(false);
  const [isSortedLevel10, setIsSortedLevel10] = useState(false);
  const [currentBucketIndex, setCurrentBucketIndex] = useState(0);
  const [currentSpaceshipIndexInBucket, setCurrentSpaceshipIndexInBucket] = useState(0);

  // Tutorial steps content
  const tutorialSteps = [
    {
      title: "Welcome to Sorting!",
      content: "Let's learn how to sort things in order. It's like organizing your toys!",
      image: "🎮"
    },
    {
      title: "What is Sorting?",
      content: "Sorting means arranging things in a specific order. Like putting your toys from smallest to biggest!",
      image: "📏"
    },
    {
      title: "Let's Try Sorting by Size",
      content: "First, let's sort these toys by their size. Small toys go first, then medium, then large!",
      image: "⚽"
    },
    {
      title: "How to Move Toys",
      content: "Click a toy to select it, then click another toy to swap their positions!",
      image: "👆"
    },
    {
      title: "Ready to Start!",
      content: "Now you can start sorting! Just click two toys to swap them!",
      image: "🎯"
    }
  ];

  // Toy types and their properties
  const toyTypes = [
    { type: 'ball', sizes: ['small', 'medium', 'large'], colors: ['red', 'blue', 'green', 'yellow'] },
    { type: 'block', sizes: ['small', 'medium', 'large'], colors: ['red', 'blue', 'green', 'yellow'] },
    { type: 'car', sizes: ['small', 'medium', 'large'], colors: ['red', 'blue', 'green', 'yellow'] }
  ];

  // Generate random toys
  const generateToys = () => {
    const newToys = [];
    for (let i = 0; i < 9; i++) {
      const toyType = toyTypes[Math.floor(Math.random() * toyTypes.length)];
      const size = toyType.sizes[Math.floor(Math.random() * toyType.sizes.length)];
      const color = toyType.colors[Math.floor(Math.random() * toyType.colors.length)];
      newToys.push({
        id: i,
        type: toyType.type,
        size,
        color,
        position: i
      });
    }
    return newToys;
  };

  // Initialize Level 1
  const initializeLevel1 = () => {
    const newToys = generateToys();
    // Ensure each toy has a position matching its index
    newToys.forEach((toy, index) => {
      toy.position = index;
    });
    setToys(newToys);
    setSortingAttempts(0);
    setIsCorrect(false);
    setShowSuccess(false);
    setSelectedToy(null);
    setHighlightedToy(null);
    setGameMessage('Sort the toys by size, color, or type!');
  };

  // Initialize Level 2
  const initializeLevel2 = () => {
    const generateBooks = () => {
      const newBooks = [];
      const heights = [50, 70, 90, 110, 130, 150]; // Example heights
      const shuffledHeights = [...heights].sort(() => Math.random() - 0.5);

      for (let i = 0; i < 6; i++) { // 6 books for this level
        newBooks.push({
          id: i,
          height: shuffledHeights[i],
          position: i
        });
      }
      return newBooks;
    };
    setBooks(generateBooks());
    setSelectedBook(null);
    setComparisonMessage('Click two books to swap them and sort by height!');
    setIsSortedLevel2(false);
    setLevel2Attempts(0);
    setShowSuccess(false); // Reset success state for level transition
  };

  // Initialize Level 3
  const initializeLevel3 = () => {
    const heights = [64, 34, 25, 12, 22, 11, 90];
    const newFlowers = heights.map((height, index) => ({
      id: index,
      height,
    }));
    setFlowers(newFlowers);
    setCurrentComparisonIndex(0);
    setSwapsMadeThisPass(0);
    setPassesCompleted(0);
    setIsSortedLevel3(false);
    setIsSorting(false);
    setGameMessage('Help the flowers grow in height order using bubble magic!');
    setShowSuccess(false);
  };

  // Initialize Level 4
  const initializeLevel4 = () => {
    const heights = [170, 185, 160, 195, 175, 165, 190];
    const newPeople = heights.map((height, index) => ({
      id: index,
      height,
    }));
    setPeople(newPeople);
    setCurrentMinIndex(null);
    setCurrentSelectionZoneStart(0);
    setIsSortingLevel4(false);
    setIsSortedLevel4(false);
    setGameMessage('Organize a height contest by selecting the shortest person each round!');
    setShowSuccess(false);
  };

  // Initialize Level 5
  const initializeLevel5 = () => {
    const values = [5, 2, 8, 1, 9, 4, 7, 3, 6]; // Example card values
    const newDeck = values.map((value, index) => ({ id: index, value }));
    setDeck(newDeck);
    setHand([]);
    setCurrentCardToInsert(null);
    setInsertionIndex(null);
    setIsSortingLevel5(false);
    setIsSortedLevel5(false);
    setGameMessage('Organize the deck of playing cards in your hand!');
    setShowSuccess(false);
  };

  // Initialize Level 6
  const initializeLevel6 = () => {
    const arr1 = [10, 20, 30, 40];
    const arr2 = [15, 25, 35, 45];
    setArray1(arr1.map((val, idx) => ({ id: `a1-${idx}`, value: val })));
    setArray2(arr2.map((val, idx) => ({ id: `a2-${idx}`, value: val })));
    setMergedArray([]);
    setPointer1(0);
    setPointer2(0);
    setIsSortingLevel6(false);
    setIsSortedLevel6(false);
    setGameMessage('Organize two pre-sorted groups of students into one big line!');
    setShowSuccess(false);
  };

  // Initialize Level 7
  const initializeLevel7 = () => {
    const values = [60, 20, 80, 10, 90, 40, 70, 30, 50]; // Example chest values
    const newChests = values.map((value, index) => ({ id: index, value }));
    setChests(newChests);
    setActiveRange({ start: 0, end: newChests.length - 1 });
    setPivotIndex(null);
    setLeftPointer(null);
    setRightPointer(null);
    setSortedRanges([]);
    setPartitionStack([{ start: 0, end: newChests.length - 1 }]); // Start with the whole array
    setIsSortingLevel7(false);
    setIsSortedLevel7(false);
    setGameMessage('Organize treasure chests by value using a special "pivot chest"!');
    setCurrentStepMessage('Click "Start Partition" to choose a pivot.');
    setShowSuccess(false);
  };

  // Initialize Level 8
  const initializeLevel8 = () => {
    const strengths = [12, 11, 13, 5, 6, 7, 10, 1, 9]; // Example climber strengths
    const newClimbers = strengths.map((strength, index) => ({ id: index, strength }));
    setClimbers(newClimbers);
    setHeapSize(newClimbers.length);
    setSortedClimbers([]);
    setCurrentHeapifyRoot(null);
    setHighlightedHeapChildren([]);
    setCurrentExtractingNode(null);
    setIsBuildingHeap(true); // Start with build phase
    setIsSortingLevel8(false);
    setIsSortedLevel8(false);
    setGameMessage('Organize climbers on a mountain where the strongest is always at the peak!');
    setShowSuccess(false);
  };

  // Initialize Level 9
  const initializeLevel9 = () => {
    const initialColors = ['red', 'blue', 'green', 'yellow', 'purple', 'red', 'blue', 'green', 'red', 'yellow', 'blue', 'purple'];
    const newBalls = initialColors.map((color, index) => ({ id: index, color, originalIndex: index, counted: false }));
    setBalls(newBalls);
    // Initialize colorCounts to all zeros for counting phase
    const zeroCounts = {};
    colorOrder.forEach(color => (zeroCounts[color] = 0));
    setColorCounts(zeroCounts);
    
    // Calculate actual initial counts from the generated balls for reference in placing phase
    const actualInitialCounts = {};
    colorOrder.forEach(color => (actualInitialCounts[color] = 0));
    newBalls.forEach(ball => {
      actualInitialCounts[ball.color]++;
    });
    initialColorCountsRef.current = actualInitialCounts; // Store actual initial counts

    setSortedBalls([]);
    setCurrentPhase('counting');
    setCountingIndex(0); 
    setPlacingIndex(0);
    setBallHighlightIndex(null);
    setIsSortingLevel9(false);
    setIsSortedLevel9(false);
    setGameMessage('Sort colored balls in a factory using counting machines!');
    setShowSuccess(false);
  };

  // Initialize Level 10
  const initializeLevel10 = () => {
    const initialValues = [170, 45, 75, 90, 2, 802, 24, 66, 123, 400];
    const newSpaceships = initialValues.map((value, index) => ({ id: index, value }));
    setSpaceships(newSpaceships);
    setCurrentDigitPlace(1);
    setRadixBuckets(Array.from({ length: 10 }, () => []));
    setRadixPhase('distributing');
    setMaxDigits(Math.max(...initialValues).toString().length);
    setSpaceshipHighlightId(null);
    setBucketHighlightIndex(null);
    setIsSortingLevel10(false);
    setIsSortedLevel10(false);
    setGameMessage('Organize spacecraft by their ID numbers using digit-by-digit sorting!');
    setShowSuccess(false);
  };

  useEffect(() => {
    if (currentLevel === 1) {
      initializeLevel1();
    } else if (currentLevel === 2) {
      initializeLevel2();
    } else if (currentLevel === 3) {
      initializeLevel3();
    } else if (currentLevel === 4) {
      initializeLevel4();
    } else if (currentLevel === 5) {
      initializeLevel5();
    } else if (currentLevel === 6) {
      initializeLevel6();
    } else if (currentLevel === 7) {
      initializeLevel7();
    } else if (currentLevel === 8) {
      initializeLevel8();
    } else if (currentLevel === 9) {
      initializeLevel9();
    } else if (currentLevel === 10) {
      initializeLevel10();
    }
  }, [currentLevel]);

  // Load progress when component mounts
  useEffect(() => {
    // loadProgress(); // REMOVED: Using proper useEffect below instead
  }, []);

  // Save progress to database
  const saveProgress = async (level, attempts) => {
    if (!user) {
      console.log('[SortingMaster] No user found, progress will not be saved');
      return;
    }

    try {
      console.log(`[SortingMaster] Starting to save progress for level ${level}`);
      console.log('[SortingMaster] User:', user);
      setIsSaving(true);
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('[SortingMaster] No authentication token found');
        return;
      }

      const timeSpent = Math.floor((Date.now() - levelStartTime) / 1000);
      const score = calculateScore(level);

      // Ensure all values are of the correct type and match server expectations
      const progressData = {
        topicId: 'sorting',
        level: Number(level),
        score: Number(score),
        timeSpent: Number(timeSpent)
      };

      console.log('[SortingMaster] Saving progress data:', progressData);
      console.log('[SortingMaster] Token exists:', !!token);

      const response = await fetch('http://localhost:5000/api/game-progress/save-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(progressData)
      });

      console.log('[SortingMaster] Response status:', response.status);
      console.log('[SortingMaster] Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[SortingMaster] Failed to save progress:', errorData.message || response.statusText);
        throw new Error(`Failed to save progress: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      console.log('[SortingMaster] Progress save response:', result);
      
      if (result.success) {
        // Update local state
        setCompletedLevels(prev => {
          const newSet = new Set([...prev, level]);
          console.log('[SortingMaster] Updated completed levels:', newSet);
          return newSet;
        });
        setHighestLevel(Math.max(highestLevel, level));
        
        console.log(`[SortingMaster] Successfully saved progress for level ${level}:`, result);
      } else {
        throw new Error(result.error || 'Failed to save progress');
      }

    } catch (error) {
      console.error('[SortingMaster] Error saving progress:', error);
      console.error('[SortingMaster] Error details:', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate score based on attempts and level
  const calculateScore = (level) => {
    return 10; // Fixed score of 10 points per level, no time bonus
  };

  // Function to handle level completion
  const handleLevelComplete = async (level, attempts) => {
    console.log(`[SortingMaster] handleLevelComplete called for level ${level} with ${attempts} attempts`);
    console.log('[SortingMaster] Current user:', user);
    console.log('[SortingMaster] Current completed levels:', completedLevels);
    
    setLevelObjectiveMet(true);
    
    // Always save progress to update score, even if level was completed before
    console.log(`[SortingMaster] About to save progress for level ${level}`);
    try {
      await saveProgress(level, attempts);
      console.log(`[SortingMaster] Progress saved successfully for level ${level}`);
    } catch (error) {
      console.error(`[SortingMaster] Failed to save progress for level ${level}:`, error);
    }
    
    // Trigger success modal
    setTimeout(() => {
      console.log('[SortingMaster] Showing success modal');
      setShowSuccess(true);
    }, 500); // Small delay for visual effect
  };

  // Update handleToyClick to include progress tracking
  const handleToyClick = (toy) => {
    if (!selectedToy) {
      setSelectedToy(toy);
      setHighlightedToy(toy.id);
    } else if (selectedToy.id === toy.id) {
      setSelectedToy(null);
      setHighlightedToy(null);
    } else {
      const newToys = [...toys];
      const firstIndex = newToys.findIndex(t => t.id === selectedToy.id);
      const secondIndex = newToys.findIndex(t => t.id === toy.id);
      
      [newToys[firstIndex], newToys[secondIndex]] = [newToys[secondIndex], newToys[firstIndex]];
      
      newToys.forEach((t, index) => {
        t.position = index;
      });

      setToys(newToys);
      setSelectedToy(null);
      setHighlightedToy(null);
      setSortingAttempts(prev => prev + 1);

      const isSorted = checkIfSorted(newToys);
      if (isSorted) {
        setIsCorrect(true);
        handleLevelComplete(currentLevel, sortingAttempts + 1);
      }
    }
  };

  // Update checkIfSorted to work with the new swapping logic
  const checkIfSorted = (toys) => {
    const sortedToys = [...toys].sort((a, b) => {
      if (sortingCriteria === 'size') {
        const sizeOrder = { small: 0, medium: 1, large: 2 };
        return sizeOrder[a.size] - sizeOrder[b.size];
      } else if (sortingCriteria === 'color') {
        return a.color.localeCompare(b.color);
      } else {
        return a.type.localeCompare(b.type);
      }
    });

    // Check if current arrangement matches the sorted order
    return toys.every((toy, index) => {
      const sortedToy = sortedToys[index];
      if (sortingCriteria === 'size') {
        return toy.size === sortedToy.size;
      } else if (sortingCriteria === 'color') {
        return toy.color === sortedToy.color;
      } else {
        return toy.type === sortedToy.type;
      }
    });
  };

  // Get toy emoji based on type
  const getToyEmoji = (type) => {
    switch (type) {
      case 'ball': return '⚽';
      case 'block': return '🧊';
      case 'car': return '🚗';
      default: return '🎮';
    }
  };

  // Get toy size class
  const getToySizeClass = (size) => {
    switch (size) {
      case 'small': return 'w-12 h-12';
      case 'medium': return 'w-16 h-16';
      case 'large': return 'w-20 h-20';
      default: return 'w-16 h-16';
    }
  };

  // Get toy color class
  const getToyColorClass = (color) => {
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // Enhanced tutorial modal
  const renderTutorialModal = () => {
    if (!showTutorial) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg max-w-2xl">
          <div className="text-center mb-6">
            <span className="text-4xl">{tutorialSteps[tutorialStep].image}</span>
          </div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
            {tutorialSteps[tutorialStep].title}
          </h2>
          <p className="text-lg mb-6 text-center">
            {tutorialSteps[tutorialStep].content}
          </p>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === tutorialStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-between">
            {tutorialStep > 0 && (
              <button
                onClick={() => setTutorialStep(prev => prev - 1)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                ← Previous
              </button>
            )}
            <button
              onClick={() => {
                if (tutorialStep < tutorialSteps.length - 1) {
                  setTutorialStep(prev => prev + 1);
                } else {
                  setShowTutorial(false);
                  // Highlight the smallest toy to start
                  const smallestToy = toys.find(toy => toy.size === 'small');
                  setHighlightedToy(smallestToy?.id);
                  setShowHint(true);
                }
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {tutorialStep < tutorialSteps.length - 1 ? 'Next →' : "Let's Start!"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced toy room with better visual feedback
  const renderToyRoom = () => {
    return (
      <div className="grid grid-cols-3 gap-4 p-8 bg-gray-100 rounded-lg relative">
        {/* Visual guide for sorting order */}
        <div className="absolute -top-16 left-0 right-0 flex justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <span className="mr-2">Small</span>
            <div className="w-8 h-8  bg-blue-500 rounded-lg"></div>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Medium</span>
            <div className="w-12 h-12 bg-blue-500 rounded-lg"></div>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Large</span>
            <div className="w-16 h-16 bg-blue-500 rounded-lg"></div>
          </div>
        </div>

        {toys.map((toy) => (
          <div
            key={toy.id}
            className={`${getToySizeClass(toy.size)} ${getToyColorClass(toy.color)} 
              rounded-lg mt-4 flex items-center justify-center cursor-pointer
              ${isCorrect ? 'animate-bounce' : ''}
              ${highlightedToy === toy.id ? 'ring-4 ring-yellow-400' : ''}
              transition-all duration-200 hover:scale-110
              border-2 ${selectedToy?.id === toy.id ? 'border-blue-500' : 'border-transparent'}
              ${selectedToy && selectedToy.id !== toy.id ? 'hover:border-green-500' : ''}`}
            onClick={() => handleToyClick(toy)}
          >
            <span className="text-2xl">{getToyEmoji(toy.type)}</span>
          </div>
        ))}

        {/* Hint message */}
        {showHint && (
          <div className="absolute -bottom-16 left-0 right-0 text-center">
            <div className="bg-yellow-100 p-4 rounded-lg inline-block">
              <p className="text-yellow-800">
                {selectedToy 
                  ? "Click another toy to swap positions!"
                  : sortingCriteria === 'size' 
                  ? "Click a toy to select it, then click another toy to swap them!"
                  : sortingCriteria === 'color'
                  ? "Click toys to swap them and group by color!"
                  : "Click toys to swap them and group by type!"}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Enhanced sorting criteria selection
  const renderSortingCriteria = () => {
    return (
      <div className="flex flex-col items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold">Choose how to sort the toys:</h3>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setSortingCriteria('size');
              setShowHint(true);
              const smallestToy = toys.find(toy => toy.size === 'small');
              setHighlightedToy(smallestToy?.id);
            }}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              sortingCriteria === 'size' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <span>Size</span>
            <span className="text-sm">(Small → Large)</span>
          </button>
          <button
            onClick={() => {
              setSortingCriteria('color');
              setShowHint(true);
              setHighlightedToy(null);
            }}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              sortingCriteria === 'color' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <span>Color</span>
            <span className="text-sm">(Same colors together)</span>
          </button>
          <button
            onClick={() => {
              setSortingCriteria('type');
              setShowHint(true);
              setHighlightedToy(null);
            }}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              sortingCriteria === 'type' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <span>Type</span>
            <span className="text-sm">(Similar toys together)</span>
          </button>
        </div>
      </div>
    );
  };

  const renderLevel1 = () => {
    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">Help organize the toy room!</p>
          <p className="text-sm text-gray-400">{gameMessage}</p>
          <p className="text-sm text-gray-400 mt-2 mb-8">Attempts: <span className="font-bold text-yellow-300">{sortingAttempts}</span></p>
        </div>

        {/* Toy Room */}
        {renderToyRoom()}

        {/* Sorting Criteria */}
        {renderSortingCriteria()}

        {/* Controls */}
        <div className="w-full max-w-xl flex justify-between mt-4">
          {/* Reset & Tutorial Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                initializeLevel1();
                // Reset tutorial display and hint for consistency
                setShowTutorial(true);
                setTutorialStep(0);
                setShowHint(false);
                setHighlightedToy(null);
              }}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-lg"
            >
              Reset Toys
            </button>
            <button
              onClick={() => setShowTutorial(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg"
            >
              Show Tutorial
            </button>
          </div>

          {/* Navigation */}
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentLevel(1)}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 shadow-lg"
            >
              Go to Level 1
            </button>
            {currentLevel < 10 && (
              <button
                onClick={() => setCurrentLevel(currentLevel + 1)}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-lg"
              >
                Next Level
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render Level 2: The Library Helper
  const renderLevel2 = () => {
    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">Help the librarian organize books by height!</p>
          <p className="text-sm text-gray-400">{comparisonMessage}</p>
          <p className="text-sm text-gray-400 mt-2">Attempts: <span className="font-bold text-yellow-300">{level2Attempts}</span></p>
        </div>

        {/* Book Shelf */}
        <div className="flex justify-center items-end bg-gray-800 p-4 rounded-lg min-h-[200px] w-full max-w-2xl shadow-lg">
          {books.map((book) => (
            <motion.div
              key={book.id}
              layoutId={`book-${book.id}`}
              className={`relative bg-yellow-700 mx-1 rounded-t-lg shadow-md cursor-pointer flex items-end justify-center
                          ${selectedBook && selectedBook.id === book.id ? 'border-4 border-blue-400' : ''}`}
              style={{ height: book.height, width: '60px' }}
              whileHover={{ scaleY: 1.05 }}
              whileTap={{ scaleY: 0.95 }}
              onClick={() => handleBookClick(book)}
            >
              <span className="text-sm text-white absolute bottom-2">{book.height}cm</span>
            </motion.div>
          ))}
        </div>

        {isSortedLevel2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-600 rounded-lg shadow-xl text-white text-center"
          >
            <h3 className="text-xl font-bold">Books Perfectly Organized! 🎉</h3>
            <p className="mt-2">You've mastered comparison-based sorting!</p>
          </motion.div>
        )}
      </div>
    );
  };

  // Bubble Sort Step
  const handleBubbleSortStep = () => {
    if (isSorting || isSortedLevel3) return;
    setIsSorting(true);
    let idx = currentComparisonIndex;
    let swapped = false;
    let newFlowers = [...flowers];
    if (idx < newFlowers.length - 1) {
      if (newFlowers[idx].height > newFlowers[idx + 1].height) {
        // Swap
        [newFlowers[idx], newFlowers[idx + 1]] = [newFlowers[idx + 1], newFlowers[idx]];
        setSwapsMadeThisPass(swapsMadeThisPass + 1);
        swapped = true;
      }
      setTimeout(() => {
        setFlowers(newFlowers);
        setCurrentComparisonIndex(idx + 1);
        setIsSorting(false);
      }, 500);
    } else {
      // End of pass
      if (swapsMadeThisPass === 0) {
        setIsSortedLevel3(true);
        setGameMessage('Garden Perfectly Organized! 🎉');
        setShowSuccess(true);
        handleLevelComplete(3, passesCompleted + 1);
      } else {
        setPassesCompleted(passesCompleted + 1);
        setCurrentComparisonIndex(0);
        setSwapsMadeThisPass(0);
        setIsSorting(false);
      }
    }
  };

  // Selection Sort Step
  const handleSelectionSortStep = () => {
    if (isSortingLevel4 || isSortedLevel4) return;
    setIsSortingLevel4(true);

    let newPeople = [...people];
    let minIdx = currentSelectionZoneStart;

    // Find the minimum in the unsorted part
    for (let i = currentSelectionZoneStart + 1; i < newPeople.length; i++) {
      if (newPeople[i].height < newPeople[minIdx].height) {
        minIdx = i;
      }
    }
    setCurrentMinIndex(minIdx);

    // Swap the found minimum with the first element of the unsorted part
    setTimeout(() => {
      [newPeople[currentSelectionZoneStart], newPeople[minIdx]] = 
        [newPeople[minIdx], newPeople[currentSelectionZoneStart]];
      
      setPeople(newPeople);
      setCurrentMinIndex(null);

      const nextSelectionZoneStart = currentSelectionZoneStart + 1;
      if (nextSelectionZoneStart < newPeople.length) {
        setCurrentSelectionZoneStart(nextSelectionZoneStart);
        setIsSortingLevel4(false);
      } else {
        // All sorted
        setIsSortedLevel4(true);
        setGameMessage('Tournament Complete! Everyone is perfectly arranged! 🎉');
        setShowSuccess(true);
        handleLevelComplete(4, passesCompleted + 1); // Reusing passesCompleted from Level 3, might need new state if distinct tracking is desired
      }
    }, 1000); // Animation delay
  };

  // Insertion Sort Step
  const handleInsertionSortStep = () => {
    if (isSortingLevel5 || isSortedLevel5) return;
    setIsSortingLevel5(true);

    if (deck.length > 0 && !currentCardToInsert) {
      // Phase 1: Pick a card from the deck
      const card = deck[0];
      setDeck(deck.slice(1));
      setCurrentCardToInsert(card);
      setGameMessage(`Picked up card: ${card.value}. Now find its place in your hand.`);
      setIsSortingLevel5(false); // Ready for insertion
    } else if (currentCardToInsert) {
      // Phase 2 & 3: Find position and insert
      let newHand = [...hand];
      let i = newHand.length - 1;
      while (i >= 0 && newHand[i].value > currentCardToInsert.value) {
        i--;
      }
      const targetIndex = i + 1;
      setInsertionIndex(targetIndex);

      setTimeout(() => {
        newHand.splice(targetIndex, 0, currentCardToInsert);
        setHand(newHand);
        setCurrentCardToInsert(null);
        setInsertionIndex(null);
        setGameMessage(`Inserted ${currentCardToInsert.value}. Hand: [${newHand.map(c => c.value).join(', ')}]`);
        setIsSortingLevel5(false);

        if (deck.length === 0 && newHand.length === 9) { // Assuming 9 cards total
          setIsSortedLevel5(true);
          setGameMessage('Library Organized! All cards are perfectly sorted! 🎉');
          setShowSuccess(true);
          handleLevelComplete(5, hand.length); // Use hand length for attempts/score
        }
      }, 1000); // Animation delay for insertion
    }
  };

  // Merge Sort Step
  const handleMergeSortStep = () => {
    if (isSortingLevel6 || isSortedLevel6) return;
    setIsSortingLevel6(true);

    let newMergedArray = [...mergedArray];
    let valToMerge = null;

    if (pointer1 < array1.length && pointer2 < array2.length) {
      // Both arrays have elements left
      if (array1[pointer1].value <= array2[pointer2].value) {
        valToMerge = array1[pointer1];
        setPointer1(prev => prev + 1);
      } else {
        valToMerge = array2[pointer2];
        setPointer2(prev => prev + 1);
      }
    } else if (pointer1 < array1.length) {
      // Only array1 has elements left
      valToMerge = array1[pointer1];
      setPointer1(prev => prev + 1);
    } else if (pointer2 < array2.length) {
      // Only array2 has elements left
      valToMerge = array2[pointer2];
      setPointer2(prev => prev + 1);
    }

    if (valToMerge) {
      setTimeout(() => {
        setMergedArray(prev => [...prev, valToMerge]);
        setIsSortingLevel6(false);

        // Check for completion after a short delay to allow state update
        if (mergedArray.length + 1 === (array1.length + array2.length)) { // +1 because mergedArray hasn't updated yet
          setIsSortedLevel6(true);
          setGameMessage('Academy Graduated! All students are perfectly merged! 🎉');
          setShowSuccess(true);
          handleLevelComplete(6, mergedArray.length + 1); // Use mergedArray length for score/attempts
        }
      }, 700); // Animation delay for merging
    } else {
      // No more elements to merge (should only happen if already sorted)
      setIsSortingLevel6(false);
    }
  };

  // Quick Sort Step
  const handleQuickSortStep = () => {
    if (isSortingLevel7 || isSortedLevel7) return;
    setIsSortingLevel7(true);

    let currentChests = [...chests];
    let currentStack = [...partitionStack];
    let currentSortedRanges = [...sortedRanges];

    if (currentStack.length === 0) {
      // Check if completely sorted
      const allSorted = currentChests.every((chest, index) => {
        return index === 0 || currentChests[index].value >= currentChests[index - 1].value;
      });
      if (allSorted) {
        setIsSortedLevel7(true);
        setGameMessage('Quick Quest Complete! All chests are perfectly sorted! 🎉');
        setShowSuccess(true);
        handleLevelComplete(7, currentChests.length); // Placeholder for attempts/score
      }
      setIsSortingLevel7(false);
      return;
    }

    const { start, end } = currentStack.pop();

    if (start >= end) {
      // Base case: single element or empty array is sorted
      if (!currentSortedRanges.some(range => range.start === start && range.end === end)) {
        currentSortedRanges.push({ start, end });
      }
      setSortedRanges(currentSortedRanges);
      setIsSortingLevel7(false);
      // Continue to next step in stack if available
      setTimeout(() => handleQuickSortStep(), 500); 
      return;
    }

    // Lomuto partition scheme for simplicity
    const pivotValue = currentChests[end].value; // Choose last element as pivot
    setPivotIndex(end);
    setCurrentStepMessage(`Pivot chosen: ${pivotValue}. Partitioning...`);

    let i = start - 1; // Index of smaller element
    setLeftPointer(start);
    setRightPointer(end - 1); // Exclude pivot from initial right pointer

    let newChests = [...currentChests];

    const doPartition = (k) => {
      if (k > end - 1) {
        // All elements iterated, place pivot
        [newChests[i + 1], newChests[end]] = [newChests[end], newChests[i + 1]];
        setChests(newChests);
        const partitionIndex = i + 1;
        setCurrentStepMessage(`Pivot ${pivotValue} placed at its sorted position.`);
        
        currentSortedRanges.push({ start: partitionIndex, end: partitionIndex }); // Pivot is sorted
        setSortedRanges(currentSortedRanges);
        setPivotIndex(partitionIndex);
        setLeftPointer(null);
        setRightPointer(null);

        // Push sub-problems to stack
        if (start < partitionIndex - 1) {
          currentStack.push({ start: start, end: partitionIndex - 1 });
        }
        if (partitionIndex + 1 < end) {
          currentStack.push({ start: partitionIndex + 1, end: end });
        }
        setPartitionStack(currentStack);
        setActiveRange({ start: null, end: null }); // Clear active range after partitioning
        setIsSortingLevel7(false);
        return;
      }

      setLeftPointer(k); // Highlight current element being considered

      if (newChests[k].value < pivotValue) {
        i++;
        if (i !== k) { // Only swap if not already in correct position
          [newChests[i], newChests[k]] = [newChests[k], newChests[i]];
          setChests(newChests); // Update UI immediately after swap
          setCurrentStepMessage(`Swapped ${newChests[i].value} (smaller than pivot) to left.`);
        } else {
          setCurrentStepMessage(`${newChests[k].value} (smaller than pivot) is already in place.`);
        }
      } else {
        setCurrentStepMessage(`${newChests[k].value} (larger than pivot) stays on right.`);
      }

      setTimeout(() => doPartition(k + 1), 700); // Process next element
    };

    setTimeout(() => {
      setActiveRange({ start, end });
      doPartition(start); // Start partitioning
    }, 500); // Delay for visual transition
  };

  // Heap Sort Step (Simplified for step-by-step)
  const handleHeapSortStep = () => {
    if (isSortingLevel8 || isSortedLevel8) return;
    setIsSortingLevel8(true);

    let currentClimbers = [...climbers];
    let currentHeapSize = heapSize;
    let newSortedClimbers = [...sortedClimbers];

    if (isBuildingHeap) {
      // Phase 1: Build Max Heap
      // We will perform one heapify operation per step, starting from the last non-leaf node
      let startNode = Math.floor(currentHeapSize / 2) - 1;
      let nodesToHeapify = [];

      // Find the next node to heapify in reverse order
      for (let i = startNode; i >= 0; i--) {
        if (!currentClimbers[i].heapified) {
          nodesToHeapify.push(i);
          break;
        }
      }

      if (nodesToHeapify.length === 0) {
        // All nodes have been heapified, transition to sort phase
        setIsBuildingHeap(false);
        setIsSortingLevel8(false);
        setGameMessage('Heap built! Now, extract the strongest climber from the peak!');
        setCurrentHeapifyRoot(null);
        setHighlightedHeapChildren([]);
        return;
      }

      let rootIndex = nodesToHeapify[0];
      setCurrentHeapifyRoot(rootIndex);

      // Perform a single heapify pass for this root
      let largest = rootIndex;
      let left = 2 * rootIndex + 1;
      let right = 2 * rootIndex + 2;

      let childrenToHighlight = [];
      if (left < currentHeapSize) childrenToHighlight.push(left);
      if (right < currentHeapSize) childrenToHighlight.push(right);
      setHighlightedHeapChildren(childrenToHighlight);

      setTimeout(() => {
        if (left < currentHeapSize && currentClimbers[left].strength > currentClimbers[largest].strength) {
          largest = left;
        }
        if (right < currentHeapSize && currentClimbers[right].strength > currentClimbers[largest].strength) {
          largest = right;
        }

        if (largest !== rootIndex) {
          // Swap
          [currentClimbers[rootIndex], currentClimbers[largest]] = [currentClimbers[largest], currentClimbers[rootIndex]];
          setClimbers(currentClimbers);
          setGameMessage(`Swapped ${currentClimbers[largest].strength} and ${currentClimbers[rootIndex].strength} to maintain heap property.`);
          // Recursively call heapify on the affected child (conceptual, here we just highlight next for UI)
          setCurrentHeapifyRoot(largest); // Highlight the new root of the subtree being heapified
        } else {
          currentClimbers[rootIndex].heapified = true; // Mark as heapified for this build pass
          setClimbers(currentClimbers);
          setGameMessage(`Node ${currentClimbers[rootIndex].strength} is in correct position.`);
          setCurrentHeapifyRoot(null);
          setHighlightedHeapChildren([]);
        }
        setIsSortingLevel8(false);
      }, 700); // Animation delay

    } else { // Phase 2: Extract Max and Sort
      if (currentHeapSize <= 1) {
        // Last element or already sorted
        if (currentHeapSize === 1) {
          newSortedClimbers.unshift(currentClimbers[0]); // Add last element to sorted list
        }
        setSortedClimbers(newSortedClimbers);
        setIsSortedLevel8(true);
        setGameMessage('Heap Mountain Conquered! All climbers are perfectly arranged! 🎉');
        setShowSuccess(true);
        handleLevelComplete(8, climbers.length); // Placeholder for attempts/score
        setIsSortingLevel8(false);
        setHeapSize(0); // Ensure heapSize is 0 after sorting
        return;
      }

      // Swap root with last element of heap
      setCurrentExtractingNode(0); // Highlight root
      setTimeout(() => {
        [currentClimbers[0], currentClimbers[currentHeapSize - 1]] = [currentClimbers[currentHeapSize - 1], currentClimbers[0]];
        setClimbers(currentClimbers);
        newSortedClimbers.unshift(currentClimbers[currentHeapSize - 1]); // Add to the front of sorted list
        setSortedClimbers(newSortedClimbers);

        setHeapSize(currentHeapSize - 1);
        setCurrentExtractingNode(null);

        // Now heapify the new root
        let largest = 0;
        let left = 2 * 0 + 1;
        let right = 2 * 0 + 2;

        let childrenToHighlight = [];
        if (left < currentHeapSize - 1) childrenToHighlight.push(left);
        if (right < currentHeapSize - 1) childrenToHighlight.push(right);
        setHighlightedHeapChildren(childrenToHighlight);
        setCurrentHeapifyRoot(0); // Highlight new root for heapify

        setTimeout(() => {
          if (left < currentHeapSize - 1 && currentClimbers[left].strength > currentClimbers[largest].strength) {
            largest = left;
          }
          if (right < currentHeapSize - 1 && currentClimbers[right].strength > currentClimbers[largest].strength) {
            largest = right;
          }

          if (largest !== 0) {
            // Swap to heapify (simplified single pass here)
            [currentClimbers[0], currentClimbers[largest]] = [currentClimbers[largest], currentClimbers[0]];
            setClimbers(currentClimbers);
            setGameMessage(`Heapified! ${currentClimbers[0].strength} is now at the peak.`);
          } else {
            setGameMessage(`Peak is stable. Next, extract max.`);
          }
          setCurrentHeapifyRoot(null);
          setHighlightedHeapChildren([]);
          setIsSortingLevel8(false);
        }, 700); // Delay for heapify after swap
      }, 700); // Delay for extract swap
    }
  };

  // Counting Sort Step
  const handleCountingSortStep = () => {
    if (isSortingLevel9 || isSortedLevel9) return;
    setIsSortingLevel9(true);

    if (currentPhase === 'counting') {
      const colorToCount = colorOrder[countingIndex];
      setGameMessage(`Counting ${colorToCount} balls...`);

      // Find the next uncounted ball of the CURRENT colorToCount
      const ballsOfCurrentColor = balls.filter(ball => ball.color === colorToCount && !ball.counted);

      if (ballsOfCurrentColor.length > 0) {
        const ballToProcess = ballsOfCurrentColor[0]; // Take the first uncounted ball of this color
        setBallHighlightIndex(ballToProcess.originalIndex);

        setTimeout(() => {
          // Increment the count for this color
          setColorCounts(prevCounts => ({
            ...prevCounts,
            [colorToCount]: prevCounts[colorToCount] + 1
          }));

          // Mark the ball as counted in the original array
          setBalls(prevBalls => prevBalls.map(ball =>
            ball.id === ballToProcess.id ? { ...ball, counted: true } : ball
          ));

          setBallHighlightIndex(null);
          setIsSortingLevel9(false);
          // Stay on the same color unless all its balls are counted, then next step will be called
        }, 700); // Animation delay
      } else {
        // All balls of this color have been counted. Move to next color.
        if (countingIndex < colorOrder.length - 1) {
          setCountingIndex(prev => prev + 1);
          setGameMessage(`Finished counting ${colorToCount} balls. Moving to next color.`);
          setIsSortingLevel9(false);
          setBallHighlightIndex(null);
        } else {
          // All colors counted, transition to placing phase
          setGameMessage('All colors counted! Now, place balls in sorted order.');
          setCurrentPhase('placing');
          setCountingIndex(0); // Reset counting index (not used in placing, but good practice)
          setPlacingIndex(0); // Start placing from the first color
          setIsSortingLevel9(false);
          setBallHighlightIndex(null);
        }
      }
    } else if (currentPhase === 'placing') {
      // Iterate through colors to place them
      const colorToPlace = colorOrder[placingIndex];
      const totalBallsOfThisColor = initialColorCountsRef.current[colorToPlace];
      const ballsAlreadyPlacedOfThisColor = sortedBalls.filter(b => b.color === colorToPlace).length;

      if (ballsAlreadyPlacedOfThisColor < totalBallsOfThisColor) {
        // Find the next ball to place for this color from the *original* initialBalls, in order
        // This ensures stability and correct ball objects are moved.
        const nextBallToPlace = balls.filter(ball => ball.color === colorToPlace)[ballsAlreadyPlacedOfThisColor];

        if (nextBallToPlace) {
          setBallHighlightIndex(nextBallToPlace.originalIndex);
          setGameMessage(`Placing a ${colorToPlace} ball...`);

          setTimeout(() => {
            setSortedBalls(prevSorted => [...prevSorted, nextBallToPlace]);
            setBallHighlightIndex(null);
            setIsSortingLevel9(false);
          }, 700); // Animation delay
        } else {
          // Fallback, should not happen if logic is correct
          console.error(`Error: Could not find next ball to place for color ${colorToPlace}`);
          setIsSortingLevel9(false);
        }
      } else {
        // All balls of this color have been placed, move to next color
        if (placingIndex < colorOrder.length - 1) {
          setPlacingIndex(prev => prev + 1);
          setGameMessage(`Finished placing ${colorToPlace} balls. Moving to next color.`);
          setIsSortingLevel9(false);
        } else {
          // All balls placed, level complete
          setIsSortedLevel9(true);
          setGameMessage('Factory Sorted! All balls are perfectly arranged by color! 🎉');
          setShowSuccess(true);
          handleLevelComplete(9, balls.length); // Use total balls for score/attempts
          setIsSortingLevel9(false);
          setBallHighlightIndex(null);
        }
      }
    }
  };

  // Radix Sort Step
  const handleRadixSortStep = () => {
    if (isSortingLevel10 || isSortedLevel10) return;
    setIsSortingLevel10(true);

    let currentSpaceships = [...spaceships];

    if (radixPhase === 'distributing') {
      setGameMessage(`Distributing by the ${currentDigitPlace === 1 ? 'ones' : currentDigitPlace === 10 ? 'tens' : 'hundreds'} digit...`);

      let newBuckets = Array.from({ length: 10 }, () => []);
      currentSpaceships.forEach(spaceship => {
        const digit = Math.floor(spaceship.value / currentDigitPlace) % 10;
        newBuckets[digit].push(spaceship);
      });

      setTimeout(() => {
        setRadixBuckets(newBuckets);
        setSpaceships([]); // Clear main array for collection
        setGameMessage(`Finished distributing by ${currentDigitPlace === 1 ? 'ones' : currentDigitPlace === 10 ? 'tens' : 'hundreds'} digit. Now collect from buckets.`);
        setRadixPhase('collecting');
        setSpaceshipHighlightId(null);
        setBucketHighlightIndex(null);
        setIsSortingLevel10(false);
        setCurrentBucketIndex(0); // Reset for collecting phase
        setCurrentSpaceshipIndexInBucket(0); // Reset for collecting phase
      }, 700); // Animation delay for full distribution visual

    } else if (radixPhase === 'collecting') {
      setGameMessage(`Collecting from buckets based on the ${currentDigitPlace === 1 ? 'ones' : currentDigitPlace === 10 ? 'tens' : 'hundreds'} digit...`);

      let spaceshipToCollect = null;
      let targetBucketIndex = currentBucketIndex;
      let targetSpaceshipIndexInBucket = currentSpaceshipIndexInBucket;

      // Find the very next spaceship to collect considering current pointers
      // This loop is crucial for finding the correct next item across buckets
      while (targetBucketIndex < 10) {
        if (radixBuckets[targetBucketIndex] && radixBuckets[targetBucketIndex].length > targetSpaceshipIndexInBucket) {
          spaceshipToCollect = radixBuckets[targetBucketIndex][targetSpaceshipIndexInBucket];
          break; // Found the spaceship to collect
        } else {
          // Current bucket exhausted or current item index out of bounds, move to the next bucket
          targetBucketIndex++;
          targetSpaceshipIndexInBucket = 0; // Reset item index when moving to new bucket
        }
      }

      if (spaceshipToCollect) { // We found a spaceship to collect
        setSpaceshipHighlightId(spaceshipToCollect.id);
        setBucketHighlightIndex(targetBucketIndex);

        setTimeout(() => {
          setSpaceships(prevSpaceships => [...prevSpaceships, spaceshipToCollect]);

          // Remove the collected spaceship from its bucket in state
          setRadixBuckets(prevBuckets => {
            const newBuckets = prevBuckets.map((bucket, bIdx) => {
              if (bIdx === targetBucketIndex) {
                // Return a new array without the collected item (using filter for robustness)
                return bucket.filter(item => item.id !== spaceshipToCollect.id);
              }
              return [...bucket]; // Return copy of other buckets
            });
            return newBuckets;
          });

          // Advance pointers for the *next* step.
          // Increment item index. If it goes out of bounds, move to next bucket and reset item index.
          let nextBucketIdx = targetBucketIndex;
          let nextSpaceshipIdxInBucket = targetSpaceshipIndexInBucket + 1; // Try next item in current bucket

          // After a removal, check if the current bucket is now empty, or if we've moved past its last element
          // The crucial part is to check the `newBuckets` (the state *after* the splice)
          // However, we are in a setTimeout, so `newBuckets` is not yet available in state.
          // We determine the next pointer based on what we just did:
          // If the current bucket is now empty after this removal, move to the next bucket.
          const isCurrentBucketNowEmpty = (radixBuckets[targetBucketIndex].length - 1) === targetSpaceshipIndexInBucket; // Check original length -1
          
          if (isCurrentBucketNowEmpty) {
            nextBucketIdx++; // Move to next bucket
            nextSpaceshipIdxInBucket = 0; // Reset item index for the new bucket
          }
          
          setCurrentBucketIndex(nextBucketIdx); 
          setCurrentSpaceshipIndexInBucket(nextSpaceshipIdxInBucket);

          setSpaceshipHighlightId(null);
          setBucketHighlightIndex(null);
          setIsSortingLevel10(false);
        }, 700); // Animation delay

      } else { // No more spaceships to collect in the current digit pass. Time to transition.
        setRadixBuckets(Array.from({ length: 10 }, () => [])); // Clear buckets
        setCurrentDigitPlace(prev => prev * 10);
        setRadixPhase('distributing'); // Reset to distributing for next digit pass
        setSpaceshipHighlightId(null);
        setBucketHighlightIndex(null);
        setIsSortingLevel10(false);
        setCurrentBucketIndex(0); // Reset for next pass
        setCurrentSpaceshipIndexInBucket(0); // Reset for next pass

        // Check for final completion after advancing currentDigitPlace
        const totalInitialSpaceships = 10; // Assuming 10 initial spaceships based on initializeLevel10
        // The condition should be: currentDigitPlace has advanced PAST the max required digit.
        if (currentDigitPlace > Math.pow(10, maxDigits - 1)) { // Example: maxDigits=3, currentDigitPlace after last pass becomes 1000, 1000 > 10^(3-1)=100
          setIsSortedLevel10(true);
          setGameMessage('Radix Space Station Organized! All spacecraft sorted! 🎉');
          setShowSuccess(true);
          handleLevelComplete(10, totalInitialSpaceships);
        }
      }
    }
  };

  // Render Level 3: Bubble Pop Garden
  const renderLevel3 = () => {
    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-blue-50 p-6 rounded-lg w-full max-w-4xl mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Bubble Sort: The Rising Garden</h3>
          <div className="text-blue-700 space-y-2">
            <p>Bubble Sort works like bubbles rising in water - larger elements "bubble up" to their correct position!</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Compare adjacent flowers from left to right</li>
              <li>If left flower is taller, swap them (like bubbles rising)</li>
              <li>After each pass, the tallest flower reaches its final position</li>
              <li>Green flowers are in their final, sorted position</li>
              <li>Red flowers need to be swapped</li>
              <li>Purple flowers are waiting to be compared</li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">Help the flowers grow in height order using bubble magic!</p>
          <p className="text-sm text-gray-400">Compare adjacent flowers, swap if wrong order.</p>
          <p className="text-sm text-gray-400 mt-2">Passes: <span className="font-bold text-yellow-300">{passesCompleted}</span></p>
        </div>

        {/* Flower Row */}
        <div className="flex mt-10 pt-10 justify-center items-end bg-gray-800 p-4 rounded-lg min-h-[200px] w-full max-w-4xl shadow-lg">
          {flowers.map((flower, index) => {
            const isComparing = index === currentComparisonIndex || index === currentComparisonIndex + 1;
            const isInWrongOrder = isComparing && currentComparisonIndex + 1 < flowers.length && flowers[currentComparisonIndex].height > flowers[currentComparisonIndex + 1].height;
            const isSorted = index >= flowers.length - passesCompleted; // Flowers at the end are sorted
            
            return (
              <motion.div
                key={flower.id}
                layoutId={`flower-${flower.id}`}
                className={`relative mx-1 rounded-t-full shadow-md flex items-end justify-center
                  ${isSorted ? 'bg-green-500' : isComparing ? (isInWrongOrder ? 'bg-red-500' : 'bg-green-500') : 'bg-purple-500'}
                  ${isSorted ? 'ring-4 ring-green-300' : ''}
                  ${isSortedLevel3 ? 'animate-bounce' : ''} transition-all duration-300`}
                style={{ height: flower.height * 2, width: '70px' }}
              >
                <span className="text-xl font-bold text-white absolute bottom-2">{flower.height}</span>
                {isSorted && (
                  <span className="absolute -top-6 text-green-300">✓</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="w-full max-w-md flex justify-center space-x-4 mt-4">
          <button
            onClick={handleBubbleSortStep}
            disabled={isSorting || isSortedLevel3}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Compare & Move
          </button>
          <button
            onClick={initializeLevel3}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Flowers
          </button>
        </div>

        {isSortedLevel3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-600 rounded-lg shadow-xl text-white text-center"
          >
            <h3 className="text-xl font-bold">Garden Perfectly Organized! 🎉</h3>
            <p className="mt-2">You've mastered bubble sort! All flowers are now in perfect height order.</p>
            <button
              onClick={() => setCurrentLevel(4)}
              className="mt-4 px-6 py-3 bg-white text-green-600 rounded-lg transition-colors"
            >
              Next Level →
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  // Render Level 4: Selection Tournament
  const renderLevel4 = () => {
    const progress = (currentSelectionZoneStart / people.length) * 100;

    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-blue-50 p-6 rounded-lg w-full max-w-4xl mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Selection Sort: The Height Contest</h3>
          <div className="text-blue-700 space-y-2">
            <p>Selection Sort works by repeatedly finding the smallest element from the unsorted part and putting it at the beginning.</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Find the shortest person in the remaining unsorted group.</li>
              <li>Swap them with the first person in that unsorted group.</li>
              <li>The green section is already sorted.</li>
              <li>The blue section is the current 'selection zone'.</li>
              <li>The glowing person is the current minimum found.</li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-4 pt-4">
          <p className="text-lg text-gray-600">Organize the height contest by selecting the shortest person each round!</p>
          <p className="text-sm text-gray-400">Find the minimum and place it in the sorted position.</p>
          <p className="text-sm text-gray-400 mt-2">Sorted: <span className="font-bold text-green-300">{currentSelectionZoneStart}</span> / {people.length}</p>
        </div>

        {/* People Row */}
        <div className="flex justify-center items-end bg-gray-800 p-4 rounded-lg min-h-[250px] w-full max-w-4xl shadow-lg">
          {people.map((person, index) => {
            const isSorted = index < currentSelectionZoneStart;
            const isSelectionZone = index >= currentSelectionZoneStart;
            const isMinimum = index === currentMinIndex;

            return (
              <motion.div
                key={person.id}
                layoutId={`person-${person.id}`}
                className={`relative mx-1 rounded-t-lg shadow-md flex items-end justify-center
                  ${isSorted ? 'bg-green-500' : isSelectionZone ? 'bg-blue-500' : 'bg-gray-400'}
                  ${isMinimum ? 'ring-4 ring-yellow-400 animate-pulse' : ''}
                  ${isSortedLevel4 ? 'animate-bounce' : ''} transition-all duration-500`}
                style={{ height: person.height, width: '70px' }}
              >
                <span className="text-xl font-bold text-white absolute bottom-2">{person.height}</span>
                {isSorted && (
                  <span className="absolute -top-6 text-green-300">✓</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="w-full max-w-md flex justify-center space-x-4 mt-4">
          <button
            onClick={handleSelectionSortStep}
            disabled={isSortingLevel4 || isSortedLevel4}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Find & Place
          </button>
          <button
            onClick={initializeLevel4}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Contest
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-4xl bg-gray-200 rounded-full h-4 mt-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isSortedLevel4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-600 rounded-lg shadow-xl text-white text-center"
          >
            <h3 className="text-xl font-bold">Tournament Complete! 🎉</h3>
            <p className="mt-2">You've mastered selection sort! Everyone is perfectly arranged.</p>
            <button
              onClick={() => setCurrentLevel(5)}
              className="mt-4 px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              Next Level →
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  // Render Level 5: Insertion Library
  const renderLevel5 = () => {
    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-blue-50 p-6 rounded-lg w-full max-w-4xl mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Insertion Sort: The Card Organizer</h3>
          <div className="text-blue-700 space-y-2">
            <p>Insertion Sort is like organizing a hand of playing cards. You pick up one card at a time and insert it into its correct place among the cards you already have.</p>
            <ul className="list-disc list-inside space-y-1">
              <li><span className="font-bold">Real-World Connection:</span> This is how you sort cards in your hand!</li>
              <li>1. Pick up one card from the unsorted deck.</li>
              <li>2. Find where it belongs in your sorted hand.</li>
              <li>3. Slide other cards over to make room.</li>
              <li>4. Insert the new card.</li>
              <li>5. Repeat with the next card until the deck is empty.</li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">Help organize a deck of playing cards in your hand!</p>
          <p className="text-sm text-gray-400">Take the next card and insert it in the correct position in your sorted hand.</p>
        </div>

        {/* Cards Display */}
        <div className="flex justify-center items-start w-full max-w-4xl gap-8">
          {/* Hand (Sorted Cards) */}
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg min-h-[150px] flex-1">
            <h4 className="text-white text-lg mb-2">Your Hand (Sorted)</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {hand.map((card, index) => (
                <motion.div
                  key={card.id}
                  layoutId={`card-${card.id}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-24 bg-red-600 rounded-lg shadow-md flex items-center justify-center text-white text-2xl font-bold"
                  style={{ position: insertionIndex === index ? 'relative' : 'static', zIndex: insertionIndex === index ? 10 : 1 }}
                >
                  {card.value}
                </motion.div>
              ))}
              {currentCardToInsert && insertionIndex !== null && hand.length === 0 && (
                <motion.div
                  key={currentCardToInsert.id}
                  layoutId={`card-${currentCardToInsert.id}`}
                  className="w-16 h-24 bg-blue-600 rounded-lg shadow-md flex items-center justify-center text-white text-2xl font-bold border-4 border-yellow-400 animate-pulse"
                >
                  {currentCardToInsert.value}
                </motion.div>
              )}
            </div>
          </div>

          {/* Current Card to Insert */}
          {currentCardToInsert && insertionIndex === null && (
            <motion.div
              key={currentCardToInsert.id}
              layoutId={`card-${currentCardToInsert.id}`}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-20 h-28 bg-blue-600 rounded-lg shadow-xl flex items-center justify-center text-white text-3xl font-bold border-4 border-yellow-400 animate-pulse"
            >
              {currentCardToInsert.value}
            </motion.div>
          )}

          {/* Deck (Unsorted Cards) */}
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg min-h-[150px] flex-1">
            <h4 className="text-white text-lg mb-2">Deck (Unsorted)</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {deck.map(card => (
                <div key={card.id} className="w-16 h-24 bg-gray-600 rounded-lg shadow-md flex items-center justify-center text-white text-2xl font-bold opacity-70">
                  {card.value}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full max-w-md flex justify-center space-x-4 mt-4">
          <button
            onClick={handleInsertionSortStep}
            disabled={isSortingLevel5 || isSortedLevel5 || (deck.length === 0 && !currentCardToInsert)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {currentCardToInsert ? 'Insert Card' : 'Take Next Card'}
          </button>
          <button
            onClick={initializeLevel5}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Cards
          </button>
        </div>

        {isSortedLevel5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-600 rounded-lg shadow-xl text-white text-center"
          >
            <h3 className="text-xl font-bold">Library Organized! 🎉</h3>
            <p className="mt-2">You've mastered insertion sort! All cards are perfectly arranged.</p>
            <button
              onClick={() => setCurrentLevel(6)} // Assuming Level 6 is next
              className="mt-4 px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              Next Level →
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  // Render Level 6: Merge Academy
  const renderLevel6 = () => {
    const totalStudents = array1.length + array2.length;
    const progress = (mergedArray.length / totalStudents) * 100;

    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-blue-50 p-6 rounded-lg w-full max-w-4xl mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Merge Sort: The Merge Academy</h3>
          <div className="text-blue-700 space-y-2">
            <p><span className="font-bold">Divide & Conquer Concept:</span> Sometimes big problems are easier when split into smaller parts!</p>
            <ul className="list-disc list-inside space-y-1">
              <li>1. Divide the problem (e.g., an unsorted array) in half.</li>
              <li>2. Solve (sort) each half separately.</li>
              <li>3. Combine (merge) the solutions (sorted halves) together.</li>
              <li>This level focuses on the 'Combine' step: merging two already sorted lines.</li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">Organize two pre-sorted groups of students into one big line!</p>
          <p className="text-sm text-gray-400">Compare the front students from each line and pick the smaller one.</p>
        </div>

        {/* Student Lines */}
        <div className="flex justify-center items-start w-full max-w-5xl gap-8">
          {/* Array 1 */}
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg flex-1 min-h-[150px]">
            <h4 className="text-white text-lg mb-2">Line 1</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {array1.map((student, index) => (
                <motion.div
                  key={student.id}
                  layoutId={`student-${student.id}`}
                  className={`w-16 h-24 bg-purple-600 rounded-lg shadow-md flex items-center justify-center text-white text-2xl font-bold
                    ${index === pointer1 ? 'border-4 border-yellow-400 animate-pulse' : ''}`}
                >
                  {student.value}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Array 2 */}
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg flex-1 min-h-[150px]">
            <h4 className="text-white text-lg mb-2">Line 2</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {array2.map((student, index) => (
                <motion.div
                  key={student.id}
                  layoutId={`student-${student.id}`}
                  className={`w-16 h-24 bg-orange-600 rounded-lg shadow-md flex items-center justify-center text-white text-2xl font-bold
                    ${index === pointer2 ? 'border-4 border-yellow-400 animate-pulse' : ''}`}
                >
                  {student.value}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Merged Array */}
        <div className="w-full max-w-5xl mt-8 p-4 bg-gray-700 rounded-lg shadow-xl">
          <h4 className="text-white text-lg mb-2 text-center">Merged Line</h4>
          <div className="flex flex-wrap justify-center gap-2 min-h-[80px]">
            {mergedArray.map((student, index) => (
              <motion.div
                key={student.id}
                layoutId={`student-${student.id}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-24 bg-green-600 rounded-lg shadow-md flex items-center justify-center text-white text-2xl font-bold"
              >
                {student.value}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="w-full max-w-md flex justify-center space-x-4 mt-4">
          <button
            onClick={handleMergeSortStep}
            disabled={isSortingLevel6 || isSortedLevel6}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Compare & Merge
          </button>
          <button
            onClick={initializeLevel6}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Lines
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-4xl bg-gray-200 rounded-full h-4 mt-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isSortedLevel6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-600 rounded-lg shadow-xl text-white text-center"
          >
            <h3 className="text-xl font-bold">Academy Graduated! 🎉</h3>
            <p className="mt-2">You've mastered the merge process! The combined line is perfectly sorted.</p>
            <button
              onClick={() => setCurrentLevel(7)} // Assuming Level 7 is next
              className="mt-4 px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              Next Level →
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  // Render Level 7: Quick Quest
  const renderLevel7 = () => {
    const isEntirelySorted = isSortedLevel7; // Simplified check for now

    const progress = (sortedRanges.reduce((acc, range) => acc + (range.end - range.start + 1), 0) / chests.length) * 100;

    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-blue-50 p-6 rounded-lg w-full max-w-4xl mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Quick Sort: The Quick Quest</h3>
          <div className="text-blue-700 space-y-2">
            <p><span className="font-bold">Objective:</span> Master Quick Sort with pivot selection.</p>
            <p><span className="font-bold">Scenario:</span> Organize treasure chests by value using a special "pivot chest"!</p>
            <h4 className="font-bold mt-2">Quick Sort Process:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Choose a "pivot" treasure chest (the last element in the current range).</li>
              <li>Partition other chests around it: move all smaller chests to its left, and all larger chests to its right.</li>
              <li>The pivot is now in its correct final position.</li>
              <li>Recursively repeat the process on the left and right groups until all chests are ordered.</li>
            </ol>
            <p className="font-bold mt-2">Real-World Connection: Fast sorting for large amounts of data!</p>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">{gameMessage}</p>
          <p className="text-sm text-gray-400">{currentStepMessage}</p>
          {activeRange.start !== null && (
            <p className="text-sm text-gray-400 mt-2">Active Range: [{activeRange.start}, {activeRange.end}]</p>
          )}
        </div>

        {/* Treasure Chests Display */}
        <div className="flex justify-center items-end bg-gray-800 p-4 rounded-lg min-h-[250px] w-full max-w-5xl shadow-lg">
          {chests.map((chest, index) => {
            const isActive = activeRange.start !== null && index >= activeRange.start && index <= activeRange.end;
            const isPivot = index === pivotIndex;
            const isLeftPointer = index === leftPointer;
            const isRightPointer = index === rightPointer;
            const isSorted = sortedRanges.some(range => index >= range.start && index <= range.end); // Check if index is within any sorted range

            let bgColor = 'bg-gray-400';
            let ringColor = '';

            if (isSorted) {
              bgColor = 'bg-green-500';
              ringColor = 'ring-4 ring-green-300';
            } else if (isPivot) {
              bgColor = 'bg-yellow-500';
              ringColor = 'ring-4 ring-yellow-300 animate-pulse';
            } else if (isActive) {
              bgColor = 'bg-blue-500';
            }

            // Pointers overwrite active range color
            if (isLeftPointer && isActive && !isPivot) {
              bgColor = 'bg-red-500';
            } else if (isRightPointer && isActive && !isPivot) {
              bgColor = 'bg-cyan-500';
            }

            return (
              <motion.div
                key={chest.id}
                layoutId={`chest-${chest.id}`}
                className={`relative mx-1 rounded-lg shadow-md flex items-end justify-center
                  ${bgColor} ${ringColor} ${isSortedLevel7 ? 'animate-bounce' : ''} transition-all duration-300`}
                style={{ height: chest.value * 2.5, width: '70px' }}
              >
                <span className="text-xl font-bold text-white absolute bottom-2">{chest.value}</span>
                {isSorted && (
                  <span className="absolute -top-6 text-green-300">✓</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Controls */}
        <div className="w-full max-w-md flex justify-center space-x-4 mt-4">
          <button
            onClick={handleQuickSortStep}
            disabled={isSortingLevel7 || isSortedLevel7}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {partitionStack.length > 0 ? 'Continue Sorting' : 'Start Partition'}
          </button>
          <button
            onClick={initializeLevel7}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Quest
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-4xl bg-gray-200 rounded-full h-4 mt-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isEntirelySorted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-600 rounded-lg shadow-xl text-white text-center"
          >
            <h3 className="text-xl font-bold">Quick Quest Complete! 🎉</h3>
            <p className="mt-2">You've mastered quick sort! All chests are perfectly ordered.</p>
            <button
              onClick={() => setCurrentLevel(8)} // Assuming Level 8 is next
              className="mt-4 px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              Next Level →
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  // Render Level 8: Heap Mountain
  const renderLevel8 = () => {
    const totalClimbers = climbers.length + sortedClimbers.length; // Total initial climbers
    const progress = (sortedClimbers.length / totalClimbers) * 100;

    // Helper to get children indices for visualization
    const getChildren = (index) => [
      2 * index + 1,
      2 * index + 2
    ];

    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-blue-50 p-6 rounded-lg w-full max-w-4xl mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Heap Sort: The Heap Mountain</h3>
          <div className="text-blue-700 space-y-2">
            <p><span className="font-bold">Objective:</span> Learn Heap Sort by organizing climbers on a mountain!</p>
            <p><span className="font-bold">Scenario:</span> The strongest climber always needs to be at the peak (max-heap property).</p>
            <h4 className="font-bold mt-2">Heap Sort Process:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li><span className="font-bold">Build Max Heap:</span> Arrange all climbers so the strongest is at the peak, and all parent climbers are stronger than their children.</li>
              <li><span className="font-bold">Extract Maximum:</span> Take the strongest climber from the peak and place them in the sorted area.</li>
              <li><span className="font-bold">Heapify:</span> Rearrange the remaining climbers to maintain the mountain rules (heap property).</li>
              <li>Repeat extraction and heapify until all climbers are sorted.</li>
            </ol>
            <p className="font-bold mt-2">Visuals: Red highlights for current heapify root, Cyan for children, Yellow for extracting.</p>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">{gameMessage}</p>
          <p className="text-sm text-gray-400">Current Heap Size: {heapSize}</p>
        </div>

        {/* Heap Mountain Visualization */}
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-6xl flex flex-col items-center justify-center relative min-h-[400px]">
          {/* Render Heap as Levels/Nodes */}
          <div className="flex flex-col items-center w-full">
            {/* Level 0 (Root) */}
            {climbers[0] && ( // Only render if climber exists
              <motion.div
                key={climbers[0].id}
                layoutId={`climber-${climbers[0].id}`}
                className={`w-24 h-24 rounded-full flex items-center justify-center font-bold text-white text-3xl shadow-lg
                  ${currentHeapifyRoot === 0 ? 'bg-red-500 ring-4 ring-red-300' : currentExtractingNode === 0 ? 'bg-yellow-500 ring-4 ring-yellow-300 animate-pulse' : 'bg-purple-500'}
                  ${isSortedLevel8 ? 'bg-green-500' : ''}
                  transition-all duration-500 relative`}
                style={{ zIndex: 10 }}
              >
                {climbers[0].strength}
                {isSortedLevel8 && <span className="absolute -top-6 text-green-300">✓</span>}
              </motion.div>
            )}
            
            {/* Connections for Level 0 to Level 1 */}
            {climbers[0] && (climbers[1] || climbers[2]) && (
              <div className="absolute top-[100px] w-full flex justify-center" style={{ zIndex: 5 }}>
                {climbers[1] && <div className="absolute left-1/2 -ml-24 w-12 h-0.5 bg-gray-500 transform -rotate-45 origin-top-right"></div>}
                {climbers[2] && <div className="absolute right-1/2 -mr-24 w-12 h-0.5 bg-gray-500 transform rotate-45 origin-top-left"></div>}
              </div>
            )}

            {/* Level 1 (Children of Root) */}
            <div className="flex justify-center w-full mt-4 gap-8">
              {climbers[1] && (
                <motion.div
                  key={climbers[1].id}
                  layoutId={`climber-${climbers[1].id}`}
                  className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-lg
                    ${currentHeapifyRoot === 1 ? 'bg-red-500 ring-4 ring-red-300' : highlightedHeapChildren.includes(1) ? 'bg-cyan-500' : 'bg-purple-500'}
                    ${isSortedLevel8 ? 'bg-green-500' : ''}
                    transition-all duration-500 relative`}
                  style={{ zIndex: 5 }}
                >
                  {climbers[1].strength}
                  {isSortedLevel8 && <span className="absolute -top-6 text-green-300">✓</span>}
                </motion.div>
              )}
              {climbers[2] && (
                <motion.div
                  key={climbers[2].id}
                  layoutId={`climber-${climbers[2].id}`}
                  className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-lg
                    ${currentHeapifyRoot === 2 ? 'bg-red-500 ring-4 ring-red-300' : highlightedHeapChildren.includes(2) ? 'bg-cyan-500' : 'bg-purple-500'}
                    ${isSortedLevel8 ? 'bg-green-500' : ''}
                    transition-all duration-500 relative`}
                  style={{ zIndex: 5 }}
                >
                  {climbers[2].strength}
                  {isSortedLevel8 && <span className="absolute -top-6 text-green-300">✓</span>}
                </motion.div>
              )}
            </div>

            {/* Level 2 (Children of Level 1) */}
            <div className="flex justify-center w-full mt-4 gap-4">
              {climbers[3] && (
                <motion.div
                  key={climbers[3].id}
                  layoutId={`climber-${climbers[3].id}`}
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-lg
                    ${currentHeapifyRoot === 3 ? 'bg-red-500 ring-4 ring-red-300' : highlightedHeapChildren.includes(3) ? 'bg-cyan-500' : 'bg-purple-500'}
                    ${isSortedLevel8 ? 'bg-green-500' : ''}
                    transition-all duration-500 relative`}
                  style={{ zIndex: 5 }}
                >
                  {climbers[3].strength}
                  {isSortedLevel8 && <span className="absolute -top-6 text-green-300">✓</span>}
                </motion.div>
              )}
              {climbers[4] && (
                <motion.div
                  key={climbers[4].id}
                  layoutId={`climber-${climbers[4].id}`}
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-lg
                    ${currentHeapifyRoot === 4 ? 'bg-red-500 ring-4 ring-red-300' : highlightedHeapChildren.includes(4) ? 'bg-cyan-500' : 'bg-purple-500'}
                    ${isSortedLevel8 ? 'bg-green-500' : ''}
                    transition-all duration-500 relative`}
                  style={{ zIndex: 5 }}
                >
                  {climbers[4].strength}
                  {isSortedLevel8 && <span className="absolute -top-6 text-green-300">✓</span>}
                </motion.div>
              )}
              {climbers[5] && (
                <motion.div
                  key={climbers[5].id}
                  layoutId={`climber-${climbers[5].id}`}
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-lg
                    ${currentHeapifyRoot === 5 ? 'bg-red-500 ring-4 ring-red-300' : highlightedHeapChildren.includes(5) ? 'bg-cyan-500' : 'bg-purple-500'}
                    ${isSortedLevel8 ? 'bg-green-500' : ''}
                    transition-all duration-500 relative`}
                  style={{ zIndex: 5 }}
                >
                  {climbers[5].strength}
                  {isSortedLevel8 && <span className="absolute -top-6 text-green-300">✓</span>}
                </motion.div>
              )}
              {climbers[6] && (
                <motion.div
                  key={climbers[6].id}
                  layoutId={`climber-${climbers[6].id}`}
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-lg
                    ${currentHeapifyRoot === 6 ? 'bg-red-500 ring-4 ring-red-300' : highlightedHeapChildren.includes(6) ? 'bg-cyan-500' : 'bg-purple-500'}
                    ${isSortedLevel8 ? 'bg-green-500' : ''}
                    transition-all duration-500 relative`}
                  style={{ zIndex: 5 }}
                >
                  {climbers[6].strength}
                  {isSortedLevel8 && <span className="absolute -top-6 text-green-300">✓</span>}
                </motion.div>
              )}
            </div>

          </div>
        </div>

        {/* Sorted Climbers Area */}
        <div className="w-full max-w-5xl mt-8 p-4 bg-gray-700 rounded-lg shadow-xl">
          <h4 className="text-white text-lg mb-2 text-center">Sorted Climbers (Strongest to Weakest)</h4>
          <div className="flex flex-wrap justify-center gap-2 min-h-[80px]">
            {sortedClimbers.map((climber, index) => (
              <motion.div
                key={climber.id}
                layoutId={`climber-${climber.id}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold shadow-md"
              >
                {climber.strength}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="w-full max-w-md flex justify-center space-x-4 mt-4">
          <button
            onClick={handleHeapSortStep}
            disabled={isSortingLevel8 || isSortedLevel8}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isBuildingHeap ? 'Build Heap Step' : 'Extract & Heapify'}
          </button>
          <button
            onClick={initializeLevel8}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Mountain
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-4xl bg-gray-200 rounded-full h-4 mt-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isSortedLevel8 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-600 rounded-lg shadow-xl text-white text-center"
          >
            <h3 className="text-xl font-bold">Heap Mountain Conquered! 🎉</h3>
            <p className="mt-2">You've mastered heap sort! All climbers are perfectly arranged from strongest to weakest.</p>
            <button
              onClick={() => setCurrentLevel(9)} // Assuming Level 9 is next
              className="mt-4 px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              Next Level →
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  // Render Level 9: Counting Factory
  const renderLevel9 = () => {
    const totalBalls = balls.length;
    const progress = (sortedBalls.length / totalBalls) * 100;

    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-blue-50 p-6 rounded-lg w-full max-w-4xl mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Counting Sort: The Counting Factory</h3>
          <div className="text-blue-700 space-y-2">
            <p><span className="font-bold">Objective:</span> Learn non-comparison sorting with Counting Sort.</p>
            <p><span className="font-bold">Scenario:</span> Sort colored balls in a factory using counting machines!</p>
            <h4 className="font-bold mt-2">Counting Sort Process:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li><span className="font-bold">Count:</span> Count the frequency of each color (e.g., Red(3), Blue(5)).</li>
              <li><span className="font-bold">Calculate Positions:</span> Determine the starting and ending positions for each color in the final sorted array.</li>
              <li><span className="font-bold">Place:</span> Place the balls directly into their calculated positions in the output array.</li>
            </ol>
            <h4 className="font-bold mt-2">Unique Features:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>No comparisons between elements are needed!</li>
              <li>Achieves linear time complexity, very fast for suitable data.</li>
              <li>Works only with a limited range of values (e.g., limited colors).</li>
              <li>Shows a completely different approach to sorting.</li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">{gameMessage}</p>
        </div>

        {/* Balls Display */}
        <div className="flex justify-center items-start w-full max-w-5xl gap-8">
          {/* Unsorted Conveyor Belt */}
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg flex-1 min-h-[200px]">
            <h4 className="text-white text-lg mb-2">Input Conveyor</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {balls.map((ball, index) => (
                <motion.div
                  key={ball.id}
                  layoutId={`ball-${ball.id}`}
                  className={`w-16 h-16 rounded-full shadow-md flex items-center justify-center text-white text-xl font-bold
                    ${ball.color === 'red' ? 'bg-red-500' : ball.color === 'blue' ? 'bg-blue-500' : ball.color === 'green' ? 'bg-green-500' : ball.color === 'yellow' ? 'bg-yellow-500' : 'bg-purple-500'}
                    ${ballHighlightIndex === ball.originalIndex ? 'ring-4 ring-yellow-400 animate-pulse' : ''}
                    ${ball.counted ? 'opacity-30' : ''} transition-all duration-300`}
                >
                  {ball.color.substring(0, 1).toUpperCase()}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Counting Machines/Counts */}
          <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg flex-1 min-h-[200px]">
            <h4 className="text-white text-lg mb-2">Counting Machines</h4>
            <div className="grid grid-cols-2 gap-4">
              {colorOrder.map(color => (
                <div key={color} className={`p-3 rounded-lg text-center font-bold text-white
                  ${color === 'red' ? 'bg-red-700' : color === 'blue' ? 'bg-blue-700' : color === 'green' ? 'bg-green-700' : color === 'yellow' ? 'bg-yellow-700' : 'bg-purple-700'}
                  ${(currentPhase === 'counting' && colorOrder[countingIndex] === color) ? 'ring-4 ring-yellow-400 animate-pulse' : ''}
                `}>
                  {color.toUpperCase()}: {colorCounts[color]}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sorted Output Conveyor */}
        <div className="w-full max-w-5xl mt-8 p-4 bg-gray-700 rounded-lg shadow-xl">
          <h4 className="text-white text-lg mb-2 text-center">Sorted Output Conveyor</h4>
          <div className="flex flex-wrap justify-center gap-2 min-h-[80px]">
            {sortedBalls.map((ball, index) => (
              <motion.div
                key={ball.id}
                layoutId={`ball-${ball.id}`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered animation
                className={`w-16 h-16 rounded-full shadow-md flex items-center justify-center text-white text-xl font-bold
                  ${ball.color === 'red' ? 'bg-red-500' : ball.color === 'blue' ? 'bg-blue-500' : ball.color === 'green' ? 'bg-green-500' : ball.color === 'yellow' ? 'bg-yellow-500' : 'bg-purple-500'}`}
              >
                {ball.color.substring(0, 1).toUpperCase()}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="w-full max-w-md flex justify-center space-x-4 mt-4">
          <button
            onClick={handleCountingSortStep}
            disabled={isSortingLevel9 || isSortedLevel9 || (currentPhase === 'placing' && placingIndex >= colorOrder.length && sortedBalls.length === totalBalls)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {currentPhase === 'counting' ? 'Count Next Color' : 'Place Next Group'}
          </button>
          <button
            onClick={initializeLevel9}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Factory
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-4xl bg-gray-200 rounded-full h-4 mt-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isSortedLevel9 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-600 rounded-lg shadow-xl text-white text-center"
          >
            <h3 className="text-xl font-bold">Factory Sorted! 🎉</h3>
            <p className="mt-2">You've mastered counting sort! All balls are perfectly arranged by color.</p>
            <button
              onClick={() => setCurrentLevel(1)} // Go back to Level 1 or dashboard
              className="mt-4 px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              Go to Dashboard
            </button>
          </motion.div>
        )}
      </div>
    );
  };

  // Render Level 10: Radix Space Station
  const renderLevel10 = () => {
    const totalSpaceships = 10; // Fixed number of spaceships
    const progress = (currentDigitPlace / (Math.pow(10, maxDigits-1) * 10)) * 100; // Simplified progress
    const sortedByCurrentDigit = currentDigitPlace > 1;
    const isFinalSorted = isSortedLevel10;

    const getDigit = (value, place) => Math.floor(value / place) % 10;

    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-blue-50 p-6 rounded-lg w-full max-w-4xl mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-3">Radix Sort: The Radix Space Station</h3>
          <div className="text-blue-700 space-y-2">
            <p><span className="font-bold">Objective:</span> Master advanced Radix Sort for multi-digit numbers.</p>
            <p><span className="font-bold">Scenario:</span> Organize spacecraft by their ID numbers using digit-by-digit sorting!</p>
            <h4 className="font-bold mt-2">Radix Sort Process:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Sort all numbers by their <span className="font-bold">least significant digit first</span> (ones place).</li>
              <li>Then, sort by the next digit (tens place), and so on, until you've sorted by every digit.</li>
              <li><span className="font-bold">The secret:</span> Use a stable sorting method (like Counting Sort) for each digit position so that previous work isn't lost!</li>
            </ol>
            <h4 className="font-bold mt-2">Visuals:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Spaceships will move between the main display and digit buckets.</li>
              <li>Highlighted spaceship is the one being processed.</li>
              <li>Highlighted bucket is the current target/source.</li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg text-gray-600">{gameMessage}</p>
          <p className="text-sm text-gray-400">Current Digit Place: {currentDigitPlace}</p>
        </div>

        {/* Spaceships Display */}
        <div className="flex justify-center items-end bg-gray-800 p-4 rounded-lg min-h-[150px] w-full max-w-6xl shadow-lg">
          {spaceships.map(spaceship => (
            <motion.div
              key={spaceship.id}
              layoutId={`spaceship-${spaceship.id}`}
              className={`relative mx-1 rounded-lg shadow-md flex flex-col items-center justify-center font-bold text-white text-xl
                ${isFinalSorted ? 'bg-green-500' : 'bg-blue-500'}
                ${spaceshipHighlightId === spaceship.id ? 'ring-4 ring-yellow-400 animate-pulse' : ''}
                transition-all duration-300`}
              style={{ height: spaceship.value / 2 + 50, width: '70px' }}
            >
              <span>{spaceship.value}</span>
              {sortedByCurrentDigit && (
                <span className="text-sm text-green-300">({getDigit(spaceship.value, currentDigitPlace)})</span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Radix Buckets */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-4 w-full max-w-6xl mt-8">
          {radixBuckets.map((bucket, index) => (
            <div
              key={index}
              className={`bg-gray-700 p-3 rounded-lg flex flex-col items-center min-h-[100px]
                ${bucketHighlightIndex === index ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}
            >
              <h4 className="text-white font-bold mb-2">Bucket {index}</h4>
              <div className="flex flex-wrap justify-center gap-1">
                {bucket.map(spaceship => (
                  <motion.div
                    key={spaceship.id}
                    layoutId={`spaceship-${spaceship.id}`}
                    className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
                  >
                    {spaceship.value}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="w-full max-w-md flex justify-center space-x-4 mt-4">
          <button
            onClick={handleRadixSortStep}
            disabled={isSortingLevel10 || isSortedLevel10}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {radixPhase === 'distributing' ? 'Distribute Spaceships' : 'Collect Spaceships'}
          </button>
          <button
            onClick={initializeLevel10}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset Station
          </button>
        </div>

        {isSortedLevel10 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-green-600 rounded-lg shadow-xl text-white text-center"
          >
            <h3 className="text-xl font-bold">Radix Space Station Organized! 🎉</h3>
            <p className="mt-2">Congratulations! You've mastered all sorting algorithms!</p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="mt-4 px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              Go to Dashboard
            </button>
          </motion.div>
        )}
      </div>
    );
  };

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

  // Handle book click for Level 2
  const handleBookClick = (book) => {
    if (selectedBook === null) {
      setSelectedBook(book);
      setComparisonMessage(`Selected book: ${book.height}cm. Now choose another book to swap.`);
    } else if (selectedBook.id === book.id) {
      // Deselect if clicking the same book again
      setSelectedBook(null);
      setComparisonMessage('Click two books to swap them and sort by height!');
    } else {
      // Swap books
      const newBooks = [...books];
      const firstIndex = newBooks.findIndex(b => b.id === selectedBook.id);
      const secondIndex = newBooks.findIndex(b => b.id === book.id);

      // Perform the swap
      [newBooks[firstIndex], newBooks[secondIndex]] = [newBooks[secondIndex], newBooks[firstIndex]];

      setBooks(newBooks);
      setSelectedBook(null);
      setLevel2Attempts(prev => prev + 1);

      const sorted = checkIfBooksSorted(newBooks);
      if (sorted) {
        setComparisonMessage('All books are perfectly organized! Level Complete!');
        setIsSortedLevel2(true);
        handleLevelComplete(currentLevel, level2Attempts + 1);
      } else {
        setComparisonMessage('Keep comparing and swapping! Not quite sorted yet.');
      }
    }
  };

  // Check if books are sorted by height
  const checkIfBooksSorted = (currentBooks) => {
    for (let i = 0; i < currentBooks.length - 1; i++) {
      if (currentBooks[i].height > currentBooks[i + 1].height) {
        return false; // Found an unsorted pair
      }
    }
    return true; // All books are sorted
  };

  // Handle next level
  const handleNextLevel = () => {
    if (currentLevel < 10) {
      setCurrentLevel(prev => prev + 1);
      setLevelStartTime(Date.now()); // Reset timer for new level
      setLevelObjectiveMet(false); // Reset objective met status
    } else {
      setShowSuccess(true); // Show final completion message
      // Optionally show a dashboard button here if not already handled by general logic
      setShowDashboardButton(true); // Show dashboard button after level 10
    }
  };

  // UseEffect to reset levelStartTime when currentLevel changes
  useEffect(() => {
    setLevelStartTime(Date.now());
    setLevelObjectiveMet(false);
    // Any other level-specific initialization can go here or in initializeLevelX
  }, [currentLevel]);

  // Load progress from database
  useEffect(() => {
    let isMounted = true;  // Add mounted flag for cleanup

    const fetchSortingProgress = async () => {
      if (!user) {
        console.log('[SortingMaster] No user, skipping progress fetch');
        return;
      }
      
      try {
        console.log('[SortingMaster] Fetching progress for user:', user);
        const token = localStorage.getItem('token');
        console.log('[SortingMaster] Token exists for fetch:', !!token);
        
        const response = await fetch('http://localhost:5000/api/game-progress/all-progress', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!isMounted) {
          console.log('[SortingMaster] Component unmounted, stopping fetch');
          return;
        }
        
        console.log('[SortingMaster] Fetch response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch progress: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('[SortingMaster] Received progress data:', data);
        
        // Find sorting progress
        const sortingProgress = data.progress?.find(p => p.topicId === 'sorting');
        console.log('[SortingMaster] Found sorting progress:', sortingProgress);
        console.log('[SortingMaster] Sorting progress keys:', sortingProgress ? Object.keys(sortingProgress) : 'No progress found');
        console.log('[SortingMaster] Sorting progress levels:', sortingProgress?.levels);
        console.log('[SortingMaster] Sorting progress gameLevels:', sortingProgress?.gameLevels);
        
        if (sortingProgress) {
          console.log('[SortingMaster] Processing sorting progress:', sortingProgress);
          
          // Extract completed levels - try both possible structures
          let completed = new Set();
          
          if (sortingProgress.gameLevels) {
            completed = new Set(
              sortingProgress.gameLevels
                ?.filter(level => level.completed)
                .map(level => level.level) || []
            );
            console.log('[SortingMaster] Using gameLevels structure');
          } else if (sortingProgress.levels) {
            completed = new Set(
              sortingProgress.levels
                ?.filter(level => level.completed)
                .map(level => level.level) || []
            );
            console.log('[SortingMaster] Using levels structure');
          } else {
            console.log('[SortingMaster] No levels structure found, checking for direct level data');
            // Check if levels are stored directly in the progress object
            if (sortingProgress.level) {
              completed = new Set([sortingProgress.level]);
              console.log('[SortingMaster] Using direct level data');
            }
          }
          
          console.log('[SortingMaster] Extracted completed levels:', completed);
          console.log('[SortingMaster] Highest level from server:', sortingProgress.highestLevel);
          
          setCompletedLevels(completed);
          setHighestLevel(sortingProgress.highestLevel || 1);
          
          console.log('[SortingMaster] State updated with completed levels:', completed);
          console.log('[SortingMaster] State updated with highest level:', sortingProgress.highestLevel || 1);
        } else {
          console.log('[SortingMaster] No sorting progress found, using defaults');
          setCompletedLevels(new Set());
          setHighestLevel(1);
        }
        
      } catch (error) {
        console.error('[SortingMaster] Error fetching progress:', error);
        if (isMounted) {
          setCompletedLevels(new Set());
          setHighestLevel(1);
        }
      }
    };

    fetchSortingProgress();
    
    return () => {
      isMounted = false;  // Cleanup function
    };
  }, [user]);

  return (
    <div className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 flex flex-col items-center justify-center py-10">
      <div className="absolute inset-0 pointer-events-none z-0">
        <GameDecorations />
      </div>
      {/* Card-like main container */}
      <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-white via-green-50 to-emerald-100 rounded-3xl shadow-2xl p-8 border-2 border-green-500 relative z-10 flex flex-col items-center">
           {/* Navigation Buttons */}
           <div className="mt-4 mb-10 flex justify-between items-center w-full max-w-4xl">
          <button
            onClick={() => setCurrentLevel(Math.max(1, currentLevel - 1))}
            disabled={currentLevel === 1}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg
              ${currentLevel === 1 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:scale-105'
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
          
          {/* Game Message */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl shadow-lg border border-green-200 w-full max-w-4xl">
          <p className="text-xl text-center text-green-700 font-semibold">{gameMessage}</p>
          </div>

          {/* Level Content */}
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 border border-green-200">
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
              <p className="text-lg mb-6 text-gray-700">
                  You've mastered this level! Score: {calculateScore(currentLevel)}
                </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setCurrentLevel(currentLevel + 1);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg"
                >
                  Next Level
                </button>
              </div>
              </div>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default SortingMaster; 
