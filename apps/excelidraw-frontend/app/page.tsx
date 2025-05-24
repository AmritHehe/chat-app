// import Image from "next/image";
"use client"
// import {Button} from "@repo/ui/button"
import {useEffect, useRef } from 'react'
import Header from '../components/Header';
import DoodleButton from '../components/DoodleButton';
import DoodleIcon from '../components/DoodleIcon';
import Link from "next/link";
import { GitHubLogoIcon } from '@repo/ui/Github';
// import { sign } from "crypto";
export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const doodleCanvasRef = useRef<HTMLCanvasElement>(null);

  // Add floating shapes animation
  useEffect(() => {
    const createFloatingShape = () => {
      const shapes = ['circle', 'square', 'triangle', 'star', 'pencil', 'ruler', 'eraser'];
      const colors = ['doodle-purple', 'doodle-blue', 'doodle-green', 'doodle-yellow', 'doodle-orange'];
      
      const shape = document.createElement('div');
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)]; 
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      shape.className = `absolute opacity-20 ${
        randomShape === 'circle' ? 'rounded-full' : 
        randomShape === 'square' ? 'rounded-lg' : 
        randomShape === 'triangle' ? 'triangle' : 
        randomShape === 'pencil' ? 'pencil-shape' : 
        randomShape === 'ruler' ? 'ruler-shape' : 
        randomShape === 'eraser' ? 'eraser-shape' : 
        'star'
      } bg-${randomColor}`;
      
      const size = Math.random() * 40 + 10;
      shape.style.width = `${size}px`;
      shape.style.height = `${size}px`;
      
      // Random position
      shape.style.left = `${Math.random() * 100}vw`;
      shape.style.top = `${Math.random() * 100}vh`;
      
      // Animation duration and delay
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      
      shape.style.animation = `float ${duration}s linear infinite ${delay}s`;
      
      document.getElementById('floating-shapes-container')?.appendChild(shape);
      
      // Remove shape after animation to prevent memory issues
      setTimeout(() => {
        shape.remove();
      }, (duration + delay) * 1000);
    };
    
    // Create initial shapes
    for (let i = 0; i < 25; i++) {
      setTimeout(() => createFloatingShape(), i * 300);
    }
    
    // Add new shapes periodically
    const interval = setInterval(createFloatingShape, 3000);
    return () => clearInterval(interval);
  }, []);

  // Add the hero canvas wireframe visualization - improved version
  useEffect(() => {
    if (!doodleCanvasRef.current) return;
    
    const canvas = doodleCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Resize canvas to match container
    const resizeCanvas = () => {
      if (canvasRef.current && canvas) {
        canvas.width = canvasRef.current.offsetWidth;
        canvas.height = canvasRef.current.offsetHeight;
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Draw a clean wireframe design instead of animated shapes
    const drawWireframe = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid background
      const gridSize = 20;
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.5;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw wireframe elements
      // Header bar
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.8, canvas.height * 0.08);
      
      // Logo
      ctx.fillStyle = '#6c5ce7';
      ctx.fillRect(canvas.width * 0.12, canvas.height * 0.115, canvas.width * 0.06, canvas.height * 0.05);
      
      // Navigation items
      ctx.fillStyle = '#94a3b8';
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(canvas.width * (0.3 + i * 0.12), canvas.height * 0.125, canvas.width * 0.08, canvas.height * 0.03);
      }
      
      // Main content area
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(canvas.width * 0.1, canvas.height * 0.25, canvas.width * 0.8, canvas.height * 0.6);
      
      // Sidebar
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(canvas.width * 0.1, canvas.height * 0.25, canvas.width * 0.2, canvas.height * 0.6);
      
      // Drawing area
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(canvas.width * 0.35, canvas.height * 0.25, canvas.width * 0.5, canvas.height * 0.6);
      
      // Drawing elements
      ctx.strokeStyle = '#6c5ce7';
      ctx.lineWidth = 2;
      
      // Draw a rectangle
      ctx.beginPath();
      ctx.rect(canvas.width * 0.4, canvas.height * 0.35, canvas.width * 0.15, canvas.height * 0.2);
      ctx.stroke();
      
      // Draw a circle
      ctx.beginPath();
      ctx.arc(canvas.width * 0.7, canvas.height * 0.4, canvas.width * 0.08, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw an arrow
      ctx.beginPath();
      ctx.moveTo(canvas.width * 0.5, canvas.height * 0.65);
      ctx.lineTo(canvas.width * 0.7, canvas.height * 0.65);
      ctx.lineTo(canvas.width * 0.65, canvas.height * 0.6);
      ctx.moveTo(canvas.width * 0.7, canvas.height * 0.65);
      ctx.lineTo(canvas.width * 0.65, canvas.height * 0.7);
      ctx.stroke();
      
      // Draw toolbar items on sidebar
      const toolbarItems = 6;
      ctx.fillStyle = '#cbd5e1';
      for (let i = 0; i < toolbarItems; i++) {
        ctx.fillRect(canvas.width * 0.13, canvas.height * (0.3 + i * 0.08), canvas.width * 0.14, canvas.height * 0.05);
      }
    };
    
    // Draw the wireframe once, no animation
    drawWireframe();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  return (
    // <div>

    //   <section className="relative min-h-screen pt-20 flex flex-col justify-center overflow-hidden">
    //   {/* Background blobs */}
    //   <div className="absolute inset-0 overflow-hidden -z-10">
    //     <div className="bg-blob absolute w-[40rem] h-[40rem] rounded-full bg-purple-200 dark:bg-purple-900/20 filter blur-3xl opacity-30 dark:opacity-20 top-[10%] -left-[10%]"></div>
    //     <div className="bg-blob absolute w-[30rem] h-[30rem] rounded-full bg-blue-200 dark:bg-blue-900/20 filter blur-3xl opacity-20 dark:opacity-10 bottom-[10%] -right-[10%]"></div>
    //   </div>

    //   <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
    //     <div className="md:w-1/2 mb-10 md:mb-0">
    //       <h1 className="hero-text text-5xl md:text-6xl lg:text-7xl font-bold italic mb-6 text-gray-900 dark:text-white">
    //         Create<span className="text-purple-600">.</span> <br />
    //         Collaborate<span className="text-purple-600">.</span> <br />
    //         Innovate<span className="text-purple-600">.</span>
    //       </h1>
    //       <p className="hero-text text-xl text-gray-700 dark:text-gray-300 mb-8">
    //         The most intuitive drawing tool for your creative journey.
    //         Bring your ideas to life with Artisctic.
    //       </p>
    //       <div className="hero-text flex space-x-4">
    //         <Link href={"/signup"}>
    //         <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl px-8 py-4 text-lg">
    //           <span className="italic">Get Started</span>
    //         </Button>
    //         </Link>
    //         <Link href={"/signup"}>
    //         <Button  className="px-8 py-4 rounded-xl text-lg border">
    //           Signin
    //         </Button>
    //         </Link>
    //       </div>
    //     </div>
    //     <div className="md:w-1/2 relative">
    //       <div className="hero-text relative rounded-xl overflow-hidden shadow-2xl shadow-purple-500/20 border border-gray-200 dark:border-gray-700">
    //         <img
    //           src="https://images.unsplash.com/photo-1531297484001-80022131f5a1"
    //           alt="Artisctic App Interface"
    //           className="w-full rounded-xl"
    //         />
    //         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
    //       </div>
    //     </div>
    //   </div>
    // </section>
    // </div>
    <>
     <div className="min-h-screen bg-doodle-paper relative overflow-hidden">
      {/* Floating shapes container */}
      <div id="floating-shapes-container" className="fixed inset-0 pointer-events-none z-0"></div>
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Floating doodles */}
          <div className="absolute top-10 left-10 w-16 h-16 opacity-60">
            <DoodleIcon icon="lightbulb" className="w-full h-full text-doodle-yellow" animated />
          </div>
          <div className="absolute top-20 right-20 w-12 h-12 opacity-60">
            <DoodleIcon icon="shapes" className="w-full h-full text-doodle-blue" />
          </div>
          <div className="absolute bottom-20 left-20 w-14 h-14 opacity-60">
            <DoodleIcon icon="collaboration" className="w-full h-full text-doodle-green" animated />
          </div>
          
          <div className="animate-fade-in-up">
            <h1 className="font-gamja text-6xl md:text-7xl font-bold text-doodle-sketch mb-6">
              Online <span className="text-doodle-purple bg-doodle-light-yellow px-4 py-2 rounded-2xl transform -rotate-2 inline-block">whiteboard</span> made simple
            </h1>
            <p className="font-comic text-xl md:text-2xl text-doodle-light-sketch mb-8 max-w-3xl mx-auto">
              Ideate, Collaborate, Share. Simply with Excelidraw.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/signup">
                <DoodleButton variant="primary" size="lg" className="text-xl">
                  ⭐ Get Started
                </DoodleButton>
              </Link>
            </div>
          </div>

          {/* Whiteboard Preview with Live Animation Canvas */}
          <div className="relative max-w-4xl mx-auto mt-16" ref={canvasRef}>
            <div className="bg-white rounded-3xl p-8 doodle-shadow border-4 border-doodle-purple transform -rotate-1">
              <div className="bg-doodle-paper rounded-2xl p-6 sketch-lines min-h-96 relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-doodle-red rounded-full"></div>
                    <div className="w-3 h-3 bg-doodle-yellow rounded-full"></div>
                    <div className="w-3 h-3 bg-doodle-green rounded-full"></div>
                  </div>
                  <span className="font-comic text-sm text-doodle-light-sketch">Excelidraw canvas</span>
                </div>
                
                {/* Canvas content with static wireframe */}
                <div className="relative w-full h-64">
                  <canvas 
                    ref={doodleCanvasRef} 
                    className="absolute inset-0 w-full h-full z-10"
                  />
                </div>
              </div>
            </div>
            
            {/* Animated pencil drawing */}
            <div className="absolute -right-10 -bottom-10 w-24 h-24 transform rotate-45 animate-bounce-gentle">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M20 80 L80 20 L90 30 L30 90 Z" fill="#FFD700" stroke="#000" strokeWidth="2" />
                <path d="M85 20 L90 30 L80 35 L75 25 Z" fill="#8B4513" stroke="#000" strokeWidth="2" />
                <path d="M20 80 L30 90 L25 93 L15 83 Z" fill="#FF6347" stroke="#000" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-doodle-paper border-t-2 border-b-2 border-doodle-blue/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-gamja text-4xl md:text-5xl font-bold text-doodle-sketch mb-4">
              Say hi to <span className="bg-doodle-light-green px-4 py-2 rounded-2xl">Excelidraw</span>
            </h2>
            <p className="font-comic text-xl text-doodle-light-sketch">Free & Open source</p>
            <p className="font-comic text-lg text-doodle-light-sketch">No account is needed. Just start drawing.</p>
          </div>

          <div className="flex justify-center gap-6 mb-16">
            <DoodleButton variant="primary" size="lg" className="font-gamja">Start drawing</DoodleButton>
            <Link href="https://github.com/excalidraw/excalidraw" target="_blank" rel="noopener noreferrer">
              <DoodleButton variant="outline" size="lg" className="font-gamja">
                <GitHubLogoIcon  /> GitHub Account
              </DoodleButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Create Section */}
      <section id="create" className="py-20 px-4 bg-doodle-paper relative">
        <div className="absolute inset-0 bg-doodle-light-blue/5 z-0"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-doodle-yellow rounded-full flex items-center justify-center">
                  <DoodleIcon icon="lightbulb" className="w-8 h-8" />
                </div>
                <span className="bg-doodle-green text-white px-3 py-1 rounded-full text-sm font-comic">open-source</span>
              </div>
              <h3 className="font-gamja text-4xl font-bold text-doodle-sketch mb-4">Create</h3>
              <p className="font-comic text-lg text-doodle-light-sketch mb-6">
                Simply designed to create perfect results fast. Elementary tools, advanced features and unlimited options with an infinite canvas.
              </p>
              
              {/* Toolbar Preview */}
              <div className="bg-white rounded-2xl p-4 doodle-shadow">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-doodle-purple rounded-lg"></div>
                  <div className="w-8 h-8 bg-doodle-blue rounded-lg"></div>
                  <div className="w-8 h-8 bg-doodle-green rounded-lg"></div>
                  <div className="w-8 h-8 bg-doodle-yellow rounded-lg"></div>
                  <div className="w-8 h-8 bg-doodle-orange rounded-lg"></div>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <span className="font-comic text-sm text-doodle-light-sketch">Stroke</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 doodle-shadow transform rotate-2">
                <div className="bg-doodle-paper rounded-2xl p-8 min-h-64 relative overflow-hidden">
                  {/* Animated drawing effect */}
                  <div className="draw-line-animation absolute top-4 left-4 w-16 h-16 opacity-80"></div>
                  <div className="draw-circle-animation absolute top-16 right-8 w-12 h-12 opacity-80"></div>
                  <div className="draw-rect-animation absolute bottom-8 left-8 w-20 h-8 opacity-80"></div>
                  <div className="draw-star-animation absolute bottom-4 right-4 w-14 h-14 opacity-80"></div>
                </div>
              </div>
              
              {/* Animated drawing hand */}
              <div className="absolute -bottom-10 -left-10 w-24 h-24 z-10 animate-wiggle">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M60 40 C75 25, 85 20, 90 35 C95 50, 85 60, 75 65 L60 75 C50 80, 30 85, 20 70 C10 55, 25 50, 35 45 Z" 
                    fill="#FFE4C4" stroke="#000" strokeWidth="2" />
                  <path d="M35 45 L75 65" fill="none" stroke="#000" strokeWidth="1.5" />
                  <path d="M60 40 L90 35" fill="none" stroke="#000" strokeWidth="1.5" />
                  <circle cx="60" cy="40" r="2" fill="#000" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaborate Section */}
      <section id="collaborate" className="py-20 px-4 bg-doodle-paper relative">
        <div className="absolute inset-0 bg-doodle-light-purple/5 z-0"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-white rounded-3xl p-6 doodle-shadow transform -rotate-2">
                <div className="bg-doodle-light-yellow/30 rounded-2xl p-8 min-h-64 relative">
                  {/* Calendar/Timeline illustration */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div key={i} className={`h-6 rounded ${i % 3 === 0 ? 'bg-doodle-green' : i % 3 === 1 ? 'bg-doodle-blue' : 'bg-doodle-yellow'}`}></div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-doodle-purple rounded w-3/4"></div>
                    <div className="h-4 bg-doodle-orange rounded w-1/2"></div>
                    <div className="h-4 bg-doodle-green rounded w-2/3"></div>
                  </div>
                  
                  {/* Add collaborative mouse pointers */}
                  <div className="absolute top-12 right-16 animate-bounce-gentle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 3L19 12L12 13L9 20L5 3Z" fill="#6c5ce7" stroke="#4834d4" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <div className="absolute bottom-12 left-16 animate-wiggle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 3L19 12L12 13L9 20L5 3Z" fill="#81ecec" stroke="#00cec9" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Animated collaboration icon */}
              <div className="absolute -top-10 -right-10 w-24 h-24 animate-bounce-gentle">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="30" cy="35" r="15" fill="#ff9ff3" stroke="#6c5ce7" strokeWidth="2" />
                  <circle cx="70" cy="35" r="15" fill="#81ecec" stroke="#6c5ce7" strokeWidth="2" />
                  <circle cx="50" cy="75" r="15" fill="#ffeaa7" stroke="#6c5ce7" strokeWidth="2" />
                  <path d="M30 50 L50 60" fill="none" stroke="#6c5ce7" strokeWidth="2" strokeDasharray="5,3" />
                  <path d="M70 50 L50 60" fill="none" stroke="#6c5ce7" strokeWidth="2" strokeDasharray="5,3" />
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-doodle-orange rounded-full flex items-center justify-center">
                  <DoodleIcon icon="collaboration" className="w-8 h-8" />
                </div>
                <span className="bg-doodle-blue text-white px-3 py-1 rounded-full text-sm font-comic">easy to use</span>
              </div>
              <h3 className="font-gamja text-4xl font-bold text-doodle-sketch mb-4">Collaborate</h3>
              <p className="font-comic text-lg text-doodle-light-sketch mb-6">
                Send link, get feedback and finish the idea together.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-doodle-yellow rounded-full flex items-center justify-center">
                    <span className="text-xs">✨</span>
                  </div>
                  <span className="font-comic text-doodle-sketch">Easy to use - Zero learning curve</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-doodle-green rounded-full flex items-center justify-center">
                    <span className="text-xs">📚</span>
                  </div>
                  <span className="font-comic text-doodle-sketch">Libraries - Ready-to-use sketches</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-doodle-purple rounded-full flex items-center justify-center">
                    <span className="text-xs">🤖</span>
                  </div>
                  <span className="font-comic text-doodle-sketch">{`Generative AI - It's dead simple`}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Use Cases */}
      <section className="py-20 px-4 bg-doodle-paper relative">
        <div className="absolute inset-0 bg-doodle-light-green/5 z-0"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-doodle-sketch rounded-full flex items-center justify-center">
              <span className="text-white">⚡</span>
            </div>
            <span className="bg-doodle-yellow text-doodle-sketch px-3 py-1 rounded-full text-sm font-comic">real-time collaboration</span>
          </div>
          
          <h3 className="font-gamja text-4xl font-bold text-doodle-sketch mb-4">Common usecases</h3>
          <p className="font-comic text-lg text-doodle-light-sketch mb-12">
            Meetings, Brainstorming, Diagrams, Interviews, Quick wireframing and more ...
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Wireframing", color: "bg-doodle-light-green", icon: "📱", examples: ["boxes", "interface"] },
              { title: "Diagrams", color: "bg-doodle-light-blue", icon: "📊", examples: ["flow", "connections"] },
              { title: "Brainstorming", color: "bg-doodle-light-yellow", icon: "💡", examples: ["ideas", "mindmap"] }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-3xl p-6 doodle-shadow hover:scale-105 transition-transform">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mb-4 mx-auto`}>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h4 className="font-gamja text-xl font-bold text-doodle-sketch mb-2">{item.title}</h4>
                <div className="h-32 bg-doodle-paper rounded-xl border-2 border-doodle-blue/20 p-4">
                  <div className="grid grid-cols-2 gap-2 h-full">
                    <div className="bg-doodle-light-blue rounded"></div>
                    <div className="bg-doodle-light-green rounded"></div>
                    <div className="bg-doodle-light-yellow rounded col-span-2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-doodle-paper relative">
        <div className="absolute inset-0 bg-doodle-cream/50 z-0"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h3 className="font-gamja text-4xl font-bold text-doodle-sketch mb-6">
            The easiest way to get your thoughts on screen
          </h3>
          <p className="font-comic text-lg text-doodle-light-sketch mb-8">
            Quick drawings and mockups with a unique aesthetic. Its dead simple. We help you with intuitive shortcuts & command palette.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <DoodleButton variant="primary" size="lg" className="font-gamja">Draw now</DoodleButton>
            </Link>
            <Link href="https://github.com/excalidraw/excalidraw" target="_blank" rel="noopener noreferrer">
              <DoodleButton variant="outline" size="lg" className="font-gamja">
                <GitHubLogoIcon /> GitHub
              </DoodleButton>
            </Link>
          </div>
        </div>
        
        {/* Animated pencil doodle */}
        <div className="absolute bottom-10 left-10 w-20 h-20 transform rotate-12 animate-wiggle">
          <svg viewBox="0 0 100 100">
            <path d="M30 70 L70 30 L80 40 L40 80 Z" fill="#ffeaa7" stroke="#6c5ce7" strokeWidth="2" />
            <path d="M75 30 L80 40 L70 45 L65 35 Z" fill="#e17055" stroke="#6c5ce7" strokeWidth="2" />
            <path d="M30 70 L40 80 L35 83 L25 73 Z" fill="#ff7675" stroke="#6c5ce7" strokeWidth="2" />
          </svg>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-doodle-sketch text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <div className="w-10 h-10 bg-doodle-purple rounded-lg flex items-center justify-center transform rotate-12 mr-3">
              <span className="text-white font-gamja font-bold text-xl">E</span>
            </div>
            <span className="font-gamja font-bold text-2xl">EXCELIDRAW</span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="font-gamja font-bold text-lg mb-4">Explore</h4>
              <div className="space-y-2">
                <p className="font-comic">Blog</p>
                <p className="font-comic">Libraries</p>
                <p className="font-comic">Community</p>
              </div>
            </div>
            <div>
              <h4 className="font-gamja font-bold text-lg mb-4">Product</h4>
              <div className="space-y-2">
                <p className="font-comic">How to start</p>
                <p className="font-comic">Features</p>
                <p className="font-comic">For Teams</p>
              </div>
            </div>
            <div>
              <h4 className="font-gamja font-bold text-lg mb-4">Contact us</h4>
              <div className="space-y-2">
                <p className="font-comic">support@excelidraw.com</p>
                <p className="font-comic">Privacy Policy</p>
                <p className="font-comic">Terms of use</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
