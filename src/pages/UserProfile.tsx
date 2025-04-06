import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { RootState } from '../store';
import { firebaseService } from '../services/firebase';
import { User } from '../types';

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Ireland',
  });

  useEffect(() => {
    if (user?.id) {
      // Load user data from Firestore
      const loadUserData = async () => {
        try {
          const userData = await firebaseService.getUserProfile(user.id);
          if (userData) {
            setFormData({
              name: userData.name || '',
              phone: userData.phone || '',
              address: userData.address || '',
              city: userData.city || '',
              state: userData.state || '',
              zipCode: userData.zipCode || '',
              country: userData.country || 'Ireland',
            });
          }
        } catch (err) {
          setError('Failed to load user data');
        }
      };
      loadUserData();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    if (formData.country !== 'Ireland') {
      setError('Sorry, we currently only deliver to Ireland');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await firebaseService.updateUserProfile(user.id, formData);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Please log in to view your profile
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your account information
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Louth"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Zip Code"
          value={formData.zipCode}
          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Country"
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          margin="normal"
          required
          disabled
          helperText="We currently only deliver to Ireland"
        />

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default UserProfile; 