# Task aliasing

Occasionally, you will need to call the same task multiple times within the same
workflow. For example, you might need to run the same variant caller between two samples
to determine the variants that are unique to one. Another interesting use case might be
to run the same variant caller on the same sample with different parameters to examine
the differences. In these cases, you'll want to reach for **task aliasing** to ensure
that the names for each `call` remain unique.

![A diagram showing three steps: `stepA`, `stepB`, and `stepC`. `stepA` is run twice
with aliases `first` and `second`: both of these instances take one input from
(`sampleA` and `sampleB` respectively) and produce a single output (`out`). `taskB`
takes one input (`in`) that is connected to `out` from `first`. `taskC`
takes one input (`in`) that is connected to `out` from `second`. Both `taskB` and
`taskC` produce a single output (`out`). In this way, the utility of aliasing multiple
`call`s of the same task is demonstrated.](header.png)

This often takes a form similar to the following example.

```wdl
# ... task definitions ...

workflow run {
    # `taskA` is run twice—this is enabled using task aliasing.
    call stepA as first {}
    call stepA as second {}

    # `taskB` takes in the output from the `first` task.
    call stepB { input: in = first.out }

    # `taskC` takes in the output from the `second` task.
    call stepC { input: in = second.out }
}
```

[gVCFs]:
    https://gatk.broadinstitute.org/hc/en-us/articles/360035531812-GVCF-Genomic-Variant-Call-Format
[joint genotyping step]:
    https://gatk.broadinstitute.org/hc/en-us/articles/360037057852-GenotypeGVCFs
