import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Marquee } from "@/components/marquee";
import { Press } from "@/components/press";
import { Gallery } from "@/components/gallery";
import { LessonsPreview } from "@/components/lessons-preview";
import { Contact } from "@/components/contact";
import { AsciiBackground } from "@/components/ascii-avatar/AsciiBackground";
import {
  ScrollSpacer,
  MonitorContent,
  TeachingOverlay,
  NarrativeCTA,
} from "@/components/narrative-sections";

export default function Home() {
  return (
    <>
      <AsciiBackground />
      <div className="relative z-10">
        {/* 1. Greeting */}
        <Hero />

        {/* 2. Camera zooms into monitor */}
        <ScrollSpacer height="100vh" />

        {/* 3. About me — styled as monitor content */}
        <MonitorContent />

        {/* 4. Camera pulls back, avatar walks to whiteboard */}
        <ScrollSpacer height="100vh" />

        {/* 5. Teaching */}
        <TeachingOverlay />

        {/* 6. CTA */}
        <NarrativeCTA />

        {/* === CONTENT SECTIONS === */}
        <Projects />
        <Marquee />
        <Press />
        <Gallery />
        <LessonsPreview />
        <Contact />
      </div>
    </>
  );
}
