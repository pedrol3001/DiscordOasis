export type ConditionalArray<U, T extends string | Array<string>> = T extends string ? U : U[];

export type constructor<T> = new (...args : string[]) => T;

export type GenericObject = { [key: string]: any };

export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export type TypeOfClassMethod<T, M extends keyof T> = T[M] extends Function ? T[M] : never;