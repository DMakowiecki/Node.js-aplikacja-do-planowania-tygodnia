-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2024 at 12:57 AM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `node_todo`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `shared_tasks`
--

CREATE TABLE `shared_tasks` (
  `id` int(11) NOT NULL,
  `task` text NOT NULL,
  `shared_by_user_id` int(11) NOT NULL,
  `shared_with_user_id` int(11) NOT NULL,
  `task_status` enum('Zrobiony','Niezrobiony') NOT NULL DEFAULT 'Niezrobiony'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shared_tasks`
--

INSERT INTO `shared_tasks` (`id`, `task`, `shared_by_user_id`, `shared_with_user_id`, `task_status`) VALUES
(1, 'aa', 2, 3, 'Zrobiony'),
(2, 'te', 2, 3, 'Niezrobiony'),
(3, 'a', 3, 3, 'Niezrobiony'),
(4, 'a', 3, 3, 'Niezrobiony'),
(5, 'a', 2, 3, 'Niezrobiony'),
(6, 'aa', 2, 3, 'Niezrobiony'),
(7, 'aa', 2, 3, 'Niezrobiony'),
(8, 'sdasd', 2, 3, 'Niezrobiony'),
(9, 'a', 2, 3, 'Niezrobiony'),
(10, 'a', 2, 3, 'Niezrobiony'),
(11, 'aa', 2, 3, 'Niezrobiony'),
(12, 'aaee', 2, 3, 'Niezrobiony'),
(13, 'aaee', 2, 3, 'Niezrobiony'),
(14, 'a', 2, 3, 'Niezrobiony'),
(15, 'a', 2, 3, 'Niezrobiony'),
(16, 'aaa', 2, 3, 'Niezrobiony'),
(17, 'aa', 2, 3, 'Niezrobiony'),
(18, 'aaee', 2, 3, 'Niezrobiony'),
(19, 'aaeeee', 2, 3, 'Niezrobiony'),
(20, 'a', 2, 3, 'Niezrobiony'),
(21, 'ee', 2, 3, 'Niezrobiony'),
(22, 'dde', 2, 3, 'Niezrobiony'),
(23, 'dde', 2, 3, 'Niezrobiony'),
(24, 'ee', 2, 3, 'Niezrobiony'),
(25, 'eeeeeeeeeeeeeee', 2, 3, 'Niezrobiony'),
(26, 'te', 2, 3, 'Niezrobiony'),
(27, 'te', 2, 2, 'Niezrobiony'),
(28, 'ee', 2, 3, 'Niezrobiony'),
(29, 'te', 2, 3, 'Niezrobiony'),
(30, 'te', 2, 3, 'Niezrobiony'),
(31, 'tetetete', 2, 3, 'Niezrobiony'),
(32, 'a', 2, 3, 'Niezrobiony'),
(33, 'ee', 2, 1, 'Niezrobiony');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `day_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `task` text DEFAULT NULL,
  `task_status` varchar(20) NOT NULL DEFAULT 'Niezrobione'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `user_id`, `day_week`, `task`, `task_status`) VALUES
(15, 2, 'Thursday', 'asdasda', 'Zrobiony'),
(16, 3, 'Monday', 'Jednak kuchnia', 'Niezrobione'),
(17, 2, 'Monday', 'aaaee', 'Niezrobione');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `iduser` int(11) NOT NULL,
  `username` varchar(45) NOT NULL,
  `password` varchar(60) NOT NULL,
  `email` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`iduser`, `username`, `password`, `email`) VALUES
(1, 'eee', '$2a$10$VfGOcg.LPp9bxWNAud8NLeq.V93uicNUz/8qfWCPpirUuRFj2nEMS', 'eds@as'),
(2, 'te', '$2a$10$Oi6nSDOd0opytDjf68LKR.VmqMSdcLcbMnKhaElRkjy5juZW30OXe', 'te@te'),
(3, 'a', '$2a$10$AWP7y237jBDO0vzwQNC7YevkTM33MJrua4ZTOPK3541r3LMdj0wcW', 'a@a');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `shared_tasks`
--
ALTER TABLE `shared_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `shared_by_user_id` (`shared_by_user_id`),
  ADD KEY `shared_with_user_id` (`shared_with_user_id`);

--
-- Indeksy dla tabeli `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`iduser`),
  ADD UNIQUE KEY `username_UNIQUE` (`username`),
  ADD UNIQUE KEY `password_UNIQUE` (`password`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `shared_tasks`
--
ALTER TABLE `shared_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `iduser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `shared_tasks`
--
ALTER TABLE `shared_tasks`
  ADD CONSTRAINT `shared_tasks_ibfk_1` FOREIGN KEY (`shared_by_user_id`) REFERENCES `users` (`iduser`),
  ADD CONSTRAINT `shared_tasks_ibfk_2` FOREIGN KEY (`shared_with_user_id`) REFERENCES `users` (`iduser`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`iduser`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
