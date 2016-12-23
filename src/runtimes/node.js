import fs from 'fs';
export { loadFromNode, loadFromJSON } from '../index.js';

export function loadFromFile(path) {
  let json = JSON.parse(fs.readFileSync(path, 'UTF8'));

  return loadFromJSON(json);
}
