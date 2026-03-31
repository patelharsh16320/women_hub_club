"use client";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email, message });

    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <section className="contact-page">
      <div className="contact-card">

        {/* LEFT SIDE */}
        <div className="contact-info">
          <h1>Contact Us</h1>
          <p className="subtitle">
            Have questions or need help? Send us a message and our team will
            get back to you shortly.
          </p>

          <div className="info-block">
            <h4>Email</h4>
            <p>support@gmail.com</p>
          </div>

          <div className="info-block">
            <h4>Location</h4>
            <p>Maliba, Bardoli, India</p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="contact-form-wrapper">
          {sent && (
            <div className="success-msg">
              ✅ Message sent successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">

            <div className="form-group">
              <label>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                rows="6"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>

            <button className="send-btn">
              Send Message
            </button>

          </form>
        </div>

      </div>
    </section>
  );
}