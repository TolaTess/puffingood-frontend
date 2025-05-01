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
      <Container maxWidth="lg" sx={{ overflow: 'hidden' }}>
        <Typography
          component="h2"
          variant="h4"
          align="center"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Menu Options
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
    </Box>
  );
};

export default Home; 