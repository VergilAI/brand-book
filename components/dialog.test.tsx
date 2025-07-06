import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import { Button } from "./ui/button"

describe("Dialog", () => {
  it("renders trigger button", () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    expect(screen.getByRole("button", { name: "Open Dialog" })).toBeInTheDocument()
  })

  it("opens dialog on trigger click", () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>Test description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    const trigger = screen.getByRole("button", { name: "Open Dialog" })
    fireEvent.click(trigger)

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Test Dialog")).toBeInTheDocument()
    expect(screen.getByText("Test description")).toBeInTheDocument()
  })

  it("closes dialog on close button click", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    const closeButton = screen.getByRole("button", { name: "Close" })
    fireEvent.click(closeButton)

    // Dialog should be removed from DOM after animation
    setTimeout(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    }, 300)
  })

  it("renders with different sizes", () => {
    const sizes = ["sm", "default", "lg", "xl", "full"] as const

    sizes.forEach((size) => {
      const { container } = render(
        <Dialog defaultOpen>
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>{size} Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )

      const dialog = container.querySelector('[role="dialog"]')
      expect(dialog).toHaveClass(`max-w-${size === "default" ? "lg" : size}`)
    })
  })

  it("renders with different positions", () => {
    const positions = ["center", "top", "bottom", "left", "right"] as const

    positions.forEach((position) => {
      const { container } = render(
        <Dialog defaultOpen>
          <DialogContent position={position}>
            <DialogHeader>
              <DialogTitle>{position} Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )

      const dialog = container.querySelector('[role="dialog"]')
      expect(dialog?.className).toContain(position === "center" ? "left-[50%] top-[50%]" : position)
    })
  })

  it("renders footer with action buttons", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary">Cancel</Button>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Confirm" })).toBeInTheDocument()
  })

  it("applies custom className", () => {
    const { container } = render(
      <Dialog defaultOpen>
        <DialogContent className="custom-class">
          <DialogHeader>
            <DialogTitle>Custom Dialog</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    const dialog = container.querySelector('[role="dialog"]')
    expect(dialog).toHaveClass("custom-class")
  })

  it("has proper accessibility attributes", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accessible Dialog</DialogTitle>
            <DialogDescription>This dialog is accessible</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    const dialog = screen.getByRole("dialog")
    expect(dialog).toHaveAttribute("aria-modal", "true")
    
    const title = screen.getByText("Accessible Dialog")
    expect(title.tagName).toBe("H2")
    
    const description = screen.getByText("This dialog is accessible")
    expect(description).toBeInTheDocument()
  })
})