import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { RootState } from '../store';
import { clearCart } from '../store/slices/cartSlice';
import { firebaseService } from '../services/firebase';
import { User } from '../types';
import StripePayment from '../components/StripePayment';
import { useAdminSettings } from '../hooks/useFirestore';

const steps = ['Delivery Details', 'Review Order', 'Payment'];

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const { user: authUser } = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<User | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    instructions: '',
  });
  const [error, setError] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const { settings } = useAdminSettings();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!authUser?.id) return;
      
      try {
        const userData = await firebaseService.getUserProfile(authUser.id);
        if (userData) {
          setUser(userData);
          // Pre-fill delivery details with user profile data
          setDeliveryDetails({
            name: userData.name || '',
            address: userData.address || '',
            city: userData.city || '',
            state: userData.state || '',
            zipCode: userData.zipCode || '',
            phone: userData.phone || '',
            instructions: '',
          });
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError('Failed to load user profile. Please try again.');
      }
    };

    loadUserProfile();
  }, [authUser]);

  useEffect(() => {
    const calculateDeliveryFee = async () => {
      if (!deliveryDetails.city) return;
      
      try {
        const fee = await firebaseService.getDeliveryFee(deliveryDetails.city);
        setDeliveryFee(fee);
        if (fee === 0) {
          setError('Delivery is not available in this area. Please check your delivery address.');
        } else {
          setError('');
        }
      } catch (err) {
        setError('Unable to calculate delivery fee. Please check your delivery address.');
        console.error('Error calculating delivery fee:', err);
      }
    };

    calculateDeliveryFee();
  }, [deliveryDetails.city]);

  useEffect(() => {
    // Check if we're returning from a payment
    const searchParams = new URLSearchParams(window.location.search);
    const step = searchParams.get('step');
    if (step === 'payment') {
      setActiveStep(2); // Set to payment step
    }
  }, []);

  const handleDeliveryDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryDetails({
      ...deliveryDetails,
      [e.target.name]: e.target.value,
    });
  };

  const validateDeliveryDetails = () => {
    const requiredFields = ['name', 'address', 'city', 'state', 'zipCode', 'phone'];
    const missingFields = requiredFields.filter(field => !deliveryDetails[field as keyof typeof deliveryDetails]);
    
    if (missingFields.length > 0) {
      setError('Please fill in all required fields');
      return false;
    }

    if (deliveryFee === 0) {
      setError('Delivery is not available in this area. Please check your delivery address.');
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateDeliveryDetails()) {
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const calculateDiscount = (subtotal: number) => {
    if (settings?.isDiscount && settings.discountPercentage) {
      return (subtotal * settings.discountPercentage) / 100;
    }
    return 0;
  };

  const subtotal = items.reduce((sum, item) => 
    sum + (item.price + (item.addons?.reduce((addonSum, addon) => 
      sum + (addon.isAvailable && addon.price > 0 ? addon.price : 0), 0) || 0)) * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  const finalTotal = subtotal + deliveryFee - discount;

  const handlePaymentSuccess = async () => {
    try {
      if (!user) {
        setError('Please sign in to place an order');
        return;
      }

      const orderData = {
        userId: user.id,
        items: items.map(item => ({
          foodId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          addons: item.addons || []
        })),
        subtotal: subtotal,
        discount: discount,
        discountCode: settings?.isDiscount ? settings.discountCode : null,
        discountPercentage: settings?.isDiscount ? settings.discountPercentage : null,
        totalAmount: finalTotal,
        city: deliveryDetails.city,
        deliveryFee: deliveryFee,
        status: 'pending' as const,
        createdAt: new Date()
      };

      await firebaseService.createOrder(orderData);
      dispatch(clearCart());
      navigate('/orders');
    } catch (err) {
      setError('Failed to place order. Please try again.');
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const renderDeliveryDetails = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Full Name"
          name="name"
          value={deliveryDetails.name}
          onChange={handleDeliveryDetailsChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Delivery Address"
          name="address"
          value={deliveryDetails.address}
          onChange={handleDeliveryDetailsChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="City"
          name="city"
          value={deliveryDetails.city}
          onChange={handleDeliveryDetailsChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="State"
          name="state"
          value={deliveryDetails.state}
          onChange={handleDeliveryDetailsChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="ZIP Code"
          name="zipCode"
          value={deliveryDetails.zipCode}
          onChange={handleDeliveryDetailsChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Phone Number"
          name="phone"
          value={deliveryDetails.phone}
          onChange={handleDeliveryDetailsChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Delivery Instructions (Optional)"
          name="instructions"
          multiline
          rows={3}
          value={deliveryDetails.instructions}
          onChange={handleDeliveryDetailsChange}
        />
      </Grid>
    </Grid>
  );

  const renderOrderReview = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Items
      </Typography>
      {items.map((item) => (
        <Box key={item.id} sx={{ mb: 2 }}>
          <Typography variant="subtitle1">
            {item.name} x {item.quantity}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Base Price: €{item.price.toFixed(2)}
          </Typography>
          {item.addons && item.addons.length > 0 && (
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Add-ons: {item.addons.map(addon => `${addon.name} (€${addon.price.toFixed(2)})`).join(', ')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Item Total: €{(item.price + item.addons.reduce((sum, addon) => sum + addon.price, 0)).toFixed(2)}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="text.secondary">
            Subtotal: €{((item.price + (item.addons?.reduce((sum, addon) => sum + addon.price, 0) || 0)) * item.quantity).toFixed(2)}
          </Typography>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ my: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Subtotal</Typography>
          <Typography>€{subtotal.toFixed(2)}</Typography>
        </Box>
        {settings?.isDiscount && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="success.main">
              Discount ({settings.discountPercentage}% off - {settings.discountCode})
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
      </Box>
    </Box>
  );

  const renderPayment = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      <StripePayment
        amount={finalTotal}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </Box>
  );

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          {activeStep === 0 && renderDeliveryDetails()}
          {activeStep === 1 && renderOrderReview()}
          {activeStep === 2 && renderPayment()}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep > 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            {activeStep < steps.length - 1 && (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Checkout; 