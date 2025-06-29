/**
 * Outputs a message to the console.
 * @param data - A list of JavaScript objects to output. The string representations
 * of each of these objects are appended together in the order listed and output.
 */
export function log(...data: any[]): void {
	// @ts-expect-error
	console.log(...data);
}

/**
 * Outputs an informational message to the console.
 * In some browsers, a small "i" icon is displayed next to items logged this way.
 * @param data - A list of JavaScript objects to output.
 */
export function info(...data: any[]): void {
	// @ts-expect-error
	console.info(...data);
}

/**
 * Outputs a warning message to the console.
 * @param data - A list of JavaScript objects to output.
 */
export function warn(...data: any[]): void {
	// @ts-expect-error
	console.warn(...data);
}

/**
 * Outputs an error message to the console.
 * @param data - A list of JavaScript objects to output.
 */
export function error(...data: any[]): void {
	// @ts-expect-error
	console.error(...data);
}

/**
 * Outputs a message to the console at the "debug" log level.
 * This is generally hidden unless the user's console is configured to show debug output.
 * @param data - A list of JavaScript objects to output.
 */
export function debug(...data: any[]): void {
	// @ts-expect-error
	console.debug(...data);
}

/**
 * Logs a message and stack trace to the console if the first argument is `false`.
 * @param assertion - A boolean. If `false`, the message is logged.
 * @param data - A list of JavaScript objects to output if the assertion is false.
 */
export function assert(assertion: boolean, ...data: any[]): void {
	// @ts-expect-error
	console.assert(assertion, ...data);
}

/**
 * Clears the console if the console allows it.
 */
export function clear(): void {
	// @ts-expect-error
	console.clear();
}

/**
 * Logs the number of times that this particular call to `count()` has been called.
 * @param label - A string. If supplied, `count()` logs the number of times it
 * has been called with that specific label.
 */
export function count(label?: string): void {
	// @ts-expect-error
	console.count(label);
}

/**
 * Resets the counter for a given label.
 * @param label - A string. The label of the counter to reset. Defaults to "default".
 */
export function countReset(label?: string): void {
	// @ts-expect-error
	console.countReset(label);
}

/**
 * Displays an interactive list of the properties of the specified JavaScript object.
 * @param item - A JavaScript object whose properties should be output.
 * @param options - An optional object with options for formatting.
 */
export function dir(item?: any, options?: any): void {
	// @ts-expect-error
	console.dir(item, options);
}

/**
 * Displays an XML/HTML Element representation of the specified object if possible.
 * @param data - The object to display.
 */
export function dirxml(...data: any[]): void {
	// @ts-expect-error
	console.dirxml(...data);
}

/**
 * Creates a new inline group in the console, indenting all following output by an additional level.
 * To move back out a level, call `groupEnd()`.
 * @param label - The label for the group.
 */
export function group(...label: any[]): void {
	// @ts-expect-error
	console.group(...label);
}

/**
 * Creates a new inline group in the console, but with the new group being initially collapsed.
 * To move back out a level, call `groupEnd()`.
 * @param label - The label for the group.
 */
export function groupCollapsed(...label: any[]): void {
	// @ts-expect-error
	console.groupCollapsed(...label);
}

/**
 * Exits the current inline group.
 */
export function groupEnd(): void {
	// @ts-expect-error
	console.groupEnd();
}

/**
 * Displays tabular data as a table.
 * @param data - The data to display. This can be an array or an object.
 * @param properties - An array of strings containing the names of columns to include.
 */
export function table(data: any, properties?: string[]): void {
	// @ts-expect-error
	console.table(data, properties);
}

/**
 * Starts a timer you can use to track how long an operation takes.
 * You give each timer a unique name, and may have up to 10,000 timers running on a given page.
 * When you call `timeEnd()` with the same name, the browser will output the time, in milliseconds,
 * that elapsed since the timer was started.
 * @param label - The name to give the new timer. Defaults to "default".
 */
export function time(label?: string): void {
	// @ts-expect-error
	console.time(label);
}

/**
 * Stops a timer that was previously started by calling `time()`.
 * It logs the elapsed time in milliseconds.
 * @param label - The name of the timer to stop. Defaults to "default".
 */
export function timeEnd(label?: string): void {
	// @ts-expect-error
	console.timeEnd(label);
}

/**
 * Logs the value of a timer that was previously started by calling `time()`.
 * @param label - The name of the timer to log. Defaults to "default".
 * @param data - Additional data to log alongside the timer.
 */
export function timeLog(label?: string, ...data: any[]): void {
	// @ts-expect-error
	console.timeLog(label, ...data);
}

/**
 * Outputs a stack trace to the console.
 * @param data - A list of JavaScript objects to output.
 */
export function trace(...data: any[]): void {
	// @ts-expect-error
	console.trace(...data);
}
