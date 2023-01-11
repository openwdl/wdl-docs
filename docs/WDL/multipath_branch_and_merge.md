# Building multi-path workflows with branch and merge plumbing

Chaining workflow tasks together, or [plumbing](add_plumbing.md), is an important part of creating an automated workflow, and [branch and merge plumbing](Branch_and_merge.md) allows you to create multiple paths in a single workflow. Using branch and merge plumbing, you can feed the output from one task into multiple downstream tasks to be run simultaneously, and then bring those results back together for any shared tasks later on in the workflow. In this document, you’ll see examples of code that use branch and merge plumbing to create workflows with multiple paths.

## Problem

You want to create a workflow with multiple pathways using branch and merge plumbing.

## Solution

Branch and merge plumbing can be used to create workflows with multiple paths.

Let’s say you have a workflow that calls three tasks, `task_A`, `task_B`, and `task_C`, as shown in the code block below:

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
  call task_C {
    input: 
      ref = my_ref,
      in = my_input,
      id = name
  }
}

task task_A {...}
task task_B {...}
task task_C {...}
```

As the example above is currently written, the tasks don’t depend on each other and aren’t chained together in the workflow. However, we want to take the output of `task_A` - let’s say that’s a variable called `out_A` - and use that as an input for both `task_B` and `task_C`, which will chain those tasks together and create two branching pathways in our workflow. To do that, we simply need to change the value of the `task_B` and `task_C` input variables to `task_A.out_A`.

Additionally, we want the workflow to merge back together for a final task which we’ll call `task_D`, and specify that its inputs include the outputs of both `task_B` and `task_C`. Let’s see what that looks like below:

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
      in = task_A.out_A,
      id = name
  }
  call task_C {
    input: 
      ref = my_ref,
      in = task_A.out_A,
      id = name
  }
  call task_D {
    input: 
      in_B = task_B.out_B,
      in_C = task_C.out_C
  }
}

task task_A {...}
task task_B {...}
task task_C {...}
task task_D {...}
```

## Example

Now, let’s look at a real-world example of a multi-path WDL workflow that uses branch and merge plumbing. The code block below contains relevant snippets of the [Optimus pipeline](https://github.com/broadinstitute/warp/blob/master/pipelines/skylab/optimus/Optimus.wdl) and the [tasks](https://github.com/broadinstitute/warp/blob/master/tasks/skylab/LoomUtils.wdl) that it calls in the [WARP GitHub repository](https://github.com/broadinstitute/warp/tree/master).

The Optimus pipeline is an open-source, cloud-optimized pipeline that supports the processing of any 3' single-cell and single-nucleus count data generated with the [10x Genomics v2 or v3 assay](https://www.10xgenomics.com/solutions/single-cell/). The pipeline corrects cell barcodes and UMIs, aligns reads, marks duplicates calculates summary metrics for genes and cells, detects empty droplets, returns read outputs in BAM format, and returns cell gene counts in NumPy matrix and Loom file formats. For more information, see the [Optimus Overview](https://broadinstitute.github.io/warp/docs/Pipelines/Optimus_Pipeline/README/).

The code below shows an example of using branch and merge plumbing to create a workflow with multiple paths. This code snippet starts after the workflow uses earlier tasks to align sequencing reads and create a BAM file (called `output_BAM` below). After creating the BAM, the workflow branches at the tasks, `Metrics.CalculateGeneMetrics as GeneMetrics` and `Metrics.CalculateCellMetrics as CellMetrics`, so that cell and gene metrics can be calculated in parallel on the BAM file. After those tasks run, the workflow merges back together with the task `LoomUtils.OptimusLoomGeneration` which takes in the independent metrics output of the previous tasks, `GeneMetrics.gene_metrics` and `CellMetrics.cell_metrics`, and combines them into a single data file (a Loom file).

```wdl
version 1.0
workflow Optimus {
  input {
    # Mode for counting either "sc_rna" or "sn_rna"
    String counting_mode = "sc_rna"

    # Sequencing data inputs
    String input_id
    String? input_name
    String? input_id_metadata_field
    String? Input_name_metadata_field

    # organism reference parameters
    File annotations_gtf
    File? Mt_genes
  }

  call Metrics.CalculateGeneMetrics as GeneMetrics {
    input:
      bam_input = MergeBam.output_bam,
      mt_genes = mt_genes
  }

  call Metrics.CalculateCellMetrics as CellMetrics {
    input:
      bam_input = MergeBam.output_bam,
      mt_genes = mt_genes,
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
}
```

## Resources

- [Add plumbing WDL doc](add_plumbing.md)
- [Branch and merge WDL doc](Branch_and_merge.md)
- [WDL 1.0 spec](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md)
- Optimus pipeline [code](https://github.com/broadinstitute/warp/blob/master/pipelines/skylab/optimus/Optimus.wdl) and [documentation](https://broadinstitute.github.io/warp/docs/Pipelines/Optimus_Pipeline/README/)