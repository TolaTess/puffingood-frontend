import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useFoods, useUserOrders } from '../hooks/useFirestore';
import { firebaseService } from '../services/firebase';
import { isAdmin } from '../utils/admin';
import { Food, Order, Addon } from '../types';
import UserManagement from '../components/UserManagement';
import { Timestamp } from 'firebase/firestore';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { foods, loading: foodsLoading, error: foodsError } = useFoods();
  const { orders, loading: ordersLoading, error: ordersError } = useUserOrders(true);
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState(7); // Default to last 7 days
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Food | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imagePath: '',
    addons: [] as Addon[],
  });
  const [newAddon, setNewAddon] = useState({
    name: '',
    price: '',
    isAvailable: true
  });
  const [generatingLabel, setGeneratingLabel] = useState<Record<string, boolean>>({});

  // Filter orders based on date range
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - dateRange);
    return orders.filter(order => {
      const orderDate = order.createdAt instanceof Date 
        ? order.createdAt 
        : order.createdAt.toDate(); // Convert Firestore Timestamp to Date
      return orderDate >= cutoffDate;
    });
  }, [orders, dateRange]);

  // Calculate order summary statistics
  const orderSummary = useMemo(() => {
    if (!filteredOrders) return null;
    
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => 
      sum + (Number(order.totalAmount) || 0), 0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const statusCounts = filteredOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      statusCounts,
    };
  }, [filteredOrders]);

  useEffect(() => {
    if (!user || !isAdmin(user)) {
      navigate('/');
      return;
    }
    setLoading(false);
  }, [user, navigate]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (item?: Food) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        imagePath: item.imagePath,
        addons: item.addons || [],
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        imagePath: '',
        addons: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await firebaseService.updateFood(editingItem.id!, {
          ...formData,
          price: parseFloat(formData.price),
        });
      } else {
        await firebaseService.addFood({
          ...formData,
          price: parseFloat(formData.price),
          isAvailable: true,
          addons: formData.addons,
        });
      }
      handleCloseDialog();
    } catch (err) {
      setError('Failed to save menu item. Please try again.');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await firebaseService.deleteFood(id);
    } catch (err) {
      setError('Failed to delete menu item. Please try again.');
    }
  };


  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      setError(''); // Clear any previous errors
      
      // If marking as completed, also set isCompleted to true
      if (newStatus === 'completed') {
        await firebaseService.updateOrderStatus(orderId, newStatus, true);
      } else {
        await firebaseService.updateOrderStatus(orderId, newStatus);
      }
      
      // The orders will be automatically updated via the useUserOrders hook subscription
      // No need to manually update local state as Firestore will trigger a re-render
    } catch (err) {
      setError('Failed to update order status. Please try again.');
    }
  };

  const handleGenerateDPDLabel = async (orderId: string) => {
    try {
      setGeneratingLabel(prev => ({ ...prev, [orderId]: true }));
      setError(''); // Clear any previous errors
      
      const result = await firebaseService.generateDPDLabel(orderId);
      
      // Show success message
      console.log('DPD Label generated successfully:', result);
      
    } catch (err) {
      console.error('Error generating DPD label:', err);
      setError(`Failed to generate DPD label: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setGeneratingLabel(prev => ({ ...prev, [orderId]: false }));
    }
  };

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

  const canStartProcessing = (order: Order) => {
    if (order.status !== 'pending') return false;
    
    let orderDate: Date;
    if (order.createdAt instanceof Timestamp) {
      orderDate = order.createdAt.toDate();
    } else {
      orderDate = new Date(order.createdAt);
    }
    
    const now = new Date();
    const diffInMinutes = (now.getTime() - orderDate.getTime()) / (1000 * 60);
    
    return diffInMinutes > 10;
  };

  const canGenerateLabel = (order: Order) => {
    // Can generate label if order is processing or completed and doesn't already have a DPD tracking number
    return (order.status === 'processing' || order.status === 'completed') && !order.dpdTrackingNumber;
  };

  if (loading || foodsLoading || ordersLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || foodsError || ordersError) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || foodsError || ordersError}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="Orders" />
          <Tab label="Menu Items" />
          <Tab label="Settings" />
        </Tabs>

        {activeTab === 0 && (
          <>
            <Box sx={{ mb: 3 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  label="Date Range"
                  onChange={(e) => setDateRange(Number(e.target.value))}
                >
                  <MenuItem value={1}>Last 24 Hours</MenuItem>
                  <MenuItem value={7}>Last 7 Days</MenuItem>
                  <MenuItem value={30}>Last 30 Days</MenuItem>
                  <MenuItem value={90}>Last 90 Days</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {orderSummary && (
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Orders
                      </Typography>
                      <Typography variant="h4">
                        {orderSummary.totalOrders}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Revenue
                      </Typography>
                      <Typography variant="h4">
                      €{Number(orderSummary.totalRevenue).toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Average Order Value
                      </Typography>
                      <Typography variant="h4">
                      €{Number(orderSummary.averageOrderValue).toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Order Status
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {Object.entries(orderSummary.statusCounts).map(([status, count]) => (
                          <Box key={status} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Chip
                              label={status}
                              color={getStatusColor(status as Order['status'])}
                              size="small"
                            />
                            <Typography>{count}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Date</TableCell>             
                    <TableCell>Items</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Tracking</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>
                        {order.createdAt instanceof Timestamp 
                          ? order.createdAt.toDate().toLocaleString()
                          : new Date(order.createdAt).toLocaleString()}
                      </TableCell>
                     
                      <TableCell>
                        {order.items.map((item, index) => (
                          <div key={`${order.id}-${item.foodId || index}`}>
                            {item.quantity}x {item.name}
                            {item.addons && item.addons.length > 0 && (
                              <div style={{ fontSize: '0.8em', color: '#666' }}>
                                Addons: {item.addons
                                  .map(addon => addon.name)
                                  .join(', ')}
                              </div>
                            )}
                            {item.customization && (
                              <div style={{ fontSize: '0.8em', color: '#666', fontStyle: 'italic' }}>
                                Instructions: {item.customization}
                              </div>
                            )}
                            <div style={{ fontSize: '0.8em', color: '#666' }}>
                              €{((item.price + (item.addons?.reduce((sum, addon) => 
                                sum + (addon.isAvailable && addon.price > 0 ? addon.price : 0), 0) || 0)) * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>€{Number(order.totalAmount || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {order.status !== 'cancelled' && (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
                            {order.dpdTrackingNumber && order.isCompleted ? (
                              <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                  DPD Tracking: {order.dpdTrackingNumber}
                                </Typography>
                                {order.labelUrl && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    href={order.labelUrl}
                                    target="_blank"
                                    sx={{ mt: 1 }}
                                  >
                                    View Label
                                  </Button>
                                )}
                              </Box>
                            ) : order.dpdTrackingNumber && !order.isCompleted ? (
                              <Typography variant="body2" color="text.disabled">
                                Label generated - tracking will show when order is completed
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="text.disabled">
                                No DPD label generated
                              </Typography>
                            )}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Tooltip 
                              title={!canStartProcessing(order) ? "Can only start processing after 10-minute cancellation window" : ""}
                              placement="top"
                            >
                              <span>
                                <Button
                                  size="small"
                                  onClick={() => handleUpdateOrderStatus(order.id!, 'processing')}
                                  disabled={!canStartProcessing(order)}
                                >
                                  Start Processing
                                </Button>
                              </span>
                            </Tooltip>
                            
                            {canGenerateLabel(order) && (
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={() => handleGenerateDPDLabel(order.id!)}
                                disabled={generatingLabel[order.id!]}
                                startIcon={generatingLabel[order.id!] ? <CircularProgress size={16} /> : null}
                              >
                                {generatingLabel[order.id!] ? 'Generating...' : 'Generate Label'}
                              </Button>
                            )}
                            
                            <Button
                              size="small"
                              onClick={() => handleUpdateOrderStatus(order.id!, 'completed')}
                              disabled={order.status === 'completed' || order.status === 'cancelled'}
                            >
                              Mark Complete
                            </Button>
                            
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleUpdateOrderStatus(order.id!, 'cancelled')}
                              disabled={order.status === 'completed' || order.status === 'cancelled'}
                            >
                              Cancel
                            </Button>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {activeTab === 1 && (
          <>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Menu Item
              </Button>
            </Box>
            <Grid container spacing={3}>
              {foods.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography color="textSecondary">{item.description}</Typography>
                      <Typography variant="h6">€{(item.price || 0).toFixed(2)}</Typography>
                      
                      {item.addons && item.addons.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Add-ons:
                          </Typography>
                          {item.addons.map((addon, index) => (
                            <Typography 
                              key={index} 
                              variant="body2" 
                              color={addon.isAvailable ? 'textPrimary' : 'text.disabled'}
                            >
                              {addon.name} - €{addon.price.toFixed(2)}
                              {!addon.isAvailable && ' (Disabled)'}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </CardContent>
                    <Box sx={{ p: 2 }}>
                      <IconButton onClick={() => handleOpenDialog(item)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteItem(item.id!)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {activeTab === 2 && <UserManagement />}

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Image Path"
              name="imagePath"
              value={formData.imagePath}
              onChange={handleFormChange}
              margin="normal"
            />
            
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Add-ons
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label="Add-on Name"
                value={newAddon.name}
                onChange={(e) => setNewAddon(prev => ({ ...prev, name: e.target.value }))}
                size="small"
              />
              <TextField
                label="Price"
                type="number"
                value={newAddon.price}
                onChange={(e) => setNewAddon(prev => ({ ...prev, price: e.target.value }))}
                size="small"
              />
              <Button 
                variant="contained" 
                onClick={() => {
                  if (newAddon.name && newAddon.price) {
                    setFormData(prev => ({
                      ...prev,
                      addons: [...prev.addons, {
                        name: newAddon.name,
                        price: Number(newAddon.price),
                        isAvailable: true
                      }]
                    }));
                    setNewAddon({ name: '', price: '', isAvailable: true });
                  }
                }}
              >
                Add
              </Button>
            </Box>

            <Box sx={{ mb: 2 }}>
              {formData.addons.map((addon, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1, 
                    mb: 1 
                  }}
                >
                  <Typography sx={{ flex: 1 }}>
                    {addon.name} - €{addon.price.toFixed(2)}
                  </Typography>
                  <Switch
                    checked={addon.isAvailable}
                    onChange={() => {
                      setFormData(prev => ({
                        ...prev,
                        addons: prev.addons.map((a, i) => 
                          i === index ? { ...a, isAvailable: !a.isAvailable } : a
                        )
                      }));
                    }}
                  />
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        addons: prev.addons.filter((_, i) => i !== index)
                      }));
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminDashboard; 