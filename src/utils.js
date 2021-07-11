/**
 * Iterates a list of items until the root node is found. The root node is determined by having the
 * parent property set to null. Once the root node is found, it is removed from the original array
 * and returned.
 *
 * Mutates the provided itemList.
 *
 * @param {Array} itemList
 * @returns {Object | undefined}
 */
export const findRoot = (itemList = []) => {
  let rootItem;

  for (let i = 0; i <= itemList.length; i++) {
    if (itemList[i] && itemList[i].parent === null) {
      // Remove the item from the original array
      rootItem = itemList.splice(i, 1).pop();
      break;
    }
  }

  return rootItem;
};

/**
 * Aggregates children recursively based on the itemList (without root node), and on the provided
 * children. When an item containing children is matched, the respective child node is replaced
 * while the match is removed from the itemList.
 *
 * Mutates the itemList and the children array.
 * 
 * The strategy around modifying the original itemList array is an attempt to make the aggregation
 * have logarithmic time complexity O(n log n)
 *
 * @param {Array} itemList
 * @param {Array} children
 */
export const aggregateChildren = (itemList = [], children = []) => {
  // Iterate children array
  for (let i = 0; i <= children.length; i++) {
    for (let k = 0; k <= itemList.length; k++) {
      // Match nodes by name
      if (itemList[k] && children[i] && itemList[k].name === children[i].name) {
        // Replace the child entry with the matched item (which may contain children)
        children.splice(i, 1, itemList.splice(k, 1).pop());

        // If the matched item contains children
        if (children[i].children.length) {
          // Make a recursive call to keep descending the tree
          aggregateChildren(itemList, children[i].children);
        }
      }
    }
  }
};
