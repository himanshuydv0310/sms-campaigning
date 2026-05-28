import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api";

export default function Campaign() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingStep, setSendingStep] = useState("");

  const [form, setForm] = useState({
    title: "",
    message: "",
    audience: "All Contacts",
  });

  const fetchContacts = async () => {
    try {
      const res = await API.get("/contacts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setContacts(res.data);
    } catch {
      toast.error("Failed to load contacts");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createCampaign = async (e) => {
    e.preventDefault();

    if (!form.title || !form.message) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      setSendingStep("Preparing SMS campaign...");

      setTimeout(() => {
        setSendingStep("Sending demo SMS to contacts...");
      }, 700);

      setTimeout(() => {
        setSendingStep("Generating delivery report...");
      }, 1400);

      await API.post(
        "/campaigns/create",
        {
          title: form.title,
          message: form.message,
          audience: form.audience,
          sentTo: contacts.length,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTimeout(() => {
        toast.success("Demo SMS campaign delivered successfully");
        setSendingStep("");
      }, 1800);

      setForm({
        title: "",
        message: "",
        audience: "All Contacts",
      });
    } catch {
      toast.error("Failed to create campaign");
      setSendingStep("");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1800);
    }
  };

  return (
    <section className="campaign-page">
      <div className="campaign-hero">
        <div>
          <span className="premium-badge">Demo SMS Campaign Builder</span>

          <h1>Create Professional Demo SMS Campaigns</h1>

          <p>
            Simulate SMS sending, generate delivery reports and save campaigns
            into MongoDB without paid SMS API.
          </p>
        </div>

        <div className="campaign-summary-card">
          <h2>{contacts.length}</h2>
          <span>Available Contacts</span>
        </div>
      </div>

      <div className="campaign-grid">
        <div className="campaign-form-card">
          <div className="section-header">
            <h3>Create New Campaign</h3>
            <p>Write your SMS content and start demo delivery.</p>
          </div>

          {sendingStep && (
            <div className="sending-box">
              <div className="loader-dot"></div>
              <span>{sendingStep}</span>
            </div>
          )}

          <form onSubmit={createCampaign}>
            <label>Campaign Title</label>

            <input
              type="text"
              name="title"
              placeholder="Festival Discount Offer"
              value={form.title}
              onChange={handleChange}
              required
            />

            <label>SMS Message</label>

            <textarea
              name="message"
              placeholder="Write your campaign SMS message..."
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>

            <label>Select Audience</label>

            <select
              name="audience"
              value={form.audience}
              onChange={handleChange}
            >
              <option value="All Contacts">All Contacts</option>
              <option value="General Customers">General Customers</option>
              <option value="Premium Customers">Premium Customers</option>
              <option value="New Customers">New Customers</option>
            </select>

            <button className="glow-btn" type="submit" disabled={loading}>
              {loading ? "Sending Demo SMS..." : "Send Demo Campaign"}
            </button>
          </form>
        </div>

        <div className="campaign-preview-card">
          <div className="section-header">
            <h3>Live SMS Preview</h3>
            <p>Preview your demo SMS before sending.</p>
          </div>

          <div className="phone-preview">
            <div className="phone-top"></div>

            <div className="sms-bubble">
              <h4>{form.title || "Campaign Title"}</h4>

              <p>
                {form.message ||
                  "Your SMS message preview will appear here while typing."}
              </p>
            </div>
          </div>

          <div className="preview-info">
            <div>
              <span>Audience</span>
              <strong>{form.audience}</strong>
            </div>

            <div>
              <span>Recipients</span>
              <strong>{contacts.length}</strong>
            </div>

            <div>
              <span>Mode</span>
              <strong>Demo SMS</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}