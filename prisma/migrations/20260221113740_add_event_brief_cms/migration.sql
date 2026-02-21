-- CreateTable
CREATE TABLE "EventBrief" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "leftSaying" JSONB NOT NULL,
    "rightSaying" JSONB NOT NULL,
    "factsSoFar" JSONB NOT NULL,
    "whyLeft" TEXT NOT NULL,
    "whyRight" TEXT NOT NULL,
    "historicalContext" JSONB NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "EventBrief_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EventBrief_slug_key" ON "EventBrief"("slug");
