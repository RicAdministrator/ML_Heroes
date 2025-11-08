<template>
    <div v-show="activeSection === 'search'">
        <p v-if="loading">Loading...</p>
        <div v-else>
            <a class="link-style" @click="addClicked">Add Heroes</a>
            <div class="w3-panel w3-pale-green w3-border" v-show="saveSuccessMsg || deleteSuccessMsg">
                <h3>Success!</h3>
                <p>{{ saveSuccessMsg ? saveSuccessMsg : deleteSuccessMsg }}</p>
            </div>
            <table id="tblHeroes" style="margin-top: 5px;">
                <thead>
                    <tr style="background-color: #2196f3;">
                        <th>Image</th>
                        <th>Name</th>
                        <th>Roles</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="hero in heroes" :key="heroes.id">
                        <td>
                            <img v-bind:src="hero.image_url" alt="Avatar" style="height:150px;" />
                        </td>
                        <td>{{ hero.name }}</td>
                        <td>{{ hero.roles }}</td>
                        <td>{{ hero.description }}</td>
                        <td>
                            <button class="w3-btn w3-blue"
                                @click="updateClicked(hero.id, hero.name, hero.image_url, hero.description, hero.roles)">Update</button>
                            &nbsp;
                            <button class="w3-btn w3-blue" @click="deleteClicked(hero.id)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <p v-if="error" class="error">Error: {{ error }}</p>
        <p v-if="!loading && heroes.length === 0">No heroes found.</p>
    </div>
    <div v-show="activeSection === 'upsert'">
        <div class="w3-panel w3-pale-red w3-border" v-show="saveErrors">
            <h3>Please correct the following errors:</h3>
            <p v-html="saveErrors"></p>
        </div>
        <div class="w3-card-4">
            <div class="w3-container w3-black" style="margin-bottom: 5px;">
                <h2>{{ heroId ? 'Update Hero' : 'Add Hero' }}</h2>
            </div>
            <form class="w3-container">
                <div style="margin-bottom: 20px;">
                    <label for="txtName">Name</label>
                    <input id="txtName" class="w3-input w3-border" type="text" maxlength="50" v-model="nameModel">
                </div>
                <div style="margin-bottom: 20px;">
                    <label for="txtImageURL">Image URL</label>
                    <input id="txtImageURL" class="w3-input w3-border" type="text" maxlength="150"
                        v-model="logoImageModel">
                </div>
                <div style="margin-bottom: 20px;">
                    <div ref="divRoles">
                        Roles
                        <br />
                        <div v-for="role in roles" :key="roles.id" style="float:left;">
                            <label :for="'chk' + role.role" style="margin-right:5px;">{{ role.role }}</label>
                            <input :id="'chk' + role.role" style="margin-right:35px;" class="w3-check" type="checkbox"
                                :value="role.id">
                        </div>
                    </div>
                </div>
                <div style="margin-bottom: 20px; clear:left; padding-top: 20px;">
                    <label for="txtDescription">Description</label>
                    <input id="txtDescription" class="w3-input w3-border" type="text" maxlength="150"
                        v-model="descriptionModel">
                </div>
                <div style="margin-bottom: 10px">
                    <button class="w3-btn w3-black" @click.prevent="saveClicked">Save</button>
                    <button class="w3-btn w3-black" style="margin-left:5px;"
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
            heroes: [],
            roles: [],
            loading: true,
            error: null,
            activeSection: "search",

            nameModel: "",
            logoImageModel: "",
            tankModel: false,
            descriptionModel: "",

            heroId: null,

            saveErrors: "",
            saveSuccessMsg: "",
            deleteSuccessMsg: "",
        };
    },
    mounted() {
        this.loadHeroes();
        this.loadRoles();
    },
    methods: {
        async loadHeroes() {
            fetch('http://localhost:3001/api/heroes')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    this.heroes = data;
                    this.loading = false;
                })
                .then(() => {
                    this.activeSection = 'search';
                })  
                .catch(error => {
                    this.error = error.message;
                    this.loading = false;
                });
        },
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
            this.saveErrors = "";

            if (this.nameModel === "") {
                this.saveErrors = "Name is required.<br>";
            }
            else {
                const duplicateHero = this.heroes.filter(hero => hero.name.toLowerCase() === this.nameModel.trim().toLowerCase() && hero.id !== this.heroId);

                if (duplicateHero.length > 0) {
                    this.saveErrors = "Hero with this name already exists.<br>";
                }
            }

            const inputElements = this.$refs.divRoles.querySelectorAll('input[type="checkbox"]');
            let selectedRoles = [];

            inputElements.forEach(function (inputElement) {
                if (inputElement.checked) {
                    selectedRoles.push(Number(inputElement.value));
                }
            });

            if (selectedRoles.length === 0) {
                this.saveErrors += "At least one role must be selected.<br>";
            }

            if (this.saveErrors) {
                return; // If there are errors, do not proceed with saving
            }

            try {
                let response = "";

                const heroBody = {
                    name: this.nameModel.trim(),
                    image_url: this.logoImageModel.trim(),
                    roles: selectedRoles,
                    description: this.descriptionModel.trim()
                }

                console.log("Hero Body: ", heroBody);
                //alert(JSON.stringify(heroBody));

                if (this.heroId) {
                    response = await fetch(`http://localhost:3001/api/heroes/${this.heroId}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(heroBody),
                    });
                }
                else {
                    response = await fetch("http://localhost:3001/api/heroes", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(heroBody),
                    });
                }

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                else {
                    this.saveSuccessMsg = this.heroId ? `Hero was updated successfully.` : `Hero was added successfully.`;
                    this.resetUpsertForm();
                    await this.loadHeroes();                    
                }
            } catch (error) {
                console.error("Error posting data:", error);
            }
        },
        async deleteClicked(id) {
            this.resetSearchMessages();

            try {
                const response = await fetch(`http://localhost:3001/api/heroes/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    console.log('Item deleted successfully');
                    this.deleteSuccessMsg = "Hero was deleted successfully.";
                    this.loadHeroes();
                } else {
                    console.error('Error deleting item:', response.statusText);
                }
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        },
        updateClicked(id, name, logoImage, description, roles) {
            this.resetSearchMessages();

            this.heroId = id;
            this.nameModel = name;
            this.logoImageModel = logoImage;
            this.descriptionModel = description;

            const arRoles = roles.split(" / ").map(function (item) {
                return item.toLowerCase().trim();
            });

            const inputElements = this.$refs.divRoles.querySelectorAll('input[type="checkbox"]');

            inputElements.forEach(function (inputElement) {
                const roleToFind = inputElement.id.replace("chk", "").toLowerCase().trim();

                if (arRoles.includes(roleToFind)) {
                    inputElement.checked = true;
                }
            });

            this.activeSection = 'upsert';
        },
        resetUpsertForm() {
            this.heroId = null;
            this.nameModel = "";
            this.logoImageModel = "";

            const inputElements = this.$refs.divRoles.querySelectorAll('input[type="checkbox"]');
            inputElements.forEach(function (inputElement) {
                inputElement.checked = false;
            });

            this.descriptionModel = "";

            this.saveErrors = "";
        },
        addClicked() {
            this.resetSearchMessages();
            this.activeSection = 'upsert';
        },
        resetSearchMessages() {
            this.saveSuccessMsg = "";
            this.deleteSuccessMsg = "";
        }
    },
};
</script>