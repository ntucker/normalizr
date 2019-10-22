/**
 * Helpers to enable Immutable compatibility *without* bringing in
 * the 'immutable' package as a dependency.
 */

/**
 * Check if an object is immutable by checking if it has a key specific
 * to the immutable library.
 *
 * @param  {any} object
 * @return {bool}
 */
export function isImmutable(object) {
  return !!(
    object &&
    typeof object.hasOwnProperty === 'function' &&
    (object.hasOwnProperty('__ownerID') || // Immutable.Map
      (object._map && object._map.hasOwnProperty('__ownerID')))
  ); // Immutable.Record
}

/**
 * Denormalize an immutable entity.
 *
 * @param  {Schema} schema
 * @param  {Immutable.Map|Immutable.Record} input
 * @param  {function} unvisit
 * @param  {function} getDenormalizedEntity
 * @return {Immutable.Map|Immutable.Record}
 */
export function denormalizeImmutable(schema, input, unvisit) {
  let found = true;
  return [
    Object.keys(schema).reduce((object, key) => {
      // Immutable maps cast keys to strings on write so we need to ensure
      // we're accessing them using string keys.
      const stringKey = `${key}`;

      const [item, foundItem] = unvisit(object.get(stringKey), schema[stringKey]);
      if (!foundItem) {
        found = false;
      }
      if (object.has(stringKey)) {
        return object.set(stringKey, item);
      } else {
        return object;
      }
    }, input),
    found
  ];
}
