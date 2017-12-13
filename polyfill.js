/* */
// Helpers

/** Auto-binds this as the first argument to fn. */
const _this = func =>
  function() {
    return func.apply(this, [this].concat(Array.from(arguments)))
  }

/**
 * Registers every method in vals to obj.
 * Similar to Object.assign, but won't overwrite existing properties.
 */
const register = (obj, vals) => {
  const bindThis = !obj.hasOwnProperty('prototype')

  Object.keys(vals).forEach(key => {
    if (!(key in obj)) obj[key] = bindThis ? _this(vals[key]) : vals[key]
    else console.log(`Warning: could not overwrite ${obj} ${key}`)
  })
}

/* */
// Polyfill
module.exports = () => {
  const { array, fn, math, number, object, string } = require('./lib')

  /* */
  // Array
  register(Array, array)
  register(
    Array.prototype,
    object.pick(array, ['compact', 'choose', 'equals', 'groupBy'])
  )
  Object.defineProperty(Array.prototype, 'first', { get: _this(array.first) })
  Object.defineProperty(Array.prototype, 'last', { get: _this(array.last) })

  /* */
  // Fn
  register(Function.prototype, fn)

  /* */
  // Math
  register(Math, object.pluck(math, ['min', 'max', 'sign']))
  // forcibly overwrite built-in math functions
  Math.min = math.min
  Math.max = math.max
  Math.sign = math.sign

  /* */
  // Number
  register(Number, number)
  Number.prototype.to = _this(number.range)
  Number.prototype.times = _this(number.times)

  /* */
  // Object
  register(Object, object)

  /* */
  // String
  register(String.prototype, string)
}
