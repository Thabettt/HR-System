# HR System - Role-Based Employee Seeding Guide

## Overview

This document describes the hardcoded employee profiles for each system role and how to seed them into the database.

## Available Roles

The system supports the following 12 roles with different permissions:

### 1. **System Admin**
- **Employee**: Ahmed Hassan (EMP-ADMIN-001)
- **Email**: ahmed.hassan@company.com
- **Password**: Password@EMP-ADMIN-001
- **Permissions**: Full system access - create/read/update/delete all entities, approve changes, manage system

### 2. **HR Manager**
- **Employee**: Fatima Mohammed (EMP-HR-001)
- **Email**: fatima.mohammed@company.com
- **Password**: Password@EMP-HR-001
- **Permissions**: Create/update employees, manage recruitment, approve change requests, view payroll

### 3. **HR Admin**
- **Employee**: Samira Ali (EMP-ADMIN-002)
- **Email**: samira.ali@company.com
- **Password**: Password@EMP-ADMIN-002
- **Permissions**: Create/update employee records, process change requests, manage employee files

### 4. **HR Employee**
- **Employee**: Karim Ibrahim (EMP-HR-002)
- **Email**: karim.ibrahim@company.com
- **Password**: Password@EMP-HR-002
- **Permissions**: Create candidates, manage recruitment, process change requests

### 5. **Department Head**
- **Employee**: Mohamed Saleh (EMP-DEPT-001)
- **Email**: mohamed.saleh@company.com
- **Password**: Password@EMP-DEPT-001
- **Permissions**: View team, approve leaves, manage performance, view payroll

### 6. **Department Employee**
- **Employee**: Nour Khalil (EMP-DEPT-002)
- **Email**: nour.khalil@company.com
- **Password**: Password@EMP-DEPT-002
- **Permissions**: View own profile, update own profile, submit requests, view own payroll

### 7. **Payroll Manager**
- **Employee**: Layla Ahmed (EMP-PAYROLL-001)
- **Email**: layla.ahmed@company.com
- **Password**: Password@EMP-PAYROLL-001
- **Permissions**: Read/update payroll, process payroll, export reports

### 8. **Payroll Specialist**
- **Employee**: Khaled Hassan (EMP-PAYROLL-002)
- **Email**: khaled.hassan@company.com
- **Password**: Password@EMP-PAYROLL-002
- **Permissions**: Read/update payroll, view reports

### 9. **Recruiter**
- **Employee**: Dina Mustafa (EMP-RECRUIT-001)
- **Email**: dina.mustafa@company.com
- **Password**: Password@EMP-RECRUIT-001
- **Permissions**: Create/update candidates, manage recruitment, process interviews

### 10. **Finance Staff**
- **Employee**: Amira Shawky (EMP-FINANCE-001)
- **Email**: amira.shawky@company.com
- **Password**: Password@EMP-FINANCE-001
- **Permissions**: View payroll, view budget, view reports, export financial data

### 11. **Legal & Policy Admin**
- **Employee**: Wael Karim (EMP-LEGAL-001)
- **Email**: wael.karim@company.com
- **Password**: Password@EMP-LEGAL-001
- **Permissions**: Create/update policies, manage compliance, view reports

## How to Seed the Database

### Prerequisites
- MongoDB running locally or connection string configured
- Environment variable `MONGO_URI` set (optional, defaults to `mongodb://localhost:27017/hr-system`)

### Method 1: Using npm Script

```bash
# Install dependencies first
npm install

# Run the seeding script
npm run seed:roles
```

### Method 2: Using ts-node directly

```bash
MONGO_URI="mongodb://localhost:27017/hr-system" ts-node src/seeds/seed-roles.ts
```

### Method 3: Using compiled JavaScript (after build)

```bash
npm run build
MONGO_URI="mongodb://localhost:27017/hr-system" node dist/seeds/seed-roles.js
```

## What Gets Seeded

The seeding script:

1. **Connects to MongoDB** using the provided URI
2. **Clears existing data** - deletes all employee profiles and system roles
3. **Creates 11 employee profiles** - one for each role with complete information including:
   - Personal information (name, email, phone, address)
   - Employment details (hire date, contract type, bank info)
   - System role assignment
   - Permission assignments based on role
4. **Creates system role records** - links employees to their roles and permissions
5. **Sets accessProfileId** - updates employees with their role reference

## Database Collections Modified

### `employee_profiles`
- Stores 11 new employee records with all details
- Password hashed using bcrypt
- Status set to ACTIVE for all employees

### `employee_system_roles`
- Stores 11 new role records
- Each role has specific permissions based on job function
- isActive set to true for all

## Login Examples

After seeding, you can login with any employee:

```bash
# System Admin
POST /api/auth/login
{
  "email": "ahmed.hassan@company.com",
  "password": "Password@EMP-ADMIN-001"
}

# HR Manager
POST /api/auth/login
{
  "email": "fatima.mohammed@company.com",
  "password": "Password@EMP-HR-001"
}

# Department Employee
POST /api/auth/login
{
  "email": "nour.khalil@company.com",
  "password": "Password@EMP-DEPT-002"
}
```

## Testing Roles

### Test System Admin Access
```bash
# Login as System Admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmed.hassan@company.com",
    "password": "Password@EMP-ADMIN-001"
  }'

# Use token to create new employee
curl -X POST http://localhost:3000/api/employee-profile \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d {...}
```

### Test Department Employee Access
```bash
# Login as Department Employee
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nour.khalil@company.com",
    "password": "Password@EMP-DEPT-002"
  }'

# Try to update own profile (should succeed)
curl -X PATCH http://localhost:3000/api/employee-profile/{employee-id} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d {...}
```

## Troubleshooting

### Script fails to connect to MongoDB
- Ensure MongoDB is running
- Check MONGO_URI environment variable is correct
- Verify connection string format: `mongodb://localhost:27017/database-name`

### "Cannot find module" errors
- Run `npm install` to install dependencies
- Ensure TypeScript is compiled: `npm run build`
- Use `ts-node` directly for development

### Schema validation errors
- Check that all required fields in role.json match schema definitions
- Verify email addresses are unique
- Check that systemRole values match enum values

## Files Reference

- **Role Definitions**: `/docs/role.json` - JSON file with all 11 employee profiles
- **Seeding Script**: `/src/seeds/seed-roles.ts` - TypeScript script to seed the database
- **Employee Schema**: `/src/employee-profile/models/employee-profile.schema.ts`
- **Role Schema**: `/src/employee-profile/models/employee-system-role.schema.ts`
- **Enums**: `/src/employee-profile/enums/employee-profile.enums.ts` - SystemRole enum

## Notes

- All passwords follow format: `Password@{employeeNumber}`
- All employees are created with ACTIVE status
- All roles are active (isActive = true)
- Mohamed Saleh and Nour Khalil are in same department for hierarchical testing
- Documents are dated to represent realistic employment history
