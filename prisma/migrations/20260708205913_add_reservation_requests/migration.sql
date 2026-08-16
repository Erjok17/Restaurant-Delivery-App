-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "specialRequests" TEXT,
ALTER COLUMN "status" SET DEFAULT 'confirmed';
