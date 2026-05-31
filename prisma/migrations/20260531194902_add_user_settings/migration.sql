-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "edgeRouting" TEXT NOT NULL DEFAULT 'smoothstep',
    "minimapVisible" BOOLEAN NOT NULL DEFAULT true,
    "backgroundVariant" TEXT NOT NULL DEFAULT 'dots',
    "backgroundPatternColor" TEXT NOT NULL DEFAULT '#2a2a30',
    "snapToGrid" BOOLEAN NOT NULL DEFAULT false,
    "defaultNodeShape" TEXT NOT NULL DEFAULT 'rectangle',
    "defaultNodeColor" TEXT NOT NULL DEFAULT '#1F1F1F',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");
