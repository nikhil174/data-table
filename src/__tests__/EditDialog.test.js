import React from 'react';
import { render, screen } from '@testing-library/react';
import EditDialog from '../components/EditDialog';

describe('EditDialog Component', () => {
  it('renders with initial values', () => {
    // Mocked function to set edited data
    const setEditedRowDataMock = jest.fn();

    // Render the EditDialog with initial values and the mock function
    render(
      <EditDialog
        isEditDialogOpen={true}
        closeEditDialog={() => { }}
        editedRowData={{ name: 'John', email: 'john@example.com', role: 'User' }}
        setEditedRowData={setEditedRowDataMock}
        saveEditedData={() => { }}
      />
    );

    // Find the text fields
    const nameField = screen.getByLabelText('Name');
    const emailField = screen.getByLabelText('Email');
    const roleField = screen.getByLabelText('Role');

    // Check if the text fields have the correct initial values
    expect(nameField.value).toBe('John');
    expect(emailField.value).toBe('john@example.com');
    expect(roleField.value).toBe('User');
  });
});
