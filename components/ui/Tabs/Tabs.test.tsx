import { render, screen, fireEvent } from '@testing-library/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

describe('Tabs', () => {
  it('renders tabs with default variant', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )

    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Content 1')).toBeInTheDocument()
  })

  it('switches tabs on click', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )

    const tab2 = screen.getByText('Tab 2')
    fireEvent.click(tab2)

    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })

  it('renders with pills variant', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList variant="pills">
          <TabsTrigger value="tab1" variant="pills">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" variant="pills">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )

    const tabsList = screen.getByRole('tablist')
    expect(tabsList).toHaveClass('bg-transparent')
  })

  it('renders with underline variant', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList variant="underline">
          <TabsTrigger value="tab1" variant="underline">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" variant="underline">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )

    const tabsList = screen.getByRole('tablist')
    expect(tabsList).toHaveClass('border-b')
  })

  it('renders with icon', () => {
    const Icon = () => <span data-testid="icon">Icon</span>
    
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" icon={<Icon />}>Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    )

    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('renders with badge', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" badge="5">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    )

    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('respects disabled state', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )

    const disabledTab = screen.getByText('Tab 2').closest('button')
    expect(disabledTab).toBeDisabled()
  })

  it('applies custom className', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList className="custom-class">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>
    )

    const tabsList = screen.getByRole('tablist')
    expect(tabsList).toHaveClass('custom-class')
  })
})