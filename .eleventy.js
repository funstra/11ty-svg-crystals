const { minify } = require("html-minifier-terser");
const { EleventyEdgePlugin } = require("@11ty/eleventy");

// filters - -
const { irand, frand, angleToV } = require("./11ty/filters.js");

/** @param {import('@11ty/eleventy/src/UserConfig')} config */
module.exports = config => {
  // if production
  console.log("WHAT IS THE ENV IN .eleventy.js", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "development") {
    // minify html,svg and inline css and js
    config.addTransform("htmlmin", async (content, outputPath) => {
      if (outputPath && outputPath.endsWith(".html")) {
        let minified = await minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
          minifyJS: true,
          minifyCSS: true,
          customAttrCollapse: /d/,
          ignoreCustomFragments: [
            /<!--ELEVENTYEDGE_edge.*ELEVENTYEDGE_edge-->/,
          ],
        });
        return minified;
      }

      return content;
    });
  } else {
    // else copy over the assets
    config.addPassthroughCopy("src/css");
    config.addPassthroughCopy("src/js");
  }

  config.addPlugin(EleventyEdgePlugin);

  config.addNunjucksFilter("irand", irand);
  config.addNunjucksFilter("frand", frand);
  config.addNunjucksFilter("angleToV", angleToV);

  return {
    dir: {
      input: "src",
    },
  };
};
