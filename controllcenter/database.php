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

    if ($_POST['action']=='getrtw') {
        $sqlstatement = "SELECT * FROM `vehicles` WHERE `vehicletype` = 1 ORDER BY `vehiclename` ASC" ;
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

    if ($_POST['action']=='getnef') {
        $sqlstatement = "SELECT * FROM `vehicles` WHERE `vehicletype` = 0 ORDER BY `vehiclename` ASC";
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

    if ($_POST['action']=='pushdispatch') {
        foreach ($_POST['vehicles'] AS $vehicle) {
            $sqlstatement = "UPDATE `vehicles` SET `actionid`=" . $_POST['id'] . ",`lastposition`='Einsatz => " . $_POST['id'] . "'  WHERE `vehicleid`=".$vehicle;
            echo $sqlstatement . "/n";
            $statement = $pdo->prepare($sqlstatement);
            $statement->execute();
            echo $vehicle;
        }
        foreach ($_POST['vehicles'] AS $vehicle) {
            $sqlstatement = "SELECT * FROM `vehicles` WHERE `vehicleid`=".$vehicle;
            $statement = $pdo->prepare($sqlstatement);
            $statement->execute();
            $row = $statement->fetch();
            $data = $data . $row['vehiclename'] . "|";
        }
        echo $data;
        $sqlstatement = "UPDATE `actions` SET `vehicles`='" . substr($data, 0, -1) . "' WHERE `enr`=".$_POST['id'];
        $statement = $pdo->prepare($sqlstatement);
        $statement->execute();
        echo $sqlstatement;
    }

    if ($_POST['action']=='getusers') {
        if ($_POST['what']=='onduty') {$duty = 1;}
        if ($_POST['what']=='offduty') {$duty = 0;}
        if ($_POST['what']=='vacation') {$duty = 2;}
        if ($_POST['what']=='oncall') {$duty = 3;}

        $sqlstatement = "SELECT * FROM `users` WHERE `onduty` = " . $duty . " ORDER BY `id` ASC" ;
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

    if ($_POST['action']=='deleteaction') {
        $sqlstatement = "DELETE FROM `actions` WHERE `enr` = " . $_POST['id'] ;
        $statement = $pdo->prepare($sqlstatement);
        $statement->execute();
        $sqlstatement = "UPDATE `vehicles` SET `lastposition`='',`actionid`=0 WHERE `actionid`=" . $_POST['id'] ;
        $statement = $pdo->prepare($sqlstatement);
        $statement->execute();
    }
    
    if ($_POST['action']=='deleteaction') {
        $sqlstatement = "DELETE FROM `actions` WHERE `enr` = " . $_POST['id'] ;
        $statement = $pdo->prepare($sqlstatement);
        $statement->execute();
        $sqlstatement = "UPDATE `vehicles` SET `lastposition`='',`actionid`=0 WHERE `actionid`=" . $_POST['id'] ;
        $statement = $pdo->prepare($sqlstatement);
        $statement->execute();
    }