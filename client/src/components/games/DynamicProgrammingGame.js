import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameDecorations from './GameDecorations';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ComingSoon = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 p-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <GameDecorations />
      </div>
      <div className="z-10 flex flex-col items-center w-full">
        <div className="text-7xl mb-6 animate-bounce drop-shadow-lg">🧙‍♂️</div>
        <div className="bg-white/90 rounded-2xl shadow-2xl px-8 py-10 max-w-xl flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-2 text-center drop-shadow">Dynamic Programming Game</h1>
          <div className="text-xl md:text-2xl text-blue-700 mb-4 text-center font-semibold">Coming Soon!</div>
          <div className="max-w-lg text-center text-gray-700 mb-6">
            <p className="mb-2">
              Get ready for an epic adventure in Dynamic Programming! 🚀<br/>
              Solve puzzles, master optimization, and level up your problem-solving skills.
            </p>
            <p className="text-purple-700 font-semibold">Stay tuned for new levels and challenges!</p>
          </div>
          <div className="flex gap-3 mb-6">
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold shadow">Memoization</span>
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold shadow">Tabulation</span>
            <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold shadow">Optimization</span>
          </div>
          <button
            className="mt-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold text-xl hover:bg-blue-700 transition-colors shadow-lg"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

const RobotFace = ({ happy }) => (
  <div className="flex flex-col items-center">
    <span className="text-6xl">🤖</span>
    <span className={`text-lg font-bold ${happy ? 'text-green-500' : 'text-red-500'}`}>{happy ? 'Roby (Happy)' : 'Roby (Frustrated)'}</span>
  </div>
);

const ThoughtBubble = ({ text, show }) => (
  <div className={`transition-all duration-300 ${show ? 'opacity-100' : 'opacity-0'} absolute left-1/2 -translate-x-1/2 -top-16`}> 
    <div className="bg-white border border-gray-300 rounded-full px-6 py-2 shadow text-lg font-semibold text-gray-700">
      {text}
    </div>
  </div>
);

const WizardFace = ({ happy }) => (
  <div className="flex flex-col items-center">
    <span className="text-6xl">🧙‍♂️</span>
    <span className={`text-lg font-bold ${happy ? 'text-green-500' : 'text-yellow-600'}`}>{happy ? 'Wizard (Relaxed)' : 'Wizard (Thinking)'}</span>
  </div>
);

const WizardMemoFace = ({ happy }) => (
  <div className="flex flex-col items-center">
    <span className="text-6xl">🧙‍♂️</span>
    <span className={`text-lg font-bold ${happy ? 'text-red-500' : 'text-gray-500'}`}>Memo Wizard</span>
  </div>
);

const WizardTabFace = ({ happy }) => (
  <div className="flex flex-col items-center">
    <span className="text-6xl">🧙‍♂️</span>
    <span className={`text-lg font-bold ${happy ? 'text-blue-500' : 'text-gray-500'}`}>Tabular Wizard</span>
  </div>
);

const SpellBook = ({ spells, highlight }) => (
  <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 min-w-[180px] min-h-[120px] flex flex-col items-center">
    <div className="font-bold text-yellow-700 mb-2">Spell Book</div>
    <div className="flex flex-wrap gap-2 justify-center">
      {[...Array(Math.max(2, Math.max(...Object.keys(spells).map(Number), 0) + 1)).keys()].map(i => (
        <div
          key={i}
          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-lg font-bold transition-all duration-300 ${spells[i] !== undefined ? (highlight === i ? 'bg-green-300 border-green-600 shadow-lg animate-pulse' : 'bg-yellow-300 border-yellow-600') : 'bg-gray-200 border-gray-300 text-gray-400'}`}
        >
          {spells[i] !== undefined ? spells[i] : '?'}
        </div>
      ))}
    </div>
  </div>
);

const SpellBookDP = ({ spells, highlight, direction }) => (
  <div className={`p-4 min-w-[180px] min-h-[120px] flex flex-col items-center rounded-lg border-2 ${direction === 'backward' ? 'bg-red-50 border-red-400' : 'bg-blue-50 border-blue-400'}`}>
    <div className={`font-bold mb-2 ${direction === 'backward' ? 'text-red-700' : 'text-blue-700'}`}>Spell Book</div>
    <div className="flex flex-wrap gap-2 justify-center">
      {[...Array(Math.max(2, Math.max(...Object.keys(spells).map(Number), 0) + 1)).keys()].map(i => (
        <div
          key={i}
          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-lg font-bold transition-all duration-300 ${spells[i] !== undefined ? (highlight === i ? (direction === 'backward' ? 'bg-red-300 border-red-600' : 'bg-blue-300 border-blue-600') + ' shadow-lg animate-pulse' : (direction === 'backward' ? 'bg-red-200 border-red-600' : 'bg-blue-200 border-blue-600')) : 'bg-gray-200 border-gray-300 text-gray-400'}`}
        >
          {spells[i] !== undefined ? spells[i] : '?'}
        </div>
      ))}
    </div>
  </div>
);

const BuilderFace = ({ happy }) => (
  <div className="flex flex-col items-center">
    <span className="text-6xl">👷‍♂️</span>
    <span className={`text-lg font-bold ${happy ? 'text-green-600' : 'text-blue-700'}`}>{happy ? 'Builder (Proud)' : 'Builder (Working)'}</span>
  </div>
);

const BlueprintTable = ({ table, highlight }) => (
  <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 min-w-[180px] min-h-[120px] flex flex-col items-center">
    <div className="font-bold text-blue-700 mb-2">Blueprint Table</div>
    <div className="flex flex-wrap gap-2 justify-center">
      {table.map((val, i) => (
        <div
          key={i}
          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-lg font-bold transition-all duration-300 ${val !== null ? (highlight === i ? 'bg-green-300 border-green-600 shadow-lg animate-pulse' : 'bg-blue-200 border-blue-600') : 'bg-gray-200 border-gray-300 text-gray-400'}`}
        >
          {val !== null ? val : '?'}
        </div>
      ))}
    </div>
  </div>
);

const MazeCell = ({ type, isRobot, isPath, isOptimal, hasPowerUp, onClick }) => {
  let bg = 'bg-white';
  if (type === 'obstacle') bg = 'bg-gray-400';
  if (isRobot) bg = 'bg-yellow-200';
  if (isPath) bg = 'bg-green-200';
  if (isOptimal) bg = 'bg-blue-200';
  return (
    <div
      className={`w-10 h-10 border border-gray-300 flex items-center justify-center relative cursor-pointer ${bg}`}
      onClick={onClick}
    >
      {isRobot ? '🤖' : hasPowerUp ? '⚡' : ''}
      {type === 'obstacle' && <span className="text-gray-700">⛔</span>}
      {isOptimal && <span className="absolute bottom-0 right-0 text-xs text-blue-700">★</span>}
    </div>
  );
};

const MazeCellDP = ({ value, isCurrent, isPath, isPower, isObstacle, isOptimal, onClick }) => {
  let bg = 'bg-white';
  if (isObstacle) bg = 'bg-gray-400';
  if (isCurrent) bg = 'bg-yellow-200';
  if (isPath) bg = 'bg-green-200';
  if (isOptimal) bg = 'bg-blue-200';
  return (
    <div
      className={`w-12 h-12 border border-gray-300 flex items-center justify-center relative font-bold text-lg transition-all duration-300 ${bg}`}
      onClick={onClick}
    >
      {isPower && <span className="absolute top-0 left-0 text-yellow-500">⚡</span>}
      {isObstacle && <span className="text-gray-700">⛔</span>}
      {value !== null && !isObstacle && <span>{value}</span>}
      {isOptimal && <span className="absolute bottom-0 right-0 text-xs text-blue-700">★</span>}
    </div>
  );
};

const defaultMaze = [
  ['start', '', '', 'power', ''],
  ['', 'obstacle', '', '', ''],
  ['', '', 'obstacle', '', 'power'],
  ['', '', '', '', ''],
  ['', '', '', 'obstacle', 'end'],
];

const defaultMazeDP = [
  ['start', '', '', 'power', ''],
  ['', 'obstacle', '', '', ''],
  ['', '', 'obstacle', '', 'power'],
  ['', '', '', '', ''],
  ['', '', '', 'obstacle', 'end'],
];

const WizardLevel = ({ goToNextLevel }) => {
  const [showGame, setShowGame] = useState(false);
  const [withMemory, setWithMemory] = useState(true);
  const [fibLevel, setFibLevel] = useState(5);
  const [wizardThinking, setWizardThinking] = useState(false);
  const [thoughts, setThoughts] = useState([]); // [{text, key}]
  const [spellBook, setSpellBook] = useState({ 0: 0, 1: 1 });
  const [highlight, setHighlight] = useState(null);
  const [steps, setSteps] = useState(0);
  const [timer, setTimer] = useState(0);
  const [result, setResult] = useState(null);
  const [isCasting, setIsCasting] = useState(false);
  const [showMemoryEffect, setShowMemoryEffect] = useState(false);
  const [showNoMemoryEffect, setShowNoMemoryEffect] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  // Simulate recursive Fibonacci with/without memoization
  const sleep = ms => new Promise(res => setTimeout(res, ms));

  const castSpell = async () => {
    setIsCasting(true);
    setResult(null);
    setSteps(0);
    setTimer(0);
    setSpellBook({ 0: 0, 1: 1 });
    setThoughts([]);
    setHighlight(null);
    setShowMemoryEffect(false);
    setShowNoMemoryEffect(false);
    let t0 = Date.now();
    let stepsCount = 0;
    let memoryUsed = false;
    let noMemoryUsed = false;
    let spellBookLocal = { 0: 0, 1: 1 };
    const think = async (n) => {
      setWizardThinking(true);
      setThoughts(ths => [...ths, { text: `I need Fib(${n})`, key: Math.random() }]);
      await sleep(2000);
      stepsCount++;
      if (withMemory && spellBookLocal[n] !== undefined) {
        setThoughts(ths => [...ths, { text: `Oh! I remember Fib(${n})`, key: Math.random() }]);
        setHighlight(n);
        setShowMemoryEffect(true);
        memoryUsed = true;
        await sleep(2000);
        setShowMemoryEffect(false);
        setHighlight(null);
        setWizardThinking(false);
        return spellBookLocal[n];
      }
      if (!withMemory && spellBookLocal[n] !== undefined) {
        setThoughts(ths => [...ths, { text: `Oh! I remember Fib(${n})`, key: Math.random() }]);
        setHighlight(n);
        setShowNoMemoryEffect(true);
        noMemoryUsed = true;
        await sleep(2000);
        setShowNoMemoryEffect(false);
        setHighlight(null);
        setWizardThinking(false);
        return spellBookLocal[n];
      }
      if (n <= 1) {
        setWizardThinking(false);
        return n;
      }
      setThoughts(ths => [...ths, { text: `I need Fib(${n-1}) and Fib(${n-2})`, key: Math.random() }]);
      await sleep(2000);
      let a = await think(n-1);
      let b = await think(n-2);
      let val = a + b;
      spellBookLocal[n] = val;
      setSpellBook(sb => ({ ...sb, [n]: val }));
      setHighlight(n);
      await sleep(2000);
      setHighlight(null);
      setWizardThinking(false);
      return val;
    };
    let val = await think(fibLevel);
    setResult(val);
    setSteps(stepsCount);
    setTimer(((Date.now() - t0) / 1000).toFixed(2));
    setIsCasting(false);
    setThoughts([]);
    setHighlight(null);
    setShowMemoryEffect(false);
    setShowNoMemoryEffect(false);
    setShowCompletion(true);
  };

  return (
    <div className="min-h-screen pt-16 p-5 bg-gray-50 flex flex-col items-center justify-center">
      {!showGame ? (
        <div className="max-w-3xl bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mb-10">
          <h2 className="text-3xl font-bold text-purple-600 mb-4">Level 2: Lazy Wizard's Memory Spells 🧙‍♂️</h2>
          <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded text-yellow-900 text-lg w-full">
            <span className="font-bold">What is Memoization?</span> Memoization is a technique where you remember the answers to problems you've already solved, so you don't have to solve them again. It's often used with <span className="font-bold text-blue-700">recursion</span>: when a recursive function is called with the same input, memoization lets you return the answer instantly instead of repeating all the work. In programming, it means storing the results of expensive function calls and returning the cached result when the same inputs occur again. This makes recursive algorithms much faster!
          </div>
          <p className="text-lg text-gray-700 mb-4 text-center">
            Play as a lazy wizard who only remembers spells when needed! See how memoization helps solve big problems by remembering answers to smaller ones.
          </p>
          <button
            className="mt-2 px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold text-xl hover:bg-blue-600 transition-colors"
            onClick={() => setShowGame(true)}
          >
            Start Wizard Game
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-purple-600 mb-2">Level 2: Lazy Wizard's Memory Spells 🧙‍♂️</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
            Wizard gets spell requests like <span className="font-bold text-blue-600">"Cast level {fibLevel} Fibonacci spell!"</span> and must use his memory to solve them efficiently.
          </p>
          <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8 items-center justify-center">
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[420px]">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xl font-bold text-gray-700">Wizard's Chamber</div>
              <div className="mt-16 mb-4 relative">
                <WizardFace happy={withMemory && !wizardThinking} />
                {thoughts.length > 0 && (
                  <div className="absolute left-1/2 -translate-x-1/2 -top-20 w-64">
                    {thoughts.slice(-2).map((t, i) => (
                      <div key={t.key} className="mb-2 animate-fade-in">
                        <div className="bg-[#00FF00] border border-gray-300 rounded-full px-4 py-2 shadow text-base font-medium text-xl text-black text-center">
                          {t.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-4 mb-4">
                <button
                  className={`px-4 py-2 rounded-lg font-semibold text-lg shadow ${withMemory ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 border border-gray-400'}`}
                  onClick={() => setWithMemory(true)}
                  disabled={withMemory}
                >
                  With Memory
                </button>
                <button
                  className={`px-4 py-2 rounded-lg font-semibold text-lg shadow ${!withMemory ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 border border-gray-400'}`}
                  onClick={() => setWithMemory(false)}
                  disabled={!withMemory}
                >
                  Without Memory
                </button>
              </div>
              <div className="flex gap-2 items-center mb-4">
                <span className="font-semibold text-gray-700">Spell Request:</span>
                <select
                  className="px-2 py-1 rounded border border-gray-300 text-lg"
                  value={fibLevel}
                  onChange={e => setFibLevel(Number(e.target.value))}
                  disabled={isCasting}
                >
                  {[...Array(16).keys()].slice(2).map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
                <span className="text-blue-600 font-bold">Fibonacci</span>
              </div>
              <button
                className="mt-2 px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold text-xl hover:bg-blue-600 transition-colors"
                onClick={castSpell}
                disabled={isCasting}
              >
                Cast Spell
              </button>
              <div className="mt-6 flex flex-col items-center">
                <SpellBook spells={spellBook} highlight={highlight} />
                {(showMemoryEffect || showNoMemoryEffect) && (
                  <div className={`mt-2 text-lg font-bold ${showMemoryEffect ? 'text-green-600 animate-pulse' : 'text-yellow-600 animate-pulse'}`}>
                    {showMemoryEffect ? 'Memory saved!' : 'No memory used!'}
                  </div>
                )}
              </div>
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="text-gray-700 text-lg">Steps taken: <span className="font-bold">{steps}</span></div>
                <div className="text-gray-700 text-lg">Time spent: <span className="font-bold">{timer}s</span></div>
                {result !== null && (
                  <div className="mt-2 text-xl font-bold text-blue-700">Result: Fib({fibLevel}) = {result}</div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10 text-2xl font-bold text-blue-700 text-center">
            Key Learning: <span className="text-purple-600">Top-down DP with memoization means you only solve what you need, and you remember it for next time!</span>
          </div>
          <button
            className="fixed bottom-6 right-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
            onClick={goToNextLevel}
          >
            Next Level →
          </button>

          {/* Completion Message Modal */}
          {showCompletion && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Spell Cast Complete! 🧙‍♂️</h2>
                <p className="text-gray-700 mb-6">
                  {withMemory ? (
                    <>
                      Great job using memoization! You solved Fib({fibLevel}) in just {steps} steps.
                      <br />
                      <span className="text-green-600 font-semibold">That's {Math.max(0, Math.floor((Math.pow(2, fibLevel) - steps) / Math.pow(2, fibLevel) * 100))}% faster than without memory!</span>
                    </>
                  ) : (
                    <>
                      You solved Fib({fibLevel}) in {steps} steps.
                      <br />
                      <span className="text-yellow-600 font-semibold">Try with memory enabled to see how much faster it can be!</span>
                    </>
                  )}
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowCompletion(false)}
                    className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Cast Another Spell
                  </button>
                  <button
                    onClick={goToNextLevel}
                    className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Next Level →
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const BuilderLevel = ({ goToNextLevel }) => {
  const [showGame, setShowGame] = useState(false);
  const [fibLevel, setFibLevel] = useState(5);
  const [table, setTable] = useState([0, 1]);
  const [highlight, setHighlight] = useState(null);
  const [steps, setSteps] = useState(0);
  const [timer, setTimer] = useState(0);
  const [result, setResult] = useState(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionHidden, setCompletionHidden] = useState(false);

  const sleep = ms => new Promise(res => setTimeout(res, ms));

  const buildTower = async () => {
    setIsBuilding(true);
    setResult(null);
    setSteps(0);
    setTimer(0);
    setTable([0, 1, ...Array(fibLevel - 1).fill(null)]);
    setHighlight(null);
    setCelebrate(false);
    let t0 = Date.now();
    let stepsCount = 0;
    let arr = [0, 1, ...Array(fibLevel - 1).fill(null)];
    for (let i = 2; i <= fibLevel; i++) {
      setHighlight(i);
      arr[i] = arr[i - 1] + arr[i - 2];
      setTable([...arr]);
      stepsCount++;
      await sleep(1200);
      setCelebrate(true);
      await sleep(600);
      setCelebrate(false);
    }
    setResult(arr[fibLevel]);
    setSteps(stepsCount);
    setTimer(((Date.now() - t0) / 1000).toFixed(2));
    setIsBuilding(false);
    setHighlight(null);
    setCelebrate(false);
    setShowCompletion(true);
  };

  return (
    <div className="min-h-screen pt-16 p-5 bg-gray-50 flex flex-col items-center justify-center">
      {!showGame ? (
        <div className="max-w-3xl bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mb-10">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">Level 3: Builder's Blueprint Strategy 🏗️</h2>
          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded text-blue-900 text-lg w-full">
            <span className="font-bold">What is Tabulation?</span> Tabulation is a bottom-up dynamic programming technique. Instead of solving problems recursively and remembering answers (like memoization), you start from the simplest case and build up solutions step by step, filling out a table as you go. This is called the <span className="font-bold text-blue-700">bottom-up approach</span> and is often more efficient because it avoids recursion entirely.
          </div>
          <p className="text-lg text-gray-700 mb-4 text-center">
            Play as a methodical builder constructing towers floor by floor! See how tabulation helps you build up solutions from the ground, filling out your blueprint as you go.
          </p>
          <button
            className="mt-2 px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold text-xl hover:bg-blue-600 transition-colors"
            onClick={() => setShowGame(true)}
          >
            Start Builder Game
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Level 3: Builder's Blueprint Strategy 🏗️</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
            Builder gets a request to build a <span className="font-bold text-blue-600">Fibonacci tower of {fibLevel} floors</span> and must fill out the blueprint table from the ground up.
          </p>
          <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8 items-center justify-center">
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[420px]">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xl font-bold text-gray-700">Builder's Site</div>
              <div className="mt-16 mb-4 relative">
                <BuilderFace happy={!isBuilding} />
                {celebrate && (
                  <div className="absolute left-1/2 -translate-x-1/2 -top-20 w-64 animate-bounce">
                    <div className="bg-green-100 border border-green-400 rounded-full px-4 py-2 shadow text-base font-semibold text-green-700 text-center">
                      Foundation complete!
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 items-center mb-4">
                <span className="font-semibold text-gray-700">Tower Height:</span>
                <select
                  className="px-2 py-1 rounded border border-gray-300 text-lg"
                  value={fibLevel}
                  onChange={e => setFibLevel(Number(e.target.value))}
                  disabled={isBuilding}
                >
                  {[...Array(16).keys()].slice(2).map(i => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
                <span className="text-blue-600 font-bold">Floors</span>
              </div>
              <button
                className="mt-2 px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold text-xl hover:bg-blue-600 transition-colors"
                onClick={buildTower}
                disabled={isBuilding}
              >
                Build Tower
              </button>
              <div className="mt-6 flex flex-col items-center">
                <BlueprintTable table={table.slice(0, fibLevel + 1)} highlight={highlight} />
              </div>
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="text-gray-700 text-lg">Floors built: <span className="font-bold">{steps}</span></div>
                <div className="text-gray-700 text-lg">Time spent: <span className="font-bold">{timer}s</span></div>
                {result !== null && (
                  <div className="mt-2 text-xl font-bold text-blue-700">Result: Fib({fibLevel}) = {result}</div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10 text-2xl font-bold text-blue-700 text-center">
            Key Learning: <span className="text-blue-700">Tabulation means building solutions from the ground up, filling out the whole table step by step!</span>
          </div>
          <button
            className="fixed bottom-6 right-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
            onClick={goToNextLevel}
          >
            Next Level →
          </button>

          {showCompletion && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Tower Complete! 🏗️</h2>
                <p className="text-gray-700 mb-6">
                  Amazing work! You've successfully built a Fibonacci tower of {fibLevel} floors.
                  <br />
                  <span className="text-blue-600 font-semibold">You built {steps} floors in {timer} seconds!</span>
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowCompletion(false)}
                    className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Build Another Tower
                  </button>
                  <button
                    onClick={goToNextLevel}
                    className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Next Level →
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const Coin = ({ value, highlight }) => (
  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold border-2 m-1 transition-all duration-300 ${highlight ? 'bg-yellow-300 border-yellow-600 shadow-lg animate-pulse' : 'bg-yellow-100 border-yellow-400'}`}>{value}</div>
);

const defaultShops = [
  { name: 'Classic Shop', coins: [1, 5, 10, 25] },
  { name: 'Weird Shop', coins: [1, 7, 13] },
  { name: 'Ancient Shop', coins: [2, 3, 9] },
];

const TreasureLevel = ({ goToNextLevel }) => {
  const [showGame, setShowGame] = useState(false);
  const [shopIdx, setShopIdx] = useState(0);
  const [amount, setAmount] = useState(23);
  const [minCoins, setMinCoins] = useState([]);
  const [usedCoins, setUsedCoins] = useState([]);
  const [isSolving, setIsSolving] = useState(false);
  const [stars, setStars] = useState(0);
  const [customerHappy, setCustomerHappy] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [timer, setTimer] = useState(0);
  const [completionHidden, setCompletionHidden] = useState(false);

  const coins = defaultShops[shopIdx].coins;

  // DP to solve coin change
  const solveChange = async () => {
    setIsSolving(true);
    setUsedCoins([]);
    setCustomerHappy(false);
    setShowCompletion(false);
    let t0 = Date.now();
    let dp = Array(amount + 1).fill(Infinity);
    let prev = Array(amount + 1).fill(-1);
    dp[0] = 0;
    for (let c of coins) {
      for (let i = c; i <= amount; i++) {
        if (dp[i - c] + 1 < dp[i]) {
          dp[i] = dp[i - c] + 1;
          prev[i] = c;
        }
      }
    }
    setMinCoins([...dp]);
    // Backtrack to get coins used
    let combo = [];
    let x = amount;
    while (x > 0 && prev[x] !== -1) {
      combo.push(prev[x]);
      x -= prev[x];
    }
    combo.reverse();
    // Animate coins
    for (let i = 0; i < combo.length; i++) {
      setUsedCoins(combo.slice(0, i + 1));
      await new Promise(res => setTimeout(res, 700));
    }
    setStars(combo.length <= 3 ? 3 : combo.length <= 5 ? 2 : 1);
    setCustomerHappy(true);
    setTimer(((Date.now() - t0) / 1000).toFixed(2));
    setIsSolving(false);
    // Show completion message immediately
    setTimeout(() => {
      setShowCompletion(true);
    }, 100);
  };

  return (
    <div className="min-h-screen pt-16 p-5 bg-gray-50 flex flex-col items-center justify-center">
      {!showGame ? (
        <div className="max-w-3xl bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mb-10">
          <h2 className="text-3xl font-bold text-yellow-700 mb-4">Level 4: Treasure Chest Collector 💎</h2>
          <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded text-yellow-900 text-lg w-full">
            <span className="font-bold">What is the Coin Change Problem?</span> The coin change problem asks: given coins of certain values, how can you make exact change for a target amount using the fewest coins? Dynamic programming builds a "cheat sheet" for all amounts, so you always know the best way to make change—even when greedy choices fail!
          </div>
          <p className="text-lg text-gray-700 mb-4 text-center">
            Make exact change for customers at magical shops! Use the fewest coins, race against time, and unlock new shops with strange coin types.
          </p>
          <button
            className="mt-2 px-8 py-3 bg-yellow-500 text-white rounded-lg font-semibold text-xl hover:bg-yellow-600 transition-colors"
            onClick={() => setShowGame(true)}
          >
            Start Treasure Game
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-yellow-700 mb-2">Level 4: Treasure Chest Collector 💎</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
            Shop: <span className="font-bold text-yellow-600">{defaultShops[shopIdx].name}</span> | Coins: {coins.map(c => <Coin key={c} value={c} />)}
          </p>
          <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8 items-center justify-center">
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[420px]">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xl font-bold text-gray-700">Customer Request</div>
              <div className="mt-16 mb-4 flex flex-col items-center">
                <div className="text-2xl font-bold text-yellow-700 mb-2">Make change for <span className="text-yellow-600">{amount}</span> coins</div>
                <div className="flex gap-2 mb-2">
                  <button className="px-3 py-1 bg-yellow-200 rounded border border-yellow-400 text-yellow-800 font-semibold" onClick={() => setAmount(a => Math.max(1, a - 1))} disabled={isSolving}>-</button>
                  <span className="text-xl font-bold">{amount}</span>
                  <button className="px-3 py-1 bg-yellow-200 rounded border border-yellow-400 text-yellow-800 font-semibold" onClick={() => setAmount(a => Math.min(99, a + 1))} disabled={isSolving}>+</button>
                </div>
                <button
                  className="mt-2 px-8 py-3 bg-yellow-500 text-white rounded-lg font-semibold text-xl hover:bg-yellow-600 transition-colors"
                  onClick={solveChange}
                  disabled={isSolving}
                >
                  Make Change
                </button>
              </div>
              <div className="mt-6 flex flex-col items-center">
                <div className="flex flex-wrap gap-2 justify-center mb-2">
                  {usedCoins.map((c, i) => <Coin key={i} value={c} highlight />)}
                </div>
                {customerHappy && (
                  <div className="mt-2 text-lg font-bold text-green-600 animate-bounce">Customer is happy! 😊</div>
                )}
                {usedCoins.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {[...Array(stars)].map((_, i) => <span key={i} className="text-yellow-500 text-2xl">★</span>)}
                  </div>
                )}
              </div>
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="text-gray-700 text-lg">Minimum coins needed: <span className="font-bold">{minCoins[amount] !== undefined && minCoins[amount] !== Infinity ? minCoins[amount] : '-'}</span></div>
                <div className="text-gray-700 text-lg">Time spent: <span className="font-bold">{timer}s</span></div>
              </div>
              <div className="mt-8 flex gap-4">
                <button className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded border border-yellow-400 font-semibold" onClick={() => setShopIdx((shopIdx + 1) % defaultShops.length)} disabled={isSolving}>Next Shop</button>
              </div>
            </div>
          </div>
          <div className="mt-10 text-2xl font-bold text-yellow-700 text-center">
            Key Learning: <span className="text-yellow-700">DP builds a cheat sheet for all amounts, so you always know the best way to make change—even when greedy fails!</span>
          </div>
          <button
            className="fixed bottom-6 right-6 px-6 py-3 bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-yellow-700 transition-colors z-50"
            onClick={goToNextLevel}
          >
            Next Level →
          </button>

          {showCompletion && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-yellow-600 mb-4">Change Complete! 💎</h2>
                <p className="text-gray-700 mb-6">
                  Amazing work! You've successfully made change for {amount} coins.
                  <br />
                  <span className="text-yellow-600 font-semibold">You used {usedCoins.length} coins in {timer} seconds!</span>
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowCompletion(false)}
                    className="px-6 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Make Another Change
                  </button>
                  <button
                    onClick={goToNextLevel}
                    className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Next Level →
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const MazeDPLevel = ({ goToNextLevel }) => {
  const [showGame, setShowGame] = useState(false);
  const [maze, setMaze] = useState(defaultMazeDP);
  const [dp, setDP] = useState([]);
  const [current, setCurrent] = useState([0, 0]);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showOptimal, setShowOptimal] = useState(false);
  const [optimalPath, setOptimalPath] = useState([]);
  const [powerTotal, setPowerTotal] = useState(0);
  const [stage, setStage] = useState('dp'); // 'dp' or 'optimal'
  const [showCompletion, setShowCompletion] = useState(false);

  const rows = maze.length;
  const cols = maze[0].length;

  const isObstacle = (r, c) => maze[r][c] === 'obstacle';
  const isPower = (r, c) => maze[r][c] === 'power';
  const isEnd = (r, c) => maze[r][c] === 'end';

  // DP Table filling logic
  const fillDP = () => {
    let table = Array.from({ length: rows }, () => Array(cols).fill(null));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (isObstacle(r, c)) continue;
        if (r === 0 && c === 0) table[r][c] = 1;
        else {
          let fromTop = r > 0 && !isObstacle(r - 1, c) ? table[r - 1][c] || 0 : 0;
          let fromLeft = c > 0 && !isObstacle(r, c - 1) ? table[r][c - 1] || 0 : 0;
          table[r][c] = fromTop + fromLeft;
        }
      }
    }
    return table;
  };

  // Step-by-step DP filling
  const stepDP = (stepNum) => {
    let table = Array.from({ length: rows }, () => Array(cols).fill(null));
    let count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (isObstacle(r, c)) continue;
        if (r === 0 && c === 0) table[r][c] = 1;
        else {
          let fromTop = r > 0 && !isObstacle(r - 1, c) ? table[r - 1][c] || 0 : 0;
          let fromLeft = c > 0 && !isObstacle(r, c - 1) ? table[r][c - 1] || 0 : 0;
          table[r][c] = fromTop + fromLeft;
        }
        count++;
        if (count > stepNum) return { table, pos: [r, c] };
      }
    }
    return { table, pos: [rows - 1, cols - 1] };
  };

  // Find optimal path (max power-ups)
  const computeOptimalPath = () => {
    let dp = Array.from({ length: rows }, () => Array(cols).fill(-Infinity));
    let prev = Array.from({ length: rows }, () => Array(cols).fill(null));
    if (!isObstacle(0, 0)) dp[0][0] = isPower(0, 0) ? 1 : 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (isObstacle(r, c)) continue;
        if (r > 0 && dp[r][c] < dp[r - 1][c] + (isPower(r, c) ? 1 : 0)) {
          dp[r][c] = dp[r - 1][c] + (isPower(r, c) ? 1 : 0);
          prev[r][c] = [r - 1, c];
        }
        if (c > 0 && dp[r][c] < dp[r][c - 1] + (isPower(r, c) ? 1 : 0)) {
          dp[r][c] = dp[r][c - 1] + (isPower(r, c) ? 1 : 0);
          prev[r][c] = [r, c - 1];
        }
      }
    }
    // Backtrack for optimal path
    let path = [];
    let r = rows - 1, c = cols - 1;
    while (r !== null && c !== null && prev[r][c] !== null) {
      path.push([r, c]);
      [r, c] = prev[r][c];
    }
    if (r === 0 && c === 0) path.push([0, 0]);
    return path.reverse();
  };

  // Animation logic
  useEffect(() => {
    if (playing && stage === 'dp') {
      if (step < rows * cols) {
        setTimeout(() => setStep(step + 1), 700);
      } else {
        setPlaying(false);
        setStage('optimal');
        setShowOptimal(true);
        setOptimalPath(computeOptimalPath());
      }
    }
    // eslint-disable-next-line
  }, [playing, step, stage]);

  useEffect(() => {
    if (stage === 'dp') {
      const { table, pos } = stepDP(step);
      setDP(table);
      setCurrent(pos);
    } else if (stage === 'optimal') {
      setShowOptimal(true);
      setOptimalPath(computeOptimalPath());
      setPowerTotal(computeOptimalPath().filter(([r, c]) => isPower(r, c)).length);
    }
    // eslint-disable-next-line
  }, [step, stage]);

  const handleStep = () => {
    if (stage === 'dp' && step < rows * cols) setStep(step + 1);
  };
  const handlePlay = () => {
    setPlaying(true);
  };
  const handleShowOptimal = () => {
    setStage('optimal');
    setShowOptimal(true);
    const path = computeOptimalPath();
    setOptimalPath(path);
    const powerUps = path.filter(([r, c]) => isPower(r, c)).length;
    setPowerTotal(powerUps);
  };
  const handleShowCompletion = () => {
    setShowCompletion(true);
  };
  const handleReset = () => {
    setStep(0);
    setStage('dp');
    setShowOptimal(false);
    setOptimalPath([]);
    setPowerTotal(0);
    setPlaying(false);
    setShowCompletion(false);
  };

  return (
    <div className="min-h-screen pt-16 p-5 bg-gray-50 flex flex-col items-center justify-center">
      {!showGame ? (
        <div className="max-w-3xl bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mb-10">
          <h2 className="text-3xl font-bold text-green-700 mb-4">Level 4: Robot Maze Runner 🤖</h2>
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-400 rounded text-green-900 text-lg w-full">
            <span className="font-bold">How does DP work in grid mazes?</span> DP fills a table cell by cell, counting all ways to reach each cell (right or down). This avoids checking every path and lets you find the best route for collecting power-ups!
          </div>
          <p className="text-lg text-gray-700 mb-4 text-center">
            Step through the DP process and see how the robot can find all possible routes and the optimal power-up path!
          </p>
          <button
            className="mt-2 px-8 py-3 bg-green-500 text-white rounded-lg font-semibold text-xl hover:bg-green-600 transition-colors"
            onClick={() => setShowGame(true)}
          >
            Start Maze Visualization
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-green-700 mb-2">Level 4: Robot Maze Runner 🤖</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
            Robot can only move <span className="font-bold text-green-600">right</span> or <span className="font-bold text-green-600">down</span>. Step through the DP table filling and see the optimal power-up path!
          </p>
          <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8 items-center justify-center">
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[420px]">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xl font-bold text-gray-700">Maze DP Table</div>
              <div className="mt-16 mb-4 grid grid-cols-5 gap-1">
                {maze.map((row, r) =>
                  row.map((cell, c) => (
                    <MazeCellDP
                      key={`${r}-${c}`}
                      value={dp[r]?.[c]}
                      isCurrent={current[0] === r && current[1] === c && stage === 'dp'}
                      isPath={dp[r]?.[c] > 0 && stage === 'dp'}
                      isPower={isPower(r, c)}
                      isObstacle={isObstacle(r, c)}
                      isOptimal={showOptimal && optimalPath.some(([rr, cc]) => rr === r && cc === c)}
                    />
                  ))
                )}
              </div>
              <h2 className="text-xl font-bold text-green-700 text-center">When you learn this , then click the button show completion</h2>
              <div className="flex gap-4 mt-4">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold text-lg hover:bg-green-600"
                  onClick={handleStep}
                  disabled={playing || stage !== 'dp'}
                >
                  Step
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold text-lg hover:bg-blue-600"
                  onClick={handlePlay}
                  disabled={playing || stage !== 'dp'}
                >
                  Play
                </button>
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold text-lg hover:bg-yellow-600"
                  onClick={handleShowOptimal}
                  disabled={stage !== 'dp'}
                >
                  Show Optimal Path
                </button>
                <button
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold text-lg hover:bg-purple-600"
                  onClick={handleShowCompletion}
                  disabled={!showOptimal}
                >
                  Show Completion
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold text-lg hover:bg-red-600"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
              {showOptimal && (
                <div className="mt-4 text-lg font-bold text-green-600">
                  Power-ups collected: {powerTotal}
                </div>
              )}
            </div>
          </div>
          <div className="mt-10 text-2xl font-bold text-green-700 text-center">
            Key Learning: <span className="text-green-700">DP helps find all possible paths and the optimal route for collecting power-ups!</span>
          </div>
          <button
            className="fixed bottom-6 right-6 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors z-50"
            onClick={goToNextLevel}
          >
            Next Level →
          </button>

          {showCompletion && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
              <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Maze Complete! 🤖</h2>
                <p className="text-gray-700 mb-6">
                  Amazing work! You've found the optimal path through the maze.
                  <br />
                  <span className="text-green-600 font-semibold">You collected {powerTotal} power-ups!</span>
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Try Another Path
                  </button>
                  <button
                    onClick={goToNextLevel}
                    className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Next Level →
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const SpellLetter = ({ char, highlight, effect }) => (
  <div className={`inline-block w-8 h-8 rounded bg-purple-200 border-2 border-purple-500 mx-1 text-center leading-8 font-bold transition-all duration-300 ${highlight ? 'bg-green-300 border-green-600 shadow-lg animate-pulse' : ''}`}>
    {char}
  </div>
);

const defaultSpells = [
  { from: 'fire', to: 'fair' },
  { from: 'stone', to: 'tones' },
  { from: 'magic', to: 'logic' },
  { from: 'dragon', to: 'danger' },
];

const opCost = { add: 1, remove: 1, change: 2 };

const WordSpellLevel = ({ goToNextLevel }) => {
  const [showGame, setShowGame] = useState(false);
  const [spellIdx, setSpellIdx] = useState(0);
  const [ops, setOps] = useState([]);
  const [mana, setMana] = useState(0);
  const [animIdx, setAnimIdx] = useState(-1);
  const [efficiency, setEfficiency] = useState(null);
  const [isCasting, setIsCasting] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const { from, to } = defaultSpells[spellIdx];

  // DP for edit distance and operation sequence
  function getEditOps(a, b) {
    let m = a.length, n = b.length;
    let dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    let op = Array.from({ length: m + 1 }, () => Array(n + 1).fill(''));
    for (let i = 0; i <= m; i++) dp[i][0] = i, op[i][0] = 'remove';
    for (let j = 0; j <= n; j++) dp[0][j] = j, op[0][j] = 'add';
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
          op[i][j] = 'none';
        } else {
          let add = dp[i][j - 1] + opCost.add;
          let remove = dp[i - 1][j] + opCost.remove;
          let change = dp[i - 1][j - 1] + opCost.change;
          let min = Math.min(add, remove, change);
          dp[i][j] = min;
          if (min === add) op[i][j] = 'add';
          else if (min === remove) op[i][j] = 'remove';
          else op[i][j] = 'change';
        }
      }
    }
    // Backtrack for ops
    let i = m, j = n, seq = [];
    while (i > 0 || j > 0) {
      if (op[i][j] === 'none') { i--; j--; }
      else if (op[i][j] === 'add') { seq.push({ type: 'add', j: j - 1 }); j--; }
      else if (op[i][j] === 'remove') { seq.push({ type: 'remove', i: i - 1 }); i--; }
      else if (op[i][j] === 'change') { seq.push({ type: 'change', i: i - 1, j: j - 1 }); i--; j--; }
    }
    seq.reverse();
    return { cost: dp[m][n], seq };
  }

  const handleCast = async () => {
    setIsCasting(true);
    setOps([]);
    setMana(0);
    setAnimIdx(-1);
    setEfficiency(null);
    setShowCompletion(false);
    const { cost, seq } = getEditOps(from, to);
    for (let i = 0; i < seq.length; i++) {
      setOps(seq.slice(0, i + 1));
      setMana(seq.slice(0, i + 1).reduce((sum, op) => sum + (op.type === 'add' ? opCost.add : op.type === 'remove' ? opCost.remove : op.type === 'change' ? opCost.change : 0), 0));
      setAnimIdx(i);
      await new Promise(res => setTimeout(res, 900));
    }
    setEfficiency(cost <= 2 ? 'Legendary' : cost <= 4 ? 'Great' : 'Good');
    setIsCasting(false);
    // Show completion message after a short delay
    setTimeout(() => {
      setShowCompletion(true);
    }, 500);
  };

  // Visualize current spell state
  function getSpellState() {
    let arr = from.split('');
    let i = 0, j = 0;
    for (let k = 0; k < ops.length; k++) {
      let op = ops[k];
      if (op.type === 'none') { i++; j++; }
      else if (op.type === 'add') { arr.splice(i, 0, to[op.j]); i++; j++; }
      else if (op.type === 'remove') { arr.splice(i, 1); }
      else if (op.type === 'change') { arr[i] = to[op.j]; i++; j++; }
    }
    return arr;
  }

  const handleNextDuel = () => {
    setSpellIdx((spellIdx + 1) % defaultSpells.length);
    setOps([]);
    setMana(0);
    setAnimIdx(-1);
    setEfficiency(null);
    setShowCompletion(false);
  };

  return (
    <div className="min-h-screen pt-16 p-5 bg-gray-50 flex items-center justify-center">
      {!showGame ? (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mb-10">
          <h2 className="text-3xl font-bold text-purple-700 mb-4">Level 5: Word Spell Battle ⚔️</h2>
          <div className="mb-4 p-4 bg-purple-50 border-l-4 border-purple-400 rounded text-purple-900 text-lg w-full">
            <span className="font-bold">What is Edit Distance?</span> Edit distance (Levenshtein distance) is the minimum number of operations (add, remove, change) needed to transform one word into another. Dynamic programming finds the most efficient sequence of operations, which is useful for spell correction, DNA analysis, and more!
          </div>
          <p className="text-lg text-gray-700 mb-4 text-center">
            Duel the wizard by transforming your spell into theirs using the least mana! Each operation costs mana, so be efficient!
          </p>
          <button
            className="mt-2 px-8 py-3 bg-purple-500 text-white rounded-lg font-semibold text-xl hover:bg-purple-600 transition-colors"
            onClick={() => setShowGame(true)}
          >
            Start Spell Battle
          </button>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-3xl font-bold text-purple-700 mb-2">Level 5: Word Spell Battle ⚔️</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
            Transform <span className="font-bold text-purple-600">{from}</span> into <span className="font-bold text-purple-600">{to}</span> using the least mana!
          </p>
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[420px]">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xl font-bold text-gray-700">Spell Transformation</div>
              <div className="mt-16 mb-4 flex flex-row items-center justify-center">
                {getSpellState().map((ch, idx) => (
                  <SpellLetter key={idx} char={ch} highlight={animIdx === idx} effect={''} />
                ))}
              </div>
              <div className="flex flex-col gap-2 mb-4">
                {ops.map((op, idx) => (
                  <div key={idx} className={`flex items-center gap-2 ${animIdx === idx ? 'font-bold text-purple-700' : 'text-gray-700'}`}>
                    {op.type === 'add' && <span>+ Add <span className="font-mono">{to[op.j]}</span></span>}
                    {op.type === 'remove' && <span>- Remove <span className="font-mono">{from[op.i]}</span></span>}
                    {op.type === 'change' && <span>~ Change <span className="font-mono">{from[op.i]}</span> to <span className="font-mono">{to[op.j]}</span></span>}
                    {op.type === 'none' && <span>✓ Keep <span className="font-mono">{from[op.i]}</span></span>}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-lg font-bold text-purple-700">Mana used: {mana}</div>
              {efficiency && (
                <div className="mt-2 text-xl font-bold text-green-600 animate-bounce">Spell Efficiency: {efficiency}</div>
              )}
              <div className="mt-8 flex gap-4">
                <button className="px-4 py-2 bg-purple-200 text-purple-800 rounded border border-purple-400 font-semibold" onClick={handleNextDuel} disabled={isCasting}>Next Duel</button>
                <button className="px-4 py-2 bg-purple-500 text-white rounded font-semibold" onClick={handleCast} disabled={isCasting}>Cast Spell</button>
              </div>
            </div>
          </div>
          <div className="mt-10 text-2xl font-bold text-purple-700 text-center">
            Key Learning: <span className="text-purple-700">DP finds the most efficient way to transform one word into another, step by step!</span>
          </div>
          <button
            className="fixed bottom-6 right-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
            onClick={goToNextLevel}
          >
            Next Level →
          </button>

          {showCompletion && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
              <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-purple-600 mb-4">Spell Complete! ⚡</h2>
                <p className="text-gray-700 mb-6">
                  Amazing work! You've successfully transformed the spell.
                  <br />
                  <span className="text-purple-600 font-semibold">Spell Efficiency: {efficiency}</span>
                  <br />
                  <span className="text-purple-600 font-semibold">Mana Used: {mana}</span>
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleNextDuel}
                    className="px-6 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Try Another Spell
                  </button>
                  <button
                    onClick={goToNextLevel}
                    className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Next Level →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Block = ({ type, highlight }) => (
  <div className={`inline-block ${type === 1 ? 'w-8' : 'w-16'} h-8 rounded bg-blue-200 border-2 border-blue-500 mx-1 transition-all duration-300 ${highlight ? 'bg-green-300 border-green-600 shadow-lg animate-pulse' : ''}`}></div>
);

function getStaircaseWays(n, blocks) {
  let dp = Array(n + 1).fill(0);
  dp[0] = 1;
  for (let i = 1; i <= n; i++) {
    for (let b of blocks) {
      if (i - b >= 0) dp[i] += dp[i - b];
    }
  }
  return dp;
}

function getAllStaircases(n, blocks) {
  let res = [];
  function dfs(h, path) {
    if (h === 0) { 
      res.push([...path]); 
      return; 
    }
    for (let b of blocks) {
      if (h - b >= 0) {
        path.push(b);
        dfs(h - b, path);
        path.pop();
      }
    }
  }
  dfs(n, []);
  return res;
}

const Item = ({ name, value, weight, selected, optimal }) => (
  <div className={`flex items-center gap-2 px-3 py-2 rounded border-2 mb-2 transition-all duration-300 ${selected ? 'bg-yellow-200 border-yellow-600' : 'bg-gray-100 border-gray-300'} ${optimal ? 'shadow-lg border-green-600 bg-green-200 animate-pulse' : ''}`}>
    <span className="font-bold">{name}</span>
    <span className="text-blue-700">({weight}kg, {value}pts)</span>
  </div>
);

const Island = ({ value, selected, optimal }) => (
  <div className={`w-16 h-16 flex flex-col items-center justify-center rounded-full border-2 mx-2 text-lg font-bold transition-all duration-300 ${selected ? 'bg-yellow-200 border-yellow-600' : 'bg-blue-100 border-blue-400'} ${optimal ? 'shadow-lg border-green-600 bg-green-200 animate-pulse' : ''}`}>
    🏝️
    <span className="text-blue-700">{value}</span>
  </div>
);

const defaultItems = [
  { name: 'Rope', value: 10, weight: 2 },
  { name: 'Map', value: 15, weight: 1 },
  { name: 'Lantern', value: 7, weight: 1 },
  { name: 'Food', value: 20, weight: 3 },
  { name: 'Water', value: 12, weight: 2 },
  { name: 'Tent', value: 25, weight: 4 },
];

const defaultIslands = [
  [3, 2, 5, 10, 7],
  [2, 7, 9, 3, 1, 5, 8],
  [6, 7, 1, 30, 8, 2, 10, 5],
  [10, 2, 8, 1, 7, 9, 3, 6, 4],
  [5, 10, 15, 20, 25, 30],
];

function knapsack(items, maxWeight) {
  let n = items.length;
  let dp = Array.from({ length: n + 1 }, () => Array(maxWeight + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= maxWeight; w++) {
      if (items[i - 1].weight > w) dp[i][w] = dp[i - 1][w];
      else dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - items[i - 1].weight] + items[i - 1].value);
    }
  }
  // Backtrack for optimal items
  let w = maxWeight, selected = [];
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(i - 1);
      w -= items[i - 1].weight;
    }
  }
  return { max: dp[n][maxWeight], selected: selected.reverse() };
}

function houseRobber(islands) {
  let n = islands.length;
  let dp = Array(n).fill(0);
  let prev = Array(n).fill(-1);
  dp[0] = islands[0];
  if (n > 1) dp[1] = Math.max(islands[0], islands[1]);
  for (let i = 2; i < n; i++) {
    if (dp[i - 1] > dp[i - 2] + islands[i]) {
      dp[i] = dp[i - 1];
      prev[i] = i - 1;
    } else {
      dp[i] = dp[i - 2] + islands[i];
      prev[i] = i - 2;
    }
  }
  // Backtrack for optimal islands
  let idx = n - 1, selected = [];
  while (idx >= 0) {
    if (prev[idx] === idx - 2 || idx === 0) {
      selected.push(idx);
      idx = prev[idx];
      if (idx === -1) break;
    } else {
      idx--;
    }
  }
  return { max: dp[n - 1], selected: selected.reverse() };
}

const BackpackLevel = ({ goToNextLevel }) => {
  const [showGame, setShowGame] = useState(false);
  // Backpack
  const [maxWeight, setMaxWeight] = useState(7);
  const [items, setItems] = useState(defaultItems);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(null);
  // Islands
  const [chainIdx, setChainIdx] = useState(0);
  const [islands, setIslands] = useState(defaultIslands[0]);
  const [robbed, setRobbed] = useState([]);
  const [greedy, setGreedy] = useState([]);
  const [pirateWisdom, setPirateWisdom] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionHidden, setCompletionHidden] = useState(false);

  useEffect(() => {
    const { selected } = knapsack(items, maxWeight);
    setSelected(selected);
    setScore(selected.length <= 2 ? 'Legendary Packer' : selected.length <= 4 ? 'Efficient Adventurer' : 'Resourceful Traveler');
  }, [maxWeight, items]);

  useEffect(() => {
    setIslands(defaultIslands[chainIdx % defaultIslands.length]);
  }, [chainIdx]);

  const handleRob = () => {
    const { selected } = houseRobber(islands);
    setRobbed(selected);
    // Greedy: always pick next available max
    let greedySel = [];
    let i = 0;
    while (i < islands.length) {
      if ((i === islands.length - 1) || islands[i] >= islands[i + 1]) {
        greedySel.push(i);
        i += 2;
      } else {
        i++;
      }
    }
    setGreedy(greedySel);
    setPirateWisdom(selected.length - greedySel.length + 3); // simple meter
    setShowCompletion(true);
    setCompletionHidden(false);
  };

  const handleTryAnotherChain = () => {
    setShowCompletion(false);
    setCompletionHidden(false);
    setRobbed([]);
    setGreedy([]);
  };

  return (
    <div className="flex flex-col min-h-screen pt-16 p-5 bg-gray-50 items-center justify-center">
        {!showGame ? (
        <div className="max-w-3xl bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mb-10">
            <h2 className="text-3xl font-bold text-yellow-700 mb-4">Level 7: Backpack Adventure 🎒 & Pirate Treasure 🏝️</h2>
            <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded text-yellow-900 text-lg w-full">
              <span className="font-bold">What are the Knapsack and House Robber Problems?</span> The knapsack problem asks: how do you pack a backpack for max value with limited space? The house robber (pirate) problem asks: how do you collect the most treasure from islands in a line, without visiting two in a row? Dynamic programming helps you make the best choices!
          </div>
          <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-400 rounded text-yellow-900 text-base w-full">
            <span className="font-bold">How to Play:</span><br/>
            <span className="font-bold">Backpack Adventure:</span> Adjust the backpack's weight limit using the + and - buttons. The game will automatically show the optimal set of items to pack for maximum value. Items highlighted in green are part of the best packing.<br/>
            <span className="font-bold">Pirate Treasure:</span> Click "Collect Treasure" to see which islands the pirate should visit to collect the most treasure without visiting two in a row. Islands that glow green are part of the optimal solution. Compare the "Greedy" total (picking the next biggest) to the optimal DP solution, and watch your Pirate Wisdom meter rise as you make better choices!<br/>
            Use "Next Island Chain" to try new treasure challenges.
          </div>
          <p className="text-lg text-gray-700 mb-4 text-center">
            Pack your backpack for adventure, then help a pirate collect treasure from islands! See how DP beats greedy strategies.
          </p>
          <button
            className="mt-2 px-8 py-3 bg-yellow-500 text-white rounded-lg font-semibold text-xl hover:bg-yellow-600 transition-colors"
            onClick={() => setShowGame(true)}
          >
            Start Adventure
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-yellow-700 mb-2">Level 7: Backpack Adventure 🎒 & Pirate Treasure 🏝️</h2>
          <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8 items-center justify-center mb-8">
            {/* Backpack Section */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[320px]">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xl font-bold text-gray-700">Backpack Packing</div>
              <div className="mt-12 mb-4 flex flex-col items-center">
                <div className="flex gap-2 mb-2">
                  <button className="px-3 py-1 bg-yellow-200 rounded border border-yellow-400 text-yellow-800 font-semibold" onClick={() => setMaxWeight(w => Math.max(1, w - 1))}>-</button>
                  <span className="text-xl font-bold">{maxWeight}kg</span>
                  <button className="px-3 py-1 bg-yellow-200 rounded border border-yellow-400 text-yellow-800 font-semibold" onClick={() => setMaxWeight(w => Math.min(15, w + 1))}>+</button>
                </div>
                <div className="flex flex-col items-center mt-2">
                  {items.map((item, idx) => (
                    <Item key={idx} {...item} selected={selected.includes(idx)} optimal={selected.includes(idx)} />
                  ))}
                </div>
                <div className="mt-4 text-lg font-bold text-yellow-700">Max Value: {selected.reduce((sum, idx) => sum + items[idx].value, 0)}</div>
                {score && (
                  <div className="mt-2 text-xl font-bold text-green-600 animate-bounce">Packing Score: {score}</div>
          )}
        </div>
            </div>
            {/* Pirate Section */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[320px]">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xl font-bold text-gray-700">Pirate Treasure</div>
              <div className="mt-12 mb-4 flex flex-row items-center justify-center">
                {islands.map((val, idx) => (
                  <Island key={idx} value={val} selected={robbed.includes(idx)} optimal={robbed.includes(idx)} />
                ))}
              </div>
              <div className="flex gap-2 mb-2">
                <button className="px-4 py-2 bg-yellow-500 text-white rounded font-semibold" onClick={() => { handleRob(); setShowCompletion(true); setCompletionHidden(false); }}>Collect Treasure</button>
                <button className="px-4 py-2 bg-yellow-200 text-yellow-800 rounded border border-yellow-400 font-semibold" onClick={() => setChainIdx(chainIdx + 1)}>Next Island Chain</button>
              </div>
              <div className="mt-4 text-lg font-bold text-yellow-700">Max Treasure: {robbed.reduce((sum, idx) => sum + islands[idx], 0)}</div>
              <div className="mt-2 text-lg font-bold text-blue-700">Greedy: {greedy.reduce((sum, idx) => sum + islands[idx], 0)}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-green-700 font-bold">Pirate Wisdom:</span>
                <div className="w-32 h-4 bg-gray-200 rounded">
                  <div className="h-4 bg-green-400 rounded" style={{ width: `${pirateWisdom * 20}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Completion Modal */}
          {showCompletion && !completionHidden && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4">
                <h3 className="text-2xl font-bold text-yellow-600 mb-4">Treasure Collected! 🏝️</h3>
                <p className="text-gray-700 mb-4">
                  Max Treasure: <span className="font-bold text-green-700">{robbed.reduce((sum, idx) => sum + islands[idx], 0)}</span><br/>
                  Greedy: <span className="font-bold text-blue-700">{greedy.reduce((sum, idx) => sum + islands[idx], 0)}</span><br/>
                  Pirate Wisdom: <span className="font-bold text-yellow-600">{pirateWisdom}</span>
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded font-semibold hover:bg-yellow-600"
                    onClick={handleTryAnotherChain}
                  >
                    Try Another Chain
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600"
                    onClick={goToNextLevel}
                  >
                    Next Level
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded font-semibold hover:bg-gray-600"
                    onClick={() => setCompletionHidden(true)}
                  >
                    Hide this message
                  </button>
                </div>
              </div>
            </div>
          )}
          {showCompletion && completionHidden && (
            <button
              className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded font-semibold hover:bg-yellow-600"
              onClick={() => setCompletionHidden(false)}
            >
              Show Completion Message
            </button>
          )}

          <div className="mt-10 text-2xl font-bold text-yellow-700 text-center">
            Key Learning: <span className="text-yellow-700">DP helps you pack the best backpack and collect the most treasure—even when greedy strategies miss out!</span>
          </div>
          <button
            className="fixed bottom-6 right-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
            onClick={goToNextLevel}
          >
            Next Level →
          </button>
        </>
      )}
    </div>
  );
};

const ForgetfulRobotLevel = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showLevel1, setShowLevel1] = useState(true);
  const [showLevel2, setShowLevel2] = useState(false);
  const [showLevel3, setShowLevel3] = useState(false);
  const [showLevel4, setShowLevel4] = useState(false);
  const [showLevel5, setShowLevel5] = useState(false);
  const [showLevel6, setShowLevel6] = useState(false);
  const [showLevel7, setShowLevel7] = useState(false);
  const [showLevel8, setShowLevel8] = useState(false);
  const [showLevel9, setShowLevel9] = useState(false);
  const [showLevel10, setShowLevel10] = useState(false);

  const goToNextLevel = () => {
    setCurrentLevel(prev => {
      const nextLevel = prev + 1;
      if (nextLevel > 10) return 1; // Loop back to level 1
      
      // Reset all level states
      setShowLevel1(false);
      setShowLevel2(false);
      setShowLevel3(false);
      setShowLevel4(false);
      setShowLevel5(false);
      setShowLevel6(false);
      setShowLevel7(false);
      setShowLevel8(false);
      setShowLevel9(false);
      setShowLevel10(false);
      
      // Set the next level
      switch (nextLevel) {
        case 1: setShowLevel1(true); break;
        case 2: setShowLevel2(true); break;
        case 3: setShowLevel3(true); break;
        case 4: setShowLevel4(true); break;
        case 5: setShowLevel5(true); break;
        case 6: setShowLevel6(true); break;
        case 7: setShowLevel7(true); break;
        case 8: setShowLevel8(true); break;
        case 9: setShowLevel9(true); break;
        case 10: setShowLevel10(true); break;
      }
      
      return nextLevel;
    });
  };

  if (showLevel1) return <DPIntroLevel goToNextLevel={goToNextLevel} />;
  if (showLevel2) return <WizardLevel goToNextLevel={goToNextLevel} />;
  if (showLevel3) return <BuilderLevel goToNextLevel={goToNextLevel} />;
  if (showLevel4) return <MazeDPLevel goToNextLevel={goToNextLevel} />;
  if (showLevel5) return <WordSpellLevel goToNextLevel={goToNextLevel} />;
  if (showLevel6) return <RabbitJumpRace goToNextLevel={goToNextLevel} />;
  if (showLevel7) return <BackpackLevel goToNextLevel={goToNextLevel} />;
  if (showLevel8) return <DPDemoLevel goToNextLevel={goToNextLevel} />;
  if (showLevel9) return <MemoryPalaceLevel goToNextLevel={goToNextLevel} />;
  if (showLevel10) return <ThreeDDPExplorer goToNextLevel={goToNextLevel} />;

  return (
    <div className="flex flex-col min-h-screen pt-16 bg-gradient-to-b from-blue-50 to-purple-50 items-center justify-center">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-4xl font-bold text-blue-800 mb-6">Dynamic Programming Game 🎮</h2>
        
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-3">Welcome to DP Adventure!</h3>
            <p className="text-blue-900">
              Learn Dynamic Programming through interactive games:
              <ul className="list-disc ml-6 mt-2 space-y-2">
                <li>Level 1: Introduction to DP</li>
                <li>Level 2: Memoization Magic</li>
                <li>Level 3: Tabulation Tower</li>
                <li>Level 4: Maze Path Finder</li>
                <li>Level 5: Word Spell Battle</li>
                <li>Level 6: Rabbit Jump Race</li>
                <li>Level 7: Backpack Adventure</li>
                <li>Level 8: DP Dimensions</li>
                <li>Level 9: Memory Palace</li>
                <li>Level 10: 3D DP Explorer</li>
              </ul>
            </p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-3">How to Play</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎮</span>
                <span>Complete each level to unlock the next</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <span>Learn DP concepts through gameplay</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span>Master each concept before moving on</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            className="px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold text-xl hover:bg-blue-600 transition-colors shadow-lg"
            onClick={goToNextLevel}
          >
            Start Level {currentLevel}
          </button>
          <p className="text-gray-600">
            Click to begin your DP adventure!
          </p>
        </div>
      </div>
    </div>
  );
};

const CoinLetter = ({ char, highlight, found }) => (
  <span className={`inline-block text-2xl font-mono mx-1 px-2 py-1 rounded transition-all duration-300 ${found ? 'bg-green-200 text-green-700' : highlight ? 'bg-yellow-200 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{char}</span>
);

const defaultCoinCases = [
  { a: 'a1b2c3d4e5', b: 'zabxycde', hidden: 'abcde' },
  { a: 'mysterytext', b: 'mysecret', hidden: 'myset' },
  { a: 'programming', b: 'gaming', hidden: 'gming' },
  { a: 'detective', b: 'active', hidden: 'ctive' },
];

function lcsDP(a, b) {
  let m = a.length, n = b.length;
  let dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
      else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  // Backtrack for LCS
  let i = m, j = n, seq = [];
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      seq.push({ i: i - 1, j: j - 1, char: a[i - 1] });
      i--; j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  seq.reverse();
  return { length: dp[m][n], seq };
}

const CoinShopLevel = ({ goToNextLevel }) => {
  const [showGame, setShowGame] = useState(false);
  const [caseIdx, setCaseIdx] = useState(0);
  const [matches, setMatches] = useState([]);
  const [revealIdx, setRevealIdx] = useState(-1);
  const [intuition, setIntuition] = useState(0);
  const [isSolving, setIsSolving] = useState(false);

  const { a, b, hidden } = defaultCoinCases[caseIdx];

  const handleSolve = async () => {
    setIsSolving(true);
    const { seq } = lcsDP(a, b);
    for (let i = 0; i < seq.length; i++) {
      setMatches(seq.slice(0, i + 1));
      setRevealIdx(i);
      setIntuition(Math.round(((i + 1) / seq.length) * 100));
      await new Promise(res => setTimeout(res, 800));
    }
    setIsSolving(false);
  };

  return (
    <div className="min-h-screen pt-16 p-5 bg-gray-50 items-center justify-center">
      {!showGame ? (
        <div className="max-w-3xl bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mb-10">
          <h2 className="text-3xl font-bold text-green-700 mb-4">Level 8: Coin Shop Challenge 🪙</h2>
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-400 rounded text-green-900 text-lg w-full">
            <span className="font-bold">What is the Longest Common Subsequence (LCS)?</span> LCS finds the longest sequence of characters that appears in the same order (not necessarily contiguously) in both strings. Dynamic programming helps you find hidden messages and common patterns in garbled texts!
          </div>
          <p className="text-lg text-gray-700 mb-4 text-center">
            Find the longest hidden message in two garbled texts! Watch as matching letters are revealed and your detective intuition grows.
          </p>
          <button
            className="mt-2 px-8 py-3 bg-green-500 text-white rounded-lg font-semibold text-xl hover:bg-green-600 transition-colors"
            onClick={() => setShowGame(true)}
          >
            Start Coin Shop Challenge
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-green-700 mb-2">Level 8: Coin Shop Challenge 🪙</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
            Find the longest readable message hidden in both garbled texts below!
          </p>
          <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8 items-center justify-center">
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[320px]">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xl font-bold text-gray-700">Garbled Message A</div>
              <div className="mt-12 mb-4 flex flex-row items-center justify-center">
                {a.split('').map((ch, idx) => (
                  <CoinLetter key={idx} char={ch} found={matches.some(m => m.i === idx)} highlight={matches.length > 0 && matches[matches.length - 1].i === idx} />
                ))}
              </div>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[320px]">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xl font-bold text-gray-700">Garbled Message B</div>
              <div className="mt-12 mb-4 flex flex-row items-center justify-center">
                {b.split('').map((ch, idx) => (
                  <CoinLetter key={idx} char={ch} found={matches.some(m => m.j === idx)} highlight={matches.length > 0 && matches[matches.length - 1].j === idx} />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="text-gray-700 text-lg">Hidden message: <span className="font-mono font-bold text-green-700">{matches.map(m => m.char).join('')}</span></div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-green-700 font-bold">Detective Intuition:</span>
              <div className="w-32 h-4 bg-gray-200 rounded">
                <div className="h-4 bg-green-400 rounded" style={{ width: `${intuition}%` }}></div>
              </div>
              <span className="text-green-700 font-bold">{intuition}%</span>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button className="px-4 py-2 bg-green-500 text-white rounded font-semibold" onClick={handleSolve} disabled={isSolving}>Reveal Message</button>
            <button className="px-4 py-2 bg-green-200 text-green-800 rounded border border-green-400 font-semibold" onClick={() => setCaseIdx((caseIdx + 1) % defaultCoinCases.length)} disabled={isSolving}>Next Case</button>
          </div>
          <div className="mt-10 text-2xl font-bold text-green-700 text-center">
            Key Learning: <span className="text-green-700">DP helps you find the longest hidden message and common patterns in garbled texts!</span>
          </div>
          <button
            className="fixed bottom-6 right-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
            onClick={goToNextLevel}
          >
            Next Level →
          </button>
        </>
      )}
    </div>
  );
};

const RobotMemo = ({ happy }) => (
  <div className="flex flex-col items-center">
    <span className="text-6xl">🤖</span>
    <span className={`text-lg font-bold ${happy ? 'text-red-500' : 'text-gray-500'}`}>Red Robot (Memo)</span>
  </div>
);
const RobotTab = ({ happy }) => (
  <div className="flex flex-col items-center">
    <span className="text-6xl">🤖</span>
    <span className={`text-lg font-bold ${happy ? 'text-blue-500' : 'text-gray-500'}`}>Blue Robot (Tab)</span>
  </div>
);

const Notebook = ({ memo, highlight }) => (
  <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 min-w-[180px] min-h-[120px] flex flex-col items-center">
    <div className="font-bold text-red-700 mb-2">Memory Notebook</div>
    <div className="flex flex-wrap gap-2 justify-center">
      {[...Array(Math.max(2, Math.max(...Object.keys(memo).map(Number), 0) + 1)).keys()].map(i => (
        <div
          key={i}
          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-lg font-bold transition-all duration-300 ${memo[i] !== undefined ? (highlight === i ? 'bg-red-300 border-red-600 shadow-lg animate-pulse' : 'bg-red-200 border-red-600') : 'bg-gray-200 border-gray-300 text-gray-400'}`}
        >
          {memo[i] !== undefined ? memo[i] : '?'}
        </div>
      ))}
    </div>
  </div>
);
const EvidenceBoard = ({ table, highlight }) => (
  <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 min-w-[180px] min-h-[120px] flex flex-col items-center">
    <div className="font-bold text-blue-700 mb-2">Evidence Board</div>
    <div className="flex flex-wrap gap-2 justify-center">
      {table.map((val, i) => (
        <div
          key={i}
          className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-lg font-bold transition-all duration-300 ${val !== null ? (highlight === i ? 'bg-blue-300 border-blue-600 shadow-lg animate-pulse' : 'bg-blue-200 border-blue-600') : 'bg-gray-200 border-gray-300 text-gray-400'}`}
        >
          {val !== null ? val : '?'}
        </div>
      ))}
    </div>
  </div>
);

const MemoryPalaceLevel = ({ goToNextLevel }) => {
  const [showGame, setShowGame] = useState(false);
  const [mode, setMode] = useState('memo'); // 'memo' or 'tab'
  const [n, setN] = useState(10);
  const [memoTable, setMemoTable] = useState({});
  const [tabTable, setTabTable] = useState([]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);
  const [raceComplete, setRaceComplete] = useState(false);
  const [memoSteps, setMemoSteps] = useState(0);
  const [tabSteps, setTabSteps] = useState(0);
  const [memoRunning, setMemoRunning] = useState(false);
  const [tabRunning, setTabRunning] = useState(false);
  const [memoResult, setMemoResult] = useState(null);
  const [tabResult, setTabResult] = useState(null);

  const sleep = ms => new Promise(res => setTimeout(res, ms));

  const runMemo = async () => {
    setMemoRunning(true);
    setMemoSteps(0);
    setMemoResult(null);
    setMemoTable({ 0: 0, 1: 1 });
    let steps = 0;
    let memoLocal = { 0: 0, 1: 1 };

    async function fib(n) {
      setHighlightedCells([n]);
      await sleep(900);
      steps++;
      if (memoLocal[n] !== undefined) {
        setHighlightedCells([n]);
        await sleep(700);
        return memoLocal[n];
      }
      let a = await fib(n - 1);
      let b = await fib(n - 2);
      let val = a + b;
      memoLocal[n] = val;
      setMemoTable(m => ({ ...m, [n]: val }));
      setHighlightedCells([n]);
      await sleep(900);
      setHighlightedCells([]);
      return val;
    }

    let result = await fib(n);
    setMemoResult(result);
    setMemoSteps(steps);
    setHighlightedCells([]);
    setMemoRunning(false);
    return result;
  };

  const runTab = async () => {
    setTabRunning(true);
    setTabSteps(0);
    setTabResult(null);
    let arr = [0, 1, ...Array(n - 1).fill(null)];
    setTabTable(arr);
    let steps = 0;

    for (let i = 2; i <= n; i++) {
      setHighlightedCells([i]);
      await sleep(900);
      arr[i] = arr[i - 1] + arr[i - 2];
      setTabTable([...arr]);
      steps++;
      await sleep(900);
      setHighlightedCells([]);
    }

    setTabResult(arr[n]);
    setTabSteps(steps);
    setTabRunning(false);
    return arr[n];
  };

  const handleRace = () => {
    setRaceComplete(false);
    setShowCompletion(false);
    setMemoSteps(0);
    setTabSteps(0);
    setMemoTable({});
    setTabTable([]);
    setHighlightedCells([]);
    setMemoResult(null);
    setTabResult(null);
    
    // Run both algorithms simultaneously
    Promise.all([
      runMemo(),
      runTab()
    ]).then(() => {
      setRaceComplete(true);
      setShowCompletion(true);
    });
  };

  const handleReset = () => {
    setMemoTable({});
    setTabTable([]);
    setHighlightedCells([]);
    setRaceComplete(false);
    setShowCompletion(false);
    setMemoSteps(0);
    setTabSteps(0);
    setMemoResult(null);
    setTabResult(null);
    setMemoRunning(false);
    setTabRunning(false);
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 p-5 bg-gray-50 items-center justify-center">
      {!showGame ? (
        <div className="max-w-3xl bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mb-10">
          <h2 className="text-3xl font-bold text-pink-700 mb-4">Level 9: Memory Palace Detective 🧠</h2>
          <div className="mb-4 p-4 bg-pink-50 border-l-4 border-pink-400 rounded text-pink-900 text-lg w-full">
            <span className="font-bold">Top-down vs Bottom-up DP:</span> Memoization (top-down) solves problems by breaking them into subproblems as needed, storing answers in a notebook. Tabulation (bottom-up) builds up solutions step by step, filling an evidence board from the start. Both solve the same mystery, but think differently!
          </div>
          <div className="mb-4 p-4 bg-pink-100 border-l-4 border-pink-400 rounded text-pink-900 text-base w-full">
            <span className="font-bold">What's the difference?</span><br/>
            <span className="font-bold text-red-500">Memoization (Top-down):</span> Imagine you want to climb a staircase to the 6th step. You start at the top and ask, "What do I need to get here?" You break the problem into smaller steps as you go, and remember each answer in your notebook so you never repeat work.<br/>
            <span className="font-bold text-blue-500">Tabulation (Bottom-up):</span> Now imagine you build the staircase from the ground up, step by step. You fill out your evidence board as you go, so by the time you reach the top, you already know all the answers!<br/>
            <span className="font-bold">Easy Example:</span> To get to step 4:<br/>
            <span className="text-red-500">Memo:</span> "To get to 4, I need 3 and 2. To get to 3, I need 2 and 1..."<br/>
            <span className="text-blue-500">Tab:</span> "First, 0 and 1. Then 2 = 1+0, 3 = 2+1, 4 = 3+2..."<br/>
            <span className="font-bold">Both methods get the answer, but their thinking is different!</span>
          </div>
          <p className="text-lg text-gray-700 mb-4 text-center">
            Race two detective robots to solve the same mystery! See how memoization and tabulation work side by side.
          </p>
          <button
            className="mt-2 px-8 py-3 bg-pink-500 text-white rounded-lg font-semibold text-xl hover:bg-pink-600 transition-colors"
            onClick={() => setShowGame(true)}
          >
            Start Memory Palace Race
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-pink-700 mb-2">Level 9: Memory Palace Detective 🧠</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
            Red Robot (Memo) starts from the end and asks "what do I need?"<br/>
            Blue Robot (Tab) builds up from the start, step by step.<br/>
            Race them to solve the same mystery!
          </p>
          <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8 items-center justify-center">
            {/* Red Robot (Memoization) */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[420px]">
              <RobotMemo happy={!memoRunning && memoResult !== null} />
              <Notebook memo={memoTable} highlight={highlightedCells} />
              <div className="mt-4 text-lg font-bold text-red-700">Steps: {memoSteps}</div>
              {memoResult !== null && (
                <div className="mt-2 text-xl font-bold text-green-600 animate-bounce">Result: {memoResult}</div>
              )}
              <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded font-semibold" onClick={handleRace} disabled={memoRunning}>Cast Memo Spell</button>
            </div>
            {/* Blue Robot (Tabulation) */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[420px]">
              <RobotTab happy={!tabRunning && tabResult !== null} />
              <EvidenceBoard table={tabTable} highlight={highlightedCells} />
              <div className="mt-4 text-lg font-bold text-blue-700">Steps: {tabSteps}</div>
              {tabResult !== null && (
                <div className="mt-2 text-xl font-bold text-green-600 animate-bounce">Result: {tabResult}</div>
              )}
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded font-semibold" onClick={handleRace} disabled={tabRunning}>Cast Tabular Spell</button>
            </div>
          </div>
          <div className="mt-8 flex gap-4 items-center justify-center">
            <span className="font-semibold text-gray-700">Mystery Size:</span>
            <button className="px-3 py-1 bg-pink-200 rounded border border-pink-400 text-pink-800 font-semibold" onClick={() => setN(n => Math.max(2, n - 1))} disabled={memoRunning || tabRunning}>-</button>
            <span className="text-xl font-bold">{n}</span>
            <button className="px-3 py-1 bg-pink-200 rounded border border-pink-400 text-pink-800 font-semibold" onClick={() => setN(n => Math.min(15, n + 1))} disabled={memoRunning || tabRunning}>+</button>
            <button className="px-4 py-2 bg-pink-500 text-white rounded font-semibold" onClick={handleRace} disabled={memoRunning || tabRunning}>Race!</button>
            <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded font-semibold" onClick={handleReset}>Reset</button>
          </div>
          <div className="mt-10 text-2xl font-bold text-pink-700 text-center">
            Key Learning: <span className="text-pink-700">Experience top-down vs bottom-up DP and see which detective robot you like best!</span>
          </div>
          <button
            className="fixed bottom-6 right-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
            onClick={goToNextLevel}
          >
            Next Level →
          </button>

          {/* Completion Message Modal */}
          {showCompletion && raceComplete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
              <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-purple-600 mb-4">Race Complete! 🏃‍♂️</h2>
                <p className="text-gray-700 mb-6">
                  Amazing detective work! You've witnessed the race between Memoization and Tabulation.
                  <br />
                  <span className="text-purple-600 font-semibold">Memoization Steps: {memoSteps}</span>
                  <br />
                  <span className="text-blue-600 font-semibold">Tabulation Steps: {tabSteps}</span>
                  <br />
                  <span className="text-green-600 font-semibold mt-2 block">
                    {memoSteps < tabSteps ? 'Memoization wins! 🏆' : 
                     memoSteps > tabSteps ? 'Tabulation wins! 🏆' : 
                     'It\'s a tie! 🤝'}
                  </span>
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setShowCompletion(false);
                      handleReset();
                    }}
                    className="px-6 py-3 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Race Again
                  </button>
                  <button
                    onClick={goToNextLevel}
                    className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Next Level →
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const MirrorLetter = ({ char, highlight, found }) => (
  <span className={`inline-block text-2xl font-mono mx-1 px-2 py-1 rounded transition-all duration-300 ${found ? 'bg-purple-200 text-purple-700' : highlight ? 'bg-pink-200 text-pink-700' : 'bg-gray-100 text-gray-700'}`}>{char}</span>
);

const defaultMirrorCases = [
  { s: 'agbdba', hidden: 'abdba' },
  { s: 'racecar', hidden: 'racecar' },
  { s: 'character', hidden: 'carac' },
  { s: 'magical', hidden: 'aga' },
];

function lpsDP(s) {
  let n = s.length;
  let dp = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = 1;
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      let j = i + len - 1;
      if (s[i] === s[j]) dp[i][j] = 2 + (len === 2 ? 0 : dp[i + 1][j - 1]);
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
    }
  }
  // Backtrack for LPS
  let i = 0, j = n - 1, seq = [];
  while (i <= j) {
    if (s[i] === s[j]) {
      if (i === j) seq.push({ i, char: s[i] });
      else seq.unshift({ i, char: s[i] });
      if (i !== j) seq.push({ j, char: s[j] });
      i++; j--;
    } else if (dp[i + 1][j] > dp[i][j - 1]) {
      i++;
    } else {
      j--;
    }
  }
  return { length: dp[0][n - 1], seq };
}

const MirrorWordLevel = ({ goToNextLevel }) => {
  const [showGame, setShowGame] = useState(false);
  const [caseIdx, setCaseIdx] = useState(0);
  const [matches, setMatches] = useState([]);
  const [revealIdx, setRevealIdx] = useState(-1);
  const [magic, setMagic] = useState(0);
  const [isSolving, setIsSolving] = useState(false);

  const { s, hidden } = defaultMirrorCases[caseIdx];

  const handleSolve = async () => {
    setIsSolving(true);
    const { seq } = lpsDP(s);
    for (let i = 0; i < seq.length; i++) {
      setMatches(seq.slice(0, i + 1));
      setRevealIdx(i);
      setMagic(Math.round(((i + 1) / seq.length) * 100));
      await new Promise(res => setTimeout(res, 800));
    }
    setIsSolving(false);
  };

  // Mirror effect for palindrome
  function getMirrorDisplay() {
    let arr = Array(s.length).fill(null);
    matches.forEach(m => { arr[m.i] = m.char; });
    return arr;
  }

  return (
    <div className="min-h-screen pt-16 p-5 bg-gray-50 items-center justify-center">
      {!showGame ? (
        <div className="max-w-3xl bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mb-10">
          <h2 className="text-3xl font-bold text-purple-700 mb-4">Level 11: Mirror Word Magic 🪞</h2>
          <div className="mb-4 p-4 bg-purple-50 border-l-4 border-purple-400 rounded text-purple-900 text-lg w-full">
            <span className="font-bold">What is the Longest Palindromic Subsequence (LPS)?</span> LPS finds the longest sequence in a string that reads the same forwards and backwards. Dynamic programming helps you find the most magical palindrome hidden in a jumble of letters!
          </div>
          <p className="text-lg text-gray-700 mb-4 text-center">
            Arrange magical letters to create the longest palindrome! Watch as the mirror reveals the symmetrical pattern and your magic power grows.
          </p>
          <button
            className="mt-2 px-8 py-3 bg-purple-500 text-white rounded-lg font-semibold text-xl hover:bg-purple-600 transition-colors"
            onClick={() => setShowGame(true)}
          >
            Start Mirror Word Magic
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-purple-700 mb-2">Level 11: Mirror Word Magic 🪞</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
            Create the longest magical palindrome from the scrambled letters below!
          </p>
          <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8 items-center justify-center">
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[320px]">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xl font-bold text-gray-700">Magical Letters</div>
              <div className="mt-12 mb-4 flex flex-row items-center justify-center">
                {s.split('').map((ch, idx) => (
                  <MirrorLetter key={idx} char={ch} found={matches.some(m => m.i === idx)} highlight={matches.length > 0 && matches[matches.length - 1].i === idx} />
                ))}
              </div>
              <div className="mt-4 flex flex-row items-center justify-center mirror-effect">
                {getMirrorDisplay().map((ch, idx) => (
                  <span key={idx} className={`inline-block text-2xl font-mono mx-1 px-2 py-1 rounded ${ch ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>{ch ? ch : '_'}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="text-gray-700 text-lg">Longest palindrome: <span className="font-mono font-bold text-purple-700">{matches.map(m => m.char).join('')}</span></div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-purple-700 font-bold">Magic Power:</span>
              <div className="w-32 h-4 bg-gray-200 rounded">
                <div className="h-4 bg-purple-400 rounded" style={{ width: `${magic}%` }}></div>
              </div>
              <span className="text-purple-700 font-bold">{magic}%</span>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button className="px-4 py-2 bg-purple-500 text-white rounded font-semibold" onClick={handleSolve} disabled={isSolving}>Reveal Palindrome</button>
            <button className="px-4 py-2 bg-purple-200 text-purple-800 rounded border border-purple-400 font-semibold" onClick={() => setCaseIdx((caseIdx + 1) % defaultMirrorCases.length)} disabled={isSolving}>Next Spell</button>
          </div>
          <div className="mt-10 text-2xl font-bold text-purple-700 text-center">
            Key Learning: <span className="text-purple-700">DP helps you find the most magical palindrome hidden in a jumble of letters!</span>
          </div>
          <button
            className="fixed bottom-6 right-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
            onClick={goToNextLevel}
          >
            Next Level →
          </button>
        </>
      )}
    </div>
  );
};

const ResourceBar = ({ label, value, max, color }) => (
  <div className="mb-2 w-full">
    <div className="flex justify-between text-sm font-bold mb-1">
      <span>{label}</span>
      <span>{value} / {max}</span>
    </div>
    <div className="w-full h-4 bg-gray-200 rounded">
      <div className={`h-4 rounded ${color}`} style={{ width: `${(value / max) * 100}%` }}></div>
    </div>
  </div>
);

const defaultStages = [
  { resources: { gold: 10, energy: 8, food: 6 }, options: [
    { name: 'Invest in Farm', cost: { gold: 3, energy: 2 }, gain: { food: 4 }, desc: 'More food for future turns.' },
    { name: 'Mine Gold', cost: { energy: 2, food: 1 }, gain: { gold: 4 }, desc: 'More gold for future turns.' },
    { name: 'Rest', cost: { food: 1 }, gain: { energy: 3 }, desc: 'Recover energy.' },
  ]},
  { resources: {}, options: [
    { name: 'Trade Food for Gold', cost: { food: 3 }, gain: { gold: 5 }, desc: 'Trade surplus food.' },
    { name: 'Upgrade Tools', cost: { gold: 5, energy: 2 }, gain: { energy: 4 }, desc: 'Boost future energy.' },
    { name: 'Feast', cost: { food: 2 }, gain: { energy: 2 }, desc: 'Small energy boost.' },
  ]},
  { resources: {}, options: [
    { name: 'Final Investment', cost: { gold: 5, food: 2 }, gain: { gold: 10, food: 4 }, desc: 'Big payoff if you saved enough.' },
    { name: 'Rest Again', cost: { food: 1 }, gain: { energy: 2 }, desc: 'Recover energy.' },
    { name: 'Sell Tools', cost: { energy: 2 }, gain: { gold: 3 }, desc: 'Convert energy to gold.' },
  ]},
];

const UltimateOptimizationLevel = ({ goToNextLevel }) => {
  const [showGame, setShowGame] = useState(false);
  const [stage, setStage] = useState(0);
  const [resources, setResources] = useState({ ...defaultStages[0].resources });
  const [history, setHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [score, setScore] = useState(0);

  const maxVals = { gold: 30, energy: 20, food: 15 };
  const colors = { gold: 'bg-yellow-400', energy: 'bg-blue-400', food: 'bg-green-400' };

  const handleOption = (opt) => {
    // Check if enough resources
    for (let key in opt.cost) {
      if ((resources[key] || 0) < opt.cost[key]) return;
    }
    // Apply cost and gain
    let newRes = { ...resources };
    for (let key in opt.cost) newRes[key] = (newRes[key] || 0) - opt.cost[key];
    for (let key in opt.gain) newRes[key] = (newRes[key] || 0) + opt.gain[key];
    setResources(newRes);
    setHistory([...history, { stage, opt }]);
    // Next stage or finish
    if (stage < defaultStages.length - 1) {
      setStage(stage + 1);
      if (defaultStages[stage + 1].resources) {
        setResources(r => ({ ...r, ...defaultStages[stage + 1].resources }));
      }
    } else {
      // Calculate score
      let total = (newRes.gold || 0) + (newRes.energy || 0) + (newRes.food || 0);
      setScore(total);
      let ach = [];
      if ((newRes.gold || 0) >= 20) ach.push('Gold Hoarder');
      if ((newRes.food || 0) >= 10) ach.push('Feast Master');
      if ((newRes.energy || 0) >= 10) ach.push('Energy Guru');
      if (total >= 30) ach.push('Master Strategist');
      setAchievements(ach);
    }
  };

  const handleRestart = () => {
    setStage(0);
    setResources({ ...defaultStages[0].resources });
    setHistory([]);
    setAchievements([]);
    setScore(0);
  };

  return (
    <div className="min-h-screen pt-16 p-5 bg-gray-50 items-center justify-center">
      {!showGame ? (
        <div className="max-w-3xl bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mb-10">
          <h2 className="text-3xl font-bold text-yellow-800 mb-4">Level 10: Ultimate Optimization Challenge 🏆</h2>
          <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded text-yellow-900 text-lg w-full">
            <span className="font-bold">What is Multi-stage Optimization?</span> In advanced DP, you manage several resources and make decisions at each stage that affect your future. You must balance short-term gains with long-term benefits, just like a master strategist!
          </div>
          <p className="text-lg text-gray-700 mb-4 text-center">
            Manage gold, energy, and food across several stages. Each choice changes your future options. Can you master all the mechanics and earn the Master Strategist achievement?
          </p>
          <button
            className="mt-2 px-8 py-3 bg-yellow-500 text-white rounded-lg font-semibold text-xl hover:bg-yellow-600 transition-colors"
            onClick={() => setShowGame(true)}
          >
            Start Optimization Challenge
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-yellow-800 mb-2">Level 10: Ultimate Optimization Challenge 🏆</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
            Manage your resources and make the best decisions at each stage. Balance short-term gains with long-term benefits!
          </p>
          <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8 items-center justify-center">
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[420px]">
              <div className="w-full mb-4">
                <ResourceBar label="Gold" value={resources.gold || 0} max={maxVals.gold} color={colors.gold} />
                <ResourceBar label="Energy" value={resources.energy || 0} max={maxVals.energy} color={colors.energy} />
                <ResourceBar label="Food" value={resources.food || 0} max={maxVals.food} color={colors.food} />
              </div>
              {stage < defaultStages.length ? (
                <>
                  <div className="mb-4 text-lg font-bold text-yellow-800">Stage {stage + 1}</div>
                  <div className="flex flex-col gap-4 w-full">
                    {defaultStages[stage].options.map((opt, idx) => (
                      <button
                        key={idx}
                        className="w-full px-4 py-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg font-semibold text-lg text-yellow-900 hover:bg-yellow-200 transition-colors flex flex-col items-start"
                        onClick={() => handleOption(opt)}
                        disabled={Object.keys(opt.cost).some(k => (resources[k] || 0) < opt.cost[k])}
                      >
                        <span className="font-bold">{opt.name}</span>
                        <span className="text-sm">Cost: {Object.entries(opt.cost).map(([k, v]) => `${v} ${k}`).join(', ')} | Gain: {Object.entries(opt.gain).map(([k, v]) => `${v} ${k}`).join(', ')}</span>
                        <span className="text-xs text-gray-600">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4 text-xl font-bold text-green-700">Final Resources</div>
                  <div className="w-full mb-4">
                    <ResourceBar label="Gold" value={resources.gold || 0} max={maxVals.gold} color={colors.gold} />
                    <ResourceBar label="Energy" value={resources.energy || 0} max={maxVals.energy} color={colors.energy} />
                    <ResourceBar label="Food" value={resources.food || 0} max={maxVals.food} color={colors.food} />
                  </div>
                  <div className="mb-4 text-lg font-bold text-yellow-800">Score: {score}</div>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {achievements.map((a, i) => (
                      <span key={i} className="px-3 py-1 bg-green-200 text-green-800 rounded-full font-semibold border border-green-400">{a}</span>
                    ))}
                  </div>
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded font-semibold" onClick={handleRestart}>Restart</button>
                </>
              )}
            </div>
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[420px]">
              <div className="mb-4 text-lg font-bold text-yellow-800">Decision Tree</div>
              <div className="w-full h-64 bg-gray-100 rounded flex flex-col items-center justify-center text-gray-400">
                <span className="text-6xl">🌳</span>
                <span className="text-lg">(Decision tree visualization coming soon!)</span>
              </div>
              <div className="mt-8 text-lg font-bold text-yellow-800">History</div>
              <ul className="w-full text-sm mt-2">
                {history.map((h, i) => (
                  <li key={i} className="mb-1">Stage {h.stage + 1}: <span className="font-bold">{h.opt.name}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 text-2xl font-bold text-yellow-800 text-center">
            Key Learning: <span className="text-yellow-800">DP helps you optimize across multiple resources and stages—true mastery!</span>
          </div>
          <button
            className="fixed bottom-6 right-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
            onClick={goToNextLevel}
          >
            Next Level →
          </button>
        </>
      )}
    </div>
  );
};

const TwoWizardsLevel = ({ goToNextLevel }) => {
  const [showGame, setShowGame] = useState(false);
  const [fibLevel, setFibLevel] = useState(6);
  const [mode, setMode] = useState('memo'); // 'memo' or 'tab'
  const [memo, setMemo] = useState({ 0: 0, 1: 1 });
  const [memoHighlight, setMemoHighlight] = useState(null);
  const [memoSteps, setMemoSteps] = useState(0);
  const [memoResult, setMemoResult] = useState(null);
  const [memoRunning, setMemoRunning] = useState(false);
  const [tab, setTab] = useState([0, 1]);
  const [tabHighlight, setTabHighlight] = useState(null);
  const [tabSteps, setTabSteps] = useState(0);
  const [tabResult, setTabResult] = useState(null);
  const [tabRunning, setTabRunning] = useState(false);
  const [preference, setPreference] = useState({ memo: 0, tab: 0 });

  const sleep = ms => new Promise(res => setTimeout(res, ms));

  // Memoization logic (top-down)
  const runMemo = async () => {
    setMemo({ 0: 0, 1: 1 });
    setMemoSteps(0);
    setMemoResult(null);
    setMemoRunning(true);
    setMemoHighlight(null);
    let steps = 0;
    let memoLocal = { 0: 0, 1: 1 };
    async function fib(n) {
      setMemoHighlight(n);
      await sleep(900);
      steps++;
      if (memoLocal[n] !== undefined) {
        setMemoHighlight(n);
        await sleep(700);
        return memoLocal[n];
      }
      let a = await fib(n - 1);
      let b = await fib(n - 2);
      let val = a + b;
      memoLocal[n] = val;
      setMemo(m => ({ ...m, [n]: val }));
      setMemoHighlight(n);
      await sleep(900);
      setMemoHighlight(null);
      return val;
    }
    let result = await fib(fibLevel);
    setMemoResult(result);
    setMemoSteps(steps);
    setMemoHighlight(null);
    setMemoRunning(false);
    setPreference(p => ({ ...p, memo: p.memo + 1 }));
  };
  // Tabulation logic (bottom-up)
  const runTab = async () => {
    setTab([0, 1, ...Array(fibLevel - 1).fill(null)]);
    setTabSteps(0);
    setTabResult(null);
    setTabRunning(true);
    setTabHighlight(null);
    let arr = [0, 1, ...Array(fibLevel - 1).fill(null)];
    let steps = 0;
    for (let i = 2; i <= fibLevel; i++) {
      arr[i] = arr[i - 1] + arr[i - 2];
      setTab([...arr]);
      setTabHighlight(i);
      steps++;
      await sleep(900);
      setTabHighlight(null);
    }
    setTabResult(arr[fibLevel]);
    setTabSteps(steps);
    setTabHighlight(null);
    setTabRunning(false);
    setPreference(p => ({ ...p, tab: p.tab + 1 }));
  };
  // Reset
  const handleReset = () => {
    setMemo({ 0: 0, 1: 1 });
    setMemoSteps(0);
    setMemoResult(null);
    setMemoRunning(false);
    setMemoHighlight(null);
    setTab([0, 1]);
    setTabSteps(0);
    setTabResult(null);
    setTabRunning(false);
    setTabHighlight(null);
  };

  return (
    <div className="min-h-screen pt-16 p-5 bg-gray-50 items-center justify-center">
      {!showGame ? (
        <div className="max-w-3xl bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mb-10">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">Level 8: The Two Wizards Challenge ⚡</h2>
          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded text-blue-900 text-lg w-full">
            <span className="font-bold">Memoization vs Tabulation:</span> Memoization (top-down) solves big problems first by breaking them into smaller ones as needed. Tabulation (bottom-up) solves all small problems first, then combines them to solve the big one. Both can solve the same challenge, but their thinking is different!
          </div>
          <div className="mb-4 p-4 bg-blue-100 border-l-4 border-blue-400 rounded text-blue-900 text-base w-full">
            <span className="font-bold">Easy Example:</span><br/>
            <span className="font-bold text-red-500">Memo Wizard:</span> "To climb 6 steps, I need to know ways to climb 5 and 4..."<br/>
            <span className="font-bold text-blue-500">Tabular Wizard:</span> "First, I learn ways to climb 0 and 1, then 2, 3, 4, 5, and finally 6!"<br/>
            <span className="font-bold">Try both wizards and see which thinking style you like best!</span>
          </div>
          <p className="text-lg text-gray-700 mb-4 text-center">
            Switch between Memo and Tabular wizards to solve the same Fibonacci tower challenge. Which approach feels faster or more fun to you?
          </p>
          <button
            className="mt-2 px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold text-xl hover:bg-blue-600 transition-colors"
            onClick={() => setShowGame(true)}
          >
            Start Two Wizards Challenge
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Level 8: The Two Wizards Challenge ⚡</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
            Both wizards are solving the same Fibonacci tower challenge. Switch between them and see how their spell books fill up!
          </p>
          <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8 items-center justify-center">
            {/* Memo Wizard */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[420px]">
              <WizardMemoFace happy={!memoRunning && memoResult !== null} />
              <SpellBookDP spells={memo} highlight={memoHighlight} direction="backward" />
              <div className="mt-4 text-lg font-bold text-red-700">Steps: {memoSteps}</div>
              {memoResult !== null && (
                <div className="mt-2 text-xl font-bold text-green-600 animate-bounce">Result: {memoResult}</div>
              )}
              <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded font-semibold" onClick={runMemo} disabled={memoRunning}>Cast Memo Spell</button>
            </div>
            {/* Tabular Wizard */}
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[420px]">
              <WizardTabFace happy={!tabRunning && tabResult !== null} />
              <SpellBookDP spells={tab} highlight={tabHighlight} direction="forward" />
              <div className="mt-4 text-lg font-bold text-blue-700">Steps: {tabSteps}</div>
              {tabResult !== null && (
                <div className="mt-2 text-xl font-bold text-green-600 animate-bounce">Result: {tabResult}</div>
              )}
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded font-semibold" onClick={runTab} disabled={tabRunning}>Cast Tabular Spell</button>
            </div>
          </div>
          <div className="mt-8 flex gap-4 items-center justify-center">
            <span className="font-semibold text-gray-700">Tower Height:</span>
            <button className="px-3 py-1 bg-blue-200 rounded border border-blue-400 text-blue-800 font-semibold" onClick={() => setFibLevel(f => Math.max(2, f - 1))} disabled={memoRunning || tabRunning}>-</button>
            <span className="text-xl font-bold">{fibLevel}</span>
            <button className="px-3 py-1 bg-blue-200 rounded border border-blue-400 text-blue-800 font-semibold" onClick={() => setFibLevel(f => Math.min(15, f + 1))} disabled={memoRunning || tabRunning}>+</button>
            <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded font-semibold" onClick={handleReset}>Reset</button>
          </div>
          <div className="mt-10 text-2xl font-bold text-blue-700 text-center">
            Thinking Style Preference: <span className="text-red-500">Memo Wizard {preference.memo}</span> vs <span className="text-blue-500">Tabular Wizard {preference.tab}</span>
          </div>
          <button
            className="fixed bottom-6 right-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
            onClick={goToNextLevel}
          >
            Next Level →
          </button>
        </>
      )}
    </div>
  );
};

const DPArrow = ({ from, to, type }) => {
  // type: 'right', 'down', 'diag'
  // from/to: [row, col] (0-indexed)
  // Only for 2D grid
  const [fx, fy] = from, [tx, ty] = to;
  const x1 = ty * 48 + 24, y1 = fx * 48 + 24;
  const x2 = ty * 48 + 24, y2 = fx * 48 + 24;
  let dx = 0, dy = 0;
  if (type === 'right') dx = 48;
  if (type === 'down') dy = 48;
  if (type === 'diag') { dx = 48; dy = 48; }
  return (
    <svg className="absolute pointer-events-none" style={{ left: 0, top: 0 }} width={300} height={300}>
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
          <polygon points="0 0, 8 4, 0 8" fill={type === 'diag' ? '#a21caf' : '#2563eb'} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x1+dx} y2={y1+dy} stroke={type === 'diag' ? '#a21caf' : '#2563eb'} strokeWidth="3" markerEnd="url(#arrowhead)" />
    </svg>
  );
};

const DP1DLevel = ({ n, dp, highlight }) => (
  <div className="flex flex-col items-center">
    <div className="flex gap-2 mb-4 relative">
      {dp.map((val, i) => (
        <div key={i} className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg border-2 text-xl font-bold transition-all duration-300 ${highlight === i ? 'bg-blue-300 border-blue-600 shadow-lg animate-pulse' : val !== null ? 'bg-blue-100 border-blue-400' : 'bg-gray-100 border-gray-300 text-gray-400'}`}
          style={{ position: 'relative' }}>
          {val !== null ? val : '?'}
          {i > 1 && highlight === i && (
            <>
              <svg className="absolute left-0 top-0" width="48" height="48">
                <defs>
                  <marker id="arrowhead1d" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0 0, 8 4, 0 8" fill="#2563eb" />
                  </marker>
                </defs>
                <line x1="-24" y1="24" x2="0" y2="24" stroke="#2563eb" strokeWidth="3" markerEnd="url(#arrowhead1d)" />
                <line x1="-48" y1="24" x2="0" y2="24" stroke="#2563eb" strokeWidth="3" markerEnd="url(#arrowhead1d)" />
              </svg>
              <span className="absolute left-1/2 -translate-x-1/2 top-12 text-xs text-blue-700 font-semibold bg-white px-1 rounded shadow">dp[{i}] = dp[{i-1}] + dp[{i-2}]</span>
            </>
          )}
        </div>
      ))}
    </div>
    <div className="text-gray-700 text-lg">Each cell shows ways to reach that step.</div>
  </div>
);

const DP2DLevel = ({ rows, cols, dp, highlight, arrows }) => (
  <div className="relative flex flex-col items-center">
    <div className="grid grid-cols-6 gap-2 mb-4 relative">
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <div key={`${r}-${c}`} className={`w-12 h-12 flex flex-col items-center justify-center rounded-lg border-2 text-xl font-bold transition-all duration-300 ${highlight[0] === r && highlight[1] === c ? 'bg-purple-300 border-purple-600 shadow-lg animate-pulse' : dp[r][c] !== null ? 'bg-purple-100 border-purple-400' : 'bg-gray-100 border-gray-300 text-gray-400'}`}
            style={{ position: 'relative' }}>
            {dp[r][c] !== null ? dp[r][c] : '?'}
          </div>
        ))
      )}
    </div>
    {/* Move overlays here so they are above the grid */}
    <div className="absolute left-0 top-0 w-full h-full pointer-events-none z-10">
      {arrows.map((a, i) => <DPArrow key={i} {...a} />)}
      {/* Formula overlay for current cell */}
      {(() => {
        const [r, c] = highlight;
        if ((r > 0 || c > 0)) {
          return (
            <span
              className="absolute"
              style={{ left: `${c * 48 + 24}px`, top: `${r * 48 + 56}px`, transform: 'translate(-50%, 0)' }}
            >
              <span className="text-xs text-purple-700 font-semibold bg-white px-1 rounded shadow">
                dp[{r}][{c}] = {(r > 0 ? `dp[${r-1}][${c}]` : '')}{r > 0 && c > 0 ? ' + ' : ''}{c > 0 ? `dp[${r}][${c-1}]` : ''}
              </span>
            </span>
          );
        }
        return null;
      })()}
    </div>
    <div className="text-gray-700 text-lg">Each cell shows ways to reach that cell in the grid.</div>
  </div>
);

const DPDemoLevel = ({ goToNextLevel }) => {
  const [showGame, setShowGame] = useState(false);
  const [mode, setMode] = useState('1d'); // '1d' or '2d'
  const [showCompletion, setShowCompletion] = useState(false);
  // 1D DP (stairs)
  const [n, setN] = useState(6);
  const [dp1d, setDp1d] = useState([1, null, null, null, null, null, null]);
  const [highlight1d, setHighlight1d] = useState(0);
  const [playing1d, setPlaying1d] = useState(false);
  const [completed1d, setCompleted1d] = useState(false);
  // 2D DP (grid)
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(6);
  const [dp2d, setDp2d] = useState(
    Array(rows).fill().map((_, i) =>
      Array(cols).fill().map((_, j) => (i === 0 && j === 0 ? 1 : 0))
    )
  );
  const [highlight2d, setHighlight2d] = useState([0, 0]);
  const [arrows, setArrows] = useState([]);
  const [playing2d, setPlaying2d] = useState(false);
  const [completed2d, setCompleted2d] = useState(false);

  // 1D DP logic (stairs)
  const step1d = () => {
    let next = highlight1d + 1;
    if (next > n) return;
    let newDp = [...dp1d];
    newDp[next] = (newDp[next - 1] || 0) + (newDp[next - 2] || 0);
    setDp1d(newDp);
    setHighlight1d(next);
    if (next === n) {
      setCompleted1d(true);
      if (completed2d) setShowCompletion(true);
    }
  };
  const play1d = async () => {
    setPlaying1d(true);
    for (let i = highlight1d + 1; i <= n; i++) {
      await new Promise(res => setTimeout(res, 800));
      step1d();
    }
    setPlaying1d(false);
  };
  const reset1d = () => {
    setDp1d([1, null, null, null, null, null, null]);
    setHighlight1d(0);
    setPlaying1d(false);
    setCompleted1d(false);
  };

  // 2D DP logic (grid paths)
  const step2d = () => {
    // Find next cell to fill
    let nextR = highlight2d[0], nextC = highlight2d[1] + 1;
    if (nextC >= cols) {
      nextR++;
      nextC = 0;
    }
    if (nextR >= rows) return;

    setDp2d(prev => {
      const newDp = prev.map(row => [...row]);
      if (!(nextR === 0 && nextC === 0)) {
        newDp[nextR][nextC] =
          (nextR > 0 ? newDp[nextR - 1][nextC] : 0) +
          (nextC > 0 ? newDp[nextR][nextC - 1] : 0);
      }
      return newDp;
    });
    setHighlight2d([nextR, nextC]);
    if (nextR === rows - 1 && nextC === cols - 1) {
      setCompleted2d(true);
      if (completed1d) setShowCompletion(true);
    }
  };
  const play2d = async () => {
    setPlaying2d(true);
    let total = rows * cols;
    let flat = highlight2d[0] * cols + highlight2d[1];
    for (let i = flat + 1; i < total; i++) {
      await new Promise(res => setTimeout(res, 800));
      step2d();
    }
    setPlaying2d(false);
  };
  const reset2d = () => {
    setDp2d(
      Array(rows).fill().map((_, i) =>
        Array(cols).fill().map((_, j) => (i === 0 && j === 0 ? 1 : 0))
      )
    );
    setHighlight2d([0, 0]);
    setArrows([]);
    setPlaying2d(false);
    setCompleted2d(false);
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 p-5 bg-gray-50 items-center justify-center">
      <div className="flex gap-4 mb-4">
        <button className={`px-4 py-2 rounded font-bold ${mode === '1d' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setMode('1d')}>1D DP (Stairs)</button>
        <button className={`px-4 py-2 rounded font-bold ${mode === '2d' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setMode('2d')}>2D DP (Grid)</button>
      </div>
      {!showGame ? (
        <div className="max-w-3xl bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mb-10">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">Level 8: DP Dimensions: 1D vs 2D 📏</h2>
          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded text-blue-900 text-lg w-full">
            <span className="font-bold">What is 1D vs 2D DP?</span> 1D DP uses a single array to solve problems where the state depends on one variable (like climbing stairs). 2D DP uses a table/grid for problems with two variables (like grid paths or LCS).<br/>
            <span className="font-bold">1D Example:</span> Ways to climb stairs (Fibonacci).<br/>
            <span className="font-bold">2D Example:</span> Ways to reach a cell in a grid (grid paths).
          </div>
          <p className="text-lg text-gray-700 mb-4 text-center">
            Toggle between 1D and 2D DP visualizations. Step through or auto-play to see how the DP table/array fills up!
          </p>
          <button
            className="mt-2 px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold text-xl hover:bg-blue-600 transition-colors"
            onClick={() => setShowGame(true)}
          >
            Start DP Demo
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Level 8: DP Dimensions: 1D vs 2D 📏</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
            {mode === '1d' ? '1D DP: Fill the array to find ways to climb stairs!' : '2D DP: Fill the grid to find ways to reach each cell!'}
          </p>
          <div className="flex flex-col items-center">
            {mode === '1d' ? (
              <DP1DLevel n={n} dp={dp1d} highlight={highlight1d} />
            ) : (
              <DP2DLevel rows={rows} cols={cols} dp={dp2d} highlight={highlight2d} arrows={arrows} />
            )}
            <div className="flex gap-4 mt-6">
              {mode === '1d' ? (
                <>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded font-semibold" onClick={step1d} disabled={playing1d || highlight1d >= n}>Step</button>
                  <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded font-semibold" onClick={reset1d}>Reset</button>
                </>
              ) : (
                <>
                  <button className="px-4 py-2 bg-purple-500 text-white rounded font-semibold" onClick={step2d} disabled={playing2d || (highlight2d[0] === rows - 1 && highlight2d[1] === cols - 1)}>Step</button>
                  <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded font-semibold" onClick={reset2d}>Reset</button>
                </>
              )}
            </div>
          </div>
          <button
            className="fixed bottom-6 right-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
            onClick={goToNextLevel}
          >
            Next Level →
          </button>

          {/* Completion Message Modal */}
          {showCompletion && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
              <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Level Complete! 🎉</h2>
                <p className="text-gray-700 mb-6">
                  Amazing work! You've mastered both 1D and 2D Dynamic Programming.
                  <br />
                  <span className="text-blue-600 font-semibold">You've learned how to solve problems in both dimensions!</span>
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setShowCompletion(false);
                      reset1d();
                      reset2d();
                    }}
                    className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={goToNextLevel}
                    className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Next Level →
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const StateCell = ({ value, highlight, optimal, deadend, tooltip, isTransition }) => (
  <div className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 text-lg font-bold transition-all duration-300 relative
    ${highlight ? 'bg-blue-300 border-blue-600 shadow-lg animate-pulse scale-110' : 
      optimal ? 'bg-green-200 border-green-600' : 
      deadend ? 'bg-red-200 border-red-600' : 
      isTransition ? 'bg-yellow-100 border-yellow-400' :
      value !== null ? 'bg-blue-100 border-blue-400' : 
      'bg-gray-100 border-gray-300 text-gray-400'}`}
    >
    {value !== null ? value : '?'}
    {tooltip && (
      <div className="absolute left-1/2 -translate-x-1/2 top-16 text-xs text-blue-700 font-semibold bg-white px-2 py-1 rounded shadow-lg z-20 whitespace-nowrap border border-blue-200">
        {tooltip}
      </div>
    )}
  </div>
);

const defaultSubset = [2, 3, 7, 8, 10];
const targetSum = 11;

function subsetSumDP(arr, target) {
  let n = arr.length;
  let dp = Array.from({ length: n + 1 }, () => Array(target + 1).fill(false));
  dp[0][0] = true;
  for (let i = 1; i <= n; i++) {
    for (let s = 0; s <= target; s++) {
      dp[i][s] = dp[i - 1][s] || (s - arr[i - 1] >= 0 && dp[i - 1][s - arr[i - 1]]);
    }
  }
  return dp;
}

const StateExplorerLevel = ({ goToNextLevel }) => {
  const [showGame, setShowGame] = useState(false);
  const [step, setStep] = useState(0);
  const [dp, setDP] = useState(subsetSumDP(defaultSubset, targetSum));
  const [highlight, setHighlight] = useState([0, 0]);
  const [path, setPath] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [showExplanation, setShowExplanation] = useState(true);
  const [currentTransition, setCurrentTransition] = useState(null);
  const n = defaultSubset.length;
  const t = targetSum;

  // Step through DP table with transitions
  const stepDP = () => {
    let flat = highlight[0] * (t + 1) + highlight[1];
    let nextFlat = flat + 1;
    if (nextFlat > (n + 1) * (t + 1) - 1) return;
    
    let nextI = Math.floor(nextFlat / (t + 1));
    let nextJ = nextFlat % (t + 1);
    
    // Show transition
    setCurrentTransition({
      from: [highlight[0], highlight[1]],
      to: [nextI, nextJ]
    });
    
    setTimeout(() => {
      setHighlight([nextI, nextJ]);
      setCurrentTransition(null);
    }, 500);
  };

  const playDP = async () => {
    setPlaying(true);
    let flat = highlight[0] * (t + 1) + highlight[1];
    for (let i = flat + 1; i < (n + 1) * (t + 1); i++) {
      let nextI = Math.floor(i / (t + 1));
      let nextJ = i % (t + 1);
      
      setCurrentTransition({
        from: [highlight[0], highlight[1]],
        to: [nextI, nextJ]
      });
      
      await new Promise(res => setTimeout(res, 500));
      setHighlight([nextI, nextJ]);
      setCurrentTransition(null);
      await new Promise(res => setTimeout(res, 200));
    }
    setPlaying(false);
  };

  const resetDP = () => {
    setHighlight([0, 0]);
    setPlaying(false);
    setPath([]);
    setCurrentTransition(null);
  };

  // Backtrack for path with animation
  const findPath = async () => {
    let i = n, s = t, p = [];
    let dpTable = dp;
    while (i > 0 && s >= 0) {
      if (dpTable[i][s] && !dpTable[i - 1][s]) {
        p.push(i - 1);
        s -= defaultSubset[i - 1];
      }
      i--;
    }
    setPath(p.reverse());
  };

  return (
    <div className="min-h-screen pt-16 p-5 bg-gray-50 items-center justify-center">
      {!showGame ? (
        <div className="max-w-4xl bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mb-10">
          <h2 className="text-4xl font-bold text-blue-800 mb-6">Level 10: DP State Explorer 🌐</h2>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-3">What is State Representation?</h3>
              <p className="text-blue-900">
                In DP, a "state" represents all the information we need to solve a subproblem. For subset sum:
                <ul className="list-disc ml-6 mt-2 space-y-2">
                  <li>Which items we've used (rows)</li>
                  <li>Current sum we're trying to reach (columns)</li>
                  <li>✓ means we can reach that sum with those items</li>
                </ul>
              </p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-3">How to Read the Table</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-300 rounded"></div>
                  <span>Current cell being processed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 rounded"></div>
                  <span>Part of solution path</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                  <span>Transition path</span>
                </div>
              </div>
            </div>
          </div>

          <button
            className="mt-4 px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold text-xl hover:bg-blue-600 transition-colors shadow-lg"
            onClick={() => setShowGame(true)}
          >
            Start State Explorer
          </button>
        </div>
      ) : (
        <>
          <div className="max-w-6xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-blue-800">DP State Explorer 🌐</h2>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => setShowExplanation(!showExplanation)}
              >
                {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
              </button>
            </div>

            {showExplanation && (
              <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <p className="text-lg text-gray-700">
                  We're trying to find a subset of numbers that sum to {targetSum}. Each cell shows if we can reach that sum using the items up to that row.
                </p>
              </div>
            )}

            <div className="flex flex-col items-center">
              <div className="flex gap-3 mb-4">
                {defaultSubset.map((v, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold border-2 border-blue-400">
                      {v}
                    </span>
                    <span className="text-sm text-gray-600 mt-1">Item {i + 1}</span>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-lg">
                <div className="flex flex-col">
                  {dp.map((row, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      {row.map((val, j) => {
                        const isTransition = currentTransition && 
                          ((currentTransition.from[0] === i && currentTransition.from[1] === j) ||
                           (currentTransition.to[0] === i && currentTransition.to[1] === j));
                        
                        return (
                          <StateCell
                            key={j}
                            value={val ? '✓' : ''}
                            highlight={highlight[0] === i && highlight[1] === j}
                            optimal={path.length > 0 && path.includes(i - 1) && j === targetSum}
                            deadend={i > 0 && !val && dp[i - 1][j]}
                            isTransition={isTransition}
                            tooltip={`Items: ${i}, Sum: ${j}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-md"
                  onClick={stepDP} 
                  disabled={playing || (highlight[0] === n && highlight[1] === t)}
                >
                  Step
                </button>
                <button 
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md"
                  onClick={playDP} 
                  disabled={playing || (highlight[0] === n && highlight[1] === t)}
                >
                  Play
                </button>
                <button 
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition-colors shadow-md"
                  onClick={resetDP}
                >
                  Reset
                </button>
                <button 
                  className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors shadow-md"
                  onClick={findPath}
                >
                  Show Solution Path
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-block bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-2">Key Learning</h3>
                <p className="text-blue-900">
                  DP state lets you solve complex problems by tracking all the variables you need! 
                  In this case, we track both the items used and the current sum to find our solution.
                </p>
              </div>
            </div>
          </div>
          <button
            className="fixed bottom-6 right-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
            onClick={goToNextLevel}
          >
            Next Level →
          </button>
        </>
      )}
    </div>
  );
};

const GridCell = ({ type, isActive, isPath, isStart, isEnd, onClick }) => {
  const getCellStyle = () => {
    if (isStart) return 'bg-green-400 border-green-600';
    if (isEnd) return 'bg-red-400 border-red-600';
    if (isPath) return 'bg-blue-300 border-blue-500';
    if (isActive) return 'bg-yellow-300 border-yellow-500 animate-pulse';
    switch (type) {
      case 'wall': return 'bg-gray-700 border-gray-800';
      case 'coin': return 'bg-yellow-400 border-yellow-600';
      case 'empty': return 'bg-white border-gray-300';
      default: return 'bg-white border-gray-300';
    }
  };

  return (
    <div 
      className={`w-12 h-12 ${getCellStyle()} border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105`}
      onClick={onClick}
    >
      {type === 'coin' && '🪙'}
      {isStart && '🤖'}
      {isEnd && '🏁'}
    </div>
  );
};

const DPPathFinderLevel = ({ goToNextLevel }) => {
  const [showGame, setShowGame] = useState(false);
  const [grid, setGrid] = useState([
    ['empty', 'coin', 'empty', 'wall', 'empty'],
    ['wall', 'empty', 'coin', 'empty', 'empty'],
    ['empty', 'wall', 'empty', 'coin', 'empty'],
    ['empty', 'empty', 'wall', 'empty', 'coin'],
    ['empty', 'wall', 'empty', 'coin', 'empty']
  ]);
  const [currentPos, setCurrentPos] = useState([0, 0]);
  const [endPos] = useState([4, 4]);
  const [path, setPath] = useState([]);
  const [coins, setCoins] = useState(0);
  const [showDP, setShowDP] = useState(false);
  const [dpTable, setDPTable] = useState([]);
  const [step, setStep] = useState(0);

  // Initialize DP table
  useEffect(() => {
    const n = grid.length;
    const m = grid[0].length;
    const dp = Array(n).fill().map(() => Array(m).fill(0));
    dp[0][0] = 1;
    setDPTable(dp);
  }, []);

  const calculateDP = () => {
    const n = grid.length;
    const m = grid[0].length;
    const dp = Array(n).fill().map(() => Array(m).fill(0));
    dp[0][0] = 1;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < m; j++) {
        if (grid[i][j] === 'wall') continue;
        
        if (i > 0 && grid[i-1][j] !== 'wall') {
          dp[i][j] += dp[i-1][j];
        }
        if (j > 0 && grid[i][j-1] !== 'wall') {
          dp[i][j] += dp[i][j-1];
        }
      }
    }
    setDPTable(dp);
  };

  const handleCellClick = (row, col) => {
    if (grid[row][col] === 'wall') return;
    
    const [currRow, currCol] = currentPos;
    const isAdjacent = (
      (Math.abs(row - currRow) === 1 && col === currCol) ||
      (Math.abs(col - currCol) === 1 && row === currRow)
    );

    if (isAdjacent) {
      setCurrentPos([row, col]);
      setPath([...path, [row, col]]);
      
      if (grid[row][col] === 'coin') {
        setCoins(coins + 1);
        const newGrid = [...grid];
        newGrid[row][col] = 'empty';
        setGrid(newGrid);
      }
    }
  };

  const resetGame = () => {
    setCurrentPos([0, 0]);
    setPath([]);
    setCoins(0);
    setShowDP(false);
    setStep(0);
    setGrid([
      ['empty', 'coin', 'empty', 'wall', 'empty'],
      ['wall', 'empty', 'coin', 'empty', 'empty'],
      ['empty', 'wall', 'empty', 'coin', 'empty'],
      ['empty', 'empty', 'wall', 'empty', 'coin'],
      ['empty', 'wall', 'empty', 'coin', 'empty']
    ]);
  };

  return (
    <div className="flex flex-col min-h-screen pt-16 p-5 bg-gray-50 items-center justify-center">
      {!showGame ? (
        <div className="max-w-4xl bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mb-10">
          <h2 className="text-4xl font-bold text-blue-800 mb-6">Level 10: DP Path Finder 🎮</h2>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Your Mission</h3>
              <p className="text-blue-900">
                Help the robot collect coins and reach the finish line! Each move teaches you about:
                <ul className="list-disc ml-6 mt-2 space-y-2">
                  <li>State transitions in DP</li>
                  <li>How to count paths</li>
                  <li>Optimal path finding</li>
                </ul>
              </p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
              <h3 className="text-xl font-bold text-green-800 mb-3">How to Play</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-400 rounded"></div>
                  <span>Start Position (Robot)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-400 rounded"></div>
                  <span>Finish Line</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span>Coins to Collect</span>
                </div>
              </div>
            </div>
          </div>

          <button
            className="mt-4 px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold text-xl hover:bg-blue-600 transition-colors shadow-lg"
            onClick={() => setShowGame(true)}
          >
            Start Path Finding
          </button>
        </div>
      ) : (
        <div className="max-w-6xl w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-blue-800">DP Path Finder 🎮</h2>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => setShowDP(!showDP)}
              >
                {showDP ? 'Hide DP Table' : 'Show DP Table'}
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={resetGame}
              >
                Reset Game
              </button>
            </div>
          </div>

          <div className="flex gap-8 justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-col gap-2">
                {grid.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    {row.map((cell, j) => (
                      <GridCell
                        key={`${i}-${j}`}
                        type={cell}
                        isActive={currentPos[0] === i && currentPos[1] === j}
                        isPath={path.some(([r, c]) => r === i && c === j)}
                        isStart={i === 0 && j === 0}
                        isEnd={i === endPos[0] && j === endPos[1]}
                        onClick={() => handleCellClick(i, j)}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-xl font-bold text-blue-800">
                  Coins Collected: {coins} 🪙
                </p>
              </div>
            </div>

            {showDP && (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-blue-800 mb-4">DP Table</h3>
                <div className="flex flex-col gap-2">
                  {dpTable.map((row, i) => (
                    <div key={i} className="flex gap-2">
                      {row.map((val, j) => (
                        <div
                          key={j}
                          className={`w-12 h-12 flex items-center justify-center border-2 rounded-lg
                            ${grid[i][j] === 'wall' ? 'bg-gray-700 border-gray-800' : 'bg-blue-100 border-blue-300'}`}
                        >
                          {val}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-lg text-gray-700">
                    Each cell shows how many ways to reach that position
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-block bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-800 mb-2">Key Learning</h3>
              <p className="text-blue-900">
                In DP, we can count paths by adding up the ways to reach each cell! 
                The number in each cell represents how many different paths can reach that position.
              </p>
            </div>
          </div>
          <button
            className="fixed bottom-6 right-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
            onClick={goToNextLevel}
          >
            Next Level →
          </button>
        </div>
      )}
    </div>
  );
};

const Stone = ({ number, hasCarrot, isActive, isPath, ways, onClick }) => {
  const getStoneStyle = () => {
    if (isActive) return 'bg-yellow-300 border-yellow-500 animate-bounce';
    if (isPath) return 'bg-green-200 border-green-400';
    return 'bg-gray-200 border-gray-400';
  };

  return (
    <div 
      className={`relative w-20 h-20 ${getStoneStyle()} border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105`}
      onClick={onClick}
    >
      <span className="text-xl font-bold text-gray-700">{number}</span>
      {hasCarrot && <span className="absolute -top-4 text-2xl">🥕</span>}
      {ways > 0 && (
        <div className="absolute -bottom-6 text-sm font-semibold text-blue-600">
          {ways} ways
        </div>
      )}
    </div>
  );
};

const RabbitJumpRace = ({ goToNextLevel }) => {
  const [showGame, setShowGame] = useState(false);
  const [stones, setStones] = useState([]);
  const [optimalPath, setOptimalPath] = useState([]);
  const [showPath, setShowPath] = useState(false);
  const [score, setScore] = useState(null);
  const [showCompletionHidden, setShowCompletionHidden] = useState(false);

  useEffect(() => {
    // Initialize stones with random carrots
    const newStones = Array(8).fill().map((_, i) => ({
      number: i + 1,
      hasCarrot: Math.random() < 0.3,
      isPath: false,
      ways: i === 0 ? 1 : 0
    }));
    setStones(newStones);
    setOptimalPath([]);
    setShowPath(false);
    setScore(null);
  }, []);

  const showOptimalPath = () => {
    // Calculate optimal path using dynamic programming
    const dp = Array(stones.length).fill(0);
    const prev = Array(stones.length).fill(-1);
    dp[0] = stones[0].hasCarrot ? 1 : 0;

    for (let i = 1; i < stones.length; i++) {
      // Can jump from i-1 or i-2
      const from1 = i >= 1 ? dp[i-1] : -1;
      const from2 = i >= 2 ? dp[i-2] : -1;
      
      if (from1 > from2) {
        dp[i] = from1 + (stones[i].hasCarrot ? 1 : 0);
        prev[i] = i-1;
      } else {
        dp[i] = from2 + (stones[i].hasCarrot ? 1 : 0);
        prev[i] = i-2;
      }
    }

    // Reconstruct path
    const path = [];
    let current = stones.length - 1;
    while (current >= 0) {
      path.unshift(current);
      current = prev[current];
    }

    // Update stones with optimal path
    const newStones = stones.map((s, idx) => ({
      ...s,
      isPath: path.includes(idx)
    }));

    setStones(newStones);
    setOptimalPath(path);
    setShowPath(true);
    
    // Set score based on carrots collected
    const carrots = newStones.filter(s => s.hasCarrot && s.isPath).length;
    setScore(carrots >= 3 ? 'Legendary Jumper' : carrots >= 2 ? 'Master Hopper' : 'Novice Rabbit');
  };

  const resetGame = () => {
    const newStones = stones.map(s => ({
      ...s,
      hasCarrot: Math.random() < 0.3,
      isPath: false,
      ways: s.number === 1 ? 1 : 0
    }));
    setStones(newStones);
    setOptimalPath([]);
    setShowPath(false);
    setScore(null);
  };

  return (
    <div className="min-h-screen pt-16 p-5 bg-gray-50 flex flex-col items-center justify-center">
      {!showGame ? (
        <div className="max-w-3xl bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mb-10">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">Level 6: Rabbit Jump Race 🐰</h2>
          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded text-blue-900 text-lg w-full">
            <span className="font-bold">What is the Rabbit Jump Problem?</span> A rabbit can jump either 1 or 2 stones at a time. How many different ways can it reach the end? Dynamic programming helps you find all possible paths and the optimal one with the most carrots!
          </div>
          <p className="text-lg text-gray-700 mb-4 text-center">
            Find the path that collects the most carrots! The rabbit can jump 1 or 2 stones at a time.
          </p>
          <button
            className="mt-2 px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold text-xl hover:bg-blue-600 transition-colors"
            onClick={() => setShowGame(true)}
          >
            Start Rabbit Race
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Level 6: Rabbit Jump Race 🐰</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
            Find the path that collects the most carrots! The rabbit can jump 1 or 2 stones at a time.
          </p>
          <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8 items-center justify-center">
            <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center relative min-h-[420px]">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xl font-bold text-gray-700">Race Track</div>
              <div className="mt-16 mb-4 flex flex-col items-center">
                <div className="flex flex-wrap justify-center gap-4">
                  {stones.map((stone, idx) => (
                    <Stone
                      key={idx}
                      number={stone.number}
                      hasCarrot={stone.hasCarrot}
                      isPath={stone.isPath}
                      ways={stone.ways}
                    />
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded font-semibold" onClick={resetGame}>Reset</button>
                  <button className="px-4 py-2 bg-green-500 text-white rounded font-semibold" onClick={showOptimalPath}>Show Optimal Path</button>
                </div>
              </div>
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="text-gray-700 text-lg">Carrots collected: <span className="font-bold">{stones.filter(s => s.hasCarrot && s.isPath).length}</span></div>
                <div className="text-gray-700 text-lg">Ways to reach end: <span className="font-bold">{stones[stones.length-1].ways}</span></div>
                {score && (
                  <div className="mt-2 text-xl font-bold text-green-600 animate-bounce">Rabbit Score: {score}</div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10 text-2xl font-bold text-blue-700 text-center">
            Key Learning: <span className="text-blue-700">DP helps find all possible paths and the optimal one with the most carrots!</span>
          </div>
          <button
            className="fixed bottom-6 right-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
            onClick={goToNextLevel}
          >
            Next Level →
          </button>
          {showPath && score && !showCompletionHidden && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4">
                <h3 className="text-2xl font-bold text-green-600 mb-4">Path Found! 🎉</h3>
                <p className="text-gray-700 mb-4">
                  You've found the optimal path with {stones.filter(s => s.hasCarrot && s.isPath).length} carrots!
                  <br />Rabbit Score: <span className="font-bold text-blue-700">{score}</span>
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600"
                    onClick={resetGame}
                  >
                    Try Another Path
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600"
                    onClick={goToNextLevel}
                  >
                    Next Level
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded font-semibold hover:bg-gray-600"
                    onClick={() => setShowCompletionHidden(true)}
                  >
                    Hide this message
                  </button>
                </div>
              </div>
            </div>
          )}
          {showPath && score && showCompletionHidden && (
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600"
              onClick={() => setShowCompletionHidden(false)}
            >
              Show Completion Message
            </button>
          )}
        </>
      )}
    </div>
  );
};

const CubeCell = ({ value, isActive, isPath, layer, row, col, onClick }) => {
  const getCubeStyle = () => {
    if (isActive) return 'bg-yellow-300 border-yellow-500 animate-pulse';
    if (isPath) return 'bg-green-200 border-green-400';
    return 'bg-blue-100 border-blue-300';
  };

  return (
    <div 
      className={`w-12 h-12 ${getCubeStyle()} border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 relative`}
      onClick={() => onClick(layer, row, col)}
    >
      <span className="text-lg font-bold text-blue-800">{value}</span>
      <div className="absolute -bottom-6 text-xs text-gray-600">
        ({layer},{row},{col})
      </div>
    </div>
  );
};

const ThreeDDPExplorer = ({ goToNextLevel }) => {
  const navigate = useNavigate(); // Add this at the top with other state declarations
  const [showGame, setShowGame] = useState(false);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [dp, setDP] = useState([]);
  const [path, setPath] = useState([]);
  const [showExplanation, setShowExplanation] = useState(true);
  const [step, setStep] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const size = 3; // 3x3x3 cube

  // Initialize 3D DP table
  useEffect(() => {
    const cube = Array(size).fill().map(() => 
      Array(size).fill().map(() => 
        Array(size).fill(0)
      )
    );
    cube[0][0][0] = 1; // Base case
    setDP(cube);
  }, []);

  const calculateNextStep = () => {
    if (step >= size * size * size - 1) {
      setShowCompletion(true);
      return;
    }
    
    const newDP = [...dp];
    const nextStep = step + 1;
    const layer = Math.floor(nextStep / (size * size));
    const row = Math.floor((nextStep % (size * size)) / size);
    const col = nextStep % size;

    // Calculate value based on previous states
    let value = 0;
    if (layer > 0) value += newDP[layer-1][row][col];
    if (row > 0) value += newDP[layer][row-1][col];
    if (col > 0) value += newDP[layer][row][col-1];
    
    newDP[layer][row][col] = value;
    setDP(newDP);
    setStep(nextStep);
    setPath([...path, [layer, row, col]]);

    // Check if this was the last step
    if (nextStep === size * size * size - 1) {
      setShowCompletion(true);
    }
  };

  const resetDP = () => {
    const cube = Array(size).fill().map(() => 
      Array(size).fill().map(() => 
        Array(size).fill(0)
      )
    );
    cube[0][0][0] = 1;
    setDP(cube);
    setStep(0);
    setPath([]);
    setShowCompletion(false);
  };

  const handleCubeClick = (layer, row, col) => {
    if (layer === 0 && row === 0 && col === 0) return;
    
    const isAdjacent = (
      (Math.abs(layer - currentLayer) === 1 && row === 0 && col === 0) ||
      (layer === currentLayer && Math.abs(row - path[path.length-1][1]) === 1 && col === path[path.length-1][2]) ||
      (layer === currentLayer && row === path[path.length-1][1] && Math.abs(col - path[path.length-1][2]) === 1)
    );

    if (isAdjacent) {
      setCurrentLayer(layer);
      setPath([...path, [layer, row, col]]);
      
      // Check if this completes the cube
      if (path.length + 1 === size * size * size - 1) {
        setShowCompletion(true);
      }
    }
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col pt-16 p-5 bg-gradient-to-b from-blue-50 to-purple-50 items-center justify-center">
      {!showGame ? (
        <div className="max-w-4xl bg-white rounded-xl shadow-lg p-10 flex flex-col items-center mb-10">
          <h2 className="text-4xl font-bold text-blue-800 mb-6">Level 10: 3D DP Explorer 🎲</h2>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-bold text-blue-700 mb-2">3D Dynamic Programming</h3>
                <p className="text-blue-900">
                  Explore how DP works in three dimensions! Each cell's value depends on its neighbors in all three dimensions.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="text-xl font-bold text-purple-700 mb-2">How to Play</h3>
                <ul className="list-disc list-inside text-purple-900 space-y-2">
                  <li>Click "Start" to begin exploring the 3D cube</li>
                  <li>Use "Next Step" to see how values are calculated</li>
                  <li>Or click cells to navigate through the cube</li>
                  <li>Complete all cells to master 3D DP!</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={() => setShowGame(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-xl font-bold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Start 3D Adventure
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-blue-800">3D DP Explorer</h2>
            <div className="space-x-4">
              <button
                onClick={calculateNextStep}
                disabled={step >= size * size * size - 1}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
              <button
                onClick={resetDP}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {Array(size).fill().map((_, layer) => (
              <div key={layer} className="bg-white p-4 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-blue-700 mb-4">Layer {layer}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {Array(size).fill().map((_, row) => (
                    Array(size).fill().map((_, col) => (
                      <CubeCell
                        key={`${layer}-${row}-${col}`}
                        value={dp[layer]?.[row]?.[col] || 0}
                        isActive={path.some(([l, r, c]) => l === layer && r === row && c === col)}
                        isPath={path.some(([l, r, c]) => l === layer && r === row && c === col)}
                        layer={layer}
                        row={row}
                        col={col}
                        onClick={() => handleCubeClick(layer, row, col)}
                      />
                    ))
                  ))}
                </div>
              </div>
            ))}
          </div>

          {showCompletion && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4">
                <h2 className="text-3xl font-bold text-blue-800 mb-4">3D DP Mastered! 🎉</h2>
                <p className="text-gray-700 mb-6">
                  Congratulations! You've successfully completed the 3D Dynamic Programming challenge. You've mastered how values propagate through three dimensions!
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={resetDP}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleDashboard}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const DPIntroLevel = ({ goToNextLevel }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const [exampleStep, setExampleStep] = useState(0);
  const [memoTable, setMemoTable] = useState({});
  const [fibSequence, setFibSequence] = useState([0, 1]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [showCompletion, setShowCompletion] = useState(false);

  const sections = [
    {
      title: "What is Dynamic Programming?",
      content: "Dynamic Programming (DP) is a problem-solving technique that breaks down complex problems into simpler subproblems. It's like solving a big puzzle by solving smaller pieces first and remembering their solutions!",
      icon: "🧩"
    },
    {
      title: "Why Do We Need DP?",
      content: "Many problems have overlapping subproblems - we solve the same smaller problem multiple times. DP helps us avoid this repetition by storing solutions to subproblems we've already solved. This makes our code much faster!",
      icon: "⚡"
    },
    {
      title: "How DP Optimizes Code",
      content: "Without DP, some problems might take exponential time (like 2^n). With DP, we can solve them in polynomial time (like n²). That's a huge improvement! For example, calculating the 40th Fibonacci number without DP would take billions of steps, but with DP, it takes just 40 steps!",
      icon: "🚀"
    }
  ];

  const runFibonacciExample = async () => {
    setShowExample(true);
    setExampleStep(0);
    setMemoTable({});
    setFibSequence([0, 1]);
    setHighlightedCells([]);

    // Simulate calculating Fibonacci numbers with memoization
    for (let i = 2; i <= 8; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show which numbers we're using
      setHighlightedCells([i-2, i-1]);
      
      // Calculate next number
      const nextFib = fibSequence[i-1] + fibSequence[i-2];
      setFibSequence(prev => [...prev, nextFib]);
      
      // Update memo table
      setMemoTable(prev => ({
        ...prev,
        [i]: {
          value: nextFib,
          used: [i-2, i-1]
        }
      }));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setHighlightedCells([]);
    }
  };

  const resetExample = () => {
    setShowExample(false);
    setExampleStep(0);
    setMemoTable({});
    setFibSequence([0, 1]);
    setHighlightedCells([]);
  };

  return (
    <div className="flex flex-col min-h-screen pt-16 bg-gray-100 p-8 items-center justify-center">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Level 1: Understanding Dynamic Programming</h2>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
          ></div>
        </div>

        {/* Current Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{sections[currentSection].icon}</span>
            <h3 className="text-2xl font-bold text-gray-800">{sections[currentSection].title}</h3>
          </div>
          <p className="text-lg text-gray-700 whitespace-pre-line">{sections[currentSection].content}</p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
            disabled={currentSection === 0}
            className={`px-6 py-3 rounded-lg font-semibold ${
              currentSection === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            ← Previous
          </button>
          
          {currentSection < sections.length - 1 ? (
            <button
              onClick={() => setCurrentSection(prev => prev + 1)}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => setShowCompletion(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
            >
              Complete Level →
            </button>
          )}
        </div>
      </div>

      {/* Completion Message Modal */}
      {showCompletion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Level 1 Complete! 🎉</h2>
            <p className="text-gray-700 mb-6">
              Congratulations! You've learned the fundamentals of Dynamic Programming. 
              You're now ready to start practicing with real DP problems!
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowCompletion(false)}
                className="px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
              >
                Review Again
              </button>
              <button
                onClick={goToNextLevel}
                className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
              >
                Start Practicing →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function DynamicProgrammingGame(props) {
  return <ComingSoon />;
}