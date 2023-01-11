# Using task outputs downstream

When you think about an analysis from start to finish, it probably contains multiple steps, requiring different tools and different file types for each one. In WDL, these steps are often contained in separate tasks, and chaining these tasks together is fundamental to creating a successful and automated workflow. The process of chaining tasks together is also known as adding [plumbing](add_plumbing.md); it allows you to take the output of one task and use it as the input to a downstream task. In this document, you’ll see examples of code that uses different plumbing styles to move input and output files through different tasks.

## Problem

You want to use a task output in a downstream task as an input.

## Solution

To illustrate how we can chain workflow tasks together, let’s first look at an example WDL script that has no chaining. Below is a workflow that calls two tasks, `task_A` and `task_B`:

```wdl
version 1.0
workflow myWorkflowName {
  input {
    File my_ref
    File my_input
    String name
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

As it’s currently written, `task_A` and `task_B` don’t depend on each other and aren’t chained together in the workflow. However, we want to take the output of `task_A` - let’s say that’s a variable called `out_A` - and use that as an input for `task_B`, which will chain those tasks together. To do that, we simply need to change the value of the `task_B` input variable to `task_A.out_A`. Let’s see what that looks like below:

```wdl
version 1.0
workflow myWorkflowName {
  input {
    File my_ref
    File my_input
    String name
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
      in = task_A.out_A,
      id = name
  }
}

task task_A {...}
task task_B {...}
```

Just by setting the task output to the downstream task input variable, we can chain tasks together and create more complicated workflows. You can do this with any task and variable if you use the format `<TASK>.<OUTPUT_VARIABLE>`. This example uses linear chaining to chain tasks together, but there are other plumbing options supported by WDL 1.0 described in [Add plumbing](add_plumbing.md).

What if we want the output of `task_B` to be an output of the workflow? We can specify that in essentially the same way in the workflow output block. Take a look below:

```wdl
version 1.0
workflow myWorkflowName {
  input {
    File my_ref
    File my_input
    String name
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
      in = task_A.out_A,
      id = name
  }
  output {
    File file_out = task_B.out_B
  }
}

task task_A {...}
task task_B {...}
```

Note that the order in which tasks are written in a WDL script does not dictate the order in which they are run. For example, when a workflow is executed using the portable execution engine [Cromwell](https://cromwell.readthedocs.io/en/stable), Cromwell determines task dependencies based on the workflow script and runs the tasks in an order that’s consistent with those dependencies.

## Example

Now, let’s look at a real-world example of a WDL workflow that chains tasks together. The code block below contains relevant snippets of the [Optimus pipeline](https://github.com/broadinstitute/warp/blob/master/pipelines/skylab/optimus/Optimus.wdl) in the [WARP GitHub repository](https://github.com/broadinstitute/warp/tree/master).

The Optimus pipeline is an open-source, cloud-optimized pipeline that supports the processing of any 3' single-cell and single-nucleus count data generated with the [10x Genomics v2 or v3 assay](https://www.10xgenomics.com/solutions/single-cell/). The pipeline corrects cell barcodes and UMIs, aligns reads, marks duplicates calculates summary metrics for genes and cells, detects empty droplets, returns read outputs in BAM format, and returns cell gene counts in NumPy matrix and Loom file formats. For more information, see the [Optimus Overview](https://broadinstitute.github.io/warp/docs/Pipelines/Optimus_Pipeline/README/).

The code below shows several plumbing examples ([linear chaining](Linear_chaining.md) and [branching and merging](Branch_and_merge.md)) that use the output of one task as the input for downstream tasks. In this workflow, the output of the `MergeBam` task, `output_bam`, is used as the input for both the `GeneMetrics` and `CellMetrics` tasks as the variable, `bam_input`. As a result, both tasks are dependent on the `MergeBam` task, but they are not dependent on one another even though the `CellMetrics` task appears in the workflow script after the `GeneMetrics` task.

The outputs from the `GeneMetrics` and `CellMetrics` tasks are carried forward as inputs in the `LoomUtils.OptimusLoomGeneration` task and as workflow-level outputs in the output block.

```wdl
version 1.0
workflow Optimus {
  input {
    # Mode for counting either "sc_rna" or "sn_rna"
    String counting_mode = "sc_rna"

    # Sequencing data inputs
    String input_id
    String output_bam_basename = input_id
    String? input_name
    String? input_id_metadata_field
    String? input_name_metadata_field

    # organism reference parameters
    File annotations_gtf
  }

  call Merge.MergeSortBamFiles as MergeBam {
    input:
      bam_inputs = STARsoloFastq.bam_output,
      output_bam_filename = output_bam_basename + ".bam",
      sort_order = "coordinate"
  }

  call Metrics.CalculateGeneMetrics as GeneMetrics {
    input:
      bam_input = MergeBam.output_bam
  }

  call Metrics.CalculateCellMetrics as CellMetrics {
    input:
      bam_input = MergeBam.output_bam,
      original_gtf = annotations_gtf
  }

  call LoomUtils.OptimusLoomGeneration {
    input:
      input_id = input_id,
      input_name = input_name,
      input_id_metadata_field = input_id_metadata_field,
      input_name_metadata_field = input_name_metadata_field,
      annotation_file = annotations_gtf,
      cell_metrics = CellMetrics.cell_metrics,
      gene_metrics = GeneMetrics.gene_metrics,
      sparse_count_matrix = MergeStarOutputs.sparse_counts,
      cell_id = MergeStarOutputs.row_index,
      gene_id = MergeStarOutputs.col_index,
      empty_drops_result = RunEmptyDrops.empty_drops_result,
      counting_mode = counting_mode,
      pipeline_version = "Optimus_v~{pipeline_version}"
  }

  output {
    File cell_metrics = CellMetrics.cell_metrics
    File gene_metrics = GeneMetrics.gene_metrics
  }
}
```

## Resources

- [Add plumbing WDL doc](add_plumbing.md)
- [WDL 1.0 spec](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md)
- Optimus pipeline [code](https://github.com/broadinstitute/warp/blob/master/pipelines/skylab/optimus/Optimus.wdl) and [documentation](https://broadinstitute.github.io/warp/docs/Pipelines/Optimus_Pipeline/README/)
