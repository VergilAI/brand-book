import TTSButton from './TTSButton'

export default {
  title: 'Voice/TTSButton',
  component: TTSButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

// Sample text for testing
const sampleText = `
Welcome to our AI learning platform. This is a demonstration of Google Cloud Text-to-Speech integration.
The neural voice technology provides natural-sounding speech that enhances the learning experience.
You can use this feature to listen to any text content in your courses.
`

const longText = `
Artificial Intelligence represents one of the most transformative technologies of our time. 
From machine learning algorithms that can recognize patterns in vast datasets to neural networks 
that mimic human brain functions, AI is revolutionizing how we solve complex problems.

In the field of education, AI-powered tools are personalizing learning experiences, 
providing adaptive feedback, and helping students achieve their learning objectives more effectively. 
Text-to-speech technology, like what you're hearing now, makes content more accessible 
and supports different learning styles.

The future of AI in education holds tremendous promise for creating more inclusive, 
effective, and engaging learning environments for students around the world.
`

export const Default = {
  args: {
    text: sampleText,
    onPlayStart: () => console.log('TTS playback started'),
    onPlayEnd: () => console.log('TTS playback ended'),
  },
}

export const WithLongText = {
  args: {
    text: longText,
    onPlayStart: () => console.log('Long text playback started'),
    onPlayEnd: () => console.log('Long text playback ended'),
  },
}

export const WithCustomClassName = {
  args: {
    text: sampleText,
    className: 'max-w-xs',
    onPlayStart: () => console.log('Custom styled TTS started'),
    onPlayEnd: () => console.log('Custom styled TTS ended'),
  },
}

export const EmptyText = {
  args: {
    text: '',
    onPlayStart: () => console.log('Should not start with empty text'),
    onPlayEnd: () => console.log('Should not end with empty text'),
  },
}

export const ShortText = {
  args: {
    text: 'Hello world!',
    onPlayStart: () => console.log('Short text started'),
    onPlayEnd: () => console.log('Short text ended'),
  },
}

// Example usage in a learning context
export const LearningExample = {
  render: () => (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-bg-secondary p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Lesson 1: Introduction to Machine Learning
        </h3>
        <p className="text-text-secondary text-sm mb-4">
          Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed.
        </p>
        <TTSButton
          text="Machine learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed."
          onPlayStart={() => console.log('Lesson audio started')}
          onPlayEnd={() => console.log('Lesson audio completed')}
        />
      </div>
      
      <div className="bg-bg-secondary p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Key Concepts
        </h3>
        <p className="text-text-secondary text-sm mb-4">
          There are three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning. Each approach has different applications and use cases.
        </p>
        <TTSButton
          text="There are three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning. Each approach has different applications and use cases."
          onPlayStart={() => console.log('Key concepts audio started')}
          onPlayEnd={() => console.log('Key concepts audio completed')}
        />
      </div>
    </div>
  ),
}