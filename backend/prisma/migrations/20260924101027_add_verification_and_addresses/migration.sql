-- CreateEnum
CREATE TYPE "RiderStatus" AS ENUM ('PENDING', 'APPROVED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "DeliveryBoy" ADD COLUMN     "licenseNumber" TEXT,
ADD COLUMN     "status" "RiderStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "vehicleNumber" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "deliveryLat" DOUBLE PRECISION,
ADD COLUMN     "deliveryLng" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "address" TEXT,
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION;
