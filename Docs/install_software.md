# (howto) Install software for WDL workshops
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

For our hands-on workshops, you will need to download the following programs:

womtool

The womtool toolkit is a utility package that provides accessory functionality for writing and running WDL scripts, including syntax validation and input template generation. You can download the latest release of the pre-compiled executable along with Cromwell here.

Cromwell

Cromwell is an execution engine capable of running scripts written in WDL, describing data processing and analysis workflows involving command line tools (such as pipelines implementing the GATK Best Practices for Variant Discovery). The latest release can be downloaded here in the form of a pre-compiled jar.

GATK

Our tutorial features tools from the GATK (GenomeAnalysisToolkit) to demonstrate how to write WDL scripts that perform real data processing and analysis tasks; in order to follow them, you’ll need to install GATK. You can either download the GATK package and run it directly in the "traditional" way, or you can run it from within a Docker container. In our workshops, we use Docker, so you will need to follow this procedure to install Docker and get the GATK container image installed appropriately. This may seem a bit more complicated upfront but it eliminates the majority of problems we see people struggle with.

In order to run these tools, you will need to install Java version 8, which you can find here. To make running womtool, Cromwell, & GATK easier, you should add an environment variable for each to your terminal profile pointing at the appropriate jar files. We will use the environment variables $gatk, $cromwell, and $wdltool.

At this point you should be able to test that everything works properly by calling java -jar <environment variable here> -help in your terminal for the cromwell and wdl jar files. If they work, you will see a print out of text describing what functions you can call with each tool. To test gatk, use --help instead of -help.

SublimeText

WDL can be written with any text editing program, but for our workshops we use SublimeText. It is a simple but effective program, and you can download it here. This program also allows syntax highlighting for WDL, which you can optionally install by following the instructions here.

DATA BUNDLE

Lastly, and most importantly, you will need the data bundle we have prepared for this workshop. It contains the materials we will be using for our hands-on, and although it is small, we often encounter lagged downloads if everyone waits to download it at the start of the workshop. You can find a data bundle here, or you can download the one sent to you by the workshop instructors.