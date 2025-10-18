import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Alert,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Send,
  Facebook,
  Instagram,
  MusicNote,
} from '@mui/icons-material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(formData.subject || 'Contact Form Submission');
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      );
      const mailtoLink = `mailto:puffinggood@gmail.com?subject=${subject}&body=${body}`;
      
      // Open email client
      window.open(mailtoLink);
      
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        📞 Contact Us
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Get in Touch
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                We'd love to hear from you! Send us a message and we'll respond as soon as possible.
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
                
                {submitStatus === 'success' && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Your email client should open with your message ready to send!
                  </Alert>
                )}
                
                {submitStatus === 'error' && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    There was an error. Please try again or email us directly at puffinggood@gmail.com
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  startIcon={<Send />}
                  sx={{ mt: 2 }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Contact Information
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Email color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={
                      <Link href="mailto:puffinggood@gmail.com" color="primary">
                        puffinggood@gmail.com
                      </Link>
                    }
                  />
                </ListItem>
                
                <Divider sx={{ my: 1 }} />
                
                <ListItem>
                  <ListItemIcon>
                    <LocationOn color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Location"
                    secondary="Galway, Ireland"
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Follow Us
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Stay connected with us on social media for updates, special offers, and more!
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <Instagram color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Instagram"
                    secondary={
                      <Link 
                        href="https://www.instagram.com/puffing.good?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        color="primary"
                      >
                        @puffing.good
                      </Link>
                    }
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <Facebook color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Facebook"
                    secondary={
                      <Link 
                        href="https://www.facebook.com/share/19m3LtyGYY/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        color="primary"
                      >
                        PuffinGood
                      </Link>
                    }
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <MusicNote color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="TikTok"
                    secondary={
                      <Link 
                        href="https://www.tiktok.com/@puffingood?is_from_webapp=1&sender_device=pc" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        color="primary"
                      >
                        @puffingood
                      </Link>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom align="center">
            Alternative Contact Methods
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary">
            If you prefer to contact us directly, you can email us at{' '}
            <Link href="mailto:puffinggood@gmail.com" color="primary">
              puffinggood@gmail.com
            </Link>
            {' '}or reach out to us on any of our social media platforms.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Contact;
