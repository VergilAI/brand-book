import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"

describe("Select", () => {
  it("renders with placeholder", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByText("Select an option")).toBeInTheDocument()
  })

  it("opens dropdown on click", async () => {
    const user = userEvent.setup()

    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    expect(screen.getByText("Option 1")).toBeInTheDocument()
    expect(screen.getByText("Option 2")).toBeInTheDocument()
  })

  it("selects an option", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    const option = screen.getByText("Option 1")
    await user.click(option)

    expect(onValueChange).toHaveBeenCalledWith("1")
  })

  it("renders with different sizes", () => {
    const { rerender } = render(
      <Select size="sm">
        <SelectTrigger>
          <SelectValue placeholder="Small" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    expect(trigger).toHaveClass("h-8")

    rerender(
      <Select size="md">
        <SelectTrigger>
          <SelectValue placeholder="Medium" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(trigger).toHaveClass("h-10")

    rerender(
      <Select size="lg">
        <SelectTrigger>
          <SelectValue placeholder="Large" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(trigger).toHaveClass("h-12")
  })

  it("renders error state", () => {
    render(
      <Select>
        <SelectTrigger error>
          <SelectValue placeholder="Error state" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    expect(trigger).toHaveAttribute("aria-invalid", "true")
  })

  it("renders disabled state", () => {
    render(
      <Select disabled>
        <SelectTrigger disabled>
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    expect(trigger).toBeDisabled()
  })

  it("renders disabled items", async () => {
    const user = userEvent.setup()

    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
          <SelectItem value="2" disabled>
            Option 2 (disabled)
          </SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    const disabledOption = screen.getByText("Option 2 (disabled)")
    expect(disabledOption.closest("[role='option']")).toHaveAttribute(
      "aria-disabled",
      "true"
    )
  })

  it("works as controlled component", async () => {
    const user = userEvent.setup()
    const ControlledSelect = () => {
      const [value, setValue] = React.useState("2")

      return (
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
            <SelectItem value="3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      )
    }

    render(<ControlledSelect />)

    expect(screen.getByText("Option 2")).toBeInTheDocument()

    const trigger = screen.getByRole("combobox")
    await user.click(trigger)

    const option3 = screen.getByText("Option 3")
    await user.click(option3)

    expect(screen.getByText("Option 3")).toBeInTheDocument()
  })
})