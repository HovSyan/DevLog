import { REPORT_ENTITY_CHECK_CONSTRAINT, TABLES_NAMES } from 'src/constants';
import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableCheck,
    TableForeignKey,
} from 'typeorm';

export class Report1755796686586 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: TABLES_NAMES.REPORT,
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isGenerated: true,
                        generationStrategy: 'uuid',
                    },
                    {
                        name: 'userId',
                        type: 'uuid',
                    },
                    {
                        name: 'postId',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'commentId',
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
            TABLES_NAMES.REPORT,
            new TableForeignKey({
                columnNames: ['postId'],
                referencedColumnNames: ['id'],
                referencedTableName: TABLES_NAMES.POST,
                onDelete: 'CASCADE',
            }),
        );
        await queryRunner.createCheckConstraint(
            TABLES_NAMES.REPORT,
            new TableCheck({
                name: REPORT_ENTITY_CHECK_CONSTRAINT.NAME,
                expression: REPORT_ENTITY_CHECK_CONSTRAINT.EXPRESSION,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(TABLES_NAMES.REPORT, 'FK_REPORT_POST');
        await queryRunner.dropCheckConstraint(
            TABLES_NAMES.REPORT,
            REPORT_ENTITY_CHECK_CONSTRAINT.NAME,
        );
        await queryRunner.dropTable(TABLES_NAMES.REPORT);
    }
}
