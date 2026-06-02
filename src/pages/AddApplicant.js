//=====================================================================================================================
//====================================================================================================================
//                                                  NEW CODE STARTS HERE
//====================================================================================================================
//=====================================================================================================================



import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import ActionBar from "../components/layout/ActionBar";
import Breadcrumb from "../components/ui/Breadcrumb";
import { API } from "../data/api";
import  Loading  from "../components/ui/Loading"
import  Notification from "../components/ui/Notify"
import { AlertTriangle } from "lucide-react";
import ApplicantView from "./ApplicantView";
import { useAuth } from '../context/AuthContext';

import {
  InputField,
  SelectField,
  RadioGroup,
  UploadField,
} from "../components/forms/FormField";
import FormSection from "../components/ui/FormSection";

import {Camera,
  PenTool,
  FileText,
  FileBadge,} from "lucide-react"

import {
  familyMember,
  departments,
  // designations,
  categories,
  castes,
  accountTypes,
  banks,
  // subDepartments,
  payCommissions
} from "../data/mockData";



const initialForm = (user) => ({
  employeeId: "",
  ppoNo: "",
  employeeName: "",
  // dependentName: "",
  relation: "",
  relationName: "",
  // familyName: "",
  department: `${user.role}`,
  subDepartment: "",
  aadhaar: "",
  pan: "",
  dob: "",
  doj: "",
  retirementDate: "",
  dod: "",
  gender: "",
  // empCategory: "",
  gradePay: "",
  lastSalary: "",
  basicSalary: "",
  payCommission: "",
  caste: "",
  categoryType: "Self",
  // categoryPct: "100",
  notionalIncrement: "",
  acp: "Y",
  acp1: "", 
  acp2: "",
  acp3: "",
  pfms: "",
  mobile: "",
  familyMobile: "",
  pinCode: "",
  permAddress: "",
  corrAddress: "",
  bankName: "",
  ifsc: "",
  micr: "",
  acNo: "",
  acType: "",
  photo: null,
  signature: null,
  salarySlip: null,
  deathCertificate: null,
});


// ─── Step Config ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Personal Details", icon: "1", short: "Personal" },
  { id: 2, label: "Pension Details", icon: "2", short: "Pension" },
  { id: 3, label: "Bank Details", icon: "3", short: "Bank" },
  { id: 4, label: "Upload Documents", icon: "4", short: "Documents" },
];

// ─── Step Progress Bar ────────────────────────────────────────────────────────
const StepBar = ({ current }) => (
  <div
    className="flex items-center w-full px-6 py-5"
    style={{ background: "linear-gradient(135deg, #1a2a5e 0%, #0f1d45 100%)" }}
  >
    {STEPS.map((step, idx) => {
      const done = current > step.id;
      const active = current === step.id;
      const last = idx === STEPS.length - 1;
      return (
        <React.Fragment key={step.id}>
          {/* Node */}
          <div className="flex flex-col items-center" style={{ minWidth: 72 }}>
            <div
              className="flex items-center justify-center rounded-full text-sm font-bold transition-all"
              style={{
                width: 40,
                height: 40,
                background: done
                  ? "#22c55e"
                  : active
                    ? "#3b82f6"
                    : "rgba(255,255,255,0.15)",
                color: done || active ? "#fff" : "rgba(255,255,255,0.45)",
                border: active ? "2px solid #93c5fd" : "2px solid transparent",
                boxShadow: active ? "0 0 0 4px rgba(59,130,246,0.25)" : "none",
              }}
            >
              {done ? "✓" : step.icon}
            </div>
            <span
              className="mt-1 text-center font-medium"
              style={{
                fontSize: 11,
                color: active
                  ? "#fff"
                  : done
                    ? "#86efac"
                    : "rgba(255,255,255,0.4)",
              }}
            >
              {step.short}
            </span>
          </div>

          {/* Connector */}
          {!last && (
            <div
              className="flex-1 mx-1"
              style={{
                height: 3,
                borderRadius: 2,
                background: done ? "#22c55e" : "rgba(255,255,255,0.15)",
              }}
            />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AddApplicant = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  console.log("Current User in AddApplicant:", user);

  const [form, setForm] = useState(initialForm(user));
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [panError, setPanError] = useState("");
  const [subDepartments, setSubDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);

  //================ Category POP UP ==============================
  const [showCategoryPopup, setShowCategoryPopup] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  //===============================================================

  const [notification, setNotification] = useState({
    open: false,
    type: "",
    message: "",
  });

  async function fetchSubDepartments() {
    try {
      const response = await fetch(`${API}/api/administrator/sub-departments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sub-departments");
      }

      const data = await response.json();
      const filteredSubDepartments = data.data
       .filter((item) => item.department_name === user.role)
       .map((item) => item.sub_department_name);

       console.log("Fetched Sub-Departments:", filteredSubDepartments);

      setSubDepartments(filteredSubDepartments);


    } catch (error) {
      console.error("Error fetching sub-departments:", error);
    }
  }

  async function fetchDesignations() {
    try {
      const response = await fetch(`${API}/api/administrator/designations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

       const designationNames = data.data.map(
         (item) => item.designation_name
       );

       setDesignations(designationNames);
             
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  }

  useEffect(() => {
    fetchSubDepartments();  
    fetchDesignations();
  }, []);



  console.log("==============> USER ROLE ->", form.department);

  //================== Category Pop Up function ============================
   const handleCategorySelect = (category) => {
     setSelectedCategory(category);

     setForm((prev) => ({
       ...prev,
       categoryType: category,
     }));

     setShowCategoryPopup(false);
   };

   //====================  END Category Pop Up function =========================



   //==================== Hidden Input Function =====================================
   const hiddenFields = {
     Self: ["dod", "deathCertificate", "relationName", "relation"],

     Family: ["employeeName"],

     Disability: ["dod", "deathCertificate"],
   };

   const isFieldHidden = (fieldName) => {
     return hiddenFields[selectedCategory]?.includes(fieldName);
   };
   //==================== End Hidden Input Function =====================================



  // ── Handle Change ────────────────────────────────────────────────────────
  const handleChange = (e) => {
    let { name, value, files } = e.target;

    if (name === "aadhaar") {
      if (!/^\d*$/.test(value) || value.length > 12) return;
    }
    if (name === "mobile" || name === "familyMobile") {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }
    if (name === "pinCode") {
      if (!/^\d*$/.test(value) || value.length > 6) return;
    }

    // if (name === "pan") {
    //   const upper = value.toUpperCase();

    //   if (upper.length > 10) return;

    //   setForm((p) => ({
    //     ...p,
    //     [name]: upper,
    //   }));

    //   // Realtime PAN validation
    //   if (upper.length === 10 && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(upper)) {
    //     setPanError("Invalid PAN format");
    //   } else {
    //     setPanError("");
    //   }

    //   return;
    // }

    if (name === "pan") {
      const upper = value.toUpperCase();

      if (upper.length > 10) return;

      value = upper;

      // PAN format validation
      if (upper.length === 10 && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(upper)) {
        setPanError("Invalid PAN format");
      } else {
        setPanError("");
      }
    }


    if (name === "ifsc") {
      const upper = value.toUpperCase();

      if (upper.length > 11) return;

      setForm((p) => ({
        ...p,
        [name]: upper,
      }));

      return;
    }

    if (name === "acNo") {
      if (!/^\d*$/.test(value) || value.length > 18) return;
    }

    if (name === "micr") {
      if (!/^\d*$/.test(value) || value.length > 9) return;
    }

    if (name === "pfms") {
      const upper = value.toUpperCase();

      // max 25 chars
      if (upper.length > 25) return;

      // only alphanumeric
      if (!/^[A-Z0-9]*$/.test(upper)) return;

      setForm((p) => ({
        ...p,
        [name]: upper,
      }));

      return;
    }

    setForm((p) => ({ ...p, [name]: files ? files[0] : value }));
    // if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // ── Per-step validation ──────────────────────────────────────────────────
  const validateStep = (s) => {
    const errs = {};

    if (s === 1) {
      [
        "employeeName",
        "aadhaar",
        "pan",
        "dob",
        "gender",
        "caste",
        "mobile",
        "permAddress",
        "familyMobile",
        "pinCode",
        "aadhaar",
        "aadhaar",
      ].forEach((f) => {
        if (!form[f]) errs[f] = "Required";
      });

      if(selectedCategory === "Self"){
        if (!form["employeeId"]) errs["employeeId"] = "Required";
      }

      if(selectedCategory === "Self"){
        if (!form["employeeName"]) errs["employeeName"] = "Required";
      }

      if (selectedCategory !== "Self") {
        if (!form["relation"]) errs["relation"] = "Required";
      }

      if (selectedCategory !== "Self") {
        if (!form["relationName"]) errs["relationName"] = "Required";
      }

      if (selectedCategory !== "Self") {
        if (!form["dod"]) errs["dod"] = "Required";
      }

      // Aadhaar Validation
      if (form.aadhaar && !/^\d{12}$/.test(form.aadhaar)) {
        errs.aadhaar = "Aadhaar must be exactly 12 digits";
      }

      // PAN Validation
      if (form.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan)) {
        errs.pan = "Invalid PAN format";
      }

      // Mobile Validation
      if (form.mobile && !/^\d{10}$/.test(form.mobile)) {
        errs.mobile = "Mobile must be 10 digits";
      }

      // Family Mobile Validation
      if (form.familyMobile && !/^\d{10}$/.test(form.familyMobile)) {
        errs.familyMobile = "Family mobile must be 10 digits";
      }

      // PIN Validation
      if (form.pinCode && !/^\d{6}$/.test(form.pinCode)) {
        errs.pinCode = "PIN must be 6 digits";
      }
    }

    if (s === 2) {
      [
        "subDepartment",
        "doj",
        "retirementDate",
        "basicSalary",
        "designation",
        "retirementDate",
        "gradePay",
        "basicSalary",
        "acp",
        "acp1",
        "acp2",
        "acp3",
        "notionalIncrement",
      ].forEach((f) => {
        if (!form[f]) errs[f] = "Required";
      });

    }

    if (s === 3) {
      ["bankName", "ifsc", "acNo", "acType", "pfms"].forEach((f) => {
        if (!form[f]) errs[f] = "Required";
      });

      //PFMS Validation
      if (form.pfms && !/^[A-Z0-9]{6,25}$/.test(form.pfms)) {
        errs.pfms = "Invalid PFMS ID";
      }

      // IFSC Validation
      if (form.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc)) {
        errs.ifsc = "Invalid IFSC code";
      }

      // Account Number Vaidation
      if (form.acNo && !/^\d{9,18}$/.test(form.acNo)) {
        errs.acNo = "Account number must be 9 to 18 digits";
      }

      // MICR Validation
      if (form.micr && !/^\d{9}$/.test(form.micr)) {
        errs.micr = "MICR code must be 9 digits";
      }
    }

    // if (s === 4) {
    //   ["photo", "signature"].forEach((f) => {
    //     if (!form[f]) errs[f] = "Required";
    //   });
    // }

    console.log("Validation Errors:", errs);

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  // ── Navigation ───────────────────────────────────────────────────────────
  const goNext = () => {
    if (!validateStep(step)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (step < 4) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowPreview(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (showPreview) {
      setShowPreview(false);
      return;
    }
    if (step > 1) {
      setStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReset = () => {
    let fieldsToReset = [];

    // Step 1 → Personal Details
    if (step === 1) {
      fieldsToReset = [
        "employeeId",
        "ppoNo",
        "employeeName",
        "relation",
        "relationName",
        "aadhaar",
        "pan",
        "dob",
        "dod",
        "gender",
        "caste",
        "mobile",
        "familyMobile",
        "pinCode",
        "permAddress",
        "corrAddress",
      ];
    }

    // Step 2 → Pension Details
    else if (step === 2) {
      fieldsToReset = [
        "department",
        "subDepartment", 
        "designation",
        "doj",
        "retirementDate",
        "gradePay",
        "lastSalary",
        "basicSalary",
        "payCommission",
        "categoryType",
        "acp",
        "acp1",
        "acp2",
        "acp3",
        "notionalIncrement",
      ];
    }

    // Step 3 → Bank Details
    else if (step === 3) {
      fieldsToReset = ["bankName", "ifsc", "micr", "acNo", "acType", "pfms"];
    }

    // Step 4 → Documents
    else if (step === 4) {
      fieldsToReset = ["photo", "signature", "salarySlip", "deathCertificate"];
    }

    setForm((prev) => {
      const updated = { ...prev };

      fieldsToReset.forEach((field) => {
        updated[field] = initialForm[field];
      });

      return updated;
    });

    setErrors({});
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined) fd.append(k, v);
      });

      const token = localStorage.getItem("token");

      const user = JSON.parse(localStorage.getItem("user"));

      console.log("Changement completed on Frontend => ", fd)

      const res = await fetch(`${API}/api/pensioners`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-user-role": user?.role,
          "x-user-id": user?.id,
        },
        body: fd,
      });
      const data = await res.json();
      const { message, success } = data;
      

      if (success) {
        setNotification({
          open: true,
          type: "success",
          message: "Employee Pension saved successfully",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setNotification({
          open: true,
          type: "error",
          message: "Pensioner Not Added.",
        });
      }
    } catch (err) {
      setNotification({
        open: true,
        type: "error",
        message: err.message || "Submit Failed",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Error Banner ─────────────────────────────────────────────────────────
  const ErrorBanner = () =>
    Object.keys(errors).length > 0 ? (
      <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-4 py-3 flex items-center gap-2">
        <span className="text-base">⚠️</span>
        Please fill all required fields correctly before proceeding.
      </div>
    ) : null;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <Notification
        open={notification.open}
        type={notification.type}
        message={notification.message}
        onClose={() =>
          setNotification((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />

      <div className="min-h-scree bg-black " style={{ background: "#f0f2f5" }}>
        <Navbar />

        <div className="px-6 py-6 max-w-7xl mx-auto ">
          <Breadcrumb
            items={[
              { label: "Home", link: "/dashboard" },
              { label: "Add Applicant" },
            ]}
          />
          {/* <ActionBar /> */}

          <div className="bg-white my-12 shadow-sm overflow-hidden">
            {/* ── Header + Step Bar ─────────────────────────────── */}
            <div
              style={{
                background: "linear-gradient(135deg, #1a2a5e 0%, #0f1d45 100%)",
                fontFamily: "Arial",
              }}
            >
              <div className="px-6 pt-5 pb-2 flex items-center justify-between">
                <div>
                  <div
                    className="text-white font-bold text-lg pb-2"
                    style={{
                      fontFamily: "Arial",
                    }}
                  >
                    Pensioner Registration
                  </div>
                  <div className="text-blue-300 text-xs">
                    {showPreview
                      ? "Review your application before submitting"
                      : `Step ${step} of 4 — ${STEPS[step - 1].label}`}
                  </div>
                </div>
                {/* <span className="text-white text-2xl opacity-50">
                {showPreview ? "🔍" : STEPS[step - 1].icon}
              </span> */}
              </div>
              <StepBar current={showPreview ? 5 : step} />
            </div>

            <div className="p-6">
              {/* ══════════════════════════════════════════════════
                PREVIEW
            ══════════════════════════════════════════════════ */}

              {showPreview && (
                <>
                  <div className="space-y-6">
                    {/* PERSONAL DETAILS */}
                    <div className="border border-blue-200 bg-blue-50 rounded-xl p-5">
                      <div
                        className="text-lg font-bold text-blue-800 mb-4"
                        style={{ fontFamily: "Arial" }}
                      >
                        Personal Details
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {[
                          ["Employee ID", form.employeeId],
                          ["PPO No", form.ppoNo],
                          ["Employee Name", form.employeeName],
                          ["Aadhaar", form.aadhaar],
                          ["PAN", form.pan],
                          ["Date of Birth", form.dob],
                          ["Gender", form.gender],
                          ["Caste", form.caste],
                          ["Relation", form.relation],
                          [
                            "Name of Spouse/Father/Mother/Self",
                            form.relationName,
                          ],
                        ].map(([label, val]) => (
                          <div
                            key={label}
                            className="bg-white rounded-lg px-3 py-2 border border-blue-100"
                          >
                            <span className="text-gray-400 text-xs block">
                              {label}
                            </span>

                            <span className="font-medium text-gray-800">
                              {val || "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CONTACT DETAILS */}
                    <div className="border border-blue-200 bg-blue-50 rounded-xl p-5">
                      <div
                        className="text-lg font-bold text-blue-800 mb-4"
                        style={{ fontFamily: "Arial" }}
                      >
                        Contact & Address
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {[
                          ["Mobile", form.mobile],
                          ["Family Mobile", form.familyMobile],
                          ["PIN Code", form.pinCode],
                          ["Permanent Address", form.permAddress],
                        ].map(([label, val]) => (
                          <div
                            key={label}
                            className="bg-white rounded-lg px-3 py-2 border border-blue-100"
                          >
                            <span className="text-gray-400 text-xs block">
                              {label}
                            </span>

                            <span className="font-medium text-gray-800 break-words">
                              {val || "NA"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PENSION DETAILS */}
                    <div className="border border-blue-200 bg-blue-50 rounded-xl p-5">
                      <div
                        className="text-lg font-bold text-blue-800 mb-4"
                        style={{ fontFamily: "Arial" }}
                      >
                        Pension Details
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {[
                          ["Department", form.department],
                          ["Sub Department", form.subDepartment],
                          ["Designation", form.designation],
                          ["Retirement Date", form.retirementDate],
                          // ["Employee Category", form.empCategory],
                          ["Grade Pay", form.gradePay],
                          ["Last Salary", form.lastSalary],
                          ["Basic Salary", form.basicSalary],
                          ["Pay Commission", form.payCommission],
                        ].map(([label, val]) => (
                          <div
                            key={label}
                            className="bg-white rounded-lg px-3 py-2 border border-blue-100"
                          >
                            <span className="text-gray-400 text-xs block">
                              {label}
                            </span>

                            <span className="font-medium text-gray-800">
                              {val || "NA"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PENSION CATEGORY */}
                    <div className="border border-blue-200 bg-blue-50 rounded-xl p-5">
                      <div
                        className="text-lg font-bold text-blue-800 mb-4"
                        style={{ fontFamily: "Arial" }}
                      >
                        Pension Category
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {[
                          ["Category Type", form.categoryType],
                          // ["Category %", form.categoryPct],
                          ["ACP", form.acp],
                          ["Notional Increment", form.notionalIncrement],
                        ].map(([label, val]) => (
                          <div
                            key={label}
                            className="bg-white rounded-lg px-3 py-2 border border-blue-100"
                          >
                            <span className="text-gray-400 text-xs block">
                              {label}
                            </span>

                            <span className="font-medium text-gray-800">
                              {val || "NA"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* BANK DETAILS */}
                    <div className="border border-blue-200 bg-blue-50 rounded-xl p-5">
                      <div
                        className="text-lg font-bold text-blue-800 mb-4"
                        style={{ fontFamily: "Arial" }}
                      >
                        Bank Details
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {[
                          ["Bank Name", form.bankName],
                          ["IFSC", form.ifsc],
                          ["MICR", form.micr],
                          ["Account Number", form.acNo],
                          ["Account Type", form.acType],
                          ["PFMS", form.pfms],
                        ].map(([label, val]) => (
                          <div
                            key={label}
                            className="bg-white rounded-lg px-3 py-2 border border-blue-100"
                          >
                            <span className="text-gray-400 text-xs block">
                              {label}
                            </span>

                            <span className="font-medium text-gray-800">
                              {val || "—"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DOCUMENTS */}
                    <div className="border border-blue-200 bg-blue-50 rounded-xl p-5">
                      <div
                        className="text-lg font-bold text-blue-800 mb-4"
                        style={{ fontFamily: "Arial" }}
                      >
                        Uploaded Documents
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        {[
                          ["Photo", form.photo],
                          ["Signature", form.signature],
                          ["Salary Slip", form.salarySlip],
                          ["Death Certificate", form.deathCertificate],
                        ].map(([label, file]) => (
                          <div
                            key={label}
                            className="bg-white rounded-lg px-3 py-2 border border-blue-100"
                          >
                            <span className="text-gray-400 text-xs block">
                              {label}
                            </span>

                            <span
                              className={`font-medium text-sm ${
                                file ? "text-green-600" : "text-gray-400"
                              }`}
                            >
                              {file ? `✅ ${file.name}` : "Not uploaded"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-300 text-amber-800 px-4 py-3 rounded-xl text-sm">
                      <AlertTriangle size={18} className="mt-0.5" />

                      <p>
                        कृपया सभी जानकारी सही एवं ध्यानपूर्वक भरें। एक बार डेटा
                        सेव हो जाने के बाद उसमें किसी भी प्रकार का संशोधन (Edit)
                        नहीं किया जा सकेगा।
                      </p>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex justify-between pt-6">
                    <button
                      onClick={goBack}
                      className="px-5 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                    >
                      ← Edit Form
                    </button>

                    <div className="flex gap-3">
                      <button
                        onClick={handleReset}
                        className="px-5 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                      >
                        Reset
                      </button>

                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-7 py-2 text-white rounded-lg text-sm font-medium transition"
                        style={{
                          background:
                            "linear-gradient(135deg, #1a2a5e, #2d4a9a)",
                        }}
                      >
                        {loading ? (
                          <Loading size={18} text="Submitting..." />
                        ) : (
                          "✔ Final Submit"
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ══════════════════════════════════════════════════
                STEP 1 — Personal Details
            ══════════════════════════════════════════════════ */}
              {!showPreview && step === 1 && (
                <>
                  <ErrorBanner />
                  <FormSection title="Personal Details">
                    <div>
                      <InputField
                        label={
                          selectedCategory == "Self"
                            ? "Employee ID"
                            : "Pensioner Department Employee ID"
                        }
                        required={selectedCategory == "Self"}
                        name="employeeId"
                        value={form.employeeId}
                        onChange={handleChange}
                      />
                      {errors.employeeId && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.employeeId}
                        </p>
                      )}
                    </div>

                    <InputField
                      label="PPO No."
                      name="ppoNo"
                      value={form.ppoNo}
                      onChange={handleChange}
                    />

                    <div>
                      <InputField
                        label="Employee Name"
                        required
                        name="employeeName"
                        value={form.employeeName}
                        onChange={handleChange}
                      />
                      {errors.employeeName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.employeeName}
                        </p>
                      )}
                    </div>

                    {!isFieldHidden("relation") && (
                      <div>
                        <SelectField
                          label="Relation"
                          required
                          name="relation"
                          value={form.relation}
                          onChange={handleChange}
                          options={familyMember}
                        />
                        {errors.relation && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.relation}
                          </p>
                        )}
                      </div>
                    )}

                    {!isFieldHidden("relationName") && (
                      <div>
                        <InputField
                          label={"Name of Spouse/Father/Mother"}
                          required
                          name="relationName"
                          value={form.relationName}
                          onChange={handleChange}
                        />
                        {errors.relationName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.relationName}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <InputField
                        label="Aadhaar"
                        required
                        name="aadhaar"
                        value={form.aadhaar}
                        onChange={handleChange}
                        placeholder="12 digit Aadhaar"
                      />
                      {errors.aadhaar && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.aadhaar}
                        </p>
                      )}
                    </div>
                    <div>
                      <InputField
                        label="PAN"
                        required
                        name="pan"
                        value={form.pan}
                        onChange={handleChange}
                        placeholder="ABCDE1234F"
                      />

                      {errors.pan && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.pan}
                        </p>
                      )}
                    </div>

                    <div>
                      <InputField
                        type="date"
                        label="Date of Birth"
                        required
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                      />
                      {errors.dob && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.dob}
                        </p>
                      )}
                    </div>

                    {!isFieldHidden("dod") && (
                      <div>
                        <InputField
                          type="date"
                          label="Date of Death"
                          required
                          name="dod"
                          value={form.dod}
                          onChange={handleChange}
                        />

                        {errors.dob && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.dob}
                          </p>
                        )}
                      </div>
                    )}
                    <div>
                      <SelectField
                        label="Gender"
                        required
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        options={["Male", "Female", "Other"]}
                      />
                      {errors.gender && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.gender}
                        </p>
                      )}
                    </div>

                    <div>
                      <SelectField
                        label="Caste"
                        required
                        name="caste"
                        value={form.caste}
                        onChange={handleChange}
                        options={castes}
                      />

                      {errors.gender && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.gender}
                        </p>
                      )}
                    </div>
                  </FormSection>

                  <FormSection title="Contact & Address">
                    <div>
                      <InputField
                        label="Mobile"
                        required
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                      />
                      {errors.mobile && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.mobile}
                        </p>
                      )}
                    </div>
                    <div>
                      <InputField
                        label="Family Mobile"
                        required
                        name="familyMobile"
                        value={form.familyMobile}
                        onChange={handleChange}
                      />
                      {errors.familyMobile && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.familyMobile}
                        </p>
                      )}
                    </div>
                    <div>
                      <InputField
                        label="PIN Code"
                        required
                        name="pinCode"
                        value={form.pinCode}
                        onChange={handleChange}
                      />
                      {errors.pinCode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.pinCode}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Permanent Address{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <textarea
                        rows={3}
                        name="permAddress"
                        value={form.permAddress}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        required
                      />
                      {errors.permAddress && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.permAddress}
                        </p>
                      )}
                    </div>

                    {/* Checkbox */}
                    <div className="md:col-span-2 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="sameAddress"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm((prev) => ({
                              ...prev,
                              corrAddress: prev.permAddress,
                            }));
                          } else {
                            setForm((prev) => ({
                              ...prev,
                              corrAddress: "",
                            }));
                          }
                        }}
                      />

                      <label
                        htmlFor="sameAddress"
                        className="text-sm text-gray-700"
                      >
                        Same as Permanent Address
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Correspondence Address
                      </label>

                      <textarea
                        rows={3}
                        name="corrAddress"
                        value={form.corrAddress}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                  </FormSection>
                </>
              )}

              {/* =================================================
                STEP 2 ceate by me 
                ================================================= */}

              {!showPreview && step === 2 && (
                <>
                  <ErrorBanner />
                  <FormSection title="Pension Details">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Department
                      </label>

                      <input
                        type="text"
                        name="department"
                        value={form.department}
                        readOnly
                        className="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2 text-sm text-gray-600 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <SelectField
                        label="Sub Department"
                        required
                        name="subDepartment"
                        value={form.subDepartment}
                        onChange={handleChange}
                        options={subDepartments}
                      />
                      {errors.subDepartment && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.subDepartment}
                        </p>
                      )}
                    </div>

                    <div>
                      <SelectField
                        label="Designation"
                        required
                        name="designation"
                        value={form.designation}
                        onChange={handleChange}
                        options={designations}
                      />
                      {errors.designation && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.designation}
                        </p>
                      )}
                    </div>

                    {!isFieldHidden("doj") && (
                      <InputField
                        type="date"
                        label="Date of Joining"
                        required
                        name="doj"
                        value={form.doj}
                        onChange={handleChange}
                      />
                    )}

                    {!isFieldHidden("retirementDate") && (
                      <div>
                        <InputField
                          type="date"
                          label="Retirement Date"
                          required
                          name="retirementDate"
                          value={form.retirementDate}
                          onChange={handleChange}
                        />
                        {errors.retirementDate && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.retirementDate}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <InputField
                        label="Grade Pay"
                        required
                        name="gradePay"
                        value={form.gradePay}
                        onChange={handleChange}
                      />
                      {errors.gradePay && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.gradePay}
                        </p>
                      )}
                    </div>

                    <InputField
                      label="Basic Salary"
                      required
                      name="basicSalary"
                      value={form.basicSalary}
                      onChange={handleChange}
                    />

                   
                      <InputField
                        label="Last Salary"
                        required
                        name="lastSalary"
                        value={form.lastSalary}
                        onChange={handleChange}
                      />
                  

                    <div>
                      <SelectField
                        label="Pay Commission"
                        required
                        name="payCommission"
                        value={form.payCommission}
                        onChange={handleChange}
                        options={payCommissions}
                      />
                      {errors.payCommission && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.payCommission}
                        </p>
                      )}
                    </div>
                  </FormSection>

                  <FormSection icon="📂" title="Pension Category">
                    <div className="flex flex-col gap-7">
                      <div>
                        <RadioGroup
                          label="ACP Status"
                          required
                          name="acp"
                          value={form.acp}
                          onChange={handleChange}
                          options={["Paid", "Not Paid"]}
                        />
                        {errors.acp && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.acp}
                          </p>
                        )}
                      </div>

                      <div>
                        <RadioGroup
                          label="ACP I"
                          required
                          name="acp1"
                          value={form.acp1}
                          onChange={handleChange}
                          options={["Yes", "No", "Not Eligible"]}
                        />
                        {errors.acp1 && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.acp1}
                          </p>
                        )}
                      </div>

                      <div>
                        <RadioGroup
                          label="ACP II"
                          required
                          name="acp2"
                          value={form.acp2}
                          onChange={handleChange}
                          options={["Yes", "No", "Not Eligible"]}
                        />
                        {errors.acp2 && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.acp2}
                          </p>
                        )}
                      </div>

                      <div>
                        <RadioGroup
                          label="ACP III"
                          required
                          name="acp3"
                          value={form.acp3}
                          onChange={handleChange}
                          options={["Yes", "No", "Not Eligible"]}
                        />
                        {errors.acp3 && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.acp3}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <RadioGroup
                        label="Notional Increment"
                        required
                        name="notionalIncrement"
                        value={form.notionalIncrement}
                        onChange={handleChange}
                        options={["Yes-Eligible", "Not Eligible"]}
                      />
                      {errors.notionalIncrement && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.notionalIncrement}
                        </p>
                      )}
                    </div>
                  </FormSection>
                </>
              )}

              {/* ══════════════════════════════════════════════════
                STEP 3 — Bank Details
            ══════════════════════════════════════════════════ */}
              {!showPreview && step === 3 && (
                <>
                  <ErrorBanner />
                  <FormSection icon="🏦" title="Bank Details">
                    <div>
                      <SelectField
                        label="Bank Name"
                        required
                        name="bankName"
                        value={form.bankName}
                        onChange={handleChange}
                        options={banks}
                      />

                      {errors.bankName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.bankName}
                        </p>
                      )}
                    </div>

                    <div>
                      <InputField
                        label="IFSC"
                        required
                        name="ifsc"
                        value={form.ifsc}
                        onChange={handleChange}
                      />
                      {errors.ifsc && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.ifsc}
                        </p>
                      )}
                    </div>

                    <InputField
                      label="MICR"
                      name="micr"
                      value={form.micr}
                      onChange={handleChange}
                    />

                    <div>
                      <InputField
                        label="Account Number"
                        required
                        name="acNo"
                        value={form.acNo}
                        onChange={handleChange}
                      />
                      {errors.acNo && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.acNo}
                        </p>
                      )}
                    </div>

                    <div>
                      <SelectField
                        label="Account Type"
                        required
                        name="acType"
                        value={form.acType}
                        onChange={handleChange}
                        options={accountTypes}
                      />
                      {errors.acType && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.acType}
                        </p>
                      )}
                    </div>

                    <div>
                      <InputField
                        label="PFMS"
                        required
                        name="pfms"
                        value={form.pfms}
                        onChange={handleChange}
                        placeholder="e.g. PFMS2024001234"
                      />
                      {errors.pfms && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.pfms}
                        </p>
                      )}
                    </div>
                  </FormSection>
                </>
              )}

              {/* ══════════════════════════════════════════════════
                STEP 4 — Upload Documents
            ══════════════════════════════════════════════════ */}
              {!showPreview && step === 4 && (
                <>
                  <ErrorBanner />
                  <FormSection icon="📎" title="Upload Documents">
                    <div>
                      <UploadField
                        label="Photo"
                        name="photo"
                        onChange={handleChange}
                        accept="image/*"
                        Icon={Camera}
                      />
                      {form.photo && (
                        <p className="text-green-600 text-xs mt-1">
                          ✅ {form.photo.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <UploadField
                        label="Signature"
                        name="signature"
                        onChange={handleChange}
                        accept="image/*"
                        Icon={PenTool}
                      />
                      {form.signature && (
                        <p className="text-green-600 text-xs mt-1">
                          ✅ {form.signature.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <UploadField
                        label="Salary Slip"
                        name="salarySlip"
                        onChange={handleChange}
                        accept="application/pdf"
                        Icon={FileText}
                      />
                      {form.salarySlip && (
                        <p className="text-green-600 text-xs mt-1">
                          ✅ {form.salarySlip.name}
                        </p>
                      )}
                    </div>

                    {!isFieldHidden("deathCertificate") && (
                      <div>
                        <UploadField
                          label="Death Certificate"
                          name="deathCertificate"
                          onChange={handleChange}
                          accept="application/pdf,image/*"
                          Icon={FileBadge}
                        />
                        {form.deathCertificate && (
                          <p className="text-green-600 text-xs mt-1">
                            ✅ {form.deathCertificate.name}
                          </p>
                        )}
                      </div>
                    )}
                  </FormSection>
                </>
              )}

              {/* ══════════════════════════════════════════════════
                Navigation Buttons (steps only)
            ══════════════════════════════════════════════════ */}
              {!showPreview && (
                <div className="flex justify-between items-center pt-5 mt-2 border-t border-gray-200">
                  <div className="flex gap-3">
                    <button
                      onClick={handleReset}
                      className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="flex gap-3">
                    {step > 1 && (
                      <button
                        onClick={goBack}
                        className="px-5 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        ← Back
                      </button>
                    )}
                    <button
                      onClick={goNext}
                      className="px-7 py-2 text-sm text-white rounded-lg font-medium transition"
                      style={{
                        background: "linear-gradient(135deg, #1a2a5e, #2d4a9a)",
                      }}
                    >
                      {step === 4 ? "Preview Application →" : "Next →"}
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* /p-6 */}
          </div>
          {/* /card */}
        </div>
      </div>

      {showCategoryPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[400px] shadow-2xl border border-gray-200">
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
              Select Pension Category
            </h2>

            <p className="text-sm text-gray-500 text-center mb-6">
              Please choose pension category
            </p>

            <div className="space-y-4">
              <button
                onClick={() => handleCategorySelect("Self")}
                className="w-full py-3 bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 rounded-xl transition-all duration-200 font-medium border border-gray-200"
              >
                Self Pension
              </button>

              <button
                onClick={() => handleCategorySelect("Family")}
                className="w-full py-3 bg-blue-50 hover:bg-blue-600 hover:text-white text-gray-700 rounded-xl transition-all duration-200 font-medium border border-blue-200"
              >
                Family Pension
              </button>

              <button
                onClick={() => handleCategorySelect("Dependent")}
                className="w-full py-3 bg-blue-50 hover:bg-blue-600 hover:text-white text-gray-700 rounded-xl transition-all duration-200 font-medium border border-blue-200"
              >
                Dependent Pension
              </button>

              <button
                onClick={() => handleCategorySelect("Disability")}
                className="w-full py-3 bg-blue-50 hover:bg-blue-600 hover:text-white text-gray-700 rounded-xl transition-all duration-200 font-medium border border-blue-200"
              >
                Disability Pension
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};;

export default AddApplicant;



