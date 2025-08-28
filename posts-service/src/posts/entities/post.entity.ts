import { POST_READY_STATES, POST_TOPICS } from 'src/constants';
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column({
        type: 'simple-enum',
        enum: Object.values(POST_TOPICS),
    })
    topicId: number;

    @Column()
    title: string;

    @Column({
        type: 'simple-enum',
        enum: Object.values(POST_READY_STATES),
    })
    readyState: number;

    @Column({
        nullable: true,
    })
    imageUrl: string;

    @Column()
    contentMarkdown: string;

    @Column({
        nullable: true,
    })
    contentHTML: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
