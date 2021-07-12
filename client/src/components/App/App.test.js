import React from 'react';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {
  render,
  waitFor,
  fireEvent,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import 'react-d3-tree';
import { App } from './App';

// The Tree component exported by react-d3-tree relies on a deprecated SVG library that is no longer
// fully supported by jsdom in the test environment. https://github.com/jsdom/jsdom/issues/2531
jest.mock('react-d3-tree', () => ({
  __esModule: true,
  // eslint-disable-next-line react/prop-types
  default: ({ onNodeClick }) => {
    const handleClick = (event) => {
      if (onNodeClick) {
        onNodeClick({
          data: {
            _id: '60eb060c18d424bd55cc14eb',
            name: 'B-3',
            description: 'This is a description of B-3',
            parent: 'B',
            __v: 0,
            children: [],
            __rd3t: { id: '0c435512-a677-46d1-aebc-14c0ed80a97f', depth: 2, collapsed: false },
          },
        }, event);
      }
    };
    return (
      <button
        type="button"
        data-testid="mock-button"
        onClick={handleClick}
      >
        Mock Tree Component
      </button>
    );
  },
}));

const mockResponse = {
  name: 'A',
  description: 'This is a description of A',
  parent: null,
  children: [
    {
      name: 'B',
      description: 'This is a description of B',
      parent: 'A',
      children: [
        {
          name: 'B-2',
          description: 'This is a description of B-2',
          parent: 'B',
          children: [],
        },
        {
          name: 'B-1',
          description: 'This is a description of B-1',
          parent: 'B',
          children: [],
        },
        {
          name: 'B-3',
          description: 'This is a description of B-3',
          parent: 'B',
          children: [],
        },
      ],
    },
    {
      name: 'C',
      description: 'This is a description of C',
      parent: 'A',
      children: [],
    },
    {
      name: 'D',
      description: 'This is a description of D',
      parent: 'A',
      children: [],
    },
  ],
};

const server = setupServer(
  rest.get('http://localhost:5000/api/graph', (req, res, ctx) => res(ctx.json(mockResponse))),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App', () => {
  test('renders the Tree component after fetching data', async () => {
    const { getByTestId, getByText } = render(<App />);
    await waitFor(() => getByTestId('tree-wrapper'));
    expect(await getByTestId('tree-wrapper')).toBeInTheDocument();
    expect(await getByText('Mock Tree Component')).toBeInTheDocument();
  });

  it('open a dialog on node click', async () => {
    const { getByTestId } = render(<App />);
    await waitFor(() => getByTestId('tree-wrapper'));
    fireEvent.click(await getByTestId('mock-button'))
    await waitFor(() => getByTestId('pop-over'));
    expect(await getByTestId('pop-over')).toBeInTheDocument();
    expect(await getByTestId('node-title')).toBeInTheDocument();
    expect(await getByTestId('node-description')).toBeInTheDocument();
    expect(await getByTestId('dialog-close-button')).toBeInTheDocument();
  });

  it('Closes the dialog on click', async () => {
    const { getByTestId } = render(<App />);
    await waitFor(() => getByTestId('tree-wrapper'));
    fireEvent.click(await getByTestId('mock-button'))
    await waitFor(() => getByTestId('pop-over'));
    fireEvent.click(await getByTestId('dialog-close-button'));
    const popOver = await getByTestId('pop-over');
    await waitForElementToBeRemoved(popOver);
    expect(popOver).not.toBeInTheDocument();
  });
});
