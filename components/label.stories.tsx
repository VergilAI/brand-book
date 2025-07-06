import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';
import { Input } from './input';
import { Checkbox } from './atomic/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Textarea } from './textarea';
import { InfoIcon, AlertCircle } from 'lucide-react';

const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Form label component for associating text with form controls. Built on Radix UI Label primitive.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Label text content',
      defaultValue: 'Label',
    },
    htmlFor: {
      control: 'text',
      description: 'ID of the form control this label is associated with',
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Enter your email" />
    </div>
  ),
};

export const RequiredField: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="required-field">
        Username
        <span className="text-red-500 ml-1">*</span>
      </Label>
      <Input id="required-field" placeholder="Enter username" required />
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" placeholder="Enter password" />
        <p className="text-sm text-muted-foreground">
          Must be at least 8 characters long
        </p>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="username-helper">
          Username
          <InfoIcon className="inline-block w-3 h-3 ml-1 text-muted-foreground" />
        </Label>
        <Input id="username-helper" placeholder="@username" />
        <p className="text-sm text-muted-foreground">
          This will be your public display name
        </p>
      </div>
    </div>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="error-input" className="text-destructive">
        Email Address
      </Label>
      <Input 
        id="error-input" 
        type="email"
        placeholder="Enter email"
        className="border-destructive"
        defaultValue="invalid-email"
      />
      <div className="flex items-center gap-1.5 text-sm text-destructive">
        <AlertCircle className="h-3 w-3" />
        <span>Please enter a valid email address</span>
      </div>
    </div>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="small" className="text-xs">
          Small Label
        </Label>
        <Input id="small" placeholder="Small input" className="h-8 text-sm" />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="default">
          Default Label
        </Label>
        <Input id="default" placeholder="Default input" />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="large" className="text-base">
          Large Label
        </Label>
        <Input id="large" placeholder="Large input" className="h-12 text-base" />
      </div>
    </div>
  ),
};

export const WithFormControls: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      {/* Input Field */}
      <div className="grid gap-1.5">
        <Label htmlFor="input-control">Text Input</Label>
        <Input id="input-control" placeholder="Enter text" />
      </div>

      {/* Textarea */}
      <div className="grid gap-1.5">
        <Label htmlFor="textarea-control">Message</Label>
        <Textarea 
          id="textarea-control" 
          placeholder="Type your message here"
          className="min-h-[100px]"
        />
      </div>

      {/* Select */}
      <div className="grid gap-1.5">
        <Label htmlFor="select-control">Country</Label>
        <Select>
          <SelectTrigger id="select-control">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="uk">United Kingdom</SelectItem>
            <SelectItem value="ca">Canada</SelectItem>
            <SelectItem value="au">Australia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox id="checkbox-control" />
        <Label 
          htmlFor="checkbox-control" 
          className="text-sm font-normal cursor-pointer"
        >
          I agree to the terms and conditions
        </Label>
      </div>

      {/* Multiple Checkboxes */}
      <div className="space-y-3">
        <Label>Notification Preferences</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="email-notif" defaultChecked />
            <Label htmlFor="email-notif" className="font-normal cursor-pointer">
              Email notifications
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="sms-notif" />
            <Label htmlFor="sms-notif" className="font-normal cursor-pointer">
              SMS notifications
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="push-notif" />
            <Label htmlFor="push-notif" className="font-normal cursor-pointer">
              Push notifications
            </Label>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const DisabledState: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5 opacity-50">
        <Label htmlFor="disabled-input">
          Disabled Field
        </Label>
        <Input 
          id="disabled-input" 
          placeholder="Cannot edit" 
          disabled 
        />
      </div>

      <div className="flex items-center space-x-2 opacity-50">
        <Checkbox id="disabled-checkbox" disabled />
        <Label 
          htmlFor="disabled-checkbox" 
          className="text-sm font-normal cursor-not-allowed"
        >
          This option is currently unavailable
        </Label>
      </div>
    </div>
  ),
};

export const ComplexForm: Story = {
  render: () => (
    <form className="space-y-6 w-full max-w-md">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Account Information</h3>
        
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="full-name">
              Full Name
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input id="full-name" placeholder="John Doe" required />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="email-complex">
              Email Address
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input 
              id="email-complex" 
              type="email" 
              placeholder="john@example.com" 
              required 
            />
            <p className="text-sm text-muted-foreground">
              We'll never share your email with anyone else
            </p>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="phone">
              Phone Number
              <span className="text-muted-foreground text-sm font-normal ml-2">
                (Optional)
              </span>
            </Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="+1 (555) 123-4567" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Preferences</h3>
        
        <div className="space-y-3">
          <Label htmlFor="email-frequency">Email Frequency</Label>
          <Select defaultValue="weekly">
            <SelectTrigger id="email-frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily digest</SelectItem>
              <SelectItem value="weekly">Weekly summary</SelectItem>
              <SelectItem value="monthly">Monthly newsletter</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Additional Options</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="marketing" />
              <Label htmlFor="marketing" className="text-sm font-normal cursor-pointer">
                Receive marketing emails
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="updates" defaultChecked />
              <Label htmlFor="updates" className="text-sm font-normal cursor-pointer">
                Receive product updates
              </Label>
            </div>
          </div>
        </div>
      </div>
    </form>
  ),
};