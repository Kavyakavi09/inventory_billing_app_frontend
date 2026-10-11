import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendAssistantMessage } from '../../actions/assistant';
import styles from './Assistant.module.css';

const Assistant = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = JSON.parse(localStorage.getItem('profile'));
  const { messages, sending, error } = useSelector((state) => state.assistant);
  const [question, setQuestion] = useState('');

  useEffect(() => {
    if (!profile?.token) navigate('/login');
  }, [navigate, profile?.token]);

  if (!profile?.token) return null;

  const send = (event) => {
    event.preventDefault();
    const message = question.trim();
    if (!message || sending) return;
    setQuestion('');
    dispatch(sendAssistantMessage(message));
  };

  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <div className={styles.header}>
          <h1>Invoice assistant</h1>
          <p>Ask about your own invoices, balances, and notes.</p>
        </div>
        <div className={styles.thread}>
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`${styles.bubble} ${message.role === 'user' ? styles.user : styles.assistant}`}>
              {message.text}
              {message.cache === 'hit' && <div>Saved answer from Redis</div>}
            </div>
          ))}
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <form className={styles.form} onSubmit={send}>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="How much does this client still owe?"
            maxLength={1000}
          />
          <button type="submit" disabled={sending}>
            {sending ? 'Asking…' : 'Ask'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Assistant;
