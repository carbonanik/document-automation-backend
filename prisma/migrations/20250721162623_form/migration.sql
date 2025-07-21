-- CreateTable
CREATE TABLE "LandForm" (
    "id" TEXT NOT NULL,
    "bd_form_no" TEXT NOT NULL,
    "appendix" TEXT NOT NULL,
    "serial_no" TEXT NOT NULL,
    "paragraph_no" TEXT NOT NULL,
    "office_name" TEXT NOT NULL,
    "mouzar_no" TEXT NOT NULL,
    "thana" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "khatian_no" TEXT NOT NULL,
    "reg_holding_no" TEXT NOT NULL,
    "total_land_amount" TEXT NOT NULL,
    "table_row_1" TEXT NOT NULL,
    "table_row_2" TEXT NOT NULL,
    "table_row_3" TEXT NOT NULL,
    "table_row_4" TEXT NOT NULL,
    "table_row_5" TEXT NOT NULL,
    "table_row_6" TEXT NOT NULL,
    "table_row_7" TEXT NOT NULL,
    "total_where" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "invoice_no" TEXT NOT NULL,
    "date_bangla" TEXT NOT NULL,
    "date_english" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LandForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "share" TEXT NOT NULL,
    "landFormId" TEXT NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandInfo" (
    "id" TEXT NOT NULL,
    "landClass" TEXT NOT NULL,
    "landAmount" TEXT NOT NULL,
    "stainNo" TEXT NOT NULL,
    "landFormId" TEXT NOT NULL,

    CONSTRAINT "LandInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Owner" ADD CONSTRAINT "Owner_landFormId_fkey" FOREIGN KEY ("landFormId") REFERENCES "LandForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandInfo" ADD CONSTRAINT "LandInfo_landFormId_fkey" FOREIGN KEY ("landFormId") REFERENCES "LandForm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
