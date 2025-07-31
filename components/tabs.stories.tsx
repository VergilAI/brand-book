import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Card } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { 
  Home, 
  User, 
  Settings, 
  Bell, 
  FileText, 
  Calendar,
  BarChart,
  Package,
  CreditCard,
  Lock
} from 'lucide-react';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A tabs component for organizing content into separate views. Built on Radix UI Tabs primitive.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Account Settings</h3>
            <p className="text-sm text-muted-foreground">
              Make changes to your account here. Click save when you're done.
            </p>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john@example.com" />
            </div>
            <Button>Save changes</Button>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Password</h3>
            <p className="text-sm text-muted-foreground">
              Change your password here. After saving, you'll be logged out.
            </p>
            <div className="space-y-2">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
            <Button>Save password</Button>
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="team">
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Team Settings</h3>
            <p className="text-sm text-muted-foreground">
              Manage your team members and their permissions here.
            </p>
            <Button variant="secondary">Invite team member</Button>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue="dashboard" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="dashboard" icon={<Home className="h-4 w-4" />}>
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="analytics" icon={<BarChart className="h-4 w-4" />}>
          Analytics
        </TabsTrigger>
        <TabsTrigger value="notifications" icon={<Bell className="h-4 w-4" />}>
          Notifications
        </TabsTrigger>
        <TabsTrigger value="settings" icon={<Settings className="h-4 w-4" />}>
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Welcome to your dashboard. Here you can see an overview of your account.
          </p>
        </Card>
      </TabsContent>
      <TabsContent value="analytics">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Analytics</h3>
          <p className="text-sm text-muted-foreground">
            View detailed analytics and insights about your performance.
          </p>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Manage your notification preferences and view recent alerts.
          </p>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure your application settings and preferences.
          </p>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <Tabs defaultValue="inbox" className="w-[500px]">
      <TabsList>
        <TabsTrigger value="inbox" badge="12">
          Inbox
        </TabsTrigger>
        <TabsTrigger value="drafts" badge="3">
          Drafts
        </TabsTrigger>
        <TabsTrigger value="sent">
          Sent
        </TabsTrigger>
        <TabsTrigger value="archived" badge="99+">
          Archived
        </TabsTrigger>
      </TabsList>
      <TabsContent value="inbox">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Inbox</h3>
          <p className="text-sm text-muted-foreground">
            You have 12 new messages in your inbox.
          </p>
        </Card>
      </TabsContent>
      <TabsContent value="drafts">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Drafts</h3>
          <p className="text-sm text-muted-foreground">
            You have 3 draft messages waiting to be sent.
          </p>
        </Card>
      </TabsContent>
      <TabsContent value="sent">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Sent</h3>
          <p className="text-sm text-muted-foreground">
            View all your sent messages here.
          </p>
        </Card>
      </TabsContent>
      <TabsContent value="archived">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Archived</h3>
          <p className="text-sm text-muted-foreground">
            You have over 99 archived messages.
          </p>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const DisabledTabs: Story = {
  render: () => (
    <Tabs defaultValue="general" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="advanced" disabled>
          Advanced
        </TabsTrigger>
        <TabsTrigger value="experimental" disabled>
          Experimental
        </TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">General Settings</h3>
          <p className="text-sm text-muted-foreground">
            Configure your general application settings.
          </p>
        </Card>
      </TabsContent>
      <TabsContent value="security">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Security Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your security and privacy settings.
          </p>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Default Variant</h3>
        <Tabs defaultValue="tab1" className="w-[400px]">
          <TabsList variant="default">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <Card className="p-4">
              <p className="text-sm">Default variant content</p>
            </Card>
          </TabsContent>
          <TabsContent value="tab2">
            <Card className="p-4">
              <p className="text-sm">Tab 2 content</p>
            </Card>
          </TabsContent>
          <TabsContent value="tab3">
            <Card className="p-4">
              <p className="text-sm">Tab 3 content</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Pills Variant</h3>
        <Tabs defaultValue="tab1" className="w-[400px]">
          <TabsList variant="pills">
            <TabsTrigger value="tab1" variant="pills">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" variant="pills">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3" variant="pills">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <Card className="p-4">
              <p className="text-sm">Pills variant content</p>
            </Card>
          </TabsContent>
          <TabsContent value="tab2">
            <Card className="p-4">
              <p className="text-sm">Tab 2 content</p>
            </Card>
          </TabsContent>
          <TabsContent value="tab3">
            <Card className="p-4">
              <p className="text-sm">Tab 3 content</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Underline Variant</h3>
        <Tabs defaultValue="tab1" className="w-[400px]">
          <TabsList variant="underline">
            <TabsTrigger value="tab1" variant="underline">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" variant="underline">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3" variant="underline">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <Card className="p-4">
              <p className="text-sm">Underline variant content</p>
            </Card>
          </TabsContent>
          <TabsContent value="tab2">
            <Card className="p-4">
              <p className="text-sm">Tab 2 content</p>
            </Card>
          </TabsContent>
          <TabsContent value="tab3">
            <Card className="p-4">
              <p className="text-sm">Tab 3 content</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  ),
};

export const VerticalOrientation: Story = {
  render: () => (
    <Tabs defaultValue="profile" orientation="vertical" className="flex gap-8 w-[600px]">
      <TabsList className="flex-col h-fit w-[200px]">
        <TabsTrigger value="profile" className="w-full justify-start">
          <User className="mr-2 h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="billing" className="w-full justify-start">
          <CreditCard className="mr-2 h-4 w-4" />
          Billing
        </TabsTrigger>
        <TabsTrigger value="team" className="w-full justify-start">
          <Package className="mr-2 h-4 w-4" />
          Team
        </TabsTrigger>
        <TabsTrigger value="security" className="w-full justify-start">
          <Lock className="mr-2 h-4 w-4" />
          Security
        </TabsTrigger>
      </TabsList>
      <div className="flex-1">
        <TabsContent value="profile">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Profile Settings</h3>
            <p className="text-sm text-muted-foreground">
              Manage your public profile and personal information.
            </p>
          </Card>
        </TabsContent>
        <TabsContent value="billing">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Billing & Subscription</h3>
            <p className="text-sm text-muted-foreground">
              Manage your billing information and subscription plans.
            </p>
          </Card>
        </TabsContent>
        <TabsContent value="team">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Team Management</h3>
            <p className="text-sm text-muted-foreground">
              Add or remove team members and manage their roles.
            </p>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Security Settings</h3>
            <p className="text-sm text-muted-foreground">
              Configure two-factor authentication and other security features.
            </p>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  ),
};

export const ScrollableTabs: Story = {
  render: () => (
    <div className="w-[600px]">
      <Tabs defaultValue="monday">
        <div className="overflow-x-auto">
          <TabsList className="w-max">
            <TabsTrigger value="monday">Monday</TabsTrigger>
            <TabsTrigger value="tuesday">Tuesday</TabsTrigger>
            <TabsTrigger value="wednesday">Wednesday</TabsTrigger>
            <TabsTrigger value="thursday">Thursday</TabsTrigger>
            <TabsTrigger value="friday">Friday</TabsTrigger>
            <TabsTrigger value="saturday">Saturday</TabsTrigger>
            <TabsTrigger value="sunday">Sunday</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="monday">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Monday Schedule</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your Monday schedule.
            </p>
          </Card>
        </TabsContent>
        <TabsContent value="tuesday">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Tuesday Schedule</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your Tuesday schedule.
            </p>
          </Card>
        </TabsContent>
        <TabsContent value="wednesday">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Wednesday Schedule</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your Wednesday schedule.
            </p>
          </Card>
        </TabsContent>
        <TabsContent value="thursday">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Thursday Schedule</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your Thursday schedule.
            </p>
          </Card>
        </TabsContent>
        <TabsContent value="friday">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Friday Schedule</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your Friday schedule.
            </p>
          </Card>
        </TabsContent>
        <TabsContent value="saturday">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Saturday Schedule</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your Saturday schedule.
            </p>
          </Card>
        </TabsContent>
        <TabsContent value="sunday">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-2">Sunday Schedule</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your Sunday schedule.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  ),
};