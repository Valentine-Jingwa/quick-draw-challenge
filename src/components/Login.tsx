import { useState } from 'react';
import { saveUsername, getUsername } from './firebase';

interface LoginProps {
    setUser: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
    const [username, setUsername] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulating user ID generation for demonstration purposes
        const userId = username; // This should ideally be a unique identifier
        await saveUsername(userId, username);
        const savedUsername = await getUsername(userId);

        if (savedUsername) {
            setUser(savedUsername);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-xl mb-4">Enter Username</h2>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="p-2 border border-gray-300 rounded mb-4"
                    required
                />
                <button
                    type="submit"
                    className="p-2 bg-blue-500 text-white rounded"
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;
