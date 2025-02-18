# Pair Programming Board
> Web app for managing pair programming assignments, features, and sprints.

## Features

- 📋 **Feature Management**
  - Create, edit, and delete features
  - Assign pairs to features
  - Track feature status (todo, in-progress, review, done)
  - Add markdown-supported notes and goals
  - Clone features across sprints

- 👥 **Team Management**
  - Add and remove team members
  - Track pair assignments
  - View team member profiles and contribution history
  - Search and filter team pairs

- 🏃 **Sprint Planning**
  - Create and manage sprints
  - Set sprint goals and dates
  - Copy sprints with features
  - Filter features by sprint

- 💻 **Modern UI/UX**
  - Responsive design
  - Dark mode support
  - Smooth animations
  - Command palette (⌘/Ctrl + K)
  - Keyboard shortcuts

- 💾 **Data Management**
  - Local storage persistence
  - Import/Export functionality
  - Demo data loading

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [date-fns](https://date-fns.org/) - Date utilities
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pair-programming-board.git
cd pair-programming-board
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The static files will be generated in the \`out\` directory.

## Keyboard Shortcuts

- `⌘/Ctrl + K` - Open command palette
- `Alt + N` - Add new feature
- `Alt + M` - Add team member
- `Alt + S` - Add sprint
- `Alt + C` - Copy sprint
- `Alt + D` - Load demo data
- `Alt + E` - Export data
- `Alt + I` - Import data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

WTFPL
