import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app with navigation', () => {
  render(<App />);
  const navElement = screen.getByRole('navigation');
  expect(navElement).toBeInTheDocument();
});

test('renders home page by default', () => {
  render(<App />);
  const homeTitle = screen.getByText(/趣玩社区/i);
  expect(homeTitle).toBeInTheDocument();
});
