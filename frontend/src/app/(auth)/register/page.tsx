import { Metadata } from 'next';
import { CustomLink } from '@/components/ui/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Register - Smart Therapy',
  description: 'Register as a licensed Indonesian therapist to start using Smart Therapy.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">ST</span>
            </div>
            <span className="text-2xl font-semibold text-gray-900">Smart Therapy</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Join Smart Therapy
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Register as a licensed Indonesian therapist
          </p>
        </div>

        {/* Registration Form */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create New Account</CardTitle>
            <CardDescription className="text-center">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              Registration form will be implemented
            </div>
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <CustomLink 
              href="/login" 
              variant="link" 
              className="font-medium text-purple-600 hover:text-purple-500 p-0 h-auto"
            >
              Sign in here
            </CustomLink>
          </p>
        </div>

        {/* Terms and Privacy */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By registering, you agree to our{' '}
            <a href="#" className="text-purple-600 hover:text-purple-500">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-purple-600 hover:text-purple-500">
              Privacy Policy
            </a>{' '}
            .
          </p>
        </div>
      </div>
    </div>
  );
}