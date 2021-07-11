import { cloneDeep } from 'lodash';
import { findRoot, aggregateChildren } from './utils';

const baseMockData = [
  {
    name: 'A',
    parent: null,
    children: [
      { name: 'B', parent: 'A' },
      { name: 'D', parent: 'A' },
      { name: 'C', parent: 'A' },
    ],
  },
  {
    name: 'B',
    parent: 'A',
    children: [
      { name: 'B-2', parent: 'B' },
      { name: 'B-1', parent: 'B' },
      { name: 'B-3', parent: 'B' },
    ],
  },
  {
    name: 'C',
    parent: 'A',
    children: [],
  },
  {
    name: 'D',
    parent: 'A',
    children: [],
  },
  {
    name: 'B-1',
    parent: 'B',
    children: [],
  },
  {
    name: 'B-2',
    parent: 'B',
    children: [],
  },
  {
    name: 'B-3',
    parent: 'B',
    children: [],
  },
];

describe('findRoot', () => {
  let mockData;

  beforeEach(() => {
    mockData = cloneDeep(baseMockData);
  });

  it('returns undefined when the root item is not found', () => {
    const result = findRoot();
    expect(result).not.toBeDefined();
  });

  it('removes the root item from the original array', () => {
    const dataLengthBefore = mockData.length;
    const result = findRoot(mockData);
    expect(result).toBeDefined();
    expect(mockData.length).toBeLessThan(dataLengthBefore);
  });
});

describe('aggregateChildren', () => {
  let mockItemList;

  beforeEach(() => {
    mockItemList = cloneDeep(baseMockData);
  });

  it('does not throw when no arguments are provided', () => {
    aggregateChildren();
  });

  it('aggregates children by modifying the original item list', () => {
    const itemsLengthBefore = mockItemList.length;
    const rootNode = findRoot(mockItemList);
    aggregateChildren(mockItemList, rootNode.children);
    expect(mockItemList.length).toBeLessThan(itemsLengthBefore);
    expect(rootNode).toEqual({
      name: 'A',
      parent: null,
      children: [
        {
          name: 'B',
          parent: 'A',
          children: [
            { name: 'B-2', parent: 'B', children: [] },
            { name: 'B-1', parent: 'B', children: [] },
            { name: 'B-3', parent: 'B', children: [] },
          ],
        },
        { name: 'D', parent: 'A', children: [] },
        { name: 'C', parent: 'A', children: [] },
      ],
    });
  });
});
