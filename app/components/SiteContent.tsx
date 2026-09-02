import { useEffect, useState } from "react";
import { projectDefaults, subscribeProjectContent, type ProjectContent } from "@/app/lib/projectContent";
import ScrollSnapShell from "./ScrollSnapShell";
import ApartmentsSection from "../sections/ApartmentsSection";
import AvailabilitySection from "../sections/AvailabilitySection";
import ContactSection from "../sections/ContactSection";
import HeroSection from "../sections/HeroSection";
import LocationSection from "../sections/LocationSection";
import ProjectGallerySection from "../sections/ProjectGallerySection";

export default function SiteContent() {
  const [content, setContent] = useState<ProjectContent>(projectDefaults);

  useEffect(() => {
    return subscribeProjectContent(setContent, (error) => {
      console.error("Proje verisi Firestore'dan okunamadı.", error);
    });
  }, []);

  return <ScrollSnapShell navItems={[{ id: "vizyon", label: "Proje" }, { id: "durum", label: "Proje Durumu" }, { id: "planlar", label: "Daire Planları" }, { id: "konum", label: "Konum" }, { id: "iletisim", label: "İletişim" }]}>
    <HeroSection projectName={content.general.projectName} title={content.hero.title} completionRate={content.general.completionRate} unitsSold={content.general.unitsSold} constructionArea={content.general.constructionArea} whatsappLink={content.general.whatsappLink}/>
    <ProjectGallerySection/>
    <AvailabilitySection totalUnits={content.general.totalUnits} unitsSold={content.general.unitsSold} blocks={content.blocks}/>
    <ApartmentsSection/>
    <LocationSection description={content.location.description} metrics={content.location.metrics} latitude={content.location.latitude} longitude={content.location.longitude}/>
    <ContactSection projectName={content.general.projectName} companyName={content.general.companyName} email={content.general.email} contacts={content.contacts}/>
  </ScrollSnapShell>;
}
