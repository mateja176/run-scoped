import { capitalize } from 'common/src';
import getLast from 'common/src/getLast';

export const greet = (name: string) => `Hello ${capitalize(name)}`;

export const getLastWithDefault = <A>(a: Array<A>) => getLast(a) || {};
