<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Search</title>
</head>
<body>
<form method="GET">
  <div>
    Search Term: <input type="search" id="q" name="q" placeholder="Enter Search Term">
  </div> <br>
  <div>
    Max Results: <input type="number" id="maxResults" name="maxResults" min="1" max="50" step="1" value="3">
  </div>
  <input type="submit" value="Search">
</form>
<br/>
</body>
</html>

<?php
if (isset($_GET['q']) && $_GET['maxResults']){
	$q=$_GET['q'];
  $q= preg_replace('/\s+/', '%20', $q);
	$maxResults=$_GET['maxResults'];
	// $DEVELOPER_KEY = 'AIzaSyDOkg-u9jnhP-WnzX5WPJyV1sc5QQrtuyc';
    $DEVELOPER_KEY = 'AIzaSyBv_P2KGXgnz1S14bgfrIiNHT4tQC8DQbg'; // kluc
	$url='https://www.googleapis.com/youtube/v3/search?q='.$q.'&maxResults='.$maxResults.'&part=snippet&key='.$DEVELOPER_KEY;
	//echo $url."<br>";
	$data = file_get_contents($url);
	echo $data;
}
?>
