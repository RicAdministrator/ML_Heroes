<template>
    <div class="w3-card-4">
        <div class="w3-container w3-black" style="margin-bottom: 5px;">
            <h2>Add Role</h2>
        </div>
        <form class="w3-container">
            <div style="margin-bottom: 20px;">
                <label for="txtRole">Role</label>
                <input id="txtRole" class="w3-input w3-border" type="text" :value="role" ref="refRole" maxlength="50">
            </div>
            <div style="margin-bottom: 20px;">
                <label for="txtLogoURL">Logo URL</label>
                <input id="txtLogoURL" class="w3-input w3-border" type="text" :value="logoUrl" ref="refLogoUrl"
                    maxlength="150">
            </div>
            <div style="margin-bottom: 20px;">
                <label for="txtPrimaryFunction">Primary Function</label>
                <input id="txtPrimaryFunction" class="w3-input w3-border" type="text" :value="primaryFunction"
                    ref="refPrimaryFunction" maxlength="150">
            </div>
            <div style="margin-bottom: 20px;">
                <label for="txtKeyAttributes">Key Attributes</label>
                <input id="txtKeyAttributes" class="w3-input w3-border" type="text" :value="keyAttributes"
                    ref="refKeyAttributes" maxlength="150">
            </div>
            <div style="margin-bottom: 10px">
                <button class="w3-btn w3-black" @click.prevent="saveNewRole()">Save</button>
                <button class="w3-btn w3-black" style="margin-left:5px;" @click.prevent="cancelClicked">Cancel</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {

        };
    },
    props: ['roleId', 'role', 'logoUrl', 'primaryFunction', 'keyAttributes'],
    emits: ["set-active-section-to-search", "reload-roles-after-upsert"],
    methods: {
        async saveNewRole() {
            try {
                const newRole = {
                    role: this.$refs.refRole.value,
                    logo_url: this.$refs.refLogoUrl.value,
                    primary_function: this.$refs.refPrimaryFunction.value,
                    key_attributes: this.$refs.refKeyAttributes.value
                }

                let response = "";

                if (this.roleId) {
                    response = await fetch(`http://localhost:3001/api/roles/${this.roleId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newRole),
                    });
                }
                else {
                    response = await fetch("http://localhost:3001/api/roles", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newRole),
                    });
                }

                if (!response.ok) {
                    const badRequestData = await response.json();

                    if (badRequestData.error) {
                        alert(badRequestData.error);
                    } else {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                }
                else {
                    this.reloadRolesAfterUpsert();
                }
            } catch (error) {
                console.error("Error posting data:", error);
            }
        },
        cancelClicked() {
            if (!this.roleId) {
                this.$refs.refRole.value = "";
                this.$refs.refLogoUrl.value = "";
                this.$refs.refPrimaryFunction.value = "";
                this.$refs.refKeyAttributes.value = "";
            }

            this.$emit('set-active-section-to-search');
        },
        reloadRolesAfterUpsert() {
            this.$emit('reload-roles-after-upsert');
        },
    },
};
</script>

<style></style>