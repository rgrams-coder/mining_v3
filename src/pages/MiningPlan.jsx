import { Container, Typography, Grid, Card, CardContent, TextField, Button, Box } from '@mui/material';

const services = [
  {
    title: 'Mine Planning & Design',
    description: 'Comprehensive mine planning services including pit optimization, production scheduling, and equipment selection.',
  },
  {
    title: 'Feasibility Studies',
    description: 'Detailed technical and economic assessments of mining projects to evaluate their viability.',
  },
  {
    title: 'Environmental Impact Assessment',
    description: 'thorough analysis of environmental impacts and development of mitigation strategies.',
  },
];

function MiningPlan() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Mining Plan Services
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Expert mining plan development and consultation services tailored to your specific needs
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            Our Services
          </Typography>
          <Grid container spacing={3}>
            {services.map((service, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {service.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Request Consultation
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Phone"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Project Details"
                multiline
                rows={4}
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
              >
                Submit Request
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default MiningPlan;