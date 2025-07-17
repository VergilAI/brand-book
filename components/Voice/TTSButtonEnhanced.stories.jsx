import TTSButtonEnhanced from './TTSButtonEnhanced'

export default {
  title: 'Voice/TTSButtonEnhanced',
  component: TTSButtonEnhanced,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'The text to be converted to speech',
    },
    showTranscript: {
      control: 'boolean',
      description: 'Whether to show the transcript below the player',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
}

const sampleTexts = {
  short: "Welcome to the enhanced text-to-speech player.",
  medium: "This is an improved version of the text-to-speech component. It features a cleaner interface with a single progress bar, volume control, and the ability to seek through the audio. The design is more intuitive and follows modern audio player conventions.",
  long: "Artificial Intelligence, often abbreviated as AI, refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. The field of AI research was founded on the claim that human intelligence can be so precisely described that a machine can be made to simulate it. This has led to numerous breakthroughs in machine learning, natural language processing, computer vision, and robotics. Today, AI systems can perform tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation.",
  learningContent: "In this lesson, we'll explore the fundamentals of machine learning. Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. There are three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning. Each type has its own unique characteristics and applications in real-world scenarios."
}

// Default story
export const Default = {
  args: {
    text: sampleTexts.short,
    showTranscript: false,
  },
}

// With transcript visible
export const WithTranscript = {
  args: {
    text: sampleTexts.medium,
    showTranscript: true,
  },
}

// Long content
export const LongContent = {
  args: {
    text: sampleTexts.long,
    showTranscript: true,
  },
}

// Learning material example
export const LearningMaterial = {
  args: {
    text: sampleTexts.learningContent,
    showTranscript: true,
  },
}

// Error state (empty text)
export const EmptyText = {
  args: {
    text: "",
    showTranscript: false,
  },
}

// Interactive example with callbacks
export const WithCallbacks = {
  args: {
    text: sampleTexts.medium,
    showTranscript: false,
    onPlayStart: () => console.log('Playback started'),
    onPlayEnd: () => console.log('Playback ended'),
  },
}

// Multiple instances
export const MultipleInstances = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-2">Section 1: Introduction</h3>
      <TTSButtonEnhanced 
        text="Welcome to our comprehensive guide on artificial intelligence." 
        showTranscript={true}
      />
    </div>
    
    <div>
      <h3 className="text-lg font-semibold mb-2">Section 2: Definition</h3>
      <TTSButtonEnhanced 
        text="Artificial Intelligence is the simulation of human intelligence processes by machines, especially computer systems." 
        showTranscript={true}
      />
    </div>
    
    <div>
      <h3 className="text-lg font-semibold mb-2">Section 3: Applications</h3>
      <TTSButtonEnhanced 
        text="AI has numerous applications including natural language processing, expert systems, and machine vision." 
        showTranscript={true}
      />
    </div>
  </div>
)

// Comparison with original
export const ComparisonWithOriginal = () => (
  <div className="space-y-8">
    <div>
      <h3 className="text-lg font-semibold mb-4 text-text-primary">Enhanced TTS Player (New)</h3>
      <TTSButtonEnhanced 
        text={sampleTexts.medium}
        showTranscript={true}
      />
    </div>
    
    <hr className="border-border-subtle" />
    
    <div>
      <h3 className="text-lg font-semibold mb-4 text-text-primary">Original TTS Button</h3>
      <p className="text-sm text-text-secondary mb-4">
        The original component had duplicate progress bars and a more cluttered interface.
      </p>
    </div>
  </div>
)

// Custom styling example
export const CustomStyling = {
  args: {
    text: sampleTexts.short,
    showTranscript: true,
    className: "max-w-md mx-auto",
  },
}