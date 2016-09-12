import { selection, select } from "d3-selection";

import { default as parent } from './src/parent';

selection.prototype.parent = parent

export { selection, select }