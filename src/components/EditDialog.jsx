import React from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from '@mui/material';

const EditDialog = ({ isEditDialogOpen, closeEditDialog, editedRowData, setEditedRowData, saveEditedData }) => {

  return (
    <Dialog open={isEditDialogOpen} onClose={closeEditDialog}>
    <DialogTitle>Edit Row</DialogTitle>
    <DialogContent>
      {editedRowData && (
        <Grid container mt={2} spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              value={editedRowData.name}
              onChange={(e) =>
                setEditedRowData({ ...editedRowData, name: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              value={editedRowData.email}
              onChange={(e) =>
                setEditedRowData({ ...editedRowData, email: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Role"
              value={editedRowData.role}
              onChange={(e) =>
                setEditedRowData({ ...editedRowData, role: e.target.value })
              }
              fullWidth
            />
          </Grid>
        </Grid>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={closeEditDialog}>Cancel</Button>
      <Button onClick={saveEditedData} color="primary">
        Save
      </Button>
    </DialogActions>
  </Dialog>
  );
};

export default EditDialog;