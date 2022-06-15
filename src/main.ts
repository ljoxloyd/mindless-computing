
namespace Sequence {
    export function equal(seq1: any[], seq2: any[]) {
        return seq1.length === seq2.length && seq1.every((item, idx) => item === seq2[idx])
    }
}

namespace Utils {
    export function format(template: string, vars: object) {
        return template.replace(/%(\w+)/g, (_, name) => vars[name])
    }

    export function hash(str: string) {
        let hash = 0
        for (let i = 0, len = str.length; i < len; i++) {
            let chr = str.charCodeAt(i)
            hash = (hash << 5) - hash + chr
            hash |= 0
        }
        return hash.toString(36)
    }
}

class Passport {
    private constructor(
        public readonly func: Function,
        public readonly args: any[]
    ) { }

    static init(fn: Function): Passport {
        return new Passport(fn, [])
    }

    static extend(fn: { passport: Passport }, argArray: any[]): Passport {
        return new Passport(
            fn.passport.func,
            fn.passport.args.concat(argArray)
        )
    }

    static eqaul(
        { func: func1, args: args1 }: Passport,
        { func: func2, args: args2 }: Passport
    ) {
        return func1 === func2 && Sequence.equal(args1, args2)
    }

    static repr(passport: Passport) {
        return Utils.format('%name{%code}(%args)', {
            name: passport.func.name,
            code: Utils.hash(passport.func.toString()),
            args: passport.args.join()
        })
    }

    static issueTo(func: Function, args?: any[]) {
        function wrapper(...args: any[]) {
            const output = func(...args)
            if (output instanceof Function) {
                output.passport = Passport.extend(wrapper, args)
                return Passport.issueTo(output, args)
            }
            return output
        }

        if (!Passport.isIssued(func))
            wrapper.passport = Passport.init(func)

        return wrapper
    }

    static isIssued(func: any): func is { passport: Passport } {
        return func.passport instanceof Passport
    }
}

const where = propName => expectation => item =>
    item instanceof Object &&
    (expectation == item[propName] ||
        (expectation instanceof Function && expectation(item[propName])))


const where$ = Passport.issueTo(where)



console.assert(where$.passport.func === where)
console.assert(where$.passport.func === where$('fund_id').passport.func, 'product must reference origninal function')
console.assert()
