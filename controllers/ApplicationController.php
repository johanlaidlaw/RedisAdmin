<?php
class ApplicationController{
	
	var $params = array();
    var $view = array();

    function set($name, $value){
        $this->view[$name] = $value;
    }
    function get($name){
        if(isset($this->view[$name]))
            return $this->view[$name];
        else return null;
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
		$this->params = array_merge($params,$_POST);
	}
	
}


?>