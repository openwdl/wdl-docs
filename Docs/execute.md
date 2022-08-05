# Execute
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

At the moment, Cromwell is the only fully-featured execution engine that we know of that supports WDL.

Cromwell

Cromwell is an open source (BSD 3-clause) execution engine written in Java that supports running WDL on three types of platform: local machine (e.g. your laptop), a local cluster/compute farm accessed via a job scheduler (e.g. GridEngine) or a cloud platform (e.g. Google Cloud or Amazon AWS). It is named after James Cromwell, the American actor and star of such great movies as Babe and Star Trek: First Contact -- hence its mascot, Jamie the warp pig.

The Cromwell executable is available as a pre-compiled jar file from the Cromwell GitHub repository. It requires Java 8 to run.

The basic command syntax is as follows:

java -jar cromwell.jar <action> <parameters>

More detailed examples of running WDLs via Cromwell are available in the Tutorials section of the WDL documentation. 

Running WDL on Cromwell locally

Running on a local machine is the simplest thing in the world. Assuming that you have a WDL script that you've validated called myWorkflow.wdl, and a JSON file of inputs called myWorkflow_inputs.json, you just call Cromwell’s run function, like so:

java -jar Cromwell.jar run myWorkflow.wdl --inputs myWorkflow_inputs.json

This will run your workflow. You will see text from the Cromwell engine updating you as it walks through the steps.

Note that any messages that are normally output to the terminal by the tools themselves will not actually be shown in the terminal where you're running the script. Instead, Cromwell saves this output in a log file called stderr located within the execution folder.

By default, you can find all generated files (outputs and logs) in this folder:

Running on other platforms

Running on a cluster or cloud platform can be a little more complicated than that, so we don't cover them in this quick-start guide. We provide some pointers to platforms or integrations that wrap Cromwell on the Toolkit page.

And that's it! Now you're ready to write some scripts yourself. Check out the resources linked below.

WDL Tutorials
FAQs
Cromwell Docs
WDL Language Specification 