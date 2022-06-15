import { Passport } from '../src/main'

const test = hi => name => from => `${hi}, ${name} from ${from}`
const assert = console.assert.bind(console)
const passTest = Passport.issueTo(test)

assert(
    passTest.passport instanceof Passport,
    'Must create passport'
)
assert(
    passTest.passport.func === test,
    'Must refer to original function'
)
assert(
    passTest('henlo').passport.func === test,
    'Partially appplied function must also refer to original function'
)
assert(
    Passport.eqaul(passTest('henlo').passport, passTest('henlo').passport),
    'Must be possible to compare euqaly created functions with their passports'
)
