import React from "react";

const SECTIONS = [
  { id: "thewindow", title: "THE WINDOW" },
  { id: "thefounder", title: "The Founder" },
  { id: "joinedforces", title: "Joined Forces" },
  { id: "thesystems", title: "The Systems" },
  { id: "thelab", title: "THE LAB" },
  { id: "theartofstorytelling", title: "The Art of Storytelling" },
  { id: "storyboard", title: "Story Board" },
  { id: "digitalcollageart", title: "Digital Collage Art" },
  { id: "fromsketchtodigitaltoai", title: "From Sketch to Digital to AI" },
  { id: "thechamber", title: "THE CHAMBER" },
  { id: "artpiece", title: "Art Piece" },
  { id: "wearthemyth", title: "Wear the Myth" },
  { id: "contact", title: "CONTACT" }
];

export default function ContentPage() {
  return (
    <div className="relative w-full">
      {SECTIONS.map((s) => (
        <section
          key={s.id}
          id={s.id}
          className="min-h-screen w-full relative flex items-center justify-center"
        >
          {/* Match hero overlay look */}
          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-10 w-full max-w-4xl mx-auto px-8 text-center py-24">
            <h2 className="text-5xl md:text-7xl font-avenir text-white tracking-wide mb-6">{s.title}</h2>
            <p className="text-lg md:text-xl text-gray-200 mb-6">
              This is placeholder content for {s.title}. Replace this text with real copy later.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/10 border border-white/20 rounded-lg p-4 text-gray-100">
                <h3 className="font-semibold mb-2">Highlight</h3>
                <p className="text-sm text-gray-200/90">Key point about {s.title} goes here. Brief description to fill space.</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-lg p-4 text-gray-100">
                <h3 className="font-semibold mb-2">Details</h3>
                <ul className="list-disc list-inside text-sm text-gray-200/90">
                  <li>Bullet point one</li>
                  <li>Bullet point two</li>
                  <li>Bullet point three</li>
                </ul>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-lg p-4 text-gray-100">
                <h3 className="font-semibold mb-2">More</h3>
                <p className="text-sm text-gray-200/90">Additional placeholder text for layout and scrolling behavior.</p>
              </div>
            </div>
            <div className="mt-10 text-gray-200/80">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod, nunc quis
                bibendum dictum, risus sem tincidunt odio, vitae luctus nisi eros a erat. Proin id magna
                mi. Donec sed sapien sed nulla interdum porttitor at et lectus.
              </p>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
