import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate , link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GameDecorations from './GameDecorations';
// import { Link } from 'react-router-dom';

import useApi from '../../hooks/useApi';
import axios from 'axios';
// import { saveGameProgress, fetchGameProgress } from '../../utils/gameProgress';
// import { ConstantAlphaFactor } from 'three/src/constants.js';


// Node class for linked list implementation
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

// DoubleNode class for doubly linked list implementation
class DoubleNode {
    constructor(data) {
        this.data = data;
        this.next = null;
        this.previous = null;
    }
}

const TREASURE_TYPES = {
    GOLD: { type: 'Gold', color: 'bg-yellow-500', value: 100 },
    SILVER: { type: 'Silver', color: 'bg-gray-400', value: 75 },
    BRONZE: { type: 'Bronze', color: 'bg-orange-600', value: 50 },
    COPPER: { type: 'Copper', color: 'bg-orange-400', value: 25 },
    IRON: { type: 'Iron', color: 'bg-gray-600', value: 10 }
};

const MESSAGES = [
    { id: 'M1', content: 'MAP', collected: false },
    { id: 'M2', content: 'CAVE', collected: false },
    { id: 'M3', content: 'KEY', collected: false },
    { id: 'M4', content: 'DOOR', collected: false },
    { id: 'M5', content: 'TREASURE', collected: false }
];

const TOWER_TYPES = {
    SCOUT: { type: 'Scout', emoji: '👁️', description: 'Watchtower for early detection' },
    GUARD: { type: 'Guard', emoji: '🛡️', description: 'Basic defensive tower' },
    ARCHER: { type: 'Archer', emoji: '🏹', description: 'Long-range attack tower' },
    MAGE: { type: 'Mage', emoji: '🔮', description: 'Magical support tower' },
    FORTRESS: { type: 'Fortress', emoji: '🏰', description: 'Heavy defensive structure' }
};

const CORRECT_TOWER_ORDER = ['Scout', 'Guard', 'Archer', 'Mage', 'Fortress'];

const CORRUPTED_LINK_TYPES = {
    RED: { type: 'Corrupted Red', color: 'bg-red-700', emoji: '🩸', isCorrupted: true },
    BLUE: { type: 'Safe Blue', color: 'bg-blue-600', emoji: '💧', isCorrupted: false },
    GREEN: { type: 'Safe Green', color: 'bg-green-600', emoji: '🍃', isCorrupted: false },
    YELLOW: { type: 'Safe Yellow', color: 'bg-yellow-600', emoji: '✨', isCorrupted: false },
    PURPLE: { type: 'Safe Purple', color: 'bg-purple-600', emoji: '🟣', isCorrupted: false }
};

// Example initial chain for Level 4 (can be adjusted for challenge)
const INITIAL_LEVEL4_CHAIN = [
    CORRUPTED_LINK_TYPES.BLUE,
    CORRUPTED_LINK_TYPES.RED,
    CORRUPTED_LINK_TYPES.GREEN,
    CORRUPTED_LINK_TYPES.RED,
    CORRUPTED_LINK_TYPES.YELLOW
];

const MYSTICAL_REALMS = [
    { type: 'Emberfell', emoji: '🔥' },
    { type: 'Aqualos', emoji: '🌊' },
    { type: 'Terrawood', emoji: '🌳' },
    { type: 'Skylight', emoji: '☁️' },
    { type: 'Shadowfen', emoji: '🌑' },
    { type: 'Crystalith', emoji: '💎' },
];

const PORTAL_TYPES = {
    EARTH: { type: 'EARTH', emoji: '🌍', description: 'Stable and grounding' },
    FIRE: { type: 'FIRE', emoji: '🔥', description: 'Energetic and transformative' },
    WATER: { type: 'WATER', emoji: '💧', description: 'Flowing and adaptable' },
    AIR: { type: 'AIR', emoji: '🌬️', description: 'Free and expansive' },
    SPIRIT: { type: 'SPIRIT', emoji: '✨', description: 'Mystical and unifying' },
};

const CORRECT_PORTAL_ORDER = [PORTAL_TYPES.EARTH, PORTAL_TYPES.FIRE, PORTAL_TYPES.WATER, PORTAL_TYPES.AIR, PORTAL_TYPES.SPIRIT];

// Level 7: Circular Linked List Constants
const SEASON_TYPES = {
    SPRING: { type: 'SPRING', emoji: '🌸', description: 'New beginnings' },
    SUMMER: { type: 'SUMMER', emoji: '☀️', description: 'Growth and warmth' },
    AUTUMN: { type: 'AUTUMN', emoji: '🍂', description: 'Harvest and change' },
    WINTER: { type: 'WINTER', emoji: '❄️', description: 'Rest and reflection' },
};

const CORRECT_SEASON_ORDER = [SEASON_TYPES.SPRING, SEASON_TYPES.SUMMER, SEASON_TYPES.AUTUMN, SEASON_TYPES.WINTER];

// Level 8: Circular Linked List for Wheel of Fortune
const PLAYER_TYPES = {
    KNIGHT: { type: 'Knight', emoji: '🛡️', description: 'Brave warrior' },
    WIZARD: { type: 'Wizard', emoji: '🧙', description: 'Master of spells' },
    ROGUE: { type: 'Rogue', emoji: '🗡️', description: 'Agile and stealthy' },
    ARCHER: { type: 'Archer', emoji: '🏹', description: 'Precise marksman' },
    HEALER: { type: 'Healer', emoji: ' healers', description: 'Restorer of health' },
};

const CORRECT_TOURNAMENT_ORDER = [
    PLAYER_TYPES.KNIGHT,
    PLAYER_TYPES.WIZARD,
    PLAYER_TYPES.ROGUE,
    PLAYER_TYPES.ARCHER,
    PLAYER_TYPES.HEALER,
];

const ChainMastersAdventure = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    // All hooks at the top!
    const [currentLevel, setCurrentLevel] = useState(1);
    const [gameMessage, setGameMessage] = useState('Welcome, Chain Master!');
    const [levelObjectiveMet, setLevelObjectiveMet] = useState(false);
    const [levelStartTime, setLevelStartTime] = useState(Date.now());
    const [completedLevels, setCompletedLevels] = useState(new Set());
    const [linkedListGameProgress, setLinkedListGameProgress] = useState(null);
    const [currentNode, setCurrentNode] = useState(null);
    const [sparkle, setSparkle] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState({});
    const [showLevelsMenu, setShowLevelsMenu] = useState(true); // New state for levels menu
    // Level 1 specific state
    const [treasures, setTreasures] = useState(['Gold', 'Silver', 'Bronze', 'Copper', 'Iron']);
    const [selectedTreasure, setSelectedTreasure] = useState(null);
    const [chain, setChain] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [forgeAnimation, setForgeAnimation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    // Level 2 specific state
    const [messagesChain, setMessagesChain] = useState([]);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [collectedMessages, setCollectedMessages] = useState([]);
    const [traversalInProgress, setTraversalInProgress] = useState(false);
    const [showLevel2Success, setShowLevel2Success] = useState(false);
    const [currentAction, setCurrentAction] = useState('GET_DATA');
    // Level 3 specific state
    const [towerChain, setTowerChain] = useState([]);
    const [selectedTower, setSelectedTower] = useState(null);
    const [insertPosition, setInsertPosition] = useState(null);
    const [constructionAnimation, setConstructionAnimation] = useState(false);
    const [showLevel3Success, setShowLevel3Success] = useState(false);
    const [currentInsertionType, setCurrentInsertionType] = useState(null); // 'head', 'tail', or 'middle'
    const [blueprintVisible, setBlueprintVisible] = useState(false);
    // Level 4 specific state
    const [corruptedChain, setCorruptedChain] = useState([]);
    const [selectedCorruptedLink, setSelectedCorruptedLink] = useState(null);
    const [showLevel4Success, setShowLevel4Success] = useState(false);
    // Level 5 specific state
    const [doubleLinkedListChain, setDoubleLinkedListChain] = useState([]);
    const [currentDoubleNodeIndex, setCurrentDoubleNodeIndex] = useState(0);
    const [traversalDirection, setTraversalDirection] = useState(null); // 'forward' or 'backward'
    const [showLevel5Success, setShowLevel5Success] = useState(false);
    const [characterPosition, setCharacterPosition] = useState(0); // For visual traversal
    // Level 6 specific state
    const [portalNetwork, setPortalNetwork] = useState([]);
    const [selectedPortalType, setSelectedPortalType] = useState(null);
    const [portalActionMessage, setPortalActionMessage] = useState('');
    const [showLevel6Success, setShowLevel6Success] = useState(false);
    const [portalInsertPosition, setPortalInsertPosition] = useState(null);
    const [portalDeletePosition, setPortalDeletePosition] = useState(null);
    // Level 7: Circular Linked List State
    const [seasonChain, setSeasonChain] = useState([]);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [showLevel7Success, setShowLevel7Success] = useState(false);
    const [currentSeasonTraversalIndex, setCurrentSeasonTraversalIndex] = useState(0);
    const [traversalSteps, setTraversalSteps] = useState(0);
    const [cycleDetected, setCycleDetected] = useState(false);
    // Level 8: Wheel of Fortune State
    const [wheelOfFortuneChain, setWheelOfFortuneChain] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [showLevel8Success, setShowLevel8Success] = useState(false);
    const [rotationPosition, setRotationPosition] = useState(0); // For visual rotation
    const [playerActionMessage, setPlayerActionMessage] = useState('');
    // Level 9: Chain Transformation State
    const [transformationChain, setTransformationChain] = useState([]);
    const [currentChainType, setCurrentChainType] = useState('singly'); // 'singly', 'doubly', 'circular'
    const [transformationMessage, setTransformationMessage] = useState('');
    const [showLevel9Success, setShowLevel9Success] = useState(false);
    const [currentTransformationStep, setCurrentTransformationStep] = useState(0);
    const [isTransforming, setIsTransforming] = useState(false);
    const [vaultUnlocked, setVaultUnlocked] = useState(false);
    // Level 10 State
    const [serpentHealth, setSerpentHealth] = useState(100);
    const [playerHealth, setPlayerHealth] = useState(100);
    const [currentAttackPattern, setCurrentAttackPattern] = useState('coil');
    const [serpentSegments, setSerpentSegments] = useState([]);
    const [spellChain, setSpellChain] = useState([]);
    const [protectionBarrier, setProtectionBarrier] = useState([]);
    const [showLevel10Success, setShowLevel10Success] = useState(false);
    const [battlePhase, setBattlePhase] = useState('preparation');
    const [selectedChainType, setSelectedChainType] = useState('singly');
    const [showDashboardButton, setShowDashboardButton] = useState(false);
    // for progress
    const { get, loading, error } = useApi();
    const [LinkedlistGameProgress, setLinkedlistGameProgress] = useState(null);
    // Level 10 state variables
    const [challengeChain, setChallengeChain] = useState([]);
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    const [completedChallenges, setCompletedChallenges] = useState([]);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [solutionInput, setSolutionInput] = useState('');
    const [puzzleChain, setPuzzleChain] = useState([]);
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [solvedPuzzles, setSolvedPuzzles] = useState([]);
    const [selectedPuzzle, setSelectedPuzzle] = useState(null);
    const [puzzleInput, setPuzzleInput] = useState([]);
    const [showHint, setShowHint] = useState(false);
    const [currentList, setCurrentList] = useState([]);
    // Add this near the top of the component with other state declarations
    const [level2Completed, setLevel2Completed] = useState(false);
    const [level3Completed, setLevel3Completed] = useState(false);

    // Debug logging for auth state
    useEffect(() => {
        console.log('Auth state changed:', { user, authLoading });
    }, [user, authLoading]);

    // Helper function to load progress from database
    const loadProgress = useCallback(async () => {
        if (!user) {
            console.log('User not logged in, skipping loadProgress');
            return;
        }

        console.log('loadProgress called with user state:', {
            user,
            userId: user?.id,
            token: localStorage.getItem('token')
        });

        if (!user.id) {
            console.log('No user ID available in loadProgress (user.id missing)');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No auth token found in localStorage');
            return;
        }

        setIsLoading(true);
        console.log('Attempting to load progress for linked-lists');

        try {
            const response = await fetch(
                'http://localhost:5000/api/user/progress',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.log('No general user progress found yet (expected for new users)');
                    setLinkedListGameProgress(null);
                    setCompletedLevels(new Set());
                    return;
                }
                if (response.status === 401) {
                    console.log('Unauthorized - token may be invalid');
                    return;
                }
                const errorText = await response.text();
                throw new Error(`Failed to load progress: ${response.status} - ${errorText}`);
            }
            
            const userData = await response.json();
            console.log('Full user progress loaded successfully:', userData);
            
            // Log the entire progress object structure
            console.log('Progress object structure:', {
                progress: userData?.data?.progress,
                topics: userData?.data?.progress?.topics,
                linkedLists: userData?.data?.progress?.topics?.linkedLists
            });

            // Get linked lists progress from the correct path
            const linkedListProgressEntry = userData?.data?.progress?.topics?.linkedLists;
            console.log('Found linked lists progress entry in user data:', linkedListProgressEntry);

            setLinkedListGameProgress(linkedListProgressEntry || null);
            if (linkedListProgressEntry && linkedListProgressEntry.gameLevels) {
                const completed = new Set(linkedListProgressEntry.gameLevels.filter(l => l.completed).map(l => l.level));
                setCompletedLevels(completed);
            } else {
                setCompletedLevels(new Set());
            }

        } catch (error) {
            console.error('Error loading progress:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user, setLinkedListGameProgress, setCompletedLevels]);

    // Check authentication on component mount
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                console.log('No user found, redirecting to login');
                navigate('/login');
            } else {
                console.log('User found, loading progress');
                loadProgress();
            }
        }
    }, [user, authLoading, navigate, loadProgress]);

    // Update level start time when level changes
    useEffect(() => {
        setLevelStartTime(Date.now());
        setLevelObjectiveMet(false);
    }, [currentLevel]);

    // Main render condition: Show loading if auth is still loading
    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-white text-xl">Loading user data...</p>
            </div>
        );
    }

    // If we get here, authLoading is false
    if (!user) {
        console.log('Rendering login message - user is null');
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-xl">Please log in to play the game</p>
                <button 
                    onClick={() => navigate('/login')}
                    className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    // Function to calculate score (fixed 10 per level)
    const calculateScore = (level) => 10;

    // Save progress to database (GraphGame style)
    const saveProgress = async (level, score, timeSpent) => {
        if (!user) return;
        const progressData = {
            topicId: 'linked-lists',
            level: Number(level),
            score: Number(score),
            timeSpent: Number(timeSpent)
        };
        try {
            const response = await fetch('http://localhost:5000/api/game-progress/save-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(progressData)
            });
            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.message || 'Failed to save progress');
            }
            setCompletedLevels(prev => {
                const newState = new Set(prev);
                newState.add(level);
                return newState;
            });
        } catch (error) {
            // Silently handle error (e.g., duplicate key)
        }
    };

    // Handle level completion (GraphGame style)
    const handleLevelComplete = async (level) => {
        if (!completedLevels.has(level)) {
            const timeSpent = Math.floor((Date.now() - levelStartTime) / 1000);
            try {
                await saveProgress(level, calculateScore(level), timeSpent);
            } catch (error) {
                // Silently handle error
            }
        }
        setLevelObjectiveMet(true);
        setGameMessage(`Level ${level} completed! Great job!`);
    };

    // Function to handle level start
    const handleLevelStart = useCallback((levelNumber) => {
        setCurrentLevel(levelNumber);
        setLevelStartTime(Date.now());
        setLevelObjectiveMet(false);
        setGameMessage(`Starting Level ${levelNumber}...`);
    }, []);

    // Progress loading is handled by loadProgress function above

    // Helper function to calculate level score
    const calculateLevelScore = useCallback((level, type, details) => {
        let baseScore = 0;
        
        switch(level) {
            case 1:
                baseScore = 100;
                break;
            case 2:
                baseScore = 200;
                break;
            case 3:
                baseScore = 300;
                break;
            case 4:
                baseScore = 400;
                break;
            case 5:
                baseScore = 500;
                break;
            case 6:
                baseScore = 600;
                break;
            case 7:
                baseScore = 700;
                break;
            case 8:
                baseScore = 800;
                break;
            case 9:
                baseScore = 900;
                break;
            case 10:
                baseScore = 1000;
                break;
            default:
                baseScore = 100;
        }

        // Add bonus points based on type and details
        let bonusScore = 0;
        
        if (type === 'all-puzzles') {
            bonusScore = details.solved.length * 50; // 50 points per solved puzzle
        } else if (type === 'all-chains') {
            bonusScore = details.patterns.length * 100; // 100 points per pattern mastered
        } else if (type === 'all-barriers') {
            bonusScore = details.barriers.length * 75; // 75 points per barrier cleared
        }

        return baseScore + bonusScore;
    }, []);

    // Level 1 initialization
    const initializeLevel1 = useCallback(() => {
        console.log('Initializing Level 1');
        setChain([]);
        setSelectedTreasure(null);
        setCurrentStep(0);
        setShowSuccess(false);
        setGameMessage('Level 1: The First Link. Learn to forge your first magical chain link!');
        setLevelObjectiveMet(false);
    }, []);

    // Level 2: Initialize messages and positions for the chain
    const initializeLevel2 = useCallback(() => {
        console.log('Initializing Level 2...');
        const newMessagesChain = MESSAGES.map((msg, index) => ({
            ...msg,
            x: 150 + index * 150,
            y: 200,
            collected: false,
        }));
        setMessagesChain(newMessagesChain);
        setCurrentMessageIndex(0);
        setCollectedMessages([]);
        setTraversalInProgress(false);
        setShowLevel2Success(false);
        setCurrentAction('GET_DATA');
        setGameMessage('Level 2: The Path Walker - Use getCurrentData() to get the message from the first island.');
        setLevelObjectiveMet(false);
        setCurrentNode(newMessagesChain[0]);
        console.log('Level 2 initialized with messagesChain:', newMessagesChain);
    }, []);

    // Level 3: Initialize tower defense chain
    const initializeLevel3 = useCallback(() => {
        console.log('Initializing Level 3...');
        setTowerChain([]);
        setSelectedTower(null);
        setInsertPosition(null);
        setConstructionAnimation(false);
        setShowLevel3Success(false);
        setCurrentInsertionType(null);
        setBlueprintVisible(false);
        setGameMessage('Level 3: The Master Constructor - Build your defensive line of towers!');
        setLevelObjectiveMet(false);
    }, []);

    // Level 3: Insert tower at head
    const insertAtHead = useCallback((tower) => {
        if (towerChain.length >= 5) {
            setGameMessage('Maximum number of towers (5) reached!');
            return;
        }
        setConstructionAnimation(true);
        const newNode = new Node({
            type: tower.type,
            emoji: tower.emoji,
            description: tower.description
        });
        setTowerChain(prevChain => {
            newNode.next = prevChain[0] || null;
            return [newNode, ...prevChain];
        });
        setTimeout(() => setConstructionAnimation(false), 1000);
        setCurrentInsertionType('head');
        setGameMessage(`Added ${tower.type} tower at the beginning of the defense line!`);
    }, [towerChain.length]);

    // Level 3: Insert tower at tail
    const insertAtTail = useCallback((tower) => {
        if (towerChain.length >= 5) {
            setGameMessage('Maximum number of towers (5) reached!');
            return;
        }
        setConstructionAnimation(true);
        const newNode = new Node({
            type: tower.type,
            emoji: tower.emoji,
            description: tower.description
        });
        setTowerChain(prevChain => {
            if (prevChain.length === 0) return [newNode];
            const newChain = [...prevChain];
            newChain[newChain.length - 1].next = newNode;
            return [...newChain, newNode];
        });
        setTimeout(() => setConstructionAnimation(false), 1000);
        setCurrentInsertionType('tail');
        setGameMessage(`Added ${tower.type} tower at the end of the defense line!`);
    }, [towerChain.length]);

    // Level 3: Check if tower chain is correct
    const checkTowerChain = useCallback(() => {
        const currentOrder = towerChain.map(node => node.data.type);
        const isCorrect = CORRECT_TOWER_ORDER.every((tower, index) => 
            currentOrder[index] === tower
        );
        console.log('checkTowerChain: isCorrect =', isCorrect, ', currentOrder =', currentOrder);

        if (isCorrect) {
            setShowLevel3Success(true);
            setGameMessage('Success! You\'ve created the perfect chain!');
            setLevelObjectiveMet(true);
        } else {
            setGameMessage('The tower chain is not in the correct order. Try again!');
            setLevelObjectiveMet(false);
        }
        return isCorrect;
    }, [towerChain, handleLevelComplete]);

    // Level 4: Initialize corrupted chain
    const initializeLevel4 = useCallback(() => {
        console.log('Initializing Level 4...');
        const initialNodes = INITIAL_LEVEL4_CHAIN.map(link => new Node(link));
        for (let i = 0; i < initialNodes.length - 1; i++) {
            initialNodes[i].next = initialNodes[i + 1];
        }
        setCorruptedChain(initialNodes);
        setSelectedCorruptedLink(null);
        setShowLevel4Success(false);
        setGameMessage('Level 4: Chain Repair - Remove all corrupted links!');
        setLevelObjectiveMet(false);
        console.log('initializeLevel4: setLevelObjectiveMet(false)');
    }, []);

    // Level 4: Delete from head
    const deleteAtHead = useCallback(() => {
        setCorruptedChain(prevChain => {
            if (prevChain.length === 0) return [];
            const newChain = [...prevChain];
            newChain.shift();
            return newChain;
        });
        setGameMessage('Corrupted link at head removed!');
    }, []);

    // Level 4: Delete from tail
    const deleteAtTail = useCallback(() => {
        setCorruptedChain(prevChain => {
            if (prevChain.length === 0) return [];
            const newChain = [...prevChain];
            newChain.pop();
            if (newChain.length > 0) {
                newChain[newChain.length - 1].next = null;
            }
            return newChain;
        });
        setGameMessage('Corrupted link at tail removed!');
    }, []);

    // Level 4: Check if objective met (no corrupted links left)
    const checkCorruptedChain = useCallback(() => {
        const hasCorruptedLinks = corruptedChain.some(node => node.data.isCorrupted);
        if (!hasCorruptedLinks) {
            setShowLevel4Success(true);
            setGameMessage('Success! All corrupted links have been removed!');
            handleLevelComplete(4, 'linked-lists', { chain: corruptedChain.map(n => n.data.type) });
        } else {
            setGameMessage('There are still corrupted links. Keep mending!');
        }
        return !hasCorruptedLinks;
    }, [corruptedChain, handleLevelComplete]);

    // Level 5: Initialize doubly linked list chain
    const initializeLevel5 = useCallback(() => {
        console.log('Initializing Level 5...');
        setDoubleLinkedListChain([]);
        setCurrentDoubleNodeIndex(0);
        setTraversalDirection(null);
        setShowLevel5Success(false);
        setCharacterPosition(0);
        setGameMessage('Level 5: Twin Chain Mastery - Build a two-way bridge connecting 6 mystical realms!');
        setLevelObjectiveMet(false);
    }, []);

    // Level 5: Insert double node (generalized insert)
    const insertDoubleNode = useCallback((realm, position) => {
        const newNode = new DoubleNode(realm);
        setDoubleLinkedListChain(prevChain => {
            const newChain = [...prevChain];
            if (position === 0) { // Insert at head
                if (newChain.length > 0) {
                    newNode.next = newChain[0];
                    newChain[0].previous = newNode;
                }
                return [newNode, ...newChain];
            } else if (position === newChain.length) { // Insert at tail
                if (newChain.length > 0) {
                    newNode.previous = newChain[newChain.length - 1];
                    newChain[newChain.length - 1].next = newNode;
                }
                return [...newChain, newNode];
            } else { // Insert in middle
                const nodeAtPosition = newChain[position];
                const nodeBefore = newChain[position - 1];

                newNode.next = nodeAtPosition;
                newNode.previous = nodeBefore;
                nodeBefore.next = newNode;
                nodeAtPosition.previous = newNode;

                newChain.splice(position, 0, newNode);
                return newChain;
            }
        });
        setGameMessage(`Added ${realm.type} to the bridge at position ${position}.`);
    }, []);

    // Level 5: Traverse forward
    const traverseForward = useCallback(() => {
        if (currentDoubleNodeIndex < doubleLinkedListChain.length - 1) {
            setCurrentDoubleNodeIndex(prevIndex => prevIndex + 1);
            setTraversalDirection('forward');
            setGameMessage(`Moved forward to ${doubleLinkedListChain[currentDoubleNodeIndex + 1].data.type}.`);
        } else {
            setGameMessage('Cannot move further forward.');
        }
    }, [currentDoubleNodeIndex, doubleLinkedListChain]);

    // Level 5: Traverse backward
    const traverseBackward = useCallback(() => {
        if (currentDoubleNodeIndex > 0) {
            setCurrentDoubleNodeIndex(prevIndex => prevIndex - 1);
            setTraversalDirection('backward');
            setGameMessage(`Moved backward to ${doubleLinkedListChain[currentDoubleNodeIndex - 1].data.type}.`);
        } else {
            setGameMessage('Cannot move further backward.');
        }
    }, [currentDoubleNodeIndex, doubleLinkedListChain]);

    // Level 5: Check if doubly linked list is correctly formed and has 6 nodes
    const checkDoublyLinkedList = useCallback(() => {
        if (doubleLinkedListChain.length !== 6) {
            setGameMessage(`Bridge must connect 6 realms. Current: ${doubleLinkedListChain.length}.`);
            return false;
        }

        let isValid = true;
        for (let i = 0; i < doubleLinkedListChain.length - 1; i++) {
            if (doubleLinkedListChain[i].next !== doubleLinkedListChain[i + 1]) {
                isValid = false;
                break;
            }
        }
        if (isValid) {
            for (let i = doubleLinkedListChain.length - 1; i > 0; i--) {
                if (doubleLinkedListChain[i].previous !== doubleLinkedListChain[i - 1]) {
                    isValid = false;
                    break;
                }
            }
        }

        if (isValid) {
            setShowLevel5Success(true);
            setGameMessage('Success! The two-way bridge is perfectly constructed!');
            handleLevelComplete(5, 'doubly-linked-lists', { chain: doubleLinkedListChain.map(n => n.data.type) });
        } else {
            setGameMessage('The bridge is not correctly connected. Check your next and previous pointers!');
        }
        return isValid;
    }, [doubleLinkedListChain, handleLevelComplete]);

    // Level 6: Initialize portal network
    const initializeLevel6 = useCallback(() => {
        console.log('Initializing Level 6...');
        const initialData = [
            PORTAL_TYPES.FIRE,
            PORTAL_TYPES.EARTH,
            PORTAL_TYPES.WATER,
            PORTAL_TYPES.AIR,
            PORTAL_TYPES.SPIRIT,
        ];

        const initialNodes = initialData.map(portal => new DoubleNode(portal));
        for (let i = 0; i < initialNodes.length; i++) {
            if (i < initialNodes.length - 1) {
                initialNodes[i].next = initialNodes[i + 1];
            }
            if (i > 0) {
                initialNodes[i].previous = initialNodes[i - 1];
            }
        }
        setPortalNetwork(initialNodes);
        setSelectedPortalType(null);
        setPortalActionMessage('Manage your portal network: insert and delete portals to match the order!');
        setShowLevel6Success(false);
        setPortalInsertPosition(null);
        setPortalDeletePosition(null);
        setGameMessage('Level 6: Reversible Portal Network - Maintain your dimensional connections!');
        setLevelObjectiveMet(false);
    }, []);

    // Level 6: Insert double node at a specific position
    const insertDoubleNodeAtPosition = useCallback((portal, position) => {
        const newNode = new DoubleNode(portal);
        setPortalNetwork(prevNetwork => {
            const newNetwork = [...prevNetwork];
            if (position === 0) { // Insert at head
                if (newNetwork.length > 0) {
                    newNode.next = newNetwork[0];
                    newNetwork[0].previous = newNode;
                }
                return [newNode, ...newNetwork];
            } else if (position === newNetwork.length) { // Insert at tail
                if (newNetwork.length > 0) {
                    newNode.previous = newNetwork[newNetwork.length - 1];
                    newNetwork[newNetwork.length - 1].next = newNode;
                }
                return [...newNetwork, newNode];
            } else { // Insert in middle
                const nodeAtPosition = newNetwork[position];
                const nodeBefore = newNetwork[position - 1];

                newNode.next = nodeAtPosition;
                newNode.previous = nodeBefore;
                nodeBefore.next = newNode;
                nodeAtPosition.previous = newNode;

                newNetwork.splice(position, 0, newNode);
                return newNetwork;
            }
        });
        setGameMessage(`Inserted ${portal.type} portal at position ${position}.`);
    }, []);

    // Level 6: Delete double node at a specific position
    const deleteDoubleNodeAtPosition = useCallback((position) => {
        setPortalNetwork(prevChain => {
            if (position < 0 || position >= prevChain.length || prevChain.length === 0) {
                setGameMessage('Invalid position for deletion.');
                return prevChain;
            }

            const nodesAfterDeletion = prevChain.filter((_, idx) => idx !== position);

            if (nodesAfterDeletion.length === 0) {
                setGameMessage('All portals removed!');
                return [];
            }

            const newChain = [];
            let prevNode = null;

            for (let i = 0; i < nodesAfterDeletion.length; i++) {
                const currentNodeData = nodesAfterDeletion[i].data;
                const newNode = new DoubleNode(currentNodeData);

                newNode.previous = prevNode;
                if (prevNode) {
                    prevNode.next = newNode;
                }
                newChain.push(newNode);
                prevNode = newNode;
            }
            
            setGameMessage(`Deleted portal at position ${position}.`);
            return newChain;
        });
    }, []);

    // Level 6: Check if portal network is correctly formed and matches challenge
    const checkPortalNetwork = useCallback(() => {
        console.log('Checking portal network...');
        console.log('Current network:', portalNetwork.map(n => n.data.type));
        console.log('Expected order:', CORRECT_PORTAL_ORDER.map(p => p.type));

        if (portalNetwork.length !== CORRECT_PORTAL_ORDER.length) {
            setGameMessage(`Network must contain exactly ${CORRECT_PORTAL_ORDER.length} portals. Currently: ${portalNetwork.length}.`);
            setLevelObjectiveMet(false);
            return false;
        }

        let isValid = true;
        for (let i = 0; i < portalNetwork.length; i++) {
            if (portalNetwork[i].data.type !== CORRECT_PORTAL_ORDER[i].type) {
                isValid = false;
                setGameMessage(`Incorrect portal at position ${i}. Expected: ${CORRECT_PORTAL_ORDER[i].type}, Got: ${portalNetwork[i].data.type}.`);
                break;
            }
            // Check forward link
            if (i < portalNetwork.length - 1 && portalNetwork[i].next !== portalNetwork[i+1]) {
                isValid = false;
                setGameMessage(`Forward link error at position ${i}. Expected next to be ${portalNetwork[i+1]?.data?.type}, got ${portalNetwork[i]?.next?.data?.type}.`);
                break;
            }
        }
        if (isValid) {
            for (let i = portalNetwork.length - 1; i > 0; i--) {
                if (portalNetwork[i].previous !== portalNetwork[i-1]) {
                    isValid = false;
                    setGameMessage(`Backward link error at position ${i}. Expected previous to be ${portalNetwork[i-1]?.data?.type}, got ${portalNetwork[i]?.previous?.data?.type}.`);
                    break;
                }
            }
        }

        if (isValid) {
            setShowLevel6Success(true);
            setGameMessage('Success! The portal network is perfectly configured!');
            handleLevelComplete(6, 'doubly-linked-lists', { network: portalNetwork.map(n => n.data.type) });
            setLevelObjectiveMet(true);
            return true;
        } else {
            // Message is already set by specific error checks above, so no generic message here
            setLevelObjectiveMet(false);
            return false;
        }
    }, [portalNetwork, handleLevelComplete]);

    // Level 7: Initialize circular chain
    const initializeLevel7 = useCallback(() => {
        console.log('Initializing Level 7...');
        setSeasonChain([]);
        setSelectedSeason(null);
        setShowLevel7Success(false);
        setCurrentSeasonTraversalIndex(0);
        setTraversalSteps(0);
        setCycleDetected(false);
        setGameMessage('Level 7: The Circle of Unity - Build an eternal chain of seasons!');
        setLevelObjectiveMet(false);
    }, []);

    // Level 7: Create Circular Chain
    const createCircularChain = useCallback(() => {
        console.log('Creating circular chain...');
        if (CORRECT_SEASON_ORDER.length === 0) {
            setGameMessage('No seasons defined to create chain.');
            return;
        }

        const nodes = CORRECT_SEASON_ORDER.map(season => new Node(season));

        for (let i = 0; i < nodes.length; i++) {
            if (i < nodes.length - 1) {
                nodes[i].next = nodes[i + 1];
            }
        }
        if (nodes.length > 0) {
            nodes[nodes.length - 1].next = nodes[0];
        }
        setSeasonChain(nodes);
        setGameMessage('Circular Chain of Seasons created!');
        setCycleDetected(true);
        setCurrentSeasonTraversalIndex(0);
    }, []);

    // Level 7: Detect Cycle (can be a visual check or a function)
    const detectCycle = useCallback(() => {
        if (seasonChain.length === 0) return false;

        let slow = seasonChain[0];
        let fast = seasonChain[0];

        while (fast && fast.next) {
            slow = slow.next;
            fast = fast.next.next;

            if (slow === fast) {
                setGameMessage('Cycle detected! The chain is eternal.');
                setCycleDetected(true);
                return true;
            }
        }
        setGameMessage('No cycle detected. The chain has an end.');
        setCycleDetected(false);
        return false;
    }, [seasonChain]);

    // Level 7: Traverse Circular List by steps
    const traverseCircular = useCallback((steps) => {
        if (seasonChain.length === 0) {
            setGameMessage('Chain is empty, cannot traverse.');
            return;
        }

        let current = seasonChain[currentSeasonTraversalIndex];
        let newIndex = currentSeasonTraversalIndex;

        for (let i = 0; i < steps; i++) {
            if (!current.next) {
                setGameMessage('Reached end of chain unexpectedly. Not a circular list?');
                setTraversalSteps(0);
                return;
            }
            current = current.next;
            newIndex = (newIndex + 1) % seasonChain.length;
        }
        setCurrentSeasonTraversalIndex(newIndex);
        setTraversalSteps(prevSteps => prevSteps + steps);
        setGameMessage(`Traversed ${steps} steps. Now at ${current.data.type}.`);

        if (seasonChain.length === CORRECT_SEASON_ORDER.length) {
            const currentOrder = [];
            let temp = seasonChain[0];
            for (let i = 0; i < seasonChain.length; i++) {
                currentOrder.push(temp.data.type);
                temp = temp.next;
            }

            const isCorrectOrder = CORRECT_SEASON_ORDER.every((season, index) => 
                currentOrder[index] === season.type
            );

            if (isCorrectOrder && detectCycle()) {
                setShowLevel7Success(true);
                setGameMessage('Success! The Circle of Seasons is perfectly formed!');
                handleLevelComplete(7, 'circular-linked-lists', { chain: currentOrder });
                setLevelObjectiveMet(true);
            }
        }
    }, [seasonChain, currentSeasonTraversalIndex, handleLevelComplete, detectCycle]);

    // Level 8: Initialize Wheel of Fortune
    const initializeLevel8 = useCallback(() => {
        console.log('Initializing Level 8...');
        setWheelOfFortuneChain([]); 
        setSelectedPlayer(null);
        setPlayerActionMessage('Welcome to the Wheel of Fortune! Add and remove players to manage the tournament bracket.');
        setShowLevel8Success(false);
        setRotationPosition(0);
        setGameMessage('Level 8: Eternal Chain Operations - The Wheel of Fortune!');
        setLevelObjectiveMet(false);
    }, []);

    // Level 8: Insert a player into the circular linked list at a specific position
    const insertInCircular = useCallback((player, position) => {
        const newNode = new DoubleNode(player);
        setWheelOfFortuneChain(prevChain => {
            const newChain = [...prevChain];

            if (newChain.length === 0) {
                newNode.next = newNode;
                newNode.previous = newNode;
                return [newNode];
            }

            const actualPosition = position % (newChain.length + 1); // Handle positions beyond current length for insertion

            let currentHead = newChain[0];
            let currentTail = newChain[newChain.length - 1];

            if (actualPosition === 0) { // Insert at head
                newNode.next = currentHead;
                newNode.previous = currentTail;
                currentHead.previous = newNode;
                currentTail.next = newNode;
                newChain.splice(0, 0, newNode);
            } else if (actualPosition === newChain.length) { // Insert at tail
                newNode.next = currentHead;
                newNode.previous = currentTail;
                currentHead.previous = newNode;
                currentTail.next = newNode;
                newChain.push(newNode);
            } else { // Insert in middle
                let nodeAfter = newChain[actualPosition];
                let nodeBefore = newChain[actualPosition - 1];

                newNode.next = nodeAfter;
                newNode.previous = nodeBefore;
                nodeBefore.next = newNode;
                nodeAfter.previous = newNode;

                newChain.splice(actualPosition, 0, newNode);
            }
            return newChain;
        });
        setPlayerActionMessage(`Added ${player.type} to the Wheel of Fortune!`);
    }, []);

    // Level 8: Delete a player from the circular linked list at a specific position
    const deleteFromCircular = useCallback((position) => {
        setWheelOfFortuneChain(prevChain => {
            if (prevChain.length === 0) {
                setPlayerActionMessage('The Wheel is empty, no one to remove!');
                return prevChain;
            }

            if (position < 0 || position >= prevChain.length) {
                setPlayerActionMessage('Invalid position for removal.');
                return prevChain;
            }

            let newChain;
            if (prevChain.length === 1) {
                newChain = [];
            } else {
                const nodeToDelete = prevChain[position];
                const nodeBefore = nodeToDelete.previous;
                const nodeAfter = nodeToDelete.next;

                if (nodeBefore) nodeBefore.next = nodeAfter;
                if (nodeAfter) nodeAfter.previous = nodeBefore;

                newChain = prevChain.filter((_, idx) => idx !== position);

                if (newChain.length > 0) {
                    const newHead = newChain[0];
                    const newTail = newChain[newChain.length - 1];
                    newHead.previous = newTail;
                    newTail.next = newHead;
                }
            }

            setPlayerActionMessage(`Removed player from position ${position}.`);
            return newChain;
        });
    }, []);

    // Level 8: Rotate the Wheel of Fortune
    const rotateWheel = useCallback((steps) => {
        if (wheelOfFortuneChain.length === 0) {
            setPlayerActionMessage('The Wheel is empty, nothing to rotate!');
            return;
        }

        const currentStartIndex = 0;
        const newStartIndex = (currentStartIndex + steps) % wheelOfFortuneChain.length;

        const rotatedChain = [
            ...wheelOfFortuneChain.slice(newStartIndex),
            ...wheelOfFortuneChain.slice(0, newStartIndex)
        ];

        setWheelOfFortuneChain(rotatedChain);
        setRotationPosition(prevPos => prevPos + (360 / wheelOfFortuneChain.length) * steps);
        setPlayerActionMessage(`Rotated the Wheel by ${steps} steps.`);
    }, [wheelOfFortuneChain.length]);

    // Level 8: Check if the tournament bracket is correctly formed
    const checkTournamentBracket = useCallback(() => {
        console.log('Checking tournament bracket...');
        console.log('Current chain:', wheelOfFortuneChain.map(n => n.data.type));
        console.log('Expected order:', CORRECT_TOURNAMENT_ORDER.map(p => p.type));

        if (wheelOfFortuneChain.length !== CORRECT_TOURNAMENT_ORDER.length) {
            setPlayerActionMessage(`The Wheel must contain exactly ${CORRECT_TOURNAMENT_ORDER.length} players.`);
            setLevelObjectiveMet(false);
            setShowLevel8Success(false);
            return false;
        }

        let isValidOrder = true;
        for (let i = 0; i < CORRECT_TOURNAMENT_ORDER.length; i++) {
            if (wheelOfFortuneChain[i].data.type !== CORRECT_TOURNAMENT_ORDER[i].type) {
                isValidOrder = false;
                break;
            }
        }

        let isCircular = false;
        if (wheelOfFortuneChain.length > 0) {
            const head = wheelOfFortuneChain[0];
            const tail = wheelOfFortuneChain[wheelOfFortuneChain.length - 1];
            if (head.previous === tail && tail.next === head) {
                isCircular = true;
            }
        }

        if (isValidOrder && isCircular) {
            setShowLevel8Success(true);
            setPlayerActionMessage('Success! The Wheel of Fortune is perfectly aligned!');
            handleLevelComplete(8, 'circular-linked-lists', { players: wheelOfFortuneChain.map(n => n.data.type) });
            setLevelObjectiveMet(true);
            return true;
        } else {
            setShowLevel8Success(false);
            setPlayerActionMessage('The tournament bracket is not in the correct order or not properly circular. Keep adjusting!');
            setLevelObjectiveMet(false);
            return false;
        }
    }, [wheelOfFortuneChain, handleLevelComplete]);

    // Level 9: Initialize Chain Transformation
    const initializeLevel9 = useCallback(() => {
        console.log('Initializing Level 9...');
        const initialNodes = [new Node({ id: 'A' }), new Node({ id: 'B' }), new Node({ id: 'C' })];
        initialNodes[0].next = initialNodes[1];
        initialNodes[1].next = initialNodes[2];
        setTransformationChain(initialNodes);
        setCurrentChainType('singly');
        setTransformationMessage('Transform the chain to unlock the vault!');
        setShowLevel9Success(false);
        setCurrentTransformationStep(0);
        setVaultUnlocked(false);
        setLevelObjectiveMet(false);
    }, []);

    // Level 9: Convert Singly to Doubly Linked List
    const convertToDoubly = useCallback(() => {
        if (currentChainType !== 'singly') {
            setTransformationMessage('Can only convert a singly linked list to doubly.');
            return;
        }
        setIsTransforming(true);
        setTimeout(() => {
            const newChain = transformationChain.map(node => new DoubleNode(node.data));
            for (let i = 0; i < newChain.length; i++) {
                if (i < newChain.length - 1) {
                    newChain[i].next = newChain[i + 1];
                }
                if (i > 0) {
                    newChain[i].previous = newChain[i - 1];
                }
            }
            setTransformationChain(newChain);
            setCurrentChainType('doubly');
            setTransformationMessage('Chain transformed to Doubly Linked List!');
            setIsTransforming(false);
            // Check if this transformation meets the current step of the puzzle
            if (currentTransformationStep === 0 && 'doubly' === correctTransformationOrder[currentTransformationStep + 1]) {
                setCurrentTransformationStep(prev => prev + 1);
                setTransformationMessage('Great! Now try the next transformation.');
            }
        }, 1000);
    }, [transformationChain, currentChainType, currentTransformationStep, correctTransformationOrder]);

    // Level 9: Convert Linear to Circular Linked List
    const convertToCircular = useCallback(() => {
        if (currentChainType === 'circular') {
            setTransformationMessage('Chain is already circular.');
            return;
        }
        setIsTransforming(true);
        setTimeout(() => {
            const newChain = [...transformationChain];
            if (newChain.length > 0) {
                const head = newChain[0];
                const tail = newChain[newChain.length - 1];
                tail.next = head; // Make it circular
                if (currentChainType === 'doubly') {
                    head.previous = tail; // For doubly to circular
                }
            }
            setTransformationChain(newChain);
            setCurrentChainType('circular');
            setTransformationMessage('Chain transformed to Circular Linked List!');
            setIsTransforming(false);
            // Check if this transformation meets the current step of the puzzle
            if (currentTransformationStep === 1 && 'circular' === correctTransformationOrder[currentTransformationStep + 1]) {
                setCurrentTransformationStep(prev => prev + 1);
                setTransformationMessage('Excellent! One more transformation.');
            }
        }, 1000);
    }, [transformationChain, currentChainType, currentTransformationStep, correctTransformationOrder]);

    // Level 9: Convert Circular to Singly Linked List (reverse transform)
    const convertToSingly = useCallback(() => {
        if (currentChainType !== 'circular') {
            setTransformationMessage('Can only convert a circular list to singly.');
            return;
        }
        setIsTransforming(true);
        setTimeout(() => {
            const newChain = [...transformationChain];
            if (newChain.length > 0) {
                const tail = newChain[newChain.length - 1];
                tail.next = null; // Break the circle
                // If it was doubly circular, remove previous ref from head
                if (newChain[0] && newChain[0].previous === tail) {
                    newChain[0].previous = null;
                }
            }
            setTransformationChain(newChain);
            setCurrentChainType('singly');
            setTransformationMessage('Chain transformed to Singly Linked List!');
            setIsTransforming(false);
            // Check if this transformation meets the current step of the puzzle
            if (currentTransformationStep === 2 && 'singly' === correctTransformationOrder[currentTransformationStep + 1]) {
                setCurrentTransformationStep(prev => prev + 1);
                setTransformationMessage('Almost there! Final transformation.');
                setVaultUnlocked(true);
                setShowLevel9Success(true);
                setLevelObjectiveMet(true); // Mark level objective met
            }
        }, 1000);
    }, [transformationChain, currentChainType, currentTransformationStep, correctTransformationOrder]);

    // Level 9: Reverse Transformation (resets to initial singly for now, can be made more complex)
    const reverseTransform = useCallback(() => {
        setIsTransforming(true);
        setTimeout(() => {
            initializeLevel9();
            setTransformationMessage('Transformation reversed! Starting over.');
            setIsTransforming(false);
        }, 1000);
    }, [initializeLevel9]);

    // Level 10 Functions - Moved to top level
    const calculateSinglyDamage = useCallback((segments) => {
        return segments.reduce((total, segment) => total + segment.data.value, 0);
    }, []);

    const calculateDoublyDamage = useCallback((spells) => {
        return spells.reduce((total, spell) => total + spell.data.value, 0);
    }, []);

    const calculateCircularDamage = useCallback((barriers) => {
        return barriers.reduce((total, barrier) => total + barrier.data.value, 0);
    }, []);

    const navigateToDashboard = useCallback(() => {
        navigate('/dashboard');
    }, [navigate]);

    // Level 10: The Grand Chain Challenge - Deletion Master
    const initializeLevel10 = useCallback(() => {
        console.log('Initializing Level 10...');
        setShowLevel10Success(false);
        setShowDashboardButton(false);
        setPuzzleInput([]);
        
        // Initialize the puzzle chain with deletion challenges
        const puzzleNodes = [
            new Node({ 
                type: 'singly',
                title: 'Singly List Deletion',
                description: 'Delete the node at position 3 from this singly linked list: [1 → 2 → 3 → 4 → 5]',
                hint: 'In a singly linked list, you need to update the next pointer of the previous node.',
                initialList: [1, 2, 3, 4, 5],
                position: 3,
                solution: [1, 2, 4, 5],
                points: 10
            }),
            new Node({ 
                type: 'doubly',
                title: 'Doubly List Deletion',
                description: 'Delete the node at position 2 from this doubly linked list: [1 ↔ 2 ↔ 3 ↔ 4 ↔ 5]',
                hint: 'In a doubly linked list, you need to update both next and previous pointers.',
                initialList: [1, 2, 3, 4, 5],
                position: 2,
                solution: [1, 3, 4, 5],
                points: 15
            }),
            new Node({ 
                type: 'circular',
                title: 'Circular List Deletion',
                description: 'Delete the node at position 4 from this circular linked list: [1 → 2 → 3 → 4 → 5 → 1]',
                hint: 'Remember to maintain the circular connection after deletion.',
                initialList: [1, 2, 3, 4, 5],
                position: 4,
                solution: [1, 2, 3, 5],
                points: 20
            }),
            new Node({ 
                type: 'mixed',
                title: 'Mixed List Deletion',
                description: 'Delete nodes at positions 2 and 4 from this mixed list: [1 → 2 ↔ 3 → 4 ↔ 5]',
                hint: 'Handle each section according to its type (singly or doubly linked).',
                initialList: [1, 2, 3, 4, 5],
                position: [2, 4],
                solution: [1, 3, 5],
                points: 25
            }),
            new Node({ 
                type: 'master',
                title: 'Master Deletion Challenge',
                description: 'Delete nodes at positions 1, 3, and 5 from this complex list: [1 ↔ 2 → 3 ↔ 4 → 5 ↔ 1]',
                hint: 'Consider the list structure and maintain all necessary connections.',
                initialList: [1, 2, 3, 4, 5],
                position: [1, 3, 5],
                solution: [2, 4],
                points: 30
            })
        ];
        
        // Connect the nodes
        for (let i = 0; i < puzzleNodes.length - 1; i++) {
            puzzleNodes[i].next = puzzleNodes[i + 1];
        }
        
        setPuzzleChain(puzzleNodes);
        setCurrentPuzzleIndex(0);
        setSolvedPuzzles([]);
        setShowHint(false);
        setCurrentList(puzzleNodes[0].data.initialList);
        setGameMessage('Level 10: Deletion Master - Master the art of deleting nodes at specific positions!');
        setLevelObjectiveMet(false);
    }, []);

    // Level 10: Handle puzzle selection
    const handlePuzzleSelect = useCallback((puzzle) => {
        setSelectedPuzzle(puzzle);
        setShowHint(false);
        setPuzzleInput([]);
        setCurrentList(puzzle.data.initialList);
        setGameMessage(`Selected puzzle: ${puzzle.data.title}`);
    }, []);

    // Level 10: Submit solution for current puzzle
    const handlePuzzleSubmit = useCallback((solution) => {
        if (!Array.isArray(solution)) {
            setGameMessage('Invalid solution format. Please try again.');
            return;
        }

        const currentPuzzle = puzzleChain[currentPuzzleIndex];
        let isCorrect = false;
        
        // Check if the solution matches the expected pattern
        isCorrect = JSON.stringify(solution) === JSON.stringify(currentPuzzle.data.solution);

        if (isCorrect) {
            setSolvedPuzzles(prev => [...prev, currentPuzzle]);
            setGameMessage('Correct! You successfully deleted the node(s)!');
            
            if (currentPuzzleIndex < puzzleChain.length - 1) {
                setCurrentPuzzleIndex(prev => prev + 1);
                setShowHint(false);
                setPuzzleInput([]);
                setCurrentList(puzzleChain[currentPuzzleIndex + 1].data.initialList);
        } else {
                setShowLevel10Success(true);
                setShowDashboardButton(true);
                setGameMessage('Congratulations! You have mastered node deletion in all types of linked lists!');
                handleLevelComplete(10, 'all-puzzles', { 
                    solved: solvedPuzzles.map(p => p.data.title)
                });
                setLevelObjectiveMet(true);
            }
        } else {
            setGameMessage('Not quite right. Try again!');
        }
    }, [puzzleChain, currentPuzzleIndex, solvedPuzzles, handleLevelComplete]);

    // Level 10: Toggle hint visibility
    const toggleHint = useCallback(() => {
        setShowHint(prev => !prev);
    }, []);

    // ... rest of the existing code ...

    console.log('ChainMastersAdventure Component Rendered');
    console.log('Initial currentLevel:', currentLevel);
    console.log('Initial messagesChain:', messagesChain);

    // Main useEffect for level initialization
    useEffect(() => {
        console.log('Level changed to:', currentLevel);
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
                console.log('Unknown level:', currentLevel);
        }
    }, [currentLevel, 
        initializeLevel1, 
        initializeLevel2, 
        initializeLevel3, 
        initializeLevel4, 
        initializeLevel5, 
        initializeLevel6, 
        initializeLevel7, 
        initializeLevel8, 
        initializeLevel9, 
        initializeLevel10
    ]);

    // Effect to check if current level is completed from loaded progress
    useEffect(() => {
        console.log('Checking completion for level:', currentLevel, 'Completed levels set:', completedLevels);
        if (completedLevels.has(currentLevel)) {
            console.log(`Level ${currentLevel} is already completed.`);
            setLevelObjectiveMet(true);
        }
    }, [currentLevel, completedLevels]);

    // Authentication and Progress Fetching (Initial Load)
    useEffect(() => {
        if (!authLoading && user) {
            loadProgress();
        }
    }, [user, authLoading, loadProgress]);

    // Main render condition: Show loading if auth is still loading, or user is not available
    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-white text-xl">Loading user data...</p>
            </div>
        );
    }

    if (!user) {
        console.log('Rendering login message - user is null');
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-xl">Please log in to play the game</p>
                <button 
                    onClick={() => navigate('/login')}
                    className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    // Render Level 1: The First Link (Refactored UI)
    const renderLevel1 = () => {
        return (
            <div className="flex flex-col items-center space-y-8 my-8 w-full">
                <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-2 border-green-600 flex flex-col items-center">
                    {/* Game Title */}
            {renderLevelNavigation()}
                    
                    <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-600 drop-shadow-lg font-serif">
                        Chain Master's Adventure
                    </h1>
                    <p className="text-lg text-green-600 font-semibold mb-2">Level 1: The First Link</p>
                    <p className="text-md text-pink-400 mb-4">{gameMessage}</p>
                    <div className="bg-blue-100 p-4 rounded-lg mb-6 w-full border border-blue-300">
                    <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                        <p className="text-blue-700">Understanding that a linked list node contains two parts: data (value) and a reference to the next node. This is a <b>Singly Linked List</b>, meaning each node only points forward to the next node in the chain, not backward. Click the node to create your first one!</p>
                </div>

                {/* Treasure Selection */}
                <div className="flex flex-wrap gap-4 justify-center mb-8">
                    {treasures.map((treasure, index) => (
                        <motion.button
                            key={treasure}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                setSelectedTreasure(treasure);
                                createNode(treasure);
                            }}
                                className={`p-4 rounded-lg shadow-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 border-2 ${
                                selectedTreasure === treasure
                                        ? 'bg-yellow-400 text-black border-yellow-600'
                                        : 'bg-pink-200 text-pink-800 hover:bg-pink-300 border-pink-400'
                            }`}
                        >
                            {treasure}
                        </motion.button>
                    ))}
                </div>

                {/* Chain Visualization */}
                    <div className="bg-gray-50 p-6 rounded-lg w-full max-w-4xl min-h-[120px] flex items-center justify-center border-2 border-gray-300 shadow-inner">
                    <div className="flex items-center space-x-4">
                        {chain.map((node, index) => (
                            <React.Fragment key={index}>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                        className="bg-pink-500 p-4 rounded-full text-white text-2xl font-bold shadow-lg border-4 border-pink-600 relative"
                                >
                                    {node.data}
                                        <span className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs border-2 border-white">#{index}</span>
                                </motion.div>
                                {index < chain.length - 1 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                            className="text-gray-600 text-3xl font-bold"
                                    >
                                        →
                                    </motion.div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={connectNodes}
                        disabled={chain.length < 2}
                            className={`px-6 py-2 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${
                            chain.length < 2
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                            }`}
                    >
                        Connect Links
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            checkChain();
                            if (chain.length === 5) {
                                setShowSuccess(true);
                                setLevelObjectiveMet(true);
                                handleLevelComplete(1);
                            }
                        }}
                        disabled={chain.length !== 5}
                            className={`px-6 py-2 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${
                            chain.length !== 5
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                            }`}
                    >
                        Check Chain
                    </motion.button>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                            className="text-green-600 text-xl font-bold mt-6 bg-green-100 p-4 rounded-lg border border-green-300"
                    >
                            🎉 Success! You've created the perfect chain! 🎉
                    </motion.div>
                )}

                {/* Reset Button for Level 1 */}
                <button 
                    onClick={() => {
                        setChain([]); // Clear the chain
                        setGameMessage('Level 1: The First Link. Learn to forge your first magical chain link!'); // Reset message
                        setShowSuccess(false); // Ensure success message is off
                        setLevelObjectiveMet(false); // Reset objective
                    }}
                        className="mt-8 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors font-bold shadow-lg"
                >
                    Reset Level
                </button>

                {/* Next Level Button for Level 1 */}
                {levelObjectiveMet && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => setCurrentLevel(2)}
                            className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors font-bold shadow-lg"
                    >
                        Next Level (2) →
                    </motion.button>
                )}
                </div>
            </div>
        );
    };

    // Render Level 2: The Path Walker (Revised)
    const renderLevel2 = () => {
        const isLastNode = currentMessageIndex === messagesChain.length - 1;
        const hasAllMessagesCollected = collectedMessages.length === MESSAGES.length;

        console.log('renderLevel2: Current messagesChain state:', messagesChain);
        console.log('renderLevel2: currentAction=', currentAction, 'hasAllMessagesCollected=', hasAllMessagesCollected, 'collectedMessages.length=', collectedMessages.length, 'MESSAGES.length=', MESSAGES.length);

        return (
            <div className="w-full mt-8 max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-2 border-green-600 flex flex-col items-center">
                {/* Game Title */}
                {renderLevelNavigation()}
                <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-600 drop-shadow-lg font-serif">
                    Chain Master's Adventure
                </h1>
                <p className="text-lg text-green-600 font-semibold mb-2">Level 2: The Path Walker</p>
                <p className="text-md text-pink-400 mb-4">{gameMessage}</p>
                <div className="bg-blue-100 p-4 rounded-lg mb-6 w-full border border-blue-300">
                    <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                    <p className="text-blue-700">{getLevelDescription(2)}</p>
                </div>
            
   <p className="text-lg text-gray-700 mb-6">🧭 You find a map, it leads to a cave, inside you find a key, which opens a door to the treasure.</p>
                <div className="relative  mr-16 w-full h-96 rounded-lg flex items-center justify-center p-4">
                    {/* Nodes */}
                    {messagesChain.map((node, index) => (
                        <React.Fragment key={node.id}>
                    <motion.div 
                                className={`absolute w-28 h-28 rounded-full flex flex-col items-center justify-center text-white font-bold text-lg border-4 ${
                                    index === currentMessageIndex ? 'border-blue-500 bg-pink-500 scale-110' : 'border-gray-400 bg-gray-500'
                                } ${
                                    collectedMessages.includes(node.content) ? 'bg-green-500 border-green-700' : ''}`}
                                style={{
                                    left: node.x,
                                    top: node.y,
                                }}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <span>{node.content}</span>
                                {collectedMessages.includes(node.content) && <span className="text-sm mt-1">Collected</span>}
                    </motion.div>

                            {/* Pointers (Arrows) */}
                            {index < messagesChain.length - 1 && (
                                <svg
                                    className="absolute"
                                    style={{
                                        left: node.x + 100, // Adjust position to connect nodes
                                        top: node.y + 40,
                                        width: 50, // Length of the arrow
                                        height: 20,
                                    }}
                                >
                                    <line x1="0" y1="10" x2="40" y2="10" stroke="purple" strokeWidth="2" />
                                    <polygon points="40,10 30,5 30,15" fill="purple" />
                                </svg>
                            )}
                        </React.Fragment>
                    ))}

                    {/* Collected Data Display */}
                    <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md text-gray-800 border border-blue-200">
                        <p className="font-semibold text-blue-800">Collected Data:</p>
                        <p className="text-pink-600">{collectedMessages.join(' → ')}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex gap-4">
                    {currentAction === 'GET_DATA' && (
                        <motion.button
                            onClick={getCurrentNodeData}
                            disabled={!hasNextNode() && hasAllMessagesCollected}
                            className={`px-6 py-3 rounded-lg text-white font-semibold ${
                                (!hasNextNode() && hasAllMessagesCollected)
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600'
                            }`}
                        >
                            Get Data (getCurrentData())
                        </motion.button>
                    )}
                    {currentAction === 'MOVE_NEXT' && (
                        <motion.button
                            onClick={moveToNext}
                            disabled={!hasNextNode() && hasAllMessagesCollected}
                            className={`px-6 py-3 rounded-lg text-white font-semibold ${
                                (!hasNextNode() && hasAllMessagesCollected)
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                    : 'bg-green-500 hover:bg-green-600'
                            }`}
                        >
                            Move to Next (getNext())
                        </motion.button>
                    )}
                    {hasAllMessagesCollected && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setShowLevel2Success(true);
                                setLevelObjectiveMet(true);
                                setLevel2Completed(true);
                                handleLevelComplete(2);
                            }}
                            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold"
                        >
                            Complete Level
                        </motion.button>
                    )}
                </div>

                {/* Reset Button for Level 2 */}
                <div className="mt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={initializeLevel2}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold"
                    >
                        Reset Level 2
                    </motion.button>
                </div>

                {/* Next Level Button for Level 2 */}
                {levelObjectiveMet && currentLevel === 2 && (
                    <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => {
                            setCurrentLevel(3);
                            setLevelStartTime(Date.now());
                            setLevelObjectiveMet(false);
                            setLevel2Completed(false);
                        }}
                        className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Next Level (3) →
                    </motion.button>
                )}

                {/* Success Message for Level 2 */}
                {showLevel2Success && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-600 text-xl font-bold mt-6 bg-green-100 p-4 rounded-lg border border-green-300"
                    >
                        🎉 Success! You've created the perfect chain! 🎉
            </motion.div>
                )}
            </div>
        );
    };

    // Render Level 3: The Master Constructor
    const renderLevel3 = () => {
        const isMaxTowers = towerChain.length >= 5;
        return (
            <div className="w-full mt-8 max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-2 border-green-600 flex flex-col items-center">
                {/* Navigation */}
                {renderLevelNavigation()}
                {/* Game Title */}
                <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-600 drop-shadow-lg font-serif">
                    Chain Master's Adventure
                </h1>
                <p className="text-lg text-green-600 font-semibold mb-2">Level 3: The Master Constructor</p>
                <p className="text-md text-pink-400 mb-4">{gameMessage}</p>
                <div className="bg-blue-100 p-4 rounded-lg mb-6 w-full border border-blue-300">
                    <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                    <p className="text-blue-700">{getLevelDescription(3)}</p>
                </div>

                {/* Tower Selection Panel */}
                <div className="grid grid-cols-5 gap-4 mb-8">
                    {Object.values(TOWER_TYPES).map((tower) => (
                            <motion.button
                            key={tower.type}
                            whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                if (isMaxTowers) {
                                    setGameMessage('Maximum number of towers (5) reached!');
                                    return;
                                }
                                setSelectedTower(tower);
                                setGameMessage(`Selected ${tower.type} tower. Choose where to place it!`);
                            }}
                            className={`p-4 rounded-lg flex flex-col items-center font-bold text-lg border-2 transition-all duration-300 shadow-lg ${
                                selectedTower?.type === tower.type
                                    ? 'bg-pink-500 text-white border-pink-600'
                                    : isMaxTowers
                                    ? 'bg-gray-400 text-gray-700 border-gray-400 cursor-not-allowed'
                                    : 'bg-pink-200 text-pink-800 hover:bg-pink-300 border-pink-400'
                            }`}
                        >
                            <span className="text-2xl mb-2">{tower.emoji}</span>
                            <span className="text-sm">{tower.type}</span>
                            </motion.button>
                        ))}
                    </div>

                {/* Tower Chain Visualization */}
                <div className="relative w-full max-w-4xl h-96 bg-gray-50 border border-gray-300 rounded-lg shadow-inner flex items-center justify-center p-4">
                    <div className="flex items-center space-x-8">
                        {towerChain.map((node, index) => (
                            <React.Fragment key={index}>
                                <motion.div
                                    className={`w-24 h-24 rounded-full flex flex-col items-center justify-center text-white font-bold text-lg border-4 ${
                                        node.data.type === selectedTower?.type ? 'bg-pink-500 border-pink-600' : 'bg-gray-500 border-gray-400'
                                    }`}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <span className="text-2xl mb-1">{node.data.emoji}</span>
                                    <span className="text-sm">{node.data.type}</span>
                                    <span className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs border-2 border-white">#{index}</span>
                </motion.div>
                                {index < towerChain.length - 1 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-purple-600 text-3xl font-bold"
                                    >
                                        →
                                    </motion.div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Insertion Buttons */}
                <div className="mt-8 flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            if (selectedTower) {
                                insertAtHead(selectedTower);
                                setSelectedTower(null);
                            }
                        }}
                        disabled={!selectedTower || isMaxTowers}
                        className={`px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${
                            !selectedTower || isMaxTowers
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                    >
                        Insert at Head
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            if (selectedTower) {
                                insertAtTail(selectedTower);
                                setSelectedTower(null);
                            }
                        }}
                        disabled={!selectedTower || isMaxTowers}
                        className={`px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${
                            !selectedTower || isMaxTowers
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                    >
                        Insert at Tail
                    </motion.button>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setBlueprintVisible(!blueprintVisible)}
                        className="px-6 py-3 rounded-lg font-bold text-lg shadow-lg bg-blue-500 text-white hover:bg-blue-600"
                    >
                        {blueprintVisible ? 'Hide Blueprint' : 'Show Blueprint'}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            if (towerChain.length === 5) {
                                setLevelObjectiveMet(true);
                                setLevel3Completed(true);
                                handleLevelComplete(3);
                            }
                        }}
                        disabled={towerChain.length !== 5}
                        className={`px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${
                            towerChain.length === 5
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        }`}
                    >
                        Complete Level
                    </motion.button>
                </div>

                {/* Reset Button */}
                <div className="mt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={initializeLevel3}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold"
                    >
                        Reset Level
                    </motion.button>
                </div>

                {/* Success Message for Level 3 */}
                {levelObjectiveMet && currentLevel === 3 && (
                <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-600 text-xl font-bold mt-6 bg-green-100 p-4 rounded-lg border border-green-300"
                    >
                        🎉 Success! You've created the perfect chain! 🎉
                    </motion.div>
                )}

                {/* Next Level Button for Level 3 */}
                {levelObjectiveMet && currentLevel === 3 && (
                    <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                        onClick={() => setCurrentLevel(4)}
                        className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Next Level (4) →
                    </motion.button>
                )}
            </div>
        );
    };

    // Render Level 4: The Link Breaker & Mender
    const renderLevel4 = () => {
        return (
            <div className="w-full mt-8 max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-2 border-green-600 flex flex-col items-center">
                {renderLevelNavigation()}
                <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-600 drop-shadow-lg font-serif">
                    Chain Master's Adventure
                </h1>
                <p className="text-lg text-green-600 font-semibold mb-2">Level 4: Chain Repair</p>
                <p className="text-md text-pink-400 mb-4">{gameMessage}</p>
                <div className="bg-blue-100 p-4 rounded-lg mb-6 w-full border border-blue-300">
                    <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                    <p className="text-blue-700">{getLevelDescription(4)}</p>
                            </div>

                {/* Corrupted Chain Visualization */}
                <div className="relative max-w-6xl max-w-4xl h-96 bg-gray-50 border border-gray-300 rounded-lg shadow-inner flex items-center justify-center p-4">
                    <div className="flex items-center space-x-8">
                        {corruptedChain.map((node, index) => (
                                    <React.Fragment key={index}>
                                        <motion.div
                                    className={`w-36 h-24 rounded-full flex flex-col items-center justify-center text-white font-bold text-lg border-4 ${
                                        node.data.isCorrupted ? 'bg-pink-500 border-pink-600' : node.data.color + ' border-gray-400'
                                    }`}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <span className="text-2xl mb-1">{node.data.emoji}</span>
                                    <span className="text-sm">{node.data.type}</span>
                                    <span className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs border-2 border-white">#{index}</span>
                                    {node.data.isCorrupted && <span className="text-xs mt-1 text-white">Corrupted!</span>}
                                        </motion.div>
                                {index < corruptedChain.length - 1 && (
                                            <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-purple-600 text-3xl font-bold"
                                    >
                                        →
                                            </motion.div>
                                        )}
                                    </React.Fragment>
                                ))}
                    </div>
                </div>

                {/* Deletion Buttons */}
                <div className="mt-8 flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={deleteAtHead}
                        disabled={corruptedChain.length === 0}
                        className={`px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${
                            corruptedChain.length === 0
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                    >
                        Delete at Head
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={deleteAtTail}
                        disabled={corruptedChain.length === 0}
                        className={`px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${
                            corruptedChain.length === 0
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                    >
                        Delete at Tail
                    </motion.button>
                </div>

                {/* Challenge Check Button */}
                <div className="mt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={checkCorruptedChain}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold"
                    >
                        Check Chain Integrity
                    </motion.button>
                </div>

                {/* Reset Button */}
                <div className="mt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={initializeLevel4}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold"
                    >
                        Reset Level
                    </motion.button>
                </div>

                {/* Success Message for Level 4 */}
                {showLevel4Success && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-600 text-xl font-bold mt-6 bg-green-100 p-4 rounded-lg border border-green-300"
                    >
                        🎉 Success! You've created the perfect chain! 🎉
                    </motion.div>
                )}

                {/* Next Level Button for Level 4 */}
                {levelObjectiveMet && currentLevel === 4 && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => setCurrentLevel(5)}
                        className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Next Level (5) →
                    </motion.button>
                )}
            </div>
        );
    };

    // Render Level 5: The Mystical Realm
    const renderLevel5 = () => {
        const isChainFull = doubleLinkedListChain.length >= 6;
        return (
            <div className="w-full mt-8 max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-2 border-green-600 flex flex-col items-center">
                {renderLevelNavigation()}
                <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-600 drop-shadow-lg font-serif">
                    Chain Master's Adventure
                </h1>
                <p className="text-lg text-green-600 font-semibold mb-2">Level 5: Twin Chain Mastery</p>
                <p className="text-md text-pink-400 mb-4">{gameMessage}</p>
                <div className="bg-blue-100 p-4 rounded-lg mb-6 w-full border border-blue-300">
                    <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                    <p className="text-blue-700">{getLevelDescription(5)}</p>
                    </div>

                {/* Realm Selection for Insertion */}
                <div className="grid grid-cols-6 gap-4 mb-8">
                    {MYSTICAL_REALMS.map((realm, index) => (
                        <motion.button
                            key={realm.type}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => insertDoubleNode(realm, doubleLinkedListChain.length)}
                            disabled={isChainFull}
                            className={`p-4  rounded-lg flex flex-col items-center font-bold text-lg border-2 transition-all duration-300 shadow-lg ${
                                isChainFull ? 'bg-gray-400 text-gray-700 border-gray-400 cursor-not-allowed' : 'bg-pink-200 text-pink-800 hover:bg-pink-300 border-pink-400'
                            }`}
                        >
                            <span className="text-2xl mb-2">{realm.emoji}</span>
                            <span className="text-sm">{realm.type}</span>
                        </motion.button>
                    ))}
                </div>

                {/* Doubly Linked List Visualization */}
                <div className="relative w-full max-w-6xl h-96 bg-gray-50 border border-gray-300 rounded-lg shadow-inner flex items-center justify-center p-4">
                    <div className="flex items-center space-x-8">
                        {doubleLinkedListChain.map((node, index) => (
                            <React.Fragment key={index}>
                                <motion.div
                                    className={`w-24 h-24  rounded-full flex flex-col items-center justify-center text-white font-bold text-lg border-4 ${
                                        index === currentDoubleNodeIndex ? 'bg-pink-500 border-pink-600' : 'bg-gray-500 border-gray-400'
                                    }`}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <span className="text-2xl mb-1">{node.data.emoji}</span>
                                    <span className="text-sm">{node.data.type}</span>
                                    <span className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs border-2 border-white">#{index}</span>
                </motion.div>
                                {index < doubleLinkedListChain.length - 1 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        className="text-purple-600 text-3xl font-bold"
                                        >
                                            ↔
                                        </motion.div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Traversal Controls for Level 5 */}
                    <div className="mt-8 flex gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={traverseForward}
                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold"
                        >
                            Move Forward
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={traverseBackward}
                            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold"
                        >
                            Move Backward
                        </motion.button>
                    </div>

                {/* Traversal and Check Buttons */}
                <div className="mt-8 flex gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={traverseBackward}
                        disabled={currentDoubleNodeIndex === 0}
                        className={`px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${
                            currentDoubleNodeIndex === 0
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                    >
                        Traverse Backward
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={traverseForward}
                        disabled={currentDoubleNodeIndex === doubleLinkedListChain.length - 1}
                        className={`px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${
                            currentDoubleNodeIndex === doubleLinkedListChain.length - 1
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                    >
                        Traverse Forward
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={checkDoublyLinkedList}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold"
                    >
                        Check Bridge
                    </motion.button>
                </div>

                {/* Reset Button */}
                <div className="mt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={initializeLevel5}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold"
                    >
                        Reset Level
                    </motion.button>
                </div>

                {/* Success Message for Level 5 */}
                {showLevel5Success && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                        className="text-green-600 text-xl font-bold mt-6 bg-green-100 p-4 rounded-lg border border-green-300"
                    >
                        🎉 Success! You've created the perfect chain! 🎉
                    </motion.div>
                )}

                {/* Next Level Button for Level 5 */}
                {levelObjectiveMet && currentLevel === 5 && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => setCurrentLevel(6)}
                        className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Next Level (6) →
                    </motion.button>
                )}
            </div>
        );
    };

    // Render Level 6: The Portal Network
    const renderLevel6 = () => {
        return (
            <div className="w-full mt-8 max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-2 border-green-600 flex flex-col items-center">
                {renderLevelNavigation()}
                <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-600 drop-shadow-lg font-serif">
                    Chain Master's Adventure
                </h1>
                <p className="text-lg text-green-600 font-semibold mb-2">Level 6: Reversible Portal Network</p>
                <p className="text-md text-pink-400 mb-4">{gameMessage}</p>
                <div className="bg-blue-100 p-4 rounded-lg mb-6 w-full border border-blue-300">
                    <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                    <p className="text-blue-700">{getLevelDescription(6)}</p>
                </div>

                {/* Portal Selection Panel */}
                <div className="grid grid-cols-5 gap-4 mb-8">
                    {Object.values(PORTAL_TYPES).map(portal => (
                        <button
                            key={portal.type}
                            onClick={() => setSelectedPortalType(portal)}
                            className={`p-4 rounded-lg shadow-md text-3xl font-bold border-2 transition-all duration-300 flex flex-col items-center justify-center ${selectedPortalType?.type === portal.type ? 'bg-pink-500 text-white border-pink-600' : 'bg-pink-200 text-pink-800 hover:bg-pink-300 border-pink-400'}`}
                        >
                            <span>{portal.emoji}</span>
                            <span className="text-sm mt-1">{portal.type}</span>
                        </button>
                    ))}
                </div>

                {/* Portal Network Visualization */}
                <div className="relative w-full max-w-6xl h-96 bg-gray-50 border border-gray-300 rounded-lg shadow-inner flex items-center justify-center p-4">
                    <div className="flex items-center space-x-8">
                        {portalNetwork.map((node, index) => (
                            <React.Fragment key={index}>
                                <div
                                    className={`relative flex flex-col items-center justify-center w-24 h-24 rounded-full shadow-lg border-4 font-bold text-lg ${node.data.type === selectedPortalType?.type ? 'bg-pink-500 border-pink-600 text-white' : 'bg-gray-500 border-gray-400 text-white'}`}
                                >
                                    <span className="text-2xl">{node.data.emoji}</span>
                                    <span className="text-xs mt-1">{node.data.type}</span>
                                    <span className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs border-2 border-white">#{index}</span>
                                </div>
                                {index < portalNetwork.length - 1 && (
                                    <div className="text-purple-600 text-3xl font-bold">→</div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-8 mt-8">
                    <button
                        onClick={() => {
                            if (selectedPortalType) {
                                insertDoubleNodeAtPosition(selectedPortalType, 0);
                                setSelectedPortalType(null);
                            } else {
                                setGameMessage('Please select a portal to insert!');
                            }
                        }}
                        className={`py-3 px-6 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${!selectedPortalType ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                    >
                        Insert at Head
                    </button>
                    <button
                        onClick={() => {
                            if (selectedPortalType) {
                                insertDoubleNodeAtPosition(selectedPortalType, portalNetwork.length);
                                setSelectedPortalType(null);
                            } else {
                                setGameMessage('Please select a portal to insert!');
                            }
                        }}
                        className={`py-3 px-6 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${!selectedPortalType ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                    >
                        Insert at Tail
                    </button>
                    <button
                        onClick={() => deleteDoubleNodeAtPosition(0)}
                        className="py-3 px-6 rounded-lg font-bold text-lg shadow-lg bg-green-500 text-white hover:bg-green-600"
                    >
                        Delete from Head
                    </button>
                    <button
                        onClick={() => deleteDoubleNodeAtPosition(portalNetwork.length - 1)}
                        className="py-3 px-6 rounded-lg font-bold text-lg shadow-lg bg-green-500 text-white hover:bg-green-600"
                    >
                        Delete from Tail
                    </button>
                    <button
                        onClick={checkPortalNetwork}
                        className="py-3 px-6 rounded-lg font-bold text-lg shadow-lg bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Check Portal Network
                    </button>
                </div>

                {/* Success Message for Level 6 */}
                {showLevel6Success && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-600 text-xl font-bold mt-6 bg-green-100 p-4 rounded-lg border border-green-300"
                    >
                        🎉 Success! You've created the perfect chain! 🎉
                    </motion.div>
                )}

                {/* Next Level Button for Level 6 */}
                {levelObjectiveMet && currentLevel === 6 && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => setCurrentLevel(7)}
                        className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Next Level (7) →
                    </motion.button>
                )}
            </div>
        );
    };


    // Level 7: Render Circular Linked List UI
    const renderLevel7 = () => {
        return (
            <div className="w-full mt-8 max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-2 border-green-600 flex flex-col items-center">
                {renderLevelNavigation()}
                <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-600 drop-shadow-lg font-serif">
                    Chain Master's Adventure
                </h1>
                <p className="text-lg text-green-600 font-semibold mb-2">Level 7: The Circle of Unity</p>
                <p className="text-md text-pink-400 mb-4">{gameMessage}</p>
                <div className="bg-blue-100 p-4 rounded-lg mb-6 w-full border border-blue-300">
                    <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                    <p className="text-blue-700">{getLevelDescription(7)}</p>
                </div>

                 {/* Create Circular Chain Button */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <button
                        onClick={createCircularChain}
                        disabled={seasonChain.length > 0}
                        className={`px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${seasonChain.length > 0 ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-pink-500 text-white hover:bg-pink-600'}`}
                    >
                        Create Circular Chain of Seasons
                    </button>
                </div>

                {/* Circular Chain Visualization */}
                <div className="relative flex justify-center items-center h-64 mb-8 w-full">
                    {seasonChain.length === 0 ? (
                        <p className="text-gray-500">Chain is empty. Create the Circle of Seasons!</p>
                    ) : (
                        <div className="flex items-center justify-center relative w-full h-full">
                            {seasonChain.map((node, index) => {
                                const angle = (360 / seasonChain.length) * index;
                                const radius = 100;
                                const centerX = 200;
                                const centerY = 100;
                                const x = centerX + radius * Math.cos(angle * Math.PI / 180);
                                const y = centerY + radius * Math.sin(angle * Math.PI / 180);
                                const nextNodeIndex = (index + 1) % seasonChain.length;
                                const nextAngle = (360 / seasonChain.length) * nextNodeIndex;
                                const nextX = centerX + radius * Math.cos(nextAngle * Math.PI / 180);
                                const nextY = centerY + radius * Math.sin(nextAngle * Math.PI / 180);
                                const midX = (x + nextX) / 2;
                                const midY = (y + nextY) / 2;
                                const arrowAngle = Math.atan2(nextY - y, nextX - x) * 180 / Math.PI;
                                return (
                                    <React.Fragment key={index}>
                                        <motion.div
                                            className={`absolute w-24 h-24 rounded-full flex flex-col items-center justify-center text-white font-bold text-lg border-4 ${index === currentSeasonTraversalIndex ? 'bg-pink-500 border-pink-600' : 'bg-gray-500 border-gray-400'}`}
                                            style={{
                                                left: `calc(50% + ${x - centerX}px - 48px)`,
                                                top: `calc(50% + ${y - centerY}px - 48px)`,
                                            }}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <span className="text-2xl mb-1">{node.data.emoji}</span>
                                            <span className="text-sm">{node.data.type}</span>
                                            <span className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs border-2 border-white">#{index}</span>
                                        </motion.div>
                                        {seasonChain.length > 0 && (
                                            <svg
                                                className="absolute"
                                                style={{
                                                    left: `calc(50% + ${midX - centerX}px - 20px)`,
                                                    top: `calc(50% + ${midY - centerY}px - 10px)`,
                                                    width: '40px',
                                                    height: '20px',
                                                    transform: `rotate(${arrowAngle}deg)`,
                                                    overflow: 'visible'
                                                }}
                                            >
                                                <line x1="0" y1="10" x2="30" y2="10" stroke="purple" strokeWidth="2" />
                                                <polygon points="30,10 20,5 20,15" fill="purple" />
                                            </svg>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Traversal Controls */}
                <div className="mt-8 flex gap-4 justify-center">
                    <button
                        onClick={() => traverseCircular(1)}
                        disabled={seasonChain.length === 0}
                        className={`px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${seasonChain.length === 0 ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                    >
                        Traverse (1 Step)
                    </button>
                    <button
                        onClick={() => traverseCircular(seasonChain.length)}
                        disabled={seasonChain.length === 0}
                        className={`px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${seasonChain.length === 0 ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                    >
                        Traverse Full Circle
                    </button>
                    <button
                        onClick={detectCycle}
                        disabled={seasonChain.length === 0}
                        className={`px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${seasonChain.length === 0 ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                        Detect Cycle
                    </button>
                </div>

                {/* Reset Button */}
                <div className="mt-4 text-center">
                    <button 
                        onClick={initializeLevel7} 
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-bold shadow-lg"
                    >
                        Reset Level 7
                    </button>
                </div>

                {/* Success Message for Level 7 */}
                    {showLevel7Success && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-green-600 text-xl font-bold mt-6 bg-green-100 p-4 rounded-lg border border-green-300"
                    >
                        🎉 Success! You've created the perfect chain! 🎉
                    </motion.div>
                )}

                {/* Next Level Button for Level 7 */}
                {levelObjectiveMet && currentLevel === 7 && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => setCurrentLevel(8)}
                        className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Next Level (8) →
                    </motion.button>
                    )}

            </div>
        );
    };

    // Render Level 8: Wheel of Fortune UI
    const renderLevel8 = () => {
        const wheelRadius = 150;
        const playerNodeSize = 64; // w-16 h-16
        const centerOffset = wheelRadius + playerNodeSize / 2; // Offset for centering nodes around wheel
        return (
            <div className="w-full mt-8 max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-2 border-green-600 flex flex-col items-center">
                {renderLevelNavigation()}
                <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-600 drop-shadow-lg font-serif">
                    Chain Master's Adventure
                </h1>
                <p className="text-lg text-green-600 font-semibold mb-2">Level 8: Wheel of Fortune</p>
                <p className="text-md text-pink-400 mb-4">{gameMessage}</p>
                <div className="bg-blue-100 p-4 rounded-lg mb-6 w-full border border-blue-300">
                    <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                    <p className="text-blue-700">{getLevelDescription(8)}</p>
                </div>

                {/* Player Selection Panel */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {Object.values(PLAYER_TYPES).map(player => (
                        <button
                            key={player.type}
                            onClick={() => setSelectedPlayer(player)}
                            className={`p-4 rounded-lg shadow-md text-3xl font-bold border-2 transition-all duration-300 flex flex-col items-center justify-center ${selectedPlayer?.type === player.type ? 'bg-pink-500 text-white border-pink-600' : 'bg-pink-200 text-pink-800 hover:bg-pink-300 border-pink-400'}`}
                        >
                            <span>{player.emoji}</span>
                            <span className="text-sm mt-1">{player.type}</span>
                        </button>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-8 mt-8">
                    <button
                        onClick={() => {
                            if (selectedPlayer) {
                                insertInCircular(selectedPlayer, wheelOfFortuneChain.length); // Add at current end
                                setSelectedPlayer(null);
                            } else {
                                setPlayerActionMessage('Please select a player to add!');
                            }
                        }}
                        className={`py-3 px-6 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${!selectedPlayer ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                    >
                        Add Player
                    </button>
                    <button
                        onClick={() => deleteFromCircular(0)}
                        disabled={wheelOfFortuneChain.length === 0}
                        className={`py-3 px-6 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${wheelOfFortuneChain.length === 0 ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                    >
                        Remove from Head
                    </button>
                    <button
                        onClick={() => deleteFromCircular(wheelOfFortuneChain.length - 1)}
                        disabled={wheelOfFortuneChain.length === 0}
                        className={`py-3 px-6 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${wheelOfFortuneChain.length === 0 ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                    >
                        Remove from Tail
                    </button>
                    <button
                        onClick={() => rotateWheel(1)}
                        disabled={wheelOfFortuneChain.length === 0}
                        className={`py-3 px-6 rounded-lg font-bold text-lg shadow-lg transition-all duration-300 ${wheelOfFortuneChain.length === 0 ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                        Rotate Wheel (1 Step)
                    </button>
                    <button
                        onClick={checkTournamentBracket}
                        className="py-3 px-6 rounded-lg font-bold text-lg shadow-lg bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Check Tournament Bracket
                    </button>
                </div>

                {/* Wheel of Fortune Visualization */}
                <div className="relative w-full max-w-xl h-96 mx-auto mb-8 flex justify-center items-center">
                    <motion.div
                        className="relative w-full h-full rounded-full border-4 border-green-500 flex items-center justify-center"
                        animate={{ rotate: rotationPosition }}
                        transition={{ type: 'spring', stiffness: 50, damping: 10 }}
                    >
                        {wheelOfFortuneChain.length === 0 ? (
                            <p className="text-gray-500 text-center">The Wheel is empty. Add players to begin!</p>
                        ) : (
                            wheelOfFortuneChain.map((node, index) => {
                                const angle = (360 / wheelOfFortuneChain.length) * index;
                                const x = wheelRadius * Math.cos(angle * Math.PI / 180);
                                const y = wheelRadius * Math.sin(angle * Math.PI / 180);
                                const nextNodeIndex = (index + 1) % wheelOfFortuneChain.length;
                                const nextAngle = (360 / wheelOfFortuneChain.length) * nextNodeIndex;
                                const nextX = wheelRadius * Math.cos(nextAngle * Math.PI / 180);
                                const nextY = wheelRadius * Math.sin(nextAngle * Math.PI / 180);
                                const midX = (x + nextX) / 2;
                                const midY = (y + nextY) / 2;
                                const arrowAngle = Math.atan2(nextY - y, nextX - x) * 180 / Math.PI;
                                return (
                                    <React.Fragment key={index}>
                                        <motion.div
                                            className={`absolute w-16 h-16 rounded-full flex flex-col items-center justify-center text-white font-bold text-sm border-4 ${node.data.type === selectedPlayer?.type ? 'bg-pink-500 border-pink-600' : 'bg-gray-500 border-gray-400'}`}
                                            style={{
                                                left: `calc(50% + ${x - playerNodeSize / 2}px)`,
                                                top: `calc(50% + ${y - playerNodeSize / 2}px)`,
                                            }}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1, rotate: -rotationPosition }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <span className="text-2xl">{node.data.emoji}</span>
                                            <span className="text-xs mt-1">{node.data.type}</span>
                                            <span className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs border-2 border-white">#{index}</span>
                                        </motion.div>
                                        {wheelOfFortuneChain.length > 0 && (
                                            <svg
                                                className="absolute"
                                                style={{
                                                    left: `calc(50% + ${midX}px - 20px)`,
                                                    top: `calc(50% + ${midY}px - 10px)`,
                                                    width: '40px',
                                                    height: '20px',
                                                    transform: `rotate(${arrowAngle}deg)`,
                                                    overflow: 'visible'
                                                }}
                                            >
                                                <line x1="0" y1="10" x2="30" y2="10" stroke="purple" strokeWidth="2" />
                                                <polygon points="30,10 20,5 20,15" fill="purple" />
                                            </svg>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </motion.div>
                </div>

                {/* Status and Success Message */}
                <div className="text-center mt-4">
                    <p className="text-xl font-semibold text-gray-800">
                        Players on Wheel: {wheelOfFortuneChain.length}/{CORRECT_TOURNAMENT_ORDER.length}
                    </p>
                    <p className="text-md text-gray-600">
                        {playerActionMessage}
                    </p>
                    {showLevel8Success && (
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-green-600 text-xl font-bold mt-6 bg-green-100 p-4 rounded-lg border border-green-300"
                        >
                            🎉 Success! You've created the perfect chain! 🎉
                        </motion.div>
                    )}
                </div>

                {/* Next Level Button for Level 8 */}
                {levelObjectiveMet && currentLevel === 8 && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                                    onClick={() => {
                                        setCurrentLevel(9);
                                        handleLevelComplete(8);
                                    }}
                        className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Next Level (9) →
                                </motion.button>
                )}
            </div>
        );
    };

    // Render Level 9: Chain Transformation UI
    const renderLevel9 = () => {
        const puzzleStepDescriptions = {
            0: "Current Challenge: Convert the Singly Linked List to a Doubly Linked List!",
            1: "Next Challenge: Convert the Doubly Linked List to a Circular Linked List!",
            2: "Final Challenge: Convert the Circular Linked List back to a Singly Linked List to unlock the vault!"
        };

        return (
            <div className="w-full mt-8 max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-2 border-green-600 flex flex-col items-center">
                {renderLevelNavigation()}
                <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-600 drop-shadow-lg font-serif">
                    Chain Master's Adventure
                </h1>
                <p className="text-lg text-green-600 font-semibold mb-2">Level 9: Chain Transformation</p>
                <p className="text-md text-pink-400 mb-4">{gameMessage}</p>
                <div className="bg-blue-100 p-4 rounded-lg mb-6 w-full border border-blue-300">
                    <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                    <p className="text-blue-700">{getLevelDescription(9)}</p>
                </div>

                <p className="text-lg text-gray-700 mb-6 text-center">
                    Transform chains between different magical forms to solve ancient puzzles and unlock the vault.
                </p>
                <p className="text-lg text-gray-700 mb-6 text-center">
                    For completion of this task, you need to check all three types of linked list:
                </p>
                <p className="text-lg text-gray-700 mb-6 text-center">
                    Check in this format: Doubly → Circular → Singly
                </p>
                <p className="text-lg font-bold text-blue-800 mb-6 text-center">
                    {transformationMessage || puzzleStepDescriptions[currentTransformationStep]}
                </p>

                {/* Chain Visualization */}
                <div className="relative w-full max-w-3xl h-64 mx-auto mb-8 bg-white border-2 border-green-300 rounded-lg shadow-inner flex items-center justify-center p-4">
                    {transformationChain.length === 0 ? (
                        <p className="text-gray-500">Chain is empty. Start a transformation!</p>
                    ) : (
                        // Conditional rendering based on chain type
                        currentChainType === 'circular' ? (
                            <div className="flex items-center justify-center relative w-full h-full">
                                {transformationChain.map((node, index) => {
                                    const angle = (360 / transformationChain.length) * index;
                                    const radius = 90; // Adjust radius as needed for desired circle size
                                    const centerX = 384; // Center of 768px width container
                                    const centerY = 128; // Center of 256px height container
                                    const x = centerX + radius * Math.cos(angle * Math.PI / 180);
                                    const y = centerY + radius * Math.sin(angle * Math.PI / 180);

                                    // Calculate position for arrows between nodes
                                    const nextNodeIndex = (index + 1) % transformationChain.length;
                                    const nextAngle = (360 / transformationChain.length) * nextNodeIndex;
                                    const nextX = centerX + radius * Math.cos(nextAngle * Math.PI / 180);
                                    const nextY = centerY + radius * Math.sin(nextAngle * Math.PI / 180);

                                    // Calculate midpoint for arrow placement
                                    const midX = (x + nextX) / 2;
                                    const midY = (y + nextY) / 2;

                                    // Calculate angle for arrow rotation
                                    const arrowAngle = Math.atan2(nextY - y, nextX - x) * 180 / Math.PI;

                                    return (
                                        <React.Fragment key={node.data.id}>
                                            <motion.div
                                                className={`absolute w-20 h-20 rounded-full flex flex-col items-center justify-center text-white font-bold text-lg border-4 bg-pink-500 border-pink-600`}
                                                style={{
                                                    left: `${x - 40}px`,
                                                    top: `${y - 40}px`,
                                                }}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <span className="text-2xl">{node.data.id}</span>
                                                <span className="text-xs mt-1">Circular</span>
                                            </motion.div>

                                            {transformationChain.length > 0 && (
                                                <svg
                                                    className="absolute"
                                                    style={{
                                                        left: `${midX - 20}px`,
                                                        top: `${midY - 10}px`,
                                                        width: '40px',
                                                        height: '20px',
                                                        transform: `rotate(${arrowAngle}deg)`,
                                                        overflow: 'visible'
                                                    }}
                                                >
                                                    <line x1="0" y1="10" x2="30" y2="10" stroke="purple" strokeWidth="2" />
                                                    <polygon points="30,10 20,5 20,15" fill="purple" />
                                                </svg>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        ) : (
                            // Linear view for singly and doubly linked lists
                            <div className="flex items-center space-x-8">
                                {transformationChain.map((node, index) => (
                                    <React.Fragment key={node.data.id}>
                                        <motion.div
                                            className={`w-24 h-24 rounded-lg flex flex-col items-center justify-center text-white font-bold text-lg border-4
                                                ${currentChainType === 'singly' ? 'bg-blue-600 border-blue-700' :
                                                  'bg-green-600 border-green-700'}
                                            `}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <span className="text-2xl">{node.data.id}</span>
                                            <span className="text-xs mt-1">{currentChainType}</span>
                                        </motion.div>
                                        {index < transformationChain.length - 1 && (
                                            <div className="flex flex-col items-center">
                                                <span className="text-purple-500 text-2xl">→</span>
                                                {currentChainType === 'doubly' && (
                                                    <span className="text-purple-500 text-2xl">←</span>
                                                )}
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        ))}

                </div>

                {/* Transformation Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <button
                        onClick={convertToDoubly}
                        disabled={currentChainType !== 'singly' || isTransforming}
                        className={`px-6 py-3 rounded-lg text-lg font-bold text-white shadow-lg transition-all duration-300 ${currentChainType !== 'singly' || isTransforming ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                        Convert to Doubly
                    </button>
                    <button
                        onClick={convertToCircular}
                        disabled={currentChainType === 'circular' || isTransforming}
                        className={`px-6 py-3 rounded-lg text-lg font-bold text-white shadow-lg transition-all duration-300 ${currentChainType === 'circular' || isTransforming ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'}`}
                    >
                        Convert to Circular
                    </button>
                    <button
                        onClick={convertToSingly}
                        disabled={currentChainType !== 'circular' || isTransforming}
                        className={`px-6 py-3 rounded-lg text-lg font-bold text-white shadow-lg transition-all duration-300 ${currentChainType !== 'circular' || isTransforming ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        Convert to Singly
                    </button>
                    <button
                        onClick={reverseTransform}
                        disabled={isTransforming}
                        className={`px-6 py-3 rounded-lg text-lg font-bold text-white shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1
                            ${isTransforming ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}
                        `}
                    >
                        Reset Transformation
                    </button>
                </div>

                {/* Vault and Success Message */}
                <div className="text-center mt-4">
                    <p className="text-xl font-semibold text-gray-800">
                        Current Chain Type: <span className="font-bold text-indigo-700">{currentChainType.toUpperCase()}</span>
                    </p>
                    {vaultUnlocked && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-green-600 text-2xl font-bold mt-4 animate-bounce"
                        >
                            <span role="img" aria-label="success">🔓</span> Vault Unlocked! <span role="img" aria-label="success">🎉</span>
                            {showLevel9Success && (
                                <div className="mt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setCurrentLevel(10);
                                            handleLevelComplete(9);
                                        }}
                                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
                                    >
                                        Next Level (10) →
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Reset Button (can also use reverseTransform for this) */}
                <div className="absolute bottom-4 right-4">
                    <button 
                        onClick={initializeLevel9} 
                        className="btn-secondary bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg shadow"
                    >
                        Reset Level 9
                    </button>
                </div>
            </div>
        );
    };

    // These functions were causing conditional hook errors, moved to top
    // Level 2: Get Current Node Data
    const getCurrentNodeData = () => {
        if (messagesChain.length > 0 && currentMessageIndex < messagesChain.length) {
            const data = messagesChain[currentMessageIndex].content;
            setCollectedMessages(prev => {
                if (!prev.includes(data)) {
                    return [...prev, data];
                }
                return prev;
            });
            setGameMessage(`Collected: ${data}`);
            setCurrentAction('MOVE_NEXT');
        } else {
            setGameMessage('No data to collect or reached end of chain.');
        }
    };

    // Level 2: Check if there is a next node
    const hasNextNode = () => {
        return currentMessageIndex < messagesChain.length - 1;
    };

    // Level 2: Move to next node
    const moveToNext = () => {
        if (hasNextNode()) {
            setCurrentMessageIndex(prevIndex => prevIndex + 1);
            setGameMessage('Moved to next island. Now get data!');
            setCurrentAction('GET_DATA');
        } else {
            setGameMessage('Reached the end of the path! Collect the last treasure.');
            setCurrentAction('COMPLETE_LEVEL');
        }
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
            default:
                return (
                    <div className="text-center text-white text-2xl mt-20">
                        <p>Welcome to Chain Master\'s Adventure!</p>
                        <button
                            onClick={() => setCurrentLevel(1)}
                            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Start Adventure
                        </button>
                    </div>
                );
        }
    };

    // Helper function to create a new node
    const createNode = (data) => {
        const newNode = new Node(data);
        setChain(prevChain => [...prevChain, newNode]);
        setGameMessage(`Created a new node with data: ${data}`);
    };

    // Helper function to connect nodes in the chain
    const connectNodes = () => {
        if (chain.length < 2) {
            setGameMessage('Need at least 2 nodes to connect!');
            return;
        }

        const newChain = [...chain];
        for (let i = 0; i < newChain.length - 1; i++) {
            newChain[i].next = newChain[i + 1];
        }
        setChain(newChain);
        setGameMessage('Nodes connected successfully!');
    };

    // Helper function to check if the chain is correct
    const checkChain = () => {
        if (chain.length !== correctChainOrder.length) {
            setGameMessage('Chain length is incorrect!');
            return;
        }

        let isCorrect = true;
        for (let i = 0; i < chain.length; i++) {
            if (chain[i].data !== correctChainOrder[i]) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            setShowSuccess(true);
            setLevelObjectiveMet(true);
            setGameMessage('Perfect chain created!');
        } else {
            setGameMessage('Chain order is incorrect. Try again!');
        }
    };

    // Helper function to get level descriptions
    const getLevelDescription = (level) => {
        const descriptions = {
            1: "Level 1: The Beginning - Create your first singly linked list.",
            2: "Level 2: The Bridge - Connect nodes to form a bridge.",
            3: "Level 3: The Maze - Navigate through a maze using a singly linked list.",
            4: "Level 4: The Treasure Hunt - Find the treasure by traversing the list.",
            5: "Level 5: The Portal - Master the art of inserting and deleting nodes.",
            6: "Level 6: Portal Network - Master the art of inserting and deleting nodes.",
            7: "Level 7: Eternal Seasons - Create a circular linked list of seasons.",
            8: "Level 8: Wheel of Fortune - Build a circular linked list for the tournament.",
            9: "Level 9: Chain Transformation - Transform chains between different magical forms to solve ancient puzzles.",
            10: "Level 10: The Grand Chain Challenge - Master of All Chains"
        };
        return descriptions[level] || "Unknown level";
    };

    const renderLevel10 = () => {
    return (
            <div className="w-full mt-8 max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 border-2 border-green-600 flex flex-col items-center">
                {renderLevelNavigation()}
                <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-600 drop-shadow-lg font-serif">
                    Chain Master's Adventure
                </h1>
                <p className="text-lg text-green-600 font-semibold mb-2">Level 10: Deletion Master</p>
                <p className="text-md text-pink-400 mb-4">{gameMessage}</p>
                <div className="bg-blue-100 p-4 rounded-lg mb-6 w-full border border-blue-300">
                    <h3 className="font-bold text-blue-800 mb-2">Learning Objective:</h3>
                    <p className="text-blue-700">{getLevelDescription(10)}</p>
                </div>
                
                {currentLevel === 10 && (
                    <div className="w-full max-w-4xl mx-auto">
                        <div className="bg-white border-2 border-green-300 rounded-lg p-6 mb-6 shadow-lg">
                            <h3 className="text-xl font-semibold mb-4 text-blue-800">Current Challenge:</h3>
                            {puzzleChain[currentPuzzleIndex] && (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h4 className="text-lg font-bold mb-2 text-blue-700">{puzzleChain[currentPuzzleIndex].data.title}</h4>
                                    <p className="mb-4 text-gray-700">{puzzleChain[currentPuzzleIndex].data.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            Difficulty: {puzzleChain[currentPuzzleIndex].data.points} points
                                        </span>
                                        <button
                                            onClick={toggleHint}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                        >
                                            {showHint ? 'Hide Hint' : 'Show Hint'}
                                        </button>
                                    </div>
                                    {showHint && (
                                        <p className="mt-4 p-3 bg-blue-100 rounded text-sm border border-blue-200 text-blue-800">
                                            Hint: {puzzleChain[currentPuzzleIndex].data.hint}
                                        </p>
                                    )}
                                </div>
                            )}
            </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white border-2 border-green-300 rounded-lg p-6 shadow-lg">
                                <h3 className="text-xl font-semibold mb-4 text-blue-800">Your Solution:</h3>
                                <div className="space-y-4">
                                    <div className="p-3 bg-gray-100 rounded mb-4 border border-gray-200">
                                        <p className="text-sm mb-2 text-gray-600">Original List:</p>
                                        <p className="font-mono text-gray-800">{currentList.join(' → ')}</p>
            </div>
                                    <div className="flex space-x-2">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <button
                                                key={num}
                                                onClick={() => setPuzzleInput(prev => [...prev, num])}
                                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setPuzzleInput([])}
                                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                        >
                                            Clear
                                        </button>
                                        <button
                                            onClick={() => handlePuzzleSubmit(puzzleInput)}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                    <div className="mt-4 p-3 bg-gray-100 rounded border border-gray-200">
                                        <p className="text-sm text-gray-600">Your Solution: {Array.isArray(puzzleInput) ? puzzleInput.join(' → ') : ''}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border-2 border-green-300 rounded-lg p-6 shadow-lg">
                                <h3 className="text-xl font-semibold mb-4 text-blue-800">Progress:</h3>
                                <div className="space-y-2">
                                    {puzzleChain.map((puzzle, index) => (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-lg border-2 ${
                                                index === currentPuzzleIndex
                                                    ? 'bg-pink-100 border-pink-300'
                                                    : solvedPuzzles.includes(puzzle)
                                                    ? 'bg-green-100 border-green-300'
                                                    : 'bg-gray-100 border-gray-300'
                                            }`}
                                        >
                                            <p className="font-semibold text-gray-800">{puzzle.data.title}</p>
                                            <p className="text-sm text-gray-600">
                                                {solvedPuzzles.includes(puzzle)
                                                    ? '✅ Solved'
                                                    : index === currentPuzzleIndex
                                                    ? '🔄 Current Challenge'
                                                    : '⏳ Not Started'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Success Message */}
                        {showLevel10Success && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="mt-8 text-center bg-green-100 p-6 rounded-lg border border-green-300"
                            >
                                <h3 className="text-2xl font-bold text-green-700 mb-4">
                                    🎉 Congratulations! You've mastered node deletion in all types of linked lists! 🎉
                                </h3>
                                {showDashboardButton && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            navigate('/');
                                            handleLevelComplete(10);
                                        }}
                                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg"
                                    >
                                        Return to Dashboard
                                    </motion.button>
                                )}
                            </motion.div>
                        )}
                    </div>
                )}
        </div>
    );
};

    const renderSuccessMessage = () => {
      if (!showSuccess) return null;

      const isLevelCompleted = completedLevels.has(currentLevel);

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              {isLevelCompleted ? "Level Already Completed!" : "Level Complete!"}
            </h2>
            <p className="text-gray-700 mb-2">
              {isLevelCompleted
                ? "You have already completed this level. Move to the next level!"
                : "Congratulations! You completed this level."}
            </p>
            <div className="flex flex-col gap-4">
              {currentLevel < 6 && (
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    setCurrentLevel(currentLevel + 1);
                  }}
                  className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
                >
                  Next Level
                </button>
              )}
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setCurrentLevel(1);
                }}
                className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
              >
                Go to Level 1
              </button>
            </div>
          </div>
        </div>
      );
    };

    // New function to check if a level is unlocked
    const isLevelUnlocked = (levelNum) => {
        if (levelNum === 1) return true; // Level 1 is always unlocked
        return completedLevels.has(levelNum - 1); // Previous level must be completed
    };

    // New function to handle level selection
    const handleLevelSelect = (levelNum) => {
        if (isLevelUnlocked(levelNum)) {
            setCurrentLevel(levelNum);
        }
    };

    // New function to render levels menu
    const renderLevelsMenu = () => {
        return (
            <LevelsMenu
                levels={Array.from({ length: 10 }, (_, i) => i + 1)}
                completedLevels={completedLevels}
                onLevelSelect={handleLevelSelect}
            />
        );
    };

    // Navigation Bar (for all levels)
    const renderLevelNavigation = () => {
        // Fallback: get completed levels from arraysGameProgress if available
        let arraysCompleted = new Set();
        if (window.arraysGameProgress && Array.isArray(window.arraysGameProgress.levels)) {
            arraysCompleted = new Set(window.arraysGameProgress.levels.filter(l => l.completed).map(l => l.level));
        }
        return (
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center mb-8">
                {/* Previous/Next Buttons and Level Number */}
                <div className="flex justify-between items-center w-full mb-4">
                    <button
                        onClick={() => setCurrentLevel(Math.max(1, currentLevel - 1))}
                        disabled={currentLevel === 1}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg
                            ${currentLevel === 1
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105'}
                        `}
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
                                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105'}
                        `}
                    >
                        Next Level →
                    </button>
                </div>
                {/* Level Indicators */}
                <div className="flex space-x-4 flex-wrap justify-center">
                    {Array.from({ length: 10 }, (_, index) => {
                        const levelNumber = index + 1;
                        const backendCompleted = linkedListGameProgress?.gameLevels?.find(gl => gl.level === levelNumber)?.completed;
                        const isCompleted = completedLevels.has(levelNumber) || backendCompleted || arraysCompleted.has(levelNumber);
                        const isCurrent = currentLevel === levelNumber;
                        return (
                            <button
                                key={levelNumber}
                                onClick={() => setCurrentLevel(levelNumber)}
                                className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shadow-lg transition-all duration-300 border-2
                                    ${isCurrent
                                        ? 'bg-green-500 text-white scale-110 border-green-600 z-10'
                                        : isCompleted
                                            ? 'bg-green-700 text-white border-green-800'
                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-green-50 hover:border-green-300'}
                                    hover:scale-105`}
                                title={`Level ${levelNumber}`}
                                style={{ fontSize: '1.5rem' }}
                            >
                                {levelNumber}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (user) {
            loadProgress();
        }
    }, [currentLevel, user, loadProgress]);

    console.log('Rendering navigation, completedLevels:', completedLevels, 'linkedListGameProgress:', linkedListGameProgress);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 py-8 relative">
            <div className="absolute inset-0 pointer-events-none z-0">
                <GameDecorations />
            </div>
            <div className="max-w-7xl mx-auto px-4 relative z-10">
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
            {renderSuccessMessage()}
        </div>
    );
};
export default ChainMastersAdventure; 
