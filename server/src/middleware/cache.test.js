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
  beforeAll(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    global.console.error.mockRestore();
  });

  beforeEach(() => {
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

  it('should handle errors', async () => {
    await useCache(mockReq, mockRes, undefined);
    expect(global.console.error).toHaveBeenCalled();
  });
});

describe('breakCache', () => {
  beforeAll(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    global.console.error.mockRestore();
  });

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

  it('should handle errors', async () => {
    await breakCache(mockReq, mockRes, undefined);
    expect(global.console.error).toHaveBeenCalled();
  });
});
