import { TABLES_NAMES } from '../src/constants';
import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from 'typeorm';

export class Comment1755262798210 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: TABLES_NAMES.COMMENT,
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'postId',
                        type: 'uuid',
                    },
                    {
                        name: 'userId',
                        type: 'varchar',
                    },
                    {
                        name: 'parentCommentId',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'content',
                        type: 'text',
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );
        await queryRunner.createForeignKey(
            TABLES_NAMES.COMMENT,
            new TableForeignKey({
                columnNames: ['postId'],
                referencedColumnNames: ['id'],
                referencedTableName: TABLES_NAMES.POST,
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            TABLES_NAMES.COMMENT,
            new TableForeignKey({
                columnNames: ['postId'],
                referencedColumnNames: ['id'],
                referencedTableName: TABLES_NAMES.POST,
                onDelete: 'CASCADE',
            }),
        );
        await queryRunner.dropTable(TABLES_NAMES.COMMENT);
    }
}
