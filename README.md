# wdl-docs
This repository supports [wdl-docs](https://wdl-docs.readthedocs.io/en/latest/), a community-contributed WDL documentation site that includes tutorials and guides for basic WDL syntax, cook-book-style code snippets to show different WDL use-cases, and links to external community-contributed documentation, like WDL Best Practices.

## What if I want to contribute?
Everyone is encouraged to contribute to the documentation! 
The doc repository is currently organized into two sub-folders: WDL and community. WDL holds tutorials for WDL syntax, whereas community holds docs that point to other community resources.

This doc repository uses readthedocs. The `latest` version of the documentation points to the wdl-docs repo main branch. There are also stable versions of the documentation that match each WDL spec starting at WDL 1.0. These branches are semantically versioned; for example WDL 1.0 docs reside on the `1.0.0` branch. 

To contribute, make a branch of the applicable spec branch. Since the organization of the doc site is set by the mkdocs.yml file, be sure to add any additional documentation to the site map in this file. 
