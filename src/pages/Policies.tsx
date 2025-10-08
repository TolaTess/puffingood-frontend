import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const Policies = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        📜 Policies
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">Shipping, Refund & Cancellation Policy</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Last updated: September 2025
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Shipping
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Orders are dispatched every Wednesday via DPD." />
              </ListItem>
              <ListItem>
                <ListItemText primary="We cannot guarantee the exact delivery day as it depends on the courier's schedule." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Our puffpuff stays fresh for up to five days. Reheat before serving for the best experience." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Once your order leaves our premises, we are not responsible for any delivery delays or issues caused by the courier." />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Delivery Responsibility
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Please make sure that you or someone else is available to receive your order on the day of delivery." />
              </ListItem>
              <ListItem>
                <ListItemText primary="We cannot accept responsibility for incorrect delivery addresses or missed delivery attempts made when no one is in." />
              </ListItem>
              <ListItem>
                <ListItemText primary="If you are sending a gift, please inform the recipient so they expect the delivery." />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Returns, Refunds & Cancellations
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="All puffpuff boxes are made to order, so we do not accept returns or exchanges unless your order arrives damaged or incorrect." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Please report damaged orders within 24 hours of delivery with your order number and photo proof." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Orders may be cancelled up to 24 hours before the scheduled dispatch day (Wednesday) for a full refund." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Cancellations made less than 24 hours before dispatch may not be eligible for a refund." />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">Privacy Policy</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Last updated: October 2025
            </Typography>
            
            <Typography variant="body1" paragraph>
              At Puffingood, we respect your privacy and are committed to protecting your personal data.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Information We Collect
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Name, address, email, phone number (for delivery and communication)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Payment information (processed securely via our payment provider; we do not store card details)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Order history and preferences" />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              How We Use Your Data
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="To process and deliver your orders" />
              </ListItem>
              <ListItem>
                <ListItemText primary="To communicate with you about your orders or updates (if you opt in)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="To improve our services and website" />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Your Rights
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="You can request to access, correct, or delete your personal data at any time." />
              </ListItem>
              <ListItem>
                <ListItemText primary="We will not sell, share, or rent your data to any third party." />
              </ListItem>
              <ListItem>
                <ListItemText primary="We comply with the EU GDPR regulations." />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">Terms & Conditions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Last updated: September 2025
            </Typography>
            
            <Typography variant="body1" paragraph>
              These Terms & Conditions govern your use of our website and ordering from Puffingood. By placing an order, you agree to these terms.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Orders & Payments
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="All orders must be paid in full at checkout." />
              </ListItem>
              <ListItem>
                <ListItemText primary="We deliver nationwide across the Republic of Ireland (excluding Northern Ireland)." />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Delivery
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Orders are dispatched every Wednesday via DPD." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Delivery times are estimates only — we are not responsible for delays caused by the courier." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Once an order leaves our premises, responsibility lies with the courier to deliver your package." />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Product Quality & Allergen Info
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Puffpuff is made fresh to order. Consume on the day of delivery for best quality." />
              </ListItem>
              <ListItem>
                <ListItemText primary="Allergy information is available on request. It is your responsibility to check ingredients before ordering." />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Liability
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Puffingood is not liable for any indirect, incidental, or consequential loss from the use of our products or services." />
              </ListItem>
            </List>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Changes to Terms
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="We may update these terms at any time. Continued use of our services implies acceptance of the updated terms." />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Container>
  );
};

export default Policies;
