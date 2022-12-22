# Building multi-path workflows with conditionals and select_first()

WDL workflows with multiple paths allow you to build more complex and broadly applicable analyses.

Why would you want to build one workflow with multiple paths, instead of writing multiple individual workflows? Let’s say you have a collaborator who asks you to use your workflow to process files of a particular type. What would you do if your collaborator’s data type changed but they wanted to analyze the data the same way? You could choose to write a second workflow that takes in the new file type, but if it shares a lot of code with the first workflow, you would be duplicating that code. Duplicating code means maintaining that same code in more places which results in more work and room for error.

Alternatively, you could choose to edit the existing workflow to take in the second type of input and use [conditional statements](conditionals.md) to create a workflow with multiple paths that will be executed depending on which type of input is passed to the workflow. This way, you would only need to maintain the shared code in a single workflow, saving you time and effort. This strategy can also be useful if you have a workflow that you want to run in two different modes, where each mode runs a task differently or with different parameters.

In this document, you’ll see examples of code that use conditional statements and branch and merge plumbing to create workflows with multiple paths.

## Problem

You want to create a workflow with multiple pathways that merges back together in a later task.

## Solution

One or more `if()` statements or conditionals can be used to create a workflow with multiple paths.

Let’s say you have a workflow that calls two tasks, `task_A` and `task_B`, as shown in the code below.

```wdl
version 1.0
workflow myWorkflowName {
  input {
    File my_ref
    File my_input
    String name
    String mode
  }
  call task_A {
    input: 
      ref = my_ref,
      in = my_input,
      id = name     
  }
  call task_B {
    input: 
      ref = my_ref,
      in = my_input,
      id = name
  }
}

task task_A {...}
task task_B {...}
```

As the example above is currently written, both tasks will run any time the workflow is executed, but we want the workflow to run either `task_A` or `task_B` depending on some parameter. In this case, we want the workflow to decide which task to run based on the value of the `mode` input variable, so we can use that input along with conditional statements to create two paths in our workflow.

Additionally, we want the workflow to merge back together for a final task, regardless of whether it ran `task_A` or `task_B` first. We’ll call this final task `task_C` and specify that its input is the output of whichever first task was run. We can do that using a [`select_first()` function](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md#x-select_firstarrayx). Take a look at the code below:

```wdl
version 1.0
workflow myWorkflowName {
  input {
    File my_ref
    File my_input
    String name
    String mode
  }
  if (mode == ‘path_A’) {
    call task_A {
      input: 
        ref = my_ref,
        in = my_input,
        id = name     
    }
  }
  if (mode == ‘path_B’) {
    call task_B {
      input: 
        ref = my_ref,
        in = my_input,
        id = name
    }
  }
  call task_C {
    input: 
      in = select_first([task_A.output, task_B.output])
  }
}

task task_A {...}
task task_B {...}
task task_C {...}
```

Here, we are using `if()` statements along with the `mode` input variable to determine which path our workflow should take. If `mode` is set to `path_A`, then `task_A` will run instead of `task_B`, but if `mode` is set to `path_B`, then `task_B` will run instead of `task_A`.

Regardless of which task runs, the workflow then runs `task_C`, which uses a `select_first()` function to take the output of either `task_A` or `task_B` and use that as the input to `task_C`.

## Example

Now, let’s look at a real-world example of a WDL workflow that has multiple paths and uses `if()` statements and an input variable to determine which tasks to run. The code block below contains relevant snippets of v4.2.7 of the [Optimus pipeline](https://github.com/broadinstitute/warp/blob/Optimus_v4.2.7/pipelines/skylab/optimus/Optimus.wdl) in the [WARP GitHub repository](https://github.com/broadinstitute/warp/tree/Optimus_v4.2.7). *Note that this is an outdated pipeline version and is not currently available on the repository's main branch.*

The Optimus pipeline is an open-source, cloud-optimized pipeline that supports the processing of any 3' single-cell (`sc_rna` mode) and single-nucleus (`sn_rna` mode) count data generated with the [10x Genomics v2 or v3 assay](https://www.10xgenomics.com/solutions/single-cell/). The pipeline corrects cell barcodes and UMIs, aligns reads, marks duplicates calculates summary metrics for genes and cells, detects empty droplets, returns read outputs in BAM format, and returns cell gene counts in NumPy matrix and Loom file formats. For more information, see the [Optimus Overview](https://github.com/broadinstitute/warp/blob/Optimus_v4.2.7/website/docs/Pipelines/Optimus_Pipeline/README.md).

The code below shows an example of using `if()` statements combined with a workflow input value `counting_mode` to create multiple workflow pathways. Depending on whether  `counting_mode` is set to `sc_rna` or `sn_rna`, the workflow will run either the task `TagGeneExon.TagGeneExon as TagGenes` or the task `TagGeneExon.TagReadWithGeneFunction as TagGeneFunction`, respectively. 

Regardless of which task runs, the workflow comes back together for the `Picard.SortBamAndIndex as PreUMISort` task, which uses `select_first()` to set the output of the previous task as its input.

```wdl
version 1.0
workflow Optimus {
  input {
    # Mode for counting either "sc_rna" or "sn_rna"
    String counting_mode = "sc_rna"

    # organism reference parameters
    File annotations_gtf

    # Set to true to count reads in stranded mode
    String use_strand_info = "false"
  }

  if (counting_mode == "sc_rna") {
    call TagGeneExon.TagGeneExon as TagGenes {
      input:
        bam_input = StarAlign.bam_output,
        annotations_gtf = ModifyGtf.modified_gtf
    }
  }

  if (counting_mode == "sn_rna") {
    call TagGeneExon.TagReadWithGeneFunction as TagGeneFunction {
      input:
        bam_input = StarAlign.bam_output,
        annotations_gtf = ModifyGtf.modified_gtf,
        gene_name_tag = "GE",
        gene_strand_tag = "GS",
        gene_function_tag = "XF",
        use_strand_info = use_strand_info
    }
  }

  call Picard.SortBamAndIndex as PreUMISort {
    input:
      bam_input = select_first([TagGenes.bam_output, TagGeneFunction.bam_output])
  }
}
```

When using a string with defined options as in the example above (`sc_rna` or `sn_rna`), it’s a good idea to add a task at the beginning of your workflow to check whether the string supplied to the workflow matches one of the accepted values. A simple task that outputs an error message can go a long way if a workflow fails!

## Resources

- [WDL Plumbing Options: Conditionals (if/else)](./conditionals.md)
- [WDL 1.0 spec](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md)
- Optimus v4.2.7 pipeline [code](https://github.com/broadinstitute/warp/blob/Optimus_v4.2.7/pipelines/skylab/optimus/Optimus.wdl) and [documentation](https://github.com/broadinstitute/warp/blob/Optimus_v4.2.7/website/docs/Pipelines/Optimus_Pipeline/README.md)