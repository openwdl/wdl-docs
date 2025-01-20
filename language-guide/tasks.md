---
outline: deep
---

# Tasks

**Tasks** ([spec link][spec-tasks]) are the atomic unit of computation within WDL.
Fundamentally, the represent a bash script that is intended to be run to accomplish some
goal. You'll reach for tasks when defining each of the constituent analyses within a
broader [workflow](./workflows.md).

Tasks have a required ```command``` section and several optional sections for things
like defining inputs, defining outputs, documenting your task, and specifying runtime
requirements. We'll cover each of these in detail here while leaving an exhaustive
explanation to [the specification][spec-tasks]. 

Below is a representative example of what a simple task might look like.

```wdl
task say_hello {
  input {
    String greeting
    String name
  }

  command <<<
    echo "~{greeting}, ~{name}!"
  >>>

  output {
    String message = read_string(stdout())
  }

  requirements {
    container: "ubuntu:latest"
  }
}
```

### The `command` section

The most important part of a task (and the only _required_ section) is the `command`
section. The command section is simply a Bash script that should be executed when the
task is run. As you can see in the snippet below, variables from within WDL can be
injected into the Bash script at runtime using the `~{variable_name}` syntax.

```wdl
task say_hello {
  input {
    String greeting
    String name
  }

  command <<<
    echo "~{greeting}, ~{name}!"
  >>>

  # ...
}
```

### The `input` section

You can pass inputs to your task using the `input` section ([spec
link][spec-task-inputs]). Task inputs are declared as WDL variables and are generally
intended to be used as (a) values to be interpolated within the `command` section or (b)
values that are manipulated and passed through directly to the `output` section.
Variables, and how they might be declared in `input` sections, are more fully covered in
the [Variables](./variables.md#declarations) section of the language guide.

### The `output` section

Similarly, you can declare outputs from your task using the `output` section ([spec
link][spec-task-outputs]). Outputs are generally gathered by either (a) using one or
more standard library functions to collect output from the tasks execution directory or
(b) referring to other variables directly.

```wdl
task run {
  # ...

  output {
    # Reads an integer from a file called `threshold.txt`.
    Int threshold = read_int("threshold.txt")

    # Gathers a list of CSV files from the task's execution directory.
    Array[File]+ csvs = glob("*.csv")

    # Examines an existing variable to evaluate a boolean expression.
    Boolean two_csvs = length(csvs) == 2
  }
}
```

Again, variables and the way they can be declared in `output` sections are more fully
covered in the [Variables](./variables.md#declarations) section of the language guide.

### The `requirements` section

The `requirements` section ([spec link][spec-requirements]) allows you to specify
runtime requirements for a task. By far the most common use of `requirements` is to
specify a [container][container-explanation] for your task to run within. This ensure
that the task remains portable across multiple execution environments and is always
recommended. That being said, a whole host of [`requirements`
attributes][spec-requirements-attributes] exist. These cover a wide range of concepts
from things like the amount resources required to run the job (e.g., the number of
required cores, the amount of RAM, the amount of disk space) all the way to the valid
exit codes for the job.

```wdl
task run {
  # ...

  requirements {
    # Constrain the container within which this task should run.
    container: "ubuntu:latest",

    # Ensure that 8 cores are requisitioned.
    cpu: 8,

    # Request 16 gibibytes of random-access memory.
    memory: "16 GiB",
  }
}
```

Because this list is evolving relatively rapidly, we recommend that you go take a look
at the currently supported attributes [in the specification
directly][spec-requirements-attributes] to ensure you know what can be specified.

### Documentation and metadata

Last, documentation and other metadata for your tasks is generally written in the `meta`
([spec link][spec-meta]) and `parameter_meta` ([spec link][spec-parameter-meta])
sections.

* `meta` contains information related to _the task itself_. It's structured as an object
  of key-values pairs that you can define for various metadata attributes of your task.
* `parameter_meta` contains information related to _the inputs and outputs of the task_.
  It's also structured as an object of key-values pairs, but each key _must_ correspond
  to one of the inputs or outputs of the task.

At present, there is no defined standard for which keys should exist: keys are typically
added by convention for each code base and/or tool that utilizes them. Future versions
of WDL may consider defining conventional keys for different concepts. Below is a
representative example of what a `meta` and `parameter_meta` section might look like in
a task.

```wdl
task run {
  # ...

  meta {
    authors: ["Foo Bar <foo@bar.com>", "Baz Quux <baz@quux.com>"],
    description: "This is a task that accomplishes ...",
  }

  parameter_meta {
    in: {
      help: "The `in` parameter defines an input file that is used to ..."
    },
    out: {
      help: "The `out` parameter defines an output file that contains ..."
    }
  }

  # ...
}
```

### Other sections

The above sections cover the most commonly used sections within tasks. Importantly,
other concepts in the `task` section exist, such as the `hints` section ([spec
link][spec-hints]), the use of private declarations ([spec link][spec-declarations]),
and the use of `env` input variables ([spec link][spec-env-variables]). These are more
reserved for more niche use-cases, but users may refer to the spec to learn how to use
them when the need arises.

[spec-tasks]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#task-definition
[spec-task-inputs]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#task-inputs
[spec-task-inputs]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#task-outputs
[spec-requirements]:
    https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#-requirements-section
[spec-requirements-attributes]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#requirements-attributes
[container-explanation]:
    https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-is-a-container/
[spec-meta]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#meta-values
[spec-parameter-meta]:
    https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#parameter-metadata-section
[spec-hints]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#-hints-section
[spec-env-variables]:
    https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#environment-variables
[spec-declarations]:
    https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#private-declarations
