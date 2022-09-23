import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styles from './Header.module.css';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Avatar from '@mui/material/Avatar';

const Header = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const history = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    setUser(null);
    history('/');
  };

  useEffect(() => {
    const token = user?.token;

    //If token expires, logout the user
    setUser(JSON.parse(localStorage.getItem('profile')));

    if (token) {
      if (user?.result?.exp * 1000 < new Date().getTime()) logout();
    }

    // eslint-disable-next-line
  }, [location]);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const openLink = (link) => {
    history(`/${link}`);
    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  if (!user)
    return (
      <div className={styles.header2}>
        <img
          style={{ width: '50px', cursor: 'pointer' }}
          onClick={() => history('/')}
          src='https://i.postimg.cc/hGZKzdkS/logo.png'
          alt='arc-invoice'
        />
        <button onClick={() => history('/login')} className={styles.login}>
          Get started
        </button>
      </div>
    );

  return (
    <div className={styles.header}>
      <div className={styles.root}>
        <div>
          <Button
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup='true'
            onClick={handleToggle}>
            <Avatar style={{ backgroundColor: '#1976D2' }}>
              {user?.result?.name?.charAt(0)}
            </Avatar>
          </Button>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}>
                <Paper elevation={3} sx={{ marginRight: '16pxx' }}>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id='menu-list-grow'
                      onKeyDown={handleListKeyDown}>
                      <MenuItem onClick={() => openLink('settings')}>
                        {(user?.result?.name).split(' ')[0]}
                      </MenuItem>
                      <MenuItem onClick={() => logout()}>Logout</MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    </div>
  );
};

export default Header;
