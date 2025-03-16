import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { subscriptionPlans } from '../../config/subscriptionPlans';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Alert,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export default function SubscriptionPlans() {
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscription = async (plan) => {
    if (!currentUser) {
      setError('Please login to subscribe');
      return;
    }

    try {
      const res = await loadRazorpay();
      if (!res) {
        setError('Razorpay SDK failed to load');
        return;
      }

      const { data: orderData } = await subscription.subscribe(plan.id);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Mining Consultancy',
        description: `${plan.name} Subscription`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            await api.post('/subscription/verify-payment', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
            // Refresh user data or subscription status
            window.location.reload();
          } catch (err) {
            setError('Payment verification failed');
          }
        },
        prefill: {
          email: currentUser.email,
          name: currentUser.name,
        },
        theme: {
          color: '#1b5e20',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      setError('Failed to initiate payment');
      console.error('Payment error:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Choose Your Plan
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Select the plan that best suits your needs
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={4} justifyContent="center">
        {subscriptionPlans.map((plan) => (
          <Grid item key={plan.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h4" component="h2" align="center">
                  {plan.name}
                </Typography>
                <Typography
                  variant="h3"
                  color="primary"
                  align="center"
                  sx={{ my: 2 }}
                >
                  ₹{plan.price}
                  <Typography
                    component="span"
                    variant="h6"
                    color="text.secondary"
                  >
                    /{plan.duration}
                  </Typography>
                </Typography>
                <List dense>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Box sx={{ width: '100%', p: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => handleSubscription(plan)}
                  >
                    Subscribe Now
                  </Button>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}