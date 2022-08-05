# Validate syntax
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

Nobody likes to kick off a bunch of jobs only to find after returning from lunch that they all failed within minutes due to a syntax error in the script. Missing bracket, schmacket.

The good news is that WDL comes with a utility toolkit called wdltool that includes a syntax validation function. Instructions for getting and running the wdltool executable are here (but don't worry about it now -- we'll give you that link again when it's time to install everything you need).

To validate our WDL syntax, we simply call the validate function on our script:

$ java -jar wdltool.jar validate myWorkflow.wdl

This function parses the WDL script and alerts us to any syntax errors such missing curly braces, undefined variables, missing commas and so on. It will resolve imports, but note that it is not able to identify errors like typos in commands, specifying the wrong filename, or failing to provide required inputs to the programs that are run in the workflow.

Example: error if a call references a task that doesn't exist:
$ java -jar wdltool.jar validate myWorkflow.wdl
ERROR: Call references a task (BADps) that doesn't exist (line 22, col 8)

  call BADps
       ^

Once we've fixed any syntax errors, we're almost ready to run our script! Just one more step stands between us and execution. Um. That's a little worrying, isn't it? Maybe we could rephrase that? Sure. Just one more step between us and nirvana. No that's not better. OK, just one more step between us and the satisfaction of a well-written WDL script running smoothly on our preferred execution engine. Yeah alright let's go with that.

Go to the next section: Specify Inputs.