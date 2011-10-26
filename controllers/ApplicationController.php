<?php
class ApplicationController{
	
	var $params = array();
	
	
	function __construct(){
		
	}
	
	
	
	
	
	
	
	
	
	
	
	function render($file = false){
		if(!$file){
			$backtrace = debug_backtrace();
			$callee = $backtrace[1]['function'];
	        $callee = strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $callee));
	 		$class = strtolower(stripslashes(preg_replace(array('/Controller/'),"",get_class($this))));
			$file = $class.'/'.$callee.'.php';	
		}
		$file = 'view/'.$file;
		include('view/application/header.php');
		include($file);	
		include('view/application/footer.php');
	}
	
	function setParams($params){
		$this->params = $params;
	}
	
}


?>