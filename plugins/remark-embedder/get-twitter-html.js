const {URL} = require('url')
// eslint-disable-next-line
const fetch = require('node-fetch')

function shouldTransform(string) {
  return getUrl(string) !== null
}

function getUrl(string) {
  if (!string.includes('twitter')) {
    return null
  }
  if (!string.startsWith('http')) {
    string = `https://${string}`
  }
  let url
  try {
    url = new URL(string)
  } catch (error) {
    return null
  }
  if (!url.host.endsWith('twitter.com') || !url.pathname.includes('/status/')) {
    return null
  }
  return url
}

const script =
  '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'

function getTwitterHtml(string) {
  return fetch(`https://publish.twitter.com/oembed?url=${string}`)
    .then(r => r.json())
    .then(r => {
      return [r.html]
        .map(s => s.replace(script, ''))
        .map(s => s.replace(/\?ref_src=twsrc.*?fw/g, ''))
        .map(s => s.replace(/<br>/g, '<br />'))
        .join('')
        .trim()
    })
}

module.exports = getTwitterHtml
module.exports.shouldTransform = shouldTransform