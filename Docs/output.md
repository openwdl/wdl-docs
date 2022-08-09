# Output
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

The output component is a (mostly*) required property of a task. It is used to explicitly identify the output(s) of the task command for the purpose of flow control. The outputs identified here will be used to build the workflow graph, so it is important to include all outputs that are used as inputs to other tasks in the workflow.

Technically, output is not required for tasks that don't produce an output that is used anywhere else, like in the canonical "Hello World" example. But this is very rare, as most of the time when you are writing a workflow that actually does something useful, each task command will produce some sort of output. Because otherwise, why would you run it, right?

All types of variables accepted by WDL can be included here. The output definitions MUST include an explicit type declaration.

Usage example
output {
    File out = "${output_basename}.txt"
}