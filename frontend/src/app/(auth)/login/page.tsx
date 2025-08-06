import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Login - Smart Therapy',
  description: 'Login to the Indonesian AI Hypnotherapy system for licensed therapists',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ST</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Smart Therapy</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Login to the AI Hypnotherapy system for licensed Indonesian therapists
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center text-gray-900">
              Sign In to Your Account
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Use your registered email and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Login form will be implemented
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
            <SparklesIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-gray-900 mb-1">AI Recommendations</h3>
            <p className="text-xs text-gray-600">
              Get accurate hypnotherapy technique recommendations
            </p>
          </div>
          <div className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm">
            <ShieldCheckIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-gray-900 mb-1">Secure & Trusted</h3>
            <p className="text-xs text-gray-600">
              Client data encrypted with high security standards
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          © 2025 Smart Therapy. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}