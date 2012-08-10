<?php

class Config {

    private $data = array();

    function __construct($data){
        foreach($data as $group_key => $group){
            foreach($group as $key => $value){
                $this->add($group_key, $key, $value);
            }
        }
    }

    public function add($group, $key, $value){
        $this->data[$group][$key] = $value;
    }

    public function exists($name){
        return isset($this->data[$name]);
    }

    public function get($name, $key = false){
        return $key ? $this->data[$name][$key] : $this->data[$name];
    }

}
