# Ecosystem

WDL has a rich, distributed ecosystem of interconnected developer tools and execution
engines to ensure (a) users can quickly write high-quality, idiomatic workflows, and (b)
scaling the execution of those workflows within any computation environment is a breeze.

::: tip

The WDL ecosystem is rapidly evolving, and, while we're always looking to expand
the list of known ecosystem tools, sometimes tools get missed. If you know of a tool
that needs to be listed here but isn't, we encourage you to [create a pull request] and
let us know!

:::

## Execution Engines

The following list contains the known execution engines listed alphabetically.

<table>
  <tr>
    <th>Engine</th>
    <th>Local</th>
    <th>HPC</th>
    <th>Cloud</th>
  </tr>
  <tr>
    <td>
    <a href="https://docs.aws.amazon.com/omics/latest/dev/what-is-healthomics.html">
      AWS HealthOmics
    </a>
    <br />
    Hosted Platform <br />
    <i>Support WDL v1.1</i>
    </td>
    <td>
    <center>
      <input type="checkbox" disabled>
    </center>
    </td>
    <td>
      <input type="checkbox" disabled> Slurm <br />
      <input type="checkbox" disabled> IBM LSF
    </td>
    <td>
      <input type="checkbox" checked disabled> Amazon AWS <br />
      <input type="checkbox" disabled> Microsoft Azure <br />
      <input type="checkbox" disabled> Google Cloud
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/broadinstitute/cromwell">
        Cromwell
      </a>
      <br />
    Binary/Executable <br />
    <i>Support WDL v1.0</i>
    </td>
    <td>
    <center>
      <input type="checkbox" checked disabled>
    </center>
    </td>
    <td>
      <input type="checkbox" checked disabled> Slurm <br />
      <input type="checkbox" checked disabled> IBM LSF
    </td>
    <td>
      <input type="checkbox" checked disabled> Amazon AWS <br />
      <input type="checkbox" checked disabled> Microsoft Azure <br />
      <input type="checkbox" checked disabled> Google Cloud
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/dnanexus/dxCompiler">
        dxCompiler
      </a>
      <br />
    Binary/Executable <br />
    <i>Support WDL v1.1 and v2.0</i>
    </td>
    <td>
    <center>
      <input type="checkbox" disabled>
    </center>
    </td>
    <td>
      <input type="checkbox" disabled> Slurm <br />
      <input type="checkbox" disabled> IBM LSF
    </td>
    <td>
      <input type="checkbox" checked disabled> Amazon AWS* <br />
      <input type="checkbox" checked disabled> Microsoft Azure* <br />
      <input type="checkbox" disabled> Google Cloud <br /> <br />
      <i>* via DNAnexus</i>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/chanzuckerberg/miniwdl">
        miniwdl
      </a>
      <br />
    Binary/Executable <br />
    <i>Support WDL v1.1</i>
    </td>
    <td>
    <center>
      <input type="checkbox" checked disabled>
    </center>
    </td>
    <td>
      <input type="checkbox" checked disabled>
        Slurm (<a href="https://github.com/miniwdl-ext/miniwdl-slurm">plugin</a>) <br />
      <input type="checkbox" checked disabled>
        IBM LSF (<a href="https://github.com/adthrasher/miniwdl-lsf">plugin</a>)
    </td>
    <td>
      <input type="checkbox" checked disabled>
        Amazon AWS (<a href="https://github.com/miniwdl-ext/miniwdl-aws">plugin</a>) <br />
      <input type="checkbox" disabled> Microsoft Azure <br />
      <input type="checkbox" disabled> Google Cloud
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://terra.bio/">
        Terra
      </a>
      <br />
    Hosted Platform <br />
    <i>Support WDL v1.0</i>
    </td>
    <td>
    <center>
      <input type="checkbox" disabled>
    </center>
    </td>
    <td>
      <input type="checkbox" disabled> Slurm <br />
      <input type="checkbox" disabled> IBM LSF
    </td>
    <td>
      <input type="checkbox" disabled> Amazon AWS <br />
      <input type="checkbox" checked disabled> Microsoft Azure <br />
      <input type="checkbox" checked disabled> Google Cloud
    </td>
  </tr>
   <tr>
    <td>
      <a href="https://toil.ucsc-cgl.org">
        Toil
      </a>
      <br />
    Binary/Executable <br />
    <i>Support WDL v1.1</i>
    </td>
    <td>
    <center>
      <input type="checkbox" disabled>
    </center>
    </td>
    <td>
      <input type="checkbox" checked disabled> Slurm <br />
      <input type="checkbox" checked disabled> IBM LSF
    </td>
    <td>
      <input type="checkbox" checked disabled> Amazon AWS <br />
      <input type="checkbox" disabled> Microsoft Azure <br />
      <input type="checkbox" checked disabled> Google Cloud
    </td>
  </tr>
</table>


## IDE Support

Extensions and other IDE support tools listed sorted by the editor.

| Name                                    | Editor             | Supports                                                                           |
| :-------------------------------------- | :----------------- | :--------------------------------------------------------------------------------- |
| [Sprocket][sprocket] (LSP)              | Editors with LSP   | Formatting, linting, snippets, syntax highlighting, and validation.                |
| [wdl-mode]                              | Emacs              | Syntax highlighting.                                                               |
| [poly-wdl]                              | Emacs              | Integration with [polymode].                                                       |
| [Winstanly WDL]                         | JetBrains          | Linting and syntax highlighting.                                                   |
| [wdl-sublime]                           | Sublime Text       | Syntax                                                               highlighting. |
| [wdl-vim]                               | Vim                | Syntax highlighting.                                                               |
| [Sprocket][sprocket-vscode] (extension) | Visual Studio Code | Formatting, linting, snippets, syntax highlighting, and validation.                |
| [Syntax Highlighter]                    | Visual Studio Code | Syntax highlighting.                                                               |

## Development Tools

The following are tools to enhance the experience of working with WDL sorted by
the category.

| Name              | Category                 | Description                                               |
| :---------------- | :----------------------- | :-------------------------------------------------------- |
| [wdl-tests]       | Conformance testing      | Conformance tests for WDL execution engines.              |
| [wdl-aid]         | Documentation generation | _"Automatic input generation for WDL worflows."_          |
| [pytest-workflow] | Testing                  | Testing framework for workflow languages (including WDL). |
| [wdldoc]          | Documentation generation | _"Create WDL documentation using Markdown."_              |
| [wdl-packager]    | Package management       | _"Package a WDL and imports into a zip file."_            |
| [pytest-wdl]      | Testing                  | _"WDL plugin for pytest."_                                |

## Community Workflows

The following is an incomplete list of large WDL workflow repositories sorted by name.

| Name                                                            |  Description                                                                                                                                                                                                 |
| :-------------------------------------------------------------- |  :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [BioWDL] <br /> _LUMC_                                          |  _"Bioinformatics workflows and tasks, written in WDL."_ BioWDL is a large GitHub organization that contains the WDL workflows developed at LUMC ([link](https://lumc.nl)).                                  |
| [Chan Zuckerberg] <br /> _Chan Zuckerberg Initiative_           | Official repository for the WDL workflows developed at the Chan Zuckerberg Initiative for the CZID platform ([link](https://czid.org)).                                                                     |
| [Dockstore] <br /> _Multiple_                                   | Dockstore describes itself as "an app store for bioinformatics"—it's an open source platform for sharing analytical tools and workflows. WDL is one of the supported languages.                             |
| [ENCODE] <br /> _ENCODE Consortium_                             | Official repository of the ENCODE Data Coordinating Center's Uniform Processing Pipelines. These pipelines are designed to "create high-quality, consistent, and reproducible data" for the ENCODE project. |
| [GATK] <br /> _Broad Institute_                                 | Official GATK best practices workflows developed at and published by the Broad Institute's Data Sciences Platform.                                                                                          |
| [PacBio] <br /> _Pacific Biosciences_                           | Official repository for the best practices workflows for PacBio data.                                                                                                                                       |
| [St. Jude Cloud] <br /> _St. Jude Children's Research Hospital_ | Official repository for data processing pipelines used on St. Jude Cloud ([link](https://platform.stjude.cloud)).                                                                                           |
| [Thiagen] <br /> _Theiagen Genomics_                            | Official repository of Thiagen's WDL workflows.                                                                                                                                                             |
| [WARP] <br /> _Broad Institute_                                 | WARP stands for "WDL Research Analysis Pipelines" and contains cloud-optimized pipelines for processing biological data from the Broad Institute Data Sciences Platform.                                    |
| [WILDS] <br /> _Fred Hutch_                                     | Official repositories of the Workflows for Integration of Large Data and Software (WILDS) developed at the Fred Hutch Data Science Lab.                                                                     |

[create a pull request]: https://github.com/openwdl/docs/pulls
[BioWDL]: https://github.com/biowdl
[Chan Zuckerberg]: https://github.com/chanzuckerberg/czid-workflows
[Dockstore]:
    https://dockstore.org/search?descriptorType=WDL&entryType=workflows&searchMode=files
[ENCODE]: https://www.encodeproject.org/pages/pipelines
[GATK]: https://github.com/gatk-workflows/
[PacBio]: https://github.com/orgs/PacificBiosciences/repositories?q=lang%3Awdl&type=all
[poly-wdl]: https://github.com/jmonlong/poly-wdl
[polymode]: https://github.com/polymode/polymode
[pytest-wdl]: https://github.com/EliLillyCo/pytest-wdl
[pytest-workflow]: https://github.com/LUMC/pytest-workflow
[sprocket-vscode]:
    https://marketplace.visualstudio.com/items?itemName=stjude-rust-labs.sprocket-vscode
[sprocket]: https://github.com/stjude-rust-labs/sprocket
[St. Jude Cloud]: https://github.com/stjudecloud/workflows
[Syntax Highlighter]:
    https://marketplace.visualstudio.com/items?itemName=broadinstitute.wdl
[Thiagen]: https://github.com/theiagen/public_health_bioinformatics
[WARP]: https://broadinstitute.github.io/warp/docs/get-started/
[wdl-aid]: https://github.com/biowdl/wdl-aid
[wdl-mode]: https://github.com/zhanxw/wdl-mode
[wdl-packager]: https://github.com/biowdl/wdl-packager
[wdl-sublime]: https://github.com/broadinstitutewdl-sublime/
[wdl-tests]: https://github.com/openwdl/wdl-tests
[wdl-vim]: https://github.com/broadinstitute/vim-wdl
[wdldoc]: https://github.com/stjudecloud/wdldoc
[WILDS]: https://github.com/orgs/getwilds/repositories?q=lang%3Awdl&type=all
[Winstanly WDL]: https://plugins.jetbrains.com/plugin/8154-winstanley-wdl
