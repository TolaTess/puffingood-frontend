import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import {
  LocalShipping,
  Schedule,
  LocationOn,
  Warning,
  Info,
} from '@mui/icons-material';

const DeliveryInfo = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        🛻 Delivery & Pickup Information
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShipping color="primary" />
                Nationwide Delivery
              </Typography>
              <Typography variant="body1" paragraph>
                We deliver freshly made puffpuff nationwide across the Republic of Ireland (excluding Northern Ireland).
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Schedule color="primary" />
                  Delivery Schedule
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Info color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Dispatch Day" 
                      secondary="Orders are sent every Wednesday via DPD" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Info color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Order Deadline" 
                      secondary="Place your order by 6:00 pm on Tuesday to be included in that week's delivery batch" 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Info color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Delivery Time" 
                      secondary="Most orders arrive 1–2 days after dispatch, depending on DPD's schedule" 
                    />
                  </ListItem>
                </List>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Freshness & Storage
                </Typography>
                <Typography variant="body1" paragraph>
                  Puffpuff stays fresh for up to 5 days. Reheating instructions are included inside your puffpuff box so you can enjoy them warm and fluffy.
                </Typography>
              </Box>

              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Delivery Responsibility
                </Typography>
                <Typography variant="body2">
                  Please make sure someone is available to receive your order. We cannot take responsibility for missed deliveries or incorrect address details once the order has left our premises.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn color="primary" />
                Pickup Locations & Hours
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Market Collection
                </Typography>
                <Typography variant="body1" paragraph>
                  We offer collection at the local Galway market. If you prefer to collect your order rather than have it delivered, please send us a direct message to arrange pickup.
                </Typography>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Collection orders will not be processed through DPD. 
                    Please contact us directly to arrange your collection time and location.
                  </Typography>
                </Alert>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Galway Local Delivery
                </Typography>
                <Typography variant="body1" paragraph>
                  We offer Galway city delivery with reduced fees. This service is separate from our nationwide DPD delivery and may have different scheduling.
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  📍 Galway City Center Areas
                </Typography>
                <Typography variant="body2" paragraph>
                  The following areas are considered Galway city center and qualify for reduced delivery fees:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {[
                    'Eyre Square', 'Claddagh', 'Salthill', 'Knocknacarra', 'Taylors Hill',
                    'Newcastle', 'Rahoon', 'Shantalla', 'Bohermore', 'Headford Road',
                    'Terryland', 'Mervue', 'Renmore', 'Wellpark', 'Ballybane',
                    'Ballybrit', 'Doughiska', 'Roscam', 'Merlin Park'
                  ].map((area) => (
                    <Typography key={area} variant="caption" sx={{ 
                      backgroundColor: 'primary.light', 
                      color: 'primary.contrastText',
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1,
                      fontSize: '0.75rem'
                    }}>
                      {area}
                    </Typography>
                  ))}
                </Box>
                
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    For Galway delivery, simply enter "Galway" as your city during checkout. 
                    The system will automatically apply the appropriate delivery fee based on your location.
                  </Typography>
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning color="primary" />
                Important Notes
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Warning color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Northern Ireland" 
                    secondary="We currently do not deliver to Northern Ireland" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Info color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Operating Hours" 
                    secondary="Last order time for delivery is 6:00 PM on Tuesday" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Info color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Contact" 
                    secondary="For any delivery questions, please contact us directly" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DeliveryInfo;
