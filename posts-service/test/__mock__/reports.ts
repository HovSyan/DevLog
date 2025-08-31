import { Report } from 'src/report/entities/report.entity';
import mockUser from './user';
import posts from './posts';
import comments from './comments';

export default [
    {
        id: 'e0e80823-cfce-4295-9da0-34dfffed10e0',
        postId: posts[0].id,
        commentId: null,
        userId: mockUser.uid,
        content: 'This is a report',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '6f16826d-1992-45a4-9d0b-7754333e4db8',
        commentId: comments[0].id,
        postId: null,
        userId: mockUser.uid,
        content: 'This is another report',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'fa6c2456-c775-40a2-9d63-e15ad0e4cb11',
        postId: posts[1].id,
        commentId: null,
        userId: mockUser.uid,
        content: 'This is another report 2',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
] as Report[];
