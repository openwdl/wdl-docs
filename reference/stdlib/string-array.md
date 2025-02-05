# String Array Functions

- [`prefix`](#prefix)
- [`suffix`](#suffix)
- [`quote`](#quote)
- [`squote`](#squote)
- [`sep`](#sep)

## `prefix`

Adds a prefix to each element of the input array of primitive values. Equivalent to
evaluating `"~{prefix}~{array[i]}"` for each `i` in `range(length(array))`.

**Signatures**

```wdl
Array[String] prefix(String, Array[P])
```

**Parameters**

1. **`String`**: The prefix to prepend to each element in the array.
2. **`Array[P]`**: Array with a primitive element type.

**Returns**

1. An `Array[String]` with the prefixed elements of the input array.

**Example**

```wdl
Array[String] names = ["John", "Jane", "world"]
String greetings = prefix("Hello, ", names)
# `greetings` now contains `["Hello, John", "Hello, Jane", "Hello, world"]`.
```

## `suffix`

Adds a suffix to each element of the input array of primitive values. Equivalent to
evaluating `"~{array[i]}~{suffix}"` for each `i` in `range(length(array))`.

**Signatures**

```wdl
Array[String] suffix(String, Array[P])
```

**Parameters**

1. **`String`**: The suffix to append to each element in the array.
2. **`Array[P]`**: Array with a primitive element type.

**Returns**

1. An `Array[String]` the suffixed elements of the input array.

**Example**

```wdl
Array[String] names = ["John", "Jane"]
String responses = suffix(" says 'hi!'", names)
# `responses` now contains `["John says 'hi!'", "Jane says 'hi!'"]`.
```

## `quote`

Adds double-quotes (`"`) around each element of the input array of primitive values.
Equivalent to evaluating `'"~{array[i]}"'` for each `i` in `range(length(array))`.

**Signatures**

```wdl
Array[String] quote(Array[P])
```

**Parameters**

1. **`Array[P]`**: Array with a primitive element type.

**Returns**

1. An `Array[String]` the double-quoted elements of the input array.

**Example**

```wdl
Array[String] numbers = [1, 2, 3]
String quoted = quote(numbers)
# `quoted` now contains `["\"1\"", "\"2\"", "\"3\""]`.
```

## `squote`

Adds single-quotes (`'`) around each element of the input array of primitive values.
Equivalent to evaluating `"'~{array[i]}'"` for each `i` in `range(length(array))`.

**Signatures**

```wdl
Array[String] squote(Array[P])
```

**Parameters**

1. **`Array[P]`**: Array with a primitive element type.

**Returns**

1. An `Array[String]` the single-quoted elements of the input array.

**Example**

```wdl
Array[String] numbers = [1, 2, 3]
String quoted = squote(numbers)
# `quoted` now contains `["'1'", "'2'", "'3'"]`.
```

## `sep`

Concatenates the elements of an array together into a string with the given separator
between consecutive elements. There are always `N-1` separators in the output string,
where `N` is the length of the input array. A separator is never added after the last
element. Returns an empty string if the array is empty.

**Signatures**

```wdl
String sep(String, Array[P])
```

**Parameters**

1. `String`: Separator string. 
2. `Array[P]`: Array of strings to concatenate.

**Returns**

1. A `String` with the concatenated elements of the array delimited by the separator
   string.

**Example**

```wdl
Array[String] letters = ["a", "b", "c", "d"]
String letters_with_commas = sep(", ", letters)
# `letters_with_commas` now contains `"a, b, c, d"`.
```
