import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import './new-post-box-element'
import './feed-item-element'
/**
 * @customElement
 * @polymer
 */
class FeedElement extends PolymerElement {
  static get template() {
    return html`
    <style>

    </style>
      <new-post-box-element id="new-post" user="[[currentUser]]" posts="{{posts}}" group="{{newPostGroup}}"></new-post-box-element>
      <feed-item-element posts=[[posts]]></feed-item-element>
    `;
  }
  static get properties() {
    return {
      posts: {
        type: Array,
        notify: true,
      },
      currentUser: {
        type: String,
      }
    };
  }
}

window.customElements.define('center-element', FeedElement);
