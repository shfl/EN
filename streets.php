<?php
ini_set('max_execution_time', 600);
require_once('include.php');
$mainList = '<ul class="main-list">';
$secondaryList = '<ul class="secondary-list">';
$streets = DB::getInstance()->query("SELECT * FROM `streets` ORDER BY `title` ASC");
foreach($streets as $street)
{
    $elemClass = '';
    $crossroadsList = '';
    $crossroads = DB::getInstance()->query("SELECT 
                                            s.*
                                            FROM `crossroads` AS c
                                            LEFT JOIN `streets` AS s ON(s.`id`=c.`crossed_street_id`)
                                            WHERE c.`main_street_id`='$street[id]'
                                            ORDER BY s.`title` ASC");
    if(count($crossroads) > 0)
    {
        $elemClass = 'crossroads-expand-active icon-chevron-right';
        $crossroadsList = '<ul>';
        foreach($crossroads as $crossroad)
        {
            $crossroadsList .= '<li data-id="'.$crossroad['id'].'" data-title="'.$crossroad['title'].'" data-lat="'.$crossroad['lat'].'" data-lng="'.$crossroad['lng'].'">'.$crossroad['title'].'</li>';
        }
        $crossroadsList .= '</ul>';
    }
    $mainList .= '<li class="street-elem" data-lat="'.$street['lat'].'" data-lng="'.$street['lng'].'" data-id="'.$street['id'].'">
                    <i class="crossroads-expand '.$elemClass.'"></i><a href="">'.$street['title'].'</a>
                  '.$crossroadsList.'
                  </li>';
    $secondaryList .= '<li data-title="'.$street['title'].'">'.$street['title'].'<i class="add-crossroad icon-plus" data-id="'.$street['id'].'"></i></li>';
}

$mainList .= '</ul>';
$secondaryList .= '
    </ul>';
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">

<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="author" content="Artem Vasyleiko" />
    <script src="js/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAXCzqFcqL-I0UvcbBdNmd0hivkZatBk1k&sensor=false"></script>
    <script type="text/javascript" src="js/streets.js"></script>
    <link href="css/bootstrap.css" rel="stylesheet" type="text/css" />
    <link href="css/streets.css" rel="stylesheet" type="text/css" />
	<title>Streets</title>
</head>
<body>
<div class="row">
    <div class="span3">
        <h5>Choose main street:</h5>
        <?=$mainList?>
    </div>
    <div class="span3">
        <h5>Add some crossroads:</h5>
        <form class="search-form">
            <input type="text" placeholder="Street" class="street-input">
        </form>
        <?=$secondaryList?>
    </div>
    <div class="crossroads span3">
        <h5>Fill coords data:</h5>
        <div class="alert alert-block alert-main-street">
          Choose main street first
        </div>
        <div class="alert alert-success alert-saved">
          Crossroads successfully saved<br />
          <a href="" class="clear-crossroads">Clear list</a>
        </div>
        <button class="btn btn-info save-crossroads" type="button">Save</button>
    </div>
    <div class="span6">
        <h5>Find crossroads:</h5>
        <div id="map"></div>
    </div>
</div>
</body>
</html>