-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('pendiente', 'aprobada', 'rechazada');

-- CreateTable
CREATE TABLE "solicitudes" (
    "id" SERIAL NOT NULL,
    "nombreCompleto" TEXT NOT NULL,
    "dni" VARCHAR(8) NOT NULL,
    "correo" TEXT NOT NULL,
    "telefono" VARCHAR(9) NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "plazoMeses" INTEGER NOT NULL,
    "cuotaMensual" DECIMAL(10,2) NOT NULL,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'pendiente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitudes_pkey" PRIMARY KEY ("id")
);
