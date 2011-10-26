<?php
class RedisController extends ApplicationController{

	function exec(){
		$command = $this->params['command'];
		$key = $this->params['key'];
		$redis = lib\redis\RedisClient::getPredisObject();
		$output = call_user_func_array(array($redis, $command), array($key));
		echo json_encode($output);
	}
	
	function get_values(){
		$key = $this->params['key'];
		$r = new lib\redis\Redis();
		$values = $r->getAllValues($key);
		echo json_encode($values);
	}

	

}



?>