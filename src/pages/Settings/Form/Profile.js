import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import Avatar from '@mui/material/Avatar';

export default function ProfileDetail({ profiles }) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: 'solid 1px #dddddd',
          paddingBottom: '20px',
        }}>
        <Avatar
          alt={profiles?.businessName}
          src={profiles?.logo}
          sx={{ width: '96px', height: '96px' }}
        />
      </div>
      <List sx={{ width: '100%', maxWidth: 450 }}>
        <ListItem>
          <BusinessCenterIcon style={{ marginRight: '20px', color: 'gray' }} />
          <ListItemText primary={profiles?.businessName} secondary='' />
        </ListItem>

        <ListItem>
          <LocationOnIcon style={{ marginRight: '20px', color: 'gray' }} />
          <ListItemText primary={profiles?.contactAddress} secondary='' />
        </ListItem>

        <ListItem>
          <PhoneInTalkIcon style={{ marginRight: '20px', color: 'gray' }} />
          <ListItemText primary={profiles?.phoneNumber} secondary='' />
        </ListItem>

        <ListItem>
          <AlternateEmailIcon style={{ marginRight: '20px', color: 'gray' }} />
          <ListItemText primary={profiles?.email} secondary='' />
        </ListItem>

        <ListItem>
          <AccountBalanceWalletRoundedIcon
            style={{ marginRight: '20px', color: 'gray' }}
          />
          <ListItemText primary={profiles?.paymentDetails} secondary='' />
        </ListItem>
      </List>
    </>
  );
}
