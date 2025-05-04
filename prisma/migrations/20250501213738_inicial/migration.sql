-- CreateTable
CREATE TABLE `Administrador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(100) NOT NULL,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Anuncio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cargo` VARCHAR(255) NOT NULL,
    `descricao` TEXT NOT NULL,
    `data_publicacao` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `estado` ENUM('Ativo', 'Terminado') NOT NULL DEFAULT 'Ativo',
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
CREATE TABLE `Evento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(100) NOT NULL,
    `localizacao` VARCHAR(255) NOT NULL,
    `descricao` TEXT NULL,
    `data_evento` DATE NOT NULL,
    `fotografia` VARCHAR(100) NOT NULL,
    `estado` ENUM('Terminado', 'Ativo') NOT NULL DEFAULT 'Ativo',
    `id_administrador` INTEGER NOT NULL,
    `id_categoria` INTEGER NOT NULL,

    INDEX `id_administrador`(`id_administrador`),
    INDEX `id_categoria`(`id_categoria`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MensagemSuporte` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_ticket` INTEGER NOT NULL,
    `id_utilizador` INTEGER NOT NULL,
    `id_administrador` INTEGER NULL,
    `mensagem` VARCHAR(700) NOT NULL,
    `data_abertura` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `data_encerramento` DATETIME(3) NULL,
    `estado` ENUM('Aberto', 'Fechado') NOT NULL DEFAULT 'Aberto',

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
    `estado` ENUM('Por abrir', 'Aberto') NOT NULL DEFAULT 'Por abrir',

    INDEX `id_administrador`(`id_administrador`),
    INDEX `id_utilizador`(`id_utilizador`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SorteioRifas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `preco` DECIMAL(10, 2) NOT NULL,
    `quantidadeTotal` INTEGER NOT NULL,
    `descricao` TEXT NOT NULL,
    `premio` TEXT NOT NULL,
    `data_sorteio` DATE NOT NULL,
    `estado` ENUM('Ativo', 'Terminado') NOT NULL DEFAULT 'Ativo',
    `id_administrador` INTEGER NOT NULL,
    `id_evento` INTEGER NOT NULL,

    INDEX `id_administrador`(`id_administrador`),
    INDEX `id_evento`(`id_evento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rifa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_sorteio` INTEGER NOT NULL,
    `id_utilizador` INTEGER NULL,
    `estado` ENUM('Vencedor', 'SegundoLugar', 'TerceiroLugar', 'Perdedor', 'PorComprar', 'Comprada') NOT NULL DEFAULT 'PorComprar',

    INDEX `id_utilizador`(`id_utilizador`),
    INDEX `id_sorteio`(`id_sorteio`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pagamento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_utilizador` INTEGER NOT NULL,
    `id_sorteio` INTEGER NOT NULL,
    `quantidadeCompra` INTEGER NOT NULL,
    `valor_total` DECIMAL(10, 2) NOT NULL,
    `metodo_pagamento` ENUM('MBWAY', 'Entidade_Referencia') NOT NULL,
    `estado` ENUM('Pendente', 'Pago', 'Falhado') NOT NULL DEFAULT 'Pendente',
    `data_pagamento` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_utilizador`(`id_utilizador`),
    INDEX `id_sorteio`(`id_sorteio`),
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
ALTER TABLE `SorteioRifas` ADD CONSTRAINT `sorteio_rifas_ibfk_1` FOREIGN KEY (`id_administrador`) REFERENCES `Administrador`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `SorteioRifas` ADD CONSTRAINT `sorteio_rifas_ibfk_2` FOREIGN KEY (`id_evento`) REFERENCES `Evento`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Rifa` ADD CONSTRAINT `rifa_ibfk_2` FOREIGN KEY (`id_sorteio`) REFERENCES `SorteioRifas`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Rifa` ADD CONSTRAINT `rifa_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `Utilizador`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `pagamento_ibfk_1` FOREIGN KEY (`id_utilizador`) REFERENCES `Utilizador`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Pagamento` ADD CONSTRAINT `pagamento_ibfk_2` FOREIGN KEY (`id_sorteio`) REFERENCES `SorteioRifas`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
