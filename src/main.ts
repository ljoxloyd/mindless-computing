
namespace Sequence {
    export function equal(seq1: any[], seq2: any[]) {
        return seq1.length === seq2.length && seq1.every((item, idx) => item === seq2[idx])
    }
}

export namespace Utils {
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

export interface HasPassport {
    passport: Passport
}

export class Passport {
    private constructor(
        public readonly func: Function,
        public readonly args: any[]
    ) { }

    static init(fn: Function): Passport {
        return new Passport(fn, [])
    }

    static extend(parentFn: HasPassport, args: any[]): Passport {
        return new Passport(
            parentFn.passport.func,
            parentFn.passport.args.concat(args)
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

    static issueTo(func: Function, parent?: HasPassport, args?: any[]) {
        function wrapper(...args: any[]) {
            const output = func(...args)
            if (output instanceof Function) {
                return Passport.issueTo(output, wrapper, args)
            }
            return output
        }

        if (parent && args)
            wrapper.passport = Passport.extend(parent, args)
        else
            wrapper.passport = Passport.init(func)

        return wrapper
    }

    static isIssued(func: any): func is HasPassport {
        return func.passport instanceof Passport
    }
}
