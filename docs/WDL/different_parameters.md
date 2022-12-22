# Running a task with different parameters based on whether on optional input is defined

When you think about coding best practices, reusing code to avoid duplication is often at the top of the list. But what if you have a software program with optional parameters that you might want to include or exclude depending on your WDL input parameters? Do you need to duplicate the code for each option? Luckily, the answer is “no” as WDL 1.0 has several solutions that allow you to pass different parameters to a task without changing or duplicating the code. 

In this document, you’ll see examples of code that change the way a WDL task runs based on whether or not an optional input is defined in the workflow definition.

## Problem

You want to run a task with additional parameters if an input variable is defined without changing or duplicating the code.

## Solution

Running a task differently (or with different parameters) based on whether or not an input variable is defined can be done in WDL 1.0 and is easiest to specify inside a task definition rather than a task call. 

Let’s say we have a workflow that takes in one optional input, `name`, and two non-optional inputs. Then, the workflow calls a task, `task_A`, which runs a program called `do_stuff`, as shown in the example below:

```wdl
version 1.0
workflow myWorkflowName {
  input {
    File my_ref
    File my_input
    String? name
  }
  call task_A {
    input: 
      ref = my_ref,
      in = my_input,
      id = name     
  }
}

task task_A {
  input {
    File ref
    File in
    String? id
  }
  command <<<
    do_stuff \
      -R ~{ref} \
      -I ~{in} \
      -O ~{id}
  >>>
}
```

As it’s written above, this example script will run `do_stuff` as specified in `task_A` where a value is expected for all three input parameters, regardless of whether the optional workflow parameter, `name`, is defined. If the variable `name` is not defined in the workflow, then the task-level variable `id` is not defined, but `do_stuff` is expecting a value for the corresponding parameter, meaning it will probably throw an error. 

To fix this, we need to edit the workflow so the parameter that takes in the value of `id` is only passed when `id` is defined. We can do this by editing that line in the `command` block as shown below:

```wdl
version 1.0
workflow myWorkflowName {
  input {
    File my_ref
    File my_input
    String? name
  }
  call task_A {
    input: 
      ref = my_ref,
      in = my_input,
      id = name     
  }
}

task task_A {
  input {
    File ref
    File in
    String? id
  }
  command <<<
    do_stuff \
      -R ~{ref} \
      -I ~{in} \
      ~{“-O ” + id}
  >>>
}
```

In the updated `command` block, you’ll see we’ve changed the format to include both the parameter and the input variable inside the expression placeholder (`~{}`). By doing this, we’ve told our workflow that it first needs to check to see whether `id` is defined. If it is, the workflow will pass that input along with the string in quotes preceding that input variable to the command. So if the value of `id` is `sample_1`, then `-O sample_1` is included in the command. If `id` is not defined, the workflow will effectively ignore everything inside the expression placeholder and the parameter `-O` will not be included in the command. For more information, see [Prepending a String to an Optional Parameter](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md#prepending-a-string-to-an-optional-parameter) in the WDL 1.0 spec.

## Example

Now, let’s look at a real-world example of a WDL workflow that runs a task differently based on whether an input is defined. The code block below contains relevant snippets of the [Optimus pipeline](https://github.com/broadinstitute/warp/blob/master/pipelines/skylab/optimus/Optimus.wdl) and the [tasks](https://github.com/broadinstitute/warp/blob/master/tasks/skylab/LoomUtils.wdl) that it calls in the [WARP GitHub repository](https://github.com/broadinstitute/warp/tree/master).

The Optimus pipeline is an open-source, cloud-optimized pipeline that supports the processing of any 3' single-cell and single-nucleus count data generated with the [10x Genomics v2 or v3 assay](https://www.10xgenomics.com/solutions/single-cell/). The pipeline corrects cell barcodes and UMIs, aligns reads, marks duplicates calculates summary metrics for genes and cells, detects empty droplets, returns read outputs in BAM format, and returns cell gene counts in NumPy matrix and Loom file formats. For more information, see the [Optimus Overview](https://broadinstitute.github.io/warp/docs/Pipelines/Optimus_Pipeline/README/).

The code below shows some of the inputs and a task call in the Optimus pipeline. In this example, there are three optional workflow inputs, `input_name`, `input_id_metadata_field`, and `Input_name_metadata_field`, which are called as inputs in the task, `LoomUtils.OptimusLoomGeneration`.

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
  }

  call LoomUtils.OptimusLoomGeneration{
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
  }
}
```

The optional workflow inputs above are also optional inputs in the task code shown below (`OptimusLoomGeneration`). They are used as input parameters for the python script `create_loom_optimus.py` specified in the task’s `command` block. However, the code is written a little differently for these three parameters when compared to the rest. The input parameters that are required for the script are written using the format, `--<*SCRIPT_PARAMETER*> ~{<*TASK_INPUT_VARIABLE*>}` (for example, `--input_id ~{input_id}`).

To pass the input to the task only in the case where the input variable is defined, we need to use a slightly different format. For this, we use, `~{"<*SCRIPT_PARAMETER*> " + <*TASK_INPUT_VARIABLE*>}` (for example, `~{"--input_name " + input_name}`). 

When we put the entire line of code in the expression placeholder like this, we’re doing a couple of things. First, we’re checking whether the task-level input variable is defined. If it is defined, we are passing that input along with the string in quotes preceding that input variable to the command. If it isn’t defined, that line of code is effectively ignored during the execution of the task. In this way, we are able to run a task differently (or with different parameters) based on whether or not an input variable is defined. 

```wdl
version 1.0
task OptimusLoomGeneration {
  input {
    #runtime values
    String docker = "us.gcr.io/broad-gotc-prod/pytools:1.0.0-1661263730"
    # name of the sample
    String input_id
    # user provided id
    String? input_name
    String? input_id_metadata_field
    String? input_name_metadata_field
    # gene annotation file in GTF format
    File annotation_file
    # the file "merged-cell-metrics.csv.gz" that contains the cellwise metrics
    File cell_metrics
    # the file "merged-gene-metrics.csv.gz" that contains the genwise metrics
    File gene_metrics
    # file (.npz)  that contains the count matrix
    File sparse_count_matrix
    # file (.npy) that contains the array of cell barcodes
    File cell_id
    # file (.npy) that contains the array of gene names
    File gene_id
    # emptydrops output metadata
    File? empty_drops_result
    String counting_mode = "sc_rna"

    String pipeline_version

    Int preemptible = 3
    Int disk = 200
    Int machine_mem_mb = 18
    Int cpu = 4
  }

  command <<<
    set -euo pipefail

    if [ "~{counting_mode}" == "sc_rna" ]; then
        python3 /usr/gitc/create_loom_optimus.py \
          --empty_drops_file ~{empty_drops_result} \
          --add_emptydrops_data "yes" \
          --annotation_file ~{annotation_file} \
          --cell_metrics ~{cell_metrics} \
          --gene_metrics ~{gene_metrics} \
          --cell_id ~{cell_id} \
          --gene_id  ~{gene_id} \
          --output_path_for_loom "~{input_id}.loom" \
          --input_id ~{input_id} \
          ~{"--input_name " + input_name} \
          ~{"--input_id_metadata_field " + input_id_metadata_field} \
          ~{"--input_name_metadata_field " + input_name_metadata_field} \
          --count_matrix ~{sparse_count_matrix} \
          --expression_data_type "exonic" \
          --pipeline_version ~{pipeline_version}
    else
        python3 /usr/gitc/create_snrna_optimus.py \
          --annotation_file ~{annotation_file} \
          --cell_metrics ~{cell_metrics} \
          --gene_metrics ~{gene_metrics} \
          --cell_id ~{cell_id} \
          --gene_id  ~{gene_id} \
          --output_path_for_loom "~{input_id}.loom" \
          --input_id ~{input_id} \
          ~{"--input_name " + input_name} \
          ~{"--input_id_metadata_field " + input_id_metadata_field} \
          ~{"--input_name_metadata_field " + input_name_metadata_field} \
          --count_matrix ~{sparse_count_matrix} \
          --expression_data_type "whole_transcript"\
          --pipeline_version ~{pipeline_version}
    fi
  >>>

  runtime {
    docker: docker
    cpu: cpu  # note that only 1 thread is supported by pseudobam
    memory: "~{machine_mem_mb} GiB"
    disks: "local-disk ~{disk} HDD"
    preemptible: preemptible
  }

  output {
    File loom_output = "~{input_id}.loom"
  }
}
```

In addition to the method described above, you can also run a task differently based on whether an optional input is defined using the [true and false expression placeholder option](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md#true-and-false) or an [`if defined()`](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md#boolean-definedx) expression. Check out the code below for examples.

### True and false

The example line of code below is used in the IndelsVariantRecalibrator task](https://github.com/broadinstitute/warp/blob/master/tasks/broad/JointGenotypingTasks.wdl#L343) in WARP. First, the task checks if `use_allele_specific_annotations` is defined. If it is defined, `--use-allele-specific-annotations` is included in the command. If it isn’t defined, nothing from this line of code is included in the command. Check out the [WDL 1.0 spec](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md#true-and-false) for more information on the true and false expression placeholder.

```wdl
version 1.0
~{true='--use-allele-specific-annotations' false='' use_allele_specific_annotations}
```

### If defined()

The example line of code below is used in the CheckFingerprintTask task](https://github.com/broadinstitute/warp/blob/master/tasks/broad/Qc.wdl#L319) in WARP. First, the task checks if `input_vcf` is defined. If it is defined, `--OBSERVED_SAMPLE_ALIAS \"" + input_sample_alias + "\"` is included in the command. If it isn’t defined, nothing from this line of code is included in the command. Check out the WDL 1.0 spec for more information on the [if then else operator](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md#if-then-else) and the [Boolean defined(X?) function](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md#boolean-definedx).

```wdl
version 1.0
~{if defined(input_vcf) then "--OBSERVED_SAMPLE_ALIAS \"" + input_sample_alias + "\"" else ""}
```

## Resources

- [Prepending a String to an Optional Parameter](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md#prepending-a-string-to-an-optional-parameter)
- [True and false expression placeholder](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md#true-and-false)
- [If then else operator](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md#if-then-else)
- [Boolean defined(X?) function](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md#boolean-definedx)
- [WDL 1.0 spec](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md)
- Optimus [pipeline WDL](https://github.com/broadinstitute/warp/blob/master/pipelines/skylab/optimus/Optimus.wdl), [task WDL](https://github.com/broadinstitute/warp/blob/master/tasks/skylab/LoomUtils.wdl), and [documentation](https://broadinstitute.github.io/warp/docs/Pipelines/Optimus_Pipeline/README/)