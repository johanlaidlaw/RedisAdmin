<?php
class HomeController extends ApplicationController {

	function index(){
;        try {
            $this->redis = lib\redis\RedisClient::getPredisObject();
            $this->set('server_info',$this->redis->info());
            $this->set("environments", $this->Config->exists("environment") ? $this->Config->get("environment") : false);
        } catch(Exception $e){
            $this->set("redis_error",true);
        }
		$this->render();
	}
}



?>