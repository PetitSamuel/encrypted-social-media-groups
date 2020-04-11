import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import './center-element'
/**
 * @customElement
 * @polymer
 */
class GroupManagerElement extends PolymerElement {
    static get template() {
        return html`
        <style>
            #GroupManagerDialog {
                @apply --layout-center-justified;
            }
            paper-button:hover {
                background-color: var(--paper-blue-50);
            }
            .buttons {
                @apply --layout-horizontal;
            }
        </style>
        <paper-button raised on-click="openDialog" id="manageButton"><iron-icon icon="rowing"></iron-icon>MANAGE GROUP</paper-button>
        <div>
            <paper-dialog id="GroupManagerDialog">
                <h2>Add or Remove User from Group</h2>
                <div class="inputs">
                    <paper-input id="userInput" value="{{user}}" label="User" always-float-label required auto-validate error-message="User field cannot be empty!"></paper-input>
                    <paper-input id="groupInput" value="{{group}}" label="Group" always-float-label required auto-validate error-message="Group field cannot be empty!"></paper-input>
                </div>
                <div class="buttons">
                    <paper-button on-click="handleAddToGroup"><iron-icon icon="add-circle"></iron-icon>Add</paper-button>
                    <paper-button on-click="handleRemoveFromGroup"><iron-icon icon="block"></iron-icon>Remove</paper-button>
                    <paper-button dialog-dismiss on-click="clearInputs">Close</paper-button>
                </div>
            </paper-dialog>
        </div>
        
    `;
    }

    static get properties() {
        return {
            user: {
                type: String,
                value: 'sam',
            },
            group: {
                type: String,
                value: 'sam',
            }
        };
    }
    async handleRemoveFromGroup() {
        this.$.userInput.validate();
        this.$.groupInput.validate();
        if (!this.user || !this.group) {
            // if inputs aren't valid, show error messages & return
            return;
        }
        let response = await fetch(`http://localhost:5000/api/group/${this.group}/${this.user}`, {
            method: 'DELETE',
        });
        if (response.status !== 200) {
            alert("An error occured: status" + response.status);
            return;
        }
        console.log(`User ${this.user} succesfully removed from group ${this.group}.`);
    }

    async handleAddToGroup() {
        this.$.userInput.validate();
        this.$.groupInput.validate();
        if (!this.user || !this.group) {
            // if inputs aren't valid, show error messages & return
            return;
        }
        let response = await fetch('http://localhost:5000/api/group', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                group_name: this.group,
                username: this.user,
            }),
        });
        if (response.status !== 200) {
            alert("An error occured: status" + response.status);
            return;
        }
        console.log(`User ${this.user} succesfully added to group ${this.group}.`);
    }

    clearInputs() {
        this.user = '';
        this.group = '';
    }

    openDialog() {
        this.$.GroupManagerDialog.open();
    }
}

window.customElements.define('group-manager-element', GroupManagerElement);
