# Jest Testing Setup for Crowdfunding dApp

## Overview
Successfully set up Jest with React Testing Library for the crowdfunding dApp. All animations have been removed and the application is now testable.

## Test Files Created
1. `__tests__/Card.simple.test.js` - Tests for the Card component
2. `__tests__/Hero.working.test.js` - Tests for the Hero component

## Tests Passing
- **Card Component (3 tests)**:
  - Renders campaign information correctly
  - Shows donate button when user is not owner
  - Opens donation popup when donate button is clicked

- **Hero Component (6 tests)**:
  - Renders hero section with key elements
  - Has launch campaign button
  - Title input can be updated
  - Description textarea can be updated
  - Shows file upload area
  - Displays footer features

## Configuration Files
- `jest.config.js` - Jest configuration with Next.js integration
- `jest.setup.js` - Global test setup with mocks for Next.js, Web3, and other dependencies

## Test Scripts Added
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Key Mocks Implemented
- Next.js router and Image component
- Web3Modal and Ethers.js
- CrowdFunding context
- Canvas-confetti
- React-hot-toast
- Window.ethereum
- IntersectionObserver and ResizeObserver

## Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- __tests__/Card.simple.test.js

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

## Notes
- All framer-motion animations have been successfully removed
- Components are now fully testable without animation dependencies
- Tests focus on core functionality: rendering, user interactions, and state management
