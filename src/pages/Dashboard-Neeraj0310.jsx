import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import API from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    contacts: 0,
    campaigns: 0,
    smsSent: 0,
  });

  const [chartData, setChartData] = useState([]);

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

        const formattedData = campaignsRes.data.slice(0, 5).map((item) => ({
          name: item.title.slice(0, 8),
          sms: item.sentTo || 0,
        }));

        setChartData(formattedData.reverse());
      } catch (error) {
        console.log(error);
      }
    };

    loadStats();
  }, []);

  const fallbackData = [
    { name: "Mon", sms: 20 },
    { name: "Tue", sms: 45 },
    { name: "Wed", sms: 35 },
    { name: "Thu", sms: 60 },
    { name: "Fri", sms: 80 },
  ];

  const data = chartData.length > 0 ? chartData : fallbackData;

  return (
    <section className="premium-dashboard">
      <div className="premium-hero">
        <div className="premium-hero-content">
          <span className="premium-badge">
            AI Powered SMS Marketing Dashboard
          </span>

          <h1>Professional SMS Campaigning & Analytics Platform</h1>

          <p>
            Manage customers, create SMS campaigns, track performance and view
            analytics from one modern professional dashboard.
          </p>

          <div className="premium-actions">
            <button className="glow-btn">Create Campaign</button>
            <button className="outline-btn">View Reports</button>
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

      <div className="analytics-grid">
        <div className="dark-panel chart-panel">
          <div className="panel-top">
            <h3>SMS Campaign Performance</h3>
            <span className="growth-tag">Live Data</span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="sms" fill="#38bdf8" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dark-panel chart-panel">
          <div className="panel-top">
            <h3>Growth Analytics</h3>
            <span className="growth-tag">+24%</span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  background: "#020617",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="sms"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.25}
              />
            </AreaChart>
          </ResponsiveContainer>
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
            <h3>Quick Actions</h3>
            <span className="growth-tag">Smart Tools</span>
          </div>

          <div className="quick-actions">
            <button>Create New Campaign</button>
            <button>Add Customer Contact</button>
            <button>View Campaign History</button>
            <button>Export Report</button>
          </div>
        </div>
      </div>
    </section>
  );
}