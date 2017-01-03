<?php
require 'connect.php';

function createPlaylist($name, $public){
  global $mysqli;
  $res = $mysqli->query("INSERT INTO playlists(title, public) VALUES('$name', '$public')");
  if (!$res) return $mysqli->error;
  else return 1;
}

?>
