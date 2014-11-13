<?php 

/*
 * Create your own environment.php file like this

<?php
define('REDIS_DB_HOST', '127.0.0.1');
define("REDIS_DB_PASSWORD", "mypassword");
?>


 */

$config = array();

// First read the settings for this environment!
if(is_readable(dirname(__FILE__).'/environment.php')) {
	include(dirname(__FILE__) . '/environment.php');
} else {
	echo '<h2>Ooops..</h2>';
	echo 'You should create your own environment.php in "'.($_SERVER['DOCUMENT_ROOT'].'/environment.php').'" with your own environment-specific constants!<br />';
	echo 'See "'.$_SERVER['DOCUMENT_ROOT'].'/environment.default.php'.'" for more info.<br />';
	exit;
}


function defineIfUndefined($name, $value) {
	if(!defined($name))define($name,$value);
}

defineIfUndefined('REDIS_DB_HOST', '127.0.0.1');
defineIfUndefined("REDIS_DB_PORT", 6379);
defineIfUndefined('REDIS_DB_PASSWORD', '');
