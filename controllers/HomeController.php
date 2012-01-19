<?php
class HomeController extends ApplicationController{
	function index(){

        $this->redis = lib\redis\RedisClient::getPredisObject();
        $server_info = $this->redis->info();

        $this->set('server_info',$server_info);
		$this->render();
	}
}



?>