const popularSearches = [
  "Apartamento para alugar",
  "Apartamentos para alugar em São Paulo",
  "Apartamentos para alugar em Campinas",
  "Casa para alugar",
  "Casa para alugar no Brasil",
  "Apartamentos para alugar perto do metrô",
  "Apartamentos com varanda para alugar",
  "Casas com piscina para alugar",
  "Apartamento 2 quartos para alugar",
  "Apartamento 3 quartos para alugar em SP",
  "Apartamentos para alugar em condomínio fechado",
  "Casas para alugar com quintal",
];

const PopularSearches = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="bg-muted rounded-2xl p-8">
        <h2 className="text-xl font-bold text-foreground mb-6">
          Buscas mais populares
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3">
          {popularSearches.map((search) => (
            <a
              key={search}
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {search}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularSearches;
