import React from 'react';
import { render } from '@testing-library/react';
import DataTable from '../components/DataTable';

describe('DataTable Component', () => {
  it('renders the DataTable component', () => {
    render(<DataTable />);
  });
});
