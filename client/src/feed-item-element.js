import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/paper-spinner/paper-spinner.js';

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
    #post-time-since {
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
    <div hidden$="{{hide}}">
      <h3>No posts to dislay!</h3>
    </div>
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
            <div id="post-time-since" >
                [[item.timeSince]]
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
      hide: {
        type: Boolean,
        computed: 'shouldHide(posts)'
      },
    };
  }

  shouldHide(posts) {
    if(!posts || posts.length === 0) {
      return false;
    }
    return true;
  }
}

window.customElements.define('feed-item-element', FeedItemElement);
