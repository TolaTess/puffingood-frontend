import { Container, Typography, Box, Paper } from '@mui/material';

const TermsAndConditions = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Terms and Conditions
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            1. Introduction
          </Typography>
          <Typography paragraph>
            Welcome to PuffinGood. By accessing or using our website and services, you agree to be bound by these Terms and Conditions.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            2. Ordering and Payment
          </Typography>
          <Typography paragraph>
            All orders are subject to availability and confirmation of the order price. Payment must be made at the time of ordering. We accept various payment methods as indicated on our checkout page.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            3. Delivery
          </Typography>
          <Typography paragraph>
            We aim to deliver your order within the timeframe specified during checkout. Delivery times may vary based on your location and other factors. Additional fees may apply for deliveries outside our standard delivery area.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            4. Cancellations and Refunds
          </Typography>
          <Typography paragraph>
            Orders may be cancelled within a reasonable time before preparation begins. Refunds will be processed according to our refund policy and may take 5-10 business days to appear in your account.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            5. Privacy
          </Typography>
          <Typography paragraph>
            Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            6. Modifications
          </Typography>
          <Typography paragraph>
            We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to the website.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            7. Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about these Terms and Conditions, please contact us through the contact information provided on our website.
          </Typography>
          
          <Typography variant="body2" sx={{ mt: 4, fontStyle: 'italic' }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default TermsAndConditions;
