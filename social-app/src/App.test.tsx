import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';

// Mock the fetch function for API calls
const mockFetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ code: 0, message: 'success', data: [] }),
  })
) as jest.Mock;

global.fetch = mockFetch;

// Mock the navigator.onLine property
Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true,
});

// Suppress console.log during tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

beforeEach(() => {
  jest.clearAllMocks();
});

test('renders app with bottom navigation', async () => {
  await act(async () => {
    render(<App />);
  });
  
  const navElements = screen.getAllByRole('navigation');
  expect(navElements.length).toBeGreaterThan(0);
});

test('renders home page with video platform title', async () => {
  await act(async () => {
    render(<App />);
  });
  
  const homeTitle = screen.getByText(/影视/i);
  expect(homeTitle).toBeInTheDocument();
});

test('renders bottom navigation with all tabs', async () => {
  await act(async () => {
    render(<App />);
  });
  
  expect(screen.getByText('首页')).toBeInTheDocument();
  expect(screen.getByText('暗网')).toBeInTheDocument();
  expect(screen.getByText('直播')).toBeInTheDocument();
  expect(screen.getByText('游戏')).toBeInTheDocument();
  expect(screen.getByText('我的')).toBeInTheDocument();
});

test('renders app container with dark theme', async () => {
  await act(async () => {
    render(<App />);
  });
  
  const container = document.querySelector('.app-container');
  expect(container).toHaveClass('dark-theme');
});
