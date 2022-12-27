# WDL at Fred Hutch

Fred Hutch has begun supporting use of WDL workflows on their local SLURM cluster to support reproducible workflow development and testing locally while facilitating collaboration and cloud computing when needed. They have added some basic information about using [WDL workflows and Cromwell](https://sciwiki.fredhutch.org/compdemos/Cromwell/) in their documentation site.  

If you're looking for Cromwell configuration information for a SLURM cluster (including wiring to convert Docker containers to Singularity prior to running jobs), you can find the [diy-cromwell-server repo](https://github.com/FredHutch/diy-cromwell-server) with instructions.  We also have [a repo containing some very basic WDL workflows](https://github.com/FredHutch/wdl-test-workflows) meant primarily to test Cromwell servers and for new users to begin to learn how WDL workflows can be structured.  

The Fred Hutch Data Science Lab has developed an [introductory guide](https://hutchdatascience.org/FH_WDL101_Cromwell/) for Fred Hutch staff to get set up to use Cromwell as it is configured in the above repo, though the content may be useful for others intending to do something similar at their institution.  They are actively working to develop a guide to designing, testing and optimizing WDL workflows [here](https://hutchdatascience.org/FH_WDL102_Workflows/). 

This Cromwell configuration is made simpler for use by staff via the [fh.wdlR](https://github.com/FredHutch/fh.wdlR) R package, a convenience package that wraps the Cromwell API calls and does some basic parsing of the metadata suitable for basic workflows.  Also, there is a Shiny app [here](https://github.com/FredHutch/shiny-cromwell) that leverages `fh.wdlR` and can be run on your local machine if desired to serve as a useful interface with your Cromwell server.  


On all these resources, we welcome your input on the various GitHub repo's that drive them all.  