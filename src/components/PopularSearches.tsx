const popularSearches = [
  "Apartamento à venda Diadema",
  "Apartamento para alugar em Curitiba",
  "Apartamento para alugar Florianópolis",
  "Casas à venda em Barueri",
  "Apartamento à venda Taboão da Serra",
  "Apartamento para alugar em Goiânia",
  "Apartamento para alugar Niterói",
  "Casas à venda em Jundiaí",
  "Apartamento barato em São Paulo",
  "Apartamento para alugar em Salvador",
  "Apartamento para alugar próximo ao metrô em São Paulo",
  "Casas para alugar em Cotia",
  "Apartamento barato no Rio de Janeiro",
  "Apartamento para alugar em Santos",
  "Apartamento para alugar próximo ao metrô no Rio de Janeiro",
  "Casas para alugar em São Gonçalo",
];

const PopularSearches = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      {/* Outer Beige Container */}
      <div className="bg-[#C7D0C1] rounded-none md:rounded-[2.5rem] p-4 md:p-12">
        {/* Inner White Card */}
        <div className="bg-white rounded-2xl md:rounded-[2rem] p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1f2022] mb-10">
            Buscas mais populares
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
            {popularSearches.map((search) => (
              <a
                key={search}
                href="#"
                className="text-sm font-medium text-[#1f2022] hover:text-[#3b44c6] hover:underline transition-colors block leading-relaxed"
              >
                {search}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularSearches;
