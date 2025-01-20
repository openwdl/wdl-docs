---
outline: deep
---

# Variables

Foundationally, WDL supports the creation and manipulation of variables in your
computation graph. Each variable can have either a _primitive_ type or a _compound_
types. Types may also be _optional_ meaning that they may or may not have a proper value
(i.e., their value is `None`).

### Declarations

Variables are generally created and assigned through **declarations** ([spec
link][spec-declarations]). Briefly, if a variable is assigned to, the declaration is
known as a _bound_ declaration. If the variable is _not_ assigned, the declaration is
known as an _unbound_ declaration.

Bound and unbound declarations may be used in various contexts within WDL as laid out in
the specification. While a complete review of these rules is left to the specification,
a quick example should give a sense of how variables are intended to be declared and
assigned.

```wdl
workflow run {
  # Inputs may have either bound or unbound inputs. Bound inputs
  # represent default values for the variable.
  input {
    # `radius` is defined in an _unbound_ declaration. The value must
    # be supplied by the caller of the workflow.
    Int radius

    # `pi` is defined in a _bound_ declaration. It has a default value
    # of `3.14`, but that value may be overridden by the caller.
    Float pi = 3.14

    # `reference` here is an _optional_ variable. It may be provided
    # by the caller, but it will have `None` as the value otherwise.
    File? reference
  }

  # A private declaration can be declared within a workflow or task,
  # but it must be bound.
  Int three = 1 + 2

  output {
    # Output declarations, such as `six` must also be bound.
    Float six = 2 * three
  }
}
```

### Primitive types

**Primitive types** ([spec link][spec-primitive-types]) are the base types that
variables can take. The specification defines the following primitive types:

* A `Boolean` represents `true` or `false`.
* An `Int` represents a 64-bit signed integer.
* A `Float` represents a 64-bit IEEE-754 floating point number.
* A `String` represents a unicode character string following the format described
  [here][spec-strings].
* A `File` represents a file (or file-like object)
* A `Directory` represents a (possibly nested) directory of files.

### Optional types

Types that have a `?` postfix quantifier are declared as **optional types** ([spec
link][spec-optional-types]), meaning that they can also take the special value of
`None`. This concept is useful if, for example, you have optional inputs to a workflow
or you only produce some output if a particular operation mode is turned on. There are
many facilities to interact with an inspect optional types, such as the [`defined`] and
[`select_first`] standard library functions.

### Compound types

**Compound types** ([spec link][spec-primitive-types]) are higher-order types that
organize other types in useful ways. The specification defines the following compound
types:

* A `Array[X]` represents an ordered list of elements of the same type ([spec
  link][spec-arrays]).
* A `Pair[X, Y]` represents two associated values ([spec link][spec-pairs]) that are
  permitted to have different types.
* A `Map[X, Y]` represents an associative array of key-value pairs ([spec
  link][spec-maps]).
* 🗑 An `Object` represents an unordered associative array of name-value pairs ([spec
  link][spec-maps]). Though valid WDL today, `Object`s are deprecated and are not
  suggested for future use.

[`defined`]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#select_first
[`select_first`]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#select_first
[spec-arrays]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#arrayx
[spec-objects]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#-object 
[spec-maps]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#mapp-y
[spec-pairs]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#pairx-y
[spec-declarations]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#declarations
[spec-optional-types]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#optional-types-and-none
[spec-primitive-types]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#primitive-types
[spec-strings]: https://github.com/openwdl/wdl/blob/wdl-1.2/SPEC.md#strings
