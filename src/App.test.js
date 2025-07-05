import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders Unified Service Management heading on landing page', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const heading = screen.getByText(/Unified Service Management/i);
  expect(heading).toBeInTheDocument();
});

test('renders Get started button on landing page', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const button = screen.getByRole('button', { name: /Get started/i });
  expect(button).toBeInTheDocument();
});
