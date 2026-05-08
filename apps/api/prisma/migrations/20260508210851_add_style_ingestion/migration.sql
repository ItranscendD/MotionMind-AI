/*
  Warnings:

  - You are about to drop the column `config` on the `StyleProfile` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `StyleProfile` table. All the data in the column will be lost.
  - Added the required column `workspaceId` to the `StyleProfile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "StyleVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "dimensions" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StyleVersion_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "StyleProfile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StyleProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "dimensions" TEXT,
    "embeddingId" TEXT,
    "thumbnail" TEXT,
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StyleProfile_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StyleProfile" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "StyleProfile";
DROP TABLE "StyleProfile";
ALTER TABLE "new_StyleProfile" RENAME TO "StyleProfile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
