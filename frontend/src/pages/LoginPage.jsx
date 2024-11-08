import React, { useState } from 'react';
import { toast } from 'react-toastify';
import fetchAxios from 'utils/axios'; // Assuming your Axios instance is here
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { login } from 'store/reducer/user';// Adjust the path to your user slice

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Initialize dispatch

    // Handle form input change
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const identifier = formData.get('username'); // Ensure this matches your form input name
        const password = formData.get('password');
    
        // Make sure you send the correct payload
        const payload = { identifier, password };
    
        try {
            const response = await fetchAxios.post('/auth/login', payload);
            toast.info(response.data.message);

            // Dispatch login action with user data
            const { token, expire, userId, username } = response.data;
            console.log('response data', response.data); // Get userId and username from response
            dispatch(login({ userId, username, token, expire })); // Dispatch action to store user data

            navigate('/'); 
        } catch (error) {
            toast.error(error.response.data.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-400">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;