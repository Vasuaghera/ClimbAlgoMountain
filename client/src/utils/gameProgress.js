// Game Progress Utility Functions

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Function to save game progress to the backend
export const saveGameProgress = async (progressData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${BACKEND_URL}/api/user/progress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(progressData)
        });

        if (!response.ok) {
            throw new Error(`Failed to save progress: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error saving game progress:', error);
        throw error;
    }
};

// Function to fetch game progress from the backend
export const fetchGameProgress = async ({ user, topicId, setGameProgress, setCompletedLevels, setGameMessage }) => {
    if (!user || !user.id) {
        console.log('No user found, skipping fetchGameProgress');
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No auth token found in fetchGameProgress');
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/user/progress`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                console.log('No user progress found yet (expected for new users)');
                setGameProgress(null);
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
        
        // Get topic-specific progress from the correct path
        const topicProgressEntry = userData?.data?.progress?.topics?.[topicId];
        console.log(`Found ${topicId} progress entry in user data:`, topicProgressEntry);

        setGameProgress(topicProgressEntry || null);
        if (topicProgressEntry && topicProgressEntry.gameLevels) {
            const completed = new Set(topicProgressEntry.gameLevels.filter(l => l.completed).map(l => l.level));
            setCompletedLevels(completed);
        } else {
            setCompletedLevels(new Set());
        }

    } catch (error) {
        console.error('Error loading progress:', error);
        setGameMessage('Failed to load progress. Please try refreshing the page.');
    }
}; 