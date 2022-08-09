# Scatter-gather parallelism
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

Parallelism is a way to make a program finish faster by performing several operations in parallel, rather than sequentially (i.e. waiting for each operation to finish before starting the next one). For a more detailed introduction on parallelism, you can read about it in-depth here.

To do this, we use the scatter function from the WDL standard library, which will produce parallelizable jobs running the same task on each input in an array, and output the results as an array as well.

Array[File] inputFiles

  scatter (oneFile in inputFiles) {
    call stepA { input: in=oneFile }
  }
  call stepB { input: files=stepA.out }


The magic here is that the array of outputs is produced and passed along to the next task without you ever making an explicit declaration about it being an array. Even though the output of stepA looks like a single file based on its declaration, just referring to stepA.out in any other call statement is sufficient for WDL to know that you mean the array grouping the outputs of all the parallelized stepA jobs.

In other words, the scatter part of the process is explicit while the gather part is implicit.

Generic example script

To put this in context, here is what the code for the workflow illustrated above would look like in full:

workflow ScatterGather {

  Array[File] inputFiles

  scatter (oneFile in inputFiles) {
    call stepA { input: in=oneFile }
  }
  call stepB { input: files=stepA.out }
}

task stepA {

  File in

  command { programA I=${in} O=outputA.ext }
  output { File out = "outputA.ext" }
}

task stepB {

  Array[File] files

  command { programB I=${files} O=outputB.ext }
  output { File out = "outputB.ext" }
}

Concrete example

Let’s look at a concrete example of scatter-gather parallelism in a workflow designed to call variants individually per-sample (HaplotypeCaller), then perform joint genotyping on all the per-sample GVCFs together (GenotypeGVCFs).

The workflow involves two tasks:

HaplotypeCallerERC takes in a File bamFile and produces a File GVCF.
GenotypeGVCFs takes in an Array[File] GVCF and produces a File rawVCF.
Concrete example script

This is what the code for the workflow illustrated above would look like:

workflow ScatterGatherExample {

  Array[File] sampleBAMs

  scatter (sample in sampleBAMs) {
    call HaplotypeCallerERC { input: bamFile=sample }
  }
  call GenotypeGVCF { input: GVCFs=HaplotypeCallerERC.GVCF }
}

task HaplotypeCallerERC {

  File bamFile

  command {
    java -jar GenomeAnalysisTK.jar \
        -T HaplotypeCaller \
        -ERC GVCF \
        -R reference.fasta \
        -I ${bamFile} \
        -o rawLikelihoods.gvcf
  }
  output {
    File GVCF = "rawLikelihoods.gvcf"
  }
}

task GenotypeGVCF {

  Array[File] GVCFs

  command {
    java -jar GenomeAnalysisTK.jar \
        -T GenotypeGVCFs \
        -R reference.fasta \
        -V ${GVCFs} \
        -o rawVariants.vcf
  }
  output {
    File rawVCF = "rawVariants.vcf"
  }
}


Note that here for simplicity we omitted the handling of index files, which has to be done explicitly in WDL. For examples of how to do that, see the Tutorials.

Additionally, please note that we did not expressly handle delimiters for Array data types in this example. To learn explicitly about how to specify the ${GVCFs} input, please see this tutorial.

Scatter limitations

Note that the max allowable scatter width per scatter in Terra is 35,000.