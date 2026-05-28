import { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    contacts: 0,
    campaigns: 0,
    smsSent: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const contactsRes = await API.get("/contacts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const campaignsRes = await API.get("/campaigns", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const totalSms = campaignsRes.data.reduce(
          (sum, item) => sum + (item.sentTo || 0),
          0
        );

        setStats({
          contacts: contactsRes.data.length,
          campaigns: campaignsRes.data.length,
          smsSent: totalSms,
        });
      } catch (error) {
        console.log(error);
      }
    };

    loadStats();
  }, []);

  return (
    <section className="premium-dashboard">
      <div className="premium-hero">
        <div className="premium-hero-content">
          <span className="premium-badge">
            AI Powered SMS Marketing Dashboard
          </span>

          <h1>
            Professional SMS Campaigning & Customer Management Platform
          </h1>

          <p>
            Create high-converting SMS campaigns, manage customer contacts,
            analyze delivery performance and grow your business using a modern
            smart admin dashboard.
          </p>

          <div className="premium-actions">
            <button className="glow-btn">Create Campaign</button>
            <button className="outline-btn">View Analytics</button>
          </div>
        </div>

        <div className="hero-analytics-card">
          <h3>Campaign Reach</h3>

          <div className="circle-analytics">
            <div>
              <h2>{stats.smsSent}</h2>
              <span>SMS Sent</span>
            </div>
          </div>

          <p>92% delivery success rate</p>
        </div>
      </div>

      <div className="premium-stats-grid">
        <div className="premium-stat-card blue-card">
          <div>
            <span>Total Contacts</span>
            <h2>{stats.contacts}</h2>
            <p>Stored customer contacts</p>
          </div>

          <div className="stat-icon">👥</div>
        </div>

        <div className="premium-stat-card purple-card">
          <div>
            <span>Total Campaigns</span>
            <h2>{stats.campaigns}</h2>
            <p>Marketing campaigns launched</p>
          </div>

          <div className="stat-icon">📢</div>
        </div>

        <div className="premium-stat-card green-card">
          <div>
            <span>SMS Delivered</span>
            <h2>{stats.smsSent}</h2>
            <p>Audience reached successfully</p>
          </div>

          <div className="stat-icon">✉️</div>
        </div>

        <div className="premium-stat-card orange-card">
          <div>
            <span>Conversion Rate</span>
            <h2>87%</h2>
            <p>Customer engagement growth</p>
          </div>

          <div className="stat-icon">📈</div>
        </div>
      </div>

      <div className="dashboard-panels">
        <div className="dark-panel">
          <div className="panel-top">
            <h3>Admin Profile</h3>
            <span className="online-status">Online</span>
          </div>

          <div className="premium-profile">
            <div className="premium-avatar">HY</div>

            <div>
              <h2>Himanshu Yadav</h2>
              <p>SMS Campaigning Project Admin</p>
            </div>
          </div>

          <div className="profile-data">
            <div>
              <span>Email</span>
              <strong>hy4856155@gmail.com</strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>8307511381</strong>
            </div>

            <div>
              <span>Project</span>
              <strong>SMS Campaigning System</strong>
            </div>
          </div>
        </div>

        <div className="dark-panel">
          <div className="panel-top">
            <h3>Campaign Performance</h3>
            <span className="growth-tag">+24%</span>
          </div>

          <div className="performance-box">
            <div className="performance-item">
              <span>Delivery Rate</span>
              <strong>92%</strong>
            </div>

            <div className="progress-line">
              <div className="line-fill"></div>
            </div>

            <div className="performance-item">
              <span>Customer Engagement</span>
              <strong>87%</strong>
            </div>

            <div className="progress-line">
              <div className="line-fill second-line"></div>
            </div>
          </div>

          <div className="quick-actions">
            <button>Create New Campaign</button>
            <button>Add Customer</button>
            <button>View Reports</button>
          </div>
        </div>
      </div>
    </section>
  );
}