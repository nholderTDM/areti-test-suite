# run-tests-compatible.ps1
param(
    [string]$testType = "all",
    [string]$baseUrl = "https://aretialliance.com",
    [string]$browser = "firefox"
)

Write-Host "======================================================"
Write-Host "        Areti Alliance Test Suite Runner              "
Write-Host "======================================================"
Write-Host "Test Type: $testType"
Write-Host "Base URL: $baseUrl"
Write-Host "Browser: $browser"
Write-Host "======================================================"

# Set the CYPRESS_BASE_URL environment variable
$env:CYPRESS_BASE_URL = $baseUrl

# Check if cypress.env.json exists, create it if it doesn't
if (-not (Test-Path -Path "cypress.env.json")) {
    Write-Host "Creating default cypress.env.json file..."
    @"
{
    "AUTH_USERNAME": "demoadmin",
    "AUTH_PASSWORD": "aretidemo",
    "AUTH_TOKEN": "3374021dca7bded335c1c2b15ff77984d52fc4f885e2335d79eb546f2431377f"
}
"@ | Out-File -FilePath "cypress.env.json" -Encoding utf8
}

# Function to directly execute npm command without using Invoke-Expression
function RunNpmCommand {
    param(
        [string]$command,
        [string]$description,
        [string]$browser
    )
    
    Write-Host "Running $description..."
    Write-Host "Command: $command --browser $browser"
    Write-Host "------------------------------------------------------"
    
    # Execute npm directly with & operator instead of Invoke-Expression
    & npm run $command -- --browser $browser
    
    # Check the result
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $description tests passed!" -ForegroundColor Green
    } else {
        Write-Host "❌ $description tests failed!" -ForegroundColor Red
    }
    
    Write-Host "------------------------------------------------------"
    Write-Host ""
}

# Run tests based on the test type parameter
switch ($testType) {
    "website" {
        RunNpmCommand -command "test:website" -description "Website E2E" -browser $browser
    }
    "crm" {
        RunNpmCommand -command "test:crm" -description "CRM Dashboard E2E" -browser $browser
    }
    "auth" {
        RunNpmCommand -command "test:crm:auth" -description "CRM Authentication" -browser $browser
    }
    "contacts" {
        RunNpmCommand -command "test:crm:contacts" -description "CRM Contacts Module" -browser $browser
    }
    "tasks" {
        RunNpmCommand -command "test:crm:tasks" -description "CRM Tasks Module" -browser $browser
    }
    "organizations" {
        RunNpmCommand -command "test:crm:organizations" -description "CRM Organizations Module" -browser $browser
    }
    "component-website" {
        RunNpmCommand -command "test:component:website" -description "Website Components" -browser $browser
    }
    "component-crm" {
        RunNpmCommand -command "test:component:crm" -description "CRM Components" -browser $browser
    }
    "regression" {
        RunNpmCommand -command "test:website" -description "Website Regression" -browser $browser
        RunNpmCommand -command "test:crm" -description "CRM Regression" -browser $browser
    }
    "all" {
        # Run all test types
        RunNpmCommand -command "test:website" -description "Website E2E" -browser $browser
        RunNpmCommand -command "test:crm" -description "CRM Dashboard E2E" -browser $browser
        RunNpmCommand -command "test:component:website" -description "Website Components" -browser $browser
        RunNpmCommand -command "test:component:crm" -description "CRM Components" -browser $browser
    }
    default {
        Write-Host "Unknown test type: $testType" -ForegroundColor Red
        Write-Host "Valid options: website, crm, auth, contacts, tasks, organizations, component-website, component-crm, regression, all"
    }
}

Write-Host "======================================================"
Write-Host "        Test Execution Complete                       "
Write-Host "======================================================"