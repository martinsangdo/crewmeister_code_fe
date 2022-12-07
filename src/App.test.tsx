import React from 'react';
import { render, screen } from '@testing-library/react';
import Absences from './components/absences';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

test('renders absences link', () => {
  const mockStore = configureStore();
  let store = mockStore({});
  render(<Provider store={store}><Absences/></Provider>);
  const linkElement = screen.getByText(/Search absences by date/i);
  expect(linkElement).toBeInTheDocument();
});
