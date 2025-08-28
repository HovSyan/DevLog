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
    postId: string;

    @Column({
        nullable: true,
    })
    commentId: string;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Post)
    @JoinColumn({ name: 'postId' })
    protected post: Post;

    @ManyToOne(() => Comment)
    @JoinColumn({ name: 'commentId' })
    protected comment: Comment;
}
