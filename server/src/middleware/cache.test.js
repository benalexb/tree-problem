import { useCache, breakCache } from './cache';

const mockNext = jest.fn();
const mockGetAsync = jest.fn();
const mockDelAsync = jest.fn();
const mockCachedResponse = { foo: 'bar' };
const mockReq = { path: '/api/graph' };
const mockRes = {
  locals: {
    redis: {
      delAsync: mockDelAsync,
      getAsync: mockGetAsync,
    },
  },
};

describe('useCache', () => {
  beforeEach(() => {
    mockNext.mockReset();
    mockGetAsync.mockReset().mockImplementation(async () => JSON.stringify(mockCachedResponse));
    mockRes.locals.cachedResponse = undefined;
  });

  it('calls next when done, sets the cached response inside res.locals', async () => {
    await useCache(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(mockGetAsync).toHaveBeenCalled();
    expect(mockRes.locals.cachedResponse).toBeDefined();
    expect(mockRes.locals.cachedResponse).toEqual(mockCachedResponse);
  });
});

describe('breakCache', () => {
  beforeEach(() => {
    mockNext.mockReset();
    mockDelAsync.mockReset();
    mockRes.locals.cachedResponse = undefined;
  });

  it('calls next when done, deletes cached response from Redis', async () => {
    await breakCache(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(mockDelAsync).toHaveBeenCalled();
    expect(mockRes.locals.cachedResponse).not.toBeDefined();
  });
});
