"use client";
import type { ProjectContent } from "@/lib/project-content";
import ScrollSnapShell from "./ScrollSnapShell";
import { homeSections } from "@/lib/nav";
import type { Campaign } from "@/lib/campaigns";
import type { ProjectDocument } from "@/lib/documents";
import type { HeroVideo } from "@/lib/media";
import type { Plan } from "@/lib/plans";
import type { GallerySlide } from "@/lib/sections";
import ApartmentsSection from "@/sections/ApartmentsSection";
import BrochureSection from "@/sections/BrochureSection";
import ContactSection from "@/sections/ContactSection";
import HeroSection from "@/sections/HeroSection";
import LocationSection from "@/sections/LocationSection";
import ProjectGallerySection from "@/sections/ProjectGallerySection";

export type SiteSections = {
  campaigns: Campaign[];
  gallery: GallerySlide[];
  documents: ProjectDocument[];
  plans: Plan[];
  heroVideos: HeroVideo[];
};

export default function SiteContent({ content, sections }: { content: ProjectContent; sections: SiteSections }) {
  return (
    <ScrollSnapShell navItems={homeSections}>
      <HeroSection
        projectName={content.general.projectName}
        title={content.hero.title}
        campaigns={sections.campaigns}
        videos={sections.heroVideos}
      />
      <BrochureSection campaigns={sections.campaigns} />
      <ProjectGallerySection slides={sections.gallery} />
      <ApartmentsSection plans={sections.plans} />
      <LocationSection
        description={content.location.description}
        metrics={content.location.metrics}
        latitude={content.location.latitude}
        longitude={content.location.longitude}
      />
      <ContactSection
        projectName={content.general.projectName}
        companyName={content.general.companyName}
        email={content.general.email}
        contacts={content.contacts}
        latitude={content.location.latitude}
        longitude={content.location.longitude}
        documents={sections.documents}
        campaigns={sections.campaigns}
      />
    </ScrollSnapShell>
  );
}
