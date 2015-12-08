<?php
if(isset($_POST)){
	$str = is_array($_FILES['file']['name'])?implode(', ', $_FILES['file']['name']):$_FILES['file']['name'];
	echo '{"status": "success", "updateExtra": true, "affectedElement": "#fileStatus", "content":"Uploaded Successfully : '.$str.'"}';
}

?>