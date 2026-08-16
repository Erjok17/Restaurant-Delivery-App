import Image from "next/image";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex items-center justify-center py-32 text-center text-white">
        <Image
          src="/images/p3.jpg"
          alt="Our restaurant"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 px-4">
          <h1 className="text-4xl font-bold sm:text-5xl">
            <span className="text-white">Our</span> <span className="text-gold">Story</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-200">
            Three generations of Italian tradition, brought to your table.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="relative h-80 overflow-hidden rounded-2xl">
            <Image
              src="/images/p1-1.jpg"
              alt="Bella Cucina kitchen"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Founded on Tradition
            </h2>
            <p className="mt-4 text-neutral-600">
              Bella Cucina started as a small family kitchen, passed down
              through generations. Every recipe on our menu carries a story —
              from our grandmother's tomato sauce to the wood-fired ovens we
              still use today.
            </p>
            <p className="mt-4 text-neutral-600">
              We believe great food comes from great ingredients, patience,
              and love for the craft. That philosophy hasn't changed since
              day one.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-neutral-100 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-neutral-900">
            What We Stand For
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="text-center">
                <div className="relative mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full border-2 border-gold">
                  <Image
                    src={v.image}
                    alt={v.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-neutral-900">{v.title}</h3>
                <p className="mt-2 text-sm text-neutral-600">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-neutral-900">
          Meet the Team
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 font-semibold text-neutral-900">
                {member.name}
              </h3>
              <p className="text-sm text-gold-dark">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const values = [
  {
    title: "Fresh Ingredients",
    description: "Sourced daily from local farms and markets.",
    image: "/images/ingred.png",
  },
  {
    title: "Family Recipes",
    description: "Passed down through three generations.",
    image: "/images/recipe.jpg",
  },
  {
    title: "Warm Hospitality",
    description: "Every guest treated like family.",
    image: "/images/warm.webp",
  },
];

const team = [
  { name: "Marco Rossi", role: "Head Chef", image: "/images/chef.jpg" },
  { name: "Sofia Rossi", role: "Restaurant Manager", image: "/images/restaurant-manager.jpg" },
  { name: "Luca Bianchi", role: "Sous Chef", image: "/images/sous-chef.jpg" },
];