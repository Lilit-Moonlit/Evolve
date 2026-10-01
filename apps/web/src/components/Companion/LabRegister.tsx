import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const LabRegister: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    country: "",
    city: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const labId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem("lab_id", labId);
      localStorage.setItem("lab_data", JSON.stringify(formData));

      // Реєструємо лабораторію в серверному довіднику (пошук за країною/містом).
      void fetch("/api/companion/labs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: labId,
          name: formData.name,
          description: formData.description,
          address: formData.address,
          phone: formData.phone,
          country: formData.country,
          city: formData.city,
        }),
      }).catch(() => {
        /* offline — локальна реєстрація все одно збережена */
      });

      navigate("/companion/lab/dashboard");
    }, 400);
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-6">
      <div className="max-w-md w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{t("companion.lab.register")}</h1>
          <button
            onClick={() => navigate("/companion")}
            className="text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-2">
              {t("companion.lab.nameLabel")}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder={t("companion.lab.namePlaceholder")}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-2">
              {t("companion.lab.description")}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder={t("companion.lab.descriptionPlaceholder")}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-2">
              {t("companion.lab.address")}
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder={t("companion.lab.addressPlaceholder")}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-2">{t("filters.country")}</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder={t("filters.country")}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-2">{t("filters.city")}</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder={t("filters.city")}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-2">{t("companion.lab.phone")}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder={t("companion.lab.phonePlaceholder")}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-2">
              {t("companion.lab.emailLabel")}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputClass}
              placeholder={t("companion.lab.emailPlaceholder")}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium transition shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "..." : t("companion.lab.registerButton")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/companion")}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            {t("companion.lab.login")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabRegister;
