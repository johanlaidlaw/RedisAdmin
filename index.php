<?php

session_start();

include('lib/redis/RedisClient.php');
include('lib/redis/Redis.php');
include('Router.php');
include('controllers/ApplicationController.php');
include('controllers/RedisController.php');
include('controllers/iRedisType.php');
include('bootstrap.php');

// http://blog.sosedoff.com/2009/07/04/simpe-php-url-routing-controller/
$r = new Router(); // create router instance 
$r->map('/search', array('controller' => 'search', 'action' => 'index'));
$r->map('/', array('controller' => 'home')); 
$r->default_routes();
$r->execute();


$class_name =  $r->controller_name.'Controller';
$path_to_controller = 'controllers/'.$class_name.'.php';

if(is_file($path_to_controller))
	require_once($path_to_controller);
else{
	echo '<div class="error">Controller not found!</div>';exit;
	
}
$dispatch = new $class_name;
if(!method_exists($dispatch, $r->action)){
	echo '<div class="error">Action <b>'.$r->action.'</b> not specified in <b>'.$r->controller_name.'Controller</b></div>';exit;
}else{
	call_user_func_array(array($dispatch, "setParams"), array($r->params));
	call_user_func(array($dispatch,$r->action));		
}


?>