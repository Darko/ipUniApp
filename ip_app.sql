-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Feb 08, 2017 at 05:07 PM
-- Server version: 5.5.42
-- PHP Version: 5.6.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `ip_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `playlist_followers`
--

CREATE TABLE `playlist_followers` (
  `id` int(11) NOT NULL,
  `playlistId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `playlist_followers`
--

INSERT INTO `playlist_followers` (`id`, `playlistId`, `userId`) VALUES
(1, 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `playlist_followers`
--
ALTER TABLE `playlist_followers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `playlistId` (`playlistId`),
  ADD KEY `userId` (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `playlist_followers`
--
ALTER TABLE `playlist_followers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `playlist_followers`
--
ALTER TABLE `playlist_followers`
  ADD CONSTRAINT `playlist_followers_ibfk_1` FOREIGN KEY (`playlistId`) REFERENCES `playlists` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `playlist_followers_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
