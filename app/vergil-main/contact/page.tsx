'use client'

import { LearnFooter } from '@/components/landing/learn-footer'
import { Button } from '@/components/ui/button'
import { Mail, Calendar, User } from 'lucide-react'
import { IrisPattern } from '@/components/vergil/iris-pattern'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-pure-light">
      
      {/* Hero Section with Iris Pattern Background */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <IrisPattern variant="cosmic" size="xl" className="scale-150" />
        </div>
        
        {/* Content */}
        <div className="container relative mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                <span className="bg-gradient-to-r from-cosmic-purple via-electric-violet to-luminous-indigo bg-clip-text text-transparent">
                  Let's Build Something Amazing Together
                </span>
              </h1>
              <p className="text-xl text-stone-gray max-w-2xl mx-auto">
                Ready to transform how your organization learns? Our team is here to show you how Vergil Learn can unlock your team's full potential.
              </p>
            </div>
            
            {/* Contact Cards Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* CEO Card */}
              <div className="bg-white rounded-xl border border-mist-gray/30 p-8 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cosmic-purple to-electric-violet flex items-center justify-center">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-deep-space mb-1">Botond Varga</h3>
                    <p className="text-stone-gray font-medium">Chief Executive Officer</p>
                  </div>
                </div>
                
                <a 
                  href="mailto:botond.varga@vergilai.com"
                  className="flex items-center gap-3 text-cosmic-purple hover:text-electric-violet transition-colors group"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium group-hover:underline">botond.varga@vergilai.com</span>
                </a>
              </div>
              
              {/* COO Card */}
              <div className="bg-white rounded-xl border border-mist-gray/30 p-8 hover:shadow-lg transition-all duration-300 group">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-phosphor-cyan to-synaptic-blue flex items-center justify-center">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-bold text-deep-space mb-1">Daniel Papp</h3>
                    <p className="text-stone-gray font-medium">Chief Operating Officer</p>
                  </div>
                </div>
                
                <a 
                  href="mailto:daniel.papp@vergilai.com"
                  className="flex items-center gap-3 text-phosphor-cyan hover:text-synaptic-blue transition-colors group"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-medium group-hover:underline">daniel.papp@vergilai.com</span>
                </a>
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="bg-gradient-to-br from-cosmic-purple/5 to-electric-violet/5 rounded-2xl p-10 text-center border border-cosmic-purple/10">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-display font-bold text-deep-space mb-4">
                  See Vergil Learn in Action
                </h2>
                <p className="text-lg text-stone-gray mb-8">
                  Book a personalized 30-minute demo and discover how we can help your organization build a culture of continuous learning.
                </p>
                
                <Button
                  size="lg"
                  className="bg-cosmic-purple hover:bg-electric-violet text-pure-light px-10 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                  onClick={() => window.open('https://calendly.com/daniel-papp-vergillearn/30min?month=2025-06', '_blank')}
                >
                  <Calendar className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Schedule Your Demo
                </Button>
                
                <p className="text-sm text-stone-gray mt-6">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 bg-phosphor-cyan rounded-full animate-pulse"></span>
                    Usually responds within 24 hours
                  </span>
                </p>
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="mt-16 text-center">
              <p className="text-stone-gray mb-4">
                Have a specific question? Feel free to reach out directly to any of our team members above.
              </p>
              <p className="text-sm text-stone-gray">
                We're committed to helping you unlock the full potential of your organization's knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <LearnFooter />
    </main>
  )
}