-- CreateTable
CREATE TABLE `Administrador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Anuncio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cargo` VARCHAR(255) NOT NULL,
    `descricao` TEXT NOT NULL,
    `data_publicacao` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id_administrador` INTEGER NOT NULL,
    `id_evento` INTEGER NOT NULL,

    INDEX `id_administrador`(`id_administrador`),
    INDEX `id_evento`(`id_evento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AvaliacaoEvento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_utilizador` INTEGER NOT NULL,
    `id_evento` INTEGER NOT NULL,
    `nota` INTEGER NULL,
    `data_avaliacao` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_evento`(`id_evento`),
    INDEX `id_utilizador`(`id_utilizador`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CandidaturaVoluntariado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_utilizador` INTEGER NOT NULL,
    `id_anuncio` INTEGER NOT NULL,
    `estado` ENUM('Pendente', 'Aceite', 'Rejeitado') NULL DEFAULT 'Pendente',

    INDEX `id_anuncio`(`id_anuncio`),
    INDEX `id_utilizador`(`id_utilizador`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CategoriaEvento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `nome`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompraRifa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_utilizador` INTEGER NOT NULL,
    `id_rifa` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `data_compra` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `estado` ENUM('Vencedor', 'SegundoLugar', 'TerceiroLugar', 'Perdedor', 'Pendente') NULL DEFAULT 'Pendente',

    INDEX `id_rifa`(`id_rifa`),
    INDEX `id_utilizador`(`id_utilizador`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_utilizador` INTEGER NOT NULL,
    `valor` DECIMAL(10, 2) NOT NULL,
    `data_doacao` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `metodo_pagamento` ENUM('MBWAY', 'Cartão', 'Paypal') NOT NULL,

    INDEX `id_utilizador`(`id_utilizador`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(100) NOT NULL,
    `localizacao` VARCHAR(255) NOT NULL,
    `descricao` TEXT NULL,
    `data_evento` DATE NOT NULL,
    `fotografia` VARCHAR(100) NOT NULL,
    `estado` ENUM('Terminado', 'Ativo') NULL DEFAULT 'Ativo',
    `id_administrador` INTEGER NOT NULL,
    `id_categoria` INTEGER NOT NULL,

    INDEX `id_administrador`(`id_administrador`),
    INDEX `id_categoria`(`id_categoria`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MensagemSuporte` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_utilizador` INTEGER NOT NULL,
    `id_administrador` INTEGER NOT NULL,
    `mensagem` VARCHAR(700) NOT NULL,
    `data_abertura` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `data_encerramento` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `estado` ENUM('Aberto', 'Fechado') NULL DEFAULT 'Aberto',

    INDEX `id_administrador`(`id_administrador`),
    INDEX `id_utilizador`(`id_utilizador`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notificacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_utilizador` INTEGER NOT NULL,
    `id_administrador` INTEGER NOT NULL,
    `mensagem` VARCHAR(700) NOT NULL,
    `data_envio` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `estado` ENUM('Por abrir', 'Aberto') NULL DEFAULT 'Por abrir',

    INDEX `id_administrador`(`id_administrador`),
    INDEX `id_utilizador`(`id_utilizador`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pagamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_utilizador` INTEGER NOT NULL,
    `valor` DECIMAL(10, 2) NOT NULL,
    `metodo_pagamento` ENUM('MBWAY', 'Cartão', 'Paypal') NOT NULL,
    `estado` ENUM('Pendente', 'Pago', 'Falhado') NULL DEFAULT 'Pendente',
    `data_pagamento` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_utilizador`(`id_utilizador`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rifa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `quantidade` INTEGER NOT NULL,
    `descricao` TEXT NOT NULL,
    `premio` TEXT NOT NULL,
    `data_sorteio` DATE NOT NULL,
    `id_administrador` INTEGER NOT NULL,
    `id_evento` INTEGER NOT NULL,

    INDEX `id_administrador`(`id_administrador`),
    INDEX `id_evento`(`id_evento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Suporte` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `artigo` VARCHAR(50) NOT NULL,
    `descricao` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Utilizador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `telefone` VARCHAR(15) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `morada` VARCHAR(150) NULL,

    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `telefone`(`telefone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Anuncio` ADD CONSTRAINT `anuncio_ibfk_1` FOREIGN KEY (`id_administrador`) REFERENCES `Administrador`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Anuncio` ADD CONSTRAINT `anuncio_ibfk_2` FOREIGN KEY (`id_evento`) REFERENCES `Evento`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `AvaliacaoEvento` ADD CONSTRAINT `avaliacaoevento_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `Utilizador`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `AvaliacaoEvento` ADD CONSTRAINT `avaliacaoevento_ibfk_2` FOREIGN KEY (`id_evento`) REFERENCES `Evento`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CandidaturaVoluntariado` ADD CONSTRAINT `candidaturavoluntariado_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `Utilizador`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CandidaturaVoluntariado` ADD CONSTRAINT `candidaturavoluntariado_ibfk_2` FOREIGN KEY (`id_anuncio`) REFERENCES `Anuncio`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CompraRifa` ADD CONSTRAINT `comprarifa_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `Utilizador`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `CompraRifa` ADD CONSTRAINT `comprarifa_ibfk_2` FOREIGN KEY (`id_rifa`) REFERENCES `Rifa`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Doacao` ADD CONSTRAINT `doacao_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `Utilizador`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `evento_ibfk_1` FOREIGN KEY (`id_administrador`) REFERENCES `Administrador`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Evento` ADD CONSTRAINT `evento_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `CategoriaEvento`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `MensagemSuporte` ADD CONSTRAINT `mensagemsuporte_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `Utilizador`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `MensagemSuporte` ADD CONSTRAINT `mensagemsuporte_ibfk_2` FOREIGN KEY (`id_administrador`) REFERENCES `Administrador`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Notificacao` ADD CONSTRAINT `notificacao_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `Utilizador`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Notificacao` ADD CONSTRAINT `notificacao_ibfk_2` FOREIGN KEY (`id_administrador`) REFERENCES `Administrador`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `pagamento_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `Utilizador`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Rifa` ADD CONSTRAINT `rifa_ibfk_1` FOREIGN KEY (`id_administrador`) REFERENCES `Administrador`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Rifa` ADD CONSTRAINT `rifa_ibfk_2` FOREIGN KEY (`id_evento`) REFERENCES `Evento`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
