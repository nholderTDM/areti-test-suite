@echo off
echo ======================================================
echo         Areti Alliance Test Suite Runner              
echo ======================================================

set testType=%1
if "%testType%"=="" set testType=all

set baseUrl=%2
if "%baseUrl%"=="" set baseUrl=https://aretialliance.com

set browser=%3
if "%browser%"=="" set browser=firefox

echo Test Type: %testType%
echo Base URL: %baseUrl%
echo Browser: %browser%
echo ======================================================
echo.

REM Set environment variable for Cypress
set CYPRESS_BASE_URL=%baseUrl%

REM Check if cypress.env.json exists
if not exist "cypress.env.json" (
    echo Creating default cypress.env.json file...
    echo { > cypress.env.json
    echo   "AUTH_USERNAME": "demoadmin", >> cypress.env.json
    echo   "AUTH_PASSWORD": "aretidemo", >> cypress.env.json
    echo   "AUTH_TOKEN": "3374021dca7bded335c1c2b15ff77984d52fc4f885e2335d79eb546f2431377f" >> cypress.env.json
    echo } >> cypress.env.json
)

REM Run tests based on the test type parameter
if "%testType%"=="website" (
    echo Running Website E2E tests...
    call npm run test:website -- --browser %browser%
) else if "%testType%"=="crm" (
    echo Running CRM Dashboard E2E tests...
    call npm run test:crm -- --browser %browser%
) else if "%testType%"=="auth" (
    echo Running CRM Authentication tests...
    call npm run test:crm:auth -- --browser %browser%
) else if "%testType%"=="contacts" (
    echo Running CRM Contacts Module tests...
    call npm run test:crm:contacts -- --browser %browser%
) else if "%testType%"=="tasks" (
    echo Running CRM Tasks Module tests...
    call npm run test:crm:tasks -- --browser %browser%
) else if "%testType%"=="organizations" (
    echo Running CRM Organizations Module tests...
    call npm run test:crm:organizations -- --browser %browser%
) else if "%testType%"=="component-website" (
    echo Running Website Components tests...
    call npm run test:component:website -- --browser %browser%
) else if "%testType%"=="component-crm" (
    echo Running CRM Components tests...
    call npm run test:component:crm -- --browser %browser%
) else if "%testType%"=="regression" (
    echo Running Website Regression tests...
    call npm run test:website -- --browser %browser%
    echo Running CRM Regression tests...
    call npm run test:crm -- --browser %browser%
) else if "%testType%"=="all" (
    echo Running Website E2E tests...
    call npm run test:website -- --browser %browser%
    echo Running CRM Dashboard E2E tests...
    call npm run test:crm -- --browser %browser%
    echo Running Website Components tests...
    call npm run test:component:website -- --browser %browser%
    echo Running CRM Components tests...
    call npm run test:component:crm -- --browser %browser%
) else (
    echo Unknown test type: %testType%
    echo Valid options: website, crm, auth, contacts, tasks, organizations, component-website, component-crm, regression, all
)

echo ======================================================
echo         Test Execution Complete                       
echo ======================================================