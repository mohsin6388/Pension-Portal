import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { API } from "../data/api";
import Loader from "../components/ui/Loading";
import Breadcrumb from "../components/ui/Breadcrumb";

const ApplicantView = () => {
  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    fetchApplicant();
  }, []);

  // const fetchApplicant = async () => {
  //   try {
  //     const res = await fetch(`${API}/api/pensioners/${id}`);

  //     const result = await res.json();

  //     if (result.success) {
  //       setData(result.data);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const fetchApplicant = async () => {
    try {
      // =====================================
      // GET TOKEN & USER
      // =====================================

      const token = localStorage.getItem("token");

      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch(`${API}/api/pensioners/${id}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",

          // JWT TOKEN
          Authorization: `Bearer ${token}`,

          // OPTIONAL EXTRA HEADERS
          "x-user-role": user?.role,
          "x-user-id": user?.id,
        },
      });

      const result = await res.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        <Loader size={90} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        {/* HEADER */}

        <Breadcrumb
          items={[
            { label: "Home", link: "/dashboard" },
            { label: "Employee Details" },
          ]}
        />

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 my-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#163269]">
                Pensioner Details
              </h1>

              <p className="text-gray-500 mt-1">
                Complete pensioner information
              </p>
            </div>

            <div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium border
      ${
        data.status === "Pending"
          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
          : data.status === "Admin Approved"
            ? "bg-blue-100 text-blue-700 border-blue-300"
            : data.status === "Full Approved"
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-gray-100 text-gray-700 border-gray-300"
      }
    `}
              >
                {data.status || "Pending Approval"}
              </span>
            </div>
          </div>
        </div>

        {/* EMPLOYEE DETAILS */}

        <Section title="Employee Details">
          <Field label="Employee ID" value={data.employee_id} />

          <Field label="Employee Name" value={data.employee_name} />

          <Field label="PPO Number" value={data.ppo_no} />

          <Field label="Old PPO Number" value={data.old_ppo} />

          <Field label="Gender" value={data.gender} />

          <Field label="Aadhaar Number" value={data.aadhaar_no} />

          <Field label="PAN Number" value={data.pan_no} />

          <Field label="Mobile Number" value={data.mobile_no} />

          <Field label="Family Mobile" value={data.family_mobile_no} />

          <Field label="Caste Category" value={data.caste_category} />

          <Field label="Relation" value={data.relation} />

          <Field label="Relation Name" value={data.relation_name} />

          <Field label="Date of Birth" value={formatDate(data.date_of_birth)} />

          <Field label="Date of Death" value={formatDate(data.date_of_death)} />

          </Section>


          {/* PENSION CATEGORY */}

          <Section title="Pension Category">
            <Field label="Department" value={data.department} />

            <Field label="Sub Department" value={data.sub_department} />

            <Field label="Designation" value={data.designation} />

            <Field
              label="Date of Joining"
              value={formatDate(data.date_of_joining)}
            />

            <Field
              label="Retirement Date"
              value={formatDate(data.retirement_date)}
            />

            <Field label="Grade Pay" value={data.grade_pay} />

            <Field
              label="Last Salary Drawn"
              value={`₹ ${Number(data.last_salary_drawn || 0).toLocaleString()}`}
            />
          </Section>


          <Section title="Financial Details">

          <Field label="Basic Salary" value={data.basic_salary} />

          <Field label="Pay Commission" value={data.pay_commission} />
          <Field label="Category Type" value={data.category_type} />

          <Field label="ACP" value={data.acp} />

          <Field label="ACP I" value={data.acp1} />
          <Field label="ACP II" value={data.acp2} />
          <Field label="ACP III" value={data.acp3} />

          <Field label="Notional Increment" value={data.notional_increment} />
        </Section>

        {/* BANK DETAILS */}

        <Section title="Bank Details">
          <Field label="Bank Name" value={data.bank_name} />

          <Field label="IFSC Code" value={data.ifsc_code} />

          <Field label="MICR Code" value={data.micr} />

          <Field label="Bank Account No" value={data.bank_ac_no} />

          <Field label="Account Type" value={data.ac_type} />

          <Field label="PFMS" value={data.pfms} />
        </Section>

        {/* ADDRESS DETAILS */}

        <Section title="Address Details">
          <Field label="Permanent Address" value={data.permanent_address} />

          <Field
            label="Correspondence Address"
            value={data.correspondence_address}
          />

          <Field label="PIN Code" value={data.pin_code} />
        </Section>

        {/* DOCUMENTS */}

        <Section title="Documents">
          <DocumentField label="Photo" file={data.photo_path} />

          <DocumentField label="Signature" file={data.signature_path} />

          <DocumentField label="Salary Slip" file={data.salary_slip_path} />

          <DocumentField
            label="Death Certificate"
            file={data.death_certificate_path}
          />
        </Section>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-[#163269] mb-5 border-b pb-3">
        {title}
      </h2>

      <div className="grid grid-cols-2 gap-5">{children}</div>
    </div>
  );
};

const Field = ({ label, value }) => {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>

      <div className="mt-1 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 font-medium min-h-[50px] flex items-center">
        {value? <span>{value}</span> : <span className="text-gray-500">NA</span> }
      </div>
    </div>
  );
};

const DocumentField = ({ label, file }) => {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>

      <div className="mt-1 border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 min-h-[50px] flex items-center">
        {file ? (
          <a
            href={file}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Document
          </a>
        ) : (
          <span className="text-gray-400">No Document</span>
        )}
      </div>
    </div>
  );
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString();
};

export default ApplicantView;
