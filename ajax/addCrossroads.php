<?php
require_once('../include.php');

DB::getInstance()->query("DELETE FROM `crossroads` WHERE `main_street_id`='$_POST[main_street_id]'");

foreach($_POST['crossroads'] as $crossroad)
{
    DB::getInstance()->query("INSERT INTO `crossroads` SET `main_street_id`='$_POST[main_street_id]', `crossed_street_id`='$crossroad[id]', `lat`='$crossroad[lat]', `lng`='$crossroad[lng]'");
}
echo 'done';

?>