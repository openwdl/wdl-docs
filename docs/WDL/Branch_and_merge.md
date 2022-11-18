# Branch and merge
The ability to connect outputs to inputs described in [Linear Chaining](Linear_chaining.md) and [Multi-in/out](MultiInput_MultiOutput.md), which relies on `hierarchical` naming, can be further extended to direct a task's outputs to separate paths, do something with them, then merge the branching paths back together.

![Diagram depicting input running through a process called StepA which produces an output. The output is then used as input into two separate processes running in parallel: StepB and StepC. The outputs of these parallel steps are then used as input into a process StepD.](../Images/branch_merge.png)

In the diagram above, you can see that the output of `stepA` feeds into both `stepB` and `stepC` to produce different outputs, which we then feed together into `stepD`.
```wdl
version 1.0
call stepB { 
  input: 
    in = stepA.out 
}
call stepC { 
  input: 
    in = stepA.out 
}
call stepD { 
  input: 
    in1 = stepC.out, 
    in2 = stepB.out 
}
```
## Generic example script

This workflow with all its pieces together looks as follows:

```wdl
version 1.0
workflow BranchAndMerge {
  input {
    File firstInput
  }
  
  call stepA { 
    input: 
      in = firstInput 
  }
  call stepB { 
    input: 
      in = stepA.out 
  }
  call stepC { 
    input: 
      in = stepA.out 
  }
  call stepD { 
    input: 
      in1 = stepC.out, 
      in2 = stepB.out 
  }
}

task stepA {
  input {
    File in
  }
  command <<<
    programA I =~{in} O=outputA.ext 
  >>>
  output { 
    File out = "outputA.ext" 
  }
}

task stepB {
  input {
   File in
  }
  command <<<
    programB I=~{in} O=outputB.ext 
  >>>
  output { 
    File out = "outputB.ext" 
  }
}

task stepC {
  input {
    File in
  }
  command <<<
    programC I=~{in} O=outputC.ext 
  >>>
  output { 
    File out = "outputC.ext" 
  }
}

task stepD {
  input {
    File in1
    File in2
  }

  command <<<
    programD I1=~{in1} I2=~{in2} O=outputD.ext 
  >>>
  output { 
    File out = "outputD.ext" 
  }
}
```
## Concrete example

The branch and merge plumbing is used in the variant discovery part of the GATK pipeline. After variant calling you have a VCF which then needs to be filtered. In order to do that, we separate the SNPs from the Indels as each require different filters to be applied. After filtering, we combine the files back to one VCF.

![Diagram depicting example workflow that uses branching. First, VCFs are used as input to the process splitVCFs resulting in a VCF containing SNPs and a VCF containing Indels. The VCF containing SNPs is then run through a process called FilerSNPS, whereas the output VCF containing Indels is run through a paralllel process called FilterIndels. The two resulting VCFs are then used as input to a process called CombineVariants which produces one final VCF output.](../Images/concrete_branch.png)

To see this concept in practice, we have defined four tasks:

* **splitVcfs** takes in a `File VCF` and outputs a `File snpOut` and a `File indelOut`.
* **FilterSNP** takes in a `File VCF`, applies SNP filters, then produces a `File filteredVCF`.
* **FilterIndel** takes in a `File VCF`, applies Indel filters, then produces a `File filteredVCF`.
* **CombineVariants** takes in a `File VCF1` and a `File VCF2`, producing a `File VCF`.

## Concrete example script

The workflow described by flow diagram above would look like the following example code:
```wdl
version 1.0
workflow BranchAndMergeExample {
  input {
    File originalBAM
  }
  call splitVcfs { 
    input: 
      VCF = originalBAM 
  }
  call FilterSNP { 
    input: 
      VCF = splitVcfs.snpOut 
  }
  call FilterIndel { 
    input: 
      VCF = splitVcfs.indelOut 
  }
  call CombineVariants { 
    input: 
      VCF1 = FilterSNP.filteredVCF, 
      VCF2 = FilterIndel.filteredVCF 
  }
}

task splitVcfs {
  input {
    File VCF
  }
  command <<<
    java -jar picard.jar SplitVcfs \
        I=~{VCF} \
        SNP_OUTPUT=snp.vcf \
        INDEL_OUTPUT=indel.vcf
  >>>
  output {
    File snpOut = "snp.vcf"
    File indelOut = "indel.vcf"
  }
}

task FilterSNP {
  input {
    File VCF
  }
  command <<<
    java -jar GenomeAnalysisTK.jar \
        -T VariantFiltration \
        -R reference.fasta \
        -V ~{VCF} \
        --filterExpression "QD < 2.0 || FS > 60.0 || MQ < 40.0 || MQRankSum < -12.5 || ReadPosRankSum < -8.0" \
        --filterName "snp_filter" \
        -o filteredSNP.vcf
  >>>
  output {
    File filteredVCF = "filteredSNP.vcf"
  }
}

task FilterIndel {
  input {
    File VCF
  }
  command <<<
    java -jar GenomeAnalysisTK.jar \
        -T VariantFiltration \
        -R reference.fasta \
        -V ~{VCF} \
        --filterExpression "QD < 2.0 || FS > 200.0 || ReadPosRankSum <-20.0" \
        --filterName "indel_filter" \
        -o filteredIndel.vcf</samp>
  >>>
  output {
    File filteredVCF = "filteredIndel.vcf"
  }
}

task CombineVariants {
  input{
    File VCF1
    File VCF2
  }
  command <<<
    java -jar GenomeAnalysisTK.jar \
        -T CombineVariants \
        -R reference.fasta \
        -V ~{VCF1} \
        -V ~{VCF2} \
        --genotypemergeoption UNSORTED \
        -o combined.vcf
  >>>
  output {
    File VCF = "combined.vcf"
  }
}
```
