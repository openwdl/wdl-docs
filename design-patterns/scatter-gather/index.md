# Scatter-gather

Scatter-gather is a paradigm of parallel computing whereby a computation is split into
smaller, independent pieces, those pieces "scattered" across multiple, parallel
executions, and the results each execution is "gathered" into a single result. This is
incredibly useful when attempting to optimize the speed of computations that don't
depend on one another. Some examples of this design pattern in practice include (a)
scattering of a complex analysis for a single sample across multiple, independent
chromosomes and merging the results together or (b) scattering the generation of
independent [gVCFs] from multiple samples, followed by a gathering [joint genotyping
step] employed by the GATK.

![A diagram showing two steps: `stepA` and `stepB`. Multiple instances of `stepA` are
called—one instance for each input file. Each of these produces an output (`out`).
`stepB` is then called once accepting all of these `out` from each `stepA` call and
combining the results. This, in essence, is the power of the scatter-gather
paradigm.](header.png)

This often takes a form similar to the following example.

```wdl
# ... task definitions ...

workflow run {
  inputs {
    Array[File] files
  }

  # Perform `stepA` for each of the inputs in parallel (scatter).
  scatter(file in files) {
    call stepA { input: in = file }
  }

  # Collect the results from the scatter (gather).
  #
  # Note that the outputs from `stepA` are automatically coerced
  # into an `Array` that you can pass in elsewhere.
  call stepB { input: files = stepA.output }
}
```

[gVCFs]:
    https://gatk.broadinstitute.org/hc/en-us/articles/360035531812-GVCF-Genomic-Variant-Call-Format
[joint genotyping step]:
    https://gatk.broadinstitute.org/hc/en-us/articles/360037057852-GenotypeGVCFs
