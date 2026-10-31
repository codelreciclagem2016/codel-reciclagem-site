export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // Data de hoje para o sitemap
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  // Remove tudo que não é número (para links tel: e wa.me)
  eleventyConfig.addFilter("digitos", (s) => String(s).replace(/\D/g, ""));
  // Link do Google Maps para um endereço
  eleventyConfig.addFilter("mapsLink", (s) =>
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(s));

  // Link de WhatsApp. IMPORTANTE: precisa conter a palavra "whatsapp" —
  // o gatilho de conversão do Google Ads no GTM é "Click URL contém whatsapp".
  // Por isso usamos api.whatsapp.com e não wa.me.
  eleventyConfig.addFilter("whats", (mensagem, numero = "5534996723880") =>
    "https://api.whatsapp.com/send?phone=" + numero +
    (mensagem ? "&text=" + encodeURIComponent(mensagem) : ""));

  // Dados estruturados das perguntas frequentes (aparecem no Google)
  eleventyConfig.addFilter("faqSchema", (grupos) => JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: grupos.flatMap((g) => g.itens).map((i) => ({
      "@type": "Question", name: i.p,
      acceptedAnswer: { "@type": "Answer", text: i.r },
    })),
  }).replace(/</g, "\\u003c"));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
