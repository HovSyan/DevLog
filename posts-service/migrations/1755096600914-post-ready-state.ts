import { POST_READY_STATES, TABLES_NAMES } from '../src/constants';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class PostReadyState1755096600914 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            TABLES_NAMES.POST,
            new TableColumn({
                name: 'readyState',
                type: 'enum',
                enum: Object.values(POST_READY_STATES).map(String),
                default: `'${POST_READY_STATES.READY}'`,
            }),
        );
        await queryRunner.query(
            `ALTER TABLE ${TABLES_NAMES.POST} ALTER COLUMN "readyState" DROP DEFAULT`,
        );
        await queryRunner.changeColumn(
            TABLES_NAMES.POST,
            'contentHTML',
            new TableColumn({
                name: 'contentHTML',
                type: 'text',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(TABLES_NAMES.POST, 'readyState');
        await queryRunner.changeColumn(
            TABLES_NAMES.POST,
            'contentHTML',
            new TableColumn({
                name: 'contentHTML',
                type: 'text',
                isNullable: false,
            }),
        );
    }
}
