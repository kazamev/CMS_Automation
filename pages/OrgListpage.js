class OrganisationPage {
    constructor(page) {
        this.page = page;
        this.orgCards = page.locator("//div[contains(@class,'flex') and contains(@class,'cursor-pointer')]");
        this.continueBtn = page.locator("//div[contains(text(),'Continue to Dashboard')]");
         this.settingsBtn = page.locator("//button[@class='p-1 rounded-full']//*[name()='svg']");
          this.OrganisationOption=page.locator("//a[normalize-space()='Organization']");
         this.orgDetailsCard=page.locator("(//div[@class='w-2/5 bg-white rounded-md h-auto border p-4 flex flex-col gap-4'])[1]")
    }

    // go to the organisation page
    async goTo() {await this.page.goto("https://novo.kazam.in/org");
    }

    //total card count
    async getOrganisationCount() {
         await this.orgCards.first().waitFor({state: 'visible', timeout: 30000})
        return await this.orgCards.count();
    }

    // Print text from Desired card
    async getOrganisationDetailsByName(orgName) {

    const count = await this.orgCards.count();
    for (let i = 0; i < count; i++) {

        const card = this.orgCards.nth(i);
        const nameText = (await card.locator("p.two_line_wrapper").textContent()).trim();
        if (nameText !== orgName) continue;
        const safe = async (locator) =>
            (await locator.count()) ? (await locator.first().textContent()).trim() : "NA";

        const users    = await safe(card.locator("p:text-matches('Users')"));
        const date     = await safe(card.locator("div svg.feather-calendar + p"));
        const plan     = await safe(card.locator("div svg.feather-award + p"));
        const country  = await safe(card.locator("div svg.feather-globe + p"));
        const timezone = await safe(card.locator("div svg.feather-clock + p"));
        const currencyBlock = card.locator("xpath=.//div[count(.//p)=2 and not(.//svg)]");
        const currencySymbol = await safe(currencyBlock.locator("xpath=.//p[1]"));
        const currencyName   = await safe(currencyBlock.locator("xpath=.//p[2]"));
        return {
            name: nameText,
            users,
            date,
            plan,
            country,
            currency: {
                symbol: currencySymbol,
                name: currencyName
            },
            timezone
        };
    }

    return null;
}



   // Click a required organisation card by name
   async selectOrganisation(orgName) {
    await this.page.getByText(orgName, { exact: true }).click();   
  }

   // Click Continue to Dashboard button
    async clickContinueToDashboard() {
        const continueBtn = this.continueBtn;
        await continueBtn.waitFor({ state: "visible", timeout: 15000 });
        await continueBtn.click();
        await this.page.waitForLoadState('networkidle');
        await this.settingsBtn.click();
        await this.OrganisationOption.waitFor({ state: 'visible', timeout: 5000 });
        // await this.usermanageBtn.click();
        // await this.usercount.waitFor({ state: 'visible', timeout: 5000 }); 
        // const text = await this.usercount.textContent();
        // return{    
        // UserCount:text.match(/\d+/)[0]
        await this.OrganisationOption.click();
    }


 async getOrganisationDetails() {
    const orgDetails = {
    organizationName: await this. page.locator('text=Organization Name').locator('xpath=following-sibling::*').innerText(),
    email: await this. page.locator('text=Email').locator('xpath=following-sibling::*').innerText(),
    plan: await this. page.locator('text=Plan').locator('xpath=following-sibling::*').innerText(),
    country: await this. page.locator('text=Country').locator('xpath=following-sibling::*').innerText(),
    timeZone:await this. page.locator('text=Time Zone').locator('xpath=following-sibling::*').innerText(),
    currency:await this. page.locator("//div[@class='flex items-center gap-2']").innerText(),
  };

  //Print in console

  console.log(`OrganizationName : ${orgDetails.organizationName}`);
  console.log(`Email             : ${orgDetails.email}`);
  console.log(`Plan              : ${orgDetails.plan}`);
  console.log(`Country           : ${orgDetails.country}`);
  console.log(`TimeZone          : ${orgDetails.timeZone}`);
  console.log(`Currency           : ${orgDetails.currency}`);
   return orgDetails;
 
     }

  async  validateOrgVsDashboard(orgData, dashData) {
  let hasMismatch = false;
  const logs = [];

  console.log("\n Organization Validation Started\n");

  //Organization Name
  {
    const orgVal  = orgData.name?.trim();
    const dashVal = dashData.organizationName?.trim();

    if (orgVal === dashVal) {
      logs.push("Organization Name: MATCHED");
    } else {
      logs.push(`Organization Name: MISMATCH (${orgVal} vs ${dashVal})`);
      hasMismatch = true;
    }
  }

  //Plan
  {
    const orgVal  = orgData.plan?.replace(/plan/i, "").trim().toLowerCase();

    const dashVal = dashData.plan?.trim().toLowerCase();

    if (orgVal === dashVal) {
      logs.push("Plan: MATCHED");
    } else {
      logs.push(`Plan: MISMATCH (${orgVal} vs ${dashVal})`);
      hasMismatch = true;
    }
  }

  //Country
  {
    const orgVal = orgData.country?.trim();
    const dashVal = dashData.country?.replace(/\(.*?\)/g, "").trim();
    if (orgVal === dashVal) {
      logs.push("Country: MATCHED");
    } else {
      logs.push(`Country: MISMATCH (${orgVal} vs ${dashVal})`);
      hasMismatch = true;
    }
  }

  //Timezone
 {
  const normalizeTZ = (val) =>
    val
      ?.toLowerCase()
      .replace(/\(.*?\)/g, "")   // remove (UTC+XX:XX)
      .replace(/[^a-z\s]/g, "") // keep only letters
      .replace(/\s+/g, " ")
      .trim();

  const extractMainTZ = (val) => {
    const words = normalizeTZ(val)?.split(" ");
    if (!words) return "";
    // take first 2–3 words as main timezone
    return words.slice(0, 3).join(" ");
  };

  const orgVal  = extractMainTZ(orgData.timezone);
  const dashVal = extractMainTZ(dashData.timeZone);

  
 if (orgVal.substring(0, 5) === dashVal.substring(0, 5)) {
    logs.push("Timezone: MATCHED");

  } else {
    logs.push(`Timezone: MISMATCH (${orgVal} vs ${dashVal})`);
    hasMismatch = true;
  }
}



  // Currency
 {
  const orgSymbol = orgData.currency?.symbol?.trim();
  const orgName   = orgData.currency?.name?.trim();

  if (!dashData.currency) {
    logs.push("Currency: DASHBOARD VALUE NOT FOUND");
    hasMismatch = true;
  } else {
    const normalizedCurrency = dashData.currency
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const dashSymbol = normalizedCurrency.replace(/[A-Za-z\s]/g, "").trim();
    const dashName   = normalizedCurrency.replace(/[^A-Za-z\s]/g, "").trim();

    if (orgSymbol === dashSymbol && orgName === dashName) {
      logs.push("Currency: MATCHED");
    } else {
      logs.push(
        `Currency: MISMATCH (${orgSymbol} ${orgName} vs ${dashSymbol} ${dashName})`
      );
      hasMismatch = true;
    }
  }
}


  //Print Report 
  logs.forEach(l => console.log(l));

  return {
    success: !hasMismatch,
    message: hasMismatch
      ? "Organization validation failed"
      : "Organization validation passed"
  };
}


    
};





    






module.exports = { OrganisationPage };
