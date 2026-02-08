"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Sparkles } from "lucide-react";

type WelcomeMessageProps = {
  userName: string;
  onComplete: () => void;
};

export default function WelcomeMessage({ userName, onComplete }: WelcomeMessageProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setShow(true), 100);

    // Auto-close after 3 seconds
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className={`mx-4 max-w-md transform transition-all duration-300 ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="border border-gray-200 bg-white p-8 shadow-2xl">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <Sparkles className="absolute -right-2 -top-2 h-6 w-6 animate-pulse text-yellow-400" />
            </div>
          </div>

          {/* Message */}
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-black uppercase text-gray-900 md:text-3xl">
              Welcome Back!
            </h2>
            <p className="mb-1 text-lg text-gray-700">
              Hello, <span className="font-bold">{userName}</span>
            </p>
            <p className="text-sm text-gray-500">
              You&apos;ve been successfully authenticated
            </p>
          </div>

          {/* Loading Bar */}
          <div className="mt-6">
            <div className="h-1 w-full overflow-hidden bg-gray-200">
              <div className="h-full w-full origin-left animate-[slideRight_3s_ease-in-out] bg-gray-900" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideRight {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}