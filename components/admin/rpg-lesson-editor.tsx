'use client'

import { useState } from 'react'
import {
  Users,
  Plus,
  Trash2,
  Bot,
  User,
  MessageSquare,
  Target,
  Lightbulb,
  Settings,
  Play,
  Wand2,
  Upload,
  Eye,
  Edit,
  Save,
  ArrowRight,
  Crown,
  Briefcase,
  GraduationCap,
  Globe
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card'
import { Button } from '@/components/button'
import { Input } from '@/components/input'
import { Label } from '@/components/label'
import { Textarea } from '@/components/textarea'
import { Badge } from '@/components/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/collapsible'
import { Alert, AlertDescription } from '@/components/alert'
import { RichTextEditor } from './rich-text-editor'
import { cn } from '@/lib/utils'

interface GameCharacter {
  id: string
  name: string
  role: string
  description: string
  avatar?: string
  personality: string[]
  dialogueOptions: string[]
}

interface GameScenario {
  id: string
  title: string
  description: string
  triggerConditions: string[]
  outcomes: {
    success: string
    failure: string
  }
}

interface KnowledgePoint {
  id: string
  title: string
  description: string
  associatedScenarios: string[]
  assessmentCriteria: string[]
}

interface RPGLessonContent {
  gameTitle: string
  gameDescription: string
  learningGoal: string
  characters: GameCharacter[]
  scenarios: GameScenario[]
  knowledgePoints: KnowledgePoint[]
}

interface RPGLessonEditorProps {
  content: RPGLessonContent
  onChange: (content: RPGLessonContent) => void
}

export function RPGLessonEditor({ content, onChange }: RPGLessonEditorProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [selectedKnowledge, setSelectedKnowledge] = useState<string | null>(null)
  const [generationMode, setGenerationMode] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const updateContent = (updates: Partial<RPGLessonContent>) => {
    onChange({ ...content, ...updates })
  }

  // Character Management
  const addCharacter = () => {
    const newCharacter: GameCharacter = {
      id: `character-${Date.now()}`,
      name: '',
      role: '',
      description: '',
      personality: [],
      dialogueOptions: []
    }

    updateContent({
      characters: [...content.characters, newCharacter]
    })

    setSelectedCharacter(newCharacter.id)
  }

  const updateCharacter = (characterId: string, updates: Partial<GameCharacter>) => {
    updateContent({
      characters: content.characters.map(char =>
        char.id === characterId ? { ...char, ...updates } : char
      )
    })
  }

  const deleteCharacter = (characterId: string) => {
    if (confirm('Are you sure you want to delete this character?')) {
      updateContent({
        characters: content.characters.filter(char => char.id !== characterId)
      })
      
      if (selectedCharacter === characterId) {
        setSelectedCharacter(null)
      }
    }
  }

  // Scenario Management
  const addScenario = () => {
    const newScenario: GameScenario = {
      id: `scenario-${Date.now()}`,
      title: '',
      description: '',
      triggerConditions: [],
      outcomes: {
        success: '',
        failure: ''
      }
    }

    updateContent({
      scenarios: [...content.scenarios, newScenario]
    })

    setSelectedScenario(newScenario.id)
  }

  const updateScenario = (scenarioId: string, updates: Partial<GameScenario>) => {
    updateContent({
      scenarios: content.scenarios.map(scenario =>
        scenario.id === scenarioId ? { ...scenario, ...updates } : scenario
      )
    })
  }

  const deleteScenario = (scenarioId: string) => {
    if (confirm('Are you sure you want to delete this scenario?')) {
      updateContent({
        scenarios: content.scenarios.filter(scenario => scenario.id !== scenarioId)
      })
      
      if (selectedScenario === scenarioId) {
        setSelectedScenario(null)
      }
    }
  }

  // Knowledge Points Management
  const addKnowledgePoint = () => {
    const newKnowledge: KnowledgePoint = {
      id: `knowledge-${Date.now()}`,
      title: '',
      description: '',
      associatedScenarios: [],
      assessmentCriteria: []
    }

    updateContent({
      knowledgePoints: [...content.knowledgePoints, newKnowledge]
    })

    setSelectedKnowledge(newKnowledge.id)
  }

  const updateKnowledgePoint = (knowledgeId: string, updates: Partial<KnowledgePoint>) => {
    updateContent({
      knowledgePoints: content.knowledgePoints.map(knowledge =>
        knowledge.id === knowledgeId ? { ...knowledge, ...updates } : knowledge
      )
    })
  }

  const deleteKnowledgePoint = (knowledgeId: string) => {
    if (confirm('Are you sure you want to delete this knowledge point?')) {
      updateContent({
        knowledgePoints: content.knowledgePoints.filter(knowledge => knowledge.id !== knowledgeId)
      })
      
      if (selectedKnowledge === knowledgeId) {
        setSelectedKnowledge(null)
      }
    }
  }

  const [generationInputs, setGenerationInputs] = useState({
    objectives: '',
    scenarioType: '',
    difficulty: '',
    audience: ''
  })

  const gameTemplates = {
    business: {
      gameTitle: 'Strategic Business Negotiation',
      gameDescription: 'Navigate complex business negotiations in a corporate environment where every decision impacts the outcome of a major partnership deal.',
      learningGoal: 'Master effective negotiation strategies, active listening, and win-win communication techniques',
      characters: [
        {
          id: 'char-ceo',
          name: 'Sarah Chen',
          role: 'CEO',
          description: 'Experienced executive focused on sustainable company growth and strategic partnerships',
          personality: ['Assertive', 'Strategic', 'Results-oriented', 'Data-driven'],
          dialogueOptions: [
            'What are your key objectives in this negotiation?',
            'How can we create a win-win scenario for both companies?',
            'Let\'s discuss the terms that matter most to both parties.',
            'I\'d like to understand your timeline and constraints.'
          ]
        },
        {
          id: 'char-cfo',
          name: 'Marcus Rodriguez',
          role: 'CFO',
          description: 'Detail-oriented financial expert who focuses on profitability and risk management',
          personality: ['Analytical', 'Cautious', 'Thorough', 'Numbers-focused'],
          dialogueOptions: [
            'Let\'s review the financial projections together.',
            'What\'s the ROI we can expect from this partnership?',
            'I need to understand the cost structure better.',
            'How do we mitigate the financial risks involved?'
          ]
        }
      ],
      scenarios: [
        {
          id: 'scenario-intro',
          title: 'Opening Negotiations',
          description: 'First formal meeting with potential business partners to establish partnership terms',
          triggerConditions: ['Game start'],
          outcomes: {
            success: 'Established rapport, clear objectives, and collaborative atmosphere',
            failure: 'Created tension, unclear goals, and adversarial dynamic'
          }
        },
        {
          id: 'scenario-objections',
          title: 'Handling Objections',
          description: 'Partner raises concerns about pricing and timeline commitments',
          triggerConditions: ['Previous scenario completed'],
          outcomes: {
            success: 'Successfully addressed concerns and found mutually acceptable solutions',
            failure: 'Failed to resolve objections, creating deadlock in negotiations'
          }
        }
      ],
      knowledgePoints: [
        {
          id: 'knowledge-rapport',
          title: 'Building Rapport',
          description: 'Techniques for establishing trust and personal connection with negotiation partners',
          associatedScenarios: ['scenario-intro'],
          assessmentCriteria: ['Uses active listening', 'Shows genuine interest', 'Finds common ground', 'Demonstrates empathy']
        },
        {
          id: 'knowledge-objections',
          title: 'Objection Handling',
          description: 'Strategies for addressing concerns and finding win-win solutions',
          associatedScenarios: ['scenario-objections'],
          assessmentCriteria: ['Acknowledges concerns', 'Asks clarifying questions', 'Proposes alternatives', 'Seeks mutual benefit']
        }
      ]
    },
    cybersecurity: {
      gameTitle: 'Phishing Email Spotter',
      gameDescription: 'Become a cybersecurity detective! Analyze suspicious emails, identify phishing attempts, and protect your organization from cyber threats.',
      learningGoal: 'Master the art of identifying phishing emails, understanding social engineering tactics, and implementing proper cybersecurity protocols',
      characters: [
        {
          id: 'char-security-chief',
          name: 'Alex Chen',
          role: 'Chief Security Officer',
          description: 'Experienced cybersecurity professional who guides employees through security protocols',
          personality: ['Vigilant', 'Educational', 'Patient', 'Detail-oriented'],
          dialogueOptions: [
            'What specific details make this email suspicious?',
            'Let\'s examine the sender\'s address more carefully.',
            'Notice anything unusual about the links in this message?',
            'What would be the safest action to take here?'
          ]
        },
        {
          id: 'char-hacker',
          name: 'Digital Phantom',
          role: 'Social Engineer',
          description: 'Sophisticated cybercriminal who crafts convincing phishing attempts using psychological manipulation',
          personality: ['Deceptive', 'Persuasive', 'Tech-savvy', 'Opportunistic'],
          dialogueOptions: [
            'This urgent message requires immediate action!',
            'Your account will be suspended unless you verify now.',
            'Congratulations! You\'ve won an exclusive prize.',
            'Security alert: Click here to secure your account.'
          ]
        }
      ],
      scenarios: [
        {
          id: 'scenario-urgent-email',
          title: 'Urgent Account Verification',
          description: 'Receive a convincing email claiming your account will be suspended unless you verify immediately',
          triggerConditions: ['Game start'],
          outcomes: {
            success: 'Correctly identified phishing indicators and reported the threat',
            failure: 'Fell for the scam and potentially compromised security'
          }
        },
        {
          id: 'scenario-prize-notification',
          title: 'Prize Winner Notification',
          description: 'An email announces you\'ve won a valuable prize and asks for personal information to claim it',
          triggerConditions: ['Previous scenario completed'],
          outcomes: {
            success: 'Recognized the too-good-to-be-true offer as a scam',
            failure: 'Provided personal information to fraudulent actors'
          }
        }
      ],
      knowledgePoints: [
        {
          id: 'knowledge-email-analysis',
          title: 'Email Red Flags',
          description: 'Identifying suspicious elements in emails: sender addresses, urgency tactics, poor grammar, suspicious links',
          associatedScenarios: ['scenario-urgent-email', 'scenario-prize-notification'],
          assessmentCriteria: ['Checks sender authenticity', 'Analyzes message urgency', 'Verifies links carefully', 'Questions unexpected offers']
        },
        {
          id: 'knowledge-response-protocol',
          title: 'Security Response',
          description: 'Proper procedures for handling suspected phishing: reporting, not clicking, verifying through official channels',
          associatedScenarios: ['scenario-urgent-email'],
          assessmentCriteria: ['Reports suspicious emails', 'Avoids clicking links', 'Verifies through official channels', 'Educates colleagues']
        }
      ]
    },
    ai: {
      gameTitle: 'AI Prompt Mastery Workshop',
      gameDescription: 'Navigate the world of advanced AI interactions as a prompt engineering consultant, helping clients achieve breakthrough results through strategic AI communication.',
      learningGoal: 'Master advanced prompting techniques, understand AI capabilities and limitations, and develop effective strategies for complex AI interactions',
      characters: [
        {
          id: 'char-ai-expert',
          name: 'Dr. Sam Rivera',
          role: 'AI Research Scientist',
          description: 'Leading AI researcher who understands the nuances of effective human-AI collaboration',
          personality: ['Innovative', 'Analytical', 'Collaborative', 'Forward-thinking'],
          dialogueOptions: [
            'Let\'s break down this complex task into clear components.',
            'Consider how we can provide better context for the AI.',
            'What specific output format would be most useful?',
            'How can we iterate and refine this prompt for better results?'
          ]
        },
        {
          id: 'char-business-client',
          name: 'Taylor Kim',
          role: 'Marketing Director',
          description: 'Results-driven marketing professional seeking to leverage AI for creative campaigns and data analysis',
          personality: ['Goal-oriented', 'Creative', 'Impatient', 'Results-focused'],
          dialogueOptions: [
            'I need this AI to generate compelling marketing copy.',
            'Can it analyze customer sentiment from our reviews?',
            'How do I get more creative and original ideas?',
            'The results aren\'t quite what I was expecting.'
          ]
        }
      ],
      scenarios: [
        {
          id: 'scenario-complex-analysis',
          title: 'Multi-Step Data Analysis',
          description: 'Client needs AI to perform complex market analysis combining multiple data sources and generating actionable insights',
          triggerConditions: ['Game start'],
          outcomes: {
            success: 'Created structured prompts that delivered comprehensive, actionable analysis',
            failure: 'Received generic or incomplete analysis due to unclear prompting'
          }
        },
        {
          id: 'scenario-creative-brief',
          title: 'Creative Campaign Development',
          description: 'Guide AI to generate innovative marketing campaign ideas while maintaining brand consistency and target audience focus',
          triggerConditions: ['Previous scenario completed'],
          outcomes: {
            success: 'Generated innovative, on-brand creative concepts that exceed expectations',
            failure: 'Produced generic or off-brand content that missed the mark'
          }
        }
      ],
      knowledgePoints: [
        {
          id: 'knowledge-prompt-structure',
          title: 'Advanced Prompt Engineering',
          description: 'Structuring prompts with context, role definition, clear instructions, examples, and output specifications',
          associatedScenarios: ['scenario-complex-analysis', 'scenario-creative-brief'],
          assessmentCriteria: ['Provides clear context', 'Defines AI role', 'Uses examples effectively', 'Specifies output format']
        },
        {
          id: 'knowledge-iterative-refinement',
          title: 'Prompt Iteration & Optimization',
          description: 'Techniques for refining prompts based on initial results, chain-of-thought reasoning, and multi-step processes',
          associatedScenarios: ['scenario-complex-analysis'],
          assessmentCriteria: ['Analyzes initial results', 'Refines based on output', 'Uses step-by-step reasoning', 'Optimizes for specific goals']
        }
      ]
    }
  }

  const generateGameIdea = (templateType?: string) => {
    const selectedTemplate = templateType || generationInputs.scenarioType
    console.log('Generating game idea with template:', selectedTemplate)
    
    if (selectedTemplate && gameTemplates[selectedTemplate as keyof typeof gameTemplates]) {
      const template = gameTemplates[selectedTemplate as keyof typeof gameTemplates]
      console.log('Found template:', template)
      
      updateContent({
        ...content,
        ...template
      })
      
      // Close generation mode after successful template application
      setGenerationMode(false)
    } else {
      console.log('Template not found for:', selectedTemplate)
    }
  }

  const getRoleIcon = (role: string) => {
    const lowerRole = role.toLowerCase()
    if (lowerRole.includes('ceo') || lowerRole.includes('executive')) return <Crown className="h-4 w-4" />
    if (lowerRole.includes('manager') || lowerRole.includes('director')) return <Briefcase className="h-4 w-4" />
    if (lowerRole.includes('teacher') || lowerRole.includes('professor')) return <GraduationCap className="h-4 w-4" />
    return <User className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Game Setup */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Role Playing Game Setup
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGenerationMode(!generationMode)}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit Mode' : 'Preview'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="game-title">Game Title</Label>
            <Input
              id="game-title"
              value={content.gameTitle}
              onChange={(e) => updateContent({ gameTitle: e.target.value })}
              placeholder="Enter the name of your RPG scenario"
            />
          </div>

          <div>
            <Label htmlFor="game-description">Game Description</Label>
            <RichTextEditor
              content={content.gameDescription}
              onChange={(gameDescription) => updateContent({ gameDescription })}
              placeholder="Describe the setting, context, and overall scenario..."
            />
          </div>

          <div>
            <Label htmlFor="learning-goal">Learning Goal</Label>
            <Textarea
              id="learning-goal"
              value={content.learningGoal}
              onChange={(e) => updateContent({ learningGoal: e.target.value })}
              placeholder="What should students learn or achieve through this role-playing experience?"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI Generation Tools */}
      {generationMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              AI Game Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                Use AI to generate complete game scenarios, or try one of our pre-built templates below.
              </AlertDescription>
            </Alert>

            {/* Pre-built Templates */}
            <div>
              <Label className="text-base font-medium mb-3 block">Quick Start Templates</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-0 border-2 hover:border-cosmic-purple hover:bg-cosmic-purple/5"
                  onClick={() => generateGameIdea('business')}
                >
                  <Card className="w-full border-0 shadow-none">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Briefcase className="h-5 w-5 text-cosmic-purple flex-shrink-0" />
                        <h4 className="font-medium text-left leading-tight">Business Negotiation</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 text-left leading-relaxed line-clamp-2">Navigate complex corporate partnerships and master negotiation strategies.</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">2 Characters</Badge>
                        <Badge variant="outline" className="text-xs">2 Scenarios</Badge>
                        <Badge variant="outline" className="text-xs">Professional</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-0 border-2 hover:border-cosmic-purple hover:bg-cosmic-purple/5"
                  onClick={() => generateGameIdea('cybersecurity')}
                >
                  <Card className="w-full border-0 shadow-none">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="h-5 w-5 text-cosmic-purple flex-shrink-0" />
                        <h4 className="font-medium text-left leading-tight">Phishing Email Spotter</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 text-left leading-relaxed line-clamp-2">Become a cybersecurity detective and protect against email threats.</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">2 Characters</Badge>
                        <Badge variant="outline" className="text-xs">2 Scenarios</Badge>
                        <Badge variant="outline" className="text-xs">Beginner</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-0 border-2 hover:border-cosmic-purple hover:bg-cosmic-purple/5"
                  onClick={() => generateGameIdea('ai')}
                >
                  <Card className="w-full border-0 shadow-none">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Bot className="h-5 w-5 text-cosmic-purple flex-shrink-0" />
                        <h4 className="font-medium text-left leading-tight">AI Prompt Mastery</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 text-left leading-relaxed line-clamp-2">Master advanced AI prompting and achieve breakthrough results.</p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">2 Characters</Badge>
                        <Badge variant="outline" className="text-xs">2 Scenarios</Badge>
                        <Badge variant="outline" className="text-xs">Advanced</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Button>
              </div>
            </div>

            {/* Custom Generation */}
            <div className="border-t pt-6">
              <Label className="text-base font-medium mb-4 block">Custom Game Generation</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Learning Objectives</Label>
                    <Textarea
                      placeholder="What skills or knowledge should students gain?"
                      rows={3}
                      value={generationInputs.objectives}
                      onChange={(e) => setGenerationInputs(prev => ({ ...prev, objectives: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Scenario Type</Label>
                    <Select 
                      value={generationInputs.scenarioType}
                      onValueChange={(value) => setGenerationInputs(prev => ({ ...prev, scenarioType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose scenario type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business">Business & Negotiations</SelectItem>
                        <SelectItem value="cybersecurity">Cybersecurity & Phishing</SelectItem>
                        <SelectItem value="ai">AI & Prompt Engineering</SelectItem>
                        <SelectItem value="social">Social Situations</SelectItem>
                        <SelectItem value="crisis">Crisis Management</SelectItem>
                        <SelectItem value="creative">Creative Problem Solving</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Difficulty Level</Label>
                    <Select
                      value={generationInputs.difficulty}
                      onValueChange={(value) => setGenerationInputs(prev => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Target Audience</Label>
                    <Select
                      value={generationInputs.audience}
                      onValueChange={(value) => setGenerationInputs(prev => ({ ...prev, audience: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Who is this for?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="students">Students</SelectItem>
                        <SelectItem value="professionals">Professionals</SelectItem>
                        <SelectItem value="managers">Managers</SelectItem>
                        <SelectItem value="general">General Audience</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => generateGameIdea()} 
                className="w-full mt-6"
                disabled={!generationInputs.scenarioType}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Custom Game
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Content Tabs */}
      <Tabs defaultValue="characters" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="characters" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Characters ({content.characters.length})
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Scenarios ({content.scenarios.length})
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Knowledge Points ({content.knowledgePoints.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="characters" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Game Characters</h3>
            <Button onClick={addCharacter}>
              <Plus className="h-4 w-4 mr-2" />
              Add Character
            </Button>
          </div>

          {content.characters.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No characters yet</p>
              <p className="text-sm mb-4">Create characters for students to interact with</p>
              <Button onClick={addCharacter}>
                <Plus className="h-4 w-4 mr-2" />
                Add Character
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {content.characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onEdit={() => setSelectedCharacter(character.id)}
                  onDelete={() => deleteCharacter(character.id)}
                  onUpdate={(updates) => updateCharacter(character.id, updates)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Game Scenarios</h3>
            <Button onClick={addScenario}>
              <Plus className="h-4 w-4 mr-2" />
              Add Scenario
            </Button>
          </div>

          {content.scenarios.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Globe className="h-8 w-8 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No scenarios yet</p>
              <p className="text-sm mb-4">Create scenarios that challenge students</p>
              <Button onClick={addScenario}>
                <Plus className="h-4 w-4 mr-2" />
                Add Scenario
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {content.scenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  onEdit={() => setSelectedScenario(scenario.id)}
                  onDelete={() => deleteScenario(scenario.id)}
                  onUpdate={(updates) => updateScenario(scenario.id, updates)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Knowledge Points</h3>
            <Button onClick={addKnowledgePoint}>
              <Plus className="h-4 w-4 mr-2" />
              Add Knowledge Point
            </Button>
          </div>

          {content.knowledgePoints.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-8 w-8 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No knowledge points yet</p>
              <p className="text-sm mb-4">Define what students should learn</p>
              <Button onClick={addKnowledgePoint}>
                <Plus className="h-4 w-4 mr-2" />
                Add Knowledge Point
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {content.knowledgePoints.map((knowledge) => (
                <KnowledgePointCard
                  key={knowledge.id}
                  knowledgePoint={knowledge}
                  scenarios={content.scenarios}
                  onEdit={() => setSelectedKnowledge(knowledge.id)}
                  onDelete={() => deleteKnowledgePoint(knowledge.id)}
                  onUpdate={(updates) => updateKnowledgePoint(knowledge.id, updates)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Game Preview */}
      {previewMode && content.gameTitle && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Game Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GamePreview content={content} />
          </CardContent>
        </Card>
      )}

      {/* Character Editor Modal */}
      {selectedCharacter && (
        <CharacterEditorModal
          character={content.characters.find(c => c.id === selectedCharacter)!}
          isOpen={!!selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
          onUpdate={(updates) => updateCharacter(selectedCharacter, updates)}
        />
      )}

      {/* Scenario Editor Modal */}
      {selectedScenario && (
        <ScenarioEditorModal
          scenario={content.scenarios.find(s => s.id === selectedScenario)!}
          characters={content.characters}
          isOpen={!!selectedScenario}
          onClose={() => setSelectedScenario(null)}
          onUpdate={(updates) => updateScenario(selectedScenario, updates)}
        />
      )}

      {/* Knowledge Point Editor Modal */}
      {selectedKnowledge && (
        <KnowledgeEditorModal
          knowledgePoint={content.knowledgePoints.find(k => k.id === selectedKnowledge)!}
          scenarios={content.scenarios}
          isOpen={!!selectedKnowledge}
          onClose={() => setSelectedKnowledge(null)}
          onUpdate={(updates) => updateKnowledgePoint(selectedKnowledge, updates)}
        />
      )}
    </div>
  )
}

// Character Card Component
interface CharacterCardProps {
  character: GameCharacter
  onEdit: () => void
  onDelete: () => void
  onUpdate: (updates: Partial<GameCharacter>) => void
}

function CharacterCard({ character, onEdit, onDelete }: CharacterCardProps) {
  const getRoleIcon = (role: string) => {
    const lowerRole = role.toLowerCase()
    if (lowerRole.includes('ceo') || lowerRole.includes('executive')) return <Crown className="h-4 w-4" />
    if (lowerRole.includes('manager') || lowerRole.includes('director')) return <Briefcase className="h-4 w-4" />
    if (lowerRole.includes('teacher') || lowerRole.includes('professor')) return <GraduationCap className="h-4 w-4" />
    return <User className="h-4 w-4" />
  }

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {character.avatar ? (
              <img src={character.avatar} alt={character.name} className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 bg-cosmic-purple/10 rounded-full flex items-center justify-center">
                {getRoleIcon(character.role)}
              </div>
            )}
            <div>
              <h4 className="font-medium">{character.name || 'Unnamed Character'}</h4>
              <p className="text-sm text-gray-500">{character.role || 'No role'}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {character.description || 'No description'}
        </p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {character.personality.slice(0, 3).map((trait, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {trait}
            </Badge>
          ))}
          {character.personality.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{character.personality.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit} className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Additional component implementations would go here...
// For brevity, I'll include the key components but the full implementation
// would include ScenarioCard, KnowledgePointCard, and all the modal components

// Scenario Card Component (simplified)
function ScenarioCard({ scenario, onEdit, onDelete }: any) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{scenario.title || 'Untitled Scenario'}</h4>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{scenario.description}</p>
      </CardContent>
    </Card>
  )
}

// Knowledge Point Card Component (simplified)
function KnowledgePointCard({ knowledgePoint, onEdit, onDelete }: any) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h4 className="font-medium">{knowledgePoint.title || 'Untitled Knowledge Point'}</h4>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete} className="text-red-600">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{knowledgePoint.description}</p>
      </CardContent>
    </Card>
  )
}

// Game Preview Component (simplified)
function GamePreview({ content }: { content: RPGLessonContent }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-bold">{content.gameTitle}</h3>
        <div 
          className="prose prose-sm mt-2"
          dangerouslySetInnerHTML={{ __html: content.gameDescription }}
        />
      </div>
      
      <div>
        <h4 className="font-medium mb-2">Learning Goal</h4>
        <p className="text-sm text-gray-600">{content.learningGoal}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="font-medium mb-2">Characters ({content.characters.length})</h4>
          {content.characters.map(char => (
            <div key={char.id} className="text-sm p-2 bg-gray-50 rounded mb-1">
              {char.name} - {char.role}
            </div>
          ))}
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Scenarios ({content.scenarios.length})</h4>
          {content.scenarios.map(scenario => (
            <div key={scenario.id} className="text-sm p-2 bg-gray-50 rounded mb-1">
              {scenario.title}
            </div>
          ))}
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Knowledge Points ({content.knowledgePoints.length})</h4>
          {content.knowledgePoints.map(knowledge => (
            <div key={knowledge.id} className="text-sm p-2 bg-gray-50 rounded mb-1">
              {knowledge.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Modal placeholder components (would be fully implemented in production)
function CharacterEditorModal({ character, isOpen, onClose, onUpdate }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Character</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Character Name</Label>
            <Input
              value={character.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Enter character name"
            />
          </div>
          {/* Additional character editing fields would go here */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ScenarioEditorModal({ scenario, isOpen, onClose, onUpdate }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Scenario</DialogTitle>
        </DialogHeader>
        {/* Scenario editing form would go here */}
      </DialogContent>
    </Dialog>
  )
}

function KnowledgeEditorModal({ knowledgePoint, isOpen, onClose, onUpdate }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Knowledge Point</DialogTitle>
        </DialogHeader>
        {/* Knowledge point editing form would go here */}
      </DialogContent>
    </Dialog>
  )
}