import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCorners, useDraggable, useDroppable } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useApi from '../../hooks/useApi';
import GameDecorations from './GameDecorations';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// console.log(Ji)
// Helper function to generate gems
const generateGems = (count, includeRuby = false) => {
    // console.log(hi)
    const gemTypes = ['💎', '💰', '👑', '🔑', '🍀', '🎯', '🔮', '⚓', '🍎', '🍇'];
    const gems = [];
    for (let i = 0; i < count; i++) {
        gems.push({
            id: `gem-${Date.now() + i}`,
            type: gemTypes[i % gemTypes.length],
            value: Math.floor(Math.random() * 100) + 1
        });
    }
    if (includeRuby) {
        gems.push({
            id: `ruby-${Date.now()}-${Math.random()}`,
            type: '♦️',
            value: 999
        });
    }
    return gems;
};

const TreasureChestAdventure = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { get, post } = useApi();
    const [currentLevel, setCurrentLevel] = useState(1);
    const [gameState, setGameState] = useState({
        chests: [],
        targetSum: 0,
        selectedChests: [],
        score: 0,
        timeLeft: 60,
        isPlaying: false,
        message: '',
        messageType: '',
        startTime: null
    });
    const [completedLevels, setCompletedLevels] = useState(new Set());
    const [isSaving, setIsSaving] = useState(false);
    const [progress, setProgress] = useState({});
    const [arraysGameProgress, setArraysGameProgress] = useState(null);
    const [levelStartTime, setLevelStartTime] = useState(Date.now());
    const [treasureChest, setTreasureChest] = useState([]);
    const [gameMessage, setGameMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [gemsToCollect, setGemsToCollect] = useState([]);
    const [sparkle, setSparkle] = useState(false);
    const [targetGem, setTargetGem] = useState(null);
    const [insertionIndex, setInsertionIndex] = useState(null);
    const [sortAttempted, setSortAttempted] = useState(false);
    const [levelObjectiveMet, setLevelObjectiveMet] = useState(false);
    const [level10Grid, setLevel10Grid] = useState([]);
    const [level10TargetGem, setLevel10TargetGem] = useState(null);

    // Function to calculate score based on level
    const calculateScore = (level) => {
        // Return 10 points if level is completed, 0 if not
        return 10 ;
    };

    // Function to save progress to database
    const saveProgress = async (level) => {
        if (!user) {
            console.log('No user found, progress will not be saved');
            return;
        }

        try {
            console.log(`Starting to save progress for level ${level}`);
            setIsSaving(true);
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found');
                return;
            }

            const timeSpent = Math.floor((Date.now() - levelStartTime) / 1000);
            const score = calculateScore(level);

            // Ensure all values are of the correct type and match server expectations
            const progressData = {
                topicId: 'arrays',
                level: Number(level),
                score: Number(score),
                timeSpent: Number(timeSpent)
            };

            // Log when sending progress data
            console.log('[TreasureChestAdventure] Sending progress data:', progressData);

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
                console.error('[TreasureChestAdventure] Failed to save progress:', errorData.message || response.statusText);
                setGameMessage(`Failed to save progress: ${errorData.message || response.statusText}`); // Show error to user
                throw new Error(`Failed to save progress: ${response.status} - ${errorData.message || response.statusText}`);
            }

            const data = await response.json();
            console.log('[TreasureChestAdventure] Progress save response:', data);
            
            if (data.success) {
                // Update local progress state
                setProgress(prev => ({
                    ...prev,
                    [level]: {
                        completed: true,
                        timestamp: new Date().toISOString(),
                        score: score,
                        timeSpent: timeSpent
                    }
                }));

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
            console.error('[TreasureChestAdventure] Error saving progress:', error);
            // Show error to user
            setGameMessage(`Failed to save progress: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Function to handle level completion
    const handleLevelComplete = async (level) => {
        console.log(`Handling level completion for level ${level}`);
        setLevelObjectiveMet(true);
        
        // Always save progress to update score, even if level was completed before
        console.log(`Saving progress for level ${level}`);
        await saveProgress(level);

        // Special case for the final level (Level 10)
        if (level === 10) {
            // Delay navigation slightly to allow for completion feedback
            setTimeout(() => {
                navigate('/arrays');
            }, 3000);
        }
    };

    // Fetch initial progress when component mounts
    useEffect(() => {
        let isMounted = true;  // Add mounted flag for cleanup

        const fetchArraysProgress = async () => {
            if (!user) return;  // Don't fetch if no user
            
            try {
                const userProgressData = await get(`${BACKEND_URL}/api/game-progress/all-progress`);
                if (!isMounted) return;
                const arraysProgressEntry = userProgressData?.progress?.find(p => p.topicId === 'arrays');
                setArraysGameProgress(arraysProgressEntry || null);
                if (arraysProgressEntry?.levels) {
                    const completed = new Set(
                        arraysProgressEntry.levels
                            .filter(level => level.completed)
                            .map(level => level.level)
                    );
                    setCompletedLevels(completed);
                }
            } catch (err) {
                if (!isMounted) return;
                console.error("Failed to fetch arrays game progress:", err);
            }
        };

        fetchArraysProgress();

        // Cleanup function
        return () => {
            isMounted = false;
        };
    }, [user?._id]); // Only depend on user ID, not the entire user object or get function

    useEffect(() => {
        let message = '';
        setSparkle(false);
        setTargetGem(null);
        setInsertionIndex(null);
        setGemsToCollect([]);
        setSortAttempted(false);
        setLevelObjectiveMet(false);
        setLevel10Grid([]); // Reset Level 10 grid state
        setLevel10TargetGem(null); // Reset Level 10 target gem state

        switch (currentLevel) {
            case 1:
                message = 'Ahoy there, future treasure hunter! Let\'s start by finding your first chest! This is like creating an empty array - a container ready to hold your treasures!';
                setTreasureChest([]);
                break;
            case 2:
                message = 'Great job! Now, collect some shiny gems and drag them into the chest slots! This teaches you how to add elements to an array - each slot is like an index where you can store a value.';
                setGemsToCollect(generateGems(4));
                setTreasureChest([null, null, null, null]);
                break;
            case 3:
                message = 'Now, let\'s inspect our gems! Captain Array needs you to find a specific one. This is like accessing an array element - you need to find the exact gem at a specific position.';
                if (treasureChest.filter(item => item !== null).length < 4) {
                    const initialChest = generateGems(5);
                    setTreasureChest(initialChest);
                    const randomIndex = Math.floor(Math.random() * initialChest.length);
                    setTargetGem(initialChest[randomIndex]);
                } else {
                    const filledGems = treasureChest.filter(item => item !== null);
                    const randomIndex = Math.floor(Math.random() * filledGems.length);
                    setTargetGem(filledGems[randomIndex]);
                }
                break;
            case 4:
                message = 'Excellent! Sometimes we find special gems that need to go in a specific spot. This teaches you array insertion - adding an element at a specific position while shifting other elements.';
                const initialChestL4 = generateGems(3);
                setTreasureChest(initialChestL4);
                const gemToInsertL4 = generateGems(1)[0];
                setGemsToCollect([gemToInsertL4]);
                const randomIndexL4 = Math.floor(Math.random() * (initialChestL4.length + 1));
                setInsertionIndex(randomIndexL4);
                break;
            case 5:
                message = 'Beware of the cursed gems! Click on a gem in the chest to remove it! This teaches you array deletion - removing an element and shifting remaining elements to fill the gap.';
                if (treasureChest.filter(item => item !== null).length < 5) {
                    setTreasureChest(generateGems(6));
                }
                break;
            case 6:
                message = 'Captain Array wants to know how many treasures we have! This teaches you array length - counting how many elements are in your array.';
                if (treasureChest.filter(item => item !== null).length === 0) {
                    setTreasureChest(generateGems(5));
                }
                break;
            case 7:
                message = 'Let\'s have a gem parade! Watch closely as each gem marches out. This teaches you array traversal - visiting each element in order from start to finish.';
                if (treasureChest.filter(item => item !== null).length === 0) {
                    setTreasureChest(generateGems(5));
                }
                break;
            case 8:
                message = 'A lost ruby is hidden in the chest! Can you find and click it? This teaches you array searching - looking for a specific element in your array.';
                if (treasureChest.filter(item => item !== null).length < 5) {
                    // Create 4 normal gems (excluding 👑)
                    const normalGems = generateGems(4, false).map(gem => 
                        gem.type === '👑' ? { ...gem, type: '💎' } : gem
                    );
                    // Create 1 special 👑 gem
                    const specialCrown = { id: `crown-${Date.now()}-${Math.random()}`, type: '👑', value: 999 };
                    // Combine and shuffle
                    const initialChest = [...normalGems, specialCrown].sort(() => Math.random() - 0.5);
                    console.log('Level 8 chest:', initialChest); // Debug log
                    setTreasureChest(initialChest);
                }
                break;
            case 9:
                message = 'Our gems are a mess! Help Captain Array sort them by value. This teaches you array sorting - arranging elements in a specific order (here, by their value).';
                setTreasureChest(generateGems(6));
                break;
            case 10:
                // Level 10 setup: 2D Array - Find the Gem in the Grid
                const gridRows = 4;
                const gridCols = 5;
                const newGrid = [];
                const allPossibleGems = generateGems(gridRows * gridCols * 2); // Generate more gems than needed
                let gemIndex = 0;
                for (let i = 0; i < gridRows; i++) {
                    newGrid[i] = [];
                    for (let j = 0; j < gridCols; j++) {
                        // Assign gems from the generated list
                        newGrid[i][j] = allPossibleGems[gemIndex++];
                    }
                }
                setLevel10Grid(newGrid);

                // Select a random target gem from the grid
                const randomRow = Math.floor(Math.random() * gridRows);
                const randomCol = Math.floor(Math.random() * gridCols);
                const target = newGrid[randomRow][randomCol];
                setLevel10TargetGem(target);

                message = `Welcome to the 2D Array Challenge! Find the ${target.type} gem with value ${target.value} in the grid! This teaches you how to access elements in a 2D array using row and column indices.`;
                break;
            case 11:
                return (
                    <motion.div
                        key="game-complete-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[400px] text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-6xl mb-6"
                        >
                            🏆
                        </motion.div>
                        <h2 className="text-4xl font-bold mb-6 text-green-700">Congratulations, Array Master!</h2>
                        <div className="bg-blue-100 p-6 rounded-lg mb-8 max-w-2xl">
                            <h3 className="text-2xl font-semibold mb-4 text-blue-800">You've Mastered:</h3>
                            <ul className="text-left space-y-2 text-lg text-blue-700">
                                <li>✓ Creating and initializing arrays</li>
                                <li>✓ Adding elements to arrays</li>
                                <li>✓ Accessing array elements</li>
                                <li>✓ Inserting elements at specific positions</li>
                                <li>✓ Removing elements from arrays</li>
                                <li>✓ Finding array length</li>
                                <li>✓ Traversing arrays</li>
                                <li>✓ Searching in arrays</li>
                                <li>✓ Sorting arrays</li>
                                <li>✓ Working with 2D arrays</li>
                            </ul>
                        </div>
                        <p className="text-xl text-gray-700 mb-8">You've successfully completed all levels of the Treasure Chest Adventure!</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setCurrentLevel(1)} 
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Play Again
                            </button>
                            <button 
                                onClick={() => window.location.href = '/learn/arrays'} 
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Continue Learning
                            </button>
                        </div>
                    </motion.div>
                );
            default:
                message = 'Welcome to the Treasure Chest Adventure!';
        }
        setGameMessage(message);
    }, [currentLevel]);

    const handleDragStart = (event) => {
        console.log('Drag started:', event.active.id);
    };

    const handleDragEnd = (event) => {
        const draggedItem = event.active.data.current;
        const dropTargetId = event.over ? event.over.id : null;

        if(currentLevel === 2 && dropTargetId && dropTargetId.startsWith('slot-')) {
            const slotIndex = parseInt(dropTargetId.replace('slot-', ''), 10);
            if (treasureChest[slotIndex] === null) {
                setTreasureChest(prevChest => {
                    const newChest = [...prevChest];
                    newChest[slotIndex] = draggedItem;
                    if (newChest.every(item => item !== null)) {
                        setGameMessage('Chest is full!');
                        setSparkle(true);
                        setTimeout(() => {
                            setLevelObjectiveMet(true);
                            handleLevelComplete(currentLevel);
                        }, 2000);
                    } else {
                        setSparkle(false);
                        setLevelObjectiveMet(false);
                    }
                    return newChest;
                });
                setGameMessage(`You put the ${draggedItem.type} gem in slot ${slotIndex}!`);
                setGemsToCollect(prevGems => prevGems.filter(gem => gem.id !== draggedItem.id));
            } else {
                setGameMessage('That slot is already full, matey!');
                setLevelObjectiveMet(false);
            }
        }

        if (currentLevel === 4 && dropTargetId && dropTargetId.startsWith('insertion-slot-') && insertionIndex !== null) {
            const targetIndex = parseInt(dropTargetId.replace('insertion-slot-', ''), 10);
            if (targetIndex === insertionIndex) {
                setTreasureChest(prevChest => {
                    const newChest = [...prevChest];
                    newChest.splice(targetIndex, 0, draggedItem);
                    return newChest;
                });
                setGameMessage(`Perfect! You inserted the ${draggedItem.type} gem at the correct position!`);
                setSparkle(true);
                setTimeout(() => {
                    setLevelObjectiveMet(true);
                    handleLevelComplete(currentLevel);
                }, 2000);
            } else {
                setGameMessage('That\'s not the right position! Try again!');
                setSparkle(false);
                setLevelObjectiveMet(false);
            }
        }
    };

    const handleGemClick = (clickedGem) => {
        console.log('Clicked Gem Data:', clickedGem);
        if (currentLevel === 3 && targetGem) {
            if (clickedGem.id === targetGem.id) {
                setGameMessage(`Aye! You found the target gem: ${targetGem.type} (${targetGem.value})!`);
                setSparkle(true);
                handleLevelComplete(currentLevel);
            } else {
                setGameMessage(`Arr, that's not the one I'm looking for, matey. Try again!`);
                setSparkle(false);
                setLevelObjectiveMet(false);
            }
        }
        if (currentLevel === 5) {
            setTreasureChest(prevChest => {
                const newChest = prevChest.filter(gem => gem.id !== clickedGem.id);
                if (newChest.filter(item => item !== null).length <= 3) {
                    setSparkle(true);
                    setGameMessage("Excellent! You've cleared enough cursed gems!");
                    setTimeout(() => {
                        setLevelObjectiveMet(true);
                        handleLevelComplete(currentLevel);
                    }, 2000);
                } else {
                    setSparkle(false);
                    setLevelObjectiveMet(false);
                }
                return newChest;
            });
            setGameMessage(`Poof! You removed the ${clickedGem.type} gem!`);
        }
        if (currentLevel === 8 && clickedGem.type === '👑') {
            setGameMessage('You found the special gem! Well done!');
            setSparkle(true);
            setTimeout(() => {
                setLevelObjectiveMet(true);
                handleLevelComplete(currentLevel);
            }, 2000);
        } else if (currentLevel === 8) {
            setGameMessage('That\'s not the special gem, keep looking!');
            setSparkle(false);
            setLevelObjectiveMet(false);
        }
        if (currentLevel === 10 && level10TargetGem) {
            if (clickedGem.id === level10TargetGem.id) {
                setGameMessage(`Excellent! You found the target gem at position [${clickedGem.rowIndex}][${clickedGem.colIndex}]!`);
                setSparkle(true);
                setTimeout(() => {
                    setLevelObjectiveMet(true);
                    handleLevelComplete(currentLevel);
                }, 2000);
            } else {
                setGameMessage(`That's not the gem we're looking for. Keep searching!`);
                setSparkle(false);
                setLevelObjectiveMet(false);
            }
        }

        if (!sparkle) {
            setSparkle(false);
        }
    };

    const handleSortClick = () => {
        if (currentLevel === 9) {
            setTreasureChest(prevChest => {
                const sortedChest = [...prevChest].sort((a, b) => {
                    if (!a || !b) return 0;
                    return a.value - b.value;
                });
                return sortedChest;
            });
            setGameMessage('Gems sorted by value!');
            setSortAttempted(true);
        }
    };

    const isSorted = (arr) => {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i - 1].value > arr[i].value) {
                return false;
            }
        }
        return true;
    };

    useEffect(() => {
        if (currentLevel === 9 && sortAttempted) {
            if (isSorted(treasureChest)) {
                setSparkle(true);
                setGameMessage('Excellent! The gems are perfectly organized!');
                setTimeout(() => {
                    setLevelObjectiveMet(true);
                    handleLevelComplete(currentLevel);
                }, 2000);
            } else {
                setGameMessage('Hmm, they don\'t seem quite sorted yet. Try again!');
                setSparkle(false);
                setLevelObjectiveMet(false);
            }
            setSortAttempted(false);
        }
    }, [treasureChest, currentLevel, sortAttempted]);

    // Add level 6 traversal completion logic
    useEffect(() => {
        if (currentLevel === 6 && levelObjectiveMet) {
             handleLevelComplete(currentLevel);
        }
    }, [levelObjectiveMet, currentLevel]);

    // Add level 7 traversal completion logic
    useEffect(() => {
        if (currentLevel === 7 && levelObjectiveMet) {
             handleLevelComplete(currentLevel);
        }
    }, [levelObjectiveMet, currentLevel]);

    // Add level 1 completion logic (clicking the chest)
    useEffect(() => {
        if (currentLevel === 1 && treasureChest.length === 0 && gameMessage.includes('open')) {
            // Level 1 is completed when the chest is clicked and the message changes
            handleLevelComplete(currentLevel);
        }
    }, [treasureChest, gameMessage, currentLevel]);

    // Effect to handle level transitions when objective is met
    useEffect(() => {
        if (levelObjectiveMet) {
            // Determine the next level. If currentLevel is 10 (last level), navigate home.
            const nextLevel = currentLevel + 1;
            const totalLevels = 10; // Assuming 10 levels in total for arrays game

            if (currentLevel < totalLevels) {
                const timer = setTimeout(() => {
                    setCurrentLevel(nextLevel);
                    setLevelObjectiveMet(false); // Reset for the next level
                    setSparkle(false); // Reset sparkle
                }, 2000); // Delay before moving to the next level
                return () => clearTimeout(timer);
            } else if (currentLevel === totalLevels) {
                // Handle game completion - navigate or show completion screen
                const timer = setTimeout(() => {
                    navigate('/arrays'); // Navigate to arrays topic page after game completion
                }, 3000); // Delay before navigating after final level
                return () => clearTimeout(timer);
            }
        }
    }, [levelObjectiveMet, currentLevel, navigate]);

    // Add navigation handlers
    const handlePreviousLevel = () => {
        if (currentLevel > 1) {
            setCurrentLevel(prev => prev - 1);
            setLevelStartTime(Date.now());
            setLevelObjectiveMet(false);
            setSparkle(false);
        }
    };

    const handleNextLevel = () => {
        if (currentLevel < 10) {
            setCurrentLevel(prev => prev + 1);
            setLevelStartTime(Date.now());
            setLevelObjectiveMet(false);
            setSparkle(false);
        }
    };

    const DraggableGem = ({ id, type, value, children }) => {
        const { attributes, listeners, setNodeRef, transform } = useDraggable({
            id: id,
            data: { type, value }
        });
        const style = transform ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        } : undefined;

        return (
            <motion.div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="cursor-grab text-4xl p-2 bg-yellow-400 rounded-full shadow-md flex items-center justify-center"
            >
                {children || type} {value !== undefined && <span className="text-xs">({value})</span>}
            </motion.div>
        );
    };

    const DroppableSlot = ({ id, index, children, isInsertionTarget = false }) => {
        const { setNodeRef, isOver } = useDroppable({
            id: id,
        });

        const baseClasses = "flex flex-col items-center justify-center rounded-md transition-all duration-200 ease-in-out";
        const sizeClasses = isInsertionTarget ? "w-10 h-16 mx-1" : "w-20 h-20";
        const borderClasses = isOver ? 'border-green-500 bg-green-100' : 'border-gray-400 bg-gray-50';
        const isOccupied = !isInsertionTarget && currentLevel === 2 && treasureChest[index] !== null;
        const occupiedClasses = isOccupied ? 'bg-yellow-300 border-yellow-600' : '';

        return (
            <div
                ref={setNodeRef}
                className={`${baseClasses} ${sizeClasses} ${borderClasses} ${occupiedClasses} border-2 border-dashed`}
            >
                <span className="text-xs text-gray-600">{index}</span>
                {children}
            </div>
        );
    };

    const renderLevel = () => {
        switch (currentLevel) {
            case 1:
                return (
                    <motion.div
                        key="level1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[400px] text-center"
                    >
                        <h2 className="text-3xl font-semibold mb-4 text-blue-800">Level 1: Opening Your First Chest</h2>
                        <p className="text-lg text-gray-700 mb-6">Find the treasure chest to start your adventure!</p>
                        <div className="bg-blue-100 p-4 rounded-lg mb-6 max-w-lg">
                            <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                            <p className="text-blue-700">Understanding that an array is like a treasure chest - a container that can hold multiple items. When we create an array, it starts empty, just like this chest!</p>
                        </div>

                        <motion.div
                            initial={{ scale: 0.8, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 1 }}
                            className="w-48 h-48 bg-yellow-800 border-4 border-yellow-900 rounded-lg flex flex-col items-center justify-center mb-6 text-6xl text-yellow-300 relative overflow-hidden cursor-pointer"
                            onClick={() => {
                                setTreasureChest([]);
                                setGameMessage('The chest is open and ready for treasures!');
                                setSparkle(true);
                                setTimeout(() => {
                                    setCurrentLevel(2);
                                }, 2000);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <AnimatePresence>
                                {sparkle && (
                                    <motion.div
                                        key="sparkle1"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                        className="absolute inset-0 flex items-center justify-center text-6xl z-10"
                                    >
                                        ✨
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {!sparkle && <span>🔒</span>}
                        </motion.div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        key="level2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[400px] text-center"
                    >
                        <h2 className="text-3xl font-semibold mb-4 text-blue-800">Level 2: Collecting Gems</h2>
                        <p className="text-lg text-gray-700 mb-6">{gameMessage}</p>
                        <div className="bg-blue-100 p-4 rounded-lg mb-6 max-w-lg">
                            <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                            <p className="text-blue-700">Learn how to add elements to an array. Each slot in the chest represents an index in the array, and you can store a value (gem) at each index.</p>
                        </div>

                        <div className="flex justify-center gap-4 mb-8">
                            {gemsToCollect.map((gem) => (
                                <DraggableGem key={gem.id} id={gem.id} type={gem.type} value={gem.value}>
                                    {gem.type}
                                </DraggableGem>
                            ))}
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 p-4 bg-yellow-900 rounded-lg min-h-[100px] w-full max-w-md relative">
                            {treasureChest.map((item, index) => (
                                <DroppableSlot key={`slot-${index}`} id={`slot-${index}`} index={index}>
                                    {item && (
                                        <motion.div
                                            key={`level${currentLevel}-gem-${index}-${item?.id || 'no-id'}`}
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-4xl p-2 bg-yellow-400 rounded-full shadow-md flex items-center justify-center cursor-pointer"
                                            onClick={() => handleGemClick(item)}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {item.type}
                                            {item.value !== undefined && <span className="text-xs">({item.value})</span>}
                                        </motion.div>
                                    )}
                                </DroppableSlot>
                            ))}
                            <AnimatePresence>
                                {sparkle && gemsToCollect.length === 0 && (
                                    <motion.div
                                        key="sparkle2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5, delay: 0.5 }}
                                        className="absolute inset-0 flex items-center justify-center text-6xl z-10"
                                    >
                                        ✨
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {levelObjectiveMet && (
                            <button onClick={() => setCurrentLevel(3)} className="mt-8 px-4 py-2 bg-green-500 text-white rounded">
                                Next Level (3)! →
                            </button>
                        )}
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        key="level3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[400px] text-center"
                    >
                        <h2 className="text-3xl font-semibold mb-4 text-blue-800">Level 3: Gem Inspector</h2>
                        <p className="text-lg text-gray-700 mb-6">{gameMessage}</p>
                        <div className="bg-blue-100 p-4 rounded-lg mb-6 max-w-lg">
                            <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                            <p className="text-blue-700">Learn how to access array elements. Just like finding a specific gem in the chest, you can access any element in an array using its index.</p>
                        </div>

                        {targetGem && (
                            <p className="text-xl font-bold text-green-700 mb-4">Find the {targetGem.type} gem with value {targetGem.value}!</p>
                        )}

                        <div className="flex flex-wrap justify-center gap-4 p-4 bg-yellow-900 rounded-lg min-h-[100px] w-full max-w-md">
                            {treasureChest.map((item, index) => (
                                item && (
                                    <motion.div
                                        key={`level${currentLevel}-gem-${index}-${item?.id || 'no-id'}`}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-4xl p-2 bg-yellow-400 rounded-full shadow-md flex items-center justify-center cursor-pointer"
                                        onClick={() => handleGemClick(item)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {item.type}
                                        {item.value !== undefined && <span className="text-xs">({item.value})</span>}
                                    </motion.div>
                                )
                            ))}
                        </div>
                        {levelObjectiveMet && (
                            <button onClick={() => setCurrentLevel(4)} className="mt-8 px-4 py-2 bg-green-500 text-white rounded">
                                Next Level (4)! →
                            </button>
                        )}
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div
                        key="level4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[400px] text-center"
                    >
                        <h2 className="text-3xl font-semibold mb-4 text-blue-800">Level 4: Expanding Collection (Insertion)</h2>
                        <p className="text-lg text-gray-700 mb-6">{gameMessage}</p>
                        <div className="bg-blue-100 p-4 rounded-lg mb-6 max-w-lg">
                            <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                            <p className="text-blue-700">Learn how to insert elements into an array. When you insert a gem, all other gems shift to make space - just like how array elements move when you insert at a specific index.</p>
                        </div>

                        {gemsToCollect.length > 0 && insertionIndex !== null && (
                            <p className="text-xl font-bold text-green-700 mb-4">Drag the {gemsToCollect[0].type} gem into index {insertionIndex}!</p>
                        )}

                        <div className="flex justify-center gap-4 mb-8">
                            {gemsToCollect.map((gem) => (
                                <DraggableGem key={gem.id} id={gem.id} type={gem.type} value={gem.value}>
                                    {gem.type}
                                </DraggableGem>
                            ))}
                        </div>

                        <div className="flex justify-center items-center p-4 bg-yellow-900 rounded-lg min-h-[100px] w-full max-w-md">
                            <DroppableSlot key={`insertion-slot-${0}`} id={`insertion-slot-${0}`} index={0} isInsertionTarget={true} />
                            {treasureChest.map((item, index) => (
                                <React.Fragment key={`chest-item-and-slot-${index}`}>
                                    {item && (
                                        <motion.div
                                            key={`level${currentLevel}-gem-${index}-${item?.id || 'no-id'}`}
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className="text-4xl p-2 bg-yellow-400 rounded-full shadow-md flex items-center justify-center"
                                        >
                                            {item.type}
                                            {item.value !== undefined && <span className="text-xs">({item.value})</span>}
                                        </motion.div>
                                    )}
                                    <DroppableSlot key={`insertion-slot-${index + 1}`} id={`insertion-slot-${index + 1}`} index={index + 1} isInsertionTarget={true} />
                                </React.Fragment>
                            ))}
                        </div>
                        {levelObjectiveMet && (
                            <button onClick={() => setCurrentLevel(5)} className="mt-8 px-4 py-2 bg-green-500 text-white rounded">
                                Next Level (5)! →
                            </button>
                        )}
                    </motion.div>
                );

            case 5:
                return (
                    <motion.div
                        key="level5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[400px] text-center"
                    >
                        <h2 className="text-3xl font-semibold mb-4 text-blue-800">Level 5: Gem Removal</h2>
                        <p className="text-lg text-gray-700 mb-6">{gameMessage}</p>
                        <div className="bg-blue-100 p-4 rounded-lg mb-6 max-w-lg">
                            <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                            <p className="text-blue-700">Learn how to remove elements from an array. When you remove a gem, the remaining gems shift to fill the gap - just like how array elements move when you delete an element.</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 p-4 bg-yellow-900 rounded-lg min-h-[100px] w-full max-w-md">
                            {treasureChest.map((item, index) => (
                                item && (
                                    <motion.div
                                        key={`level${currentLevel}-gem-${index}-${item?.id || 'no-id'}`}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-4xl p-2 bg-yellow-400 rounded-full shadow-md flex items-center justify-center cursor-pointer"
                                        onClick={() => handleGemClick(item)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {item.type}
                                        {item.value !== undefined && <span className="text-xs">({item.value})</span>}
                                    </motion.div>
                                )
                            ))}
                        </div>
                        {levelObjectiveMet && (
                            <button onClick={() => setCurrentLevel(6)} className="mt-8 px-4 py-2 bg-green-500 text-white rounded">
                                Next Level (6)! →
                            </button>
                        )}
                    </motion.div>
                );

            case 6:
                return (
                    <motion.div
                        key="level6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[400px] text-center"
                    >
                        <h2 className="text-3xl font-semibold mb-4 text-blue-800">Level 6: Counting Gems (Length)</h2>
                        <p className="text-lg text-gray-700 mb-6">{gameMessage}</p>
                        <div className="bg-blue-100 p-4 rounded-lg mb-6 max-w-lg">
                            <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                            <p className="text-blue-700">Learn about array length. The number of gems in the chest represents the length of the array - how many elements it contains.</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 p-4 bg-yellow-900 rounded-lg min-h-[100px] w-full max-w-md">
                            {treasureChest.map((item) => (
                                item && (
                                    <motion.div
                                        key={`level${currentLevel}-gem-${item?.id || 'no-id'}`}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-4xl p-2 bg-yellow-400 rounded-full shadow-md flex items-center justify-center cursor-pointer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {item.type}
                                        {item.value !== undefined && <span className="text-xs">({item.value})</span>}
                                    </motion.div>
                                )
                            ))}
                        </div>
                         {!levelObjectiveMet && (
                             <button onClick={() => {
                                 const gemCount = treasureChest.filter(item => item !== null).length;
                                 if (gemCount > 0) {
                                     setGameMessage(`Captain Array counts ${gemCount} gems!`);
                                     setSparkle(true);
                                      setTimeout(() => {
                                          setLevelObjectiveMet(true);
                                      }, 1500);
                                 } else {
                                    setGameMessage('The chest is empty, matey!');
                                     setSparkle(false);
                                 }
                             }} className="mt-8 px-4 py-2 bg-blue-500 text-white rounded">
                                 Count Gems!
                             </button>
                         )}
                         {levelObjectiveMet && (
                             <button onClick={() => setCurrentLevel(7)} className="mt-8 px-4 py-2 bg-green-500 text-white rounded">
                                 Next Level (7)! →
                             </button>
                         )}
                    </motion.div>
                );

            case 7:
                return (
                    <motion.div
                        key="level7"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[400px] text-center"
                    >
                        <h2 className="text-3xl font-semibold mb-4 text-blue-800">Level 7: Gem Parade (Traversal)</h2>
                        <p className="text-lg text-gray-700 mb-6">{gameMessage}</p>
                        <div className="bg-blue-100 p-4 rounded-lg mb-6 max-w-lg">
                            <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                            <p className="text-blue-700">Learn about array traversal. Just like watching each gem in the parade, you can visit each element in an array one by one, from start to finish.</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 p-4 bg-yellow-900 rounded-lg min-h-[100px] w-full max-w-md">
                            <AnimatePresence mode="wait">
                                {treasureChest.filter(item => item !== null).map((item, index) => (
                                    <motion.div
                                        key={`level${currentLevel}-gem-${index}-${item?.id || 'no-id'}`}
                                        initial={{ opacity: 0.5, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0.5, scale: 0.8 }}
                                        transition={{ duration: 0.5, delay: index * 0.3 }}
                                        className="text-4xl p-2 bg-yellow-400 rounded-full shadow-md flex items-center justify-center"
                                    >
                                        {item.type}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                         {!levelObjectiveMet && (
                             <button onClick={() => {
                                 if (treasureChest.filter(item => item !== null).length > 0) {
                                     setGameMessage('Gems are marching!');
                                     setTimeout(() => {
                                          setGameMessage('The gem parade is over!');
                                         setSparkle(true);
                                          setTimeout(() => {
                                              setLevelObjectiveMet(true);
                                         }, 1500);
                                      }, treasureChest.filter(item => item !== null).length * 300 + 1000);
                                 } else {
                                    setGameMessage('Nothing to parade, the chest is empty!');
                                     setSparkle(false);
                                 }
                             }} className="mt-8 px-4 py-2 bg-blue-500 text-white rounded">
                                 Start Parade!
                             </button>
                         )}
                          {levelObjectiveMet && (
                             <button onClick={() => setCurrentLevel(8)} className="mt-8 px-4 py-2 bg-green-500 text-white rounded">
                                 Next Level (8)! →
                             </button>
                         )}
                    </motion.div>
                );

            case 8:
                return (
                    <motion.div
                        key="level8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[400px] text-center"
                    >
                        <h2 className="text-3xl font-semibold mb-4 text-blue-800">Level 8: Find the Special Gem</h2>
                        <p className="text-lg text-gray-700 mb-6">{gameMessage}</p>
                        <div className="bg-blue-100 p-4 rounded-lg mb-6 max-w-lg">
                            <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                            <p className="text-blue-700">Learn about array searching. Finding the CROWN is like searching for a specific element in an array - you need to check each element until you find what you're looking for.</p>
                        </div>

                        {targetGem && (
                            <p className="text-xl font-bold text-red-700 mb-4">Find the {targetGem.type} gem with value {targetGem.value}!</p>
                        )}

                        <div className="flex flex-wrap justify-center gap-4 p-4 bg-yellow-900 rounded-lg min-h-[100px] w-full max-w-md">
                            {treasureChest.map((item) => (
                                item && (
                                    <motion.div
                                        key={`level${currentLevel}-gem-${item?.id || 'no-id'}`}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-4xl p-2 bg-yellow-400 rounded-full shadow-md flex items-center justify-center cursor-pointer"
                                        onClick={() => handleGemClick(item)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {item.type}
                                        {item.value !== undefined && <span className="text-xs">({item.value})</span>}
                                    </motion.div>
                                )
                            ))}
                        </div>
                         {levelObjectiveMet && (
                             <button onClick={() => setCurrentLevel(9)} className="mt-8 px-4 py-2 bg-green-500 text-white rounded">
                                 Next Level (9)! →
                             </button>
                         )}
                    </motion.div>
                );

            case 9:
                return (
                    <motion.div
                        key="level9"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[400px] text-center"
                    >
                        <h2 className="text-3xl font-semibold mb-4 text-blue-800">Level 9: Rainbow Organization (Sorting)</h2>
                        <p className="text-lg text-gray-700 mb-6">{gameMessage}</p>
                        <div className="bg-blue-100 p-4 rounded-lg mb-6 max-w-lg">
                            <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                            <p className="text-blue-700">Learn about array sorting. Just like organizing gems by their value, you can sort array elements in ascending or descending order based on their values.</p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 p-4 bg-yellow-900 rounded-lg min-h-[100px] w-full max-w-md">
                            {treasureChest.map((item) => (
                                item && (
                                    <motion.div
                                        key={`level${currentLevel}-gem-${item?.id || 'no-id'}`}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-4xl p-2 bg-yellow-400 rounded-full shadow-md flex items-center justify-center"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {item.type}
                                        {item.value !== undefined && <span className="text-xs">({item.value})</span>}
                                    </motion.div>
                                )
                            ))}
                        </div>
                         {!levelObjectiveMet && (
                             <button onClick={handleSortClick} className="mt-8 px-4 py-2 bg-blue-500 text-white rounded">
                                 Sort Gems by Value!
                             </button>
                         )}
                          {levelObjectiveMet && (
                             <button onClick={() => setCurrentLevel(10)} className="mt-8 px-4 py-2 bg-green-500 text-white rounded">
                                 Next Level (10)! →
                             </button>
                         )}
                    </motion.div>
                );

            case 10:
                return (
                    <motion.div
                        key="level10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[400px] text-center"
                    >
                        <h2 className="text-3xl font-semibold mb-4 text-blue-800">Level 10: 2D Array Challenge - Find the Gem!</h2>
                        <p className="text-lg text-gray-700 mb-6">{gameMessage}</p>
                        <div className="bg-blue-100 p-4 rounded-lg mb-6 max-w-lg">
                            <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                            <p className="text-blue-700">Understand 2D arrays and how to access elements using row and column indices. Find the target gem by clicking on its position in the grid.</p>
                        </div>

                        {level10TargetGem && (
                            <p className="text-xl font-bold text-green-700 mb-4">Find the {level10TargetGem.type} gem with value {level10TargetGem.value}!</p>
                        )}

                        <div className="grid gap-2 p-4 bg-yellow-900 rounded-lg">
                            {level10Grid.map((row, rowIndex) => (
                                <div key={`row-${rowIndex}`} className="flex justify-center gap-2">
                                    {row.map((item, colIndex) => (
                                        item && (
                                            <motion.div
                                                key={`level${currentLevel}-gem-${rowIndex}-${colIndex}-${item?.id || 'no-id'}`}
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="text-3xl p-2 bg-yellow-400 rounded-md shadow-md flex flex-col items-center justify-center cursor-pointer"
                                                onClick={() => handleGemClick({ ...item, rowIndex, colIndex })}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {item.type}
                                                {item.value !== undefined && <span className="text-xs">({item.value})</span>}
                                            </motion.div>
                                        )
                                    ))}
                                </div>
                            ))}
                        </div>

                        {levelObjectiveMet && (
                            <button 
                                onClick={() => {
                                    setCurrentLevel(11);
                                    navigate('/');
                                }} 
                                className="mt-8 px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Game Complete! →
                            </button>
                        )}
                    </motion.div>
                );

            default:
                return (
                    <motion.div
                        key="welcome-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[400px] text-center"
                    >
                        <h2 className="text-3xl font-semibold mb-4 text-blue-800">Welcome to Treasure Chest Adventure!</h2>
                        <p className="text-xl text-gray-700 mb-6">Start your journey to become an Array Master!</p>
                        <button onClick={() => setCurrentLevel(1)} className="mt-8 px-4 py-2 bg-green-500 text-white rounded">
                            Start Adventure
                        </button>
                    </motion.div>
                );
        }
    };

    // Function to render progress indicator
    const renderProgressIndicator = () => {
        return (
            <div className="mt-8 flex justify-center space-x-2">
                {[...Array(10)].map((_, index) => {
                    const levelNum = index + 1;
                    const isCompleted = completedLevels.has(levelNum);
                    const isCurrent = currentLevel === levelNum;
                    return (
                        <div
                            key={levelNum}
                            onClick={() => {
                                if (!isCurrent) setCurrentLevel(levelNum);
                            }}
                            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-200 select-none
                                ${isCompleted ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-500 text-white' : 'bg-white border-gray-400 text-gray-600'}
                                ${isCurrent ? 'ring-2 ring-green-500 scale-110' : ''}
                                cursor-pointer hover:shadow-lg hover:border-green-400 hover:scale-105`
                            }
                            style={{ userSelect: 'none' }}
                        >
                            {levelNum}
                        </div>
                    );
                })}
            </div>
        );
    };

    // Progress visualization component
    const ProgressBar = () => (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Level Progress</h3>
                <div className="text-sm text-gray-600">
                    {Object.keys(progress).filter(Boolean).length} of 10 levels completed
                </div>
            </div>
            <div className="grid grid-cols-10 gap-2">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(levelNum => {
                    const levelData = progress[levelNum];
                    const levelCompleted = levelData ? levelData.completed : false;
                    return (
                        <div
                            key={levelNum}
                            className={`h-2 rounded-full ${
                                levelCompleted ? 'bg-green-500' : 'bg-gray-200'
                            }`}
                            title={`Level ${levelNum}: ${levelCompleted ? 'Completed' : 'Not Started'}${
                                levelData && levelData.score ? ` (Score: ${levelData.score})` : ''
                            }`}
                        />
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen">
            <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} collisionDetection={closestCorners}>
                <div className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 flex flex-col items-center justify-center py-10">
                <GameDecorations />
                    {/* Card-like main container */}
                    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-white via-green-50 to-emerald-100 rounded-3xl shadow-2xl p-8 border-2 border-green-500 relative z-10 flex flex-col items-center">
                        {/* Add navigation buttons */}
                        <div className="flex justify-between items-center mb-4 w-full px-2">
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
                                Level {currentLevel} of 10
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

                        {renderProgressIndicator()}
                        <h1 className="text-5xl pt-10 font-extrabold text-center mb-8 bg-gradient-to-r from-green-600 via-emerald-700 to-green-800 bg-clip-text text-transparent drop-shadow-lg tracking-tight relative z-10 font-serif">
                            Treasure Chest Adventure
                        </h1>

                        <div className="text-center mb-6 p-4 bg-gradient-to-r from-green-100 via-emerald-50 to-green-200 border border-green-400 rounded-xl shadow-md italic max-w-lg mx-auto relative z-10">
                            <p className="text-xl text-gray-800 font-medium"><span className='bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent font-bold'>Captain Array says:</span> "{gameMessage}"</p>
                        </div>

                        <div className="relative z-10 w-full">
                            <AnimatePresence mode="wait">
                                {renderLevel()}
                            </AnimatePresence>
                        </div>

                        <AnimatePresence>
                            {sparkle && (
                                <motion.div
                                    key="global-sparkle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1 }}
                                    className="absolute inset-0 flex items-center justify-center text-9xl z-50 pointer-events-none text-yellow-400"
                                >
                                    ✨
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Add progress visualization */}
                        <ProgressBar />
                    </div>
                </div>
            </DndContext>
        </div>
    );
};

export default TreasureChestAdventure; 