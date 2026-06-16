-- AlterEnum
-- Multi-role RBAC: add `editor` and `viewer` alongside the existing `admin`.
ALTER TYPE "app_role" ADD VALUE 'editor';
ALTER TYPE "app_role" ADD VALUE 'viewer';

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "actor_id" TEXT,
    "actor_email" TEXT,
    "action" VARCHAR(100) NOT NULL,
    "entity" VARCHAR(100) NOT NULL,
    "entity_id" TEXT,
    "summary" VARCHAR(500),
    "metadata" JSONB,
    "before" JSONB,
    "after" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_audit_entity" ON "audit_log"("entity", "entity_id");

-- CreateIndex
CREATE INDEX "idx_audit_created" ON "audit_log"("created_at");

-- CreateIndex
CREATE INDEX "idx_audit_actor" ON "audit_log"("actor_id");

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
