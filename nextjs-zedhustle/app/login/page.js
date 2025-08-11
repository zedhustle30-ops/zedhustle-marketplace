'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Authentication service disconnected. This is a demo version.');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6">Login</h2>
        <p className="text-orange-600 mb-4 bg-orange-50 p-3 rounded">
          🔒 Authentication service is currently disconnected
        </p>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="w-full p-3 mb-4 border border-gray-300 rounded-md" 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="w-full p-3 mb-6 border border-gray-300 rounded-md" 
        />
        <button 
          type="submit" 
          className="w-full bg-gray-400 text-white py-3 rounded-md cursor-not-allowed" 
          disabled
        >
          Login (Disabled)
        </button>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
        <p className="mt-4 text-center text-gray-500 text-sm">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </p>
      </form>
    </main>
  );
}

