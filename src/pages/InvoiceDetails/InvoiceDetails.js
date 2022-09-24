import React, { useState, useEffect } from 'react';
// import "../../../node_modules/react-progress-button/react-progress-button.css"
import { useSnackbar } from 'react-simple-snackbar';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { initialState } from '../../initialState';
import { getInvoice } from '../../actions/invoiceActions';
import { toCommas } from '../../utils/utils';
import styles from './InvoiceDetails.module.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import { Container, Grid } from '@mui/material';
import Divider from '@mui/material/Divider';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Spinner from '../../components/Spinner/Spinner';

import ProgressButton from 'react-progress-button';
import axios from 'axios';
import { saveAs } from 'file-saver';
import Modal from '../Payments/Modal';
import PaymentHistory from './PaymentHistory';

const InvoiceDetails = () => {
  const location = useLocation();
  const [invoiceData, setInvoiceData] = useState(initialState);
  const [rates, setRates] = useState(0);
  const [vat, setVat] = useState(0);
  const [currency, setCurrency] = useState('');
  const [subTotal, setSubTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [client, setClient] = useState([]);
  const [type, setType] = React.useState('');
  const [status, setStatus] = useState('');
  const [company, setCompany] = useState({});
  const { id } = useParams();
  const { invoice } = useSelector((state) => state.invoices);
  const dispatch = useDispatch();
  const history = useNavigate();
  const [sendStatus, setSendStatus] = useState(null);
  const [downloadStatus, setDownloadStatus] = useState(null);
  // eslint-disable-next-line
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const user = JSON.parse(localStorage.getItem('profile'));

  const headerContainer = {
    // display: 'flex'
    paddingTop: '8px',
    paddingLeft: '40px',
    paddingRight: '8px',
    backgroundColor: '#f2f2f2',
    borderRadius: '10px 10px 0px 0px',
  };

  useEffect(() => {
    dispatch(getInvoice(id));
  }, [id, dispatch, location]);

  useEffect(() => {
    if (invoice) {
      //Automatically set the default invoice values as the ones in the invoice to be updated
      setInvoiceData(invoice);
      setRates(invoice.rates);
      setClient(invoice.client);
      setType(invoice.type);
      setStatus(invoice.status);
      setSelectedDate(invoice.dueDate);
      setVat(invoice.vat);
      setCurrency(invoice.currency);
      setSubTotal(invoice.subTotal);
      setTotal(invoice.total);
      setCompany(invoice?.businessDetails?.data?.data);
    }
  }, [invoice]);

  //Get the total amount paid
  let totalAmountReceived = 0;
  for (var i = 0; i < invoice?.paymentRecords?.length; i++) {
    totalAmountReceived += Number(invoice?.paymentRecords[i]?.amountPaid);
  }

  const editInvoice = (id) => {
    history(`/edit/invoice/${id}`);
  };

  const createPdf = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API}/create-pdf`, {
        name: invoice.client.name,
        address: invoice.client.address,
        phone: invoice.client.phone,
        email: invoice.client.email,
        dueDate: invoice.dueDate,
        date: invoice.createdAt,
        id: invoice.invoiceNumber,
        notes: invoice.notes,
        subTotal: toCommas(invoice.subTotal),
        total: toCommas(invoice.total),
        type: invoice.type,
        vat: invoice.vat,
        items: invoice.items,
        status: invoice.status,
        totalAmountReceived: toCommas(totalAmountReceived),
        balanceDue: toCommas(total - totalAmountReceived),
        company: company,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const downloadPdf = async () => {
    setDownloadStatus('loading');
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/fetch-pdf`, {
        responseType: 'blob',
      });
      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });

      saveAs(pdfBlob, 'invoice.pdf');
      setDownloadStatus('success');
    } catch (error) {
      console.log(error);
      setDownloadStatus('error');
    }
  };

  const createDownload = () => {
    createPdf();
    downloadPdf();
  };

  //SEND PDF INVOICE VIA EMAIL
  const sendPdf = async (e) => {
    e.preventDefault();
    setSendStatus('loading');
    try {
      await axios.post(`${process.env.REACT_APP_API}/send-pdf`, {
        name: invoice.client.name,
        address: invoice.client.address,
        phone: invoice.client.phone,
        email: invoice.client.email,
        dueDate: invoice.dueDate,
        date: invoice.createdAt,
        id: invoice.invoiceNumber,
        notes: invoice.notes,
        subTotal: toCommas(invoice.subTotal),
        total: toCommas(invoice.total),
        type: invoice.type,
        vat: invoice.vat,
        items: invoice.items,
        status: invoice.status,
        totalAmountReceived: toCommas(totalAmountReceived),
        balanceDue: toCommas(total - totalAmountReceived),
        link: `${process.env.REACT_APP_URL}/invoice/${invoice._id}`,
        company: company,
      });
      setSendStatus('success');
    } catch (error) {
      console.log(error);
      setSendStatus('error');
    }
  };

  const iconSize = {
    height: '18px',
    width: '18px',
    marginRight: '10px',
    color: 'gray',
  };
  const [open, setOpen] = useState(false);

  function checkStatus() {
    return totalAmountReceived >= total
      ? 'green'
      : status === 'Partial'
      ? '#1976d2'
      : status === 'Paid'
      ? 'green'
      : status === 'Unpaid'
      ? 'red'
      : 'red';
  }

  if (!invoice) {
    return <Spinner />;
  }

  return (
    <div className={styles.PageLayout}>
      {invoice?.creator?.includes(user?.result?._id || user?.result?.sub) && (
        <div className={styles.buttons}>
          <ProgressButton
            onClick={sendPdf}
            state={sendStatus}
            onSuccess={() => openSnackbar('Invoice sent successfully')}>
            Send to Customer
          </ProgressButton>

          <ProgressButton onClick={createDownload} state={downloadStatus}>
            Download PDF
          </ProgressButton>

          <button
            className={styles.btn}
            onClick={() => editInvoice(invoiceData._id)}>
            <BorderColorIcon style={iconSize} />
            Edit Invoice
          </button>

          <button
            // disabled={status === 'Paid' ? true : false}
            className={styles.btn}
            onClick={() => setOpen((prev) => !prev)}>
            <MonetizationOnIcon style={iconSize} />
            Record Payment
          </button>
        </div>
      )}

      {invoice?.paymentRecords.length !== 0 && (
        <PaymentHistory paymentRecords={invoiceData?.paymentRecords} />
      )}

      <Modal open={open} setOpen={setOpen} invoice={invoice} />
      <div className={styles.invoiceLayout}>
        <Container className={headerContainer}>
          <Grid
            container
            justifyContent='space-between'
            style={{ padding: '30px 0px' }}>
            {!invoice?.creator?.includes(
              user?.result._id || user?.result?.sub
            ) ? (
              <Grid item></Grid>
            ) : (
              <Grid
                item
                onClick={() => history('/settings')}
                style={{ cursor: 'pointer' }}>
                {company?.logo ? (
                  <img src={company?.logo} alt='Logo' className={styles.logo} />
                ) : (
                  <h2>{company?.name}</h2>
                )}
              </Grid>
            )}
            <Grid item style={{ marginRight: 40, textAlign: 'right' }}>
              <Typography
                style={{
                  lineSpacing: 1,
                  fontSize: 45,
                  fontWeight: 700,
                  color: 'gray',
                }}>
                {Number(total - totalAmountReceived) <= 0 ? 'Receipt' : type}
              </Typography>
              <Typography variant='overline' style={{ color: 'gray' }}>
                No:{' '}
              </Typography>
              <Typography variant='body2'>
                {invoiceData?.invoiceNumber}
              </Typography>
            </Grid>
          </Grid>
        </Container>
        <Divider />
        <Container>
          <Grid
            container
            justifyContent='space-between'
            style={{ marginTop: '40px' }}>
            <Grid item>
              {invoice?.creator?.includes(
                user?.result._id || user?.result?.sub
              ) && (
                <Container style={{ marginBottom: '20px' }}>
                  <Typography
                    variant='overline'
                    style={{ color: 'gray' }}
                    gutterBottom>
                    From
                  </Typography>
                  <Typography variant='subtitle2'>
                    {invoice?.businessDetails?.data?.data?.businessName}
                  </Typography>
                  <Typography variant='body2'>
                    {invoice?.businessDetails?.data?.data?.email}
                  </Typography>
                  <Typography variant='body2'>
                    {invoice?.businessDetails?.data?.data?.phoneNumber}
                  </Typography>
                  <Typography variant='body2' gutterBottom>
                    {invoice?.businessDetails?.data?.data?.address}
                  </Typography>
                </Container>
              )}
              <Container>
                <Typography
                  variant='overline'
                  style={{ color: 'gray', paddingRight: '3px' }}
                  gutterBottom>
                  Bill to
                </Typography>
                <Typography variant='subtitle2' gutterBottom>
                  {client.name}
                </Typography>
                <Typography variant='body2'>{client?.email}</Typography>
                <Typography variant='body2'>{client?.phone}</Typography>
                <Typography variant='body2'>{client?.address}</Typography>
              </Container>
            </Grid>

            <Grid item style={{ marginRight: 20, textAlign: 'right' }}>
              <Typography
                variant='overline'
                style={{ color: 'gray' }}
                gutterBottom>
                Status
              </Typography>
              <Typography
                variant='h6'
                gutterBottom
                style={{ color: checkStatus() }}>
                {totalAmountReceived >= total ? 'Paid' : status}
              </Typography>
              <Typography
                variant='overline'
                style={{ color: 'gray' }}
                gutterBottom>
                Date
              </Typography>
              <Typography variant='body2' gutterBottom>
                {moment().format('MMM Do YYYY')}
              </Typography>
              <Typography
                variant='overline'
                style={{ color: 'gray' }}
                gutterBottom>
                Due Date
              </Typography>
              <Typography variant='body2' gutterBottom>
                {selectedDate
                  ? moment(selectedDate).format('MMM Do YYYY')
                  : '27th Sep 2021'}
              </Typography>
              <Typography variant='overline' gutterBottom>
                Amount
              </Typography>
              <Typography variant='h6' gutterBottom>
                {currency} {toCommas(total)}
              </Typography>
            </Grid>
          </Grid>
        </Container>

        <form>
          <div>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: '650px' }} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Disc(%)</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoiceData?.items?.map((itemField, index) => (
                    <TableRow key={index}>
                      <TableCell scope='row' style={{ width: '40%' }}>
                        {' '}
                        <InputBase
                          style={{ width: '100%' }}
                          outline='none'
                          sx={{ ml: 1, flex: 1 }}
                          type='text'
                          name='itemName'
                          value={itemField.itemName}
                          placeholder='Item name or description'
                          readOnly
                        />{' '}
                      </TableCell>
                      <TableCell align='right'>
                        {' '}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type='number'
                          name='quantity'
                          value={itemField?.quantity}
                          placeholder='0'
                          readOnly
                        />{' '}
                      </TableCell>
                      <TableCell align='right'>
                        {' '}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type='number'
                          name='unitPrice'
                          value={itemField?.unitPrice}
                          placeholder='0'
                          readOnly
                        />{' '}
                      </TableCell>
                      <TableCell align='right'>
                        {' '}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type='number'
                          name='discount'
                          value={itemField?.discount}
                          readOnly
                        />{' '}
                      </TableCell>
                      <TableCell align='right'>
                        {' '}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type='number'
                          name='amount'
                          value={
                            itemField?.quantity * itemField.unitPrice -
                            (itemField.quantity *
                              itemField.unitPrice *
                              itemField.discount) /
                              100
                          }
                          readOnly
                        />{' '}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className={styles.addButton}></div>
          </div>

          <div className={styles.invoiceSummary}>
            <div className={styles.summary}>Invoice Summary</div>
            <div className={styles.summaryItem}>
              <p>Subtotal:</p>
              <h4>{subTotal}</h4>
            </div>
            <div className={styles.summaryItem}>
              <p>{`VAT(${rates}%):`}</p>
              <h4>{vat}</h4>
            </div>
            <div className={styles.summaryItem}>
              <p>Total</p>
              <h4>
                {currency} {toCommas(total)}
              </h4>
            </div>
            <div className={styles.summaryItem}>
              <p>Paid</p>
              <h4>
                {currency} {toCommas(totalAmountReceived)}
              </h4>
            </div>

            <div className={styles.summaryItem}>
              <p>Balance</p>
              <h4
                style={{ color: 'black', fontSize: '18px', lineHeight: '8px' }}>
                {currency} {toCommas(total - totalAmountReceived)}
              </h4>
            </div>
          </div>

          <div className={styles.note}>
            <h4 style={{ marginLeft: '-10px' }}>Note/Payment Info</h4>
            <p style={{ fontSize: '14px' }}>{invoiceData.notes}</p>
          </div>

          {/* <button className={styles.submitButton} type="submit">Save and continue</button> */}
        </form>
      </div>
    </div>
  );
};

export default InvoiceDetails;
