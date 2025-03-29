import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { useFoods, useAdminSettings } from '../hooks/useFirestore';
import { Food } from '../types';

// Import images
import classicImg from '../assets/puff/classic.jpg';
import premiumImg from '../assets/puff/premium.jpg';
import halfHalfImg from '../assets/puff/half-half.jpg';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { foods, loading, error } = useFoods();
  const { settings, loading: settingsLoading } = useAdminSettings();

  // Get featured items (first 3 items from the menu)
  const featuredItems = foods.slice(0, 3);

  if (loading || settingsLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading featured items: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box>
      {/* Discount Banner */}
      {settings?.isDiscount && (
        <Paper
          elevation={0}
          sx={{
            bgcolor: 'secondary.main',
            color: 'white',
            py: 1,
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            🎉 Save {settings.discountPercentage}% with code:{' '}
            <span style={{ 
              backgroundColor: 'orange', 
              color: 'secondary.main', 
              padding: '2px 8px', 
              borderRadius: 4,
              fontFamily: 'monospace',
              letterSpacing: '1px'
            }}>
              {settings.discountCode}
            </span>
          </Typography>
        </Paper>
      )}

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Welcome to PuffinGood
          </Typography>
          <Typography
            variant="h5"
            align="center"
            paragraph
            sx={{ mb: 4 }}
          >
            Delicious puff puffs delivered to your doorstep
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/menu')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Order Now
            </Button>
            {!user && (
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Sign Up
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Featured Items */}
      <Container maxWidth="lg">
        <Typography
          component="h2"
          variant="h4"
          align="center"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Main Menu
        </Typography>
        <Grid container spacing={4}>
          {featuredItems.map((item) => (
            <Grid item key={item.id} xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.imagePath === 'classic' ? classicImg : item.imagePath === 'premium' ? premiumImg : halfHalfImg}
                  alt={item.name}
                />
              
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate('/menu')}
                  >
                    View Menu
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 