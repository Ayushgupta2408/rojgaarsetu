import React from "react";
import { useTranslation } from "react-i18next";

const ContactForm = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-2xl font-bold mb-8">{t("contact.title")}</h2>
      <form className="max-w-xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder={t("contact.placeholderName")}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            type="email"
            placeholder={t("contact.placeholderEmail")}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <input
          type="text"
          placeholder={t("contact.placeholderSubject")}
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <textarea
          placeholder={t("contact.placeholderMessage")}
          rows="4"
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {t("contact.btnSend")}
        </button>
      </form>
    </section>
  );
};

export default ContactForm;
