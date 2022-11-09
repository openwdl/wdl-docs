# Branch and merge
This documentation is in the process of being updated. In the meantime, you may find that some GATK commands are out of date, or that the WDL information is incomplete. If you encounter any issues you can't solve, please let us know.

The ability to connect outputs to inputs described in Linear Chaining and Multi-in/out, which relies on hierarchical naming, can be further extended to direct a task's outputs to separate paths, do something with them, then merge the branching paths back together.

Here you can see that the output of stepA feeds into both stepB and stepC to produce different outputs, which we then feed together into stepD.

call stepB { input: in=stepA.out }
call stepC { input: in=stepA.out }
call stepD { input: in1=stepC.out, in2=stepB.out }

Generic example script

This workflow with all its pieces together looks as follows:

workflow BranchAndMerge {
  
  File firstInput

  call stepA { input: in=firstInput }
  call stepB { input: in=stepA.out }
  call stepC { input: in=stepA.out }
  call stepD { input: in1=stepC.out, in2=stepB.out }
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

task stepD {

  File in1
  File in2

  command { programD I1=${in1} I2=${in2} O=outputD.ext }
  output { File out = "outputD.ext" }
}

Concrete example

The branch and merge plumbing is used in the variant discovery part of the GATK pipeline. After variant calling you have a VCF which then needs to be filtered. In order to do that, we separate the SNPs from the Indels as each require different filters to be applied. After filtering, we combine the files back to one VCF.

To see this concept in practice, we have defined four tasks:

splitVcfs takes in a File VCF and outputs a File snpOut and a File indelOut.
FilterSNP takes in a File VCF, applies SNP filters, then produces a File filteredVCF.
FilterIndel takes in a File VCF, applies Indel filters, then produces a File filteredVCF.
CombineVariants takes in a File VCF1 and a File VCF2, producing a File VCF.
Concrete example script

The workflow described by flow diagram above would look like so:

workflow BranchAndMergeExample {

  File originalBAM

  call splitVcfs { input: VCF=originalBAM }
  call FilterSNP { input: VCF=splitVcfs.snpOut }
  call FilterIndel { input: VCF=splitVcfs.indelOut }
  call CombineVariants { input: VCF1=FilterSNP.filteredVCF, VCF2=FilterIndel.filteredVCF }
}

task splitVcfs {

  File VCF

  command {
    java -jar picard.jar SplitVcfs \
        I=${VCF} \
        SNP_OUTPUT=snp.vcf \
        INDEL_OUTPUT=indel.vcf
  }
  output {
    File snpOut = "snp.vcf"
    File indelOut = "indel.vcf"
  }
}

task FilterSNP {

  File VCF

  command {
    java -jar GenomeAnalysisTK.jar \
        -T VariantFiltration \
        -R reference.fasta \
        -V ${VCF} \
        --filterExpression "QD < 2.0 || FS > 60.0 || MQ < 40.0 || MQRankSum < -12.5 || ReadPosRankSum < -8.0" \
        --filterName "snp_filter" \
        -o filteredSNP.vcf
  }
  output {
    File filteredVCF = "filteredSNP.vcf"
  }
}

task FilterIndel {

  File VCF

  command {
    java -jar GenomeAnalysisTK.jar \
        -T VariantFiltration \
        -R reference.fasta \
        -V ${VCF} \
        --filterExpression "QD < 2.0 || FS > 200.0 || ReadPosRankSum <-20.0" \
        --filterName "indel_filter" \
        -o filteredIndel.vcf</samp>
  }
  output {
    File filteredVCF = "filteredIndel.vcf"
  }
}

task CombineVariants {

  File VCF1
  File VCF2
  
  command {
    java -jar GenomeAnalysisTK.jar \
        -T CombineVariants \
        -R reference.fasta \
        -V ${VCF1} \
        -V ${VCF2} \
        --genotypemergeoption UNSORTED \
        -o combined.vcf
  }
  output {
    File VCF = "combined.vcf"
  }
}


Note that here for simplicity we omitted the handling of index files, which has to be done explicitly in WDL. For examples of how to do that, see the Tutorials and Real Workflows.