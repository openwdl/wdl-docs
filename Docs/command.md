# Command

The `command` component is a required property of a `task`. The body of the `command` block specifies the literal command line to run (basically any command that you could otherwise run in a terminal shell) with placeholders (for example, `~{input_file}`) for the variable parts of the command line that need to be filled in. Note that all variable placeholders MUST be defined in the `task` input definitions.

## Example

```wdl
command <<<
  java -jar myExecutable.jar \
    INPUT = ~{input_file} \
    OUTPUT = ~{output_basename}.txt
>>>
```