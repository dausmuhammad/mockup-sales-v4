export default function manifest() {
  return {
    id: "/",
    name: "SalesFlow — triple X",
    short_name: "SalesFlow",
    description: "Ruang kerja Marketing Officer dan Surveyor Officer.",
    lang: "id",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f4f6fb",
    theme_color: "#101b3d",
    prefer_related_applications: false,
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
