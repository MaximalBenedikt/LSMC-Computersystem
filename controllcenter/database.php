<?php
    $pdo = new PDO('mysql:host=localhost;dbname=lsmc', 'root', '');


    if($_POST['action']=='newaction') {
        $statement = $pdo->prepare("INSERT INTO `actions` (`date`, `time`) VALUES ('" . $_POST['date'] . "', '" . $_POST['time'] . "')");
        $statement->execute();
        $statement = $pdo->prepare("SELECT * FROM `actions` ORDER BY `enr` DESC limit 1");
        $statement->execute();
        $result = $statement->fetch();
        echo $result['enr'];
    }

    if($_POST['action']=='saveaction') {
        $sqlstatement = "UPDATE `actions` SET `object` = '" . $_POST['locationobject'] . "' , `position` = '" . $_POST['location'] . "' , `longterm` = '" . $_POST['keywordexpanded'] . "' , `shortterm` = '" . $_POST['keywordshort'] . "' , `callername` = '" . $_POST['callername'] . "' , `callerid` = '" . $_POST['callerid'] . "' , `comment` = '" . $_POST['comment'] . "' , `prio` = '" . $_POST['prio'] . "' , `active` = '1' , `specialrights` = '" . $_POST['sirene']. "' WHERE `enr`=" . $_POST['enr'];
        $statement = $pdo->prepare($sqlstatement);
        $statement->execute();
    }

    if ($_POST['action']=='getlastactions') {
        $sqlstatement = "SELECT `enr`, `date`, `time`, `object`, `position`, `longterm`, `vehicles` FROM `actions` WHERE `active` = 1";
        $statement = $pdo->prepare($sqlstatement);
        $statement->execute();
        $i=0; 
        $data = array();
        while ($row = $statement->fetch()) {
            $data[$i] = $row;
            $i++;
        }
        echo json_encode($data);
    }

    if ($_POST['action']=='getaction') {
        $sqlstatement = "SELECT `enr`, `date`, `time`, `object`, `position`, `longterm`, `shortterm`, `callername`, `callerid`, `comment`, `prio`, `vehicles`, `active`, `specialrights` FROM `actions` WHERE `enr` = " . $_POST['id'];
        $statement = $pdo->prepare($sqlstatement);
        $statement->execute();
        $row = $statement->fetch();
        echo json_encode($row);
    }

    if ($_POST['action']=='getvehicles') {
        $sqlstatement = "SELECT * FROM `vehicles` ORDER BY `vehicletype` ASC, `vehiclename` ASC";
        $statement = $pdo->prepare($sqlstatement);
        $statement->execute();
        $i=0;
        $data = array();
        while ($row = $statement->fetch()) {
            $data[$i] = $row;
            $i++;
        }
        echo json_encode($data);
    }

    if ($_POST['action']=='getuser') {
        $sqlstatement = "SELECT * FROM `users` WHERE `id` = " . $_POST['id'];
        $statement = $pdo->prepare($sqlstatement);
        $statement->execute();
        $data = $statement->fetch();
        echo json_encode($data);
    }