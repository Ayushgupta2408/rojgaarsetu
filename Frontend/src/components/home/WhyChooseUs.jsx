import { Sliders, ShieldCheck, BarChart3 } from "lucide-react";
import CardSimple from "./CardSimple";
import { useTranslation } from "react-i18next";

const WhyChooseUs = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 bg-[#E9F1FA] text-center">
      <h2 className="text-[27px] font-bold mb-8">
        {t("whyChoose.heading")}
      </h2>
      <p className="mb-10 text-lg text-gray-600">
        {t("whyChoose.subheading")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <CardSimple
          icon={Sliders}
          name={t("whyChoose.cards.automation.title")}
          desc={t("whyChoose.cards.automation.desc")}
        />
        <CardSimple
          icon={ShieldCheck}
          name={t("whyChoose.cards.security.title")}
          desc={t("whyChoose.cards.security.desc")}
        />
        <CardSimple
          icon={BarChart3}
          name={t("whyChoose.cards.analytics.title")}
          desc={t("whyChoose.cards.analytics.desc")}
        />
      </div>
    </section>
  );
};

export default WhyChooseUs;
