import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doLogin } from '../utils/apiMiniCRM';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const iconLockClosed = (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      stroke-width='1.5'
      stroke='currentColor'
      class='size-6'
      width='35'
      height='35'
    >
      <path
        stroke-linecap='round'
        stroke-linejoin='round'
        d='M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z'
      />
    </svg>
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    const login = {
      userName: username,
      password: password,
    };

    console.log('Login submitted for: ', username);

    try {
      const jwtToken = await doLogin(login);

      console.log(`JWT Token : ${jwtToken}`);

      // TODO:
      sessionStorage.setItem('jwtToken', jwtToken);
      navigate('/customer');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed', // Pins the container directly to the browser window edges
        top: 0,
        left: 0,
        width: '100vw', // Fills exactly 100% of screen width
        height: '100vh', // Fills exactly 100% of screen height
        overflow: 'hidden', // Hard guarantee that no scroll bars can appear
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          `linear-gradient(
              135deg,
              ${theme.palette.grey[100]} 0%,
              ${theme.palette.grey[200]} 100%
            )`,
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 420,
          px: { xs: 3, sm: 5 },
          py: 5,
          borderRadius: 3,
          transform: 'translateY(-16.66vh)', // Uses screen percentage instead of pixels for perfect alignment on small displays
        }}
      >
        <Box
          component='form'
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          {/* Application Logo / Brand */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                mb: 2,
              }}
            >
              {iconLockClosed}
            </Box>

            <Typography variant='h5' component='h1' fontWeight={600} gutterBottom>
              Welcome to Mini CRM
            </Typography>

            <Typography variant='body2' color='text.secondary' align='center'>
              Sign in to manage your customers, contacts and notes.
            </Typography>
          </Box>

          {error && <Alert severity='error'>{error}</Alert>}

          <TextField
            label='Username'
            variant='outlined'
            fullWidth
            required
            autoComplete='username'
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoFocus
          />

          <TextField
            label='Password'
            type='password'
            variant='outlined'
            fullWidth
            required
            autoComplete='current-password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <Button
            type='submit'
            variant='contained'
            size='large'
            fullWidth
            disabled={loading}
            sx={{
              mt: 1,
              py: 1.25,
              fontWeight: 600,
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          {/* <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 1 }}>
            Some more oprional message
          </Typography> */}
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
