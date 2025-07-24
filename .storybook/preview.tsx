import type { Preview } from '@storybook/nextjs'
import React from 'react'
import { themes } from 'storybook/internal/theming'
import vergilTheme from './theme'
import '../app/globals.css'

const preview: Preview = {
  parameters: {
    docs: {
      theme: vergilTheme,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'deep-space',
      values: [
        {
          name: 'deep-space',
          value: '#0F172A',
        },
        {
          name: 'pure-light',
          value: '#FFFFFF',
        },
        {
          name: 'cosmic-purple',
          value: '#6366F1',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Design Tokens', 'Icons', 'Atomic', '*'],
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="font-sans antialiased">
        <Story />
      </div>
    ),
  ],
};

export default preview;