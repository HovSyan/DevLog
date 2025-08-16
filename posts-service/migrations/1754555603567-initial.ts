import { POST_TOPICS, TABLES_NAMES } from '../src/constants';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Initial1754555603567 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: TABLES_NAMES.POST,
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'userId',
                        type: 'varchar',
                    },
                    {
                        name: 'topicId',
                        type: 'enum',
                        enum: Object.values(POST_TOPICS).map(String),
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'imageUrl',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'content',
                        type: 'text',
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(TABLES_NAMES.POST);
    }
}
