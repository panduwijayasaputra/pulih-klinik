import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'nama@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        // This is a placeholder for the actual authentication logic
        // In the real implementation, this would:
        // 1. Validate credentials against the database
        // 2. Verify therapist license
        // 3. Return user object if valid
        
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Placeholder validation - to be replaced with real database check
        if (credentials.email === 'terapis@example.com' && credentials.password === 'password') {
          return {
            id: '1',
            email: credentials.email,
            name: 'Dr. Terapis Example',
            role: 'therapist',
            licenseNumber: 'HIP-001-2024',
            isVerified: true,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7200, // 2 hours (7200 seconds)
  },
  jwt: {
    maxAge: 7200, // 2 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.licenseNumber = user.licenseNumber;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.licenseNumber = token.licenseNumber as string;
        session.user.isVerified = token.isVerified as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/masuk',
    error: '/masuk',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
};