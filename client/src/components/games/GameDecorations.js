import React from 'react';

// Array Decoration - represents array data structure
export const ArrayDecoration = ({ position, rotation = 0, scale = 1, opacity = 80 }) => (
  <div 
    className={`absolute ${position} pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      opacity: opacity / 100,
      transition: 'none'
    }}
  >
    <div className="flex space-x-2">
      <div className="w-10 h-10 bg-blue-700 text-white text-sm rounded flex items-center justify-center shadow-md">5</div>
      <div className="w-10 h-10 bg-green-700 text-white text-sm rounded flex items-center justify-center shadow-md">2</div>
      <div className="w-10 h-10 bg-purple-700 text-white text-sm rounded flex items-center justify-center shadow-md">8</div>
    </div>
  </div>
);

// Tree Decoration - represents binary tree data structure
export const TreeDecoration = ({ position, rotation = 0, scale = 1, opacity = 80 }) => (
  <div 
    className={`absolute ${position} pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      opacity: opacity / 100,
      transition: 'none'
    }}
  >
    <div className="text-center">
      <div className="w-6 h-6 bg-green-800 rounded-full mx-auto mb-2 shadow-md"></div>
      <div className="flex justify-center space-x-3">
        <div className="w-5 h-5 bg-green-700 rounded-full shadow-md"></div>
        <div className="w-5 h-5 bg-green-700 rounded-full shadow-md"></div>
      </div>
    </div>
  </div>
);

// Linked List Decoration - represents linked list data structure
export const LinkedListDecoration = ({ position, rotation = 0, scale = 1, opacity = 80 }) => (
  <div 
    className={`absolute ${position} pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      opacity: opacity / 100,
      transition: 'none'
    }}
  >
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 bg-orange-700 rounded-full shadow-md"></div>
      <div className="w-3 h-1 bg-gray-600"></div>
      <div className="w-6 h-6 bg-orange-700 rounded-full shadow-md"></div>
      <div className="w-3 h-1 bg-gray-600"></div>
      <div className="w-6 h-6 bg-orange-700 rounded-full shadow-md"></div>
    </div>
  </div>
);

// Stack Decoration - represents stack data structure
export const StackDecoration = ({ position, rotation = 0, scale = 1, opacity = 80 }) => (
  <div 
    className={`absolute ${position} pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      opacity: opacity / 100,
      transition: 'none'
    }}
  >
    <div className="flex flex-col space-y-2">
      <div className="w-12 h-4 bg-red-700 rounded shadow-md"></div>
      <div className="w-12 h-4 bg-red-600 rounded shadow-md"></div>
      <div className="w-12 h-4 bg-red-500 rounded shadow-md"></div>
    </div>
  </div>
);

// Queue Decoration - represents queue data structure
export const QueueDecoration = ({ position, rotation = 0, scale = 1, opacity = 80 }) => (
  <div 
    className={`absolute ${position} pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      opacity: opacity / 100,
      transition: 'none'
    }}
  >
    <div className="flex space-x-2">
      <div className="w-4 h-8 bg-blue-600 rounded shadow-md"></div>
      <div className="w-4 h-8 bg-blue-700 rounded shadow-md"></div>
      <div className="w-4 h-8 bg-blue-800 rounded shadow-md"></div>
    </div>
  </div>
);

// Binary Search Decoration - represents binary search algorithm
export const BinarySearchDecoration = ({ position, rotation = 0, scale = 1, opacity = 80 }) => (
  <div 
    className={`absolute ${position} pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      opacity: opacity / 100,
      transition: 'none'
    }}
  >
    <div className="flex items-center space-x-2">
      <div className="w-5 h-5 bg-yellow-600 rounded-full shadow-md"></div>
      <div className="w-5 h-5 bg-yellow-500 rounded-full shadow-md"></div>
      <div className="w-5 h-5 bg-yellow-400 rounded-full shadow-md"></div>
      <div className="w-5 h-5 bg-yellow-300 rounded-full shadow-md"></div>
    </div>
  </div>
);

// Graph Decoration - represents graph data structure
export const GraphDecoration = ({ position, rotation = 0, scale = 1, opacity = 80 }) => (
  <div 
    className={`absolute ${position} pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      opacity: opacity / 100,
      transition: 'none'
    }}
  >
    <div className="grid grid-cols-2 gap-2">
      <div className="w-5 h-5 bg-purple-600 rounded-full shadow-md"></div>
      <div className="w-5 h-5 bg-purple-500 rounded-full shadow-md"></div>
      <div className="w-5 h-5 bg-purple-400 rounded-full shadow-md"></div>
      <div className="w-5 h-5 bg-purple-300 rounded-full shadow-md"></div>
    </div>
  </div>
);

// Recursion Decoration - represents recursion concept
export const RecursionDecoration = ({ position, rotation = 0, scale = 1, opacity = 80 }) => (
  <div 
    className={`absolute ${position} pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      opacity: opacity / 100,
      transition: 'none'
    }}
  >
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 bg-pink-600 rounded-full shadow-md"></div>
      <div className="w-3 h-1 bg-gray-600"></div>
      <div className="w-5 h-5 bg-pink-500 rounded-full shadow-md"></div>
      <div className="w-3 h-1 bg-gray-600"></div>
      <div className="w-4 h-4 bg-pink-400 rounded-full shadow-md"></div>
    </div>
  </div>
);

// Sorting Decoration - represents sorting algorithms
export const SortingDecoration = ({ position, rotation = 0, scale = 1, opacity = 80 }) => (
  <div 
    className={`absolute ${position} pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      opacity: opacity / 100,
      transition: 'none'
    }}
  >
    <div className="flex items-end space-x-2 h-8">
      <div className="w-3 bg-indigo-600 rounded-t shadow-md" style={{height: '60%'}}></div>
      <div className="w-3 bg-indigo-500 rounded-t shadow-md" style={{height: '80%'}}></div>
      <div className="w-3 bg-indigo-400 rounded-t shadow-md" style={{height: '40%'}}></div>
      <div className="w-3 bg-indigo-300 rounded-t shadow-md" style={{height: '100%'}}></div>
    </div>
  </div>
);

// Dynamic Programming Decoration - represents DP concept
export const DynamicProgrammingDecoration = ({ position, rotation = 0, scale = 1, opacity = 80 }) => (
  <div 
    className={`absolute ${position} pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      opacity: opacity / 100,
      transition: 'none'
    }}
  >
    <div className="grid grid-cols-2 gap-2">
      <div className="w-5 h-5 bg-teal-600 rounded shadow-md"></div>
      <div className="w-5 h-5 bg-teal-500 rounded shadow-md"></div>
      <div className="w-5 h-5 bg-teal-400 rounded shadow-md"></div>
      <div className="w-5 h-5 bg-teal-300 rounded shadow-md"></div>
    </div>
  </div>
);

// Hash Table Decoration - represents hash table data structure
export const HashTableDecoration = ({ position, rotation = 0, scale = 1, opacity = 80 }) => (
  <div 
    className={`absolute ${position} pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      opacity: opacity / 100,
      transition: 'none'
    }}
  >
    <div className="grid grid-cols-3 gap-1">
      <div className="w-4 h-4 bg-emerald-600 rounded shadow-md"></div>
      <div className="w-4 h-4 bg-emerald-500 rounded shadow-md"></div>
      <div className="w-4 h-4 bg-emerald-400 rounded shadow-md"></div>
      <div className="w-4 h-4 bg-emerald-300 rounded shadow-md"></div>
      <div className="w-4 h-4 bg-emerald-200 rounded shadow-md"></div>
      <div className="w-4 h-4 bg-emerald-100 rounded shadow-md"></div>
    </div>
  </div>
);

// Heap Decoration - represents heap data structure
export const HeapDecoration = ({ position, rotation = 0, scale = 1, opacity = 80 }) => (
  <div 
    className={`absolute ${position} pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      opacity: opacity / 100,
      transition: 'none'
    }}
  >
    <div className="text-center">
      <div className="w-6 h-6 bg-amber-600 rounded-full mx-auto mb-1 shadow-md"></div>
      <div className="flex justify-center space-x-4">
        <div className="w-5 h-5 bg-amber-500 rounded-full shadow-md"></div>
        <div className="w-5 h-5 bg-amber-500 rounded-full shadow-md"></div>
      </div>
      <div className="flex justify-center space-x-8 mt-1">
        <div className="w-4 h-4 bg-amber-400 rounded-full shadow-md"></div>
        <div className="w-4 h-4 bg-amber-400 rounded-full shadow-md"></div>
        <div className="w-4 h-4 bg-amber-400 rounded-full shadow-md"></div>
        <div className="w-4 h-4 bg-amber-400 rounded-full shadow-md"></div>
      </div>
    </div>
  </div>
);

// Bit Manipulation Decoration - represents bit operations
export const BitManipulationDecoration = ({ position, rotation = 0, scale = 1, opacity = 80 }) => (
  <div 
    className={`absolute ${position} pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      opacity: opacity / 100,
      transition: 'none'
    }}
  >
    <div className="flex items-center space-x-1">
      <div className="w-4 h-4 bg-cyan-600 rounded shadow-md text-white text-xs flex items-center justify-center font-bold">1</div>
      <div className="w-4 h-4 bg-cyan-500 rounded shadow-md text-white text-xs flex items-center justify-center font-bold">0</div>
      <div className="w-4 h-4 bg-cyan-400 rounded shadow-md text-white text-xs flex items-center justify-center font-bold">1</div>
      <div className="w-4 h-4 bg-cyan-300 rounded shadow-md text-white text-xs flex items-center justify-center font-bold">1</div>
    </div>
  </div>
);

// Two Pointer Decoration - represents two pointer technique
export const TwoPointerDecoration = ({ position, rotation = 0, scale = 1, opacity = 80 }) => (
  <div 
    className={`absolute ${position} pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      opacity: opacity / 100,
      transition: 'none'
    }}
  >
    <div className="flex items-center space-x-3">
      <div className="w-6 h-6 bg-violet-600 rounded-full shadow-md"></div>
      <div className="w-2 h-2 bg-violet-500 rounded-full shadow-md"></div>
      <div className="w-2 h-2 bg-violet-400 rounded-full shadow-md"></div>
      <div className="w-2 h-2 bg-violet-300 rounded-full shadow-md"></div>
      <div className="w-6 h-6 bg-violet-600 rounded-full shadow-md"></div>
    </div>
  </div>
);

// Sliding Window Decoration - represents sliding window technique
export const SlidingWindowDecoration = ({ position, rotation = 0, scale = 1, opacity = 80 }) => (
  <div 
    className={`absolute ${position} pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      opacity: opacity / 100,
      transition: 'none'
    }}
  >
    <div className="flex items-center space-x-1">
      <div className="w-3 h-6 bg-rose-600 rounded shadow-md"></div>
      <div className="w-3 h-6 bg-rose-500 rounded shadow-md"></div>
      <div className="w-3 h-6 bg-rose-400 rounded shadow-md"></div>
      <div className="w-3 h-6 bg-rose-300 rounded shadow-md"></div>
      <div className="w-3 h-6 bg-rose-200 rounded shadow-md"></div>
    </div>
  </div>
);

// Default decoration set for games
export const GameDecorations = ({ opacity = 80 }) => (
  <>
    <ArrayDecoration position="top-16 left-8" rotation={15} scale={1.2} opacity={opacity} />
    <StackDecoration position="bottom-16 right-28" rotation={-5} scale={1.4} opacity={opacity} />
    <RecursionDecoration position="top-0 right-140" rotation={-15} scale={1.6} opacity={opacity} />
    <ArrayDecoration position="bottom-8 left-1/4" rotation={75} scale={1.6} opacity={opacity} />
    <GraphDecoration position="bottom-1/4 left-8" rotation={50} scale={1.3} opacity={opacity} />
    <LinkedListDecoration position="top-1/2 left-32" rotation={20} scale={1.2} opacity={opacity} />
    <TwoPointerDecoration position="top-1/6 right-24" rotation={-30} scale={1.1} opacity={opacity} />
    <BitManipulationDecoration position="top-1/3 right-8" rotation={45} scale={1.3} opacity={opacity} />
  </>
);

export default GameDecorations; 