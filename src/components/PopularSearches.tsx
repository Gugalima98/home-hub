import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const PopularSearches = () => {
  const [links, setLinks] = useState<{ label: string; url: string }[]>([]);

  useEffect(() => {
    async function fetchPopular() {
      const { data } = await supabase
        .from('seo_cities')
        .select('links')
        .eq('city', 'Popular Searches')
        .single();
      
      if (data && data.links) {
        // @ts-ignore
        setLinks(data.links);
      }
    }
    fetchPopular();
  }, []);

  if (links.length === 0) return null;

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
            {links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                className="text-sm font-medium text-[#1f2022] hover:text-[#3b44c6] hover:underline transition-colors block leading-relaxed"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularSearches;
