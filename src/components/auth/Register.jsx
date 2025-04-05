import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Link,
  FormControlLabel,
  Checkbox,
  LinearProgress,
  FormHelperText,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    general: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;
    return strength;
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      setErrors(prev => ({
        ...prev,
        firstName: !formData.firstName ? 'First name is required' : '',
        lastName: !formData.lastName ? 'Last name is required' : ''
      }));
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors(prev => ({
        ...prev,
        email: 'Please enter a valid email address'
      }));
      return false;
    }
    if (!formData.phone || !/^[0-9]{10}$/.test(formData.phone)) {
      setErrors(prev => ({
        ...prev,
        phone: 'Please enter a valid 10-digit phone number'
      }));
      return false;
    }
    if (!formData.company) {
      setErrors(prev => ({
        ...prev,
        company: 'Please enter your company name'
      }));
      return false;
    }
    if (formData.password.length < 8) {
      setErrors(prev => ({
        ...prev,
        password: 'Password must be at least 8 characters long'
      }));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: 'Passwords do not match'
      }));
      return false;
    }
    if (!acceptTerms) {
      setErrors(prev => ({
        ...prev,
        general: 'Please accept the terms and conditions'
      }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!acceptTerms) {
      setErrors(prev => ({
        ...prev,
        general: 'Please accept the terms and conditions'
      }));
      return;
    }

    setLoading(true);
    setErrors({
      general: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      password: '',
      confirmPassword: ''
    });

    try {
      await signup(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.phone,
        formData.company
      );
      navigate('/');
    } catch (error) {
      if (error.fieldErrors) {
        setErrors(prev => ({
          ...prev,
          ...error.fieldErrors,
          general: ''
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          general: error.message || 'Registration failed'
        }));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Sign Up
          </Typography>
          {errors.general && <Alert severity="error">{errors.general}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Box>
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="phone"
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="company"
              label="Company Name"
              value={formData.company}
              onChange={handleChange}
              error={!!errors.company}
              helperText={errors.company}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            {formData.password && (
              <Box sx={{ width: '100%', mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={getPasswordStrength(formData.password)}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor:
                        getPasswordStrength(formData.password) <= 25
                          ? '#f44336'
                          : getPasswordStrength(formData.password) <= 50
                          ? '#ff9800'
                          : getPasswordStrength(formData.password) <= 75
                          ? '#ffc107'
                          : '#4caf50',
                    },
                  }}
                />
                <FormHelperText>
                  Password must be at least 8 characters long with uppercase, lowercase, and numbers
                </FormHelperText>
              </Box>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  color="primary"
                />
              }
              label="I accept the terms and conditions"
              sx={{ mt: 2 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Sign Up
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}