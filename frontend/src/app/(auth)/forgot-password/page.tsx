import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forgot Password - Smart Therapy',
  description: 'Reset password for the Indonesian AI Hypnotherapy system',
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Forgot Password
        </h1>
        <p className="text-gray-600 mb-8">
          Password reset page will be implemented in the next task.
        </p>
        <a 
          href="/login" 
          className="text-blue-600 hover:text-blue-500 font-medium"
        >
          ← Back to login page
        </a>
      </div>
    </div>
  );
}