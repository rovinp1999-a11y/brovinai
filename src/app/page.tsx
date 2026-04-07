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
  ContentSupercharge,
  ContentCloneAgents,
  ContentAITeam,
  NarrativeCTA,
} from "@/components/narrative-sections";

export default function Home() {
  return (
    <>
      <AsciiBackground />
      <div className="relative z-10">
        {/* Hero */}
        <Hero />

        {/* Camera zooms into monitor */}
        <ScrollSpacer height="100vh" />

        {/* my-story.md on screen */}
        <MonitorContent />

        {/* Content 1: Supercharge workflow */}
        <ContentSupercharge />

        {/* Content 2: One agent → multiple (clone animation) */}
        <ContentCloneAgents />

        {/* Content 3: AI team office (360 orbit) */}
        <ContentAITeam />

        {/* Content 4: CTA */}
        <NarrativeCTA />

        {/* Regular sections */}
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
