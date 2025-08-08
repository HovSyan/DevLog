import { TABLES_NAMES } from '../src/constants';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class PostContentMarkdownHtmlRefactoring1754655002891
    implements MigrationInterface
{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            TABLES_NAMES.POST,
            new TableColumn({
                name: 'contentHTML',
                type: 'text',
                isNullable: true,
            }),
        );
        await queryRunner.query(
            `UPDATE ${TABLES_NAMES.POST} SET "contentHTML" = "content"`,
        );
        await queryRunner.query(
            `ALTER TABLE ${TABLES_NAMES.POST} ALTER COLUMN "contentHTML" SET NOT NULL`,
        );
        await queryRunner.renameColumn(
            TABLES_NAMES.POST,
            'content',
            'contentMarkdown',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn(
            TABLES_NAMES.POST,
            'contentMarkdown',
            'content',
        );
        await queryRunner.dropColumn(TABLES_NAMES.POST, 'contentHTML');
    }
}
