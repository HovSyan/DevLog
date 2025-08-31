import { REPORT_ENTITY_CHECK_CONSTRAINT } from 'src/constants';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import {
    Check,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
@Check(REPORT_ENTITY_CHECK_CONSTRAINT.EXPRESSION)
export class Report {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column({
        nullable: true,
    })
    postId: string | null;

    @Column({
        nullable: true,
    })
    commentId: string | null;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Post, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    protected post: Post;

    @ManyToOne(() => Comment, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'commentId' })
    protected comment: Comment;
}
