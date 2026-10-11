import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';
import { loadAssistantHistory, sendAssistantMessage } from '../../actions/assistant';
import styles from './Assistant.module.css';

const Assistant = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = JSON.parse(localStorage.getItem('profile'));
  const { messages, sending, error, hasMore, loadingHistory, historyLoaded, firstItemIndex } =
    useSelector((state) => state.assistant);
  const [question, setQuestion] = useState('');
  const scrollerEl = useRef(null);
  const paging = useRef({ hasMore: false, loadingHistory: false });
  const readyAt = useRef(0);
  paging.current = { hasMore, loadingHistory };

  const onScroll = useCallback(() => {
    const el = scrollerEl.current;
    if (!el || Date.now() < readyAt.current) return;
    if (el.scrollTop > 48) return;
    const { hasMore: more, loadingHistory: loading } = paging.current;
    if (!more || loading) return;
    dispatch(loadAssistantHistory());
  }, [dispatch]);

  const attachScroller = useCallback(
    (node) => {
      if (scrollerEl.current) scrollerEl.current.removeEventListener('scroll', onScroll);
      scrollerEl.current = node;
      if (!node) return;
      readyAt.current = Date.now() + 400;
      node.addEventListener('scroll', onScroll, { passive: true });
    },
    [onScroll]
  );

  useEffect(() => {
    if (!profile?.token) navigate('/login');
    else dispatch(loadAssistantHistory());
  }, [navigate, dispatch, profile?.token]);

  useEffect(() => {
    if (!historyLoaded || loadingHistory) return undefined;
    const frame = requestAnimationFrame(onScroll);
    return () => cancelAnimationFrame(frame);
  }, [historyLoaded, loadingHistory, messages.length, onScroll]);

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
          {hasMore && <p className={styles.more}>Scroll to the top of this chat to load older messages.</p>}
        </div>
        <div className={styles.thread}>
          {historyLoaded && (
          <Virtuoso
            style={{ height: '100%' }}
            data={messages}
            firstItemIndex={firstItemIndex}
            initialTopMostItemIndex={Math.max(messages.length - 1, 0)}
            alignToBottom
            followOutput="auto"
            scrollerRef={attachScroller}
            computeItemKey={(index, message) =>
              `${message.createdAt || 'new'}-${message.role}-${index}`
            }
            itemContent={(index, message) => (
              <div className={`${styles.row} ${message.role === 'user' ? styles.rowUser : ''}`}>
                <div
                  className={`${styles.bubble} ${
                    message.role === 'user' ? styles.user : styles.assistant
                  }`}>
                  {message.text}
                  {message.cache === 'hit' && <div>Saved answer from Redis</div>}
                </div>
              </div>
            )}
          />
          )}
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
