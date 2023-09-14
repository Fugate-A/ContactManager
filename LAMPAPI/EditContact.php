<?php
    $inData = getRequestInfo();
    
    
    $userID = $inData["userID"];
    $targetProperty = $inData["targetProperty"];
    $newValue = $inData["newValue"];

    $conn = new mysqli("localhost", "TheBeast", "SmallGroupProjectCOP4331C", "COP4331");
    if($conn->connect_error){
        returnWithError($conn->connect_error);
    } else {
        $stmt = $conn->prepare("SELECT UserID FROM Contacts WHERE UserID = ?");
        $stmt->bind_param("s", $userID);
        $stmt->execute();
        $stmt->store_result();
    
        if ($targetProperty === "firstName" || $targetProperty === "lastName" || $targetProperty === "Phone" || $targetProperty === "email") {
            // Update the property for the specified userID
            $stmt = $conn->prepare("UPDATE Contacts SET $targetProperty = ? WHERE UserID = ?");
            $stmt->bind_param("ss", $newValue, $userID);
            $stmt->execute();
            $stmt->close();
            $conn->close();

            returnWithError(ucfirst($targetProperty) . " updated!");
        }
        else {
            returnWithError("Invalid 'targetProperty' value. It should be one of the following:'firstName', 'lastName', 'Phone', or 'email'.");
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