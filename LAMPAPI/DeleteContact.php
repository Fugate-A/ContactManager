<?php
$inData = getRequestInfo();

$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phoneNumber = $inData["phoneNumber"];
$userID = $inData["userID"];

$conn = new mysqli("localhost", "TheBeast", "SmallGroupProjectCOP4331C", "COP4331");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("DELETE from Contacts WHERE FirstName = ? AND LastName = ? AND Phone = ? AND UserID = ?");
    $stmt->bind_param("ssss", $firstName, $lastName, $phoneNumber, $userID);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        returnWithSuccess("Contact removed!");
    } else {
        returnWithError("Contact not found or not deleted.");
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithSuccess($message)
{
    $retValue = '{"success":true,"message":"' . $message . '"}';
    sendResultInfoAsJson($retValue);
}
?>
