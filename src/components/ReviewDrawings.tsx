import { useState, useEffect } from 'react';
import { getDrawings, deleteDrawing } from './firebase';

interface ReviewDrawingsProps {
    user: string;
}

const ReviewDrawings: React.FC<ReviewDrawingsProps> = ({ user }) => {
    const [drawings, setDrawings] = useState<string[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const fetchDrawings = async () => {
            const savedDrawings = await getDrawings(user);
            setDrawings(savedDrawings);
        };

        if (user) {
            fetchDrawings();
        }
    }, [user]);

    const handleDeleteDrawing = async (drawing: string) => {
        await deleteDrawing(user, drawing);
        setDrawings(drawings.filter(d => d !== drawing));
    };

    const handleScrollLeft = () => {
        setScrollPosition(prev => Math.max(prev - 300, 0));
    };

    const handleScrollRight = () => {
        setScrollPosition(prev => Math.min(prev + 300, (drawings.length - 1) * 100));
    };

    return (
        <div className="flex flex-col items-center mt-4">
            <h2 className="text-xl mb-4">Your Saved Drawings</h2>
            <div className="relative w-full">
                <button onClick={handleScrollLeft} className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-500 text-white rounded z-10">
                    &lt;
                </button>
                <div className="overflow-x-auto w-full">
                    <div className="flex" style={{ transform: `translateX(-${scrollPosition}px)` }}>
                        {drawings.map((drawing, index) => (
                            <div key={index} className="flex flex-col items-center mx-2">
                                <img src={drawing} alt={`Drawing ${index + 1}`} className="w-24 h-24 border border-gray-300" />
                                <button onClick={() => handleDeleteDrawing(drawing)} className="mt-2 p-1 bg-red-500 text-white rounded">Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={handleScrollRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-gray-500 text-white rounded z-10">
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default ReviewDrawings;
