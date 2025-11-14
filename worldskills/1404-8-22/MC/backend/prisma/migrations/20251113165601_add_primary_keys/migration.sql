-- DropIndex
DROP INDEX "GameScore_timestamp_key";

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Game_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GameScore" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "GameScore_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "PlatformUser" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "PlatformUser_pkey" PRIMARY KEY ("id");
