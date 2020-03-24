import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-input/paper-input.js';
import './center-element'
import './group-manager-element';
/**
 * @customElement
 * @polymer
 */
class EncryptedGroupsApp extends PolymerElement {
  static get template() {
    return html`
      <style>
      #user-input {
        margin-left: 16px;
        width: 50%;
        --primary-text-color: #01579B;
        margin-bottom: 16px;
    }
        .flex-horizontal-with-ratios {
          @apply --layout-horizontal;
        }
        .flexchild {
          @apply --layout-flex;
        }
        .flex2child {
          @apply --layout-flex-2;
        }
      </style>
      <div class="container flex-horizontal-with-ratios">
        <div class="flexchild">
          <paper-input id="user-input" value="{{user}}" label="Current User" always-float-label required auto-validate error-message="User field cannot be empty!"></paper-input>
          <group-manager-element></group-manager-element>
        </div>
        <div class="flex2child">
          <center-element current-user="[[user]]"></center-element>
        </div>
      </div>
    `;
  }
  static get properties() {
    return {
      user: {
        type: String,
        value: 'sam',
      }
    };
  }
}

window.customElements.define('encrypted-groups-app', EncryptedGroupsApp);
