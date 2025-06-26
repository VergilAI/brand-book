import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComponentPreview } from "@/components/docs/component-preview";
import { CodeBlock } from "@/components/docs/code-block";

export default function InteractiveComponentsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Interactive Components</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Dynamic landing page elements that engage users, collect data, and create 
            memorable experiences. These components bridge the gap between static content 
            and meaningful user interaction.
          </p>
        </div>

        {/* ROI Calculator */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            ROI Calculator
            <Badge>High-Value</Badge>
          </h2>
          
          <ComponentPreview>
            <div className="bg-gradient-to-br from-cosmic-purple/5 to-electric-violet/5 p-8 rounded-lg">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-center mb-8">Calculate Your ROI</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Input Section */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Number of Employees
                      </label>
                      <div className="relative">
                        <input 
                          type="range" 
                          min="10" 
                          max="10000" 
                          defaultValue="500"
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>10</span>
                          <span className="font-medium text-cosmic-purple">500</span>
                          <span>10,000+</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Average Hourly Rate ($)
                      </label>
                      <div className="relative">
                        <input 
                          type="range" 
                          min="20" 
                          max="200" 
                          defaultValue="75"
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>$20</span>
                          <span className="font-medium text-cosmic-purple">$75</span>
                          <span>$200+</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Training Hours per Month
                      </label>
                      <div className="relative">
                        <input 
                          type="range" 
                          min="1" 
                          max="40" 
                          defaultValue="8"
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>1</span>
                          <span className="font-medium text-cosmic-purple">8</span>
                          <span>40+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Results Section */}
                  <div className="space-y-4">
                    <Card className="bg-white/50 backdrop-blur-sm border-cosmic-purple/20">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-cosmic-purple mb-2">
                            $2.4M
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Annual ROI with Vergil Learn
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-white/30 backdrop-blur-sm">
                        <CardContent className="p-4 text-center">
                          <div className="text-xl font-bold text-phosphor-cyan">87%</div>
                          <div className="text-xs text-muted-foreground">Efficiency Gain</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-white/30 backdrop-blur-sm">
                        <CardContent className="p-4 text-center">
                          <div className="text-xl font-bold text-electric-violet">6 mo</div>
                          <div className="text-xs text-muted-foreground">Payback Period</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Button className="w-full" size="lg">
                      Get Detailed Analysis
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ComponentPreview>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Key Features</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Real-time calculation updates as user interacts with sliders</li>
                <li>Visual feedback with branded color highlights</li>
                <li>Progressive disclosure of additional metrics</li>
                <li>Strong CTA integration for lead generation</li>
                <li>Mobile-optimized touch interactions</li>
              </ul>
            </div>

            <CodeBlock language="tsx">
{`<ROICalculator
  title="Calculate Your ROI"
  inputs={[
    { label: "Number of Employees", min: 10, max: 10000, defaultValue: 500 },
    { label: "Average Hourly Rate ($)", min: 20, max: 200, defaultValue: 75 },
    { label: "Training Hours per Month", min: 1, max: 40, defaultValue: 8 }
  ]}
  onCalculate={(values) => calculateROI(values)}
  ctaText="Get Detailed Analysis"
  ctaAction="/contact"
/>`}
            </CodeBlock>
          </div>
        </section>

        {/* Carousel System */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Testimonial Carousel
            <Badge variant="outline">Social Proof</Badge>
          </h2>
          
          <ComponentPreview>
            <div className="bg-muted/30 p-8 rounded-lg">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-center mb-8">What Our Customers Say</h3>
                
                {/* Carousel Content */}
                <Card className="bg-white shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-center space-y-6">
                      <div className="flex justify-center mb-4">
                        {[1,2,3,4,5].map((star) => (
                          <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                      
                      <blockquote className="text-lg text-muted-foreground italic">
                        "Vergil Learn transformed our training program completely. We saw 
                        87% completion rates compared to our previous 23% industry average."
                      </blockquote>
                      
                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-12 h-12 bg-cosmic-purple rounded-full flex items-center justify-center text-white font-bold">
                          SJ
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">Sarah Johnson</div>
                          <div className="text-sm text-muted-foreground">Head of L&D, TechCorp</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-cosmic-purple">87%</div>
                          <div className="text-xs text-muted-foreground">Completion Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-phosphor-cyan">2,500</div>
                          <div className="text-xs text-muted-foreground">Employees Trained</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-electric-violet">6 mo</div>
                          <div className="text-xs text-muted-foreground">Time to ROI</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Navigation */}
                <div className="flex justify-center items-center space-x-4 mt-6">
                  <Button variant="outline" size="sm">←</Button>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-cosmic-purple rounded-full"></div>
                    <div className="w-2 h-2 bg-muted rounded-full"></div>
                    <div className="w-2 h-2 bg-muted rounded-full"></div>
                  </div>
                  <Button variant="outline" size="sm">→</Button>
                </div>
              </div>
            </div>
          </ComponentPreview>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Interaction Patterns</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Auto-advance with pause on hover</li>
                <li>Touch/swipe navigation on mobile devices</li>
                <li>Keyboard navigation support (arrow keys)</li>
                <li>Smooth transitions with breathing animation</li>
                <li>Integrated metrics display for credibility</li>
              </ul>
            </div>

            <CodeBlock language="tsx">
{`<TestimonialCarousel
  testimonials={testimonialData}
  autoAdvance={true}
  interval={5000}
  showMetrics={true}
  navigation={{
    dots: true,
    arrows: true,
    keyboard: true,
    touch: true
  }}
/>`}
            </CodeBlock>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            FAQ Accordion
            <Badge variant="outline">Progressive Disclosure</Badge>
          </h2>
          
          <ComponentPreview>
            <div className="max-w-3xl mx-auto space-y-4">
              <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
              
              {[
                {
                  question: "How does Vergil Learn adapt to different learning styles?",
                  answer: "Our AI analyzes individual learning patterns, preferences, and progress to create personalized pathways. Whether someone learns best through visual content, hands-on practice, or reading, our system adapts accordingly.",
                  open: true
                },
                {
                  question: "What kind of ROI can we expect from implementation?",
                  answer: "Most organizations see 3-5x ROI within 6 months through improved completion rates, reduced training time, and better knowledge retention."
                },
                {
                  question: "How long does implementation typically take?",
                  answer: "Standard implementation takes 2-4 weeks, including content migration, user setup, and team training."
                }
              ].map((faq, index) => (
                <Card key={index} className={`transition-all duration-200 ${faq.open ? 'ring-2 ring-cosmic-purple/20' : ''}`}>
                  <CardHeader className="cursor-pointer hover:bg-muted/50">
                    <CardTitle className="flex items-center justify-between text-lg">
                      {faq.question}
                      <span className={`transition-transform duration-200 ${faq.open ? 'rotate-180' : ''}`}>
                        ↓
                      </span>
                    </CardTitle>
                  </CardHeader>
                  {faq.open && (
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </ComponentPreview>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Progressive Disclosure Benefits</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Reduces cognitive load by showing only relevant information</li>
                <li>Smooth expand/collapse animations maintain visual continuity</li>
                <li>Maintains clean page layout while providing comprehensive information</li>
                <li>Analytics tracking for most frequently accessed questions</li>
              </ul>
            </div>

            <CodeBlock language="tsx">
{`<FAQAccordion
  faqs={faqData}
  allowMultiple={false}
  defaultOpen={0}
  analytics={{
    trackExpand: true,
    trackDuration: true
  }}
  animation={{
    duration: 200,
    easing: "ease-out"
  }}
/>`}
            </CodeBlock>
          </div>
        </section>

        {/* Design Principles */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Interactive Design Principles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-cosmic-purple">
              <CardHeader>
                <CardTitle className="text-cosmic-purple">Progressive Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Start with low-commitment interactions and gradually increase engagement depth.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Begin with simple hover effects</li>
                  <li>• Progress to click interactions</li>
                  <li>• Culminate in form submissions or calculations</li>
                  <li>• Provide immediate value at each step</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-electric-violet">
              <CardHeader>
                <CardTitle className="text-electric-violet">Feedback Loops</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Every interaction should provide immediate, meaningful feedback.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Visual state changes (colors, animations)</li>
                  <li>• Real-time calculation updates</li>
                  <li>• Progress indicators for multi-step flows</li>
                  <li>• Confirmation messages for completed actions</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-phosphor-cyan">
              <CardHeader>
                <CardTitle className="text-phosphor-cyan">Accessibility First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Interactive elements must work for all users, regardless of ability.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Keyboard navigation support</li>
                  <li>• Screen reader compatibility</li>
                  <li>• Sufficient color contrast</li>
                  <li>• Respect for motion preferences</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-synaptic-blue">
              <CardHeader>
                <CardTitle className="text-synaptic-blue">Performance Awareness</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Interactive components should enhance, not hinder, the user experience.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Smooth 60fps animations</li>
                  <li>• Lazy loading for complex calculations</li>
                  <li>• Debounced input handling</li>
                  <li>• Graceful degradation on slower devices</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Implementation Guidelines */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Implementation Guidelines</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Test interactions on multiple devices and browsers</li>
                  <li>• Provide clear visual feedback for all interactive states</li>
                  <li>• Include loading states for async operations</li>
                  <li>• Use semantic HTML for better accessibility</li>
                  <li>• Implement proper error handling and recovery</li>
                  <li>• Track interaction analytics for optimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Common Pitfalls</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• Don't overwhelm users with too many interactive elements</li>
                  <li>• Avoid animations that trigger motion sensitivity</li>
                  <li>• Don't sacrifice performance for visual effects</li>
                  <li>• Avoid interactions that don't provide clear value</li>
                  <li>• Don't ignore keyboard and screen reader users</li>
                  <li>• Avoid complex interactions on mobile devices</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}