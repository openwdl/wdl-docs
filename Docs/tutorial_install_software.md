# Install software for Broad WDL workshops
For the Broad Institute's hands-on workshops, you will need to download the following programs:

## womtool

The womtool toolkit is a utility package that provides accessory functionality for writing and running WDL scripts, including syntax validation and input template generation. You can download the latest release of the pre-compiled executable along with Cromwell from the [Cromwell Releases in GitHub](https://github.com/broadinstitute/cromwell/releases).

## Cromwell

Cromwell is an execution engine capable of running scripts written in WDL, describing data processing and analysis workflows involving command line tools (such as pipelines implementing the GATK Best Practices for Variant Discovery). The latest release can be downloaded as pre-compiled jar from the [Cromwell Releases in GitHub](https://github.com/broadinstitute/cromwell/releases).

## GATK

Our tutorial features tools from the GATK (GenomeAnalysisToolkit) to demonstrate how to write WDL scripts that perform real data processing and analysis tasks; in order to follow them, you’ll need to install GATK. You can either download the GATK package from the [GATK Releases in GitHub](https://github.com/broadinstitute/gatk/releases) and run it directly in the "traditional" way, or you can run it from within a Docker container. In our workshops, we use Docker, so you will need to follow the [How-to Run GATK in a Container](https://gatk.broadinstitute.org/hc/en-us/articles/360035889991) tutorial to install Docker and get the GATK container image installed appropriately. This may seem a bit more complicated upfront but it eliminates the majority of problems we see people struggle with.

In order to run these tools, you will need to install the correct version of Java for the latest Cromwell. You can find the correct JAVA version in the [Cromwell documentation's Releases page](https://cromwell.readthedocs.io/en/stable/Releases/).  

To make running womtool, Cromwell, & GATK easier, you should add an environment variable for each tool to your terminal profile that points at the appropriate jar files. We will use the environment variables `$gatk`, `$cromwell`, and `$wdltool`.

At this point you should be able to test that everything works properly by calling the following code in your terminal for each jar file:
```wdl
 java -jar <environment variable here> -help
 ```
If the jar works, you will see a print out of text describing what functions you can call with each tool. To test `gatk`, use `--help`instead of `-help`.

## SublimeText

WDL can be written with any text editing program, but for our workshops we use SublimeText. It is a simple but effective program, and you can download it [here](https://www.sublimetext.com/download). This program also allows syntax highlighting for WDL, which you can optionally install by following the instructions [here](https://github.com/broadinstitute/wdl-sublime-syntax-highlighter).

## DATA BUNDLE

Lastly, and most importantly, you will need the data bundle we have prepared for this workshop. It contains the materials we will be using for our hands-on, and although it is small, we often encounter lagged downloads if everyone waits to download it at the start of the workshop. You can find a data bundle here, or you can download the one sent to you by the workshop instructors.