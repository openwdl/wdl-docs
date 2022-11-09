# Task

The `task` component is a top-level component of WDL scripts. It contains all the information necessary to "do something" by using a `command` along with definitions of input files and parameters, as well as the explicit identification of its output(s) in the `output` component. It can also be given additional (optional) properties using the `runtime`, `meta` and `parameter_meta` components.

Tasks are "called" from within the` workflow`, which is what causes them to be executed when we run the script. The same `task` can be run multiple times with different parameters in the same workflow, which makes it very easy to reuse code. See [Task aliasing](task_aliasing.md) for more information.

## Example:

```wdl
task task_A {
  input {
    File ref
    File in
    String id
  }
  command <<<
    do_stuff -R ~{ref} -I ~{in} -O ~{id}.ext
  >>>
  runtime {
    docker: "ubuntu:latest"
  }
  output {
    File out = "~{id}.ext"
  }
}
```