/**
 * This module exports mapping function to map from e.g. Database Instances
 * to Transport Objects (TOs) to hide database implementation details, ensure
 * only the required information is exposed, and calculate potential
 * additional values.
 */

/* @see http://momentjs.com */
const moment = require('moment');

/**
 * Maps a instance of the Person database model to a Person transport object
 */
function toPersonTO (personInstance) {
  return {
    name: personInstance.name,
    email: personInstance.email,
  };
}

/**
 * Maps a instance of the Author database model to a Author transport object
 */
function toAuthorTO (authorInstance) {
  return toPersonTO(authorInstance.person);
}

/**
 * Maps a instance of the Paper database model to a Paper transport object
 */
function toKeywordTO (keywordInstance) {
  return keywordInstance.keyword;
}

/**
 * Maps a instance of the Paper database model to a Paper transport object
 */
function toPaperTO (paperInstance) {
  return {
    id: paperInstance.id,
    title: paperInstance.titel,
    authors: (paperInstance.authors.sort((a, b) => { return a.number - b.number; }) || [ ])
      .map(toAuthorTO),
    keywords: (paperInstance.keywords || []).map(toKeywordTO),
    abstract: paperInstance.abstract,
    link: paperInstance.link,
    tag: paperInstance.tag,
  };
}


/**
 * Maps a instance of the Event database model to a Event transport object
 */
function toEventTO (eventInstance) {
  // Duration comes in the format HH:mm:ss
  const DURATION_NUM_BLOCK_COUNT = 3;
  const durationArr = eventInstance.duration.match(/[^:]+/g).map(d => parseInt(d, 10));
  if (durationArr.length !== DURATION_NUM_BLOCK_COUNT) {
    throw new Error('Invalid duration format in event instance');
  }
  const duration = (durationArr[0] * 60) + durationArr[1];

  const startTime = eventInstance.startTime ?
    moment(eventInstance.startTime).tz('Europe/Berlin') :
    null;

  return {
    id: eventInstance.id,
    title: ((eventInstance.paper && eventInstance.paper.title) ||
      eventInstance.alias ||
      '<untitled event>'),
    paper: eventInstance.paper ? toPaperTO(eventInstance.paper) : null,
    roomName: eventInstance.roomName,
    startTime: startTime ? startTime.format() : null,
    endTime: startTime ? startTime.add(duration, 'minutes').format() : null,
    duration: duration,
    maxSize: eventInstance.maxSize,
    kind: eventInstance.kind,
    favored: Boolean(eventInstance.favorites && eventInstance.favorites.length),
  };
}

module.exports = {
  toPaperTO: toPaperTO,
  toEventTO: toEventTO,
};
