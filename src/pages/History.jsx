import { useEffect, useState } from "react";
import API from "../api";

export default function History() {
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState("");

  const fetchCampaigns = async () => {
    try {
      const res = await API.get("/campaigns", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCampaigns(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const deleteCampaign = async (id) => {
    try {
      await API.delete(`/campaigns/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      fetchCampaigns();
    } catch (error) {
      alert("Failed to delete campaign");
    }
  };

  const filteredCampaigns = campaigns.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="history-page">
      <div className="history-hero">
        <div>
          <span className="badge">Campaign Records</span>
          <h1>Campaign History</h1>
          <p>
            Track your previous SMS campaigns, audience reach, status and
            campaign performance from one clean panel.
          </p>
        </div>

        <div className="history-count-card">
          <h2>{campaigns.length}</h2>
          <span>Total Campaigns</span>
        </div>
      </div>

      <div className="history-panel">
        <div className="table-top">
          <div>
            <h3>All Campaigns</h3>
            <p>View and manage your saved SMS campaign records.</p>
          </div>

          <input
            className="search-box"
            type="text"
            placeholder="Search campaign..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="campaign-list">
          {filteredCampaigns.length === 0 ? (
            <div className="empty-box">
              <h2>No Campaign Found</h2>
              <p>Create your first campaign to see history here.</p>
            </div>
          ) : (
            filteredCampaigns.map((item) => (
              <div className="campaign-history-card" key={item._id}>
                <div className="campaign-icon">✉</div>

                <div className="campaign-main">
                  <h3>{item.title}</h3>
                  <p>{item.message}</p>

                  <div className="campaign-meta">
                    <span>Audience: {item.audience}</span>
                    <span>Sent To: {item.sentTo}</span>
                    <span>
                      Date:{" "}
                      {new Date(item.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="campaign-status-box">
                  <span className="status-pill">{item.status || "Sent"}</span>

                  <button
                    className="delete-btn"
                    onClick={() => deleteCampaign(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}