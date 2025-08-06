import { POST_TOPICS } from 'src/constants';
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
        type: 'enum',
        enum: Object.values(POST_TOPICS),
        nullable: false,
    })
    topicId: number;

    @Column()
    title: string;

    @Column({
        nullable: true,
    })
    imageUrl: string;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
