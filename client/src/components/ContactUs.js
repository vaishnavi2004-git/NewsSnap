import React, { useState } from 'react';
import './ContactUs.css';

function ContactUs() {
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      {sent ? <div className="contact-success">Thank you for your message!</div> : (
        <form onSubmit={handleSubmit}>
          <textarea
            className="contact-textarea"
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder="Your message..."
            required
          />
          <button type="submit" className="contact-btn">Send</button>
        </form>
      )}
    </div>
  );
}

export default ContactUs;