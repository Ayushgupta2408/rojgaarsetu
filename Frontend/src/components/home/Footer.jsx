import React from "react";
import { useTranslation } from "react-i18next";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white py-10 px-6 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <div>
          <h3 className="font-bold mb-2">{t("footer.brandName")}</h3>
          <p className="text-sm text-gray-400">{t("footer.tagline")}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t("footer.quickLinksTitle")}</h4>
          <ul className="space-y-1 text-gray-400">
            <li>
              <a href="#" className="hover:text-white">
                {t("footer.links.home")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                {t("footer.links.about")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                {t("footer.links.workers")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                {t("footer.links.contact")}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t("footer.servicesTitle")}</h4>
          <ul className="space-y-1 text-gray-400">
            <li>
              <a href="#" className="hover:text-white">
                {t("footer.services.findWorkers")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                {t("footer.services.postJobs")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                {t("footer.services.rentEquipment")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                {t("footer.services.joinAsWorker")}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t("footer.connectWithUs")}</h4>
          <div className="flex space-x-4 text-gray-400">
            <Facebook className="hover:text-white cursor-pointer" />
            <Twitter className="hover:text-white cursor-pointer" />
            <Linkedin className="hover:text-white cursor-pointer" />
            <Instagram className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
