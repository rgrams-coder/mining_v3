import { Container, Typography, Grid, Card, CardContent, Avatar, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { useState } from 'react';

const experts = [
  {
    name: 'Sarah Johnson',
    title: 'Mining Law Specialist',
    expertise: 'Environmental Compliance & Regulations',
    description: '15+ years experience in mining law and environmental regulations.',
  },
  {
    name: 'Michael Chen',
    title: 'Legal Consultant',
    expertise: 'Mining Rights & Permits',
    description: 'Expert in mining rights acquisition and permit applications.',
  },
  {
    name: 'Emma Thompson',
    title: 'Corporate Lawyer',
    expertise: 'Contract Law & Negotiations',
    description: 'Specialized in mining contracts and stakeholder negotiations.',
  },
];

function LegalAdvice() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[\d\s-+()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/legal-consultation', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // if (!response.ok) throw new Error('Submission failed');

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', description: '' });
    } catch (error) {
      setSubmitStatus('error');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Legal Advisory Services
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Expert legal guidance for mining operations and compliance
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Our Legal Experts
          </Typography>
          <Grid container spacing={3}>
            {experts.map((expert, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mr: 3,
                        bgcolor: 'primary.main',
                        fontSize: '2rem',
                      }}
                    >
                      {expert.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {expert.name}
                      </Typography>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {expert.title}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {expert.expertise}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {expert.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Request Legal Consultation
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
                required
                error={!!errors.phone}
                helperText={errors.phone}
              />
              <TextField
                fullWidth
                label="Legal Matter Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                margin="normal"
                required
                error={!!errors.description}
                helperText={errors.description}
              />
              {submitStatus === 'success' && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Your consultation request has been submitted successfully!
                </Alert>
              )}
              {submitStatus === 'error' && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Failed to submit request. Please try again.
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 3 }}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Request Consultation'}
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default LegalAdvice;