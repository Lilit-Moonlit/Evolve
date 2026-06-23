# @evolve/ui

UI component library for Evolve - Decentralized Dating Application.

## Installation

```bash
npm install @evolve/ui
```

## Setup

Import the CSS file in your application:

```tsx
import "@evolve/ui";
```

## Components

### Basic Components

#### Button

```tsx
import { Button } from '@evolve/ui';

<Button variant="primary" size="md" onClick={() => console.log('Clicked')}>
  Click me
</Button>

<Button variant="secondary" size="lg">
  Secondary
</Button>

<Button variant="outline" size="sm">
  Outline
</Button>

<Button variant="ghost">
  Ghost
</Button>
```

#### Input

```tsx
import { Input } from '@evolve/ui';

<Input
  label="Name"
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

<Input
  label="Email"
  type="email"
  error="Invalid email address"
  placeholder="Enter your email"
/>
```

#### Card

```tsx
import { Card } from '@evolve/ui';

<Card>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

<Card onClick={() => console.log('Card clicked')}>
  <h3>Clickable Card</h3>
  <p>This card has a click handler</p>
</Card>
```

#### Modal

```tsx
import { Modal, Button } from "@evolve/ui";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Modal Title"
      >
        <p>Modal content goes here</p>
        <Button onClick={() => setIsOpen(false)}>Close</Button>
      </Modal>
    </>
  );
}
```

#### Form

```tsx
import { Form, FormField, Input, Button } from "@evolve/ui";

function MyForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormField label="Name">
        <Input placeholder="Enter your name" />
      </FormField>
      <FormField label="Email">
        <Input type="email" placeholder="Enter your email" />
      </FormField>
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

#### Select

```tsx
import { Select } from "@evolve/ui";

<Select
  label="Select an option"
  options={[
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ]}
  onChange={(e) => console.log(e.target.value)}
/>;
```

#### Checkbox

```tsx
import { Checkbox } from '@evolve/ui';

<Checkbox
  label="I agree to the terms"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>

<Checkbox
  label="Subscribe to newsletter"
  error="This field is required"
/>
```

### Evolve Components

#### ProfileCard

```tsx
import { ProfileCard } from "@evolve/ui";

<ProfileCard
  name="Alice"
  age="25"
  location="New York, USA"
  bio="Looking for meaningful connections"
  avatar="https://example.com/avatar.jpg"
  onConnect={() => console.log("Connect clicked")}
  onViewProfile={() => console.log("View profile clicked")}
/>;
```

#### MatchCard

```tsx
import { MatchCard } from "@evolve/ui";

<MatchCard
  name="Bob"
  matchScore={85}
  avatar="https://example.com/avatar.jpg"
  onLike={() => console.log("Like clicked")}
  onPass={() => console.log("Pass clicked")}
  onMessage={() => console.log("Message clicked")}
/>;
```

#### ChatMessage

```tsx
import { ChatMessage } from '@evolve/ui';

<ChatMessage
  message="Hello! How are you?"
  isOwn={false}
  timestamp={new Date()}
  avatar="https://example.com/avatar.jpg"
/>

<ChatMessage
  message="I'm doing great, thanks!"
  isOwn={true}
  timestamp={new Date()}
/>
```

### Navigation Components

#### Navigation

```tsx
import { Navigation } from "@evolve/ui";

<Navigation
  items={[
    { label: "Home", path: "/", icon: "🏠" },
    { label: "Matches", path: "/matches", icon: "💕" },
    { label: "Chat", path: "/chat", icon: "💬" },
    { label: "Profile", path: "/profile", icon: "👤" },
  ]}
/>;
```

#### Header

```tsx
import { Header } from "@evolve/ui";

<Header title="Evolve" logo="https://example.com/logo.png" />;
```

#### Footer

```tsx
import { Footer } from "@evolve/ui";

<Footer
  copyright="© 2026 Evolve - Decentralized Dating"
  links={[
    { label: "About", href: "/about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ]}
/>;
```

## Styling

This package uses Tailwind CSS for styling. Make sure you have Tailwind CSS configured in your project.

### Tailwind Configuration

Add the following to your `tailwind.config.js`:

```javascript
module.exports = {
  content: [
    "./node_modules/@evolve/ui/src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // ... rest of your config
};
```

## License

MIT
