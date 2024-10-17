export const createMockDataSource = ({ repositoryMocks = {}, insertMocks = {} } = {}) => {
  return () => {
    const original = jest.requireActual('typeorm');

    return {
      ...original,
      destroy: jest.fn().mockReturnThis(),
      getRepository: jest.fn().mockImplementation((entity) => {
        const mock = repositoryMocks[entity.name];
        const insertMock = insertMocks[entity.name];

        if (!mock) {
          throw new Error(`No mock defined for repository: ${entity.name}`);
        }

        return {
          count: jest.fn().mockResolvedValue(mock.countResponse),
          createQueryBuilder: jest.fn().mockImplementation(() => ({
            execute: jest.fn().mockResolvedValue(mock.queryResponse),
            getMany: jest.fn().mockResolvedValue(mock.queryResponse),
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            offset: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
          })),
          find: jest.fn().mockResolvedValue(mock.queryResponse),
          findOne: jest.fn().mockResolvedValue(mock.queryResponse),
          insert: jest.fn().mockResolvedValue(insertMock?.queryResponse || null),
        };
      }),
      initialize: jest.fn().mockReturnThis(),
    };
  };
};
