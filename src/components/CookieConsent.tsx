import { useState, useEffect } from 'react';
import {
  Snackbar,
  Button,
  Link,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setOpen(false);
    setDialogOpen(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setOpen(false);
    setDialogOpen(false);
    // You might want to disable certain features or redirect users
    // when they decline cookies
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            width: '100%',
            maxWidth: '600px',
            bgcolor: 'background.paper',
            color: 'text.primary',
          },
        }}
      >
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 3 }}>
          <Typography variant="body1" gutterBottom>
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 2, justifyContent: 'flex-end' }}>
            <Button color="primary" onClick={handleOpenDialog}>
              Cookie Settings
            </Button>
            <Button color="primary" onClick={handleDecline} variant="outlined">
              Decline
            </Button>
            <Button color="primary" onClick={handleAccept} variant="contained">
              Accept
            </Button>
          </Box>
        </Box>
      </Snackbar>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Cookie Settings</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            We use cookies and similar technologies to provide the following services:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Essential Cookies"
                secondary="Required for the website to function properly. These cannot be disabled. They include session management and security features."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Authentication Cookies"
                secondary="Used to remember your login status and preferences."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Payment Processing"
                secondary="Required for processing payments securely through Stripe."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Shopping Cart"
                secondary="Used to remember items in your shopping cart."
              />
            </ListItem>
          </List>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            For more information, please read our{' '}
            <Link component={RouterLink} to="/privacy-policy">
              Privacy Policy
            </Link>
            {' '}and{' '}
            <Link component={RouterLink} to="/terms-and-conditions">
              Terms and Conditions
            </Link>
            .
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button onClick={handleDecline} color="primary">
            Decline All
          </Button>
          <Button onClick={handleAccept} color="primary" variant="contained">
            Accept All
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CookieConsent; 