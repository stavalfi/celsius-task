import React, { useState } from 'react'

type State = {
  longUrl: string
  shortUrl: string
}

export function Ui() {
  const [{ longUrl, shortUrl }, setState] = useState<State>({ longUrl: '', shortUrl: '' })
  return (
    <div>
      <span>Url Shorter</span>
      <div>
        <div>
          <input
            type="text"
            placeholder="Enter a long url"
            value={longUrl}
            onChange={event => setState({ longUrl: event.target.value, shortUrl: '' })}
          />
          <button
            onClick={async () => {
              const shortUrlResponse = await fetch('http://localhost:8080/encode', {
                method: 'POST',
                body: JSON.stringify({ longUrl }),
              }).then(r => r.json())

              setState({ longUrl, shortUrl: shortUrlResponse.shortUrl })
            }}
          >
            Shorten
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter a short url"
            value={shortUrl}
            onChange={event => setState({ longUrl: '', shortUrl: event.target.value })}
          />
          <button
            onClick={async () => {
              const longUrlResponse = await fetch(`http://localhost:8080/decode/${shortUrl}`).then(async r => {
                return r.json()
              })
              setState({ longUrl: longUrlResponse.longUrl, shortUrl })
            }}
          >
            Expand
          </button>
        </div>
      </div>
    </div>
  )
}
