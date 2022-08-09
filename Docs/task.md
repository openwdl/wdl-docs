# Task
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

The task component is a top-level component of WDL scripts. It contains all the information necessary to "do something" centering around a command accompanied by definitions of input files and parameters, as well as the explicit identification of its output(s) in the output component. It can also be given additional (optional) properties using the runtime, meta and parameter_meta components.

Tasks are "called" from within the workflow command, which is what causes them to be executed when we run the script. The same task can be run multiple times with different parameters within the same workflow, which makes it very easy to reuse code. How this works in practice is explained in detail in the Plumbing Options section.

Example:
task my_task {
    [ input definitions ]
    command { ... }
    output { ... }
}