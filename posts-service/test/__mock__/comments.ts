import { Comment } from 'src/comment/entities/comment.entity';

export default [
    {
        id: '30a6b929-949d-4a40-9b80-0d64c9aea440',
        postId: '6610e8a2-4833-4208-8b5d-864f8bbe8202',
        content: 'Test comment 1',
        userId: '1',
    },
    {
        id: '3e8a47e9-0881-423a-aa40-cce6a4e92e0e',
        postId: '6610e8a2-4833-4208-8b5d-864f8bbe8202',
        content: 'Test comment 2',
        userId: '1',
    },
    {
        id: '77a84926-766a-4502-aa89-9eda19130a54',
        postId: '6610e8a2-4833-4208-8b5d-864f8bbe8202',
        content: 'Test reply 1',
        parentCommentId: '30a6b929-949d-4a40-9b80-0d64c9aea440',
        userId: '1',
    },
    {
        id: '70b3459d-58ef-4270-9f1b-7002a8b2eb26',
        postId: '6610e8a2-4833-4208-8b5d-864f8bbe8202',
        content: 'Test reply 2',
        parentCommentId: '3e8a47e9-0881-423a-aa40-cce6a4e92e0e',
        userId: '1',
    },
] as Comment[];
