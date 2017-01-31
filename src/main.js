import Plugin from 'extplug/Plugin'
import ChatView from 'plug/views/rooms/chat/ChatView'
import PopoutChatView from 'plug/views/rooms/popout/PopoutChatView'
import Events from 'plug/core/Events'
import { around } from 'meld'
import style from './style.css'

const ShowDeleted = Plugin.extend({
  name: 'Show Deleted Messages',
  description: 'Keeps showing deleted chat messages.',

  style,

  enable() {
    function advice(joinpoint) {
      const [ cid ] = joinpoint.args
      // if the last received message is being deleted, make sure new
      // messages don't collapse into its <div>
      if (this.lastText && this.lastText.hasClass(`cid-${cid}`)) {
        this.lastID = this.lastType = this.lastText = this.lastTime = null
      }

      const message = this.$(`.cid-${cid}`).closest('.cm')
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
    const chatView = this.ext.appView.room.chat
    if (chatView) Events.off('chat:delete', chatView.onDelete)
    cb()
    if (chatView) Events.on('chat:delete', chatView.onDelete, chatView)
  }
})

export default ShowDeleted
