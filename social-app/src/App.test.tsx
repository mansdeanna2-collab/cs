import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app with bottom navigation', () => {
  render(<App />);
  const navElements = screen.getAllByRole('navigation');
  expect(navElements.length).toBeGreaterThan(0);
});

test('renders home page with video platform title', () => {
  render(<App />);
  const homeTitle = screen.getByText(/影视/i);
  expect(homeTitle).toBeInTheDocument();
});

test('renders bottom navigation with all tabs', () => {
  render(<App />);
  expect(screen.getByText('首页')).toBeInTheDocument();
  expect(screen.getByText('暗网')).toBeInTheDocument();
  expect(screen.getByText('直播')).toBeInTheDocument();
  expect(screen.getByText('游戏')).toBeInTheDocument();
  expect(screen.getByText('我的')).toBeInTheDocument();
});
