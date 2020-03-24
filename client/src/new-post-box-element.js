import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';
import { responseToPostArray } from './helper/jsonToItem';
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
        
      };
      #group-input {
        width: 35%;
        margin-bottom: 8px;
      }
      #new-post-button {
        margin-bottom: 40px;
      }
      </style>
      <paper-textarea label="New Post" id="new-post-text" value="{{post}}" always-float-label max-rows="4" required auto-validate error-message="Post cannot be empty!"></paper-textarea>
      <paper-input id="group-input" value="{{group}}" label="Group" always-float-label></paper-input>
      <paper-button raised on-click="clickHandler" id="new-post-button">Submit</paper-button>
      <paper-button raised on-click="loadPostsFromServer">refresh</paper-button>
    `;
  }
  ready() {
    super.ready();
    this.loadPostsFromServer();
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
      isLoadingPosts: {
        type: Boolean,
        value: false,
      }
    };
  }
  async loadPostsFromServer() {
    let arr = [];
    let res = await fetch('http://localhost:5000/api/post', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (res.status !== 200) {
      console.log(res);
      // Do something there if a error response came from the server
    }
    let data = await res.json();
    console.log(data);
    console.log(data);
    arr = responseToPostArray(data);
    this.posts = arr;
  }
  async clickHandler() {
    // for some reason for the dom-repeat to update we need to reset posts
    let tmp = this.posts;
    tmp.push({
      author: this.user,
      post: this.post,
      group: this.group,
    });
    this.posts = [];
    this.posts = tmp;

    let response = await fetch('http://localhost:5000/api/post', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: this.user,
        group: this.group,
        text: this.post,
      })
    });
    if (response.status !== 200) {
      console.log(response);
      return;
      // Do something there if a error response came from the server
    }
    let data = await response.json();
    console.log(data);
  }


}

window.customElements.define('new-post-box-element', NewtPostInputElement);
