import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f1115] p-4 text-white">
      <div className="mb-8 absolute top-6 left-6">
        <Link to="/" className="text-sm text-emerald-500 hover:text-emerald-400 font-medium">
          ← Back to Home
        </Link>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
          Sign Up for Herb-Blockchain
        </h1>
        <p className="text-gray-400 mt-2">Farmer-friendly Auth (OTP supported)</p>
      </div>
      <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
        <SignUp routing="path" path="/sign-up" signInUrl="/login" />
      </div>
    </div>
  );
};

export default SignUpPage;
