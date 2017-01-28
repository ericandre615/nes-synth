import React from 'react';

import '../ui-icons.less';
import './transport.less';

const TransportButtons = React.createClass({
  render() {
    return (
      <div id="transport-buttons">
        <button 
          id="play-button"
          className="transport-button icon-play"
          onClick={ this.props.playHandler }
        />
        <button 
          id="stop-button"
          className="transport-button icon-stop"
          onClick={ this.props.stopHandler }
        />
      </div>
    );
  }
});

export default TransportButtons;
