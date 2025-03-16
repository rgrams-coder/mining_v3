import { Container, Typography, Grid, Card, CardContent, Avatar, TextField, Button, Box } from '@mui/material';

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
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
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
                label="Legal Matter Description"
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
                Request Consultation
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default LegalAdvice;