# Output

The `output` component is a (*usually*) required property of a `task`. It is used to explicitly identify the output(s) of the task `command` for the purpose of flow control. The outputs identified here will be used to build the workflow graph, so it is important to include all outputs that are used as inputs to other tasks in the workflow.

Technically, `output` is not required for tasks that don't produce an output that is used anywhere else, like in the canonical "Hello World" example. But this is very rare, as most of the time when you are writing a workflow that actually does something useful, each task command will produce some sort of output. Because otherwise, why would you run it, right?

All types of variables accepted by WDL can be included here. The output definitions MUST include an explicit type declaration.

## Example:

```wdl
output {
    File out = "~{output_basename}.txt"
}
```