---
outline: [1, 2]
---

# Overview

The Workflow Description Language has a number of **versions** that are
constantly improving. This guide lists all major versions of the language—the
major improvements for each version, common pitfalls when upgrading, and how to
get help.

If you're interested in learning more about how versioning works and how you can
specify the version of your WDL documents, see the [Versioning section] within
the Language Guide.

::: tip
Changes are grouped in terms of their **impact**. The word "impact" here is a
combination of "how important is the change" along with "how many existing WDL
documents are likely to be affected by this change". They are subjective
determinations made by the upgrade guide curator during the curator process, but
they are often helpful in quickly scanning upgrade elements to see which might
apply to your situation.
:::

# WDL v1.2

WDL v1.2 introduces a great deal of new syntax and changes to the specification.
Notably, changes were backwards compatible with all previous `v1.x` releases.
This sections only covers the high points related to upgrading—the full release
notes can be found [here][wdl-v1.2-release-notes].

### Checklist

Use this checklist to ensure you hit all of the sections.

#### Moderate impact changes 

<input type="checkbox" /> New `Directory` type ([link](#new-directory-type)).<br />
<input type="checkbox" /> Replacement of `runtime` section with `requirements` and `hints` sections ([link](#replacement-of-runtime-with-requirements-and-hints)). <br />
<input type="checkbox" /> New standard library functions
([link](#new-standard-library-functions)). <br />
<input type="checkbox" /> Multi-line strings ([link](#multi-line-strings)). <br />
<input type="checkbox" /> Optional `input:` statement ([link](#optional-input-statement)). <br />

#### Low impact changes 

<input type="checkbox" /> Addition of workflow `hints` ([link](#addition-of-workflow-hints)). <br />
<input type="checkbox" /> New requirements and hints keys ([link](#new-requirements-and-hints-keys)). <br />
<input type="checkbox" /> Metadata sections for structs ([link](#metadata-sections-for-structs)). <br />
<input type="checkbox" /> Exponentiation operator ([link](#exponentiation-operator)). <br />

## Moderate impact changes

### New `Directory` type

The `Directory` type was introduced in
[#641](https://github.com/openwdl/wdl/pull/641) to better semantically indicate
the use of a directory. If the intention of any of your arguments is to be used
to refer to a directory on the filesystem, you are encouraged to update the
parameters to a `Directory` type.

### Replacement of section `runtime` with `requirements` and `hints` sections

The `runtime` section, which previously held both requirement contraints and
hints to the execution engine, has now been split into the `requirements`
([#540](https://github.com/openwdl/wdl/issues/540)) section and `hints`
([#541](https://github.com/openwdl/wdl/issues/541)) section respectively. You
should split out these keys based on the definitions in the
specification<sup>[1](https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#-requirements-section),
[2](https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#-hints-section)</sup>.

🗑️ This change deprecates the `runtime` section, which will be removed in WDL
v2.0.

### New standard library functions

The following are new standard library functions and their definitions. You are
encouraged to read throught them and replace any custom functionality that would
now be duplicated in favor of these functions.

- `contains_key`: whether or not a `Map` or `Object` contain a specific member
  ([link](https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#-contains_key)).
- `values`: get the values from a `Map`
  ([link](https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#-values)).
- `find`: search for a regular expression in a string
  ([link](https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#-find)).
- `matches`: whether a string match a regular expression
  ([link](https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#-matches)).
- `chunk`: split an array into sub-arrays
  ([link](https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#-chunk)).
- `join_paths`: join two or more paths
  ([link](https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#-join_paths)).
- `contains`: whether an array contains a specified value
  ([link](https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#-contains)).


### Multi-line strings

Multi-line strings were introduced with the following syntax.

```wdl
String foo = <<<
  my
  multi-line
  string
>>>
```

### Optional `input:` statement

As noted in [#524](https://github.com/openwdl/wdl/pull/524), the `input:`
statement that preceeds call bodies is unnecessary historical boilerplate. This
statement is now optional in `call` bodies. You are encouraged to remove these
from your `call` bodies.

## Low impact changes

### Addition of workflow `hints`

Workflows gained a `hints` section in
[#543](https://github.com/openwdl/wdl/issues/543). You are encouraged to go read
the supported workflow
hints<sup>[1](https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#workflow-hints)</sup>
and apply them to your workflow if any are relevant.

### New requirements and hints keys

- The following keys were added to the task `requirements` section: `fpga`
<sup>[1](https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#hardware-accelerators-gpu-and--fpga)</sup>.
- The following keys were added to the task `hints` section: `disks`
<sup>[1](https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#-disks)</sup>,
`gpu`
<sup>[2](https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#-gpu-and--fpga)</sup>,
and `fpga`
<sup>[2](https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#-gpu-and--fpga)</sup>.

You are encouraged to examine these keys are determine if any of these should be
specified for your tasks.

### Metadata sections for structs

Similarly to tasks and workflows, structs now have `meta` and `parameter_meta`
sections. You are encouraged to use these fields according to the definition in
the
specification<sup>[1](https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#struct-definition)</sup>.

### Exponentiation operator

The exponentiation operator (`**`) was added in this release. You are encouraged
to go and update any manual exponentiation to use this operator instead.

You are encouraged to go read the specification section on this concept
([link](https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#multi-line-strings))
and use them where appropriate.

# Prior WDL versions

Versions of WDL prior to the ones outlined in this guide did not exist at the
time the upgrade guide was created. As such, they are not included in the guide.

[wdl-v1.2-release-notes]: https://github.com/openwdl/wdl/releases/tag/v1.2.0
[Versioning section]: ../language-guide/versions.md
