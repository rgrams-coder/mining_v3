import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const services = [
  {
    title: 'Mining Plan',
    description: 'Professional mining plan development and consultation services tailored to your needs.',
    path: '/mining-plan',
    image: 'https://source.unsplash.com/featured/?mining',
  },
  {
    title: 'Legal Advice',
    description: 'Expert legal consultation on mining regulations, compliance, and environmental laws.',
    path: '/legal-advice',
    image: 'https://source.unsplash.com/featured/?legal',
  },
  {
    title: 'E-Book Library',
    description: 'Access our comprehensive collection of mining resources and professional publications.',
    path: '/ebook-library',
    image: 'https://source.unsplash.com/featured/?library',
  },
];

function Home() {
  return (
    <>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
          >
            Professional Mining Consultancy Services
          </Typography>
          <Typography
            variant="h5"
            align="center"
            paragraph
            sx={{ mb: 4 }}
          >
            Expert guidance for your mining operations with comprehensive planning,
            legal support, and educational resources.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {services.map((service) => (
            <Grid item key={service.path} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    height: 200,
                  }}
                  image={service.image}
                  alt={service.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {service.title}
                  </Typography>
                  <Typography paragraph>
                    {service.description}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={service.path}
                    variant="contained"
                    color="primary"
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default Home;