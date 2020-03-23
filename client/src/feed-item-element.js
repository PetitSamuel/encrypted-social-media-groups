import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';

/**
 * @customElement
 * @polymer
 */
class FeedItemElement extends PolymerElement {
  static get template() {
    return html`
    <style>
    .flex {
        @apply --layout-horizontal;
        margin-bottom: 8px;
    }
    #post-group {
        margin-left: 24px;
    }
    .feed-item-container {
        width: 35%;
        
    }
    .single-item-container {
        padding: 8px 8px 8px 8px;
        border-radius: 5px;
        border: 1px solid #BDBDBD;
        margin-bottom: 8px;
    }
    </style>
    <div class="feed-item-container">
        <dom-repeat items="{{posts}}">
        <template>
            <div class="single-item-container">
            <div class="container flex">
            <div id="post-author" >
                @[[item.author]]
            </div>
            <div id="post-group" >
                [[item.group]]
            </div>
            </div>
            <div id="post-text">
                [[item.post]]
            </div>
            </div>
        </template>
        </dom-repeat>
    </div>
    `;
  }
  static get properties() {
    return {
      posts: {
        type: Array,
      },
    };
  }
}

window.customElements.define('feed-item-element', FeedItemElement);
