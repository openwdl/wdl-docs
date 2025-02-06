import { defineConfig } from "vitepress";
import axios from "axios";

const url =
  "https://raw.githubusercontent.com/stjude-rust-labs/sprocket-vscode/refs/heads/main/syntaxes/wdl.tmGrammar.json";

/**
 * Gets the current version of the Sprocket TextMate grammar.
 * @returns the TextMate grammar as a JavaScript object
 */
async function getGrammar() {
  try {
    var response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(`error occurred: ${error}`);
    throw error;
  }
}

export default defineConfig({
  title: "Workflow Description Language (WDL) Documentation",
  description:
    "Guides and reference materials for the Workflow Description Language (WDL).",
  appearance: "force-dark",
  base: "/",
  ignoreDeadLinks: ["./LICENSE"],
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    [
      "link",
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    ],
    [
      "link",
      {
        href: "https://fonts.googleapis.com/css2?family=Martian+Mono:wght@100..800&family=Public+Sans:ital,wght@0,100..900;1,100..900&display=swap",
        rel: "stylesheet",
      },
    ],
  ],
  themeConfig: {
    /**
     * Logo and site title.
     */
    logo: {
      src: "/logo-only.svg",
      alt: "The Workflow Description Language (WDL) logo.",
    },
    siteTitle: "Documentation",

    /**
     * Navbar.
     */
    nav: [
      {
        text: "Specification",
        link: "https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md",
      },
    ],

    socialLinks: [
      {
        icon: "slack",
        link: "https://join.slack.com/t/openwdl/shared_invite/zt-ctmj4mhf-cFBNxIiZYs6SY9HgM9UAVw",
      },
      { icon: "github", link: "https://github.com/openwdl/docs" },
    ],

    search: {
      provider: "local",
    },

    /**
     * Sidebar.
     */
    sidebar: [
      { text: "Overview", link: "/overview" },
      {
        text: "Getting Started",
        items: [
          { text: "Quickstart", link: "/getting-started/quickstart" },
          { text: "Ecosystem", link: "/getting-started/ecosystem" },
          { text: "Getting help", link: "/getting-started/getting-help" },
          { text: "Contributing", link: "/getting-started/contributing" },
        ],
      },
      {
        text: "Language Guide",
        items: [
          { text: "Variables", link: "/language-guide/variables.md" },
          { text: "Structs", link: "/language-guide/structs.md" },
          { text: "Tasks", link: "/language-guide/tasks.md" },
          { text: "Workflows", link: "/language-guide/workflows.md" },
          { text: "Imports", link: "/language-guide/imports.md" },
          { text: "Versions", link: "/language-guide/versions.md" },
        ],
      },
      {
        text: "Design Patterns",
        items: [
          {
            text: "Linear chaining",
            link: "/design-patterns/linear-chaining/index.md",
          },
          {
            text: "Multiple I/O",
            link: "/design-patterns/multiple-io/index.md",
          },
          {
            text: "Branch and merge",
            link: "/design-patterns/branch-and-merge/index.md",
          },
          {
            text: "Task aliasing",
            link: "/design-patterns/task-aliasing/index.md",
          },
          {
            text: "Conditional statement",
            link: "/design-patterns/conditional-statement/index.md",
          },
          {
            text: "Scatter-gather",
            link: "/design-patterns/scatter-gather/index.md",
          },
        ],
      },
      {
        text: "Reference",
        items: [
          {
            text: "Upgrade guide",
            link: "/reference/upgrade-guide",
          },
          {
            text: "Standard library",
            items: [
              {
                text: "Numeric functions",
                link: "/reference/stdlib/numeric",
              },
              {
                text: "String functions",
                link: "/reference/stdlib/string",
              },
              {
                text: "File functions",
                link: "/reference/stdlib/file",
              },
              {
                text: "String Array functions",
                link: "/reference/stdlib/string-array",
              },
            ],
            collapsed: true,
          },
        ],
      },
      {
        text: "Links",
        items: [
          {
            text: "Cookbook",
            link: "https://github.com/openwdl/cookbook",
          },
        ],
      },
    ],
  },
  markdown: {
    theme: "github-dark",
    shikiSetup: async function (highlighter) {
      // Adds the WDL TextMate grammar from the `stjude-rust-labs/sprocket-vscode` repo
      // to the Shiki highlighter.
      await highlighter.loadLanguage(getGrammar());
    },
  },
});
