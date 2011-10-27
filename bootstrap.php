<?php
function autoloader($class_name)
{
	// The class_name is with namespace E.g lib\redis\RedisHash
	// Convert it to lib/redis/RedisHash.php
    $file = str_replace('\\','/',$class_name) . '.php';
    if (file_exists($file))
    {
        require_once($file);
    }
}

spl_autoload_register('autoloader');


?>