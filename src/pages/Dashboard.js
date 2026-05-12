import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../data/api";
import Navbar from "../components/layout/Navbar";
import ActionBar from "../components/layout/ActionBar";
import Breadcrumb from "../components/ui/Breadcrumb";
import Loader  from "../components/ui/Loading";
import { Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const StatusBadge = ({ status }) => {
  const styles = {
    "Full Approved": "bg-green-200 text-green-700 border border-green-300",

    "Admin Approved": "bg-blue-100 text-blue-700 border border-blue-300",

    Pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",

    Stopped: "bg-red-100 text-red-700 border border-red-300",

    Closed: "bg-gray-100 text-gray-600 border border-gray-300",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${
        styles[status] || styles["Closed"]
      }`}
    >
      {status}
    </span>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth()

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [applicants, setApplicants] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    const fetchData = async () => {
      const departmentId = user.id;

      try {
        const res = await fetch(
          `${API}/api/pensioners/department/${departmentId}`,
        );

        const data = await res.json();

        console.log(data);

        if (data.success) {
          setApplicants(data.data);
        }
      } catch (err) {
        console.error("Error fetching pensioners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =========================
  // STATS
  // =========================

  const stats = {
    total: applicants.length,

    active: applicants.filter((a) => a.status === "Full Approved").length,

    adminApproved: applicants.filter((a) => a.status === "Admin Approved").length,

    rejected: applicants.filter((a) => a.status === "Rejected").length,

    stopped: applicants.filter((a) => a.status === "Stopped").length,

    pending: applicants.filter((a) => a.status === "Pending").length,
  };

  // =========================
  // FILTER
  // =========================

  const filtered = applicants.filter((a) => {
    const matchSearch =
      !search ||
      a?.name?.toLowerCase().includes(search.toLowerCase()) ||
      a?.ppoNo?.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All" ||
      (filter === "Active" && a.status === "Full Approved") ||
      (filter === "Admin Approved" && a.status === "Admin Approved") ||
      (filter === "Pending" && a.status === "Pending") ||
      (filter === "Rejected" && a.status === "Rejected") ||
      (filter === "Stopped" && a.status === "Stopped") ||
      (filter === "Closed" && a.status === "Closed");

    return matchSearch && matchFilter;
  });

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        <Loader size={90} color="#1a2a5e" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#f0f2f5" }}>
      <Navbar />

      <div className="px-6 py-4">
        <Breadcrumb
          items={[
            {
              label: "Home",
              link: "/dashboard",
            },
            {
              label: "Dashboard",
            },
          ]}
        />

        {/* <ActionBar /> */}

        {/* Welcome Banner */}

        {/* <div className="bg-blue-50 border border-blue-200 rounded px-4 py-2 text-sm text-blue-700 mb-4 flex items-center gap-2">
          <span>ℹ</span>
          Welcome to the KMC Pensioner Portal.
        </div> */}

        {/* Stats */}

        <div className="grid grid-cols-4 gap-4 mb-5">
          {[
            {
              label: "Total Pensioners",
              value: stats.total,
              color: "#1a2a5e",
            },

            {
              label: "Active Pensions",
              value: stats.active,
              color: "#16a34a",
            },

            {
              label: "Stopped Pensions",
              value: stats.stopped,
              color: "#dc2626",
            },

            {
              label: "Pending Approval",
              value: stats.pending,
              color: "#ea580c",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded shadow-sm p-5 text-center"
            >
              <div
                className="text-4xl font-bold mb-1"
                style={{ color: s.color }}
              >
                {s.value}
              </div>

              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filters */}

        <div className="flex items-center gap-8 mb-4 py-2">
          <div className="relative flex-1 w-[55%]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </span>

            <input
              type="text"
              placeholder="Search by PPO No. or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-3 pl-9 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex gap-2 w-[45%]">
            {[
              "All",
              `Active (${stats.active})`,
              `Admin Approved (${stats.adminApproved})`,
              `Pending (${stats.pending})`,
              `Rejected (${stats.rejected})`,
              `Stopped (${stats.stopped})`,
            ].map((f, i) => {
              const val = [
                "All",
                "Active",
                "Admin Approved",
                "Pending",
                "Rejected",
                "Stopped",
              ][i];

              return (
                <button
                  key={f}
                  onClick={() => setFilter(val)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition ${
                    filter === val
                      ? "text-white"
                      : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                  style={
                    filter === val
                      ? {
                          background: "#1a2a5e",
                        }
                      : {}
                  }
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* TABLE */}

        <div className="bg-white rounded shadow-sm overflow-hidden">
          <div
            className="px-4 py-3 flex items-center gap-2"
            style={{ background: "#1a2a5e" }}
          >
            <span className="text-white font-semibold text-sm">
              Recent Applicants
            </span>

            <span className="bg-amber-400 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              Latest
            </span>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                  PPO No.
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                  Name
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                  Department
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                  Designation
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                  Retirement Date
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                  Amount
                </th>

                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((a, i) => (
                <tr
                  key={a.id || i}
                  className={`border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${
                    i % 2 === 1 ? "bg-gray-50/50" : ""
                  }`}
                  onClick={() => navigate(`/applicants/${a.id}`)}
                >
                  {/* PPO */}

                  <td className="px-4 py-3 text-blue-700 font-mono text-xs">
                    {a.ppoNo}
                  </td>

                  {/* NAME */}

                  <td className="px-4 py-3 font-medium">{a.employee_name}</td>

                  {/* DEPARTMENT */}

                  <td className="px-4 py-3 text-gray-600">{a.department}</td>

                  {/* DESIGNATION */}

                  <td className="px-4 py-3 text-gray-600">{a.designation}</td>

                  {/* RETIREMENT DATE */}

                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {new Date(a.retirementDate).toLocaleDateString()}
                  </td>

                  {/* AMOUNT */}

                  <td className="px-4 py-3 font-semibold">
                    ₹ {Number(a.amount).toLocaleString()}
                  </td>

                  {/* STATUS */}

                  <td className="px-4 py-3">
                    <StatusBadge status={a.status || "Pending"} />
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;