import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GameDecorations from './GameDecorations';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MAX_LEVEL = 10;

const levelConfigs = [
  {
    title: 'Level 1: Toggle Bits',
    description: 'Toggle the bits to match the target number.',
    render: (props) => <LevelToggleBits {...props} />,
  },
  {
    title: 'Level 2: Bitwise AND',
    description: 'Perform a bitwise AND operation to match the target.',
    render: (props) => <LevelBitwiseAND {...props} />,
  },
  {
    title: 'Level 3: Bitwise OR',
    description: 'Perform a bitwise OR operation to match the target.',
    render: (props) => <LevelBitwiseOR {...props} />,
  },
  {
    title: 'Level 4: Bitwise XOR',
    description: 'Perform a bitwise XOR operation to match the target.',
    render: (props) => <LevelBitwiseXOR {...props} />,
  },
  {
    title: 'Level 5: Bitwise NOT',
    description: 'Perform a bitwise NOT operation to match the target.',
    render: (props) => <LevelBitwiseNOT {...props} />,
  },
  {
    title: 'Level 6: Left Shift',
    description: 'Use left shift to reach the target number.',
    render: (props) => <LevelLeftShift {...props} />,
  },
  {
    title: 'Level 7: Right Shift',
    description: 'Use right shift to reach the target number.',
    render: (props) => <LevelRightShift {...props} />,
  },
  {
    title: 'Level 8: Count Set Bits',
    description: 'Count the number of 1s in the binary representation.',
    render: (props) => <LevelCountBits {...props} />,
  },
  {
    title: 'Level 9: Pattern Match',
    description: 'Match the given bit pattern.',
    render: (props) => <LevelPatternMatch {...props} />,
  },
  {
    title: 'Level 10: Bit Puzzle',
    description: 'Solve the final bit manipulation puzzle!',
    render: (props) => <LevelBitPuzzle {...props} />,
  },
];

const levelExplanations = [
  'Toggle Bits: Change each bit between 0 and 1. The value is the sum of each bit times its place value.',
  'Bitwise AND: Compares each bit of two numbers. The result bit is 1 only if both bits are 1.',
  'Bitwise OR: Compares each bit of two numbers. The result bit is 1 if either bit is 1.',
  'Bitwise XOR: Compares each bit of two numbers. The result bit is 1 if the bits are different.',
  'Bitwise NOT: Flips every bit (0 becomes 1, 1 becomes 0).',
  'Left Shift: Moves all bits to the left by a certain number of positions, filling with 0s. Each shift multiplies the number by 2.',
  'Right Shift: Moves all bits to the right by a certain number of positions, filling with 0s. Each shift divides the number by 2.',
  'Count Set Bits: Count how many bits are 1 in the binary representation.',
  'Pattern Match: Match a specific bit pattern (e.g., alternating 1s and 0s).',
  'Bit Puzzle: Combine AND, OR, XOR, and shifts to reach the target.',
];

function LevelToggleBits({ onComplete }) {
  const [bits, setBits] = useState([0, 0, 0, 0, 0]);
  const [showAnswer, setShowAnswer] = useState(false);
  const target = 13;
  const answer = [0, 1, 1, 0, 1]; // 13 in 5 bits
  const value = bits.reduce((acc, bit, idx) => acc + (bit << (4 - idx)), 0);
    return (
    <div className="flex flex-col items-center space-y-6">
      <div className="mb-2 text-blue-900 font-semibold">{levelExplanations[0]}</div>
      <div className="text-lg font-semibold text-blue-700">Target: {target}</div>
      <div className="grid grid-cols-5 gap-4">
        {(showAnswer ? answer : bits).map((bit, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (showAnswer) return;
              const newBits = [...bits];
              newBits[idx] = newBits[idx] ? 0 : 1;
              setBits(newBits);
            }}
            className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 shadow-md bg-blue-100 border-blue-400 ${showAnswer ? 'ring-4 ring-green-400' : ''}`}
          >
            <div className="text-2xl font-bold text-blue-900">{bit}</div>
            <div className="text-sm text-blue-500">2^{4 - idx}</div>
          </motion.div>
        ))}
          </div>
      <div className="text-xl font-bold text-blue-800">Current: {value}</div>
      <div className="flex space-x-4 mt-2">
          <button
          onClick={() => setShowAnswer((prev) => !prev)}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg font-bold text-lg transition-all duration-300"
          >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        {value === target && !showAnswer && (
          <button
            onClick={onComplete}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-all duration-300"
          >
            Complete Level
          </button>
        )}
        </div>
    </div>
  );
}

// Level 2: Bitwise AND
function LevelBitwiseAND({ onComplete }) {
  const [a, setA] = useState(13);
  const [b, setB] = useState(7);
  const [bits, setBits] = useState([0, 0, 0, 0, 0]);
  const [showAnswer, setShowAnswer] = useState(false);
  const target = a & b;
  const answer = bits.map((bit, idx) => ((a & b) & (1 << (4 - idx))) !== 0 ? 1 : 0);
  const value = bits.reduce((acc, bit, idx) => acc + (bit << (4 - idx)), 0);
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="mb-2 text-blue-900 font-semibold">{levelExplanations[1]}</div>
      <div className="text-lg font-semibold text-blue-700">A: {a} ({a.toString(2).padStart(5, '0')})</div>
      <div className="text-lg font-semibold text-blue-700">B: {b} ({b.toString(2).padStart(5, '0')})</div>
      <div className="text-lg text-blue-700">Set the bits to match A & B = {target}</div>
      <div className="grid grid-cols-5 gap-4">
        {(showAnswer ? answer : bits).map((bit, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (showAnswer) return;
              const newBits = [...bits];
              newBits[idx] = newBits[idx] ? 0 : 1;
              setBits(newBits);
            }}
            className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 shadow-md bg-blue-100 border-blue-400 ${showAnswer ? 'ring-4 ring-green-400' : ''}`}
          >
            <div className="text-2xl font-bold text-blue-900">{bit}</div>
            <div className="text-sm text-blue-500">2^{4 - idx}</div>
          </motion.div>
              ))}
            </div>
      <div className="text-xl font-bold text-blue-800">Current: {value}</div>
      <div className="flex space-x-4 mt-2">
          <button
          onClick={() => setShowAnswer((prev) => !prev)}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg font-bold text-lg transition-all duration-300"
          >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        {value === target && !showAnswer && (
          <button
            onClick={onComplete}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-all duration-300"
          >
            Complete Level
          </button>
        )}
        </div>
    </div>
  );
}

// Level 3: Bitwise OR
function LevelBitwiseOR({ onComplete }) {
  const [a, setA] = useState(9);
  const [b, setB] = useState(18);
  const [bits, setBits] = useState([0, 0, 0, 0, 0]);
  const [showAnswer, setShowAnswer] = useState(false);
  const target = a | b;
  const answer = bits.map((bit, idx) => ((a | b) & (1 << (4 - idx))) !== 0 ? 1 : 0);
  const value = bits.reduce((acc, bit, idx) => acc + (bit << (4 - idx)), 0);
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="mb-2 text-blue-900 font-semibold">{levelExplanations[2]}</div>
      <div className="text-lg font-semibold text-blue-700">A: {a} ({a.toString(2).padStart(5, '0')})</div>
      <div className="text-lg font-semibold text-blue-700">B: {b} ({b.toString(2).padStart(5, '0')})</div>
      <div className="text-lg text-blue-700">Set the bits to match A | B = {target}</div>
      <div className="grid grid-cols-5 gap-4">
        {(showAnswer ? answer : bits).map((bit, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (showAnswer) return;
              const newBits = [...bits];
              newBits[idx] = newBits[idx] ? 0 : 1;
              setBits(newBits);
            }}
            className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 shadow-md bg-blue-100 border-blue-400 ${showAnswer ? 'ring-4 ring-green-400' : ''}`}
          >
            <div className="text-2xl font-bold text-blue-900">{bit}</div>
            <div className="text-sm text-blue-500">2^{4 - idx}</div>
          </motion.div>
              ))}
            </div>
      <div className="text-xl font-bold text-blue-800">Current: {value}</div>
      <div className="flex space-x-4 mt-2">
          <button
          onClick={() => setShowAnswer((prev) => !prev)}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg font-bold text-lg transition-all duration-300"
          >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        {value === target && !showAnswer && (
          <button
            onClick={onComplete}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-all duration-300"
              >
            Complete Level
              </button>
            )}
          </div>
      </div>
    );
}

// Level 4: Bitwise XOR
function LevelBitwiseXOR({ onComplete }) {
  const [a, setA] = useState(21);
  const [b, setB] = useState(10);
  const [bits, setBits] = useState([0, 0, 0, 0, 0]);
  const [showAnswer, setShowAnswer] = useState(false);
  const target = a ^ b;
  const answer = bits.map((bit, idx) => ((a ^ b) & (1 << (4 - idx))) !== 0 ? 1 : 0);
  const value = bits.reduce((acc, bit, idx) => acc + (bit << (4 - idx)), 0);
    return (
    <div className="flex flex-col items-center space-y-6">
      <div className="mb-2 text-blue-900 font-semibold">{levelExplanations[3]}</div>
      <div className="text-lg font-semibold text-blue-700">A: {a} ({a.toString(2).padStart(5, '0')})</div>
      <div className="text-lg font-semibold text-blue-700">B: {b} ({b.toString(2).padStart(5, '0')})</div>
      <div className="text-lg text-blue-700">Set the bits to match A ^ B = {target}</div>
      <div className="grid grid-cols-5 gap-4">
        {(showAnswer ? answer : bits).map((bit, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (showAnswer) return;
              const newBits = [...bits];
              newBits[idx] = newBits[idx] ? 0 : 1;
              setBits(newBits);
            }}
            className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 shadow-md bg-blue-100 border-blue-400 ${showAnswer ? 'ring-4 ring-green-400' : ''}`}
          >
            <div className="text-2xl font-bold text-blue-900">{bit}</div>
            <div className="text-sm text-blue-500">2^{4 - idx}</div>
          </motion.div>
        ))}
          </div>
      <div className="text-xl font-bold text-blue-800">Current: {value}</div>
      <div className="flex space-x-4 mt-2">
            <button
          onClick={() => setShowAnswer((prev) => !prev)}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg font-bold text-lg transition-all duration-300"
            >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        {value === target && !showAnswer && (
          <button
            onClick={onComplete}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-all duration-300"
          >
            Complete Level
          </button>
        )}
        </div>
    </div>
  );
}

// Level 5: Bitwise NOT
function LevelBitwiseNOT({ onComplete }) {
  const [a, setA] = useState(19);
  const [bits, setBits] = useState([0, 0, 0, 0, 0]);
  const [showAnswer, setShowAnswer] = useState(false);
  const target = (~a) & 0b11111;
  const answer = bits.map((bit, idx) => ((~a & 0b11111) & (1 << (4 - idx))) !== 0 ? 1 : 0);
  const value = bits.reduce((acc, bit, idx) => acc + (bit << (4 - idx)), 0);
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="mb-2 text-blue-900 font-semibold">{levelExplanations[4]}</div>
      <div className="text-lg font-semibold text-blue-700">A: {a} ({a.toString(2).padStart(5, '0')})</div>
      <div className="text-lg text-blue-700">Set the bits to match ~A = {target}</div>
      <div className="grid grid-cols-5 gap-4">
        {(showAnswer ? answer : bits).map((bit, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (showAnswer) return;
              const newBits = [...bits];
              newBits[idx] = newBits[idx] ? 0 : 1;
              setBits(newBits);
            }}
            className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 shadow-md bg-blue-100 border-blue-400 ${showAnswer ? 'ring-4 ring-green-400' : ''}`}
          >
            <div className="text-2xl font-bold text-blue-900">{bit}</div>
            <div className="text-sm text-blue-500">2^{4 - idx}</div>
          </motion.div>
                ))}
                  </div>
      <div className="text-xl font-bold text-blue-800">Current: {value}</div>
      <div className="flex space-x-4 mt-2">
              <button
          onClick={() => setShowAnswer((prev) => !prev)}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg font-bold text-lg transition-all duration-300"
              >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
              </button>
        {value === target && !showAnswer && (
              <button
            onClick={onComplete}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-all duration-300"
              >
            Complete Level
              </button>
            )}
          </div>
      </div>
    );
}

// Level 6: Left Shift
function LevelLeftShift({ onComplete }) {
  const [a, setA] = useState(3);
  const [shift, setShift] = useState(2);
  const [bits, setBits] = useState([0, 0, 0, 0, 0]);
  const [showAnswer, setShowAnswer] = useState(false);
  const target = (a << shift) & 0b11111;
  const answer = bits.map((bit, idx) => ((a << shift) & 0b11111 & (1 << (4 - idx))) !== 0 ? 1 : 0);
  const value = bits.reduce((acc, bit, idx) => acc + (bit << (4 - idx)), 0);
    return (
    <div className="flex flex-col items-center space-y-6">
      <div className="mb-2 text-blue-900 font-semibold">{levelExplanations[5]}</div>
      <div className="text-lg font-semibold text-blue-700">A: {a} ({a.toString(2).padStart(5, '0')})</div>
      <div className="text-lg font-semibold text-blue-700">Shift: {shift} positions left</div>
      <div className="text-lg text-blue-700">Set the bits to match A &lt;&lt; {shift} = {target}</div>
      <div className="grid grid-cols-5 gap-4">
        {(showAnswer ? answer : bits).map((bit, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (showAnswer) return;
              const newBits = [...bits];
              newBits[idx] = newBits[idx] ? 0 : 1;
              setBits(newBits);
            }}
            className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 shadow-md bg-blue-100 border-blue-400 ${showAnswer ? 'ring-4 ring-green-400' : ''}`}
          >
            <div className="text-2xl font-bold text-blue-900">{bit}</div>
            <div className="text-sm text-blue-500">2^{4 - idx}</div>
          </motion.div>
        ))}
          </div>
      <div className="text-xl font-bold text-blue-800">Current: {value}</div>
      <div className="flex space-x-4 mt-2">
            <button
          onClick={() => setShowAnswer((prev) => !prev)}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg font-bold text-lg transition-all duration-300"
            >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
        {value === target && !showAnswer && (
            <button
            onClick={onComplete}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-all duration-300"
            >
            Complete Level
            </button>
            )}
          </div>
      </div>
    );
}

// Level 7: Right Shift
function LevelRightShift({ onComplete }) {
  const [a, setA] = useState(24);
  const [shift, setShift] = useState(3);
  const [bits, setBits] = useState([0, 0, 0, 0, 0]);
  const [showAnswer, setShowAnswer] = useState(false);
  const target = (a >> shift) & 0b11111;
  const answer = bits.map((bit, idx) => ((a >> shift) & 0b11111 & (1 << (4 - idx))) !== 0 ? 1 : 0);
  const value = bits.reduce((acc, bit, idx) => acc + (bit << (4 - idx)), 0);
    return (
    <div className="flex flex-col items-center space-y-6">
      <div className="mb-2 text-blue-900 font-semibold">{levelExplanations[6]}</div>
      <div className="text-lg font-semibold text-blue-700">A: {a} ({a.toString(2).padStart(5, '0')})</div>
      <div className="text-lg font-semibold text-blue-700">Shift: {shift} positions right</div>
      <div className="text-lg text-blue-700">Set the bits to match A &gt;&gt; {shift} = {target}</div>
      <div className="grid grid-cols-5 gap-4">
        {(showAnswer ? answer : bits).map((bit, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (showAnswer) return;
              const newBits = [...bits];
              newBits[idx] = newBits[idx] ? 0 : 1;
              setBits(newBits);
            }}
            className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 shadow-md bg-blue-100 border-blue-400 ${showAnswer ? 'ring-4 ring-green-400' : ''}`}
          >
            <div className="text-2xl font-bold text-blue-900">{bit}</div>
            <div className="text-sm text-blue-500">2^{4 - idx}</div>
          </motion.div>
                ))}
              </div>
      <div className="text-xl font-bold text-blue-800">Current: {value}</div>
      <div className="flex space-x-4 mt-2">
            <button
          onClick={() => setShowAnswer((prev) => !prev)}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg font-bold text-lg transition-all duration-300"
            >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
        {value === target && !showAnswer && (
            <button
            onClick={onComplete}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-all duration-300"
            >
            Complete Level
            </button>
        )}
          </div>
        </div>
  );
}

// Level 8: Count Set Bits
function LevelCountBits({ onComplete }) {
  const [a, setA] = useState(23);
  const [userCount, setUserCount] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const correct = a.toString(2).split('').filter((b) => b === '1').length;
  const answer = correct.toString();
  return (
          <div className="flex flex-col items-center space-y-6">
      <div className="mb-2 text-blue-900 font-semibold">{levelExplanations[7]}</div>
      <div className="text-lg font-semibold text-blue-700">A: {a} ({a.toString(2).padStart(5, '0')})</div>
      <div className="text-lg text-blue-700">How many 1s are in the binary representation?</div>
              <input
                type="number"
        value={userCount}
        onChange={(e) => setUserCount(e.target.value)}
        className="w-32 px-4 py-2 bg-blue-100 border-2 border-blue-400 text-blue-900 rounded-lg text-xl text-center"
                placeholder="Count"
              />
      {showAnswer && (
        <div className="text-xl font-bold text-blue-800">Correct Answer: {answer}</div>
      )}
      <div className="flex space-x-4 mt-2">
          <button
          onClick={() => setShowAnswer((prev) => !prev)}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg font-bold text-lg transition-all duration-300"
          >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        {parseInt(userCount) === correct && !showAnswer && (
              <button
            onClick={onComplete}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-all duration-300"
              >
            Complete Level
              </button>
            )}
          </div>
      </div>
    );
}

// Level 9: Pattern Match (e.g., alternating 1s and 0s)
function LevelPatternMatch({ onComplete }) {
  // Even/Odd check with bit manipulation
  const [number, setNumber] = useState(() => Math.floor(Math.random() * 32));
  const [userChoice, setUserChoice] = useState(null); // 'even' or 'odd'
  const [showAnswer, setShowAnswer] = useState(false);
  const isEven = (number & 1) === 0;
  const correct = isEven ? 'even' : 'odd';
  const explanation = `A number is even if its least significant bit (LSB) is 0. In binary, ${number.toString(2).padStart(5, '0')} & 1 = ${number & 1}.`;

    return (
    <div className="flex flex-col items-center space-y-6">
      <div className="mb-2 text-blue-900 font-semibold">{levelExplanations[8]}</div>
      <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded text-blue-900 max-w-xl text-left">
        <div className="font-bold mb-1">How to Check Even or Odd with Bit Manipulation:</div>
        <ul className="list-disc pl-6 mb-2">
          <li>Binary numbers end with a <span className="font-bold">0</span> if they are <span className="font-bold">even</span>, and with a <span className="font-bold">1</span> if they are <span className="font-bold">odd</span>.</li>
          <li>The <span className="font-bold">least significant bit (LSB)</span> (the rightmost bit) tells you this.</li>
        </ul>
        <div className="mb-2">Use the bitwise AND operation:</div>
        <div className="font-mono bg-blue-100 px-2 py-1 rounded inline-block mb-2">number & 1</div>
        <ul className="list-disc pl-6">
          <li>If <span className="font-mono">number & 1</span> is <span className="font-bold">0</span>, the number is <span className="font-bold">even</span>.</li>
          <li>If <span className="font-mono">number & 1</span> is <span className="font-bold">1</span>, the number is <span className="font-bold">odd</span>.</li>
        </ul>
        <div className="mt-2">Example: <br/>
          <span className="font-mono">18</span> (<span className="font-mono">10010</span>) &rarr; <span className="font-mono">18 & 1 = 0</span> (Even)<br/>
          <span className="font-mono">23</span> (<span className="font-mono">10111</span>) &rarr; <span className="font-mono">23 & 1 = 1</span> (Odd)
          </div>
          </div>
      <div className="text-lg font-semibold text-blue-700">Is this number even or odd?</div>
      <div className="text-3xl font-mono text-blue-900">{number} <span className="text-lg">({number.toString(2).padStart(5, '0')})</span></div>
      <div className="flex space-x-6 mt-2">
          <button
          onClick={() => setUserChoice('even')}
          className={`px-6 py-3 rounded-lg font-bold border-2 transition-all duration-200 ${userChoice === 'even' ? 'bg-blue-600 text-white border-blue-700' : 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'}`}
          >
          Even
          </button>
          <button
          onClick={() => setUserChoice('odd')}
          className={`px-6 py-3 rounded-lg font-bold border-2 transition-all duration-200 ${userChoice === 'odd' ? 'bg-blue-600 text-white border-blue-700' : 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'}`}
        >
          Odd
          </button>
        </div>
      {userChoice && !showAnswer && (
        <div className={`text-xl font-bold mt-2 ${userChoice === correct ? 'text-green-600' : 'text-red-600'}`}>{userChoice === correct ? 'Correct!' : 'Incorrect, try again.'}</div>
      )}
      {showAnswer && (
        <div className="mt-4 p-4 bg-green-100 border-2 border-green-400 rounded-lg text-blue-900 font-semibold">
          The correct answer is <span className="font-bold">{correct.toUpperCase()}</span>.<br/>
          {explanation}
        </div>
      )}
      <div className="flex space-x-4 mt-2">
          <button
          onClick={() => setShowAnswer((prev) => !prev)}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg font-bold text-lg transition-all duration-300"
          >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        {userChoice === correct && !showAnswer && (
          <button
            onClick={onComplete}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-all duration-300"
          >
            Complete Level
          </button>
        )}
        {showAnswer && (
          <button
            onClick={() => {
              setNumber(Math.floor(Math.random() * 32));
              setUserChoice(null);
              setShowAnswer(false);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-lg transition-all duration-300"
          >
            Try Another
          </button>
        )}
        </div>
          </div>
        );
    }

// Level 10: Bit Puzzle (reach a target using AND, OR, XOR, shifts)
function LevelBitPuzzle({ onComplete }) {
  const [a, setA] = useState(6);
  const [b, setB] = useState(25);
  const [op, setOp] = useState('AND');
  const [bits, setBits] = useState([0, 0, 0, 0, 0]);
  const [showAnswer, setShowAnswer] = useState(false);
  const target = ((op === 'AND' ? (a & b) : op === 'OR' ? (a | b) : op === 'XOR' ? (a ^ b) : a) << 1) & 0b11111;
  const answer = bits.map((bit, idx) => ((op === 'AND' ? (a & b) : op === 'OR' ? (a | b) : op === 'XOR' ? (a ^ b) : a) << 1 & 0b11111 & (1 << (4 - idx))) !== 0 ? 1 : 0);
  const value = bits.reduce((acc, bit, idx) => acc + (bit << (4 - idx)), 0);
    return (
          <div className="flex flex-col items-center space-y-6">
      <div className="mb-2 text-blue-900 font-semibold">{levelExplanations[9]}</div>
      <div className="text-lg font-semibold text-blue-700">A: {a} ({a.toString(2).padStart(5, '0')})</div>
      <div className="text-lg font-semibold text-blue-700">B: {b} ({b.toString(2).padStart(5, '0')})</div>
      <div className="flex space-x-2 mb-2">
        {['AND', 'OR', 'XOR'].map((o) => (
              <button
            key={o}
            onClick={() => setOp(o)}
            className={`px-4 py-2 rounded-lg font-bold border-2 transition-all duration-200
              ${op === o ? 'bg-blue-600 text-white border-blue-700' : 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'}`}
          >
            {o}
              </button>
        ))}
            </div>
      <div className="text-lg text-blue-700">Set the bits to match ((A {op} B) &lt;&lt; 1) = {target}</div>
      <div className="grid grid-cols-5 gap-4">
        {(showAnswer ? answer : bits).map((bit, idx) => (
              <motion.div
            key={idx}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (showAnswer) return;
              const newBits = [...bits];
              newBits[idx] = newBits[idx] ? 0 : 1;
              setBits(newBits);
            }}
            className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center cursor-pointer border-2 shadow-md bg-blue-100 border-blue-400 ${showAnswer ? 'ring-4 ring-green-400' : ''}`}
          >
            <div className="text-2xl font-bold text-blue-900">{bit}</div>
            <div className="text-sm text-blue-500">2^{4 - idx}</div>
              </motion.div>
                ))}
              </div>
      <div className="text-xl font-bold text-blue-800">Current: {value}</div>
      <div className="flex space-x-4 mt-2">
          <button
          onClick={() => setShowAnswer((prev) => !prev)}
          className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-900 rounded-lg font-bold text-lg transition-all duration-300"
        >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        {value === target && !showAnswer && (
          <button
            onClick={onComplete}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-all duration-300"
          >
            Complete Level
          </button>
        )}
        </div>
    </div>
  );
}

function LevelPlaceholder({ title, onComplete }) {
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-lg font-semibold text-blue-700">{title} Challenge Coming Soon!</div>
              <button
        onClick={onComplete}
        className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-all duration-300"
              >
        Complete Level
              </button>
      </div>
    );
}

const BitManipulationMaster = () => {
  const { user } = useAuth();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedLevels, setCompletedLevels] = useState(new Set());
  const [levelStartTime, setLevelStartTime] = useState(Date.now());
  const [gameMessage, setGameMessage] = useState('');

  // Load progress when component mounts
  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  // Reset level start time when level changes
  useEffect(() => {
    setLevelStartTime(Date.now());
  }, [currentLevel]);

  // Clear game message after 3 seconds
  useEffect(() => {
    if (gameMessage) {
      const timer = setTimeout(() => {
        setGameMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameMessage]);

  // Load progress from database
  const loadProgress = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${BACKEND_URL}/api/game-progress/progress/bit-manipulation`, {
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
        topicId: 'bit-manipulation',
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
        console.error('Failed to save progress:', errorData.message || response.statusText);
        throw new Error(`Failed to save progress: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log('Progress save response:', data);
      
      if (data.success) {
        // Update local progress state
        setCompletedLevels(prev => {
          const newState = new Set([...prev, level]);
          console.log('Updated completed levels:', Array.from(newState));
          return newState;
        });

        // Dispatch progress update event for Games component
        window.dispatchEvent(new CustomEvent('progressUpdated', {
          detail: { topicId: 'bit-manipulation', level, score }
        }));

        console.log(`Successfully saved progress for level ${level}:`, data);
      } else {
        throw new Error(data.error || 'Failed to save progress');
      }

    } catch (error) {
      console.error('Error saving progress:', error);
      setGameMessage(`Failed to save progress: ${error.message}`);
    }
  };

  // Handle level completion
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
    setGameMessage(`Level ${level} completed! Great job!`);
  };

  const handleComplete = () => {
    handleLevelComplete(currentLevel);
    if (currentLevel < MAX_LEVEL) setCurrentLevel(currentLevel + 1);
  };

  const LevelComponent = levelConfigs[currentLevel - 1].render;

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
              <span className="text-lg font-semibold text-green-700">Level {currentLevel} of {MAX_LEVEL}</span>
        </div>
                    <button
              onClick={() => setCurrentLevel(Math.min(MAX_LEVEL, currentLevel + 1))}
          disabled={currentLevel === MAX_LEVEL}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg
            ${currentLevel === MAX_LEVEL
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
              {Array.from({ length: MAX_LEVEL }, (_, index) => {
                const levelNumber = index + 1;
                const isCurrent = currentLevel === levelNumber;
                const isCompleted = completedLevels.has(levelNumber);
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

          {/* Game Title and Description */}
          <h1 className="text-5xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-lg tracking-tight relative z-10 font-serif">
            Bit Manipulation Master
          </h1>
          <h2 className="text-2xl font-bold text-blue-700 mb-4">{levelConfigs[currentLevel - 1].title}</h2>
          <p className="text-lg text-gray-700 mb-6 text-center max-w-2xl">{levelConfigs[currentLevel - 1].description}</p>

          {/* Success Message */}
          {gameMessage && (
              <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center"
            >
              {gameMessage}
              </motion.div>
          )}

          {/* Level Content */}
          <div className="w-full">
            <LevelComponent onComplete={handleComplete} />
        </div>

          {/* Back to Dashboard */}
          <div className="text-center mt-8">
            <Link 
              to="/dashboard"
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold border-2 border-gray-300 shadow-md transition-all duration-300"
            >
              ← Back to Dashboard
              </Link>
          </div>
      </div>
      </div>
    </div>
  );
};

export default BitManipulationMaster; 