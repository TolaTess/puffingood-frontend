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
  CardMedia,
  CardActions,
  CardContent,
  Paper,
  Chip,
  Stack,
} from '@mui/material';

// Import images
import classicImg from '../assets/puff/classic.jpg';
import premiumImg from '../assets/puff/premium.jpg';
import halfHalfImg from '../assets/puff/half-half.jpg';

// Static featured items
const FEATURED_ITEMS = [
  {
    id: '1',
    name: 'Classic Puff',
    description: 'Our signature classic puff puff',
    price: 5.99,
    imagePath: classicImg,
  },
  {
    id: '2',
    name: 'Premium Puff',
    description: 'Premium puff puff with special ingredients',
    price: 7.99,
    imagePath: premiumImg,
  },
  {
    id: '3',
    name: 'Half & Half',
    description: 'Best of both worlds',
    price: 6.99,
    imagePath: halfHalfImg,
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #40E0D0 0%, #7EE8E0 100%)',
          color: 'white',
          py: 10,
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', color: 'white' }}
          >
            Welcome to PuffinGood
          </Typography>
          <Typography
            variant="h6"
            align="center"
            paragraph
            sx={{ mb: 4, color: 'white' }}
          >
           Experience the joy of freshly made Puff Puffs - order now and get them delivered straight to your door!
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
                  bgcolor: 'grey.200',
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
     <Container maxWidth="lg" sx={{ overflow: 'hidden' }}>
        <Typography
          component="h2"
          variant="h4"
          align="center"
          gutterBottom
          sx={{ mb: 4 }}
        >
          PuffinGood Gallery
        </Typography>
        <Box
          sx={{
            display: 'flex',
            width: 'max-content',
            animation: 'scroll 20s linear infinite',
            '@keyframes scroll': {
              '0%': {
                transform: 'translateX(0)',
              },
              '100%': {
                transform: 'translateX(-50%)',
              },
            },
          }}
        >
          {/* First set of images */}
          {FEATURED_ITEMS.map((item) => (
            <Box
              key={item.id}
              sx={{
                width: 300,
                height: 200,
                mx: 2,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <img
                src={item.imagePath}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
          {/* Duplicate set of images for seamless loop */}
          {FEATURED_ITEMS.map((item) => (
            <Box
              key={`${item.id}-duplicate`}
              sx={{
                width: 300,
                height: 200,
                mx: 2,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <img
                src={item.imagePath}
                alt={item.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          ))}
        </Box>
      </Container>


      {/* Features Section */}
      <Box
        sx={{
          bgcolor: 'background.default',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h4"
            align="center"
            gutterBottom
            sx={{ 
              mb: 6,
              color: 'text.primary',
              fontWeight: 'bold'
            }}
          >
            Why Choose PuffinGood?
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'white',
                  borderRadius: 3,
                  height: '100%',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ mb: 2, color: 'secondary.main' }}
                >
                  🚚
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 'bold', color: 'text.primary' }}
                >
                  Fresh Delivery
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Delivered fresh every Wednesday via DPD. Made to order for the best quality.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'white',
                  borderRadius: 3,
                  height: '100%',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ mb: 2, color: 'secondary.main' }}
                >
                  🌱
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 'bold', color: 'text.primary' }}
                >
                  Traditional Recipe
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Authentic West African puff puff recipe passed down through generations.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'white',
                  borderRadius: 3,
                  height: '100%',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{ mb: 2, color: 'secondary.main' }}
                >
                  🏪
                </Typography>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 'bold', color: 'text.primary' }}
                >
                  Local Collection
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Available for collection at the local Galway market. Contact us to arrange pickup.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 