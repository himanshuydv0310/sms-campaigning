import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    group: "",
  });

  const fetchContacts = async () => {
    try {
      const res = await API.get("/contacts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setContacts(res.data);
    } catch (error) {
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

  const addContact = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/contacts/add", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Contact added successfully");

      setForm({
        name: "",
        phone: "",
        email: "",
        group: "",
      });

      fetchContacts();
    } catch (error) {
      toast.error("Failed to add contact");
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    try {
      await API.delete(`/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Contact deleted successfully");
      fetchContacts();
    } catch (error) {
      toast.error("Failed to delete contact");
    }
  };

  const filteredContacts = contacts.filter((item) => {
    const name = item.name || "";
    const phone = item.phone || "";
    const email = item.email || "";
    const group = item.group || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      phone.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      group.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <section className="contacts-page">
      <div className="contacts-header">
        <div>
          <span className="badge">Customer Management</span>
          <h1>Professional Contact Management</h1>
          <p>
            Add, search and manage your customer contacts directly from MongoDB.
          </p>
        </div>

        <div className="contact-count-card">
          <h2>{contacts.length}</h2>
          <span>Total Contacts</span>
        </div>
      </div>

      <div className="contacts-grid">
        <div className="contact-form-card">
          <h3>Add New Contact</h3>

          <form onSubmit={addContact}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
            />

            <input
              type="text"
              name="group"
              placeholder="Customer Group"
              value={form.group}
              onChange={handleChange}
            />

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Contact"}
            </button>
          </form>
        </div>

        <div className="contacts-table-card">
          <div className="table-top">
            <div>
              <h3>Saved Contacts</h3>
              <p>Search and manage all customer records.</p>
            </div>

            <input
              type="text"
              placeholder="Search by name, phone, email or group..."
              className="search-box"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="contacts-list">
            {filteredContacts.length === 0 ? (
              <div className="empty-box">
                <h2>No Contacts Found</h2>
                <p>Add contacts to start SMS campaigns.</p>
              </div>
            ) : (
              filteredContacts.map((item) => (
                <div className="contact-card" key={item._id}>
                  <div className="contact-avatar">
                    {item.name?.charAt(0)?.toUpperCase() || "C"}
                  </div>

                  <div className="contact-details">
                    <h4>{item.name}</h4>
                    <p>{item.phone}</p>
                    <span>{item.email || "No email added"}</span>
                  </div>

                  <div className="contact-actions">
                    <small>{item.group || "General"}</small>

                    <button
                      className="delete-btn"
                      type="button"
                      onClick={() => deleteContact(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}