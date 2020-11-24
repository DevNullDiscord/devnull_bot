import { randomBytes } from "crypto";
import { promisify as _p } from "util";

/**
 * Get a more secure random number between 0 and 1 synchronously.
 */
export function srandSync(): number {
  return parseInt(randomBytes(8).toString("hex"), 16) / 18446744073709552000;
}

/**
 * Get a more secure random number between 0 and 1 asynchronously.
 */
export async function srand(): Promise<number> {
  return (
    parseInt((await _p(randomBytes)(8)).toString("hex"), 16) /
    18446744073709552000
  );
}

/**
 * Get a random value between a minimum and maximum value (inclusive).
 * @param max Maximum value. Default: 1
 * @param min Minimum value. Default: 0
 */
export function srandInRangeSync(max = 1, min = 0): number {
  return srandSync() * (max - min) + min;
}

/**
 * Get a random value between a minimum and maximum value (inclusive).
 * @param max Maximum value. Default: 1
 * @param min Minimum value. Default: 0
 */
export async function srandInRange(max = 1, min = 0): Promise<number> {
  return (await srand()) * (max - min) + min;
}

/**
 * Get a random boolean value based on a weight.
 * @param weight The weight value.
 */
export async function srandWeightedBool(weight: number): Promise<boolean> {
  return (await srand()) < weight;
}

/**
 * Get a random boolean value based on a weight synchronously.
 * @param weight The weight value.
 */
export function srandWeightedBoolSync(weight: number): boolean {
  return srandSync() < weight;
}

/**
 * Get a random boolean value.
 */
export async function srandBool(): Promise<boolean> {
  return await srandWeightedBool(0.5);
}

/**
 * Get a random boolean value synchronously.
 */
export function srandBoolSync(): boolean {
  return srandWeightedBoolSync(0.5);
}

/**
 * Randomly sort an array's elements.
 * @param arr The array to be randomly sorted.
 */
export function randomize<T>(arr: T[]): T[] {
  return arr.sort(() => srandInRangeSync(1, -1));
}
