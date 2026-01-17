-- CreateTable
CREATE TABLE "BlogView" (
    "id" TEXT NOT NULL,
    "blogId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogView_blogId_ipAddress_key" ON "BlogView"("blogId", "ipAddress");

-- AddForeignKey
ALTER TABLE "BlogView" ADD CONSTRAINT "BlogView_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
