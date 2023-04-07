-- CreateTable
CREATE TABLE `Donghua` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titleEnglish` VARCHAR(200) NULL,
    `titleChinese` VARCHAR(200) NULL,
    `summary` VARCHAR(5000) NULL,
    `nsfw` BOOLEAN NULL,
    `platform` ENUM('TV', 'Web') NULL,
    `startDate` VARCHAR(10) NULL,
    `endDate` VARCHAR(10) NULL,
    `source` VARCHAR(50) NULL,
    `episodeLength` VARCHAR(50) NULL,
    `bangumiId` INTEGER NULL,
    `bangumiRank` INTEGER NULL,
    `bangumiScore` DOUBLE NULL,
    `malId` INTEGER NULL,
    `malRank` INTEGER NULL,
    `malScore` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

