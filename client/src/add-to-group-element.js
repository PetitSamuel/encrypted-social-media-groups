import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-dialog/paper-dialog.js';
import './center-element'
/**
 * @customElement
 * @polymer
 */
class AddToGroupElement extends PolymerElement {
    static get template() {
        return html`
        <style>
            #addToGroupDialog {

            }
        </style>

        <paper-button raised on-click="openDialog"><iron-icon icon="add-circle"></iron-icon>ADD TO GROUP</paper-button>
        <div>
            <paper-dialog id='addToGroupDialog'>
                <h2>Add User to a Group</h2>
                <div class="inputs">
                    <paper-input id="userInput" value="{{user}}" label="User" always-float-label required auto-validate error-message="User field cannot be empty!"></paper-input>
                    <paper-input id="groupInput" value="{{group}}" label="Group" always-float-label required auto-validate error-message="Group field cannot be empty!"></paper-input>
                </div>
                <div class="buttons">
                    <paper-button on-click="handleAddToGroup">Add</paper-button>
                    <paper-button dialog-dismiss on-click="clearInputs">Cancel</paper-button>
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
                name: this.group,
                user: this.user,
            }),
        });
        if (response.status !== 200) {
            alert("An error occured: status" + response.status);
            return;
        }
        console.log(`User ${this.user} succesfully added to group ${this.group}.`);
        this.clearInputs();
        this.closeDialog();
    }

    clearInputs() {
        this.user = '';
        this.group = '';
    }

    openDialog() {
        this.$.addToGroupDialog.open();
    }

    closeDialog() {
        this.$.addToGroupDialog.close();
    }
}

window.customElements.define('add-to-group-element', AddToGroupElement);
