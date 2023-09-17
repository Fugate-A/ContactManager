<?php
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phoneNumber = $inData["phoneNumber"];
    $email = $inData["email"];
    $userID = $inData["userID"];

    $conn = new mysqli("localhost", "TheBeast", "SmallGroupProjectCOP4331C", "COP4331");
    if($conn->connect_error){
        returnWithError($conn->connect_error);
    }else{
        $stmt = $conn->prepare("INSERT into Contacts (Firstname, Lastname, Phone, Email, UserID) values(?,?,?,?,?)");
        $stmt->bind_param("sssss", $firstName, $lastName, $phoneNumber, $email, $userID);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            returnWithSuccess("Contact added!");
        } else {
            returnWithError("Contact could not be added.");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err )
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithSuccess($message){
        $retValue = '{"success":true,"message":"' . $message . '"}';
        sendResultInfoAsJson($retValue);
    }

?>