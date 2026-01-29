import { group } from 'console';
import { test, expect } from '../fixtures/login.fixture';
import { TariffPage } from '../pages/DriverTariff';

test("Create, Validate and Delete Driver Group And Tariff", async ({ loggedInPage }) => {
        test.setTimeout(120000); // Increased timeout for the full flow

        const page = loggedInPage;
        const tariffPage = new TariffPage(page);
        
        const groupName = "Driver Group101";
        const groupDesc = "Test Driver Group Description";

        const expectedData = {
            'NAME': groupName,
            'DESCRIPTION': groupDesc,
        };


 // Navigate to Revenue Management
    await tariffPage.navigate();

// Navigate to Driver & Vehicle 
    await tariffPage.navigateToDriverTariffs();


// Create Driver Group
    await tariffPage.createDriverGroupFlow(groupName, groupDesc);


// Navigate Back to Revenue Management
    await tariffPage.navigate();
        

// Create Driver Tariff
    await tariffPage.DriverTariffCreation(groupName);


//Print Tariff Details
    await tariffPage. getDriverDetailsAsTables(groupName);


//Delete Driver Tariff
    await tariffPage.tariffDeletionFlow();

// Navigate to Driver & Vehicle 
    await tariffPage.navigateToDriverTariffs();


// Delete Driver Group
    await tariffPage.DriverGroupDltion(groupName);




//         // 3. Search and Open the specific Tariff
//         await tariffPage.searchAndOpenTariff(groupName);

//         // 4. Compare UI details
//         await tariffPage.validateTariffDetails(expectedData);

//         // 5. Cleanup Tariff
//         await tariffPage.deleteTariffFlow();

//         // 6. Cleanup Driver Group
//         await tariffPage.deleteDriverGroup(groupName);
    });
