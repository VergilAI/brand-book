'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, FileText, Video, FileImage, FileSpreadsheet, Presentation, BookOpen, Globe, Users, User, BarChart3, HardHat, FileCheck, TrendingUp, DollarSign, Shield, Award, UserCheck, Zap, ArrowRight } from 'lucide-react'
import { GraphConstellationPersistent } from '@/components/vergil/graph-constellation-persistent'

interface ContentCard {
  icon: React.ComponentType<any>
  title: string
  description: string
  category: 'premade' | 'content'
}

const premadeContent: ContentCard[] = [
  {
    icon: Shield,
    title: 'Phishing Awareness',
    description: 'Learn to identify and prevent phishing attacks',
    category: 'premade'
  },
  {
    icon: Users,
    title: 'Advanced AI Usage',
    description: 'Maximize productivity with AI tools',
    category: 'premade'
  },
  {
    icon: Award,
    title: 'Fraud Prevention',
    description: 'Detect and prevent fraudulent activities',
    category: 'premade'
  }
]

const userContent: ContentCard[] = [
  {
    icon: Globe,
    title: 'Google Drive',
    description: 'Import documents and files',
    category: 'content'
  },
  {
    icon: FileText,
    title: 'Outlook Drive',
    description: 'Sync email and documents',
    category: 'content'
  },
  {
    icon: FileText,
    title: 'PDF',
    description: 'Upload PDF documents',
    category: 'content'
  },
  {
    icon: Video,
    title: 'Video',
    description: 'Import video content',
    category: 'content'
  },
  {
    icon: FileText,
    title: 'Docx',
    description: 'Word documents',
    category: 'content'
  },
  {
    icon: Presentation,
    title: 'PowerPoint',
    description: 'Presentation slides',
    category: 'content'
  }
]

// Load staged graph data
const loadCarouselGraphData = async () => {
  try {
    const response = await fetch('/data/carousel-graph-staged.json')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to load carousel graph data:', error)
    return null
  }
}


const journeySteps = [
  { title: 'Upload Content', description: 'Choose your materials' },
  { title: 'Generate Knowledge Graph', description: 'AI analyzes and connects concepts' },
  { title: 'Create Courses', description: 'Automated course generation' },
  { title: 'Learn & Progress', description: 'Interactive learning experience' },
  { title: 'Track Analytics', description: 'Monitor learning outcomes' },
  { title: 'Generate Reports', description: 'Compliance and insights' }
]

export function UserJourneyCarousel() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showGraph, setShowGraph] = useState(false)
  const [graphReady, setGraphReady] = useState(false)
  const [graphKey, setGraphKey] = useState(0)
  const [showCourses, setShowCourses] = useState(false)
  const [showLearning, setShowLearning] = useState(false)
  const [activeModule, setActiveModule] = useState<number | null>(null)
  const [graphData, setGraphData] = useState<any>(null)
  const [currentStage, setCurrentStage] = useState(0)
  const [windowDimensions, setWindowDimensions] = useState({ width: 1200, height: 800 })

  // Load graph data on component mount
  useEffect(() => {
    loadCarouselGraphData().then(data => {
      if (data) {
        setGraphData(data)
      }
    })
  }, [])

  // Handle window resize for graph dimensions
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        })
      }
    }

    // Set initial dimensions
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Ensure graph is shown when on appropriate steps
  useEffect(() => {
    if ((currentStep === 1 || currentStep === 2 || currentStep === 3) && graphData && !showGraph) {
      // If we're on a step that should show the graph but it's not showing, initialize it
      setShowGraph(true)
      setGraphReady(true)
      setGraphKey(prev => prev + 1)
    }
  }, [currentStep, graphData, showGraph])

  // Prevent scrolling past this section until carousel is completed
  useEffect(() => {
    let carouselBottom = 0
    
    const updateCarouselPosition = () => {
      const carouselSection = document.querySelector('[data-carousel-section]')
      if (carouselSection) {
        const rect = carouselSection.getBoundingClientRect()
        carouselBottom = window.scrollY + rect.bottom
      }
    }

    const handleScroll = () => {
      if (currentStep < journeySteps.length - 1) {
        updateCarouselPosition()
        
        // If user tries to scroll past the bottom of the carousel
        if (window.scrollY > carouselBottom - window.innerHeight) {
          window.scrollTo({
            top: carouselBottom - window.innerHeight,
            behavior: 'auto'
          })
        }
      }
    }

    const handleWheel = (e: WheelEvent) => {
      if (currentStep < journeySteps.length - 1) {
        updateCarouselPosition()
        
        // Only prevent scrolling down past the carousel
        if (e.deltaY > 0 && window.scrollY >= carouselBottom - window.innerHeight) {
          e.preventDefault()
        }
      }
    }

    if (currentStep < journeySteps.length - 1) {
      // Initial position calculation
      updateCarouselPosition()
      
      // Add event listeners
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('wheel', handleWheel, { passive: false })
      window.addEventListener('touchmove', handleScroll, { passive: true })
      
      // Add visual indicator
      document.body.classList.add('carousel-active')
    } else {
      document.body.classList.remove('carousel-active')
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchmove', handleScroll)
      document.body.classList.remove('carousel-active')
    }
  }, [currentStep])

  const handleNext = () => {
    if (currentStep === 0) {
      // On first step, move to step 1 first, then initialize graph after slide transition
      setCurrentStep(1)
      setIsGenerating(true)
      
      // Wait for slide transition to complete, then initialize graph
      setTimeout(() => {
        setShowGraph(true)
        setCurrentStage(0) // Start with stage 0
        setGraphKey(prev => prev + 1)
        
        // Reduce initialization time for faster response
        setTimeout(() => {
          setGraphReady(true)
          setIsGenerating(false)
        }, 300) // Quick initialization
      }, 1000) // Wait for slide transition (reduced from 1200ms)
    } else if (currentStep < journeySteps.length - 1) {
      if (currentStep === 1) {
        // Moving to step 2, delay course animations and graph movement
        setCurrentStep(2)
        // Graph movement is now handled by CSS transitions
        setTimeout(() => {
          setShowCourses(true)
        }, 500) // Wait for slide transition to complete
      } else if (currentStep === 2) {
        // Moving to step 3 (Learn & Progress) - trigger stage 1 animation
        setCurrentStep(3)
        setCurrentStage(1) // Progress to stage 1
        setTimeout(() => {
          setShowLearning(true)
          // Highlight first module after UI loads
          setTimeout(() => {
            setActiveModule(0)
          }, 1000)
        }, 500)
      } else {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      if (currentStep === 1) {
        // Going back from step 1 to step 0, reset graph state
        setShowGraph(false)
        setGraphReady(false)
        setCurrentStage(0)
      } else if (currentStep === 2) {
        // Going back from step 2 to step 1, ensure graph is visible
        setShowCourses(false)
        // Make sure graph is still visible when going back
        if (!showGraph) {
          setShowGraph(true)
          setGraphReady(true)
        }
      } else if (currentStep === 3) {
        // Going back from step 3, reset learning state and go back to stage 0
        setShowLearning(false)
        setActiveModule(null)
        setCurrentStage(0)
      }
    }
  }


  const renderSlide = () => {
    switch (currentStep) {
      case 0:
      case 1:
      case 2:
        return (
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Content Upload Slide */}
            <div 
              className={`max-w-5xl mx-auto w-full transition-all duration-1000 ease-in-out ${
                currentStep >= 1 ? 'transform -translate-x-full opacity-0' : 'transform translate-x-0 opacity-100'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Pre-made Courses */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-deep-space text-center">
                    Pre-made Vergil Courses
                  </h3>
                  <div className="grid gap-3">
                    {premadeContent.map((item, index) => (
                      <div
                        key={`premade-${index}`}
                        className="bg-white rounded-lg p-4 md:p-5 border border-mist-gray hover:border-cosmic-purple/30 transition-all duration-300 group hover:scale-105"
                        style={{ boxShadow: 'none' }}
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-cosmic-purple to-electric-violet flex items-center justify-center">
                            <item.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-deep-space text-sm md:text-base">{item.title}</h4>
                            <p className="text-xs md:text-sm text-stone-gray">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Your Content */}
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-display font-bold text-deep-space text-center">
                    Your Content
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {userContent.map((item, index) => (
                      <div
                        key={`content-${index}`}
                        className="bg-white rounded-lg p-3 md:p-4 border border-mist-gray hover:border-phosphor-cyan/30 transition-all duration-300 group hover:scale-105"
                        style={{ boxShadow: 'none' }}
                      >
                        <div className="flex flex-col items-center text-center gap-2 md:gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-phosphor-cyan to-synaptic-blue flex items-center justify-center">
                            <item.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-deep-space text-xs md:text-sm">{item.title}</h4>
                            <p className="text-xs text-stone-gray hidden md:block">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 1 Content (Your Materials) positioned off-screen initially */}
            <div 
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                currentStep === 1 ? 'transform translate-x-0 opacity-100' : 
                currentStep === 2 || currentStep === 3 ? 'transform -translate-x-full opacity-0' :
                'transform translate-x-full opacity-0'
              }`}
              style={{ zIndex: currentStep === 1 ? 20 : currentStep === 2 || currentStep === 3 ? 25 : 1 }}
            >
              <div className="w-full h-full flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full max-w-6xl mx-auto relative">
                  {/* Arrow between columns */}
                  <div 
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-700 hidden lg:flex items-center justify-center ${
                      currentStep === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                    }`}
                    style={{ transitionDelay: currentStep === 1 ? '1200ms' : '0ms' }}
                  >
                    <ArrowRight className="w-8 h-8 text-cosmic-purple animate-pulse" />
                  </div>
                  
                  {/* Left Side - Animated Content */}
                  <div className="space-y-4">
                    <h3 
                      className={`text-lg md:text-xl font-display font-bold text-deep-space transition-all duration-700 ${
                        currentStep === 1 ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-y-4'
                      }`}
                      style={{ transitionDelay: currentStep === 1 ? '500ms' : '0ms' }}
                    >
                      Your Materials
                    </h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {[...premadeContent.slice(0, 2), ...userContent.slice(0, 4)].map((item, index) => (
                        <div
                          key={`materials-${index}`}
                          className={`bg-white rounded-lg p-3 border border-mist-gray transition-all duration-700 ${
                            currentStep === 1 ? 'opacity-80 transform translate-x-0 scale-90' : 
                            'opacity-0 transform translate-x-8'
                          }`}
                          style={{ 
                            boxShadow: 'none',
                            transitionDelay: currentStep === 1 ? `${600 + index * 100}ms` : '0ms'
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-md bg-gradient-to-br from-cosmic-purple to-electric-violet flex items-center justify-center">
                              <item.icon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-deep-space text-xs md:text-sm">{item.title}</h4>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Side - Knowledge Graph slides in */}
                  <div 
                    className={`flex flex-col min-h-0 transition-all duration-700 ${
                      currentStep === 1 ? 'opacity-100 transform translate-x-0' : 
                      currentStep === 2 ? 'opacity-0 transform -translate-x-12' :
                      'opacity-0 transform translate-x-12'
                    }`}
                    style={{ transitionDelay: currentStep === 1 ? '800ms' : '0ms' }}
                  >
                    {/* Knowledge Graph header */}
                    <h3 className="text-lg md:text-xl font-display font-bold text-deep-space mb-3">
                      Knowledge Graph
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Generate Courses - Only visible on slide 2 */}
            <div 
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                currentStep === 2 ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'
              }`}
              style={{ zIndex: currentStep === 2 ? 20 : 1 }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full max-w-6xl mx-auto">
              {/* Left Side - Knowledge Graph (moved from right) */}
              <div 
                className={`flex flex-col space-y-3 transition-all duration-700 ${
                  currentStep === 2 ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-12'
                }`}
                style={{ transitionDelay: currentStep === 2 ? '300ms' : '0ms' }}
              >
                <h3 className="text-lg md:text-xl font-display font-bold text-deep-space mb-3">
                  Knowledge Graph
                </h3>
              </div>

              {/* Right Side - LMS Course Structure Animation */}
              <div 
                className={`flex flex-col space-y-3 transition-all duration-700 ${
                  currentStep === 2 ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-12'
                }`}
                style={{ transitionDelay: currentStep === 2 ? '500ms' : '0ms' }}
              >
                <h3 className="text-lg md:text-xl font-display font-bold text-deep-space mb-3">
                  Generated Courses
                </h3>
                
                {/* Course Structure Skeleton - Generated Animation */}
                <div className="space-y-3">
                  {/* Course 1 - Security Awareness Training */}
                  <div 
                    className={`bg-white rounded-lg border-2 transition-all duration-700 ${
                      showCourses ? 'opacity-100 transform translate-x-0 border-cosmic-purple/30' : 'opacity-0 transform translate-x-8 border-mist-gray'
                    }`}
                    style={{ 
                      boxShadow: 'none',
                      transitionDelay: showCourses ? '200ms' : '0ms'
                    }}
                  >
                    {/* Course Header */}
                    <div 
                      className={`p-3 transition-all duration-500 ${
                        showCourses ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ transitionDelay: showCourses ? '300ms' : '0ms' }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cosmic-purple to-electric-violet flex items-center justify-center">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-deep-space text-sm leading-tight mb-1">SECURITY AWARENESS TRAINING COURSE</h4>
                          <p className="text-xs text-stone-gray leading-relaxed">Comprehensive eLearning Program for Employee Cybersecurity Education</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-stone-gray">Generated from: Phishing Awareness, PDF Content</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Lessons */}
                    <div className="px-4 pb-3">
                      <div className="ml-8 space-y-1">
                        {[
                          'Module 1: Phishing Detection & Prevention',
                          'Module 2: Password Security Best Practices'
                        ].map((lesson, index) => (
                          <div 
                            key={lesson}
                            className={`flex items-center gap-2 transition-all duration-500 ${
                              showCourses ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-4'
                            }`}
                            style={{ 
                              transitionDelay: showCourses ? `${400 + index * 100}ms` : '0ms'
                            }}
                          >
                            <span className="text-xs text-stone-gray">{lesson}</span>
                          </div>
                        ))}
                        <div 
                          className={`flex items-center gap-2 transition-all duration-500 ${
                            showCourses ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-4'
                          }`}
                          style={{ 
                            transitionDelay: showCourses ? '600ms' : '0ms'
                          }}
                        >
                          <span className="text-xs text-stone-gray">...</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course 2 - AI Best Practices Training */}
                  <div 
                    className={`bg-white rounded-lg border-2 transition-all duration-700 ${
                      showCourses ? 'opacity-100 transform translate-x-0 border-phosphor-cyan/30' : 'opacity-0 transform translate-x-8 border-mist-gray'
                    }`}
                    style={{ 
                      boxShadow: 'none',
                      transitionDelay: showCourses ? '700ms' : '0ms'
                    }}
                  >
                    {/* Course Header */}
                    <div 
                      className={`p-3 transition-all duration-500 ${
                        showCourses ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ transitionDelay: showCourses ? '800ms' : '0ms' }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-phosphor-cyan to-synaptic-blue flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-deep-space text-sm leading-tight mb-1">AI BEST PRACTICES TRAINING COURSE</h4>
                          <p className="text-xs text-stone-gray leading-relaxed">Interactive eLearning Program for Educational Institutions</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs text-stone-gray">Generated from: Advanced AI Usage, Video Content</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Lessons */}
                    <div className="px-4 pb-4">
                      <div className="ml-8 space-y-1">
                        {[
                          'Module 1: Ethical AI Implementation',
                          'Module 2: Data Privacy & AI Systems'
                        ].map((lesson, index) => (
                          <div 
                            key={lesson}
                            className={`flex items-center gap-2 transition-all duration-500 ${
                              showCourses ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-4'
                            }`}
                            style={{ 
                              transitionDelay: showCourses ? `${900 + index * 100}ms` : '0ms'
                            }}
                          >
                            <span className="text-xs text-stone-gray">{lesson}</span>
                          </div>
                        ))}
                        <div 
                          className={`flex items-center gap-2 transition-all duration-500 ${
                            showCourses ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-4'
                          }`}
                          style={{ 
                            transitionDelay: showCourses ? '1100ms' : '0ms'
                          }}
                        >
                          <span className="text-xs text-stone-gray">...</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="w-full h-full flex items-center justify-center relative overflow-visible">
            {/* Step 3: Learn & Progress - Employee learning from modules */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full max-w-6xl mx-auto overflow-visible">
              {/* Left Side - Knowledge Graph with Employee Node */}
              <div 
                className={`flex flex-col space-y-3 transition-all duration-700 ${
                  currentStep === 3 ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-12'
                }`}
                style={{ transitionDelay: currentStep === 3 ? '300ms' : '0ms' }}
              >
                <h3 className="text-lg md:text-xl font-display font-bold text-deep-space mb-3">
                  Knowledge Graph
                </h3>
              </div>

              {/* Right Side - Learning Modules with Progress */}
              <div 
                className={`flex flex-col space-y-3 transition-all duration-700 ${
                  currentStep === 3 ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-12'
                }`}
                style={{ transitionDelay: currentStep === 3 ? '300ms' : '0ms' }}
              >
                <h3 className="text-lg md:text-xl font-display font-bold text-deep-space mb-3">
                  Learning Progress
                </h3>
                
                {/* Employee Info */}
                <div 
                  className={`bg-white rounded-lg border-2 transition-all duration-700 ${
                    showLearning ? 'opacity-100 transform translate-x-0 border-synaptic-blue/30' : 'opacity-0 transform translate-x-8 border-mist-gray'
                  }`}
                  style={{ 
                    boxShadow: 'none',
                    transitionDelay: showLearning ? '400ms' : '0ms'
                  }}
                >
                  <div 
                    className={`p-3 transition-all duration-500 ${
                      showLearning ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ transitionDelay: showLearning ? '500ms' : '0ms' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-synaptic-blue to-phosphor-cyan flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-deep-space text-sm">John Smith</h4>
                        <p className="text-xs text-stone-gray">Marketing Analyst • Currently Learning</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-phosphor-cyan animate-pulse"></div>
                        <span className="text-xs text-phosphor-cyan font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Awareness Course Modules with Learning Progress */}
                <div 
                  className={`bg-white rounded-lg border-2 transition-all duration-700 ${
                    showLearning ? 'opacity-100 transform translate-x-0 border-cosmic-purple/30' : 'opacity-0 transform translate-x-8 border-mist-gray'
                  }`}
                  style={{ 
                    boxShadow: 'none',
                    transitionDelay: showLearning ? '600ms' : '0ms'
                  }}
                >
                  <div 
                    className={`p-3 transition-all duration-500 ${
                      showLearning ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ transitionDelay: showLearning ? '700ms' : '0ms' }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cosmic-purple to-electric-violet flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-deep-space text-sm leading-tight mb-1">SECURITY AWARENESS TRAINING</h4>
                        <p className="text-xs text-stone-gray leading-relaxed">Interactive Learning Modules</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Learning Modules with Interactive States */}
                  <div className="px-4 pb-3">
                    <div className="ml-8 space-y-2">
                      {[
                        'Module 1: Phishing Detection & Prevention',
                        'Module 2: Password Security Best Practices'
                      ].map((lesson, index) => (
                        <div 
                          key={lesson}
                          className={`flex items-center gap-3 p-2 rounded-md transition-all duration-500 ${
                            activeModule === index 
                              ? 'bg-gradient-to-r from-cosmic-purple/10 to-electric-violet/10 border border-cosmic-purple/30 transform scale-105' 
                              : showLearning 
                                ? 'opacity-100 transform translate-x-0 hover:bg-mist-gray/30' 
                                : 'opacity-0 transform translate-x-4'
                          }`}
                          style={{ 
                            transitionDelay: showLearning ? `${800 + index * 200}ms` : '0ms'
                          }}
                        >
                          {activeModule === index && (
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-cosmic-purple animate-pulse" />
                              <div className="w-2 h-2 rounded-full bg-cosmic-purple animate-ping"></div>
                            </div>
                          )}
                          <span className={`text-xs ${
                            activeModule === index 
                              ? 'text-cosmic-purple font-semibold' 
                              : 'text-stone-gray'
                          }`}>
                            {lesson}
                          </span>
                          {activeModule === index && (
                            <div className="ml-auto flex items-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-cosmic-purple animate-pulse"></div>
                              <span className="text-xs text-cosmic-purple font-medium">Learning...</span>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Learning Connection Indicator */}
                      {activeModule === 0 && (
                        <div 
                          className="flex items-center gap-2 ml-4 p-2 bg-gradient-to-r from-phosphor-cyan/10 to-synaptic-blue/10 rounded-md border border-phosphor-cyan/20 transition-all duration-500"
                          style={{ 
                            transitionDelay: '2000ms'
                          }}
                        >
                          <div className="w-3 h-3 rounded-full bg-phosphor-cyan animate-pulse"></div>
                          <span className="text-xs text-synaptic-blue font-medium">↗ Learning relationship: Phishing Attacks → John Smith</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-3xl font-display font-bold text-deep-space mb-4">
                Step {currentStep + 1}: {journeySteps[currentStep].title}
              </h3>
              <p className="text-xl text-stone-gray">
                {journeySteps[currentStep].description}
              </p>
              <div className="mt-8 p-8 bg-white rounded-xl shadow-lg border border-mist-gray">
                <p className="text-stone-gray">Coming soon...</p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <section className="min-h-screen bg-soft-light flex flex-col relative overflow-visible" data-carousel-section>
      {/* Fullscreen Graph Overlay */}
      {(currentStep === 1 || currentStep === 2 || currentStep === 3) && showGraph && graphReady && graphData && typeof window !== 'undefined' && (
        <div 
          className={`absolute transition-opacity duration-700 ${
            currentStep === 1 || currentStep === 2 || currentStep === 3 ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            top: 0,
            left: '-50vw', // Extend left boundary
            right: '-50vw', // Extend right boundary
            bottom: 0,
            width: '200vw', // Double the viewport width
            zIndex: 15,
            pointerEvents: 'auto',
            overflow: 'visible'
          }}
        >
          <div 
            className="relative"
            style={{ 
              width: '200vw',
              height: '100%',
              paddingBottom: '120px', // Space for navigation controls
              transform: currentStep === 2 ? 'translateX(-47vw)' : currentStep === 3 ? 'translateX(-25vw)' : 'translateX(0)',
              transition: 'transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.8s ease-in-out',
              opacity: currentStep === 2 ? 0.9 : 1,
              overflow: 'visible'
            }}
          >
            <GraphConstellationPersistent
              key={`fullscreen-${graphKey}`}
              data={graphData}
              width={windowDimensions.width * 2} // Double width for full coverage
              height={windowDimensions.height}
              currentStage={currentStage}
              enableBoundaries={false}
              initialPosition={{
                x: windowDimensions.width * 1.22, // Adjust for the extended canvas
                y: windowDimensions.height * 0.55
              }}
              initialSettings={{
                showNodeLabels: true,
                showRelationshipLabels: currentStep === 3,
                showControls: false
              }}
            />
          </div>
        </div>
      )}
        <div className="container mx-auto px-4 flex-1 flex flex-col overflow-visible" style={{ clipPath: 'none' }}>
          <div className="max-w-7xl mx-auto flex-1 flex flex-col overflow-visible" style={{ clipPath: 'none' }}>
            {/* Section Header */}
            <div className="text-center py-8 md:py-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 md:mb-6 text-deep-space">
                Transform Any Content Into{' '}
                <span className="bg-gradient-to-r from-cosmic-purple via-electric-violet to-luminous-indigo bg-clip-text text-transparent">
                  Intelligent Learning
                </span>
              </h2>
              <p className="text-lg md:text-xl text-stone-gray max-w-3xl mx-auto">
                Follow the complete user journey from content upload to advanced analytics
              </p>
            </div>

          {/* Carousel Container */}
          <div className="flex-1 flex flex-col min-h-0 overflow-visible">
            {/* Slide Content */}
            <div className="flex-1 flex items-center justify-center min-h-0 relative overflow-visible" style={{ zIndex: 10, clipPath: 'none' }}>
              {renderSlide()}
            </div>

            {/* Navigation Controls */}
            <div 
              className="flex items-center justify-center gap-4 md:gap-6 py-6 md:py-8 relative"
              style={{ zIndex: 30 }}
            >
              {/* Previous Button */}
              <Button
                onClick={handlePrev}
                disabled={currentStep === 0}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              {/* Step Indicators */}
              <div className="flex items-center gap-2 md:gap-4">
                {journeySteps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 ${
                      index === currentStep
                        ? 'text-cosmic-purple'
                        : index < currentStep
                        ? 'text-phosphor-cyan'
                        : 'text-stone-gray'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div
                      className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? 'bg-cosmic-purple scale-125'
                          : index < currentStep
                          ? 'bg-phosphor-cyan'
                          : 'bg-mist-gray'
                      }`}
                    />
                    <span className="text-xs font-medium hidden lg:block">
                      {index + 1}
                    </span>
                  </div>
                ))}
                <div className="ml-2 md:ml-4 text-xs md:text-sm font-medium text-stone-gray">
                  Step {currentStep + 1} / {journeySteps.length}
                </div>
              </div>

              {/* Next Button */}
              <Button
                onClick={handleNext}
                disabled={currentStep === journeySteps.length - 1 || isGenerating}
                variant={currentStep === 0 ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${
                  currentStep === 0 
                    ? "bg-cosmic-purple hover:bg-electric-violet text-white shadow-lg hover:shadow-xl" 
                    : ""
                }`}
              >
                {currentStep === 0 ? (
                  <>
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                        <span className="hidden sm:inline">Generating...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Generate Knowledge Graph</span>
                        <span className="sm:hidden">Generate</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
          </div>
        </div>
    </section>
  )
}