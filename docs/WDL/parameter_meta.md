# Parameter_meta

The `parameter_meta` component is an optional property of a workflow or task. It is intended to store descriptions of input arguments and parameters used in the workflow or task `command`, which is particularly helpful if your variable names are not descriptive enough. Any item (i.e. `input_file`) in this section MUST correspond to an input or output of either the workflow or the task, depending on where the `parameter_meta` component is used.

## Example:

```wdl
parameter_meta {
    my_input: "Input file to be analyzed"
    name: "Name of the sample"
}
```