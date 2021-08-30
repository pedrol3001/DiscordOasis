export type ConditionalArray<U, T extends string | Array<string>> = T extends string ? U : U[];

export type constructor<T> = new (...args : string[]) => T;

export type GenericObject = { [key: string]: any };
