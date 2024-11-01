
/**
 * Clears all key-value pairs from the browser's local storage.
 */
export function clear(): void {
    return localStorage.clear();
}
/**
 * Gets the value associated with the specified key from the browser's local storage.
 * @param key - The key to retrieve the value for.
 * @returns The value associated with the specified key, or `null` if the key does not exist.
 */
export function getItem(key: string): string | null {
    return localStorage.getItem(key);
}

/**
 * Gets the key at the specified index from the browser's local storage.
 * @param index - The index of the key to retrieve.
 * @returns The key at the specified index, or `null` if the index is out of range.
 */
export function key(index: number): string | null {
    return localStorage.key(index);
}
/**
 * Removes the value associated with the specified key from the browser's local storage.
 * @param key - The key to remove the value for.
 */
export function removeItem(key: string): void {
    return localStorage.removeItem(key);
}
/**
 * Sets the value associated with the specified key in the browser's local storage.
 * @param key - The key to set the value for.
 * @param value - The value to associate with the key.
 */
export function setItem(key: string, value: string): void {
    return localStorage.setItem(key, value);
}

/**
 * Sets the value associated with the specified key in the browser's local storage.
 * @param key - The key to set the value for.
 * @param value - The value to associate with the key. This value will be serialized to a JSON string before being stored.
 */
export function setObject(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Gets the object value associated with the specified key from the browser's local storage.
 * @param key - The key to retrieve the object value for.
 * @returns The object value associated with the specified key, or `null` if the key does not exist or the value is not a valid JSON string.
 */
export function getObject<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    if (value) {
        return JSON.parse(value) as T;
    }

    return null;
}

/**
 * Gets the value associated with the specified key from the browser's local storage, or returns a default value if the key does not exist.
 * @param key - The key to retrieve the value for.
 * @param defaultValue - The default value to return if the key does not exist.
 * @returns The value associated with the specified key, or the default value if the key does not exist.
 */
export function get<T>(key: string, defaultValue: T): T {
    return localStorage.getItem(key) as T || defaultValue;
}


/**
 * Gets the boolean value associated with the specified key from the browser's local storage.
 * @param key - The key to retrieve the boolean value for.
 * @returns The boolean value associated with the specified key, or `false` if the key does not exist or the value is not a valid boolean string.
 */
export function getBoolean(key: string): boolean {
    return localStorage.getItem(key) === "true";
}


export default {
    clear,
    getItem,
    key,
    removeItem,
    setItem,
    get,
    getObject,
    getBoolean,
    setObject,
};