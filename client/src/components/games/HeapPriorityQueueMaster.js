import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Add this import
import GameDecorations from './GameDecorations';

const MAX_LEVEL = 10; // Define the maximum implemented level

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const HeapPriorityQueueMaster = () => {
  const { user } = useAuth(); // Add this line
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameMessage, setGameMessage] = useState('');
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [completedLevels, setCompletedLevels] = useState(new Set()); // Add this line
  const [levelStartTime, setLevelStartTime] = useState(Date.now()); // Add this line
  const [isSaving, setIsSaving] = useState(false); // Add this line

  // Level 1: Complete Binary Tree Builder state
  const [treeSlots1, setTreeSlots1] = useState([]);
  const [availableNodes1, setAvailableNodes1] = useState([]);
  const [selectedNode1, setSelectedNode1] = useState(null);
  const [selectedNodeIndex1, setSelectedNodeIndex1] = useState(null);
  const [level1Message, setLevel1Message] = useState('');
  const [highlightedLevel1, setHighlightedLevel1] = useState(null);

  // Level 2: Heap Detective state
  const [treesData2, setTreesData2] = useState([]);
  const [selectedTreeIndex2, setSelectedTreeIndex2] = useState(null);
  const [level2Message, setLevel2Message] = useState('');
  const [showViolations2, setShowViolations2] = useState(false);
  const [correctlyIdentified2, setCorrectlyIdentified2] = useState([]); // Array of booleans for each tree
  const [hoveredNodeInfo2, setHoveredNodeInfo2] = useState({ treeIndex: null, nodeIndex: null });

  // Level 3: Heap Repair Shop state
  const [heapArray3, setHeapArray3] = useState([]);
  const [swapsCount3, setSwapsCount3] = useState(0);
  const [selectedNodesForSwap3, setSelectedNodesForSwap3] = useState([]);
  const [level3Message, setLevel3Message] = useState('');
  const [violations3, setViolations3] = useState([]);
  const [isLevel3Complete, setIsLevel3Complete] = useState(false);

  // Level 4: Bubble Up Challenge state
  const [heapArray4, setHeapArray4] = useState([]);
  const [insertionSequence4, setInsertionSequence4] = useState([25, 15, 30, 8, 20, 35]);
  const [currentInsertionIndex4, setCurrentInsertionIndex4] = useState(0);
  const [bubbleUpPath4, setBubbleUpPath4] = useState([]);
  const [isAnimating4, setIsAnimating4] = useState(false);
  const [animationSpeed4, setAnimationSpeed4] = useState(1);
  const [isPaused4, setIsPaused4] = useState(false);
  const [level4Message, setLevel4Message] = useState('');
  const [isLevel4Complete, setIsLevel4Complete] = useState(false);
  const [showPredictMode4, setShowPredictMode4] = useState(false);
  const [predictedPosition4, setPredictedPosition4] = useState(null);
  const [arrayRepresentation4, setArrayRepresentation4] = useState([]);

  // Level 5: Hospital Priority Queue state
  const [patients5, setPatients5] = useState([]);
  const [waitingRoom5, setWaitingRoom5] = useState([]);
  const [servedPatients5, setServedPatients5] = useState([]);
  const [currentPatient5, setCurrentPatient5] = useState(null);
  const [isProcessing5, setIsProcessing5] = useState(false);
  const [level5Message, setLevel5Message] = useState('');
  const [clieckedOnserved, setClieckedOnserved] = useState(0);
  const [isLevel5Complete, setIsLevel5Complete] = useState(false);
  const [animationSpeed5, setAnimationSpeed5] = useState(1);
  const [isPaused5, setIsPaused5] = useState(false);
  const [stats5, setStats5] = useState({
    totalPatients: 0,
    averageWaitTime: 0,
    satisfactionScore: 100,
    patientsServed: 0
  });
  const [newPatientPriority5, setNewPatientPriority5] = useState(5);
  const [patientGenerator5, setPatientGenerator5] = useState(null);
  const [isAutoMode5, setIsAutoMode5] = useState(false);

  // Level 6: Max vs Min Heap Comparison state
  const [maxHeap6, setMaxHeap6] = useState([100, 80, 60, 50, 40, 30, 20]);
  const [minHeap6, setMinHeap6] = useState([20, 30, 40, 50, 60, 80, 100]);
  const [selectedHeap6, setSelectedHeap6] = useState(null);
  const [level6Message, setLevel6Message] = useState('');
  const [isLevel6Complete, setIsLevel6Complete] = useState(false);
  const [highlightedNode6, setHighlightedNode6] = useState(null);

  // Level 7: Priority Queue Types
  const [isLevel7Complete, setIsLevel7Complete] = useState(false);

  // Level 8: Build Max/Min Priority Queue Puzzle (Separate Drag Areas)
  const [level8AllElements, setLevel8AllElements] = useState([]); // The original set
  const [level8MaxDrag, setLevel8MaxDrag] = useState([]); // Numbers available for Max
  const [level8MinDrag, setLevel8MinDrag] = useState([]); // Numbers available for Min
  const [level8MaxHeap, setLevel8MaxHeap] = useState([]);
  const [level8MinHeap, setLevel8MinHeap] = useState([]);
  const [level8Message, setLevel8Message] = useState('');
  const [isLevel8Complete, setIsLevel8Complete] = useState(false);
  const [draggedNumber, setDraggedNumber] = useState(null);
  const [dragSource, setDragSource] = useState(null); // 'maxDrag', 'minDrag', 'max', 'min'

  // Level 9: Max Heap Tree Builder state
  const [level9AvailableNodes, setLevel9AvailableNodes] = useState([]);
  const [level9TreeSlots, setLevel9TreeSlots] = useState([]);
  const [level9Message, setLevel9Message] = useState('');
  const [isLevel9Complete, setIsLevel9Complete] = useState(false);
  const [draggedNode9, setDraggedNode9] = useState(null);
  const [dragSource9, setDragSource9] = useState(null);

  // Level 10: Min Heap Tree Builder state
  const [level10AvailableNodes, setLevel10AvailableNodes] = useState([]);
  const [level10TreeSlots, setLevel10TreeSlots] = useState([]);
  const [level10Message, setLevel10Message] = useState('');
  const [isLevel10Complete, setIsLevel10Complete] = useState(false);
  const [draggedNode10, setDraggedNode10] = useState(null);
  const [dragSource10, setDragSource10] = useState(null);

  // Helper function to check if an array represents a valid Max-Heap
  const isMaxHeap = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      const leftChildIdx = 2 * i + 1;
      const rightChildIdx = 2 * i + 2;

      if (leftChildIdx < arr.length && arr[leftChildIdx] > arr[i]) {
        return false; // Left child is greater than parent
      }
      if (rightChildIdx < arr.length && arr[rightChildIdx] > arr[i]) {
        return false; // Right child is greater than parent
      }
    }
    return true;
  };

  // Helper function to check if an array represents a valid Min-Heap
  const isMinHeap = (arr) => {
    for (let i = 0; i < Math.floor(arr.length / 2); i++) { // Only need to check parent nodes
      const leftChildIdx = 2 * i + 1;
      const rightChildIdx = 2 * i + 2;

      if (leftChildIdx < arr.length && arr[leftChildIdx] < arr[i]) {
        return false; // Left child is smaller than parent
      }
      if (rightChildIdx < arr.length && arr[rightChildIdx] < arr[i]) {
        return false; // Right child is smaller than parent
      }
    }
    return true;
  };

  // Helper function to find min-heap violations
  const findMinHeapViolations = (arr) => {
    const violatedIndices = [];
    for (let i = 0; i < Math.floor(arr.length / 2); i++) { // Only need to check parent nodes
      const leftChildIdx = 2 * i + 1;
      const rightChildIdx = 2 * i + 2;

      if (leftChildIdx < arr.length && arr[leftChildIdx] < arr[i]) {
        violatedIndices.push(i);
      }
      if (rightChildIdx < arr.length && arr[rightChildIdx] < arr[i]) {
        if (!violatedIndices.includes(i)) {
          violatedIndices.push(i);
        }
      }
    }
    return violatedIndices;
  };

  // Calculate score based on level
  const calculateScore = (level) => {
    return 10; // Fixed score of 10 points per level
  };

  // Save progress to database
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
        topicId: 'heap-priority-queue',
        level: Number(level),
        score: Number(score),
        timeSpent: Number(timeSpent)
      };

      // Log when sending progress data
      console.log('[HeapPriorityQueueMaster] Sending progress data:', progressData);

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
        console.error('[HeapPriorityQueueMaster] Failed to save progress:', errorData.message || response.statusText);
        throw new Error(`Failed to save progress: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('[HeapPriorityQueueMaster] Progress save response:', data);
      
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
      console.error('[HeapPriorityQueueMaster] Error saving progress:', error);
      // Silently handle the error since we know it's a duplicate key issue
      // and the score is already updated
    } finally {
      setIsSaving(false);
    }
  };

  const initializeLevel1 = () => {
    const initialNodes = [15, 10, 8, 7, 4, 2, 1]; // Given nodes
    setTreeSlots1(Array(initialNodes.length).fill(null));
    setAvailableNodes1([...initialNodes].sort(() => Math.random() - 0.5)); // Shuffle nodes
    setSelectedNode1(null);
    setSelectedNodeIndex1(null);
    setLevel1Message('Place the nodes to form a Complete Binary Tree. Fill levels from left to right!');
    setIsLevelComplete(false);
    setGameMessage('Build a Complete Binary Tree!');
    setHighlightedLevel1(null);
  };

  const handleNodeSelect1 = (nodeValue, originalIndex) => {
    setSelectedNode1(nodeValue);
    setSelectedNodeIndex1(originalIndex);
    setLevel1Message(`Selected node: ${nodeValue}. Now click an empty slot to place it.`);
  };

  const handlePlaceNode1 = (slotIndex) => {
    if (selectedNode1 === null) {
      setLevel1Message('Please select a node first.');
      return;
    }

    if (treeSlots1[slotIndex] !== null) {
      setLevel1Message('Slot already occupied. Choose an empty slot.');
      return;
    }

    // Validate complete binary tree rule: current slot must be the first null slot
    const firstNullIndex = treeSlots1.findIndex(slot => slot === null);
    if (slotIndex !== firstNullIndex) {
      setLevel1Message('Invalid placement! A Complete Binary Tree must fill levels from left to right without gaps. Place the node in the next available slot.');
      return;
    }

    const newTreeSlots = [...treeSlots1];
    newTreeSlots[slotIndex] = selectedNode1;
    setTreeSlots1(newTreeSlots);

    const newAvailableNodes = availableNodes1.filter((_, idx) => idx !== selectedNodeIndex1);
    setAvailableNodes1(newAvailableNodes);

    setSelectedNode1(null);
    setSelectedNodeIndex1(null);

    // Check if level is complete
    if (newAvailableNodes.length === 0) {
      handleLevelComplete(1);
      setLevel1Message('Level Complete! You have successfully built a Complete Binary Tree!');
    } else {
      setLevel1Message('Node placed successfully! Select another node to continue.');
    }
  };

  const initializeLevel2 = () => {
    const sampleTrees = [
      { id: 1, nodes: [100, 70, 60, 50, 40, 30, 20], isCorrect: true, explanation: 'This is a valid Max-Heap: every parent is greater than or equal to its children.' },
      { id: 2, nodes: [50, 60, 40, 30, 20, 10, 5], isCorrect: false, explanation: 'Invalid: Node 60 (child) is greater than Node 50 (parent).' },
      { id: 3, nodes: [25, 17, 18, 12, 15, 10, 1], isCorrect: true, explanation: 'This is a valid Max-Heap.' },
      { id: 4, nodes: [90, 80, 70, 60, 100, 50, 40], isCorrect: false, explanation: 'Invalid: Node 100 (child) is greater than Node 70 (parent).' },
    ];
    setTreesData2(sampleTrees.map(tree => ({ ...tree, isViolated: false }))); // Add isViolated for visual feedback
    setSelectedTreeIndex2(null);
    setLevel2Message('Click on the trees that are valid Max-Heaps.');
    setGameMessage('Become a Heap Detective!');
    setShowViolations2(false);
    setCorrectlyIdentified2(Array(sampleTrees.length).fill(false));
    setIsLevelComplete(false);
    setHoveredNodeInfo2({ treeIndex: null, nodeIndex: null }); // Reset hover state
  };

  const handleTreeClick2 = (index) => {
    if (correctlyIdentified2[index]) return; // Don't allow re-clicking correctly identified trees

    const isMaxHeapTree = isMaxHeap(treesData2[index].nodes);
    const isMinHeapTree = isMinHeap(treesData2[index].nodes);
    const isNeither = !isMaxHeapTree && !isMinHeapTree;

    console.log('Tree clicked:', index);
    console.log('Is Max Heap:', isMaxHeapTree);
    console.log('Is Min Heap:', isMinHeapTree);
    console.log('Current correctly identified:', correctlyIdentified2);

    const newCorrectlyIdentified = [...correctlyIdentified2];
    // Only mark as correctly identified if it's a valid Max-Heap
    newCorrectlyIdentified[index] = isMaxHeapTree;
    setCorrectlyIdentified2(newCorrectlyIdentified);

    // Update message based on the tree type
    if (isMaxHeapTree) {
      setLevel2Message('Correct! This is a valid Max-Heap.');
    } else if (isMinHeapTree) {
      setLevel2Message('This is a Min-Heap, but we\'re looking for Max-Heaps.');
    } else {
      setLevel2Message('This is not a valid heap. Look for violations in parent-child relationships.');
    }

    // Check if all valid Max-Heaps have been identified
    const allValidMaxHeaps = treesData2.every((tree, idx) => {
      const isMax = isMaxHeap(tree.nodes);
      // If it's a Max-Heap, it should be identified; if it's not, it should not be identified
      return isMax ? newCorrectlyIdentified[idx] : !newCorrectlyIdentified[idx];
    });

    console.log('All valid Max-Heaps identified:', allValidMaxHeaps);

    if (allValidMaxHeaps) {
      console.log('Setting level complete');
      setIsLevelComplete(true);
      handleLevelComplete(2);
      setLevel2Message('Level Complete! You have successfully identified all Max-Heaps!');
    }
  };

  const handleExplain2 = () => {
    setShowViolations2(prev => !prev);
    if (!showViolations2) {
      setLevel2Message('Violations are now shown. Examine the rules carefully.');
    } else {
      setLevel2Message('Violations hidden.');
    }
  };

  const initializeLevel3 = () => {
    const initialHeap = [8, 4, 6, 2, 10, 15, 7]; // Initial broken min-heap
    setHeapArray3([...initialHeap]);
    setSwapsCount3(0);
    setSelectedNodesForSwap3([]);
    setLevel3Message('Swap nodes to fix the Min-Heap. Goal: smallest parent, larger children!');
    setIsLevel3Complete(false);
    setGameMessage('Repair the Min-Heap!');
    setViolations3(findMinHeapViolations(initialHeap));
  };

  const initializeLevel4 = () => {
    setHeapArray4([]);
    setInsertionSequence4([25, 15, 30, 8, 20, 35]);
    setCurrentInsertionIndex4(0);
    setBubbleUpPath4([]);
    setIsAnimating4(false);
    setAnimationSpeed4(1);
    setIsPaused4(false);
    setLevel4Message('Watch how elements bubble up to maintain the Max-Heap property!');
    setIsLevel4Complete(false);
    setShowPredictMode4(false);
    setPredictedPosition4(null);
    setArrayRepresentation4([]);
    setGameMessage('Level 4: Bubble Up Challenge! 🎈');
  };

  const initializeLevel5 = () => {
    setPatients5([]);
    setWaitingRoom5([]);
    setServedPatients5([]);
    setCurrentPatient5(null);
    setIsProcessing5(false);
    setLevel5Message("Welcome to the Hospital ER! Admit patients and manage the waiting room based on priority.");
    setIsLevel5Complete(false);
    setAnimationSpeed5(1);
    setIsPaused5(false);
    setStats5({
      totalPatients: 0,
      averageWaitTime: 0,
      satisfactionScore: 100,
      patientsServed: 0
    });
    setNewPatientPriority5(5);
    setPatientGenerator5(null);
    setIsAutoMode5(false);
    setGameMessage("Level 5: Hospital Priority Queue! 🏥");
  };

  const initializeLevel6 = () => {
    setMaxHeap6([100, 80, 60, 50, 40, 30, 20]);
    setMinHeap6([20, 30, 40, 50, 60, 80, 100]);
    setSelectedHeap6(null);
    setLevel6Message('Welcome to Level 6! Learn the difference between Max Heap and Min Heap.');
    setIsLevel6Complete(false);
    setHighlightedNode6(null);
    setGameMessage('Level 6: Max vs Min Heap Comparison! 🔄');
  };

  const initializeLevel7 = () => {
    setIsLevel7Complete(false);
    setGameMessage('Level 7: Priority Queue Types!');
  };

  const initializeLevel8 = () => {
    // Generate a random set of 6 unique numbers between 1 and 20
    let arr = [];
    while (arr.length < 6) {
      let n = Math.floor(Math.random() * 20) + 1;
      if (!arr.includes(n)) arr.push(n);
    }
    setLevel8AllElements(arr);
    setLevel8MaxDrag([...arr]);
    setLevel8MinDrag([...arr]);
    setLevel8MaxHeap([]);
    setLevel8MinHeap([]);
    setLevel8Message('Drag numbers from each Drag Area to their respective queue. Each number can only be used in one queue at a time. To remove, drag back to the Drag Area.');
    setIsLevel8Complete(false);
    setDraggedNumber(null);
    setDragSource(null);
    setGameMessage('Level 8: Build Max & Min Priority Queues!');
  };

  const initializeLevel9 = () => {
    // Generate 7 random unique numbers between 1 and 50
    let arr = [];
    while (arr.length < 7) {
      let n = Math.floor(Math.random() * 50) + 1;
      if (!arr.includes(n)) arr.push(n);
    }
    setLevel9AvailableNodes(arr);
    // Initialize tree slots with null values
    setLevel9TreeSlots(Array(7).fill(null));
    setLevel9Message('Drag numbers from the array to build a Max Heap Tree. Each number can only be used once. To remove, drag back to the array.');
    setIsLevel9Complete(false);
    setDraggedNode9(null);
    setDragSource9(null);
    setGameMessage('Level 9: Build a Max Heap Tree!');
  };

  const initializeLevel10 = () => {
    // Generate 7 random unique numbers between 1 and 50
    let arr = [];
    while (arr.length < 7) {
      let n = Math.floor(Math.random() * 50) + 1;
      if (!arr.includes(n)) arr.push(n);
    }
    setLevel10AvailableNodes(arr);
    // Initialize tree slots with null values
    setLevel10TreeSlots(Array(7).fill(null));
    setLevel10Message('Drag numbers from the array to build a Min Heap Tree. Each number can only be used once. To remove, drag back to the array.');
    setIsLevel10Complete(false);
    setDraggedNode10(null);
    setDragSource10(null);
    setGameMessage('Level 10: Build a Min Heap Tree!');
  };

  const generatePatient = () => {
    const priority = Math.floor(Math.random() * 10) + 1; // Priority 1-10
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
    return {
      id: Date.now(),
      priority,
      arrivalTime: Date.now(),
      satisfaction: 100,
      avatar
    };
  };

  const startPatientGenerator = () => {
    if (patientGenerator5) {
      clearInterval(patientGenerator5);
    }
    const generator = setInterval(() => {
      if (!isPaused5) {
        const newPatient = generatePatient();
        setPatients5(prev => [...prev, newPatient]);
        setWaitingRoom5(prev => [...prev, newPatient]);
        setStats5(prev => ({
          ...prev,
          totalPatients: prev.totalPatients + 1
        }));
      }
    }, 5000 / animationSpeed5);
    setPatientGenerator5(generator);
  };

  const stopPatientGenerator = () => {
    if (patientGenerator5) {
      clearInterval(patientGenerator5);
      setPatientGenerator5(null);
    }
  };

  const admitPatient = (priority) => {
    if (isProcessing5) return;
    
    const newPatient = {
      id: Date.now(),
      priority,
      arrivalTime: Date.now(),
      satisfaction: 100,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
    };

    setPatients5(prev => [...prev, newPatient]);
    setWaitingRoom5(prev => [...prev, newPatient]);
    setStats5(prev => ({
      ...prev,
      totalPatients: prev.totalPatients + 1
    }));
  };

  const callNextPatient = () => {
    if (isProcessing5 || patients5.length === 0) return;

    setIsProcessing5(true);
    const nextPatient = patients5[0];
    setCurrentPatient5(nextPatient);
    setPatients5(prev => prev.slice(1));
    setServedPatients5(prev => [...prev, nextPatient]);
    setClieckedOnserved(prev => prev + 1);
    // Update stats
    setStats5(prev => ({
      ...prev,
      patientsServed: prev.patientsServed + 1,
      totalPatients: prev.totalPatients - 1,
      averageWaitTime: (prev.averageWaitTime * prev.patientsServed + nextPatient.waitTime) / (prev.patientsServed + 1)
    }));

    // Check if level is complete
    if ( (patients5.length === 0 && waitingRoom5.length === 0 )||  clieckedOnserved >= 10 ) {
      handleLevelComplete(5);
      setLevel5Message('Level Complete! You have successfully managed the hospital priority queue!');
      setIsLevel5Complete(true);
    }

    setTimeout(() => {
      setCurrentPatient5(null);
      setIsProcessing5(false);
    }, 2000);
  };

  const toggleAutoMode = () => {
    setIsAutoMode5(!isAutoMode5);
    if (!isAutoMode5) {
      startPatientGenerator();
    } else {
      stopPatientGenerator();
    }
  };

  const togglePause5 = () => {
    setIsPaused5(!isPaused5);
  };

  const handleSpeedChange5 = (speed) => {
    setAnimationSpeed5(speed);
    if (isAutoMode5) {
      stopPatientGenerator();
      startPatientGenerator();
    }
  };

  // Helper functions for Level 4
  const getParentIndex = (index) => Math.floor((index - 1) / 2);

  const getLeftChildIndex = (index) => 2 * index + 1;

  const getRightChildIndex = (index) => 2 * index + 2;

  const bubbleUp = async (heap, index) => {
    const path = [];
    let currentIndex = index;

    while (currentIndex > 0) {
      const parentIndex = getParentIndex(currentIndex);
      if (heap[currentIndex] <= heap[parentIndex]) break;

      // Add current node and its parent to the path
      path.push({ node: currentIndex, parent: parentIndex });
      
      // Swap values
      [heap[currentIndex], heap[parentIndex]] = [heap[parentIndex], heap[currentIndex]];
      currentIndex = parentIndex;
    }

    return path;
  };

  const handleNextStep4 = async () => {
    if (isAnimating4 || isPaused4 || isLevel4Complete) return;

    if (currentInsertionIndex4 >= insertionSequence4.length) {
      // Already complete, don't do anything
      return;
    }

    setIsAnimating4(true);
    const newValue = insertionSequence4[currentInsertionIndex4];
    const newHeap = [...heapArray4, newValue];
    const newIndex = newHeap.length - 1;

    // Update array representation
    setArrayRepresentation4([...newHeap]);

    // Calculate and animate bubble up path
    const path = await bubbleUp(newHeap, newIndex);
    setBubbleUpPath4(path);

    // Update heap after animation
    setHeapArray4(newHeap);
    setCurrentInsertionIndex4(prev => {
      const nextIndex = prev + 1;
      // If this was the last insertion, mark as complete
      if (nextIndex >= insertionSequence4.length) {
        setIsLevel4Complete(true);
        setLevel4Message('Level Complete! You have successfully demonstrated the bubble-up operation!');
        handleLevelComplete(4);
      }
      return nextIndex;
    });

    setIsAnimating4(false);
  };

  const handlePredict4 = (position) => {
    if (!showPredictMode4) return;
    setPredictedPosition4(position);
  };

  const handleSpeedChange4 = (speed) => {
    setAnimationSpeed4(speed);
  };

  const togglePause4 = () => {
    setIsPaused4(prev => !prev);
  };

  const togglePredictMode4 = () => {
    setShowPredictMode4(prev => !prev);
    setPredictedPosition4(null);
  };

  const handleNodeClick3 = (index) => {
    if (isLevel3Complete) return;

    const newSelectedNodes = [...selectedNodesForSwap3];
    const nodeIndex = newSelectedNodes.indexOf(index);

    if (nodeIndex === -1) {
      if (newSelectedNodes.length < 2) {
        newSelectedNodes.push(index);
      }
    } else {
      newSelectedNodes.splice(nodeIndex, 1);
    }

    setSelectedNodesForSwap3(newSelectedNodes);

    if (newSelectedNodes.length === 2) {
      const [index1, index2] = newSelectedNodes;
      const newHeapArray = [...heapArray3];
      [newHeapArray[index1], newHeapArray[index2]] = [newHeapArray[index2], newHeapArray[index1]];
      setHeapArray3(newHeapArray);
      setSwapsCount3(prev => prev + 1);
      setSelectedNodesForSwap3([]);

      // Check if heap is now valid
      if (isMinHeap(newHeapArray)) {
        handleLevelComplete(3);
        setLevel3Message('Level Complete! You have successfully repaired the Min-Heap!');
        setIsLevel3Complete(true);
      }
    }
  };

  const renderNode = (num, index, treeLength, currentTreeIndex) => {
    const level = Math.floor(Math.log2(index + 1));
    const nodesPerLevel = Math.pow(2, level);
    const posInLevel = index + 1 - Math.pow(2, level);
    const slotWidth = 100 / (nodesPerLevel + 1); 
    const x = (posInLevel + 1) * slotWidth;
    const y = level * 70 + 30; // Vertical spacing

    const isHovered = hoveredNodeInfo2.treeIndex === currentTreeIndex && hoveredNodeInfo2.nodeIndex === index;

    const parentIndex = Math.floor((index - 1) / 2);
    const leftChildIndex = 2 * index + 1;
    const rightChildIndex = 2 * index + 2;

    const isParentOfHovered = hoveredNodeInfo2.treeIndex === currentTreeIndex && 
                              (hoveredNodeInfo2.nodeIndex === leftChildIndex || hoveredNodeInfo2.nodeIndex === rightChildIndex) && 
                              index === parentIndex;

    const isChildOfHovered = hoveredNodeInfo2.treeIndex === currentTreeIndex && 
                             hoveredNodeInfo2.nodeIndex === parentIndex &&
                             (index === leftChildIndex || index === rightChildIndex);

    return (
      <motion.div
        key={index}
        onMouseEnter={() => setHoveredNodeInfo2({ treeIndex: currentTreeIndex, nodeIndex: index })}
        onMouseLeave={() => setHoveredNodeInfo2({ treeIndex: null, nodeIndex: null })}
        className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-lg
          ${isHovered ? 'bg-yellow-400 text-gray-900 ring-2 ring-yellow-200' : 
            isParentOfHovered || isChildOfHovered ? 'bg-purple-500 text-white' : 
            'bg-blue-600 text-white'
          }
        `}
        style={{
          left: `${x}%`,
          top: `${y}px`,
          transform: 'translate(-50%, -50%)',
          zIndex: 10
        }}
      >
        {num}
      </motion.div>
    );
  };

  const renderTree = (tree, treeIndex) => {
    const maxLevel = tree.nodes.length > 0 ? Math.floor(Math.log2(tree.nodes.length)) : 0;

    const hoveredParent = hoveredNodeInfo2.treeIndex === treeIndex && hoveredNodeInfo2.nodeIndex !== null 
                          ? Math.floor((hoveredNodeInfo2.nodeIndex - 1) / 2) : null;
    const hoveredLeftChild = hoveredNodeInfo2.treeIndex === treeIndex && hoveredNodeInfo2.nodeIndex !== null 
                            ? 2 * hoveredNodeInfo2.nodeIndex + 1 : null;
    const hoveredRightChild = hoveredNodeInfo2.treeIndex === treeIndex && hoveredNodeInfo2.nodeIndex !== null 
                             ? 2 * hoveredNodeInfo2.nodeIndex + 2 : null;

    let hoverMessage = '';
    if (hoveredNodeInfo2.treeIndex === treeIndex && hoveredNodeInfo2.nodeIndex !== null) {
      const nodeValue = tree.nodes[hoveredNodeInfo2.nodeIndex];
      const parentValue = tree.nodes[hoveredParent] !== undefined ? tree.nodes[hoveredParent] : 'N/A';
      const leftChildValue = tree.nodes[hoveredLeftChild] !== undefined ? tree.nodes[hoveredLeftChild] : 'N/A';
      const rightChildValue = tree.nodes[hoveredRightChild] !== undefined ? tree.nodes[hoveredRightChild] : 'N/A';

      hoverMessage = `Node: ${nodeValue}, Parent: ${parentValue}, Left: ${leftChildValue}, Right: ${rightChildValue}`;
    }

    return (
      <div 
        key={tree.id}
        className={`relative bg-white-100 border-2 border-green-400 p-4 rounded-lg shadow-xl cursor-pointer
          ${selectedTreeIndex2 === treeIndex ? (treesData2[treeIndex].isCorrect ? 'border-green-500' : 'border-red-500') : 'border-green-400'}
          ${correctlyIdentified2[treeIndex] ? 'border-green-500' : ''}
        `}
        onClick={() => handleTreeClick2(treeIndex)}
        style={{ width: '45%', minHeight: '250px' }}
      >
        <h4 className="text-lg font-bold text-blue-600 text-center mb-2">Tree {tree.id}</h4>
        
        {tree.nodes.map((num, nodeIndex) => renderNode(num, nodeIndex, tree.nodes.length, treeIndex))}

        {/* Lines connecting nodes */}
        <svg className="absolute w-full h-full" style={{ top: 0, left: 0, overflow: 'visible' }}>
          {tree.nodes.map((num, nodeIndex) => {
            if (nodeIndex === 0) return null; // Root has no parent

            const parentIndex = Math.floor((nodeIndex - 1) / 2);

            const level = Math.floor(Math.log2(nodeIndex + 1));
            const nodesPerLevel = Math.pow(2, level);
            const posInLevel = nodeIndex + 1 - Math.pow(2, level);
            const slotWidth = 100 / (nodesPerLevel + 1); 
            const x1 = (posInLevel + 1) * slotWidth;
            const y1 = level * 70 + 30;

            const parentLevel = Math.floor(Math.log2(parentIndex + 1));
            const parentNodesPerLevel = Math.pow(2, parentLevel);
            const parentPosInLevel = parentIndex + 1 - Math.pow(2, parentLevel);
            const parentSlotWidth = 100 / (parentNodesPerLevel + 1); 
            const x2 = (parentPosInLevel + 1) * parentSlotWidth;
            const y2 = parentLevel * 70 + 30;

            const isLineHighlighted = hoveredNodeInfo2.treeIndex === treeIndex && (
              (hoveredNodeInfo2.nodeIndex === nodeIndex) || // Current node is hovered child
              (hoveredNodeInfo2.nodeIndex === parentIndex) || // Current node is hovered parent
              (nodeIndex === hoveredParent && parentIndex === hoveredNodeInfo2.nodeIndex) || // Current line connects hovered parent to current node (which is its child)
              (nodeIndex === hoveredLeftChild && parentIndex === hoveredNodeInfo2.nodeIndex) ||
              (nodeIndex === hoveredRightChild && parentIndex === hoveredNodeInfo2.nodeIndex)
            );

            return (
              <line 
                key={`line-${tree.id}-${nodeIndex}`}
                x1={`${x1}%`} y1={`${y1}px`} 
                x2={`${x2}%`} y2={`${y2}px`} 
                stroke={isLineHighlighted ? '#A78BFA' : '#4B5563'} strokeWidth={isLineHighlighted ? "3" : "2"} 
                style={{ position: 'absolute', zIndex: 5 }}
              />
            );
          })}
        </svg>

        {showViolations2 && !isMaxHeap(tree.nodes) && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2 bg-red-800 text-red-200 text-xs rounded-md">
            {tree.explanation}
          </div>
        )}

        {hoverMessage && hoveredNodeInfo2.treeIndex === treeIndex && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-md z-20">
            {hoverMessage}
          </div>
        )}
      </div>
    );
  };

  const renderLevel1 = () => {
    const maxLevel = treeSlots1.length > 0 ? Math.floor(Math.log2(treeSlots1.length)) : 0;
    
    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-white border-2 border-green-400 p-6 rounded-lg shadow-lg max-w-2xl text-center mb-4">
          <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-lg tracking-tight font-serif">Level 1: The Complete Binary Tree Builder</h2>
          <p className="text-gray-700 mb-4">
            Place the given numbers into the tree slots to form a <strong>Complete Binary Tree</strong>.<br/>
            Remember, a complete binary tree fills levels from left to right without any gaps.
          </p>
          <div className="text-green-700 font-mono text-lg">
            {level1Message}
          </div>
        </div>

        {/* Available Nodes */}
        <div className="bg-white-100 border-2 border-green-400 p-4 rounded-lg shadow-lg flex flex-wrap justify-center gap-4 w-full max-w-4xl">
          <h3 className="text-xl text-blue-600 font-bold  400 w-full mb-2">Available Nodes:</h3>
          {availableNodes1.length === 0 ? (
            <p className="text-gray-400">No nodes left to place!</p>
          ) : (
            availableNodes1.map((num, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNodeSelect1(num, index)}
                className={`w-16 h-16 bg-green-400 rounded-lg flex items-center justify-center text-xl font-bold shadow-lg cursor-pointer
                  ${selectedNode1 === num ? 'ring-4 ring-yellow-400' : ''}
                `}
              >
                {num}
              </motion.div>
            ))
          )}
        </div>

        {/* Tree Visualization */}
        <div className="bg-white-100 border-2 border-green-400 p-4 rounded-lg shadow-lg min-h-[300px] w-full max-w-4xl relative">
          {/* <h3 className="text-xl font-bold text-blue-400 w-full mb-4 text-center">Tree Structure:</h3> */}
          
          {treeSlots1.map((num, index) => {
            const level = Math.floor(Math.log2(index + 1));
            const nodesPerLevel = Math.pow(2, level);
            const posInLevel = index + 1 - Math.pow(2, level);
            
            // Calculate X position based on level and position within level
            // This formula centers the nodes for each level
            const totalWidthFactor = Math.pow(2, maxLevel + 1) - 1; // Max nodes in the deepest level + 1
            const slotWidth = 100 / (nodesPerLevel + 1); // Simple distribution
            const x = (posInLevel + 1) * slotWidth;
            
            const y = level * 80 + 40; // Vertical spacing

            const isHighlighted = highlightedLevel1 === level;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handlePlaceNode1(index)}
                className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shadow-lg cursor-pointer
                  ${num !== null ? 'bg-blue-600 text-white' : 'bg-gray-400 text-black border-2 border-dashed border-gray-500'}
                  ${isHighlighted ? 'ring-4 ring-orange-400' : ''}
                `}
                style={{
                  left: `${x}%`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
                title={num !== null ? `Node: ${num}` : `Empty Slot ${index + 1}`}
              >
                {num !== null ? num : (index + 1)}
              </motion.div>
            );
          })}
          {/* Lines connecting nodes (simplified for first few levels) */}
          {treeSlots1.map((num, index) => {
            if (index === 0) return null; // Root has no parent

            const parentIndex = Math.floor((index - 1) / 2);

            const level = Math.floor(Math.log2(index + 1));
            const nodesPerLevel = Math.pow(2, level);
            const posInLevel = index + 1 - Math.pow(2, level);
            const slotWidth = 100 / (nodesPerLevel + 1); 
            const x1 = (posInLevel + 1) * slotWidth;
            const y1 = level * 80 + 40;

            const parentLevel = Math.floor(Math.log2(parentIndex + 1));
            const parentNodesPerLevel = Math.pow(2, parentLevel);
            const parentPosInLevel = parentIndex + 1 - Math.pow(2, parentLevel);
            const parentSlotWidth = 100 / (parentNodesPerLevel + 1); 
            const x2 = (parentPosInLevel + 1) * parentSlotWidth;
            const y2 = parentLevel * 80 + 40;

            return (
              <svg key={`line-${index}`} className="absolute w-full h-full" style={{ top: 0, left: 0, overflow: 'visible' }}>
                <line 
                  x1={`${x1}%`} y1={`${y1}px`} 
                  x2={`${x2}%`} y2={`${y2}px`} 
                  stroke="#4B5563" strokeWidth="2" 
                  style={{ position: 'absolute', zIndex: 5 }}
                />
              </svg>
            );
          })}
        </div>

        {/* Level Highlighting Controls */}
        <div className="flex space-x-2">
          <span className="text-blue-800 font-bold text-md pl-4">Highlight Level</span>
          {[...Array(maxLevel + 1).keys()].map(level => (
            <button
              key={`highlight-btn-${level}`}
              onClick={() => setHighlightedLevel1(level)}
              className={`px-3 py-1 rounded-md text-sm font-bold
                ${highlightedLevel1 === level ? 'bg-orange-500 text-white' : 'bg-green-200 hover:bg-gray-600'}
              `}
            >
              {level}
            </button>
          ))}
          <button
            onClick={() => setHighlightedLevel1(null)}
            className="px-3 py-1 rounded-md text-sm text-white font-bold bg-green-600 hover:bg-gray-600"
          >
            Clear
          </button>
        </div>

        {/* Controls */}
        <div className="flex space-x-4 items-center">
          <button
            onClick={initializeLevel1}
            className="px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg"
          >
            Reset Level
          </button>
        </div>

        {isLevelComplete && (
          <div className="mt-8 p-4 bg-green-700 rounded-lg text-white text-center text-xl font-bold">
            Level 1 Complete! Excellent work building the Complete Binary Tree!
            <br/>
            {currentLevel < MAX_LEVEL ? (
              <button
                onClick={() => setCurrentLevel(prev => prev + 1)}
                className="block mt-4 px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg"
              >
                Next Level
              </button>
            ) : (
              <Link to="/dashboard" className="block mt-4 px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg">Go to Dashboard</Link>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderLevel2 = () => {
    const allValidMaxHeaps = treesData2.every((tree, idx) => {
      const isMax = isMaxHeap(tree.nodes);
      return isMax ? correctlyIdentified2[idx] : !correctlyIdentified2[idx];
    });
    
    console.log('Render - All valid Max-Heaps identified:', allValidMaxHeaps);
    console.log('Render - Is level complete:', isLevelComplete);

    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-white border-2 border-green-400 p-6 rounded-lg shadow-lg max-w-2xl text-center mb-4">
          <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-lg tracking-tight font-serif">Level 2: Heap Detective</h2>
          <p className="text-gray-700 mb-4">
            Identify which of the following trees are valid <strong>Max-Heaps</strong>. 
            A Max-Heap requires that the value of each parent node is greater than or equal to the value of its children.
            Hover over a node to see its parent and children relationships!
          </p>
          <div className="text-green-700 font-mono text-lg">
            {level2Message}
          </div>
        </div>

        {/* Tree Diagrams */}
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl">
          {treesData2.map((tree, index) => renderTree(tree, index))}
        </div>

        {/* Controls */}
        <div className="flex space-x-4 items-center">
          <button
            onClick={handleExplain2}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg"
          >
            {showViolations2 ? 'Hide Explanations' : 'Explain Violations'}
          </button>
          <button
            onClick={initializeLevel2}
            className="px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg"
          >
            Reset Level
          </button>
        </div>

        {(isLevelComplete || allValidMaxHeaps) && (
          <div className="mt-8 p-4 bg-green-700 rounded-lg text-white text-center text-xl font-bold">
            Level 2 Complete! Excellent work, Heap Detective!
            <br/>
            {currentLevel < MAX_LEVEL ? (
              <button
                onClick={() => setCurrentLevel(prev => prev + 1)}
                className="block mt-4 px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg"
              >
                Next Level
              </button>
            ) : (
              <Link to="/dashboard" className="block mt-4 px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg">Go to Dashboard</Link>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderLevel3 = () => {
    const maxLevel = heapArray3.length > 0 ? Math.floor(Math.log2(heapArray3.length)) : 0;

    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-white border-2 border-green-400 p-6 rounded-lg shadow-lg max-w-2xl text-center mb-4">
          <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-lg tracking-tight font-serif">Level 3: Heap Repair Shop</h2>
          <p className="text-gray-700 mb-4">
            The Min-Heap is broken! Click on two nodes to swap them and restore the Min-Heap property. 
            Remember: every parent node must be smaller than or equal to its children.
          </p>
          <div className="text-green-700 font-mono text-lg">
            {level3Message}
          </div>
          <div className="text-gray-700 font-bold mt-2">
            Swaps: {swapsCount3}
          </div>
        </div>

        {/* Heap Visualization */}
        <div className="bg-white border-2 border-green-400 p-4 rounded-lg shadow-lg min-h-[300px] w-full max-w-4xl relative">
          {heapArray3.map((num, index) => {
            const level = Math.floor(Math.log2(index + 1));
            const nodesPerLevel = Math.pow(2, level);
            const posInLevel = index + 1 - Math.pow(2, level);
            const slotWidth = 100 / (nodesPerLevel + 1); 
            const x = (posInLevel + 1) * slotWidth;
            const y = level * 70 + 30; // Vertical spacing

            const isSelected = selectedNodesForSwap3.includes(index);
            const isViolated = violations3.includes(index);

            return (
              <motion.div
                key={index}
                layoutId={`heap-node-3-${index}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                onClick={() => handleNodeClick3(index)}
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-lg cursor-pointer
                  ${isSelected ? 'bg-yellow-400 text-gray-900 ring-2 ring-yellow-200' : 
                    isViolated ? 'bg-red-600 text-white ring-2 ring-red-400' : 
                    'bg-blue-600 text-white'
                  }
                `}
                style={{
                  left: `${x}%`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
              >
                {num}
              </motion.div>
            );
          })}
          {/* Lines connecting nodes */}
          <svg className="absolute w-full h-full" style={{ top: 0, left: 0, overflow: 'visible' }}>
            {heapArray3.map((num, index) => {
              if (index === 0) return null; // Root has no parent

              const parentIndex = Math.floor((index - 1) / 2);

              const level = Math.floor(Math.log2(index + 1));
              const nodesPerLevel = Math.pow(2, level);
              const posInLevel = index + 1 - Math.pow(2, level);
              const slotWidth = 100 / (nodesPerLevel + 1); 
              const x1 = (posInLevel + 1) * slotWidth;
              const y1 = level * 70 + 30;

              const parentLevel = Math.floor(Math.log2(parentIndex + 1));
              const parentNodesPerLevel = Math.pow(2, parentLevel);
              const parentPosInLevel = parentIndex + 1 - Math.pow(2, parentLevel);
              const parentSlotWidth = 100 / (parentNodesPerLevel + 1); 
              const x2 = (parentPosInLevel + 1) * parentSlotWidth;
              const y2 = parentLevel * 70 + 30;

              const isLineHighlighted = selectedNodesForSwap3.includes(index) || selectedNodesForSwap3.includes(parentIndex);

              return (
                <line 
                  key={`line-3-${index}`}
                  x1={`${x1}%`} y1={`${y1}px`} 
                  x2={`${x2}%`} y2={`${y2}px`} 
                  stroke={isLineHighlighted ? '#FCD34D' : '#4B5563'} strokeWidth={isLineHighlighted ? "3" : "2"} 
                  style={{ position: 'absolute', zIndex: 5 }}
                />
              );
            })}
          </svg>
        </div>

        {/* Controls */}
        <div className="flex space-x-4 items-center">
          <button
            onClick={initializeLevel3}
            className="px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg"
          >
            Reset Level
          </button>
        </div>

        {isLevel3Complete && (
          <div className="mt-8 p-4 bg-green-700 rounded-lg text-white text-center text-xl font-bold">
            Level 3 Complete! You fixed the Min-Heap!
            <br/>
            You made {swapsCount3} swaps.
            {currentLevel < MAX_LEVEL ? (
              <button
                onClick={() => setCurrentLevel(prev => prev + 1)}
                className="block mt-4 px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg"
              >
                Next Level
              </button>
            ) : (
              <Link to="/dashboard" className="block mt-4 px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg">Go to Dashboard</Link>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderLevel4 = () => {
    const maxLevel = heapArray4.length > 0 ? Math.floor(Math.log2(heapArray4.length)) : 0;

    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-white border-2 border-green-400 p-6 rounded-lg shadow-lg max-w-2xl text-center mb-4">
          <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-lg tracking-tight font-serif">Level 4: Bubble Up Challenge</h2>
          <p className="text-gray-700 mb-4">
            Watch how elements bubble up to maintain the Max-Heap property! 
            Each new element is added at the bottom and bubbles up if it's larger than its parent.
          </p>
          <div className="text-green-700 font-mono text-lg">
            {level4Message}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handleNextStep4}
            disabled={isAnimating4 || isPaused4 || currentInsertionIndex4 >= insertionSequence4.length}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300
              ${isAnimating4 || isPaused4 || currentInsertionIndex4 >= insertionSequence4.length
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white hover:from-green-500 hover:via-green-600 hover:to-emerald-700'}`}
          >
            Next Step
          </button>
          <button
            onClick={togglePause4}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300
              ${isPaused4 ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {isPaused4 ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={togglePredictMode4}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300
              ${showPredictMode4 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 hover:bg-gray-700'}`}
          >
            {showPredictMode4 ? 'Exit Predict Mode' : 'Enter Predict Mode'}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-blue-800">Speed:</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={animationSpeed4}
              onChange={(e) => handleSpeedChange4(parseFloat(e.target.value))}
              className="w-32"
            />
          </div>
        </div>

        {/* Heap Visualization */}
        <div className="bg-white border-2 border-green-400 p-4 rounded-lg shadow-lg min-h-[300px] w-full max-w-4xl relative">
          {heapArray4.map((num, index) => {
            const level = Math.floor(Math.log2(index + 1));
            const nodesPerLevel = Math.pow(2, level);
            const posInLevel = index + 1 - Math.pow(2, level);
            const slotWidth = 100 / (nodesPerLevel + 1); 
            const x = (posInLevel + 1) * slotWidth;
            const y = level * 70 + 30;

            const isInBubbleUpPath = bubbleUpPath4.some(step => 
              step.node === index || step.parent === index
            );

            return (
              <motion.div
                key={index}
                layoutId={`heap-node-4-${index}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  duration: 1 / animationSpeed4 
                }}
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-lg
                  ${isInBubbleUpPath ? 'bg-yellow-400 text-gray-900 ring-2 ring-yellow-200' : 'bg-blue-600 text-white'}
                `}
                style={{
                  left: `${x}%`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
              >
                {num}
              </motion.div>
            );
          })}

          {/* Lines connecting nodes */}
          <svg className="absolute w-full h-full" style={{ top: 0, left: 0, overflow: 'visible' }}>
            {heapArray4.map((num, index) => {
              if (index === 0) return null;

              const parentIndex = getParentIndex(index);
              const level = Math.floor(Math.log2(index + 1));
              const nodesPerLevel = Math.pow(2, level);
              const posInLevel = index + 1 - Math.pow(2, level);
              const slotWidth = 100 / (nodesPerLevel + 1); 
              const x1 = (posInLevel + 1) * slotWidth;
              const y1 = level * 70 + 30;

              const parentLevel = Math.floor(Math.log2(parentIndex + 1));
              const parentNodesPerLevel = Math.pow(2, parentLevel);
              const parentPosInLevel = parentIndex + 1 - Math.pow(2, parentLevel);
              const parentSlotWidth = 100 / (parentNodesPerLevel + 1); 
              const x2 = (parentPosInLevel + 1) * parentSlotWidth;
              const y2 = parentLevel * 70 + 30;

              const isLineInBubbleUpPath = bubbleUpPath4.some(step => 
                (step.node === index && step.parent === parentIndex) ||
                (step.node === parentIndex && step.parent === index)
              );

              return (
                <motion.line 
                  key={`line-4-${index}`}
                  x1={`${x1}%`} y1={`${y1}px`} 
                  x2={`${x2}%`} y2={`${y2}px`} 
                  stroke={isLineInBubbleUpPath ? '#FCD34D' : '#4B5563'} 
                  strokeWidth={isLineInBubbleUpPath ? "3" : "2"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 / animationSpeed4 }}
                  style={{ position: 'absolute', zIndex: 5 }}
                />
              );
            })}
          </svg>
        </div>

        {/* Array Representation */}
        <div className="bg-white border-2 border-green-400 p-4 rounded-lg shadow-lg w-full max-w-4xl">
          <h3 className="text-xl font-bold text-blue-600 mb-4 text-center">Array Representation:</h3>
          <div className="flex justify-center gap-2">
            {arrayRepresentation4.map((num, index) => (
              <div
                key={index}
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold
                  ${bubbleUpPath4.some(step => step.node === index || step.parent === index)
                    ? 'bg-yellow-400 text-gray-900'
                    : 'bg-blue-600 text-white'
                  }
                `}
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        {/* Next Element to Insert */}
        {currentInsertionIndex4 < insertionSequence4.length && (
          <div className="bg-white border-2 border-green-400 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-blue-600 mb-2">Next Element to Insert:</h3>
            <div className="w-12 h-12 rounded-lg bg-green-400 flex items-center justify-center text-sm font-bold">
              {insertionSequence4[currentInsertionIndex4]}
            </div>
          </div>
        )}

        {isLevel4Complete && (
          <div className="mt-8 p-4 bg-green-700 rounded-lg text-white text-center text-xl font-bold">
            Level 4 Complete! You've mastered the bubble-up operation!
            <br/>
            {currentLevel < MAX_LEVEL ? (
              <button
                onClick={() => setCurrentLevel(prev => prev + 1)}
                className="block mt-4 px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg"
              >
                Next Level
              </button>
            ) : (
              <Link to="/dashboard" className="block mt-4 px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg">
                Go to Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderLevel5 = () => {
    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-white border-2 border-green-400 p-6 rounded-lg shadow-lg max-w-2xl text-center mb-4">
          <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-lg tracking-tight font-serif">Level 5: Hospital Priority Queue</h2>
          <p className="text-gray-700 mb-4">
            Manage the Emergency Room waiting room using a priority queue.
            Patients with higher priority numbers (1-10) must be served first!
          </p>
          <div className="text-green-700 font-mono text-lg">
            {level5Message}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="10"
              value={newPatientPriority5}
              onChange={(e) => setNewPatientPriority5(parseInt(e.target.value))}
              className="w-20 px-3 py-2 bg-green-600 rounded-lg text-white"
            />
            <button
              onClick={() => admitPatient(newPatientPriority5)}
              disabled={isProcessing5}
              className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300
                ${isProcessing5 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600  text-white hover:from-green-500 hover:via-green-600 hover:to-emerald-700'}`}
            >
              Admit Patient
            </button>
          </div>
          <button
            onClick={callNextPatient}
            disabled={isProcessing5 || waitingRoom5.length === 0}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300
              ${isProcessing5 || waitingRoom5.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white hover:from-green-500 hover:via-green-600 hover:to-emerald-700'}`}
          >
            Call Next Patient
          </button>
          <button
            onClick={toggleAutoMode}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300
              ${isAutoMode5 ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-pink-600 hover:bg-pink-700 text-white'}`}
          >
            {isAutoMode5 ? 'Stop Auto Mode' : 'Start Auto Mode'}
          </button>
          <button
            onClick={togglePause5}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300
              ${isPaused5 ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-pink-600 hover:bg-pink-700 text-white'}`}
          >
            {isPaused5 ? 'Resume' : 'Pause'}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-pink-600">Speed:</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={animationSpeed5}
              onChange={(e) => handleSpeedChange5(parseFloat(e.target.value))}
              className="w-32"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          <div className="bg-blue-100 p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold text-blue-600">Total Patients</h3>
            <p className="text-2xl text-pink-400 font-bold">{stats5.totalPatients}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold text-blue-600">Average Wait Time</h3>
            <p className="text-2xl text-pink-400 font-bold">{Math.round(stats5.averageWaitTime / 1000)}s</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold text-blue-600">Satisfaction Score</h3>
            <p className="text-2xl text-pink-400 font-bold">{Math.round(stats5.satisfactionScore)}%</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold text-blue-600">Patients Served</h3>
            <p className="text-2xl text-pink-400 font-bold">{stats5.patientsServed}</p>
          </div>
        </div>

        {/* Waiting Room */}
        <div className="bg-green-200 p-4 rounded-lg shadow-lg w-full max-w-4xl">
          <h3 className="text-xl font-bold text-green-600 mb-4 text-center">Waiting Room</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {waitingRoom5.map(patient => (
              <div
                key={patient.id}
                className="relative bg-blue-400 p-4 rounded-lg shadow-lg"
              >
                <img
                  src={patient.avatar}
                  alt="Patient Avatar"
                  className="w-16 h-16 rounded-full"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-sm font-bold">
                  {patient.priority}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-md text-blue-900">
                    Wait: {Math.round((Date.now() - patient.arrivalTime) / 1000)}s
                  </div>
                  <div className="text-sm text-blue-900">
                    Satisfaction: {Math.max(0, 100 - Math.round((Date.now() - patient.arrivalTime) / 1000))}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Patient */}
        {currentPatient5 && (
          <div className="bg-green-200 p-4 rounded-lg shadow-lg w-full max-w-4xl">
            <h3 className="text-xl font-bold text-green-600 mb-4 text-center">Currently Serving</h3>
            <div className="flex justify-center">
              <div className="relative bg-gray-400 p-4 rounded-lg shadow-lg">
                <img
                  src={currentPatient5.avatar}
                  alt="Patient Avatar"
                  className="w-24 h-24 rounded-full"
                />
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-400 rounded-full flex items-center justify-center text-sm font-bold">
                  {currentPatient5.priority}
                </div>
                <div className="mt-4 text-center">
                  <div className="text-lg font-bold text-blue-900">
                    Wait Time: {Math.round(currentPatient5.waitTime / 1000)}s
                  </div>
                  <div className="text-lg font-bold text-blue-900">
                    Satisfaction: {Math.round(currentPatient5.satisfaction)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Served Patients */}
        <div className="bg-green-200 p-4 rounded-lg shadow-lg w-full max-w-4xl">
          <h3 className="text-xl font-bold text-blue-600 mb-4 text-center">Served Patients</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {servedPatients5.slice(-5).map(patient => patient && (
              <div
                key={patient.id}
                className="relative bg-green-800 p-4 rounded-lg shadow-lg opacity-75"
              >
                <img
                  src={patient.avatar}
                  alt="Patient Avatar"
                  className="w-16 h-16 rounded-full"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-sm font-bold">
                  {patient.priority}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm text-gray-300">
                    Wait: {Math.round(patient.waitTime / 1000)}s
                  </div>
                  <div className="text-sm text-gray-300">
                    Satisfaction: {Math.round(patient.satisfaction)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {isLevel5Complete && (
          <div className="mt-8 p-4 bg-green-700 rounded-lg text-white text-center text-xl font-bold">
          Level 5 Complete! You've mastered the Hospital Priority Queue! 🎉
          <br/>
          {currentLevel < MAX_LEVEL ? (
            <button
              onClick={() => setCurrentLevel(prev => prev + 1)}
              className="block mt-4 px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg"
            >
              Next Level
            </button>
          ) : (
            <Link to="/dashboard" className="block mt-4 px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg">
              Return to Dashboard
            </Link>
          )}
        </div>
        )}
      </div>
    );
  };

  const handleHeapSelect6 = (heapType) => {
    setSelectedHeap6(heapType);
    setLevel6Message(`${heapType === 'max' ? 'Max' : 'Min'} Heap selected. Click on nodes to see their relationships!`);
  };

  const handleNodeClick6 = (heapType, index) => {
    if (isLevel6Complete) return;

    const heap = heapType === 'max' ? maxHeap6 : minHeap6;
    const isCorrect = heapType === 'max' ? isMaxHeap(heap) : isMinHeap(heap);

    if (isCorrect) {
      handleLevelComplete(6);
      setLevel6Message('Level Complete! You have successfully identified the heap types!');
      setIsLevel6Complete(true);
    } else {
      setLevel6Message('Incorrect! Try again.');
    }
  };

  const renderHeap6 = (heap, type) => {
    const maxLevel = Math.floor(Math.log2(heap.length));
    
    return (
      <div className="relative bg-white border-2 border-green-600 p-4 rounded-lg shadow-lg min-h-[300px] w-full">
        <h3 className="text-xl   font-bold text-blue-600 ">
          {type === 'max' ? 'Max Heap' : 'Min Heap'}
        </h3>
        
        {heap.map((num, index) => {
          const level = Math.floor(Math.log2(index + 1));
          const nodesPerLevel = Math.pow(2, level);
          const posInLevel = index + 1 - Math.pow(2, level);
          const slotWidth = 100 / (nodesPerLevel + 1); 
          const x = (posInLevel + 1) * slotWidth;
          const y = level * 70 + 30;

          const isHighlighted = highlightedNode6?.type === type && highlightedNode6?.index === index;

          return (
            <div
              key={index}
              onClick={() => handleNodeClick6(type, index)}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-lg cursor-pointer
                ${isHighlighted ? 'bg-yellow-400 text-gray-900 ring-2 ring-yellow-200' : 
                  type === 'max' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
                }
              `}
              style={{
                left: `${x}%`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10
              }}
            >
              {num}
            </div>
          );
        })}
        
        {/* Lines connecting nodes */}
        <svg className="absolute w-full h-full" style={{ top: 0, left: 0, overflow: 'visible' }}>
          {heap.map((num, index) => {
            if (index === 0) return null;

            const parentIndex = Math.floor((index - 1) / 2);
            const level = Math.floor(Math.log2(index + 1));
            const nodesPerLevel = Math.pow(2, level);
            const posInLevel = index + 1 - Math.pow(2, level);
            const slotWidth = 100 / (nodesPerLevel + 1); 
            const x1 = (posInLevel + 1) * slotWidth;
            const y1 = level * 70 + 30;

            const parentLevel = Math.floor(Math.log2(parentIndex + 1));
            const parentNodesPerLevel = Math.pow(2, parentLevel);
            const parentPosInLevel = parentIndex + 1 - Math.pow(2, parentLevel);
            const parentSlotWidth = 100 / (parentNodesPerLevel + 1); 
            const x2 = (parentPosInLevel + 1) * parentSlotWidth;
            const y2 = parentLevel * 70 + 30;

            const isLineHighlighted = highlightedNode6?.type === type && 
              (highlightedNode6?.index === index || highlightedNode6?.index === parentIndex);

            return (
              <line 
                key={`line-6-${type}-${index}`}
                x1={`${x1}%`} y1={`${y1}px`} 
                x2={`${x2}%`} y2={`${y2}px`} 
                stroke={isLineHighlighted ? '#FCD34D' : '#4B5563'} 
                strokeWidth={isLineHighlighted ? "3" : "2"} 
                style={{ position: 'absolute', zIndex: 5 }}
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const renderLevel6 = () => {
    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-white border-2 border-green-400 p-6 rounded-lg shadow-lg max-w-2xl text-center mb-4">
          <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-lg tracking-tight font-serif">Level 6: Max vs Min Heap Comparison</h2>
          <p className="text-gray-700 mb-4">
            Learn the key differences between Max Heap and Min Heap. Click on nodes to see their relationships!
          </p>
          <div className="text-green-700 font-mono text-lg whitespace-pre-line">
            {level6Message} 
          </div>
        </div>

        {/* Heap Selection */}
        <div className="flex space-x-4">
          <button
            onClick={() => handleHeapSelect6('max')}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300
              ${selectedHeap6 === 'max' ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            Max Heap
          </button>
          <button
            onClick={() => handleHeapSelect6('min')}
            className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300
              ${selectedHeap6 === 'min' ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            Min Heap
          </button>
        </div>

        {/* Heap Visualizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
          {renderHeap6(maxHeap6, 'max')}
          {renderHeap6(minHeap6, 'min')}
        </div>
       
        {/* Comparison Panel */}
        <div className="bg-white border-2 border-green-600 p-6 rounded-lg shadow-lg w-full max-w-4xl">
          <h3 className="text-xl font-bold text-blue-600 mb-4 text-center">Key Differences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-800/50 p-4 rounded-lg">
              <h4 className="text-lg font-bold text-red-900 mb-2">Max Heap</h4>
              <ul className="list-disc list-inside text-white">
                <li>Parent nodes are always larger than their children</li>
                <li>Root node contains the maximum value</li>
                <li>Used for priority queues where highest priority is served first</li>
              </ul>
            </div>
            <div className="bg-green-800/50 p-4 rounded-lg">
              <h4 className="text-lg font-bold text-green-900 mb-2">Min Heap</h4>
              <ul className="list-disc list-inside text-white">
                <li>Parent nodes are always smaller than their children</li>
                <li>Root node contains the minimum value</li>
                <li>Used for priority queues where lowest priority is served first</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">Please click on the complet button to complete the task</h2>
        {/* Complete Task Button */}
        {!isLevel6Complete && (
          <button
            onClick={() => setIsLevel6Complete(true)}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg"
          >
            Complete Task
          </button>
        )}


        {/* Controls */}
        <div className="flex space-x-4">
          <button
            onClick={initializeLevel6}
            className="px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg"
          >
            Reset Level
          </button>
        </div>

        {isLevel6Complete && (
          <div className="mt-8 p-4 bg-green-700 rounded-lg text-white text-center text-xl font-bold">
            Level 6 Complete! You've mastered the differences between Max and Min Heaps! 🎉
            <br/>
            {currentLevel < MAX_LEVEL ? (
              <button
                onClick={() => setCurrentLevel(prev => prev + 1)}
                className="block mt-4 px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg"
              >
                Next Level
              </button>
            ) : (
              <Link to="/dashboard" className="block mt-4 px-6 py-3 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white rounded-lg font-bold text-lg transition-all duration-300 shadow-lg">
                Return to Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    );
  };

  const minPQExample = [
    { queue: [1, 3, 5, 7], action: 'Insert 2', result: [1, 2, 5, 7, 3] },
    { queue: [1, 2, 5, 7, 3], action: 'Remove Min', result: [2, 3, 5, 7] },
  ];
  const maxPQExample = [
    { queue: [9, 7, 5, 3], action: 'Insert 8', result: [9, 8, 5, 3, 7] },
    { queue: [9, 8, 5, 3, 7], action: 'Remove Max', result: [8, 7, 5, 3] },
  ];

  const renderPQTable = (example, type) => (
    <table className="w-full text-center border border-gray-700 rounded-lg mb-4">
      <thead>
        <tr className="bg-white">
          <th className="p-2">Current Queue</th>
          <th className="p-2">Action</th>
          <th className="p-2">Result</th>
        </tr>
      </thead>
      <tbody>
        {example.map((step, idx) => (
          <tr key={idx} className="border-t border-green-600">
            <td className="p-2">[{step.queue.join(', ')}]</td>
            <td className="p-2 font-bold">{step.action}</td>
            <td className="p-2">[{step.result.join(', ')}]</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderLevel7 = () => (
    <div className="flex flex-col items-center space-y-8 my-8">
      <div className="bg-white border-2 border-green-400 p-6 rounded-lg shadow-lg max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-lg tracking-tight font-serif">Level 7: Priority Queues (Min & Max)</h2>
        <p className="text-gray-700 mb-4">
          A <span className="text-yellow-400 font-bold">priority queue</span> is a special type of queue where each element has a priority.<br/>
          Elements are served based on their priority, not just their order of arrival.<br/>
          There are two main types:
        </p>
        <ul className="text-left text-gray-700 mb-4 list-disc list-inside">
          <li><span className="text-green-400 font-bold">Min-Priority Queue</span>: The element with the <span className="font-bold">smallest</span> priority is served first.</li>
          <li><span className="text-red-400 font-bold">Max-Priority Queue</span>: The element with the <span className="font-bold">largest</span> priority is served first.</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        <div className="bg-white border-2 border-green-600 p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-green-600 mb-2 text-center">Min-Priority Queue</h3>
          <p className="text-blue-600 mb-2 text-center">Smallest element always at the front.</p>
          {renderPQTable(minPQExample, 'min')}
        </div>
        <div className="bg-white border-2 border-green-600 p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-red-600 mb-2 text-center">Max-Priority Queue</h3>
          <p className="text-blue-600 mb-2 text-center">Largest element always at the front.</p>
          {renderPQTable(maxPQExample, 'max')}
        </div>
      </div>

      <h2 className="text-xl font-bold text-blue-400 mb-4 text-center">Click the button below to complete this task!</h2>
      {!isLevel7Complete && (
        <button
          onClick={() => {
            setIsLevel7Complete(true);
            handleLevelComplete(7);
          }}
          className="mt-4 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-lg font-bold text-lg transition-all duration-300"
        >
          Complete Task
        </button>
      )}

      {isLevel7Complete && (
        <div className="mt-8 p-4 bg-green-700 rounded-lg text-white text-center text-xl font-bold">
          Level 7 Complete! You now understand Min and Max Priority Queues! 🎉
          <br/>
          {currentLevel < MAX_LEVEL ? (
            <button
              onClick={() => setCurrentLevel(prev => prev + 1)}
              className="block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-all duration-300"
            >
              Next Level
            </button>
          ) : (
            <Link to="/dashboard" className="block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-all duration-300">
              Return to Dashboard
            </Link>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex space-x-4">
        <button
          onClick={initializeLevel7}
          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold text-white text-lg transition-all duration-300"
        >
          Reset Level
        </button>
      </div>
    </div>
  );

  // Drag handlers
  const handleDragStart8 = (num, source) => {
    setDraggedNumber(num);
    setDragSource(source);
  };
  const handleDragEnd8 = () => {
    setDraggedNumber(null);
    setDragSource(null);
  };
  const handleDrop8 = (target) => {
    if (draggedNumber == null) return;
    // Drag from maxDrag to max queue
    if (dragSource === 'maxDrag' && target === 'max') {
      setLevel8MaxHeap([...level8MaxHeap, draggedNumber]);
      setLevel8MaxDrag(level8MaxDrag.filter(n => n !== draggedNumber));
      setLevel8Message('Number added to Max Priority Queue!');
    }
    // Drag from minDrag to min queue
    else if (dragSource === 'minDrag' && target === 'min') {
      setLevel8MinHeap([...level8MinHeap, draggedNumber]);
      setLevel8MinDrag(level8MinDrag.filter(n => n !== draggedNumber));
      setLevel8Message('Number added to Min Priority Queue!');
    }
    // Remove from max queue
    else if (dragSource === 'max' && target === 'maxDrag') {
      setLevel8MaxHeap(level8MaxHeap.filter(n => n !== draggedNumber));
      setLevel8MaxDrag([...level8MaxDrag, draggedNumber]);
      setLevel8Message('Number removed from Max Priority Queue.');
    }
    // Remove from min queue
    else if (dragSource === 'min' && target === 'minDrag') {
      setLevel8MinHeap(level8MinHeap.filter(n => n !== draggedNumber));
      setLevel8MinDrag([...level8MinDrag, draggedNumber]);
      setLevel8Message('Number removed from Min Priority Queue.');
    }
    setDraggedNumber(null);
    setDragSource(null);
  };

  const checkLevel8Answer = () => {
    // All numbers must be used
    if (level8MaxDrag.length > 0 || level8MinDrag.length > 0) {
      setLevel8Message('All numbers must be used in both queues!');
      return;
    }
    if (!isMaxHeap(level8MaxHeap)) {
      setLevel8Message('Max Priority Queue is not a valid Max-Heap!');
      return;
    }
    if (!isMinHeap(level8MinHeap)) {
      setLevel8Message('Min Priority Queue is not a valid Min-Heap!');
      return;
    }
    setIsLevel8Complete(true);
    handleLevelComplete(8);
    setLevel8Message('');
  };

  // Render helpers
  const renderDraggableNumber8 = (num, source) => (
    <div
      key={num + '-' + source}
      draggable
      onDragStart={() => handleDragStart8(num, source)}
      onDragEnd={handleDragEnd8}
      className={`w-14 h-14 rounded-lg flex items-center justify-center text-xl font-bold shadow-lg cursor-move
        ${draggedNumber === num && dragSource === source ? 'ring-4 ring-yellow-400' :
          source === 'maxDrag' ? 'bg-green-400 text-white' :
          source === 'minDrag' ? 'bg-green-400 text-white' :
          source === 'max' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}
      `}
      style={{ opacity: draggedNumber === num && dragSource === source ? 0.5 : 1 }}
      title={source === 'maxDrag' ? 'Drag to Max Priority Queue' : source === 'minDrag' ? 'Drag to Min Priority Queue' : 'Drag back to Drag Area to remove'}
    >
      {num}
    </div>
  );

  const renderDropZone8 = (children, onDrop, label, highlight, acceptDrop) => (
    <div
      onDragOver={e => acceptDrop && e.preventDefault()}
      onDrop={acceptDrop ? onDrop : undefined}
      className={`min-h-[80px] p-2 rounded-lg border-2 border-dashed flex flex-wrap justify-center items-center gap-2 transition-all
        ${highlight ? 'border-yellow-400 bg-yellow-100/10' : 'border-green-600 bg-white'}`}
    >
      <div className="w-full text-center text-blue-600 font-bold mb-1">{label}</div>
      {children}
    </div>
  );

  const renderLevel8 = () => (
    <div className="flex flex-col items-center space-y-8 my-8">
      <div className="bg-white border-2 border-green-400 p-6 rounded-lg shadow-lg max-w-2xl text-center">
        <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-lg tracking-tight font-serif">Level 8: Build Max & Min Priority Queues</h2>
        <p className="text-gray-700 mb-4">
          Use all the given numbers to build a <span className="text-red-400 font-bold">Max Priority Queue</span> (Max-Heap) and a <span className="text-green-600 font-bold">Min Priority Queue</span> (Min-Heap).<br/>
          <span className="text-yellow-600 font-bold">Each number can only be used in one queue at a time. Drag from the Drag Area to the queue, and back to remove.</span><br/>
          When both queues are complete, click <span className="text-blue-600 font-bold">Check Answer</span>!
        </p>
        <div className="text-green-700 font-mono text-lg mb-2 whitespace-pre-line">{level8Message}</div>
      </div>

      {/* Drag Area for Max Priority Queue */}
      {renderDropZone8(
        level8MaxDrag.map(num => renderDraggableNumber8(num, 'maxDrag')),
        undefined, // No drop allowed
        'Drag Area For Max Priority Queue (Drag from here)',
        false,
        false
      )}

      {/* Max Priority Queue (drop target only) */}
      {renderDropZone8(
        level8MaxHeap.map(num => renderDraggableNumber8(num, 'max')),
        () => handleDrop8('max'),
        'Max Priority Queue (Drop here)',
        dragSource === 'maxDrag',
        dragSource === 'maxDrag'
      )}
      {/* Remove from Max Priority Queue */}
      {renderDropZone8(
        <span className="text-gray-600">Drag here to remove from Max Priority Queue</span>,
        () => handleDrop8('maxDrag'),
        'Remove Area for Max',
        dragSource === 'max',
        dragSource === 'max'
      )}

      {/* Drag Area for Min Priority Queue */}
      {renderDropZone8(
        level8MinDrag.map(num => renderDraggableNumber8(num, 'minDrag')),
        undefined, // No drop allowed
        'Drag Area For Min Priority Queue (Drag from here)',
        false,
        false
      )}

      {/* Min Priority Queue (drop target only) */}
      {renderDropZone8(
        level8MinHeap.map(num => renderDraggableNumber8(num, 'min')),
        () => handleDrop8('min'),
        'Min Priority Queue (Drop here)',
        dragSource === 'minDrag',
        dragSource === 'minDrag'
      )}
      {/* Remove from Min Priority Queue */}
      {renderDropZone8(
        <span className="text-gray-600">Drag here to remove from Min Priority Queue</span>,
        () => handleDrop8('minDrag'),
        'Remove Area for Min',
        dragSource === 'min',
        dragSource === 'min'
      )}

      {/* Check Answer Button */}
      {!isLevel8Complete && (
        <button
          onClick={checkLevel8Answer}
          className="mt-4 px-6 py-3 text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold text-lg transition-all duration-300"
        >
          Check Answer
        </button>
      )}

      {/* Completion Message */}
      {isLevel8Complete && (
        <div className="mt-8 p-4 bg-green-700 rounded-lg text-white text-center text-xl font-bold">
          Level 8 Complete! You built correct Max and Min Priority Queues! 🎉
          <br/>
          {currentLevel < MAX_LEVEL ? (
            <button
              onClick={() => setCurrentLevel(prev => prev + 1)}
              className="block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-all duration-300"
            >
              Next Level
            </button>
          ) : (
            <Link to="/dashboard" className="block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-all duration-300">
              Return to Dashboard
            </Link>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex space-x-4">
        <button
          onClick={initializeLevel8}
          className="px-6 py-3 text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold text-lg transition-all duration-300"
        >
          Reset Level
        </button>
      </div>
    </div>
  );

  const handleDragStart9 = (num, source) => {
    setDraggedNode9(num);
    setDragSource9(source);
  };

  const handleDragEnd9 = () => {
    setDraggedNode9(null);
    setDragSource9(null);
  };

  const handleDrop9 = (targetIndex) => {
    if (draggedNode9 == null) return;

    // Drag from available nodes to tree slot
    if (dragSource9 === 'available' && level9TreeSlots[targetIndex] === null) {
      const newTreeSlots = [...level9TreeSlots];
      newTreeSlots[targetIndex] = draggedNode9;
      setLevel9TreeSlots(newTreeSlots);
      setLevel9AvailableNodes(level9AvailableNodes.filter(n => n !== draggedNode9));
      setLevel9Message(`Placed ${draggedNode9} in the tree.`);
    }
    // Remove from tree slot back to available nodes
    else if (dragSource9 === 'tree' && level9TreeSlots[targetIndex] === draggedNode9) {
      const newTreeSlots = [...level9TreeSlots];
      newTreeSlots[targetIndex] = null;
      setLevel9TreeSlots(newTreeSlots);
      setLevel9AvailableNodes([...level9AvailableNodes, draggedNode9]);
      setLevel9Message(`Removed ${draggedNode9} from the tree.`);
    }

    setDraggedNode9(null);
    setDragSource9(null);
  };

  const checkLevel9Answer = () => {
    if (!isMaxHeap(level9TreeSlots)) {
      setLevel9Message('This is not a valid Max-Heap!');
      return;
    }
    setIsLevel9Complete(true);
    handleLevelComplete(9);
    setLevel9Message('');
  };

  // Render helpers
  const renderDraggableNumber9 = (num, source) => (
    <div
      key={num + '-' + source}
      draggable
      onDragStart={() => handleDragStart9(num, source)}
      onDragEnd={handleDragEnd9}
      className={`w-14 h-14 rounded-lg flex items-center justify-center text-xl font-bold shadow-lg cursor-move
        ${draggedNode9 === num && dragSource9 === source ? 'ring-4 ring-yellow-400' :
          source === 'available' ? 'bg-gray-700 text-white' :
          source === 'tree' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}
      `}
      style={{ opacity: draggedNode9 === num && dragSource9 === source ? 0.5 : 1 }}
      title={source === 'available' ? 'Drag to tree slot' : source === 'tree' ? 'Drag to available nodes' : 'Drag back to Drag Area to remove'}
    >
      {num}
    </div>
  );

  const renderDropZone9 = (children, onDrop, label, highlight, acceptDrop) => (
    <div
      onDragOver={e => acceptDrop && e.preventDefault()}
      onDrop={acceptDrop ? onDrop : undefined}
      className={`min-h-[80px] p-2 rounded-lg border-2 border-dashed flex flex-wrap justify-center items-center gap-2 transition-all
        ${highlight ? 'border-yellow-400 bg-yellow-100/10' : 'border-gray-600 bg-gray-800'}`}
    >
      <div className="w-full text-center text-blue-400 font-bold mb-1">{label}</div>
      {children}
    </div>
  );

  const renderLevel9 = () => {
    const maxLevel = level9TreeSlots.length > 0 ? Math.floor(Math.log2(level9TreeSlots.length)) : 0;
    
    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-white border-2 border-green-400 p-6 rounded-lg shadow-lg max-w-2xl text-center mb-4">
          <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-lg tracking-tight font-serif">Level 9: Build Max Heap Tree</h2>
          <p className="text-gray-700 mb-4">
            Drag numbers from the available nodes to build a Max Heap Tree. Remember, in a Max Heap:
            <br/>• Parent nodes must be greater than their children
            <br/>• Tree must be filled from left to right
          </p>
          <div className="text-green-700 font-mono text-lg mb-2 whitespace-pre-line">{level9Message}</div>
        </div>

        {/* Available Nodes */}
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-2xl">
          <h3 className="text-xl font-bold text-blue-600 w-full mb-2">Available Nodes:</h3>
          {level9AvailableNodes.length === 0 ? (
            <p className="text-gray-400">No nodes left to place!</p>
          ) : (
            level9AvailableNodes.map((num, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                draggable
                onDragStart={() => handleDragStart9(num, 'available')}
                onDragEnd={handleDragEnd9}
                className={`w-16 h-16 bg-green-400 rounded-lg flex items-center justify-center text-xl font-bold shadow-lg cursor-move
                  ${draggedNode9 === num && dragSource9 === 'available' ? 'ring-4 ring-yellow-400' : ''}
                `}
              >
                {num}
              </motion.div>
            ))
          )}
        </div>

        {/* Tree Visualization */}
        <div className="bg-white border-2 border-green-600 p-4 rounded-lg shadow-lg min-h-[400px] w-full max-w-4xl relative">
          {/* <h3 className="text-xl font-bold text-blue-400 w-full mb-4 text-center">Tree Structure:</h3> */}
          
          {/* Tree Nodes */}
          {level9TreeSlots.map((num, index) => {
            const level = Math.floor(Math.log2(index + 1));
            const nodesPerLevel = Math.pow(2, level);
            const posInLevel = index + 1 - Math.pow(2, level);
            const slotWidth = 100 / (nodesPerLevel + 1);
            const x = (posInLevel + 1) * slotWidth;
            const y = level * 80 + 40;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop9(index)}
                className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shadow-lg cursor-pointer
                  ${num !== null ? 'bg-blue-600 text-white' : 'bg-gray-400 text-gray-600 border-2 border-dashed border-gray-500'}
                  ${dragSource9 === 'available' ? 'ring-4 ring-yellow-400' : ''}
                `}
                style={{
                  left: `${x}%`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
                title={num !== null ? `Node: ${num}` : `Empty Slot ${index + 1}`}
              >
                {num !== null ? num : (index + 1)}
              </motion.div>
            );
          })}

          {/* Connecting Lines */}
          {level9TreeSlots.map((num, index) => {
            if (index === 0) return null; // Root has no parent

            const parentIndex = Math.floor((index - 1) / 2);

            const level = Math.floor(Math.log2(index + 1));
            const nodesPerLevel = Math.pow(2, level);
            const posInLevel = index + 1 - Math.pow(2, level);
            const slotWidth = 100 / (nodesPerLevel + 1);
            const x1 = (posInLevel + 1) * slotWidth;
            const y1 = level * 80 + 40;

            const parentLevel = Math.floor(Math.log2(parentIndex + 1));
            const parentNodesPerLevel = Math.pow(2, parentLevel);
            const parentPosInLevel = parentIndex + 1 - Math.pow(2, parentLevel);
            const parentSlotWidth = 100 / (parentNodesPerLevel + 1);
            const x2 = (parentPosInLevel + 1) * parentSlotWidth;
            const y2 = parentLevel * 80 + 40;

            return (
              <svg key={`line-${index}`} className="absolute w-full h-full" style={{ top: 0, left: 0, overflow: 'visible' }}>
                <line 
                  x1={`${x1}%`} y1={`${y1}px`} 
                  x2={`${x2}%`} y2={`${y2}px`} 
                  stroke="#4B5563" strokeWidth="2" 
                  style={{ position: 'absolute', zIndex: 5 }}
                />
              </svg>
            );
          })}
        </div>

        {/* Check Answer Button */}
        {!isLevel9Complete && (
          <button
            onClick={checkLevel9Answer}
            className="mt-4 px-6 py-3 text-white bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold text-lg transition-all duration-300"
          >
            Check Answer
          </button>
        )}

        {/* Completion Message */}
        {isLevel9Complete && (
          <div className="mt-8 p-4 bg-green-700 rounded-lg text-white text-center text-xl font-bold">
            Level 9 Complete! You've built a valid Max Heap Tree! 🎉
            <br/>
            {currentLevel < MAX_LEVEL ? (
              <button
                onClick={() => setCurrentLevel(prev => prev + 1)}
                className="block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-all duration-300"
              >
                Next Level
              </button>
            ) : (
              <Link to="/dashboard" className="block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-all duration-300">
                Return to Dashboard
              </Link>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex space-x-4">
          <button
            onClick={initializeLevel9}
            className="px-6 text-white py-3  bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold text-lg transition-all duration-300"
          >
            Reset Level
          </button>
        </div>
      </div>
    );
  };

  const handleDragStart10 = (num, source) => {
    setDraggedNode10(num);
    setDragSource10(source);
  };

  const handleDragEnd10 = () => {
    setDraggedNode10(null);
    setDragSource10(null);
  };

  const handleDrop10 = (targetIndex) => {
    if (draggedNode10 == null) return;

    // Drag from available nodes to tree slot
    if (dragSource10 === 'available' && level10TreeSlots[targetIndex] === null) {
      const newTreeSlots = [...level10TreeSlots];
      newTreeSlots[targetIndex] = draggedNode10;
      setLevel10TreeSlots(newTreeSlots);
      setLevel10AvailableNodes(level10AvailableNodes.filter(n => n !== draggedNode10));
      setLevel10Message(`Placed ${draggedNode10} in the tree.`);
    }
    // Remove from tree slot back to available nodes
    else if (dragSource10 === 'tree' && level10TreeSlots[targetIndex] === draggedNode10) {
      const newTreeSlots = [...level10TreeSlots];
      newTreeSlots[targetIndex] = null;
      setLevel10TreeSlots(newTreeSlots);
      setLevel10AvailableNodes([...level10AvailableNodes, draggedNode10]);
      setLevel10Message(`Removed ${draggedNode10} from the tree.`);
    }

    setDraggedNode10(null);
    setDragSource10(null);
  };

  const checkLevel10Answer = () => {
    if (!isMinHeap(level10TreeSlots)) {
      setLevel10Message('This is not a valid Min-Heap!');
      return;
    }
    setIsLevel10Complete(true);
    handleLevelComplete(10);
    setLevel10Message('');
  };

  // Render helpers
  const renderDraggableNumber10 = (num, source) => (
    <div
      key={num + '-' + source}
      draggable
      onDragStart={() => handleDragStart10(num, source)}
      onDragEnd={handleDragEnd10}
      className={`w-14 h-14 rounded-lg flex items-center justify-center text-xl font-bold shadow-lg cursor-move
        ${draggedNode10 === num && dragSource10 === source ? 'ring-4 ring-yellow-400' :
          source === 'available' ? 'bg-gray-700 text-white' :
          source === 'tree' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}
      `}
      style={{ opacity: draggedNode10 === num && dragSource10 === source ? 0.5 : 1 }}
      title={source === 'available' ? 'Drag to tree slot' : source === 'tree' ? 'Drag to available nodes' : 'Drag back to Drag Area to remove'}
    >
      {num}
    </div>
  );

  const renderDropZone10 = (children, onDrop, label, highlight, acceptDrop) => (
    <div
      onDragOver={e => acceptDrop && e.preventDefault()}
      onDrop={acceptDrop ? onDrop : undefined}
      className={`min-h-[80px] p-2 rounded-lg border-2 border-dashed flex flex-wrap justify-center items-center gap-2 transition-all
        ${highlight ? 'border-yellow-400 bg-yellow-100/10' : 'border-gray-600 bg-gray-800'}`}
    >
      <div className="w-full text-center text-blue-400 font-bold mb-1">{label}</div>
      {children}
    </div>
  );

  const renderLevel10 = () => {
    const maxLevel = level10TreeSlots.length > 0 ? Math.floor(Math.log2(level10TreeSlots.length)) : 0;
    
    return (
      <div className="flex flex-col items-center space-y-8 my-8">
        {/* Description Panel */}
        <div className="bg-white border-2 border-green-400 p-6 rounded-lg shadow-lg max-w-2xl text-center mb-4">
          <h2 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-lg tracking-tight font-serif">Level 10: Build Min Heap Tree</h2>
          <p className="text-gray-700 mb-4">
            Drag numbers from the available nodes to build a Min Heap Tree. Remember, in a Min Heap:
            <br/>• Parent nodes are always smaller than their children
            <br/>• Tree must be filled from left to right
          </p>
          <div className="text-green-700 font-mono text-lg mb-2 whitespace-pre-line">{level10Message}</div>
        </div>

        {/* Available Nodes */}
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-2xl">
          <h3 className="text-xl font-bold text-blue-600 w-full mb-2">Available Nodes:</h3>
          {level10AvailableNodes.length === 0 ? (
            <p className="text-gray-400">No nodes left to place!</p>
          ) : (
            level10AvailableNodes.map((num, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                draggable
                onDragStart={() => handleDragStart10(num, 'available')}
                onDragEnd={handleDragEnd10}
                className={`w-16 h-16 bg-green-400 rounded-lg flex items-center justify-center text-xl font-bold shadow-lg cursor-move
                  ${draggedNode10 === num && dragSource10 === 'available' ? 'ring-4 ring-yellow-400' : ''}
                `}
              >
                {num}
              </motion.div>
            ))
          )}
        </div>

        {/* Tree Visualization */}
        <div className="bg-white border-2 border-green-600 p-4 rounded-lg shadow-lg min-h-[400px] w-full max-w-4xl relative">
          {/* <h3 className="text-xl font-bold text-blue-400 w-full mb-4 text-center">Tree Structure:</h3> */}
          
          {/* Tree Nodes */}
          {level10TreeSlots.map((num, index) => {
            const level = Math.floor(Math.log2(index + 1));
            const nodesPerLevel = Math.pow(2, level);
            const posInLevel = index + 1 - Math.pow(2, level);
            const slotWidth = 100 / (nodesPerLevel + 1);
            const x = (posInLevel + 1) * slotWidth;
            const y = level * 80 + 40;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop10(index)}
                className={`absolute w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold shadow-lg cursor-pointer
                  ${num !== null ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 border-2 border-dashed border-gray-500'}
                  ${dragSource10 === 'available' ? 'ring-4 ring-yellow-400' : ''}
                `}
                style={{
                  left: `${x}%`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10
                }}
                title={num !== null ? `Node: ${num}` : `Empty Slot ${index + 1}`}
              >
                {num !== null ? num : (index + 1)}
              </motion.div>
            );
          })}

          {/* Connecting Lines */}
          {level10TreeSlots.map((num, index) => {
            if (index === 0) return null; // Root has no parent

            const parentIndex = Math.floor((index - 1) / 2);

            const level = Math.floor(Math.log2(index + 1));
            const nodesPerLevel = Math.pow(2, level);
            const posInLevel = index + 1 - Math.pow(2, level);
            const slotWidth = 100 / (nodesPerLevel + 1);
            const x1 = (posInLevel + 1) * slotWidth;
            const y1 = level * 80 + 40;

            const parentLevel = Math.floor(Math.log2(parentIndex + 1));
            const parentNodesPerLevel = Math.pow(2, parentLevel);
            const parentPosInLevel = parentIndex + 1 - Math.pow(2, parentLevel);
            const parentSlotWidth = 100 / (parentNodesPerLevel + 1);
            const x2 = (parentPosInLevel + 1) * parentSlotWidth;
            const y2 = parentLevel * 80 + 40;

            return (
              <svg key={`line-${index}`} className="absolute w-full h-full" style={{ top: 0, left: 0, overflow: 'visible' }}>
                <line 
                  x1={`${x1}%`} y1={`${y1}px`} 
                  x2={`${x2}%`} y2={`${y2}px`} 
                  stroke="#4B5563" strokeWidth="2" 
                  style={{ position: 'absolute', zIndex: 5 }}
                />
              </svg>
            );
          })}
        </div>

        {/* Check Answer Button */}
        {!isLevel10Complete && (
          <button
            onClick={checkLevel10Answer}
            className="mt-4 text-white px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold text-lg transition-all duration-300"
          >
            Check Answer
          </button>
        )}

        {/* Completion Message */}
        {isLevel10Complete && (
          <div className="mt-8 p-4 bg-green-700 rounded-lg text-white text-center text-xl font-bold">
            Level 10 Complete! You've built a valid Min Heap Tree! 🎉
            <br/>
            {currentLevel < MAX_LEVEL ? (
              <button
                onClick={() => setCurrentLevel(prev => prev + 1)}
                className="block mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-all duration-300"
              >
                Next Level
              </button>
            ) : (
              <Link to="/games" className="block mt-4 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-all duration-300">
                Return to Games
              </Link>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex space-x-4">
          <button
            onClick={initializeLevel10}
            className="px-6 text-white py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold text-lg transition-all duration-300"
          >
            Reset Level
          </button>
        </div>
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
        return (
          <div className="text-center text-gray-400 text-xl mt-16">
            No levels implemented yet. Please add levels to start the game!
          </div>
        );
    }
  };

  // Initialize level when currentLevel changes
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

  // Handle level completion
  const handleLevelComplete = async (level) => {
    console.log(`[HeapPriorityQueueMaster] Handling level completion for level ${level}`);
    setIsLevelComplete(true);
    
    // Always save progress to update score, even if level was completed before
    console.log(`[HeapPriorityQueueMaster] Saving progress for level ${level}`);
    await saveProgress(level);
  };

  // Update level start time when level changes
  useEffect(() => {
    setLevelStartTime(Date.now());
    setIsLevelComplete(false);
  }, [currentLevel]);

  // Load progress from database
  useEffect(() => {
    let isMounted = true;  // Add mounted flag for cleanup

    const fetchProgress = async () => {
      if (!user) return;  // Don't fetch if no user
      
      try {
        console.log('[HeapPriorityQueueMaster] Fetching progress for user');
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
        console.log('[HeapPriorityQueueMaster] Progress data received:', data);
        
        const heapProgress = data.progress?.find(p => p.topicId === 'heap-priority-queue');
        if (heapProgress?.levels) {
          const completed = new Set(
            heapProgress.levels
              .filter(level => level.completed)
              .map(level => level.level)
          );
          console.log('[HeapPriorityQueueMaster] Setting completed levels:', Array.from(completed));
          setCompletedLevels(completed);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('[HeapPriorityQueueMaster] Error fetching progress:', error);
      }
    };
    
    fetchProgress();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (isLevel6Complete) {
      handleLevelComplete(6);
    }
  }, [isLevel6Complete]);

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
            {Array.from({ length: MAX_LEVEL }, (_, index) => {
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
            onClick={() => setCurrentLevel(prev => Math.max(1, prev - 1))}
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
            onClick={() => setCurrentLevel(prev => prev + 1)}
            disabled={currentLevel === MAX_LEVEL}
            className={`px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200 border-2 border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400/50
              ${currentLevel === MAX_LEVEL 
                ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white hover:from-green-500 hover:via-green-600 hover:to-emerald-700'}
            `}
          >
            Next Level →
          </button>
        </div>
        {/* Game Content */}
        <div className="max-w-6xl mx-auto w-full">
          {renderLevel()}
        </div>
      </div>
    </div>
  );
};

export default HeapPriorityQueueMaster;