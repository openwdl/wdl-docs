---
outline: deep
---

# Workflows

**Workflows** ([spec link][spec-workflows]) define the computation graph that connects
global inputs, outputs, and `tasks` together to build a comprehensive execution plan.
While tasks are focused at the atomic computational unit level, workflows are typically
concerned with how to orchestrate the execution of those tasks in a scalable manner.


### Common sections with `task`

Workflows contain multiple sections that are common with `task`s, including the `input`
section, the `output` section, and the `meta` and `parameter_meta` sections. The
description of these sections are identical with `task`s and, for brevity, we will not
cover these again in this section of the guide. If you need a refresher, we recommend
you read the relevant sections in the [Tasks](tasks.md) section.

[spec-workflows]:
    https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#workflow-definition

### The `call` statement

The `call` statement ([spec link][spec-call]) directs the workflow to execute the
specified task or subworkflow. `call`-ing a task or subworkflow brings its name into
scope within the workflow such that its inputs and outputs can be connected
together—either to global inputs and outputs of the workflow or to other
tasks/subworkflows. Further, you can use the `as` keyword to avoid naming collisions
(see [this design pattern](../design-patterns/task-aliasing/) for more information).

Below is an example of a typical workflow that uses call statements.

```wdl
task stepA {
  # ...
}

task stepB {
  # ...
}

workflow run {
  # You can instruct the workflow to run `stepA` by `call`-ing it.
  call stepA {}

  # If there are inputs, you can include them within the brackets.
  call stepB { input: foo = bar }

  # Normally, if you wanted to call `stepA` again, there would be
  # a name conflict because the identifier `stepA` would be brought
  # into the workflow's scope twice. You can use the `as` keyword
  # to assign the task an alias.
  call stepA as stepA_again {}
}
```

### Non-sequentialism

A quick note on non-sequentialism: in the example above, tasks are not necessarily
executed in the order they are defined. For example, because `stepA_again` does not
depend on any outputs from `stepA` or `stepB`, it can be run immediately when the
workflow starts. This illustrates a broader point—defining a workflow means that you are
defining a _graph_ of computation—not a serial program to be executed. You can learn
more about this in [this section of the spec][spec-element-evaluation].

### Conditional statement

A **conditional statement**, also known as an `if`/`else` statement ([spec
link][spec-conditional]) allows some subsection of the computation graph to
conditionally occur based on the specified condition. This is useful if, for example,
you want to support different modes of operation based on an input or optionally enable
an entire subanalysis of some data based on passing a QC threshold.

Building on our example above, we can see conditional statements in action.

```wdl
task stepA {
  # ...
}

task stepB {
  # ...
}

workflow run {
  input {
    Boolean run_stepB
  }

  call stepA {}

  if (run_stepB) {
    call stepB { input: in = stepA.out }
  }

  # ...
}
```

For a bit more complicated example, the workflow below demonstrates (a) conditionally
executing a "standard" or "alternate" mode for `stepA` and then (b) only running `stepB`
if some QC metric from either mode passes.

```wdl
task stepA {
  # ...
}

task stepA_alternate {
  # ...
}

task stepB {
  # ...
}

workflow run {
  input {
    # `alternate_execution_mode` is a required workflow input.
    Boolean alternate_execution_mode
  }

    # Based on the value passed in as an input, either...
    if (alternate_execution_mode) {
        # the alternate execution mode will run, or...
        call stepA_alternate {
        }
    }

    if (!alternate_execution_mode) {
        # the standard execution mode will run...
        call stepA {
        }
    }

    # Using `select_first`, we can pick up an output named `qc_passed`
    # in either `stepA` or `stepA_alternate` (whichever ran) and then
    # conditionally run `stepB` based on that result.
    if (select_first([
        stepA.qc_passed,
        stepA_alternate.qc_passed,
    ])) {
        call stepB {}
    }

    # ...
}
```

Note that the above example uses two `if` statements because WDL doesn't yet support
`else` statements. Instead, one can achieve the same effect with two if
statements and a negated conditional on the second statement.

### Design patterns

Ensuring that your workflow takes full advantage of parallelism is critical to ensuring
your workflow scales well. In fact, the ease with which workflows can be defined and
scaled is one of the hallmarks of the WDL language. This concept is so important that
the is an entire section of the documentation titled "Design Patterns" that covers
idiomatic approaches to construct workflows
([link](../design-patterns/linear-chaining/)). We highly recommend you read that section
to take full advantages of the facilities WDL provides. 

[spec-call]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#call-statement
[spec-element-evaluation]:
    https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#evaluation-of-workflow-elements
[spec-conditional]:
    https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#conditional-statement
