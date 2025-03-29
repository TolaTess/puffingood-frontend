import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Collapse,
  IconButton,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { firebaseService } from '../services/firebase';
import { Order } from '../types';
import { Timestamp } from 'firebase/firestore';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';

const Orders = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const ordersData = await firebaseService.getUserOrders(user.id);
        setOrders(ordersData);
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'No date';
    // Handle Firestore Timestamp
    if (date.toDate) {
      return date.toDate().toLocaleDateString();
    }
    // Handle regular Date object
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    // Handle string or number
    return new Date(date).toLocaleDateString();
  };

  const canCancelOrder = (order: Order) => {
    if (order.status !== 'pending') return false;
    
    let orderDate: Date;
    if (order.createdAt instanceof Timestamp) {
      orderDate = order.createdAt.toDate();
    } else {
      orderDate = new Date(order.createdAt);
    }
    
    const now = new Date();
    const diffInMinutes = (now.getTime() - orderDate.getTime()) / (1000 * 60);
    
    return diffInMinutes <= 10;
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancellingOrder(orderId);
      await firebaseService.updateOrderStatus(orderId, 'cancelled');
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      ));
    } catch (err) {
      setError('Failed to cancel order. Please try again.');
    } finally {
      setCancellingOrder(null);
    }
  };

  const handleExpandOrder = (orderId: string) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!user) {
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
            Please sign in to view your orders
          </Typography>
        </Box>
      </Container>
    );
  }

  if (orders.length === 0) {
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
            No orders found
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Order History
      </Typography>

      <Grid container spacing={3}>
        {orders.map((order) => (
          <Grid item xs={12} key={order.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      onClick={() => handleExpandOrder(order.id!)}
                      sx={{ transform: expandedOrders[order.id!] ? 'rotate(180deg)' : 'none' }}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                    <Typography variant="h6">
                      Order #{order.id?.slice(-6)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                    {canCancelOrder(order) && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleCancelOrder(order.id!)}
                        disabled={cancellingOrder === order.id}
                      >
                        {cancellingOrder === order.id ? 'Cancelling...' : 'Cancel Order'}
                      </Button>
                    )}
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Placed on {formatDate(order.createdAt)}
                </Typography>

                <Collapse in={expandedOrders[order.id!]} timeout="auto" unmountOnExit>
                  {canCancelOrder(order) && (
                    <Typography variant="body2" color="error" gutterBottom>
                      You can cancel this order within 10 minutes of placing it
                    </Typography>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Items
                  </Typography>
                  {order.items.map((item) => (
                    <Box key={`${order.id}-${item.foodId}`} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1">{item.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {item.quantity}
                        </Typography>
                        {item.addons && item.addons.length > 0 && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8em' }}>
                            Addons: {item.addons
                              .map(addon => addon.name)
                              .join(', ')}
                          </Typography>
                        )}
                      </Box>
                      <Typography variant="body1">
                        €{((item.price + (item.addons?.reduce((sum, addon) => 
                          sum + (addon.isAvailable && addon.price > 0 ? addon.price : 0), 0) || 0)) * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">€{Number(order.totalAmount || 0).toFixed(2)}</Typography>
                  </Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Delivery Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Order ID: {order.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {formatDate(order.createdAt)}
                  </Typography>
                  {order.trackingNumber && (
                    <Typography variant="body2" color="primary">
                      Tracking Number: {order.trackingNumber}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Status: {order.status}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    City: {order.city}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Delivery Fee: €{Number(order.deliveryFee || 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount: €{Number(order.totalAmount || 0).toFixed(2)}
                  </Typography>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Orders; 