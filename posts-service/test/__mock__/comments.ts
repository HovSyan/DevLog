import { Comment } from 'src/comment/entities/comment.entity';
import mockUser from './user';
import mockPosts from './posts';

export default [
    {
        id: '30a6b929-949d-4a40-9b80-0d64c9aea440',
        postId: mockPosts[0].id,
        content: 'Test comment 1',
        userId: mockUser.uid,
    },
    {
        id: '3e8a47e9-0881-423a-aa40-cce6a4e92e0e',
        postId: mockPosts[0].id,
        content: 'Test comment 2',
        userId: mockUser.uid,
    },
    {
        id: '77a84926-766a-4502-aa89-9eda19130a54',
        postId: mockPosts[1].id,
        content: 'Test reply 1',
        parentCommentId: '30a6b929-949d-4a40-9b80-0d64c9aea440',
        userId: mockUser.uid,
    },
    {
        id: '70b3459d-58ef-4270-9f1b-7002a8b2eb26',
        postId: mockPosts[0].id,
        content: 'Test reply 2',
        parentCommentId: '3e8a47e9-0881-423a-aa40-cce6a4e92e0e',
        userId: mockUser.uid,
    },
] as Comment[];
