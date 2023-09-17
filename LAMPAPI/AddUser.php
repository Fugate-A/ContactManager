<?php
    $inData = getRequestInfo();

    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];
    
    $conn = new mysqli("localhost", "TheBeast", "SmallGroupProjectCOP4331C", "COP4331");
    if ($conn->connect_error){
        returnWithError($conn->connect_error);
    } else {
        // Check if a user with the same login already exists
        $checkStmt = $conn->prepare("SELECT * FROM Users WHERE Login = ?");
        $checkStmt->bind_param("s", $login);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
    
        if ($checkResult->num_rows > 0) {
            // User with the same login already exists, return an error
            returnWithError("User with the same login already exists.");
        } else {
            // Insert the new user
            $stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES (?,?,?,?)");
            $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
            $stmt->execute();
            $stmt->close();
            $conn->close();
            returnWithError("");
        }
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

?>