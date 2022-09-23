import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SnackbarProvider from 'react-simple-snackbar';
import ClientList from './pages/clients/ClientList';
import Footer from './components/Footer/Footer';
import Invoice from './pages/Invoice/Invoice';
import InvoiceDetails from './pages/InvoiceDetails/InvoiceDetails';
import Invoices from './pages/Invoices/Invoices';
import Dashboard from './pages/Dashboard/Dashboard';
import Settings from './pages/Settings/Settings';
import Forgot from './pages/Password/Forgot';
import Reset from './pages/Password/Reset';

function App() {
  const user = JSON.parse(localStorage.getItem('profile'));

  return (
    <BrowserRouter>
      <GoogleOAuthProvider
        clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
        <SnackbarProvider>
          {user && <NavBar />}
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/invoice' element={<Invoice />} />
            <Route path='/edit/invoice/:id' element={<Invoice />} />
            <Route path='/invoice/:id' element={<InvoiceDetails />} />
            <Route path='/invoices' element={<Invoices />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/customers' element={<ClientList />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/forgot' element={<Forgot />} />
            <Route path='/reset/:token' element={<Reset />} />
          </Routes>
          <Footer />
        </SnackbarProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
