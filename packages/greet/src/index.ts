import getLast, { capitalize } from 'common';

export const greet = (name: string) => `Hello ${capitalize(name)}`;

export const getLastWithDefault = <A>(a: Array<A>) => getLast(a) || {};

console.log(greet('Jana'));
