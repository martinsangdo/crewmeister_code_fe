import React from 'react';
import { render, screen } from '@testing-library/react';
import Absences from './components/absences';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

//some required components must be in the page
test('renders absences components', () => {
  const mockStore = configureStore();
  let store = mockStore({});
  render(<Provider store={store}><Absences/></Provider>);
  const btnSearch = screen.getByText(/Search absences by date/i); //this is button
  const total = screen.getByText(/Total items/i); //total items
  //todo more
  expect(btnSearch).toBeInTheDocument();
  expect(total).toBeInTheDocument();
});

