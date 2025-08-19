import { Post } from 'src/posts/entities/post.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    postId: string;

    @Column()
    userId: string;

    @Column({
        nullable: true,
        type: 'uuid',
    })
    parentCommentId: string | null;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Post)
    @JoinColumn({ name: 'postId' })
    protected post: Post;

    @ManyToOne(() => Comment, { nullable: true })
    @JoinColumn({ name: 'parentCommentId' })
    protected parentComment: Comment | null;
}
