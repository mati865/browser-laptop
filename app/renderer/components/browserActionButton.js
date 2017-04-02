/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require('react')
const ImmutableComponent = require('../../../js/components/immutableComponent')
const electron = require('electron')
const ipc = electron.ipcRenderer
const Button = require('../../../js/components/button')
const cx = require('../../../js/lib/classSet')
const extensionState = require('../../common/state/extensionState')
const windowActions = require('../../../js/actions/windowActions')

class BrowserActionButton extends ImmutableComponent {
  constructor () {
    super()
    this.onClick = this.onClick.bind(this)
  }

  onClick (e) {
    if (/^chrome-extension/.test(this.props.popupWindowSrc)) {
      windowActions.setPopupWindowDetail()
      return
    }
    let centerX
    let centerY
    if (!e.nativeEvent.x || !e.nativeEvent.y) {
      // Handles case where user focuses button, and presses Enter
      let { top: offsetTop, left: offsetLeft } = e.target.getBoundingClientRect()
      centerX = offsetLeft + e.target.offsetWidth * 0.5
      centerY = offsetTop + e.target.offsetHeight * 0.5
    }
    let props = {
      x: e.nativeEvent.x || centerX,
      y: e.nativeEvent.y || centerY,
      screenX: e.nativeEvent.screenX,
      screenY: e.nativeEvent.screenY,
      offsetX: e.nativeEvent.offsetX,
      offsetY: e.nativeEvent.offsetY
    }
    ipc.send('chrome-browser-action-clicked', this.props.extensionId, this.props.tabId, this.props.browserAction.get('title'), props)
  }

  render () {
    // TODO(bridiver) should have some visual notification of hover/press
    return <Button iconClass='extensionBrowserAction'
      className={cx({
        extensionButton: true
      })}
      inlineStyles={{
        backgroundImage: extensionState.browserActionBackgroundImage(this.props.browserAction, this.props.tabId),
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
      dataButtonValue={this.props.extensionId}
      onClick={this.onClick} />
  }
}

module.exports = BrowserActionButton
