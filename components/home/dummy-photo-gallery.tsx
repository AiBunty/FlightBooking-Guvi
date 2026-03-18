import Image from "next/image";
import { Card } from "@/components/ui/card";
import { getGalleryDestinations } from "@/features/flights/demo-flight-data";

const galleryImages = getGalleryDestinations();

export function DummyPhotoGallery() {
  return (
    <section className="mx-auto mt-14 w-full max-w-7xl px-4">
      <div className="mb-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">Destination Gallery</p>
        <h2 className="mt-2 font-[family:var(--font-space-grotesk)] text-3xl font-semibold text-slate-900">
          Real photo treatment across the travel homepage
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          The old abstract SVG set has been replaced with seeded travel photography so the demo reads like an airline marketplace instead of a placeholder gallery.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {galleryImages.map((image, index) => (
          <Card
            key={image.airport.iata}
            className={`overflow-hidden border-slate-200/80 p-0 ${
              index % 5 === 0 ? "sm:col-span-2" : ""
            }`}
          >
            <div className={`relative ${index % 5 === 0 ? "h-72" : "h-60"}`}>
              <Image src={image.imageSrc} alt={image.airport.city} fill className="object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/65 via-slate-900/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">{image.tag}</p>
                <h3 className="mt-2 text-xl font-semibold">{image.airport.city}</h3>
                <p className="mt-1 text-sm text-slate-200">{image.airport.iata}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
