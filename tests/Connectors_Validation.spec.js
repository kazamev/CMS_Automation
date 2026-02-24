import { test} from '../fixtures/login.fixture';
import { ConnectorPage } from '../pages/Connectors_Validation';

test('Verify Connector type', async ({ loggedInPage }) => {
    const page = loggedInPage;
    const connectorPage = new ConnectorPage(page);

    // Navigate to dashboard URL here
    await page.goto("https://novo.kazam.in/org/nikolev/46f85af4-f77d-4ea0-bbd2-955517ebad82/cpo/chargers");
    await page.waitForLoadState("networkidle");


    // Test Data
    const Data ={
        Connector: "ccs"
    }
    //Apply Connector filter in Charger Page
    await connectorPage.applyStateFilter(Data);

    //Select first row and validate the selected connector
    await connectorPage.selectFirstRow(Data);


});