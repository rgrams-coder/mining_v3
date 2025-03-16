import { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  Box,
  Chip,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookIcon from '@mui/icons-material/Book';

const books = [
  {
    title: 'Modern Mining Techniques',
    author: 'Dr. Robert Smith',
    category: 'Technical',
    description: 'Comprehensive guide to contemporary mining methods and technologies.',
    image: 'https://source.unsplash.com/featured/?mining,book',
  },
  {
    title: 'Mining Law Handbook',
    author: 'Jennifer Davis',
    category: 'Legal',
    description: 'Essential legal guidelines and regulations for mining operations.',
    image: 'https://source.unsplash.com/featured/?law,book',
  },
  {
    title: 'Sustainable Mining Practices',
    author: 'Dr. Michael Wong',
    category: 'Environmental',
    description: 'Best practices for environmentally responsible mining operations.',
    image: 'https://source.unsplash.com/featured/?sustainability',
  },
  {
    title: 'Mining Safety Standards',
    author: 'Sarah Thompson',
    category: 'Safety',
    description: 'Complete guide to safety protocols and risk management in mining.',
    image: 'https://source.unsplash.com/featured/?safety',
  },
  {
    title: 'Mineral Processing Technology',
    author: 'Dr. James Wilson',
    category: 'Technical',
    description: 'Advanced techniques in mineral processing and extraction.',
    image: 'https://source.unsplash.com/featured/?technology',
  },
  {
    title: 'Mining Economics',
    author: 'Prof. David Brown',
    category: 'Business',
    description: 'Economic principles and financial planning for mining projects.',
    image: 'https://source.unsplash.com/featured/?business',
  },
];

const categories = ['All', 'Technical', 'Legal', 'Environmental', 'Safety', 'Business'];

function EbookLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          E-Book Library
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Access our comprehensive collection of mining resources and publications
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by title, author, or keywords"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {categories.map((category) => (
            <Chip
              key={category}
              label={category}
              onClick={() => setSelectedCategory(category)}
              color={selectedCategory === category ? 'primary' : 'default'}
              icon={<BookIcon />}
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={4}>
        {filteredBooks.map((book, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                sx={{ height: 200 }}
                image={book.image}
                alt={book.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {book.title}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {book.author}
                </Typography>
                <Chip
                  label={book.category}
                  size="small"
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {book.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default EbookLibrary;