const { Builder, By, until, Key } = require("selenium-webdriver");
const assert = require("assert");

describe("ML Heroes UI", function () {
    this.timeout(20000); // give WebDriver time

    let driver;

    // navigation
    let lnkRoles;

    // roles page
    let numRoles;
    let lnkAddRole;
    let tdRolesRole6, tdRolesRole6Text;
    let tdRolesPrimaryFunction6, tdRolesPrimaryFunction6Text;
    let tdRolesKeyAttributes6, tdRolesKeyAttributes6Text;
    let btnUpdateRole6;
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

    it("count hero rows", async function () {



        /*

        await driver.wait(async () => (await driver.findElements(By.css('#tblHeroes > tbody > tr'))).length > 0, 5000);
        const numHeroes = (await driver.findElements(By.css('#tblHeroes > tbody > tr'))).length;

        //console.log(count);

        assert.ok(numHeroes === 6); // or a stronger check

        */

        // ensure the page has fully loaded (document.readyState === 'complete')
        await driver.wait(async () => {
            const readyState = await driver.executeScript('return document.readyState');
            return readyState === 'complete';
        }, 5000);

        // pause briefly so you can visually inspect the browser during debugging
        await driver.sleep(2000); // 5 seconds


    });
});