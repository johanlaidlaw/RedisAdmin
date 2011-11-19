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
		$typeObj = $r->getTypeObj($key);
		$values = $typeObj->getAllValues($key);
        ksort($values);
		echo json_encode($values);
	}

	
	function setValueForField(){
		$key = $this->params['key'];
		$field = $this->params['field'];
		$new_value = $this->params['value'];
		$r = new lib\redis\Redis();
		$typeObj = $r->getTypeObj($key);
		$bool = $typeObj->setValueForField($key, $field, $new_value);
		echo json_encode($bool);
	}

}



?>