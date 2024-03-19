-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "noTelp" TEXT NOT NULL,
    "limitLoan" INTEGER NOT NULL DEFAULT 800000,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "googleId" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivationCodes" (
    "id" SERIAL NOT NULL,
    "activationCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isUse" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ActivationCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResetCodes" (
    "id" SERIAL NOT NULL,
    "resetCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isUse" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ResetCodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "header" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banks" (
    "id" SERIAL NOT NULL,
    "typeBank" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "cardName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Banks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdentityCards" (
    "id" SERIAL NOT NULL,
    "selfiePhoto" TEXT NOT NULL,
    "selfiePhotoId" TEXT NOT NULL,
    "identityCardImage" TEXT NOT NULL,
    "identityCardImageId" TEXT NOT NULL,
    "identityCardNumber" TEXT NOT NULL,
    "placeBirth" TEXT NOT NULL,
    "dateBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "subdistrict" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "marialStatus" TEXT NOT NULL,
    "jobs" TEXT NOT NULL,
    "isVerified" TEXT NOT NULL DEFAULT 'Waiting for approval',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "IdentityCards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentLocations" (
    "id" SERIAL NOT NULL,
    "village" TEXT NOT NULL,
    "subdistrict" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CurrentLocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergecyContacts" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "EmergecyContacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incomes" (
    "id" SERIAL NOT NULL,
    "typeIncome" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "totalIncome" INTEGER NOT NULL,
    "businessPhoto" TEXT NOT NULL,
    "businessPhotoId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Incomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tempos" (
    "id" SERIAL NOT NULL,
    "timePeriod" TEXT NOT NULL,
    "interest" INTEGER NOT NULL,

    CONSTRAINT "Tempos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanApplications" (
    "id" SERIAL NOT NULL,
    "loanAmount" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "tempoId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAccepted" TEXT NOT NULL DEFAULT 'Waiting for approval',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LoanApplications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Loans" (
    "id" SERIAL NOT NULL,
    "amountReturned" INTEGER NOT NULL,
    "loanDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnDate" TIMESTAMP(3) NOT NULL,
    "isReturned" BOOLEAN NOT NULL DEFAULT false,
    "loanApplicationId" INTEGER NOT NULL,

    CONSTRAINT "Loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoanPayments" (
    "id" SERIAL NOT NULL,
    "transactionPhoto" TEXT NOT NULL,
    "transactionPhotoId" TEXT NOT NULL,
    "loanId" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAccepted" TEXT NOT NULL DEFAULT 'Waiting for approval',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LoanPayments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ActivationCodes_userId_key" ON "ActivationCodes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ResetCodes_userId_key" ON "ResetCodes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Banks_userId_key" ON "Banks"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "IdentityCards_userId_key" ON "IdentityCards"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CurrentLocations_userId_key" ON "CurrentLocations"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Loans_loanApplicationId_key" ON "Loans"("loanApplicationId");

-- CreateIndex
CREATE UNIQUE INDEX "LoanPayments_loanId_key" ON "LoanPayments"("loanId");

-- AddForeignKey
ALTER TABLE "ActivationCodes" ADD CONSTRAINT "ActivationCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ResetCodes" ADD CONSTRAINT "ResetCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Banks" ADD CONSTRAINT "Banks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "IdentityCards" ADD CONSTRAINT "IdentityCards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CurrentLocations" ADD CONSTRAINT "CurrentLocations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EmergecyContacts" ADD CONSTRAINT "EmergecyContacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Incomes" ADD CONSTRAINT "Incomes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LoanApplications" ADD CONSTRAINT "LoanApplications_tempoId_fkey" FOREIGN KEY ("tempoId") REFERENCES "Tempos"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LoanApplications" ADD CONSTRAINT "LoanApplications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Loans" ADD CONSTRAINT "Loans_loanApplicationId_fkey" FOREIGN KEY ("loanApplicationId") REFERENCES "LoanApplications"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LoanPayments" ADD CONSTRAINT "LoanPayments_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "Loans"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "LoanPayments" ADD CONSTRAINT "LoanPayments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
