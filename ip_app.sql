-- phpMyAdmin SQL Dump
-- version 4.4.10
-- http://www.phpmyadmin.net
--
-- Host: localhost:8889
-- Generation Time: Jan 04, 2017 at 01:29 AM
-- Server version: 5.5.42
-- PHP Version: 5.6.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `ip_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `playlists`
--

CREATE TABLE `playlists` (
  `id` int(11) NOT NULL,
  `title` varchar(30) NOT NULL,
  `public` tinyint(4) NOT NULL DEFAULT '1',
  `likes` int(11) DEFAULT NULL,
  `dislikes` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `playlist_contents`
--

CREATE TABLE `playlist_contents` (
  `id` int(11) NOT NULL,
  `playlistId` int(11) NOT NULL,
  `songId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `playlist_identity`
--

CREATE TABLE `playlist_identity` (
  `id` int(11) NOT NULL,
  `playlistId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `expiresIn` int(11) NOT NULL,
  `tokenType` varchar(30) NOT NULL,
  `accessToken` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `userName` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(45) NOT NULL,
  `role` varchar(15) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `videos`
--

CREATE TABLE `songs` (
  `id` int(11) NOT NULL,
  `title` varchar(130) NOT NULL,
  `artist` varchar(50) NOT NULL,
  `url` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `playlists`
--
ALTER TABLE `playlists`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `playlist_contents`
--
ALTER TABLE `playlist_contents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `playlist_identity`
--
ALTER TABLE `playlist_identity`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `songs`
--
ALTER TABLE `songs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `playlists`
--
ALTER TABLE `playlists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `playlist_contents`
--
ALTER TABLE `playlist_contents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `playlist_identity`
--
ALTER TABLE `playlist_identity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `songs`
--
ALTER TABLE `songs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;