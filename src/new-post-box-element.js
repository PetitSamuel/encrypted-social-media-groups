import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';

/**
 * @customElement
 * @polymer
 */
class NewtPostInputElement extends PolymerElement {
  static get template() {
    return html`
      <style>
      #new-post-text {
        width: 35%;
        margin-bottom: 8px;
        border: 1px solid #BDBDBD;
        border-radius: 5px;
      };
      #group-input {
        width: 35%;
        margin-bottom: 8px;
      }
      #new-post-button {
        margin-bottom: 40px;
      }
      </style>
      <iron-autogrow-textarea rows="4" id="new-post-text" placeholder="New Post" value="{{post}}"></iron-autogrow-textarea>
      <paper-input id="group-input" value="{{group}}" label="Group" always-float-label></paper-input>
      <paper-button raised on-click="clickHandler" id="new-post-button">Submit</paper-button>
      <paper-button raised on-click="test">refresh</paper-button>
    `;
  }
  static get properties() {
    return {
      post: {
        type: String,
        value: '',
      },
      group: {
        type: String,
        value: '',
      },
      posts: {
        type: Array,
        notify: true,
      },
      user: {
        type: String
      },
    };
  }

  clickHandler() {
    // for some reason for the dom-repeat to update we need to reset posts
    let tmp = this.posts;
    tmp.push({
      author: this.user,
      post: this.post,
      group: this.group,
    });
    this.posts = [];
    this.posts = tmp;
  }
}

window.customElements.define('new-post-box-element', NewtPostInputElement);
