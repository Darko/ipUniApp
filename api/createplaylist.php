<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Create Playlist</title>
</head>
<body>
<form method="POST">
  <div>
    Name: <input type="text" id="title" name="title" placeholder="Enter Name">
  </div> <br>
  <div>
    Public: <select name="public">
      <option value="1">Yes</option>
      <option value="0">No</option>
    </select>
  </div> <br>
  <input type="submit" value="Create">
</form>
<br/>
</body>
</html>

<?php
require 'functions.php';
if (isset($_POST['title']) && isset($_POST['public'])){
	$title=$_POST['title'];
  $public=$_POST['public'];
  $status=createPlaylist($title, $public);
  if($status===1) echo "Playlist $title is created.";
  else echo "$status";
}
?>
