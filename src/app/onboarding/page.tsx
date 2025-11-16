'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { ONBOARDING_STEPS } from '@/lib/constants';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(0);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/upload');
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    router.push('/upload');
  };

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6A00FF]/20 via-black to-[#C77DFF]/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6A00FF]/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C77DFF]/20 rounded-full blur-[120px] animate-pulse" />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Skip button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Pular introdução
          </button>
        </div>

        {/* Content card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 text-center">
          {/* Icon */}
          <div className="text-8xl mb-8 animate-bounce">
            {step.icon}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {step.title}
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-400 mb-12 max-w-lg mx-auto">
            {step.description}
          </p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {ONBOARDING_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                currentStep === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#6A00FF] to-[#C77DFF] text-white rounded-full font-semibold hover:shadow-2xl hover:shadow-[#6A00FF]/50 transition-all duration-300 hover:scale-105"
            >
              {currentStep === ONBOARDING_STEPS.length - 1 ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  Começar Agora
                </>
              ) : (
                <>
                  Próximo
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step counter */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          {currentStep + 1} de {ONBOARDING_STEPS.length}
        </div>
      </div>
    </div>
  );
}
