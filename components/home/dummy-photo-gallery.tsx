import Image from "next/image";
import { Card } from "@/components/ui/card";

const galleryImages = [
  { src: "/dummy-pics/aurora-escape.svg", title: "Aurora Escape", tag: "Northbound" },
  { src: "/dummy-pics/city-lights.svg", title: "City Lights", tag: "Urban" },
  { src: "/dummy-pics/coastal-drive.svg", title: "Coastal Drive", tag: "Roadside" },
  { src: "/dummy-pics/desert-dunes.svg", title: "Desert Dunes", tag: "Warm weather" },
  { src: "/dummy-pics/forest-trail.svg", title: "Forest Trail", tag: "Nature" },
  { src: "/dummy-pics/glass-harbor.svg", title: "Glass Harbor", tag: "Waterfront" },
  { src: "/dummy-pics/island-hopper.svg", title: "Island Hopper", tag: "Beach" },
  { src: "/dummy-pics/lakeside-mornings.svg", title: "Lakeside Mornings", tag: "Calm" },
  { src: "/dummy-pics/night-market.svg", title: "Night Market", tag: "Nightlife" },
  { src: "/dummy-pics/runway-glow.svg", title: "Runway Glow", tag: "Airport" },
  { src: "/dummy-pics/snowline-lodge.svg", title: "Snowline Lodge", tag: "Winter" },
  { src: "/dummy-pics/sunset-boulevard.svg", title: "Sunset Boulevard", tag: "Golden hour" },
  { src: "/dummy-pics/weekend-cabin.svg", title: "Weekend Cabin", tag: "Retreat" },
];

export function DummyPhotoGallery() {
  return (
    <section className="mx-auto mt-14 w-full max-w-7xl px-4">
      <div className="mb-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">Dummy Photos</p>
        <h2 className="mt-2 font-[family:var(--font-space-grotesk)] text-3xl font-semibold text-slate-900">
          A larger bank of placeholder travel images
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Added a proper set of dummy visuals so the project has more than a few isolated assets. These are all local SVGs, easy to reuse anywhere in the app.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {galleryImages.map((image, index) => (
          <Card
            key={image.src}
            className={`overflow-hidden border-slate-200/80 p-0 ${
              index % 5 === 0 ? "sm:col-span-2" : ""
            }`}
          >
            <div className={`relative ${index % 5 === 0 ? "h-72" : "h-60"}`}>
              <Image src={image.src} alt={image.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/65 via-slate-900/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">{image.tag}</p>
                <h3 className="mt-2 text-xl font-semibold">{image.title}</h3>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
