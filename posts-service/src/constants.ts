export const TABLES_NAMES = {
    POST: 'post',
    COMMENT: 'comment',
    REPORT: 'report',
};

export const INJECTION_TOKENS = {
    KAFKA_CLIENT: 'KAFKA_CLIENT',
};

export const KAFKA_TOPICS = {
    POST_CREATED: 'posts.created',
    POST_UPDATED: 'posts.updated',
    POST_PROCESSED: 'post-processor.processed',
};

export const POST_TOPICS = {
    Technology: 1,
    Health: 2,
    Finance: 3,
    Education: 4,
    Entertainment: 5,
    Sports: 6,
    Travel: 7,
    Lifestyle: 8,
    Food: 9,
    Science: 10,
    Politics: 11,
    Environment: 12,
    Business: 13,
    Art: 14,
    History: 15,
    Culture: 16,
    Fashion: 17,
    Music: 18,
    Gaming: 19,
    Automotive: 20,
    'Real Estate': 21,
    Cryptocurrency: 22,
    Law: 23,
    Philosophy: 24,
    Psychology: 25,
    Religion: 26,
    Parenting: 27,
    Pets: 28,
    DIY: 29,
    Gardening: 30,
    Photography: 31,
    Writing: 32,
};

export const POST_READY_STATES = {
    PROCESSING: 1,
    READY: 2,
};

export const REPORT_ENTITY_CHECK_CONSTRAINT = {
    NAME: 'at_least_one_fk',
    EXPRESSION: `(postId IS NOT NULL) OR (commentId IS NOT NULL)`,
};
