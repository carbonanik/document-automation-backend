-- CreateEnum
CREATE TYPE "RechargeStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "BkashRecharge" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "trxId" TEXT NOT NULL,
    "status" "RechargeStatus" NOT NULL DEFAULT 'PENDING',
    "bkashNo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "BkashRecharge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BkashRecharge_trxId_key" ON "BkashRecharge"("trxId");

-- AddForeignKey
ALTER TABLE "BkashRecharge" ADD CONSTRAINT "BkashRecharge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
