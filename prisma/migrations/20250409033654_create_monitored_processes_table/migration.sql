-- CreateTable
CREATE TABLE "monitored_processes" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "folder_id" INTEGER,
    "process_number" TEXT NOT NULL,
    "last_event_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monitored_processes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "monitored_processes_uuid_key" ON "monitored_processes"("uuid");

-- AddForeignKey
ALTER TABLE "monitored_processes" ADD CONSTRAINT "monitored_processes_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
