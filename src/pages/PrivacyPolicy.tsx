import { Container, Typography, Box, Paper } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Privacy Policy
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            1. Information We Collect
          </Typography>
          <Typography paragraph>
            We collect information that you provide directly to us, including:
            <ul>
              <li>Name, email address, and contact information</li>
              <li>Delivery address and preferences</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Order history and preferences</li>
            </ul>
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            2. Use of Cookies
          </Typography>
          <Typography paragraph>
            We use cookies and similar technologies to:
            <ul>
              <li>Keep you signed in</li>
              <li>Remember your preferences</li>
              <li>Maintain your shopping cart</li>
              <li>Process secure payments</li>
              <li>Improve our services</li>
            </ul>
            You can control cookie preferences through your browser settings.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            3. How We Use Your Information
          </Typography>
          <Typography paragraph>
            We use your information to:
            <ul>
              <li>Process and deliver your orders</li>
              <li>Send order confirmations and updates</li>
              <li>Provide customer support</li>
              <li>Improve our services</li>
              <li>Send promotional offers (with your consent)</li>
            </ul>
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            4. Data Security
          </Typography>
          <Typography paragraph>
            We implement appropriate security measures to protect your personal information. Payment information is securely processed through Stripe and we do not store your complete payment details.
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            5. Your Rights
          </Typography>
          <Typography paragraph>
            Under GDPR, you have the right to:
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Data portability</li>
            </ul>
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            6. Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about this Privacy Policy, please contact us at support@puffingood.com
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy; 