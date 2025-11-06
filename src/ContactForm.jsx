import React, { useState } from "react";

export const ContactForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "general",
    message: "",
    agree: false,
    attachment: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";
    if (form.phone && !/^\+?[0-9\-\s]{7,15}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    if (!form.message.trim()) e.message = "Message cannot be empty.";
    if (!form.agree) e.agree = "You must agree to submit the form.";
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else if (type === "file") {
      setForm((f) => ({ ...f, [name]: files[0] || null }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      category: "general",
      message: "",
      agree: false,
      attachment: null,
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eobj = validate();
    setErrors(eobj);
    if (Object.keys(eobj).length) return;

    setLoading(true);
    setSuccess(null);

    try {
      const payload = new FormData();
      payload.append("name", form.name);
      payload.append("email", form.email);
      payload.append("phone", form.phone);
      payload.append("category", form.category);
      payload.append("message", form.message);
      payload.append("agree", form.agree);
      if (form.attachment) payload.append("attachment", form.attachment);

      if (onSubmit) {
        await onSubmit(payload);
      } else {
        await new Promise((r) => setTimeout(r, 900));
      }

      setSuccess("Form submitted successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Something went wrong — please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>

      {success && (
        <div className="mb-4 p-3 rounded-md bg-green-50 text-green-700">{success}</div>
      )}

      {errors.submit && (
        <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700">{errors.submit}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <label className="block">
            <span className="text-sm font-medium">Full name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                errors.name ? "border-red-300" : "border-gray-200"
              }`}
              placeholder="Your name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </label>

          {/* Email */}
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                errors.email ? "border-red-300" : "border-gray-200"
              }`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </label>

          {/* Phone */}
          <label className="block">
            <span className="text-sm font-medium">Phone (optional)</span>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                errors.phone ? "border-red-300" : "border-gray-200"
              }`}
              placeholder="+91 98765 43210"
            />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
          </label>

          {/* Category */}
          <label className="block">
            <span className="text-sm font-medium">Category</span>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-offset-1 border-gray-200"
            >
              <option value="general">General</option>
              <option value="support">Support</option>
              <option value="sales">Sales</option>
            </select>
          </label>
        </div>

        {/* Message */}
        <label className="block mt-4">
          <span className="text-sm font-medium">Message</span>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={5}
            className={`mt-1 block w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              errors.message ? "border-red-300" : "border-gray-200"
            }`}
            placeholder="Tell us about your request"
          />
          {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
        </label>

        {/* File Upload */}
        <div className="mt-4">
          <label className="block">
            <span className="text-sm font-medium">Attachment (optional)</span>
            <input
              name="attachment"
              type="file"
              accept="image/*,.pdf"
              onChange={handleChange}
              className="mt-1 block w-full"
            />
          </label>
        </div>

        {/* Agree Checkbox */}
        <div className="flex items-start gap-2 mt-4">
          <input
            id="agree"
            name="agree"
            type="checkbox"
            checked={form.agree}
            onChange={handleChange}
            className="mt-1 h-4 w-4"
          />
          <label htmlFor="agree" className="text-sm">
            I agree to the <span className="underline">terms and conditions</span>.
          </label>
        </div>
        {errors.agree && <p className="mt-1 text-xs text-red-600">{errors.agree}</p>}

        {/* Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send message"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            Reset
          </button>
        </div>
      </form>

      <div className="mt-6 text-xs text-gray-500">Built with ❤️ — easily customizable.</div>
    </div>
  );
};