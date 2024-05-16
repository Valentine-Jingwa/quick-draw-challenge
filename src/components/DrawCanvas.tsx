import { useRef, useState, useEffect, MouseEvent, ChangeEvent } from 'react';
import type { TouchEvent } from 'react';

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
                context.fillStyle = canvasType === 'whiteboard' ? 'white' : 'black';
                context.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    }, [prompt, canvasType]);

    const startDrawing = (event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
        const { offsetX, offsetY } = getEventCoordinates(event);
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

    const draw = (event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getEventCoordinates(event);
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
        setIsDrawing(false);
    };

    const getEventCoordinates = (event: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
        if ('touches' in event) {
            const touch = event.touches[0];
            const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
            return {
                offsetX: touch.clientX - rect.left,
                offsetY: touch.clientY - rect.top,
            };
        } else {
            const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
            const nativeEvent = (event as any).nativeEvent as MouseEvent;
            return {
                offsetX: nativeEvent.clientX - rect.left,
                offsetY: nativeEvent.clientY - rect.top,
            };
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
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={endDrawing}
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
