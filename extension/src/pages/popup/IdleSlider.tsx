const STOPS = [1, 5, 10, 15]

interface IdleSliderProps {
  minutes: number
  onChange: (minutes: number) => void
}

export function IdleSlider({ minutes, onChange }: IdleSliderProps) {
  return (
    <div className="idle-presets">
      {STOPS.map((stop) => (
        <button
          key={stop}
          onClick={() => onChange(stop)}
          className={`idle-preset-chip ${minutes === stop ? 'idle-preset-chip-active' : ''}`}
        >
          {stop} min
        </button>
      ))}
    </div>
  )
}