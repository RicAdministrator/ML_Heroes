<template>
    <div v-show="activeSection == 'search'">
        <p v-if="loading">Loading...</p>
        <div v-else>
            <!-- <a style="color: #2196f3; font-weight: bold;" @click="addRole">Add Role</a> -->
             <a class="link-style" @click="addRole">Add Role</a>
            <table style="margin-top: 5px;">
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
                    <tr v-for="item in items" :key="item.id">
                        <td>
                            <img v-bind:src="item.logo_url" alt="Avatar" style="height:75px;" />
                        </td>
                        <td>{{ item.role }}</td>
                        <td>{{ item.primary_function }}</td>
                        <td>{{ item.key_attributes }}</td>
                        <td>
                            <button class="w3-btn w3-blue"
                                @click="showUpsertComponentForUpdate(item.id, item.role, item.logo_url, item.primary_function, item.key_attributes)">Update</button>
                            &nbsp;
                            <button class="w3-btn w3-blue" @click="deleteItem(item.id)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-if="error" class="error">Error: {{ error }}</p>
        <p v-if="!loading && items.length === 0">No roles found.</p>
    </div>
    <div v-show="activeSection == 'upsert'">
        <upsertRole :role-id="updateRoleId" :role="updateRole" :logo-url="updateLogoUrl"
            :primary-function="updatePrimaryFunction" :key-attributes="updateKeyAttributes"
            @set-active-section-to-search="setActiveSectionToSearch"
            @reload-roles-after-upsert="reloadRolesAfterUpsert" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            items: [],
            loading: true,
            error: null,
            activeSection: 'search',

            updateRoleId: null,
            updateRole: "",
            updateLogoUrl: "",
            updatePrimaryFunction: "",
            updateKeyAttributes: "",
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
                    this.items = data;
                    this.loading = false;
                })
                .catch(error => {
                    this.error = error.message;
                    this.loading = false;
                });
        },
        async deleteItem(id) {
            try {
                const response = await fetch(`http://localhost:3001/api/roles/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    console.log('Item deleted successfully');
                    this.loadRoles();
                    // Optionally update your data or UI here
                } else {
                    console.error('Error deleting item:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        },
        setActiveSectionToSearch() {
            this.activeSection = 'search';
        },
        reloadRolesAfterUpsert() {
            this.loadRoles();
            this.activeSection = 'search';
        },
        showUpsertComponentForUpdate(roleId, role, logoUrl, primaryFunction, keyAttributes) {
            this.updateRoleId = roleId;
            this.updateRole = role;
            this.updateLogoUrl = logoUrl;
            this.updatePrimaryFunction = primaryFunction;
            this.updateKeyAttributes = keyAttributes;
            this.activeSection = 'upsert';
        },
        addRole() {
            this.updateRoleId = null;
            this.updateRole = "";
            this.updateLogoUrl = "";
            this.updatePrimaryFunction = "";
            this.updateKeyAttributes = "";
            this.activeSection = 'upsert';
        },
    },
};
</script>
