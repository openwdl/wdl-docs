# Execute
## Cromwell

Cromwell is an open source ([BSD 3-clause](https://tldrlegal.com/license/bsd-3-clause-license-(revised))) execution engine written in Java that supports running WDL on three types of platform: local machine (e.g. your laptop), a local cluster/compute farm accessed via a job scheduler (e.g. GridEngine) or a cloud platform (e.g. Google Cloud or Amazon AWS). It is named after James Cromwell, the American actor and star of such great movies as Babe and Star Trek: First Contact -- hence its mascot, Jamie the warp pig.

The Cromwell executable is available as a pre-compiled jar file from the [Cromwell GitHub repository](https://github.com/broadinstitute/cromwell/releases/latest). It requires Java 8 to run.

The basic command syntax is as follows:
```java
java -jar cromwell.jar <action> <parameters>
```

## Running WDL on Cromwell locally

Running on a local machine is the simplest thing in the world. Assuming that you have a WDL script that you've [validated](.validate_syntax.md), called `myWorkflow.wdl`, and a [JSON file of inputs](./specify_inputs.md) called `myWorkflow_inputs.json`, you just call Cromwell’s `run` function, like so:
```java
java -jar Cromwell.jar run myWorkflow.wdl --inputs myWorkflow_inputs.json
```
This will run your workflow. You will see text from the Cromwell engine updating you as it walks through the steps.

*Note that any messages that are normally output to the terminal by the tools themselves will not actually be shown in the terminal where you're running the script. Instead, Cromwell saves this output in a log file called `stderr` located within the execution folder.*

By default, you can find all generated files (outputs and logs) in this folder:
![a diagram of the path to different files in the cromwell execution directory. The example is "/Users/johnsmith/cromwell-executions/My-Workflows/\<run-id>/call-helloWorld"](./images/execution_directory.png).

## Running on other platforms

Running on a cluster or cloud platform can be a little more complicated than that, so we don't cover them in this quick-start guide. 

## That's it! 
Now you're ready to write some scripts yourself. To get started, try checking out the [learn-WDL tutorials](https://github.com/openwdl/learn-wdl).