#!/bin/bash

# Login and get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"fatima.mohammed@company.com","password":"Password@EMP-HR-001"}' \
  | jq -r '.access_token')

echo "Token: $TOKEN"
echo "Decoded Token:"
echo $TOKEN | jq -R 'split(".") | .[1] | @base64d | fromjson'

# 1. Departments
echo "--- Testing Departments ---"
# Create Department
DEPT_ID=$(curl -s -X POST http://localhost:3000/organization-structure/departments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"IT-TEST","name":"IT Test Department","description":"Testing IT Dept"}' \
  | jq -r '._id')
echo "Created Department ID: $DEPT_ID"

# Get All Departments
curl -s -X GET http://localhost:3000/organization-structure/departments \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Get One Department
curl -s -X GET http://localhost:3000/organization-structure/departments/$DEPT_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Update Department
curl -s -X PATCH http://localhost:3000/organization-structure/departments/$DEPT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated IT Test Dept"}' | jq '.'

# Activate/Deactivate
curl -s -X PATCH http://localhost:3000/organization-structure/departments/$DEPT_ID/deactivate \
  -H "Authorization: Bearer $TOKEN" | jq '.'
curl -s -X PATCH http://localhost:3000/organization-structure/departments/$DEPT_ID/activate \
  -H "Authorization: Bearer $TOKEN" | jq '.'


# 2. Positions
echo "--- Testing Positions ---"
# Create Position
POS_ID=$(curl -s -X POST http://localhost:3000/organization-structure/positions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"code\":\"DEV-TEST\",\"title\":\"Test Developer\",\"departmentId\":\"$DEPT_ID\"}" \
  | jq -r '._id')
echo "Created Position ID: $POS_ID"

# Get All Positions
curl -s -X GET http://localhost:3000/organization-structure/positions \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# Get Positions in Department
curl -s -X GET http://localhost:3000/organization-structure/departments/$DEPT_ID/positions \
  -H "Authorization: Bearer $TOKEN" | jq '.'


# 3. Hierarchy
echo "--- Testing Hierarchy ---"
curl -s -X GET http://localhost:3000/organization-structure/hierarchy \
  -H "Authorization: Bearer $TOKEN" | jq '.'


# 4. Assignments
echo "--- Testing Assignments ---"
# Need an employee ID. Let's assume one exists or fetch one.
# Try to get the first employee from the list
echo "Fetching employees..."
CANDIDATES_RESPONSE=$(curl -s -X GET http://localhost:3000/api/employee-profile/candidates \
  -H "Authorization: Bearer $TOKEN")
echo "Candidates Response: $CANDIDATES_RESPONSE"

EMP_RESPONSE=$(curl -s -X GET http://localhost:3000/api/employee-profile \
  -H "Authorization: Bearer $TOKEN")
echo "Employee Response: $EMP_RESPONSE" # Uncomment to debug

EMP_ID=$(echo $EMP_RESPONSE | jq -r '.data[0]._id')
echo "Using Employee ID: $EMP_ID"

if [ "$EMP_ID" != "null" ] && [ "$EMP_ID" != "" ]; then
  echo "Attempting assignment..."
  curl -X POST http://localhost:3000/organization-structure/assignments \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"employeeProfileId\":\"$EMP_ID\",\"positionId\":\"$POS_ID\",\"startDate\":\"2023-01-01\",\"reason\":\"New Hire\"}" \
    -v
else
  echo "No employee found to assign."
fi


# 5. Change Requests
echo "--- Testing Change Requests ---"
# Generate random request number
REQ_NUM="REQ-$(date +%s)"

if [ "$EMP_ID" != "null" ] && [ "$EMP_ID" != "" ]; then
  # Capture full response to debug
  RESPONSE=$(curl -s -X POST http://localhost:3000/organization-structure/change-requests \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"requestNumber\":\"$REQ_NUM\",\"requestedByEmployeeId\":\"$EMP_ID\",\"requestType\":\"NEW_POSITION\",\"details\":\"Requesting new QA position\"}")

  echo "Create Response: $RESPONSE"
  REQ_ID=$(echo $RESPONSE | jq -r '._id')
  echo "Created Request ID: $REQ_ID"

  if [ "$REQ_ID" != "null" ] && [ "$REQ_ID" != "" ]; then
    curl -s -X GET http://localhost:3000/organization-structure/change-requests \
      -H "Authorization: Bearer $TOKEN" | jq '.'

    curl -X PATCH http://localhost:3000/organization-structure/change-requests/$REQ_ID/approve \
      -H "Authorization: Bearer $TOKEN" -v
  else
    echo "Failed to create change request."
  fi
else
  echo "Cannot create change request without Employee ID."
fi

# Cleanup (Optional)
# curl -X DELETE http://localhost:3000/organization-structure/positions/$POS_ID -H "Authorization: Bearer $TOKEN"
# curl -X DELETE http://localhost:3000/organization-structure/departments/$DEPT_ID -H "Authorization: Bearer $TOKEN"
