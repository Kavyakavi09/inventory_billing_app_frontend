const styles = () => ({
  paper: {
    marginTop: '64px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0px',
  },
  root: {
    '& .MuiTextField-root': {
      margin: 0,
    },
  },
  avatar: {
    margin: '8px',
    backgroundColor: '#1976d2',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: '24px',
  },
  submit: {
    margin: '24px 0px 16px',
  },
  googleButton: {
    marginBottom: '0px',
  },
});

export default styles;
