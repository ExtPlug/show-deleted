define(function (require, exports, module) {

  const Plugin = require('extplug/Plugin')
  const ChatView = require('plug/views/rooms/chat/ChatView')
  const PopoutChatView = require('plug/views/rooms/popout/PopoutChatView')
  const Events = require('plug/core/Events')
  const { around } = require('meld')

  const ShowDeleted = Plugin.extend({
    name: 'Show Deleted Messages',
    description: 'Keeps showing deleted chat messages.',

    style: {
      // default deleted message styles. can be changed in room styles
      // by room hosts.
      '.cm.extplug-deleted': {
        'opacity': '0.5'
      }
    },

    enable() {
      let advice = function (joinpoint) {
        let [ cid ] = joinpoint.args
        // if the last received message is being deleted, make sure new
        // messages don't collapse into its <div>
        if (this.lastText && this.lastText.hasClass(`cid-${cid}`)) {
          this.lastID = this.lastType = this.lastText = this.lastTime = null
        }

        let message = this.$(`.cid-${cid}`).closest('.cm')
        if (!message.hasClass('extplug-deleted')) {
          message.addClass('extplug-deleted')
          message.find('.timestamp').prepend('[Deleted] ')
        }
      }

      this.replaceEvents(() => {
        this.mainAdvice = around(ChatView.prototype, 'onDelete', advice)
        this.popAdvice = around(PopoutChatView.prototype, 'onDelete', advice)
      })
    },

    disable() {
      this.replaceEvents(() => {
        this.mainAdvice.remove()
        this.popAdvice.remove()
      })
      this._super()
    },

    // safely replace the onDelete method, keeping the event handler around
    replaceEvents(cb) {
      let chatView = this.ext.appView.room.chat
      if (chatView) Events.off('chat:delete', chatView.onDelete)
      cb()
      if (chatView) Events.on('chat:delete', chatView.onDelete, chatView)
    }

  })

  module.exports = ShowDeleted

})
