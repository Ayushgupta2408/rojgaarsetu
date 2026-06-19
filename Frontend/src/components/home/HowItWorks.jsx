import { UserPlus, Briefcase, Star } from "lucide-react";
import CardSimple from "./CardSimple";
import { useTranslation } from "react-i18next";

const HowItWorks = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 bg-white text-center">
      <h2 className="text-[27px] font-bold mb-8">
        {t("howItWorks.heading")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <CardSimple
          name={t("howItWorks.steps.register.title")}
          desc={t("howItWorks.steps.register.desc")}
          icon={UserPlus}
        />
        <CardSimple
          name={t("howItWorks.steps.connect.title")}
          desc={t("howItWorks.steps.connect.desc")}
          icon={Briefcase}
        />
        <CardSimple
          name={t("howItWorks.steps.work.title")}
          desc={t("howItWorks.steps.work.desc")}
          icon={Star}
        />
      </div>
    </section>
  );
};

export default HowItWorks;
