import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import { gameProgressService } from '../../services/gameProgressService';
import GameDecorations from './GameDecorations';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const edges = [
  ['A', 'B'], ['A', 'C'],
  ['B', 'D'], ['B', 'E'],
  ['C', 'F'], ['C', 'G']
];
const nodes = [
  { name: 'A', x: 300, y: 50 },
  { name: 'B', x: 200, y: 150 },
  { name: 'C', x: 400, y: 150 },
  { name: 'D', x: 150, y: 250 },
  { name: 'E', x: 250, y: 250 },
  { name: 'F', x: 350, y: 250 },
  { name: 'G', x: 450, y: 250 }
];

// NEW: Nodes and Edges for Vertical Traversal (Level 9)
const verticalTreeNodes = [
  { name: 'V_1_root', value: 1, x: 300, y: 50 },  // Root node
  { name: 'V_2', value: 2, x: 200, y: 150 },      // Left child of root
  { name: 'V_3', value: 3, x: 400, y: 150 },      // Right child of root
  { name: 'V_4', value: 4, x: 100, y: 250 },      // Left child of node 2
  { name: 'V_5', value: 5, x: 300, y: 250 }       // Right child of node 2 (moved lower)
];

const verticalTreeEdges = [
  ['V_1_root', 'V_2'],  // Root to left child
  ['V_1_root', 'V_3'],  // Root to right child
  ['V_2', 'V_4'],       // Node 2 to its left child
  ['V_2', 'V_5']        // Node 2 to its right child
];

const steps = [
  {
    title: "What is a Binary Tree?",
    explanation: "A binary tree is a tree data structure in which each node has at most two children, which are referred to as the left child and the right child.",
    highlightNodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    type: 'intro'
  },
  {
    title: "Root Node",
    explanation: "The root node is the topmost node in the tree. It has no parents and is the starting point for any tree operation.",
    highlightNodes: ['A'],
    type: 'concept'
  },
  {
    title: "Leaf Node",
    explanation: "A leaf node is a node that has no children. These are the nodes at the 'bottom' of the tree.",
    highlightNodes: ['D', 'E', 'F', 'G'],
    type: 'concept'
  },
  {
    title: "Parent and Child Nodes",
    explanation: "A parent node is any node that has one or more child nodes connected to it below. A child node is a node directly connected to another node when moving away from the Root. For example, 'A' is the parent of 'B' and 'C'. 'B' is the child of 'A'.",
    highlightNodes: ['A', 'B', 'C'],
    type: 'concept'
  },
  {
    title: "Edge",
    explanation: "An edge is the link between a parent node and a child node. It represents the connection or relationship between two nodes in the tree.",
    highlightNodes: [],
    highlightEdges: [0],
    showEdgeNav: true,
    type: 'concept'
  }
];

const nodeWeights = {
  'A': 10,
  'B': 5,
  'C': 15,
  'D': 3,
  'E': 7,
  'F': 12,
  'G': 18
};

const PREMIUM_GAME_ID = 'binary-tree';
const TREE_TOPIC_ID = 'binary-trees'; // Match dashboard topicId and topics list

const TreeGame = () => {
  // --- Premium logic hooks ---
  const { user } = useAuth();
  const [hasPremium, setHasPremium] = useState(false);
  const [loadingPremium, setLoadingPremium] = useState(true);
  const [razorpayLoading, setRazorpayLoading] = useState(false);

  useEffect(() => {
    const checkPremium = async () => {
      if (!user) return;
      setLoadingPremium(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/premium/access/${PREMIUM_GAME_ID}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setHasPremium(data.hasAccess);
      } catch (e) {
        setHasPremium(false);
      }
      setLoadingPremium(false);
    };
    checkPremium();
  }, [user]);

  const handleBuyPremium = async () => {
    setRazorpayLoading(true);
    // 1. Create order
    const res = await fetch(`${BACKEND_URL}/api/premium/razorpay/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ gameId: PREMIUM_GAME_ID })
    });
    const order = await res.json();
    setRazorpayLoading(false);
    if (!order.orderId) return alert('Order creation failed');
    // 2. Open Razorpay checkout
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'DSA Game Premium',
      description: 'Premium Binary Tree Game Access',
      order_id: order.orderId,
      handler: async function (response) {
        // 3. Verify payment
        const verifyRes = await fetch(`${BACKEND_URL}/api/premium/razorpay/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ...response,
            gameId: PREMIUM_GAME_ID
          })
        });
        const verifyData = await verifyRes.json();
        if (verifyData.message) alert(verifyData.message);
        if (verifyData.userAccess && verifyData.userAccess.includes(PREMIUM_GAME_ID)) {
          setHasPremium(true);
        }
      },
      prefill: {
        name: user?.username,
        email: user?.email,
      },
      theme: { color: '#3399cc' }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // --- All other hooks for the game (existing code) ---
  const [showBuilder, setShowBuilder] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [edgeIndex, setEdgeIndex] = useState(0);
  const [animationsOn, setAnimationsOn] = useState(true);
  const treeContainerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // States for the interactive builder part (copied from previous implementation)
  const [treeSlots, setTreeSlots] = useState(Array(7).fill(null));
  const [availableNodes, setAvailableNodes] = useState([10, 5, 15, 3, 7, 12, 18].sort(() => Math.random() - 0.5));
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);
  const [levelMessage, setLevelMessage] = useState('Place the nodes to form a Binary Tree. Fill levels from left to right!');
  const [highlightedLevel, setHighlightedLevel] = useState(null);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [showLevel2Success, setShowLevel2Success] = useState(false); // NEW state for Level 2 success

  // NEW: States for Level 3 (Preorder Traversal)
  const [currentLevel, setCurrentLevel] = useState(1); // 1: Concepts, 2: Builder, 3: Properties, 4: Preorder, 5: Postorder, 6: Inorder, 7: Level Order, 8: Zigzag Traversal, 9: Vertical Traversal
  const [preorderStep, setPreorderStep] = useState(0); // For steps within preorder traversal
  const [preorderArray, setPreorderArray] = useState([]);
  const [currentTraversalNode, setCurrentTraversalNode] = useState(null);
  const [isTraversing, setIsTraversing] = useState(false);
  const [traversalIndex, setTraversalIndex] = useState(-1); // NEW: Tracks animation progress

  // NEW: Preorder traversal steps
  const preorderSteps = [
    {
      title: "What is Preorder Traversal?",
      explanation: "Preorder traversal is a way to visit all nodes in a binary tree. The name 'preorder' comes from the order in which we visit nodes: we visit the node BEFORE (pre) its children. The rule is simple: Root → Left → Right.",
      highlightNodes: ['A'],
      type: 'concept'
    },
    {
      title: "The Three Steps of Preorder",
      explanation: "For each node we visit, we follow these steps:\n1. Process the current node (Root)\n2. Recursively traverse the left subtree\n3. Recursively traverse the right subtree\n\nThis creates a pattern where we always visit a parent before its children.",
      highlightNodes: ['A', 'B', 'C'],
      type: 'concept'
    },
    {
      title: "Understanding the Pattern",
      explanation: "Let's see how this works on our tree:\n\n1. Start at root (A)\n2. After A, we must visit its left subtree (B) before its right subtree (C)\n3. For B, we visit B, then its left (D), then its right (E)\n4. For C, we visit C, then its left (F), then its right (G)\n\nThis creates the sequence: A → B → D → E → C → F → G",
      highlightNodes: ['A', 'B', 'D', 'E', 'C', 'F', 'G'],
      type: 'concept'
    },
    {
      title: "Let's See it in Action!",
      explanation: "Now that we understand the concept, let's watch the preorder traversal happen in real-time. Click 'START TRAVERSAL' to see how we visit each node and build our preorder array.",
      highlightNodes: [],
      type: 'animation'
    }
  ];

  // Level 4 Postorder Traversal States
  const [postorderStep, setPostorderStep] = useState(0);
  const [postorderCorrectArray, setPostorderCorrectArray] = useState(['D', 'E', 'B', 'F', 'G', 'C', 'A']); // Correct Postorder Sequence
  const [userPostorderArray, setUserPostorderArray] = useState(Array(7).fill(null));
  const [postorderAvailableNodes, setPostorderAvailableNodes] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G'].sort(() => Math.random() - 0.5));
  const [postorderSelectedNode, setPostorderSelectedNode] = useState(null);
  const [postorderSelectedNodeIndex, setPostorderSelectedNodeIndex] = useState(null);
  const [postorderMessage, setPostorderMessage] = useState('Drag and drop nodes to create the Postorder Traversal!');
  const [postorderIsComplete, setPostorderIsComplete] = useState(false);

  // NEW: Level 5 Inorder Traversal States
  const [inorderStep, setInorderStep] = useState(0);
  const [inorderCorrectArray, setInorderCorrectArray] = useState(['D', 'B', 'E', 'A', 'F', 'C', 'G']); // Correct Inorder Sequence
  const [userInorderArray, setUserInorderArray] = useState(Array(7).fill(null));
  const [inorderAvailableNodes, setInorderAvailableNodes] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G'].sort(() => Math.random() - 0.5));
  const [inorderSelectedNode, setInorderSelectedNode] = useState(null);
  const [inorderSelectedNodeIndex, setInorderSelectedNodeIndex] = useState(null);
  const [inorderMessage, setInorderMessage] = useState('Drag and drop nodes to create the Inorder Traversal!');
  const [inorderIsComplete, setInorderIsComplete] = useState(false);

  // NEW: Level 6 Level Order Traversal States
  const [levelOrderStep, setLevelOrderStep] = useState(0);
  const [levelOrderCorrectArray, setLevelOrderCorrectArray] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G']); // Correct Level Order Sequence
  const [userLevelOrderArray, setUserLevelOrderArray] = useState(Array(7).fill(null));
  const [levelOrderAvailableNodes, setLevelOrderAvailableNodes] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G'].sort(() => Math.random() - 0.5));
  const [levelOrderSelectedNode, setLevelOrderSelectedNode] = useState(null);
  const [levelOrderSelectedNodeIndex, setLevelOrderSelectedNodeIndex] = useState(null);
  const [levelOrderMessage, setLevelOrderMessage] = useState('Drag and drop nodes to create the Level Order Traversal!');
  const [levelOrderIsComplete, setLevelOrderIsComplete] = useState(false);

  // Postorder Traversal Explanation Steps
  const postorderSteps = [
    {
      title: "Understanding Postorder Traversal",
      explanation: "Postorder traversal visits the Left subtree, then the Right subtree, and finally the Root node. Think of it as 'Children first, then parent.'",
      highlightNodes: [],
      highlightEdges: [],
      type: "intro",
    },
    {
      title: "Interactive Postorder Builder",
      explanation: "Now, let's practice! Drag and drop the nodes from the 'Available Nodes' area into the 'Postorder Array' slots to form the correct postorder traversal sequence for the tree.",
      highlightNodes: [],
      highlightEdges: [],
      type: "interactive-builder",
    },
  ];

  // Inorder Traversal Explanation Steps
  const inorderSteps = [
    {
      title: "Understanding Inorder Traversal",
      explanation: "Inorder traversal visits the Left subtree, then the Root node, and finally the Right subtree. Think of it as 'Sorted order for a BST'.",
      highlightNodes: [],
      highlightEdges: [],
      type: "intro",
    },
    {
      title: "Interactive Inorder Builder",
      explanation: "Now, let's practice! Drag and drop the nodes from the 'Available Nodes' area into the 'Inorder Array' slots to form the correct inorder traversal sequence for the tree.",
      highlightNodes: [],
      highlightEdges: [],
      type: "interactive-builder",
    },
  ];

  // Level Order Traversal Explanation Steps
  const levelOrderSteps = [
    {
      title: "Understanding Level Order Traversal (BFS)",
      explanation: "Level order traversal visits all nodes at the current depth before moving on to nodes at the next depth. It traverses the tree level by level, from left to right.\n\n" +
        "This is also known as Breadth-First Search (BFS) for trees.",
      highlightNodes: ['A'],
      highlightEdges: [],
      type: "intro",
    },
    {
      title: "Interactive Level Order Builder",
      explanation: "Now, let's practice! Drag and drop the nodes from the 'Available Nodes' area into the 'Level Order Array' slots to form the correct level order traversal sequence for the tree.",
      highlightNodes: [],
      highlightEdges: [],
      type: "interactive-builder",
    },
  ];

  // NEW: Tree Properties States
  const [propertiesStep, setPropertiesStep] = useState(0);
  const [propertiesMessage, setPropertiesMessage] = useState('Learn about important tree properties!');
  const [showLevel3Success, setShowLevel3Success] = useState(false); // NEW state for Level 3 success

  // NEW: Tree Properties Steps
  const propertiesSteps = [
    {
      title: "Tree Depth and Levels",
      explanation: "Let's understand tree depth and levels in detail:\n\n" +
        "1. Depth of a Node:\n" +
        "   - The depth of a node is the number of edges from the root to that node\n" +
        "   - Root node (A) has depth 0\n" +
        "   - Nodes B and C have depth 1 (one edge from root)\n" +
        "   - Nodes D, E, F, G have depth 2 (two edges from root)\n\n" +
        "2. Levels in a Tree:\n" +
        "   - Level 0: Contains only the root node (A)\n" +
        "   - Level 1: Contains nodes B and C\n" +
        "   - Level 2: Contains nodes D, E, F, and G\n\n" +
        "3. Height of Tree:\n" +
        "   - The height is the maximum depth of any node\n" +
        "   - In our tree, height = 2 (maximum depth of leaf nodes)\n\n" +
        "Understanding depth and levels is crucial for:\n" +
        "- Level order traversal\n" +
        "- Finding the height of a tree\n" +
        "- Balancing operations",
      highlightNodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      type: 'concept'
    },
    {
      title: "Tree Diameter",
      explanation: "The diameter of a tree is the length of the longest path between any two nodes.\n\n" +
        "In our tree:\n" +
        "1. The longest path is from D to G:\n" +
        "   D → B → A → C → G\n" +
        "   This path has 4 edges\n\n" +
        "2. Why this is the longest path:\n" +
        "   - Must go through root (A) to reach opposite sides\n" +
        "   - Uses deepest nodes (D and G)\n" +
        "   - No other path can be longer\n\n" +
        "3. Applications of Tree Diameter:\n" +
        "   - Network routing optimization\n" +
        "   - Finding critical paths\n" +
        "   - Tree balancing operations",
      highlightNodes: ['D', 'B', 'A', 'C', 'G'],
      highlightEdges: [0, 1, 2, 4],
      type: 'concept'
    },
    {
      title: "Node Weights and Values",
      explanation: "Before calculating path sums, let's understand the weights assigned to each node:\n\n" +
        "Node Weights:\n" +
        "A (Root) = 10\n" +
        "B = 5\n" +
        "C = 15\n" +
        "D = 3\n" +
        "E = 7\n" +
        "F = 12\n" +
        "G = 18\n\n" +
        "These weights represent the value or cost associated with each node.\n" +
        "They could represent:\n" +
        "- Cost of visiting a node\n" +
        "- Value stored in the node\n" +
        "- Distance or weight in a network\n\n" +
        "Now that we know the weights, we can calculate path sums!",
      highlightNodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      type: 'concept',
      showNodeWeights: true
    },
    {
      title: "Path Sums in Trees",
      explanation: "Now that we know the node weights, let's calculate path sums:\n\n" +
        "1. Root to Leaf Paths:\n" +
        "   - A(10) → B(5) → D(3) = 18\n" +
        "   - A(10) → B(5) → E(7) = 22\n" +
        "   - A(10) → C(15) → F(12) = 37\n" +
        "   - A(10) → C(15) → G(18) = 43\n\n" +
        "2. Maximum Path Sum:\n" +
        "   - The path A → C → G has the maximum sum of 43\n" +
        "   - This is because it includes the highest weight nodes (C=15, G=18)\n\n" +
        "3. Minimum Path Sum:\n" +
        "   - The path A → B → D has the minimum sum of 18\n" +
        "   - This path includes the lowest weight nodes (B=5, D=3)\n" +
        "Path sums are important for:\n" +
        "- Finding optimal paths in decision trees\n" +
        "- Calculating minimum/maximum costs\n" +
        "- Tree balancing operations",
      highlightNodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      type: 'concept',
      showPathSums: true
    }
  ];

  // Add new states for Level 8
  const [specialTraversalStep, setSpecialTraversalStep] = useState(0); // Renamed from zigzagStep
  const [zigzagTraversalArray, setZigzagTraversalArray] = useState([]);
  const [isZigzagTraversing, setIsZigzagTraversing] = useState(false);
  const [currentZigzagLevel, setCurrentZigzagLevel] = useState(null);
  const [zigzagDirection, setZigzagDirection] = useState('left-to-right');

  // NEW: States for Level 9 (Vertical Traversal)
  const [verticalStep, setVerticalStep] = useState(0);
  const [verticalTraversalArray, setVerticalTraversalArray] = useState([]);
  const [isVerticalTraversing, setIsVerticalTraversing] = useState(false);
  const [currentVerticalColumn, setCurrentVerticalColumn] = useState(null);

  // NEW: States for Level 10 (Tree Views)
  const [treeViewsStep, setTreeViewsStep] = useState(0);
  const [topViewArray, setTopViewArray] = useState([]);
  const [bottomViewArray, setBottomViewArray] = useState([]);
  const [leftViewArray, setLeftViewArray] = useState([]);
  const [rightViewArray, setRightViewArray] = useState([]);
  const [isTopViewTraversing, setIsTopViewTraversing] = useState(false);
  const [isBottomViewTraversing, setIsBottomViewTraversing] = useState(false);
  const [isLeftViewTraversing, setIsLeftViewTraversing] = useState(false);
  const [isRightViewTraversing, setIsRightViewTraversing] = useState(false);
  const [highlightedTopViewNodes, setHighlightedTopViewNodes] = useState([]); // NEW state
  // NEW: State for Bottom View Highlighting
  const [highlightedBottomViewNodes, setHighlightedBottomViewNodes] = useState([]);
  // NEW: States for Right View Highlighting
  const [highlightedRightViewNodes, setHighlightedRightViewNodes] = useState([]);
  // NEW: States for Right View User Input
  const [userRightViewInput, setUserRightViewInput] = useState('');
  const [rightViewFeedbackMessage, setRightViewFeedbackMessage] = useState('');
  const [isRightViewInputCorrect, setIsRightViewInputCorrect] = useState(false);

  // Add new steps for Level 8
  const specialTraversalSteps = [
    {
      title: "Zigzag (Spiral) Traversal: Explanation and Animation",
      explanation: "Zigzag Traversal is a special way to visit nodes in a tree where we alternate direction at each level.\n\n" +
        "How it works:\n" +
        "1. Start at root (A), going left to right\n" +
        "2. Next level (B,C) goes right to left\n" +
        "3. Next level (D,E,F,G) goes left to right\n" +
        "4. And so on...\n\n" +
        "Level-wise breakdown:\n" +
        "Level 0 (→): A\n" +
        "Level 1 (←): C → B\n" +
        "Level 2 (→): D → E → F → G\n\n" +
        "Final Order: A → C → B → D → E → F → G\n\n" +
        "This traversal is useful for:\n" +
        "- Spiral printing of tree\n" +
        "- Alternating level processing\n" +
        "- Tree visualization in a zigzag pattern\n\n" +
        "Watch how zigzag traversal works in real-time! The traversal will visit nodes in this order: A → C → B → D → E → F → G. Notice how it alternates direction at each level: Level 0: Left to Right (A), Level 1: Right to Left (C → B), Level 2: Left to Right (D → E → F → G)",
      highlightNodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      type: 'zigzag-animation',
      showZigzagLevels: true
    }
  ];

  // NEW: Vertical Traversal Steps
  const verticalSteps = [
    {
      title: "Understanding Vertical Order Traversal",
      explanation: "Vertical Order Traversal is a method to visit nodes in a tree column by column based on their horizontal distance from the root.\n\n" +
        "How it works:\n" +
        "1. Assign a horizontal distance (column index) to each node. The root is at column 0.\n" +
        "2. Left children are at (parent_column - 1), right children are at (parent_column + 1).\n" +
        "3. Traverse nodes column by column, from the smallest column index to the largest.\n" +
        "4. Within each column, visit nodes from top to bottom.\n\n" +
        "Example Columns (Nodes are values, not names):\n" +
        "Column -2: [4]\n" +
        "Column -1: [2]\n" +
        "Column 0: [1, 5]\n" +
        "Column 1: [3]\n\n" +
        "Final Order: 4 → 2 → 1 → 5 → 3\n\n" +
        "This traversal is useful for:\n" +
        "- Printing a tree vertically\n" +
        "- Grouping nodes by horizontal distance\n" +
        "- Understanding node positions in the tree",
      highlightNodes: [],
      type: 'concept',
      showVerticalColumns: true,
      nodesInColumns: {
        '-2': [{ name: 'V_4', value: 4 }],
        '-1': [{ name: 'V_2', value: 2 }],
        '0': [{ name: 'V_1_root', value: 1 }, { name: 'V_5', value: 5 }],
        '1': [{ name: 'V_3', value: 3 }]
      },
      verticalTraversalOrder: [
        { name: 'V_4', value: 4 },
        { name: 'V_2', value: 2 },
        { name: 'V_1_root', value: 1 },
        { name: 'V_5', value: 5 },
        { name: 'V_3', value: 3 }
      ]
    },
    {
      title: "Vertical Order Traversal Animation",
      explanation: "Watch how vertical traversal works in real-time! Nodes will be visited column by column, from left to right, and within each column, from top to bottom.\n\n" +
        "The traversal will visit nodes in this order:\n" +
        "4 → 2 → 1 → 5 → 3",
      highlightNodes: [],
      type: 'vertical-animation',
      verticalTraversalOrder: [
        { name: 'V_4', value: 4 },
        { name: 'V_2', value: 2 },
        { name: 'V_1_root', value: 1 },
        { name: 'V_5', value: 5 },
        { name: 'V_3', value: 3 }
      ]
    }
  ];

  // NEW: Tree Views Steps
  const treeViewsSteps = [
    {
      title: "Introduction to Tree Views",
      explanation: "Tree views allow us to observe the tree from different perspectives (top, bottom, left, right). These traversals are commonly asked in interviews and have practical applications in visualizing hierarchical data.",
      highlightNodes: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      type: 'concept'
    },
    {
      title: "Top View of Binary Tree",
      explanation: "The top view of a binary tree contains the nodes visible when the tree is viewed from the top. If a node is directly above another node in the same vertical line, only the topmost node is included.\n\nFor our tree, the top view is: B → A → C → G. (D, E, F are hidden by B, A, C respectively from the top)",
      highlightNodes: ['B', 'A', 'C', 'G'],
      type: 'animation-top-view', // Will trigger top view animation
      expectedOutput: ['B', 'A', 'C', 'G']
    },
    {
      title: "Bottom View of Binary Tree",
      explanation: "The bottom view of a binary tree contains the nodes visible when the tree is viewed from the bottom. If a node is directly below another node in the same vertical line, only the bottommost node is included.\n\nFor our tree, the bottom view is: D → E → F → G.",
      highlightNodes: ['D', 'E', 'F', 'G'],
      type: 'animation-bottom-view', // Will trigger bottom view animation
      expectedOutput: ['D', 'E', 'F', 'G']
    },
    {
      title: "Left View of Binary Tree",
      explanation: "The left view of a binary tree contains the nodes visible when the tree is viewed from the left side. It consists of the first node of each level.\n\nFor our tree, the left view is: A → B → D.",
      highlightNodes: ['A', 'B', 'D'],
      type: 'animation-left-view', // Will trigger left view animation
      expectedOutput: ['A', 'B', 'D']
    },
    {
      title: "Right View of Binary Tree",
      explanation: "The right view of a binary tree contains the nodes visible when the tree is viewed from the right side. It consists of the last node of each level.\n\nFor our tree, the right view is: A → C → G.",
      highlightNodes: ['A', 'C', 'G'],
      type: 'animation-right-view', // Will trigger right view animation
      expectedOutput: ['A', 'C', 'G']
    }
  ];

  // Add new state for path tracking
  const [currentPath, setCurrentPath] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [showLevel1Success, setShowLevel1Success] = useState(false);

  // NEW: State for Level 4 (Preorder Traversal) Success Message
  const [showLevel4Success, setShowLevel4Success] = useState(false);

  // NEW: State for Level 5 (Postorder Traversal) Success Message
  const [showLevel5Success, setShowLevel5Success] = useState(false);

  // NEW: State for Level 6 (Inorder Traversal) Success Message
  const [showLevel6Success, setShowLevel6Success] = useState(false);

  // NEW: State for Level 7 (Level Order Traversal) Success Message
  const [showLevel7Success, setShowLevel7Success] = useState(false);

  // NEW: State for Level 8 (Zigzag Traversal) Success Message
  const [showLevel8Success, setShowLevel8Success] = useState(false);

  // NEW: State for Level 9 (Vertical Traversal) Success Message
  const [showLevel9Success, setShowLevel9Success] = useState(false);

  // Add new state for Level 10 success
  const [showLevel10Success, setShowLevel10Success] = useState(false);

  // Add new state variables after other useState declarations
  const [levelStartTime, setLevelStartTime] = useState(Date.now());
  const [currentScore, setCurrentScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial progress when component mounts
  useEffect(() => {
    let isMounted = true;  // Add mounted flag for cleanup

    const fetchTreeProgress = async () => {
      if (!user) return;  // Don't fetch if no user
      
      try {
        const userProgressData = await fetch(`${BACKEND_URL}/api/game-progress/all-progress`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }).then(res => res.json());
        
        if (!isMounted) return;
        const treeProgressEntry = userProgressData?.progress?.find(p => p.topicId === TREE_TOPIC_ID);
        if (treeProgressEntry?.levels) {
          const completed = new Set(
            treeProgressEntry.levels
              .filter(level => level.completed)
              .map(level => level.level)
          );
          setCompletedLevels(completed);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to fetch tree game progress:", err);
      }
    };

    fetchTreeProgress();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (treeContainerRef.current) {
      setDimensions({ width: treeContainerRef.current.offsetWidth, height: treeContainerRef.current.offsetHeight });
    }
  }, []);

  // Handler for node selection in builder
  const handleNodeSelect = (nodeValue, index) => {
    setSelectedNode(nodeValue);
    setSelectedNodeIndex(index);
  };

  // Handler for placing node in builder
  const handlePlaceNode = (slotIndex) => {
    if (selectedNode !== null) {
      const newTreeSlots = [...treeSlots];
      if (newTreeSlots[slotIndex] === null) {
        newTreeSlots[slotIndex] = selectedNode;
        setTreeSlots(newTreeSlots);

        const newAvailableNodes = availableNodes.filter((_, i) => i !== selectedNodeIndex);
        setAvailableNodes(newAvailableNodes);
        setSelectedNode(null);
        setSelectedNodeIndex(null);

        // Check for level completion or game completion
        const requiredNodesForLevel = Math.pow(2, Math.floor(Math.log2(slotIndex + 1)));
        const currentLevelNodes = newTreeSlots.slice(0, requiredNodesForLevel).filter(node => node !== null).length;

        if (currentLevelNodes === requiredNodesForLevel) {
          setLevelMessage(`Level ${Math.floor(Math.log2(slotIndex + 1)) + 1} complete!`);
          if (newAvailableNodes.length === 0) {
            setIsLevelComplete(true);
            setLevelMessage('All nodes placed! Level Complete!');
            setShowLevel2Success(true); // Show Level 2 specific success message
            // We won't hide this message automatically, user will control it with buttons
          } else if (newAvailableNodes.length === 0 && newTreeSlots.includes(null)) {
            setLevelMessage('Some slots are empty. Try again or reset!');
          } else if (newAvailableNodes.length > 0) {
            setLevelMessage('Place the nodes to form a Binary Tree. Fill levels from left to right!');
          }
        } else if (newAvailableNodes.length === 0 && newTreeSlots.includes(null)) {
          setLevelMessage('Some slots are empty. Try again or reset!');
        } else if (newAvailableNodes.length > 0) {
          setLevelMessage('Place the nodes to form a Binary Tree. Fill levels from left to right!');
        }
      } else {
        setLevelMessage('This slot is already occupied! Choose an empty slot.');
      }
    }
  };

  const renderLargeTree = (highlightNodes = [], highlightEdges = [], stepType, currentPath = [], overrideNodes = null, overrideEdges = null, currentTraversalNodeName = null) => {
    const currentNodes = overrideNodes || nodes;
    const currentEdges = overrideEdges || edges;

    return (
      <motion.svg width="600" height="450" initial={{ opacity: 1, y: 0 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0 }}>
        {/* Edges */}
        {currentEdges.map(([from, to], i) => {
          const fromNode = currentNodes.find(n => n.name === from);
          const toNode = currentNodes.find(n => n.name === to);
          const isHighlighted = highlightEdges.includes(i);
          
          // Check if edge is in current path
          const isInPath = currentPath.length > 0 && 
            ((currentPath.includes(from) && currentPath.includes(to)) && 
             Math.abs(currentPath.indexOf(from) - currentPath.indexOf(to)) === 1);

          // Line color logic
          let lineColor = '#1d4ed8';

          if (stepType === 'animation') { // Specific logic for Preorder Traversal animation
            // An edge is current if it connects the second-to-last node in path to the last node (currentTraversalNodeName)
            const isCurrentEdge = currentPath.length >= 2 && 
                                  fromNode.name === currentPath[currentPath.length - 2] && 
                                  toNode.name === currentTraversalNodeName;
            
            if (isCurrentEdge) {
              lineColor = '#FFD700'; // Yellow for the actively traversed edge
            } else if (isInPath) {
              lineColor = '#008000'; // Green for traversed edges
            }
          } else if (stepType === 'zigzag-animation' || stepType === 'vertical-animation' || stepType === 'animation-bottom-view') {
            if (isInPath) {
              lineColor = '#FFD700'; // Gold for current path for these specific traversals
            } else if (currentPath.includes(from) && currentPath.includes(to)) {
              lineColor = '#ADD8E6'; // Light blue for traversed path
            }
          } else {
            lineColor = isHighlighted ? '#f59e42' : '#1d4ed8';
          }

          return (
            <motion.line
              key={i}
              x1={fromNode.x}
              y1={fromNode.y+20}
              x2={toNode.x}
              y2={toNode.y-20}
              strokeWidth={isInPath ? 5 : 2}
              initial={{ opacity: 1 }}
              animate={{
                opacity: 1,
                stroke: lineColor,
                strokeWidth: isInPath ? 5 : 2
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })}
        {/* Nodes */}
        {currentNodes.map((node, i) => {
          const isHighlighted = highlightNodes.includes(node.name);
          const isCurrentNode = currentPath.length > 0 && node.name === currentPath[currentPath.length - 1];
          const isInPath = currentPath.includes(node.name);
          
          // Node color logic
          let nodeFillColor = '#2563eb'; // Default blue color
          let nodeStrokeColor = '#fff'; // Default white stroke

          if (stepType === 'animation') { // Highest priority for Preorder Traversal animation
            if (node.name === 'A') { // Special handling for root node 'A'
              nodeFillColor = '#008000'; // Permanently green
              nodeStrokeColor = '#008000'; // Permanently green stroke
            } else if (node.name === currentTraversalNodeName) {
              nodeFillColor = '#FFD700'; // Yellow for current node in preorder (other than A)
              nodeStrokeColor = '#FFD700'; // Yellow stroke
            } else if (currentPath.includes(node.name)) {
              nodeFillColor = '#008000'; // Green for traversed nodes in preorder
              nodeStrokeColor = '#008000'; // Green stroke
            }
          } else { // Handle other step types and general highlighting
            if (isCurrentNode) { // For other animations (current node always yellow)
              nodeFillColor = '#FFD700'; 
              nodeStrokeColor = '#FFD700'; 
            } else if (isInPath) { // For other animations (traversed path light blue)
              if (stepType === 'zigzag-animation' || stepType === 'vertical-animation' || stepType === 'animation-bottom-view') {
                nodeFillColor = '#ADD8E6'; 
                nodeStrokeColor = '#ADD8E6'; 
              }
            } else if (isHighlighted) { // For static highlights (orange)
              nodeFillColor = '#f59e42';
              nodeStrokeColor = '#f59e42';
            }
          }

          return (
            <motion.g
              key={i}
              initial={{ scale: 1, opacity: 1 }}
              animate={{
                scale: isCurrentNode ? 1.2 : 1,
                opacity: 1
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={24}
                stroke={nodeStrokeColor}
                strokeWidth={isCurrentNode ? 3 : 2}
                animate={{ fill: nodeFillColor }}
                transition={{ duration: 0.3 }}
              />
              <motion.text
                x={node.x}
                y={node.y+6}
                textAnchor="middle"
                fill="white"
                fontWeight="bold"
                fontSize="18"
              >
                {node.value !== undefined ? node.value : node.name}
              </motion.text>
            </motion.g>
          );
        })}
      </motion.svg>
    );
  };

  // Function to perform preorder traversal with animation
  const startPreorderTraversal = () => {
    stopPreorderTraversal(); // Ensure a clean slate before starting
    setIsTraversing(true);
    setPreorderArray(['A', 'B', 'D', 'E', 'C', 'F', 'G']); // Set the full correct sequence upfront
    setCurrentTraversalNode(null); // Revert: Will be set in traverse
    setCurrentPath([]); // Revert: Will be built in traverse
    setTraversalIndex(0); // Start animation from the first element

    const preorderSequence = ['A', 'B', 'D', 'E', 'C', 'F', 'G'];
    let localIndex = 0; // Revert: Start from index 0 to include 'A'

    const traverse = () => {
      if (localIndex < preorderSequence.length) {
        setCurrentTraversalNode(preorderSequence[localIndex]);
        setCurrentPath(prev => [...prev, preorderSequence[localIndex]]);
        setTraversalIndex(localIndex); // Update the index for rendering progress
        localIndex++;
        setTimeout(traverse, 1000); // 1 second delay between nodes
      } else {
        setIsTraversing(false);
        setCurrentTraversalNode(null);
        setShowLevel4Success(true); // Trigger Level 4 success message
        if (!completedLevels.has(4)) {
          saveProgress(4); // Save progress for Level 4
        }
      }
    };

    traverse();
  };

  // Function to stop preorder traversal animation
  const stopPreorderTraversal = () => {
    setIsTraversing(false);
    setPreorderArray([]); // Clear array display
    setCurrentTraversalNode(null);
    setCurrentPath([]); // Clear path when stopping
    setTraversalIndex(-1); // Reset animation index
  };

  // Function to render the preorder array with animations
  const renderPreorderArray = () => {
      return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {traversalIndex === -1 && !isTraversing ? (
          <p className="text-gray-400">Click 'START TRAVERSAL' to see the Preorder sequence.</p>
        ) : (
          preorderArray.slice(0, traversalIndex + 1).map((node, index) => (
          <motion.div // Changed back to motion.div
              key={`${node}-${index}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-xl font-bold text-white"
            >
              {node}
            </motion.div>
          ))
        )}
      </div>
    );
  };

  // Drag and Drop Handlers for Postorder Array
  const handlePostorderNodeSelect = (nodeValue, index) => {
    setPostorderSelectedNode(nodeValue);
    setPostorderSelectedNodeIndex(index);
    setPostorderMessage(`Selected: ${nodeValue}. Now click an empty slot in the array.`);
  };

  const handlePostorderPlaceNode = (slotIndex) => {
    if (postorderSelectedNode !== null && userPostorderArray[slotIndex] === null) {
      const newUserArray = [...userPostorderArray];
      newUserArray[slotIndex] = postorderSelectedNode;
      setUserPostorderArray(newUserArray);

      const newAvailableNodes = [...postorderAvailableNodes];
      newAvailableNodes.splice(postorderSelectedNodeIndex, 1);
      setPostorderAvailableNodes(newAvailableNodes);

      setPostorderSelectedNode(null);
      setPostorderSelectedNodeIndex(null);

      // Check if the current placement is correct
      if (newUserArray[slotIndex] === postorderCorrectArray[slotIndex]) {
        setPostorderMessage(`Correct! Placed ${newUserArray[slotIndex]} at position ${slotIndex + 1}.`);
      } else {
        setPostorderMessage(`Incorrect! ${newUserArray[slotIndex]} is not the correct node for position ${slotIndex + 1}.`);
      }

      // Check if the array is complete and correct
      if (newUserArray.every(node => node !== null) && JSON.stringify(newUserArray) === JSON.stringify(postorderCorrectArray)) {
        setPostorderMessage('Postorder Traversal Complete and Correct! Great Job!');
        setPostorderIsComplete(true);
        setShowLevel5Success(true); // Trigger Level 5 success message
        if (!completedLevels.has(5)) {
          saveProgress(5); // Save progress for Level 5
        }
      } else if (newUserArray.every(node => node !== null)) {
        setPostorderMessage('Array complete, but incorrect. Keep trying!');
      }

    } else if (postorderSelectedNode === null) {
      setPostorderMessage('Please select a node first!');
    } else if (userPostorderArray[slotIndex] !== null) {
      setPostorderMessage('That slot is already taken!');
    }
  };

  // Drag and Drop Handlers for Inorder Array
  const handleInorderNodeSelect = (nodeValue, index) => {
    setInorderSelectedNode(nodeValue);
    setInorderSelectedNodeIndex(index);
    setInorderMessage(`Selected: ${nodeValue}. Now click an empty slot in the array.`);
  };

  const handleInorderPlaceNode = (slotIndex) => {
    if (inorderSelectedNode !== null && userInorderArray[slotIndex] === null) {
      const newUserArray = [...userInorderArray];
      newUserArray[slotIndex] = inorderSelectedNode;
      setUserInorderArray(newUserArray);

      const newAvailableNodes = [...inorderAvailableNodes];
      newAvailableNodes.splice(inorderSelectedNodeIndex, 1);
      setInorderAvailableNodes(newAvailableNodes);

      setInorderSelectedNode(null);
      setInorderSelectedNodeIndex(null);

      // Check if the current placement is correct
      if (newUserArray[slotIndex] === inorderCorrectArray[slotIndex]) {
        setInorderMessage(`Correct! Placed ${newUserArray[slotIndex]} at position ${slotIndex + 1}.`);
      } else {
        setInorderMessage(`Incorrect! ${newUserArray[slotIndex]} is not the correct node for position ${slotIndex + 1}.`);
      }

      // Check if the array is complete and correct
      if (newUserArray.every(node => node !== null) && JSON.stringify(newUserArray) === JSON.stringify(inorderCorrectArray)) {
        setInorderMessage('Inorder Traversal Complete and Correct! Great Job!');
        setInorderIsComplete(true);
        setShowLevel6Success(true); // Trigger Level 6 success message
        if (!completedLevels.has(6)) {
          saveProgress(6); // Save progress for Level 6
        }
      } else if (newUserArray.every(node => node !== null)) {
        setInorderMessage('Array complete, but incorrect. Keep trying!');
      }

    } else if (inorderSelectedNode === null) {
      setInorderMessage('Please select a node first!');
    } else if (userInorderArray[slotIndex] !== null) {
      setInorderMessage('That slot is already taken!');
    }
  };

  // Drag and Drop Handlers for Level Order Array
  const handleLevelOrderNodeSelect = (nodeValue, index) => {
    setLevelOrderSelectedNode(nodeValue);
    setLevelOrderSelectedNodeIndex(index);
    setLevelOrderMessage(`Selected: ${nodeValue}. Now click an empty slot in the array.`);
  };

  const handleLevelOrderPlaceNode = (slotIndex) => {
    if (levelOrderSelectedNode !== null && userLevelOrderArray[slotIndex] === null) {
      const newUserArray = [...userLevelOrderArray];
      newUserArray[slotIndex] = levelOrderSelectedNode;
      setUserLevelOrderArray(newUserArray);

      const newAvailableNodes = [...levelOrderAvailableNodes];
      newAvailableNodes.splice(levelOrderSelectedNodeIndex, 1);
      setLevelOrderAvailableNodes(newAvailableNodes);

      setLevelOrderSelectedNode(null);
      setLevelOrderSelectedNodeIndex(null);

      // Check if the current placement is correct
      if (newUserArray[slotIndex] === levelOrderCorrectArray[slotIndex]) {
        setLevelOrderMessage(`Correct! Placed ${newUserArray[slotIndex]} at position ${slotIndex + 1}.`);
      } else {
        setLevelOrderMessage(`Incorrect! ${newUserArray[slotIndex]} is not the correct node for position ${slotIndex + 1}.`);
      }

      // Check if the array is complete and correct
      if (newUserArray.every(node => node !== null) && JSON.stringify(newUserArray) === JSON.stringify(levelOrderCorrectArray)) {
        setLevelOrderMessage('Level Order Traversal Complete and Correct! Great Job!');
        setLevelOrderIsComplete(true);
        setShowLevel7Success(true); // Trigger Level 7 success message
        if (!completedLevels.has(7)) {
          saveProgress(7); // Save progress for Level 7
        }
      } else if (newUserArray.every(node => node !== null)) {
        setLevelOrderMessage('Array complete, but incorrect. Keep trying!');
      }

    } else if (levelOrderSelectedNode === null) {
      setLevelOrderMessage('Please select a node first!');
    } else if (userLevelOrderArray[slotIndex] !== null) {
      setLevelOrderMessage('That slot is already taken!');
    }
  };

  // Add a new function to render path sums
  const renderPathSums = () => {
    if (!propertiesSteps[propertiesStep].showPathSums) return null;

    const paths = [
      { path: ['A', 'B', 'D'], sum: nodeWeights['A'] + nodeWeights['B'] + nodeWeights['D'] },
      { path: ['A', 'B', 'E'], sum: nodeWeights['A'] + nodeWeights['B'] + nodeWeights['E'] },
      { path: ['A', 'C', 'F'], sum: nodeWeights['A'] + nodeWeights['C'] + nodeWeights['F'] },
      { path: ['A', 'C', 'G'], sum: nodeWeights['A'] + nodeWeights['C'] + nodeWeights['G'] }
    ];

    return (
      <div className="mt-4 p-4 bg-blue-100 rounded-lg">
        <h3 className="text-xl font-bold text-blue-800 mb-2">Path Sums:</h3>
        <div className="grid grid-cols-2 gap-4">
          {paths.map((p, index) => (
            <div key={index} className="bg-blue-800 p-3 rounded-lg">
              <div className="text-yellow-400 font-mono">
                {p.path.map(node => `${node}(${nodeWeights[node]})`).join(' → ')} = {p.sum}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <div className="text-green-400 font-bold">Maximum Path Sum: {Math.max(...paths.map(p => p.sum))} (A → C → G)</div>
          <div className="text-red-400 font-bold">Minimum Path Sum: {Math.min(...paths.map(p => p.sum))} (A → B → D)</div>
        </div>
      </div>
    );
  };

  // Add a new function to render node weights
  const renderNodeWeights = () => {
    if (!propertiesSteps[propertiesStep].showNodeWeights) return null;

    return (
      <div className="mt-4 p-4 bg-blue-100rounded-lg">
        <h3 className="text-xl font-bold text-blue-800 mb-2">Node Weights:</h3>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(nodeWeights).map(([node, weight]) => (
            <div key={node} className="bg-blue-400 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-blue-800">{node}</div>
              <div className="text-pink-600 font-mono">Weight: {weight}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Add functions for special traversals
  const startZigzagTraversal = () => {
    setIsZigzagTraversing(true);
    setZigzagTraversalArray([]);
    setCurrentPath([]);
    setCurrentZigzagLevel(0);
    setZigzagDirection('left-to-right');

    const levelNodes = {
      0: ['A'],
      1: ['B', 'C'],
      2: ['D', 'E', 'F', 'G']
    };

    let currentLevel = 0;
    let currentIndex = 0;

    const traverse = () => {
      if (currentLevel < Object.keys(levelNodes).length) {
        const nodes = levelNodes[currentLevel];
        const isReverse = currentLevel % 2 === 1;
        const currentNode = isReverse ? nodes[nodes.length - 1 - currentIndex] : nodes[currentIndex];

        // Update path tracking
        setCurrentPath(prev => [...prev, currentNode]);
        setCurrentZigzagLevel(currentLevel);
        setZigzagDirection(isReverse ? 'right-to-left' : 'left-to-right');
        setZigzagTraversalArray(prev => [...prev, currentNode]);

        if (currentIndex < nodes.length - 1) {
          currentIndex++;
        } else {
          currentLevel++;
          currentIndex = 0;
        }

        setTimeout(traverse, 1000);
      } else {
        setIsZigzagTraversing(false);
        setCurrentZigzagLevel(null);
        setShowLevel8Success(true); // Trigger Level 8 success message
        if (!completedLevels.has(8)) {
          saveProgress(8); // Save progress for Level 8
        }
      }
    };

    traverse();
  };

  // NEW: Function to perform vertical traversal with animation
  const startVerticalTraversal = () => {
    setIsVerticalTraversing(true);
    setVerticalTraversalArray([]);
    setCurrentPath([]);
    setCurrentVerticalColumn(null);

    // Ensure nodesByColumn is always an object
    let nodesByColumn = {};
    if (verticalSteps && verticalSteps.length > 0 && verticalSteps[0].nodesInColumns) {
      nodesByColumn = verticalSteps[0].nodesInColumns;
    }
    
    if (Object.keys(nodesByColumn).length === 0) {
      console.warn("Vertical traversal data (nodesInColumns) is empty or missing from verticalSteps[0]. Cannot start animation.");
      setIsVerticalTraversing(false);
      return; // Stop execution if data is missing
    }

    const sortedColumnKeys = Object.keys(nodesByColumn).sort((a, b) => parseInt(a) - parseInt(b));

    let columnIndex = 0;
    let nodeIndexInColumn = 0;

    const traverse = () => {
      if (columnIndex < sortedColumnKeys.length) {
        const currentColumnKey = sortedColumnKeys[columnIndex];
        const nodesInCurrentColumn = nodesByColumn[currentColumnKey];

        if (nodeIndexInColumn < nodesInCurrentColumn.length) {
          const currentNode = nodesInCurrentColumn[nodeIndexInColumn];

          setCurrentPath(prev => [...prev, currentNode.name]); // Use node name for path
          setCurrentVerticalColumn(parseInt(currentColumnKey));
          setVerticalTraversalArray(prev => [...prev, currentNode.value]); // Use node value for array

          nodeIndexInColumn++;
          setTimeout(traverse, 1000);
        } else {
          columnIndex++;
          nodeIndexInColumn = 0;
          setTimeout(traverse, 1000);
        }
      } else {
        setIsVerticalTraversing(false);
        setCurrentVerticalColumn(null);
        setShowLevel9Success(true); // Trigger Level 9 success message
        if (!completedLevels.has(9)) {
          saveProgress(9); // Save progress for Level 9
        }
      }
    };

    traverse();
  };

  // Add render functions for special traversals
  const renderZigzagLevels = () => {
    if (!specialTraversalSteps[specialTraversalStep].showZigzagLevels) return null; // Updated to specialTraversalStep

    const levels = {
      'A': { level: 0, direction: '→' },
      'B': { level: 1, direction: '←' },
      'C': { level: 1, direction: '←' },
      'D': { level: 2, direction: '→' },
      'E': { level: 2, direction: '→' },
      'F': { level: 2, direction: '→' },
      'G': { level: 2, direction: '→' }
    };

    return (
      <div className="mt-4 p-4 bg-blue-100 rounded-lg">
        <h3 className="text-xl font-bold text-blue-800 mb-2">Zigzag Levels and Directions:</h3>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(levels).map(([node, info]) => (
            <div key={node} className="bg-blue-400 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-blue-800">{node}</div>
              <div className="text-pink-800 font-mono">Level: {info.level}</div>
              <div className="text-pink-800 font-mono">Direction: {info.direction}</div>
            </div>
          ))}
        </div>
        
      </div>
    );
  };

  // NEW: Render function for vertical columns
  const renderVerticalColumns = () => {
    if (!verticalSteps[0].showVerticalColumns) return null; // Check for showVerticalColumns

    const columns = verticalSteps[0].nodesInColumns;
    const sortedColumnKeys = Object.keys(columns).sort((a, b) => parseInt(a) - parseInt(b));

    return (
      <div className="mt-4 p-4 blue-100 rounded-lg">
        <h3 className="text-xl font-bold text-blue-600 mb-2">Vertical Columns (Values in order):</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {sortedColumnKeys.map(colKey => (
            <div key={colKey} className="bg-blue-800 p-3 rounded-lg text-center">
              <div className="text-xl font-bold text-white">Column {colKey}</div>
              <div className="text-yellow-400 font-mono">[{columns[colKey].map(n => n.value).join(', ')}]</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTraversalArray = (array, type) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {array.map((node, index) => (
          <motion.div
            key={`${node}-${index}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-xl font-bold text-white"
          >
            {node}
          </motion.div>
        ))}
      </div>
    );
  };

  // NEW: Function to perform Top View traversal with animation
  const startTopViewTraversal = () => {
    setIsTopViewTraversing(true);
    setTopViewArray([]);
    setCurrentPath([]);
    setHighlightedTopViewNodes([]); // Reset highlighted nodes

    // Perform Level Order Traversal (BFS) to get horizontal distances
    const queue = [{ node: nodes.find(n => n.name === 'A'), hd: 0, path: ['A'] }]; // Node, Horizontal Distance, Path
    const visitedHd = new Map(); // Map to store the first node encountered at each horizontal distance
    let traversalIndex = 0;

    const topViewSequence = [];

    const animateTraversal = () => {
      if (queue.length > 0) {
        const { node, hd, path } = queue.shift();

        if (!visitedHd.has(hd)) {
          visitedHd.set(hd, node.name);
          topViewSequence.push(node.name); // Collect nodes for the final sequence
          setHighlightedTopViewNodes((prev) => [...prev, node.name]); // Highlight node
        }

        setCurrentPath(path);
        setTopViewArray(topViewSequence); // Update the displayed array progressively

        // Add children to queue
        const leftChild = nodes.find(n => edges.some(e => e[0] === node.name && e[1] === n.name) && n.x < node.x);
        const rightChild = nodes.find(n => edges.some(e => e[0] === node.name && e[1] === n.name) && n.x > node.x);

        if (leftChild) {
          queue.push({ node: leftChild, hd: hd - 1, path: [...path, leftChild.name] });
        }
        if (rightChild) {
          queue.push({ node: rightChild, hd: hd + 1, path: [...path, rightChild.name] });
        }

        setTimeout(animateTraversal, 1000);
      } else {
        setIsTopViewTraversing(false);
        setCurrentPath([]);
        // Sort the topViewSequence by horizontal distance to get the final correct order
        const sortedTopView = Array.from(visitedHd.entries())
                                  .sort((a, b) => a[0] - b[0])
                                  .map(([hd, nodeName]) => nodeName);
        setTopViewArray(sortedTopView);
      }
    };

    animateTraversal();
  };

  // NEW: Function to perform Bottom View traversal with animation
  const startBottomViewTraversal = () => {
    setIsBottomViewTraversing(true);
    setBottomViewArray([]);
    setCurrentPath([]); // Re-enable: Path highlighting to show traversal
    setHighlightedBottomViewNodes([]); // Reset highlighted nodes

    const queue = [{ node: nodes.find(n => n.name === 'A'), hd: 0, path: ['A'] }]; // Re-enable: path in queue item
    const bottomViewMap = new Map(); // Map to store the last node encountered at each horizontal distance
    
    let traversalTimeout;

    const animateTraversal = () => {
      if (queue.length > 0) {
        const { node, hd, path } = queue.shift(); // Re-enable: path from destructuring

        bottomViewMap.set(hd, node.name); // Always update with the latest node at this horizontal distance

        setCurrentPath(path); // Re-enable: Path highlighting to show traversal
        
        // Update the displayed array progressively
        const currentBottomView = Array.from(bottomViewMap.entries())
                                  .sort((a, b) => a[0] - b[0])
                                  .map(([hd, nodeName]) => nodeName);
        setBottomViewArray(currentBottomView);

        // Update highlighted nodes for animation
        setHighlightedBottomViewNodes(Array.from(bottomViewMap.values())); // Highlight all nodes currently in the bottom view

        const leftChild = nodes.find(n => edges.some(e => e[0] === node.name && e[1] === n.name) && n.x < node.x);
        const rightChild = nodes.find(n => edges.some(e => e[0] === node.name && e[1] === n.name) && n.x > node.x);

        if (leftChild) {
          queue.push({ node: leftChild, hd: hd - 1, path: [...path, leftChild.name] }); // Re-enable: path in queue push
        }
        if (rightChild) {
          queue.push({ node: rightChild, hd: hd + 1, path: [...path, rightChild.name] }); // Re-enable: path in queue push
        }

        traversalTimeout = setTimeout(animateTraversal, 1000);
      } else {
        setIsBottomViewTraversing(false);
        setCurrentPath([]); // Clear path after animation
        setHighlightedBottomViewNodes([]); // Clear highlights after animation
        // Final sort to ensure correct order
        const finalBottomView = Array.from(bottomViewMap.entries())
                                  .sort((a, b) => a[0] - b[0])
                                  .map(([hd, nodeName]) => nodeName);
        setBottomViewArray(finalBottomView);
      }
    };

    animateTraversal();
  };

  // NEW: Function to perform Left View traversal with animation
  const startLeftViewTraversal = () => {
    setIsLeftViewTraversing(true);
    setLeftViewArray([]);
    setCurrentPath([]);

    const queue = [{ node: nodes.find(n => n.name === 'A'), level: 0, path: ['A'] }];
    const leftViewNodes = new Map(); // Map to store the first node encountered at each level

    let traversalTimeout;

    const animateTraversal = () => {
      if (queue.length > 0) {
        const { node, level, path } = queue.shift();

        if (!leftViewNodes.has(level)) {
          leftViewNodes.set(level, node.name);
        }

        setCurrentPath(path);
        // Update the displayed array progressively
        const currentLeftView = Array.from(leftViewNodes.entries())
                                  .sort((a, b) => a[0] - b[0])
                                  .map(([level, nodeName]) => nodeName);
        setLeftViewArray(currentLeftView);

        const leftChild = nodes.find(n => edges.some(e => e[0] === node.name && e[1] === n.name) && n.x < node.x);
        const rightChild = nodes.find(n => edges.some(e => e[0] === node.name && e[1] === n.name) && n.x > node.x);

        if (leftChild) {
          queue.push({ node: leftChild, level: level + 1, path: [...path, leftChild.name] });
        }
        if (rightChild) {
          queue.push({ node: rightChild, level: level + 1, path: [...path, rightChild.name] });
        }
        traversalTimeout = setTimeout(animateTraversal, 1000);
      } else {
        setIsLeftViewTraversing(false);
        setCurrentPath([]);
        const finalLeftView = Array.from(leftViewNodes.entries())
                                  .sort((a, b) => a[0] - b[0])
                                  .map(([level, nodeName]) => nodeName);
        setLeftViewArray(finalLeftView);
      }
    };
    animateTraversal();
  };


  // NEW: Function to check Right View user input
  const checkRightViewAnswer = () => {
    const correctRightView = rightViewArray.join(' ');
    const formattedUserInput = userRightViewInput.trim().split(/\s*,*\s*/).join(' ');

    const expectedRightView = ['A', 'C', 'G'].join(' ');

    if (formattedUserInput.toLowerCase() === expectedRightView.toLowerCase()) {
      setRightViewFeedbackMessage('Correct! You\'ve mastered the Right View.');
      setIsRightViewInputCorrect(true);
      setShowLevel10Success(true);
      // Save progress for Level 10
      if (!completedLevels.has(10)) {
        saveProgress(10);
      }
    } else {
      setRightViewFeedbackMessage(`Incorrect. Please try again. The correct order was ${expectedRightView}`);
      setIsRightViewInputCorrect(false);
    }
  };

  // --- Conditional rendering for premium UI ---
  if (loadingPremium) return <div>Checking premium access...</div>;

  const hasBundle = user?.premiumAccess?.includes('bundle');
  return (
    <div className="relative min-h-screen">
      {(!hasPremium && !hasBundle) ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold mb-4">Premium Required</h2>
          <p className="mb-4">You need to purchase premium access to play the Binary Tree Game.</p>
          <button onClick={handleBuyPremium} disabled={razorpayLoading} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold">
            {razorpayLoading ? 'Processing...' : 'Buy Premium Access'}
          </button>
        </div>
      ) : (
        // Render the full TreeGame UI here
        <div className="min-h-screen font-sans relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 flex flex-col items-center justify-center py-10">
          {/* Card-like main container */}
          <GameDecorations />
          <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-white via-green-50 to-emerald-100 rounded-3xl shadow-2xl p-8 border-2 border-green-500 relative z-10 flex flex-col items-center">
            {/* Navigation Buttons (Top) */}
            <div className="flex justify-between items-center mb-4 w-full px-2">
                <button
                onClick={() => {
                  setCurrentLevel((prev) => Math.max(1, prev - 1));
                  setAnimationsOn(false);
                }}
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
                onClick={() => {
                  setCurrentLevel((prev) => Math.min(10, prev + 1));
                  setAnimationsOn(false);
                }}
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
            {/* Progress Indicator Bar */}
            <div className="mt-2 mb-6 flex justify-center space-x-2">
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
                      ${isCompleted ? 'bg-green-700 border-green-600 text-white' : 'bg-white border-gray-400 text-gray-600'}
                      ${isCurrent ? 'ring-2 ring-green-500 scale-110' : ''}
                      cursor-pointer hover:shadow-lg hover:border-green-400 hover:scale-105`
                    }
                    style={{ userSelect: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}
                  >
                    {levelNum}
                  </div>
                );
              })}
            </div>
            {/* Main TreeGame UI starts here */}
            {/* Example: */}
            <>
            {/* Global Level Navigation Buttons */}
            <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 9999, display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setCurrentLevel((prev) => Math.max(1, prev - 1));
                  setAnimationsOn(false);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-bold"
              >
                Previous Level
              </button>
              <button
                onClick={() => {
                  setCurrentLevel((prev) => Math.min(10, prev + 1)); // Assuming max level is 10 (Tree Views)
                  setAnimationsOn(false);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white font-bold"
              >
                Next Level
              </button>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {showSuccessMessage && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <div className="bg-green-600 text-white p-8 rounded-lg shadow-2xl text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="text-6xl mb-4"
                    >
                      🎉
                    </motion.div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold mb-2"
                    >
                      Level Complete!
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl"
                    >
                      Great job! You've successfully completed this level!
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Level 1 Success Message */}
            <AnimatePresence>
              {showLevel1Success && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <div className="bg-green-600 text-white p-8 rounded-lg shadow-2xl text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="text-6xl mb-4"
                    >
                      🌳
                    </motion.div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold mb-2"
                    >
                      Level 1 Complete!
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl"
                    >
                      Great job! You've learned all the basic tree concepts!
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Level 2 Success Message */}
            <AnimatePresence>
              {showLevel2Success && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <div className="bg-green-600 text-white p-8 rounded-lg shadow-2xl text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="text-6xl mb-4"
                    >
                      ✅
                    </motion.div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold mb-2"
                    >
                      Level 2 Complete!
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl mb-4"
                    >
                      You've successfully built the binary tree!
                    </motion.p>
                    <div className="flex justify-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowLevel2Success(false)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg text-white"
                      >
                        Hide Message
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowLevel2Success(false);
                          setCurrentLevel(3); // Move to Level 3 (Tree Properties)
                          setAnimationsOn(false); // Disable animations when switching levels
                          if (!completedLevels.has(2)) {
                            saveProgress(2); // Save progress for Level 2
                          }
                        }}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-lg text-white"
                      >
                        Move to Next Level
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Level 3 Success Message */}
            <AnimatePresence>
              {showLevel3Success && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <div className="bg-green-600 text-white p-8 rounded-lg shadow-2xl text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="text-6xl mb-4"
                    >
                      ⭐
                    </motion.div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold mb-2"
                    >
                      Level 3 Complete!
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl mb-4"
                    >
                      You've explored all the essential tree properties!
                    </motion.p>
                    <div className="flex justify-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowLevel3Success(false)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg text-white"
                      >
                        Hide Message
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowLevel3Success(false);
                          setCurrentLevel(4); // Move to Level 4 (Preorder Traversal)
                          setAnimationsOn(false); // Disable animations when switching levels
                          if (!completedLevels.has(3)) {
                            saveProgress(3); // Save progress for Level 3
                          }
                        }}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-lg text-white"
                      >
                        Move to Next Level
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Level 4 Success Message (Preorder Traversal) */}
            <AnimatePresence>
              {showLevel4Success && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <div className="bg-green-600 text-white p-8 rounded-lg shadow-2xl text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="text-6xl mb-4"
                    >
                      ✅
                    </motion.div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold mb-2"
                    >
                      Level 4 Complete!
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl mb-4"
                    >
                      You've successfully completed the Preorder Traversal!
                    </motion.p>
                    <div className="flex justify-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowLevel4Success(false)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg text-white"
                      >
                        Hide Message
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowLevel4Success(false);
                          setCurrentLevel(5); // Move to Level 5 (Postorder Traversal)
                          setAnimationsOn(false); // Disable animations when switching levels
                        }}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-lg text-white"
                      >
                        Move to Next Level
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Level 5 Success Message */}
            <AnimatePresence>
              {showLevel5Success && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <div className="bg-green-600 text-white p-8 rounded-lg shadow-2xl text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="text-6xl mb-4"
                    >
                      ✅
                    </motion.div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold mb-2"
                    >
                      Level 5 Complete!
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl mb-4"
                    >
                      You've successfully completed the Postorder Traversal!
                    </motion.p>
                    <div className="flex justify-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowLevel5Success(false)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg text-white"
                      >
                        Hide Message
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowLevel5Success(false);
                          setCurrentLevel(6); // Move to Level 6 (Inorder Traversal)
                          setAnimationsOn(false); // Disable animations when switching levels
                        }}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-lg text-white"
                      >
                        Move to Next Level
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Level 6 Success Message */}
            <AnimatePresence>
              {showLevel6Success && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <div className="bg-green-600 text-white p-8 rounded-lg shadow-2xl text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="text-6xl mb-4"
                    >
                      ✅
                    </motion.div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold mb-2"
                    >
                      Level 6 Complete!
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl mb-4"
                    >
                      You've successfully completed the Inorder Traversal!
                    </motion.p>
                    <div className="flex justify-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowLevel6Success(false)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg text-white"
                      >
                        Hide Message
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowLevel6Success(false);
                          setCurrentLevel(7); // Move to Level 7 (Level Order Traversal)
                          setAnimationsOn(false); // Disable animations when switching levels
                        }}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-lg text-white"
                      >
                        Move to Next Level
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Level 7 Success Message */}
            <AnimatePresence>
              {showLevel7Success && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <div className="bg-green-600 text-white p-8 rounded-lg shadow-2xl text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="text-6xl mb-4"
                    >
                      ✅
                    </motion.div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold mb-2"
                    >
                      Level 7 Complete!
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl mb-4"
                    >
                      You've successfully completed the Level Order Traversal!
                    </motion.p>
                    <div className="flex justify-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowLevel7Success(false)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg text-white"
                      >
                        Hide Message
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowLevel7Success(false);
                          setCurrentLevel(8); // Move to Level 8 (Zigzag Traversal)
                          setAnimationsOn(false); // Disable animations when switching levels
                        }}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-lg text-white"
                      >
                        Move to Next Level
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Level 8 Success Message */}
            <AnimatePresence>
              {showLevel8Success && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <div className="bg-green-600 text-white p-8 rounded-lg shadow-2xl text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="text-6xl mb-4"
                    >
                      ✅
                    </motion.div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold mb-2"
                    >
                      Level 8 Complete!
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl mb-4"
                    >
                      You've successfully completed the Zigzag Traversal!
                    </motion.p>
                    <div className="flex justify-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowLevel8Success(false)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg text-white"
                      >
                        Hide Message
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowLevel8Success(false);
                          setCurrentLevel(9); // Move to Level 9 (Vertical Traversal)
                          setAnimationsOn(false); // Disable animations when switching levels
                        }}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-lg text-white"
                      >
                        Move to Next Level
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Level 9 Success Message */}
            <AnimatePresence>
              {showLevel9Success && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <div className="bg-green-600 text-white p-8 rounded-lg shadow-2xl text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="text-6xl mb-4"
                    >
                      ✅
                    </motion.div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold mb-2"
                    >
                      Level 9 Complete!
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl mb-4"
                    >
                      You've successfully completed the Vertical Traversal!
                    </motion.p>
                    <div className="flex justify-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowLevel9Success(false)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg text-white"
                      >
                        Hide Message
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setShowLevel9Success(false);
                          setCurrentLevel(10); // Move to Level 10 (Tree Views)
                          setAnimationsOn(false); // Disable animations when switching levels
                        }}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-lg text-white"
                      >
                        Move to Next Level
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Level 10 Success Message */}
            <AnimatePresence>
              {showLevel10Success && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
                >
                  <div className="bg-green-600 text-white p-8 rounded-lg shadow-2xl text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="text-6xl mb-4"
                    >
                      🌳
                    </motion.div>
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl font-bold mb-2"
                    >
                      Level 10 Complete!
                    </motion.h2>
                    <motion.p
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl mb-4"
                    >
                      Congratulations! You've mastered all Tree Views!
                    </motion.p>
                    <div className="flex justify-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowLevel10Success(false)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg text-white"
                      >
                        Hide Message
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

              <div >
              

              {/* Rest of the game interface */}
              <div className="flex flex-col items-center">
                
                {currentLevel === 1 ? (
                  // Level 1: Binary Tree Concepts
                  <div className="flex flex-col items-center space-y-8 my-8">
                      <h1 className="text-5xl font-extrabold text-center mb-6 bg-blue-600 bg-clip-text text-transparent drop-shadow-lg tracking-tight relative z-10 font-serif">
                        Level 1: Binary Tree Concepts
                      </h1>
                      <div className="bg-blue-100 p-8 rounded-2xl shadow-xl max-w-3xl text-center border-2 border-purple-200">
                        <h2 className="text-3xl font-bold text-pink-400 mb-6">{steps[currentStep].title}</h2>
                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">{steps[currentStep].explanation}</p>
                    </div>
                      <div className="bg-blue-100 p-6 rounded-2xl shadow-xl flex flex-col items-center border-2 border-green-200">
                      {renderLargeTree(
                        steps[currentStep].highlightNodes,
                        steps[currentStep].showEdgeNav ? [edgeIndex] : steps[currentStep].highlightEdges,
                        steps[currentStep].type
                      )}
                      {steps[currentStep].showEdgeNav && (
                          <div className="flex space-x-4 mt-6">
                          <button
                            onClick={() => setEdgeIndex((prev) => (prev - 1 + edges.length) % edges.length)}
                              className="px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 rounded-xl text-white font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
                          >
                              ← Previous Edge
                          </button>
                            <span className="text-purple-700 font-mono text-lg font-bold bg-white px-4 py-2 rounded-lg shadow-md">Edge {edgeIndex + 1} of {edges.length}</span>
                          <button
                            onClick={() => setEdgeIndex((prev) => (prev + 1) % edges.length)}
                              className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 rounded-xl text-white font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
                          >
                              Next Edge →
                          </button>
                        </div>
                      )}
                    </div>
                      <div className="flex space-x-6 mt-8">
                      <button
                        onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                        disabled={currentStep === 0}
                          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                            currentStep === 0 
                              ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                          }`}
                        >
                          ← Previous
                      </button>
                      {currentStep === steps.length - 1 ? (
                        <button
                          onClick={() => {
                            setShowLevel1Success(true);
                            setTimeout(() => {
                              setShowLevel1Success(false);
                              setCurrentLevel(2); // Go to Level 2 (Builder)
                              setAnimationsOn(false); // Disable animations when switching levels
                              if (!completedLevels.has(1)) {
                                saveProgress(1); // Save progress for Level 1
                              }
                            }, 2000);
                          }}
                            className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105 shadow-lg"
                        >
                            🌳 Start Interactive Tree Builder
                        </button>
                      ) : (
                        <button
                          onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                            className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white transform hover:scale-105 shadow-lg"
                        >
                            Next →
                        </button>
                      )}
                    </div>
                  </div>
                ) : currentLevel === 2 ? (
                  // Level 2: Interactive Builder
                  <div className="flex flex-col items-center space-y-8 my-8">
                      <h1 className="text-5xl font-extrabold text-center mb-6 bg-blue-600 bg-clip-text text-transparent drop-shadow-lg tracking-tight relative z-10 font-serif">
                        Level 2: Build Your Tree!
                      </h1>
                      <div className="bg-blue-100 p-8 rounded-2xl shadow-xl max-w-3xl text-center border-2 border-purple-200">
                        <h2 className="text-3xl font-bold text-pink-400 mb-6">Build a Binary Tree 🌳</h2>
                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                        Place the given numbers into the tree slots to form a <strong>Binary Tree</strong>.<br/>
                        Fill levels from left to right without any gaps.
                      </p>
                        <div className="text-orange-600 font-mono text-lg font-bold">{levelMessage}</div>
                    </div>
                      <div className="flex space-x-6 items-center mt-8">
                      <button
                        onClick={() => {
                          setCurrentLevel(1); // Back to Level 1 Concepts
                          setShowBuilder(false);
                        }}
                          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                          ← Back to Level 1
                      </button>
                      <button
                        onClick={() => {
                          setCurrentLevel(3); // Go to Level 3 (Tree Properties)
                          setAnimationsOn(false);
                        }}
                          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                          Next: Learn Tree Properties →
                      </button>
                    </div>
                      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 p-6 rounded-2xl shadow-xl flex flex-wrap justify-center gap-4 w-full max-w-4xl border-2 border-pink-200">
                        <h3 className="text-2xl font-bold text-purple-700 w-full mb-4 text-center">Available Nodes:</h3>
                      {availableNodes.length === 0 ? (
                          <p className="text-gray-600 font-bold">No nodes left to place!</p>
                      ) : (
                        availableNodes.map((num, index) => (
                          <motion.div
                            key={index}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleNodeSelect(num, index)}
                              className={`w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg cursor-pointer transition-all duration-300
                                ${selectedNode === num ? 'ring-4 ring-orange-400 shadow-2xl' : 'hover:shadow-xl'}
                            `}
                          >
                            {num}
        </motion.div>
                        ))
                      )}
                    </div>
                      <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6 rounded-2xl shadow-xl min-h-[400px] w-full max-w-4xl relative border-2 border-green-200">
                        {/* <h3 className="text-2xl font-bold text-green-700 w-full mb-6 text-center">Tree Structure:</h3> */}
                      {treeSlots.map((num, index) => {
                        const level = Math.floor(Math.log2(index + 1));
                        const nodesPerLevel = Math.pow(2, level);
                        const posInLevel = index + 1 - Math.pow(2, level);
                        const slotWidth = 100 / (nodesPerLevel + 1);
                        const x = (posInLevel + 1) * slotWidth;
                        const y = level * 80 + 40;
                        const isHighlighted = highlightedLevel === level;
      return (
        <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handlePlaceNode(index)}
                              className={`absolute w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold shadow-lg cursor-pointer transition-all duration-300
                                ${num !== null ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white' : 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 border-2 border-dashed border-gray-500'}
                                ${isHighlighted ? 'ring-4 ring-orange-400 shadow-2xl' : ''}
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
                {/* Lines connecting nodes */}
                {treeSlots.map((num, index) => {
                  if (index === 0) return null;
                  const parentIndex = Math.floor((index - 1) / 2);
                  const level = Math.floor(Math.log2(index + 1));
                  const nodesPerLevel = Math.pow(2, level);
                  const posInLevel = index + 1 - Math.pow(2, level);
                  const slotWidth = 100 / (nodesPerLevel + 1);
                  const x1 = (posInLevel + 1) * slotWidth;
                  const y1 = level * 80 + 40;
                  const parentLevel = Math.floor(Math.log2(parentIndex + 1));
                  const x2 = (parentIndex + 1 - Math.pow(2, parentLevel) + 1) * (100 / (Math.pow(2, parentLevel) + 1));
                  const y2 = parentLevel * 80 + 40;

                  const dx = x2 - x1;
                  const dy = y2 - y1;
                  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                  // Calculate adjusted start/end points to touch the circle edges
                          const radius = 32; // Node radius
                  const lineLength = Math.sqrt(dx * dx + dy * dy);
                  const scaleFactor = 1 - (radius * 2) / lineLength;

                  const finalX1 = x1 + (dx * (1 - scaleFactor)) / 2;
                  const finalY1 = y1 + (dy * (1 - scaleFactor)) / 2;
                  const finalX2 = x2 - (dx * (1 - scaleFactor)) / 2;
                  const finalY2 = y2 - (dy * (1 - scaleFactor)) / 2;

                  return (
                    <svg key={`line-${index}`} className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                      <line
                        x1={`${finalX1}%`}
                        y1={`${finalY1}px`}
                        x2={`${finalX2}%`}
                        y2={`${finalY2}px`}
                                stroke="#8B5CF6"
                                strokeWidth="3"
                      />
                    </svg>
                  );
                })}
              </div>
              {treeSlots.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                          <span className="text-purple-700 font-mono text-lg font-bold">Highlight Level:</span>
                  {[...Array(Math.floor(Math.log2(treeSlots.length)) + 1).keys()].map(level => (
            <button
                      key={level}
                      onClick={() => setHighlightedLevel(level === highlightedLevel ? null : level)}
                              className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg
                                ${highlightedLevel === level ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white' : 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-600 hover:from-gray-400 hover:to-gray-500'}
                      `}
                    >
                      Level {level}
            </button>
                  ))}
                </div>
              )}
            </div>
          ) : currentLevel === 3 ? (
            // Level 3: Tree Properties
            <div className="flex flex-col items-center space-y-8 my-8">
                      <h1 className="text-5xl font-extrabold text-center mb-6 bg-blue-600 bg-clip-text text-transparent drop-shadow-lg tracking-tight relative z-10 font-serif">
                        Level 3: Tree Properties
                      </h1>
                      <div className="bg-blue-100 p-8 rounded-2xl shadow-xl max-w-3xl text-center border-2 border-purple-200 whitespace-pre-line">
                        <h2 className="text-3xl font-bold text-pink-400 mb-6">{propertiesSteps[propertiesStep].title}</h2>
                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">{propertiesSteps[propertiesStep].explanation}</p>
                        <div className="text-orange-600 font-mono text-lg font-bold">{propertiesMessage}</div>
              </div>

                      <div className="bg-blue-100 p-6 rounded-2xl shadow-xl flex flex-col items-center border-2 border-green-200">
                {renderLargeTree(
                  propertiesSteps[propertiesStep].highlightNodes || [],
                  propertiesSteps[propertiesStep].highlightEdges || [],
                  propertiesSteps[propertiesStep].type
                )}
                {renderNodeWeights()}
                {renderPathSums()}
              </div>

                      <div className="flex space-x-6 mt-8">
                <button
                  onClick={() => setPropertiesStep((prev) => Math.max(0, prev - 1))}
                  disabled={propertiesStep === 0}
                          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                            propertiesStep === 0 
                              ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                          }`}
                        >
                          ← Previous
                </button>
                {propertiesStep === propertiesSteps.length - 1 ? (
                  <button
                    onClick={() => {
                      setShowLevel3Success(true); // Show Level 3 success message
                    }}
                            className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105 shadow-lg"
                  >
                            Next: Learn Preorder Traversal →
                  </button>
                ) : (
                  <button
                    onClick={() => setPropertiesStep((prev) => Math.min(propertiesSteps.length - 1, prev + 1))}
                            className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white transform hover:scale-105 shadow-lg"
                  >
                            Next →
                  </button>
                )}
              </div>
              <button
                onClick={() => setCurrentLevel(2)}
                        className="px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mt-4"
              >
                        ← Back to Level 2
              </button>
            </div>
          ) : currentLevel === 4 ? (
            // Level 4: Preorder Traversal (previously Level 3)
            <div className="flex flex-col items-center space-y-8 my-8">
                      <h1 className="text-5xl font-extrabold text-center mb-6 bg-blue-600 bg-clip-text text-transparent drop-shadow-lg tracking-tight relative z-10 font-serif">
                        Level 4: Preorder Traversal
                      </h1>
                      <div className="bg-blue-100 p-8 rounded-2xl shadow-xl max-w-3xl text-center border-2 border-purple-200 whitespace-pre-line">
                        <h2 className="text-3xl font-bold text-pink-400 mb-6">{preorderSteps[preorderStep].title}</h2>
                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">{preorderSteps[preorderStep].explanation}</p>
                {preorderSteps[preorderStep].type === 'animation' && (
                          <div className="mt-6">
            <button
                      onClick={isTraversing ? stopPreorderTraversal : startPreorderTraversal}
                              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                                isTraversing 
                                  ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' 
                                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                              } text-white`}
            >
                      {isTraversing ? 'STOP TRAVERSAL' : 'START TRAVERSAL'}
            </button>
            <button
              onClick={stopPreorderTraversal} // Reset button
                              className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white ml-4 transform hover:scale-105 shadow-lg"
            >
              Reset Traversal
            </button>
          </div>
                )}
              </div>
                      <div className="bg-blue-100 p-6 rounded-2xl shadow-xl flex flex-col items-center border-2 border-green-200">
                {renderLargeTree(
                  preorderSteps[preorderStep].highlightNodes || [],
                  preorderSteps[preorderStep].highlightEdges || [],
                  preorderSteps[preorderStep].type,
                  currentPath,
                  null, // overrideNodes
                  null, // overrideEdges
                  currentTraversalNode // NEW PROP: Pass currentTraversalNode
                )}
                {preorderSteps[preorderStep].type === 'animation' && renderPreorderArray()}
              </div>
                      <div className="flex space-x-6 mt-8">
                <button
                  onClick={() => setPreorderStep((prev) => Math.max(0, prev - 1))}
                  disabled={preorderStep === 0 || isTraversing}
                          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                            preorderStep === 0 || isTraversing 
                              ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                          }`}
                        >
                          ← Previous
                </button>
                {preorderStep === preorderSteps.length - 1 ? (
                  <button
                    onClick={() => setCurrentLevel(5)} // Go to Level 5 (Postorder Traversal)
                            className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105 shadow-lg"
                  >
                            Next: Learn Postorder Traversal →
                  </button>
                ) : (
                  <button
                    onClick={() => setPreorderStep((prev) => Math.min(preorderSteps.length - 1, prev + 1))}
                            className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white transform hover:scale-105 shadow-lg"
                  >
                            Next →
                  </button>
            )}
          </div>
          </div>
          ) : currentLevel === 5 ? (
            // Level 5: Postorder Traversal
            <div className="flex flex-col items-center space-y-8 my-8">
                      <h1 className="text-5xl font-extrabold text-center mb-6 bg-blue-600 bg-clip-text text-transparent drop-shadow-lg tracking-tight relative z-10 font-serif">
                        Level 5: Postorder Traversal
                      </h1>
                      <div className="bg-blue-100 p-8 rounded-2xl shadow-xl max-w-3xl text-center border-2 border-purple-200 whitespace-pre-line">
                        <h2 className="text-3xl font-bold text-pink-400 mb-6">{postorderSteps[postorderStep].title}</h2>
                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">{postorderSteps[postorderStep].explanation}</p>
                        <div className="text-orange-600 font-mono text-lg font-bold">{postorderMessage}</div>
              </div>

              {postorderSteps[postorderStep].type !== 'interactive-builder' ? (
                // Display tree for explanation steps
                        <div className="bg-blue-100 p-6 rounded-2xl shadow-xl flex flex-col items-center border-2 border-green-200">
                  {renderLargeTree(
                    postorderSteps[postorderStep].highlightNodes || [],
                    postorderSteps[postorderStep].highlightEdges || [],
                    postorderSteps[postorderStep].type
                  )}
                </div>
              ) : (
                // Interactive builder section
                        <div className="flex flex-col items-center space-y-6 w-full max-w-4xl">
                          <div className="bg-blue-100 p-6 rounded-2xl shadow-xl flex flex-col items-center w-full border-2 border-green-200">
                            <h3 className="text-2xl font-bold text-green-800 mb-4">Tree for Reference:</h3>
                    {renderLargeTree()} {/* Display the tree without specific highlights */}
                  </div>

                          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 p-6 rounded-2xl shadow-xl flex flex-wrap justify-center gap-4 w-full border-2 border-pink-200">
                            <h3 className="text-2xl font-bold text-purple-700 w-full mb-4 text-center">Available Nodes:</h3>
                    {postorderAvailableNodes.length === 0 ? (
                              <p className="text-gray-600 font-bold">No nodes left to place!</p>
                    ) : (
                      postorderAvailableNodes.map((node, index) => (
                        <motion.div
                          key={node}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handlePostorderNodeSelect(node, index)}
                                  className={`w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg cursor-pointer transition-all duration-300
                                    ${postorderSelectedNode === node ? 'ring-4 ring-orange-400 shadow-2xl' : 'hover:shadow-xl'}
                          `}
                        >
                          {node}
                        </motion.div>
                      ))
                    )}
                  </div>

                          <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6 rounded-2xl shadow-xl w-full border-2 border-green-200">
                            <h3 className="text-2xl font-bold text-green-700 mb-4 text-center">Postorder Array:</h3>
                            <div className="flex justify-center gap-3">
                      {userPostorderArray.map((node, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handlePostorderPlaceNode(index)}
                                  className={`w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg cursor-pointer transition-all duration-300
                                    ${node !== null ? (postorderCorrectArray[index] === node ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-br from-red-500 to-pink-600 text-white') : 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 border-2 border-dashed border-gray-500'}
                          `}
                        >
                          {node !== null ? node : (index + 1)}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {postorderIsComplete && (
                            <div className="mt-6 p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white text-center text-2xl font-bold shadow-xl">
                      Level Complete! You successfully created the Postorder Traversal!
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setUserPostorderArray(Array(7).fill(null));
                      setPostorderAvailableNodes(['A', 'B', 'C', 'D', 'E', 'F', 'G'].sort(() => Math.random() - 0.5));
                      setPostorderSelectedNode(null);
                      setPostorderSelectedNodeIndex(null);
                      setPostorderMessage('Drag and drop nodes to create the Postorder Traversal!');
                      setPostorderIsComplete(false);
                    }}
                            className="px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mt-4"
                  >
                    Reset Level 5
                  </button>
                </div>
              )}

                      <div className="flex space-x-6 mt-8">
                <button
                  onClick={() => setPostorderStep((prev) => Math.max(0, prev - 1))}
                  disabled={postorderStep === 0}
                          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                            postorderStep === 0 
                              ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                          }`}
                        >
                          ← Previous
                </button>
                {postorderStep === postorderSteps.length - 1 ? (
                  <button
                    onClick={() => setCurrentLevel(6)} // Go to Level 6 (Inorder Traversal)
                            className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105 shadow-lg"
                  >
                            Next: Learn Inorder Traversal →
                  </button>
                ) : (
                  <button
                    onClick={() => setPostorderStep((prev) => Math.min(postorderSteps.length - 1, prev + 1))}
                            className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white transform hover:scale-105 shadow-lg"
                  >
                            Next →
                  </button>
                )}
              </div>
              <button
                onClick={() => setCurrentLevel(4)}
                        className="px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mt-4"
              >
                        ← Back to Level 4
              </button>
            </div>
          ) : currentLevel === 6 ? (
            // Level 6: Inorder Traversal
            <div className="flex flex-col items-center space-y-8 my-8">
                      <h1 className="text-5xl font-extrabold text-center mb-6 bg-blue-600 bg-clip-text text-transparent drop-shadow-lg tracking-tight relative z-10 font-serif">
                        Level 6: Inorder Traversal
                      </h1>
                      <div className="bg-blue-100 p-8 rounded-2xl shadow-xl max-w-3xl text-center border-2 border-purple-200 whitespace-pre-line">
                        <h2 className="text-3xl font-bold text-pink-400 mb-6">{inorderSteps[inorderStep].title}</h2>
                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">{inorderSteps[inorderStep].explanation}</p>
                        <div className="text-orange-600 font-mono text-lg font-bold">{inorderMessage}</div>
              </div>

              {inorderSteps[inorderStep].type !== 'interactive-builder' ? (
                // Display tree for explanation steps
                        <div className="bg-blue-100 p-6 rounded-2xl shadow-xl flex flex-col items-center border-2 border-green-200">
                  {renderLargeTree(
                    inorderSteps[inorderStep].highlightNodes || [],
                    inorderSteps[inorderStep].highlightEdges || [],
                    inorderSteps[inorderStep].type
                  )}
                </div>
              ) : (
                // Interactive builder section
                        <div className="flex flex-col items-center space-y-6 w-full max-w-4xl">
                          <div className="bg-blue-100 p-6 rounded-2xl shadow-xl flex flex-col items-center w-full border-2 border-green-200">
                            <h3 className="text-2xl font-bold text-green-800 mb-4">Tree for Reference:</h3>
                    {renderLargeTree()} {/* Display the tree without specific highlights */}
                  </div>

                          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 p-6 rounded-2xl shadow-xl flex flex-wrap justify-center gap-4 w-full border-2 border-pink-200">
                            <h3 className="text-2xl font-bold text-purple-700 w-full mb-4 text-center">Available Nodes:</h3>
                    {inorderAvailableNodes.length === 0 ? (
                              <p className="text-gray-600 font-bold">No nodes left to place!</p>
                    ) : (
                      inorderAvailableNodes.map((node, index) => (
                        <motion.div
                          key={node}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleInorderNodeSelect(node, index)}
                                  className={`w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg cursor-pointer transition-all duration-300
                                    ${inorderSelectedNode === node ? 'ring-4 ring-orange-400 shadow-2xl' : 'hover:shadow-xl'}
                          `}
                        >
                          {node}
                        </motion.div>
                      ))
                    )}
                  </div>

                          <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6 rounded-2xl shadow-xl w-full border-2 border-green-200">
                            <h3 className="text-2xl font-bold text-green-700 mb-4 text-center">Inorder Array:</h3>
                            <div className="flex justify-center gap-3">
                      {userInorderArray.map((node, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleInorderPlaceNode(index)}
                                  className={`w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg cursor-pointer transition-all duration-300
                                    ${node !== null ? (inorderCorrectArray[index] === node ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-br from-red-500 to-pink-600 text-white') : 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 border-2 border-dashed border-gray-500'}
                          `}
                        >
                          {node !== null ? node : (index + 1)}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {inorderIsComplete && (
                            <div className="mt-6 p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white text-center text-2xl font-bold shadow-xl">
                      Level Complete! You successfully created the Inorder Traversal!
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setUserInorderArray(Array(7).fill(null));
                      setInorderAvailableNodes(['A', 'B', 'C', 'D', 'E', 'F', 'G'].sort(() => Math.random() - 0.5));
                      setInorderSelectedNode(null);
                      setInorderSelectedNodeIndex(null);
                      setInorderMessage('Drag and drop nodes to create the Inorder Traversal!');
                      setInorderIsComplete(false);
                    }}
                            className="px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mt-4"
                  >
                    Reset Level 6
                  </button>
                </div>
              )}

                      <div className="flex space-x-6 mt-8">
                <button
                  onClick={() => setInorderStep((prev) => Math.max(0, prev - 1))}
                  disabled={inorderStep === 0}
                          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                            inorderStep === 0 
                              ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                          }`}
                        >
                          ← Previous
                </button>
                {inorderStep === inorderSteps.length - 1 ? (
                  <button
                    onClick={() => setCurrentLevel(7)} // Go to Level 7 (Level Order Traversal)
                            className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105 shadow-lg"
                  >
                            Next: Learn Level Order Traversal →
                  </button>
                ) : (
                  <button
                    onClick={() => setInorderStep((prev) => Math.min(inorderSteps.length - 1, prev + 1))}
                            className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white transform hover:scale-105 shadow-lg"
                  >
                            Next →
                  </button>
                )}
              </div>
              <button
                onClick={() => setCurrentLevel(5)}
                        className="px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mt-4"
              >
                        ← Back to Level 5
              </button>
            </div>
          ) : currentLevel === 7 ? (
            // Level 7: Level Order Traversal
            <div className="flex flex-col items-center space-y-8 my-8">
                      <h1 className="text-5xl font-extrabold text-center mb-6 bg-blue-600 bg-clip-text text-transparent drop-shadow-lg tracking-tight relative z-10 font-serif">
                        Level 7: Level Order Traversal
                      </h1>
                      <div className="bg-blue-100 p-8 rounded-2xl shadow-xl max-w-3xl text-center border-2 border-purple-200 whitespace-pre-line">
                        <h2 className="text-3xl font-bold text-pink-400 mb-6">{levelOrderSteps[levelOrderStep].title}</h2>
                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">{levelOrderSteps[levelOrderStep].explanation}</p>
                        <div className="text-orange-600 font-mono text-lg font-bold">{levelOrderMessage}</div>
              </div>

              {levelOrderSteps[levelOrderStep].type !== 'interactive-builder' ? (
                // Display tree for explanation steps
                        <div className="bg-blue-100 p-6 rounded-2xl shadow-xl flex flex-col items-center border-2 border-green-200">
                  {renderLargeTree(
                    levelOrderSteps[levelOrderStep].highlightNodes || [],
                    levelOrderSteps[levelOrderStep].highlightEdges || [],
                    levelOrderSteps[levelOrderStep].type
                  )}
                </div>
              ) : (
                // Interactive builder section
                        <div className="flex flex-col items-center space-y-6 w-full max-w-4xl">
                          <div className="bg-blue-100 p-6 rounded-2xl shadow-xl flex flex-col items-center w-full border-2 border-green-200">
                            <h3 className="text-2xl font-bold text-green-800 mb-4">Tree for Reference:</h3>
                    {renderLargeTree()} {/* Display the tree without specific highlights */}
                  </div>

                          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 p-6 rounded-2xl shadow-xl flex flex-wrap justify-center gap-4 w-full border-2 border-pink-200">
                            <h3 className="text-2xl font-bold text-purple-700 w-full mb-4 text-center">Available Nodes:</h3>
                    {levelOrderAvailableNodes.length === 0 ? (
                              <p className="text-gray-600 font-bold">No nodes left to place!</p>
                    ) : (
                      levelOrderAvailableNodes.map((node, index) => (
                        <motion.div
                          key={node}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleLevelOrderNodeSelect(node, index)}
                                  className={`w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg cursor-pointer transition-all duration-300
                                    ${levelOrderSelectedNode === node ? 'ring-4 ring-orange-400 shadow-2xl' : 'hover:shadow-xl'}
                          `}
                        >
                          {node}
                        </motion.div>
                      ))
                    )}
                  </div>

                          <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6 rounded-2xl shadow-xl w-full border-2 border-green-200">
                            <h3 className="text-2xl font-bold text-green-700 mb-4 text-center">Level Order Array:</h3>
                            <div className="flex justify-center gap-3">
                      {userLevelOrderArray.map((node, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleLevelOrderPlaceNode(index)}
                                  className={`w-20 h-20 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg cursor-pointer transition-all duration-300
                                    ${node !== null ? (levelOrderCorrectArray[index] === node ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-br from-red-500 to-pink-600 text-white') : 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600 border-2 border-dashed border-gray-500'}
                          `}
                        >
                          {node !== null ? node : (index + 1)}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {levelOrderIsComplete && (
                            <div className="mt-6 p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white text-center text-2xl font-bold shadow-xl">
                      Level Complete! You successfully created the Level Order Traversal!
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setUserLevelOrderArray(Array(7).fill(null));
                      setLevelOrderAvailableNodes(['A', 'B', 'C', 'D', 'E', 'F', 'G'].sort(() => Math.random() - 0.5));
                      setLevelOrderSelectedNode(null);
                      setLevelOrderSelectedNodeIndex(null);
                      setLevelOrderMessage('Drag and drop nodes to create the Level Order Traversal!');
                      setLevelOrderIsComplete(false);
                    }}
                            className="px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mt-4"
                  >
                    Reset Level 7
                  </button>
                </div>
              )}

                      <div className="flex space-x-6 mt-8">
                <button
                  onClick={() => setLevelOrderStep((prev) => Math.max(0, prev - 1))}
                  disabled={levelOrderStep === 0}
                          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                            levelOrderStep === 0 
                              ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                          }`}
                        >
                          ← Previous
                </button>
                {levelOrderStep === levelOrderSteps.length - 1 ? (
                  <button
                    onClick={() => setCurrentLevel(8)} // Go to Level 8 (Zigzag Traversal)
                            className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transform hover:scale-105 shadow-lg"
                  >
                            Next: Learn Zigzag Traversal →
                  </button>
                ) : (
                  <button
                    onClick={() => setLevelOrderStep((prev) => Math.min(levelOrderSteps.length - 1, prev + 1))}
                            className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white transform hover:scale-105 shadow-lg"
                  >
                            Next →
                  </button>
                )}
              </div>
              <button
                onClick={() => setCurrentLevel(6)}
                        className="px-8 py-4 bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg mt-4"
              >
                        ← Back to Level 6
              </button>
            </div>
          ) : currentLevel === 8 ? (
            // Level 8: Zigzag Traversal
            <div className="flex flex-col items-center space-y-8 my-8">
                      <h1 className="text-5xl font-extrabold text-center mb-6 bg-blue-600 bg-clip-text text-transparent drop-shadow-lg tracking-tight relative z-10 font-serif">
                        Level 8: Zigzag Tree Traversal
                      </h1>
                      <div className="bg-blue-100 p-6 rounded-2xl shadow-xl flex flex-col items-center border-2 border-green-200">
                {renderLargeTree(
                  specialTraversalSteps[0].highlightNodes || [],
                  specialTraversalSteps[0].highlightEdges || [],
                  specialTraversalSteps[0].type,
                  currentPath
                )}
                {specialTraversalSteps[0].showZigzagLevels && renderZigzagLevels()}

                <div className="mt-4 flex flex-col items-center gap-4">
                  <button
                    onClick={isZigzagTraversing ? () => {
                      setIsZigzagTraversing(false);
                      setCurrentPath([]);
                    } : startZigzagTraversal}
                    className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                      isZigzagTraversing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'                    } text-white`}
                  >
                    {isZigzagTraversing ? 'STOP TRAVERSAL' : 'START ZIGZAG TRAVERSAL'}
                  </button>
                  {isZigzagTraversing && (
                    <div className="text-xl font-bold text-blue-400">
                      Current Level: {currentZigzagLevel} ({zigzagDirection})
                    </div>
                  )}
                </div>
                <div className="mt-4 p-4 blue-100 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-800 mb-2">Current Path:</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {currentPath.map((node, index) => (
                      <motion.div
                        key={`${node}-${index}`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold text-white ${
                          index === currentPath.length - 1 ? 'bg-yellow-500' : 'bg-blue-600'
                        }`}
                      >
                        {node}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setCurrentLevel(1)} // Loop back to Level 1
                  className="px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Back to Level 1
                </button>
                <button
                  onClick={() => setCurrentLevel(7)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg text-white mt-4"
                >
                  Back to Level 7
                </button>
                <button
                  onClick={() => setCurrentLevel(9)} // Go to Level 9 (Vertical Traversal)
                  className="px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 bg-green-600 hover:bg-green-700 text-white ml-auto"
                >
                  Next: Learn Vertical Traversal
                </button>
              </div>
            </div>
          ) : currentLevel === 9 ? (
            // Level 9: Vertical Traversal
            <div className="flex flex-col items-center space-y-8 my-8">
                      <h1 className="text-5xl font-extrabold text-center mb-6 bg-blue-600 bg-clip-text text-transparent drop-shadow-lg tracking-tight relative z-10 font-serif">
                        Level 9: Vertical Tree Traversal
                      </h1>
                      <div className="bg-blue-100 p-6 rounded-2xl shadow-xl flex flex-col items-center border-2 border-green-200">
                {renderLargeTree(
                  verticalSteps[verticalStep].highlightNodes || [],
                  verticalSteps[verticalStep].highlightEdges || [],
                  verticalSteps[verticalStep].type, // This should accurately reflect 'concept' or 'vertical-animation'
                  currentPath,
                  verticalTreeNodes, // Pass new nodes
                  verticalTreeEdges  // Pass new edges
                )}
                {/* Only render vertical columns explanation on the first step */}
                {verticalSteps[0].showVerticalColumns && verticalStep === 0 && renderVerticalColumns()}
                <h2 className="text-xl pt-4 font-bold text-pink-800 mb-4">Please click on next to see Visulizations</h2>

                <div className="flex flex-col items-center gap-4">
                  {/* Only show animation controls on the animation step */}
                  {verticalSteps[verticalStep].type === 'vertical-animation' && (
                    <>
                      <div className="mt-4 flex flex-col items-center gap-4">
                        <button
                          onClick={isVerticalTraversing ? () => {
                            setIsVerticalTraversing(false);
                            setCurrentPath([]);
                          } : startVerticalTraversal}
                          className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                            isVerticalTraversing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                          } text-white`}
                        >
                          {isVerticalTraversing ? 'STOP TRAVERSAL' : 'START VERTICAL TRAVERSAL'}
                        </button>
                        {isVerticalTraversing && (
                          <div className="text-xl font-bold text-blue-400">
                            Current Column: {currentVerticalColumn} (Top-to-Bottom)
                          </div>
                        )}
                      </div>
                      
                      {renderTraversalArray(verticalTraversalArray, 'vertical')}
                    </>
                  )}
                </div>

                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => setVerticalStep((prev) => Math.max(0, prev - 1))}
                    disabled={verticalStep === 0 || isVerticalTraversing}
                    className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                      verticalStep === 0 || isVerticalTraversing
                        ? 'bg-gray-600 text-gray-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Previous
                  </button>
                  {verticalStep === verticalSteps.length - 1 ? (
                    <button
                      onClick={() => setCurrentLevel(1)} // Loop back to Level 1
                      className="px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Back to Level 1
                    </button>
                  ) : (
                    <button
                      onClick={() => setVerticalStep((prev) => Math.min(verticalSteps.length - 1, prev + 1))} // Updated to verticalStep
                      disabled={isVerticalTraversing}
                      className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                        isVerticalTraversing
                          ? 'bg-gray-600 text-gray-300'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      Next
                    </button>
                  )}
                  <button
                    onClick={() => setCurrentLevel(8)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg text-white mt-4"
                  >
                    Back to Level 8
                  </button>
                  <button
                    onClick={() => setCurrentLevel(10)} // Go to Level 10 (Tree Views)
                    className="px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 bg-green-600 hover:bg-green-700 text-white ml-auto"
                  >
                    Next: Learn Tree Views
                  </button>
                </div>
              </div>
            </div>
          ) : currentLevel === 10 ? (
            // Level 10: Tree Views
            <div className="flex flex-col items-center space-y-8 my-8">
                      <h1 className="text-5xl font-extrabold text-center mb-6 bg-blue-600 bg-clip-text text-transparent drop-shadow-lg tracking-tight relative z-10 font-serif">
                        Level 10: Tree Views
                      </h1>
                      <div className="bg-blue-100 p-6 rounded-2xl shadow-xl flex flex-col items-center border-2 border-green-200">
                {renderLargeTree(
                  treeViewsSteps[treeViewsStep].type === 'animation-top-view'
                    ? highlightedTopViewNodes
                    : treeViewsSteps[treeViewsStep].highlightNodes || [],
                  treeViewsSteps[treeViewsStep].highlightEdges || [],
                  treeViewsSteps[treeViewsStep].type,
                  currentPath
                )}

                {treeViewsSteps[treeViewsStep].type === 'animation-top-view' && (
                  <div className="mt-4 flex flex-col items-center gap-4">
                    <button
                      onClick={isTopViewTraversing ? () => {
                        setIsTopViewTraversing(false);
                        setCurrentPath([]);
                        setHighlightedTopViewNodes([]); // Clear highlights on stop
                      } : startTopViewTraversal}
                      className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                        isTopViewTraversing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                      } text-white`}
                    >
                      {isTopViewTraversing ? 'STOP TRAVERSAL' : 'START TOP VIEW TRAVERSAL'}
                    </button>
                    {isTopViewTraversing && (
                      <div className="text-xl font-bold text-blue-400">
                        Top View:
                      </div>
                    )}
                    {renderTraversalArray(topViewArray, 'top-view')}
                  </div>
                )}

                {treeViewsSteps[treeViewsStep].type === 'animation-bottom-view' && (
                  <div className="mt-4 flex flex-col items-center gap-4">
                    <button
                      onClick={isBottomViewTraversing ? () => {
                        setIsBottomViewTraversing(false);
                        setCurrentPath([]);
                        setHighlightedBottomViewNodes([]); // Clear highlights on stop
                      } : startBottomViewTraversal}
                      className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                        isBottomViewTraversing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                      } text-white`}
                    >
                      {isBottomViewTraversing ? 'STOP TRAVERSAL' : 'START BOTTOM VIEW TRAVERSAL'}
                    </button>
                    {isBottomViewTraversing && (
                      <div className="text-xl font-bold text-blue-400">
                        Bottom View:
                      </div>
                    )}
                    {renderTraversalArray(bottomViewArray, 'bottom-view')}
                  </div>
                )}
                {treeViewsSteps[treeViewsStep].type === 'animation-left-view' && (
                  <div className="mt-4 flex flex-col items-center gap-4">
                    <button
                      onClick={isLeftViewTraversing ? () => {
                        setIsLeftViewTraversing(false);
                        setCurrentPath([]);
                      } : startLeftViewTraversal}
                      className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                        isLeftViewTraversing ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                      } text-white`}
                    >
                      {isLeftViewTraversing ? 'STOP TRAVERSAL' : 'START LEFT VIEW TRAVERSAL'}
                    </button>
                    {isLeftViewTraversing && (
                      <div className="text-xl font-bold text-blue-400">
                        Left View:
                      </div>
                    )}
                    {renderTraversalArray(leftViewArray, 'left-view')}
                  </div>
                )}
                {treeViewsSteps[treeViewsStep].type === 'animation-right-view' && (
                  <div className="mt-4 flex flex-col items-center gap-4">
                    {/* <button
                      onClick={startRightViewTraversal} // Always start Right View calculation
                      className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 bg-green-600 hover:bg-green-700 text-white`}
                    >
                      GET RIGHT VIEW
                    </button> */}
                    {/* Always show the input and feedback after the calculation */}
                    <h2 className="px-4 py-2 text-pink-800 text-xl font-medium">Please Submit right answer for complete this level : </h2>
                    <div className="flex flex-col items-center gap-2">
                      <input
                        type="text"
                        className="w-64 p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                        placeholder="Enter Right View (e.g., A B D)"
                        value={userRightViewInput}
                        onChange={(e) => setUserRightViewInput(e.target.value)}
                      />
                      <button
                        onClick={checkRightViewAnswer}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold"
                        disabled={isRightViewInputCorrect}
                      >
                        Check Answer
                      </button>
                      {rightViewFeedbackMessage && (
                        <p className={`text-lg font-bold ${isRightViewInputCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          {rightViewFeedbackMessage}
                        </p>
                      )}
                    </div>
                  </div>
                )}


                {(isTopViewTraversing || isBottomViewTraversing || isLeftViewTraversing || isRightViewTraversing) && (
                  <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                    <h3 className="text-xl font-bold text-blue-400 mb-2">Current Path:</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {currentPath.map((node, index) => (
                        <motion.div
                          key={`${node}-${index}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold text-white ${
                            index === currentPath.length - 1 ? 'bg-yellow-500' : 'bg-blue-600'
                          }`}
                        >
                          {node}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setTreeViewsStep((prev) => Math.max(0, prev - 1))}
                  disabled={treeViewsStep === 0 || isTopViewTraversing || isBottomViewTraversing || isLeftViewTraversing || isRightViewTraversing}
                  className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                    treeViewsStep === 0 || isTopViewTraversing || isBottomViewTraversing || isLeftViewTraversing || isRightViewTraversing
                      ? 'bg-gray-600 text-gray-300'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Previous
                </button>
                {treeViewsStep === treeViewsSteps.length - 1 ? (
                  <button
                    onClick={() => setCurrentLevel(1)} // Loop back to Level 1
                    className="px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Back to Level 1
                  </button>
                ) : (
                  <button
                    onClick={() => setTreeViewsStep((prev) => Math.min(treeViewsSteps.length - 1, prev + 1))} // Updated to treeViewsStep
                    disabled={isTopViewTraversing || isBottomViewTraversing || isLeftViewTraversing || isRightViewTraversing}
                    className={`px-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                      isTopViewTraversing || isBottomViewTraversing || isLeftViewTraversing || isRightViewTraversing
                        ? 'bg-gray-600 text-gray-300'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    Next
                  </button>
                )}
              </div>
              <button
                onClick={() => setCurrentLevel(9)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg text-white mt-4"
              >
                Back to Level 9
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
          </div>  
      </div> // Close card-like main container
      )}
    </div>
  );
};

// Helper for saving progress for this game
const saveProgress = async (level) => {
  try {
    await gameProgressService.saveProgress(TREE_TOPIC_ID, level, 10, 0); // Adjust score/time as needed
    
    // Update local state immediately
    setCompletedLevels(prev => {
      const newState = new Set([...prev, level]);
      console.log('Updated completed levels:', Array.from(newState));
      return newState;
    });
    
    console.log(`Successfully saved progress for level ${level}`);
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
};

export default TreeGame;
