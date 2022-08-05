# Toolkit: All the tools you need to write and run WDLs
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

AUTHORING
SublimeText

Our preferred editor for writing WDLs; it offers a good balance of usability and editing features.

Syntax highlighters

Plugins that enable syntax highlighting (i.e. coloring code elements based on their function) for supported text editors. Syntax highlighting has been developed for SublimeText and Visual Studio, vim, and IntelliJ.

 VISUALIZATION
Pipeline Builder

A slick web-based tool that creates an interactive graphical representation of any workflow written in WDL; also includes WDL code generation functionality.

 VALIDATION & INPUTS
WOMTool

A Java command-line tool co-developed with WDL that performs utility functions, including syntax validation and generation of input JSON templates. See the doc entries on validation and inputs for quickstart instructions.

 EXECUTION
Cromwell

An execution engine co-developed with WDL; it can be used on multiple platforms through pluggable backends and offers sophisticated pipeline execution features. See the doc entry on execution for quickstart instructions.

 ALL WRAPPED UP
Terra

A cloud-based analysis platform for running workflows written in WDL via Cromwell on Google Cloud; it is open to the public and offers sophisticated data and workflow management features.

wdl_runner

A lightweight command-line workflow submission system that runs WDLs via Cromwell on Google Cloud.

wdlRunR

A Bioconductor package to manage WDL workflows from within R, developed by Sean Davis. See docs here.