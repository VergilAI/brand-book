import type { Meta, StoryObj } from "@storybook/react"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select"

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-[280px]">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="mango">Mango</SelectItem>
          <SelectItem value="strawberry">Strawberry</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const WithGroups: Story = {
  render: () => (
    <div className="w-[280px]">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
            <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
            <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
            <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Europe & Africa</SelectLabel>
            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
            <SelectItem value="cet">Central European Time (CET)</SelectItem>
            <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
            <SelectItem value="west">Western European Summer Time (WEST)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[280px]">
      <Select size="sm">
        <SelectTrigger>
          <SelectValue placeholder="Small select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
          <SelectItem value="3">Option 3</SelectItem>
        </SelectContent>
      </Select>

      <Select size="md">
        <SelectTrigger>
          <SelectValue placeholder="Medium select (default)" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
          <SelectItem value="3">Option 3</SelectItem>
        </SelectContent>
      </Select>

      <Select size="lg">
        <SelectTrigger>
          <SelectValue placeholder="Large select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
          <SelectItem value="3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[280px]">
      <div>
        <label className="text-[var(--text-secondary)] text-[var(--font-size-sm)] mb-2 block">
          Normal State
        </label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
            <SelectItem value="3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-[var(--text-secondary)] text-[var(--font-size-sm)] mb-2 block">
          Error State
        </label>
        <Select>
          <SelectTrigger error>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
            <SelectItem value="3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-[var(--text-secondary)] text-[var(--font-size-sm)] mb-2 block">
          Disabled State
        </label>
        <Select disabled>
          <SelectTrigger disabled>
            <SelectValue placeholder="Disabled select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
            <SelectItem value="3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
}

export const WithDisabledItems: Story = {
  render: () => (
    <div className="w-[280px]">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select availability" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="busy">Busy</SelectItem>
          <SelectItem value="away" disabled>
            Away (Pro plan only)
          </SelectItem>
          <SelectItem value="dnd" disabled>
            Do not disturb (Pro plan only)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("")
    
    return (
      <div className="space-y-4">
        <div className="w-[280px]">
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select a framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next">Next.js</SelectItem>
              <SelectItem value="remix">Remix</SelectItem>
              <SelectItem value="gatsby">Gatsby</SelectItem>
              <SelectItem value="astro">Astro</SelectItem>
              <SelectItem value="vite">Vite</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-[var(--text-secondary)] text-[var(--font-size-sm)]">
          Selected value: <span className="text-[var(--text-emphasis)] font-[var(--font-weight-medium)]">{value || "none"}</span>
        </p>
      </div>
    )
  },
}

export const LongContent: Story = {
  render: () => (
    <div className="w-[280px]">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="us">United States</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="mx">Mexico</SelectItem>
          <SelectItem value="br">Brazil</SelectItem>
          <SelectItem value="ar">Argentina</SelectItem>
          <SelectItem value="uk">United Kingdom</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
          <SelectItem value="fr">France</SelectItem>
          <SelectItem value="it">Italy</SelectItem>
          <SelectItem value="es">Spain</SelectItem>
          <SelectItem value="pt">Portugal</SelectItem>
          <SelectItem value="nl">Netherlands</SelectItem>
          <SelectItem value="be">Belgium</SelectItem>
          <SelectItem value="ch">Switzerland</SelectItem>
          <SelectItem value="at">Austria</SelectItem>
          <SelectItem value="pl">Poland</SelectItem>
          <SelectItem value="ru">Russia</SelectItem>
          <SelectItem value="jp">Japan</SelectItem>
          <SelectItem value="cn">China</SelectItem>
          <SelectItem value="kr">South Korea</SelectItem>
          <SelectItem value="in">India</SelectItem>
          <SelectItem value="au">Australia</SelectItem>
          <SelectItem value="nz">New Zealand</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
}