# String Functions

- [`find`](#find) <Badge type="tip" text="v1.2" />
- [`matches`](#matches) <Badge type="tip" text="v1.2" />
- [`sub`](#sub)

## `find` <Badge type="tip" text="Requires WDL v1.2" />

Given two `String` parameters `input` and `pattern`, searches for the occurrence of
`pattern` within `input` and returns the first match or `None` if there are no matches.
`pattern` is a [regular expression](https://en.wikipedia.org/wiki/Regular_expression)
and is evaluated as a [POSIX Extended Regular Expression
(ERE)](https://en.wikipedia.org/wiki/Regular_expression#POSIX_basic_and_extended).


Note that regular expressions are written using regular WDL strings, so backslash
characters need to be double-escaped. For example:

```wdl
String? first_match = find("hello\tBob", "\\t")
```

**Signatures**

```wdl
String? find(String, String)
```

**Parameters**

1. **`String`**: the input string to search.
2. **`String`**: the pattern to search for.

**Returns**

1. The contents of the first match, or `None` if `pattern` does not match `input`.

**Example**

```wdl
String? match = find("Hello, world!", "e..o");
# `match` now contains `ello`.
```

## `matches` <Badge type="tip" text="Requires WDL v1.2" />

Given two `String` parameters `input` and `pattern`, tests whether `pattern` matches
`input` at least once. `pattern` is a [regular
expression](https://en.wikipedia.org/wiki/Regular_expression) and is evaluated as a
[POSIX Extended Regular Expression
(ERE)](https://en.wikipedia.org/wiki/Regular_expression#POSIX_basic_and_extended).

To test whether `pattern` matches the entire `input`, make sure to begin and end the
pattern with anchors. For example:

```wdl
Boolean full_match = matches("abc123", "^a.+3$")
```

Note that regular expressions are written using regular WDL strings, so backslash
characters need to be double-escaped. For example:

```wdl
Boolean has_tab = matches("hello\tBob", "\\t")
```

**Signatures**

```wdl
Boolean matches(String, String)
```

**Parameters**

1. **`String`**: the input string to search.
2. **`String`**: the pattern to search for.

**Returns**

1. `true` if `pattern` matches `input` at least once, otherwise `false`.

**Example**

```wdl
Boolean matches = matches("sample1234_R1.fastq", "_R1");
# `matches` now contains `true`.
```

## `sub`

Given three String parameters `input`, `pattern`, `replace`, this function replaces all
non-overlapping occurrences of `pattern` in `input` by `replace`. `pattern` is a
[regular expression](https://en.wikipedia.org/wiki/Regular_expression) and is evaluated
as a [POSIX Extended Regular Expression
(ERE)](https://en.wikipedia.org/wiki/Regular_expression#POSIX_basic_and_extended).
Regular expressions are written using regular WDL strings, so backslash characters need
to be double-escaped (e.g., `"\\t"`).


**Signatures**

```wdl
String sub(String, String, String)
```

**Parameters**

1. **`String`**: the input string.
2. **`String`**: the pattern to search for.
3. **`String`**: the replacement string.

**Returns**

1. the input string, with all occurrences of the pattern replaced by the replacement
   string.

**Example**

```wdl
String chocolike = "I like chocolate when\nit's late"
String chocolove = sub(chocolike, "like", "love") #

# `chocolove` now contains `"I love chocolate when\nit's late"`.
```
