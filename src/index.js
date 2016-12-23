// TODO: load from heimdall live events
// TODO: load from serialized events
// TODO: load from serialized graph (broccoli-viz-x.json)
// TODO: maybe lazy load

import Node from './node';

export function loadFromNode(heimdallNode) {
  // TODO: we are only doing toJSONSubgraph here b/c we're about to throw away
  // the node so the build doesn't grow unbounded; but we could just pluck off
  // this subtree and query against the live tree instead; may not matter since
  // we want to upgrade to v0.3 anyway
  let nodesJSON = heimdallNode.toJSONSubgraph();
  return loadFromV02Nodes(nodesJSON);
}

export function loadFromJSON(json) {
  let nodesJSON = json.nodes;

  return loadFromV02Nodes(nodesJSON);
}


function loadFromV02Nodes(nodesJSON) {

  let nodesById = {};
  let root = null;

  for (let jsonNode of nodesJSON) {
    nodesById[jsonNode._id] = new Node(jsonNode._id, jsonNode.id, jsonNode.stats);

    if (root === null) {
      root = nodesById[jsonNode._id];
    }
  }

  for (let jsonNode of nodesJSON) {
    let node = nodesById[jsonNode._id];
    let children = jsonNode.children.map(function (childId) {
      let child = nodesById[childId];

      if (!child) {
        throw new Error(`No child with id '${childId}' found.`);
      }

      child._parent = node;
      return child;
    });
    node._children = children;
  }

  return root;
}
