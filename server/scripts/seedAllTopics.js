// seedAllTopics.js
// Run with: node scripts/seedAllTopics.js

const mongoose = require('mongoose');
const Topic = require('../models/topic.model');

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://vasuaghera33:Nhss8Q3eOE6TXF1m@cluster0.t8euiot.mongodb.net/dsagameforchildrenfinal1";

const topics = [
  { topicId: 'sorting', name: 'Sorting Algorithms', description: 'Master different sorting algorithms through interactive challenges', difficulty: 'easy' },
  { topicId: 'stack-queue', name: 'Stack & Queue', description: 'Learn stack and queue operations through fun puzzles', difficulty: 'easy' },
  { topicId: 'sliding-window-two-pointer', name: 'Window & Pointer', description: 'Master sliding window and two-pointer techniques', difficulty: 'medium' },
  { topicId: 'dynamic-programming', name: 'Pattern Master', description: 'Discover and master different pattern recognition techniques', difficulty: 'medium' },
  { topicId: 'heap-priority-queue', name: 'Heap & Priority Queue', description: 'Learn about heaps and priority queues', difficulty: 'medium' },
  { topicId: 'arrays', name: 'Arrays', description: 'Master array manipulation and algorithms', difficulty: 'easy' },
  { topicId: 'strings', name: 'Strings', description: 'Learn string manipulation and algorithms', difficulty: 'easy' },
  { topicId: 'linked-lists', name: 'Linked Lists', description: 'Master linked list operations and algorithms', difficulty: 'medium' },
  { topicId: 'binary-trees', name: 'Binary Trees', description: 'Learn binary trees and BST operations', difficulty: 'medium' },
  { topicId: 'recursion', name: 'Recursion', description: 'Master recursion through interactive puzzles', difficulty: 'medium' },
  { topicId: 'graphs', name: 'Graphs', description: 'Learn graph algorithms and applications', difficulty: 'hard' },
  { topicId: 'dp', name: 'Dynamic Programming', description: 'Master dynamic programming through interactive challenges', difficulty: 'hard' },
  { topicId: 'bit-manipulation', name: 'Bit Manipulation', description: 'Master bitwise operations and manipulation through interactive challenges', difficulty: 'medium' }
];

async function seedTopics() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('Connected to MongoDB');

  for (const topic of topics) {
    await Topic.updateOne(
      { topicId: topic.topicId },
      topic,
      { upsert: true }
    );
    console.log(`Seeded topic: ${topic.name}`);
  }

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

seedTopics().catch(err => {
  console.error('Error during topic seeding:', err);
  process.exit(1);
}); 