import { useEffect, useState } from "react";
import api from "../services/api";

export default function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      const res = await api.get("/tenants");
      setTenants(res.data.data.tenants);
    } catch (err) {
      console.error("Failed to load tenants", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading tenants...</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h2>All Tenants</h2>

      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Subdomain</th>
            <th>Status</th>
            <th>Plan</th>
            <th>Users</th>
            <th>Projects</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.subdomain}</td>
              <td>{t.status}</td>
              <td>{t.subscriptionPlan}</td>
              <td>{t.totalUsers}</td>
              <td>{t.totalProjects}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
