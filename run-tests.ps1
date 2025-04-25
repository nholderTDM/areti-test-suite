# run-tests.ps1
param(
    [string]$testType = "all",
    [string]$baseUrl = "https://aretialliance.com"
)

Write-Host "======================================================"
Write-Host "        Areti Alliance Test Suite Runner              "
Write-Host "======================================================"
Write-Host "Test Type: $testType"
Write-Host "Base URL: $baseUrl"
Write-Host "======================================================"

# Clear the screen for better readability
Clear-Host

# Create a function to run specific tests
function RunTests {
    param(
        [string]$command,
        [string]$description
    )
    
    Write-Host "Running $description..."
    Write-Host "Command: $command"
    Write-Host "------------------------------------------------------"
    
    # Execute the npm command
    Invoke-Expression "npm run $command"
    
    # Check the result
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $description tests passed!" -ForegroundColor Green
    } else {
        Write-Host "❌ $description tests failed!" -ForegroundColor Red
    }
    
    Write-Host "------------------------------------------------------"
    Write-Host ""
}

# Set the CYPRESS_BASE_URL environment variable
$env:CYPRESS_BASE_URL = $baseUrl

# Run tests based on the test type parameter
switch ($testType) {
    "website" {
        RunTests -command "test:website" -description "Website E2E"
    }
    "crm" {
        RunTests -command "test:crm" -description "CRM Dashboard E2E"
    }
    "auth" {
        RunTests -command "test:crm:auth" -description "CRM Authentication"
    }
    "contacts" {
        RunTests -command "test:crm:contacts" -description "CRM Contacts Module"
    }
    "tasks" {
        RunTests -command "test:crm:tasks" -description "CRM Tasks Module"
    }
    "organizations" {
        RunTests -command "test:crm:organizations" -description "CRM Organizations Module"
    }
    "component-website" {
        RunTests -command "test:component:website" -description "Website Components"
    }
    "component-crm" {
        RunTests -command "test:component:crm" -description "CRM Components"
    }
    "regression" {
        RunTests -command "test:regression" -description "Full Regression Suite"
    }
    "all" {
        # Run all test types
        RunTests -command "test:all" -description "All Tests"
    }
    default {
        Write-Host "Unknown test type: $testType" -ForegroundColor Red
        Write-Host "Valid options: website, crm, auth, contacts, tasks, organizations, component-website, component-crm, regression, all"
    }
}

Write-Host "======================================================"
Write-Host "        Test Execution Complete                       "
Write-Host "======================================================"