import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We provide comprehensive mining consultancy services to help you make
              informed decisions and optimize your mining operations.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link
              component={RouterLink}
              to="/mining-plan"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Mining Plan
            </Link>
            <Link
              component={RouterLink}
              to="/legal-advice"
              color="text.secondary"
              display="block"
              sx={{ mb: 1 }}
            >
              Legal Advice
            </Link>
            <Link
              component={RouterLink}
              to="/ebook-library"
              color="text.secondary"
              display="block"
            >
              E-Book Library
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: info@miningconsultancy.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +91 123 456 7890
            </Typography>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Mining Consultancy. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}