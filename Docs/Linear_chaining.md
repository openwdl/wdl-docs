# Linear chaining
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

The simplest way to chain tasks together in a workflow is a linear chain, where we feed the output of one task to the input of the next, like so:

This is easy to do because WDL allows us to refer to the output of any task (declared appropriately in the task's output block) within the call statement of another task (and indeed, anywhere else in the workflow block), using the syntax task_name.output_variable. So here, we simply specify in the call to stepB that we want it to use stepA.out as the value of the input variable in, and it's the same rule for stepC.

  call stepB { input: in=stepA.out }
  call stepC { input: in=stepB.out }


This relies on a principle called hierarchical naming that allows us to identify components by their parentage.

Generic example script

To put this in context, here is what the code for the workflow illustrated above would look like in full:

workflow LinearChain {
  File firstInput
  call stepA { input: in=firstInput }
  call stepB { input: in=stepA.out }
  call stepC { input: in=stepB.out }
}

task stepA {
  File in
  command { programA I=${in} O=outputA.ext }
  output { File out = "outputA.ext" }
}

task stepB {
  File in
  command { programB I=${in} O=outputB.ext }
  output { File out = "outputB.ext" }
}

task stepC {
  File in
  command { programC I=${in} O=outputC.ext }
  output { File out = "outputC.ext" }
}

Concrete example

Let’s look at a concrete example of linear chaining in a workflow designed to pre-process some DNA sequencing data (MarkDuplicates), perform an analysis on the pre-processed data (HaplotypeCaller), then subset the results of the analysis (SelectVariants).

The workflow involves three tasks:

MarkDuplicates takes in a File bamFile and produces a File metrics and a File dedupBAM.
HaplotypeCaller takes in a File bamFile and produces a File rawVCF.
SelectVariants takes in a File VCF and a String type to specify whether to select INDELs or SNPs. It produces a File subsetVCF, containing only variants of the specified type.
Concrete example script

This is what the code for the workflow illustrated above would look like:

workflow LinearChainExample {
  File originalBAM
  call MarkDuplicates { input: bamFile=originalBAM }
  call HaplotypeCaller { input: bamFile=MarkDuplicates.dedupBam }
  call SelectVariants { input: VCF=HaplotypeCaller.rawVCF, type="INDEL" }
}

task MarkDuplicates {
  File bamFile
  command {
    java -jar picard.jar MarkDuplicates \
    I=${bamFile} O=dedupped.bam M= dedupped.metrics
  }
  output {
    File dedupBam = "dedupped.bam"
    File metrics = "dedupped.metrics"
  }
}

task HaplotypeCaller {
  File bamFile
  command {
    java -jar GenomeAnalysisTK.jar \
      -T HaplotypeCaller \
      -R reference.fasta \
      -I ${bamFile} \
      -o rawVariants.vcf
  }
  output {
    File rawVCF = "rawVariants.vcf"
  }
}

task SelectVariants {
  File VCF
  String type
  command {
    java -jar GenomeAnalysisTK.jar \
      -T SelectVariants \
      -R reference.fasta \
      -V ${VCF} \
      --variantType ${type} \
      -o rawIndels.vcf
  }
  output {
    File subsetVCF = "rawIndels.vcf"
  }
}


Note that here for simplicity we omitted the handling of index files, which has to be done explicitly in WDL. For examples of how to do that, see the Tutorials.