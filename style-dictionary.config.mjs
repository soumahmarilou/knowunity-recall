export default {
  source: ["tokens/tokens.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "build/css/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
          options: {
            fileHeader: () => [
              "GENERATED FILE — do not edit by hand.",
              "Source of truth: tokens/tokens.json",
              "To change a value, edit that file and run `npm run tokens`.",
            ],
          },
        },
      ],
    },
  },
};
