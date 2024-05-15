'use client';
import { useState } from 'react';
import DrawCanvas from './DrawCanvas';
import { saveDrawing } from './firebase';
import Login from './Login';
import axios from 'axios';

const canvasTypes = ['whiteboard', 'blackboard'];
const canvasSizes = [300, 500, 700];

type GameMode = 'creative' | 'easy' | 'normal' | 'hard';

const modes: Record<GameMode, number> = {
    creative: 0,
    easy: 15,
    normal: 10,
    hard: 5
};

interface QuickDrawProps {
    user: string | null;
    setUser: (username: string | null) => void;
}

const QuickDraw: React.FC<QuickDrawProps> = ({ user, setUser }) => {
    const [mode, setMode] = useState<GameMode | ''>('');
    const [prompt, setPrompt] = useState('');
    const [canvasType, setCanvasType] = useState(canvasTypes[0]);
    const [canvasSize, setCanvasSize] = useState(canvasSizes[0]);
    const [drawings, setDrawings] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showLogin, setShowLogin] = useState(false);

    const fetchPrompt = async () => {
        const response = await axios.get('https://api.example.com/generate-prompt'); // Replace with a real API endpoint
        return response.data.prompt;
    };

    const startGame = async (selectedMode: GameMode) => {
        setMode(selectedMode);
        const newPrompt = await fetchPrompt();
        setPrompt(newPrompt);
        setTimeLeft(modes[selectedMode]);
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev === 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const evaluateDrawing = (dataURL: string) => {
        if (prompt === 'circle' && dataURL.includes('some_circle_data')) {
            setScore(score + 10);
        } else if (prompt === 'square' && dataURL.includes('some_square_data')) {
            setScore(score + 10);
        } else if (prompt === 'triangle' && dataURL.includes('some_triangle_data')) {
            setScore(score + 10);
        } else if (prompt === 'star' && dataURL.includes('some_star_data')) {
            setScore(score + 10);
        } else {
            setScore(score - 5);
        }
        setDrawings([...drawings, dataURL]);
        setPrompt('');
        if (timeLeft === 0) {
            setShowLogin(true);
        }
    };

    const handleSaveDrawing = async (drawing: string) => {
        if (user) {
            await saveDrawing(user, drawing);
        }
    };

    return (
        <div className="flex flex-col items-center h-screen bg-gray-900 text-white">
            <h1 className="text-2xl font-bold mb-4">Quick Draw Challenge</h1>
            {!mode ? (
                <div className="flex flex-col items-center">
                    <h2 className="text-xl mb-4">Select Mode</h2>
                    <button onClick={() => startGame('creative')} className="mb-2 p-2 bg-green-500 text-white rounded">Creative</button>
                    <button onClick={() => startGame('easy')} className="mb-2 p-2 bg-blue-500 text-white rounded">Easy</button>
                    <button onClick={() => startGame('normal')} className="mb-2 p-2 bg-yellow-500 text-white rounded">Normal</button>
                    <button onClick={() => startGame('hard')} className="mb-2 p-2 bg-red-500 text-white rounded">Hard</button>
                    <div className="mt-4">
                        <h3 className="text-lg mb-2">Select Canvas Type</h3>
                        {canvasTypes.map(type => (
                            <button
                                key={type}
                                onClick={() => setCanvasType(type)}
                                className={`mb-2 p-2 ${canvasType === type ? 'bg-blue-700' : 'bg-blue-500'} text-white rounded`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4">
                        <h3 className="text-lg mb-2">Select Canvas Size</h3>
                        {canvasSizes.map(size => (
                            <button
                                key={size}
                                onClick={() => setCanvasSize(size)}
                                className={`mb-2 p-2 ${canvasSize === size ? 'bg-blue-700' : 'bg-blue-500'} text-white rounded`}
                            >
                                {size}px
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <h2 className="text-xl mb-2">Draw a {prompt}</h2>
                    <DrawCanvas prompt={prompt} onSubmit={evaluateDrawing} canvasType={canvasType} canvasSize={canvasSize} />
                    {mode !== 'creative' && <p className="mt-2">Time left: {timeLeft} seconds</p>}
                </div>
            )}
            <p className="mt-4 text-lg">Score: {score}</p>
            {drawings.length > 0 && (
                <div className="flex flex-col items-center mt-4">
                    <h2 className="text-xl mb-2">Your Drawings</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {drawings.map((drawing, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <img src={drawing} alt={`Drawing ${index + 1}`} className="w-24 h-24 border border-gray-300" />
                                {user && <button onClick={() => handleSaveDrawing(drawing)} className="mt-2 p-1 bg-blue-500 text-white rounded">Save</button>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {showLogin && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-xl mb-4">Game Over! Do you want to save your drawings?</h2>
                        <button onClick={() => setShowLogin(false)} className="mb-2 p-2 bg-gray-500 text-white rounded">No</button>
                        <button onClick={() => setShowLogin(true)} className="mb-2 p-2 bg-blue-500 text-white rounded">Yes</button>
                        {showLogin && <Login setUser={setUser} />}
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuickDraw;
