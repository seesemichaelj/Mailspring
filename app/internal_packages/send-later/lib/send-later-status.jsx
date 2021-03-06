import React, {Component} from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {DateUtils, Actions, SyncbackMetadataTask} from 'nylas-exports'
import {RetinaImg} from 'nylas-component-kit'
import {PLUGIN_ID} from './send-later-constants'

const {DATE_FORMAT_SHORT} = DateUtils


export default class SendLaterStatus extends Component {
  static displayName = 'SendLaterStatus';

  static propTypes = {
    draft: PropTypes.object,
  };

  onCancelSendLater = () => {
    Actions.queueTask(new SyncbackMetadataTask({
      model: this.props.draft,
      accountId: this.props.draft.accountId,
      pluginId: PLUGIN_ID,
      value: {expiration: null, cancelled: true},
    }))
  };

  render() {
    const {draft} = this.props
    const metadata = draft.metadataForPluginId(PLUGIN_ID)
    if (metadata && metadata.expiration) {
      const {expiration} = metadata
      const formatted = DateUtils.format(moment(expiration), DATE_FORMAT_SHORT)
      return (
        <div className="send-later-status">
          <span className="time">
            {`Scheduled for ${formatted}`}
          </span>
          <RetinaImg
            name="image-cancel-button.png"
            title="Cancel Send Later"
            onClick={this.onCancelSendLater}
            mode={RetinaImg.Mode.ContentPreserve}
          />
        </div>
      )
    }
    return <span />
  }
}
