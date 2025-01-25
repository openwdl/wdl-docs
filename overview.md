---
outline: deep
---

# Overview

The **Workflow Description Language (WDL)** (pronounced as _/hwɪdl/_ or "whittle" with a
'd') is an open standard for describing data processing workflows using a
human-readable/writeable syntax. It introduces a domain-specific language, as ratified
in [the openly developed specification][specification], that aims to provide simple but
powerful facilities for (a) defining atomic units of computation (a `task`), (b) for
connecting those atomic units together into a larger computation graph (a `workflow`),
and (c) for effortlessly scaling the execution of these graphs across multiple execution
environments.

### Values

The following are the top-level values of the project.

- **Human-readable and -writable.** WDL aims to be readable and writable by a wide
  variety of audiences, including software engineers, domain experts, and platform
  operators. To this end, the language prioritizes providing a concise, domain-specific
  grammar that expresses the majority of (but not all) workflows succinctly. This
  simplicity is the hallmark of WDL and contrasts with many other modern workflow
  languages that aim for enhanced flexibility at the cost of complexity.
- **Powerful abstractions.** WDL aims to be "batteries included" by exposing idiomatic
  workflow execution abstractions directly within the language. Concepts such
  as conditional execution, dynamic resource allocation, and scatter-gather operations
  are easy to understand and express in your workflows. Further, WDL includes a
  comprehensive standard library of common functions.
- **Open standard.** WDL is collectively designed and developed by a distributed, open
  community. This means you can develop with confidence that the foundation you build on
  will remain open in perpetuity. It also means that _you_ can participate in the
  community make sure WDL is as good as it can be! Join Slack or participate on GitHub
  to have your voice heard in that process.

WDL also maintains a list of other values that are adhered to when possible, but not at
the cost of the top-level values above.

- **Portability.** WDL aims to be portable—if your task or workflow conforms to the WDL
  specification, it should run on any platform supported by your execution engine of
  choice. This is particularly true if you enable [one of the LSP
  integrations](./getting-started/ecosystem.md#ide-support) in your editor and follow
  the portability related lints.

### Antivalues

The following are explicitly _not_ values of the WDL language.

- _Flexibility at all costs._ WDL is a domain-specific language for expressing
  computation graphs—it is not, itself, a programming language, nor is it embedded
  within an existing programming language. This is an intentional decision to make WDL
  more accessible to non-software engineers. That being said, the downside of that
  decision is that arbitrary execution patterns cannot be expressed in WDL. If you find
  yourself wanting more flexibility at the cost of added complexity, you're probably
  better off using a workflow language that functions more like a programming language,
  such as [Nextflow] or [Snakemake].

### Where to start

If you're just getting started with WDL, we recommend you do a couple of things to
ensure you have the best possible experience:

* Follow the quickstart guide to learn the most important concepts in WDL
  ([link](./getting-started/quickstart.md)).
* Install an developer extension within LSP integration, such as
  [Sprocket][sprocket-ext], and pay attention to the validation errors and lints.
* Select an execution engine for the environment(s) you're planning to run your
  workflows within and stick with it
  ([link](./getting-started/ecosystem.md#execution-engines))—contributing issues and ideas to these
  engines will ultimately improve the experience for everyone!
* Join Slack to get help and participate in the broader community ([link][slack-invite]).

Happy workflowing 👋!

[Nextflow]: https://nextflow.io 
[Snakemake]: https://snakemake.readthedocs.io/en/stable
[specification]: https://github.com/openwdl/wdl
[sprocket-ext]:
    https://marketplace.visualstudio.com/items?itemName=stjude-rust-labs.sprocket-vscode
[slack-invite]:
    https://join.slack.com/t/openwdl/shared_invite/zt-ctmj4mhf-cFBNxIiZYs6SY9HgM9UAVw
