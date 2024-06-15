import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Mentors1717177565957 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "mentors",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "departement",
                        type: "varchar",
                        enum: ["Teknik Elektro", "Teknik Komputer", "Teknik Biomedik", "Teknik Informatika", "Teknologi Informasi", "Sistem Informasi"],
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()"
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()"
                    }
                ],
            }),
            true,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('mentors');
    }

}
