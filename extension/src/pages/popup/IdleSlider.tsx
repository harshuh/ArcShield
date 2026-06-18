const STOPS = [1, 5, 10, 15, 30]
const THUMB_RADIUS_PX = 8 

interface IdleSliderProps {
  minutes: number
  onChange: (minutes: number) => void
}

export function IdleSlider({ minutes, onChange }: IdleSliderProps) {
  const index = Math.max(0, STOPS.indexOf(minutes))
  const lastIndex = STOPS.length - 1

  return (
    <div className="idle-slider">
      <div className="idle-slider-track-wrap">
        <input
          type="range"
          min={0}
          max={lastIndex}
          step={1}
          value={index}
          onChange={(e) => onChange(STOPS[Number(e.target.value)])}
          className="idle-slider-input"
          aria-label="Idle lock timer"
        />
        <div className="idle-slider-stops" aria-hidden>
          {STOPS.map((stop, i) => {
            const fraction = i / lastIndex
            const left = `calc(${THUMB_RADIUS_PX}px + ${fraction} * (100% - ${THUMB_RADIUS_PX * 2}px))`
            return (
              <span
                key={stop}
                className={`idle-slider-dot ${stop <= minutes ? 'idle-slider-dot-active' : ''}`}
                style={{ left }}
              />
            )
          })}
        </div>
      </div>
      <div className="idle-slider-labels" aria-hidden>
        {STOPS.map((stop) => (
          <span key={stop} className={stop === minutes ? 'idle-slider-label-active' : ''}>
            {stop} min
          </span>
        ))}
      </div>
    </div>
  )
}