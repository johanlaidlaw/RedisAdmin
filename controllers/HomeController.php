<?php
class HomeController extends ApplicationController{
	function index(){

        try{
            $this->redis = lib\redis\RedisClient::getPredisObject();
            $this->set('server_info',$this->redis->info());

        }catch(Exception $e){
            $this->set("redis_error",true);
        }

		$this->render();
	}
}



?>