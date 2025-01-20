# Numeric Functions

- [`floor`](#floor)
- [`ceil`](#ceil)
- [`round`](#round)
- [`min`](#min)
- [`max`](#max)

## `floor`

Rounds a floating point number **down** to the next lowest integer.

**Signatures**

```wdl
Int floor(Float)
```

**Parameters**

1. **`Float`**: the number to round.

**Returns**

1. An integer.

**Example**

```wdl
Int three = floor(3.14)
# `three` now contains `3`.
```

## `ceil`

Rounds a floating point number **up** to the next highest integer.

**Signatures**

```wdl
Int ceil(Float)
```

**Parameters**

1. **`Float`**: the number to round.

**Returns**

1. An integer.

**Example**

```wdl
Int four = ceil(3.14)
# `four` now contains `4`.
```

## `round`

Rounds a floating point number to the nearest integer based on standard rounding rules
("round half up").

**Signatures**

```wdl
Int round(Float)
```

**Parameters**

1. **`Float`**: the number to round.

**Returns**

1. An integer.

**Example**

```wdl
Int three = round(3.14)
# `three` now contains `3`.
```

## `min`

Returns the smaller of two values. If both values are `Int`s, the return value is an
`Int`, otherwise it is a `Float`.

**Signatures**

```wdl
Int min(Int, Int)
Float min(Int, Float)
Float min(Float, Int)
Float min(Float, Float)
```

**Parameters**

1. **`Int|Float`**: the first number to compare.
2. **`Int|Float`**: the second number to compare.

**Returns**

1. The smaller of the two arguments.

**Example**

```wdl
Int value1
Float value2

Float result = min(value1, value2)
# This is equivalent to `if value1 < value2 then value1 else value2`.
```

## `max`

Returns the larger of two values. If both values are `Int`s, the return value is an
`Int`, otherwise it is a `Float`.

**Signatures**

```wdl
Int max(Int, Int)
Float max(Int, Float)
Float max(Float, Int)
Float max(Float, Float)
```

**Parameters**

1. **`Int|Float`**: the first number to compare.
2. **`Int|Float`**: the second number to compare.

**Returns**

1. The larger of the two arguments.

**Example**

```wdl
Int value1
Float value2

Float result = max(value1, value2)
# This is equivalent to `if value1 > value2 then value1 else value2`.
```
