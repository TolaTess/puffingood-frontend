import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const FAQ = () => {
  const faqs = [
    {
      question: "What is PuffPuff?",
      answer: "PuffPuff is a traditional West African snack made from a sweet, fluffy dough that's deep-fried to golden perfection. It's a beloved treat at gatherings, parties, and celebrations."
    },
    {
      question: "Are your PuffPuffs vegan?",
      answer: "Yes, our PuffPuffs are naturally vegan. However, please note that some toppings are not vegan-friendly. To help you identify suitable options, we've labeled vegan toppings with 'V'."
    },
    {
      question: "Do you offer gluten-free PuffPuff?",
      answer: "Currently, we do not offer gluten-free PuffPuff. We understand the importance of dietary preferences and are exploring options for the future."
    },
    {
      question: "How should I store my PuffPuff?",
      answer: "PuffPuff is best enjoyed fresh. If you need to store leftovers, keep them in an airtight container in the fridge for up to five days. Reheat in an oven or air fryer to restore their delightful texture."
    },
    {
      question: "Can I order PuffPuff for an event or corporate gathering?",
      answer: "Absolutely! We cater to events of all sizes. Please complete our booking form with details about your event, and we'll get back to you with a tailored quote."
    },
    {
      question: "When should I place my order for home delivery?",
      answer: "We ship all home delivery orders on Wednesday. To ensure timely delivery, please place your order before 6 PM on Tuesday."
    },
    {
      question: "Can I add a gift message to my order?",
      answer: "Yes! We offer a free handwritten message with every gift order. Simply type your message in the designated box on the product page."
    },
    {
      question: "How long will my PuffPuff stay fresh during delivery?",
      answer: "We make your PuffPuff fresh for next-day special delivery. Each box comes with reheating instructions for oven or microwave (or air fryer). While PuffPuff is best eaten on the day you receive your order, some customers have stored theirs for up to five days in the fridge."
    },
    {
      question: "Are your PuffPuffs gluten-free?",
      answer: "At the moment, we don't offer gluten-free PuffPuff, but it's something we'd love to explore in the future."
    },
    {
      question: "What's the best way to enjoy PuffPuff?",
      answer: "We love eating PuffPuff warm; by itself, with ice cream or whipped cream. You can also enjoy PuffPuff with a pint of beer, a glass of wine, or pretty much anything."
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Frequently Asked Questions (FAQ)
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          If you have any other questions or need further assistance, feel free to contact us.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        {faqs.map((faq, index) => (
          <Accordion key={index} sx={{ mb: 1 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography variant="h6" component="h2">
                {index + 1}. {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1" color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom align="center">
            Still have questions?
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Don't hesitate to reach out to us through our contact page or send us a direct message on social media.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              component={RouterLink}
              to="/contact"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              Contact Us
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default FAQ;
