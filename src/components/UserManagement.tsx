import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  TextField,
  Grid,
  Typography,
  Divider,
  Box,
  Tabs,
  Tab,
  InputAdornment,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { firebaseService } from '../services/firebase';
import { User, AdminSettings } from '../types';
import { useAdminSettings } from '../hooks/useFirestore';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const { settings, loading: settingsLoading, error: settingsError } = useAdminSettings();
  const [formData, setFormData] = useState<Partial<AdminSettings>>({
    isGalway: false,
    isOutsideGalway: false,
    isDiscount: false,
    discountCode: '',
    galwayFee: 0,
    outsideGalwayFee: 0,
    galwayDeliveryTime: 0,
    outsideGalwayDeliveryTime: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await firebaseService.getAllUsers();
        setUsers(usersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleOpenDialog = (user: User) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleUpdateUserRole = async (userId: string, isAdmin: boolean) => {
    try {
      await firebaseService.updateUserRole(userId, isAdmin);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin } : user
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
    }
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      await firebaseService.updateAdminSettings(formData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    }
  };

  if (loading || settingsLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error || settingsError) {
    return <Alert severity="error">{error || settingsError}</Alert>;
  }

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Users" />
          <Tab label="Settings" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.isAdmin}
                      onChange={(e) => handleUpdateUserRole(user.id!, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(user)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Delivery Settings</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isGalway}
                    onChange={handleSettingsChange}
                    name="isGalway"
                  />
                }
                label="Enable Galway Delivery"
              />
              {formData.isGalway && (
                <>
                  <TextField
                    fullWidth
                    label="Galway Delivery Fee"
                    name="galwayFee"
                    type="number"
                    value={formData.galwayFee}
                    onChange={handleSettingsChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Galway Delivery Time (minutes)"
                    name="galwayDeliveryTime"
                    type="number"
                    value={formData.galwayDeliveryTime}
                    onChange={handleSettingsChange}
                    margin="normal"
                  />
                </>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isOutsideGalway}
                    onChange={handleSettingsChange}
                    name="isOutsideGalway"
                  />
                }
                label="Enable Outside Galway Delivery"
              />
              {formData.isOutsideGalway && (
                <>
                  <TextField
                    fullWidth
                    label="Outside Galway Delivery Fee"
                    name="outsideGalwayFee"
                    type="number"
                    value={formData.outsideGalwayFee}
                    onChange={handleSettingsChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Outside Galway Delivery Time (minutes)"
                    name="outsideGalwayDeliveryTime"
                    type="number"
                    value={formData.outsideGalwayDeliveryTime}
                    onChange={handleSettingsChange}
                    margin="normal"
                  />
                </>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>Discount Settings</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isDiscount}
                    onChange={handleSettingsChange}
                    name="isDiscount"
                  />
                }
                label="Enable Discount Code"
              />
              {formData.isDiscount && (
                <>
                  <TextField
                    fullWidth
                    label="Discount Code"
                    name="discountCode"
                    value={formData.discountCode}
                    onChange={handleSettingsChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Discount Percentage"
                    name="discountPercentage"
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      inputProps: { min: 0, max: 100 }
                    }}
                    value={formData.discountPercentage || 0}
                    onChange={handleSettingsChange}
                    margin="normal"
                    helperText="Enter a value between 0 and 100"
                  />
                </>
              )}
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </Box>
        </Paper>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <div>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phone}</p>
              <FormControlLabel
                control={
                  <Switch
                    checked={selectedUser.isAdmin}
                    onChange={(e) => handleUpdateUserRole(selectedUser.id!, e.target.checked)}
                  />
                }
                label="Admin Access"
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserManagement; 