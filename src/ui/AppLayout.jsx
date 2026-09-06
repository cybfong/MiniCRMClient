import { Tooltip } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { getJWTRemainingTime, getUserName } from '../utils/apiMiniCRM';
import { iconArrowRightStartOnRectangle, iconChevronDoubleLeft, iconChevronDoubleRight } from './icons/AppIcons';
import { menuItems } from './MenuItems';

const appTitle = 'Mini CRM';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      },
    },
  ],
}));

function AppLayout() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = React.useState(getJWTRemainingTime());

  // Auto-update remaining time every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getJWTRemainingTime();
      setTimeLeft(remaining);

      // Optional: Auto-logout if token expires
      if (remaining === 'Expired') {
        sessionStorage.removeItem('jwtToken');
        navigate('/login');
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [navigate]);

  const handleLogoutClick = () => {
    sessionStorage.removeItem('jwtToken');
    console.log(`Logout icon is clicked. JWTToken : ${sessionStorage.getItem('jwtToken')}`);
    navigate('/login');
  };

  const handleListItemClick = (event, item) => {
    event.preventDefault();
    console.log('List Item Button Clicked : ', item.text);
    navigate(item.path);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='fixed' open={open}>
        <Toolbar disableGutters sx={{ alignItems: 'stretch', position: 'relative' }}>
          {/* 1. Toggle Button (Centered inside the closed 65px drawer area) */}
          {!open && (
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              sx={{
                position: 'absolute',
                left: (theme) => `calc((${theme.spacing(8)} + 1px) / 2 - 20px)`, // Centers 40px icon inside 65px mini drawer
                top: '50%',
                transform: 'translateY(-50%)',
                width: 40,
                height: 40,
                borderRadius: '50%',
                zIndex: 1,
                '& svg': {
                  width: 24,
                  height: 24,
                  fill: 'currentColor',
                },
              }}
            >
              {iconChevronDoubleRight}
            </IconButton>
          )}

          {/* 2. Title Box anchored to the exact 89px content line when closed */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              bottom: 0,
              // OPEN:  24px padding-left (AppBar is shifted 240px, so 240 + 24 matches main content)
              // CLOSED: 89px left position (65px drawer + 24px main content padding = 89px)
              left: open ? 0 : (theme) => `calc(${theme.spacing(8)} + 1px + 24px)`,
              pl: open ? 3 : 0,
              transition: (theme) =>
                theme.transitions.create(['left', 'padding-left'], {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
            }}
          >
            <Typography variant='h6' noWrap>
              {appTitle}
            </Typography>
          </Box>

          {/* 3. User Info & Actions Area */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 3, ml: 'auto' }}>
            <Typography variant='h6' noWrap>
              User: [{getUserName()}]
            </Typography>

            <Typography variant='h6' noWrap>
              Session Time Remaining: [{timeLeft}]
            </Typography>

            <Tooltip title='Logout'>
              <IconButton
                color='inherit' // Explicitly pass color down to the SVG
                onClick={handleLogoutClick}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  alignSelf: 'center',
                  '& svg': {
                    width: 24,
                    height: 24,
                    fill: 'currentColor',
                  },
                }}
              >
                {iconArrowRightStartOnRectangle}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant='permanent' open={open}>
        <DrawerHeader>
          <IconButton
            onClick={handleDrawerClose}
            sx={{
              width: 40, // Sets fixed width
              height: 40, // Matches height for a 1:1 square ratio
              borderRadius: '50%', // Rounds the border into a perfect circle
              alignSelf: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              '& svg': {
                width: 24, // Fixed dimensions prevent SVG collapse
                height: 24,
              },
            }}
          >
            {theme.direction === 'rtl' ? iconChevronDoubleRight : iconChevronDoubleLeft}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={(e) => handleListItemClick(e, item)}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: 'auto',
                        },
                    // Target the child SVG to handle Heroicon size and colors
                    {
                      '& svg': {
                        width: 24,
                        height: 24,
                        color: 'text.secondary', // Automatically matches your MUI theme text color
                      },
                    },
                  ]}
                >
                  {!open ? <Tooltip title={item.text}>{item.icon}</Tooltip> : item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />
      </Drawer>
      <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}

export default AppLayout;
