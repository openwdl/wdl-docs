# wdl-docs
This repository supports [wdl-docs](https://wdl-docs.readthedocs.io/en/stable/), a community-contributed WDL documentation site that includes tutorials and guides for basic WDL syntax, cook-book-style code snippets to show different WDL use-cases, and links to external community-contributed documentation, like WDL Best Practices.

## What if I want to contribute?
Everyone is encouraged to contribute to the documentation! Types of contributions you can make:
* Typo fixes
* Updates to doc content
* Suggestions for existing docs
* New docs that you want to add to the repo
* New WDL resources that you want to list or link to

## How to contribute
There are two main ways you can contribute:
1. [File an issue](https://github.com/openwdl/wdl-docs/issues/new/choose) in wdl-docs repository (good option if you're lacking time to make a fix). 
2. Make a fork of the repository to add new docs or update existing ones and make a PR.

If you fork the repo to contribute, please read about the structure of the repo below so you know where to host different types of docs. If you'd like to change the structure, add your suggestion to a new issue. 

## Structure of the current repository
This wdl-docs repository is designed to launch using readthedocs and uses a mkdocs theme. All docs are located in the repo's **docs** folder or subsequent subfolders. 


The **docs** folder contains two sub-folders: **WDL** and **community**. The WDL folder holds tutorials and guides for WDL syntax, whereas the community folder hosts docs that point to other community resources or tutorials. 

### Branches for different WDL versions
There are multiple branches in the wdl-docs repo. Since documentation will differ between WDL spec versions, each set of documentation representing a particular spec should live on a branch labeled by the spec version with major.minor.path versioning. For example, documentation for WDL 1.0 lives on the `1.0.0` branch. This allows you to specify which version of the documentation you want to the read on the wdl-docs site. 

The wdl-docs **main** branch is used for the latest version of WDL for which we have documentation, which is currently WDL 1.0. This branch is deployed to the readthedocs website's `latest` version for documentation. 

The wdl-docs site also has a stable version of documentation which currently points to the `1.0.0` branch. This will likely change in the future.  

### Site map in the mkdocs YML
The docs folder contains a [mkdocs YML](https://github.com/openwdl/wdl-docs/blob/main/mkdocs.yml) file which contains the site map for the documentation website. All the website sections and article names are organized using this YML file. If you want to add new sections to the website or add or change article names, use this YML file.

## Contribution process
If you're planning to fork the repo and contribute, follow these steps:
1. Review the OpenWDL [license](https://github.com/openwdl/wdl-docs/blob/main/LICENSE).
1. Review the [contributor agreement](CONTRIBUTING.md)
1. Fork the repository. 
1. Make a branch of an existing spec version branch or make a new branch to reflect the version of the documentation you're adding or updating. 
1. Decide which folder you want to host documentation (**WDL** or **community**). If you feel a new folder is necessary, you can also create one.
1. Make changes in your fork.
1. Update the mkdocs.yml file (site map) if you're adding new docs.
1. Create a PR against the WDL spec version branch you're working off.
1. Tag an [OpenWDL](https://github.com/openwdl) member for review.

## Questions?
If you have questions or want feedback before making a PR, [file an issue](https://github.com/openwdl/wdl-docs/issues/new/choose) in the repo. 



