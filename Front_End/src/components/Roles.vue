<template>
    <div v-show="activeSection === 'search'">
        <p v-if="loading">Loading...</p>
        <div v-else>
            <a id="lnkAddRole" class="link-style" @click="addClicked">Add Role</a>
            <div class="w3-panel w3-pale-green w3-border" v-show="saveSuccessMsg || deleteSuccessMsg">
                <h3>Success!</h3>
                <p>{{ saveSuccessMsg ? saveSuccessMsg : deleteSuccessMsg }}</p>
            </div>
            <div class="w3-panel w3-pale-red w3-border" v-show="deleteErrorMsg">
                <h3>Please correct the following errors:</h3>
                <p id="pRoleDeleteMsg">{{ deleteErrorMsg }}</p>
            </div>
            <table id="tblRoles" style="margin-top: 5px;">
                <thead>
                    <tr style="background-color: #2196f3;">
                        <th>Logo</th>
                        <th>Role</th>
                        <th>Primary Function</th>
                        <th>Key Attributes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="role in roles" :key="role.id">
                        <td>
                            <img v-bind:src="role.logo_url" alt="Avatar" style="height:75px;" />
                        </td>
                        <td :id="'tdRolesRole' + role.id">{{ role.role }}</td>
                        <td :id="'tdRolesPrimaryFunction' + role.id">{{ role.primary_function }}</td>
                        <td :id="'tdRolesKeyAttributes' + role.id">{{ role.key_attributes }}</td>
                        <td>
                            <button :id="'btnUpdateRole' + role.id" class="w3-btn w3-blue"
                                @click="updateClicked(role.id, role.role, role.logo_url, role.primary_function, role.key_attributes)">Update</button>
                            &nbsp;
                            <button :id="'btnDeleteRole' + role.id" class="w3-btn w3-blue" @click="deleteClicked(role.id)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-if="error" class="error">Error: {{ error }}</p>
        <p v-if="!loading && roles.length === 0">No roles found.</p>
    </div>
    <div v-show="activeSection === 'upsert'">
        <div class="w3-panel w3-pale-red w3-border" v-show="saveErrors">
            <h3>Please correct the following errors:</h3>
            <p id="pRoleSaveError">{{ saveErrors }}</p>
        </div>
        <div class="w3-card-4">
            <div class="w3-container w3-black" style="margin-bottom: 5px;">
                <h2 id="h2Upsert">{{ roleId ? 'Update Role' : 'Add Role' }}</h2>
            </div>
            <form class="w3-container">
                <div style="margin-bottom: 20px;">
                    <label for="txtRole">Role</label>
                    <input id="txtRole" class="w3-input w3-border" type="text" maxlength="50" v-model="roleModel">
                </div>
                <div style="margin-bottom: 20px;">
                    <label for="txtLogoURL">Logo URL</label>
                    <input id="txtLogoURL" class="w3-input w3-border" type="text" maxlength="150"
                        v-model="logoUrlModel">
                </div>
                <div style="margin-bottom: 20px;">
                    <label for="txtPrimaryFunction">Primary Function</label>
                    <input id="txtPrimaryFunction" class="w3-input w3-border" type="text" maxlength="150"
                        v-model="primaryFunctionModel">
                </div>
                <div style="margin-bottom: 20px;">
                    <label for="txtKeyAttributes">Key Attributes</label>
                    <input id="txtKeyAttributes" class="w3-input w3-border" type="text" maxlength="150"
                        v-model="keyAttributesModel">
                </div>
                <div style="margin-bottom: 10px">
                    <button id="btnSaveRole" class="w3-btn w3-black" @click.prevent="saveClicked">Save</button>
                    <button id="btnCancelRole" class="w3-btn w3-black" style="margin-left:5px;"
                        @click.prevent="cancelClicked">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            roles: [],
            loading: true,
            error: null,
            activeSection: "search",

            roleModel: "",
            logoUrlModel: "",
            primaryFunctionModel: "",
            keyAttributesModel: "",

            roleId: null,

            saveErrors: "",
            saveSuccessMsg: "",
            deleteErrorMsg: "",
            deleteSuccessMsg: "",
        };
    },
    mounted() {
        this.loadRoles();
    },
    methods: {
        loadRoles() {
            fetch('http://localhost:3001/api/roles')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    this.roles = data;
                    this.loading = false;
                })
                .catch(error => {
                    this.error = error.message;
                    this.loading = false;
                });
        },
        cancelClicked() {
            this.resetUpsertForm();
            this.activeSection = 'search';
        },
        async saveClicked() {
            if (this.roleModel === "") {
                this.saveErrors = "Role is required.";
                return;
            }

            this.loadRoles();
            const duplicateRole = this.roles.filter(role => role.role.toLowerCase() === this.roleModel.trim().toLowerCase() && role.id !== this.roleId);
            if (duplicateRole.length > 0) {
                this.saveErrors = "Role already exists.";
                return;
            }

            try {
                const roleBody = {
                    role: this.roleModel.trim(),
                    logo_url: this.logoUrlModel.trim(),
                    primary_function: this.primaryFunctionModel.trim(),
                    key_attributes: this.keyAttributesModel.trim()
                }

                let response = "";

                if (this.roleId) {
                    response = await fetch(`http://localhost:3001/api/roles/${this.roleId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(roleBody),
                    });
                }
                else {
                    response = await fetch("http://localhost:3001/api/roles", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(roleBody),
                    });
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                else {
                    this.saveSuccessMsg = this.roleId ? `"${roleBody.role}" was updated successfully.` : `"${roleBody.role}" was added successfully.`;
                    this.resetUpsertForm();
                    await this.loadRoles();
                    this.activeSection = 'search';
                }
            } catch (error) {
                console.error("Error posting data:", error);
            }
        },
        async deleteClicked(id) {
            this.resetSearchMessages();

            try {
                const response = await fetch('http://localhost:3001/api/hero_roles');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const heroRoles = await response.json();
                const heroesWithSpecificRole = heroRoles.filter(heroRole => heroRole.role_id === id);

                if (heroesWithSpecificRole.length > 0) {
                    this.deleteErrorMsg = "This role is assigned to one or more heroes. Please remove the role from the heroes before deleting it.";
                    return;
                }
            } catch (error) {
                console.log(error.message);
            }

            try {
                const response = await fetch(`http://localhost:3001/api/roles/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    console.log('Item deleted successfully');
                    this.deleteSuccessMsg = "Role was deleted successfully.";
                    this.loadRoles();
                } else {
                    console.error('Error deleting item:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        },
        updateClicked(id, role, logoUrl, primaryFunction, keyAttributes) {
            this.resetSearchMessages();

            this.roleId = id;
            this.roleModel = role;
            this.logoUrlModel = logoUrl;
            this.primaryFunctionModel = primaryFunction;
            this.keyAttributesModel = keyAttributes;

            this.activeSection = 'upsert';
        },
        resetUpsertForm() {
            this.roleId = null;
            this.roleModel = "";
            this.logoUrlModel = "";
            this.primaryFunctionModel = "";
            this.keyAttributesModel = "";

            this.saveErrors = "";
        },
        addClicked() {
            this.resetSearchMessages();
            this.activeSection = 'upsert';
        },
        resetSearchMessages() {
            this.saveSuccessMsg = "";
            this.deleteErrorMsg = "";
            this.deleteSuccessMsg = "";
        }
    },
};
</script>