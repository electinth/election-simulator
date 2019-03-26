import React from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga';
import {
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LineShareButton,
  LineIcon,
} from 'react-share';
import Simulation from '../models/Simulation';

const propTypes = {
  simulation: PropTypes.instanceOf(Simulation).isRequired,
  size: PropTypes.number,
};
const defaultProps = {
  size: 32,
};

const ICON_BG_STYLE = { fill: 'rgba(255,255,255,0.4)' };

function shareFB(title) {
  // eslint-disable-next-line no-undef
  FB.ui(
    {
      hashtag: '#electinth',
      href: window.location.toString(),
      method: 'share',
      quote: title,
    },
    function handleResponse() {},
  );
}

function SocialSharing({ size, simulation }) {
  const formula = simulation.toFormula();
  const title = `ทำนายผลเลือกตั้ง 2562: ${formula}`;
  const url = window.location.toString();

  return (
    <React.Fragment>
      <a
        href="#"
        className="SocialMediaShareButton"
        onClick={e => {
          e.preventDefault();
          shareFB(title);
          ReactGA.event({
            category: 'Share',
            action: 'Facebook',
            label: formula,
          });
        }}
      >
        <FacebookIcon size={size} round iconBgStyle={ICON_BG_STYLE} />
      </a>
      <TwitterShareButton title={title} url={url} hashtags={['electinth']}>
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            ReactGA.event({
              action: 'Twitter',
              category: 'Share',
              label: formula,
            });
          }}
        >
          <TwitterIcon size={size} round iconBgStyle={ICON_BG_STYLE} />
        </a>
      </TwitterShareButton>
      <LineShareButton title={title} url={url}>
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            ReactGA.event({
              action: 'Line',
              category: 'Share',
              label: formula,
            });
          }}
        >
          <LineIcon size={size} round iconBgStyle={ICON_BG_STYLE} />
        </a>
      </LineShareButton>
    </React.Fragment>
  );
}

SocialSharing.propTypes = propTypes;
SocialSharing.defaultProps = defaultProps;

export default SocialSharing;
