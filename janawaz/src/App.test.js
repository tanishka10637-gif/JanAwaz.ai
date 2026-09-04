import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the JanAwaz.ai product landing page with key sections', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /janawaz\.ai/i })).toBeInTheDocument();
  expect(screen.getByText(/^anonymous incident reporting for public accountability$/i)).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /report an incident/i }).length).toBeGreaterThan(0);
  expect(screen.getByText(/multi-channel routing/i)).toBeInTheDocument();
  expect(screen.getAllByText(/trust engine/i).length).toBeGreaterThan(0);
});
