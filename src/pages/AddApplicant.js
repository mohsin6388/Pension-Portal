// export default AddApplicant;
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/layout/Navbar";
// import ActionBar from "../components/layout/ActionBar";
// import Breadcrumb from "../components/ui/Breadcrumb";
// import StepIndicator from "../components/ui/StepIndicator";
// import FormSection from "../components/ui/FormSection";

// import {
//   InputField,
//   SelectField,
//   RadioGroup,
//   UploadField,
// } from "../components/forms/FormField";

// import {
//   departments,
//   designations,
//   categories,
//   castes,
//   accountTypes,
// } from "../data/mockData";

// const initialForm = {
//   employeeId: "",
//   ppoNo: "",
//   department: "",
//   designationPost: "",
//   aadhaar: "",
//   pan: "",
//   dob: "",
//   doj: "",
//   retirementDate: "",
//   dateOfDeath: "",
//   gender: "",
//   employeeCategory: "",
//   gradePay: "",
//   lastSalary: "",
//   caste: "",
//   dependentName: "",
//   categoryType: "Self",
//   categoryPct: "100%",
//   notionalIncrement: "Yes",
//   acp: "Yes",
//   pfms: "",
//   mobile: "",
//   familyMobile: "",
//   pinCode: "",
//   permanentAddress: "",
//   correspondenceAddress: "",
//   bankName: "",
//   ifsc: "",
//   micr: "",
//   accountNo: "",
//   accountType: "",
//   photo: null,
//   signature: null,
//   salarySlip: null,
//   deathCertificate: null,
// };

// const AddApplicant = () => {
//   const [form, setForm] = useState(initialForm);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);

//   const navigate = useNavigate();

//   // HANDLE CHANGE
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     // Aadhaar validation
//     if (name === "aadhaar") {
//       if (!/^\d*$/.test(value)) return;

//       if (value.length > 12) return;
//     }

//     // PAN validation
//     if (name === "pan") {
//       const upper = value.toUpperCase();

//       if (upper.length > 10) return;

//       setForm((prev) => ({
//         ...prev,
//         [name]: upper,
//       }));

//       return;
//     }

//     setForm((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));

//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   // VALIDATE
//   const validate = () => {
//     const required = [
//       "employeeId",
//       "department",
//       "designationPost",
//       "dob",
//       "retirementDate",
//       "gender",
//       "employeeCategory",
//       "gradePay",
//       "mobile",
//       "bankName",
//       "ifsc",
//       "accountNo",
//       "accountType",
//     ];

//     const errs = {};

//     required.forEach((field) => {
//       if (!form[field]) {
//         errs[field] = "Required";
//       }
//     });

//     // Aadhaar Validation
//     if (form.aadhaar && !/^\d{12}$/.test(form.aadhaar)) {
//       errs.aadhaar = "Aadhaar must be 12 digits";
//     }

//     // PAN Validation
//     if (form.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan)) {
//       errs.pan = "Invalid PAN format";
//     }

//     setErrors(errs);

//     return Object.keys(errs).length === 0;
//   };

//   // RESET
//   const handleReset = () => {
//     setForm(initialForm);
//     setErrors({});
//     setShowPreview(false);
//   };

//   // PREVIEW
//   const handlePreview = () => {
//     if (!validate()) {
//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });

//       return;
//     }

//     setShowPreview(true);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // FINAL SUBMIT
//   const handleApprove = async () => {
//     setLoading(true);

//     const fd = new FormData();

//     Object.entries(form).forEach(([key, value]) => {
//       if (value !== null && value !== undefined) {
//         fd.append(key, value);
//       }
//     });

//     try {
//       const res = await fetch(
//         "https://pension-portal-backend.onrender.com/api/pensioners",
//         {
//           method: "POST",
//           body: fd,
//         },
//       );

//       if (!res.ok) {
//         throw new Error(`Server error ${res.status}`);
//       }

//       const result = await res.json();

//       alert(
//         `✅ Profile submitted successfully!\nReference ID: ${
//           result?.id || result?.referenceId || "-"
//         }`,
//       );

//       navigate("/dashboard");
//     } catch (e) {
//       console.error("Submit Error:", e);

//       alert("❌ Submission failed: " + e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen" style={{ background: "#f0f2f5" }}>
//       <Navbar />

//       <div className="px-6 py-4">
//         <Breadcrumb
//           items={[
//             { label: "Home", link: "/dashboard" },
//             { label: "Add Applicant" },
//           ]}
//         />

//         <ActionBar />

//         <div className="bg-white rounded shadow-sm overflow-hidden">
//           {/* HEADER */}
//           <div
//             className="flex items-center justify-between px-6 py-4"
//             style={{
//               background: "linear-gradient(135deg, #1a2a5e 0%, #0f1d45 100%)",
//             }}
//           >
//             <div>
//               <div className="text-white font-bold text-lg">
//                 Employee Profile — Pensioner Registration
//               </div>

//               <div className="text-blue-300 text-xs">
//                 Fill all required fields
//               </div>
//             </div>

//             <StepIndicator currentStep={showPreview ? 2 : 1} />
//           </div>

//           <div className="p-6">
//             {/* PREVIEW */}
//             {showPreview && (
//               <div className="mb-6 border border-blue-200 bg-blue-50 rounded p-5">
//                 <div className="text-lg font-bold text-blue-800 mb-4">
//                   Preview Application
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <b>Employee ID:</b> {form.employeeId}
//                   </div>

//                   <div>
//                     <b>PPO No:</b> {form.ppoNo}
//                   </div>

//                   <div>
//                     <b>Department:</b> {form.department}
//                   </div>

//                   <div>
//                     <b>Designation:</b> {form.designationPost}
//                   </div>

//                   <div>
//                     <b>Mobile:</b> {form.mobile}
//                   </div>

//                   <div>
//                     <b>Aadhaar:</b> {form.aadhaar}
//                   </div>

//                   <div>
//                     <b>PAN:</b> {form.pan}
//                   </div>

//                   <div>
//                     <b>Bank:</b> {form.bankName}
//                   </div>

//                   <div>
//                     <b>Account No:</b> {form.accountNo}
//                   </div>

//                   <div>
//                     <b>IFSC:</b> {form.ifsc}
//                   </div>

//                   {/* FILE PREVIEW */}
//                   <div>
//                     <b>Photo:</b>{" "}
//                     {form.photo ? form.photo.name : "Not Uploaded"}
//                   </div>

//                   <div>
//                     <b>Signature:</b>{" "}
//                     {form.signature ? form.signature.name : "Not Uploaded"}
//                   </div>

//                   <div>
//                     <b>Salary Slip:</b>{" "}
//                     {form.salarySlip ? form.salarySlip.name : "Not Uploaded"}
//                   </div>

//                   <div>
//                     <b>Death Certificate:</b>{" "}
//                     {form.deathCertificate
//                       ? form.deathCertificate.name
//                       : "Not Uploaded"}
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-3 mt-6">
//                   <button
//                     onClick={() => setShowPreview(false)}
//                     className="px-5 py-2 border border-gray-300 rounded text-sm"
//                   >
//                     Edit Form
//                   </button>

//                   <button
//                     onClick={handleApprove}
//                     disabled={loading}
//                     className="px-6 py-2 text-white rounded text-sm"
//                     style={{
//                       background: "linear-gradient(135deg, #1a2a5e, #2d4a9a)",
//                     }}
//                   >
//                     {loading ? "Submitting..." : "Final Submit"}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* FORM */}
//             {!showPreview && (
//               <>
//                 {/* BASIC */}
//                 <FormSection icon="👤" title="Basic Information">
//                   <InputField
//                     label="Employee ID"
//                     required
//                     name="employeeId"
//                     value={form.employeeId}
//                     onChange={handleChange}
//                   />

//                   <InputField
//                     label="PPO No."
//                     name="ppoNo"
//                     value={form.ppoNo}
//                     onChange={handleChange}
//                   />

//                   <SelectField
//                     label="Department"
//                     required
//                     name="department"
//                     value={form.department}
//                     onChange={handleChange}
//                     options={departments}
//                   />

//                   <SelectField
//                     label="Designation"
//                     required
//                     name="designationPost"
//                     value={form.designationPost}
//                     onChange={handleChange}
//                     options={designations}
//                   />

//                   {/* Aadhaar */}
//                   <div>
//                     <InputField
//                       label="Aadhaar"
//                       name="aadhaar"
//                       value={form.aadhaar}
//                       onChange={handleChange}
//                       placeholder="12 Digit Aadhaar"
//                     />

//                     {errors.aadhaar && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.aadhaar}
//                       </p>
//                     )}
//                   </div>

//                   {/* PAN */}
//                   <div>
//                     <InputField
//                       label="PAN"
//                       name="pan"
//                       value={form.pan}
//                       onChange={handleChange}
//                       placeholder="ABCDE1234F"
//                     />

//                     {errors.pan && (
//                       <p className="text-red-500 text-xs mt-1">{errors.pan}</p>
//                     )}
//                   </div>

//                   <InputField
//                     label="Date of Birth"
//                     required
//                     type="date"
//                     name="dob"
//                     value={form.dob}
//                     onChange={handleChange}
//                   />

//                   <InputField
//                     label="Retirement Date"
//                     required
//                     type="date"
//                     name="retirementDate"
//                     value={form.retirementDate}
//                     onChange={handleChange}
//                   />

//                   <SelectField
//                     label="Gender"
//                     required
//                     name="gender"
//                     value={form.gender}
//                     onChange={handleChange}
//                     options={["Male", "Female", "Other"]}
//                   />

//                   <InputField
//                     label="Mobile"
//                     required
//                     name="mobile"
//                     value={form.mobile}
//                     onChange={handleChange}
//                   />
//                 </FormSection>

//                 {/* BANK */}
//                 <FormSection icon="🏦" title="Bank Details">
//                   <InputField
//                     label="Bank Name"
//                     required
//                     name="bankName"
//                     value={form.bankName}
//                     onChange={handleChange}
//                   />

//                   <InputField
//                     label="IFSC"
//                     required
//                     name="ifsc"
//                     value={form.ifsc}
//                     onChange={handleChange}
//                   />

//                   <InputField
//                     label="Account Number"
//                     required
//                     name="accountNo"
//                     value={form.accountNo}
//                     onChange={handleChange}
//                   />

//                   <SelectField
//                     label="Account Type"
//                     required
//                     name="accountType"
//                     value={form.accountType}
//                     onChange={handleChange}
//                     options={accountTypes}
//                   />
//                 </FormSection>

//                 {/* UPLOADS */}
//                 <FormSection icon="📎" title="Documents Upload">
//                   <div>
//                     <UploadField
//                       label="Photo"
//                       name="photo"
//                       onChange={handleChange}
//                       accept="image/*"
//                     />

//                     {form.photo && (
//                       <p className="text-green-600 text-xs mt-1">
//                         ✅ {form.photo.name}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <UploadField
//                       label="Signature"
//                       name="signature"
//                       onChange={handleChange}
//                       accept="image/*"
//                     />

//                     {form.signature && (
//                       <p className="text-green-600 text-xs mt-1">
//                         ✅ {form.signature.name}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <UploadField
//                       label="Salary Slip"
//                       name="salarySlip"
//                       onChange={handleChange}
//                       accept="application/pdf"
//                     />

//                     {form.salarySlip && (
//                       <p className="text-green-600 text-xs mt-1">
//                         ✅ {form.salarySlip.name}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <UploadField
//                       label="Death Certificate"
//                       name="deathCertificate"
//                       onChange={handleChange}
//                       accept="application/pdf,image/*"
//                     />

//                     {form.deathCertificate && (
//                       <p className="text-green-600 text-xs mt-1">
//                         ✅ {form.deathCertificate.name}
//                       </p>
//                     )}
//                   </div>
//                 </FormSection>

//                 {/* BUTTONS */}
//                 <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={handleReset}
//                     className="px-5 py-2 text-sm border border-gray-300 rounded"
//                   >
//                     Reset
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => navigate("/dashboard")}
//                     className="px-5 py-2 text-sm border border-gray-300 rounded"
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     type="button"
//                     onClick={handlePreview}
//                     className="px-6 py-2 text-sm text-white rounded font-medium"
//                     style={{
//                       background: "linear-gradient(135deg, #1a2a5e, #2d4a9a)",
//                     }}
//                   >
//                     Preview Application
//                   </button>
//                 </div>

//                 {/* ERROR */}
//                 {Object.keys(errors).length > 0 && (
//                   <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded px-3 py-2">
//                     Please fill all required fields properly.
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddApplicant;
//=====================================================
//====================================================
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import Navbar from "../components/layout/Navbar";
// import ActionBar from "../components/layout/ActionBar";
// import Breadcrumb from "../components/ui/Breadcrumb";
// import StepIndicator from "../components/ui/StepIndicator";
// import FormSection from "../components/ui/FormSection";

// import {
//   InputField,
//   SelectField,
//   RadioGroup,
//   UploadField,
// } from "../components/forms/FormField";

// import {
//   departments,
//   designations,
//   categories,
//   castes,
//   accountTypes,
// } from "../data/mockData";

// const initialForm = {
//   employeeId: "",
//   ppoNo: "",

//   department: "",
//   designation: "",

//   aadhaar: "",
//   pan: "",

//   dob: "",
//   doj: "",
//   retirementDate: "",
//   dod: "",

//   gender: "",
//   empCategory: "",

//   gradePay: "",
//   lastSalary: "",

//   caste: "",
//   dependentName: "",

//   categoryType: "Self",
//   categoryPct: "100",

//   notionalIncrement: "Y",
//   acp: "Y",

//   pfms: "",

//   mobile: "",
//   familyMobile: "",

//   pinCode: "",
//   permAddress: "",
//   corrAddress: "",

//   bankName: "",
//   ifsc: "",
//   micr: "",
//   acNo: "",
//   acType: "",

//   photo: null,
//   signature: null,
//   salarySlip: null,
//   deathCertificate: null,
// };

// const AddApplicant = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState(initialForm);

//   const [errors, setErrors] = useState({});

//   const [loading, setLoading] = useState(false);

//   const [showPreview, setShowPreview] = useState(false);

//   // =========================
//   // HANDLE CHANGE
//   // =========================

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     // Aadhaar
//     if (name === "aadhaar") {
//       if (!/^\d*$/.test(value)) return;

//       if (value.length > 12) return;
//     }

//     // Mobile
//     if (name === "mobile" || name === "familyMobile") {
//       if (!/^\d*$/.test(value)) return;

//       if (value.length > 10) return;
//     }

//     // Pin code
//     if (name === "pinCode") {
//       if (!/^\d*$/.test(value)) return;

//       if (value.length > 6) return;
//     }

//     // PAN uppercase
//     if (name === "pan") {
//       const upper = value.toUpperCase();

//       if (upper.length > 10) return;

//       setForm((prev) => ({
//         ...prev,
//         [name]: upper,
//       }));

//       return;
//     }

//     setForm((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));

//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   // =========================
//   // VALIDATION
//   // =========================

//   const validate = () => {
//     const errs = {};

//     const required = [
//       "employeeId",
//       "department",
//       "designation",
//       "dob",
//       "retirementDate",
//       "gender",
//       "empCategory",
//       "gradePay",
//       "mobile",
//       "bankName",
//       "ifsc",
//       "acNo",
//       "acType",
//     ];

//     required.forEach((field) => {
//       if (!form[field]) {
//         errs[field] = "Required";
//       }
//     });

//     // Aadhaar validation
//     if (form.aadhaar && !/^\d{12}$/.test(form.aadhaar)) {
//       errs.aadhaar = "Aadhaar must be exactly 12 digits";
//     }

//     // PAN validation
//     if (form.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan)) {
//       errs.pan = "Invalid PAN format";
//     }

//     // Mobile validation
//     if (form.mobile && !/^\d{10}$/.test(form.mobile)) {
//       errs.mobile = "Mobile number must be 10 digits";
//     }

//     // Family mobile validation
//     if (form.familyMobile && !/^\d{10}$/.test(form.familyMobile)) {
//       errs.familyMobile = "Family mobile must be 10 digits";
//     }

//     // PIN code validation
//     if (form.pinCode && !/^\d{6}$/.test(form.pinCode)) {
//       errs.pinCode = "PIN code must be 6 digits";
//     }

//     // IFSC validation
//     if (form.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc)) {
//       errs.ifsc = "Invalid IFSC code";
//     }

//     setErrors(errs);

//     return Object.keys(errs).length === 0;
//   };

//   // =========================
//   // RESET
//   // =========================

//   const handleReset = () => {
//     setForm(initialForm);

//     setErrors({});

//     setShowPreview(false);
//   };

//   // =========================
//   // PREVIEW
//   // =========================

//   const handlePreview = () => {
//     if (!validate()) {
//       window.scrollTo({
//         top: 0,
//         behavior: "smooth",
//       });

//       return;
//     }

//     setShowPreview(true);

//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   // =========================
//   // FINAL SUBMIT
//   // =========================

//   const handleSubmit = async () => {
//     setLoading(true);

//     try {
//       const fd = new FormData();

//       Object.entries(form).forEach(([key, value]) => {
//         if (value !== null && value !== undefined) {
//           fd.append(key, value);
//         }
//       });

//       const res = await fetch(
//         "https://pension-portal-backend.onrender.com/api/pensioners",
//         {
//           method: "POST",
//           body: fd,
//         },
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Server Error");
//       }

//       alert("✅ Pensioner added successfully");

//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);

//       alert("❌ " + (err.message || "Submit Failed"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen" style={{ background: "#f0f2f5" }}>
//       <Navbar />

//       <div className="px-6 py-4">
//         <Breadcrumb
//           items={[
//             {
//               label: "Home",
//               link: "/dashboard",
//             },
//             {
//               label: "Add Applicant",
//             },
//           ]}
//         />

//         <ActionBar />

//         <div className="bg-white rounded shadow-sm overflow-hidden">
//           {/* HEADER */}

//           <div
//             className="flex items-center justify-between px-6 py-4"
//             style={{
//               background: "linear-gradient(135deg, #1a2a5e 0%, #0f1d45 100%)",
//             }}
//           >
//             <div>
//               <div className="text-white font-bold text-lg">
//                 Employee Profile — Pensioner Registration
//               </div>

//               <div className="text-blue-300 text-xs">
//                 Fill all required fields
//               </div>
//             </div>

//             <StepIndicator currentStep={showPreview ? 2 : 1} />
//           </div>

//           <div className="p-6">
//             {/* ================= PREVIEW ================= */}

//             {showPreview && (
//               <div className="mb-6 border border-blue-200 bg-blue-50 rounded p-5">
//                 <div className="text-lg font-bold text-blue-800 mb-4">
//                   Preview Application
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <b>Employee ID:</b> {form.employeeId}
//                   </div>

//                   <div>
//                     <b>PPO No:</b> {form.ppoNo}
//                   </div>

//                   <div>
//                     <b>Department:</b> {form.department}
//                   </div>

//                   <div>
//                     <b>Designation:</b> {form.designation}
//                   </div>

//                   <div>
//                     <b>Aadhaar:</b> {form.aadhaar}
//                   </div>

//                   <div>
//                     <b>PAN:</b> {form.pan}
//                   </div>

//                   <div>
//                     <b>Mobile:</b> {form.mobile}
//                   </div>

//                   <div>
//                     <b>Bank:</b> {form.bankName}
//                   </div>

//                   <div>
//                     <b>Account No:</b> {form.acNo}
//                   </div>

//                   <div>
//                     <b>IFSC:</b> {form.ifsc}
//                   </div>

//                   <div>
//                     <b>Photo:</b>{" "}
//                     {form.photo ? form.photo.name : "Not Uploaded"}
//                   </div>

//                   <div>
//                     <b>Signature:</b>{" "}
//                     {form.signature ? form.signature.name : "Not Uploaded"}
//                   </div>

//                   <div>
//                     <b>Salary Slip:</b>{" "}
//                     {form.salarySlip ? form.salarySlip.name : "Not Uploaded"}
//                   </div>

//                   <div>
//                     <b>Death Certificate:</b>{" "}
//                     {form.deathCertificate
//                       ? form.deathCertificate.name
//                       : "Not Uploaded"}
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-3 mt-6">
//                   <button
//                     onClick={() => setShowPreview(false)}
//                     className="px-5 py-2 border border-gray-300 rounded text-sm"
//                   >
//                     Edit Form
//                   </button>

//                   <button
//                     onClick={handleSubmit}
//                     disabled={loading}
//                     className="px-6 py-2 text-white rounded text-sm"
//                     style={{
//                       background: "linear-gradient(135deg, #1a2a5e, #2d4a9a)",
//                     }}
//                   >
//                     {loading ? "Submitting..." : "Final Submit"}
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* ================= FORM ================= */}

//             {!showPreview && (
//               <>
//                 {/* BASIC INFO */}

//                 <FormSection icon="👤" title="Basic Information">
//                   <div>
//                     <InputField
//                       label="Employee ID"
//                       required
//                       name="employeeId"
//                       value={form.employeeId}
//                       onChange={handleChange}
//                     />

//                     {errors.employeeId && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.employeeId}
//                       </p>
//                     )}
//                   </div>

//                   <InputField
//                     label="PPO No."
//                     name="ppoNo"
//                     value={form.ppoNo}
//                     onChange={handleChange}
//                   />

//                   <div>
//                     <SelectField
//                       label="Department"
//                       required
//                       name="department"
//                       value={form.department}
//                       onChange={handleChange}
//                       options={departments}
//                     />

//                     {errors.department && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.department}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <SelectField
//                       label="Designation"
//                       required
//                       name="designation"
//                       value={form.designation}
//                       onChange={handleChange}
//                       options={designations}
//                     />

//                     {errors.designation && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.designation}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <InputField
//                       label="Aadhaar"
//                       name="aadhaar"
//                       value={form.aadhaar}
//                       onChange={handleChange}
//                       placeholder="12 digit Aadhaar"
//                     />

//                     {errors.aadhaar && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.aadhaar}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <InputField
//                       label="PAN"
//                       name="pan"
//                       value={form.pan}
//                       onChange={handleChange}
//                       placeholder="ABCDE1234F"
//                     />

//                     {errors.pan && (
//                       <p className="text-red-500 text-xs mt-1">{errors.pan}</p>
//                     )}
//                   </div>

//                   <div>
//                     <InputField
//                       type="date"
//                       label="Date of Birth"
//                       required
//                       name="dob"
//                       value={form.dob}
//                       onChange={handleChange}
//                     />

//                     {errors.dob && (
//                       <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
//                     )}
//                   </div>

//                   <InputField
//                     type="date"
//                     label="Date of Joining"
//                     name="doj"
//                     value={form.doj}
//                     onChange={handleChange}
//                   />

//                   <div>
//                     <InputField
//                       type="date"
//                       label="Retirement Date"
//                       required
//                       name="retirementDate"
//                       value={form.retirementDate}
//                       onChange={handleChange}
//                     />

//                     {errors.retirementDate && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.retirementDate}
//                       </p>
//                     )}
//                   </div>

//                   <InputField
//                     type="date"
//                     label="Date of Death"
//                     name="dod"
//                     value={form.dod}
//                     onChange={handleChange}
//                   />

//                   <div>
//                     <SelectField
//                       label="Gender"
//                       required
//                       name="gender"
//                       value={form.gender}
//                       onChange={handleChange}
//                       options={["Male", "Female", "Other"]}
//                     />

//                     {errors.gender && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.gender}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <SelectField
//                       label="Employee Category"
//                       required
//                       name="empCategory"
//                       value={form.empCategory}
//                       onChange={handleChange}
//                       options={categories}
//                     />

//                     {errors.empCategory && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.empCategory}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <InputField
//                       label="Grade Pay"
//                       required
//                       name="gradePay"
//                       value={form.gradePay}
//                       onChange={handleChange}
//                     />

//                     {errors.gradePay && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.gradePay}
//                       </p>
//                     )}
//                   </div>

//                   <InputField
//                     label="Last Salary"
//                     name="lastSalary"
//                     value={form.lastSalary}
//                     onChange={handleChange}
//                   />

//                   <SelectField
//                     label="Caste"
//                     name="caste"
//                     value={form.caste}
//                     onChange={handleChange}
//                     options={castes}
//                   />

//                   <InputField
//                     label="Dependent Name"
//                     name="dependentName"
//                     value={form.dependentName}
//                     onChange={handleChange}
//                   />
//                 </FormSection>

//                 {/* PENSION CATEGORY */}

//                 <FormSection icon="📂" title="Pension Category">
//                   <RadioGroup
//                     label="Category Type"
//                     name="categoryType"
//                     value={form.categoryType}
//                     onChange={handleChange}
//                     options={["Self", "Family", "Disability", "Other"]}
//                   />

//                   <RadioGroup
//                     label="Category %"
//                     name="categoryPct"
//                     value={form.categoryPct}
//                     onChange={handleChange}
//                     options={["100", "90", "75"]}
//                   />

//                   <RadioGroup
//                     label="ACP"
//                     name="acp"
//                     value={form.acp}
//                     onChange={handleChange}
//                     options={["Y", "N"]}
//                   />

//                   <RadioGroup
//                     label="Notional Increment"
//                     name="notionalIncrement"
//                     value={form.notionalIncrement}
//                     onChange={handleChange}
//                     options={["Y", "N"]}
//                   />

//                   <InputField
//                     label="PFMS"
//                     name="pfms"
//                     value={form.pfms}
//                     onChange={handleChange}
//                   />
//                 </FormSection>

//                 {/* ADDRESS */}

//                 <FormSection icon="📍" title="Contact & Address">
//                   <div>
//                     <InputField
//                       label="Mobile"
//                       required
//                       name="mobile"
//                       value={form.mobile}
//                       onChange={handleChange}
//                     />

//                     {errors.mobile && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.mobile}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <InputField
//                       label="Family Mobile"
//                       name="familyMobile"
//                       value={form.familyMobile}
//                       onChange={handleChange}
//                     />

//                     {errors.familyMobile && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.familyMobile}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <InputField
//                       label="PIN Code"
//                       name="pinCode"
//                       value={form.pinCode}
//                       onChange={handleChange}
//                     />

//                     {errors.pinCode && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.pinCode}
//                       </p>
//                     )}
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-xs font-medium text-gray-600 mb-1">
//                       Permanent Address
//                     </label>

//                     <textarea
//                       rows={3}
//                       name="permAddress"
//                       value={form.permAddress}
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-xs font-medium text-gray-600 mb-1">
//                       Correspondence Address
//                     </label>

//                     <textarea
//                       rows={3}
//                       name="corrAddress"
//                       value={form.corrAddress}
//                       onChange={handleChange}
//                       className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
//                     />
//                   </div>
//                 </FormSection>

//                 {/* BANK */}

//                 <FormSection icon="🏦" title="Bank Details">
//                   <div>
//                     <InputField
//                       label="Bank Name"
//                       required
//                       name="bankName"
//                       value={form.bankName}
//                       onChange={handleChange}
//                     />

//                     {errors.bankName && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.bankName}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <InputField
//                       label="IFSC"
//                       required
//                       name="ifsc"
//                       value={form.ifsc}
//                       onChange={handleChange}
//                     />

//                     {errors.ifsc && (
//                       <p className="text-red-500 text-xs mt-1">{errors.ifsc}</p>
//                     )}
//                   </div>

//                   <InputField
//                     label="MICR"
//                     name="micr"
//                     value={form.micr}
//                     onChange={handleChange}
//                   />

//                   <div>
//                     <InputField
//                       label="Account Number"
//                       required
//                       name="acNo"
//                       value={form.acNo}
//                       onChange={handleChange}
//                     />

//                     {errors.acNo && (
//                       <p className="text-red-500 text-xs mt-1">{errors.acNo}</p>
//                     )}
//                   </div>

//                   <div>
//                     <SelectField
//                       label="Account Type"
//                       required
//                       name="acType"
//                       value={form.acType}
//                       onChange={handleChange}
//                       options={accountTypes}
//                     />

//                     {errors.acType && (
//                       <p className="text-red-500 text-xs mt-1">
//                         {errors.acType}
//                       </p>
//                     )}
//                   </div>
//                 </FormSection>

//                 {/* UPLOAD */}

//                 <FormSection icon="📎" title="Documents Upload">
//                   <div>
//                     <UploadField
//                       label="Photo"
//                       name="photo"
//                       onChange={handleChange}
//                       accept="image/*"
//                     />

//                     {form.photo && (
//                       <p className="text-green-600 text-xs mt-1">
//                         ✅ {form.photo.name}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <UploadField
//                       label="Signature"
//                       name="signature"
//                       onChange={handleChange}
//                       accept="image/*"
//                     />

//                     {form.signature && (
//                       <p className="text-green-600 text-xs mt-1">
//                         ✅ {form.signature.name}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <UploadField
//                       label="Salary Slip"
//                       name="salarySlip"
//                       onChange={handleChange}
//                       accept="application/pdf"
//                     />

//                     {form.salarySlip && (
//                       <p className="text-green-600 text-xs mt-1">
//                         ✅ {form.salarySlip.name}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <UploadField
//                       label="Death Certificate"
//                       name="deathCertificate"
//                       onChange={handleChange}
//                       accept="application/pdf,image/*"
//                     />

//                     {form.deathCertificate && (
//                       <p className="text-green-600 text-xs mt-1">
//                         ✅ {form.deathCertificate.name}
//                       </p>
//                     )}
//                   </div>
//                 </FormSection>

//                 {/* BUTTONS */}

//                 <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={handleReset}
//                     className="px-5 py-2 text-sm border border-gray-300 rounded"
//                   >
//                     Reset
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => navigate("/dashboard")}
//                     className="px-5 py-2 text-sm border border-gray-300 rounded"
//                   >
//                     Cancel
//                   </button>

//                   <button
//                     type="button"
//                     onClick={handlePreview}
//                     className="px-6 py-2 text-sm text-white rounded font-medium"
//                     style={{
//                       background: "linear-gradient(135deg, #1a2a5e, #2d4a9a)",
//                     }}
//                   >
//                     Preview Application
//                   </button>
//                 </div>

//                 {Object.keys(errors).length > 0 && (
//                   <div className="mt-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded px-3 py-2">
//                     Please fill all required fields properly.
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddApplicant;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import ActionBar from "../components/layout/ActionBar";
import Breadcrumb from "../components/ui/Breadcrumb";

import {
  InputField,
  SelectField,
  RadioGroup,
  UploadField,
} from "../components/forms/FormField";
import FormSection from "../components/ui/FormSection";

import {
  familyMember,
  departments,
  designations,
  categories,
  castes,
  accountTypes,
} from "../data/mockData";

// ─── Initial State ────────────────────────────────────────────────────────────
const initialForm = {
  employeeId: "",
  ppoNo: "",
  employeeName: "",
  dependentName: "",
  familyName: "",
  department: "",
  designation: "",
  aadhaar: "",
  pan: "",
  dob: "",
  doj: "",
  retirementDate: "",
  dod: "",
  gender: "",
  empCategory: "",
  gradePay: "",
  lastSalary: "",
  caste: "",
  categoryType: "Self",
  categoryPct: "100",
  notionalIncrement: "Y",
  acp: "Y",
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
};

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
                  ? "#93c5fd"
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

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // ── Handle Change ────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "aadhaar") {
      if (!/^\d*$/.test(value) || value.length > 12) return;
    }
    if (name === "mobile" || name === "familyMobile") {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }
    if (name === "pinCode") {
      if (!/^\d*$/.test(value) || value.length > 6) return;
    }
    if (name === "pan") {
      const upper = value.toUpperCase();
      if (upper.length > 10) return;
      setForm((p) => ({ ...p, [name]: upper }));
      if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
      return;
    }

    setForm((p) => ({ ...p, [name]: files ? files[0] : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  // ── Per-step validation ──────────────────────────────────────────────────
  const validateStep = (s) => {
    const errs = {};

    if (s === 1) {
      ["employeeId", "dob", "gender", "mobile"].forEach((f) => {
        if (!form[f]) errs[f] = "Required";
      });

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
        "department",
        "designation",
        "retirementDate",
        "empCategory",
        "gradePay",
      ].forEach((f) => {
        if (!form[f]) errs[f] = "Required";
      });
    }

    if (s === 3) {
      ["bankName", "ifsc", "acNo", "acType"].forEach((f) => {
        if (!form[f]) errs[f] = "Required";
      });

      // IFSC Validation
      if (form.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc)) {
        errs.ifsc = "Invalid IFSC code";
      }
    }

    if (s === 4) {
      ["photo", "signature"].forEach((f) => {
        if (!form[f]) errs[f] = "Required";
      });
    }

    // if (s === 1) {
    //   [
    //     "employeeId",
    //     "department",
    //     "designation",
    //     "dob",
    //     "retirementDate",
    //     "gender",
    //     "empCategory",
    //     "gradePay",
    //   ].forEach((f) => {
    //     if (!form[f]) errs[f] = "Required";
    //   });
    //   if (form.aadhaar && !/^\d{12}$/.test(form.aadhaar))
    //     errs.aadhaar = "Aadhaar must be exactly 12 digits";
    //   if (form.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan))
    //     errs.pan = "Invalid PAN format";
    // }

    // if (s === 2) {
    //   if (form.mobile && !/^\d{10}$/.test(form.mobile))
    //     errs.mobile = "Mobile must be 10 digits";
    //   if (form.familyMobile && !/^\d{10}$/.test(form.familyMobile))
    //     errs.familyMobile = "Family mobile must be 10 digits";
    //   if (form.pinCode && !/^\d{6}$/.test(form.pinCode))
    //     errs.pinCode = "PIN must be 6 digits";
    //   if (!form.mobile) errs.mobile = "Required";
    // }

    // if (s === 3) {
    //   ["bankName", "ifsc", "acNo", "acType"].forEach((f) => {
    //     if (!form[f]) errs[f] = "Required";
    //   });
    //   if (form.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc))
    //     errs.ifsc = "Invalid IFSC code";
    // }
     
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
    setForm(initialForm);
    setErrors({});
    setStep(1);
    setShowPreview(false);
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined) fd.append(k, v);
      });
      const res = await fetch(
        // "https://pension-portal-backend.onrender.com/api/pensioners",
        "http://localhost:5000/api/pensioners",
        { method: "POST", body: fd },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Server Error");
      alert("✅ Pensioner added successfully");
      navigate("/dashboard");
    } catch (err) {
      alert("❌ " + (err.message || "Submit Failed"));
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
    <div className="min-h-scree bg-black " style={{ background: "#f0f2f5" }}>
      <Navbar />

      <div className="px-6 py-4 max-w-7xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Home", link: "/dashboard" },
            { label: "Add Applicant" },
          ]}
        />
        <ActionBar />

        <div className="bg-white rounded-xl shadow-sm overflow-hidden ">
          {/* ── Header + Step Bar ─────────────────────────────── */}
          <div
            style={{
              background: "linear-gradient(135deg, #1a2a5e 0%, #0f1d45 100%)",
            }}
          >
            <div className="px-6 pt-5 pb-2 flex items-center justify-between">
              <div>
                <div className="text-white font-bold text-lg">
                  Pensioner Registration
                </div>
                <div className="text-blue-300 text-xs">
                  {showPreview
                    ? "Review your application before submitting"
                    : `Step ${step} of 4 — ${STEPS[step - 1].label}`}
                </div>
              </div>
              <span className="text-white text-2xl opacity-50">
                {showPreview ? "🔍" : STEPS[step - 1].icon}
              </span>
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
                    <div className="text-base font-bold text-blue-800 mb-4">
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
                        ["Family Member", form.dependentName.split(" ")[0]],
                        [
                          `${form.dependentName.split(" ")[0]} Name`,
                          form.familyName,
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
                    <div className="text-base font-bold text-blue-800 mb-4">
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
                            {val || "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PENSION DETAILS */}
                  <div className="border border-blue-200 bg-blue-50 rounded-xl p-5">
                    <div className="text-base font-bold text-blue-800 mb-4">
                       Pension Details
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {[
                        ["Department", form.department],
                        ["Designation", form.designation],
                        ["Retirement Date", form.retirementDate],
                        ["Employee Category", form.empCategory],
                        ["Grade Pay", form.gradePay],
                        ["Last Salary", form.lastSalary],
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

                  {/* PENSION CATEGORY */}
                  <div className="border border-blue-200 bg-blue-50 rounded-xl p-5">
                    <div className="text-base font-bold text-blue-800 mb-4">
                     Pension Category
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {[
                        ["Category Type", form.categoryType],
                        ["Category %", form.categoryPct],
                        ["ACP", form.acp],
                        ["Notional Increment", form.notionalIncrement],
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

                  {/* BANK DETAILS */}
                  <div className="border border-blue-200 bg-blue-50 rounded-xl p-5">
                    <div className="text-base font-bold text-blue-800 mb-4">
                      Bank Details
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {[
                        ["Bank Name", form.bankName],
                        ["IFSC", form.ifsc],
                        ["MICR", form.micr],
                        ["Account Number", form.acNo],
                        ["Account Type", form.acType],
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
                    <div className="text-base font-bold text-blue-800 mb-4">
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
                        background: "linear-gradient(135deg, #1a2a5e, #2d4a9a)",
                      }}
                    >
                      {loading ? "Submitting…" : "✔ Final Submit"}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* {showPreview && (
              <>
                <div className="mb-5 border border-blue-200 bg-blue-50 rounded-xl p-5">
                  <div className="text-base font-bold text-blue-800 mb-4">
                    📋 Review Application
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      ["Employee ID", form.employeeId],
                      ["Employee Name", form.employeeName],
                      ["Family Member", form.familyMember],
                      // [`${form.familyMember}`, form.familyName]
                      // ["PPO No", form.ppoNo],
                      ["Department", form.department],
                      ["Designation", form.designation],
                      ["Aadhaar", form.aadhaar],
                      ["PAN", form.pan],
                      ["Date of Birth", form.dob],
                      ["Retirement", form.retirementDate],
                      ["Gender", form.gender],
                      ["Category", form.empCategory],
                      ["Grade Pay", form.gradePay],
                      ["Mobile", form.mobile],
                      ["Bank Name", form.bankName],
                      ["Account No", form.acNo],
                      ["IFSC", form.ifsc],
                      ["Acc Type", form.acType],
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
                          className={`font-medium text-sm ${file ? "text-green-600" : "text-gray-400"}`}
                        >
                          {file ? `✅ ${file.name}` : "Not uploaded"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
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
                        background: "linear-gradient(135deg, #1a2a5e, #2d4a9a)",
                      }}
                    >
                      {loading ? "Submitting…" : "✔ Final Submit"}
                    </button>
                  </div>
                </div>
              </>
            )} */}

            {/* ══════════════════════════════════════════════════
                STEP 1 — Personal Details
            ══════════════════════════════════════════════════ */}
            {!showPreview && step === 1 && (
              <>
                <ErrorBanner />
                <FormSection icon="👤" title="Personal Details">
                  <div>
                    <InputField
                      label="Employee ID"
                      required
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

                  <InputField
                    label="Employee Name"
                    name="employeeName"
                    value={form.employeeName}
                    onChange={handleChange}
                  />

                  <div>
                    <SelectField
                      label="Family Name"
                      required
                      name="dependentName"
                      value={form.dependentName}
                      onChange={handleChange}
                      options={familyMember}
                    />
                    {errors.familyMember && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.familyMember}
                      </p>
                    )}
                  </div>

                  <InputField
                    label={form.dependentName}
                    name="familyName"
                    value={form.familyName}
                    onChange={handleChange}
                  />

                  <div>
                    <InputField
                      label="Aadhaar"
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
                      name="pan"
                      value={form.pan}
                      onChange={handleChange}
                      placeholder="ABCDE1234F"
                    />
                    {errors.pan && (
                      <p className="text-red-500 text-xs mt-1">{errors.pan}</p>
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
                      <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                    )}
                  </div>

                  <InputField
                    type="date"
                    label="Date of Death"
                    name="dod"
                    value={form.dod}
                    onChange={handleChange}
                  />
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

                  <SelectField
                    label="Caste"
                    name="caste"
                    value={form.caste}
                    onChange={handleChange}
                    options={castes}
                  />
                  {/* <InputField
                    label="Dependent Name"
                    name="dependentName"
                    value={form.dependentName}
                    onChange={handleChange}
                  /> */}
                </FormSection>

                <FormSection icon="📍" title="Contact & Address">
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
                      Permanent Address
                    </label>
                    <textarea
                      rows={3}
                      name="permAddress"
                      value={form.permAddress}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    />
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
                <FormSection icon="👤" title="Pension Details">
                  <div>
                    <SelectField
                      label="Department"
                      required
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                      options={departments}
                    />
                    {errors.department && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.department}
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

                  <InputField
                    type="date"
                    label="Date of Joining"
                    name="doj"
                    value={form.doj}
                    onChange={handleChange}
                  />
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

                  <div>
                    <SelectField
                      label="Employee Category"
                      required
                      name="empCategory"
                      value={form.empCategory}
                      onChange={handleChange}
                      options={categories}
                    />
                    {errors.empCategory && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.empCategory}
                      </p>
                    )}
                  </div>
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
                    label="Last Salary"
                    name="lastSalary"
                    value={form.lastSalary}
                    onChange={handleChange}
                  />
                </FormSection>

                <FormSection icon="📂" title="Pension Category">
                  <RadioGroup
                    label="Category Type"
                    name="categoryType"
                    value={form.categoryType}
                    onChange={handleChange}
                    options={["Self", "Family", "Disability", "Other"]}
                  />
                  <RadioGroup
                    label="Category %"
                    name="categoryPct"
                    value={form.categoryPct}
                    onChange={handleChange}
                    options={["100", "90", "75"]}
                  />
                  <RadioGroup
                    label="ACP"
                    name="acp"
                    value={form.acp}
                    onChange={handleChange}
                    options={["Y", "N"]}
                  />
                  <RadioGroup
                    label="Notional Increment"
                    name="notionalIncrement"
                    value={form.notionalIncrement}
                    onChange={handleChange}
                    options={["Y", "N"]}
                  />
                  <InputField
                    label="PFMS"
                    name="pfms"
                    value={form.pfms}
                    onChange={handleChange}
                  />
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
                    <InputField
                      label="Bank Name"
                      required
                      name="bankName"
                      value={form.bankName}
                      onChange={handleChange}
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
                      <p className="text-red-500 text-xs mt-1">{errors.ifsc}</p>
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
                      <p className="text-red-500 text-xs mt-1">{errors.acNo}</p>
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
                    />
                    {form.salarySlip && (
                      <p className="text-green-600 text-xs mt-1">
                        ✅ {form.salarySlip.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <UploadField
                      label="Death Certificate"
                      name="deathCertificate"
                      onChange={handleChange}
                      accept="application/pdf,image/*"
                    />
                    {form.deathCertificate && (
                      <p className="text-green-600 text-xs mt-1">
                        ✅ {form.deathCertificate.name}
                      </p>
                    )}
                  </div>
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
      {/* /container */}
    </div>
  );
};

export default AddApplicant;