-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "movieTrailer" TEXT,
    "movieBanner" TEXT NOT NULL,
    "movieThumbnail" TEXT NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theater" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Theater_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Screen" (
    "id" SERIAL NOT NULL,
    "screen_no" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "theaterId" INTEGER NOT NULL,

    CONSTRAINT "Screen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowTime" (
    "id" SERIAL NOT NULL,
    "showDate" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShowTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seat" (
    "id" SERIAL NOT NULL,
    "seatNo" TEXT NOT NULL,
    "row" TEXT NOT NULL,
    "columns" TEXT NOT NULL,
    "screenId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" SERIAL NOT NULL,
    "showTimeId" INTEGER NOT NULL,
    "seatId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cast" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "movieId" INTEGER NOT NULL,

    CONSTRAINT "Cast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ScreenToShowTime" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Theater_email_key" ON "Theater"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_seatId_key" ON "Booking"("seatId");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_userId_key" ON "Rating"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_ScreenToShowTime_AB_unique" ON "_ScreenToShowTime"("A", "B");

-- CreateIndex
CREATE INDEX "_ScreenToShowTime_B_index" ON "_ScreenToShowTime"("B");

-- AddForeignKey
ALTER TABLE "Screen" ADD CONSTRAINT "Screen_theaterId_fkey" FOREIGN KEY ("theaterId") REFERENCES "Theater"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowTime" ADD CONSTRAINT "ShowTime_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_showTimeId_fkey" FOREIGN KEY ("showTimeId") REFERENCES "ShowTime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cast" ADD CONSTRAINT "Cast_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScreenToShowTime" ADD CONSTRAINT "_ScreenToShowTime_A_fkey" FOREIGN KEY ("A") REFERENCES "Screen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ScreenToShowTime" ADD CONSTRAINT "_ScreenToShowTime_B_fkey" FOREIGN KEY ("B") REFERENCES "ShowTime"("id") ON DELETE CASCADE ON UPDATE CASCADE;
