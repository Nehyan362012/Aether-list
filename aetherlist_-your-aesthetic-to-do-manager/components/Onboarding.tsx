import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, TagIcon, CalendarIcon, ClockIcon } from './Icons';

// --- Visual Components for Slides ---
const VisualCategories = ({ isVisible }: { isVisible: boolean }) => (
  <div className="w-60 h-60 flex flex-col justify-center items-center space-y-4">
    <div className={`flex items-center w-full transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '100ms' }}>
      <div className="w-1/4 h-8 bg-green-500 rounded-lg shadow-md" />
      <div className="w-3/4 h-6 ml-3 bg-accent rounded-md" />
    </div>
    <div className={`flex items-center w-full transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '250ms' }}>
      <div className="w-1/3 h-8 bg-blue-500 rounded-lg shadow-md" />
      <div className="w-2/3 h-6 ml-3 bg-accent rounded-md" />
    </div>
    <div className={`flex items-center w-full transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '400ms' }}>
      <div className="w-1/2 h-8 bg-pink-500 rounded-lg shadow-md" />
      <div className="w-1/2 h-6 ml-3 bg-accent rounded-md" />
    </div>
  </div>
);

const VisualDeadlines = ({ isVisible }: { isVisible: boolean }) => (
  <div className="w-60 h-60 flex justify-center items-center space-x-4">
    {/* Calendar */}
    <div className={`grid grid-cols-7 gap-1 p-3 bg-accent rounded-lg transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{ transitionDelay: '100ms' }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} className={`w-5 h-5 rounded ${i === 10 ? 'bg-highlight' : 'bg-secondary'}`} />
      ))}
    </div>
    {/* Clock */}
    <div className={`relative w-24 h-24 bg-accent rounded-full flex justify-center items-center transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} style={{ transitionDelay: '250ms' }}>
      <div className="absolute w-1 h-8 bg-light rounded-full top-4 left-1/2 -ml-0.5" style={{ transform: `rotate(${isVisible ? '45deg' : '0deg'})`, transformOrigin: 'bottom', transition: 'transform 1s .5s' }} />
      <div className="absolute w-1 h-10 bg-light rounded-full top-2 left-1/2 -ml-0.5" style={{ transform: `rotate(${isVisible ? '180deg' : '0deg'})`, transformOrigin: 'bottom', transition: 'transform 1s .7s' }} />
      <div className="w-2 h-2 bg-highlight rounded-full z-10" />
    </div>
  </div>
);

const VisualReminders = ({ isVisible }: { isVisible: boolean }) => (
  <div className="w-60 h-60 flex justify-center items-center">
    <div className={`relative transition-transform duration-500 ${isVisible ? 'scale-100' : 'scale-0'}`}>
      <ClockIcon className="w-24 h-24 text-highlight" />
      {/* Waves */}
      <div className={`absolute inset-0 rounded-full border-2 border-highlight ${isVisible ? 'animate-ping' : ''}`} style={{ animationDuration: '1.5s' }} />
      <div className={`absolute inset-0 rounded-full border-2 border-highlight ${isVisible ? 'animate-ping' : ''}`} style={{ animationDelay: '0.5s', animationDuration: '1.5s' }} />
    </div>
  </div>
);

const onboardingSlides = [
  {
    icon: <TagIcon className="w-20 h-20 text-highlight" />,
    title: 'Organize with Categories',
    description: 'Create custom, color-coded categories to sort your tasks and keep your life perfectly organized.',
    visual: VisualCategories,
  },
  {
    icon: <CalendarIcon className="w-20 h-20 text-highlight" />,
    title: 'Never Miss a Deadline',
    description: 'Set due dates and times for your tasks. AetherList helps you stay on track and meet your goals.',
    visual: VisualDeadlines,
  },
  {
    icon: <ClockIcon className="w-20 h-20 text-highlight" />,
    title: 'Get Timely Reminders',
    description: 'Enable reminders for important tasks and get notified exactly when you need to.',
    visual: VisualReminders,
  },
];

interface OnboardingProps {
  onComplete: () => void;
  audioPlayer: { playNavigate: () => void; };
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, audioPlayer }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlideVisible, setIsSlideVisible] = useState(false);

  useEffect(() => {
    setIsSlideVisible(false);
    const timer = setTimeout(() => setIsSlideVisible(true), 100);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      audioPlayer.playNavigate();
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      audioPlayer.playNavigate();
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const slide = onboardingSlides[currentSlide];
  const VisualComponent = slide.visual;

  return (
    <div className="min-h-screen bg-primary flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-4xl bg-secondary rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 h-80 md:h-auto relative flex justify-center items-center bg-primary overflow-hidden">
          <VisualComponent isVisible={isSlideVisible} />
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center text-center">
            <div className="mb-6">{slide.icon}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-light mb-4">{slide.title}</h1>
            <p className="text-gray-300 mb-8 max-w-sm">{slide.description}</p>
            
            <div className="flex justify-center items-center w-full mb-8">
              {onboardingSlides.map((_, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full mx-1.5 transition-all duration-300 ${
                    currentSlide === index ? 'bg-highlight scale-125' : 'bg-accent'
                  }`}
                />
              ))}
            </div>

            <div className="flex w-full justify-between items-center">
                <button onClick={prevSlide} className="p-3 rounded-full hover:bg-accent disabled:opacity-50 transition-all transform hover:scale-110" disabled={currentSlide === 0}>
                    <ChevronLeftIcon className="w-6 h-6 text-light"/>
                </button>
                {currentSlide < onboardingSlides.length - 1 ? (
                     <button onClick={nextSlide} className="px-8 py-3 bg-highlight text-white font-semibold rounded-lg hover:bg-violet-500 transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl">
                        Next
                     </button>
                ) : (
                    <button onClick={onComplete} className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400 transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-xl">
                        Get Started
                    </button>
                )}
                <button onClick={nextSlide} className="p-3 rounded-full hover:bg-accent disabled:opacity-50 transition-all transform hover:scale-110" disabled={currentSlide === onboardingSlides.length - 1}>
                    <ChevronRightIcon className="w-6 h-6 text-light"/>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;