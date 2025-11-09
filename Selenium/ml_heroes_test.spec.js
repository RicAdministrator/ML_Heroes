const { Builder, By, until, Key } = require("selenium-webdriver");
const assert = require("assert");

describe("ML Heroes UI", function () {
    this.timeout(20000); // give WebDriver time

    let driver;

    // navigation
    let lnkHeroes, lnkRoles;

    // heroes page
    let lnkAddHero;
    let numHeroes;
    let tdHeroName7, tdHeroName7Text;
    let tdHeroRoles7, tdHeroRoles7Text;
    let tdHeroDescription7, tdHeroDescription7Text;
    let btnUpdateHero7, btnDeleteHero7;
    let pHeroSaveError, pHeroSaveErrorText;
    let h2HeroUpsert, h2HeroUpsertText;
    let txtHeroName, txtHeroImageURL, txtHeroDescription;
    let txtHeroNameMaxLength, txtHeroImageURLMaxLength, txtHeroDescriptionMaxLength;
    let chkAssassin, chkMarksman;
    let btnSaveHero, btnCancelHero;

    // roles page    
    let lnkAddRole;
    let pRoleDeleteMsg, pRoleDeleteMsgText;
    let numRoles;
    let tdRolesRole6, tdRolesRole6Text;
    let tdRolesPrimaryFunction6, tdRolesPrimaryFunction6Text;
    let tdRolesKeyAttributes6, tdRolesKeyAttributes6Text;
    let btnUpdateRole1, btnDeleteRole1;
    let btnUpdateRole6, btnDeleteRole6;
    let pRoleSaveError, pRoleSaveErrorText;
    let h2Upsert, h2UpsertText;
    let txtRole, txtLogoURL, txtPrimaryFunction, txtKeyAttributes;
    let txtRoleMaxLength, txtLogoURLMaxLength, txtPrimaryFunctionMaxLength, txtKeyAttributesMaxLength;
    let btnSaveRole, btnCancelRole;

    before(async function () {
        driver = await new Builder().forBrowser("chrome").build();
        await driver.get("http://localhost:5173/");
        await driver.sleep(2000);
        await driver.manage().window().maximize();

        // ensure the page has fully loaded (document.readyState === 'complete')
        await driver.wait(async () => {
            const readyState = await driver.executeScript('return document.readyState');
            return readyState === 'complete';
        }, 5000);

        await driver.sleep(2000);
    });

    after(async function () {
        await driver.sleep(2000);
        if (driver) await driver.quit();
    });

    it("navigate to roles page and count existing roles", async function () {
        lnkRoles = await driver.wait(until.elementLocated(By.id('lnkRoles')), 3000);
        await lnkRoles.click();
        await driver.sleep(2000);

        numRoles = (await driver.findElements(By.css('#tblRoles > tbody > tr'))).length;
        assert.ok(numRoles === 5);
    });

    it("set role control variables", async function () {
        lnkAddRole = await driver.wait(until.elementLocated(By.id('lnkAddRole')), 3000);
        pRoleDeleteMsg = await driver.wait(until.elementLocated(By.id('pRoleDeleteMsg')), 3000);
        btnDeleteRole1 = await driver.wait(until.elementLocated(By.id('btnDeleteRole1')), 3000);
        pRoleSaveError = await driver.wait(until.elementLocated(By.id('pRoleSaveError')), 3000);
        h2Upsert = await driver.wait(until.elementLocated(By.id('h2Upsert')), 3000);
        txtRole = await driver.wait(until.elementLocated(By.id('txtRole')), 3000);
        txtLogoURL = await driver.wait(until.elementLocated(By.id('txtLogoURL')), 3000);
        txtPrimaryFunction = await driver.wait(until.elementLocated(By.id('txtPrimaryFunction')), 3000);
        txtKeyAttributes = await driver.wait(until.elementLocated(By.id('txtKeyAttributes')), 3000);
        btnSaveRole = await driver.wait(until.elementLocated(By.id('btnSaveRole')), 3000);
        btnCancelRole = await driver.wait(until.elementLocated(By.id('btnCancelRole')), 3000);
    });

    it("click add role and validate upsert label", async function () {
        await lnkAddRole.click();
        await driver.sleep(2000);

        h2UpsertText = await h2Upsert.getText();
        assert.ok(h2UpsertText === "Add Role");
    });

    it("check create role maxlengths", async function () {
        txtRoleMaxLength = await txtRole.getAttribute('maxlength');
        txtLogoURLMaxLength = await txtLogoURL.getAttribute('maxlength');
        txtPrimaryFunctionMaxLength = await txtPrimaryFunction.getAttribute('maxlength');
        txtKeyAttributesMaxLength = await txtKeyAttributes.getAttribute('maxlength');

        assert.ok(txtRoleMaxLength === "50");
        assert.ok(txtLogoURLMaxLength === "150");
        assert.ok(txtPrimaryFunctionMaxLength === "150");
        assert.ok(txtKeyAttributesMaxLength === "150");
    });

    it("role create validations", async function () {
        await btnSaveRole.click();
        await driver.sleep(2000);
        pRoleSaveErrorText = await pRoleSaveError.getText();
        assert.ok(pRoleSaveErrorText === "Role is required.");
        await txtRole.sendKeys('marksman');
        await driver.sleep(2000);
        await btnSaveRole.click();
        await driver.sleep(2000);
        pRoleSaveErrorText = await pRoleSaveError.getText();
        assert.ok(pRoleSaveErrorText === "Role already exists.");
    });

    it("cancel create role then click add role", async function () {
        await btnCancelRole.click();
        await driver.sleep(2000);
        await lnkAddRole.click();
        await driver.sleep(2000);
    });

    it("create a role", async function () {
        await txtRole.sendKeys('Support');
        await driver.sleep(2000);
        await txtLogoURL.sendKeys('https://static.wikia.nocookie.net/mobile-legends/images/f/ff/Support_Icon.png');
        await driver.sleep(2000);
        await txtPrimaryFunction.sendKeys('Supports focus on protecting and enabling their teammates, providing heals, shields, and crowd control.');
        await driver.sleep(2000);
        await txtKeyAttributes.sendKeys('Utility abilities (healing, shielding, crowd control), map awareness, and the ability to assist teammates in farming and securing kills.');
        await driver.sleep(2000);
        await btnSaveRole.click();
        await driver.sleep(2000);
        numRoles = (await driver.findElements(By.css('#tblRoles > tbody > tr'))).length;
        assert.ok(numRoles === 6);
    });

    it("click support update and validate upsert label", async function () {
        btnUpdateRole6 = await driver.wait(until.elementLocated(By.id('btnUpdateRole6')), 3000);
        await btnUpdateRole6.click();
        await driver.sleep(2000);
        h2UpsertText = await h2Upsert.getText();
        assert.ok(h2UpsertText === "Update Role");
    });

    it("check update role maxlengths", async function () {
        txtRoleMaxLength = await txtRole.getAttribute('maxlength');
        txtLogoURLMaxLength = await txtLogoURL.getAttribute('maxlength');
        txtPrimaryFunctionMaxLength = await txtPrimaryFunction.getAttribute('maxlength');
        txtKeyAttributesMaxLength = await txtKeyAttributes.getAttribute('maxlength');

        assert.ok(txtRoleMaxLength === "50");
        assert.ok(txtLogoURLMaxLength === "150");
        assert.ok(txtPrimaryFunctionMaxLength === "150");
        assert.ok(txtKeyAttributesMaxLength === "150");
    });

    it("role update validations", async function () {
        // perform backspace until no more text
        let current = await txtRole.getAttribute('value');
        while (current && current.length > 0) {
            await txtRole.sendKeys(Key.BACK_SPACE);
            await driver.sleep(50);
            current = await txtRole.getAttribute('value');
        }

        await driver.sleep(2000);
        await btnSaveRole.click();
        await driver.sleep(2000);
        pRoleSaveErrorText = await pRoleSaveError.getText();
        assert.ok(pRoleSaveErrorText === "Role is required.");
        await txtRole.sendKeys('marksman');
        await driver.sleep(2000);
        await btnSaveRole.click();
        await driver.sleep(2000);
        pRoleSaveErrorText = await pRoleSaveError.getText();
        assert.ok(pRoleSaveErrorText === "Role already exists.");
    });

    it("update a role", async function () {
        await txtRole.clear();
        await txtRole.sendKeys('u - Support');
        await driver.sleep(2000);

        await txtPrimaryFunction.clear();
        await txtPrimaryFunction.sendKeys('u - Supports focus on protecting and enabling their teammates, providing heals, shields, and crowd control.');
        await driver.sleep(2000);

        await txtKeyAttributes.clear();
        await txtKeyAttributes.sendKeys('u - Utility abilities (healing, shielding, crowd control), map awareness, and the ability to assist teammates in farming and securing kills.');
        await driver.sleep(2000);

        await btnSaveRole.click();
        await driver.sleep(2000);

        tdRolesRole6 = await driver.wait(until.elementLocated(By.id('tdRolesRole6')), 3000);
        tdRolesRole6Text = await tdRolesRole6.getText();
        assert.ok(tdRolesRole6Text === "u - Support");

        tdRolesPrimaryFunction6 = await driver.wait(until.elementLocated(By.id('tdRolesPrimaryFunction6')), 3000);
        tdRolesPrimaryFunction6Text = await tdRolesPrimaryFunction6.getText();
        assert.ok(tdRolesPrimaryFunction6Text === "u - Supports focus on protecting and enabling their teammates, providing heals, shields, and crowd control.");

        tdRolesKeyAttributes6 = await driver.wait(until.elementLocated(By.id('tdRolesKeyAttributes6')), 3000);
        tdRolesKeyAttributes6Text = await tdRolesKeyAttributes6.getText();
        assert.ok(tdRolesKeyAttributes6Text === "u - Utility abilities (healing, shielding, crowd control), map awareness, and the ability to assist teammates in farming and securing kills.");
    });

    it("delete role validation", async function () {
        await btnDeleteRole1.click();
        await driver.sleep(2000);

        pRoleDeleteMsgText = await pRoleDeleteMsg.getText();
        assert.ok(pRoleDeleteMsgText === "This role is assigned to one or more heroes. Please remove the role from the heroes before deleting it.");
    });

    it("successful delete of role", async function () {
        btnDeleteRole6 = await driver.wait(until.elementLocated(By.id('btnDeleteRole6')), 3000);
        await btnDeleteRole6.click();
        await driver.sleep(2000);

        numRoles = (await driver.findElements(By.css('#tblRoles > tbody > tr'))).length;
        assert.ok(numRoles === 5);
    });

    it("navigate to heroes page and count existing heroes", async function () {
        lnkHeroes = await driver.wait(until.elementLocated(By.id('lnkHeroes')), 3000);
        await lnkHeroes.click();
        await driver.sleep(2000);

        numHeroes = (await driver.findElements(By.css('#tblHeroes > tbody > tr'))).length;
        assert.ok(numHeroes === 6);
    });

    it("set hero control variables", async function () {
        lnkAddHero = await driver.wait(until.elementLocated(By.id('lnkAddHero')), 3000);
        pHeroSaveError = await driver.wait(until.elementLocated(By.id('pHeroSaveError')), 3000);
        h2HeroUpsert = await driver.wait(until.elementLocated(By.id('h2HeroUpsert')), 3000);
        txtHeroName = await driver.wait(until.elementLocated(By.id('txtHeroName')), 3000);
        txtHeroImageURL = await driver.wait(until.elementLocated(By.id('txtHeroImageURL')), 3000);
        txtHeroDescription = await driver.wait(until.elementLocated(By.id('txtHeroDescription')), 3000);
        chkAssassin = await driver.wait(until.elementLocated(By.id('chkAssassin')), 3000);
        chkMarksman = await driver.wait(until.elementLocated(By.id('chkMarksman')), 3000);
        btnSaveHero = await driver.wait(until.elementLocated(By.id('btnSaveHero')), 3000);
        btnCancelHero = await driver.wait(until.elementLocated(By.id('btnCancelHero')), 3000);
    });

    it("click add hero and validate upsert label", async function () {
        await lnkAddHero.click();
        await driver.sleep(2000);

        h2HeroUpsertText = await h2HeroUpsert.getText();
        assert.ok(h2HeroUpsertText === "Add Hero");
    });

    it("check create hero maxlengths", async function () {
        txtHeroNameMaxLength = await txtHeroName.getAttribute('maxlength');
        txtHeroImageURLMaxLength = await txtHeroImageURL.getAttribute('maxlength');
        txtHeroDescriptionMaxLength = await txtHeroDescription.getAttribute('maxlength');

        assert.ok(txtHeroNameMaxLength === "50");
        assert.ok(txtHeroImageURLMaxLength === "150");
        assert.ok(txtHeroDescriptionMaxLength === "150");
    });

    it("hero create validations", async function () {
        await btnSaveHero.click();
        await driver.sleep(2000);

        pHeroSaveErrorText = await pHeroSaveError.getText();
        assert.ok(pHeroSaveErrorText.includes("Name is required."));
        assert.ok(pHeroSaveErrorText.includes("At least one role must be selected."));

        await txtHeroName.sendKeys('Hanabi');
        await driver.sleep(2000);

        await btnSaveHero.click();
        await driver.sleep(2000);

        pHeroSaveErrorText = await pHeroSaveError.getText();
        assert.ok(pHeroSaveErrorText.includes("Hero with this name already exists."));
        assert.ok(pHeroSaveErrorText.includes("At least one role must be selected."));
    });

    it("cancel create hero then click add hero", async function () {
        await btnCancelHero.click();
        await driver.sleep(2000);

        await lnkAddHero.click();
        await driver.sleep(2000);
    });

    it("create a hero", async function () {
        await txtHeroName.sendKeys('Layla');
        await driver.sleep(2000);

        await txtHeroImageURL.sendKeys('https://akmweb.youngjoygame.com/web/svnres/img/mlbb/homepage/100_6efe9abc2047f59d45fa1c88fb1261b7.png');
        await driver.sleep(2000);

        await chkMarksman.click();
        await driver.sleep(2000);

        await txtHeroDescription.sendKeys('The backbone of the Eruditio Rangers who is also known as the Shining Star.');
        await driver.sleep(2000);

        await btnSaveHero.click();
        await driver.sleep(2000);

        numHeroes = (await driver.findElements(By.css('#tblHeroes > tbody > tr'))).length;
        assert.ok(numHeroes === 7);
    });

    it("click Layla update and validate upsert label", async function () {
        btnUpdateHero7 = await driver.wait(until.elementLocated(By.id('btnUpdateHero7')), 3000);
        await btnUpdateHero7.click();
        await driver.sleep(2000);

        h2HeroUpsertText = await h2HeroUpsert.getText();
        assert.ok(h2HeroUpsertText === "Update Hero");
    });

    it("check update hero maxlengths", async function () {
        txtHeroNameMaxLength = await txtHeroName.getAttribute('maxlength');
        txtHeroImageURLMaxLength = await txtHeroImageURL.getAttribute('maxlength');
        txtHeroDescriptionMaxLength = await txtHeroDescription.getAttribute('maxlength');

        assert.ok(txtHeroNameMaxLength === "50");
        assert.ok(txtHeroImageURLMaxLength === "150");
        assert.ok(txtHeroDescriptionMaxLength === "150");
    });

    it("hero update validations", async function () {
        // perform backspace until no more text
        let current = await txtHeroName.getAttribute('value');
        while (current && current.length > 0) {
            await txtHeroName.sendKeys(Key.BACK_SPACE);
            await driver.sleep(50);
            current = await txtHeroName.getAttribute('value');
        }
        await driver.sleep(2000);

        await chkMarksman.click();
        await driver.sleep(2000);

        await btnSaveHero.click();
        await driver.sleep(2000);

        pHeroSaveErrorText = await pHeroSaveError.getText();
        assert.ok(pHeroSaveErrorText.includes("Name is required."));
        assert.ok(pHeroSaveErrorText.includes("At least one role must be selected."));
        
        await txtHeroName.sendKeys('Hanabi');
        await driver.sleep(2000);

        await btnSaveHero.click();
        await driver.sleep(2000);
        
        pHeroSaveErrorText = await pHeroSaveError.getText();
        assert.ok(pHeroSaveErrorText.includes("Hero with this name already exists."));
        assert.ok(pHeroSaveErrorText.includes("At least one role must be selected."));
    });

    it("update a hero", async function () {
        await txtHeroName.clear();
        await txtHeroName.sendKeys('u - Layla');
        await driver.sleep(2000);

        await chkAssassin.click();
        await driver.sleep(2000);

        await chkMarksman.click();
        await driver.sleep(2000);

        await txtHeroDescription.clear();
        await txtHeroDescription.sendKeys('u - The backbone of the Eruditio Rangers who is also known as the Shining Star.');
        await driver.sleep(2000);
        
        await btnSaveHero.click();
        await driver.sleep(2000);

        tdHeroName7 = await driver.wait(until.elementLocated(By.id('tdHeroName7')), 3000);
        tdHeroName7Text = await tdHeroName7.getText();
        assert.ok(tdHeroName7Text === "u - Layla");

        tdHeroRoles7 = await driver.wait(until.elementLocated(By.id('tdHeroRoles7')), 3000);
        tdHeroRoles7Text = await tdHeroRoles7.getText();
        assert.ok(tdHeroRoles7Text === "Assassin / Marksman");

        tdHeroDescription7 = await driver.wait(until.elementLocated(By.id('tdHeroDescription7')), 3000);
        tdHeroDescription7Text = await tdHeroDescription7.getText();
        assert.ok(tdHeroDescription7Text === "u - The backbone of the Eruditio Rangers who is also known as the Shining Star.");
    });

    it("successful delete of hero", async function () {
        btnDeleteHero7 = await driver.wait(until.elementLocated(By.id('btnDeleteHero7')), 3000);
        await btnDeleteHero7.click();
        await driver.sleep(2000);

        numHeroes = (await driver.findElements(By.css('#tblHeroes > tbody > tr'))).length;
        assert.ok(numHeroes === 6);
    });
});