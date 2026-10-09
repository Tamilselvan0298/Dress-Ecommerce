import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vaishiri - Handcrafted Batik & Ethnic Wear",
    short_name: "Vaishiri",
    description:
      "Handcrafted Batik Suits, Sarees, Dresses, Bedsheets & Ethnic Wear in Pure Cotton 60×60.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#86412D",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

