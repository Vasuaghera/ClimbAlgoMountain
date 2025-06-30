import React, { useState, useEffect, useRef, useCallback } from 'react';

import { gameProgressService } from '../../services/gameProgressService';
import { useAuth } from '../../contexts/AuthContext';
import GameDecorations from './GameDecorations';

// Helper throttle function
const throttle = (func, delay) => {
  let inThrottle;
  return function() {
    const context = this;
    const args = arguments;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), delay);
    }
  };
};

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const GraphGame = () => {
  const { user } = useAuth();
  // const [user, setUser] = useState(null);
  // Define level data
  const levelData = {
    1: {
      nodes: [
        { id: 'A', x: 200, y: 200, name: 'Node A' },
        { id: 'B', x: 550, y: 300, name: 'Node B' },
        { id: 'C', x: 400, y: 150, name: 'Node C' },
        { id: 'D', x: 150, y: 350, name: 'Node D' },
        { id: 'E', x: 300, y: 350, name: 'Node E' },
        { id: 'F', x: 650, y: 150, name: 'Node F' },
        { id: 'G', x: 600, y: 400, name: 'Node G' },
      ],
      edges: [
        { source: 'A', target: 'D' },
        { source: 'A', target: 'E' },
        { source: 'A', target: 'C' },
        { source: 'C', target: 'E' },
        { source: 'C', target: 'B' },
        { source: 'C', target: 'F' },
        { source: 'C', target: 'G' },
        { source: 'B', target: 'F' },
      ],
      instructions: "Welcome to Level 1! This graph shows a classic example of a tree-like structure, but it's a general graph! Please read both concept cards to complete this level.",
      conceptExplanations: {
        nodes: {
          title: "Nodes (Vertices)",
          description: "These are the points in our graph, labeled A through G. Each node represents an entity. Try dragging them to see how the graph structure changes!",
          examples: [
            "In a family tree, nodes are family members",
            "In a website, nodes are web pages",
            "In a delivery network, nodes are locations"
          ]
        },
        edges: {
          title: "Edges (Connections)",
          description: "These are the lines connecting the nodes. They show relationships between different entities in the graph. Notice how some nodes have more connections than others!",
          examples: [
            "In a family tree, edges are relationships (e.g., parent-child)",
            "In a website, edges are hyperlinks",
            "In a delivery network, edges are routes"
          ]
        }
      },
      levelCompleteConditions: (nodesVisited, edgesVisited) => nodesVisited && edgesVisited,
      completionMessage: "Congratulations! You have successfully completed Level 1: Basic Graph Concepts. Click 'Next Level' to proceed!"
    },
    2: {
      nodes: [
        { id: '1', x: 200, y: 200, name: 'Node 1' },
        { id: '2', x: 400, y: 200, name: 'Node 2' },
        { id: '3', x: 600, y: 200, name: 'Node 3' },
        { id: '4', x: 300, y: 400, name: 'Node 4' },
        { id: '5', x: 500, y: 400, name: 'Node 5' },
      ],
      directedEdges: [
        { source: '1', target: '2', type: 'directed' },
        { source: '2', target: '3', type: 'directed' },
        { source: '1', target: '4', type: 'directed' },
        { source: '4', target: '2', type: 'directed' },
        { source: '2', target: '5', type: 'directed' },
        { source: '5', target: '3', type: 'directed' },
        { source: '4', target: '5', type: 'directed' },
      ],
      undirectedEdges: [
        { source: '1', target: '2', type: 'undirected' },
        { source: '2', target: '3', type: 'undirected' },
        { source: '1', target: '4', type: 'undirected' },
        { source: '4', target: '2', type: 'undirected' },
        { source: '2', target: '5', type: 'undirected' },
        { source: '5', target: '3', type: 'undirected' },
        { source: '4', target: '5', type: 'undirected' },
      ],
      instructions: "Welcome to Level 2! In this level, you'll learn about Directed and Undirected Graphs. Click on the concept cards below to explore each type.",
      conceptExplanations: {
        directed: {
          title: "Directed Graphs (Digraphs)",
          description: "In a directed graph, edges have a specific direction, indicated by arrows. This means the relationship flows only one way. Think of one-way streets!",
          examples: [
            "Road networks with one-way streets",
            "Website links (you can click from page A to B, but not necessarily B to A)",
            "Task dependencies in a project (Task A must be completed before Task B)"
          ]
        },
        undirected: {
          title: "Undirected Graphs",
          description: "In an undirected graph, edges have no direction. The relationship is mutual, meaning if A is connected to B, then B is also connected to A. Think of two-way streets!",
          examples: [
            "Social networks (friendships are usually mutual)",
            "Road networks with two-way streets",
            "Collaborations between researchers"
          ]
        }
      },
      levelCompleteConditions: (directedVisited, undirectedVisited) => directedVisited && undirectedVisited,
      completionMessage: "Excellent! You've mastered the concepts of Directed and Undirected Graphs. Proceed to the next challenge!"
    },
    3: {
      nodes: [
        { id: 'A', x: 200, y: 200, name: 'Node A' },
        { id: 'B', x: 400, y: 200, name: 'Node B' },
        { id: 'C', x: 300, y: 400, name: 'Node C' },
      ],
      undirectedGraphEdges: [
        { source: 'A', target: 'B', type: 'undirected' },
        { source: 'A', target: 'C', type: 'undirected' },
        { source: 'B', target: 'C', type: 'undirected' },
      ],
      directedGraphEdges: [
        { source: 'A', target: 'B', type: 'directed' },
        { source: 'B', target: 'C', type: 'directed' },
        { source: 'C', target: 'A', type: 'directed' },
      ],
      undirectedAdjacencyMatrix: [
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0],
      ],
      directedAdjacencyMatrix: [
        [0, 1, 0],
        [0, 0, 1],
        [1, 0, 0],
      ],
      instructions: "Welcome to Level 3! Explore Adjacency Lists and Matrices for both Directed and Undirected Graphs. Click the cards to visualize!",
      conceptExplanations: {
        undirectedAdjList: {
          title: "Undirected Adjacency List",
          description: "For an undirected graph, the adjacency list shows all direct neighbors in both directions. If A is connected to B, then B is also connected to A. This creates a symmetric relationship where each edge appears twice in the list.",
          examples: [
            "A: [B, C] (A connects to both B and C)",
            "B: [A, C] (B connects to both A and C)",
            "C: [A, B] (C connects to both A and B)",
            "Note: Each connection appears twice because edges are bidirectional"
          ]
        },
        directedAdjList: {
          title: "Directed Adjacency List",
          description: "For a directed graph, the adjacency list only shows outgoing connections (where the arrows point to). If A→B exists, A's list includes B, but B's list does not include A unless there's a separate B→A edge.",
          examples: [
            "A: [B] (A points to B)",
            "B: [C] (B points to C)",
            "C: [A] (C points to A)",
            "Note: Each connection appears only once because edges are one-way"
          ]
        },
        undirectedAdjMatrix: {
          title: "Undirected Adjacency Matrix",
          description: "A symmetric matrix where matrix[i][j] = matrix[j][i] = 1 if nodes i and j are connected. For undirected graphs, the matrix is always symmetric because if A connects to B, then B connects to A.",
          examples: [
            "  A B C",
            "A 0 1 1  (A connects to B and C)",
            "B 1 0 1  (B connects to A and C)",
            "C 1 1 0  (C connects to A and B)",
            "Note: The matrix is symmetric (mirrored across the diagonal)"
          ]
        },
        directedAdjMatrix: {
          title: "Directed Adjacency Matrix",
          description: "A matrix where matrix[i][j] = 1 if there's an edge from node i to node j. For directed graphs, the matrix is not symmetric because A→B does not imply B→A.",
          examples: [
            "  A B C",
            "A 0 1 0  (A points to B)",
            "B 0 0 1  (B points to C)",
            "C 1 0 0  (C points to A)",
            "Note: The matrix is not symmetric because edges are one-way"
          ]
        }
      },
      levelCompleteConditions: (undirectedAdjListVisited, directedAdjListVisited, undirectedAdjMatrixVisited, directedAdjMatrixVisited) => 
        undirectedAdjListVisited && directedAdjListVisited && undirectedAdjMatrixVisited && directedAdjMatrixVisited,
      completionMessage: "Fantastic! You've grasped how to represent graphs using Adjacency Lists and Matrices for both directed and undirected graphs!"
    },
    4: {
      nodes: [
        { id: 'A', x: 200, y: 200, name: 'Node A' },
        { id: 'B', x: 400, y: 200, name: 'Node B' },
        { id: 'C', x: 300, y: 400, name: 'Node C' },
        { id: 'D', x: 500, y: 400, name: 'Node D' },
        { id: 'E', x: 300, y: 100, name: 'Node E' },
      ],
      edges: [
        { source: 'A', target: 'B', type: 'undirected' },
        { source: 'A', target: 'C', type: 'undirected' },
        { source: 'B', target: 'D', type: 'undirected' },
        { source: 'C', target: 'D', type: 'undirected' },
        { source: 'A', target: 'E', type: 'undirected' },
      ],
      instructions: "Welcome to Level 4! Let's learn about graph traversal algorithms. Click on BFS or DFS to see how they work step by step!",
      conceptExplanations: {
        bfs: {
          title: "Breadth-First Search (BFS)",
          description: "BFS is like exploring a maze by checking all paths at your current level before going deeper. It's like searching for a friend in a building - you check each room on your current floor before going to the next floor.",
          examples: [
            "Real-world example: Finding the shortest path in a maze",
            "How it works:",
            "1. Start at a node (like entering a room)",
            "2. Add all its neighbors to a queue (like noting down adjacent rooms)",
            "3. Visit each neighbor in order (like checking each room)",
            "4. For each neighbor, add their unvisited neighbors to the queue",
            "5. Continue until all nodes are visited"
          ]
        },
        dfs: {
          title: "Depth-First Search (DFS)",
          description: "DFS is like exploring a maze by following one path as far as possible before backtracking. It's like solving a maze by always taking the right turn until you hit a dead end, then going back to try another path.",
          examples: [
            "Real-world example: Solving a maze or exploring a cave system",
            "How it works:",
            "1. Start at a node (like entering a path)",
            "2. Choose one neighbor and go as deep as possible (like following a path)",
            "3. When you can't go further, backtrack (like hitting a dead end)",
            "4. Try another path from the last decision point",
            "5. Continue until all nodes are visited"
          ]
        }
      },
      levelCompleteConditions: (bfsVisited, dfsVisited) => bfsVisited && dfsVisited,
      completionMessage: "Excellent! You've mastered both BFS and DFS traversal algorithms! You now understand how to systematically explore graphs in different ways."
    },
    5: {
      nodes: [
        { id: 'A', x: 200, y: 200, name: 'Node A' },
        { id: 'B', x: 400, y: 200, name: 'Node B' },
        { id: 'C', x: 300, y: 400, name: 'Node C' },
        { id: 'D', x: 500, y: 400, name: 'Node D' },
      ],
      undirectedCycleEdges: [
        { source: 'A', target: 'B', type: 'undirected' },
        { source: 'B', target: 'C', type: 'undirected' },
        { source: 'C', target: 'A', type: 'undirected' },
        { source: 'B', target: 'D', type: 'undirected' },
      ],
      directedCycleEdges: [
        { source: 'A', target: 'B', type: 'directed' },
        { source: 'B', target: 'C', type: 'directed' },
        { source: 'C', target: 'A', type: 'directed' },
        { source: 'B', target: 'D', type: 'directed' },
      ],
      instructions: "Welcome to Level 5! Let's learn about cycle detection in graphs. Click on the concept cards to explore cycles in both undirected and directed graphs!",
      conceptExplanations: {
        undirectedCycle: {
          title: "Cycle Detection in Undirected Graphs",
          description: "In an undirected graph, a cycle exists if you can start at a node and return to it without using the same edge twice. We use DFS with a parent node to detect cycles.",
          examples: [
            "Real-world example: Detecting circular dependencies in a network",
            "How it works:",
            "1. Use DFS to explore the graph",
            "2. Keep track of visited nodes",
            "3. If we find a neighbor that's visited and not our parent, we found a cycle!",
            "4. The cycle A-B-C-A is highlighted in red"
          ]
        },
        directedCycle: {
          title: "Cycle Detection in Directed Graphs",
          description: "In a directed graph, a cycle exists if you can follow the arrows and return to your starting point. We use DFS with a recursion stack to detect cycles.",
          examples: [
            "Real-world example: Detecting deadlocks in a system",
            "How it works:",
            "1. Use DFS to explore the graph",
            "2. Keep track of nodes in current recursion stack",
            "3. If we find a node that's in our stack, we found a cycle!",
            "4. The cycle A→B→C→A is highlighted in red"
          ]
        }
      },
      levelCompleteConditions: (undirectedCycleVisited, directedCycleVisited) => undirectedCycleVisited && directedCycleVisited,
      completionMessage: "Excellent! You've mastered cycle detection in both undirected and directed graphs! You now understand how to identify circular paths in different types of graphs."
    },
    6: {
      nodes: [
        { id: 'A', x: 200, y: 100 },
        { id: 'B', x: 400, y: 100 },
        { id: 'C', x: 600, y: 100 },
        { id: 'D', x: 300, y: 250 },
        { id: 'E', x: 500, y: 250 },
        { id: 'F', x: 400, y: 400 },
      ],
      edges: [
        { source: 'A', target: 'D', type: 'directed' },
        { source: 'B', target: 'D', type: 'directed' },
        { source: 'B', target: 'E', type: 'directed' },
        { source: 'C', target: 'E', type: 'directed' },
        { source: 'D', target: 'F', type: 'directed' },
        { source: 'E', target: 'F', type: 'directed' },
      ],
      instructions: "Level 6: Master Topological Sort! Arrange the nodes in a valid order, understanding in-degrees and dependencies.",
      conceptExplanations: {
        inDegree: {
          title: "In-Degree",
          description: "The in-degree of a node is the number of directed edges pointing to it. Nodes with an in-degree of 0 have no prerequisites and can be placed first in the topological order."
        },
        introToposort: {
          title: "Topological Sort (Kahn's Algorithm)",
          description: "A topological sort creates a linear ordering of nodes where, for every directed edge (u → v), node u appears before node v. This visualization demonstrates Kahn's algorithm, which uses in-degrees and a queue to find one such order. If a cycle exists, topological sort is impossible."
        }
      },
      levelCompleteConditions: (inDegreeVisited, introToposortVisited) => inDegreeVisited && introToposortVisited,
      completionMessage: "Fantastic! You've mastered the introduction to Topological Sort and In-Degrees!"
    },
    7: {
      nodes: [
        { id: 'A', x: 100, y: 100 },
        { id: 'B', x: 300, y: 100 },
        { id: 'C', x: 500, y: 100 },
        { id: 'D', x: 200, y: 250 },
        { id: 'E', x: 400, y: 250 },
        { id: 'F', x: 300, y: 400 }
      ],
      edges: [
        { source: 'A', target: 'B', weight: 4, type: 'directed' },
        { source: 'A', target: 'D', weight: 2, type: 'directed' },
        { source: 'B', target: 'C', weight: 3, type: 'directed' },
        { source: 'B', target: 'D', weight: 1, type: 'directed' },
        { source: 'C', target: 'E', weight: 2, type: 'directed' },
        { source: 'D', target: 'E', weight: 3, type: 'directed' },
        { source: 'E', target: 'F', weight: 2, type: 'directed' }
      ],
      instructions: 'Learn about shortest path algorithms and Dijkstra\'s Algorithm for finding the shortest path between nodes in a weighted graph.',
      conceptExplanations: {
        shortestPath: {
          title: 'Shortest Path Problem',
          description: 'The shortest path problem involves finding a path between two vertices in a graph such that the sum of the weights of its constituent edges is minimized. For example, finding the quickest route on a map or the cheapest way to send data over a network.',
          examples: [
            'Real-world example: GPS navigation finding the fastest route.',
            'How it works:',
            '1. Identify a start node and an end node.',
            '2. Explore all possible paths between them.',
            '3. Calculate the total weight (cost) of each path.',
            '4. Select the path with the minimum total weight.'
          ]
        },
        dijkstra: {
          title: 'Dijkstra\'s Algorithm',
          description: 'Dijkstra\'s Algorithm is a greedy algorithm that finds the shortest path from a source node to all other nodes in a weighted graph. It maintains a set of unvisited nodes and updates their distances based on the shortest path found so far.'
        }
      },
      levelCompleteConditions: (shortestPathVisited, dijkstraVisited) => shortestPathVisited && dijkstraVisited,
      shortestPathExample: { startNode: 'A', endNode: 'F', path: ['A', 'D', 'E', 'F'] }
    },
    8: {
      nodes: [
        { id: '0', x: 100, y: 100 },
        { id: '1', x: 300, y: 100 },
        { id: '2', x: 200, y: 200 },
        { id: '3', x: 400, y: 200 },
        { id: '4', x: 300, y: 300 },
        { id: '5', x: 500, y: 300 },
        { id: '6', x: 200, y: 400 }
      ],
      edges: [
        { source: '0', target: '1', weight: 4, type: 'undirected' },
        { source: '0', target: '2', weight: 3, type: 'undirected' },
        { source: '1', target: '2', weight: 1, type: 'undirected' },
        { source: '1', target: '3', weight: 2, type: 'undirected' },
        { source: '2', target: '3', weight: 4, type: 'undirected' },
        { source: '2', target: '4', weight: 5, type: 'undirected' },
        { source: '3', target: '4', weight: 2, type: 'undirected' },
        { source: '3', target: '5', weight: 3, type: 'undirected' },
        { source: '4', target: '5', weight: 4, type: 'undirected' },
        { source: '4', target: '6', weight: 6, type: 'undirected' },
        { source: '5', target: '6', weight: 2, type: 'undirected' }
      ],
      instructions: "Welcome to Level 8! Let's learn about Minimum Spanning Trees (MST). Click on 'Minimum Spanning Tree' to see the visualization.",
      conceptExplanations: {
        mst: {
          title: "Minimum Spanning Tree (MST)",
          content: `A Minimum Spanning Tree (MST) is a subset of edges that connects all vertices in a graph with the minimum possible total edge weight.\n\nKey Properties of MST:\n1. Connects all vertices (nodes)\n2. Contains no cycles\n3. Has minimum total weight\n4. Has exactly (n-1) edges for n vertices\n\nExample 1: Simple MST\n- Start with a small graph (3 nodes)\n- Add edges in order of increasing weight\n- Skip edges that would create cycles\n- Final MST will have 2 edges (3-1 edges)\n\nExample 2: Complex MST (Current Graph)\n- 7 nodes with 11 edges\n- Multiple possible paths between nodes\n- Some edges will be skipped to avoid cycles\n- Final MST will have 6 edges (7-1 edges)\n\nExample 3: MST Applications\n- Network design (minimum cost to connect all locations)\n- Cluster analysis\n- Image segmentation\n- Circuit design\n\nClick 'Start MST Visualization' to see the MST construction!`
        }
      },
      levelCompleteConditions: (state) => {
        return state.mstConceptVisited;
      }
    },
    9: {
      nodes: [
        { id: '1', x: 100, y: 100 },
        { id: '2', x: 250, y: 100 },
        { id: '3', x: 400, y: 100 },
        { id: '4', x: 550, y: 100 },
        { id: '5', x: 200, y: 500 },
        { id: '6', x: 350, y: 500 },
        { id: '7', x: 500, y: 500 },
      ],
      edges: [
        { source: '1', target: '2' },
        { source: '2', target: '3' },
        { source: '3', target: '4' },
        { source: '5', target: '6' },
        { source: '6', target: '7' },
      ],
      instructions: "Level 9: Disjoint Set Union (Union-Find)! Try Find and Union operations to group all nodes into a single set. The level is complete when all nodes are in one group.",
      conceptExplanations: {
        dsu: {
          title: "Disjoint Set Union (Union-Find)",
          description: "This is a data structure that helps group things together. Find: Tells you which group an item belongs to. Union: Joins two groups into one.",
          examples: [
            "Find(A): returns the group leader for A",
            "Union(A, B): merges the groups containing A and B",
            "Applications: Kruskal's MST, cycle detection, network connectivity"
          ]
        }
      },
      levelCompleteConditions: (state) => {
        // All nodes are in the same set if all have the same root
        const parent = state.dsuState?.parent || {};
        const nodeIds = Object.keys(parent);
        if (nodeIds.length === 0) return false;
        const root = parent[nodeIds[0]];
        return nodeIds.every(id => parent[id] === root);
      },
      completionMessage: "Congratulations! All nodes are now in the same set. You've mastered DSU!"
    },
    10: {
      nodes: [
        { id: 'A', x: 200, y: 100 },
        { id: 'B', x: 400, y: 100 },
        { id: 'C', x: 300, y: 200 },
        { id: 'D', x: 200, y: 300 },
        { id: 'E', x: 400, y: 300 },
        { id: 'F', x: 300, y: 400 },
      ],
      edges: [
        { source: 'A', target: 'B', weight: 4, type: 'undirected' },
        { source: 'A', target: 'C', weight: 2, type: 'undirected' },
        { source: 'B', target: 'C', weight: 1, type: 'undirected' },
        { source: 'B', target: 'E', weight: 3, type: 'undirected' },
        { source: 'C', target: 'D', weight: 5, type: 'undirected' },
        { source: 'C', target: 'E', weight: 2, type: 'undirected' },
        { source: 'D', target: 'F', weight: 4, type: 'undirected' },
        { source: 'E', target: 'F', weight: 3, type: 'undirected' },
      ],
      instructions: "Level 10: Understanding Minimum Spanning Tree Algorithms - Prim's and Kruskal's",
      conceptExplanations: {
        prims: {
          title: "Prim's Algorithm",
          description: "Prim's algorithm is a greedy algorithm that finds a minimum spanning tree for a connected weighted graph. It builds the MST by growing it one vertex at a time.",
          examples: [
            "Key Steps:",
            "1. Start with any vertex (e.g., A)",
            "2. Find the minimum weight edge that connects a vertex in the tree to a vertex outside the tree",
            "3. Add that vertex and edge to the MST",
            "4. Repeat until all vertices are included",
            "",
            "Time Complexity: O(E log V) using a priority queue",
            "Space Complexity: O(V)",
            "",
            "Advantages:",
            "- Works well with dense graphs",
            "- Always produces a connected tree",
            "- Can start from any vertex",
            "",
            "Real-world Applications:",
            "- Network design (connecting cities with minimum cost)",
            "- Cluster analysis",
            "- Image segmentation",
            "- Circuit design"
          ]
        },
        kruskals: {
          title: "Kruskal's Algorithm",
          description: "Kruskal's algorithm is another greedy algorithm that finds a minimum spanning tree. It builds the MST by adding edges in order of increasing weight, skipping any edge that would create a cycle.",
          examples: [
            "Key Steps:",
            "1. Sort all edges by weight",
            "2. Start with an empty MST",
            "3. Add the next smallest edge if it doesn't create a cycle",
            "4. Repeat until we have V-1 edges",
            "",
            "Time Complexity: O(E log E) for sorting edges",
            "Space Complexity: O(V + E)",
            "",
            "Advantages:",
            "- Works well with sparse graphs",
            "- Can process edges in parallel",
            "- Uses Disjoint Set Union (DSU) for efficient cycle detection",
            "",
            "Real-world Applications:",
            "- Network design (connecting computers in a network)",
            "- Cluster analysis",
            "- Image segmentation",
            "- Circuit design",
            "",
            "Note: Both Prim's and Kruskal's algorithms will find the same minimum spanning tree, but they use different approaches to get there."
          ]
        }
      },
      levelCompleteConditions: (state) => {
        return state.primsConceptVisited && state.kruskalsConceptVisited;
      },
      completionMessage: "Excellent! You've learned about both Prim's and Kruskal's algorithms for finding Minimum Spanning Trees!"
    }
  };

  const [currentLevel, setCurrentLevel] = useState(1);
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [nodesConceptVisited, setNodesConceptVisited] = useState(true); // Set to true initially
  const [edgesConceptVisited, setEdgesConceptVisited] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [visualizationStep, setVisualizationStep] = useState(-1);
  const [traversalOrder, setTraversalOrder] = useState([]);
  const [currentQueue, setCurrentQueue] = useState([]);
  const [currentStack, setCurrentStack] = useState([]);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [edgesBeingProcessed, setEdgesBeingProcessed] = useState(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [inDegreeVisualizationNode, setInDegreeVisualizationNode] = useState(null);
  const [inDegreeVisualizationStep, setInDegreeVisualizationStep] = useState(0);
  const [currentInDegreesDisplay, setCurrentInDegreesDisplay] = useState({});
  const [draggedNode, setDraggedNode] = useState(null);
  const [shortestPathConceptVisited, setShortestPathConceptVisited] = useState(false);
  const [dijkstraConceptVisited, setDijkstraConceptVisited] = useState(false);
  const [directedConceptVisited, setDirectedConceptVisited] = useState(false);
  const [undirectedConceptVisited, setUndirectedConceptVisited] = useState(false);
  const [undirectedAdjListConceptVisited, setUndirectedAdjListConceptVisited] = useState(true); // Set to true initially for Level 3
  const [directedAdjListConceptVisited, setDirectedAdjListConceptVisited] = useState(false);
  const [undirectedAdjMatrixConceptVisited, setUndirectedAdjMatrixConceptVisited] = useState(false);
  const [directedAdjMatrixConceptVisited, setDirectedAdjMatrixConceptVisited] = useState(false);
  const [bfsConceptVisited, setBfsConceptVisited] = useState(false);
  const [dfsConceptVisited, setDfsConceptVisited] = useState(false);
  const [undirectedCycleConceptVisited, setUndirectedCycleConceptVisited] = useState(false);
  const [directedCycleConceptVisited, setDirectedCycleConceptVisited] = useState(false);
  const [inDegreeConceptVisited, setInDegreeConceptVisited] = useState(false);
  const [introToposortConceptVisited, setIntroToposortConceptVisited] = useState(false);
  const [mstConceptVisited, setMstConceptVisited] = useState(false);
  const [currentDistances, setCurrentDistances] = useState({}); // New state for Dijkstra's visualization
  const [currentPrevious, setCurrentPrevious] = useState({});   // New state for Dijkstra's visualization
  const [currentProcessingNode, setCurrentProcessingNode] = useState(null); // New state to highlight the node currently being processed
  const [isDijkstraVisualizationRunning, setIsDijkstraVisualizationRunning] = useState(false); // New state variable
  const [allDijkstraSteps, setAllDijkstraSteps] = useState([]); // Add back the allDijkstraSteps state
  const [cycleDetectionInUndrectgraphcompleted , setcycleDetectionInUndrectgraphcompleted] = useState(true);
  const [cycleDetectionIndrectgraphcompleted , setcycleDetectiondrectgraphcompleted] = useState(false);
  const [inDegreeCompleted , setinDegreeCompleted] = useState(true);
  const [topologicalSortCompleted , settopologicalSortCompleted] = useState(false);
  const [sortestPathCompleted , setsortestPathCompleted] = useState(true);
  const [dijkstraCompleted , setdijkstraCompleted] = useState(false);
  const [mstCompleted , setmstCompleted] = useState(false);
  const [dsuCompleted , setdsuCompleted] = useState(false);
  const [primsCompleted , setprimsCompleted] = useState(true);
  const [kruskalsCompleted , setkruskalsCompleted] = useState(false);
  const [levelObjectiveMet, setLevelObjectiveMet] = useState(false);
  const [completedLevels, setCompletedLevels] = useState(new Set());

  const svgRef = useRef(null);
  const visualizationTimeoutRef = useRef(null); // Ref to hold the timeout ID

  // New state for Level 4 traversal visualization
  const [cycleNodes, setCycleNodes] = useState(new Set());
  const [cycleEdges, setCycleEdges] = useState(new Set());

  // Add state variables for Level 7
  const [currentShortestPathConceptVisited, setCurrentShortestPathConceptVisited] = useState(false);
  const [currentDijkstraConceptVisited, setCurrentDijkstraConceptVisited] = useState(false);

  const [bellmanFordSteps, setBellmanFordSteps] = useState([]);
  const [floydWarshallSteps, setFloydWarshallSteps] = useState([]);
  const [currentBellmanFordStep, setCurrentBellmanFordStep] = useState(0);
  const [currentFloydWarshallStep, setCurrentFloydWarshallStep] = useState(0);
  const [distanceMatrix, setDistanceMatrix] = useState([]);
  const [hasNegativeCycle, setHasNegativeCycle] = useState(false);

  // Add state for manual step control
  const [bellmanFordStepIndex, setBellmanFordStepIndex] = useState(0);
  const [bellmanFordManualMode, setBellmanFordManualMode] = useState(false);

  const [currentSpanningTreeWeight, setCurrentSpanningTreeWeight] = useState(null);
  const [allSpanningTrees, setAllSpanningTrees] = useState([]);
  const [currentSpanningTreeIndex, setCurrentSpanningTreeIndex] = useState(0);
  const [minSpanningTreeIndices, setMinSpanningTreeIndices] = useState([]);

  const [islandColors, setIslandColors] = useState({});
  const [bridgeAnimations, setBridgeAnimations] = useState({});
  const [selectedIslands, setSelectedIslands] = useState([]);
  const [gameProgress, setGameProgress] = useState({ bridgesBuilt: 0, groupsRemaining: 0 });

  const [currentSize, setCurrentSize] = useState({});

  const [mergeMessage, setMergeMessage] = useState("");

  // Add MST visualization state
  const [mstEdges, setMstEdges] = useState([]);
  const [mstWeight, setMstWeight] = useState(0);
  const [mstStep, setMstStep] = useState(0);
  const [mstExplanation, setMstExplanation] = useState('');

  const [dsuConceptVisited, setDsuConceptVisited] = useState(false);
  const [dsuOperation, setDsuOperation] = useState('');
  const [dsuOperationNodes, setDsuOperationNodes] = useState([]);
  const [dsuExplanation, setDsuExplanation] = useState('');

  const [showAllMSTs, setShowAllMSTs] = useState(false);
  const [allMSTs, setAllMSTs] = useState([]);

  const [dsuState, setDsuState] = useState({
    parent: {},
    rank: {},
    size: {} // Initialize size here
  });

  const [currentOperation, setCurrentOperation] = useState('');
  const [currentOperationNodes, setCurrentOperationNodes] = useState([]);
  const [unionStrategy, setUnionStrategy] = useState('rank'); // New state for union strategy

  // Add new state variables for Prim's and Kruskal's concepts
  const [primsConceptVisited, setPrimsConceptVisited] = useState(false);
  const [kruskalsConceptVisited, setKruskalsConceptVisited] = useState(false);

  // Add new state variables for MST visualization control
  const [isMSTPaused, setIsMSTPaused] = useState(false);
  const [mstStepIndex, setMstStepIndex] = useState(0);
  const [mstSteps, setMstSteps] = useState([]);
  const [showMSTComparison, setShowMSTComparison] = useState(false);

  const [edgesCompletionMessage, setEdgesCompletionMessage] = useState('');
  const [level2CompletionMessage, setLevel2CompletionMessage] = useState('');

  const [showSuccess, setShowSuccess] = useState(false);
  const [gameMessage, setGameMessage] = useState('');
  const [bfsVisited, setBfsVisited] = useState(true);
  const [dfsVisited, setDfsVisited] = useState(false);

  const [levelStartTime, setLevelStartTime] = useState(Date.now());
  const [isSaving, setIsSaving] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  const [currentParent, setCurrentParent] = useState({});
  const [currentRank, setCurrentRank] = useState({});

  // Add useEffect to get user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${BACKEND_URL}/api/user/profile`, {  // Changed from /api/users/profile to /api/user/profile
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(err => console.error('Error fetching user:', err));
    }
  }, []);

  // Add progress loading functionality
  const loadProgress = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${BACKEND_URL}/api/game-progress/progress/graphs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.progress) {
          const completedLevelsSet = new Set();
          data.progress.levels.forEach(level => {
            if (level.completed) {
              completedLevelsSet.add(level.level);
            }
          });
          setCompletedLevels(completedLevelsSet);
          console.log('Loaded completed levels:', Array.from(completedLevelsSet));
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  // Load progress when user is available
  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  // Calculate score based on level
  const calculateScore = (level) => {
    return 10; // Fixed score of 10 points per level
  };

  // Save progress to database
  const saveProgress = async (level, score, timeSpent, attempts = 1) => {
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

      const progressData = {
        topicId: 'graphs',
        level: Number(level),
        score: Number(score),
        timeSpent: Number(timeSpent)
      };

      console.log('Sending progress data:', progressData);

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
        setCompletedLevels(prev => {
          const newState = new Set([...prev, level]);
          console.log('Updated completed levels:', Array.from(newState));
          return newState;
        });

        // Dispatch progress update event for Games component
        window.dispatchEvent(new CustomEvent('progressUpdated', {
          detail: { topicId: 'graphs', level, score }
        }));

        console.log(`Successfully saved progress for level ${level}:`, data);
      } else {
        throw new Error(data.error || 'Failed to save progress');
      }

    } catch (error) {
      console.error(`Error saving progress for level ${level}:`, error);
      // Show error to user
      setGameMessage(`Failed to save progress: ${error.message}`);
    }
  };

  // Update handleLevelComplete function
  const handleLevelComplete = async (level) => {
    console.log('handleLevelComplete called for level:', level);
    console.log('Current completed levels:', completedLevels);
    
    if (!completedLevels.has(level)) {
      const timeSpent = Math.floor((Date.now() - levelStartTime) / 1000);
      try {
        await saveProgress(level, calculateScore(level), timeSpent);
        // Refresh progress from DB
        await loadProgress();
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
    setLevelObjectiveMet(true);
    setGameMessage(`Level ${level} completed! Great job!`);
  };

  // Add useEffect to reset level start time when level changes
  useEffect(() => {
    setLevelStartTime(Date.now());
    setLevelObjectiveMet(false);
  }, [currentLevel]);

  // Add this function to handle next level click
  const handleNextLevelClick = () => {
    setShowSuccess(false);
    setCurrentLevel(prev => prev + 1);
  };

  function startMSTVisualization() {
    // Reset all MST-related states
    setMstEdges([]);
    setMstWeight(0);
    setMstStep(0);
    setMstExplanation("Starting Kruskal's algorithm visualization...\n\nStep 1: Initialize DSU (Disjoint Set Union) with each node in its own set");
    setMstConceptVisited(true);
    setSelectedConcept('mst');
    setVisitedNodes(new Set());
    setEdgesBeingProcessed(new Set());

    // Get current level's edges and sort by weight
    const currentEdges = [...levelData[currentLevel].edges].sort((a, b) => a.weight - b.weight);
    
    // Initialize DSU with visualization
    const parent = {};
    const rank = {};
    const size = {};
    const dsuOperations = [];
    
    // Initialize each node in its own set
    levelData[currentLevel].nodes.forEach(node => {
      parent[node.id] = node.id;
      rank[node.id] = 0;
      size[node.id] = 1;
      dsuOperations.push({
        node: node.id,
        parent: node.id,
        rank: 0,
        size: 1,
        explanation: `Node ${node.id} starts in its own set`
      });
    });

    // Update initial DSU state
    setDsuState({ parent: { ...parent }, rank: { ...rank }, size: { ...size } });

    // DSU functions with path compression and union by rank
    const find = (x) => {
      let currentParent = { ...dsuState.parent }; // Create a mutable copy to update
      let root = x;
      // Find the root without mutating the original state
      while (currentParent[root] !== root) {
        root = currentParent[root];
      }

      // Path compression: update parents on the way up to the root
      let path = [];
      let current = x;
      while (current !== root) {
        path.push(current);
        current = currentParent[current]; // Traverse up to the root
      }

      // Apply path compression to the mutable copy
      for (const nodeOnPath of path) {
        currentParent[nodeOnPath] = root;
      }

      // Only update state if changes were actually made (path compression occurred)
      if (JSON.stringify(currentParent) !== JSON.stringify(dsuState.parent)) {
        setDsuState(prevState => ({
          ...prevState,
          parent: currentParent
        }));
      }
      return root;
    };

    const union = (x, y) => {
      // This union function is for Level 9 DSU operations.
      // It takes the current dsuState.parent and rank,
      // performs union by rank, and updates dsuState with new maps.
      let currentParent = { ...dsuState.parent };
      let currentRank = { ...dsuState.rank };
      let currentSize = { ...dsuState.size }; // Assuming dsuState also has size

      const rootX = find(x); // Use the modified find that updates dsuState
      const rootY = find(y); // Use the modified find that updates dsuState
      
      if (rootX === rootY) {
        return { merged: false, rootX, rootY }; // Already in same set
      }
      
      let explanation = '';
      if (unionStrategy === 'rank') {
        // Union by rank: attach smaller rank tree under root of higher rank tree
        if (currentRank[rootX] < currentRank[rootY]) {
          currentParent[rootX] = rootY;
          explanation = `Union by Rank: Node ${rootX} (rank ${currentRank[rootX]}) attached to ${rootY} (rank ${currentRank[rootY]}).`;
        } else if (currentRank[rootX] > currentRank[rootY]) {
          currentParent[rootY] = rootX;
          explanation = `Union by Rank: Node ${rootY} (rank ${currentRank[rootY]}) attached to ${rootX} (rank ${currentRank[rootX]}).`;
        } else {
          currentParent[rootY] = rootX;
          currentRank[rootX]++;
          explanation = `Union by Rank: Nodes ${rootX} and ${rootY} have equal rank (${currentRank[rootX]-1}). Node ${rootY} attached to ${rootX}. New rank of ${rootX} is ${currentRank[rootX]}.`;
        }
      } else if (unionStrategy === 'size') {
        // Union by size: attach smaller size tree under root of larger size tree
        if (currentSize[rootX] < currentSize[rootY]) {
          currentParent[rootX] = rootY;
          currentSize[rootY] += currentSize[rootX];
          explanation = `Union by Size: Set of ${rootX} (size ${currentSize[rootX]}) attached to ${rootY} (size ${currentSize[rootY]-currentSize[rootX]}). New size of ${rootY} is ${currentSize[rootY]}.`;
        } else {
          // currentSize[rootX] >= currentSize[rootY]
          currentParent[rootY] = rootX;
          currentSize[rootX] += currentSize[rootY];
          explanation = `Union by Size: Set of ${rootY} (size ${currentSize[rootY]}) attached to ${rootX} (size ${currentSize[rootX]-currentSize[rootY]}). New size of ${rootX} is ${currentSize[rootX]}.`;
        }
      }
      
      // Update dsuState with the new parent and rank maps
      setDsuState(prevState => ({
        ...prevState,
        parent: currentParent,
        rank: currentRank,
        size: currentSize // Update size as well
      }));
      return { merged: true, rootX, rootY, explanation };
    };

    let step = 0;
    let mstEdgesList = [];
    let totalWeight = 0;
    let dsuStep = 0;

    const visualizeNextStep = () => {
      if (step >= currentEdges.length) return;

      const edge = currentEdges[step];
      
      // Show current edge being processed
      setEdgesBeingProcessed(new Set([`${edge.source}-${edge.target}`]));
      
      // Show DSU state before processing edge
      const currentDSUState = dsuOperations[dsuStep];
      if (currentDSUState) {
        setMstExplanation(prev => 
          `Step ${step + 1}: Processing edge ${edge.source}-${edge.target} (weight: ${edge.weight})\n` +
          `Current DSU State: ${currentDSUState.explanation}\n\n` +
          `MST Progress:\n` +
          `- Edges in MST: ${mstEdgesList.length}\n` +
          `- Current weight: ${totalWeight}`
        );
        dsuStep++;
      }
      
      const sourceRoot = find(edge.source);
      const targetRoot = find(edge.target);
      
      if (sourceRoot !== targetRoot) {
        // Add edge to MST
        const unionSuccess = union(edge.source, edge.target);
        if (unionSuccess) {
          mstEdgesList.push(edge);
          totalWeight += edge.weight;
          
          // Update MST states
          setMstEdges([...mstEdgesList]);
          setMstWeight(totalWeight);
          
          // Show DSU state after union
          const afterUnionState = dsuOperations[dsuStep];
          setMstExplanation(prev => 
            `${prev}\n\nAdding edge ${edge.source}-${edge.target} (weight: ${edge.weight}) to MST.\n` +
            `DSU Update: ${afterUnionState.explanation}\n` +
            `New MST weight: ${totalWeight}`
          );
          dsuStep++;
          
          // Update visited nodes
          const newVisitedNodes = new Set([...mstEdgesList].flatMap(e => [e.source, e.target]));
          setVisitedNodes(newVisitedNodes);
        }
      } else {
        setMstExplanation(prev => 
          `${prev}\n\nSkipping edge ${edge.source}-${edge.target} (weight: ${edge.weight}) as it would form a cycle.\n` +
          `Nodes ${edge.source} and ${edge.target} are already in the same set (root: ${sourceRoot})`
        );
      }
      
      step++;
      setMstStep(step);
      
      if (step < currentEdges.length) {
        setTimeout(visualizeNextStep, 2000); // Increased delay to show DSU operations
      } else {
        // Final MST state
        const finalExplanation = [
          `MST Construction Complete!`,
          `\nFinal MST Properties:`,
          `- Total Weight: ${totalWeight}`,
          `- Number of Edges: ${mstEdgesList.length}`,
          `- Number of Nodes: ${levelData[currentLevel].nodes.length}`,
          `\nEdges in MST:`,
          ...mstEdgesList.map(e => `- Edge ${e.source}-${e.target} (weight: ${e.weight})`),
          `\nDSU Final State:`,
          ...Object.entries(parent).map(([node, root]) => 
            `- Node ${node} → Root ${root} (rank: ${rank[root]})`
          ),
          `\nVerification:`,
          mstEdgesList.length === levelData[currentLevel].nodes.length - 1 
            ? "✓ Valid MST: Connects all nodes with minimum weight and no cycles"
            : "⚠ Warning: MST should have exactly " + (levelData[currentLevel].nodes.length - 1) + " edges"
        ].join('\n');
        
        setMstExplanation(finalExplanation);
        setMstConceptVisited(true);
        setEdgesBeingProcessed(new Set(mstEdgesList.map(e => `${e.source}-${e.target}`)));
      }
    };

    // Start visualization
    setTimeout(visualizeNextStep, 1000);
  }

  // Add a component to visualize DSU state
  const MSTDSUVisualization = ({ dsuState, nodes }) => {
    if (!dsuState || !dsuState.parent || !dsuState.rank) return null;
    
    return (
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        {/* <h3 className="font-bold mb-2">DSU State Visualization</h3>
        <div className="grid grid-cols-2 gap-2">
          {nodes.map(node => (
            <div key={node.id} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                {node.id}
              </div>
              <span>→</span>
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                {dsuState.parent[node.id]}
              </div>
              <span className="text-sm text-gray-600">(rank: {dsuState.rank[node.id]})</span>
            </div>
          ))}
        </div> */}
      </div>
    );
  };

  // Helper to check if a set of edges forms a spanning tree
  function isSpanningTree(nodes, edgesSubset) {
    if (edgesSubset.length !== nodes.length - 1) return false;
    // Union-Find to check connectivity and acyclicity
    const parent = {};
    nodes.forEach(n => parent[n.id] = n.id);
    function find(x) { return parent[x] === x ? x : (parent[x] = find(parent[x])); }
    function union(x, y) {
      const px = find(x), py = find(y);
      if (px === py) return false;
      parent[py] = px;
      return true;
    }
    let count = 0;
    for (const e of edgesSubset) {
      if (!union(e.source, e.target)) return false;
      count++;
    }
    // Check all nodes are connected
    const root = find(nodes[0].id);
    return nodes.every(n => find(n.id) === root) && count === nodes.length - 1;
  }

  // Helper to generate all spanning trees (brute-force, only for small graphs)
  function generateAllSpanningTrees(nodes, edges) {
    const results = [];
    const n = nodes.length;
    const edgeCombos = (arr, k) => {
      const res = [];
      function backtrack(start, combo) {
        if (combo.length === k) { res.push(combo.slice()); return; }
        for (let i = start; i < arr.length; i++) {
          combo.push(arr[i]);
          backtrack(i + 1, combo);
          combo.pop();
        }
      }
      backtrack(0, []);
      return res;
    };
    for (const combo of edgeCombos(edges, n - 1)) {
      if (isSpanningTree(nodes, combo)) results.push(combo);
    }
    return results;
  }

  // Show all spanning trees animation
  const showAllSpanningTrees = () => {
    if (currentLevel !== 8) return;
    const nodes = levelData[8].nodes;
    const edges = levelData[8].edges;
    const allTrees = generateAllSpanningTrees(nodes, edges);
    setAllSpanningTrees(allTrees);
    // Find minimum weight(s)
    let minWeight = Infinity;
    let minIndices = [];
    allTrees.forEach((tree, idx) => {
      const w = tree.reduce((sum, e) => sum + e.weight, 0);
      if (w < minWeight) { minWeight = w; minIndices = [idx]; }
      else if (w === minWeight) { minIndices.push(idx); }
    });
    setMinSpanningTreeIndices(minIndices);
    let i = 0;
    function animate() {
      if (i >= allTrees.length) return;
      const tree = allTrees[i];
      setEdgesBeingProcessed(new Set(tree.map(e => `${e.source}-${e.target}`)));
      setCurrentSpanningTreeWeight(tree.reduce((sum, e) => sum + e.weight, 0));
      setCurrentSpanningTreeIndex(i);
      setTimeout(() => {
        i++;
        animate();
      }, 1800);
    }
    animate();
  };

  // Function to detect cycle in undirected graph using DFS
  const detectUndirectedCycle = (nodeId, parent, visited, graphAdjList, currentPath, detectedCycleNodes, detectedCycleEdges) => {
    visited.add(nodeId);
    currentPath.push(nodeId);

    for (const neighbor of graphAdjList[nodeId] || []) {
      if (neighbor === parent) continue; // Skip parent in undirected graph

      if (visited.has(neighbor)) { // Cycle detected
        // Trace back the cycle path from the current node to the detected neighbor
        const cycleStartIndex = currentPath.indexOf(neighbor);
        if (cycleStartIndex !== -1) {
          for (let i = cycleStartIndex; i < currentPath.length; i++) {
            detectedCycleNodes.add(currentPath[i]);
            if (i > cycleStartIndex) {
              detectedCycleEdges.add(`${currentPath[i-1]}-${currentPath[i]}`);
              detectedCycleEdges.add(`${currentPath[i]}-${currentPath[i-1]}`); // For undirected
            }
          }
          detectedCycleEdges.add(`${currentPath[currentPath.length-1]}-${neighbor}`);
          detectedCycleEdges.add(`${neighbor}-${currentPath[currentPath.length-1]}`);
        }
        return true; // Cycle found
      }

      // If not visited, recurse
      if (detectUndirectedCycle(neighbor, nodeId, visited, graphAdjList, currentPath, detectedCycleNodes, detectedCycleEdges)) {
        return true; // Cycle found in recursive call
      }
    }

    currentPath.pop(); // Backtrack
    return false;
  };

  // Function to detect cycle in directed graph using DFS
  const detectDirectedCycle = (nodeId, visited, recursionStack, graphAdjList, currentPath, detectedCycleNodes, detectedCycleEdges) => {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    currentPath.push(nodeId);

    for (const neighbor of graphAdjList[nodeId] || []) {
      if (recursionStack.has(neighbor)) {
        // Cycle detected, trace back the cycle path
        const cycleStartIndex = currentPath.indexOf(neighbor);
        if (cycleStartIndex !== -1) {
          for (let i = cycleStartIndex; i < currentPath.length; i++) {
            detectedCycleNodes.add(currentPath[i]);
            if (i > cycleStartIndex) {
              detectedCycleEdges.add(`${currentPath[i-1]}-${currentPath[i]}`);
            }
          }
          detectedCycleEdges.add(`${currentPath[currentPath.length-1]}-${neighbor}`);
        }
        return true; // Cycle found
      }

      if (!visited.has(neighbor)) {
        if (detectDirectedCycle(neighbor, visited, recursionStack, graphAdjList, currentPath, detectedCycleNodes, detectedCycleEdges)) {
          return true; // Cycle found in recursive call
        }
      }
    }

    recursionStack.delete(nodeId);
    currentPath.pop(); // Backtrack
    return false;
  };

  // Function to start cycle detection visualization
  const startCycleDetectionVisualization = () => {
    setVisualizationStep(-1); // Ensure no ongoing general visualization
    if (visualizationTimeoutRef.current) {
      clearTimeout(visualizationTimeoutRef.current);
    }

    setCycleNodes(new Set()); // Clear previous cycle highlighting
    setCycleEdges(new Set()); // Clear previous cycle highlighting

    const currentEdges = selectedConcept === 'undirectedCycle' 
      ? levelData[currentLevel].undirectedCycleEdges 
      : levelData[currentLevel].directedCycleEdges;

    const visited = new Set();
    const recursionStack = new Set();
    const currentPath = []; // To track the current DFS path for cycle tracing
    const detectedCycleNodes = new Set();
    const detectedCycleEdges = new Set();

    // Create an adjacency list from the current edges for easier traversal
    const graphAdjList = {};
    levelData[currentLevel].nodes.forEach(node => {
      graphAdjList[node.id] = [];
    });
    currentEdges.forEach(edge => {
      if (graphAdjList[edge.source]) {
        graphAdjList[edge.source].push(edge.target);
      }
      if (edge.type === 'undirected' && graphAdjList[edge.target]) {
        graphAdjList[edge.target].push(edge.source);
      }
    });

    let cycleFound = false;
    // Iterate through all nodes to handle disconnected components in case start node A is not part of a cycle
    for (const nodeId of levelData[currentLevel].nodes.map(node => node.id)) {
      if (!visited.has(nodeId)) {
        if (selectedConcept === 'undirectedCycle') {
          // Reset path for each new DFS traversal from unvisited node
          currentPath.length = 0; 
          cycleFound = detectUndirectedCycle(nodeId, null, visited, graphAdjList, currentPath, detectedCycleNodes, detectedCycleEdges);
        } else {
          // Reset path and recursion stack for each new DFS traversal
          currentPath.length = 0;
          recursionStack.clear();
          cycleFound = detectDirectedCycle(nodeId, visited, recursionStack, graphAdjList, currentPath, detectedCycleNodes, detectedCycleEdges);
        }
        if (cycleFound) break; // Stop if a cycle is found
      }
    }

    // Update state only after detection is complete to trigger re-render
    if (cycleFound) {
      setCycleNodes(detectedCycleNodes);
      setCycleEdges(detectedCycleEdges);
    } else {
      // If no cycle found, ensure no highlighting is present
      setCycleNodes(new Set());
      setCycleEdges(new Set());
    }

    // For cycle detection, we are showing the final detected cycle, not a step-by-step animation.
    // So, visualizationStep remains -1.
  };

  // Function to start introductory topological sort visualization
  const startIntroToposortVisualization = () => {
    setTraversalOrder([]);
    setVisitedNodes(new Set());
    setCurrentQueue([]);
    setVisualizationStep(0); // Start visualization at step 0
    setCurrentStep(0);
    setIsPaused(false);
    setEdgesBeingProcessed(new Set()); // Clear any previous edge highlighting
    if (visualizationTimeoutRef.current) {
      clearTimeout(visualizationTimeoutRef.current);
    }

    const currentNodes = levelData[currentLevel].nodes;
    const currentEdges = levelData[currentLevel].edges;
    const initialInDegrees = calculateInDegrees(currentNodes, currentEdges);
    const inDegrees = { ...initialInDegrees }; // Copy to mutate

    // Create an adjacency list for easy traversal
    const adjList = {};
    currentNodes.forEach(node => adjList[node.id] = []);
    currentEdges.forEach(edge => {
      if (adjList[edge.source]) {
        adjList[edge.source].push(edge.target);
      }
    });

    // Initialize queue with all nodes that have an in-degree of 0
    const queue = [];
    currentNodes.forEach(node => {
      if (inDegrees[node.id] === 0) {
        queue.push(node.id);
      }
    });

    const order = [];
    const processedNodes = new Set();
    let stepCount = 0;

    const visualizeNextStep = () => {
      if (queue.length > 0 && !isPaused) {
        const currentNodeId = queue.shift();
        processedNodes.add(currentNodeId);
        order.push(currentNodeId);

        // Highlight edges connected to the current node being processed
        const currentStepEdges = new Set();
        currentEdges.forEach(edge => {
          if (edge.source === currentNodeId) {
            currentStepEdges.add(`${edge.source}-${edge.target}`);
          }
        });

        setTraversalOrder([...order]);
        setVisitedNodes(new Set(processedNodes));
        setCurrentQueue([...queue]); // Update queue state for visualization
        setCurrentStep(stepCount);
        setEdgesBeingProcessed(currentStepEdges); // Set state for edge highlighting

        // Decrement in-degrees of neighbors and add to queue if in-degree becomes 0
        adjList[currentNodeId].forEach(neighbor => {
          if (inDegrees[neighbor] !== undefined) { // Defensive check
            inDegrees[neighbor]--;
            if (inDegrees[neighbor] === 0) {
              queue.push(neighbor);
            }
          }
        });
        
        stepCount++;
        visualizationTimeoutRef.current = setTimeout(visualizeNextStep, 2000); // Slower visualization
      } else {
        // If queue is empty, check if all nodes have been processed (no cycle)
        if (order.length === currentNodes.length) {
          setInstructions(levelData[currentLevel].conceptExplanations.introToposort.description + " A valid topological order has been found!");
        } else {
          setInstructions(levelData[currentLevel].conceptExplanations.introToposort.description + " A cycle was detected in the graph, so a topological sort is not possible!");
        }
        setVisualizationStep(-1); // End visualization
        setCurrentStep(0); // Reset step for next visualization
        setEdgesBeingProcessed(new Set()); // Clear edge highlighting
      }
    };
    visualizeNextStep();
  };

  // Helper function to calculate in-degrees for all nodes
  const calculateInDegrees = (nodes, edges) => {
    const inDegrees = {};
    nodes.forEach(node => inDegrees[node.id] = 0);
    edges.forEach(edge => {
      if (inDegrees[edge.target] !== undefined) {
        inDegrees[edge.target]++;
      }
    });
    return inDegrees;
  };

  // Function to start In-Degree visualization
  const startInDegreeVisualization = () => {
    setInDegreeVisualizationNode(null);
    setInDegreeVisualizationStep(0);
    setCurrentStep(0); // Use currentStep for consistent control
    setIsPaused(false);
    setEdgesBeingProcessed(new Set()); // Clear any previous highlighting for in-degree
    setTraversalOrder([]); // Clear topological order specific state
    setVisitedNodes(new Set()); // Clear nodes visited for topological sort
    setCurrentQueue([]); // Clear queue for topological sort
    if (visualizationTimeoutRef.current) {
      clearTimeout(visualizationTimeoutRef.current);
    }

    const currentNodes = levelData[currentLevel].nodes;
    const currentEdges = levelData[currentLevel].edges;
    
    // Initialize all in-degrees to 0 for display
    const initialInDegrees = {};
    currentNodes.forEach(node => initialInDegrees[node.id] = 0);
    setCurrentInDegreesDisplay(initialInDegrees);

    let step = 0;
    const edgesOrder = currentEdges.map((edge, index) => ({ ...edge, originalIndex: index })); // Preserve original index for ordering

    const visualizeNextInDegreeStep = () => {
      if (step < edgesOrder.length && !isPaused) {
        const currentEdge = edgesOrder[step];
        const targetNodeId = currentEdge.target;

        // Update in-degree for the target node
        setCurrentInDegreesDisplay(prevDegrees => ({
          ...prevDegrees,
          [targetNodeId]: (prevDegrees[targetNodeId] || 0) + 1,
        }));

        setInDegreeVisualizationNode(targetNodeId); // Highlight the target node
        setEdgesBeingProcessed(new Set([`${currentEdge.source}-${currentEdge.target}`])); // Highlight the current edge
        setCurrentStep(step);

        visualizationTimeoutRef.current = setTimeout(visualizeNextInDegreeStep, 1500); // Highlight each step for 1.5 seconds
        step++;
      } else {
        setInDegreeVisualizationNode(null); // End visualization
        setCurrentStep(0); // Reset step
        setEdgesBeingProcessed(new Set()); // Clear edge highlighting at the end
        // Final calculation of in-degrees to ensure display is correct after visualization
        setCurrentInDegreesDisplay(calculateInDegrees(currentNodes, currentEdges));
      }
    };
    visualizeNextInDegreeStep();
  };

  // Function to get step explanation
  const getStepExplanation = () => {
    if (currentLevel === 10) {
      return ''; // Return empty string for Level 10 to avoid any explanation in the right panel
    }
    if (currentLevel === 4) {
      if (selectedConcept === 'bfs') {
        const steps = [
          "Starting BFS from node A...",
          "Visiting node A and adding its neighbors to the queue",
          "Processing nodes in the queue one by one",
          "For each node, we visit all its unvisited neighbors",
          "The queue helps us keep track of nodes to visit next",
          "We continue until all nodes are visited"
        ];
        return steps[Math.min(currentStep, steps.length - 1)];
      } else if (selectedConcept === 'dfs') {
        const steps = [
          "Starting DFS from node A...",
          "Visiting node A and adding its neighbors to the stack",
          "Following one path as deep as possible",
          "When you can't go further, we backtrack",
          "The stack helps us remember where to backtrack to",
          "We continue until all nodes are visited"
        ];
        return steps[Math.min(currentStep, steps.length - 1)];
      }
    } else if (currentLevel === 6) {
      if (selectedConcept === 'introToposort') {
        const steps = [
          "Kahn's Algorithm begins by finding all nodes with an in-degree of 0 (no prerequisites). These nodes are added to a queue.",
          `Dequeuing node ${traversalOrder[currentStep]} from the queue. This node has no remaining prerequisites. Adding it to the topological order.`, 
          `Conceptually 'removing' outgoing edges from node ${traversalOrder[currentStep]}. This reduces the in-degree of its neighbors.`, 
          `New nodes with an in-degree of 0 are added to the queue: [${currentQueue.join(', ')}].`, 
          "The process repeats: dequeue a node, update neighbors' in-degrees, and add new zero-in-degree nodes to the queue.",
          "If the queue becomes empty before all nodes are processed, it means a cycle exists, and topological sort is impossible."
        ];
        return steps[currentStep] || "Click 'Start Introduction Visualization' to begin the Kahn's Algorithm demonstration.";
      } else if (selectedConcept === 'inDegree') {
        const currentEdge = levelData[currentLevel].edges.find((e, idx) => idx === currentStep); // Get current edge being processed
        if (currentEdge) {
          return `Processing edge from ${currentEdge.source} to ${currentEdge.target}. Incrementing in-degree of node ${currentEdge.target}.`;
        } else if (currentStep === 0) {
          return "Initializing all in-degrees to 0. Click 'Start Visualization' to begin counting incoming edges.";
    } else {
          const finalInDegrees = calculateInDegrees(nodes, edges);
          const completionMessage = Object.entries(finalInDegrees).map(([nodeId, degree]) => 
            `Node ${nodeId}: ${degree}`
          ).join(', ');
          return `In-degree calculation complete! Final counts: ${completionMessage}.`;
        }
      }
    } else if (currentLevel === 7) {
      if (selectedConcept === 'shortestPath') {
        const steps = [
          "Starting Dijkstra's Algorithm from node A...",
          "Initializing distances: all nodes except A have distance Infinity",
          "Finding unvisited node with smallest distance",
          "Updating distances to neighbors through current node",
          "Marking current node as visited",
          "Repeating until all nodes are visited",
          "Final distances represent shortest paths from A"
        ];
        return steps[Math.min(currentStep, steps.length - 1)];
      } else if (selectedConcept === 'dijkstra') {
        if (allDijkstraSteps && allDijkstraSteps[currentStep]) {
          return allDijkstraSteps[currentStep].explanation;
        } else if (currentStep === 0) {
          return "Click 'Start Dijkstra's Visualization' to begin the step-by-step demonstration.";
        }
        return "Dijkstra's Algorithm visualization complete.";
      }
    }
    return '';
  };

  // This useEffect will be responsible for loading the correct level data
  useEffect(() => {
    // Ensure levelData for the current level exists
    if (!levelData[currentLevel]) {
      console.error(`Level data for level ${currentLevel} is missing! Reverting to Level 1.`);
      setCurrentLevel(1); // Revert to a known good level
      return; // Exit to prevent further errors for this render cycle
    }

    const currentLevelData = levelData[currentLevel];
    setInstructions(currentLevelData.instructions);

    // Always update nodes based on the current level
    setNodes(currentLevelData.nodes);
    
    // Set edges and selected concept based on the current level's default
    if (currentLevel === 1) {
      setEdges(currentLevelData.edges);
      setSelectedConcept('nodes');
    } else if (currentLevel === 2) {
      setEdges(currentLevelData.directedEdges); // Default for Level 2 is directed
      setSelectedConcept('directed');
      setDirectedConceptVisited(true); // Mark directed as visited by default for Level 2
      setUndirectedConceptVisited(false); // Ensure undirected is false at start of level 2
    } else if (currentLevel === 3) {
      setEdges(currentLevelData.undirectedGraphEdges); // Default to undirected edges
      setSelectedConcept('undirectedAdjList'); // Default concept
    } else if (currentLevel === 4) {
      setEdges(currentLevelData.edges);
      setSelectedConcept('bfs');
    } else if (currentLevel === 5) {
      setEdges(currentLevelData.undirectedCycleEdges);
      setSelectedConcept('undirectedCycle');
    } else if (currentLevel === 6) {
      setEdges(currentLevelData.edges); // Directed graph for topological sort
      setSelectedConcept('inDegree'); // Default to introToposort for Level 6
    } else if (currentLevel === 7) {
      setEdges(currentLevelData.edges); // Directed graph for shortest path
      setSelectedConcept('shortestPath'); // Default to shortestPath for Level 7
    } else if (currentLevel === 8) {
      setEdges(currentLevelData.edges); // Ensure edges with weights are set for MST
      setSelectedConcept('mst');
      setMstConceptVisited(false);
      setMstEdges([]);
      setMstWeight(0);
      setMstStep(0);
      setMstExplanation('');
      setVisitedNodes(new Set());
    } else if (currentLevel === 9) {
      setEdges(currentLevelData.edges); // Edges for DSU
      setSelectedConcept('dsu');
      // Initialize DSU state when entering Level 9
      const initialParent = {};
      const initialRank = {};
      const initialSize = {}; // Initialize size
      currentLevelData.nodes.forEach(node => {
        initialParent[node.id] = node.id;
        initialRank[node.id] = 0;
        initialSize[node.id] = 1; // Each node starts with size 1
      });
      setDsuState({ parent: initialParent, rank: initialRank, size: initialSize });
      setDsuConceptVisited(false); // Reset DSU concept visited
    } else if (currentLevel === 10) {
      setEdges(levelData[currentLevel].edges);
      setSelectedConcept('prims');
      setPrimsConceptVisited(false);
      setKruskalsConceptVisited(false);
      setMstEdges([]);
      setMstWeight(0);
      setMstStep(0);
      setMstExplanation('');
      setVisitedNodes(new Set());
    }

    // Reset visited states for the new level
    setNodesConceptVisited(true); // Keep nodes visited for Level 1 default
    setEdgesConceptVisited(false);
    // directedConceptVisited is set in the Level 2 specific block
    setUndirectedConceptVisited(false); 
    setUndirectedAdjListConceptVisited(true);
    setDirectedAdjListConceptVisited(false);
    setUndirectedAdjMatrixConceptVisited(false);
    setDirectedAdjMatrixConceptVisited(false);
    setBfsConceptVisited(false);
    setDfsConceptVisited(false);
    setUndirectedCycleConceptVisited(false);
    setDirectedCycleConceptVisited(false);
    setInDegreeConceptVisited(false);
    setIntroToposortConceptVisited(false);
    setShortestPathConceptVisited(false);
    setDijkstraConceptVisited(false);
    setVisualizationStep(-1);
    setTraversalOrder([]);
    setCurrentQueue([]);
    setCurrentStack([]);
    setVisitedNodes(new Set());
    setEdgesBeingProcessed(new Set());
    setIsPaused(false);
    setCurrentStep(0);
    setInDegreeVisualizationNode(null);
    setInDegreeVisualizationStep(0);
    setCurrentInDegreesDisplay({});
    setDraggedNode(null);
    setCurrentOperation('');
    setCurrentOperationNodes([]);
    setLevel2CompletionMessage(''); // Clear Level 2 completion message on level change
  }, [currentLevel]);

  // Function to get neighbors of a node
  const getNeighbors = (nodeId) => {
    const neighbors = new Set();
    edges.forEach(edge => {
      if (edge.source === nodeId) {
        neighbors.add(edge.target);
      }
      if (edge.type === 'undirected' && edge.target === nodeId) {
        neighbors.add(edge.source);
      }
    });
    return Array.from(neighbors);
  };

  // Function to perform BFS visualization with step-by-step explanation
  const startBFSVisualization = () => {
    setTraversalOrder([]);
    setCurrentQueue([]);
    setVisitedNodes(new Set());
    setVisualizationStep(-1);
    setCurrentStep(0);
    setIsPaused(false);
    if (visualizationTimeoutRef.current) {
      clearTimeout(visualizationTimeoutRef.current);
    }

    const queue = ['A']; // Start with node A
    const visited = new Set();
    const order = [];
    let step = 0;

    const visualizeNextStep = () => {
      if (queue.length > 0 && !isPaused) {
        const current = queue.shift();
        if (!visited.has(current)) {
          visited.add(current);
          order.push(current);
          setTraversalOrder([...order]);
          setVisitedNodes(new Set(visited));
          setCurrentStep(step);
          
          const neighbors = getNeighbors(current);
          neighbors.forEach(neighbor => {
            if (!visited.has(neighbor)) {
              queue.push(neighbor);
            }
          });
          setCurrentQueue([...queue]);
          step++;
        }
        visualizationTimeoutRef.current = setTimeout(visualizeNextStep, 2000); // Slower visualization
      }
    };

    visualizeNextStep();
  };

  // Function to perform DFS visualization with step-by-step explanation
  const startDFSVisualization = () => {
    setTraversalOrder([]);
    setCurrentStack([]);
    setVisitedNodes(new Set());
    setVisualizationStep(-1);
    setCurrentStep(0);
    setIsPaused(false);
    if (visualizationTimeoutRef.current) {
      clearTimeout(visualizationTimeoutRef.current);
    }

    const stack = ['A']; // Start with node A
    const visited = new Set();
    const order = [];
    let step = 0;

    const visualizeNextStep = () => {
      if (stack.length > 0 && !isPaused) {
        const current = stack.pop();
        if (!visited.has(current)) {
          visited.add(current);
          order.push(current);
          setTraversalOrder([...order]);
          setVisitedNodes(new Set(visited));
          setCurrentStep(step);
          
          const neighbors = getNeighbors(current);
          neighbors.reverse().forEach(neighbor => {
            if (!visited.has(neighbor)) {
              stack.push(neighbor);
            }
          });
          setCurrentStack([...stack]);
          step++;
        }
        visualizationTimeoutRef.current = setTimeout(visualizeNextStep, 2000); // Slower visualization
      }
    };

    visualizeNextStep();
  };

  const handleMouseDown = (nodeId) => {
    setDraggedNode(nodeId);
  };

  const updateNodePosition = (e) => {
    if (draggedNode && svgRef.current) {
      const svg = svgRef.current;
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setNodes(prevNodes =>
        prevNodes.map(node =>
          node.id === draggedNode
            ? { ...node, x, y }
            : node
        )
      );
    }
  };

  const throttledMouseMove = useCallback(throttle(updateNodePosition, 16), [draggedNode]);

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  useEffect(() => {
    window.addEventListener('mousemove', throttledMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [throttledMouseMove]); // Dependency changed to throttledMouseMove

  const handleConceptClick = (concept) => {
    let currentNodesConceptVisited = nodesConceptVisited;
    let currentEdgesConceptVisited = edgesConceptVisited;
    let currentDirectedConceptVisited = directedConceptVisited;
    let currentUndirectedConceptVisited = undirectedConceptVisited;
    let currentUndirectedAdjListConceptVisited = undirectedAdjListConceptVisited;
    let currentDirectedAdjListConceptVisited = directedAdjListConceptVisited;
    let currentUndirectedAdjMatrixConceptVisited = undirectedAdjMatrixConceptVisited;
    let currentDirectedAdjMatrixConceptVisited = directedAdjMatrixConceptVisited;
    let currentBfsConceptVisited = bfsConceptVisited;
    let currentDfsConceptVisited = dfsConceptVisited;
    let currentUndirectedCycleConceptVisited = undirectedCycleConceptVisited;
    let currentDirectedCycleConceptVisited = directedCycleConceptVisited;
    let currentIntroToposortConceptVisited = introToposortConceptVisited;
    let currentInDegreeConceptVisited = inDegreeConceptVisited;
    let currentShortestPathConceptVisited = shortestPathConceptVisited;
    let currentDijkstraConceptVisited = dijkstraConceptVisited;

    setSelectedConcept(concept);
    
    if (currentLevel === 1) {
      if (concept === 'nodes') {
        currentNodesConceptVisited = true;
        setNodesConceptVisited(true);
        startNodesVisualization();
      } else if (concept === 'edges') {
        currentEdgesConceptVisited = true;
        setEdgesConceptVisited(true);
        // setEdgesCompletionMessage("Great job! You've learned about graph edges. Edges are the connections between nodes that represent relationships in the graph. Notice how some nodes have more connections than others!");
        startEdgesVisualization();
      }
    } else if (currentLevel === 2) {
      if (concept === 'directed') {
        currentDirectedConceptVisited = true;
        setDirectedConceptVisited(true);
        startDirectedVisualization();
      } else if (concept === 'undirected') {
        currentUndirectedConceptVisited = true;
        setUndirectedConceptVisited(true);
        startUndirectedVisualization();
        setLevel2CompletionMessage("Fantastic! You've explored both directed and undirected graphs. You now understand that directionality matters in graphs.");
      }
    } else if (currentLevel === 3) {
      if (concept === 'undirectedAdjList' || concept === 'undirectedAdjMatrix') {
        setEdges(levelData[3].undirectedGraphEdges);
      } else if (concept === 'directedAdjList' || concept === 'directedAdjMatrix') {
        setEdges(levelData[3].directedGraphEdges);
      }
      if (concept === 'undirectedAdjList') {
        currentUndirectedAdjListConceptVisited = true;
        setUndirectedAdjListConceptVisited(true);
      } else if (concept === 'directedAdjList') {
        currentDirectedAdjListConceptVisited = true;
        setDirectedAdjListConceptVisited(true);
      } else if (concept === 'undirectedAdjMatrix') {
        currentUndirectedAdjMatrixConceptVisited = true;
        setUndirectedAdjMatrixConceptVisited(true);
      } else if (concept === 'directedAdjMatrix') {
        currentDirectedAdjMatrixConceptVisited = true;
        setDirectedAdjMatrixConceptVisited(true);
      }
      startGraphRepresentationVisualization();
    } else if (currentLevel === 4) {
      if (concept === 'bfs') {
        setBfsVisited(true);
        currentBfsConceptVisited = true;
        setBfsConceptVisited(true);
        startBFSVisualization();
      } else if (concept === 'dfs') {
        setDfsVisited(true); 
        currentDfsConceptVisited = true;
        setDfsConceptVisited(true);
        startDFSVisualization();
      }
    } else if (currentLevel === 5) {
      if (concept === 'undirectedCycle') {
        setEdges(levelData[5].undirectedCycleEdges);
        setUndirectedCycleConceptVisited(true);
        startCycleDetectionVisualization();
        setcycleDetectionInUndrectgraphcompleted(true);
      } else if (concept === 'directedCycle') {
        setEdges(levelData[5].directedCycleEdges); // <-- This is the key line!
        setDirectedCycleConceptVisited(true);
        startCycleDetectionVisualization();
        setcycleDetectiondrectgraphcompleted(true);
      }
    } else if (currentLevel === 6) {
      if (concept === 'inDegree') {
        currentInDegreeConceptVisited = true;
        setInDegreeConceptVisited(true);
        startInDegreeVisualization();
        setinDegreeCompleted(true);
      } else if (concept === 'introToposort') {
        currentIntroToposortConceptVisited = true;
        setIntroToposortConceptVisited(true);
        settopologicalSortCompleted(true);
      }
    } else if (currentLevel === 7) {
      if (concept === 'shortestPath') {
        currentShortestPathConceptVisited = true;
        setShortestPathConceptVisited(true);
        startShortestPathVisualization();
        setsortestPathCompleted(true);
      } else if (concept === 'dijkstra') {
        currentDijkstraConceptVisited = true;
        setDijkstraConceptVisited(true);
        startDijkstraVisualization();
        setdijkstraCompleted(true);
      }
    } else if (currentLevel === 8) {
      if (concept === 'mst') {
        setSelectedConcept('mst');
        startMSTVisualization();
        setmstCompleted(true);
      }
    } else if (currentLevel === 9) {
      if (concept === 'dsu') {
        setSelectedConcept('dsu');
        setdsuCompleted(true);
        // Initialize DSU state when concept is first clicked
        if (!dsuConceptVisited) {
          const initialParent = {};
          const initialRank = {};
          levelData[currentLevel].nodes.forEach(node => {
            initialParent[node.id] = node.id;
            initialRank[node.id] = 0;
          });
          setDsuState({
            parent: initialParent,
            rank: initialRank
          });
          setDsuConceptVisited(true);
        }
      }
    } else if (currentLevel === 10) {
      if (concept === 'prims') {
        setSelectedConcept('prims');
        setprimsCompleted(true);
        setPrimsConceptVisited(true);
      } else if (concept === 'kruskals') {
        setSelectedConcept('kruskals');
        setkruskalsCompleted(true);
        setKruskalsConceptVisited(true);
      }
    }

    // Check if level is complete
    let levelIsComplete = false;
    const currentLevelData = levelData[currentLevel];
    
    if (currentLevel === 1) {
      levelIsComplete = currentLevelData.levelCompleteConditions(currentNodesConceptVisited, currentEdgesConceptVisited);
      if (levelIsComplete) {
        handleLevelComplete(currentLevel);
      }
    } else if (currentLevel === 2) {
      levelIsComplete = currentLevelData.levelCompleteConditions(currentDirectedConceptVisited, currentUndirectedConceptVisited);
      if (levelIsComplete) {
        handleLevelComplete(currentLevel);
      }
    } else if (currentLevel === 3) {
      levelIsComplete = currentLevelData.levelCompleteConditions(
        currentUndirectedAdjListConceptVisited,
        currentDirectedAdjListConceptVisited,
        currentUndirectedAdjMatrixConceptVisited,
        currentDirectedAdjMatrixConceptVisited
      );
      if (levelIsComplete) {
        handleLevelComplete(currentLevel);
      }
    } else if (currentLevel === 4) {
      levelIsComplete = currentLevelData.levelCompleteConditions(currentBfsConceptVisited, currentDfsConceptVisited);
      if (levelIsComplete) {
        handleLevelComplete(currentLevel);
      }
    } else if (currentLevel === 5) {
      levelIsComplete = currentLevelData.levelCompleteConditions(currentUndirectedCycleConceptVisited, currentDirectedCycleConceptVisited);
    } else if (currentLevel === 6) {
      levelIsComplete = currentLevelData.levelCompleteConditions(currentIntroToposortConceptVisited, currentInDegreeConceptVisited);
    } else if (currentLevel === 7) {
      levelIsComplete = currentLevelData.levelCompleteConditions(currentShortestPathConceptVisited, currentDijkstraConceptVisited);
    } else if (currentLevel === 8) {
      levelIsComplete = currentLevelData.levelCompleteConditions(mstConceptVisited);
    } else if (currentLevel === 9) {
      levelIsComplete = isLevelComplete; // DSU level completion is handled by the useEffect watching dsuState
    } else if (currentLevel === 10) {
      levelIsComplete = currentLevelData.levelCompleteConditions(primsConceptVisited, kruskalsConceptVisited);
    }

    setIsLevelComplete(levelIsComplete);
  };

  // Function to draw an arrow for directed edges
  const drawArrow = (source, target, stroke, strokeWidth) => {
    const angle = Math.atan2(target.y - source.y, target.x - source.x);
    const arrowLength = 15;
    const arrowWidth = 8;

    const targetX = target.x - (20 * Math.cos(angle)); // Adjust for node radius
    const targetY = target.y - (20 * Math.sin(angle)); // Adjust for node radius

    const arrowPath = `M ${targetX} ${targetY}
                       L ${targetX - arrowLength * Math.cos(angle - Math.PI / 6)} ${targetY - arrowLength * Math.sin(angle - Math.PI / 6)}
                       L ${targetX - arrowLength * Math.cos(angle + Math.PI / 6)} ${targetY - arrowLength * Math.sin(angle + Math.PI / 6)}
                       Z`;
    return <path d={arrowPath} fill={stroke} stroke={stroke} strokeWidth={strokeWidth} />;
  };

  // Function to generate adjacency list string
  const generateAdjacencyList = (nodes, edges, type) => {
    const adjList = {};
    const allNodeIds = new Set();

    // Add nodes from the provided nodes array
    (nodes || []).forEach(node => {
      allNodeIds.add(node.id);
    });

    // Add nodes from edges to ensure all referenced nodes are included
    (edges || []).forEach(edge => {
      allNodeIds.add(edge.source);
      allNodeIds.add(edge.target);
    });

    // Initialize adjList for all collected unique node IDs
    allNodeIds.forEach(nodeId => {
      adjList[nodeId] = [];
    });

    (edges || []).forEach(edge => {
      if (adjList[edge.source]) {
        adjList[edge.source].push(edge.target);
      }
      if (type === 'undirected' && adjList[edge.target]) {
        adjList[edge.target].push(edge.source);
      }
    });

    let result = '';
    const sortedNodeIds = Array.from(allNodeIds).sort(); // Sort all collected unique node IDs
    sortedNodeIds.forEach(nodeId => {
      const neighbors = adjList[nodeId] ? adjList[nodeId].sort() : [];
      result += `${nodeId}: [${neighbors.join(', ')}]
`;
    });
    return result;
  };

  // Function to generate adjacency matrix string
  const generateAdjacencyMatrix = (nodes, edges, type) => {
    const nodeIds = nodes.map(node => node.id).sort();
    const matrixSize = nodeIds.length;
    const matrix = Array(matrixSize).fill(0).map(() => Array(matrixSize).fill(0));

    edges.forEach(edge => {
      const sourceIndex = nodeIds.indexOf(edge.source);
      const targetIndex = nodeIds.indexOf(edge.target);
      if (sourceIndex !== -1 && targetIndex !== -1) {
        matrix[sourceIndex][targetIndex] = 1;
        // For undirected graphs, set the symmetric entry
        if (type === 'undirected') {
          matrix[targetIndex][sourceIndex] = 1;
        }
      }
    });

    // Format the matrix for display
    let result = '  ' + nodeIds.join(' ') + '\n';
    nodeIds.forEach((nodeId, index) => {
      result += `${nodeId} ${matrix[index].join(' ')}\n`;
    });
    return result;
  };

  const startGraphRepresentationVisualization = () => {
    setVisualizationStep(-1); // Reset to start fresh
    if (visualizationTimeoutRef.current) {
      clearTimeout(visualizationTimeoutRef.current);
    }

    const currentNodes = levelData[currentLevel].nodes;
    // Ensure sorted order for consistent visualization step progression
    const sortedNodeIds = currentNodes.map(node => node.id).sort(); 
    let step = 0;

    const visualizeNextStep = () => {
      if (step < sortedNodeIds.length) {
        setVisualizationStep(step);
        visualizationTimeoutRef.current = setTimeout(visualizeNextStep, 1500); // Highlight each node for 1.5 seconds
        step++;
      } else {
        setVisualizationStep(-1); // End visualization
      }
    };

    visualizeNextStep(); // Start the visualization
  };

  const startEdgesVisualization = () => {
    setVisualizationStep(-1); // Reset to start fresh
    if (visualizationTimeoutRef.current) {
      clearTimeout(visualizationTimeoutRef.current);
    }

    const currentEdges = levelData[currentLevel].edges;
    let step = 0;

    const visualizeNextStep = () => {
      if (step < currentEdges.length) {
        setEdgesBeingProcessed(new Set([currentEdges[step].id]));
        visualizationTimeoutRef.current = setTimeout(visualizeNextStep, 1500); // Highlight each edge for 1.5 seconds
        step++;
      } else {
        setEdgesBeingProcessed(new Set()); // End visualization
      }
    };

    visualizeNextStep(); // Start the visualization
  };

  // Function to visualize Directed Graphs (Level 2)
  const startDirectedVisualization = () => {
    if (visualizationTimeoutRef.current) {
      clearTimeout(visualizationTimeoutRef.current);
    }
    setEdges(levelData[currentLevel].directedEdges);
    setEdgesBeingProcessed(new Set()); // Clear any previous highlights
    setVisitedNodes(new Set());
    setVisualizationStep(-1); // No step-by-step for this
  };

  // Function to visualize Undirected Graphs (Level 2)
  const startUndirectedVisualization = () => {
    if (visualizationTimeoutRef.current) {
      clearTimeout(visualizationTimeoutRef.current);
    }
    setEdges(levelData[currentLevel].undirectedEdges);
    setEdgesBeingProcessed(new Set()); // Clear any previous highlights
    setVisitedNodes(new Set());
    setVisualizationStep(-1); // No step-by-step for this
  };

  // Safely access currentConceptExplanations
  const currentConceptExplanations = levelData[currentLevel]?.conceptExplanations || {};
  
  // Calculate if current level is complete
  const levelCompletionStatus = 
    currentLevel === 1 
      ? nodesConceptVisited && edgesConceptVisited
      : currentLevel === 2
        ? directedConceptVisited && undirectedConceptVisited
        : currentLevel === 3
          ? undirectedAdjListConceptVisited && directedAdjListConceptVisited && undirectedAdjMatrixConceptVisited && directedAdjMatrixConceptVisited
          : currentLevel === 4
            ? bfsConceptVisited && dfsConceptVisited
            : currentLevel === 5
              ? undirectedCycleConceptVisited && directedCycleConceptVisited
              : currentLevel === 6
                ? inDegreeConceptVisited && introToposortConceptVisited
                : currentLevel === 7
                  ? shortestPathConceptVisited && dijkstraConceptVisited
                : currentLevel === 8
                  ? mstConceptVisited
                : currentLevel === 9
                  ? dsuConceptVisited
                : currentLevel === 10
                  ? primsConceptVisited && kruskalsConceptVisited
                : false;

  // Add Dijkstra's Algorithm implementation
  const dijkstra = (startNode, nodes, edges) => {
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    
    // Initialize distances and unvisited set
    nodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    });
    distances[startNode] = 0;

    const getNeighbors = (nodeId) => {
      return edges
        .filter(edge => edge.source === nodeId)
        .map(edge => ({
          node: edge.target,
          weight: edge.weight
        }));
    };

    while (unvisited.size > 0) {
      // Find unvisited node with smallest distance
      let current = null;
      let smallestDistance = Infinity;
      
      unvisited.forEach(nodeId => {
        if (distances[nodeId] < smallestDistance) {
          smallestDistance = distances[nodeId];
          current = nodeId;
        }
      });

      if (current === null) break;
      unvisited.delete(current);

      // Update distances to neighbors
      const neighbors = getNeighbors(current);
      neighbors.forEach(({ node, weight }) => {
        const distance = distances[current] + weight;
        if (distance < distances[node]) {
          distances[node] = distance;
          previous[node] = current;
        }
      });
    }

    return { distances, previous };
  };

  // Function to get shortest path
  const getShortestPath = (start, end, previous) => {
    const path = [];
    let current = end;
    
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
    
    return path;
  };

  // Function to start Dijkstra's visualization
  const startDijkstraVisualization = () => {
    setVisualizationStep(0);
    setCurrentStep(0);
    setIsPaused(false);
    setTraversalOrder([]); // Clear any previous traversal order
    setEdgesBeingProcessed(new Set()); // Clear any previous edge highlighting
    setVisitedNodes(new Set()); // Clear any previous visited nodes
    setCurrentQueue([]); // Clear current queue for BFS/DFS, not directly used by Dijkstra's but good to reset
    setCurrentStack([]); // Clear current stack for BFS/DFS, not directly used by Dijkstra's but good to reset
    setIsDijkstraVisualizationRunning(true); // Set visualization to true when started
    setInstructions("Dijkstra's Algorithm visualization in progress. See the description panel for step-by-step details."); // Update top instruction

    if (visualizationTimeoutRef.current) {
      clearTimeout(visualizationTimeoutRef.current);
    }

    const currentNodes = levelData[currentLevel].nodes;
    const currentEdges = levelData[currentLevel].edges;
    const startNodeId = 'A'; // Start node for Dijkstra's visualization
    const endNodeId = 'F'; // End node for Dijkstra's visualization

    // Calculate the actual shortest paths using the dijkstra helper function
    const { distances: finalDistances, previous: finalPrevious } = dijkstra(startNodeId, currentNodes, currentEdges);

    // Dijkstra's Algorithm core logic (adapted for visualization)
    // We'll simulate the algorithm step-by-step for visualization purposes.
    const distances = {};
    const previous = {};
    const unvisited = new Set(currentNodes.map(node => node.id));

    currentNodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
    });
    distances[startNodeId] = 0;

    const getNeighborsWithWeights = (nodeId) => {
      return currentEdges
        .filter(edge => edge.source === nodeId)
        .map(edge => ({
          node: edge.target,
          weight: edge.weight,
          edgeId: `${edge.source}-${edge.target}`
        }));
    };

    let steps = [];

    // Initial state step
    steps.push({
      type: 'initialization',
      distances: { ...distances },
      previous: { ...previous },
      unvisited: new Set(unvisited),
      explanation: `Initialization: Distances set to infinity, ${startNodeId} to 0.`
    });

    const currentDistancesForViz = { ...distances };
    const currentPreviousForViz = { ...previous };
    const currentUnvisitedForViz = new Set(unvisited);

    while (currentUnvisitedForViz.size > 0) {
      let current = null;
      let smallestDistance = Infinity;

      currentUnvisitedForViz.forEach(nodeId => {
        if (currentDistancesForViz[nodeId] < smallestDistance) {
          smallestDistance = currentDistancesForViz[nodeId];
          current = nodeId;
        }
      });

      if (current === null) break; // All remaining unvisited nodes are unreachable

      // Add step for selecting the current node
      steps.push({
        type: 'node_selection',
        node: current,
        distances: { ...currentDistancesForViz },
        previous: { ...currentPreviousForViz },
        unvisited: new Set(currentUnvisitedForViz),
        explanation: `Selected node ${current} with the smallest distance (${smallestDistance}).`
      });

      currentUnvisitedForViz.delete(current);

      const neighbors = getNeighborsWithWeights(current);

      neighbors.forEach(({ node: neighborNodeId, weight, edgeId }) => {
        const newDistance = currentDistancesForViz[current] + weight;
        if (newDistance < currentDistancesForViz[neighborNodeId]) {
          currentDistancesForViz[neighborNodeId] = newDistance;
          currentPreviousForViz[neighborNodeId] = current;

          // Add step for relaxing the edge and updating distance
          steps.push({
            type: 'edge_relaxation',
            source: current,
            target: neighborNodeId,
            edgeId: edgeId,
            newDistance: newDistance,
            distances: { ...currentDistancesForViz },
            previous: { ...currentPreviousForViz },
            unvisited: new Set(currentUnvisitedForViz),
            explanation: `Relaxing edge ${current}→${neighborNodeId}. Updated distance to ${neighborNodeId} to ${newDistance}.`
          });
        }
      });
    }

    // Add final path visualization step (if a path exists to endNodeId)
    const finalPath = getShortestPath(startNodeId, endNodeId, finalPrevious);
    if (finalPath.length > 1 || (finalPath.length === 1 && finalPath[0] === startNodeId && startNodeId === endNodeId)) {
      const finalPathEdges = new Set();
      for (let i = 0; i < finalPath.length - 1; i++) {
        finalPathEdges.add(`${finalPath[i]}-${finalPath[i+1]}`);
      }
      steps.push({
        type: 'final_path',
        path: finalPath,
        edges: finalPathEdges,
        distances: { ...finalDistances },
        previous: { ...finalPrevious },
        unvisited: new Set(),
        explanation: `Shortest path from ${startNodeId} to ${endNodeId} found: ${finalPath.join(' → ')}.`
      });
    }

    setAllDijkstraSteps(steps);

    let stepIndex = 0;
    const visualizeNextDijkstraStep = () => {
      if (stepIndex < steps.length && !isPaused) {
        const currentVizStep = steps[stepIndex];

        // Update visualization state based on the current step type
        setCurrentStep(stepIndex);
        setTraversalOrder(currentVizStep.path || []); // For final path
        
        // Set visited nodes
        const visitedNodesForDisplay = new Set();
        const unvisitedSetForDisplay = currentVizStep.unvisited || new Set();
        currentNodes.forEach(node => {
          if (!unvisitedSetForDisplay.has(node.id)) {
            visitedNodesForDisplay.add(node.id);
          }
        });
        setVisitedNodes(visitedNodesForDisplay);

        setEdgesBeingProcessed(new Set()); // Clear edges before processing new ones
        if (currentVizStep.type === 'edge_relaxation') {
          setEdgesBeingProcessed(new Set([currentVizStep.edgeId]));
        } else if (currentVizStep.type === 'final_path') {
          setEdgesBeingProcessed(currentVizStep.edges);
        }

        // Set the current distances and previous for display
        setCurrentDistances(currentVizStep.distances || {});
        setCurrentPrevious(currentVizStep.previous || {});

        // Set the current processing node
        setCurrentProcessingNode(currentVizStep.type === 'node_selection' ? currentVizStep.node : null);

        stepIndex++;
        visualizationTimeoutRef.current = setTimeout(visualizeNextDijkstraStep, 1500); // 1.5 second delay
      } else {
        setVisualizationStep(-1); // End visualization
        setCurrentStep(0);
        setIsPaused(false);
        setInstructions(levelData[currentLevel].instructions);
        setTraversalOrder([]);
        setEdgesBeingProcessed(new Set());
        setVisitedNodes(new Set());
        setCurrentDistances({});
        setCurrentPrevious({});
        setCurrentProcessingNode(null);
        setIsDijkstraVisualizationRunning(false);
      }
    };

    visualizeNextDijkstraStep();
  };

  // Function to start Shortest Path Problem visualization
  const startShortestPathVisualization = () => {
    setVisualizationStep(-1); // Clear any ongoing visualization
    if (visualizationTimeoutRef.current) {
      clearTimeout(visualizationTimeoutRef.current);
    }
    setVisitedNodes(new Set());
    setEdgesBeingProcessed(new Set());

    const pathExample = levelData[currentLevel]?.shortestPathExample;

    if (!pathExample) {
      console.error("Shortest path example not defined for this level.");
      return;
    }

    const { path } = pathExample;

    // Highlight nodes in the path
    setVisitedNodes(new Set(path));

    // Highlight edges in the path
    const pathEdges = new Set();
    for (let i = 0; i < path.length - 1; i++) {
      pathEdges.add(`${path[i]}-${path[i + 1]}`);
    }
    setEdgesBeingProcessed(pathEdges);
  };

  const startBellmanFordVisualization = () => {
    setVisualizationStep(0);
    setCurrentStep(0);
    setIsPaused(false);
    setTraversalOrder([]);
    setEdgesBeingProcessed(new Set());
    setVisitedNodes(new Set());
    setHasNegativeCycle(false);
    setInstructions("Bellman-Ford Algorithm visualization in progress. Use Next/Prev to step through.");
    setBellmanFordManualMode(true);
    setBellmanFordStepIndex(0);

    if (visualizationTimeoutRef.current) {
      clearTimeout(visualizationTimeoutRef.current);
    }

    const currentNodes = levelData[currentLevel].nodes;
    const currentEdges = levelData[currentLevel].edges;
    const startNodeId = '0';
    const steps = [];

    // Initialize distances
    const distances = {};
    const previous = {};
    currentNodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
    });
    distances[startNodeId] = 0;

    // Initial step
    steps.push({
      type: 'initialization',
      distances: { ...distances },
      previous: { ...previous },
      explanation: `Start: All distances are ∞ except for node ${startNodeId}, which is 0.`
    });

    // Main Bellman-Ford algorithm
    for (let i = 0; i < currentNodes.length - 1; i++) {
      steps.push({
        type: 'iteration',
        iteration: i + 1,
        explanation: `Iteration ${i + 1}: Relax all edges.`
      });
      currentEdges.forEach(edge => {
        const { source, target, weight } = edge;
        const oldDistance = distances[target];
        if (distances[source] !== Infinity && distances[source] + weight < distances[target]) {
          distances[target] = distances[source] + weight;
          previous[target] = source;
          steps.push({
            type: 'edge_relaxation',
            source,
            target,
            weight,
            distances: { ...distances },
            previous: { ...previous },
            changed: target,
            explanation: `Relaxing edge ${source}→${target} (weight ${weight}): Distance to ${target} updated from ${oldDistance === Infinity ? '∞' : oldDistance} to ${distances[target]}.`
          });
        } else {
          steps.push({
            type: 'edge_relaxation',
            source,
            target,
            weight,
            distances: { ...distances },
            previous: { ...previous },
            changed: null,
            explanation: `Relaxing edge ${source}→${target} (weight ${weight}): No update needed.`
          });
        }
      });
    }

    // Check for negative cycles
    let hasNegativeCycle = false;
    currentEdges.forEach(edge => {
      const { source, target, weight } = edge;
      if (distances[source] !== Infinity && distances[source] + weight < distances[target]) {
        hasNegativeCycle = true;
        steps.push({
          type: 'negative_cycle',
          source,
          target,
          weight,
          explanation: `Negative cycle detected! Edge ${source}→${target} with weight ${weight} creates a negative cycle.`
        });
      }
    });

    if (!hasNegativeCycle) {
      steps.push({
        type: 'completion',
        distances: { ...distances },
        previous: { ...previous },
        explanation: "Bellman-Ford algorithm completed. No negative cycles found. Final distances shown."
      });
    }

    setBellmanFordSteps(steps);
    setHasNegativeCycle(hasNegativeCycle);
    setCurrentDistances(steps[0].distances || {});
    setEdgesBeingProcessed(new Set());
  };

  // Add handlers for next/prev step
  const bellmanFordNextStep = () => {
    if (!bellmanFordManualMode) return;
    if (bellmanFordStepIndex < bellmanFordSteps.length - 1) {
      const nextIndex = bellmanFordStepIndex + 1;
      setBellmanFordStepIndex(nextIndex);
      const step = bellmanFordSteps[nextIndex];
      setCurrentDistances(step.distances || {});
      setEdgesBeingProcessed(step.type === 'edge_relaxation' ? new Set([`${step.source}-${step.target}`]) : new Set());
      setVisitedNodes(step.changed ? new Set([step.changed]) : new Set());
    }
  };
  const bellmanFordPrevStep = () => {
    if (!bellmanFordManualMode) return;
    if (bellmanFordStepIndex > 0) {
      const prevIndex = bellmanFordStepIndex - 1;
      setBellmanFordStepIndex(prevIndex);
      const step = bellmanFordSteps[prevIndex];
      setCurrentDistances(step.distances || {});
      setEdgesBeingProcessed(step.type === 'edge_relaxation' ? new Set([`${step.source}-${step.target}`]) : new Set());
      setVisitedNodes(step.changed ? new Set([step.changed]) : new Set());
    }
  };
  const bellmanFordRestart = () => {
    if (!bellmanFordManualMode) return;
    setBellmanFordStepIndex(0);
    const step = bellmanFordSteps[0];
    setCurrentDistances(step.distances || {});
    setEdgesBeingProcessed(new Set());
    setVisitedNodes(new Set());
  };

  const startFloydWarshallVisualization = () => {
    setVisualizationStep(0);
    setCurrentStep(0);
    setIsPaused(false);
    setTraversalOrder([]);
    setEdgesBeingProcessed(new Set());
    setVisitedNodes(new Set());
    setHasNegativeCycle(false);
    setInstructions("Floyd-Warshall Algorithm visualization in progress. See the description panel for step-by-step details.");

    if (visualizationTimeoutRef.current) {
      clearTimeout(visualizationTimeoutRef.current);
    }

    const currentNodes = levelData[currentLevel].nodes;
    const currentEdges = levelData[currentLevel].edges;
    const steps = [];

    // Initialize distance matrix
    const n = currentNodes.length;
    const nodeIds = currentNodes.map(node => node.id);
    let dist = Array(n).fill().map(() => Array(n).fill(Infinity));
    let next = Array(n).fill().map(() => Array(n).fill(null));

    // Set diagonal to 0
    for (let i = 0; i < n; i++) {
      dist[i][i] = 0;
    }

    // Set direct edges
    currentEdges.forEach(edge => {
      const i = nodeIds.indexOf(edge.source);
      const j = nodeIds.indexOf(edge.target);
      dist[i][j] = edge.weight;
      next[i][j] = j;
    });

    // Initial step
    steps.push({
      type: 'initialization',
      matrix: dist.map(row => [...row]),
      next: next.map(row => [...row]),
      explanation: "Initializing distance matrix with direct edges."
    });

    // Main Floyd-Warshall algorithm
    for (let k = 0; k < n; k++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] !== Infinity && dist[k][j] !== Infinity && 
              dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            next[i][j] = next[i][k];

            steps.push({
              type: 'update',
              k: nodeIds[k],
              i: nodeIds[i],
              j: nodeIds[j],
              matrix: dist.map(row => [...row]),
              next: next.map(row => [...row]),
              explanation: `Using ${nodeIds[k]} as intermediate vertex, updating distance from ${nodeIds[i]} to ${nodeIds[j]} to ${dist[i][j]}.`
            });
          }
        }
      }
    }

    // Check for negative cycles
    let hasNegativeCycle = false;
    for (let i = 0; i < n; i++) {
      if (dist[i][i] < 0) {
        hasNegativeCycle = true;
        steps.push({
          type: 'negative_cycle',
          node: nodeIds[i],
          explanation: `Negative cycle detected! Node ${nodeIds[i]} is part of a negative cycle.`
        });
      }
    }

    if (!hasNegativeCycle) {
      steps.push({
        type: 'completion',
        matrix: dist.map(row => [...row]),
        next: next.map(row => [...row]),
        explanation: "Floyd-Warshall algorithm completed successfully. No negative cycles found."
      });
    }

    setFloydWarshallSteps(steps);
    setDistanceMatrix(dist);
    setHasNegativeCycle(hasNegativeCycle);

    let stepIndex = 0;
    const visualizeNextStep = () => {
      if (stepIndex < steps.length && !isPaused) {
        const currentVizStep = steps[stepIndex];

        setCurrentStep(stepIndex);
        if (currentVizStep.matrix) {
          setDistanceMatrix(currentVizStep.matrix);
        }

        if (currentVizStep.type === 'update') {
          setEdgesBeingProcessed(new Set([
            `${currentVizStep.i}-${currentVizStep.k}`,
            `${currentVizStep.k}-${currentVizStep.j}`
          ]));
        } else {
          setEdgesBeingProcessed(new Set());
        }

        stepIndex++;
        visualizationTimeoutRef.current = setTimeout(visualizeNextStep, 1500);
      } else {
        setVisualizationStep(-1);
        setCurrentStep(0);
        setIsPaused(false);
        setInstructions(levelData[currentLevel].instructions);
        setTraversalOrder([]);
        setEdgesBeingProcessed(new Set());
        setVisitedNodes(new Set());
        setDistanceMatrix([]);
      }
    };

    visualizeNextStep();
  };

  const renderDistanceMatrix = () => {
    if (selectedConcept === 'floydWarshall' && distanceMatrix.length > 0) {
      const nodeIds = levelData[currentLevel].nodes.map(node => node.id);
      return (
        <div className="distance-matrix">
          <h3>Distance Matrix</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                {nodeIds.map(id => <th key={id}>{id}</th>)}
              </tr>
            </thead>
            <tbody>
              {distanceMatrix.map((row, i) => (
                <tr key={nodeIds[i]}>
                  <th>{nodeIds[i]}</th>
                  {row.map((dist, j) => (
                    <td key={j}>{dist === Infinity ? '∞' : dist}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  };

  const startDisjointSetVisualization = () => {
    setVisualizationStep(-1);
    if (visualizationTimeoutRef.current) {
      clearTimeout(visualizationTimeoutRef.current);
    }
    setVisitedNodes(new Set());
    setEdgesBeingProcessed(new Set());

    const currentNodes = levelData[currentLevel].nodes;
    const currentEdges = levelData[currentLevel].edges;
    
    // Initialize disjoint set
    const parent = {};
    const rank = {};
    currentNodes.forEach(node => {
      parent[node.id] = node.id;
      rank[node.id] = 0;
    });

    let step = 0;
    const totalSteps = currentEdges.length;

    const visualizeNextStep = () => {
      if (step >= totalSteps) {
        setVisualizationStep(-1);
        return;
      }

      const edge = currentEdges[step];
      setCurrentOperation('Union');
      setCurrentOperationNodes([edge.source, edge.target]);
      setEdgesBeingProcessed(new Set([`${edge.source}-${edge.target}`]));

      // Perform union operation
      const rootX = find(edge.source);
      const rootY = find(edge.target);

      if (rootX !== rootY) {
        if (rank[rootX] < rank[rootY]) {
          parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
          parent[rootY] = rootX;
        } else {
          parent[rootY] = rootX;
          rank[rootX]++;
        }
      }

      step++;
      visualizationTimeoutRef.current = setTimeout(() => {
        visualizeNextStep();
      }, 2000);
    };

    visualizeNextStep();
  };

  const find = (nodeId) => {
    // This find function is for Level 9 DSU operations.
    // It takes the current dsuState.parent and applies path compression,
    // then updates dsuState with the new parent map.
    let currentParent = { ...dsuState.parent }; // Create a mutable copy for path compression
    let path = [];
    let current = nodeId;

    // Find the root
    while (currentParent[current] !== current) {
      path.push(current);
      current = currentParent[current];
    }
    const root = current;

    // Path compression: make all nodes on the path point directly to the root
    for (const nodeOnPath of path) {
      currentParent[nodeOnPath] = root;
    }
    // Update dsuState with the path-compressed parent map
    setDsuState(prevState => ({
      ...prevState,
      parent: currentParent
    }));
    return root;
  };

  const union = (x, y) => {
    // This union function is for Level 9 DSU operations.
    // It takes the current dsuState.parent and rank,
    // performs union by rank, and updates dsuState with new maps.
    let currentParent = { ...dsuState.parent };
    let currentRank = { ...dsuState.rank };

    const rootX = find(x); // Use the modified find that updates dsuState
    const rootY = find(y); // Use the modified find that updates dsuState
    
    if (rootX === rootY) {
      return { merged: false, rootX, rootY }; // Already in same set
    }
    
    // Union by rank: attach smaller rank tree under root of higher rank tree
    if (currentRank[rootX] < currentRank[rootY]) {
      currentParent[rootX] = rootY;
    } else if (currentRank[rootX] > currentRank[rootY]) {
      currentParent[rootY] = rootX;
    } else {
      currentParent[rootY] = rootX;
      currentRank[rootX]++;
    }
    
    // Update dsuState with the new parent and rank maps
    setDsuState(prevState => ({
      ...prevState,
      parent: currentParent,
      rank: currentRank
    }));
    return { merged: true, rootX, rootY };
  };

  // Add DSU operation visualization
  const visualizeDSUOperation = (operation, node1, node2) => {
    setDsuOperation(operation);
    setDsuOperationNodes([node1, node2]);
    
    if (operation === 'find') {
      const root = find(node1); // This now also triggers setDsuState for path compression
      setDsuExplanation(`Find(${node1}) = ${root}`);
      setVisitedNodes(new Set([node1]));
    } else if (operation === 'union') {
      const { merged, rootX, rootY } = union(node1, node2); // This now also triggers setDsuState for union
      if (merged) {
        setDsuExplanation(`Union(${node1}, ${node2}):\nGroups ${rootX} and ${rootY} are now connected`);
      } else {
        setDsuExplanation(`Union(${node1}, ${node2}):\nNodes ${node1} and ${node2} are already in the same set (root: ${rootX})`);
      }
      setVisitedNodes(new Set([node1, node2]));
    }
  };

  // Add DSU operation buttons
  const DSUOperationButtons = () => {
    const nodes = levelData[currentLevel].nodes;
    const edges = levelData[currentLevel].edges;
    
    return (
      <div className="mt-4 space-y-2">
        <div className="flex flex-wrap gap-2">
          {nodes.map(node => (
            <button
              key={`find-${node.id}`}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              onClick={() => visualizeDSUOperation('find', node.id)}
            >
              Find({node.id})
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {edges.map((edge, index) => (
            <button
              key={`union-${index}`}
              className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
              onClick={() => visualizeDSUOperation('union', edge.source, edge.target)}
            >
              Union({edge.source}, {edge.target})
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Add DSU visualization component
  const DSUVisualization = () => {
    return (
      <div className="mt-4 space-y-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="space-y-4">
            {/* <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium text-gray-700 mb-2">Groups</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(dsuState.parent).map(([node, parent]) => (
                  <div key={node} className="flex justify-between p-2 bg-gray-100 rounded">
                    <span>Node {node}:</span>
                    <span className={parent === node ? "text-green-600" : "text-blue-600"}>
                      Group {parent}
                    </span>
                  </div>
                ))}
              </div>
            </div>
             */}
            {/* {dsuOperation && (
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-blue-600 whitespace-pre-line">{dsuExplanation}</p>
              </div>
            )} */}
            
            {/* <DSUOperationButtons /> */}
          </div>
        </div>
      </div>
    );
  };

  // Add a helper function to check if all nodes are connected for DSU level completion
  const areAllNodesConnected = useCallback(() => {
    if (!dsuState?.parent || nodes.length === 0) return false;
    const initialRoot = find(nodes[0].id);
    return nodes.every(node => find(node.id) === initialRoot);
  }, [dsuState, nodes]);

  // useEffect to dynamically update level completion for DSU
  useEffect(() => {
    if (currentLevel === 9) {
      setIsLevelComplete(areAllNodesConnected());
    }
  }, [dsuState, currentLevel, areAllNodesConnected]);

  // Add Prim's Algorithm visualization
  const startPrimsVisualization = () => {
    setMstEdges([]);
    setMstWeight(0);
    setMstStep(0);
    setMstStepIndex(0);
    setIsMSTPaused(false);
    setMstExplanation("Starting Prim's algorithm visualization...\n\nStep 1: Initialize with any vertex (we'll start with A)");
    setPrimsConceptVisited(true);
    setSelectedConcept('prims');
    setVisitedNodes(new Set(['A'])); // Start with node A
    setEdgesBeingProcessed(new Set());

    const currentNodes = levelData[currentLevel].nodes;
    const currentEdges = levelData[currentLevel].edges;
    
    // Create adjacency list for easier neighbor lookup
    const adjList = {};
    currentNodes.forEach(node => {
      adjList[node.id] = [];
    });
    currentEdges.forEach(edge => {
      adjList[edge.source].push({ target: edge.target, weight: edge.weight });
      adjList[edge.target].push({ target: edge.source, weight: edge.weight });
    });

    // Generate all steps upfront for better control
    const steps = [];
    const visited = new Set(['A']);
    let currentMSTEdges = [];
    let currentMSTWeight = 0;

    // Initial step
    steps.push({
      type: 'initialization',
      visited: new Set(['A']),
      edges: [],
      weight: 0,
      explanation: "Starting Prim's algorithm from node A. We'll grow the MST by adding the minimum weight edge that connects to an unvisited node."
    });

    while (visited.size < currentNodes.length) {
      let minEdge = null;
      let minWeight = Infinity;

      // Find minimum weight edge from visited to unvisited nodes
      visited.forEach(nodeId => {
        adjList[nodeId].forEach(neighbor => {
          if (!visited.has(neighbor.target) && neighbor.weight < minWeight) {
            minWeight = neighbor.weight;
            minEdge = { source: nodeId, target: neighbor.target, weight: neighbor.weight };
          }
        });
      });

      if (minEdge) {
        visited.add(minEdge.target);
        currentMSTEdges.push(minEdge);
        currentMSTWeight += minEdge.weight;

        steps.push({
          type: 'add_edge',
          visited: new Set(visited),
          edges: [...currentMSTEdges],
          weight: currentMSTWeight,
          edge: minEdge,
          explanation: `Adding edge ${minEdge.source}-${minEdge.target} (weight: ${minEdge.weight})\n` +
            `This is the minimum weight edge connecting a visited node to an unvisited node.\n` +
            `Current MST weight: ${currentMSTWeight}\n` +
            `Visited nodes: ${Array.from(visited).join(', ')}`
        });
      }
    }

    // Final step
    steps.push({
      type: 'complete',
      visited: new Set(visited),
      edges: currentMSTEdges,
      weight: currentMSTWeight,
      explanation: `Prim's algorithm complete!\n\n` +
        `Final MST Properties:\n` +
        `- Total Weight: ${currentMSTWeight}\n` +
        `- Number of Edges: ${currentMSTEdges.length}\n` +
        `- Number of Nodes: ${visited.size}\n\n` +
        `Edges in MST:\n` +
        currentMSTEdges.map(e => `- ${e.source}-${e.target} (weight: ${e.weight})`).join('\n')
    });

    setMstSteps(steps);
    visualizeNextMSTStep();
  };

  // Add Kruskal's Algorithm visualization
  const startKruskalsVisualization = () => {
    setMstEdges([]);
    setMstWeight(0);
    setMstStep(0);
    setMstStepIndex(0);
    setIsMSTPaused(false);
    setMstExplanation("Starting Kruskal's algorithm visualization...\n\nStep 1: Sort all edges by weight");
    setKruskalsConceptVisited(true);
    setSelectedConcept('kruskals');
    setVisitedNodes(new Set());
    setEdgesBeingProcessed(new Set());

    const currentNodes = levelData[currentLevel].nodes;
    const currentEdges = [...levelData[currentLevel].edges].sort((a, b) => a.weight - b.weight);
    
    // Initialize DSU
    const parent = {};
    const rank = {};
    currentNodes.forEach(node => {
      parent[node.id] = node.id;
      rank[node.id] = 0;
    });

    // Generate all steps upfront for better control
    const steps = [];
    let currentMSTEdges = [];
    let currentMSTWeight = 0;

    // Initial step
    steps.push({
      type: 'initialization',
      edges: [],
      weight: 0,
      dsuState: { ...parent },
      explanation: "Starting Kruskal's algorithm. We'll process edges in order of increasing weight, adding them if they don't create a cycle."
    });

    const find = (x) => {
      if (parent[x] !== x) {
        parent[x] = find(parent[x]);
      }
      return parent[x];
    };

    const union = (x, y) => {
      const rootX = find(x);
      const rootY = find(y);
      if (rootX === rootY) return false;

      if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY;
      } else if (rank[rootX] > rank[rootY]) {
        parent[rootY] = rootX;
      } else {
        parent[rootY] = rootX;
        rank[rootX]++;
      }
      return true;
    };

    currentEdges.forEach((edge, index) => {
      const sourceRoot = find(edge.source);
      const targetRoot = find(edge.target);

      if (sourceRoot !== targetRoot) {
        union(edge.source, edge.target);
        currentMSTEdges.push(edge);
        currentMSTWeight += edge.weight;

        steps.push({
          type: 'add_edge',
          edges: [...currentMSTEdges],
          weight: currentMSTWeight,
          edge: edge,
          dsuState: { ...parent },
          explanation: `Step ${index + 1}: Adding edge ${edge.source}-${edge.target} (weight: ${edge.weight})\n` +
            `This edge connects two different components and doesn't create a cycle.\n` +
            `Current MST weight: ${currentMSTWeight}\n` +
            `Edges in MST: ${currentMSTEdges.length}`
        });
      } else {
        steps.push({
          type: 'skip_edge',
          edges: [...currentMSTEdges],
          weight: currentMSTWeight,
          edge: edge,
          dsuState: { ...parent },
          explanation: `Step ${index + 1}: Skipping edge ${edge.source}-${edge.target} (weight: ${edge.weight})\n` +
            `This edge would create a cycle (nodes ${edge.source} and ${edge.target} are in the same component).\n` +
            `Current MST weight: ${currentMSTWeight}`
        });
      }
    });

    // Final step
    steps.push({
      type: 'complete',
      edges: currentMSTEdges,
      weight: currentMSTWeight,
      dsuState: { ...parent },
      explanation: `Kruskal's algorithm complete!\n\n` +
        `Final MST Properties:\n` +
        `- Total Weight: ${currentMSTWeight}\n` +
        `- Number of Edges: ${currentMSTEdges.length}\n` +
        `- Number of Nodes: ${currentNodes.length}\n\n` +
        `Edges in MST:\n` +
        currentMSTEdges.map(e => `- ${e.source}-${e.target} (weight: ${e.weight})`).join('\n')
    });

    setMstSteps(steps);
    visualizeNextMSTStep();
  };

  // Function to visualize next MST step
  const visualizeNextMSTStep = () => {
    if (isMSTPaused || mstStepIndex >= mstSteps.length) return;

    const step = mstSteps[mstStepIndex];
    setMstStepIndex(prev => prev + 1);
    setMstExplanation(step.explanation);

    if (step.type === 'add_edge') {
      setMstEdges(step.edges);
      setMstWeight(step.weight);
      setEdgesBeingProcessed(new Set([`${step.edge.source}-${step.edge.target}`]));
      if (selectedConcept === 'prims') {
        setVisitedNodes(step.visited);
      }
    } else if (step.type === 'skip_edge') {
      setEdgesBeingProcessed(new Set([`${step.edge.source}-${step.edge.target}`]));
    } else if (step.type === 'complete') {
      setMstEdges(step.edges);
      setMstWeight(step.weight);
      setEdgesBeingProcessed(new Set(step.edges.map(e => `${e.source}-${e.target}`)));
      if (selectedConcept === 'prims') {
        setVisitedNodes(step.visited);
      }
    }

    if (!isMSTPaused && mstStepIndex + 1 < mstSteps.length) {
      visualizationTimeoutRef.current = setTimeout(visualizeNextMSTStep, 2000);
    }
  };

  // Function to visualize previous MST step
  const visualizePrevMSTStep = () => {
    if (mstStepIndex <= 1) return;

    const newIndex = mstStepIndex - 2; // -2 because we want to go back one step from current
    const step = mstSteps[newIndex];
    setMstStepIndex(newIndex + 1);
    setMstExplanation(step.explanation);

    if (step.type === 'add_edge' || step.type === 'complete') {
      setMstEdges(step.edges);
      setMstWeight(step.weight);
      if (step.edge) {
        setEdgesBeingProcessed(new Set([`${step.edge.source}-${step.edge.target}`]));
      }
      if (selectedConcept === 'prims' && step.visited) {
        setVisitedNodes(step.visited);
      }
    }
  };

  // Function to toggle MST visualization pause
  const toggleMSTPause = () => {
    setIsMSTPaused(prev => !prev);
    if (!isMSTPaused) {
      if (visualizationTimeoutRef.current) {
        clearTimeout(visualizationTimeoutRef.current);
      }
    } else {
      visualizeNextMSTStep();
    }
  };

  // Function to reset MST visualization
  const resetMSTVisualization = () => {
    if (visualizationTimeoutRef.current) {
      clearTimeout(visualizationTimeoutRef.current);
    }
    setMstEdges([]);
    setMstWeight(0);
    setMstStep(0);
    setMstStepIndex(0);
    setIsMSTPaused(false);
    setMstSteps([]);
    setMstExplanation('');
    setVisitedNodes(new Set());
    setEdgesBeingProcessed(new Set());
    if (selectedConcept === 'prims') {
      startPrimsVisualization();
    } else if (selectedConcept === 'kruskals') {
      startKruskalsVisualization();
    }
  };

  const startNodesVisualization = () => {
    setVisualizationStep(-1); // Reset to start fresh
    if (visualizationTimeoutRef.current) {
      clearTimeout(visualizationTimeoutRef.current);
    }

    const currentNodes = levelData[currentLevel].nodes;
    // Ensure sorted order for consistent visualization step progression
    const sortedNodeIds = currentNodes.map(node => node.id).sort(); 
    let step = 0;

    const visualizeNextStep = () => {
      if (step < sortedNodeIds.length) {
        setVisualizationStep(step);
        visualizationTimeoutRef.current = setTimeout(visualizeNextStep, 1500); // Highlight each node for 1.5 seconds
        step++;
      } else {
        setVisualizationStep(-1); // End visualization
      }
    };

    visualizeNextStep(); // Start the visualization
  };

  // Suppress React DevTools message in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        if (!args[0]?.includes('Download the React DevTools')) {
          originalConsoleLog.apply(console, args);
        }
      };
    }
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log = console.log;
      }
    };
  }, []);

  // Add useEffect to check level completion
  useEffect(() => {
    let levelIsComplete = false;
    const currentLevelData = levelData[currentLevel];
    
    if (currentLevel === 1) {
      levelIsComplete = currentLevelData.levelCompleteConditions(nodesConceptVisited, edgesConceptVisited);
    } else if (currentLevel === 2) {
      levelIsComplete = currentLevelData.levelCompleteConditions(directedConceptVisited, undirectedConceptVisited);
    } else if (currentLevel === 3) {
      levelIsComplete = currentLevelData.levelCompleteConditions(
        undirectedAdjListConceptVisited,
        directedAdjListConceptVisited,
        undirectedAdjMatrixConceptVisited,
        directedAdjMatrixConceptVisited
      );
    } else if (currentLevel === 4) {
      levelIsComplete = currentLevelData.levelCompleteConditions(bfsVisited, dfsVisited);
    } else if (currentLevel === 5) {
      levelIsComplete = currentLevelData.levelCompleteConditions(undirectedCycleConceptVisited, directedCycleConceptVisited);
    } else if (currentLevel === 6) {
      levelIsComplete = currentLevelData.levelCompleteConditions(inDegreeConceptVisited, introToposortConceptVisited);
    } else if (currentLevel === 7) {
      levelIsComplete = currentLevelData.levelCompleteConditions(shortestPathConceptVisited, dijkstraConceptVisited);
    } else if (currentLevel === 8) {
      levelIsComplete = mstCompleted;
    } else if (currentLevel === 9) {
      levelIsComplete = dsuCompleted;
    } else if (currentLevel === 10) {
      levelIsComplete = primsCompleted && kruskalsCompleted;
    }

    if (levelIsComplete && !completedLevels.has(currentLevel)) {
      console.log('Level completion detected, calling handleLevelComplete for level:', currentLevel);
      handleLevelComplete(currentLevel);
      }
  }, [
    currentLevel,
    nodesConceptVisited,
    edgesConceptVisited,
    directedConceptVisited,
    undirectedConceptVisited,
    undirectedAdjListConceptVisited,
    directedAdjListConceptVisited,
    undirectedAdjMatrixConceptVisited,
    directedAdjMatrixConceptVisited,
    bfsVisited,
    dfsVisited,
    undirectedCycleConceptVisited,
    directedCycleConceptVisited,
    inDegreeConceptVisited,
    introToposortConceptVisited,
    shortestPathConceptVisited,
    dijkstraConceptVisited,
    mstCompleted,
    dsuCompleted,
    primsCompleted,
    kruskalsCompleted,
    completedLevels
  ]);

  return (
    <div className="relative min-h-screen">
      <GameDecorations />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-100 to-white-200 p-8">
        {/* Success Message Modal */}

        <div className="flex flex-col min-h-screen p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 relative">
          
          {/* Simple Navigation Header */}
          <div className="flex justify-between items-center mb-6">
            {/* Previous Level Button */}
            <button
              onClick={() => setCurrentLevel(prev => Math.max(prev - 1, 1))}
              disabled={currentLevel === 1}
              className={`px-6 py-3 rounded-lg font-semibold shadow transition-colors duration-300 ${
                currentLevel === 1 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              ← Previous Level
            </button>

            {/* Circular Level Indicators */}
            <div className="flex space-x-2">
              {Array.from({ length: 10 }, (_, index) => {
                const levelNum = index + 1;
                const isCompleted = completedLevels.has(levelNum);
                const isCurrent = currentLevel === levelNum;
                return (
                  <div
                    key={levelNum}
                    onClick={() => {
                      if (!isCurrent) setCurrentLevel(levelNum);
                    }}
                    className={`w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-200 cursor-pointer
                      ${isCompleted ? 'bg-green-500 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-600'}
                      ${isCurrent ? 'ring-2 ring-blue-500 scale-110' : 'hover:border-blue-400 hover:scale-105'}
                    `}
                  >
                    {levelNum}
                  </div>
                );
              })}
            </div>

            {/* Next Level Button */}
            <button
              onClick={() => setCurrentLevel(prev => Math.min(prev + 1, 10))}
              disabled={currentLevel === 10}
              className={`px-6 py-3 rounded-lg font-semibold shadow transition-colors duration-300 ${
                currentLevel === 10 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              Next Level →
            </button>
          </div>

          <div className="flex gap-4 mb-5">
            {currentLevel === 1 && (
              <>
                <div className="flex gap-4 mb-5">
                  <div 
                    className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedConcept === 'nodes' 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleConceptClick('nodes')}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-blue-600">Nodes</h3>
                      {nodesConceptVisited && (
                        <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
                          ✓ Visited
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">Click to learn about graph nodes</p>
                  </div>
                  <div 
                    className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedConcept === 'edges' 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleConceptClick('edges')}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-blue-600">Edges</h3>
                      {edgesConceptVisited && (
                        <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
                          ✓ Visited
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">Click to learn about graph edges</p>
                  </div>
                </div>

                {/* Level 1 Completion Message */}
                {nodesConceptVisited && edgesConceptVisited && (
                  <div className="mb-5 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg border-2 border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Level 1 Complete!</h3>
                      </div>
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                        Ready for Level 2
                      </span>
                    </div>
                    <div className="pl-13">
                      <p className="text-gray-700 mb-2">
                        Excellent work! You've successfully learned about the fundamental components of graphs:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                        <li>Nodes: The fundamental units that represent entities in a graph</li>
                        <li>Edges: The connections that show relationships between nodes</li>
                      </ul>
                      <p className="mt-3 text-gray-700 font-medium">
                        You're now ready to explore different types of graphs in the next level!
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
            {currentLevel === 2 && (
              <>
               {/* <div className="flex gap-4 mb-5">
                <div 
                  className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedConcept === 'directed' 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleConceptClick('directed')}
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">Directed Graphs</h3>
                  {directedConceptVisited && (
                    <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
                      ✓ Visited
                    </span>
                  )}
                  <p className="text-gray-600">Click to learn about graphs with direction</p>
                </div>
                <div 
                  className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedConcept === 'undirected' 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleConceptClick('undirected')}
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">Undirected Graphs</h3>
                  {undirectedConceptVisited && (
                    <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
                      ✓ Visited
                    </span>
                  )}
                  <p className="text-gray-600">Click to learn about graphs without direction</p>
                </div>
                </div> */}
                <div className="flex gap-4 mb-5">
                  <div 
                    className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedConcept === 'directed' 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleConceptClick('directed')}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-blue-600">Directed Graphs</h3>
                      {directedConceptVisited && (
                        <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
                          ✓ Visited
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">Click to learn about graphs with direction</p>
                  </div>
                  <div 
                    className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedConcept === 'undirected' 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleConceptClick('undirected')}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-semibold text-blue-600">undirected Graphs</h3>
                      {undirectedConceptVisited && (
                        <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
                          ✓ Visited
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">Click to learn about graphs without direction</p>
                  </div>
                </div>
                {currentLevel === 2 && directedConceptVisited && undirectedConceptVisited && (
              
              <div className="mb-5 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg border-2 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Level 2 Complete!</h3>
                  </div>
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                    Ready for Level 3
                  </span>
                </div>
                <div className="pl-13">
                  <p className="text-gray-700 mb-2">
                    {level2CompletionMessage}
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li>Directed Graphs: Edges have a specific direction (e.g., A → B)</li>
                    <li>Undirected Graphs: Edges have no direction (e.g., A — B)</li>
                  </ul>
                  <p className="mt-3 text-gray-700 font-medium">
                    You're now ready to explore different graph representations in the next level!
                  </p>
                </div>
              </div>
            )}
              </>
            )}
            {currentLevel === 3 && (
              <>
                {undirectedAdjListConceptVisited && directedAdjListConceptVisited && undirectedAdjMatrixConceptVisited && directedAdjMatrixConceptVisited && (
                  <div className="mb-5 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg border-2 border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Level 3 Complete!</h3>
                      </div>
                      <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                        Ready for Level 4
                      </span>
                    </div>
                    <div className="pl-13">
                      <p className="text-gray-700 mb-2">
                        Fantastic! You've grasped how to represent graphs using Adjacency Lists and Matrices for both directed and undirected graphs!
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                        <li>Undirected Adjacency List: Shows direct neighbors for undirected graphs.</li>
                        <li>Directed Adjacency List: Shows outgoing connections for directed graphs.</li>
                        <li>Undirected Adjacency Matrix: A symmetric matrix where '1' means an edge exists.</li>
                        <li>Directed Adjacency Matrix: A matrix where '1' means an edge from row to column exists.</li>
                      </ul>
                      <div className="mt-4">
                        <p className="text-gray-700 font-medium">
                          You're now ready to explore different graph representations in the next level!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                  <div 
                    className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedConcept === 'undirectedAdjList' 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleConceptClick('undirectedAdjList')}
                  >
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">Undirected Adjacency List</h3>
                    <p className="text-gray-600">Graph representation</p>
                  </div>
                  <div 
                    className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedConcept === 'directedAdjList' 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleConceptClick('directedAdjList')}
                  >
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">Directed Adjacency List</h3>
                    <p className="text-gray-600">Graph representation</p>
                  </div>
                  <div 
                    className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedConcept === 'undirectedAdjMatrix' 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleConceptClick('undirectedAdjMatrix')}
                  >
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">Undirected Adjacency Matrix</h3>
                    <p className="text-gray-600">Graph representation</p>
                  </div>
                  <div 
                    className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedConcept === 'directedAdjMatrix' 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleConceptClick('directedAdjMatrix')}
                  >
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">Directed Adjacency Matrix</h3>
                    <p className="text-gray-600">Graph representation</p>
                  </div>
                </div>
              </>
            )}
            {currentLevel === 4 && (
              <>
              {dfsVisited && bfsVisited && (
                  <div className="mb-5 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg border-2 border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Level 4 Complete!</h3>
                    </div>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                      Ready for Level 5
                    </span>
                  </div>
                  <div className="pl-13">
                    <p className="text-gray-700 mb-2">
                      Awesome! You've mastered the two fundamental graph traversal algorithms:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                      <li>Breadth-First Search (BFS): Explores all neighbors at the current level before going deeper.</li>
                      <li>Depth-First Search (DFS): Goes as deep as possible before backtracking.</li>
                    </ul>
                    <div className="mt-4">
                      <p className="text-gray-700 font-medium">
                        You're now ready to tackle cycle detection in graphs in the next level!
                      </p>
                    </div>
                  </div>
                </div>
                )}
                <div 
                  className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedConcept === 'bfs' 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleConceptClick('bfs') }
                  // onClick={() => setBfsVisited(true)}
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">Breadth-First Search (BFS)</h3>
                  <p className="text-gray-600">Click to see BFS traversal</p>
                </div>
                <div 
                  className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedConcept === 'dfs' 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleConceptClick('dfs')}
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">Depth-First Search (DFS)</h3>
                  <p className="text-gray-600">Click to see DFS traversal</p>
                </div>
              </>
            )}
            {currentLevel === 5 && (
              <>
              {cycleDetectionInUndrectgraphcompleted && cycleDetectionIndrectgraphcompleted && (
                <div className="w-[50rem] p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg border-2 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Level 5 Complete!</h3>
                  </div>
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                    Ready for Level 6
                  </span>
                </div>
                <div className="pl-13">
                  <p className="text-gray-700 mb-2">
                    Excellent! You've mastered cycle detection in both undirected and directed graphs! You now understand how to identify circular paths in different types of graphs.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    <li><b>Undirected Cycle Detection:</b> Find cycles by checking if you can return to a node without repeating edges.</li>
                    <li><b>Directed Cycle Detection:</b> Find cycles by following arrows and checking for revisiting nodes on the current path.</li>
                  </ul>
                  <div className="mt-4">
                    <p className="text-gray-700 font-medium">
                      You're now ready to explore topological sorting and dependencies in the next level!
                    </p>
                  </div>
                </div>
              </div>
                )}
                <div 
                  className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedConcept === 'undirectedCycle' 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleConceptClick('undirectedCycle')}
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">Cycle Detection in Undirected Graphs</h3>
                  <p className="text-gray-600">Click to learn about cycle detection in undirected graphs</p>
                </div>
                <div 
                  className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedConcept === 'directedCycle' 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleConceptClick('directedCycle')}
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">Cycle Detection in Directed Graphs</h3>
                  <p className="text-gray-600">Click to learn about cycle detection in directed graphs</p>
                </div>
              </>
            )}
            {currentLevel === 6 && (
              <>
               {inDegreeCompleted && topologicalSortCompleted && (
               <div className="w-[50rem] p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg border-2 border-green-200">
               <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center">
                   <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                     <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                     </svg>
                   </div>
                   <h3 className="text-xl font-bold text-gray-800">Level 6 Complete!</h3>
                 </div>
                 <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                   Ready for Level 7
                 </span>
               </div>
               <div className="pl-13">
                 <p className="text-gray-700 mb-2">
                   Fantastic! You've mastered the introduction to Topological Sort and In-Degrees!
                 </p>
                 <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                   <li><b>In-Degree:</b> The number of incoming edges to a node. Nodes with in-degree 0 can be processed first.</li>
                   <li><b>Topological Sort (Kahn's Algorithm):</b> A way to order nodes so that for every directed edge U→V, U comes before V. Useful for scheduling tasks with dependencies.</li>
                 </ul>
                 <div className="mt-4">
                   <p className="text-gray-700 font-medium">
                     You're now ready to explore shortest path algorithms in the next level!
                   </p>
                 </div>
               </div>
             </div>
                )}
                <div 
                  className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedConcept === 'inDegree' 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleConceptClick('inDegree')}
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">In-Degree of a Node</h3>
                  <p className="text-gray-600">Click to learn about in-degrees</p>
                </div>
                <div 
                  className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedConcept === 'introToposort' 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleConceptClick('introToposort')}
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">Introduction to Topological Sort</h3>
                  <p className="text-gray-600">Click to learn what topological sort is</p>
                </div>
              </>
            )}
            {currentLevel === 7 && (
              <>
              {sortestPathCompleted && dijkstraCompleted && (
              <div className="w-[50rem] p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg border-2 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Level 7 Complete!</h3>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                  Ready for Level 8
                </span>
              </div>
              <div className="pl-13">
                <p className="text-gray-700 mb-2">
                  Awesome! You've mastered the shortest path problem and Dijkstra's Algorithm! You now know how to efficiently find the minimum path in weighted graphs.
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li><b>Shortest Path Problem:</b> Find the path with the minimum total weight between two nodes in a graph.</li>
                  <li><b>Dijkstra's Algorithm:</b> A greedy algorithm to find the shortest path from a starting node to all other nodes in a weighted graph with non-negative weights.</li>
                </ul>
                <div className="mt-4">
                  <p className="text-gray-700 font-medium">
                    You're now ready to explore Minimum Spanning Trees in the next level!
                  </p>
                </div>
              </div>
            </div>
                )}
                <div 
                  className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedConcept === 'shortestPath' 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleConceptClick('shortestPath')}
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">Shortest Path Problem</h3>
                  <p className="text-gray-600">Click to learn about the Shortest Path Problem</p>
                </div>
                <div 
                  className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedConcept === 'dijkstra' 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleConceptClick('dijkstra')}
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">Dijkstra's Algorithm</h3>
                  <p className="text-gray-600">Click to learn about Dijkstra's Algorithm</p>
                </div>
              </>
            )}
            {currentLevel === 8 && (
              <>
              {mstCompleted && (
             <div className="mb-5 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg border-2 border-green-200">
             <div className="flex items-center justify-between mb-3">
               <div className="flex items-center">
                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                   <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                   </svg>
                 </div>
                 <h3 className="text-xl font-bold text-gray-800">Level 8 Complete!</h3>
               </div>
               <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                 Ready for Level 9
               </span>
             </div>
             <div className="pl-13">
               <p className="text-gray-700 mb-2">
                 Excellent! You've mastered the concept of Minimum Spanning Trees (MSTs)! You now know how to connect all nodes in a graph with the minimum total edge weight and no cycles.
               </p>
               <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                 <li><b>Minimum Spanning Tree (MST):</b> A subset of edges that connects all vertices with the minimum possible total edge weight and no cycles.</li>
                 <li><b>Applications:</b> Network design, clustering, image segmentation, and more.</li>
               </ul>
               <div className="mt-4">
                 <p className="text-gray-700 font-medium">
                   You're now ready to explore Disjoint Set Union (DSU) and advanced graph algorithms in the next level!
                 </p>
               </div>
             </div>
           </div>
                )}
                <div className="flex gap-4 mb-5">
                <div 
                  className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedConcept === 'mst' 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleConceptClick('mst')}
                >
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">Minimum Spanning Tree</h3>
                    <p className="text-gray-600">Click to visualize MST construction</p>
                    <h2 className="text-[#32CD32] font-bold text-xl">If you undertand the concept of MST , Please click on this </h2>
                </div>
                </div>
                
                {selectedConcept === 'mst' && (
                  <div className="mt-4">
                    <MSTDSUVisualization 
                      dsuState={dsuState}
                      nodes={levelData[currentLevel].nodes}
                    />
              </div>
                )}
              </>
            )}
            {currentLevel === 9 && (
              <>
              {dsuCompleted && (
               <div className="mb-5 w-[40rem] p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg border-2 border-green-200">
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-800">Level 9 Complete!</h3>
    </div>
    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
      Ready for Level 10
    </span>
  </div>
  <div className="pl-13">
    <p className="text-gray-700 mb-2">
      Congratulations! You've mastered Disjoint Set Union (DSU), also known as Union-Find. You now know how to efficiently manage and merge groups of connected nodes in a graph.
    </p>
    <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
      <li><b>Find:</b> Quickly determine which group a node belongs to.</li>
      <li><b>Union:</b> Efficiently merge two groups into one.</li>
      <li><b>Applications:</b> Kruskal's MST, cycle detection, network connectivity, and more.</li>
    </ul>
    <div className="mt-4">
      <p className="text-gray-700 font-medium">
        You're now ready to explore advanced Minimum Spanning Tree algorithms in the final level!
      </p>
    </div>
  </div>
</div>
                )}
                <div className="flex gap-4 mb-5">
                  <div 
                    className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedConcept === 'dsu' 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleConceptClick('dsu')}
                  >
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">Disjoint Set Union (DSU)</h3>
                    <p className="text-gray-600">Click to learn and visualize DSU operations</p>
                    <h2 className="text-[#32CD32] font-bold text-xl">If you undertand the concept of MST , Please click on this </h2>
                  </div>
                </div>
                {selectedConcept === 'dsu' && (
                  <div className="mt-4">
                    <div className="p-4 bg-white rounded-lg shadow mb-4">
                      <h4 className="font-bold mb-2">Current Groups</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(dsuState?.parent || {}).map(([node, parent]) => (
                          <div key={node} className="flex justify-between p-2 bg-gray-100 rounded">
                            <span>Node {node}:</span>
                            <span className={parent === node ? "text-green-600" : "text-blue-600"}>
                              Group {parent}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <h4 className="font-medium text-gray-700">Try these operations: ( NOTE : Please click on the reset before perfoming operations )</h4>

                      <div className="flex flex-wrap gap-2">
                        {levelData[9].nodes.map(node => (
            <button
                            key={`find-${node.id}`}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            onClick={() => visualizeDSUOperation('find', node.id)}
                          >
                            Find({node.id})
            </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {levelData[9].edges.map((edge, index) => (
                          <button
                            key={`union-${index}`}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                            onClick={() => visualizeDSUOperation('union', edge.source, edge.target)}
                          >
                            Union({edge.source}, {edge.target})
                          </button>
                        ))}
          </div>

                      <button
                        className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  onClick={() => {
                          // Reset DSU state
                          const initialParent = {};
                          const initialRank = {};
                          const initialSize = {};
                          levelData[9].nodes.forEach(node => {
                            initialParent[node.id] = node.id;
                            initialRank[node.id] = 0;
                            initialSize[node.id] = 1;
                          });
                          setDsuState({ parent: initialParent, rank: initialRank, size: initialSize });
                          setDsuOperation('');
                          setDsuOperationNodes([]);
                          setDsuExplanation('');
                        }}
                      >
                        Reset DSU
                      </button>
                </div>
                    {dsuOperation && (
                      <div className="p-3 bg-blue-50 rounded">
                        <p className="text-blue-600 whitespace-pre-line">{dsuExplanation}</p>
                      </div>
                    )}
                    {isLevelComplete && (
                      <div className="mt-4 p-3 bg-green-100 text-green-800 rounded font-bold text-center">
                        {levelData[9].completionMessage}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {currentLevel === 10 && (
              <>
              {primsCompleted && kruskalsCompleted && (
              <div className="w-[50rem] mb-5 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg border-2 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Level 10 Complete!</h3>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                  Congratulations!
                </span>
              </div>
              <div className="pl-13">
                <p className="text-gray-700 mb-2">
                  Excellent! You've learned about both <b>Prim's</b> and <b>Kruskal's</b> algorithms for finding Minimum Spanning Trees (MSTs). You now know two powerful approaches to connect all nodes in a graph with the minimum total edge weight and no cycles.
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li><b>Prim's Algorithm:</b> Grows the MST by always adding the minimum weight edge from the tree to a new node.</li>
                  <li><b>Kruskal's Algorithm:</b> Adds edges in order of increasing weight, skipping any that would create a cycle, until all nodes are connected.</li>
                  <li><b>Applications:</b> Network design, clustering, image segmentation, circuit design, and more.</li>
                </ul>
                <div className="mt-4">
                  <p className="text-gray-700 font-medium">
                    You've completed all levels of the Graph Theory game! 🎉<br/>
                    Keep exploring and applying these algorithms to real-world problems!
                  </p>
                </div>
              </div>
            </div>
                )}
                <div className="flex gap-4 mb-5">
                  <div 
                    className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedConcept === 'prims' 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleConceptClick('prims')}
                  >
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">Prim's Algorithm</h3>
                    <p className="text-gray-600">Click to learn about Prim's Algorithm</p>
                  </div>
                  <div 
                    className={`flex-1 p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                      selectedConcept === 'kruskals' 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-white border-2 border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleConceptClick('kruskals')}
                  >
                    <h3 className="text-xl font-semibold text-blue-600 mb-2">Kruskal's Algorithm</h3>
                    <p className="text-gray-600">Click to learn about Kruskal's Algorithm</p>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="flex gap-4 flex-1">
            <div className="flex-1 bg-white rounded-lg shadow-md p-4">
              {currentLevel !== 10 && (
                <svg
                  ref={svgRef}
                  className="w-full h-full"
                  viewBox="0 0 800 600"
                  onMouseMove={throttledMouseMove} 
                  onMouseUp={handleMouseUp}
                >
                  {/* Draw edges */}
                  {edges.map((edge, index) => {
                    const sourceNode = nodes.find(n => n.id === edge.source);
                    const targetNode = nodes.find(n => n.id === edge.target);
                    
                    if (!sourceNode || !targetNode) return null;

                    let currentStroke = "#1f77b4";
                    let currentStrokeWidth = "2";
                    let isHighlighted = false;
                    // let edge = null;

                    if (currentLevel === 1 && selectedConcept === 'edges') {
                      currentStroke = "#dc2626"; // Red color
                      currentStrokeWidth = "4"; // Bold width
                      isHighlighted = true;
                    } else if (currentLevel === 8 && selectedConcept === 'mst') {
                      // Check if this edge is in the MST
                      const isInMST = mstEdges.some(e => 
                        (e.source === edge.source && e.target === edge.target) || 
                        (e.source === edge.target && e.target === edge.source)
                      );
                      
                      // Check if this edge is being processed
                      const isBeingProcessed = edgesBeingProcessed.has(`${edge.source}-${edge.target}`);
                      
                      if (isInMST) {
                        currentStroke = "#10B981"; // Green for MST edges
                        currentStrokeWidth = "4";
                        isHighlighted = true;
                      } else if (isBeingProcessed) {
                        currentStroke = "#F59E0B"; // Orange for current edge being processed
                        currentStrokeWidth = "3";
                        isHighlighted = true;
                      }
                    }

                    return (
                      <g key={`edge-${index}`} className={isHighlighted ? "transition-all duration-300" : ""}>
                        <line
                          x1={sourceNode.x}
                          y1={sourceNode.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke={currentStroke}
                          strokeWidth={currentStrokeWidth}
                        />
                        {edge.weight && (
                          <text
                            x={(sourceNode.x + targetNode.x) / 2}
                            y={(sourceNode.y + targetNode.y) / 2 - 10}
                            textAnchor="middle"
                            fill={currentStroke}
                            fontSize="14"
                            fontWeight={isHighlighted ? "bold" : "normal"}
                          >
                            {edge.weight}
                          </text>
                        )}
                        {edge.type === 'directed' && (
                          drawArrow(sourceNode, targetNode, currentStroke, currentStrokeWidth)
                        )}
                      </g>
              );
            })}

                  {/* Draw nodes */}
                  {nodes.map(node => {
                    let currentFill = "#1f77b4"; // Default blue
                    let currentRadius = "20";

                    if (currentLevel === 4) {
                      if (visitedNodes.has(node.id)) {
                        currentFill = "#dc2626"; // Red for visited nodes
                        currentRadius = "25";
                      }
                      // Highlight nodes in queue/stack for BFS/DFS traversal
                      if (selectedConcept === 'bfs' && currentQueue.includes(node.id)) {
                        currentFill = "#8A2BE2"; // Purple for nodes in queue
                      } else if (selectedConcept === 'dfs' && currentStack.includes(node.id)) {
                        currentFill = "#FF4500"; // Orange for nodes in stack
                      }

                    } else if (currentLevel === 1) {
                      if (selectedConcept === 'nodes') {
                        currentFill = "#dc2626";
                        currentRadius = "25";
                      }
                    } else if (currentLevel === 3) {
                      if (visualizationStep !== -1) {
                        const currentVisualizedNodeId = nodes.map(node => node.id).sort()[visualizationStep];
                        const edgesForVisualization = 
                          (selectedConcept === 'undirectedAdjList' || selectedConcept === 'undirectedAdjMatrix') 
                            ? levelData[currentLevel].undirectedGraphEdges
                            : levelData[currentLevel].directedGraphEdges;

                        const neighborsOfCurrentNode = new Set();
                        edgesForVisualization.forEach(e => {
                          if (e.source === currentVisualizedNodeId) {
                            neighborsOfCurrentNode.add(e.target);
                          }
                          if (e.type === 'undirected' && e.target === currentVisualizedNodeId) {
                            neighborsOfCurrentNode.add(e.source);
                          }
                        });

                        if (node.id === currentVisualizedNodeId || neighborsOfCurrentNode.has(node.id)) {
                          currentFill = "#dc2626";
                          currentRadius = "25";
                        }
                      }
                    } else if (currentLevel === 5) {
                      // Highlight nodes that are part of the detected cycle
                      if (cycleNodes.has(node.id)) {
                        currentFill = "#dc2626"; // Red for cycle nodes
                        currentRadius = "25";
                      }
                    } else if (currentLevel === 6) {
                      // Highlight nodes based on Kahn's algorithm visualization
                      if (selectedConcept === 'introToposort' && visualizationStep !== -1) {
                        const edgeKey = `${edge.source}-${edge.target}`;
                        // Edges being processed (conceptually removed) are red
                        if (edgesBeingProcessed.has(edgeKey)) {
                          currentStroke = "#dc2626"; 
                          currentStrokeWidth = "4";
                        } else if (traversalOrder.includes(edge.source) && traversalOrder.includes(edge.target)) {
                          // Edges between already processed nodes are green
                          currentStroke = "#10B981"; 
                          currentStrokeWidth = "2";
                        } else {
                          currentFill = "#1f77b4"; // Default blue for other nodes
                          currentRadius = "20";
                        }
                      }
                    } else if (currentLevel === 7) {
                      // Highlight nodes for Shortest Path and Dijkstra's visualization
                      if (selectedConcept === 'shortestPath' && visitedNodes.has(node.id)) {
                        currentFill = "#dc2226"; // Red for nodes in the shortest path
                        currentRadius = "25";
                      } else if (selectedConcept === 'dijkstra') {
                        if (node.id === currentProcessingNode) {
                          currentFill = "#FF4500"; // Orange for the node currently being processed (smallest distance)
                          currentRadius = "30"; // Slightly larger for emphasis
                        } else if (visitedNodes.has(node.id)) {
                          currentFill = "#10B981"; // Green for visited nodes (finalized shortest path)
                          currentRadius = "25";
                        }
                        else {
                          currentFill = "#1f77b4"; // Default blue for unvisited nodes
                          currentRadius = "20";
                        }
                      }
                    } else if (currentLevel === 8) {
                      if (visitedNodes.has(node.id)) {
                        currentFill = "#10B981"; // Green for MST nodes
                        currentRadius = "25";
                      }
                    }

                    return (
                      <g
                        key={node.id}
                        onMouseDown={() => handleMouseDown(node.id)}
                        style={{ cursor: 'move' }}
                      > 
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={currentRadius}
                          fill={currentFill}
                          stroke="#fff"
                          strokeWidth="2"
                        />
                        <text
                          x={node.x}
                          y={node.y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="14" 
                          fontWeight="bold"
                        >
                          {node.id}
                        </text>
                        {/* Display distance for Dijkstra's visualization */}
                        {currentLevel === 7 && selectedConcept === 'dijkstra' && ( // Removed visualization and states for level 10
                          <text
                            x={node.x}
                            y={node.y + 30} // Position below the node
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={node.id === currentProcessingNode ? "#FF4500" : (visitedNodes.has(node.id) ? "#10B981" : "#333")} // Highlight text based on node state
                            fontSize="12"
                          >
                            Dist: {currentDistances[node.id] === Infinity ? '∞' : currentDistances[node.id]}
                          </text>
                        )}
                        {/* Display current in-degree for introToposort and inDegree concepts */}
                        {selectedConcept === 'inDegree' && currentLevel === 6 && (
                          <text
                            x={node.x}
                            y={node.y + 30} // Position below the node
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#333"
                            fontSize="12"
                          >
                            In-Degree: {currentInDegreesDisplay[node.id] !== undefined ? currentInDegreesDisplay[node.id] : 0}
                          </text>
                        )}
                        {selectedConcept === 'introToposort' && currentLevel === 6 && (
                          <text
                            x={node.x}
                            y={node.y + 30} // Position below the node
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#333"
                            fontSize="12"
                          >
                            In-Degree: {calculateInDegrees(nodes, edges)[node.id]}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              )}

              {/* Conditionally render concept explanation in the left panel for Level 10 */}
              {currentLevel === 10 && selectedConcept && levelData[currentLevel].conceptExplanations[selectedConcept] && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{levelData[currentLevel].conceptExplanations[selectedConcept].title}</h3>
                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">{levelData[currentLevel].conceptExplanations[selectedConcept].description}</p>
                  {levelData[currentLevel].conceptExplanations[selectedConcept].examples && (
                    <div className="space-y-1">
                      {levelData[currentLevel].conceptExplanations[selectedConcept].examples.map((example, index) => (
                        <p key={index} className="text-gray-600">{example}</p>
                      ))}
          </div>
                  )}
                </div>
              )}

              {/* Add completion message for edges concept */}
              {/* {currentLevel === 1 && selectedConcept === 'edges' && edgesConceptVisited && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg font-medium">
                  {edgesCompletionMessage}
                </div>
              )} */}

              {/* Level 2 Completion Message */}
              {/* {currentLevel === 2 && directedConceptVisited && undirectedConceptVisited && ( */}
              
                {/* // <div className="mb-5 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-lg border-2 border-green-200"> */}
                  {/* <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Level 2 Complete!</h3>
                    </div>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold text-sm">
                      Ready for Level 3
                    </span>
                  </div>
                  <div className="pl-13">
                    <p className="text-gray-700 mb-2">
                      {level2CompletionMessage}
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                      <li>Directed Graphs: Edges have a specific direction (e.g., A → B)</li>
                      <li>Undirected Graphs: Edges have no direction (e.g., A — B)</li>
                    </ul>
                    <p className="mt-3 text-gray-700 font-medium">
                      You're now ready to explore different graph representations in the next level!
                    </p>
                  </div> */}
                {/* // </div> */}
              {/* )} */}
            </div>

            <div className="w-1/3 bg-white rounded-lg shadow-md p-6">
              {/* Level Instructions */}
              <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Level {currentLevel} Instructions:</h3>
                <p className="text-gray-700 leading-relaxed">{instructions}</p>
                  </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {currentLevel === 10 && selectedConcept 
                  ? "" 
                  : currentConceptExplanations[selectedConcept]?.title || ''}
              </h3>
              <p className="text-gray-600 mb-6">
                {currentConceptExplanations[selectedConcept]?.description || ''}
              </p>
              
              {/* Show examples for the selected concept if present */}
              {currentConceptExplanations[selectedConcept]?.examples && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold text-gray-700 mb-2">Examples:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                    {currentConceptExplanations[selectedConcept].examples.map((example, idx) => (
                      <li key={idx}>{example}</li>
                    ))}
                  </ul>
                </div>
          )}

              {currentLevel === 4 && (
                <>
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Current Step:</h4>
                    <div className="bg-blue-50 p-3 rounded-md mb-4">
                      <p className="text-blue-800">{getStepExplanation()}</p>
                      {/* <h2>hi</h2> */}
              </div>

                    <div className="flex gap-2 mb-4">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                        onClick={() => setIsPaused(!isPaused)}
                      >
                        {isPaused ? 'Resume' : 'Pause'} Visualization
                      </button>
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                        onClick={() => selectedConcept === 'bfs' ? startBFSVisualization() : startDFSVisualization()}
                      >
                        Restart Visualization
                      </button>
                    </div>
                  </div>
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Traversal Order:</h4>
                    <p className="text-gray-600">{traversalOrder.join(' → ')}</p>
                  </div>
                  {(selectedConcept === 'bfs' && currentQueue.length > 0) && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">Current Queue:</h4>
                      <p className="text-gray-600">[{currentQueue.join(', ')}]</p>
                </div>
                  )}
                  {(selectedConcept === 'dfs' && currentStack.length > 0) && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">Current Stack:</h4>
                      <p className="text-gray-600">[{currentStack.join(', ')}]</p>
                    </div>
                  )}
                </>
              )}
              
              {currentLevel === 6 && selectedConcept === 'introToposort' && (
                <>
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Current Step:</h4>
                    <div className="bg-blue-50 p-3 rounded-md mb-4">
                      <p className="text-blue-800">{getStepExplanation()}</p>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                        onClick={() => setIsPaused(!isPaused)}
                      >
                        {isPaused ? 'Resume' : 'Pause'} Visualization
                      </button>
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                        onClick={startIntroToposortVisualization}
                      >
                        Restart Visualization
                      </button>
                  </div>
                  </div>
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Topological Order:</h4>
                    <p className="text-gray-600">{traversalOrder.join(' → ')}</p>
                  </div>
                  {(currentQueue.length > 0) && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">Nodes Ready (In-Degree 0 Queue):</h4>
                      <p className="text-gray-600">[{currentQueue.join(', ')}]</p>
                </div>
                  )}
                </>
              )}

              {currentLevel === 6 && selectedConcept === 'inDegree' && (
                <>
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Current Step:</h4>
                    <div className="bg-blue-50 p-3 rounded-md mb-4">
                      <p className="text-blue-800">{getStepExplanation()}</p>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                        onClick={() => setIsPaused(!isPaused)}
                      >
                        {isPaused ? 'Resume' : 'Pause'} Visualization
                      </button>
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300"
                        onClick={startInDegreeVisualization}
                      >
                        Restart Visualization
                      </button>
                  </div>
                </div>
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Final In-Degrees:</h4>
                    <pre className="bg-gray-100 p-3 rounded-md overflow-auto text-sm">
                      <code>
                        {Object.entries(calculateInDegrees(nodes, edges)).map(([nodeId, degree]) => 
                          `${nodeId}: ${degree}`
                        ).join('\n')}
                      </code>
                    </pre>
                  </div>
                </>
              )}

              {currentLevel === 3 && (
                <div >
                  {/* <p className="text-gray-600 mb-6">
                {currentConceptExplanations[selectedConcept]?.examples}</p> */}
                  <button
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
                    onClick={startGraphRepresentationVisualization}
                  >
                    Visualize Graph Representations
                    
                  </button>
                  </div>
          
                )}

                {currentLevel === 5 && (
                  <button
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
                    onClick={startCycleDetectionVisualization}
                  >
                    Visualize Cycle Detection
                  </button>
                )}

                {currentLevel === 6 && selectedConcept === 'introToposort' && (
                  <button
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
                    onClick={startIntroToposortVisualization}
                  >
                    Start Introduction Visualization
                  </button>
                )}

                {currentLevel === 7 && selectedConcept === 'dijkstra' && (
                  <button
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
                    onClick={startDijkstraVisualization}
                  >
                    Start Dijkstra's Visualization
                  </button>
                )}

                {currentLevel === 7 && selectedConcept === 'shortestPath' && (
                  <button
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
                    onClick={startShortestPathVisualization}
                  >
                    Visualize Shortest Path
                  </button>
                )}

                {currentLevel === 7 && selectedConcept === 'bellmanFord' && (
                  <button
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
                    onClick={startBellmanFordVisualization}
                  >
                    Start Bellman-Ford Visualization
                  </button>
                )}

                {currentLevel === 7 && selectedConcept === 'floydWarshall' && (
                  <button
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
                    onClick={startFloydWarshallVisualization}
                  >
                    Start Floyd-Warshall Visualization
                  </button>
                )}

                {currentLevel === 8 && selectedConcept === 'mst' && (
                  <button
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
                    onClick={startMSTVisualization}
                  >
                    Start MST Visualization
                  </button>
                )}

                {currentLevel === 9 && selectedConcept === 'dsu' && (
                  null
                )}

                <div className="mt-auto pt-4 border-t border-gray-200">
                  <p className="text-blue-800 font-medium">
                    {currentLevel === 1 
                      ? (selectedConcept === 'nodes' ? "💡 Try dragging the nodes to see how the graph structure maintains its connections!" : "💡 Notice how some nodes have more connections than others, indicating their importance or role in the network!")
                      : currentLevel === 2
                        ? (selectedConcept === 'directed' ? "💡 See how arrows indicate a one-way relationship in directed edges!" : "💡 Notice how undirected edges have no arrows, meaning the relationship is mutual!")
                        : currentLevel === 3
                          ? (selectedConcept.includes('AdjList') ? "💡 The adjacency list shows direct neighbors. Observe the graph changing for directed vs. undirected!" : "💡 The adjacency matrix uses 1s and 0s to show connections. Notice the symmetry for undirected graphs!")
                          : currentLevel === 4
                            ? (selectedConcept === 'bfs' ? "💡 Watch how BFS explores all neighbors at the current level before moving deeper!" : "💡 See how DFS goes as deep as possible before backtracking!")
                            : currentLevel === 5
                              ? (selectedConcept === 'undirectedCycle' ? "💡 A cycle means you can return to a starting node without repeating edges. Look for red highlights!" : "💡 In directed graphs, follow the arrows! If you return to a node on your current path, it's a cycle!")
                              : currentLevel === 6
                                ? (selectedConcept === 'introToposort' ? "💡 Topological sort orders nodes so that for every directed edge U→V, U appears before V." : selectedConcept === 'inDegree' ? "💡 In-degree is the number of incoming edges. Nodes with 0 in-degree can be processed first!" : "")
                                : currentLevel === 7
                                  ? (selectedConcept === 'shortestPath' ? "💡 The shortest path problem finds the path with minimum total weight between two nodes." : selectedConcept === 'dijkstra' ? "💡 Dijkstra's Algorithm finds the shortest path from a starting node to all other nodes in a weighted graph." : "")
                                  : currentLevel === 7
                                    ? (selectedConcept === 'bellmanFord' ? "💡 Bellman-Ford Algorithm finds the shortest path from a starting node to all other nodes in a weighted graph. It can handle negative edge weights and detect negative cycles." : selectedConcept === 'floydWarshall' ? "💡 Floyd-Warshall Algorithm finds the shortest path between all pairs of vertices in a weighted graph. It can handle negative edge weights and detect negative cycles." : "")
                                    : currentLevel === 8
                                      ? (selectedConcept === 'mst' ? "💡 Minimum Spanning Tree (MST) is a subset of edges that connects all vertices in a graph with the minimum possible total edge weight." : "")
                                      : currentLevel === 9
                                        ? (selectedConcept === 'dsu' ? "💡 Disjoint Set Union (DSU) is used to efficiently manage a collection of disjoint sets." : "")
                                        : currentLevel === 10
                                          ? (selectedConcept === 'prims' ? "💡 Prim's Algorithm builds the MST by growing it one vertex at a time." : selectedConcept === 'kruskals' ? "💡 Kruskal's Algorithm builds the MST by adding edges in order of increasing weight, skipping any edge that would create a cycle." : "")
                                          : ""
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
          {renderDistanceMatrix()}
          {currentLevel === 7 && (
            <div className="mb-6">
              {/* Remove MST game UI */}
            </div>
          )}
          {currentLevel === 8 && selectedConcept === 'mst' && currentSpanningTreeWeight !== null && (
            <div className="mt-4 p-2 bg-gray-100 rounded text-center">
              <span className="font-semibold">Current Spanning Tree Weight: {currentSpanningTreeWeight}</span>
              {minSpanningTreeIndices.includes(currentSpanningTreeIndex) && (
                <span className="ml-2 text-green-700 font-bold">(Minimum!)</span>
              )}
            </div>
          )}
          {currentLevel === 9 && selectedConcept === 'dsu' && (
            null
          )}
          {currentLevel === 10 && selectedConcept === 'prims' && (
            null
          )}
          {currentLevel === 10 && selectedConcept === 'kruskals' && (
            null
          )}
        </div>
      </div>
    );
  };

  export default GraphGame;
