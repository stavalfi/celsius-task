import React, { useState } from 'react'

type State = {
  longUrl: string
  shortUrl: string
  shortUrlNotFoundError: boolean
}

export function Ui() {
  const [{ longUrl, shortUrl, shortUrlNotFoundError }, setState] = useState<State>({
    longUrl: '',
    shortUrl: '',
    shortUrlNotFoundError: false,
  })
  return (
    <div className="center">
      <span>Url Shorter</span>
      <div>
        <div>
          <input
            type="text"
            style={{ width: '50%' }}
            placeholder="Enter a long url"
            value={longUrl}
            onChange={event => setState({ longUrl: event.target.value, shortUrl: '', shortUrlNotFoundError: false })}
          />
          <button
            onClick={async () => {
              const shortUrlResponse = await fetch('http://localhost:8080/encode', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ longUrl }),
              }).then(r => r.json())

              setState({ longUrl, shortUrl: shortUrlResponse.shortUrl, shortUrlNotFoundError: false })
            }}
          >
            Shorten
          </button>
        </div>
        <div>
          <input
            type="text"
            style={{ width: '50%' }}
            placeholder="Enter a short url"
            value={shortUrl}
            onChange={event => setState({ longUrl: '', shortUrl: event.target.value, shortUrlNotFoundError: false })}
          />
          <button
            onClick={async () => {
              try {
                const longUrlResponse = await fetch('http://localhost:8080/decode', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ shortUrl }),
                }).then(r => r.json())
                setState({ longUrl: longUrlResponse.longUrl, shortUrl, shortUrlNotFoundError: false })
              } catch (error) {
                setState({ longUrl: '', shortUrl, shortUrlNotFoundError: true })
              }
            }}
          >
            Expand
          </button>
        </div>
        {shortUrlNotFoundError && <div>Short url not found</div>}
      </div>
    </div>
  )
}
