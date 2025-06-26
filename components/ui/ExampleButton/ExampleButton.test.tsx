import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExampleButton } from './ExampleButton';

describe('ExampleButton', () => {
  it('renders children correctly', () => {
    render(<ExampleButton>Test content</ExampleButton>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { container } = render(
      <ExampleButton variant="secondary">Content</ExampleButton>
    );
    expect(container.firstChild).toHaveClass('secondary-styles');
  });

  it('applies size classes', () => {
    const { container } = render(
      <ExampleButton size="lg">Content</ExampleButton>
    );
    expect(container.firstChild).toHaveClass('size-lg');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ExampleButton ref={ref}>Content</ExampleButton>);
    expect(ref.current).toBeInTheDocument();
  });
});
