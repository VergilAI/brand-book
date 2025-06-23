'use client'

import { useState, useMemo } from 'react'
import { Section } from '@/components/landing/section'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowRight, TrendingUp, Clock, DollarSign, Target } from 'lucide-react'

interface ROIInputs {
  employees: number
  trainingHours: number
  industry: string
  compliance: string[]
}

interface ROIResults {
  weeksToCompliance: number
  traditionalMonths: number
  timeSaved: number
  costSavings: number
  completionImprovement: number
}

export function ROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>({
    employees: 500,
    trainingHours: 40,
    industry: 'technology',
    compliance: ['iso27001']
  })
  
  const [showResults, setShowResults] = useState(false)
  
  const industries = [
    { value: 'technology', label: 'Technology', multiplier: 1.2 },
    { value: 'finance', label: 'Financial Services', multiplier: 1.5 },
    { value: 'healthcare', label: 'Healthcare', multiplier: 1.4 },
    { value: 'manufacturing', label: 'Manufacturing', multiplier: 1.1 },
    { value: 'retail', label: 'Retail', multiplier: 1.0 },
    { value: 'government', label: 'Government', multiplier: 1.3 }
  ]
  
  const complianceOptions = [
    { id: 'iso27001', label: 'ISO 27001', weeks: 8 },
    { id: 'gdpr', label: 'GDPR', weeks: 6 },
    { id: 'soc2', label: 'SOC 2', weeks: 10 },
    { id: 'hipaa', label: 'HIPAA', weeks: 12 }
  ]
  
  const results: ROIResults = useMemo(() => {
    const industryMultiplier = industries.find(i => i.value === inputs.industry)?.multiplier || 1.0
    const complianceWeeks = Math.max(...inputs.compliance.map(c => 
      complianceOptions.find(opt => opt.id === c)?.weeks || 8
    ))
    
    const avgHourlyRate = 75 // Average employee hourly rate
    const traditionalEfficiency = 0.23 // 23% completion rate
    const vergilEfficiency = 0.87 // 87% completion rate
    
    const timeSaved = Math.round(((inputs.trainingHours * traditionalEfficiency) - 
                                (inputs.trainingHours * vergilEfficiency / 3)) / 
                                (inputs.trainingHours * traditionalEfficiency) * 100)
    
    const costSavings = Math.round(
      inputs.employees * 
      inputs.trainingHours * 
      avgHourlyRate * 
      (timeSaved / 100) * 
      industryMultiplier
    )
    
    return {
      weeksToCompliance: complianceWeeks,
      traditionalMonths: Math.round(complianceWeeks * 4 / 4), // Convert to months, then multiply traditional factor
      timeSaved,
      costSavings,
      completionImprovement: Math.round((vergilEfficiency - traditionalEfficiency) * 100)
    }
  }, [inputs])
  
  const handleComplianceChange = (complianceId: string, checked: boolean) => {
    setInputs(prev => ({
      ...prev,
      compliance: checked 
        ? [...prev.compliance, complianceId]
        : prev.compliance.filter(c => c !== complianceId)
    }))
  }
  
  return (
    <Section variant="muted" className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-display-lg font-display font-bold mb-4">
            Calculate Your <span className="gradient-text">Learning Transformation</span>
          </h2>
          <p className="text-body-lg text-stone-gray max-w-2xl mx-auto">
            See the potential impact on your organization's learning efficiency and compliance timeline.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Your Organization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Employees Slider */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Employees to train: <span className="text-cosmic-purple font-bold">{inputs.employees.toLocaleString()}</span>
                </label>
                <Slider
                  value={[inputs.employees]}
                  onValueChange={([value]) => setInputs(prev => ({ ...prev, employees: value }))}
                  min={50}
                  max={10000}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-stone-gray mt-1">
                  <span>50</span>
                  <span>10,000</span>
                </div>
              </div>
              
              {/* Training Hours Slider */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Current training hours/employee: <span className="text-cosmic-purple font-bold">{inputs.trainingHours}</span>
                </label>
                <Slider
                  value={[inputs.trainingHours]}
                  onValueChange={([value]) => setInputs(prev => ({ ...prev, trainingHours: value }))}
                  min={10}
                  max={200}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-stone-gray mt-1">
                  <span>10</span>
                  <span>200</span>
                </div>
              </div>
              
              {/* Industry Select */}
              <div>
                <label className="block text-sm font-medium mb-3">Your industry</label>
                <Select value={inputs.industry} onValueChange={(value) => setInputs(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map(industry => (
                      <SelectItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Compliance Requirements */}
              <div>
                <label className="block text-sm font-medium mb-3">Compliance requirements</label>
                <div className="space-y-3">
                  {complianceOptions.map(option => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={inputs.compliance.includes(option.id)}
                        onCheckedChange={(checked) => handleComplianceChange(option.id, checked as boolean)}
                      />
                      <label htmlFor={option.id} className="text-sm">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={() => setShowResults(true)}
                className="w-full bg-cosmic-purple hover:bg-electric-violet"
              >
                Calculate ROI
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          {/* Results Panel */}
          <Card className={`transition-all duration-500 ${showResults ? 'opacity-100 scale-100' : 'opacity-50 scale-95'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Your Transformation Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Time to Compliance */}
              <div className="p-6 bg-gradient-to-r from-cosmic-purple/10 to-electric-violet/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-cosmic-purple" />
                  <span className="font-medium">Time to Compliance</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-cosmic-purple">{results.weeksToCompliance}</span>
                  <span className="text-sm text-stone-gray">weeks</span>
                  <span className="text-sm text-stone-gray ml-2">
                    (vs {results.traditionalMonths * 4} weeks traditional)
                  </span>
                </div>
              </div>
              
              {/* Training Time Saved */}
              <div className="p-6 bg-gradient-to-r from-phosphor-cyan/10 to-synaptic-blue/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-phosphor-cyan" />
                  <span className="font-medium">Training Time Saved</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-phosphor-cyan">{results.timeSaved}%</span>
                  <span className="text-sm text-stone-gray">reduction in training hours</span>
                </div>
              </div>
              
              {/* Cost Savings */}
              <div className="p-6 bg-gradient-to-r from-neural-pink/10 to-electric-violet/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-neural-pink" />
                  <span className="font-medium">Estimated Cost Savings</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-neural-pink">
                    ${results.costSavings.toLocaleString()}
                  </span>
                  <span className="text-sm text-stone-gray">first year</span>
                </div>
              </div>
              
              {/* Completion Rate Improvement */}
              <div className="p-6 bg-gradient-to-r from-synaptic-blue/10 to-phosphor-cyan/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-synaptic-blue" />
                  <span className="font-medium">Completion Rate Improvement</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-synaptic-blue">+{results.completionImprovement}%</span>
                  <span className="text-sm text-stone-gray">vs industry average</span>
                </div>
              </div>
              
              {showResults && (
                <Button className="w-full bg-cosmic-purple hover:bg-electric-violet mt-6">
                  Get Detailed ROI Report
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  )
}