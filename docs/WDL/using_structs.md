# Organize multiple inputs using structs

When processing or analyzing data, there might be times when you have a group of files that often need to be used together. This could be the case with reference files for a particular type of analysis, for example. If those files need to be used in more than one WDL task, that could mean writing those inputs over and over into every single task call where they are needed. 

Thanks to structs, there is a much easier way to handle this situation in WDL 1.0. Rather than writing out those input files each and every time you need them, you can package them into a struct and use the struct in the tasks where you would otherwise need to pass each file individually. Structs also provide flexibility in packaging and passing files together, because you can use a struct without using every single input defined inside it. On top of that, using structs can increase the readability of your code making it easier for you and others to use and reuse. 

There are other great uses of structs too, including grouping inputs to be used in a scatter block, grouping outputs, and setting runtime parameters. To read more about structs, check out the [WDL 1.0 spec](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md#struct-definition).

In this document, you’ll see examples of code that use structs to group objects together in a workflow.

## Problem

You have a group of files that often need to be used together in a WDL workflow.

## Solution

Grouping files together in a WDL workflow is as easy as defining a structure consisting of those files.

The workflow below takes in several inputs, including three files that are always used together: `my_ref_1`, `my_ref_2`, and `my_ref_3`.

```wdl
version 1.0
workflow myWorkflowName {
  input {
    File my_ref_1
    File my_ref_2
    File my_ref_3
    File my_input
    String name
  }
  call task_A {
    input: 
      ref_1 = my_ref_1,
      ref_2 = my_ref_2,
      ref_3 = my_ref_3
  }
  call task_B {
    input: 
      ref_1 = my_ref_1,
      ref_2 = my_ref_2,
      ref_3 = my_ref_3,
      in = my_input,
      id = name
  }
}

task task_A {...}
task task_B {...}
```

You could choose to write out each input individually, as in the example above, or you could simplify the workflow by creating a struct that includes each of those three input files. Just like tasks, structs need to be created outside of the workflow definition, so we’ll define our new struct at the end of our script, but you could alternatively import a struct in a WDL file just like you do for tasks. 

In addition, we need to update our workflow and task input blocks to use the new struct, `ref_files`, instead of each individual file. Unlike `File` and `String` object types, we don’t define structs as an object type in the input section of the workflow definition. See the updated script below:

```wdl
version 1.0
workflow myWorkflowName {
  input {
    ref_files my_refs
    File my_input
    String name
  }
  call task_A {
    input: 
      my_refs = my_refs
  }
  call task_B {
    input: 
      my_refs = my_refs,
      in = my_input,
      id = name
  }
}

task task_A {...}
task task_B {...}

struct ref_files {
  File ref_1
  File ref_2
  File ref_3
}
```



Now that the files have been packaged together into the `ref_files` struct, the struct can be passed to the WDL tasks rather than each file needing to be passed individually.

## Example

Now, let’s look at a real-world example of a WDL workflow that uses structs to group inputs together. The code block below contains relevant snippets of the [Whole Genome Germline Single Sample (WGS) pipeline](https://github.com/broadinstitute/warp/blob/master/pipelines/broad/dna_seq/germline/single_sample/wgs/WholeGenomeGermlineSingleSample.wdl) in the [WARP GitHub repository](https://github.com/broadinstitute/warp/tree/master).

The WGS pipeline is an open-source, cloud-optimized pipeline that supports the processing of human whole genome sequencing data following the GATK Best Practices for germline SNP and Indel discovery. The pipeline calculates metrics, aligns unmapped BAMs, calls variants, and returns the output VCF along with several metrics files. For more information, see the [Whole Genome Germline Single Sample Overview](https://broadinstitute.github.io/warp/docs/Pipelines/Whole_Genome_Germline_Single_Sample_Pipeline/README).

The code below shows an example of using structs to group together input files. Here, the structs, `SampleAndUnmappedBams`, `DNASeqSingleSampleReferences`, `​​DragmapReference`, and `PapiSettings`, are used as inputs to the workflow and called in the task `ToBam.UnmappedBamToAlignedBam`. 

The task call also shows an example of accessing a single member of a struct using the format `<*STRUCT_NAME*>.<*OBJECT_NAME*>`, as in `contamination_sites_ud = references.contamination_sites_ud`. This line of code is using the `references` struct to access only the `contamination_sites_ud` file inside it.

```wdl
version 1.0

import "../../../../../../structs/dna_seq/DNASeqStructs.wdl"

workflow WholeGenomeGermlineSingleSample {
  input {
    SampleAndUnmappedBams sample_and_unmapped_bams
    DNASeqSingleSampleReferences references
    DragmapReference? dragmap_reference
    PapiSettings papi_settings
  }

  call ToBam.UnmappedBamToAlignedBam {
    input:
      sample_and_unmapped_bams = sample_and_unmapped_bams,
      references = references,
      dragmap_reference = dragmap_reference,
      papi_settings = papi_settings,

      contamination_sites_ud = references.contamination_sites_ud,
      contamination_sites_bed = references.contamination_sites_bed,
      contamination_sites_mu = references.contamination_sites_mu
  }
}
```

In this example, the structs are imported from a separate WDL script, `DNASeqStructs.wdl`, which is shown below.

```wdl
version 1.0

struct SampleAndUnmappedBams {
  String base_file_name
  String? final_gvcf_base_name
  Array[File] flowcell_unmapped_bams
  String sample_name
  String unmapped_bam_suffix
}

struct DragmapReference {
  File reference_bin
  File hash_table_cfg_bin
  File hash_table_cmp
}

struct DNASeqSingleSampleReferences {
  File contamination_sites_ud
  File contamination_sites_bed
  File contamination_sites_mu
  File calling_interval_list

  ReferenceFasta reference_fasta

  Array[File] known_indels_sites_vcfs
  Array[File] known_indels_sites_indices

  File dbsnp_vcf
  File dbsnp_vcf_index

  File evaluation_interval_list

  File haplotype_database_file
}

struct PapiSettings {
  Int preemptible_tries
  Int agg_preemptible_tries
}
```

## Resources

- [Struct definition](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md#struct-definition)
- [WDL 1.0 spec](https://github.com/openwdl/wdl/blob/main/versions/1.0/SPEC.md)
- WGS pipeline [code](https://github.com/broadinstitute/warp/blob/master/pipelines/broad/dna_seq/germline/single_sample/wgs/WholeGenomeGermlineSingleSample.wdl) and [documentation](https://broadinstitute.github.io/warp/docs/Pipelines/Whole_Genome_Germline_Single_Sample_Pipeline/README)