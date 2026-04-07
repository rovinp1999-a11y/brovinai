"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const photos = [
  { src: "/images/profile.jpg", alt: "Rovin at UNTV interview" },
  { src: "/images/teaching-1.jpg", alt: "Teaching kids coding" },
  { src: "/images/magnus.jpg", alt: "With Magnus Carlsen" },
  { src: "/images/teaching-2.jpg", alt: "One-on-one tutoring" },
  { src: "/images/team.jpg", alt: "With the team" },
  { src: "/images/teaching-3.jpg", alt: "Mentoring session" },
  { src: "/images/event-demo.jpg", alt: "Event demo" },
];

export function Gallery() {
  return (
    <section className="relative overflow-hidden py-16">
      <div className="mx-auto max-w-6xl px-6 mb-8">
        <span className="font-mono text-sm text-text-muted">
          {"// moments"}
        </span>
      </div>

      <div className="horizontal-scroll-mask">
        <motion.div
          className="flex gap-4 px-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          {[...photos, ...photos].map((photo, i) => (
            <div
              key={i}
              className="group relative h-44 w-60 flex-shrink-0 overflow-hidden rounded-xl glass-card sm:h-48 sm:w-64"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="256px"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <span className="p-3 font-mono text-xs text-white/90">
                  {photo.alt}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
