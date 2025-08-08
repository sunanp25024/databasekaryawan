import React from 'react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Logo dengan animasi berputar */}
      <div className="mb-8">
        <img 
          src="/swapro-logo.webp" 
          alt="SWAPRO Logo" 
          className="w-24 h-24 animate-spin"
          style={{
            animationDuration: '2s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite'
          }}
        />
      </div>
      
      {/* Teks loading */}
      <div className="text-center">
        <p className="text-gray-600 text-lg font-medium">
          <span className="animate-pulse">Memuat halaman</span>
          <span className="inline-block animate-bounce ml-1">...</span>
        </p>
      </div>
    </div>
  );
}