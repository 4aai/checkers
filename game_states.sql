-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Хост: 10.0.0.46
-- Время создания: Июн 27 2022 г., 22:00
-- Версия сервера: 5.7.35-38
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `f0678263_checkers`
--

-- --------------------------------------------------------

--
-- Структура таблицы `game_states`
--

CREATE TABLE `game_states` (
  `game_id` int(11) NOT NULL,
  `game_key` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `game_owner` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `game_owner_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `game_slave` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `game_slave_name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `game_owner_color` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `game_slave_color` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_turn` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `game_state` text COLLATE utf8_unicode_ci NOT NULL,
  `game_chat_owner` text COLLATE utf8_unicode_ci NOT NULL,
  `game_chat_owner_n` int(11) NOT NULL DEFAULT '0',
  `game_chat_slave` text COLLATE utf8_unicode_ci NOT NULL,
  `game_chat_slave_n` int(11) NOT NULL DEFAULT '0',
  `game_date_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Дамп данных таблицы `game_states`
--

INSERT INTO `game_states` (`game_id`, `game_key`, `game_owner`, `game_owner_name`, `game_slave`, `game_slave_name`, `game_owner_color`, `game_slave_color`, `user_turn`, `game_state`, `game_chat_owner`, `game_chat_owner_n`, `game_chat_slave`, `game_chat_slave_n`, `game_date_creation`) VALUES
(14, 'd509a927dd08059998d75aa7c39171a4461a366a', 'user_83fd5c53013877e7b505e04b46116510e79224c0', 'Паша', 'user_86bcfc70189ebc44075e49667d5b59dec1309d82', 'Player', 'red', 'blue', 'blue', '[[\" \",\" \",\" \",\"X\",\" \",\"X\",\" \",\"X\"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\" \",\" \",\" \",\" \",\" \",\"X\",\" \",\"X\"],[\" \",\" \",\" \",\" \",\"O\",\" \",\" \",\" \"],[\" \",\"OK\",\" \",\" \",\" \",\" \",\" \",\" \"],[\"O\",\" \",\" \",\" \",\" \",\" \",\"O\",\" \"],[\" \",\" \",\" \",\" \",\" \",\"O\",\" \",\"O\"],[\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \"]]', '[{\"user\":\"Player123\",\"message\":\"aezakmi\"}]', 1, '', 0, '2022-06-27 08:19:29'),
(15, 'd025dfd3d05b3118e74ab0616a8af5a8565ad414', 'user_eb25897ad1301b6e76751a5b4246ffc13dfa3887', 'Player', 'user_0f34606c836786994ec097849b1ed110e4fedcab', 'Player', 'red', 'blue', 'red', '[[\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\"],[\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \"],[\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \"],[\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\"],[\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \"]]', '[{\"user\":\"Player\",\"message\":\"\\u0443\\u0432\\u0443\\u0432\"},{\"user\":\"Player\",\"message\":\"\\u0432\\u0443\\u0432\"},{\"user\":\"Player\",\"message\":\"\\u0430\\u043a\\u0430\"}]', 3, '', 0, '2022-06-27 08:27:59'),
(16, 'e1de975f0bbc5c239f309bed513b7ef9bbeeb28a', 'user_d84ab8ca12f80fec5fc919bbfc8c890a4bed145b', 'Player1', '', '', 'red', 'blue', 'red', '[[\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\"],[\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \"],[\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \"],[\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\"],[\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \"]]', '', 0, '[{\"user\":\"Player1\",\"message\":\"\"},{\"user\":\"Player1\",\"message\":\"\"}]', 2, '2022-06-27 08:32:23'),
(17, 'e492bfeb8008b6180e3e55bbadf79e8b81ad4f17', 'user_734a96863569edfab0cd34818298f5a2bfb6e6a4', 'Ololosh', 'user_c9e92800fd4bc54654735475a5d6f4da27f1a49e', 'Lololosh', 'red', 'blue', 'red', '[[\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\"],[\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \"],[\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \"],[\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\"],[\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \"]]', '[{\"user\":\"Lololosh\",\"message\":\"\"},{\"user\":\"Lololosh\",\"message\":\"\"},{\"user\":\"Lololosh\",\"message\":\"\"}]', 3, '', 0, '2022-06-27 08:55:18'),
(18, '3308d5e0b10dd9dbe89bd6cbe05bded1cc5a32c9', 'user_35f7567c5b6ede6929ede9ba5c68623c5a6590fa', 'AnastasyaPlayer', '', '', 'blue', 'red', 'red', '[[\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\"],[\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \"],[\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \"],[\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\"],[\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \"]]', '', 0, '', 0, '2022-06-27 08:58:53'),
(19, '1cf670d6a3786672eabfb23a67b97be69757b315', 'user_032c9dc35e3fce8bc69140f37b8fe7fbb3c0e3ca', 'user', 'user_fc8298c040c9245808c4ba38633703b726001dc1', 'ПейЧай', 'blue', 'red', 'blue', '[[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\"X\"],[\"XK\",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\" \",\"X\",\" \",\"X\",\" \",\" \",\" \",\"X\"],[\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \"]]', '', 0, '[{\"user\":\"4aai\",\"message\":\"aezakmi\"}]', 1, '2022-06-27 11:37:31'),
(20, 'd130e8f75a89f339ae783028546be665d60279eb', 'user_ae8b0122f8f11a385bf162dc84ee167ab7593a6d', 'admin', 'user_0a91096c04d825be6a2b132fa85e8d8ed6d9544c', 'Playerвыв', 'blue', 'red', 'red', '[[\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\"],[\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \"],[\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \"],[\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\"],[\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \"]]', '[{\"user\":\"Player\\u0432\\u044b\\u0432\",\"message\":\"aezakmi\"}]', 1, '', 0, '2022-06-27 11:49:10'),
(21, 'a399fe3bfe2d50f06de047a54152de167635ff61', 'user_b98d157f53039862cb2dac38d1ce917b37652d0e', 'Player', '', '', 'red', 'blue', 'red', '[[\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\"],[\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \"],[\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \"],[\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\"],[\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \"]]', '', 0, '[{\"user\":\"Player\",\"message\":\"\"}]', 1, '2022-06-27 11:57:37'),
(22, '3962ccfee32515b4e3a3398c2f554beba7c0bdd4', 'user_d8d779b5b56c8204f8e48e5f6d5dc896315fbb67', 'Тест', 'user_43204f0d5babc45f1a0d3df70ff5c2fc753c623a', 'Player', 'red', 'blue', 'blue', '[[\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\"],[\"X\",\" \",\"X\",\" \",\"X\",\" \",\" \",\" \"],[\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \",\" \"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\"O\"],[\"O\",\" \",\"O\",\" \",\" \",\" \",\" \",\" \"],[\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \",\"X\"],[\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \"]]', '[{\"user\":\"Player\",\"message\":\"aezakmi\"}]', 1, '', 0, '2022-06-27 18:49:51'),
(23, '6b8eda7ac624802c526154d5a0983746ca30589a', 'user_1aae75db89a2479ef3f5aa94488ff3f3fadc353c', 'Player', '', '', 'red', 'blue', 'red', '[[\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\"],[\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \"],[\" \",\"X\",\" \",\"X\",\" \",\"X\",\" \",\"X\"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\" \",\" \",\" \",\" \",\" \",\" \",\" \",\" \"],[\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \"],[\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\"],[\"O\",\" \",\"O\",\" \",\"O\",\" \",\"O\",\" \"]]', '', 0, '[{\"user\":\"Player\",\"message\":\"aezakmi\"}]', 1, '2022-06-27 18:52:25');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `game_states`
--
ALTER TABLE `game_states`
  ADD PRIMARY KEY (`game_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `game_states`
--
ALTER TABLE `game_states`
  MODIFY `game_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
