# Toolkit: All the tools you need to write and run WDLs

## Authoring 
### [SublimeText](https://www.sublimetext.com/)

Our preferred editor for writing WDLs; it offers a good balance of usability and editing features.

### Syntax highlighters

Plugins that enable syntax highlighting (i.e. coloring code elements based on their function) for supported text editors. Syntax highlighting has been developed for [SublimeText and Visual Studio](https://github.com/broadinstitute/wdl-sublime-syntax-highlighter), [vim](https://github.com/broadinstitute/vim-wdl), and [IntelliJ](https://github.com/broadinstitute/winstanley#winstanley-an-intellij-plug-in-for-wdl).

## VISUALIZATION
### [Pipeline Builder](https://github.com/epam/pipeline-builder)

A slick web-based tool that creates an interactive graphical representation of any workflow written in WDL; also includes WDL code generation functionality.

## VALIDATION & INPUTS
[WOMTool](https://github.com/broadinstitute/cromwell/releases/latest)

A Java command-line tool co-developed with WDL that performs utility functions, including syntax validation and generation of input JSON templates. See the doc entries on [validation](./validate_syntax.md) and [inputs](./specify_inputs.md) for quickstart instructions.

## EXECUTION
[Cromwell](https://github.com/broadinstitute/cromwell/)

An execution engine co-developed with WDL; it can be used on multiple platforms through pluggable backends and offers sophisticated pipeline execution features. See the doc entry on [execution](./execute.md) for quickstart instructions.

## ALL WRAPPED UP
[Terra](https://software.broadinstitute.org/firecloud)

A cloud-based analysis platform for running workflows written in WDL via Cromwell on Google Cloud; it is open to the public and offers sophisticated data and workflow management features.

[wdl_runner](https://github.com/broadinstitute/wdl-runner)

A lightweight command-line workflow submission system that runs WDLs via Cromwell on Google Cloud.

[wdlRunR](https://github.com/seandavi/wdlRunR)

A Bioconductor package to manage WDL workflows from within R, developed by Sean Davis. See docs [here](https://seandavi.github.io/wdlRunR/).