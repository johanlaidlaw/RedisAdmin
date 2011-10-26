<?php

include('lib/redis/RedisClient.php');
include('lib/redis/Redis.php');
include('Router.php');
include('controllers/ApplicationController.php');


// http://blog.sosedoff.com/2009/07/04/simpe-php-url-routing-controller/
$r = new Router(); // create router instance 

/* 
$r->map('/', array('controller' => 'home')); // main page will call controller "Home" with method "index()"
$r->map('/login', array('controller' => 'auth', 'action' => 'login'));
$r->map('/logout', array('controller' => 'auth', 'action' => 'logout'));
$r->map('/signup', array('controller' => 'auth', 'action' => 'signup'));
$r->map('/profile/:action', array('controller' => 'profile')); // will call controller "Profile" with dynamic method ":action()"
$r->map('/users/:id', array('controller' => 'users'), array('id' => '[\d]{1,8}')); // define filters for the url parameters
*/
 
$r->map('/search', array('controller' => 'search', 'action' => 'index'));
$r->map('/', array('controller' => 'home')); 

$r->default_routes();
$r->execute();


$class_name =  $r->controller_name.'Controller';
$path_to_controller = 'controllers/'.$class_name.'.php';

if(is_file($path_to_controller))
	require_once($path_to_controller);
else{
	echo "Controller not found!";exit;
	
}
$dispatch = new $class_name;
if(!method_exists($dispatch, $r->action)){
	echo "Action '$r->action' not specified in $r->controller_name controller";exit;
}else{
	call_user_func_array(array($dispatch, "setParams"), array($r->params));
	call_user_func(array($dispatch,$r->action));		
}


?>