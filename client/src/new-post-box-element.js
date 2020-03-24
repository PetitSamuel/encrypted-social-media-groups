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
      <paper-input id="group-input" value="{{group}}" label="Group" always-float-label required auto-validate error-message="Group field cannot be empty!"></paper-input>
      <paper-button raised on-click="clickHandler" id="new-post-button"><paper-spinner id="postingPost"></paper-spinner>Submit</paper-button>
      <paper-button raised on-click="loadPostsFromServer"><paper-spinner id="loadingFeed"></paper-spinner>Refresh</paper-button>
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
        value: 'test',
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
  async loadPostsFromServer() {
    this.toggleFeedLoading();
    this.posts = [];

    let res = await fetch(`http://localhost:5000/api/post/${this.group}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (res.status !== 200) {
      this.toggleFeedLoading();
      alert("An error occured: " + JSON.stringify(res));
      return;
    }

    let data = await res.json();
    this.toggleFeedLoading();
    this.posts = responseToPostArray(data);
  }

  // new post to local var
  updateLocalVariables() {
    if(!this.user) {
      alert("user field cannot be empty.");
      return false;
    }
    if(!this.post) {
      alert("post field cannot be empty.");
      return false;
    }
    if(!this.group) {
      alert("group field cannot be empty.");
      return false;
    }

    let tmp = this.posts;
    tmp.push({
      author: this.user,
      post: this.post,
      group: this.group,
    });

    // trick to force dom-repeat to re render
    this.posts = [];
    this.posts = tmp;

    return true;
  }

  async clickHandler() {
    this.togglePostingLoading();
    let status = this.updateLocalVariables();

    // not all fields are populated
    if(status === false) {
      this.togglePostingLoading();
      return;
    }

    // post to backend if full
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
      this.togglePostingLoading();
      alert("An error occured: status" + response.status);
      return;
    }
    let data = await response.json();
    this.togglePostingLoading();
  }

  toggleFeedLoading() {
    let spinner = this.$.loadingFeed;
    spinner.active = !spinner.active;
  }
  togglePostingLoading() {
    let spinner = this.$.postingPost;
    spinner.active = !spinner.active;
  }
}

window.customElements.define('new-post-box-element', NewtPostInputElement);
