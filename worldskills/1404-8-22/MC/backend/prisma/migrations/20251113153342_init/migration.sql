-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'developer');

-- CreateTable
CREATE TABLE "PlatformUser" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "registeredTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'user'
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "registeredTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLoginTimestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GameScore" (
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" TEXT NOT NULL,
    "platformUserUsername" TEXT NOT NULL,
    "gameSlug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Game" (
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "optionalThumbnail" TEXT,
    "slug" TEXT NOT NULL,
    "author" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PlatformUser_username_key" ON "PlatformUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_username_key" ON "AdminUser"("username");

-- CreateIndex
CREATE UNIQUE INDEX "GameScore_timestamp_key" ON "GameScore"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Game_title_key" ON "Game"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");

-- AddForeignKey
ALTER TABLE "GameScore" ADD CONSTRAINT "GameScore_platformUserUsername_fkey" FOREIGN KEY ("platformUserUsername") REFERENCES "PlatformUser"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameScore" ADD CONSTRAINT "GameScore_gameSlug_fkey" FOREIGN KEY ("gameSlug") REFERENCES "Game"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_author_fkey" FOREIGN KEY ("author") REFERENCES "PlatformUser"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
