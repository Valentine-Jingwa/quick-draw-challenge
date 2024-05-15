import { useRef, useState, useEffect, MouseEvent, ChangeEvent } from 'react';

interface DrawCanvasProps {
    prompt: string;
    onSubmit: (dataURL: string) => void;
    canvasType: string;
    canvasSize: number;
}

const DrawCanvas: React.FC<DrawCanvasProps> = ({ prompt, onSubmit, canvasType, canvasSize }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('black');
    const [brushSize, setBrushSize] = useState(5);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                if (canvasType === 'whiteboard') {
                    context.fillStyle = 'white';
                } else if (canvasType === 'blackboard') {
                    context.fillStyle = 'black';
                }
                context.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, [prompt, canvasType]);

    const startDrawing = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
        const { offsetX, offsetY } = nativeEvent;
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                context.strokeStyle = color;
                context.lineWidth = brushSize;
                context.lineCap = 'round';
                context.beginPath();
                context.moveTo(offsetX, offsetY);
                setIsDrawing(true);
            }
        }
    };

    const draw = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                context.lineTo(offsetX, offsetY);
                context.stroke();
            }
        }
    };

    const endDrawing = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                context.closePath();
                setIsDrawing(false);
            }
        }
    };

    const handleSubmit = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            onSubmit(canvas.toDataURL());
        }
    };

    return (
        <div className="flex flex-col items-center">
            <canvas
                ref={canvasRef}
                width={canvasSize}
                height={canvasSize}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                className="border border-black"
            />
            <div className="mt-4 flex items-center space-x-4">
                <label>
                    Color:
                    <input
                        type="color"
                        value={color}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setColor(e.target.value)}
                        className="ml-2"
                    />
                </label>
                <label>
                    Brush Size:
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={brushSize}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setBrushSize(parseInt(e.target.value))}
                        className="ml-2"
                    />
                </label>
            </div>
            <button onClick={handleSubmit} className="mt-2 p-2 bg-blue-500 text-white rounded">
                Submit
            </button>
        </div>
    );
};

export default DrawCanvas;
