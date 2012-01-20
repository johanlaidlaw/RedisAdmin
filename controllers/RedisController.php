<?php
class RedisController extends ApplicationController{

	function exec(){
        try {
            $output = array();
            $command = $this->params['command'];
            $key = $this->params['key'];
            $this->setDatabase();
            $redis = lib\redis\RedisClient::getPredisObject();
            $data = call_user_func_array(array($redis, $command), array($key));
            if(count($data) > 1000){
                $data = array_slice($data, 0, 1000);
                $output['message'] = "More than 1000 results found. Only first 1000 displayed.";
            } elseif(count($data) == 0){
                $output['message'] = "No results found";
            }
            $output['data'] = $data;
            $output['error'] = false;
            echo json_encode($output);
        } catch (\Predis\Network\ConnectionException $e) {
            echo json_encode(array(
                "error" => true,
                'message' => "Redis connection refused. Please make sure your Redis database server is running.",
                "empty" => true
            ));
            exit;
        }
	}
	
	function getValues(){
		$key = $this->params['key'];
		$r = new lib\redis\Redis();
        $this->setDatabase();
		$typeObj = $r->getTypeObj($key);
		$values = $typeObj->getAllValues($key);
        ksort($values);
		echo json_encode(array("data" =>$values, "type" => $typeObj->type));
	}

	
	function setValueForField(){
		$key = $this->params['key'];
		$field = $this->params['field'];
		$new_value = $this->params['value'];
        $this->setDatabase();
		$r = new lib\redis\Redis();
		$typeObj = $r->getTypeObj($key);
		$bool = $typeObj->setValueForField($key, $field, $new_value);
		echo json_encode($bool);
	}

    function addMember(){
        $this->setDatabase();
        $r = \lib\redis\RedisClient::getPredisObject();
        $r->hset($this->params['key'], $this->params['member_key'], $this->params['member_value']);
        $this->getValues();
    }

    private function setDatabase(){
        $database = isset($this->params['db']) ? $this->params['db'] : 0;
        $redis = lib\redis\RedisClient::getPredisObject();
        $redis->select($database);
    }

}



?>