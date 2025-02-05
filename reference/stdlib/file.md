# File Functions

- [`basename`](#basename)
- [`join_paths`](#join-paths) <Badge type="tip" text="v1.2" />
- [`glob`](#glob)
- [`size`](#size)
- [`stdout`](#stdout)
- [`stderr`](#stderr)
- [`read_string`](#read-string)
- [`read_int`](#read-int)
- [`read_float`](#read-float)
- [`read_boolean`](#read-boolean)
- [`read_lines`](#read-lines)
- [`write_lines`](#write-lines)
- [`read_tsv`](#read-tsv)
- [`write_tsv`](#write-tsv)
- [`read_map`](#read-map)
- [`write_map`](#write-map)
- [`read_json`](#read-json)
- [`write_json`](#write-json)
- [`read_object`](#read-object)
- [`read_objects`](#read-objects)
- [`write_object`](#write-object)
- [`write_objects`](#write-objects)

## `basename`

Returns the "basename" of a file or directory - the name after the last directory
separator in the path.

The optional second parameter specifies a literal suffix to remove from the file name.
If the file name does not end with the specified suffix then it is ignored.

**Signatures**

```wdl
String basename(File, [String])
String basename(Directory, [String])
```

**Parameters**

1. **`File|Directory`**: Path of the file or directory to read. If the argument is a
   `String`, it is assumed to be a local file path relative to the current working
   directory of the task.
2. **`String`**: (Optional) Suffix to remove from the file name.

**Returns**

1.  The file's basename as a `String`.

**Example**

```wdl
String bn = basename("/path/to/file.txt")
# `bn` contains `"file.txt"`.

String bn = basename("/path/to/file.txt", ".txt")
# `bn` contains `"file"`.
```

## `join_paths` <Badge type="tip" text="Requires WDL v1.2" />

Joins together two or more paths into an absolute path in the host filesystem.

There are three variants of this function:

1. `File join_paths(File, String)`: Joins together exactly two paths. The first path may
   be either absolute or relative and must specify a directory; the second path is
   relative to the first path and may specify a file or directory.
2. `File join_paths(File, Array[String]+)`: Joins together any number of relative paths
   with a base path. The first argument may be either an absolute or a relative path and
   must specify a directory. The paths in the second array argument must all be
   relative. The *last* element may specify a file or directory; all other elements must
   specify a directory.
3. `File join_paths(Array[String]+)`: Joins together any number of paths. The array must
   not be empty. The *first* element of the array may be either absolute or relative;
   subsequent path(s) must be relative. The *last* element may specify a file or
   directory; all other elements must specify a directory.

An absolute path starts with `/` and indicates that the path is relative to the root of
the environment in which the task is executed. Only the first path may be absolute. If
any subsequent paths are absolute, it is an error.

A relative path does not start with `/` and indicates the path is relative to its parent
directory. It is up to the execution engine to determine which directory to use as the
parent when resolving relative paths; by default it is the working directory in which
the task is executed.

**Signatures**

```wdl
File join_paths(File, String)
File join_paths(File, Array[String]+)
File join_paths(Array[String]+)
```

**Parameters**

1. **`File|Array[String]+`**: Either a path or an array of paths.
2. **`String|Array[String]+`**: A relative path or paths; only allowed if the first
   argument is a `File`.

**Returns**

1. A `File` representing an absolute path that results from joining all the paths in
   order (left-to-right), and resolving the resulting path against the default parent
   directory if it is relative.

**Example**

```wdl
File path = join_paths(["/usr", "bin", "env"])
# `path` points to `/usr/bin/env`.
```

## `glob`

Returns the Bash expansion of the [glob
string](https://en.wikipedia.org/wiki/Glob_(programming)) relative to the task's
execution directory, and in the same order.

`glob` finds all of the files (but not the directories) in the same order as would be
matched by running `echo <glob>` in Bash from the task's execution directory.

At least in standard Bash, glob expressions are not evaluated recursively, i.e., files
in nested directories are not included.

**Signatures**

```wdl
Array[File] glob(String)
```

**Parameters**

1. **`String`**: The glob string.

**Returns**

1. An array of all files matched by the glob.

**Example**

```wdl
Array<File> paths = glob("*.py")
# `paths` contains all files with the `.py` extension in the current directory.
```

## `size`

Determines the size of a file, directory, or the sum total sizes of the
files/directories contained within a compound value. The files may be optional values;
`None` values have a size of `0.0`. By default, the size is returned in bytes unless the
optional second argument is specified with a [unit](#units-of-storage)

In the second variant of the `size` function, the parameter type `X` represents any
compound type that contains `File` or `File?` nested at any depth.

If the size cannot be represented in the specified unit because the resulting value is
too large to fit in a `Float`, an error is raised. It is recommended to use a unit that
will always be large enough to handle any expected inputs without numerical overflow.

**Signatures**

```wdl
Float size(File|File?, [String])
Float size(Directory|Directory?, [String])
Float size(X|X?, [String])
```

**Parameters**

1. **`File|File?|Directory|Directory?|X|X?`**: A file, directory, or a compound value
   containing files/directories, for which to determine the size.
2. **`String`**: (Optional) The unit of storage; defaults to 'B'.

**Returns**

1. The size of the files/directories as a `Float`.

**Example**

```wdl
Float size = size("foo.txt")
# `size` contains the size of `foo.txt`.
```

## `stdout`

Returns the value of the executed command's standard output (stdout) as a `File`. The
engine should give the file a random name and write it in a temporary directory, so as
not to conflict with any other task output files.

**Signatures**

```wdl
File stdout()
```

**Parameters**

_None._

**Returns**

1. A `File` whose contents are the stdout generated by the command of the task where the
   function is called.

**Example**

```wdl
String message = read_string(stdout())
# `message` contains the output of the process's `stdout`.
```

## `stderr`

Returns the value of the executed command's standard error (stderr) as a `File`. The
file should be given a random name and written in a temporary directory, so as not to
conflict with any other task output files.


**Signatures**

```wdl
File stderr()
```

**Parameters**

_None._

**Returns**

1. A `File` whose contents are the stderr generated by the command of the task where the
   function is called.

**Example**

```wdl
String message = read_string(stderr())
# `message` contains the output of the process's `stderr`.
```

## `read_string`

Reads an entire file as a `String`, with any trailing end-of-line characters (`\r` and
`\n`) stripped off. If the file is empty, an empty string is returned.

If the file contains any internal newline characters, they are left in tact.

**Signatures**

```wdl
String read_string(File)
```

**Parameters**

1. **`File`**: Path of the file to read.

**Returns**

1. A `String`.

**Example**

```wdl
String message = read_string(stdout())
# `message` contains the output of the process's `stdout`.
```

## `read_int`

Reads a file that contains a single line containing only an integer and (optional)
whitespace. If the line contains a valid integer, that value is returned as an `Int`. If
the file is empty or does not contain a single integer, an error is raised.

**Signatures**

```wdl
Int read_int(File)
```

**Parameters**

1. **`File`**: Path of the file to read.

**Returns**

1. An `Int`.

**Example**

```wdl
Int number = read_int(stdout())
# If `stdout` contains an int, returns the int. Else, an error is raised.
```

## `read_float`

Reads a file that contains only a numeric value and (optional) whitespace. If the line
contains a valid floating point number, that value is returned as a `Float`. If the file
is empty or does not contain a single float, an error is raised.

**Signatures**

```wdl
Float read_float(File)
```

**Parameters**

1. **`File`**: Path of the file to read.

**Returns**

1. A `Float`.

**Example**

```wdl
Float number = read_float(stdout())
# If `stdout` contains a float, returns the float. Else, an error is raised.
```

## `read_boolean`

Reads a file that contains a single line containing only a boolean value and (optional)
whitespace. If the non-whitespace content of the line is "true" or "false", that value
is returned as a `Boolean`. If the file is empty or does not contain a single boolean,
an error is raised. The comparison is case- and whitespace-insensitive.

**Signatures**

```wdl
Boolean read_boolean(File)
```

**Parameters**

1. **`File`**: Path of the file to read.

**Returns**

1. A `Boolean`.

**Example**

```wdl
Boolean value = read_float(stdout())
# If `stdout` contains a boolean, returns the boolean. Else, an error is raised.
```

## `read_lines`

Reads each line of a file as a `String`, and returns all lines in the file as an
`Array[String]`. Trailing end-of-line characters (`\r` and `\n`) are removed from each
line.

The order of the lines in the returned `Array[String]` is the order in which the lines
appear in the file.

If the file is empty, an empty array is returned.

**Signatures**

```wdl
Array[String] read_lines(File)
```

**Parameters**

1. **`File`**: Path of the file to read.

**Returns**

1. An `Array[String]` representation of the lines in the file.

**Example**

```wdl
Array[String] lines = read_lines("foo.txt")
# `lines` contains the newline-delimited lines read from `foo.txt`.
```

## `write_lines`

Writes a file with one line for each element in a `Array[String]`. All lines are
terminated by the newline (`\n`) character (following the [POSIX
standard](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_206)).
If the `Array` is empty, an empty file is written.

**Signatures**

```wdl
File write_lines(Array[String])
```

**Parameters**

1. **`Array[String]`**: Array of strings to write.

**Returns**

1. A `File`.

**Example**

```wdl
Array[String] lines = ["first", "second", "third"]

File result = write_lines(lines)
# `result` now points to a file with the contents `"first\nsecond\nthird"`.
```

## `read_tsv`

Reads a tab-separated value (TSV) file as an `Array[Array[String]]` representing a table
of values. Trailing end-of-line characters (`\r` and `\n`) are removed from each line.

This function has three variants:

1. `Array[Array[String]] read_tsv(File, [false])`: Returns each row of the table as an
   `Array[String]`. There is no requirement that the rows of the table are all the same
   length.
2. `Array[Object] read_tsv(File, true)`: The second parameter must be `true` and
   specifies that the TSV file contains a header line. Each row is returned as an
   `Object` with its keys determined by the header (the first line in the file) and its
   values as `String`s. All rows in the file must be the same length and the field names
   in the header row must be valid `Object` field names, or an error is raised.
3. `Array[Object] read_tsv(File, Boolean, Array[String])`: The second parameter
   specifies whether the TSV file contains a header line, and the third parameter is an
   array of field names that is used to specify the field names to use for the returned
   `Object`s. If the second parameter is `true`, the specified field names override
   those in the file's header (i.e., the header line is ignored).

If the file is empty, an empty array is returned.

If the entire contents of the file can not be read for any reason, the calling task or
workflow fails with an error. Examples of failure include, but are not limited to, not
having access to the file, resource limitations (e.g. memory) when reading the file, and
implementation-imposed file size limits.

**Signatures**

```wdl
Array[Array[String]] read_tsv(File)
Array[Object] read_tsv(File, true)
Array[Object] read_tsv(File, Boolean, Array[String])
```

**Parameters**

1. **`File`**: The TSV file to read.
2. **`Boolean`**: (Optional) Whether to treat the file's first line as a header.
3. **`Array[String]`**: (Optional) An array of field names. If specified, then the
   second parameter is also required.

**Returns**

1. An `Array` of rows in the TSV file, where each row is an `Array[String]` of fields or
   an `Object` with keys determined by the second and third parameters and `String`
   values.

**Example**

```wdl
Array[Object] objects = read_tsv("data.tsv", true)
# `objects` holds an array of objects read in from `data.tsv`.
```

## `write_tsv`

Given an `Array` of elements, writes a tab-separated value (TSV) file with one line for
each element.

There are three variants of this function:

1. `File write_tsv(Array[Array[String]])`: Each element is concatenated using a tab
   ('\t') delimiter and written as a row in the file. There is no header row.

2. `File write_tsv(Array[Array[String]], true, Array[String])`: The second argument must
   be `true` and the third argument provides an `Array` of column names. The column
   names are concatenated to create a header that is written as the first row of the
   file. All elements must be the same length as the header array.

3. `File write_tsv(Array[Struct], [Boolean, [Array[String]]])`: Each element is a struct
   whose field values are concatenated in the order the fields are defined. The optional
   second argument specifies whether to write a header row. If it is `true`, then the
   header is created from the struct field names. If the second argument is `true`, then
   the optional third argument may be used to specify column names to use instead of the
   struct field names.

Each line is terminated by the newline (`\n`) character.

The generated file should be given a random name and written in a temporary directory,
so as not to conflict with any other task output files.

If the entire contents of the file can not be written for any reason, the calling task
or workflow fails with an error. Examples of failure include, but are not limited to,
insufficient disk space to write the file.

**Signatures**

```wdl
File write_tsv(Array[Array[String]]|Array[Struct])
File write_tsv(Array[Array[String]], true, Array[String])
File write_tsv(Array[Struct], Boolean, Array[String])
```

**Parameters**

1. **`Array[Array[String]] | Array[Struct]`**: An array of rows, where each row is either an
   `Array` of column values or a struct whose values are the column values.
2. **`Boolean`**: (Optional) Whether to write a header row.
3. **`Array[String]`**: An array of column names. If the first argument is
   `Array[Array[String]]` and the second argument is `true` then it is required,
   otherwise it is optional. Ignored if the second argument is `false`.

**Returns**

1. A `File`.

**Example**

```wdl
Array[Array[String]] array = [["one", "two", "three"], ["un", "deux", "trois"]]
File result = write_tsv(array)
# `result` points to a file with the content of `array` written as a TSV.
```

## `read_map`

Reads a tab-separated value (TSV) file representing a set of pairs. Each row must have
exactly two columns, e.g., `col1\tcol2`. Trailing end-of-line characters (`\r` and `\n`)
are removed from each line.

Each pair is added to a `Map[String, String]` in order. The values in the first column
must be unique; if there are any duplicate keys, an error is raised.

If the file is empty, an empty map is returned.

**Signatures**

```wdl
Map[String, String] read_map(File)
```

**Parameters**

1. **`File`**: Path of the two-column TSV file to read.

**Returns**

1. A `Map[String, String]`, with one element for each row in the TSV file.

**Example**

```wdl
Map[String, String] result = read_map(stdout())
# `result` contains a map of the values within the two column tab-delimited text
# returned in `stdout`.
```

## `write_map`

Writes a tab-separated value (TSV) file with one line for each element in a `Map[String,
String]`. Each element is concatenated into a single tab-delimited string of the format
`~{key}\t~{value}`. Each line is terminated by the newline (`\n`) character. If the
`Map` is empty, an empty file is written.

Since `Map`s are ordered, the order of the lines in the file is guaranteed to be the
same order that the elements were added to the `Map`.

**Signatures**

```wdl
File write_map(Map[String, String])
```

**Parameters**

1. **`Map[String, String]`**: A `Map`, where each element will be a row in the generated
   file.

**Returns**

1. A `File`.

**Example**

```wdl
Map[String, String] map = {"key1": "value1", "key2": "value2"}
File result = write_map(map)
# `result` points to a file with the contents `"key1\tvalue1\nkey2\tvalue2"`.
```

## `read_json`

Reads a JSON file into a WDL value whose type depends on the file's contents. The
mapping of JSON type to WDL type is:

| JSON Type | WDL Type         |
| --------- | ---------------- |
| object    | `Object`         |
| array     | `Array[X]`       |
| number    | `Int` or `Float` |
| string    | `String`         |
| boolean   | `Boolean`        |
| null      | `None`           |

The return value is of type [`Union`](#union-hidden-type) and must be used in a context
where it can be coerced to the expected type, or an error is raised. For example, if the
JSON file contains `null`, then the return value will be `None`, meaning the value can
only be used in a context where an optional type is expected.

If the JSON file contains an array, then all the elements of the array must be coercible
to the same type, or an error is raised.

The `read_json` function does not have access to any WDL type information, so it cannot
return an instance of a specific `Struct` type. Instead, it returns a generic `Object`
value that must be coerced to the desired `Struct` type.

Note that an empty file is not valid according to the JSON specification, and so calling
`read_json` on an empty file raises an error.

**Signatures**

```wdl
Union read_json(File)
```

**Parameters**

1. **`File`**: Path of the JSON file to read.

**Returns**

1. A value whose type is dependent on the contents of the JSON file.

**Example**

```wdl
struct Person {
  String name
  Int age
}

Person person = read_json(json_file)
# `person` contains a person deserialized from a file.
```

## `write_json`

Writes a JSON file with the serialized form of a WDL value. The following WDL types can
be serialized:

| WDL Type         | JSON Type |
| ---------------- | --------- |
| `Struct`         | object    |
| `Object`         | object    |
| `Map[String, X]` | object    |
| `Array[X]`       | array     |
| `Int`            | number    |
| `Float`          | number    |
| `String`         | string    |
| `File`           | string    |
| `Boolean`        | boolean   |
| `None`           | null      |

When serializing compound types, all nested types must be serializable or an error is
raised.

**Signatures**

```wdl
File write_json(X)
```

**Parameters**

1. **`X`**: A WDL value of a supported type.

**Returns**

1. A `File`.

**Example**

```wdl
struct Person {
    String name
    Int age
}

Array[Person] people = [
    Person {
         name: "Jane Doe",
         age: 29,
    },
    Person {
         name: "John Doe",
         age: 28,
    }
]

File result = write_tsv(people)
# `people` points to a file with the contents `"Jane Doe\t29\nJohn Doe\t28"`.
```

## `read_object`

Reads a tab-separated value (TSV) file representing the names and values of the members
of an `Object`. There must be exactly two rows, and each row must have the same number
of elements, otherwise an error is raised. Trailing end-of-line characters (`\r` and
`\n`) are removed from each line.

The first row specifies the object member names. The names in the first row must be
unique; if there are any duplicate names, an error is raised.

The second row specifies the object member values corresponding to the names in the
first row. All of the `Object`'s values are of type `String`.

**Signatures**

```wdl
Object read_object(File)
```

**Parameters**

1. **`File`**: Path of the two-row TSV file to read.

**Returns**

1. An `Object`, with as many members as there are unique names in the TSV.

**Example**

```wdl
Object object  = read_object(stdout())
# `object` contains an `Object` with the key value pairs from `stdout`.
```

## `read_objects`

Reads a tab-separated value (TSV) file representing the names and values of the members
of any number of `Object`s. Trailing end-of-line characters (`\r` and `\n`) are removed
from each line.

The first line of the file must be a header row with the names of the object members.
The names in the first row must be unique; if there are any duplicate names, an error is
raised.

There are any number of additional rows, where each additional row contains the values
of an object corresponding to the member names. Each row in the file must have the same
number of fields as the header row. All of the `Object`'s values are of type `String`.

If the file is empty or contains only a header line, an empty array is returned.

**Signatures**

```wdl
Array[Object] read_objects(File)
```

**Parameters**

1. **`File`**: Path of the TSV file to read.

**Returns**

1. An `Array[Object]`, with `N-1` elements, where `N` is the number of rows in the file.

**Example**

```wdl
Array[Object] objects = read_objects(stdout())
# `objects` contains an array of `Object`s with the key value pairs provided on each
# line from `stdout`.
```

## `write_object`

Writes a tab-separated value (TSV) file with the contents of a `Object` or `Struct`. The
file contains two tab-delimited lines. The first line is the names of the members, and
the second line is the corresponding values. Each line is terminated by the newline
(`\n`) character. The ordering of the columns is unspecified.

The member values must be serializable to strings, meaning that only primitive types are
supported. Attempting to write a `Struct` or `Object` that has a compound member value
results in an error.

**Signatures**

```wdl
File write_object(Struct|Object)
```

**Parameters**

1. **`Struct|Object`**: An object to write.

**Returns**

1. A `File`.

**Example**

```wdl
struct Person {
    String name
    Int age
}

Person person = Person {
    name: "Jane Doe",
    age: 29,
}

File result = write_object(person)
# `result` points to a file that contains the contents `"name\tage\nJane Doe\t29"`.
```

## `write_objects`

Writes a tab-separated value (TSV) file with the contents of a `Array[Struct]` or
`Array[Object]`. All elements of the `Array` must have the same member names, or an
error is raised.

The file contains `N+1` tab-delimited lines, where `N` is the number of elements in the
`Array`. The first line is the names of the `Struct`/`Object` members, and the
subsequent lines are the corresponding values for each element. Each line is terminated
by a newline (`\n`) character. The lines are written in the same order as the elements
in the `Array`. The ordering of the columns is the same as the order in which the
`Struct`'s members are defined; the column ordering for `Object`s is unspecified. If the
`Array` is empty, an empty file is written.

The member values must be serializable to strings, meaning that only primitive types are
supported. Attempting to write a `Struct` or `Object` that has a compound member value
results in an error.

**Signatures**

```wdl
File write_objects(Array[Struct|Object])
```

**Parameters**

1. **`Array[Struct|Object]`**: An array of objects to write.

**Returns**

1. A `File`.

**Example**

```wdl
struct Person {
    String name
    Int age
}

Array[Person] people = [
    Person {
        name: "Jane Doe",
        age: 29,
    },
    Person {
        name: "John Doe",
        age: 28,
    }
]

File result = write_objects(people)
# `result` points to a file that contains the contents
# `"name\tage\nJane Doe\t29\nJohn Doe\t28"`.
```
