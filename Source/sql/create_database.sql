CREATE DATABASE yarddb;

CREATE TABLE Spieler
(
  Id SERIAL,
  Name VARCHAR(30) NOT NULL,
  PRIMARY KEY(Id)
)ENGINE=INNODB;

CREATE TABLE Knoten
(
  Id SERIAL,
  Longitude DOUBLE NOT NULL,
  Latitude DOUBLE NOT NULL,
  PRIMARY KEY(Id)
)ENGINE=INNODB;

CREATE TABLE SpielerPosition
(
  SpielerId BIGINT UNSIGNED NOT NULL,
  KnotenId BIGINT UNSIGNED NOT NULL,
  Zeitpunkt TIMESTAMP NOT NULL,
  FOREIGN KEY(SpielerId) REFERENCES Spieler(Id),
  FOREIGN KEY(KnotenId) REFERENCES Knoten(Id),
  CONSTRAINT UNIQUE(SpielerId)
)ENGINE=INNODB;

CREATE TABLE Abfrage
(
  SpielerId BIGINT UNSIGNED NOT NULL,
  KnotenId BIGINT UNSIGNED NOT NULL,
  Zeitpunkt TIMESTAMP NOT NULL,
  Erfolg BOOL,
  CONSTRAINT UNIQUE(SpielerId, KnotenId, Zeitpunkt)
)ENGINE=INNODB;

CREATE TABLE Misterx
(
  KnotenId BIGINT UNSIGNED NOT NULL,
  Zeitpunkt TIMESTAMP NOT NULL,
  FOREIGN KEY(KnotenId) REFERENCES Knoten(Id),
  CONSTRAINT UNIQUE(KnotenId, Zeitpunkt)
)ENGINE=INNODB;

CREATE TABLE Kante
(
  Knoten1Id BIGINT UNSIGNED NOT NULL,
  Knoten2Id BIGINT UNSIGNED NOT NULL,
  FOREIGN KEY(Knoten1Id) REFERENCES Knoten(Id),
  FOREIGN KEY(Knoten2Id) REFERENCES Knoten(Id),
  CONSTRAINT UNIQUE(Knoten1Id, Knoten2Id)
)ENGINE=INNODB;

CREATE TABLE Richtungspunkt
(
  Knoten1Id BIGINT UNSIGNED NOT NULL,
  Knoten2Id BIGINT UNSIGNED NOT NULL,
  Nummer BIGINT NOT NULL,
  Longitude DOUBLE NOT NULL,
  Latitude DOUBLE NOT NULL,
  FOREIGN KEY(Knoten1Id) REFERENCES Kante(Knoten1Id),
  FOREIGN KEY(Knoten2Id) REFERENCES Kante(Knoten2Id),
  CONSTRAINT UNIQUE(Knoten1Id, Knoten2Id, Nummer)
)ENGINE=INNODB;