-- AlterTable
ALTER TABLE "User" ADD COLUMN "securityQuestion" TEXT;
ALTER TABLE "User" ADD COLUMN "securityAnswerHash" TEXT;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "searchDetails" TEXT NOT NULL DEFAULT '{}';
