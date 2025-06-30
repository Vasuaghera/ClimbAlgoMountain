import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCorners, useDraggable, useDroppable } from '@dnd-kit/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useApi from '../../hooks/useApi';
import GameDecorations from './GameDecorations';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Helper function to generate magical words
const generateMagicalWord = (length) => {
    const words = ['MAGIC', 'SPELL', 'WIZARD', 'POWER', 'MAGIC', 'SCROLL', 'WAND', 'CAST'];
    return words[Math.floor(Math.random() * words.length)];
};

// Helper function to generate tower passwords
const generateTowerPasswords = () => {
    const passwords = ['OPEN', 'LOCK', 'DOOR', 'GATE', 'PORT'];
    const password = passwords[Math.floor(Math.random() * passwords.length)];
    return {
        left: password,
        right: password // Always use the same password for both towers
    };
};

// Helper function to generate treasure map clue
const generateSingleTreasureClue = () => {
    const clues = [
        "TREASURE_MAP_X_MARKS_SPOT",
        "GOLDEN_CHEST_UNDER_X_TREE",
        "X_MARKS_THE_BURIED_TREASURE",
        "FOLLOW_X_TO_FIND_THE_GOLD",
        "TREASURE_LIES_BENEATH_X_MARK"
    ];
    const targetClue = clues[Math.floor(Math.random() * clues.length)];
    const targetChar = 'X';
    
    return {
        clue: targetClue,
        targetChar
    };
};

const WordWizardQuest = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentLevel, setCurrentLevel] = useState(1);
    const [magicalWord, setMagicalWord] = useState('');
    const [gameMessage, setGameMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [targetIndex, setTargetIndex] = useState(null);
    const [selectedChar, setSelectedChar] = useState(null);
    const [levelObjectiveMet, setLevelObjectiveMet] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [progress, setProgress] = useState({});
    const [levelStartTime, setLevelStartTime] = useState(Date.now());
    const [completedLevels, setCompletedLevels] = useState(new Set());

    // Level 2 states
    const [towerPasswords, setTowerPasswords] = useState({ left: '', right: '' });
    const [leftTowerInput, setLeftTowerInput] = useState('');
    const [rightTowerInput, setRightTowerInput] = useState('');
    const [towerAuras, setTowerAuras] = useState({ left: 'neutral', right: 'neutral' });

    // Level 3 states
    const [treasureClue, setTreasureClue] = useState('');
    const [targetChar, setTargetChar] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [foundIndices, setFoundIndices] = useState([]);
    const [searchMessage, setSearchMessage] = useState('');

    // Level 4 states
    const [currentClueIndex, setCurrentClueIndex] = useState(0);
    const [powerWord, setPowerWord] = useState('');
    const [targetSyllable, setTargetSyllable] = useState('');
    const [startIndexInput, setStartIndexInput] = useState('');
    const [endIndexInput, setEndIndexInput] = useState('');
    const [extractedSyllable, setExtractedSyllable] = useState('');
    const [swordCutEffect, setSwordCutEffect] = useState(false);

    // Level 5 states
    const [cursedWord, setCursedWord] = useState('');
    const [targetTransformedWord, setTargetTransformedWord] = useState('');
    const [transformedInput, setTransformedInput] = useState('');
    const [transformMessage, setTransformMessage] = useState('');
    const [transformEffect, setTransformEffect] = useState(false);

    // Level 6 states
    const [prophecyText, setProphecyText] = useState('');
    const [targetPattern, setTargetPattern] = useState('');
    const [regexInput, setRegexInput] = useState('');
    const [matchingResults, setMatchingResults] = useState([]);
    const [regexMessage, setRegexMessage] = useState('');
    const [oracleEffect, setOracleEffect] = useState(false);

    // Level 7 (Puzzle Breaker) states
    const [puzzleString, setPuzzleString] = useState('');
    const [targetSplitResult, setTargetSplitResult] = useState([]);
    const [delimiterInput, setDelimiterInput] = useState('');
    const [splitResults, setSplitResults] = useState([]);
    const [puzzleMessage, setPuzzleMessage] = useState('');
    const [puzzleEffect, setPuzzleEffect] = useState(false);

    // Level 6 (Word Forge) states
    const [wordFragments, setWordFragments] = useState([]);
    const [targetSpell, setTargetSpell] = useState('');
    const [userCombinedFragments, setUserCombinedFragments] = useState([]);
    const [forgeMessage, setForgeMessage] = useState('');
    const [forgeEffect, setForgeEffect] = useState(false);
    const [currentForgedSpell, setCurrentForgedSpell] = useState('');

    // Level 8 (Mirror of Truth) states
    const [mirrorWord, setMirrorWord] = useState('');
    const [reversedWord, setReversedWord] = useState('');
    const [isPalindrome, setIsPalindrome] = useState(false);
    const [reverseMessage, setReverseMessage] = useState('');
    const [mirrorEffect, setMirrorEffect] = useState(false);
    const [currentReversalStage, setCurrentReversalStage] = useState(0);
    const [currentDisplayWord, setCurrentDisplayWord] = useState('');

    // Level 10 (Final Boss Battle) states
    const [bossHealth, setBossHealth] = useState(100);
    const [currentSpell, setCurrentSpell] = useState('');
    const [spellComponents, setSpellComponents] = useState([]);
    const [battlePhase, setBattlePhase] = useState(0); // 0: Pattern Matching, 1: Transformation, 2: Final Spell
    const [battleMessage, setBattleMessage] = useState('');
    const [battleEffect, setBattleEffect] = useState(false);
    const [weakPoints, setWeakPoints] = useState([]);
    const [transformedSpell, setTransformedSpell] = useState('');
    const [finalSpell, setFinalSpell] = useState('');

    // Level 9 (The String Guardian) states
    const [guardianChallenges, setGuardianChallenges] = useState([]);
    const [currentGuardianChallengeIndex, setCurrentGuardianChallengeIndex] = useState(0);
    const [currentGuardianWord, setCurrentGuardianWord] = useState('');
    const [currentGuardianPattern, setCurrentGuardianPattern] = useState('');
    const [currentGuardianMethod, setCurrentGuardianMethod] = useState(''); // 'startsWith' or 'endsWith'
    const [guardianPhase, setGuardianPhase] = useState(1); // 1: True/False, 2: Method Selection
    const [guardianMessage, setGuardianMessage] = useState('');
    const [guardianEffect, setGuardianEffect] = useState(false);
    const [userTrueFalseAnswer, setUserTrueFalseAnswer] = useState(null); // null, true, or false

    // Level 10 (The Alchemist's Transmutation) states
    const [alchemistChallenges, setAlchemistChallenges] = useState([]);
    const [currentAlchemistChallengeIndex, setCurrentAlchemistChallengeIndex] = useState(0);
    const [baseWord, setBaseWord] = useState('');
    const [targetToReplace, setTargetToReplace] = useState('');
    const [replacementText, setReplacementText] = useState('');
    const [userSubstringToFind, setUserSubstringToFind] = useState('');
    const [userReplacementText, setUserReplacementText] = useState('');
    const [transformedResult, setTransformedResult] = useState('');
    const [alchemistMessage, setAlchemistMessage] = useState('');
    const [alchemistEffect, setAlchemistEffect] = useState(false);

    // State for fetching user progress within the game
    const { get, loading, error } = useApi();
    const [stringsGameProgress, setStringsGameProgress] = useState(null);

    // Helper function to generate prophecy text and target regex patterns
    const generateProphecyAndPattern = () => {
        const prophecies = [
            { text: "Ancient runes speak of a dragon and a hidden treasure.", pattern: "dragon|treasure" },
            { text: "The wizard's spell calls for fire, water, and earth essences.", pattern: "fire|water|earth" },
            { text: "Seek the elder scrolls, they hold the key to immortality.", pattern: "elder|scrolls|key" },
            { text: "Beware the shadows that creep, for they hide secrets untold.", pattern: "shadows|secrets" },
            { text: "The whispers of destiny foretell triumph and glory for the brave.", pattern: "triumph|glory|brave" },
        ];
        const selected = prophecies[Math.floor(Math.random() * prophecies.length)];
        return selected;
    };

    // Helper function to generate cursed words and their targets
    const generateCursedWordAndTarget = () => {
        const words = [
            "  hElLo WoRlD  ",
            "  SPeLl CaStInG  ",
            "  WiZaRdS qUeSt  ",
            "  mAgiC PoWeR  ",
            "  dAngerOuS dUnGeOn  ",
        ];
        const selectedCursedWord = words[Math.floor(Math.random() * words.length)];
        const target = selectedCursedWord.toUpperCase().trim();
        return { cursedWord: selectedCursedWord, targetTransformedWord: target };
    };

    // Helper function to generate power words and target syllables
    const generatePowerWordAndTarget = () => {
        const words = [
            { word: "FIREBALLSPELL", target: "FIRE" },
            { word: "WATERSHIELD", target: "SHIELD" },
            { word: "EARTHQUAKE", target: "QUAKE" },
            { word: "WINDBLAST", target: "BLAST" },
            { word: "SHADOWCLOAK", target: "SHADOW" },
        ];
        const selected = words[Math.floor(Math.random() * words.length)];
        return selected;
    };

    // Helper function to generate word fragments and target spell
    const generateSpellFragments = () => {
        const spells = [
            { fragments: ["FIRE", "BALL", "SPELL"], target: "FIREBALLSPELL" },
            { fragments: ["WIND", "BLAST", "MAGIC"], target: "WINDBLASTMAGIC" },
            { fragments: ["EARTH", "SHAKE", "FORCE"], target: "EARTHSHAKEFORCE" },
            { fragments: ["WATER", "SHIELD", "WARD"], target: "WATERSHIELDWARD" },
        ];
        const selected = spells[Math.floor(Math.random() * spells.length)];
        
        // Shuffle fragments to ensure user has to pick order
        const shuffledFragments = [...selected.fragments].sort(() => Math.random() - 0.5);

        return { fragments: shuffledFragments, target: selected.target };
    };

    // Helper function to generate puzzle string and target split result
    const generatePuzzleAndDelimiter = () => {
        const puzzles = [
            { text: "SOLVE,THE,ANCIENT,PUZZLE", delimiter: ",", target: ["SOLVE", "THE", "ANCIENT", "PUZZLE"] },
            { text: "BREAK-THE-CODE", delimiter: "-", target: ["BREAK", "THE", "CODE"] },
            { text: "MAGIC_WORD_QUEST", delimiter: "_", target: ["MAGIC", "WORD", "QUEST"] },
            { text: "SECRETS OF THE RUINS", delimiter: " ", target: ["SECRETS", "OF", "THE", "RUINS"] },
        ];
        const selected = puzzles[Math.floor(Math.random() * puzzles.length)];
        return selected;
    };

    // Helper function to generate mirror words and check for palindromes
    const generateMirrorWord = () => {
        const words = [
            "LEVEL", "MADAM", "RACECAR", "DEIFIED", // Palindromes
            "MAGIC", "WIZARD", "SPELL", "QUEST", "FOREST" // Non-palindromes
        ];
        const selectedWord = words[Math.floor(Math.random() * words.length)];
        return selectedWord;
    };

    // Helper function for Level 9 (Character Hunt)
    const generateSecretScroll = () => {
        const secretWords = [
            "ENIGMA", "MYSTERY", "CIPHER", "SECRET", "PUZZLE", "GLYPH"
        ];
        const selectedWord = secretWords[Math.floor(Math.random() * secretWords.length)];
        const paddingLength = 20; // Number of random characters to add around the word
        let fullScroll = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        // Add random characters before the secret word
        for (let i = 0; i < paddingLength; i++) {
            fullScroll += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // Insert the secret word
        fullScroll += selectedWord;

        // Add random characters after the secret word
        for (let i = 0; i < paddingLength; i++) {
            fullScroll += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        return { scroll: fullScroll, word: selectedWord };
    };

    // Helper function for Level 10 (Final Boss Battle)
    const generateBossBattle = () => {
        const battles = [
            {
                weakPoints: ["CHAOS", "LORD", "DARKNESS"],
                spellComponents: ["FIRE", "LIGHT", "POWER"],
                targetSpell: "FIRELIGHTPOWER",
                transformation: "toUpperCase",
                finalSpell: "FIRELIGHTPOWER"
            },
            {
                weakPoints: ["EVIL", "MAGIC", "SHADOW"],
                spellComponents: ["HOLY", "LIGHT", "FORCE"],
                targetSpell: "HOLYLIGHTFORCE",
                transformation: "toUpperCase",
                finalSpell: "HOLYLIGHTFORCE"
            },
            {
                weakPoints: ["DEMON", "KING", "NIGHT"],
                spellComponents: ["SUN", "LIGHT", "BEAM"],
                targetSpell: "SUNLIGHTBEAM",
                transformation: "toUpperCase",
                finalSpell: "SUNLIGHTBEAM"
            }
        ];
        const selected = battles[Math.floor(Math.random() * battles.length)];
        return selected;
    };

    // Helper function to generate a gate challenge for Level 9
    const generateGateChallenge = () => {
        const challenges = [
            { word: "DRAGONFIRE", type: 'startsWith', rule: "DRAGON", expectedResult: true },
            { word: "STARLIGHT", type: 'endsWith', rule: "LIGHT", expectedResult: true },
            { word: "MOONSHADOW", type: 'startsWith', rule: "SUN", expectedResult: false },
            { word: "WHISPERWIND", type: 'endsWith', rule: "STORM", expectedResult: false },
            { word: "GEMSTONE", type: 'startsWith', rule: "GEM", expectedResult: true },
            { word: "RUNESPELL", type: 'endsWith', rule: "SPELL", expectedResult: true },
            { word: "SILVERWING", type: 'startsWith', rule: "GOLD", expectedResult: false },
            { word: "IRONHEART", type: 'endsWith', rule: "SOUL", expectedResult: false },
        ];
        // No shuffling: challenges will be presented in a fixed order for better learning.
        return challenges;
    };

    // Helper function to generate challenges for Level 9 (The String Guardian)
    const generateGuardianChallenges = () => {
        const challenges = [
            // Phase 1: Understanding (True/False)
            { word: "ANCIENTSCROLL", pattern: "ANCIENT", method: 'startsWith', expectedResult: true, phase: 1, question: "Does the string `ANCIENTSCROLL` `startsWith('ANCIENT')`?" },
            // Phase 2: Application (Method Selection)
            { word: "MAGICALSTAFF", pattern: "MAGICAL", method: 'startsWith', expectedResult: true, phase: 2, rule: "Verify if the string `MAGICALSTAFF` has 'MAGICAL' at its beginning." },
        ];
        return challenges;
    };

    // Helper function to generate challenges for Level 10 (The Alchemist's Transmutation)
    const generateAlchemistChallenges = () => {
        const challenges = [
            {
                baseWord: "DARKFOREST",
                targetToReplace: "DARK",
                replacementText: "BRIGHT",
                expectedTransformedWord: "BRIGHTFOREST"
            },
            {
                baseWord: "SILVERWING",
                targetToReplace: "SILVER",
                replacementText: "GOLD",
                expectedTransformedWord: "GOLDWING"
            },
        ];
        return challenges;
    };

    // Function to save progress to database
    const saveProgress = async (level) => {
        if (!user) {
            console.log('No user found, progress will not be saved');
            return;
        }
// console.log("HI")
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

            // Ensure all values are of the correct type
            const progressData = {
                topicId: 'strings',
                level: Number(level),
                completed: true,
                score: Number(score),
                timeSpent: Number(timeSpent),
                attempts: 1,
                timestamp: new Date().toISOString()
            };

            console.log('Sending progress data:', progressData);

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
                console.error('Server response:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                throw new Error(`Failed to save progress: ${response.status} - ${errorData.message || response.statusText}`);
            }

            const data = await response.json();
            console.log('Server response:', data);
            
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
            console.error(`Error saving progress for level ${level}:`, error);
            if (error.response) {
                console.error('Error response:', error.response.data);
            }
            // Show error to user
            setGameMessage(`Failed to save progress: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    // Function to calculate score
    const calculateScore = (level) => {
        return 10; // Fixed score of 10 points per level, no time bonus
    };

    // Update level start time when level changes
    useEffect(() => {
        setLevelStartTime(Date.now());
    }, [currentLevel]);

    // Fetch progress from backend (refactored for reuse)
    const fetchStringsProgress = async () => {
        if (!user) return;
        try {
            const userProgressData = await get(`${BACKEND_URL}/api/game-progress/all-progress`);
            const stringsProgressEntry = userProgressData?.progress?.find(p => p.topicId === 'strings');
            setStringsGameProgress(stringsProgressEntry || null);
        } catch (err) {
            console.error("Failed to fetch strings game progress:", err);
        }
    };

    // Fetch on mount and when user changes
    useEffect(() => {
        fetchStringsProgress();
    }, [user, get]);

    // Sync completedLevels with backend progress
    useEffect(() => {
        if (stringsGameProgress?.gameLevels) {
            const completed = new Set(
                stringsGameProgress.gameLevels
                    .filter(level => level.completed)
                    .map(level => level.level)
            );
            setCompletedLevels(completed);
        }
    }, [stringsGameProgress]);

    useEffect(() => {
        if (stringsGameProgress) {
            console.log('[DEBUG] stringsGameProgress:', JSON.stringify(stringsGameProgress, null, 2));
        }
    }, [stringsGameProgress]);

    // Function to handle level completion
    const handleLevelComplete = async (level) => {
        setLevelObjectiveMet(true);
        setCompletedLevels(prev => new Set([...prev, level]));
        await saveProgress(level);
        await fetchStringsProgress(); // Force re-fetch after save
    };

    // Initialize level
    useEffect(() => {
        let message = '';
        setLevelObjectiveMet(false);
        setSelectedChar(null);
        setTargetIndex(null);
        setLeftTowerInput('');
        setRightTowerInput('');
        setTowerAuras({ left: 'neutral', right: 'neutral' });
        setSearchInput('');
        setFoundIndices([]);
        setSearchMessage('');

        // Reset Level 4 states
        setPowerWord('');
        setTargetSyllable('');
        setStartIndexInput('');
        setEndIndexInput('');
        setExtractedSyllable('');
        setSwordCutEffect(false);

        // Reset Level 5 states
        setCursedWord('');
        setTargetTransformedWord('');
        setTransformedInput('');
        setTransformMessage('');
        setTransformEffect(false);

        // Reset Level 6 states
        setProphecyText('');
        setTargetPattern('');
        setRegexInput('');
        setMatchingResults([]);
        setRegexMessage('');
        setOracleEffect(false);

        // Reset Level 7 (Puzzle Breaker) states
        setPuzzleString('');
        setTargetSplitResult([]);
        setDelimiterInput('');
        setSplitResults([]);
        setPuzzleMessage('');
        setPuzzleEffect(false);

        // Reset Level 6 (Word Forge) states
        setWordFragments([]);
        setTargetSpell('');
        setUserCombinedFragments([]);
        setForgeMessage('');
        setForgeEffect(false);
        setCurrentForgedSpell('');

        // Reset Level 8 (Mirror of Truth) states
        setMirrorWord('');
        setReversedWord('');
        setIsPalindrome(false);
        setReverseMessage('');
        setMirrorEffect(false);
        setCurrentReversalStage(0);
        setCurrentDisplayWord('');

        // Reset Level 10 (Final Boss Battle) states
        setBossHealth(100);
        setCurrentSpell('');
        setSpellComponents([]);
        setBattlePhase(0);
        setBattleMessage('');
        setBattleEffect(false);
        setWeakPoints([]);
        setTransformedSpell('');
        setFinalSpell('');

        // Reset Level 9 (The String Guardian) states
        setGuardianChallenges([]);
        setCurrentGuardianChallengeIndex(0);
        setCurrentGuardianWord('');
        setCurrentGuardianPattern('');
        setCurrentGuardianMethod('');
        setGuardianPhase(1);
        setGuardianMessage('');
        setGuardianEffect(false);
        setUserTrueFalseAnswer(null);

        // Reset Level 10 (The Alchemist's Transmutation) states
        setAlchemistChallenges([]);
        setCurrentAlchemistChallengeIndex(0);
        setBaseWord('');
        setTargetToReplace('');
        setReplacementText('');
        setUserSubstringToFind('');
        setUserReplacementText('');
        setTransformedResult('');
        setAlchemistMessage('');
        setAlchemistEffect(false);

        switch (currentLevel) {
            case 1:
                const word = generateMagicalWord();
                setMagicalWord(word);
                setTargetIndex(Math.floor(Math.random() * word.length));
                message = 'Welcome to the Word Wizard\'s Quest! Your first task is to find the length of this magical word and access a specific character.';
                break;
            case 2:
                const passwords = generateTowerPasswords();
                setTowerPasswords(passwords);
                message = 'The Twin Towers need matching passwords to unlock their magical powers. Enter the same password in both towers to proceed.';
                break;
            case 3:
                const { clue, targetChar: level3TargetChar } = generateSingleTreasureClue();
                setTreasureClue(clue);
                setTargetChar(level3TargetChar);
                message = `Search through the treasure map to find all instances of '${level3TargetChar}'. Use indexOf() or contains() to locate the marks.`;
                break;
            case 4:
                const { word: powerWordValue, target: targetSyllableValue } = generatePowerWordAndTarget();
                setPowerWord(powerWordValue);
                setTargetSyllable(targetSyllableValue);
                message = `To forge the Sword of Syllables, extract '${targetSyllableValue}' from '${powerWordValue}' using start and end indices.`;
                break;
            case 5:
                const { cursedWord: level5CursedWord, targetTransformedWord: level5Target } = generateCursedWordAndTarget();
                setCursedWord(level5CursedWord);
                setTargetTransformedWord(level5Target);
                setTransformedInput(level5CursedWord);
                message = `The Shape-Shifter has cursed this word: '${level5CursedWord}'. Use the buttons to transform it to '${level5Target}'!`;
                break;
            case 6:
                const { fragments, target } = generateSpellFragments();
                setWordFragments(fragments);
                setTargetSpell(target);
                setCurrentForgedSpell('');
                message = `Combine these magical word fragments using the '+' operator or the '.concat()' method to forge the powerful spell: '${target}'`;
                break;
            case 7: // New Level 7: Puzzle Breaker
                const { text: puzzleText, delimiter, target: splitTarget } = generatePuzzleAndDelimiter();
                setPuzzleString(puzzleText);
                setTargetSplitResult(splitTarget);
                message = `The ancient puzzle: '${puzzleText}'. Split it into pieces using the correct delimiter to find the solution!`;
                break;
            case 8: // New Level 8: Mirror of Truth
                const wordToReverse = generateMirrorWord();
                setMirrorWord(wordToReverse);
                setCurrentDisplayWord(wordToReverse);
                message = `Gaze into the Mirror of Truth! Reverse '${wordToReverse}' step-by-step to reveal its true nature.`;
                break;
            case 9: // New Level 9: The String Guardian
                const guardianChallengesData = generateGuardianChallenges();
                setGuardianChallenges(guardianChallengesData);
                setCurrentGuardianChallengeIndex(0);
                setCurrentGuardianWord(guardianChallengesData[0].word);
                setCurrentGuardianPattern(guardianChallengesData[0].pattern);
                setCurrentGuardianMethod(guardianChallengesData[0].method);
                setGuardianPhase(1); // Start with Phase 1: True/False
                message = `Welcome, String Guardian! In this level, you will master \`startsWith()\` and \`endsWith()\`.\\n\\nPhase 1: True or False - Read the statement and determine its truth.`;
                break;
            case 10: // New Level 10: The Alchemist's Transmutation
                const alchemistChallengesData = generateAlchemistChallenges();
                setAlchemistChallenges(alchemistChallengesData);
                setCurrentAlchemistChallengeIndex(0);
                setBaseWord(alchemistChallengesData[0].baseWord);
                setTargetToReplace(alchemistChallengesData[0].targetToReplace);
                setReplacementText(alchemistChallengesData[0].replacementText);
                setUserSubstringToFind('');
                setUserReplacementText('');
                setTransformedResult('');
                message = `Welcome to The Alchemist's Lab! Transform ordinary words into magical ones using the \`replace()\` method.`;
                break;
            default:
                message = 'Level not implemented yet';
        }
        setGameMessage(message);
    }, [currentLevel]);

    // Handle character click for Level 1
    const handleCharClick = (index) => {
        if (currentLevel === 1) {
            setSelectedChar(index);
            if (index === targetIndex) {
                setLevelObjectiveMet(true);
                handleLevelComplete(1);
            }
        }
    };

    // Handle tower input changes for Level 2
    const handleTowerInputChange = (tower, value) => {
        if (tower === 'left') {
            setLeftTowerInput(value);
            checkTowerMatch(value, rightTowerInput);
        } else {
            setRightTowerInput(value);
            checkTowerMatch(leftTowerInput, value);
        }
    };

    // Check if tower passwords match
    const checkTowerMatch = (left, right) => {
        console.log('Checking tower match:', {
            left,
            right,
            correctPassword: towerPasswords.left
        });
        
        // Update auras based on input values
        const newAuras = {
            left: !left ? 'neutral' : (left === towerPasswords.left ? 'match' : 'mismatch'),
            right: !right ? 'neutral' : (right === towerPasswords.right ? 'match' : 'mismatch')
        };
        
        console.log('New auras:', newAuras);
        setTowerAuras(newAuras);

        // Level is complete when both passwords match the correct password
        if (newAuras.left === 'match' && newAuras.right === 'match') {
            setLevelObjectiveMet(true);
            handleLevelComplete(2);
        }
    };

    // Handle treasure search for Level 3
    const handleTreasureSearch = (searchTerm) => {
        setSearchInput(searchTerm);
        console.log('Search term entered:', searchTerm);

        if (!searchTerm || !treasureClue) {
            setSearchMessage('');
            setFoundIndices([]);
            return;
        }

        const currentClue = treasureClue;
        const indices = [];
        let index = currentClue.indexOf(searchTerm);
        
        while (index !== -1) {
            indices.push(index);
            index = currentClue.indexOf(searchTerm, index + 1);
        }

        console.log('Found indices:', indices);
        setFoundIndices(indices);
        
        if (indices.length > 0) {
            setSearchMessage(`Found ${indices.length} instance(s) of '${searchTerm}' at position(s): ${indices.join(', ')}`);
            
            // Check if all target characters are found
            const expectedXCount = (currentClue.match(new RegExp(targetChar, 'g')) || []).length;
            console.log('Expected X count:', expectedXCount);
            console.log('Current found count:', indices.length);

            if (searchTerm.toUpperCase() === targetChar.toUpperCase() && indices.length === expectedXCount) {
                setLevelObjectiveMet(true);
                handleLevelComplete(3);
            }
        } else {
            setSearchMessage(`No instances of '${searchTerm}' found in the current clue.`);
        }
    };

    // Handle string slicing for Level 4
    const handleSyllableExtraction = () => {
        const startIndex = parseInt(startIndexInput, 10);
        const endIndex = parseInt(endIndexInput, 10);

        setSwordCutEffect(true);
        setTimeout(() => setSwordCutEffect(false), 500); // Reset animation after a short delay

        if (isNaN(startIndex) || isNaN(endIndex) || startIndex < 0 || endIndex > powerWord.length || startIndex >= endIndex) {
            setExtractedSyllable('Invalid indices!');
            setSearchMessage('Please enter valid start and end indices.');
            return;
        }

        const extracted = powerWord.substring(startIndex, endIndex);
        setExtractedSyllable(extracted);

        if (extracted === targetSyllable) {
            setSearchMessage(`Success! You extracted '${extracted}' and forged an elemental sword!`);
            setLevelObjectiveMet(true);
            handleLevelComplete(4);
        } else {
            setSearchMessage(`Incorrect extraction. You got '${extracted}'. Keep trying!`);
        }
    };

    // Handle string transformation for Level 5
    const applyTransformation = (type) => {
        setTransformEffect(true);
        setTimeout(() => setTransformEffect(false), 800); // Reset animation after a short delay

        let newTransformedWord = transformedInput;

        if (type === 'uppercase') {
            newTransformedWord = transformedInput.toUpperCase();
            setTransformMessage(`Applied toUpperCase()`);
        } else if (type === 'lowercase') {
            newTransformedWord = transformedInput.toLowerCase();
            setTransformMessage(`Applied toLowerCase()`);
        } else if (type === 'trim') {
            newTransformedWord = transformedInput.trim();
            setTransformMessage(`Applied trim()`);
        }

        setTransformedInput(newTransformedWord);

        if (newTransformedWord === targetTransformedWord) {
            setTransformMessage(`Spell broken! You transformed it to '${newTransformedWord}'`);
            setLevelObjectiveMet(true);
            handleLevelComplete(5);
        }
    };

    // Handle regex search for Level 6
    const handleRegexSearch = () => {
        setOracleEffect(true);
        setTimeout(() => setOracleEffect(false), 800);

        if (!regexInput) {
            setRegexMessage('Please enter a regex pattern.');
            setMatchingResults([]);
            return;
        }

        try {
            const regex = new RegExp(regexInput, 'gi'); // 'g' for global, 'i' for case-insensitive
            const matches = [...prophecyText.matchAll(regex)];
            const results = matches.map(match => `Found '${match[0]}' at index ${match.index}`);
            
            setMatchingResults(results);

            if (regexInput === targetPattern) {
                setRegexMessage(`Prophecy understood! You found all occurrences of '${targetPattern}'.`);
                setLevelObjectiveMet(true);
                handleLevelComplete(8);
            } else if (matches.length > 0) {
                setRegexMessage(`You found ${matches.length} match(es), but the pattern is not exact or complete.`);
            } else {
                setRegexMessage(`No matches found for '${regexInput}'.`);
            }
        } catch (error) {
            setRegexMessage(`Invalid regex pattern: ${error.message}`);
            setMatchingResults([]);
        }
    };

    // Handle spell forging for Level 6 (Word Forge)
    const handleConcatenation = (fragment) => {
        setForgeEffect(true);
        setTimeout(() => setForgeEffect(false), 800);

        let newSpell = currentForgedSpell;

        newSpell = newSpell + fragment;
        setForgeMessage(`You combined '${currentForgedSpell}' and '${fragment}' using the '+' operator. Result: '${newSpell}'`);

        setCurrentForgedSpell(newSpell);

        if (newSpell === targetSpell) {
            setForgeMessage(`Master spell crafted! You forged '${newSpell}'.`);
            setLevelObjectiveMet(true);
            handleLevelComplete(6);
        }
    };

    const handleResetForge = () => {
        setCurrentForgedSpell('');
        setForgeMessage('');
    };

    // Handle puzzle splitting for Level 7 (Puzzle Breaker)
    const handlePuzzleSplit = () => {
        setPuzzleEffect(true);
        setTimeout(() => setPuzzleEffect(false), 800);

        if (!delimiterInput && delimiterInput !== '') {
            setPuzzleMessage('Please enter a delimiter (or leave empty for split by character).');
            setSplitResults([]);
            return;
        }

        // The core teaching: showing split() in action
        const splitArray = puzzleString.split(delimiterInput);
        setSplitResults(splitArray);
        setPuzzleMessage(`You used .split('${delimiterInput}'). Result: [${splitArray.map(s => `'${s}'`).join(', ')}]`);

        // Check if the split array matches the target for completion
        if (JSON.stringify(splitArray) === JSON.stringify(targetSplitResult)) {
            setPuzzleMessage(`Puzzle broken! Solution: [${splitArray.map(s => `'${s}'`).join(', ')}]`);
            setLevelObjectiveMet(true);
            handleLevelComplete(7);
        }
    };

    // Handle string reversal for Level 8 (Mirror of Truth)
    const handleReverseWord = (stage) => {
        setMirrorEffect(true);
        setTimeout(() => setMirrorEffect(false), 800);

        if (stage === 'split') {
            const splitArray = mirrorWord.split('');
            setCurrentDisplayWord(`[${splitArray.map(char => `'${char}'`).join(', ')}]`);
            setReverseMessage(`You applied .split('')! The word is now an array of characters.`);
            setCurrentReversalStage(1);
        } else if (stage === 'reverse') {
            const originalSplit = mirrorWord.split('');
            const reversedArray = originalSplit.reverse();
            setCurrentDisplayWord(`[${reversedArray.map(char => `'${char}'`).join(', ')}]`);
            setReverseMessage(`You applied .reverse()! The array of characters is now reversed.`);
            setCurrentReversalStage(2);
        } else if (stage === 'join') {
            const reversed = mirrorWord.split('').reverse().join('');
            setCurrentDisplayWord(reversed);
            setReversedWord(reversed);
            setReverseMessage(`You applied .join('')! The characters are now a reversed string.`);
            setCurrentReversalStage(3);

            const palindromeCheck = (mirrorWord.toUpperCase() === reversed.toUpperCase());
            setIsPalindrome(palindromeCheck);

            if (palindromeCheck) {
                setReverseMessage(prev => prev + ` Truth revealed! '${mirrorWord}' is a palindrome.`);
            } else {
                setReverseMessage(prev => prev + ` The reflection shows '${reversed}'. '${mirrorWord}' is not a palindrome.`);
            }
            
            // Allow level completion after completing all steps
            setLevelObjectiveMet(true);
            handleLevelComplete(8);
        } else if (stage === 'reset') {
            setReversedWord('');
            setIsPalindrome(false);
            setReverseMessage('');
            setCurrentReversalStage(0);
            setCurrentDisplayWord(mirrorWord);
        }
    };

    // Handle check for Level 9 (The String Guardian - Phase 1: True/False)
    const handleGuardianTrueFalseCheck = (userAnswer) => {
        setGuardianEffect(true);
        setTimeout(() => setGuardianEffect(false), 800);

        const currentChallenge = guardianChallenges[currentGuardianChallengeIndex];
        const actualResult = currentChallenge.word[currentChallenge.method](currentChallenge.pattern);

        if (userAnswer === actualResult) {
            setGuardianMessage(`Correct! \'${currentChallenge.word}\' does indeed ${currentChallenge.method.replace('sWith', ' with ')} \'${currentChallenge.pattern}\'.`);
            
            const nextIndex = currentGuardianChallengeIndex + 1;
            if (nextIndex < guardianChallenges.length && guardianChallenges[nextIndex].phase === 1) {
                // Move to next Phase 1 challenge
                setCurrentGuardianChallengeIndex(nextIndex);
                setCurrentGuardianWord(guardianChallenges[nextIndex].word);
                setCurrentGuardianPattern(guardianChallenges[nextIndex].pattern);
                setCurrentGuardianMethod(guardianChallenges[nextIndex].method);
                setUserTrueFalseAnswer(null); // Reset for next question
            } else if (nextIndex < guardianChallenges.length && guardianChallenges[nextIndex].phase === 2) {
                // Transition to Phase 2
                setGuardianPhase(2);
                setCurrentGuardianChallengeIndex(nextIndex);
                setCurrentGuardianWord(guardianChallenges[nextIndex].word);
                setCurrentGuardianPattern(guardianChallenges[nextIndex].pattern);
                setCurrentGuardianMethod(guardianChallenges[nextIndex].method);
                setUserTrueFalseAnswer(null); // Reset for next question
                setGuardianMessage(`Phase 2: Application! Now, choose the correct method and answer True or False.`);
            } else {
                // All challenges completed
                setGuardianMessage(`Congratulations, String Guardian! You have mastered the truths of beginning and end!`);
                setLevelObjectiveMet(true);
                handleLevelComplete(9);
            }
        } else {
            setGuardianMessage(`Incorrect. \'${currentChallenge.word}\' does ${actualResult ? '' : 'NOT '}${currentChallenge.method.replace('sWith', ' with ')} \'${currentChallenge.pattern}\'. Try again.`);
        }
    };

    // Handle check for Level 9 (The String Guardian - Phase 2: Method Selection & True/False)
    const handleGuardianMethodCheck = (chosenMethod, userAnswer) => {
        setGuardianEffect(true);
        setTimeout(() => setGuardianEffect(false), 800);

        const currentChallenge = guardianChallenges[currentGuardianChallengeIndex];
        const actualResult = currentChallenge.word[currentChallenge.method](currentChallenge.pattern);

        if (chosenMethod === currentChallenge.method) {
            // User chose the correct method
            if (userAnswer === actualResult) {
                setGuardianMessage(`Correct! You chose the right method and the correct answer. \'${currentChallenge.word}\' does ${actualResult ? '' : 'NOT '}${chosenMethod.replace('sWith', ' with ')} \'${currentChallenge.pattern}\'.`);
                
                const nextIndex = currentGuardianChallengeIndex + 1;
                if (nextIndex < guardianChallenges.length) {
                    // Move to next Phase 2 challenge
                    setCurrentGuardianChallengeIndex(nextIndex);
                    setCurrentGuardianWord(guardianChallenges[nextIndex].word);
                    setCurrentGuardianPattern(guardianChallenges[nextIndex].pattern);
                    setCurrentGuardianMethod(guardianChallenges[nextIndex].method);
                    setUserTrueFalseAnswer(null); // Reset for next question
                } else {
                    // All challenges completed
                    setGuardianMessage(`Congratulations, String Guardian! You have mastered the truths of beginning and end!`);
                    setLevelObjectiveMet(true);
                    handleLevelComplete(9);
                }
            } else {
                // User chose correct method but wrong True/False answer
                setGuardianMessage(`Incorrect answer for the method. \'${currentChallenge.word}\' does ${actualResult ? '' : 'NOT '}${chosenMethod.replace('sWith', ' with ')} \'${currentChallenge.pattern}\'. Choose the correct True/False.`);
            }
        } else {
            // User chose the wrong method
            setGuardianMessage(`Incorrect method chosen. The rule required checking with \`${currentChallenge.method}\`. Try again!`);
        }
    };

    // Handle transmutation for Level 10 (The Alchemist's Transmutation)
    const handleTransmutation = () => {
        setAlchemistEffect(true);
        setTimeout(() => setAlchemistEffect(false), 800);

        const currentChallenge = alchemistChallenges[currentAlchemistChallengeIndex];

        if (userSubstringToFind === currentChallenge.targetToReplace && userReplacementText === currentChallenge.replacementText) {
            const newTransformedWord = currentChallenge.baseWord.replace(userSubstringToFind, userReplacementText);
            setTransformedResult(newTransformedWord);

            if (newTransformedWord === currentChallenge.expectedTransformedWord) {
                setAlchemistMessage(`Transmutation successful! \'${currentChallenge.baseWord}\' transformed into \'${newTransformedWord}\'.`);
                
                const nextIndex = currentAlchemistChallengeIndex + 1;
                if (nextIndex < alchemistChallenges.length) {
                    // Move to next challenge
                    setCurrentAlchemistChallengeIndex(nextIndex);
                    setBaseWord(alchemistChallenges[nextIndex].baseWord);
                    setTargetToReplace(alchemistChallenges[nextIndex].targetToReplace);
                    setReplacementText(alchemistChallenges[nextIndex].replacementText);
                    setUserSubstringToFind('');
                    setUserReplacementText('');
                    setTransformedResult(''); // Clear result for next challenge
                } else {
                    // All challenges completed
                    setAlchemistMessage(`Congratulations, Alchemist! You have mastered String Transmutation!`);
                    setLevelObjectiveMet(true);
                    handleLevelComplete(10);
                }
            } else {
                // Should ideally not happen if inputs are correct, but good for robustness
                setAlchemistMessage(`The word didn\'t transform as expected. Please review the formula.`);
            }
        } else if (userSubstringToFind !== currentChallenge.targetToReplace) {
            setAlchemistMessage(`Incorrect target element to transmute. You entered \'${userSubstringToFind}\', but the formula requires \'${currentChallenge.targetToReplace}\'.`);
        } else if (userReplacementText !== currentChallenge.replacementText) {
            setAlchemistMessage(`Incorrect replacement element. You entered \'${userReplacementText}\', but the formula requires \'${currentChallenge.replacementText}\'.`);
        } else {
            setAlchemistMessage(`Please enter both the target and replacement elements.`);
        }
    };

    // Render the magical word with interactive characters (Level 1)
    const renderMagicalWord = () => {
        return (
            <div className="flex flex-col items-center space-y-8 my-8">
                <div className="text-center mb-4">
                    <p className="text-lg text-gray-600">The Magical Word's Secret</p>
                    <p className="text-sm text-gray-400">{gameMessage}</p>
                    {targetIndex !== null && (
                        <p className="text-sm text-gray-800 mt-2">Find the character at index: <span className="font-bold text-yellow-800">{targetIndex}</span></p>
                    )}
                </div>
                <div className="flex justify-center items-center space-x-4">
                    {magicalWord.split('').map((char, index) => (
                        <motion.div
                            key={index}
                            className={`w-16 h-16 flex items-center justify-center  text-3xl font-bold cursor-pointer
                                ${selectedChar === index ? 'bg-purple-500 text-white' : 'bg-blue-400 text-blue-800'}
                                rounded-lg shadow-lg transform hover:scale-110 transition-transform`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCharClick(index)}
                        >
                            {char}
                            <span className="text-xs absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center">
                                {index}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    };

    // Render the twin towers (Level 2)
    const renderTwinTowers = () => {
        const getAuraColor = (aura) => {
            switch (aura) {
                case 'match': return 'bg-green-600';
                case 'mismatch': return 'bg-red-600';
                default: return 'bg-blue-400';
            }
        };

        return (
            <div className="flex flex-col items-center space-y-8 my-8">
                <div className="text-center mb-4">
                    <p className="text-lg text-gray-800">Enter the same password in both towers</p>
                    <p className="text-sm text-gray-600">The password is one of: OPEN, LOCK, DOOR, GATE, PORT</p>
                    <p className="text-sm text-gray-800 mt-2">Current password: {towerPasswords.left}</p>
                </div>
                <div className="flex justify-center items-center space-x-8">
                    {/* Left Tower */}
                    <div className="relative">
                        <div className={`w-48 h-64 rounded-lg shadow-lg p-4 transition-colors duration-300 ${getAuraColor(towerAuras.left)}`}>
                            <input
                                type="text"
                                value={leftTowerInput}
                                onChange={(e) => handleTowerInputChange('left', e.target.value.toUpperCase())}
                                className="w-full p-2 text-center text-xl font-bold bg-black text-white rounded"
                                placeholder="Enter password"
                                maxLength={4}
                            />
                        </div>
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                            <p className="text-sm text-gray-300">Left Tower</p>
                        </div>
                    </div>

                    {/* Right Tower */}
                    <div className="relative">
                        <div className={`w-48 h-64 rounded-lg shadow-lg p-4 transition-colors duration-300 ${getAuraColor(towerAuras.right)}`}>
                            <input
                                type="text"
                                value={rightTowerInput}
                                onChange={(e) => handleTowerInputChange('right', e.target.value.toUpperCase())}
                                className="w-full p-2 text-center text-xl font-bold bg-black text-white rounded"
                                placeholder="Enter password"
                                maxLength={4}
                            />
                        </div>
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                            <p className="text-sm text-gray-300">Right Tower</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render treasure map (Level 3)
    const renderTreasureMap = () => {
        if (!treasureClue) {
            return <div>Loading treasure map...</div>;
        }

        const currentClue = treasureClue;
        
        return (
            <div className="flex flex-col items-center space-y-8 my-8">
                <div className="text-center mb-4">
                    <p className="text-lg text-gray-800">Find all instances of '{targetChar}' in the treasure map</p>
                    <p className="text-sm text-gray-600">TYPE 'X' into the search box below to find all hidden 'X' marks.</p>
                </div>
                
                {/* Treasure Map with Magnifying Glass Effect */}
                <div className="relative bg-blue-200 p-6 rounded-lg max-w-2xl overflow-x-auto">
                    <div className="flex flex-wrap justify-center gap-1">
                        {currentClue.split('').map((char, index) => (
                            <div
                                key={index}
                                className={`w-10 h-10 border border-green-600 flex items-center justify-center text-xl font-bold
                                    ${foundIndices.includes(index) && searchInput.toUpperCase() === targetChar.toUpperCase() ? 'bg-yellow-500 text-black' : 'bg-blue-800 text-gray-300'}
                                    transition-colors duration-300`}
                            >
                                {char}
                            </div>
                        ))}
                    </div>
                    {/* Magnifying Glass Overlay */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-500 rounded-full opacity-20 blur-lg"></div>
                </div>

                {/* Search Interface */}
                <div className="w-full max-w-md">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => handleTreasureSearch(e.target.value)}
                            className="w-full p-2 text-center text-xl font-bold bg-pink-200 text-pink-600 rounded pr-10"
                            placeholder="Type 'X' here..."
                            maxLength={1}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            🔍
                        </div>
                    </div>
                    {searchMessage && (
                        <p className="mt-2 text-center text-pink-600">{searchMessage}</p>
                    )}
                </div>
            </div>
        );
    };

    // Render the Sword of Syllables (Level 4)
    const renderSwordOfSyllables = () => {
        return (
            <div className="flex flex-col items-center space-y-8 my-8">
                <div className="text-center mb-4">
                    <p className="text-lg text-gray-800">Forge the Sword of Syllables!</p>
                    <p className="text-sm text-gray-600">Extract '{targetSyllable}' from '{powerWord}'</p>
                </div>

                {/* Power Word with Indices */}
                <div className="relative bg-blue-200 p-6 rounded-lg max-w-2xl overflow-x-auto">
                    <div className="flex justify-center flex-wrap gap-1">
                        {powerWord.split('').map((char, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <span className="text-xs text-blue-800">{index}</span>
                                <div className="w-10 h-10 border border-green-600 flex items-center justify-center text-xl font-bold bg-blue-800 text-blue-200">
                                    {char}
                                </div>
                            </div>
                        ))}
                    </div>
                    {swordCutEffect && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: -50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 50 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <span className="text-6xl animate-pulse">⚔️</span>
                        </motion.div>
                    )}
                </div>

                {/* Slicing Interface */}
                <div className="w-full max-w-md flex flex-col space-y-4">
                    <div className="flex justify-center space-x-4">
                        <input
                            type="number"
                            value={startIndexInput}
                            onChange={(e) => setStartIndexInput(e.target.value)}
                            className="w-40 p-4 text-center text-xl font-bold bg-blue-200 text-blue-800 rounded"
                            placeholder="Start Index"
                        />
                        <input
                            type="number"
                            value={endIndexInput}
                            onChange={(e) => setEndIndexInput(e.target.value)}
                            className="w-40 p-4 text-center text-xl font-bold bg-blue-200 text-blue-800 rounded"
                            placeholder="End Index"
                        />
                    </div>
                    <button
                        onClick={handleSyllableExtraction}
                        className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                    >
                        Forge Sword
                    </button>
                    {searchMessage && (
                        <p className="mt-2 text-center text-gray-300">{searchMessage}</p>
                    )}
                    {extractedSyllable && extractedSyllable !== 'Invalid indices!' && (
                        <p className="mt-2 text-center text-lg text-yellow-300">Extracted: '{extractedSyllable}'</p>
                    )}
                </div>
            </div>
        );
    };

    // Render the Shape-Shifter's Riddle (Level 5)
    const renderShapeShiftersRiddle = () => {
        return (
            <div className="flex flex-col items-center space-y-8 my-8">
                <div className="text-center mb-4">
                    <p className="text-lg text-gray-800">The Shape-Shifter's Riddle</p>
                    <p className="text-sm text-gray-600">Transform the cursed word to break the spell!</p>
                    <p className="text-sm text-gray-600">Cursed Word: '{cursedWord}'</p>
                    <p className="text-sm text-gray-600">Target: '{targetTransformedWord}'</p>
                </div>

                {/* Word Transformation Display */}
                <div className="relative bg-blue-200 p-6 rounded-lg max-w-2xl overflow-x-auto min-h-[100px] flex items-center justify-center">
                    <div className="text-center text-4xl font-bold text-blue-800 tracking-wide">
                        '{transformedInput}'
                    </div>
                    {transformEffect && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <span className="text-6xl animate-pulse">✨</span>
                        </motion.div>
                    )}
                </div>

                {/* Transformation Interface */}
                <div className="w-full max-w-md flex flex-col space-y-4">
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => applyTransformation('uppercase')}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                        >
                            toUpperCase()
                        </button>
                        <button
                            onClick={() => applyTransformation('lowercase')}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                        >
                            toLowerCase()
                        </button>
                        <button
                            onClick={() => applyTransformation('trim')}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                        >
                            trim()
                        </button>
                    </div>
                    {transformMessage && (
                        <p className="mt-2 text-center text-gray-800">{transformMessage}</p>
                    )}
                </div>
            </div>
        );
    };

    // Render The Word Forge (Level 6)
    const renderWordForge = () => {
        return (
            <div className="flex flex-col items-center space-y-8 my-8">
                <div className="text-center mb-4">
                    <p className="text-lg text-gray-800">The Word Forge</p>
                    <p className="text-sm text-gray-600">Combine word fragments to create powerful spells!</p>
                    <p className="text-sm text-gray-600">Target Spell: '{targetSpell}'</p>
                </div>

                {/* Word Fragments */}
                <div className="flex flex-wrap justify-center gap-4 p-4 bg-blue-200 rounded-lg">
                    {wordFragments.map((fragment, index) => (
                        <button
                            key={index}
                            onClick={() => handleConcatenation(fragment)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                        >
                            Add '{fragment}' (+)
                        </button>
                    ))}
                </div>

                {/* Forging Area */}
                <div className="relative bg-blue-200 p-6 rounded-lg min-h-[100px] w-full max-w-2xl flex items-center justify-center border-2 border-blue-500 overflow-hidden">
                    <div className="text-center text-4xl font-bold text-blue-800 tracking-wide">
                        '{currentForgedSpell}'
                    </div>
                    {forgeEffect && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <span className="text-6xl animate-pulse">🔥</span>
                        </motion.div>
                    )}
                </div>

                {/* Controls */}
                <div className="w-full max-w-md flex justify-center space-x-4">
                    <button
                        onClick={handleResetForge}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                    >
                        Reset
                    </button>
                </div>
                {forgeMessage && (
                    <p className="mt-2 text-center text-gray-800">{forgeMessage}</p>
                )}
            </div>
        );
    };

    // Render The Puzzle Breaker (Level 7)
    const renderPuzzleBreaker = () => {
        return (
            <div className="flex flex-col items-center space-y-8 my-8">
                <div className="text-center mb-4">
                    <p className="text-lg text-gray-800">The Puzzle Breaker</p>
                    <p className="text-sm text-gray-600">Use the `.split()` method to break the puzzle into pieces!</p>
                    <p className="text-sm text-gray-600">Puzzle String: '{puzzleString}'</p>
                    <p className="text-sm text-gray-600">Target Result: [{targetSplitResult.map(s => `'${s}'`).join(', ' )}]</p>
                </div>

                {/* Puzzle String Display */}
                <div className="relative bg-blue-200 border-2 border-blue-400 p-6 rounded-lg max-w-2xl overflow-x-auto min-h-[100px] flex items-center justify-center">
                    <div className="text-center text-xl font-bold text-blue-800 tracking-wide">
                        {puzzleString}
                    </div>
                    {puzzleEffect && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <span className="text-6xl animate-pulse">🧩</span>
                        </motion.div>
                    )}
                </div>

                {/* Split Interface */}
                <div className="w-full max-w-md flex flex-col space-y-4">
                    <input
                        type="text"
                        value={delimiterInput}
                        onChange={(e) => setDelimiterInput(e.target.value)}
                        className="w-full p-2 text-center text-xl font-bold bg-blue-200 border-2 border-blue-400 text-blue-800 rounded"
                        placeholder="Enter delimiter for .split() (e.g., ',', '-', '_', ' ')"
                        maxLength={1} // Delimiters are usually single characters
                    />
                    <button
                        onClick={handlePuzzleSplit}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                    >
                        Apply .split()
                    </button>
                    {puzzleMessage && (
                        <p className="mt-2 text-center text-gray-800">{puzzleMessage}</p>
                    )}
                    {splitResults.length > 0 && (
                        <div className="mt-2 p-2 bg-blue-200 border-2 border-blue-400 rounded-lg">
                            <p className="text-blue-800 font-bold">Split Pieces:</p>
                            <ul className="list-disc list-inside text-pink-600">
                                {splitResults.map((result, index) => (
                                    <li key={index}>'{result}'</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Render The Mirror of Truth (Level 8)
    const renderMirrorOfTruth = () => {
        return (
            <div className="flex flex-col items-center space-y-8 my-8">
                <div className="text-center mb-4">
                    <p className="text-lg text-gray-800">The Mirror of Truth</p>
                    <p className="text-sm text-gray-600">Reverse the word step-by-step to reveal hidden messages and check for palindromes!</p>
                    <p className="text-sm text-gray-800">Original Word: '{mirrorWord}'</p>
                </div>

                {/* Mirror Display */}
                <div className="relative bg-blue-200 border-2 border-blue-400 p-6 rounded-lg max-w-2xl overflow-x-auto min-h-[100px] flex items-center justify-center">
                    <div className="text-center text-4xl font-bold text-blue-800 tracking-wide">
                        '{currentDisplayWord}'
                    </div>
                    {mirrorEffect && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <span className="text-6xl animate-pulse">🪞</span>
                        </motion.div>
                    )}
                </div>

                {/* Controls */}
                <div className="w-full max-w-md flex justify-center space-x-2 flex-wrap">
                    {currentReversalStage === 0 && (
                        <button
                            onClick={() => handleReverseWord('split')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 m-1"
                        >
                            .split('')
                        </button>
                    )}
                    {currentReversalStage === 1 && (
                        <button
                            onClick={() => handleReverseWord('reverse')}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 m-1"
                        >
                            .reverse()
                        </button>
                    )}
                    {currentReversalStage === 2 && (
                        <button
                            onClick={() => handleReverseWord('join')}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 m-1"
                        >
                            .join('')
                        </button>
                    )}
                    {currentReversalStage === 3 && (
                        <button
                            onClick={() => handleReverseWord('reset')}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 m-1"
                        >
                            Reset
                        </button>
                    )}
                </div>
                {reverseMessage && (
                    <p className="mt-2 text-center text-gray-800">{reverseMessage}</p>
                )}
                {currentReversalStage === 3 && reversedWord && (
                    <p className={`mt-2 text-center text-lg font-bold ${
                        isPalindrome ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {isPalindrome ? 'It\'s a Palindrome!' : 'Not a Palindrome.'}
                    </p>
                )}
            </div>
        );
    };

    // Render The String Guardian (Level 9)
    const renderStringGuardian = () => {
        const currentChallenge = guardianChallenges[currentGuardianChallengeIndex];
        if (!currentChallenge) return null; // Or a loading state

        return (
            <div className="flex flex-col items-center space-y-8 my-8">
                <div className="text-center mb-4">
                    <p className="text-lg text-gray-800">The String Guardian - Truths of Beginning & End</p>
                    <p className="text-sm text-gray-600">Master `startsWith()` and `endsWith()` methods!</p>
                </div>

                {/* Guardian Display */}
                <div className="relative bg-blue-200 border-2 border-blue-600 p-6 rounded-lg max-w-2xl overflow-x-auto min-h-[100px] flex items-center justify-center">
                    <div className="text-center text-4xl font-bold text-blue-800 tracking-wide">
                        '{currentGuardianWord}'
                    </div>
                    {guardianEffect && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <span className="text-6xl animate-pulse">✨</span>
                        </motion.div>
                    )}
                </div>

                {/* Controls */}
                <div className="w-full max-w-md flex flex-col space-y-4">
                    {guardianPhase === 1 && (
                        <div className="flex flex-col space-y-4">
                            <p className="text-md text-blue-800 text-center font-bold">{currentChallenge.question}</p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => handleGuardianTrueFalseCheck(true)}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                                >
                                    True
                                </button>
                                <button
                                    onClick={() => handleGuardianTrueFalseCheck(false)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                                >
                                    False
                                </button>
                            </div>
                        </div>
                    )}

                    {guardianPhase === 2 && (
                        <div className="flex flex-col space-y-4">
                            <p className="text-md text-gray-800 text-center font-bold mb-2">{currentChallenge.rule}</p>
                            <div className="flex justify-center space-x-4 mb-4">
                                <button
                                    onClick={() => setCurrentGuardianMethod('startsWith')}
                                    className={`flex-1 ${currentGuardianMethod === 'startsWith' ? 'bg-blue-700' : 'bg-blue-600'} hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300`}
                                >
                                    .startsWith()
                                </button>
                                <button
                                    onClick={() => setCurrentGuardianMethod('endsWith')}
                                    className={`flex-1 ${currentGuardianMethod === 'endsWith' ? 'bg-purple-700' : 'bg-purple-600'} hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300`}
                                >
                                    .endsWith()
                                </button>
                            </div>
                            {currentGuardianMethod && (
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={() => handleGuardianMethodCheck(currentGuardianMethod, true)}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                                    >
                                        True
                                    </button>
                                    <button
                                        onClick={() => handleGuardianMethodCheck(currentGuardianMethod, false)}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                                    >
                                        False
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {guardianMessage && (
                        <p className="mt-2 text-center text-gray-800">{guardianMessage}</p>
                    )}
                </div>
            </div>
        );
    };

    // Render The Alchemist's Transmutation (Level 10)
    const renderAlchemistTransmutation = () => {
        const currentChallenge = alchemistChallenges[currentAlchemistChallengeIndex];
        if (!currentChallenge) return null; // Or a loading state

        return (
            <div className="flex flex-col items-center space-y-8 my-8">
                <div className="text-center mb-4">
                    <p className="text-lg text-gray-800">The Alchemist's Transmutation</p>
                    <p className="text-sm text-gray-700">Transform words using the `replace()` method!</p>
                    <p className="text-sm text-gray-800">Base Word: '{currentChallenge.baseWord}'</p>
                    <p className="text-sm text-gray-700">Formula: Replace '{currentChallenge.targetToReplace}' with '{currentChallenge.replacementText}'</p>
                </div>

                {/* Alchemist Lab Display */}
                <div className="relative bg-blue-200 border-2 border-blue-600 p-6 rounded-lg max-w-2xl overflow-x-auto min-h-[100px] flex items-center justify-center">
                    <div className="text-center text-4xl font-bold text-blue-800 tracking-wide">
                        '{transformedResult || baseWord}'
                    </div>
                    {alchemistEffect && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <span className="text-6xl animate-pulse">🧪</span>
                        </motion.div>
                    )}
                </div>

                {/* Controls */}
                <div className="w-full max-w-md flex flex-col space-y-4">
                    <input
                        type="text"
                        value={userSubstringToFind}
                        onChange={(e) => setUserSubstringToFind(e.target.value.toUpperCase())}
                        className="w-full p-2 text-center text-xl font-bold bg-blue-200 border-2 border-blue-600 text-blue-800 rounded"
                        placeholder="Enter string to find (e.g., 'FIRE')"
                    />
                    <input
                        type="text"
                        value={userReplacementText}
                        onChange={(e) => setUserReplacementText(e.target.value.toUpperCase())}
                        className="w-full p-2 text-center text-xl font-bold bg-blue-200 border-2 border-blue-600 text-blue-800 rounded"
                        placeholder="Enter replacement string (e.g., 'WATER')"
                    />
                    <button
                        onClick={handleTransmutation}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                    >
                        Transmute (`.replace()`)
                    </button>
                    {alchemistMessage && (
                        <p className="mt-2 text-center text-gray-800">{alchemistMessage}</p>
                    )}
                </div>
            </div>
        );
    };

    const renderLevel = () => {
        switch (currentLevel) {
            case 1:
                return renderMagicalWord();
            case 2:
                return renderTwinTowers();
            case 3:
                return renderTreasureMap();
            case 4:
                return renderSwordOfSyllables();
            case 5:
                return renderShapeShiftersRiddle();
            case 6:
                return renderWordForge();
            case 7:
                return renderPuzzleBreaker();
            case 8:
                return renderMirrorOfTruth();
            case 9:
                return renderStringGuardian();
            case 10:
                return renderAlchemistTransmutation();
            default:
                // After level 10, show option to go to dashboard
                if (currentLevel > 10) {
                    return (
                        <div className="flex flex-col items-center space-y-4 my-8">
                            <p className="text-lg text-gray-300">You have completed all levels of Word Wizard's Quest!</p>
                            <button
                                onClick={() => navigate('/dashboard')} // Assuming dashboard route is /dashboard
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    );
                }
                return <p>Level not implemented yet</p>;
        }
    };

    return (
        <div className="relative min-h-screen">
        <div className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 flex flex-col items-center justify-center py-10">
                <GameDecorations />
            <div className="w-full max-w-5xl mx-auto bg-gradient-to-br from-white via-green-50 to-emerald-100 rounded-3xl shadow-2xl p-8 border-2 border-green-600 relative z-10 flex flex-col items-center">
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center w-full max-w-2xl mb-6">
                    <button
                        onClick={() => setCurrentLevel(Math.max(1, currentLevel - 1))}
                        disabled={currentLevel === 1}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg
                            ${currentLevel === 1
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 hover:scale-105'}
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

                {/* Level Navigation */}
                <div className="flex justify-center items-center mb-8 w-full">
                    <div className="flex space-x-4 flex-wrap justify-center">
                        {Array.from({ length: 10 }, (_, index) => {
                            const levelNumber = index + 1;
                            // Merge both sources for forever-green
                            const backendCompleted = stringsGameProgress?.levels?.find(gl => gl.level === levelNumber)?.completed;
                            const isCompleted = completedLevels.has(levelNumber) || backendCompleted;
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
                <h1 className="text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-lg tracking-tight relative z-10 font-serif">
                    Word Wizard's Quest
                </h1>

                {/* Game Message */}
                {gameMessage && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl shadow-lg border border-green-200 w-full max-w-3xl">
                        <p className="text-xl text-center text-pink-400 font-semibold">{gameMessage}</p>
                    </div>
                )}

                {renderLevel()}
                {levelObjectiveMet && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 p-8 rounded-lg shadow-xl"
                    >
                        <h2 className="text-2xl font-bold mb-4">Level Complete! 🎉</h2>
                        <p>You've mastered this string concept!</p>
                        <button
                            onClick={() => setCurrentLevel(prev => prev + 1)}
                            className="mt-4 bg-white text-purple-900 px-6 py-2 rounded-lg font-bold hover:bg-purple-100"
                        >
                            Next Level
                        </button>
                    </motion.div>
                )}
                </div>
            </div>
        </div>
    );
};

export default WordWizardQuest;                                                                                                                                                                                                                                             