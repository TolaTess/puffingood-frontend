import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  TextField,
  Divider,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { removeItem, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebase';
import { User } from '../types';
import { useAdminSettings } from '../hooks/useFirestore';

// Import images
import classicImg from '../assets/puff/classic.jpg';
import premiumImg from '../assets/puff/premium.jpg';
import halfHalfImg from '../assets/puff/half-half.jpg';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<User | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const { settings } = useAdminSettings();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percentage: number;
    type: 'regular' | 'family' | null;
  } | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!authUser?.id) return;
      
      try {
        const userData = await firebaseService.getUserProfile(authUser.id);
        if (userData) {
          setUser(userData);
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
      }
    };

    loadUserProfile();
  }, [authUser]);

  useEffect(() => {
    const calculateDeliveryFee = async () => {
      if (!user) {
        setDeliveryError('Please sign in to see delivery fees');
        return;
      }

      if (!user.city) {
        setDeliveryError('Please set your delivery address in your profile to see delivery fees');
        return;
      }
      
      try {
        const fee = await firebaseService.getDeliveryFee(user.city);
        setDeliveryFee(fee);
        if (fee === 0) {
          setDeliveryError('Delivery is not available in your area. Please check your delivery address.');
        } else {
          setDeliveryError(null);
        }
      } catch (err) {
        setDeliveryError('Unable to calculate delivery fee. Please check your delivery address.');
        console.error('Error calculating delivery fee:', err);
      }
    };

    calculateDeliveryFee();
  }, [user]);

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = items.find(item => item.id === itemId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeItem(itemId));
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate('/checkout', {
        state: {
          appliedDiscount: appliedDiscount ? {
            code: appliedDiscount.code,
            percentage: appliedDiscount.percentage,
            type: appliedDiscount.type
          } : null
        }
      });
    }
  };

  const handleApplyDiscount = () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }

    if (!settings) {
      setDiscountError('Unable to validate discount code');
      return;
    }

    // Check regular discount
    if (settings.isDiscount && settings.discountCode && 
        discountCode.trim().toLowerCase() === settings.discountCode.toLowerCase()) {
      setAppliedDiscount({
        code: settings.discountCode,
        percentage: settings.discountPercentage || 0,
        type: 'regular'
      });
      setDiscountError(null);
      return;
    }

    // Check family discount
    if (settings.isFamilyDiscount && settings.familyDiscountCode && 
        discountCode.trim().toLowerCase() === settings.familyDiscountCode.toLowerCase()) {
      setAppliedDiscount({
        code: settings.familyDiscountCode,
        percentage: settings.familyDiscountPercentage || 0,
        type: 'family'
      });
      setDiscountError(null);
      return;
    }

    // No valid discount found
    setDiscountError('Invalid discount code');
    setAppliedDiscount(null);
  };

  // Calculate discount amount
  const calculateDiscount = (subtotal: number) => {
    if (appliedDiscount) {
      return (subtotal * appliedDiscount.percentage) / 100;
    }
    return 0;
  };

  // Calculate final total
  const subtotal = items.reduce((sum, item) => 
    sum + (item.price + (item.addons?.reduce((addonSum, addon) => 
      sum + (addon.isAvailable && addon.price > 0 ? addon.price : 0), 0) || 0)) * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  const finalTotal = subtotal + deliveryFee - discount;

  if (items.length === 0) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/menu')}
            sx={{ mt: 2 }}
          >
            Browse Menu
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Box
                      component="img"
                      src={item.image === 'classic' ? classicImg : item.image === 'premium' ? premiumImg : halfHalfImg}
                      alt={item.name}
                      sx={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: 1,
                      }}
                    />
                  </Grid>
                  <Grid item xs={9}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6" component="h2">
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Base Price: €{item.price.toFixed(2)}
                        </Typography>
                        {item.addons && item.addons.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Add-ons: {item.addons.map(addon => `${addon.name} (€${addon.price.toFixed(2)})`).join(', ')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Item Total: €{(item.price + item.addons.reduce((sum, addon) => sum + addon.price, 0)).toFixed(2)}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveItem(item.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        size="small"
                        sx={{ width: 60, mx: 1 }}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              {deliveryError && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  {deliveryError}
                </Alert>
              )}
              <Box sx={{ my: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal</Typography>
                  <Typography>€{subtotal.toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <TextField
                      size="small"
                      label="Discount Code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      error={!!discountError}
                      helperText={discountError}
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleApplyDiscount}
                      sx={{ minWidth: '100px' }}
                    >
                      Apply
                    </Button>
                  </Box>
                </Box>

                {appliedDiscount && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color="success.main">
                      {appliedDiscount.type === 'family' ? 'Family Discount' : 'Discount'} ({appliedDiscount.percentage}% off)
                    </Typography>
                    <Typography color="success.main">
                      -€{discount.toFixed(2)}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Delivery Fee</Typography>
                  <Typography>€{deliveryFee.toFixed(2)}</Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">
                    €{finalTotal.toFixed(2)}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleCheckout}
                  sx={{ mb: 2 }}
                  disabled={!user || !user.city || deliveryFee === 0}
                >
                  {!user ? 'Sign in to Checkout' : !user.city ? 'Set Delivery Address' : deliveryFee === 0 ? 'Delivery Not Available' : 'Proceed to Checkout'}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => dispatch(clearCart())}
                  color="error"
                >
                  Clear Cart
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart; 