import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Get started button on landing page', () => {
  render(<App />);
  const button = screen.getByRole('button', { name: /get started/i });
  expect(button).toBeInTheDocument();
});
