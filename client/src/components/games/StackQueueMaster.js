import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import GameDecorations from './GameDecorations';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const StackQueueMaster = () => {
    // Core game states
    const [currentLevel, setCurrentLevel] = useState(1);
    const [gameMessage, setGameMessage] = useState('Welcome to Stack & Queue Master!');
    const [showSuccess, setShowSuccess] = useState(false);
    const [stack, setStack] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [gamePhase, setGamePhase] = useState('stacking');
    const [platesRemoved, setPlatesRemoved] = useState(0);
    const [targetSize, setTargetSize] = useState(0);
    const [showSize, setShowSize] = useState(false);
    const [showEmpty, setShowEmpty] = useState(false);
    const [bracketSequence, setBracketSequence] = useState('');
    const [currentBracketIndex, setCurrentBracketIndex] = useState(0);
    const [bracketStack, setBracketStack] = useState([]);
    const [isChecking, setIsChecking] = useState(false);
    const [expression, setExpression] = useState('');
    const [currentExpressionIndex, setCurrentExpressionIndex] = useState(0);
    const [numberStack, setNumberStack] = useState([]);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [expressionsEvaluated, setExpressionsEvaluated] = useState(0);
    const [expectedResult, setExpectedResult] = useState(0);
    const [queue, setQueue] = useState([]);
    const [servedCustomers, setServedCustomers] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showReplay, setShowReplay] = useState(false);
    const [levelObjectiveMet, setLevelObjectiveMet] = useState(false);
    const [showDashboardButton, setShowDashboardButton] = useState(false);

    // Level specific constants
    const LEVEL_1_TARGET = 5;
    const LEVEL_2_TARGET = 8;
    const LEVEL_3_TARGET = 8;
    const LEVEL_4_TARGET = 3;
    const LEVEL_5_TARGET = 10;
    const LEVEL_7_TARGET = 8;
    const LEVEL_6_TARGET = 8;
    const PLATE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
    const LEVEL_2_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    const LEVEL_3_COLORS = [
        'bg-pink-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
        'bg-purple-500', 'bg-orange-500', 'bg-teal-500', 'bg-red-500'
    ];
    const BRACKET_PAIRS = {
        '(': ')',
        '[': ']',
        '{': '}'
    };
    const BRACKET_SEQUENCES = [
        '({[]})',
        '([)]',
        '{[()]}',
        '((()))',
        '({)}',
        '[]{}()'
    ];
    const POSTFIX_EXPRESSIONS = [
        {
            expression: "3 4 +",
            expectedResult: 7,
            hint: "Start by pushing 3 and 4 onto the stack, then add them",
            steps: [
                "Push 3 onto the stack",
                "Push 4 onto the stack",
                "Pop 4 and 3 from the stack",
                "Add them: 3 + 4 = 7",
                "Push 7 back onto the stack"
            ]
        },
        {
            expression: "5 2 * 3 +",
            expectedResult: 13,
            hint: "First multiply 5 and 2, then add 3",
            steps: [
                "Push 5 onto the stack",
                "Push 2 onto the stack",
                "Pop 2 and 5 from the stack",
                "Multiply them: 5 * 2 = 10",
                "Push 10 onto the stack",
                "Push 3 onto the stack",
                "Pop 3 and 10 from the stack",
                "Add them: 10 + 3 = 13",
                "Push 13 back onto the stack"
            ]
        },
        {
            expression: "10 5 - 2 *",
            expectedResult: 10,
            hint: "First subtract 5 from 10, then multiply by 2",
            steps: [
                "Push 10 onto the stack",
                "Push 5 onto the stack",
                "Pop 5 and 10 from the stack",
                "Subtract them: 10 - 5 = 5",
                "Push 5 onto the stack",
                "Push 2 onto the stack",
                "Pop 2 and 5 from the stack",
                "Multiply them: 5 * 2 = 10",
                "Push 10 back onto the stack"
            ]
        },
        {
            expression: "15 3 / 4 +",
            expectedResult: 9,
            hint: "First divide 15 by 3, then add 4",
            steps: [
                "Push 15 onto the stack",
                "Push 3 onto the stack",
                "Pop 3 and 15 from the stack",
                "Divide them: 15 / 3 = 5",
                "Push 5 onto the stack",
                "Push 4 onto the stack",
                "Pop 4 and 5 from the stack",
                "Add them: 5 + 4 = 9",
                "Push 9 back onto the stack"
            ]
        },
        {
            expression: "8 4 2 * +",
            expectedResult: 16,
            hint: "First multiply 4 and 2, then add 8",
            steps: [
                "Push 8 onto the stack",
                "Push 4 onto the stack",
                "Push 2 onto the stack",
                "Pop 2 and 4 from the stack",
                "Multiply them: 4 * 2 = 8",
                "Push 8 onto the stack",
                "Pop 8 and 8 from the stack",
                "Add them: 8 + 8 = 16",
                "Push 16 back onto the stack"
            ]
        }
    ];
    const CUSTOMER_NAMES = [
        'Alice', 'Bob', 'Charlie', 'Diana', 'Eve',
        'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
        'Kelly', 'Liam', 'Mia', 'Noah', 'Olivia'
    ];
    const ICE_CREAM_FLAVORS = [
        'Vanilla', 'Chocolate', 'Strawberry', 'Mint',
        'Butter Pecan', 'Cookie Dough', 'Rocky Road'
    ];

    // Progress states
    const [progress, setProgress] = useState({});
    const [completedLevels, setCompletedLevels] = useState(new Set());
    const [isSaving, setIsSaving] = useState(false);
    const [levelStartTime, setLevelStartTime] = useState(Date.now());
    const { user } = useAuth();

    // Load progress from database
    useEffect(() => {
        let isMounted = true;  // Add mounted flag for cleanup

        const fetchStackQueueProgress = async () => {
            if (!user) {
                console.log('[StackQueueMaster] No user, skipping progress fetch');
                return;
            }
            
            try {
                console.log('[StackQueueMaster] Fetching progress for user:', user);
                const token = localStorage.getItem('token');
                console.log('[StackQueueMaster] Token exists for fetch:', !!token);
                
                const response = await fetch(`${BACKEND_URL}/api/game-progress/all-progress`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!isMounted) {
                    console.log('[StackQueueMaster] Component unmounted, stopping fetch');
                    return;
                }
                
                console.log('[StackQueueMaster] Fetch response status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch progress: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('[StackQueueMaster] Received progress data:', data);
                
                // Find stack-queue progress
                const stackQueueProgress = data.progress?.find(p => p.topicId === 'stack-queue');
                console.log('[StackQueueMaster] Found stack-queue progress:', stackQueueProgress);
                console.log('[StackQueueMaster] Stack-queue progress keys:', stackQueueProgress ? Object.keys(stackQueueProgress) : 'No progress found');
                console.log('[StackQueueMaster] Stack-queue progress levels:', stackQueueProgress?.levels);
                console.log('[StackQueueMaster] Stack-queue progress gameLevels:', stackQueueProgress?.gameLevels);
                
                if (stackQueueProgress) {
                    console.log('[StackQueueMaster] Processing stack-queue progress:', stackQueueProgress);
                    
                    // Extract completed levels - try both possible structures
                    let completed = new Set();
                    
                    if (stackQueueProgress.gameLevels) {
                        completed = new Set(
                            stackQueueProgress.gameLevels
                                ?.filter(level => level.completed)
                                .map(level => level.level) || []
                        );
                        console.log('[StackQueueMaster] Using gameLevels structure');
                    } else if (stackQueueProgress.levels) {
                        completed = new Set(
                            stackQueueProgress.levels
                                ?.filter(level => level.completed)
                                .map(level => level.level) || []
                        );
                        console.log('[StackQueueMaster] Using levels structure');
                    } else {
                        console.log('[StackQueueMaster] No levels structure found, checking for direct level data');
                        // Check if levels are stored directly in the progress object
                        if (stackQueueProgress.level) {
                            completed = new Set([stackQueueProgress.level]);
                            console.log('[StackQueueMaster] Using direct level data');
                        }
                    }
                    
                    console.log('[StackQueueMaster] Extracted completed levels:', completed);
                    console.log('[StackQueueMaster] Highest level from server:', stackQueueProgress.highestLevel);
                    
                    setCompletedLevels(completed);
                    
                    console.log('[StackQueueMaster] State updated with completed levels:', completed);
                    console.log('[StackQueueMaster] State updated with highest level:', stackQueueProgress.highestLevel || 1);
                } else {
                    console.log('[StackQueueMaster] No stack-queue progress found, using defaults');
                    setCompletedLevels(new Set());
                }
                
            } catch (error) {
                console.error('[StackQueueMaster] Error fetching progress:', error);
                if (isMounted) {
                    setCompletedLevels(new Set());
                }
            }
        };

        fetchStackQueueProgress();
        
        return () => {
            isMounted = false;  // Cleanup function
        };
    }, [user]);

    // Reset level state when changing levels
    useEffect(() => {
        console.log(`[StackQueueMaster] Level changed to ${currentLevel}, resetting state`);
        setLevelStartTime(Date.now());
        setLevelObjectiveMet(false);
        setShowSuccess(false);
        setGameMessage('Welcome to Stack & Queue Master!');
        
        // Reset level-specific states
        setStack([]);
        setPlatesRemoved(0);
        setTargetSize(0);
        setShowSize(false);
        setShowEmpty(false);
        setBracketSequence('');
        setCurrentBracketIndex(0);
        setBracketStack([]);
        setIsChecking(false);
        setExpression('');
        setCurrentExpressionIndex(0);
        setNumberStack([]);
        setIsEvaluating(false);
        setExpressionsEvaluated(0);
        setExpectedResult(0);
        setQueue([]);
        setServedCustomers(0);
        setIsProcessing(false);
        setShowReplay(false);
        setShowDashboardButton(false);
        
        // Reset Level 7 state
        setQueue7([]);
        setServedCustomers7(0);
        setPeekedCustomer7(null);
        setSearchName7("");
        setSearchResult7(null);
        setShowSize7(false);
        setShowEmpty7(false);
        setSizeMessage7("");
        setEmptyMessage7("");
        
        // Reset Level 6 state
        setQueue6([]);
        setServedCustomers6(0);
        setShowSize6(false);
        setShowEmpty6(false);
        setSizeMessage6("");
        setEmptyMessage6("");
        
        // Reset Level 3 state
        setStack3([]);
        setPlatesRemoved3(0);
        setPeekedPlate3(null);
        setSearchValue3("");
        setSearchResult3(null);
        
        // Update game message based on level
        const messages = {
            1: "Welcome to Level 1! Build a tower by stacking plates. Use Push to add plates and Pop to remove them.",
            2: "Welcome to Level 2! Stack plates and check the size. Reach the target size to complete the level.",
            3: "Welcome to Level 3! Use peek to see the top plate and search to find specific plates.",
            4: "Welcome to Level 4! Evaluate postfix expressions using a stack. Follow the mathematical operations carefully.",
            5: "Welcome to Level 5! Manage the ice cream shop queue. Serve customers in the correct order.",
            6: "Welcome to Level 6! Use queue size and empty functions to manage the customer line.",
            7: "Welcome to Level 7! Use peek and search functions to find customers in the queue.",
            8: "Welcome to Level 8! Choose the right data structure for each scenario. Stack or Queue?",
            9: "Welcome to Level 9! Use a stack to reverse spells and a queue to store them in order.",
            10: "Welcome to Level 10! Use stack and queue to check if words are palindromes."
        };
        
        setGameMessage(messages[currentLevel] || "Welcome to Stack & Queue Master!");
        
    }, [currentLevel]);

    // Add Level 7 state
    const [queue7, setQueue7] = useState([]);
    const [servedCustomers7, setServedCustomers7] = useState(0);
    const [peekedCustomer7, setPeekedCustomer7] = useState(null);
    const [searchName7, setSearchName7] = useState("");
    const [searchResult7, setSearchResult7] = useState(null);
    const [showSize7, setShowSize7] = useState(false);
    const [showEmpty7, setShowEmpty7] = useState(false);
    const [sizeMessage7, setSizeMessage7] = useState("");
    const [emptyMessage7, setEmptyMessage7] = useState("");

    // Add Level 6 state
    const [queue6, setQueue6] = useState([]);
    const [servedCustomers6, setServedCustomers6] = useState(0);
    const [showSize6, setShowSize6] = useState(false);
    const [showEmpty6, setShowEmpty6] = useState(false);
    const [sizeMessage6, setSizeMessage6] = useState("");
    const [emptyMessage6, setEmptyMessage6] = useState("");

    // Add Level 3 state
    const [stack3, setStack3] = useState([]);
    const [platesRemoved3, setPlatesRemoved3] = useState(0);
    const [peekedPlate3, setPeekedPlate3] = useState(null);
    const [searchValue3, setSearchValue3] = useState("");
    const [searchResult3, setSearchResult3] = useState(null);

    // Add Level 8 state and constants
    const LEVEL_8_CHALLENGES = [
        {
            scenario: 'Reverse the sequence: [A, B, C, D]',
            correct: 'stack',
            input: ['A', 'B', 'C', 'D'],
            goal: ['D', 'C', 'B', 'A'],
            description: 'Use a stack to reverse the order.'
        },
        {
            scenario: 'Process the sequence in order: [1, 2, 3, 4]',
            correct: 'queue',
            input: ['1', '2', '3', '4'],
            goal: ['1', '2', '3', '4'],
            description: 'Use a queue to process items in order.'
        },
        {
            scenario: 'Check if the word is a palindrome: "LEVEL"',
            correct: 'stack',
            input: ['L', 'E', 'V', 'E', 'L'],
            goal: ['L', 'E', 'V', 'E', 'L'],
            description: 'Use a stack to check for palindrome.'
        }
    ];
    const [currentChallenge8, setCurrentChallenge8] = useState(0);
    const [structure8, setStructure8] = useState([]);
    const [chosenStructure8, setChosenStructure8] = useState('stack');
    const [userOutput8, setUserOutput8] = useState([]);
    const [inputIndex8, setInputIndex8] = useState(0);
    const [level8Message, setLevel8Message] = useState('');
    const [showFeedback8, setShowFeedback8] = useState(false);

    // Replace Level 9 constants
    const LEVEL_9_TARGET = 8;
    const MAGIC_SPELLS = [
        'Lumos', 'Wingardium Leviosa', 'Expelliarmus', 'Alohomora',
        'Expecto Patronum', 'Avada Kedavra', 'Crucio', 'Imperio'
    ];

    // Replace Level 9 state
    const [spellStack9, setSpellStack9] = useState([]);
    const [tempStack9, setTempStack9] = useState([]);
    const [spellQueue9, setSpellQueue9] = useState([]);
    const [currentSpellIndex9, setCurrentSpellIndex9] = useState(0);
    const [spellsReversed9, setSpellsReversed9] = useState(0);
    const [showSpellEffect9, setShowSpellEffect9] = useState(false);
    const [currentSpellEffect9, setCurrentSpellEffect9] = useState('');

    // Initialize Level 2
    useEffect(() => {
        if (currentLevel === 2) {
            const randomSize = Math.floor(Math.random() * 5) + 4; // Random size between 4-8
            setTargetSize(randomSize);
            setStack([]);
            setGameMessage(`Level 2: Stack Size Challenge! Create a stack with exactly ${randomSize} plates.`);
        }
    }, [currentLevel]);

    // Initialize Level 3
    useEffect(() => {
        if (currentLevel === 3) {
            setStack3([]);
            setPlatesRemoved3(0);
            setPeekedPlate3(null);
            setSearchValue3("");
            setSearchResult3(null);
            setGameMessage('Level 3: Learn to peek at the top and search for a plate in the stack! Remove 8 plates.');
        }
    }, [currentLevel]);

    // Initialize Level 4
    useEffect(() => {
        if (currentLevel === 4) {
            setNumberStack([]);
            setCurrentExpressionIndex(0);
            setExpressionsEvaluated(0);
            setGameMessage('Level 4: Evaluate postfix expressions using a stack!');
        }
    }, [currentLevel]);

    // Initialize Level 5
    useEffect(() => {
        if (currentLevel === 5) {
            setQueue([]);
            setServedCustomers(0);
            setGameMessage('Level 5: Manage the ice cream shop line! Serve customers in order.');
        }
    }, [currentLevel]);

    // Initialize Level 7
    useEffect(() => {
        if (currentLevel === 7) {
            setQueue7([]);
            setServedCustomers7(0);
            setPeekedCustomer7(null);
            setSearchName7("");
            setSearchResult7(null);
            setShowSize7(false);
            setShowEmpty7(false);
            setSizeMessage7("");
            setEmptyMessage7("");
            setGameMessage('Level 7: Learn to peek at the front and search for a customer in the queue! Serve 8 customers.');
        }
    }, [currentLevel]);

    // Initialize Level 6
    useEffect(() => {
        if (currentLevel === 6) {
            setQueue6([]);
            setServedCustomers6(0);
            setShowSize6(false);
            setShowEmpty6(false);
            setSizeMessage6("");
            setEmptyMessage6("");
            setGameMessage('Level 6: Learn how to use size() and empty() with queues! Serve 8 customers.');
        }
    }, [currentLevel]);

    // Level 8 initialization
    useEffect(() => {
        if (currentLevel === 8) {
            setCurrentChallenge8(0);
            setChosenStructure8('stack');
            setStructure8([]);
            setUserOutput8([]);
            setInputIndex8(0);
            setLevel8Message('Level 8: Stack & Queue Combo Challenge! Choose the right data structure for each task.');
            setShowFeedback8(false);
        }
    }, [currentLevel]);

    // Replace Level 9 initialization
    useEffect(() => {
        if (currentLevel === 9) {
            setSpellStack9([]);
            setTempStack9([]);
            setSpellQueue9([]);
            setCurrentSpellIndex9(0);
            setSpellsReversed9(0);
            setShowSpellEffect9(false);
            setCurrentSpellEffect9('');
            setGameMessage('Level 9: The Magic Spell Reverser! Convert spells from Stack to Queue order.');
        }
    }, [currentLevel]);

    // Check if brackets are balanced
    const checkBrackets = () => {
        setIsChecking(true);
        let isValid = true;
        const newStack = [];
        let currentIndex = 0;

        const processNextBracket = () => {
            if (currentIndex >= bracketSequence.length) {
                // Check if all brackets were matched
                if (newStack.length === 0) {
                    setGameMessage('Brackets are balanced!');
                    if (currentBracketIndex + 1 < LEVEL_3_TARGET) {
                        setTimeout(() => {
                            setCurrentBracketIndex(prev => prev + 1);
                            setBracketSequence(BRACKET_SEQUENCES[currentBracketIndex + 1]);
                            setBracketStack([]);
                            setGameMessage('Next sequence! Check if these brackets are balanced.');
                        }, 2000);
                    } else {
                        setShowSuccess(true);
                        setGameMessage('Level 3 Complete! You mastered bracket balancing!');
                        handleLevelComplete(3);
                    }
                } else {
                    setGameMessage('Brackets are not balanced! Some opening brackets were not closed.');
                    setBracketStack([]);
                    // Move to next sequence after showing error
                    setTimeout(() => {
                        if (currentBracketIndex + 1 < LEVEL_3_TARGET) {
                            setCurrentBracketIndex(prev => prev + 1);
                            setBracketSequence(BRACKET_SEQUENCES[currentBracketIndex + 1]);
                            setBracketStack([]);
                            setGameMessage('Next sequence! Check if these brackets are balanced.');
                        } else {
                            setShowSuccess(true);
                            setGameMessage('Level 3 Complete! You mastered bracket balancing!');
                            handleLevelComplete(3);
                        }
                    }, 2000);
                }
                setIsChecking(false);
                return;
            }

            const char = bracketSequence[currentIndex];
            
            if (BRACKET_PAIRS[char]) {
                // Opening bracket
                newStack.push(char);
                setBracketStack([...newStack]);
                setGameMessage(`Added opening bracket: ${char}`);
            } else {
                // Closing bracket
                const lastOpening = newStack.pop();
                if (!lastOpening || BRACKET_PAIRS[lastOpening] !== char) {
                    isValid = false;
                    setGameMessage(`Mismatch! ${lastOpening || 'nothing'} doesn't match with ${char}`);
                    setBracketStack([]);
                    // Move to next sequence after showing error
                    setTimeout(() => {
                        if (currentBracketIndex + 1 < LEVEL_3_TARGET) {
                            setCurrentBracketIndex(prev => prev + 1);
                            setBracketSequence(BRACKET_SEQUENCES[currentBracketIndex + 1]);
                            setBracketStack([]);
                            setGameMessage('Next sequence! Check if these brackets are balanced.');
                        } else {
                            setShowSuccess(true);
                            setGameMessage('Level 3 Complete! You mastered bracket balancing!');
                            handleLevelComplete(3);
                        }
                    }, 2000);
                    setIsChecking(false);
                    return;
                }
                setBracketStack([...newStack]);
                setGameMessage(`Matched ${lastOpening} with ${char}`);
            }

            currentIndex++;
            setTimeout(processNextBracket, 1000); // Add delay between processing each bracket
        };

        processNextBracket();
    };

    // Evaluate postfix expression
    const evaluateExpression = () => {
        if (isEvaluating) return;
        
        setIsEvaluating(true);
        const expression = POSTFIX_EXPRESSIONS[currentExpressionIndex].expression;
        const tokens = expression.split(' ');
        let stack = [];
        
        const processNextToken = (index) => {
            if (index >= tokens.length) {
                setIsEvaluating(false);
                if (stack[0] === POSTFIX_EXPRESSIONS[currentExpressionIndex].expectedResult) {
                    setExpressionsEvaluated(prev => prev + 1);
                    if (expressionsEvaluated + 1 === LEVEL_4_TARGET) {
                        setTimeout(() => {
                            setShowSuccess(true);
                            setGameMessage('Level 4 Complete! You mastered postfix evaluation!');
                            saveProgress(4);
                        }, 2000);
                    } else {
                        setCurrentExpressionIndex(prev => prev + 1);
                        setNumberStack([]);
                        setGameMessage('Correct! Try the next expression.');
                    }
                } else {
                    setGameMessage('Incorrect result. Try again!');
                }
                return;
            }

            const token = tokens[index];
            if (!isNaN(token)) {
                stack.push(parseInt(token));
                setNumberStack([...stack]);
                setTimeout(() => processNextToken(index + 1), 500);
            } else {
                const b = stack.pop();
                const a = stack.pop();
                let result;
                
                switch(token) {
                    case '+': result = a + b; break;
                    case '-': result = a - b; break;
                    case '*': result = a * b; break;
                    case '/': result = a / b; break;
                    default: result = 0;
                }
                
                stack.push(result);
                setNumberStack([...stack]);
                setTimeout(() => processNextToken(index + 1), 500);
            }
        };

        processNextToken(0);
    };

    // Handle plate push
    const handlePush = () => {
        if (currentLevel === 1) {
        if (stack.length < LEVEL_1_TARGET && gamePhase === 'stacking') {
            const newPlate = {
                id: Date.now(),
                color: PLATE_COLORS[stack.length % PLATE_COLORS.length]
            };
            setStack([...stack, newPlate]);
            setGameMessage(`Plate ${stack.length + 1} added! Stack ${LEVEL_1_TARGET - (stack.length + 1)} more.`);
            
            if (stack.length + 1 === LEVEL_1_TARGET) {
                setGamePhase('removing');
                setGameMessage('Great! Now remove the plates in reverse order!');
            }
        }
        } else if (currentLevel === 2) {
            if (stack.length < LEVEL_2_TARGET) {
                const newPlate = {
                    id: Date.now(),
                    color: LEVEL_2_COLORS[Math.floor(Math.random() * LEVEL_2_COLORS.length)]
                };
                setStack([...stack, newPlate]);
                setGameMessage(`Plate added! Current stack size: ${stack.length + 1}`);
                
                if (stack.length + 1 === targetSize) {
                    setShowSuccess(true);
                    setGameMessage(`Perfect! You created a stack with exactly ${targetSize} plates!`);
                    saveProgress(2);
                } else if (stack.length + 1 > targetSize) {
                    setGameMessage(`Oops! Stack size (${stack.length + 1}) is larger than target (${targetSize}). Try again!`);
                    setStack([]);
                }
            }
        }
    };

    // Handle plate pop
    const handlePop = () => {
        if (currentLevel === 1) {
        if (stack.length > 0 && gamePhase === 'removing') {
            const newStack = stack.slice(0, -1);
            setStack(newStack);
            setPlatesRemoved(prev => prev + 1);
            setGameMessage(`Plate removed! ${stack.length - 1} plates remaining.`);

            if (newStack.length === 0) {
                setShowSuccess(true);
                setGameMessage('Level 1 Complete! You mastered the basic stack operations!');
                saveProgress(1);
                }
            }
        } else if (currentLevel === 2) {
            if (stack.length > 0) {
                const newStack = stack.slice(0, -1);
                setStack(newStack);
                setGameMessage(`Plate removed! Current stack size: ${newStack.length}`);
            } else {
                setGameMessage('Stack is empty! Cannot pop from an empty stack.');
            }
        }
    };

    // Handle plate peek
    const handlePeek = () => {
        if (stack.length > 0) {
            if (currentLevel === 1) {
            setGameMessage(`Top plate is plate ${stack.length}`);
            } else {
                setGameMessage(`Top plate is at position ${stack.length}`);
            }
        } else {
            setGameMessage('Stack is empty!');
        }
    };

    // Check stack size
    const checkSize = () => {
        setShowSize(true);
        setGameMessage(`Current stack size: ${stack.length}`);
        setTimeout(() => setShowSize(false), 2000);
    };

    // Check if stack is empty
    const checkEmpty = () => {
        setShowEmpty(true);
        setGameMessage(`Stack is ${stack.length === 0 ? 'empty' : 'not empty'}`);
        setTimeout(() => setShowEmpty(false), 2000);
    };

    // Function to calculate score
    const calculateScore = (level) => {
        return 10; // Fixed score of 10 points per level, no time bonus
    };

    // Function to save progress to database
    const saveProgress = async (level) => {
        if (!user) {
            console.log('[StackQueueMaster] No user found, progress will not be saved');
            return;
        }

        try {
            console.log(`[StackQueueMaster] Starting to save progress for level ${level}`);
            setIsSaving(true);
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('[StackQueueMaster] No authentication token found');
                return;
            }

            const timeSpent = Math.floor((Date.now() - levelStartTime) / 1000);
            const score = calculateScore(level);

            // Ensure all values are of the correct type and match server expectations
            const progressData = {
                topicId: 'stack-queue',
                level: Number(level),
                score: Number(score),
                timeSpent: Number(timeSpent)
            };

            console.log('[StackQueueMaster] Saving progress data:', progressData);

            const response = await fetch(`${BACKEND_URL}/api/game-progress/save-progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(progressData)
            });

            console.log('[StackQueueMaster] Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('[StackQueueMaster] Failed to save progress:', errorData.message || response.statusText);
                throw new Error(`Failed to save progress: ${response.status} - ${errorData.message || response.statusText}`);
            }

            const result = await response.json();
            console.log('[StackQueueMaster] Progress save response:', result);
            
            if (result.success) {
                // Update local state
                setCompletedLevels(prev => {
                    const newSet = new Set([...prev, level]);
                    console.log('[StackQueueMaster] Updated completed levels:', newSet);
                    return newSet;
                });
                
                console.log(`[StackQueueMaster] Successfully saved progress for level ${level}:`, result);
            } else {
                throw new Error(result.error || 'Failed to save progress');
            }

        } catch (error) {
            console.error('[StackQueueMaster] Error saving progress:', error);
        } finally {
            setIsSaving(false);
        }
    };

    // Function to handle level completion
    const handleLevelComplete = async (level) => {
        console.log(`[StackQueueMaster] Level ${level} completed!`);
        setShowSuccess(true);
        setLevelObjectiveMet(true);
        
        // Save progress to database
        await saveProgress(level);
        
        // Reset level start time for next level
        setLevelStartTime(Date.now());
        
        // Update game message based on level
        const messages = {
            1: "Great job! You've mastered basic stack operations. Ready for the next challenge?",
            2: "Excellent! You've conquered stack size operations. The tower grows stronger!",
            3: "Fantastic! You've mastered peek and search operations. Your stack skills are sharp!",
            4: "Amazing! You've conquered expression evaluation. Your mathematical mind is impressive!",
            5: "Outstanding! You've mastered queue operations. The ice cream line is under control!",
            6: "Brilliant! You've conquered queue size and empty functions. Queue management expert!",
            7: "Spectacular! You've mastered queue peek and search. Your queue skills are unmatched!",
            8: "Incredible! You've conquered the stack and queue combo challenge. You're a data structure master!",
            9: "Magnificent! You've mastered the magic spell reverser. Your stack and queue magic is powerful!",
            10: "Legendary! You've conquered the palindrome palace. You are the ultimate Stack & Queue Master!"
        };
        
        setGameMessage(messages[level] || "Level completed! You're doing great!");
    };

    // Update level start time when level changes
    useEffect(() => {
        setLevelStartTime(Date.now());
        setLevelObjectiveMet(false);
    }, [currentLevel]);

    // Add customer to queue
    const handleEnqueue = () => {
        if (queue.length < LEVEL_5_TARGET) {
        const newCustomer = {
            id: Date.now(),
            name: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
                flavor: ICE_CREAM_FLAVORS[Math.floor(Math.random() * ICE_CREAM_FLAVORS.length)],
                position: queue.length
            };
            setQueue([...queue, newCustomer]);
            setGameMessage(`Customer ${newCustomer.name} joined the line for ${newCustomer.flavor} ice cream!`);
        } else {
            setGameMessage('The line is full! Serve some customers first.');
        }
    };

    // Remove customer from queue
    const handleDequeue = () => {
        if (queue.length > 0) {
            setIsProcessing(true);
            const servedCustomer = queue[0];
            setGameMessage(`Serving ${servedCustomer.name} their ${servedCustomer.flavor} ice cream!`);
            
            setTimeout(() => {
                setQueue(queue.slice(1));
        setServedCustomers(prev => prev + 1);
                setIsProcessing(false);
                
                if (servedCustomers + 1 === LEVEL_5_TARGET) {
                    setShowSuccess(true);
                    setGameMessage('Level 5 Complete! You mastered queue operations!');
                    saveProgress(5);
                } else {
                    setGameMessage(`Customer served! ${LEVEL_5_TARGET - (servedCustomers + 1)} more to go!`);
                }
            }, 1000);
        } else {
            setGameMessage('The line is empty! Add some customers first.');
        }
    };

    // Check next customer
    const handleFront = () => {
        if (queue.length > 0) {
            const nextCustomer = queue[0];
            setGameMessage(`Next customer: ${nextCustomer.name} wants ${nextCustomer.flavor} ice cream!`);
        } else {
            setGameMessage('The line is empty! Add some customers first.');
        }
    };

    // Level 7 handlers
    const handleEnqueue7 = () => {
        if (queue7.length < LEVEL_7_TARGET) {
            const newCustomer = {
                id: Date.now(),
                name: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
                flavor: ICE_CREAM_FLAVORS[Math.floor(Math.random() * ICE_CREAM_FLAVORS.length)]
            };
            setQueue7([...queue7, newCustomer]);
            setGameMessage(`Customer ${newCustomer.name} joined the queue!`);
            setPeekedCustomer7(null);
            setSearchResult7(null);
        } else {
            setGameMessage('Queue is full! Serve some customers first.');
        }
    };

    const handleDequeue7 = () => {
        if (queue7.length > 0) {
            const [served, ...rest] = queue7;
            setQueue7(rest);
            setServedCustomers7(prev => prev + 1);
            setGameMessage(`Served ${served.name}! ${LEVEL_7_TARGET - (servedCustomers7 + 1)} to go.`);
            setPeekedCustomer7(null);
            setSearchResult7(null);
            if (servedCustomers7 + 1 === LEVEL_7_TARGET) {
                setShowSuccess(true);
                setGameMessage('Level 7 Complete! You mastered queue peek and search!');
                handleLevelComplete(7);
            }
        } else {
            setGameMessage('Queue is empty! No one to serve.');
        }
    };

    const handlePeek7 = () => {
        if (queue7.length > 0) {
            setPeekedCustomer7(queue7[0]);
            setGameMessage(`Front of queue: ${queue7[0].name}`);
        } else {
            setPeekedCustomer7(null);
            setGameMessage('Queue is empty!');
        }
        setSearchResult7(null);
    };

    const handleSearch7 = () => {
        if (!searchName7.trim()) {
            setSearchResult7(null);
            setGameMessage('Enter a name to search.');
            return;
        }
        const index = queue7.findIndex(c => c.name.toLowerCase() === searchName7.trim().toLowerCase());
        if (index !== -1) {
            setSearchResult7(index);
            setGameMessage(`${searchName7} is in the queue at position ${index + 1}.`);
        } else {
            setSearchResult7(-1);
            setGameMessage(`${searchName7} is not in the queue.`);
        }
        setPeekedCustomer7(null);
    };

    // Level 6 handlers
    const handleEnqueue6 = () => {
        if (queue6.length < LEVEL_6_TARGET) {
            const newCustomer = {
                id: Date.now(),
                name: CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)],
                flavor: ICE_CREAM_FLAVORS[Math.floor(Math.random() * ICE_CREAM_FLAVORS.length)]
            };
            setQueue6([...queue6, newCustomer]);
            setGameMessage(`Customer ${newCustomer.name} joined the queue!`);
        } else {
            setGameMessage('Queue is full! Serve some customers first.');
        }
    };

    const handleDequeue6 = () => {
        if (queue6.length > 0) {
            const [served, ...rest] = queue6;
            setQueue6(rest);
            setServedCustomers6(prev => prev + 1);
            setGameMessage(`Served ${served.name}! ${LEVEL_6_TARGET - (servedCustomers6 + 1)} to go.`);
            if (servedCustomers6 + 1 === LEVEL_6_TARGET) {
                setShowSuccess(true);
                setGameMessage('Level 6 Complete! You mastered queue size and empty operations!');
                handleLevelComplete(6);
            }
        } else {
            setGameMessage('Queue is empty! No one to serve.');
        }
    };

    const handleCheckSize6 = () => {
        setShowSize6(true);
        setSizeMessage6(`Current queue size: ${queue6.length}`);
        setTimeout(() => setShowSize6(false), 2000);
    };

    const handleCheckEmpty6 = () => {
        setShowEmpty6(true);
        setEmptyMessage6(queue6.length === 0 ? 'Queue is empty!' : 'Queue is not empty.');
        setTimeout(() => setShowEmpty6(false), 2000);
    };

    // Level 3 handlers
    const handlePush3 = () => {
        if (stack3.length < LEVEL_3_TARGET) {
            const newPlate = {
                id: Date.now(),
                color: LEVEL_3_COLORS[stack3.length % LEVEL_3_COLORS.length],
                label: `Plate ${stack3.length + 1}`
            };
            setStack3([...stack3, newPlate]);
            setGameMessage(`Pushed ${newPlate.label}!`);
            setPeekedPlate3(null);
            setSearchResult3(null);
        } else {
            setGameMessage('Stack is full! Pop some plates first.');
        }
    };

    const handlePop3 = () => {
        if (stack3.length > 0) {
            const popped = stack3[stack3.length - 1];
            setStack3(stack3.slice(0, -1));
            setPlatesRemoved3(prev => prev + 1);
            setGameMessage(`Popped ${popped.label}! ${LEVEL_3_TARGET - (platesRemoved3 + 1)} to go.`);
            setPeekedPlate3(null);
            setSearchResult3(null);
            if (platesRemoved3 + 1 === LEVEL_3_TARGET) {
                setShowSuccess(true);
                setGameMessage('Level 3 Complete! You mastered stack peek and search!');
                handleLevelComplete(3);
            }
        } else {
            setGameMessage('Stack is empty!');
        }
    };

    const handlePeek3 = () => {
        if (stack3.length > 0) {
            setPeekedPlate3(stack3[stack3.length - 1]);
            setGameMessage(`Top of stack: ${stack3[stack3.length - 1].label}`);
        } else {
            setPeekedPlate3(null);
            setGameMessage('Stack is empty!');
        }
        setSearchResult3(null);
    };

    const handleSearch3 = () => {
        if (!searchValue3.trim()) {
            setSearchResult3(null);
            setGameMessage('Enter a plate label to search.');
            return;
        }
        const index = stack3.findIndex(p => p.label.toLowerCase() === searchValue3.trim().toLowerCase());
        if (index !== -1) {
            setSearchResult3(index);
            setGameMessage(`${searchValue3} is in the stack at position ${stack3.length - index} from the top.`);
        } else {
            setSearchResult3(-1);
            setGameMessage(`${searchValue3} is not in the stack.`);
        }
        setPeekedPlate3(null);
    };

    // Level 8 handlers
    const handleChooseStructure8 = (structure) => {
        setChosenStructure8(structure);
        setStructure8([]);
        setUserOutput8([]);
        setInputIndex8(0);
        setLevel8Message('');
        setShowFeedback8(false);
    };

    const handleAdd8 = () => {
        const challenge = LEVEL_8_CHALLENGES[currentChallenge8];
        if (inputIndex8 < challenge.input.length) {
            setStructure8(prev =>
                chosenStructure8 === 'stack'
                    ? [...prev, challenge.input[inputIndex8]]
                    : [...prev, challenge.input[inputIndex8]]
            );
            setInputIndex8(prev => prev + 1);
            setLevel8Message(`${challenge.input[inputIndex8]} added to the ${chosenStructure8}.`);
        }
    };

    const handleRemove8 = () => {
        if (structure8.length === 0) return;
        let removed;
        if (chosenStructure8 === 'stack') {
            removed = structure8[structure8.length - 1];
            setStructure8(prev => prev.slice(0, -1));
        } else {
            removed = structure8[0];
            setStructure8(prev => prev.slice(1));
        }
        setUserOutput8(prev => [...prev, removed]);
        setLevel8Message(`${removed} removed from the ${chosenStructure8}.`);
    };

    const handleCheck8 = () => {
        const challenge = LEVEL_8_CHALLENGES[currentChallenge8];
        let correct = false;
        if (chosenStructure8 === challenge.correct) {
            if (JSON.stringify(userOutput8) === JSON.stringify(challenge.goal)) {
                correct = true;
            }
        }
        setShowFeedback8(true);
        if (correct) {
            setLevel8Message('Correct! You used the right data structure and got the right result.');
            setTimeout(() => {
                if (currentChallenge8 + 1 < LEVEL_8_CHALLENGES.length) {
                    setCurrentChallenge8(prev => prev + 1);
                    setChosenStructure8('stack');
                    setStructure8([]);
                    setUserOutput8([]);
                    setInputIndex8(0);
                    setLevel8Message('');
                    setShowFeedback8(false);
                } else {
                    setShowSuccess(true);
                    setGameMessage('Level 8 Complete! You mastered stack & queue combo challenges!');
                    handleLevelComplete(8);
                }
            }, 2000);
        } else {
            setLevel8Message('Incorrect. Try again or choose the correct data structure.');
        }
    };

    // Add Level 9 handlers
    const handleAddSpell9 = () => {
        if (currentSpellIndex9 < LEVEL_9_TARGET) {
            const newSpell = MAGIC_SPELLS[currentSpellIndex9];
            setSpellStack9(prev => [...prev, newSpell]);
            setCurrentSpellIndex9(prev => prev + 1);
            setGameMessage(`Added spell: ${newSpell}`);
        }
    };

    const handleMoveToTemp9 = () => {
        if (spellStack9.length > 0) {
            const spell = spellStack9[spellStack9.length - 1];
            setSpellStack9(prev => prev.slice(0, -1));
            setTempStack9(prev => [...prev, spell]);
            setGameMessage(`Moved ${spell} to temporary stack`);
        }
    };

    const handleMoveToQueue9 = () => {
        if (tempStack9.length > 0) {
            const spell = tempStack9[tempStack9.length - 1];
            setTempStack9(prev => prev.slice(0, -1));
            setSpellQueue9(prev => [...prev, spell]);
            setSpellsReversed9(prev => prev + 1);
            setShowSpellEffect9(true);
            setCurrentSpellEffect9(spell);
            setGameMessage(`Moved ${spell} to queue`);

            if (spellsReversed9 + 1 === LEVEL_9_TARGET) {
                setTimeout(() => {
                    setShowSuccess(true);
                    setGameMessage('Level 9 Complete! You mastered spell reversal!');
                    saveProgress(9);
                }, 2000);
            }

            setTimeout(() => {
                setShowSpellEffect9(false);
            }, 1000);
        }
    };

    // Render Level 1: The Basic Tower
    const renderLevel1 = () => {
        return (
            <div className="flex flex-col items-center space-y-8">
                {/* Stack Visualization */}
                <div className="relative h-[400px] w-[250px] bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl flex justify-center items-end p-6 shadow-inner border-2 border-gray-200">
                    <AnimatePresence>
                        {stack.map((plate, index) => (
                            <motion.div
                                key={plate.id}
                                initial={{ y: 100, opacity: 0, scale: 0.8 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: 100, opacity: 0, scale: 0.8 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 400, 
                                    damping: 30,
                                    duration: 0.3 
                                }}
                                className="absolute w-[180px] h-[35px] rounded-lg flex justify-center items-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-white"
                                style={{
                                    backgroundColor: plate.color,
                                    bottom: `${index * 40}px`,
                                    zIndex: stack.length - index
                                }}
                            >
                                <span className="text-white font-bold text-lg drop-shadow-md">Plate {index + 1}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {/* Stack base */}
                    <div className="absolute bottom-0 w-[200px] h-[20px] bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg shadow-lg"></div>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-md">
                    <div className="text-center mb-2">
                        <span className="text-lg font-semibold text-green-700">
                            Plates in Stack: {stack.length}/{LEVEL_1_TARGET}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                        <div 
                            className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500 shadow-lg"
                            style={{ width: `${(stack.length / LEVEL_1_TARGET) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="flex gap-4 flex-wrap justify-center">
                    <button 
                        onClick={handlePush}
                        disabled={stack.length >= LEVEL_1_TARGET || gamePhase === 'removing'}
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                    >
                        ➕ Push Plate
                    </button>
                    <button 
                        onClick={handlePop}
                        disabled={stack.length === 0 || gamePhase === 'stacking'}
                        className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                    >
                        ➖ Pop Plate
                    </button>
                    <button 
                        onClick={handlePeek}
                        disabled={stack.length === 0}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                    >
                        👁️ Peek
                    </button>
                </div>

                {/* Game Phase Toggle */}
                <div className="flex gap-4 items-center">
                    <span className="text-lg font-semibold text-gray-700">Game Phase:</span>
                    <div className="flex bg-gray-200 rounded-xl p-1">
                        <button
                            onClick={() => setGamePhase('stacking')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                                gamePhase === 'stacking'
                                    ? 'bg-green-500 text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            Stacking
                        </button>
                        <button
                            onClick={() => setGamePhase('removing')}
                            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                                gamePhase === 'removing'
                                    ? 'bg-red-500 text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            Removing
                        </button>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 max-w-2xl">
                    <h3 className="text-xl font-bold text-blue-800 mb-3">How to Play:</h3>
                    <ul className="text-blue-700 space-y-2">
                        <li>• <strong>Push:</strong> Add a plate to the top of the stack</li>
                        <li>• <strong>Pop:</strong> Remove the top plate from the stack</li>
                        <li>• <strong>Peek:</strong> View the top plate without removing it</li>
                        <li>• Build a tower with {LEVEL_1_TARGET} plates to complete the level!</li>
                    </ul>
                </div>
            </div>
        );
    };

    // Render Level 2: Stack Size Challenge
    const renderLevel2 = () => {
        return (
            <div className="flex flex-col items-center p-8">
                <div className="w-full max-w-2xl flex flex-col items-center gap-8">
                    <div className="flex flex-col items-center gap-4 mb-4">
                        <div className="text-xl font-bold text-purple-600">
                            Target Size: {targetSize}
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={checkSize}
                                className="px-6 py-3 bg-purple-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-purple-600"
                            >
                                Check Size
                            </button>
                            <button 
                                onClick={checkEmpty}
                                className="px-6 py-3 bg-purple-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-purple-600"
                            >
                                Is Empty?
                            </button>
                        </div>
                    </div>
                    <div className="relative h-[300px] w-[200px] bg-gray-100 rounded-lg flex justify-center items-end p-4 shadow-inner">
                        <AnimatePresence>
                            {stack.map((plate, index) => (
                                <motion.div
                                    key={plate.id}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 50, opacity: 0 }}
                                    transition={{ 
                                        type: "spring", 
                                        stiffness: 400, 
                                        damping: 30,
                                        duration: 0.2 
                                    }}
                                    className="absolute w-[120px] h-[25px] rounded flex justify-center items-center shadow-md transition-all duration-150 hover:scale-105 hover:shadow-lg"
                                    style={{
                                        backgroundColor: plate.color,
                                        bottom: `${index * 30}px`,
                                        zIndex: stack.length - index
                                    }}
                                >
                                    <span className="text-white font-bold drop-shadow-md">Plate {index + 1}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    <div className="flex gap-4 flex-wrap justify-center">
                        <button 
                            onClick={handlePush}
                            disabled={stack.length >= LEVEL_2_TARGET}
                            className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Push Plate
                        </button>
                        <button 
                            onClick={handlePop}
                            disabled={stack.length === 0}
                            className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Pop Plate
                        </button>
                        <button 
                            onClick={handlePeek}
                            disabled={stack.length === 0}
                            className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Peek
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Render Level 3: Stack Peek & Search
    const renderLevel3 = () => (
        <div className="flex flex-col items-center p-8">
            <div className="w-full max-w-4xl flex flex-col items-center gap-8">
                {/* Instructions Panel */}
                <div className="bg-blue-50 p-4 rounded-lg w-full mb-4">
                    <h3 className="text-lg font-bold text-blue-800 mb-2">Level 3: Stack Peek & Search</h3>
                    <ol className="list-decimal list-inside text-blue-700 space-y-2">
                        <li>Use <span className="font-mono font-bold">peek()</span> to see the top plate without removing it.</li>
                        <li>Use the search box to find a plate by label in the stack.</li>
                        <li>Push to add, Pop to remove plates.</li>
                        <li>Remove {LEVEL_3_TARGET} plates to complete the level.</li>
                    </ol>
                </div>
                {/* Stack Visualization */}
                <div className="relative w-[200px] h-[400px] bg-gray-100 rounded-lg p-4 flex items-center">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-600">
                        Top
                    </div>
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-600">
                        Bottom 
                    </div>
                    <div className="w-full h-full flex flex-col-reverse items-center justify-start gap-4 overflow-y-auto p-4">
                        {stack3.map((plate, index) => (
                            <motion.div
                                key={plate.id}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 400, 
                                    damping: 30,
                                    duration: 0.2 
                                }}
                                className={`w-[120px] h-[40px] rounded-lg shadow-md flex items-center justify-center font-bold text-white text-lg ${plate.color}
                                    ${index === stack3.length - 1 && peekedPlate3 ? 'border-4 border-blue-500' : ''}
                                    ${searchResult3 === index ? 'border-4 border-yellow-500' : ''}`}
                            >
                                {plate.label}
                            </motion.div>
                        ))}
                    </div>
                </div>
                {/* Controls */}
                <div className="flex gap-4 flex-wrap">
                    <button 
                        onClick={handlePush3}
                        disabled={stack3.length >= LEVEL_3_TARGET}
                        className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Push Plate
                    </button>
                    <button 
                        onClick={handlePop3}
                        disabled={stack3.length === 0}
                        className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Pop Plate
                    </button>
                    <button 
                        onClick={handlePeek3}
                        disabled={stack3.length === 0}
                        className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Peek
                    </button>
                    
                </div>
                {/* Progress */}
                <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                        Plates Removed: {platesRemoved3}/{LEVEL_3_TARGET}
                    </div>
                    <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mt-2">
                        <div 
                            className="bg-purple-500 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${(platesRemoved3 / LEVEL_3_TARGET) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    // Level 4: Expression Evaluator
    const renderLevel4 = () => {
        const currentExpression = POSTFIX_EXPRESSIONS[currentExpressionIndex];
        
        return (
            <div className="flex flex-col items-center p-8">
                <div className="w-full max-w-2xl flex flex-col items-center gap-8">
                    {/* Instructions Panel */}
                    <div className="bg-blue-50 p-4 rounded-lg w-full mb-4">
                        <h3 className="text-lg font-bold text-blue-800 mb-2">How to Solve Postfix Expressions:</h3>
                        <ol className="list-decimal list-inside text-blue-700 space-y-2">
                            <li>Read the expression from left to right</li>
                            <li>When you see a number, push it onto the stack</li>
                            <li>When you see an operator (+, -, *, /):
                                <ul className="list-disc list-inside ml-4">
                                    <li>Pop two numbers from the stack</li>
                                    <li>Apply the operator</li>
                                    <li>Push the result back onto the stack</li>
                                </ul>
                            </li>
                            <li>The final number in the stack is your answer</li>
                        </ol>
                    </div>

                    <div className="flex flex-col items-center gap-4 mb-4">
                        <div className="text-2xl font-bold text-purple-600 mb-2">
                            Expression {currentExpressionIndex + 1}/{LEVEL_4_TARGET}
                        </div>
                        <div className="text-3xl font-mono tracking-wider bg-gray-100 p-4 rounded-lg">
                            {currentExpression.expression}
                        </div>
                        <div className="text-xl font-bold text-purple-600">
                            Expected Result: {currentExpression.expectedResult}
                        </div>
                    </div>

                    {/* Hint Panel */}
                    <div className="bg-yellow-50 p-4 rounded-lg w-full">
                        <h4 className="font-bold text-yellow-800 mb-2">Hint:</h4>
                        <p className="text-yellow-700">{currentExpression.hint}</p>
                    </div>

                    {/* Step-by-Step Guide */}
                    <div className="bg-green-50 p-4 rounded-lg w-full">
                        <h4 className="font-bold text-green-800 mb-2">Step-by-Step Solution:</h4>
                        <ol className="list-decimal list-inside text-green-700 space-y-1">
                            {currentExpression.steps.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={evaluateExpression}
                            disabled={isEvaluating}
                            className="px-6 py-3 bg-purple-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isEvaluating ? 'Evaluating...' : 'Evaluate'}
                        </button>
                        <button 
                            onClick={() => {
                                setNumberStack([]);
                                setGameMessage('Try again! Evaluate the postfix expression.');
                            }}
                            disabled={isEvaluating}
                            className="px-6 py-3 bg-gray-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Stack Visualization */}
                    <div className="relative h-[300px] w-[200px] bg-gray-100 rounded-lg flex justify-center items-end p-4 shadow-inner">
                        <AnimatePresence>
                            {numberStack.map((num, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 50, opacity: 0 }}
                                    transition={{ 
                                        type: "spring", 
                                        stiffness: 400, 
                                        damping: 30,
                                        duration: 0.2 
                                    }}
                                    className="absolute w-[120px] h-[25px] rounded flex justify-center items-center shadow-md transition-all duration-150 hover:scale-105 hover:shadow-lg bg-green-500"
                                    style={{
                                        bottom: `${index * 30}px`,
                                        zIndex: numberStack.length - index
                                    }}
                                >
                                    <span className="text-white font-bold text-xl">{num}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Current Stack Display */}
                    <div className="mt-4 text-center">
                        <h3 className="text-lg font-bold mb-2">Current Stack:</h3>
                        <div className="text-xl font-mono bg-gray-100 p-2 rounded">
                            {numberStack.join(' ') || '(empty)'}
                        </div>
                    </div>
                </div>

                {/* Example Panel */}
                <div className="bg-purple-50 p-4 rounded-lg w-full mt-4">
                    <h4 className="font-bold text-purple-800 mb-2">Example:</h4>
                    <p className="text-purple-700">
                        For expression "3 4 +":<br/>
                        1. Push 3 → Stack: [3]<br/>
                        2. Push 4 → Stack: [3, 4]<br/>
                        3. Add: 3 + 4 = 7 → Stack: [7]
                    </p>
                </div>
            </div>
        );
    };

    // Render Level 5: Ice Cream Line
    const renderLevel5 = () => {
        return (
            <div className="flex flex-col items-center space-y-8">
                {/* Instructions Panel */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 w-full max-w-4xl">
                    <h3 className="text-2xl font-bold text-blue-800 mb-4">🍦 Ice Cream Shop Management</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-blue-700">
                        <div>
                            <h4 className="font-semibold mb-2">Queue Operations:</h4>
                            <ul className="space-y-1 text-sm">
                                <li>• <strong>Enqueue:</strong> Add customer to the back of the line</li>
                                <li>• <strong>Dequeue:</strong> Serve customer from the front of the line</li>
                                <li>• <strong>Front:</strong> Check who's next in line</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Objective:</h4>
                            <p className="text-sm">Serve {LEVEL_5_TARGET} customers to complete the level!</p>
                        </div>
                    </div>
                </div>

                {/* Queue Visualization */}
                <div className="relative w-[300px] h-[500px] bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-6 shadow-inner border-2 border-gray-200">
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                        🎯 Front of Line
                    </div>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                        📝 Rear of Line
                    </div>
                    
                    <div className="w-full h-full flex flex-col items-center justify-start gap-4 overflow-y-auto p-4">
                        {queue.map((customer, index) => (
                            <motion.div
                                key={customer.id}
                                initial={{ x: -100, opacity: 0, scale: 0.8 }}
                                animate={{ x: 0, opacity: 1, scale: 1 }}
                                exit={{ x: 100, opacity: 0, scale: 0.8 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 400, 
                                    damping: 30,
                                    duration: 0.3 
                                }}
                                className={`w-[220px] h-[100px] bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-4 flex flex-col items-center justify-center border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                                    index === 0 ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100' : 'border-gray-200'
                                }`}
                            >
                                <div className="text-lg font-bold text-purple-600 mb-1">{customer.name}</div>
                                <div className="text-sm text-gray-600 mb-1">🍦 {customer.flavor}</div>
                                <div className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">#{index + 1}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-md">
                    <div className="text-center mb-2">
                        <span className="text-xl font-semibold text-purple-700">
                            Customers Served: {servedCustomers}/{LEVEL_5_TARGET}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-5 shadow-inner">
                        <div 
                            className="bg-gradient-to-r from-purple-400 to-purple-600 h-5 rounded-full transition-all duration-500 shadow-lg"
                            style={{ width: `${(servedCustomers / LEVEL_5_TARGET) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Control Buttons */}
                <div className="flex gap-4 flex-wrap justify-center">
                    <button 
                        onClick={handleEnqueue}
                        disabled={isProcessing || queue.length >= LEVEL_5_TARGET}
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                    >
                        ➕ Enqueue Customer
                    </button>
                    <button 
                        onClick={handleDequeue}
                        disabled={isProcessing || queue.length === 0}
                        className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                    >
                        ➖ Dequeue Customer
                    </button>
                    <button 
                        onClick={handleFront}
                        disabled={isProcessing || queue.length === 0}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
                    >
                        👁️ Check Front
                    </button>
                </div>

                {/* Queue Status */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                    <div className="text-center">
                        <span className="text-lg font-semibold text-purple-700">
                            Customers in Line: {queue.length}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // Render Level 7: Queue Size & Empty Functions
    const renderLevel7 = () => (
        <div className="flex flex-col items-center p-8">
            <div className="w-full max-w-4xl flex flex-col items-center gap-8">
                {/* Instructions Panel */}
                <div className="bg-blue-50 p-4 rounded-lg w-full mb-4">
                    <h3 className="text-lg font-bold text-blue-800 mb-2">Level 7: Queue Peek & Search</h3>
                    <ol className="list-decimal list-inside text-blue-700 space-y-2">
                        <li>Use <span className="font-mono font-bold">peek()</span> to see the front customer without removing them.</li>
                        <li>Use the search box to find a customer by name in the queue.</li>
                        <li>Enqueue to add, Dequeue to serve customers.</li>
                        <li>Serve {LEVEL_7_TARGET} customers to complete the level.</li>
                    </ol>
                </div>
                {/* Queue Visualization */}
                <div className="relative w-[200px] h-[400px] bg-gray-100 rounded-lg p-4 flex items-center">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-600">
                        Front of Line
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-600">
                        Rear of Line
                    </div>
                    <div className="w-full h-full flex flex-col items-center justify-start gap-4 overflow-y-auto p-4">
                        {queue7.map((customer, index) => (
                            <motion.div
                                key={customer.id}
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 400, 
                                    damping: 30,
                                    duration: 0.2 
                                }}
                                className={`w-[160px] h-[80px] bg-white rounded-lg shadow-md p-2 flex flex-col items-center justify-center
                                    ${index === 0 && peekedCustomer7 ? 'border-4 border-blue-500' : ''}
                                    ${searchResult7 === index ? 'border-4 border-yellow-500' : ''}`}
                            >
                                <div className="text-sm font-bold text-purple-600">{customer.name}</div>
                                <div className="text-xs text-gray-600">{customer.flavor}</div>
                                <div className="text-xs text-gray-500">#{index + 1}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                {/* Controls */}
                <div className="flex gap-4 flex-wrap">
                    <button 
                        onClick={handleEnqueue7}
                        disabled={queue7.length >= LEVEL_7_TARGET}
                        className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Enqueue Customer
                    </button>
                    <button 
                        onClick={handleDequeue7}
                        disabled={queue7.length === 0}
                        className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Dequeue Customer
                    </button>
                    <button 
                        onClick={handlePeek7}
                        disabled={queue7.length === 0}
                        className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Peek
                    </button>
                </div>
                {/* Progress */}
                <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                        Customers Served: {servedCustomers7}/{LEVEL_7_TARGET}
                    </div>
                    <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mt-2">
                        <div 
                            className="bg-purple-500 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${(servedCustomers7 / LEVEL_7_TARGET) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    // Render Level 6: Queue Size & Empty Functions
    const renderLevel6 = () => (
        <div className="flex flex-col items-center p-8">
            <div className="w-full max-w-4xl flex flex-col items-center gap-8">
                {/* Instructions Panel */}
                <div className="bg-blue-50 p-4 rounded-lg w-full mb-4">
                    <h3 className="text-lg font-bold text-blue-800 mb-2">Queue Size & Empty Operations:</h3>
                    <ol className="list-decimal list-inside text-blue-700 space-y-2">
                        <li>Use <span className="font-mono font-bold">size()</span> to get the number of customers in the queue.</li>
                        <li>Use <span className="font-mono font-bold">empty()</span> to check if the queue is empty.</li>
                        <li>Enqueue to add, Dequeue to serve customers.</li>
                        <li>Serve {LEVEL_6_TARGET} customers to complete the level.</li>
                    </ol>
                </div>
                {/* Queue Visualization */}
                <div className="relative w-[200px] h-[400px] bg-gray-100 rounded-lg p-4 flex items-center">
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-600">
                        Front of Line
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-600">
                        Rear of Line
                    </div>
                    <div className="w-full h-full flex flex-col items-center justify-start gap-4 overflow-y-auto p-4">
                        {queue6.map((customer, index) => (
                            <motion.div
                                key={customer.id}
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 400, 
                                    damping: 30,
                                    duration: 0.2 
                                }}
                                className={`w-[160px] h-[80px] bg-white rounded-lg shadow-md p-2 flex flex-col items-center justify-center ${index === 0 ? 'border-2 border-green-500' : ''}`}
                            >
                                <div className="text-sm font-bold text-purple-600">{customer.name}</div>
                                <div className="text-xs text-gray-600">{customer.flavor}</div>
                                <div className="text-xs text-gray-500">#{index + 1}</div>
                            </motion.div>
                        ))}
                    </div>
                    {/* Size and Empty indicators */}
                    {showSize6 && (
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-200 text-blue-800 px-6 py-3 rounded-lg shadow-lg text-xl font-bold z-10">
                            {sizeMessage6}
                        </div>
                    )}
                    {showEmpty6 && (
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-200 text-yellow-800 px-6 py-3 rounded-lg shadow-lg text-xl font-bold z-10">
                            {emptyMessage6}
                        </div>
                    )}
                </div>
                {/* Controls */}
                <div className="flex gap-4">
                    <button 
                        onClick={handleEnqueue6}
                        disabled={queue6.length >= LEVEL_6_TARGET}
                        className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Enqueue Customer
                    </button>
                    <button 
                        onClick={handleDequeue6}
                        disabled={queue6.length === 0}
                        className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Dequeue Customer
                    </button>
                    <button 
                        onClick={handleCheckSize6}
                        className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-blue-600"
                    >
                        Check Size
                    </button>
                    <button 
                        onClick={handleCheckEmpty6}
                        className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg transition-all duration-150 hover:bg-yellow-600"
                    >
                        Check Empty
                    </button>
                </div>
                {/* Progress */}
                <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                        Customers Served: {servedCustomers6}/{LEVEL_6_TARGET}
                    </div>
                    <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mt-2">
                        <div 
                            className="bg-purple-500 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${(servedCustomers6 / LEVEL_6_TARGET) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    // Render Level 8: Stack & Queue Combo Challenge
    const renderLevel8 = () => {
        const challenge = LEVEL_8_CHALLENGES[currentChallenge8];
        return (
            <div className="flex flex-col items-center p-8">
                <div className="w-full max-w-4xl flex flex-col items-center gap-8">
                    {/* Instructions Panel */}
                    <div className="bg-blue-50 p-4 rounded-lg w-full mb-4">
                        <h3 className="text-lg font-bold text-blue-800 mb-2">Level 8: Stack & Queue Combo Challenge</h3>
                        <ol className="list-decimal list-inside text-blue-700 space-y-2">
                            <li>Read the scenario and choose Stack or Queue.</li>
                            <li>Perform the operations to solve the task.</li>
                            <li>Click Check to see if you solved it correctly.</li>
                            <li>Complete all challenges to finish the level.</li>
                        </ol>
                    </div>
                    {/* Scenario */}
                    <div className="bg-blue-50 rounded-lg shadow-md p-6 w-full max-w-lg text-center">
                        <div className="text-xl text-pink-600 font-bold mb-2">{challenge.scenario}</div>
                        <div className="text-gray-700 mb-2">{challenge.description}</div>
                    </div>
                    {/* Structure Choice */}
                    <div className="flex gap-4 mb-4">
                        <button
                            onClick={() => handleChooseStructure8('stack')}
                            className={`px-6 py-3 rounded-lg font-bold transition-colors ${chosenStructure8 === 'stack' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                            Stack
                        </button>
                        <button
                            onClick={() => handleChooseStructure8('queue')}
                            className={`px-6 py-3 rounded-lg font-bold transition-colors ${chosenStructure8 === 'queue' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                            Queue
                        </button>
                    </div>
                    {/* Visualization */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-4">
                            <button
                                onClick={handleAdd8}
                                disabled={inputIndex8 >= challenge.input.length}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold disabled:opacity-50"
                            >
                                Add
                            </button>
                            <button
                                onClick={handleRemove8}
                                disabled={structure8.length === 0}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold disabled:opacity-50"
                            >
                                Remove
                            </button>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="font-bold text-purple-600">{chosenStructure8 === 'stack' ? 'Stack' : 'Queue'} Visualization:</div>
                            <div className={`flex ${chosenStructure8 === 'stack' ? 'flex-col-reverse' : 'flex-col'} items-center gap-2`}>
                                {structure8.map((item, idx) => (
                                    <div key={idx} className="w-16 h-16 bg-yellow-200 text-yellow-800 border-2 border-yellow-500 rounded-lg flex text-yello-800 items-center justify-center text-xl font-bold">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="font-bold mt-4 text-purple-600">Your Output:</div>
                        <div className="flex gap-2">
                            {userOutput8.map((item, idx) => (
                                <div key={idx} className="w-12 h-12 bg-green-200 border-2 border-green-500 rounded-lg flex items-center justify-center text-lg font-bold">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Check Button and Feedback */}
                    <div className="flex flex-col items-center gap-2 mt-4">
                        <button
                            onClick={handleCheck8}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold"
                        >
                            Check
                        </button>
                        {showFeedback8 && (
                            <div className="mt-2 text-lg font-bold text-purple-700">{level8Message}</div>
                        )}
                    </div>
                    {/* Progress */}
                    <div className="text-center mt-4">
                        <div className="text-lg font-bold text-purple-600">
                            Challenge: {currentChallenge8 + 1}/{LEVEL_8_CHALLENGES.length}
                        </div>
                        <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mt-2">
                            <div
                                className="bg-purple-500 h-4 rounded-full transition-all duration-300"
                                style={{ width: `${((currentChallenge8 + (showSuccess ? 1 : 0)) / LEVEL_8_CHALLENGES.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Replace Level 9 render function
    const renderLevel9 = () => (
        <div className="flex flex-col items-center p-8">
            <div className="w-full max-w-4xl flex flex-col items-center gap-8">
                {/* Instructions Panel */}
                <div className="bg-blue-50 p-4 rounded-lg w-full mb-4">
                    <h3 className="text-lg font-bold text-blue-800 mb-2">Level 9: The Magic Spell Reverser</h3>
                    <ol className="list-decimal list-inside text-blue-700 space-y-2">
                        <li>Add spells to the initial stack</li>
                        <li>Move spells to the temporary stack</li>
                        <li>Move spells from temporary stack to queue</li>
                        <li>Reverse {LEVEL_9_TARGET} spells to complete the level</li>
                    </ol>
                </div>

                {/* Spells Visualization */}
                <div className="flex gap-8 justify-center w-full">
                    {/* Initial Stack */}
                    <div className="flex flex-col items-center">
                        <h4 className="font-bold mb-2">Initial Stack</h4>
                        <div className="bg-gray-100 p-4 rounded-lg min-h-[300px] w-[200px] flex flex-col-reverse items-center gap-2">
                            {spellStack9.map((spell, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -50, opacity: 0 }}
                                    className="bg-purple-400 p-2 rounded-lg text-center w-full"
                                >
                                    {spell}
                                </motion.div>
                            ))}
                        </div>
                        <button
                            onClick={handleAddSpell9}
                            disabled={currentSpellIndex9 >= LEVEL_9_TARGET}
                            className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                        >
                            Add Spell
                        </button>
                    </div>

                    {/* Temporary Stack */}
                    <div className="flex flex-col items-center">
                        <h4 className="font-bold mb-2">Temporary Stack</h4>
                        <div className="bg-gray-100 p-4 rounded-lg min-h-[300px] w-[200px] flex flex-col-reverse items-center gap-2">
                            {tempStack9.map((spell, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -50, opacity: 0 }}
                                    className="bg-blue-400 p-2 rounded-lg text-center w-full"
                                >
                                    {spell}
                                </motion.div>
                            ))}
                        </div>
                        <button
                            onClick={handleMoveToTemp9}
                            disabled={spellStack9.length === 0}
                            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                        >
                            Move to Temp
                        </button>
                    </div>

                    {/* Final Queue */}
                    <div className="flex flex-col items-center">
                        <h4 className="font-bold mb-2">Final Queue</h4>
                        <div className="bg-gray-100 p-4 rounded-lg min-h-[300px] w-[200px] flex flex-col items-center gap-2">
                            {spellQueue9.map((spell, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -50, opacity: 0 }}
                                    className="bg-green-400 p-2 rounded-lg text-center w-full"
                                >
                                    {spell}
                                </motion.div>
                            ))}
                        </div>
                        <button
                            onClick={handleMoveToQueue9}
                            disabled={tempStack9.length === 0}
                            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                            Move to Queue
                        </button>
                    </div>
                </div>

                {/* Spell Effect Animation */}
                {showSpellEffect9 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-200 p-8 rounded-lg shadow-lg z-50"
                    >
                        <h3 className="text-2xl font-bold text-purple-600">{currentSpellEffect9}!</h3>
                    </motion.div>
                )}

                {/* Progress */}
                <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                        Spells Reversed: {spellsReversed9}/{LEVEL_9_TARGET}
                    </div>
                    <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mt-2">
                        <div 
                            className="bg-purple-500 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${(spellsReversed9 / LEVEL_9_TARGET) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    // Update the function to render the already completed message
    const renderLevelAlreadyCompleted = () => (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Level {currentLevel} Already Completed!</h2>
            <p className="mb-6">You have already completed this level. You can move to the next level or replay this level.</p>
            <div className="flex gap-4">
                {currentLevel < 9 && (
                    <button
                        onClick={() => setCurrentLevel(currentLevel + 1)}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Next Level ({currentLevel + 1}) →
                    </button>
                )}
                <button
                    onClick={() => { setShowReplay(false); setCurrentLevel(1); }}
                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                    Go to Level 1
                </button>
                <button
                    onClick={() => setShowReplay(true)}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    Replay Level
                </button>
            </div>
        </div>
    );

    // Add Level 10 constants after other level constants
    const LEVEL_10_TARGET = 5;
    const PALINDROME_WORDS = [
        // Palindrome words
        'RACECAR',
        'HELLO',
        'MADAM',
        'WORLD',
        'DEED',
        'PYTHON',
        'LEVEL',
        'JAVASCRIPT',
        'RADAR',
        'COMPUTER',
        'CIVIC',
        'ALGORITHM',
        'ROTOR',
        'KAYAK',
        'STRUCTURE',
        'REFER',
        'TENET',
        'PROGRAM',
        'DATA',
        'CODING'
    ];

    // Add Level 10 state after other state declarations
    const [palindromeStack10, setPalindromeStack10] = useState([]);
    const [palindromeQueue10, setPalindromeQueue10] = useState([]);
    const [currentWordIndex10, setCurrentWordIndex10] = useState(0);
    const [currentLetterIndex10, setCurrentLetterIndex10] = useState(0);
    const [palindromesFound10, setPalindromesFound10] = useState(0);
    const [showLetterEffect10, setShowLetterEffect10] = useState(false);
    const [currentLetter10, setCurrentLetter10] = useState('');
    const [isChecking10, setIsChecking10] = useState(false);
    const [checkResult10, setCheckResult10] = useState(null);

    // Add Level 10 initialization in useEffect
    useEffect(() => {
        if (currentLevel === 10) {
            setPalindromeStack10([]);
            setPalindromeQueue10([]);
            setCurrentWordIndex10(0);
            setCurrentLetterIndex10(0);
            setPalindromesFound10(0);
            setShowLetterEffect10(false);
            setCurrentLetter10('');
            setIsChecking10(false);
            setCheckResult10(null);
            setGameMessage('Level 10: The Palindrome Palace! Check if words are palindromes using Stack and Queue.');
        }
    }, [currentLevel]);

    // Add Level 10 handlers
    const handleAddLetter10 = () => {
        if (currentWordIndex10 < PALINDROME_WORDS.length && currentLetterIndex10 < PALINDROME_WORDS[currentWordIndex10].length) {
            const letter = PALINDROME_WORDS[currentWordIndex10][currentLetterIndex10];
            setPalindromeStack10(prev => [...prev, letter]);
            setPalindromeQueue10(prev => [...prev, letter]);
            setCurrentLetterIndex10(prev => prev + 1);
            setShowLetterEffect10(true);
            setCurrentLetter10(letter);
            setGameMessage(`Added letter: ${letter}`);

            setTimeout(() => {
                setShowLetterEffect10(false);
            }, 1000);
        }
    };

    const handleCheckPalindrome10 = () => {
        if (palindromeStack10.length === 0) return;

        setIsChecking10(true);
        let isPalindrome = true;
        let i = 0;

        const checkNextLetter = () => {
            if (i < palindromeStack10.length) {
                const stackLetter = palindromeStack10[i];
                const queueLetter = palindromeQueue10[i];
                
                // Compare letters from both ends
                if (stackLetter !== palindromeQueue10[palindromeQueue10.length - 1 - i]) {
                    isPalindrome = false;
                }
                
                i++;
                setTimeout(checkNextLetter, 500);
            } else {
                setIsChecking10(false);
                setCheckResult10(isPalindrome);
                
                if (isPalindrome) {
                    setPalindromesFound10(prev => prev + 1);
                    setGameMessage('Palindrome found! 🎉');
                    
                    if (palindromesFound10 + 1 === LEVEL_10_TARGET) {
                        setTimeout(() => {
                            setShowSuccess(true);
                            setGameMessage('Level 10 Complete! You mastered palindrome checking!');
                            saveProgress(10);
                        }, 2000);
                    }
                } else {
                    setGameMessage('Not a palindrome. Try again!');
                }
                
                // Reset for next word
                setTimeout(() => {
                    setPalindromeStack10([]);
                    setPalindromeQueue10([]);
                    setCurrentWordIndex10(prev => prev + 1);
                    setCurrentLetterIndex10(0);
                    setCheckResult10(null);
                }, 2000);
            }
        };

        checkNextLetter();
    };

    // Add Level 10 render function
    const renderLevel10 = () => (
        <div className="flex flex-col items-center p-8">
            <div className="w-full max-w-4xl flex flex-col items-center gap-8">
                {/* Instructions Panel */}
                <div className="bg-purple-50 p-4 rounded-lg w-full mb-4">
                    <h3 className="text-lg font-bold text-purple-800 mb-2">Level 10: The Palindrome Palace</h3>
                    <ol className="list-decimal list-inside text-purple-700 space-y-2">
                        <li>Add letters to both Stack and Queue</li>
                        <li>Stack will show letters in reverse order</li>
                        <li>Queue will show letters in original order</li>
                        <li>Check if the word is a palindrome</li>
                        <li>Find {LEVEL_10_TARGET} palindromes to complete the level</li>
                    </ol>
                </div>

                {/* Current Word Display */}
                <div className="text-center">
                    <h4 className="text-xl font-bold text-purple-600 mb-2">Current Word:</h4>
                    <div className="text-2xl font-mono bg-purple-100 p-4 rounded-lg">
                        {PALINDROME_WORDS[currentWordIndex10]}
                    </div>
                </div>

                {/* Structures Visualization */}
                <div className="flex gap-8 justify-center w-full">
                    {/* Stack */}
                    <div className="flex flex-col items-center">
                        <h4 className="font-bold mb-2">Stack (Reverse Order)</h4>
                        <div className="bg-gray-100 p-4 rounded-lg min-h-[300px] w-[200px] flex flex-col-reverse items-center gap-2">
                            {palindromeStack10.map((letter, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -50, opacity: 0 }}
                                    className={`p-2 rounded-lg text-center w-full ${
                                        isChecking10 && index < palindromeStack10.length - currentLetterIndex10
                                            ? checkResult10 === null
                                                ? 'bg-yellow-200'
                                                : checkResult10
                                                    ? 'bg-green-200'
                                                    : 'bg-red-200'
                                            : 'bg-purple-200'
                                    }`}
                                >
                                    {letter}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Queue */}
                    <div className="flex flex-col items-center">
                        <h4 className="font-bold mb-2">Queue (Original Order)</h4>
                        <div className="bg-gray-100 p-4 rounded-lg min-h-[300px] w-[200px] flex flex-col items-center gap-2">
                            {palindromeQueue10.map((letter, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -50, opacity: 0 }}
                                    className={`p-2 rounded-lg text-center w-full ${
                                        isChecking10 && index < currentLetterIndex10
                                            ? checkResult10 === null
                                                ? 'bg-yellow-200'
                                                : checkResult10
                                                    ? 'bg-green-200'
                                                    : 'bg-red-200'
                                            : 'bg-blue-200'
                                    }`}
                                >
                                    {letter}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                    <button
                        onClick={handleAddLetter10}
                        disabled={currentLetterIndex10 >= PALINDROME_WORDS[currentWordIndex10].length || isChecking10}
                        className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                    >
                        Add Letter
                    </button>
                    <button
                        onClick={handleCheckPalindrome10}
                        disabled={palindromeStack10.length === 0 || isChecking10}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        Check Palindrome
                    </button>
                </div>

                {/* Letter Effect Animation */}
                {showLetterEffect10 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-200 p-8 rounded-lg shadow-lg z-50"
                    >
                        <h3 className="text-2xl font-bold text-purple-600">{currentLetter10}</h3>
                    </motion.div>
                )}

                {/* Progress */}
                <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                        Palindromes Found: {palindromesFound10}/{LEVEL_10_TARGET}
                    </div>
                    <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mt-2">
                        <div 
                            className="bg-purple-500 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${(palindromesFound10 / LEVEL_10_TARGET) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    // Update the main render function to include Level 10
    return (
        <div className="relative min-h-screen">
            <div className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 flex flex-col items-center justify-center py-10">
                <GameDecorations />
                {/* Card-like main container */}
                <div className="w-full max-w-6xl mx-auto bg-gradient-to-br from-white via-green-50 to-emerald-100 rounded-3xl shadow-2xl p-8 border-2 border-green-500 relative z-10 flex flex-col items-center">
                        {/* Navigation Buttons */}
                    <div className="mt-8 mb-6 flex justify-between items-center w-full max-w-4xl">
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

                    {/* Game Title */}
                    <h1 className="text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-green-600 via-emerald-700 to-green-800 bg-clip-text text-transparent drop-shadow-lg tracking-tight relative z-10 font-serif">
                        Stack & Queue Master
                    </h1>

                    {/* Level Title */}
                    <h2 className="text-3xl font-bold text-center mb-4 text-blue-600">
                        {currentLevel === 1 ? "Level 1: The Basic Tower" :
                         currentLevel === 2 ? "Level 2: Stack Size Challenge" :
                         currentLevel === 3 ? "Level 3: Stack Peek & Search" :
                         currentLevel === 4 ? "Level 4: Expression Evaluator" :
                         currentLevel === 5 ? "Level 5: The Ice Cream Line" :
                         currentLevel === 6 ? "Level 6: Queue Size & Empty Functions" :
                         currentLevel === 7 ? "Level 7: Queue Peek & Search" :
                         currentLevel === 8 ? "Level 8: Stack & Queue Combo Challenge" :
                         currentLevel === 9 ? "Level 9: The Magic Spell Reverser" :
                         currentLevel === 10 ? "Level 10: The Palindrome Palace" :
                         ""}
                    </h2>

                    {/* Game Message */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl shadow-lg border border-green-200 w-full max-w-4xl">
                        <p className="text-xl text-center text-pink-400 font-semibold">{gameMessage}</p>
                    </div>

                    {/* Level Content */}
                    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6 border border-green-200">
                        {currentLevel === 1 && renderLevel1()}
                        {currentLevel === 2 && renderLevel2()}
                        {currentLevel === 3 && renderLevel3()}
                        {currentLevel === 4 && renderLevel4()}
                        {currentLevel === 5 && renderLevel5()}
                        {currentLevel === 6 && renderLevel6()}
                        {currentLevel === 7 && renderLevel7()}
                        {currentLevel === 8 && renderLevel8()}
                        {currentLevel === 9 && renderLevel9()}
                        {currentLevel === 10 && renderLevel10()}
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
                                    {currentLevel === 1 ? "You've mastered the basic stack operations!" : 
                                        currentLevel === 2 ? "You've mastered stack size operations!" :
                                        currentLevel === 3 ? "You've mastered stack peek and search!" :
                                        currentLevel === 4 ? "You've mastered expression evaluation!" :
                                        "You've mastered queue operations!"}
                                </p>
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
                                            onClick={() => {
                                                setShowSuccess(false);
                                                setQueue([]);
                                                setServedCustomers(0);
                                                setGameMessage('Welcome to Level 6! Manage the ice cream shop line!');
                                            }}
                                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
                                        >
                                            Play Again
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StackQueueMaster;  